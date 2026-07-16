---
name: check-site-release
description: Run Heng Blog's project-wide release gate. Use before committing, tagging, pushing, or deploying site changes; when asked whether the current repository is ready for Cloudflare Pages; or when diagnosing a build that works locally but fails in CI. Inspect the intended diff, run non-mutating lint and Astro checks, build the production site, run end-to-end tests, and verify generated routes. Do not commit, push, or deploy from this skill.
---

# Check Site Release

Run a reproducible, non-deploying release check from the repository root. Stop on a failed gate and
report the actual error rather than declaring the release ready.

## 1. Establish Scope

1. Run `git status --short --branch`, `git diff --check`, `git diff --stat`, and inspect both staged
   and unstaged diffs.
2. Identify which files belong to the requested release. Do not include or revert unrelated user
   changes.
3. Check changed configuration, workflow, dependency, content, and asset files for accidental
   placeholders, secrets, broken references, or generated-file churn.
4. If `package.json` or `pnpm-lock.yaml` changed, confirm that they agree. Run
   `corepack pnpm install --frozen-lockfile` when dependencies are missing or lockfile integrity
   needs verification.

## 2. Run Required Gates

Run these commands in order:

```bash
corepack pnpm run lint:check
SITE_URL=https://heng-blog.pages.dev NODE_ENV=production corepack pnpm run build:cloudflare
corepack pnpm run test:e2e
```

Use `lint:check`, not the mutating `lint` script. Treat any nonzero exit as a blocker.

The empty `blogEn` collection and stale Browserslist database currently produce known warnings.
Report them, but do not treat them as failures while no `index-en.md` or `index-en.mdx` files exist.
Do not silently accept any new warning category.

## 3. Verify Output

1. Confirm `dist/index.html` exists.
2. Derive expected routes from the changed pages or newly published posts and confirm each matching
   `dist/<route>/index.html` exists.
3. For a content release, confirm the production build generated the article, category, tag, and
   collection routes that should expose it.
4. If a preview server is already running, preserve it and request each affected route. Otherwise,
   start one only when the user asked for local preview.
5. Use Playwright at desktop and mobile widths when layout, navigation, drawers, code blocks, or
   other interactive UI changed. Existing tests are necessary but do not replace targeted visual
   inspection for a new interaction.

## 4. Report The Gate

Report:

- commit/branch and reviewed diff scope;
- pass or fail for lint, Astro check/build, Playwright, and route generation;
- warnings and residual risks;
- exact blockers and the next corrective action.

Call the release ready only when every required gate passes. Leave the working tree and remote
state unchanged.
