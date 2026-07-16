---
name: publish-site-release
description: Publish a validated Heng Blog release end to end. Use when the user asks to commit and push a release, publish the current site, deploy to Cloudflare Pages, or verify a GitHub Actions deployment. Run the site release gate, create an intentional commit, synchronize and push main without rewriting shared history, monitor CI, deploy with Wrangler when appropriate, verify production routes, and report the exact commit and deployment. This skill changes Git and production state.
---

# Publish Site Release

Publish only the intended, validated changes. The target repository is `hengproject/heng-blog`; the
Cloudflare Pages project and canonical host are `heng-blog` and `https://heng-blog.pages.dev`.

## 1. Validate Before Changing Remote State

1. Read and execute `../check-site-release/SKILL.md`.
2. Stop if any required gate fails. Fix issues only when the user's request includes fixes, then run
   the complete gate again.
3. Confirm the current branch and intended release scope. Do not stage unrelated user changes.

## 2. Commit Intentionally

1. Stage explicit paths with `git add <paths>`.
2. Run `git diff --cached --check`, inspect `git diff --cached --stat`, and review the cached diff.
3. Create one focused commit with an imperative message.
4. Confirm the worktree is clean, or explain any intentionally uncommitted files.

Never commit credentials, Wrangler configuration, `.env` files, or build output from `dist/`.

## 3. Synchronize And Push

1. Run `git fetch origin` and compare `HEAD` with `origin/main`.
2. If the remote is ahead, rebase the clean local branch onto `origin/main`. Resolve conflicts by
   preserving both valid remote changes and the intended release; never use a force push.
3. After any rebase or dependency conflict, rerun the complete site release gate.
4. Push with `git push origin main` and record the resulting commit SHA.

## 4. Deploy

Prefer the repository workflow in `.github/workflows/cloudflare-pages.yml`:

```bash
gh run list --workflow cloudflare-pages.yml --commit "$(git rev-parse HEAD)" --limit 1
gh run watch <run-id> --exit-status
```

Inspect failed logs with `gh run view <run-id> --log-failed`. A successful build followed by
Cloudflare errors `10000` or `9109` means `CLOUDFLARE_API_TOKEN` is invalid; it is not an application
build failure.

When the user asked for immediate deployment and local OAuth is authorized, deploy the already
validated `dist/` directly:

```bash
corepack pnpm dlx wrangler@4.111.0 whoami
corepack pnpm dlx wrangler@4.111.0 pages deploy dist --project-name=heng-blog --branch=main
```

Do not copy the short-lived local OAuth access token into GitHub Actions. Durable CI requires a
Cloudflare API token with Pages write access in the GitHub secret `CLOUDFLARE_API_TOKEN`, the
account ID in `CLOUDFLARE_ACCOUNT_ID`, and repository variables `CLOUDFLARE_PROJECT_NAME` and
`SITE_URL`.

## 5. Verify Production

1. Request the deployment-specific URL and `https://heng-blog.pages.dev` with a cache-busting query.
2. Verify every affected route returns `200` after redirects and contains a page-specific marker.
3. Check the collection route as well as individual post routes for content releases.
4. Confirm `git status --short --branch` is clean and local `main` matches `origin/main`.

Report the commit SHA, GitHub push, CI result, Cloudflare deployment URL, canonical routes, test
results, and any remaining CI configuration problem. Distinguish clearly between a successful
direct deployment and a still-failing automated workflow.
