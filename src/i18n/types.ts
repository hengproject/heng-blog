import zh from './locales/zh'

type StringValues<T> = {
  [Key in keyof T]: T[Key] extends string ? string : StringValues<T[Key]>
}

export type Locale = 'en' | 'zh'
export type TranslationDictionary = StringValues<typeof zh>
