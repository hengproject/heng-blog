---
name: post-publish
description: Verify a Heng Blog release after it has been pushed or deployed. Use after GitHub or Cloudflare publication to check the remote commit, GitHub Actions result, canonical production routes, and page-specific content markers. Perform read-only verification and never modify code, Git history, secrets, or production.
---

# Post-publish

Run read-only checks:

```bash
SHA="$(git rev-parse HEAD)"
git ls-remote origin refs/heads/main
gh run list --workflow cloudflare-pages.yml --commit "$SHA" --limit 1 \
  --json databaseId,status,conclusion,url,headSha
```

For every released route, request the canonical URL with `?verify=$SHA`:

```bash
curl -L --fail --silent --show-error --max-time 20 \
  "https://heng-blog.pages.dev/<route>?verify=$SHA"
```

Require:

- `origin/main` points to `$SHA`;
- the GitHub run is identified and its result is reported;
- every requested route returns success after redirects;
- each response contains its expected title or other page-specific marker.

If GitHub Actions fails, inspect only the failed log:

```bash
gh run view <run-id> --log-failed
```

Report GitHub state and Cloudflare state separately. A direct Cloudflare deployment may be live
even when CI fails because `CLOUDFLARE_API_TOKEN` is invalid.
