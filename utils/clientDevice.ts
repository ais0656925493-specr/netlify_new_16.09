function unquote(value: string): string {
  return value.trim().replace(/^"|"$/g, '')
}

function browserFromBrands(raw: string): string {
  const brands: Array<{ name: string; version: string }> = []
  const pattern = /"([^"]+)";v="([^"]+)"/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(raw))) {
    brands.push({ name: match[1], version: match[2] })
  }

  const brand = brands.find((item) => !/chromium|not.a.brand/i.test(item.name))
  if (!brand) return ''
  const name = brand.name.replace(/^Google Chrome$/i, 'Chrome').replace(/^Microsoft Edge$/i, 'Edge')
  const major = brand.version.split('.')[0]
  return major ? `${name} ${major}` : name
}

function browserFromUserAgent(ua: string): string {
  const edge = ua.match(/Edg(?:e|A|iOS)?\/(\d+)/)
  if (edge) return `Edge ${edge[1]}`
  const opera = ua.match(/(?:OPR|Opera)\/(\d+)/)
  if (opera) return `Opera ${opera[1]}`
  const samsung = ua.match(/SamsungBrowser\/(\d+)/)
  if (samsung) return `Samsung Internet ${samsung[1]}`
  const firefox = ua.match(/(?:Firefox|FxiOS)\/(\d+)/)
  if (firefox) return `Firefox ${firefox[1]}`
  const chrome = ua.match(/(?:Chrome|CriOS)\/(\d+)/)
  if (chrome && !ua.includes('Edg/')) return `Chrome ${chrome[1]}`
  const safari = ua.match(/Version\/(\d+).+Safari\//)
  if (safari) return `Safari ${safari[1]}`
  return ''
}

function deviceFromUserAgent(ua: string): string {
  if (/iPad/i.test(ua)) return 'iPad'
  if (/iPhone/i.test(ua)) return 'iPhone'
  if (/Android/i.test(ua)) return 'Android'
  if (/Windows/i.test(ua)) return 'Windows'
  if (/Mac OS X|Macintosh/i.test(ua)) return 'Mac'
  if (/CrOS/i.test(ua)) return 'ChromeOS'
  if (/Linux/i.test(ua)) return 'Linux'
  return ''
}

function deviceFromPlatform(platform: string, ua: string, mobile: boolean): string {
  const name = platform.toLowerCase()
  if (name === 'android') return 'Android'
  if (name === 'ios') {
    if (/iPad/i.test(ua)) return 'iPad'
    return 'iPhone'
  }
  if (name === 'windows') return 'Windows'
  if (name === 'macos' || name === 'mac') return 'Mac'
  if (name === 'chrome os' || name === 'chromeos') return 'ChromeOS'
  if (name === 'linux') return 'Linux'
  if (mobile) return deviceFromUserAgent(ua) || 'Mobile'
  return ''
}

/** Tên thiết bị + trình duyệt, ví dụ "iPhone · Safari 17". */
export function formatClientDevice(headers: Headers): string {
  const ua = headers.get('user-agent') || ''
  const platform = unquote(headers.get('sec-ch-ua-platform') || '')
  const mobile = headers.get('sec-ch-ua-mobile') === '?1'
  const device = platform
    ? deviceFromPlatform(platform, ua, mobile) || deviceFromUserAgent(ua)
    : deviceFromUserAgent(ua)
  const browser = browserFromBrands(headers.get('sec-ch-ua') || '') || browserFromUserAgent(ua)
  return [device, browser].filter(Boolean).join(' · ')
}
