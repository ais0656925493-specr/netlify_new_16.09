import type { ReactNode } from 'react'

import PreloadMetaImages from '@/components/meta-verified-for-business/PreloadMetaImages'

export default function BusinessCenterLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PreloadMetaImages />
      {children}
    </>
  )
}
