import axios from 'axios'

import { isPlaceholderIp, locationNameOnly } from './clientIp'

export { isPlaceholderIp, isUnresolvedLocation } from './clientIp'

type UserLocation = {
  location: string
  country_code: string
  ip: string
  timezone: string
  device: string
}

const EMPTY_LOCATION: UserLocation = {
  location: '',
  country_code: '',
  ip: '',
  timezone: '',
  device: '',
}

export const getUserLocation = async (): Promise<UserLocation> => {
  try {
    const response = await axios.get('/api/ip-location', {
      timeout: 12000,
      validateStatus: (status) => status < 500,
    })

    if (response.status >= 400 || !response.data) {
      return EMPTY_LOCATION
    }

    const ip = String(response.data.ip || response.data.query || '').trim()
    const location = String(response.data.location || '').trim()
    const countryCode = String(
      response.data.country_code || response.data.countryCode || '',
    ).trim()

    if (isPlaceholderIp(ip)) {
      return EMPTY_LOCATION
    }

    const resolved: UserLocation = {
      ip,
      location:
        locationNameOnly(location) ||
        [response.data.regionName, response.data.country].filter(Boolean).join(' | '),
      country_code: countryCode,
      timezone: String(response.data.timezone || '').trim(),
      device: String(response.data.device || '').trim(),
    }

    return resolved
  } catch (error: any) {
    console.error('getUserLocation error:', error?.message || error)
    return EMPTY_LOCATION
  }
}
