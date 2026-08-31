// @vitest-environment node
import { afterEach, expect, it } from "vitest";
import { mkdtemp, mkdir, writeFile, rm, symlink } from "node:fs/promises";
import { request } from "node:http";
import os from "node:os";
import path from "node:path";
import { createStaticServer } from "../tools/serve-static.mjs";

const roots = [];
const servers = [];
afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise((resolve) => { server.closeAllConnections(); server.close(resolve); })));
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function fixture(escaped404 = false) {
  const root = await mkdtemp(path.join(os.tmpdir(), "applibrary-server-")); roots.push(root);
  const out = path.join(root, "out");
  await mkdir(path.join(out, "apps/demo"), { recursive: true });
  await writeFile(path.join(out, "index.html"), "<h1>Home</h1>");
  await writeFile(path.join(out, "apps/demo/index.html"), "<h1>Demo</h1>");
  if (escaped404) await symlink(path.join(root, "private.txt"), path.join(out, "404.html"));
  else await writeFile(path.join(out, "404.html"), "Missing page");
  await writeFile(path.join(root, "private.txt"), "outside-export");
  await symlink(path.join(root, "private.txt"), path.join(out, "escaped.txt"));
  const server = await createStaticServer(out); servers.push(server);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return `http://127.0.0.1:${server.address().port}`;
}

it("serves exported routes and real 404s without SPA fallback", async () => {
  const url = await fixture();
  const response = await fetch(`${url}/apps/demo/`);
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toContain("text/html");
  expect(await response.text()).toContain("Demo");
  const missing = await fetch(`${url}/does-not-exist/`);
  expect(missing.status).toBe(404);
  expect(await missing.text()).toBe("Missing page");
  const head = await fetch(url, { method: "HEAD" });
  expect(head.status).toBe(200);
  expect(await head.text()).toBe("");
  expect((await fetch(url, { method: "POST" })).status).toBe(405);
});

it("refuses encoded traversal, malformed URLs and symlinks outside out", async () => {
  const url = await fixture();
  expect((await fetch(`${url}/escaped.txt`)).status).toBe(403);
  expect((await fetch(`${url}/%ZZ`)).status).toBe(400);
  const response = await new Promise((resolve, reject) => {
    request(url, { path: "/%2e%2e/private.txt" }, (res) => { res.resume(); resolve(res.statusCode); }).on("error", reject).end();
  });
  expect(response).toBe(400);
});

it("refuses startup before a build exists", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "applibrary-unbuilt-")); roots.push(root);
  await expect(createStaticServer(root)).rejects.toThrow();
});

it("does not read an external symlink when generating a 404 response", async () => {
  const url = await fixture(true);
  const response = await fetch(`${url}/does-not-exist`);
  expect(response.status).toBe(404);
  expect(await response.text()).toBe("Not Found");
});
