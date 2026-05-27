'use client'

import React from 'react'

export interface DockItemData {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  active?: boolean
  className?: string
}

interface DockProps {
  items: DockItemData[]
  baseItemSize?: number
  magnification?: number
  distance?: number
  panelHeight?: number
  className?: string
}

export default function Dock({ items, baseItemSize = 44, panelHeight = 56, className = '' }: DockProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} style={{ height: panelHeight }}>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          aria-label={item.label}
          style={{
            width: baseItemSize,
            height: baseItemSize,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: item.active ? 'rgba(217,242,93,0.12)' : 'oklch(0.14 0.012 255 / 0.7)',
            border: item.active ? '1.5px solid rgba(217,242,93,0.4)' : '1px solid oklch(0.25 0.012 255 / 0.5)',
            boxShadow: item.active ? '0 0 0 2px rgba(217,242,93,0.25), 0 0 16px rgba(217,242,93,0.15)' : undefined,
            cursor: 'pointer',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (!item.active) (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
          }}
        >
          {item.icon}
        </button>
      ))}
    </div>
  )
}
