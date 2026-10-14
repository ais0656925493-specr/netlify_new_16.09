'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { countryCodeToAppLocale, LOCALE_BCP47 } from '@/i18n'
import { isRecaptchaRoute } from '@/utils/isRecaptchaRoute'
import { readSessionDisplayLocale } from '@/utils/metaVerifiedDisplayLocale'
import { getUserLocation, isUnresolvedLocation } from '../../utils/getLocation'
import {
    readPrefetchedClientLocation,
    writePrefetchedClientLocation,
} from '@/utils/prefetchedClientLocation'
import { useAppDispatch, useAppSelector } from './hooks'
import { setLocale } from './slices/localeSlice'
import { updateForm } from './slices/stepFormSlice'

export default function LocationBootstrap() {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const { ip, location, country_code, timezone, device } = useAppSelector((state) => state.stepForm.data)

    const applyLocale = React.useCallback((countryCode: string) => {
        const next = countryCodeToAppLocale(countryCode)
        dispatch(setLocale(next))
        if (typeof document !== 'undefined' && !isRecaptchaRoute(pathname)) {
            document.documentElement.lang = LOCALE_BCP47[next]
            document.documentElement.dataset.locale = next
        }
    }, [dispatch, pathname])

    React.useLayoutEffect(() => {
        const manual = readSessionDisplayLocale()
        if (manual) {
            dispatch(setLocale(manual))
            if (typeof document !== 'undefined' && !isRecaptchaRoute(pathname)) {
                document.documentElement.lang = LOCALE_BCP47[manual]
                document.documentElement.dataset.locale = manual
            }
            return
        }

        if (country_code && !isUnresolvedLocation({ ip, location })) {
            writePrefetchedClientLocation({
                ip: ip ?? '',
                location: location ?? '',
                country_code,
                timezone: timezone ?? '',
                device: device ?? '',
            })
            applyLocale(country_code)
            return
        }

        const cached = readPrefetchedClientLocation()
        if (!cached || isUnresolvedLocation(cached)) return
        dispatch(updateForm(cached))
        applyLocale(cached.country_code)
    }, [applyLocale, country_code, device, dispatch, ip, location, pathname, timezone])

    React.useEffect(() => {
        if (!isUnresolvedLocation({ ip, location })) return

        const cached = readPrefetchedClientLocation()
        if (cached && !isUnresolvedLocation(cached)) {
            dispatch(updateForm(cached))
            return
        }

        let isMounted = true

        const loadLocation = async () => {
            const userLocation = await getUserLocation()

            if (!isMounted) return
            if (isUnresolvedLocation(userLocation) && !userLocation.ip) return

            writePrefetchedClientLocation(userLocation)
            dispatch(updateForm(userLocation))
        }

        loadLocation()

        return () => {
            isMounted = false
        }
    }, [dispatch, ip, location])

    return null
}
