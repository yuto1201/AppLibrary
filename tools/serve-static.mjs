import { createServer } from "node:http";
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".webp": "image/webp" };
const inside = (root, file) => file === root || file.startsWith(`${root}${path.sep}`);

export async function createStaticServer(directory) {
  const root = await realpath(directory);
  await stat(path.join(root, "index.html"));
  return createServer(async (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    try {
      const pathname = decodeURIComponent((request.url ?? "/").split("?")[0]);
      if (!pathname.startsWith("/") || pathname.includes("\\") || pathname.includes("\0") || pathname.split("/").includes("..")) {
        response.writeHead(400).end(); return;
      }
      let file = path.resolve(root, `.${pathname}`);
      if (!inside(root, file)) { response.writeHead(403).end(); return; }
      if ((await stat(file)).isDirectory()) file = path.join(file, "index.html");
      file = await realpath(file);
      if (!inside(root, file)) { response.writeHead(403).end(); return; }
      const content = await readFile(file);
      response.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream", "Content-Length": content.length });
      response.end(request.method === "HEAD" ? undefined : content);
    } catch (error) {
      if (error instanceof URIError) { response.writeHead(400).end(); return; }
      const content = await readFile(path.join(root, "404.html")).catch(() => Buffer.from("Not Found"));
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(request.method === "HEAD" ? undefined : content);
    }
  });
}

if (path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  try {
    const port = Number(process.env.PORT ?? 3210);
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
    const server = await createStaticServer(path.resolve("out"));
    server.once("error", (error) => { console.error(error.message); process.exitCode = 1; });
    server.listen(port, "127.0.0.1", () => process.stdout.write(`Static export: http://127.0.0.1:${port}\n`));
    for (const signal of ["SIGTERM", "SIGINT"]) process.once(signal, () => server.close());
  } catch (error) {
    console.error(`Cannot serve out/. Run npm run build first. ${error.message}`);
    process.exitCode = 1;
  }
}
