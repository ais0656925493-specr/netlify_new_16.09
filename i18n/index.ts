import type { AppLocale, AppStrings } from './schema'
import { ar } from './locales/ar'
import { cs } from './locales/cs'
import { da } from './locales/da'
import { de } from './locales/de'
import { el } from './locales/el'
import { en } from './locales/en'
import { enGb } from './locales/en-GB'
import { es } from './locales/es'
import { fi } from './locales/fi'
import { fr } from './locales/fr'
import { he } from './locales/he'
import { mn } from './locales/mn'
import { nb } from './locales/nb'
import { id } from './locales/id'
import { it } from './locales/it'
import { ja } from './locales/ja'
import { ko } from './locales/ko'
import { nl } from './locales/nl'
import { pt } from './locales/pt'
import { ru } from './locales/ru'
import { sv } from './locales/sv'
import { th } from './locales/th'
import { vi } from './locales/vi'
import { zhHans } from './locales/zh-Hans'
import { zhHant } from './locales/zh-Hant'

export type { AppLocale, AppStrings } from './schema'
export { APP_LOCALES, LOCALE_BCP47 } from './schema'
export { countryCodeToAppLocale } from './countryToLocale'

const MESSAGES: Record<AppLocale, AppStrings> = {
  en,
  'en-GB': enGb,
  ar,
  vi,
  'zh-Hans': zhHans,
  'zh-Hant': zhHant,
  ja,
  ko,
  th,
  id,
  es,
  pt,
  fr,
  de,
  cs,
  he,
  it,
  ru,
  sv,
  nl,
  fi,
  mn,
  el,
  da,
  nb,
}

export function getStrings(locale: AppLocale): AppStrings {
  return MESSAGES[locale] ?? MESSAGES.en
}
