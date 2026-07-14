---
title: "Hello, Heng's Blog"
description: The first example post, demonstrating common formatting and bilingual content organization.
publishDate: 2026-07-14
category: technical
tags:
  - astro
  - blog
draft: true
translationStatus: complete
---

This is my first blog post and a working example that can be edited directly.

The `hello-blog` directory controls the article URL, while the `title` in the frontmatter controls the heading displayed on the page. The title can therefore change without breaking a shared link.

## Why this blog exists

This site will collect research notes, technical work, and long-running project records. Keeping this material in a personal blog makes its structure and revision history easier to maintain.

Two categories are ready to use:

- **Research**: paper notes, experiments, and interim findings.
- **Technical**: implementation details, tooling, and debugging notes.

## Common Markdown formatting

Posts support standard Markdown syntax.

### Quote

> Writing records not only the result, but also the process of organizing a thought.

### Code

```ts
const site = {
  name: "Heng's Blog",
  author: 'Suheng'
}

console.log(`Welcome to ${site.name}`)
```

### Table

| Content       | Category      | Examples                         |
| ------------- | ------------- | -------------------------------- |
| Research note | `research`    | Papers, experiments, and results |
| Technical post| `technical`   | Development, deployment, fixes   |

### Image

![Heng's Blog example social card](/images/social-card.svg)

Images used by one post can live in an `images/` directory beside the Markdown files. Images shared across pages belong in `public/images/`.

## Next step

Edit this file and save it; the development page will update automatically. Change `draft` to `false` when the post is ready to publish.

