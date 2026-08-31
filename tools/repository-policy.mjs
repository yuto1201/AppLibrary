import { readFile, stat, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { projectSchema, workflowSchema, readJson } from "./project-config.mjs";

const requiredFiles = [
  "README.md", "AGENTS.md", "CLAUDE.md", ".npmrc", ".gitattributes",
  "specs/README.md", "specs/product.md", "specs/acceptance.md",
  "docs/workflow.md", "docs/verification.md", "docs/deploy/README.md",
  "config/acceptance.json", ".github/ISSUE_TEMPLATE/change.yml",
  ".github/pull_request_template.md", ".github/workflows/ci.yml",
  "tests/e2e/site.spec.ts",
];

export async function checkRepository(root) {
  const errors = [];
  for (const file of requiredFiles) {
    if (!(await stat(path.join(root, file)).catch(() => null))?.isFile()) errors.push(`Missing ${file}`);
  }
  for (const file of ["README.md", "AGENTS.md", "CLAUDE.md"]) {
    const text = await readFile(path.join(root, file), "utf8").catch(() => "");
    if (text.trimEnd().split("\n").length > 200) errors.push(`${file} must stay within 200 lines`);
  }
  try {
    projectSchema.parse(await readJson(root, "config/project.json"));
    const workflow = workflowSchema.parse(await readJson(root, "config/workflow.json"));
    errors.push(...validateCheckNames(workflow, await readFile(path.join(root, ".github/workflows/ci.yml"), "utf8")));
    const pkg = await readJson(root, "package.json");
    const lock = await readJson(root, "package-lock.json");
    const version = (await readFile(path.join(root, ".node-version"), "utf8")).trim();
    errors.push(...validateRuntime(pkg, version));
    if (lock.packages?.[""]?.engines?.node !== pkg.engines?.node || lock.packages?.[""]?.engines?.npm !== pkg.engines?.npm) errors.push("Lockfile runtime ranges disagree");
    for (const [name, value] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
      if (!/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/u.test(value)) errors.push(`Unpinned dependency: ${name}`);
      if (name.startsWith("@supabase/") || name === "supabase") errors.push(`Static site must not depend on ${name}`);
    }
    if (pkg.dependencies.next !== pkg.devDependencies["eslint-config-next"]) errors.push("Next and eslint-config-next versions disagree");
    const npmrc = await readFile(path.join(root, ".npmrc"), "utf8");
    if (!/^engine-strict=true$/mu.test(npmrc) || !/^save-exact=true$/mu.test(npmrc)) errors.push("npm must enforce runtime and exact versions");
    const next = (await import(pathToFileURL(path.join(root, "next.config.mjs")).href)).default;
    if (next.output !== "export" || next.trailingSlash !== true || next.images?.unoptimized !== true || next.basePath) errors.push("Next must retain root-only static export");
    const files = await readdir(root);
    for (const obsolete of ["assets", "apps", "index.html", "_headers", ".nojekyll", "wrangler.toml", "wrangler.jsonc", "supabase"]) {
      if (files.includes(obsolete)) errors.push(`Obsolete/unsupported root path: ${obsolete}`);
    }
  } catch (error) {
    errors.push(error.message);
  }
  return errors;
}

export function validateCheckNames(workflow, yaml) {
  const jobs = [...yaml.matchAll(/^    name: ([^\r\n]+)$/gmu)].map((match) => match[1].trim());
  return workflow.requiredChecks.filter((name) => !jobs.includes(name)).map((name) => `Required check has no CI job: ${name}`);
}

// Local verification is exact; Vercel's build uses the compatible engines ranges.
export function validateRuntime(pkg, nodePin, actualNode = process.versions.node, npmAgent = process.env.npm_config_user_agent) {
  const errors = [];
  const npmPin = /^npm@(\d+\.\d+\.\d+)$/u.exec(pkg.packageManager ?? "")?.[1];
  if (!/^\d+\.\d+\.\d+$/u.test(nodePin) || !npmPin) return ["Exact local Node/npm pins are required"];
  if (pkg.engines?.node !== `${nodePin.split(".")[0]}.x` || pkg.engines?.npm !== `${npmPin.split(".")[0]}.x`) errors.push("Hosted runtime ranges disagree with local pins");
  if (actualNode !== nodePin) errors.push(`Local checks require Node ${nodePin}; received ${actualNode}`);
  if (npmAgent && /^npm\/([^\s]+)/u.exec(npmAgent)?.[1] !== npmPin) errors.push(`Local checks require npm ${npmPin}`);
  return errors;
}

if (path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  const errors = await checkRepository(process.cwd());
  if (errors.length) { errors.forEach((error) => console.error(error)); process.exitCode = 1; }
  else process.stdout.write("Repository policy passed\n");
}
