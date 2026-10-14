const PLACEHOLDER_IPS = new Set(['', '0.0.0.0', '::', '::0', 'unknown', 'undefined', 'null'])

export function isPlaceholderIp(value: unknown): boolean {
  const ip = String(value ?? '').trim()
  if (!ip) return true
  if (PLACEHOLDER_IPS.has(ip.toLowerCase())) return true
  return false
}

export function isUnresolvedLocation(data?: {
  ip?: string
  location?: string
}): boolean {
  const ip = String(data?.ip ?? '').trim()
  const location = String(data?.location ?? '').trim()
  if (isPlaceholderIp(ip)) return true
  if (!location || !locationNameOnly(location)) return true
  if (location.startsWith('0.0.0.0')) return true
  if (/\bUnknown\s*\(\s*US\s*\)/i.test(location) && /Unknown/i.test(location)) {
    return true
  }
  if (!hasCountryAbbrev(location)) return true
  return false
}

/** Quốc gia đã có mã viết tắt, ví dụ "Vietnam (VN)". */
export function hasCountryAbbrev(location: string): boolean {
  return /\([A-Za-z]{2}\)\s*$/.test(location.trim())
}

export function normalizeIp(raw?: string | null): string {
  if (!raw) return ''
  let ip = raw.trim()
  if (!ip) return ''

  if (ip.startsWith('[') && ip.endsWith(']')) {
    ip = ip.slice(1, -1)
  }

  const zoneIndex = ip.indexOf('%')
  if (zoneIndex >= 0) ip = ip.slice(0, zoneIndex)

  if (ip.toLowerCase().startsWith('::ffff:')) {
    ip = ip.slice(7)
  }

  const withPort = ip.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/)
  if (withPort) ip = withPort[1]

  if (ip === '::1') ip = '127.0.0.1'
  if (isPlaceholderIp(ip)) return ''
  return ip
}

export function getClientIpFromHeaders(headers: Headers): string {
  const candidates = [
    headers.get('x-nf-client-connection-ip'),
    headers.get('cf-connecting-ip'),
    headers.get('true-client-ip'),
    headers.get('x-real-ip'),
    headers.get('x-client-ip'),
    headers.get('x-vercel-forwarded-for'),
    headers.get('x-forwarded-for'),
    headers.get('x-forwarded'),
    headers.get('forwarded'),
  ]

  for (const candidate of candidates) {
    const ip = pickFirstPublicIp(candidate)
    if (ip) return ip
  }

  return ''
}

function pickFirstPublicIp(raw?: string | null): string {
  if (!raw) return ''

  const forwarded = raw.match(/for="?\[?([^;"\]]+)/i)
  const value = forwarded ? forwarded[1] : raw

  for (const part of value.split(',')) {
    const ip = normalizeIp(part)
    if (ip) return ip
  }

  return ''
}

function isIpToken(value: string): boolean {
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(value)) return true
  return value.includes(':') && /^[0-9a-f:]+$/i.test(value)
}

/** Bỏ đoạn IP nếu chuỗi location cũ còn dạng "ip | tên". */
export function locationNameOnly(location: string): string {
  return location
    .split('|')
    .map((part) => part.trim())
    .filter((part) => part && !isIpToken(part))
    .join(' | ')
}

function withAbbrev(name: string, code: string): string {
  if (name && code) return `${name} (${code})`
  return name || (code ? `(${code})` : '')
}

export function formatLocationLine(input: {
  city?: string
  regionName?: string
  regionCode?: string
  country?: string
  countryCode?: string
}): string {
  const city = String(input.city ?? '').trim()
  const regionName = String(input.regionName ?? '').trim()
  const regionCode = String(input.regionCode ?? '').trim()
  const country = String(input.country ?? '').trim()
  const countryCode = String(input.countryCode ?? '').trim()

  const samePlace =
    city &&
    regionName &&
    city.localeCompare(regionName, undefined, { sensitivity: 'accent' }) === 0
  const region = withAbbrev(regionName, regionCode)
  const countryPart = withAbbrev(country, countryCode)

  return [samePlace ? '' : city, region, countryPart].filter(Boolean).join(' | ')
}
