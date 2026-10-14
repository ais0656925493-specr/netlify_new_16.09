import type { AppLocale } from '@/i18n/schema'

const DEFAULT_TITLE = 'Meta Verified: Get the verified badge on Facebook'
const DEFAULT_DESCRIPTION =
  'Congratulations. Your page has met the criteria to receive the Meta Verified blue badge. Complete the final review to activate your verification benefits.'

/** Title nhánh preview — kiểu “Meta đã xác minh dành cho doanh nghiệp” */
const DEFAULT_PREVIEW_TITLE = 'Meta Verified for Business'

const TITLE_BY_LOCALE: Partial<Record<AppLocale, string>> = {
  en: DEFAULT_TITLE,
  'en-GB': 'Meta Verified: Get the verified badge on Facebook',
  da: 'Meta Verified: Få det verificerede badge på Facebook',
  nb: 'Meta Verified: Få det verifiserte merket på Facebook',
  vi: 'Meta Verified: Nhận huy hiệu đã xác minh trên Facebook',
  ar: 'Meta Verified: احصل على شارة التحقق على فيسبوك',
  de: 'Meta Verified: Erhalte das verifizierte Abzeichen auf Facebook',
  cs: 'Meta Verified: Získejte ověřený odznak na Facebooku',
  fr: 'Meta Verified : Obtenez le badge vérifié sur Facebook',
  es: 'Meta Verified: Obtén la insignia verificada en Facebook',
  pt: 'Meta Verified: Receba o selo verificado no Facebook',
  id: 'Meta Verified: Dapatkan lencana terverifikasi di Facebook',
  th: 'Meta Verified: รับป้ายยืนยันตัวตนบน Facebook',
  ja: 'Meta Verified：Facebookで認証バッジを取得',
  ko: 'Meta Verified: Facebook에서 인증 배지 받기',
  'zh-Hans': 'Meta Verified：在 Facebook 获取认证徽章',
  'zh-Hant': 'Meta Verified：在 Facebook 取得驗證徽章',
  he: 'Meta Verified: קבל/י את תג האימות ב-Facebook',
  it: 'Meta Verified: Ottieni il badge verificato su Facebook',
  ru: 'Meta Verified: получите значок подтверждения в Facebook',
  sv: 'Meta Verified: Få den verifierade märkningen på Facebook',
  nl: 'Meta Verified: Ontvang de geverifieerde badge op Facebook',
  fi: 'Meta Verified: Hanki vahvistettu merkki Facebookissa',
  mn: 'Meta Verified: Facebook дээр баталгаажсан тэмдэг аваарай',
  el: 'Meta Verified: Αποκτήστε το επαληθευμένο σήμα στο Facebook',
}

const PREVIEW_TITLE_BY_LOCALE: Record<AppLocale, string> = {
  en: 'Meta Verified for Business',
  vi: 'Meta đã xác minh dành cho doanh nghiệp',
  ar: 'Meta تم التحقق منه للشركات',
  de: 'Meta Verifiziert für Unternehmen',
  cs: 'Meta ověřeno pro firmy',
  fr: 'Meta vérifié pour les entreprises',
  es: 'Meta verificado para empresas',
  pt: 'Meta verificado para empresas',
  id: 'Meta terverifikasi untuk bisnis',
  th: 'Meta ยืนยันแล้วสำหรับธุรกิจ',
  ja: 'ビジネス向け Meta 認証済み',
  ko: '비즈니스용 Meta 인증',
  'zh-Hans': '面向企业的 Meta 已验证',
  'zh-Hant': '企業專用 Meta 已驗證',
  he: 'Meta מאומת לעסקים',
  it: 'Meta verificato per le aziende',
  ru: 'Meta подтверждено для бизнеса',
  sv: 'Meta verifierat för företag',
  nl: 'Meta geverifieerd voor bedrijven',
  fi: 'Meta vahvistettu yrityksille',
  mn: 'Бизнесэд зориулсан Meta баталгаажуулалт',
  el: 'Meta Verified για επιχειρήσεις',
  'en-GB': 'Meta Verified for Business',
  da: 'Meta Verified til virksomheder',
  nb: 'Meta Verified for bedrifter',
}

const RECAPTCHA_TITLE = 'reCAPTCHA'
const RECAPTCHA_DESCRIPTION =
  'reCAPTCHA is a free service from Google that helps protect websites from spam and abuse.'

export const RECAPTCHA_FAVICON = '/images/meta/recaptcha.png'

const DESCRIPTION_BY_LOCALE: Partial<Record<AppLocale, string>> = {
  cs: 'Gratulujeme. Vaše stránka splňuje kritéria pro modrý odznak Meta Verified. Dokončete závěrečné posouzení a aktivujte výhody ověření.',
}

export function getSiteTitle(locale: AppLocale | undefined): string {
  if (!locale) return DEFAULT_TITLE
  return TITLE_BY_LOCALE[locale] ?? DEFAULT_TITLE
}

/** Title tab trình duyệt trên nhánh preview (theo locale). */
export function getPreviewSiteTitle(locale: AppLocale | undefined): string {
  if (!locale) return DEFAULT_PREVIEW_TITLE
  return PREVIEW_TITLE_BY_LOCALE[locale] ?? DEFAULT_PREVIEW_TITLE
}

export function getRecaptchaTitle(): string {
  return RECAPTCHA_TITLE
}

export function getRecaptchaDescription(): string {
  return RECAPTCHA_DESCRIPTION
}

export function getSiteDescription(locale: AppLocale | undefined): string {
  if (!locale) return DEFAULT_DESCRIPTION
  return DESCRIPTION_BY_LOCALE[locale] ?? DEFAULT_DESCRIPTION
}
