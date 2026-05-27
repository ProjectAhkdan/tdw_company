'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type LogoItem =
  | { node: React.ReactNode; href?: string; title?: string; ariaLabel?: string }
  | { src: string; alt?: string; href?: string; title?: string; srcSet?: string; sizes?: string; width?: number; height?: number }

export interface LogoLoopProps {
  logos: LogoItem[]
  speed?: number
  direction?: 'left' | 'right' | 'up' | 'down'
  width?: number | string
  logoHeight?: number
  gap?: number
  pauseOnHover?: boolean
  hoverSpeed?: number
  fadeOut?: boolean
  fadeOutColor?: string
  scaleOnHover?: boolean
  renderItem?: (item: LogoItem, key: React.Key) => React.ReactNode
  ariaLabel?: string
  className?: string
  style?: React.CSSProperties
}

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 } as const
const toCssLength = (v?: number | string) => typeof v === 'number' ? `${v}px` : (v ?? undefined)
const cx = (...p: Array<string | false | null | undefined>) => p.filter(Boolean).join(' ')

const useResizeObserver = (cb: () => void, els: Array<React.RefObject<Element | null>>, deps: React.DependencyList) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      window.addEventListener('resize', cb); cb()
      return () => window.removeEventListener('resize', cb)
    }
    const obs = els.map(r => { if (!r.current) return null; const o = new ResizeObserver(cb); o.observe(r.current); return o })
    cb()
    return () => obs.forEach(o => o?.disconnect())
  }, deps)
}

const useImageLoader = (seqRef: React.RefObject<HTMLUListElement | null>, onLoad: () => void, deps: React.DependencyList) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? []
    if (images.length === 0) { onLoad(); return }
    let remaining = images.length
    const handle = () => { if (--remaining === 0) onLoad() }
    images.forEach(img => {
      if ((img as HTMLImageElement).complete) handle()
      else { img.addEventListener('load', handle, { once: true }); img.addEventListener('error', handle, { once: true }) }
    })
    return () => images.forEach(img => { img.removeEventListener('load', handle); img.removeEventListener('error', handle) })
  }, deps)
}

