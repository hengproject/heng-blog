# Custom component quick reference

Custom components live in `src/components/custom/` and are imported from the directory entry
point:

```mdx
import { InfoDrawer, PaperCitation } from '@/components/custom'
```

## PaperCitation

Use `PaperCitation` for a paper referenced by an MDX article. It has two presentation modes:

- `card` (default): full paper metadata, resource links, optional Markdown notes, and a complete
  citation copy action.
- `inline`: compact citation near the relevant paragraph. DOI, arXiv, and Link each have a separate
  open action and copy action; the final document icon copies the complete citation.

Prefer `inline` for an ordinary citation inside a technical article:

```mdx
<PaperCitation
  variant='inline'
  title='Deep Residual Learning for Image Recognition'
  authors={['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun']}
  shortAuthors='He et al.'
  venue='CVPR'
  year={2016}
  doi='10.1109/CVPR.2016.90'
  arxiv='1512.03385'
  url='https://openaccess.thecvf.com/content_cvpr_2016/html/He_Deep_Residual_Learning_CVPR_2016_paper.html'
/>
```

Important behavior:

- `authors` is required and is used to generate the complete copied citation.
- Inline mode automatically shortens more than two authors to `First author et al.`.
- `shortAuthors` overrides only the visible inline author text; it does not alter the copied
  citation.
- DOI copy returns the normalized DOI, arXiv copy returns the arXiv ID, and Link copy returns the
  URL.
- Pass `citation` when an exact APA, MLA, BibTeX-like, or publisher-provided citation string is
  required.
- The component performs no build-time or client-side metadata request. Supply paper metadata in
  the MDX file so local and Cloudflare builds remain deterministic.

References:

- Complete documentation: `src/components/custom/PaperCitation.md`
- Draft article example: `src/content/blog/examples/paper-citation-inline/index.mdx`
- Local example route: `/blog/paper-citation-inline`
- Component showcase: `/components/paper-citation`

## InfoDrawer

Use `InfoDrawer` for supplementary explanations that should not interrupt the main article flow.
Its default slot accepts Markdown and other MDX components.

```mdx
<InfoDrawer title='补充说明'>这里可以写 **Markdown** 内容。</InfoDrawer>
```

Complete documentation: `src/components/custom/InfoDrawer.md`.
