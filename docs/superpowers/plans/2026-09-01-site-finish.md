# Site Finish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the public-site polish items left after the Next.js/Vercel migration without changing AppLibrary's established visual identity.

**Architecture:** Keep the site fully static. Extend the registry's feature data from strings to structured display content, add static legal routes, expose the existing filter axis labels, use an OGP asset composed from this repository's app icons, and replace unsafe immutable caching for fixed-name app pages/assets with revalidation.

**Tech Stack:** Next.js App Router static export, TypeScript, Zod, CSS, Vitest, Playwright, Vercel static headers.

**Spec:** GitHub Issue #14

## Global Constraints

- Preserve `output: "export"`, the current design tokens, and the existing theme persistence behavior.
- Do not add server functions, a database, authentication, analytics, cookies, or external runtime requests.
- Keep legal statements limited to behavior proven by this repository and Vercel hosting.
- Keep `/_next/static/*` immutable while allowing `/apps/*` HTML and fixed-name assets to refresh after deployment.
- Require final-head OpenAI and Anthropic read-only reviews because metadata, legal routes, and deployment headers change.

### Task 1: Add structured feature content and exact release dates

**Files:**
- Modify: `src/data/schema.ts`
- Modify: `src/data/registry.ts`
- Modify: `src/app/apps/[slug]/page.tsx`
- Modify: `src/components/AppModal.tsx`
- Modify: `tests/registry.test.ts`

- [x] Add a feature schema with `icon`, `title`, and `description`.
- [x] Migrate SubLog and CafLog feature data using verified current App Store descriptions.
- [x] Set Apple Lookup API first-release dates: SubLog `2026-04-14`, CafLog `2026-04-10`.
- [x] Render the richer data in the app page while retaining compact modal tags.

### Task 2: Make filters and public legal routes clear

**Files:**
- Modify: `src/components/AppsSection.tsx`
- Modify: `src/components/Sections.tsx`
- Modify: `src/lib/site-data.ts`
- Modify: `src/styles/standard.css`
- Add: `src/app/privacy/page.tsx`
- Add: `src/app/terms/page.tsx`
- Add: `src/styles/legal.css`

- [x] Show a visible localized label for each filter group.
- [x] Add static site privacy and terms pages that describe actual site behavior.
- [x] Link both routes from the top-page footer.

### Task 3: Add OGP metadata and safe cache headers

**Files:**
- Add: `public/ogp.png`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/apps/[slug]/page.tsx`
- Modify: `vercel.json`

- [x] Add a 1200x630 OGP image composed from repository app icons and reference it from Open Graph/Twitter metadata.
- [x] Retain long immutable caching only for content-hashed `/_next/static/*` output.
- [x] Change `/apps/*` to browser revalidation so redeploys can update HTML and fixed-name images.

### Task 4: Verify and deliver

**Files:**
- Modify: `tests/e2e/site.spec.ts`
- Modify: `tests/registry.test.ts`
- Modify: `docs/TODO.md`

- [x] Add regression checks for feature structure, dates, legal routes, OGP dimensions/metadata, visible filter labels, and cache configuration.
- [x] Run `fnm exec --using=24.20.0 npm run verify`.
- [ ] Obtain OpenAI and Anthropic exact-head read-only reviews and resolve blockers.
- [ ] Open, verify, and squash-merge the PR with exact-head protection.
