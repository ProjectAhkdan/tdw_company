import { cookies } from 'next/headers'
import id from '@/messages/id.json'
import en from '@/messages/en.json'

export type Locale = 'id' | 'en'
export type Messages = typeof id

const messages: Record<Locale, Messages> = { id, en }

/** Server-side: get locale from cookie */
export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const val = store.get('NEXT_LOCALE')?.value
  return (val === 'en' ? 'en' : 'id') as Locale
}

/** Server-side: get translation function */
export async function getTranslations() {
  const locale = await getLocale()
  return { t: messages[locale], locale }
}

/** Nested key access: t('nav.seminars') */
export function get(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return ''
  }, obj) as string ?? path
}

/** Format date by locale */
export function formatDate(date: string | Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', options).format(new Date(date))
}

/** Format currency */
export function formatCurrency(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
