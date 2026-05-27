'use client'

import React, { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

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

function DockItem({
  item,
  mouseX,
  baseItemSize,
  magnification,
  distance,
}: {
  item: DockItemData
  mouseX: ReturnType<typeof useMotionValue<number>>
  baseItemSize: number
  magnification: number
  distance: number
}) {
  const ref = useRef<HTMLButtonElement>(null)

  const itemX = useMotionValue(Infinity)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) itemX.set(e.clientX - rect.left - rect.width / 2)
  }, [itemX])

  const size = useSpring(
    useTransform(mouseX, (val) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return baseItemSize
      const center = rect.left + rect.width / 2
      const dist = Math.abs(val - center)
      return dist < distance
        ? baseItemSize + (magnification - baseItemSize) * (1 - dist / distance)
        : baseItemSize
    }),
    { stiffness: 300, damping: 25 }
  )

  return (
    <motion.button
      ref={ref}
      onClick={item.onClick}
      aria-label={item.label}
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center rounded-2xl transition-shadow ${item.className ?? ''}`}
      whileTap={{ scale: 0.92 }}
    >
      <div
        className="flex h-full w-full items-center justify-center rounded-2xl"
        style={{
          background: item.active
            ? 'rgba(217,242,93,0.12)'
            : 'oklch(0.14 0.012 255 / 0.7)',
          border: item.active
            ? '1.5px solid rgba(217,242,93,0.4)'
            : '1px solid oklch(0.25 0.012 255 / 0.5)',
          boxShadow: item.active
            ? '0 0 0 2px rgba(217,242,93,0.25), 0 0 16px rgba(217,242,93,0.15)'
            : undefined,
        }}
      >
        {item.icon}
      </div>
      {/* Label tooltip */}
      <span
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-medium opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: 'oklch(0.11 0.009 255)',
          border: '1px solid oklch(0.25 0.012 255 / 0.5)',
          color: 'oklch(0.9 0.005 60)',
        }}
      >
        {item.label}
      </span>
    </motion.button>
  )
}

export default function Dock({
  items,
  baseItemSize = 44,
  magnification = 56,
  distance = 100,
  panelHeight = 56,
  className = '',
}: DockProps) {
  const mouseX = useMotionValue(Infinity)

  return (
    <div
      className={`flex items-center justify-center gap-3 ${className}`}
      style={{ height: panelHeight }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {items.map((item, i) => (
        <DockItem
          key={i}
          item={item}
          mouseX={mouseX}
          baseItemSize={baseItemSize}
          magnification={magnification}
          distance={distance}
        />
      ))}
    </div>
  )
}
