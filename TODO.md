# TODO

This file tracks temporary content, placeholder assets, and configuration that should be
revisited before the site is considered production-ready.

## Temporary assets

- [ ] **Browser favicon**
  - Location: `public/favicon.svg`
  - Current state: inherited placeholder favicon.
  - Later: replace it with a final site icon derived from the blog identity or profile image.

- [ ] **Apple touch icon**
  - Location: `src/components/BaseHead.astro`
  - Temporary replacement: uses `src/assets/avatar.png` instead of the previously missing
    `/favicon/favicon.ico`.
  - Later: provide a dedicated square touch icon with appropriate padding and export sizes.

- [ ] **Social sharing image**
  - Location: `public/images/social-card.svg`
  - Current state: starter placeholder used when a page or post has no `heroImage`.
  - Later: replace it with a branded 1200 x 630 image for Heng's Blog.

- [ ] **Friend-link image fallback**
  - Location: `public/images/link-placeholder.svg`
  - Current state: generic placeholder used when a linked site has no available image.
  - Later: keep it as a neutral fallback or replace it with a branded placeholder.

## Temporary content

- [ ] **ML_recall research-note drafts**
  - Locations: `src/content/blog/ml-weight-initialization/`,
    `src/content/blog/batch-norm-vs-layer-norm/`,
    `src/content/blog/from-additive-to-multi-head-attention/`,
    `src/content/blog/transformer-input-embedding/`,
    `src/content/blog/transformer-encoder/`, and
    `src/content/blog/transformer-decoder/`.
  - Current state: six Chinese MDX drafts migrated from the notebooks and implementation in
    `hengproject/ML_recall`; each source is linked from its article.
  - Later: review the mathematical and code explanations one article at a time, add English
    `index-en.mdx` counterparts if needed, then change `draft` to `false` for publication.

- [ ] **Home page introduction**
  - Locations: `src/i18n/locales/zh.ts` and `src/i18n/locales/en.ts`
  - Current state: starter instructions describing where to add Markdown or MDX posts.
  - Later: replace both language versions with a personal introduction.

- [ ] **About page profile**
  - Locations: `src/i18n/locales/zh.ts` and `src/i18n/locales/en.ts`
  - Current state: profile, location, and current-focus text are placeholders.
  - Later: update both languages together so the two versions remain aligned.

- [ ] **Blog start date**
  - Location: `src/site.config.ts`, under `theme.blogStartDate`
  - Temporary value: `2026-07-13`, the date this starter reached its first release.
  - Later: replace it with the actual public launch date if the two dates differ.

## Configuration to complete

- [ ] **Production site URL**
  - Location: deployment environment variable `SITE_URL`
  - Current state: local builds default to `http://localhost:4321`.
  - Later: set it to the final Cloudflare Pages or custom-domain URL.

- [ ] **Site policy contact details**
  - Locations: `src/pages/terms/` and `src/pages/en/terms/`
  - Current state: concise bilingual policies are published without claiming unavailable services
    or tracking; no public contact address is defined.
  - Later: add a contact method after one is selected.

- [ ] **Footer social links**
  - Location: `src/site.config.ts`, under `theme.footer.social`
  - Current state: empty; only RSS is added automatically.
  - Later: add confirmed public profiles only.

## Removed inherited features

- [ ] **Analytics decision**
  - Previous location: inherited Google Analytics code in `src/layouts/BaseLayout.astro`.
  - Current state: removed because the property owner was unknown.
  - Later: only add analytics with an account owned by Suheng and update the privacy policy at
    the same time.

- [ ] **Live2D decision**
  - Previous location: inactive loader and styles in `src/layouts/BaseLayout.astro`.
  - Current state: removed because its required files did not exist.
  - Later: restore it only with locally owned assets, an explicit loading strategy, and verified
    mobile behavior.
