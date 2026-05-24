import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import localFont from 'next/font/local'
import { Toaster } from '@shared/ui/sonner'
import { CookieBannerClient } from '@/app/_components/cookie-banner-client'
import { Analytics } from '@vercel/analytics/next'
import '@/app/globals.css'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tdwresources.id'

const adero = localFont({
  src: [
    { path: '../../public/fonts/adero/AderoTrial-Thin.otf', weight: '100', style: 'normal' },
    { path: '../../public/fonts/adero/AderoTrial-ExtraLight.otf', weight: '200', style: 'normal' },
    { path: '../../public/fonts/adero/AderoTrial-Light.otf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/adero/AderoTrial-Regular.otf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/adero/AderoTrial-Medium.otf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/adero/AderoTrial-SemiBold.otf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/adero/AderoTrial-Bold.otf', weight: '700', style: 'normal' },
    { path: '../../public/fonts/adero/AderoTrial-ExtraBold.otf', weight: '800', style: 'normal' },
    { path: '../../public/fonts/adero/AderoTrial-Black.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-custom-display',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-custom-sans',
  display: 'swap',
})

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
  return (
    <html lang="id" className={`dark ${poppins.variable} ${adero.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <Toaster position="top-center" />
        <CookieBannerClient />
        <Analytics />
      </body>
    </html>
  )
}
