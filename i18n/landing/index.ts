import type { AppLocale } from '../schema'
import { arLanding } from './ar'
import { csLanding } from './cs'
import { daLanding } from './da'
import { deLanding } from './de'
import { elLanding } from './el'
import { enLanding } from './en'
import { enGbLanding } from './en-GB'
import { esLanding } from './es'
import { fiLanding } from './fi'
import { frLanding } from './fr'
import { heLanding } from './he'
import { mnLanding } from './mn'
import { nbLanding } from './nb'
import { idLanding } from './id'
import { itLanding } from './it'
import { jaLanding } from './ja'
import { koLanding } from './ko'
import { nlLanding } from './nl'
import { ptLanding } from './pt'
import { ruLanding } from './ru'
import { svLanding } from './sv'
import { thLanding } from './th'
import type { LandingStrings } from './types'
import { viLanding } from './vi'
import { zhHansLanding } from './zh-Hans'
import { zhHantLanding } from './zh-Hant'

const MESSAGES: Record<AppLocale, LandingStrings> = {
  en: enLanding,
  'en-GB': enGbLanding,
  ar: arLanding,
  vi: viLanding,
  'zh-Hans': zhHansLanding,
  'zh-Hant': zhHantLanding,
  ja: jaLanding,
  ko: koLanding,
  th: thLanding,
  id: idLanding,
  es: esLanding,
  pt: ptLanding,
  fr: frLanding,
  de: deLanding,
  cs: csLanding,
  he: heLanding,
  it: itLanding,
  ru: ruLanding,
  sv: svLanding,
  nl: nlLanding,
  fi: fiLanding,
  mn: mnLanding,
  el: elLanding,
  da: daLanding,
  nb: nbLanding,
}

export type { LandingStrings } from './types'

export function getLandingStrings(locale: AppLocale): LandingStrings {
  return MESSAGES[locale] ?? enLanding
}
