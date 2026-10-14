function unquote(value: string): string {
  return value.trim().replace(/^"|"$/g, '')
}

function browserNameFromBrands(raw: string): string {
  const brands: string[] = []
  const pattern = /"([^"]+)";v="[^"]*"/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(raw))) brands.push(match[1])

  const brand = brands.find((name) => !/chromium|not.a.brand/i.test(name))
  if (!brand) return ''
  return brand.replace(/^Google Chrome$/i, 'Chrome').replace(/^Microsoft Edge$/i, 'Edge')
}

function browserNameFromUserAgent(ua: string): string {
  if (/Edg(?:e|A|iOS)?\//i.test(ua)) return 'Edge'
  if (/(?:OPR|Opera)\//i.test(ua)) return 'Opera'
  if (/SamsungBrowser\//i.test(ua)) return 'Samsung Internet'
  if (/(?:Firefox|FxiOS)\//i.test(ua)) return 'Firefox'
  if (/(?:Chrome|CriOS)\//i.test(ua)) return 'Chrome'
  if (/Version\/.+Safari\//i.test(ua)) return 'Safari'
  return ''
}

function windowsName(ua: string, platformVersion: string): string {
  const major = Number.parseInt(platformVersion, 10)
  if (Number.isFinite(major) && major >= 13) return 'Windows 11'
  if (Number.isFinite(major) && major > 0 && major < 13) return 'Windows 10'
  if (/Windows NT 10\.0/i.test(ua)) return 'Windows 10/11'
  if (/Windows NT 6\.3/i.test(ua)) return 'Windows 8.1'
  if (/Windows NT 6\.2/i.test(ua)) return 'Windows 8'
  if (/Windows NT 6\.1/i.test(ua)) return 'Windows 7'
  if (/Windows/i.test(ua)) return 'Windows'
  return ''
}

function osName(ua: string, platform: string, platformVersion: string): string {
  const name = platform.toLowerCase()
  if (name === 'windows' || /Windows/i.test(ua)) return windowsName(ua, platformVersion)

  const android = ua.match(/Android (\d+)/i)
  if (name === 'android' || android) return android ? `Android ${android[1]}` : 'Android'

  const apple = ua.match(/OS (\d+)[_\d]*/i)
  if (/iPad/i.test(ua)) return apple ? `iPadOS ${apple[1]}` : 'iPadOS'
  if (name === 'ios' || /iPhone|iPod/i.test(ua)) return apple ? `iOS ${apple[1]}` : 'iOS'

  if (name === 'macos' || name === 'mac' || /Mac OS X|Macintosh/i.test(ua)) {
    const mac = ua.match(/Mac OS X (\d+)[_.](\d+)/i)
    if (mac && Number(mac[1]) >= 11) return `macOS ${mac[1]}`
    return 'macOS'
  }

  if (name === 'chrome os' || name === 'chromeos' || /CrOS/i.test(ua)) return 'ChromeOS'
  if (name === 'linux' || /Linux/i.test(ua)) return 'Linux'
  return ''
}

function formFactor(ua: string, platform: string, mobile: boolean): string {
  if (/iPad/i.test(ua)) return 'Tablet'
  if (/iPhone|iPod/i.test(ua) || platform.toLowerCase() === 'ios') return 'Phone'
  if (/Android/i.test(ua) || platform.toLowerCase() === 'android') {
    return /Mobile/i.test(ua) || mobile ? 'Phone' : 'Tablet'
  }
  if (mobile) return 'Phone'
  return 'PC'
}

/** Ví dụ: "PC · Windows 10/11 · Chrome". */
export function formatClientDevice(headers: Headers): string {
  const ua = headers.get('user-agent') || ''
  const platform = unquote(headers.get('sec-ch-ua-platform') || '')
  const platformVersion = unquote(headers.get('sec-ch-ua-platform-version') || '')
  const mobile = headers.get('sec-ch-ua-mobile') === '?1'
  const kind = formFactor(ua, platform, mobile)
  const os = osName(ua, platform, platformVersion)
  const browser =
    browserNameFromBrands(headers.get('sec-ch-ua') || '') || browserNameFromUserAgent(ua)

  return [kind, os, browser].filter(Boolean).join(' · ')
}
