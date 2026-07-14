import { getCollection, type CollectionEntry } from 'astro:content'

export type BlogCollectionKey = 'blog' | 'blogEn'
export type BlogEntry = CollectionEntry<'blog'> | CollectionEntry<'blogEn'>
type Collections = BlogEntry[]

export interface SidebarCollection {
  key: string
  title: string
  description: string
  href: string
  count: number
}

export interface PostCollectionContext {
  key: string
  title: string
  href: string
  position: number
  total: number
  items: Array<{
    title: string
    href: string
    current: boolean
  }>
  previous?: {
    title: string
    href: string
  }
  next?: {
    title: string
    href: string
  }
}

export const prod = import.meta.env.PROD

/** Note: this function filters out draft posts based on the environment */
export async function getBlogCollection() {
  return await getCollection('blog', ({ data }) => {
    // Not in production & draft is not false
    return prod ? !data.draft : true
  })
}

/**
 * Get posts with an explicit English source file.
 */
export async function getBlogCollectionEn() {
  const englishPosts = await getCollection('blogEn', ({ data }) => {
    return prod ? !data.draft : true
  })

  const transformedEnglishPosts = englishPosts.map((post) => ({
    ...post,
    id: getPostSlug(post.id)
  }))

  return transformedEnglishPosts
}

export function getPostSlug(id: string) {
  return id.replace(/\/index(?:-en)?(?:\.(?:md|mdx))?$/u, '')
}

function getYearFromCollection<T extends BlogCollectionKey>(
  collection: CollectionEntry<T>
): number | undefined {
  const dateStr = collection.data.updatedDate ?? collection.data.publishDate
  return dateStr ? new Date(dateStr).getFullYear() : undefined
}
export function groupCollectionsByYear<T extends BlogCollectionKey>(
  collections: CollectionEntry<T>[]
): [number, CollectionEntry<T>[]][] {
  const collectionsByYear = collections.reduce((acc, collection) => {
    const year = getYearFromCollection(collection)
    if (year !== undefined) {
      if (!acc.has(year)) {
        acc.set(year, [])
      }
      acc.get(year)!.push(collection)
    }
    return acc
  }, new Map<number, Collections>())

  return Array.from(
    collectionsByYear.entries() as IterableIterator<[number, CollectionEntry<T>[]]>
  ).sort((a, b) => b[0] - a[0])
}

export function sortMDByDate(collections: Collections): Collections {
  return collections.sort((a, b) => {
    const aUpdatedDate = a.data.updatedDate ? new Date(a.data.updatedDate).valueOf() : 0
    const bUpdatedDate = b.data.updatedDate ? new Date(b.data.updatedDate).valueOf() : 0
    if (aUpdatedDate !== bUpdatedDate) {
      return bUpdatedDate - aUpdatedDate
    }
    const aPublishDate = a.data.publishDate ? new Date(a.data.publishDate).valueOf() : 0
    const bPublishDate = b.data.publishDate ? new Date(b.data.publishDate).valueOf() : 0
    return bPublishDate - aPublishDate
  })
}

