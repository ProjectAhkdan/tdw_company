"use client"

import { useCallback } from 'react'

export function useLocale() {
  const formatDate = useCallback((date: string | Date, options?: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat('id-ID', options).format(new Date(date))
  }, [])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount)
  }, [])

  return { formatDate, formatCurrency }
}

