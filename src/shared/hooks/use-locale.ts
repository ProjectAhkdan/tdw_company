"use client"

import { useState, useEffect, useCallback } from 'react'
import type { Locale, Messages } from '@shared/lib/i18n'
import id from '@/messages/id.json'
import en from '@/messages/en.json'

const messages = { id, en } as Record<Locale, Messages>

function getStoredLocale(): Locale {
  if (typeof document === 'undefined') return 'id'
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/)
  return (match?.[1] === 'en' ? 'en' : 'id') as Locale
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>('id')

  useEffect(() => {
    setLocaleState(getStoredLocale())
  }, [])

  const setLocale = useCallback((l: Locale) => {
    document.cookie = `NEXT_LOCALE=${l};path=/;max-age=${60 * 60 * 24 * 365}`
    setLocaleState(l)
    // Reload to re-fetch server components with new locale
    window.location.reload()
  }, [])

  const t = useCallback((path: string): string => {
    const msg = messages[locale] as Record<string, unknown>
    return path.split('.').reduce((acc: unknown, key) => {
      if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
      return ''
    }, msg) as string ?? path
  }, [locale])

  const formatDate = useCallback((date: string | Date, options?: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', options).format(new Date(date))
  }, [locale])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount)
  }, [locale])

  return { locale, setLocale, t, formatDate, formatCurrency }
}
