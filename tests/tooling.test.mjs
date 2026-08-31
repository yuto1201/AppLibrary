// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, rm, writeFile, cp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { findBrokenMarkdownLinks } from "../tools/verify-links.mjs";
import { generateAgents } from "../tools/generate-agent-wrappers.mjs";
import { verifyAcceptance } from "../tools/verify-acceptance-trace.mjs";
import { checkRepository, validateCheckNames } from "../tools/repository-policy.mjs";

const roots = [];
async function fixture() { const root = await mkdtemp(path.join(os.tmpdir(), "applibrary-policy-")); roots.push(root); return root; }
afterEach(async () => { await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))); });

describe("development checks", () => {
  it("detects a renamed or missing required CI check", () => {
    expect(validateCheckNames({ requiredChecks: ["Browser checks"] }, "jobs:\n  browser:\n    name: Browser checks\n")).toEqual([]);
    expect(validateCheckNames({ requiredChecks: ["Browser checks"] }, "jobs:\n  browser:\n    name: Renamed\n")).toEqual(["Required check has no CI job: Browser checks"]);
  });
  it("detects missing and escaping links but retains historical documents", async () => {
    const root = await fixture();
    await mkdir(path.join(root, "docs/decisions"), { recursive: true });
    await writeFile(path.join(root, "README.md"), "[missing](missing.md)\n[escape](../outside.md)\n[web](https://example.com)\n[bad](%ZZ)\n");
    await writeFile(path.join(root, "docs/decisions/old.md"), "[old](gone.md)");
    const errors = await findBrokenMarkdownLinks(root);
    expect(errors).toHaveLength(3);
    expect(errors.join("\n")).toContain("escapes");
    expect(errors.join("\n")).toContain("missing.md");
    expect(errors.join("\n")).not.toContain("gone.md");
  });

  it("fails generated drift and repairs it only on explicit generation", async () => {
    const root = await fixture();
    await mkdir(path.join(root, "docs/agent-contracts"), { recursive: true });
    await cp("docs/agent-contracts/change-evaluator.md", path.join(root, "docs/agent-contracts/change-evaluator.md"));
    expect(await generateAgents(root, true)).toHaveLength(2);
    await generateAgents(root);
    expect(await generateAgents(root, true)).toEqual([]);
    const file = path.join(root, ".codex/agents/change-evaluator.toml");
    await writeFile(file, "unsafe drift");
    expect(await generateAgents(root, true)).toHaveLength(1);
    expect(await readFile(file, "utf8")).toBe("unsafe drift");
  });

  it("rejects missing acceptance tests and duplicate IDs", async () => {
    const root = await fixture();
    await mkdir(path.join(root, "config"));
    await mkdir(path.join(root, "specs"));
    const criterion = { id: "AC-1", description: "test", tests: ["tests/missing.test.ts"] };
    await writeFile(path.join(root, "specs/acceptance.md"), "AC-1: example");
    const file = path.join(root, "config/acceptance.json");
    await writeFile(file, JSON.stringify({ schemaVersion: 1, criteria: [criterion] }));
    expect(await verifyAcceptance(root)).toEqual(["AC-1: missing tests/missing.test.ts"]);
    await writeFile(file, JSON.stringify({ schemaVersion: 1, criteria: [criterion, criterion] }));
    await expect(verifyAcceptance(root)).rejects.toThrow("Duplicate acceptance ID");
  });

  it("rejects missing repository contracts", async () => {
    const errors = await checkRepository(await fixture());
    expect(errors).toContain("Missing AGENTS.md");
    expect(errors).toContain("Missing tests/e2e/site.spec.ts");
  });
});
