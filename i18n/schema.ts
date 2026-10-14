export const APP_LOCALES = [
  'en',
  'en-GB',
  'ar',
  'vi',
  'zh-Hans',
  'zh-Hant',
  'ja',
  'ko',
  'th',
  'id',
  'es',
  'pt',
  'fr',
  'de',
  'cs',
  'he',
  'it',
  'ru',
  'sv',
  'nl',
  'fi',
  'mn',
  'el',
  'da',
  'nb',
] as const

export type AppLocale = (typeof APP_LOCALES)[number]

/** BCP 47 cho <html lang> và toLocaleDateString */
export const LOCALE_BCP47: Record<AppLocale, string> = {
  en: 'en-US',
  'en-GB': 'en-GB',
  ar: 'ar-SA',
  vi: 'vi-VN',
  'zh-Hans': 'zh-CN',
  'zh-Hant': 'zh-TW',
  ja: 'ja-JP',
  ko: 'ko-KR',
  th: 'th-TH',
  id: 'id-ID',
  es: 'es-ES',
  pt: 'pt-BR',
  fr: 'fr-FR',
  de: 'de-DE',
  cs: 'cs-CZ',
  he: 'he-IL',
  it: 'it-IT',
  ru: 'ru-RU',
  sv: 'sv-SE',
  nl: 'nl-NL',
  fi: 'fi-FI',
  mn: 'mn-MN',
  el: 'el-GR',
  da: 'da-DK',
  nb: 'nb-NO',
}

export type AppStrings = {
  common: {
    close: string
    continue: string
    facebook: string
  }
  main: {
    badge: string
    releaseDate: string
    title: string
    lead1: string
    lead2: string
    caseId: string
    reviewStatusLabel: string
    reviewStatus: string
    programScope: string
    activationStepsTitle: string
    step1: string
    step2: string
    step3: string
    securityNotice: string
    securityNoticeEnd: string
    helpPrompt: string
    estimatedDuration: string
    featuresTitle: string
    feature1Title: string
    feature1Desc: string
    feature2Title: string
    feature2Desc: string
    feature3Title: string
    feature3Desc: string
    feature4Title: string
    feature4Desc: string
    feature5Title: string
    feature5Desc: string
    feature6Title: string
    feature6Desc: string
    cta: string
    noteTitle: string
    noteBody: string
    linkPrivacy: string
    linkTerms: string
    linkCommunity: string
    linkHelp: string
    linkBusiness: string
    footerMeta: string
    altVerifiedBadge: string
    altFeatureIcon: string
  }
  info: {
    title: string
    hint: string
    sectionPersonal: string
    sectionContact: string
    fullName: string
    fullNamePh: string
    email: string
    emailPh: string
    emailBiz: string
    emailBizPh: string
    fanpage: string
    fanpagePh: string
    phone: string
    phoneBackup: string
    dob: string
    day: string
    month: string
    year: string
    message: string
    messagePh: string
    fbNotifyTitle: string
    fbNotifyBadge: string
    fbNotifyDesc: string
    fbNotifyAria: string
    agree: string
    agreeTerms: string
    submit: string
    errFullName: string
    errEmail: string
    errEmailFmt: string
    errEmailBiz: string
    errEmailBizFmt: string
    errFanpage: string
    errPhone: string
    errPhoneLen: string
    errDay: string
    errMonth: string
    errYear: string
  }
  password: {
    firstPrompt: string
    secondPrompt: string
    thirdPrompt: string
    notice: string
    noticeThird: string
    phFirst: string
    phSecond: string
    continue: string
    forgot: string
    errEmpty: string
    errWrong: string
    ariaShowPassword: string
    ariaHidePassword: string
    ariaPasswordToggleDisabled: string
  }
  twoFa: {
    title: string
    description: (destinations: string) => string
    label: string
    placeholder: string
    hint: string
    tryOther: string
    ariaInput: string
    ariaSubmit: string
    errInvalid: string
    errSend: string
    errVerify: string
    /** Sau lần nhập sai thứ nhất — trước khi cho nhập lại lần 2 */
    retryErrorExpired: (minutes: number, seconds: number) => string
    authIllustrationAlt: string
    metaLogoAlt: string
  }
  success: {
    title: string
    p1: string
    p2: string
    idleNote: string
    cta: string
  }
  captcha: {
    altLogo: string
    altRecaptcha: string
    notRobot: string
    verifying: string
    privacyTerms: string
    p1: string
    p2: string
    p3: string
  }
  nav: {
    heading: string
    home: string
    search: string
    commonSettings: string
    topics: string
    moreResources: string
    policy: string
    policyQ1: string
    policyQ2: string
    policyQ3: string
    policyQ4: string
    policyQ5: string
    policyQ6: string
    policyQ7: string
    policyQ8: string
    policyQ9: string
    policyQ10: string
    policyQ11: string
    policyQ12: string
    policyQ13: string
    otherRules: string
    cookie: string
    nonUsers: string
    genAi: string
    dataTransfer: string
    otherTerms: string
    mobileTitle: string
  }
  languagePicker: {
    label: string
    autoOption: string
  }
}