export function sortMDByDateAsc(collections: Collections): Collections {
  return collections.sort((a, b) => {
    const aUpdatedDate = a.data.updatedDate ? new Date(a.data.updatedDate).valueOf() : 0
    const bUpdatedDate = b.data.updatedDate ? new Date(b.data.updatedDate).valueOf() : 0
    if (aUpdatedDate !== bUpdatedDate) {
      return aUpdatedDate - bUpdatedDate
    }
    const aPublishDate = a.data.publishDate ? new Date(a.data.publishDate).valueOf() : 0
    const bPublishDate = b.data.publishDate ? new Date(b.data.publishDate).valueOf() : 0
    return aPublishDate - bPublishDate
  })
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getAllTags(collections: Collections) {
  return collections.flatMap((collection) => [...collection.data.tags])
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTags(collections: Collections) {
  return [...new Set(getAllTags(collections))]
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueTagsWithCount(collections: Collections): [string, number][] {
  return [
    ...getAllTags(collections).reduce(
      (acc, t) => acc.set(t, (acc.get(t) || 0) + 1),
      new Map<string, number>()
    )
  ].sort((a, b) => b[1] - a[1])
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getAllCategories(collections: Collections) {
  return collections
    .map((collection) => collection.data.category)
    .filter((category): category is string => category !== undefined)
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueCategories(collections: Collections) {
  return [...new Set(getAllCategories(collections))]
}

/** Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so. */
export function getUniqueCategoriesWithCount(collections: Collections): [string, number][] {
  return [
    ...getAllCategories(collections).reduce(
      (acc, c) => acc.set(c, (acc.get(c) || 0) + 1),
      new Map<string, number>()
    )
  ].sort((a, b) => b[1] - a[1])
}

/** Filter collections by category */
export function getCollectionsByCategory(collections: Collections, category: string) {
  return collections.filter((collection) => collection.data.category === category)
}

let seriesEntriesPromise: ReturnType<typeof loadSeriesEntries> | undefined

async function loadSeriesEntries() {
  const [seriesEntries, chinesePosts, englishPosts] = await Promise.all([
    getCollection('series'),
    getCollection('blog'),
    getCollection('blogEn')
  ])
  const availableSlugs = new Set(
    [...chinesePosts, ...englishPosts].map((post) => getPostSlug(post.id))
  )
  const assignedSlugs = new Map<string, string>()

  for (const series of seriesEntries) {
    for (const slug of series.data.posts) {
      if (!availableSlugs.has(slug)) {
        throw new Error(`Collection "${series.id}" references missing post "${slug}"`)
      }
      const existingSeries = assignedSlugs.get(slug)
      if (existingSeries) {
        throw new Error(
          `Post "${slug}" belongs to both "${existingSeries}" and "${series.id}" collections`
        )
      }
      assignedSlugs.set(slug, series.id)
    }
  }

  return seriesEntries
}

function getSeriesEntries() {
  seriesEntriesPromise ??= loadSeriesEntries()
  return seriesEntriesPromise
}

export async function getSidebarCollections(
  collections: Collections,
  locale: 'zh' | 'en' = 'zh',
  options: {
    preferCategory?: string
    limit?: number
  } = {}
): Promise<SidebarCollection[]> {
  const seriesEntries = await getSeriesEntries()
  const localePrefix = locale === 'en' ? '/en' : ''
  const { preferCategory, limit } = options

  const items = seriesEntries
    .map((series, index) => {
      const postSlugs = new Set(series.data.posts)
      const matchedPosts = collections.filter((collection) =>
        postSlugs.has(getPostSlug(collection.id))
      )
      const count = matchedPosts.length
      const categoryMatched =
        typeof preferCategory === 'string'
          ? matchedPosts.some((post) => post.data.category === preferCategory)
          : false

      return {
        index,
        key: series.id,
        title: series.data.title[locale],
        description: series.data.description[locale],
        href: `${localePrefix}/collection/${series.id}`,
        count,
        categoryMatched
      }
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => {
      if (a.categoryMatched !== b.categoryMatched) {
        return a.categoryMatched ? -1 : 1
      }
      return a.index - b.index
    })

  const limitedItems = typeof limit === 'number' ? items.slice(0, Math.max(0, limit)) : items

  return limitedItems.map(({ key, title, description, href, count }) => ({
    key,
    title,
    description,
    href,
    count
  }))
}

export async function getCollectionPostsByKey<T extends BlogCollectionKey>(
  collections: CollectionEntry<T>[],
  key: string
) {
  const series = (await getSeriesEntries()).find((entry) => entry.id === key)
  if (!series) return []

  const postsBySlug = new Map(collections.map((post) => [getPostSlug(post.id), post]))
  return series.data.posts.flatMap((slug) => {
    const post = postsBySlug.get(slug)
    return post ? [post] : []
  })
}

export async function getPostCollectionContext(
  postId: string,
  collections: Collections,
  locale: 'zh' | 'en'
): Promise<PostCollectionContext | undefined> {
  const slug = getPostSlug(postId)
  const series = (await getSeriesEntries()).find((entry) => entry.data.posts.includes(slug))
  if (!series) return undefined

  const postsBySlug = new Map(collections.map((post) => [getPostSlug(post.id), post]))
  const localePrefix = locale === 'en' ? '/en' : ''
  const items = series.data.posts.flatMap((postSlug) => {
    const post = postsBySlug.get(postSlug)
    return post
      ? [
          {
            title: post.data.title,
            href: `${localePrefix}/blog/${postSlug}`,
            current: postSlug === slug
          }
        ]
      : []
  })
  const currentIndex = items.findIndex((item) => item.current)
  if (currentIndex === -1) return undefined

  return {
    key: series.id,
    title: series.data.title[locale],
    href: `${localePrefix}/collection/${series.id}`,
    position: currentIndex + 1,
    total: items.length,
    items,
    previous: items[currentIndex - 1],
    next: items[currentIndex + 1]
  }
}
