import { getRelativeLocaleUrl } from 'astro:i18n'

import config from '@/site-config'

import en from './locales/en'
import zh from './locales/zh'
import type { Locale, TranslationDictionary } from './types'

const dictionaries: Record<Locale, TranslationDictionary> = { en, zh }

export function getLocale(locale: string | undefined): Locale {
  return locale === 'en' ? 'en' : 'zh'
}

export function getTranslations(locale: string | undefined): TranslationDictionary {
  return dictionaries[getLocale(locale)]
}

export function getLocalizedUrl(locale: string | undefined, path: string) {
  const url = getRelativeLocaleUrl(getLocale(locale), path)
  return url !== '/' && url.endsWith('/') ? url.slice(0, -1) : url
}

export function getSiteIdentity(locale: string | undefined) {
  const normalizedLocale = getLocale(locale)

  return {
    author:
      normalizedLocale === 'en' ? (config.author_en ?? config.author) : config.author,
    description:
      normalizedLocale === 'en'
        ? (config.description_en ?? config.description)
        : config.description
  }
}

export type { Locale, TranslationDictionary } from './types'
