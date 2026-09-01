# Dependency Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the pinned Node runtime and every outdated direct dependency that is compatible with that runtime, then replace stale Dependabot PRs #7, #8, and #9 with one verified change.

**Architecture:** Keep the existing exact-version policy for local and CI execution. Move the local Node patch to the current 24.20.0 LTS patch while retaining the hosted `24.x` / `11.x` ranges. Remove jsdom and Testing Library because no Vitest test uses DOM APIs; keep Node-only Vitest for repository/data tests and Playwright for real-browser behavior.

**Tech Stack:** Node.js 24.20.0, npm 11.6.2, Next.js 16.3.4, React 19.2.8, TypeScript 6.0.3, ESLint 9.39.5, Vitest 4.1.11, Playwright 1.62.1.

**Spec:** GitHub Issue #12

## Global Constraints

- Preserve exact versions in `package.json` and `package-lock.json`.
- Preserve `engines.node: 24.x`, `engines.npm: 11.x`, and `packageManager: npm@11.6.2` for hosted compatibility.
- Run all verification through `fnm exec --using=24.20.0`.
- Do not change UI, content, routes, or deployment settings.
- Require final-head OpenAI and Anthropic read-only reviews because runtime and dependency manifests are high-risk paths.

---

### Task 1: Update runtime and manifests

**Files:**
- Modify: `.node-version`
- Modify: `AGENTS.md`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `README.md`
- Modify: `docs/deploy/README.md`
- Modify: `docs/verification.md`
- Modify: `tests/tooling.test.mjs`
- Modify: `vitest.config.mjs`
- Delete: `tests/setup.ts`

**Interfaces:**
- Consumes: exact runtime checks in `tools/repository-policy.mjs`
- Produces: a lockfile installable with Node 24.20.0 and npm 11.6.2

- [x] **Step 1: Install the target Node patch locally**

Run: `fnm install 24.20.0`

Expected: `fnm exec --using=24.20.0 node --version` prints `v24.20.0`.

- [x] **Step 2: Update exact runtime documentation**

Set `.node-version` to `24.20.0`. Replace the previous runtime in `README.md`, `docs/verification.md`, and the runtime-policy test fixture. Keep the hosted `24.x` / `11.x` ranges and describe them consistently as minor/patch ranges.

- [x] **Step 3: Install the exact dependency set**

Run:

```bash
fnm exec --using=24.20.0 npm install --save-exact \
  next@16.3.4 zod@4.5.4 \
  --save-dev eslint-config-next@16.3.4 \
  @types/node@26.4.0 @types/react@19.2.18 @types/react-dom@19.2.5 \
  eslint@9.39.5 typescript@6.0.3
```

Expected: `package.json` and `package-lock.json` contain the listed exact versions and npm exits zero. ESLint 10 and TypeScript 7 were tested but intentionally excluded: `eslint-plugin-import@2.32.0`, `eslint-plugin-jsx-a11y@6.10.2`, and `eslint-plugin-react@7.37.5` stop at ESLint 9, while the bundled TypeScript ESLint chain requires TypeScript `<6.1.0`; `npm ls` marks the newer majors invalid.

Remove `jsdom`, `@testing-library/jest-dom`, `@testing-library/react`, and `@testing-library/user-event`. Change Vitest's environment to `node` and delete the now-empty setup file. Playwright remains the browser behavior test layer.

- [x] **Step 4: Verify a clean install**

Regenerate `package-lock.json` from `package.json` in a pristine directory, then run a clean `fnm exec --using=24.20.0 npm ci` and `fnm exec --using=24.20.0 npm ls --all`.

Expected: npm exits zero without engine warnings or missing/invalid dependencies.

### Task 2: Verify behavior and dependency completeness

**Files:**
- Test: `tests/tooling.test.mjs`
- Test: `tests/registry.test.ts`
- Test: `tests/static-server.test.mjs`
- Test: `tests/e2e/site.spec.ts`

**Interfaces:**
- Consumes: the installed dependency graph from Task 1
- Produces: local evidence that policy, types, build, unit tests, static serving, and browser behavior still work

- [x] **Step 1: Run the full repository verification**

Run: `fnm exec --using=24.20.0 npm run verify`

Expected: policy, links, acceptance trace, generated files, lint, typecheck, all Vitest files, static build, and desktop/mobile Playwright tests pass.

- [x] **Step 2: Check for remaining outdated direct dependencies**

Run: `fnm exec --using=24.20.0 npm outdated --json`

Expected: only ESLint 10 and TypeScript 7 are reported. They remain pinned to the newest compatible majors until Next.js's ESLint stack expands its peer ranges.

- [x] **Step 3: Check the patch and worktree**

Run: `git diff --check && git status --short`

Expected: no whitespace errors; only the planned runtime, manifest, documentation, and plan files are modified.

### Task 3: Review and deliver

**Files:**
- Modify: `docs/superpowers/plans/2026-09-01-dependency-refresh.md`

**Interfaces:**
- Consumes: exact final commit SHA and verification output
- Produces: PR evidence tied to that SHA and closure of superseded dependency PRs

- [x] **Step 1: Mark completed plan steps and commit**

Run: `git add .node-version AGENTS.md package.json package-lock.json README.md docs/deploy/README.md docs/verification.md docs/superpowers/plans/2026-09-01-dependency-refresh.md tests/tooling.test.mjs tests/setup.ts vitest.config.mjs && git commit -m "Update runtime and dependencies"`

Expected: one implementation commit on `codex/12-dependency-refresh`.

- [x] **Step 2: Obtain independent final-head reviews**

Run the repository's read-only review process with OpenAI `gpt-5.6-sol` high and Anthropic `claude-opus-5` high against `origin/main...HEAD`.

Expected: all blocker findings are fixed and both final reviews identify the exact final SHA.

- [ ] **Step 3: Push, create, and merge the PR**

Push `codex/12-dependency-refresh`, create a PR that closes Issue #12, wait for `Repository checks`, `Browser checks`, and Vercel, then squash merge with exact-head protection.

Expected: Issue #12 closes and main CI succeeds on the squash commit.

- [ ] **Step 4: Close superseded bot PRs**

Close PR #7, #8, and #9 with a concise note that Issue #12's merged dependency refresh includes their updates at newer or equal versions.

Expected: no open dependency PR remains.
