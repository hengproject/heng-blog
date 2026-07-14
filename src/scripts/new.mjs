/** Create a post that matches the content collections in src/content.config.ts. */

import fs from 'node:fs'
import path from 'node:path'

import minimist from './libs/minimist.cjs'
import slugify from './libs/slugify.cjs'

const CONTENT_DIR = 'src/content/blog'
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u
const CATEGORY_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/u
const SUPPORTED_LOCALES = new Set(['zh', 'en'])

const HELP_INFO = `Usage: pnpm new:post -- [options] <title>

Options:
  -s, --slug <slug>       Stable URL slug (required for titles that cannot be slugified)
  -l, --lang <zh|en>      Content language (default: zh)
  -c, --category <name>   Initial category (default: technical)
  -m, --mdx               Create an MDX file
  -p, --publish           Publish immediately instead of creating a draft
  -h, --help              Show this help message

Examples:
  pnpm new:post -- --slug first-post "My first post"
  pnpm new:post -- --slug first-post --lang en "My first post"
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

export default function main(args) {
  const parsedArgs = minimist(args, {
    string: ['slug', 'lang', 'category'],
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

  const extension = parsedArgs.mdx ? 'mdx' : 'md'
  const fileName = locale === 'en' ? `index-en.${extension}` : `index.${extension}`
  const postDir = path.join(CONTENT_DIR, slug)
  const fullPath = path.join(postDir, fileName)

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
}
