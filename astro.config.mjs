// @ts-check

import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import { defineConfig } from 'astro/config'
// Rehype & remark packages
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

// Integrations
import AstroAxiIntegration from './src/axi-integration.ts'
// Others
// import { visualizer } from 'rollup-plugin-visualizer'

// Local rehype & remark plugins
import rehypeAutolinkHeadings from './src/plugins/rehype-auto-link-headings.ts'
// Shiki
import {
  addCopyButton,
  addLanguage,
  addTitle,
  transformerNotationDiff,
  transformerNotationHighlight,
  updateStyle
} from './src/plugins/shiki-transformers.ts'
import config from './src/site.config.ts'

// Astro commands can run beside the dev server. Keep their Vite dependency metadata isolated so
// a check or production build cannot invalidate modules already loaded in the browser.
const viteCacheScope = process.argv[2] === 'dev' ? 'dev' : 'build'

// https://astro.build/config
export default defineConfig({
  // Top-Level Options
  site: process.env.SITE_URL || 'http://localhost:4321',
  // base: '/docs',
  trailingSlash: 'never',

  // Internationalization
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    routing: {
      prefixDefaultLocale: false
    }
  },

  output: 'static',

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  integrations: [
    // astro-axi will automatically add sitemap, mdx & tailwind
    // sitemap(),
    // mdx(),
    // tailwind({ applyBaseStyles: false }),
    AstroAxiIntegration(config)
    // (await import('@playform/compress')).default({
    //   SVG: false,
    //   Exclude: ['index.*.js']
    // })
  ],
  // root: './my-project-directory',

  // Prefetch Options
  prefetch: true,
  // Server Options
  server: {
    host: true
  },
  // Markdown Options
  markdown: {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [
      rehypeHeadingIds,
      [rehypeKatex, {}],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['anchor'] },
          content: { type: 'text', value: '#' }
        }
      ]
    ],
    remarkRehype: {
      footnoteLabel: '脚注',
      footnoteBackLabel: '返回内容',
      footnoteBackContent: '↑'
    },
    // https://docs.astro.build/en/guides/syntax-highlighting/
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      transformers: [
        transformerNotationDiff(),
        transformerNotationHighlight(),
        updateStyle(),
        addTitle(),
        addLanguage(),
        addCopyButton(2000)
      ]
    }
  },
  vite: {
    cacheDir: `node_modules/.vite/${viteCacheScope}`
    // plugins: [
    //   visualizer({
    //     emitFile: true,
    //     filename: 'stats.html'
    //   })
    // ]
  }
})
