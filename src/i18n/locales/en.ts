import type { TranslationDictionary } from '../types'

export default {
  language: {
    current: 'English',
    switchTo: 'Switch to 中文',
    unavailable: 'No Chinese version is available for this content'
  },
  nav: {
    blog: 'Blog',
    about: 'About',
    search: 'Search'
  },
  home: {
    metaTitle: 'Home',
    avatarAlt: 'Profile image',
    startWriting: 'Start writing',
    starterDescription:
      'The content directory is ready for Markdown or MDX posts under src/content/blog.',
    browsePosts: 'Browse posts',
    statistics: 'Statistics'
  },
  about: {
    title: 'About',
    avatarAlt: 'Profile image',
    location: 'Your location',
    profile: 'Profile',
    profileDescription: 'Introduce your background, interests, and current direction here.',
    focus: 'Current focus',
    focusDescription: 'List what you are researching, learning, or building.'
  },
  links: {
    title: 'Links',
    directory: 'Blogroll',
    directoryDescription: 'A small directory of sites worth visiting',
    apply: 'Exchange links',
    applyDescription: 'Reference details for blogroll requests',
    copyHint: 'Select any value to copy it',
    copied: 'Copied',
    feed: 'Friend circle',
    feedDescription: 'Recent posts from linked RSS feeds can appear here',
    sample: 'A sample post from the blogroll',
    source: 'Example Blog',
    date: 'Updated recently'
  },
  blog: {
    title: 'Blog',
    categoryDescription: 'Posts in category: ',
    previous: 'Previous',
    next: 'Next',
    goTo: 'Go to',
    empty: 'No posts yet.',
    postList: 'Blog posts list',
    page: 'Page',
    showing: '- Showing',
    of: 'of',
    posts: 'posts',
    viewByYear: 'View all posts by year',
    collections: 'Collections',
    viewAllCollections: 'View all collections',
    tags: 'Tags',
    viewAll: 'View all',
    back: 'Back'
  },
  policy: {
    title: 'Site Policy',
    description: 'Privacy, copyright, and disclaimer information for this site',
    document: 'View the complete site policy',
    documentDescription: 'Privacy, copyright, external links, and content disclaimer'
  }
} satisfies TranslationDictionary
