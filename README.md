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
tags: []
draft: false
---

Write the post here.
```

Use `index-en.md` in the same directory for an optional English version. Site identity,
navigation, integrations, and comments are configured in `src/site.config.ts`.

## Commands

- `pnpm dev`: start the development server
- `pnpm check`: validate Astro, TypeScript, and content
- `pnpm build`: validate and build the site
- `pnpm lint:check`: report lint issues

## Attribution

The upstream project is licensed under Apache License 2.0. Its `LICENSE` is retained here.
This repository is an independent derivative starter and is not affiliated with the upstream
author.
