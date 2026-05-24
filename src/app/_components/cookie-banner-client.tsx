'use client'

import dynamic from 'next/dynamic'

const CookieBanner = dynamic(
  () => import('@shared/ui/cookie-banner').then((mod) => mod.CookieBanner),
  { ssr: false },
)

export function CookieBannerClient() {
  return <CookieBanner />
}


