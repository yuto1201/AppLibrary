import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { acceptanceSchema, readJson } from "./project-config.mjs";

export async function verifyAcceptance(root) {
  const errors = [];
  const { criteria } = acceptanceSchema.parse(await readJson(root, "config/acceptance.json"));
  const spec = await readFile(path.join(root, "specs/acceptance.md"), "utf8");
  for (const criterion of criteria) {
    if (!spec.includes(`${criterion.id}:`)) errors.push(`Missing specification: ${criterion.id}`);
    for (const test of criterion.tests) {
      if (!(await stat(path.join(root, test)).catch(() => null))?.isFile()) errors.push(`${criterion.id}: missing ${test}`);
    }
  }
  return errors;
}

if (path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  const errors = await verifyAcceptance(process.cwd());
  if (errors.length) { errors.forEach((error) => console.error(error)); process.exitCode = 1; }
  else process.stdout.write("Acceptance trace passed (file mapping only)\n");
}
