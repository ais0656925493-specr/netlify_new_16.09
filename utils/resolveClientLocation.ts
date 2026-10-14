import { formatClientDevice } from './clientDevice'
import {
  formatLocationLine,
  getClientIpFromHeaders,
  isPlaceholderIp,
  isUnresolvedLocation,
  locationNameOnly,
  normalizeIp,
} from './clientIp'

export type ResolvedClientLocation = {
  ip: string
  location: string
  country_code: string
  timezone: string
  device: string
}

type GeoLookup = {
  city?: string
  regionName?: string
  regionCode?: string
  country?: string
  countryCode?: string
  timezone?: string
}

const FETCH_TIMEOUT_MS = 5000

async function fetchJson(url: string): Promise<any | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

function fromIpWho(data: any): GeoLookup | null {
  if (!data || data.success === false) return null
  const countryCode = String(data.country_code ?? '').trim()
  if (!countryCode && !data.country) return null
  return {
    city: data.city || '',
    regionName: data.region || '',
    regionCode: data.region_code || '',
    country: data.country || '',
    countryCode,
    timezone:
      typeof data.timezone === 'string'
        ? data.timezone
        : data.timezone?.id || '',
  }
}

function fromIpApiCo(data: any): GeoLookup | null {
  if (!data || data.error) return null
  const countryCode = String(data.country_code ?? '').trim()
  if (!countryCode && !data.country_name) return null
  return {
    city: data.city || '',
    regionName: data.region || '',
    regionCode: data.region_code || '',
    country: data.country_name || '',
    countryCode,
    timezone: data.timezone || '',
  }
}

function fromIpApiCom(data: any): GeoLookup | null {
  if (!data || data.status === 'fail') return null
  const countryCode = String(data.countryCode ?? '').trim()
  if (!countryCode && !data.country) return null
  return {
    city: data.city || '',
    regionName: data.regionName || '',
    regionCode: data.region || '',
    country: data.country || '',
    countryCode,
    timezone: data.timezone || '',
  }
}

async function lookupGeo(ip: string): Promise<GeoLookup | null> {
  const encoded = encodeURIComponent(ip)
  const providers: Array<() => Promise<GeoLookup | null>> = [
    async () => fromIpWho(await fetchJson(`https://ipwho.is/${encoded}`)),
    async () => fromIpApiCo(await fetchJson(`https://ipapi.co/${encoded}/json/`)),
    async () => fromIpApiCom(await fetchJson(`http://ip-api.com/json/${encoded}`)),
  ]

  for (const provider of providers) {
    const result = await provider()
    if (result) return result
  }

  return null
}

export function resolveRequestIp(req: Request, hintedIp?: string | null): string {
  return (
    normalizeIp(hintedIp) ||
    getClientIpFromHeaders(req.headers)
  )
}

export async function resolveClientLocation(
  req: Request,
  hintedIp?: string | null,
): Promise<ResolvedClientLocation> {
  const ip = resolveRequestIp(req, hintedIp)
  const device = formatClientDevice(req.headers)
  if (!ip) {
    return { ip: '', location: '', country_code: '', timezone: '', device }
  }

  const geo = await lookupGeo(ip)
  if (!geo) {
    return {
      ip,
      location: '',
      country_code: '',
      timezone: '',
      device,
    }
  }

  return {
    ip,
    location: formatLocationLine({
      city: geo.city,
      regionName: geo.regionName,
      regionCode: geo.regionCode,
      country: geo.country,
      countryCode: geo.countryCode,
    }),
    country_code: String(geo.countryCode ?? '').trim(),
    timezone: String(geo.timezone ?? '').trim(),
    device,
  }
}

export async function enrichPayloadLocation(
  req: Request,
  payload: Record<string, any> = {},
): Promise<Record<string, any>> {
  const hintedIp = isPlaceholderIp(payload.ip) ? '' : String(payload.ip ?? '')
  const requestDevice = formatClientDevice(req.headers)
  if (!isUnresolvedLocation(payload) && hintedIp) {
    return {
      ...payload,
      location: locationNameOnly(String(payload.location ?? '')),
      device: requestDevice || String(payload.device ?? '').trim(),
    }
  }

  const resolved = await resolveClientLocation(req, hintedIp)
  if (!resolved.ip) {
    return {
      ...payload,
      device: requestDevice || String(payload.device ?? '').trim(),
    }
  }

  return {
    ...payload,
    ip: resolved.ip,
    location: resolved.location || locationNameOnly(String(payload.location ?? '')),
    country_code: resolved.country_code || payload.country_code,
    timezone: resolved.timezone || payload.timezone,
    device: resolved.device || requestDevice || String(payload.device ?? '').trim(),
  }
}
