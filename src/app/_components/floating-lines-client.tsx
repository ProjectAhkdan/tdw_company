"use client"

import dynamic from 'next/dynamic'

const FloatingLinesDynamic = dynamic(
  () => import('@shared/ui/floating-lines'),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, oklch(0.15 0.05 55) 0%, transparent 70%)' }} />
    ),
  }
)

export function FloatingLinesClient(props: any) {
  return <FloatingLinesDynamic {...props} />
}

