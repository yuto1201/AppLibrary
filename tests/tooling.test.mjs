// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, mkdir, readFile, rm, writeFile, cp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { findBrokenMarkdownLinks } from "../tools/verify-links.mjs";
import { generateAgents } from "../tools/generate-agent-wrappers.mjs";
import { verifyAcceptance } from "../tools/verify-acceptance-trace.mjs";
import { checkRepository, validateCheckNames, validateRuleset, validateRuntime } from "../tools/repository-policy.mjs";
import { workflowSchema } from "../tools/project-config.mjs";

const roots = [];
const rulesetUrl = new URL("../config/github-ruleset.json", import.meta.url);
const rulesetMessage = "GitHub ruleset must require squash pull requests and resolved review threads";
const statusMessage = "GitHub ruleset required checks disagree with workflow configuration";
const shapeMessage = "GitHub ruleset export must retain its normalized key structure";
async function fixture() { const root = await mkdtemp(path.join(os.tmpdir(), "applibrary-policy-")); roots.push(root); return root; }
async function loadRuleset() { return JSON.parse(await readFile(rulesetUrl, "utf8")); }
afterEach(async () => { await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))); });

describe("development checks", () => {
  it("pins local verification without pinning Vercel to an unavailable patch", () => {
    const pkg = { packageManager: "npm@11.6.2", engines: { node: "24.x", npm: "11.x" } };
    expect(validateRuntime(pkg, "24.13.0", "24.13.0", "npm/11.6.2 node/v24.13.0")).toEqual([]);
    expect(validateRuntime(pkg, "24.13.0", "24.14.0", "npm/11.6.2")).toHaveLength(1);
    expect(validateRuntime(pkg, "24.13.0", "24.13.0", "npm/11.12.1")).toHaveLength(1);
    expect(validateRuntime({ ...pkg, engines: { node: "24.13.0", npm: "11.x" } }, "24.13.0", "24.13.0", "npm/11.6.2")).toContain("Hosted runtime ranges disagree with local pins");
  });
  it("detects a renamed or missing required CI check", () => {
    expect(validateCheckNames({ requiredChecks: ["Browser checks"] }, "jobs:\n  browser:\n    name: Browser checks\n")).toEqual([]);
    expect(validateCheckNames({ requiredChecks: ["Browser checks"] }, "jobs:\n  browser:\n    name: Renamed\n")).toEqual(["Required check has no CI job: Browser checks"]);
  });
  it("keeps the exported ruleset aligned with required GitHub Actions checks regardless of order", async () => {
    const ruleset = await loadRuleset();
    const workflow = { requiredChecks: ["Repository checks", "Browser checks"] };
    expect(validateRuleset(workflow, ruleset)).toEqual([]);
    ruleset.rules.find((rule) => rule.type === "required_status_checks").parameters.required_status_checks.reverse();
    ruleset.rules.reverse();
    expect(validateRuleset(workflow, ruleset)).toEqual([]);
  });
  it.each([
    ["inactive enforcement", (ruleset) => { ruleset.enforcement = "evaluate"; }, "GitHub ruleset must actively protect only the default branch without bypass actors"],
    ["a bypass actor", (ruleset) => { ruleset.bypass_actors.push({ actor_id: 1 }); }, "GitHub ruleset must actively protect only the default branch without bypass actors"],
    ["a renamed check", (ruleset) => { ruleset.rules.find((rule) => rule.type === "required_status_checks").parameters.required_status_checks[1].context = "Renamed"; }, statusMessage],
    ["a different check provider", (ruleset) => { ruleset.rules.find((rule) => rule.type === "required_status_checks").parameters.required_status_checks[1].integration_id = 1; }, statusMessage],
    ["a string check provider", (ruleset) => { ruleset.rules.find((rule) => rule.type === "required_status_checks").parameters.required_status_checks[1].integration_id = "15368"; }, statusMessage],
    ["non-strict checks", (ruleset) => { ruleset.rules.find((rule) => rule.type === "required_status_checks").parameters.strict_required_status_checks_policy = false; }, statusMessage],
    ["checks ignored on create", (ruleset) => { ruleset.rules.find((rule) => rule.type === "required_status_checks").parameters.do_not_enforce_on_create = true; }, statusMessage],
    ["merge commits allowed", (ruleset) => { ruleset.rules.find((rule) => rule.type === "pull_request").parameters.allowed_merge_methods.push("merge"); }, rulesetMessage],
    ["unattributed changes without extra approval", (ruleset) => { ruleset.rules.find((rule) => rule.type === "pull_request").parameters.require_extra_approval_for_unattributed_changes = false; }, rulesetMessage],
    ["an unexpected required reviewer", (ruleset) => { ruleset.rules.find((rule) => rule.type === "pull_request").parameters.required_reviewers.push({ file_patterns: ["**/*"] }); }, rulesetMessage],
    ["unresolved review threads", (ruleset) => { ruleset.rules.find((rule) => rule.type === "pull_request").parameters.required_review_thread_resolution = false; }, rulesetMessage],
    ["a missing deletion rule", (ruleset) => { ruleset.rules = ruleset.rules.filter((rule) => rule.type !== "deletion"); }, "GitHub ruleset must contain each expected rule exactly once and no unexpected rules"],
    ["an unexpected rule", (ruleset) => { ruleset.rules.push({ type: "required_signatures" }); }, "GitHub ruleset must contain each expected rule exactly once and no unexpected rules"],
    ["a duplicate rule", (ruleset) => { ruleset.rules.push(structuredClone(ruleset.rules[0])); }, "GitHub ruleset must contain each expected rule exactly once and no unexpected rules"],
    ["an unexpected parameter", (ruleset) => { ruleset.rules.find((rule) => rule.type === "pull_request").parameters.unexpected = true; }, shapeMessage],
    ["an unexpected top-level key", (ruleset) => { ruleset.id = 1; }, shapeMessage],
  ])("rejects ruleset drift with %s", async (_label, mutate, message) => {
    const ruleset = await loadRuleset();
    mutate(ruleset);
    expect(validateRuleset({ requiredChecks: ["Repository checks", "Browser checks"] }, ruleset)).toContain(message);
  });
  it("rejects duplicate required workflow checks", () => {
    const workflow = {
      schemaVersion: 1, baseBranch: "main", branchPrefixes: ["codex"], highRiskPaths: ["tools/"],
      review: { normal: "independent-opposite-family", high: ["openai", "anthropic"], bindToHead: true, enforcement: "owner-reviewed" },
      requiredChecks: ["Repository checks", "Repository checks"],
    };
    expect(() => workflowSchema.parse(workflow)).toThrow("Duplicate required check");
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