const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>, targetVelocity: number,
  seqWidth: number, seqHeight: number, isHovered: boolean,
  hoverSpeed: number | undefined, isVertical: boolean
) => {
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const offsetRef = useRef(0)
  const velRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const seqSize = isVertical ? seqHeight : seqWidth
    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize
      track.style.transform = isVertical ? `translate3d(0,${-offsetRef.current}px,0)` : `translate3d(${-offsetRef.current}px,0,0)`
    }
    if (prefersReduced) { track.style.transform = 'translate3d(0,0,0)'; return () => { lastTsRef.current = null } }

    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = Math.max(0, ts - lastTsRef.current) / 1000
      lastTsRef.current = ts
      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity
      velRef.current += (target - velRef.current) * (1 - Math.exp(-dt / ANIMATION_CONFIG.SMOOTH_TAU))
      if (seqSize > 0) {
        offsetRef.current = ((offsetRef.current + velRef.current * dt) % seqSize + seqSize) % seqSize
        track.style.transform = isVertical ? `translate3d(0,${-offsetRef.current}px,0)` : `translate3d(${-offsetRef.current}px,0,0)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null }; lastTsRef.current = null }
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical])
}

export const LogoLoop = React.memo<LogoLoopProps>(({
  logos, speed = 120, direction = 'left', width = '100%', logoHeight = 28, gap = 32,
  pauseOnHover, hoverSpeed, fadeOut = false, fadeOutColor, scaleOnHover = false,
  renderItem, ariaLabel = 'Partner logos', className, style
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const seqRef = useRef<HTMLUListElement>(null)
  const [seqWidth, setSeqWidth] = useState(0)
  const [seqHeight, setSeqHeight] = useState(0)
  const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES)
  const [isHovered, setIsHovered] = useState(false)

  const isVertical = direction === 'up' || direction === 'down'
  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed
    if (pauseOnHover === true) return 0
    if (pauseOnHover === false) return undefined
    return 0
  }, [hoverSpeed, pauseOnHover])

  const targetVelocity = useMemo(() => {
    const mag = Math.abs(speed)
    const dir = isVertical ? (direction === 'up' ? 1 : -1) : (direction === 'left' ? 1 : -1)
    return mag * dir * (speed < 0 ? -1 : 1)
  }, [speed, direction, isVertical])

  const updateDimensions = useCallback(() => {
    const cw = containerRef.current?.clientWidth ?? 0
    const rect = seqRef.current?.getBoundingClientRect?.()
    const sw = rect?.width ?? 0, sh = rect?.height ?? 0
    if (isVertical) {
      const ph = containerRef.current?.parentElement?.clientHeight ?? 0
      if (containerRef.current && ph > 0) containerRef.current.style.height = `${Math.ceil(ph)}px`
      if (sh > 0) { setSeqHeight(Math.ceil(sh)); setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil((containerRef.current?.clientHeight ?? ph ?? sh) / sh) + ANIMATION_CONFIG.COPY_HEADROOM)) }
    } else if (sw > 0) {
      setSeqWidth(Math.ceil(sw))
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, Math.ceil(cw / sw) + ANIMATION_CONFIG.COPY_HEADROOM))
    }
  }, [isVertical])

  useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical])
  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical])
  useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical)

  const cssVars = useMemo(() => ({ '--logoloop-gap': `${gap}px`, '--logoloop-logoHeight': `${logoHeight}px`, ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }) }) as React.CSSProperties, [gap, logoHeight, fadeOutColor])

  const renderLogoItem = useCallback((item: LogoItem, key: React.Key) => {
    if (renderItem) return <li className={cx('flex-none', isVertical ? 'mb-[var(--logoloop-gap)]' : 'mr-[var(--logoloop-gap)]')} key={key} role="listitem">{renderItem(item, key)}</li>
    const isNode = 'node' in item
    const content = isNode
      ? <span className={cx('inline-flex items-center', scaleOnHover && 'transition-transform duration-300 group-hover/item:scale-120')}>{(item as any).node}</span>
      : <img className={cx('h-[var(--logoloop-logoHeight)] w-auto block object-contain pointer-events-none', scaleOnHover && 'transition-transform duration-300 group-hover/item:scale-120')} src={(item as any).src} srcSet={(item as any).srcSet} sizes={(item as any).sizes} width={(item as any).width} height={(item as any).height} alt={(item as any).alt ?? ''} loading="lazy" decoding="async" draggable={false} />
    const inner = (item as any).href ? <a className="inline-flex items-center no-underline hover:opacity-80" href={(item as any).href} target="_blank" rel="noreferrer noopener">{content}</a> : content
    return <li className={cx('flex-none', isVertical ? 'mb-[var(--logoloop-gap)]' : 'mr-[var(--logoloop-gap)]', scaleOnHover && 'overflow-visible group/item')} key={key} role="listitem">{inner}</li>
  }, [isVertical, scaleOnHover, renderItem])

  const logoLists = useMemo(() => Array.from({ length: copyCount }, (_, ci) => (
    <ul className={cx('flex items-center', isVertical && 'flex-col')} key={`copy-${ci}`} role="list" aria-hidden={ci > 0} ref={ci === 0 ? seqRef : undefined}>
      {logos.map((item, ii) => renderLogoItem(item, `${ci}-${ii}`))}
    </ul>
  )), [copyCount, logos, renderLogoItem, isVertical])

  return (
    <div ref={containerRef}
      className={cx('relative group', isVertical ? 'overflow-hidden h-full inline-block' : 'overflow-x-hidden', '[--logoloop-gap:32px]', '[--logoloop-logoHeight:28px]', '[--logoloop-fadeColorAuto:#0A0A0A]', scaleOnHover && 'py-[calc(var(--logoloop-logoHeight)*0.1)]', className)}
      style={{ width: toCssLength(width) ?? '100%', ...cssVars, ...style }} role="region" aria-label={ariaLabel}>
      {fadeOut && (
        isVertical ? <>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[clamp(24px,8%,120px)] bg-[linear-gradient(to_bottom,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto)),rgba(0,0,0,0))]" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[clamp(24px,8%,120px)] bg-[linear-gradient(to_top,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto)),rgba(0,0,0,0))]" />
        </> : <>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[clamp(24px,8%,120px)] bg-[linear-gradient(to_right,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto)),rgba(0,0,0,0))]" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[clamp(24px,8%,120px)] bg-[linear-gradient(to_left,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto)),rgba(0,0,0,0))]" />
        </>
      )}
      <div ref={trackRef} className={cx('flex will-change-transform select-none relative z-0', isVertical ? 'flex-col h-max w-full' : 'flex-row w-max')}
        onMouseEnter={() => { if (effectiveHoverSpeed !== undefined) setIsHovered(true) }}
        onMouseLeave={() => { if (effectiveHoverSpeed !== undefined) setIsHovered(false) }}>
        {logoLists}
      </div>
    </div>
  )
})

LogoLoop.displayName = 'LogoLoop'
export default LogoLoop
