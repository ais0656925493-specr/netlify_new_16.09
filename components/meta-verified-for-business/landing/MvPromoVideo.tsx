'use client'

import React from 'react'

import {
  META_VERIFIED_PROMO_VIDEO_POSTER,
  META_VERIFIED_PROMO_VIDEO_SRC,
} from '@/data/metaVerifiedLanding'

type MvPromoVideoProps = {
  ariaLabel: string
  className?: string
}

export default function MvPromoVideo({ ariaLabel, className = '' }: MvPromoVideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tryPlay = () => {
      void video.play().catch(() => {})
    }

    tryPlay()
    video.addEventListener('canplay', tryPlay)
    return () => video.removeEventListener('canplay', tryPlay)
  }, [])

  return (
    <div className={`mv-promo-video-wrap ${className}`.trim()}>
      <video
        ref={videoRef}
        className="mv-promo-video"
        src={META_VERIFIED_PROMO_VIDEO_SRC}
        poster={META_VERIFIED_PROMO_VIDEO_POSTER}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        aria-label={ariaLabel}
      />
    </div>
  )
}
