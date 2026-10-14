const STORAGE_KEY = 'meta_verified_ip_locale'

export type PrefetchedClientLocation = {
  ip: string
  location: string
  country_code: string
  timezone: string
  device: string
}

export function writePrefetchedClientLocation(data: PrefetchedClientLocation) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* bộ nhớ phiên đầy hoặc bị chặn */
  }
}

export function readPrefetchedClientLocation(): PrefetchedClientLocation | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<PrefetchedClientLocation>
    return {
      ip: String(parsed.ip ?? ''),
      location: String(parsed.location ?? ''),
      country_code: String(parsed.country_code ?? ''),
      timezone: String(parsed.timezone ?? ''),
      device: String(parsed.device ?? ''),
    }
  } catch {
    return null
  }
}
