# Blog starter

A reusable Astro 5 blog starter derived from
[`Minakanmi-Yuki/hana-blog`](https://github.com/Minakanmi-Yuki/hana-blog) at commit
`82ae492bc33d52e1d5f675da25d99f66b37692eb`.

The original posts, personal pages, profile data, presentations, CV, payment codes, and
author-specific media are intentionally excluded. The Astro application, layouts, styles,
content pipeline, and reusable components remain available as a foundation for a future blog.

## Start locally

```bash
pnpm install
pnpm dev
```

## Add content

Create a draft from the command line:

```bash
pnpm new:post -- --slug my-first-post "My first post"
```

This creates `src/content/blog/my-first-post/index.md`. Add `--lang en` to create
`index-en.md` in the same directory, `--mdx` for an MDX file, or `--publish` to set
`draft: false` immediately. The command defaults to Chinese, the `technical` category, and
`draft: true`; edit the generated frontmatter as needed.

To store a post with the rest of a collection, pass its collection key:

```bash
pnpm new:post -- --slug next-note --mdx --collection ml-recall "Next note"
```

This creates `src/content/blog/collections/ml-recall/next-note/index.mdx`, but deliberately does not
add it to the collection. Add its slug to `src/content/collections/ml-recall.yaml` when it is ready
to join the series. The order of the `posts` array is the reading order.

You can also create the files manually. Create a post at `src/content/blog/<slug>/index.md`:

```md
---
title: My first post
description: A short summary of the post.
publishDate: 2026-01-01
category: research
tags: []
draft: false
---

Write the post here.
```

Site identity, navigation, integrations, and comments are configured in `src/site.config.ts`.

### Code block folding

Long syntax-highlighted code blocks are folded automatically. Configure the behavior under
`theme.content.codeCollapse` in `src/site.config.ts`:

```ts
codeCollapse: {
  enableAutoCollapse: true,
  lineThreshold: 5,
  previewLines: 3.5
}
```

With these defaults, blocks longer than five lines show three and a half lines with a faded lower
edge and an expand button. Set `enableAutoCollapse: false` to render every code block fully expanded.
`lineThreshold` controls when folding starts, and `previewLines` controls the collapsed height.

## Internationalization

Chinese is the default locale and uses URLs without a prefix. English uses `/en`:

```text
/about                Chinese page
/en/about             English page
/blog/research        Chinese category
/en/blog/research     English category
```

The i18n system has separate workflows for interface text and article content.

### Interface text

Shared labels and messages live in typed dictionaries:

```text
src/i18n/
├── index.ts
├── types.ts
└── locales/
    ├── zh.ts
    └── en.ts
```

Add a key to `zh.ts`, then add the matching key to `en.ts`. TypeScript reports a missing or
misplaced English key. Components read the active dictionary with:

```ts
const text = getTranslations(Astro.currentLocale)
```

Prefer one shared component that accepts a locale over maintaining two copies of the same UI.
The route files can remain small wrappers, as with the home and About pages.

Static routes still need a file for each locale:

```text
src/pages/about/index.astro
src/pages/en/about/index.astro
```

The language switch preserves the current route. If the target static route does not exist, it
will lead to a 404, so add both wrappers together.

### Article translations

Keep every translation in the same slug directory:

```text
src/content/blog/<slug>/
├── index.md           Chinese source
├── index-en.md        English source, optional
└── images/            Assets shared by both versions
```

The directory name is the translation key. Both files therefore produce the same article slug in
their respective locale. Keep structural metadata such as `category` and `tags` aligned, while
translating `title`, `description`, and the body.

An English frontmatter example:

```yaml
---
title: My translated post
description: A short English summary.
publishDate: 2026-01-01
category: research
tags: []
draft: false
translationStatus: complete
---
```

`translationStatus` is optional and accepts `draft`, `review`, or `complete`. It records editorial
state; `draft` still controls whether a post is published.

The optional `language` field is display metadata used by the article UI. It does not select the
locale or create routes; file names and route prefixes remain the source of truth.

English listings only contain real `index-en.md(x)` files. Chinese posts are not silently rendered
under English URLs. On an article without a target translation, the language switch is disabled.

## Personal customization boundaries

Keep personal content and presentation changes in these dedicated locations:

```text
src/content/blog/             Articles and their local images
src/components/custom/        New personal Astro components
src/assets/styles/custom.css  Personal CSS overrides and additions
public/images/                Shared static images referenced by URL
```

`src/layouts/BaseLayout.astro` already imports `custom.css`; do not add another stylesheet import
for each customization. Components can be imported with the `@/components/custom/...` alias.

These boundaries reduce conflicts when merging upstream theme changes. They cannot eliminate a
conflict when both branches edit the same route, configuration key, or shared layout, so keep route
wrappers small and make personal UI changes inside custom components where possible.

### Adding another locale

Adding a third language requires coordinated changes to the Astro locale list, a new dictionary,
the content collection/file naming convention, localized routes, and the language switch. Do this
as one change so the URL and content rules remain consistent.

## Categories

The starter registers `research` and `technical` in `src/config/blog-categories.ts`. Assign a
post by setting its frontmatter:

```yaml
category: technical
```

Categories are not restricted to those two values. A new value such as `category: notes`
automatically creates `/blog/notes` after the first matching post is added. Add it to
`BLOG_CATEGORIES` only when the category should exist while empty or needs a custom display name
and menu position.

## Collections

Collections are ordered series of posts. Their metadata and article order live in YAML manifests,
separate from the posts themselves:

```text
src/content/collections/<collection-id>.yaml
```

For example:

```yaml
title:
  zh: 机器学习基础回顾
  en: Machine Learning Recall
description:
  zh: 从训练基础到 Transformer 的系列笔记。
  en: Notes from training fundamentals to Transformers.
posts:
  - ml-weight-initialization
  - batch-norm-vs-layer-norm
  - transformer-encoder
```

Store a collection's article directories under
`src/content/blog/collections/<collection-id>/<post-slug>/`. Physical placement does not add an
article to a collection: each slug must also appear in the manifest's `posts` array. The array order
is the reading order and drives the collection page, the `01 / 03` progress label, and the previous,
next, and article-picker links shown between the article header and body. Do not add collection
metadata to individual article frontmatter.

The build fails when a manifest references a missing post, points to a post outside its matching
collection directory, repeats a post, or assigns the same post to more than one collection. A
collection is shown in a locale only when at least one listed post has that locale's content file.
Add `index-en.md(x)` alongside the Chinese article to make that entry available in the English
series.

## Commands

- `pnpm dev`: start the development server
- `pnpm new:post -- --slug <slug> "<title>"`: create a standalone draft post
- `pnpm new:post -- --slug <slug> --collection <id> --mdx "<title>"`: create an unlisted collection draft
- `pnpm check`: validate Astro, TypeScript, and content
- `pnpm build`: validate and build the site
- `pnpm build:cloudflare`: build the static `dist/` directory used by Cloudflare Pages
- `pnpm lint:check`: report lint issues

## Deploy to Cloudflare Pages

The site is built as platform-independent static files. The workflow at
`.github/workflows/cloudflare-pages.yml` checks every pull request and deploys pushes to `main`.
It can also be started manually from the GitHub Actions page.

First create a Cloudflare Pages **Direct Upload** project. Then configure these GitHub repository
settings under **Settings > Secrets and variables > Actions**:

| Type     | Name                      | Value                                                     |
| -------- | ------------------------- | --------------------------------------------------------- |
| Secret   | `CLOUDFLARE_ACCOUNT_ID`   | Cloudflare account ID                                     |
| Secret   | `CLOUDFLARE_API_TOKEN`    | Token with `Account / Cloudflare Pages / Edit` permission |
| Variable | `CLOUDFLARE_PROJECT_NAME` | Exact Direct Upload project name                          |
| Variable | `SITE_URL`                | Production origin, such as `https://blog.example.com`     |

`SITE_URL` controls canonical URLs, the sitemap, RSS links, and robots metadata. Do not include a
trailing slash. The deployment job deliberately fails when the project name or production URL is
missing instead of publishing metadata that points to localhost.

For local production verification, run:

```bash
SITE_URL=https://blog.example.com pnpm build:cloudflare
pnpm preview --host 0.0.0.0
```

Cloudflare credentials are only used by GitHub Actions and must not be committed to `.env` files.

## Attribution

The upstream project is licensed under Apache License 2.0. Its `LICENSE` is retained here.
This repository is an independent derivative starter and is not affiliated with the upstream
author.
