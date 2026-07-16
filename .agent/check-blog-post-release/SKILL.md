---
name: check-blog-post-release
description: Review a Heng Blog Markdown or MDX article before publication. Use when creating or publishing a post, changing a post from draft to public, importing notebook or paper content, adding an article to a collection, or checking why a post is missing from a built site. Validate frontmatter, technical content, formulas and code, citations and assets, i18n state, collection order, README documentation, and the generated production route. Do not deploy unless the user separately requests a site release.
---

# Check Blog Post Release

Review the article as content, code, and a routable Astro entry. Do not make it public merely because
its MDX compiles.

## 1. Locate The Article

Use these layouts:

```text
src/content/blog/<slug>/index.md(x)
src/content/blog/collections/<collection-id>/<slug>/index.md(x)
```

The optional English sibling is `index-en.md` or `index-en.mdx`. The public route is
`/blog/<slug>/`; directory placement under `collections/` does not change it.

## 2. Validate Frontmatter

Check against `src/content.config.ts`:

- `title`: required, at most 60 characters;
- `description`: required, at most 160 characters;
- `publishDate`: required; preserve the intended original publication date;
- `updatedDate`: set to the actual revision date after substantive edits;
- `category`: use an existing category when appropriate, but do not hardcode an artificial enum;
- `tags`: lowercase and specific; remove duplicates;
- `draft`: keep `true` until every release check passes, then set `false`;
- `translationStatus`: use `draft`, `review`, or `complete` to describe the current language file;
- `heroImage`: verify the referenced image and meaningful alt text when present.

Do not invent an English translation to eliminate the known empty-`blogEn` warning.

## 3. Review Content And Sources

1. Read the whole article, not only its frontmatter.
2. Check technical claims, tensor shapes, equations, terminology, and transitions. For a series,
   compare code interfaces across adjacent articles; snippets that are individually plausible can
   still be incompatible when combined.
3. Check code fences for syntax and complete imports. Execute small examples when the required
   runtime is available; otherwise state the unexecuted risk.
4. Check math delimiters and search for malformed patterns such as `$$,`, unmatched delimiters, or
   punctuation accidentally placed outside display math.
5. Verify every relative image exists and visually carries the claimed information.
6. Verify external citations against primary sources where possible. Follow redirects and confirm
   referenced URLs return success. For GitHub links, verify the repository's real default branch;
   do not assume it is `main`.
7. Remove TODO text, placeholder copy, draft labels, and test-only components unless they are an
   intentional part of the published article.

## 4. Validate Collection And Locale Behavior

For a collection post:

1. Confirm `src/content/collections/<collection-id>.yaml` lists the slug exactly once.
2. Treat the manifest `posts` array as the membership and reading-order source of truth.
3. Confirm the post lives under the matching collection directory.
4. Check its `01 / NN` position and previous/next navigation on the rendered page.
5. Update the current collection arrangement in `README.md`, including publication status.

If `index-en.md(x)` exists, review it independently and verify `/en/blog/<slug>/`. If it does not
exist, confirm the Chinese page still works and report the translation as outstanding rather than
blocking Chinese publication.

## 5. Build And Inspect

Run:

```bash
corepack pnpm run lint:check
SITE_URL=https://heng-blog.pages.dev NODE_ENV=production corepack pnpm run build:cloudflare
```

Then confirm:

- `dist/blog/<slug>/index.html` exists and contains the title;
- the category and tag routes include the post;
- the collection page exists and includes the post when applicable;
- the local route returns `200` when a preview server is available;
- desktop and mobile rendering have no overlap, unreadable code, broken math, or unusable
  collection navigation.

Run the full `check-site-release` gate before committing a publication. Report reviewed files,
publication state changes, corrected issues, generated routes, checks run, and remaining content or
translation risks. Publishing to GitHub or Cloudflare is a separate `publish-site-release` action.
