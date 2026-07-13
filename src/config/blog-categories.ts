export const BLOG_CATEGORIES = [
  { slug: 'research', name: 'Research' },
  { slug: 'technical', name: 'Technical' }
] as const

function formatCategoryName(slug: string) {
  return slug
    .split(/[-_]/u)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function getBlogCategories(discovered: string[] = []) {
  const configuredSlugs = new Set(BLOG_CATEGORIES.map(({ slug }) => slug))
  const additional = discovered
    .filter((slug) => !configuredSlugs.has(slug as (typeof BLOG_CATEGORIES)[number]['slug']))
    .sort((a, b) => a.localeCompare(b))
    .map((slug) => ({ slug, name: formatCategoryName(slug) }))

  return [...BLOG_CATEGORIES, ...additional]
}
