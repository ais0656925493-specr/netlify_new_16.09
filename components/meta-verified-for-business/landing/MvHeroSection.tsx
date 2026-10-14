'use client'

import Image from 'next/image'
import React from 'react'

import ActivationRefChip from '@/components/meta-verified-for-business/ActivationRefChip'
import MvPromoVideo from '@/components/meta-verified-for-business/landing/MvPromoVideo'
import MvSignUpButton from '@/components/meta-verified-for-business/landing/MvSignUpButton'
import { useLandingStrings } from '@/hooks/useLandingStrings'

type MvHeroSectionProps = {
  onSignUp: () => void
}

export default function MvHeroSection({ onSignUp }: MvHeroSectionProps) {
  const t = useLandingStrings()

  return (
    <section className="mv-hero mv-section mv-section-lg" aria-labelledby="mv-hero-title">
      <div className="mv-section-container">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] lg:gap-14 xl:gap-20">
          <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
            <Image
              src="/images/icons/ic_blue.svg"
              alt={t.hero.badgeAlt}
              width={72}
              height={72}
              priority
              unoptimized
              className="mv-hero-badge"
            />

            <h1 id="mv-hero-title" className="mv-hero-title">
              {t.hero.title}
            </h1>

            <p className="mv-hero-lead mt-5 max-w-[36rem]">{t.hero.lead}</p>

            <div className="mt-8 w-full max-w-[22.5rem]">
              <MvSignUpButton onSignUp={onSignUp} />
            </div>

            <div className="mt-4 flex w-full justify-center lg:justify-start">
              <ActivationRefChip className="!mt-0" />
            </div>

            <p className="mv-hero-note mt-5 max-w-[35rem]">{t.hero.eligibility}</p>
          </div>

          <div className="order-1 w-full min-w-0 lg:order-2 lg:justify-self-stretch">
            <MvPromoVideo ariaLabel={t.hero.videoAria} className="mx-auto w-full lg:mx-0 lg:max-w-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
