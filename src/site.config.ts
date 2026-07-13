import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from './types'

export const theme: ThemeUserConfig = {
  title: "Heng's Blog",
  author: 'Your Name',
  author_en: 'Your Name',
  description: 'Notes, ideas, and projects.',
  description_en: 'Notes, ideas, and projects.',
  favicon: '/favicon.svg',
  locale: {
    lang: 'en-US',
    attrs: 'en_US',
    dateLocale: 'en-US',
    dateOptions: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },
  logo: {
    src: 'src/assets/avatar.svg',
    alt: 'Blog logo'
  },
  titleDelimiter: '•',
  prerender: true,
  npmCDN: 'https://cdn.jsdelivr.net/npm',
  head: [],
  customCss: [],
  header: {
    menu: [
      { title: 'Blog', link: '/blog/research' },
      { title: 'About', link: '/about' }
    ]
  },
  footer: {
    registration: { url: '', text: '' },
    credits: true,
    social: {}
  },
  content: {
    externalLinksContent: ' ↗',
    blogPageSize: 15,
    externalLinkArrow: true,
    share: []
  }
}

export const integ: IntegrationUserConfig = {
  links: {
    logbook: [],
    applyTip: [
      { name: 'Name', val: "Heng's Blog" },
      { name: 'Description', val: 'Notes, ideas, and projects.' },
      { name: 'URL', val: 'https://example.com' },
      { name: 'Avatar', val: 'https://example.com/favicon.svg' }
    ]
  },
  pagefind: true,
  quote: {
    server: 'https://api.quotable.io/quotes/random?maxLength=60',
    target: `(data) => data[0].content || 'Write something worth reading.'`
  },
  typography: {
    class:
      'break-words prose prose-axi dark:prose-invert dark:prose-axi prose-headings:font-medium'
  },
  mediumZoom: {
    enable: true,
    selector: '.prose .zoomable',
    options: { className: 'zoomable' }
  },
  waline: {
    enable: false,
    emoji: [],
    additionalConfigs: {}
  }
}

export const terms: CardListData = {
  title: 'Terms',
  list: []
}

const config = { ...theme, integ } as Config
export default config
