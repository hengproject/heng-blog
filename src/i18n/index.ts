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

export type { Locale, TranslationDictionary } from './types'
