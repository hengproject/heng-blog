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

Create a post at `src/content/blog/<slug>/index.md`:

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

## Commands

- `pnpm dev`: start the development server
- `pnpm check`: validate Astro, TypeScript, and content
- `pnpm build`: validate and build the site
- `pnpm lint:check`: report lint issues

## Attribution

The upstream project is licensed under Apache License 2.0. Its `LICENSE` is retained here.
This repository is an independent derivative starter and is not affiliated with the upstream
author.
