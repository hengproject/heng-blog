import type { CollectionEntry, CollectionKey } from 'astro:content'

import { getBlogCategories } from '@/config/blog-categories'
import type { Locale } from '@/i18n'
import {
  getCollectionsByCategory,
  getSidebarCollections,
  getUniqueCategories,
  getUniqueTags,
  sortMDByDate
} from '@/utils/server'

type BlogEntry = CollectionEntry<CollectionKey>

export function getCategoryPageData(allPosts: BlogEntry[], locale: Locale) {
  const categories = getBlogCategories(locale, getUniqueCategories(allPosts))
  const categoryMap = Object.fromEntries(categories.map(({ slug, name }) => [slug, name]))

  return categories.map(({ slug: category }, index) => {
    const posts = sortMDByDate(getCollectionsByCategory(allPosts, category))
    const allSidebarCollections = getSidebarCollections(allPosts, locale, {
      preferCategory: category
    })
    const sidebarCollections = allSidebarCollections.slice(0, 4)

    return {
      posts,
      props: {
        uniqueTags: getUniqueTags(posts),
        sidebarCollections,
        hasMoreCollections: allSidebarCollections.length > sidebarCollections.length,
        collectionsCount: posts.length,
        category,
        prevCategory: categories[(index - 1 + categories.length) % categories.length].slug,
        nextCategory: categories[(index + 1) % categories.length].slug,
        categoryMap
      }
    }
  })
}
