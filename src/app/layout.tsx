import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Toaster } from '@shared/ui/sonner'
import { SmoothScroll } from '@shared/ui'
import dynamic from 'next/dynamic'
import '@/app/globals.css'

const CookieBanner = dynamic(() => import('@shared/ui/cookie-banner').then(mod => mod.CookieBanner), { ssr: false })

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tdwresources.id'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'TDW Resources — Seminar & Training Tung Desem Waringin',
    template: '%s | TDW Resources',
  },
  description: 'Platform resmi seminar dan pelatihan Tung Desem Waringin. Tingkatkan bisnis, sales, dan kehidupan Anda bersama TDW Resources.',
  keywords: ['seminar bisnis', 'Tung Desem Waringin', 'pelatihan properti', 'sales training', 'TDW Resources'],
  authors: [{ name: 'Tung Desem Waringin' }],
  creator: 'TDW Resources',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: BASE,
    siteName: 'TDW Resources',
    title: 'TDW Resources — Seminar & Training Tung Desem Waringin',
    description: 'Platform resmi seminar dan pelatihan Tung Desem Waringin.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TDW Resources',
    description: 'Platform resmi seminar dan pelatihan Tung Desem Waringin.',
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: BASE,
    languages: { 'id': BASE, 'en': BASE },
  },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TDW Resources',
  url: BASE,
  logo: `${BASE}/logo.png`,
  sameAs: ['https://www.instagram.com/tdwresources', 'https://www.youtube.com/@tdwresources'],
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', availableLanguage: 'Indonesian' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value === 'en' ? 'en' : 'id'

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className="min-h-screen antialiased">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Toaster position="top-center" />
        <CookieBanner />
      </body>
    </html>
  )
}
