# Custom components

Project-owned reusable components live here:

- `BlogLink.astro`: metadata-aware link between internal blog posts.
- `InfoDrawer.astro`: resizable supplementary-information drawer.
- `PaperCitation.astro`: paper metadata and citation card for MDX articles.

Import components through the directory entry point:

```mdx
import { BlogLink, InfoDrawer, PaperCitation } from '@/components/custom'
```

Detailed examples are available in `BlogLink.md`, `InfoDrawer.md`, and `PaperCitation.md`.

Put personal components for Heng's Blog in this directory. Import them directly, for example:

```astro
import ResearchProfile from '@/components/custom/ResearchProfile.astro'
```

Keep reusable upstream theme primitives in the existing component directories. This boundary
reduces merge conflicts when changes are brought in from the original theme.

## Info drawer

`InfoDrawer.astro` adds a small information button that opens an overlay drawer from the right.
Complete API, examples, interaction details, and test instructions are documented in
[`InfoDrawer.md`](./InfoDrawer.md).
