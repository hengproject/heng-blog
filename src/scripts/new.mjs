/** Create a post that matches the content collections in src/content.config.ts. */

import fs from 'node:fs'
import path from 'node:path'

import minimist from './libs/minimist.cjs'
import slugify from './libs/slugify.cjs'

const CONTENT_DIR = 'src/content/blog'
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u
const CATEGORY_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/u
const COLLECTION_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u
const POST_FILE_PATTERN = /^index(?:-en)?\.(?:md|mdx)$/u
const SUPPORTED_LOCALES = new Set(['zh', 'en'])

const HELP_INFO = `Usage: pnpm new:post -- [options] <title>

Options:
  -s, --slug <slug>       Stable URL slug (required for titles that cannot be slugified)
  -l, --lang <zh|en>      Content language (default: zh)
  -c, --category <name>   Initial category (default: technical)
      --collection <key>  Store under collections/<key>; does not edit collection YAML
  -m, --mdx               Create an MDX file
  -p, --publish           Publish immediately instead of creating a draft
  -h, --help              Show this help message

Examples:
  pnpm new:post -- --slug first-post "My first post"
  pnpm new:post -- --slug first-post --lang en "My first post"
  pnpm new:post -- --slug next-note --mdx --collection ml-recall "Next note"
`

function getDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDerivedSlug(title) {
  return slugify(title).toLocaleLowerCase()
}

function fail(message) {
  console.error(`ERROR: ${message}`)
  process.exitCode = 1
}

function findPostDirectory(directory, slug) {
  if (!fs.existsSync(directory)) return undefined

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const childDirectory = path.join(directory, entry.name)
    if (
      entry.name === slug &&
      fs
        .readdirSync(childDirectory, { withFileTypes: true })
        .some((childEntry) => childEntry.isFile() && POST_FILE_PATTERN.test(childEntry.name))
    ) {
      return childDirectory
    }
    const nestedMatch = findPostDirectory(childDirectory, slug)
    if (nestedMatch) return nestedMatch
  }

  return undefined
}

export default function main(args) {
  const parsedArgs = minimist(args, {
    string: ['slug', 'lang', 'category', 'collection'],
    boolean: ['mdx', 'publish', 'help'],
    default: {
      lang: 'zh',
      category: 'technical',
      mdx: false,
      publish: false
    },
    alias: {
      s: 'slug',
      l: 'lang',
      c: 'category',
      m: 'mdx',
      p: 'publish',
      h: 'help'
    }
  })

  if (parsedArgs.help) {
    console.log(HELP_INFO)
    return
  }

  const title = parsedArgs._.join(' ').trim()
  if (!title) {
    fail('A post title is required. Use --help for examples.')
    return
  }

  const locale = parsedArgs.lang.toLowerCase()
  if (!SUPPORTED_LOCALES.has(locale)) {
    fail(`Unsupported language "${parsedArgs.lang}". Use zh or en.`)
    return
  }

  const slug = (parsedArgs.slug || getDerivedSlug(title)).toLowerCase()
  if (!slug) {
    fail(
      'This title cannot produce a URL slug. Pass one with --slug, for example --slug first-post.'
    )
    return
  }
  if (!SLUG_PATTERN.test(slug)) {
    fail('The slug must contain lowercase letters, numbers, and single hyphens only.')
    return
  }
  if (!CATEGORY_PATTERN.test(parsedArgs.category)) {
    fail('The category must contain lowercase letters, numbers, hyphens, or underscores only.')
    return
  }
  if (parsedArgs.collection && !COLLECTION_PATTERN.test(parsedArgs.collection)) {
    fail('The collection key must contain lowercase letters, numbers, and single hyphens only.')
    return
  }

  const extension = parsedArgs.mdx ? 'mdx' : 'md'
  const fileName = locale === 'en' ? `index-en.${extension}` : `index.${extension}`
  const postDir = parsedArgs.collection
    ? path.join(CONTENT_DIR, 'collections', parsedArgs.collection, slug)
    : path.join(CONTENT_DIR, slug)
  const fullPath = path.join(postDir, fileName)
  const existingPostDir = findPostDirectory(CONTENT_DIR, slug)

  if (existingPostDir && path.resolve(existingPostDir) !== path.resolve(postDir)) {
    fail(`Slug "${slug}" already exists under ${existingPostDir}. Add the translation there.`)
    return
  }

  if (fs.existsSync(fullPath)) {
    fail(`File ${fullPath} already exists.`)
    return
  }

  const description = locale === 'en' ? 'Add a short description.' : '请补充简短摘要。'
  const body = locale === 'en' ? 'Write your content here.' : '从这里开始写正文。'
  const content = `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
publishDate: ${getDate()}
category: ${parsedArgs.category}
tags: []
draft: ${!parsedArgs.publish}
---

${body}
`

  fs.mkdirSync(postDir, { recursive: true })
  fs.writeFileSync(fullPath, content, { flag: 'wx' })
  console.log(`Created ${fullPath}`)
  if (parsedArgs.collection) {
    console.log(
      `To include this post in the collection, add "${slug}" to src/content/collections/${parsedArgs.collection}.yaml.`
    )
  }
}
