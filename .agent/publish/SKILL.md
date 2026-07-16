---
name: publish
description: Publish a prepared Heng Blog change to GitHub and Cloudflare Pages. Use only when the user explicitly asks to commit, push, or deploy. Require pre-publish to pass, stage only named files, commit once, refuse to continue when origin/main is ahead, push main, and deploy the validated dist with Wrangler. Never force-push or include unrelated changes.
---

# Publish

Require a successful `../pre-publish/SKILL.md` run for the current diff. Then execute exactly:

1. Stage only paths in the requested release.
2. Run:

```bash
git diff --cached --check
git diff --cached --stat
git diff --cached
```

3. Commit once with an imperative message.
4. Run `git fetch origin`.
5. If `git rev-list --count HEAD..origin/main` is not `0`, stop. Do not rebase automatically.
6. Run `git push origin main`.
7. Deploy the already validated `dist/`:

```bash
corepack pnpm dlx wrangler@4.111.0 whoami
corepack pnpm dlx wrangler@4.111.0 pages deploy dist --project-name=heng-blog --branch=main
```

Stop if Wrangler is not authenticated. Never place the local OAuth token in GitHub Secrets.

Return the commit SHA, push result, and deployment URL. Leave post-deployment validation to
`../post-publish/SKILL.md`.
