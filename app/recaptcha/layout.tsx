import type { ReactNode } from 'react'

import PreloadMetaImages from '@/components/meta-verified-for-business/PreloadMetaImages'

/** Chạy khi HTML được parse, trước hydration — khóa tiếng Anh trước lần vẽ đầu. */
const LOCK_ENGLISH_SCRIPT = `(function(){var h=document.documentElement;if(!h)return;h.lang='en';h.dataset.locale='en';h.dir='ltr';h.setAttribute('translate','no');h.classList.add('notranslate');})();`

export default function RecaptchaLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: LOCK_ENGLISH_SCRIPT }} />
      <PreloadMetaImages />
      {children}
    </>
  )
}
