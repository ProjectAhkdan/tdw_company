"use client"

import dynamic from 'next/dynamic'

const FlowingMenuDynamic = dynamic(
  () => import('@shared/ui/flowing-menu'),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'oklch(0.45 0.01 60)', fontSize: '0.875rem' }}>
        Memuat FAQ...
      </div>
    ),
  }
)

export function FlowingMenuClient(props: any) {
  return <FlowingMenuDynamic {...props} />
}

