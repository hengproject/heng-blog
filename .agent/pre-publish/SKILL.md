---
name: pre-publish
description: Run Heng Blog's fixed pre-publish gate before committing, pushing, or deploying. Use when asked to check release readiness. Inspect the diff, run lint, build the Cloudflare production output, run Playwright, and verify requested routes. Never commit, push, deploy, or repair failures automatically.
---

# Pre-publish

Run from the repository root. Stop at the first failure.

```bash
git status --short --branch
git diff --check
git diff --stat
corepack pnpm run lint:check
SITE_URL=https://heng-blog.pages.dev NODE_ENV=production corepack pnpm run build:cloudflare
corepack pnpm run test:e2e
test -f dist/index.html
```

For every route affected by the diff, require `dist/<route>/index.html` to exist. For a published
post, also check its category and collection routes.

Success means every command exits `0` and every expected route exists. Report only:

- reviewed diff scope;
- pass/fail for lint, build, Playwright, and routes;
- exact blocker or warning.

Known non-blocking warnings: empty `blogEn` while no `index-en.md(x)` exists, and stale
Browserslist data. Treat any other warning as new and report it.
