import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function resolveOgpPython(root = process.cwd()) {
  const isolated = path.join(root, ".venv-ogp", "bin", "python");
  if (!existsSync(isolated)) {
    throw new Error(
      "Missing .venv-ogp/bin/python. Run the OGP virtual-environment setup documented in README.md before npm checks.",
    );
  }
  return isolated;
}

if (path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  const root = process.cwd();
  try {
    const result = spawnSync(
      resolveOgpPython(root),
      [path.join(root, "tools", "generate-ogp.py"), ...process.argv.slice(2)],
      { cwd: root, stdio: "inherit" },
    );
    if (result.error) {
      console.error(`Unable to run the OGP generator: ${result.error.message}`);
      process.exitCode = 1;
    } else {
      process.exitCode = result.status ?? 1;
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
