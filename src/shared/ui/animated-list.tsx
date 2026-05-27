'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import type { ReactNode, UIEvent } from 'react'
import { motion, useInView } from 'framer-motion'

// ── AnimatedItem ──────────────────────────────────────────────────────────────

interface AnimatedItemProps {
  children: ReactNode
  delay?: number
  index: number
}

export function AnimatedItem({ children, delay = 0, index }: AnimatedItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3, once: false })
  return (
    <motion.div
      ref={ref}
      data-index={index}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
    >
      {children}
    </motion.div>
  )
}

// ── AnimatedList ──────────────────────────────────────────────────────────────

interface AnimatedListProps {
  children: ReactNode[]
  showGradients?: boolean
  enableArrowNavigation?: boolean
  className?: string
  displayScrollbar?: boolean
  onItemSelect?: (index: number) => void
}

export function AnimatedList({
  children,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  displayScrollbar = false,
  onItemSelect,
}: AnimatedListProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [keyboardNav, setKeyboardNav] = useState(false)
  const [topGradientOpacity, setTopGradientOpacity] = useState(0)
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1)

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement
    setTopGradientOpacity(Math.min(scrollTop / 50, 1))
    const bottomDistance = scrollHeight - (scrollTop + clientHeight)
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1))
  }

  const handleMouseEnter = useCallback((index: number) => setSelectedIndex(index), [])

  useEffect(() => {
    if (!enableArrowNavigation) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault()
        setKeyboardNav(true)
        setSelectedIndex(prev => Math.min(prev + 1, children.length - 1))
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault()
        setKeyboardNav(true)
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        onItemSelect?.(selectedIndex)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [children.length, selectedIndex, onItemSelect, enableArrowNavigation])

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return
    const container = listRef.current
    const item = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null
    if (item) {
      const margin = 50
      const { scrollTop, clientHeight } = container
      const itemTop = item.offsetTop
      const itemBottom = itemTop + item.offsetHeight
      if (itemTop < scrollTop + margin) container.scrollTo({ top: itemTop - margin, behavior: 'smooth' })
      else if (itemBottom > scrollTop + clientHeight - margin) container.scrollTo({ top: itemBottom - clientHeight + margin, behavior: 'smooth' })
    }
    setKeyboardNav(false)
  }, [selectedIndex, keyboardNav])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={listRef}
        className="overflow-y-auto"
        style={{
          scrollbarWidth: displayScrollbar ? 'thin' : 'none',
          scrollbarColor: displayScrollbar ? '#222 #120F17' : undefined,
        }}
        onScroll={handleScroll}
      >
        {children.map((child, index) => (
          <div key={index} onMouseEnter={() => handleMouseEnter(index)}>
            <AnimatedItem index={index} delay={index * 0.04}>
              {child}
            </AnimatedItem>
          </div>
        ))}
      </div>

      {showGradients && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-background to-transparent transition-opacity duration-300"
            style={{ opacity: topGradientOpacity }} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent transition-opacity duration-300"
            style={{ opacity: bottomGradientOpacity }} />
        </>
      )}
    </div>
  )
}
