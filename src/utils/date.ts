import config from '@/site-config'

const dateOptions: Intl.DateTimeFormatOptions = {
  timeZone: 'UTC',
  ...config.locale.dateOptions
}
const dateFormat = new Intl.DateTimeFormat(config.locale.dateLocale, dateOptions)

export function getFormattedDate(
  date: string | number | Date,
  options?: Intl.DateTimeFormatOptions
) {
  if (typeof options !== 'undefined') {
    return new Date(date).toLocaleDateString(config.locale.dateLocale, {
      ...dateOptions,
      ...options
    })
  }

  return dateFormat.format(new Date(date))
}
