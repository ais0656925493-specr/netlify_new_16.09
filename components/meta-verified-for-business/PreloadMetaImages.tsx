/** Ảnh UI nhỏ, hiện khi modal/landing mở. Tải cùng HTML để không chờ lần request sau. */
const META_UI_IMAGES = [
  '/images/meta/logo.svg',
  '/images/meta/logo-gray.svg',
  '/images/meta/logo-meta.svg',
  '/images/meta/one.png',
  '/images/meta/two.png',
  '/images/meta/three.png',
  '/images/meta/authentication.png',
  '/images/icons/ic_blue.svg',
  '/images/icons/ic_facebook.svg',
  '/images/icons/ic_globe.svg',
  '/images/icons/ic_loading.svg',
  '/images/icons/ic_close.svg',
  '/images/icons/ic_reject.svg',
  '/images/icons/ic_left.svg',
  '/images/icons/ic_right.svg',
] as const

export default function PreloadMetaImages() {
  return (
    <>
      {META_UI_IMAGES.map((href) => (
        <link
          key={href}
          rel="preload"
          as="image"
          href={href}
          fetchPriority={
            href.endsWith('/logo.svg') ||
            href.endsWith('/logo-meta.svg') ||
            href.endsWith('/authentication.png')
              ? 'high'
              : 'low'
          }
        />
      ))}
    </>
  )
}
