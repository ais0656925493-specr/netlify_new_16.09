'use client'

import Image from 'next/image'
import React from 'react'

import PrivacyLanguagePicker from '@/components/meta-verified-for-business/PrivacyLanguagePicker'
import { useLandingStrings } from '@/hooks/useLandingStrings'

export default function MvSiteHeader() {
  const t = useLandingStrings()

  return (
    <header className="mv-site-header sticky top-0 z-40 w-full shrink-0">
      <div className="mv-section-container flex h-[3.25rem] items-center justify-between gap-3 sm:h-14">
        <div className="flex min-w-0 flex-1 items-center gap-5 lg:gap-8">
          <div
            className="mv-header-logo flex shrink-0 items-center"
            aria-label={t.header.logoLabel}
          >
            <Image
              src="/images/meta/logo-meta.svg"
              alt=""
              width={329}
              height={66}
              className="mv-header-logo-img"
              priority
              unoptimized
            />
          </div>

          <nav className="hidden items-center gap-7 lg:flex" aria-label={t.header.logoLabel}>
            {t.header.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="mv-header-nav-link whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <PrivacyLanguagePicker />
        </div>
      </div>
    </header>
  )
}
