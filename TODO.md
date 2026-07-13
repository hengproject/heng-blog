# TODO

This file tracks temporary content, placeholder assets, and configuration that should be
revisited before the site is considered production-ready.

## Temporary assets

- [ ] **Browser favicon**
  - Location: `public/favicon.svg`
  - Current state: inherited placeholder favicon.
  - Later: replace it with a final site icon derived from the blog identity or profile image.

- [ ] **Apple touch icon**
  - Planned location: `src/components/BaseHead.astro`
  - Temporary replacement: use `src/assets/avatar.png` instead of the currently missing
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

- [ ] **Home page introduction**
  - Locations: `src/i18n/locales/zh.ts` and `src/i18n/locales/en.ts`
  - Current state: starter instructions describing where to add Markdown or MDX posts.
  - Later: replace both language versions with a personal introduction.

- [ ] **About page profile**
  - Locations: `src/i18n/locales/zh.ts` and `src/i18n/locales/en.ts`
  - Current state: profile, location, and current-focus text are placeholders.
  - Later: update both languages together so the two versions remain aligned.

- [ ] **Blog start date**
  - Current location: `src/components/home/BlogStats.astro`
  - Current state: hardcoded to `2024-06-15`.
  - Planned fix: move it to `src/site.config.ts`; replace it with the actual launch date.

## Configuration to complete

- [ ] **Production site URL**
  - Location: deployment environment variable `SITE_URL`
  - Current state: local builds default to `http://localhost:4321`.
  - Later: set it to the final Cloudflare Pages or custom-domain URL.

- [ ] **Site policy contact details**
  - Planned locations: `src/pages/terms/` and `src/pages/en/terms/`
  - Current state: no policy pages or public contact address are defined.
  - Planned fix: initially publish concise policies that do not claim unavailable services or
    tracking. Add a contact method only after one is selected.

- [ ] **Footer social links**
  - Location: `src/site.config.ts`, under `theme.footer.social`
  - Current state: empty; only RSS is added automatically.
  - Later: add confirmed public profiles only.

## Removed inherited features

- [ ] **Analytics decision**
  - Current location: inherited Google Analytics code in `src/layouts/BaseLayout.astro`.
  - Planned fix: remove the unknown property ID.
  - Later: only add analytics with an account owned by Suheng and update the privacy policy at
    the same time.

- [ ] **Live2D decision**
  - Current location: inactive loader and styles in `src/layouts/BaseLayout.astro`.
  - Planned fix: remove the loader because its required files do not exist.
  - Later: restore it only with locally owned assets, an explicit loading strategy, and verified
    mobile behavior.
