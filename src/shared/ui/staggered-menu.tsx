'use client'

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Menu, X } from 'lucide-react'

export interface StaggeredMenuItem {
  label: string
  href: string
  active?: boolean
}

interface Props {
  items: StaggeredMenuItem[]
  footer?: React.ReactNode
}

export function StaggeredMenu({ items, footer }: Props) {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const busyRef = useRef(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const preLayersRef = useRef<HTMLDivElement>(null)
  const preLayerElsRef = useRef<HTMLElement[]>([])
  const openTlRef = useRef<gsap.core.Timeline | null>(null)
  const closeTweenRef = useRef<gsap.core.Tween | null>(null)

  // Icon refs
  const plusHRef = useRef<HTMLSpanElement>(null)
  const plusVRef = useRef<HTMLSpanElement>(null)
  const spinTlRef = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current
      const preContainer = preLayersRef.current
      if (!panel || !preContainer) return

      const preLayers = Array.from(preContainer.querySelectorAll('.sm-pre')) as HTMLElement[]
      preLayerElsRef.current = preLayers

      gsap.set([panel, ...preLayers], { xPercent: 100, opacity: 1 })
      gsap.set(preContainer, { xPercent: 0 })
      if (plusHRef.current) gsap.set(plusHRef.current, { rotate: 0, transformOrigin: '50% 50%' })
      if (plusVRef.current) gsap.set(plusVRef.current, { rotate: 90, transformOrigin: '50% 50%' })
    })
    return () => ctx.revert()
  }, [])

  const buildOpenTl = useCallback(() => {
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return null

    openTlRef.current?.kill()
    closeTweenRef.current?.kill()

    const itemEls = Array.from(panel.querySelectorAll('.sm-item-label')) as HTMLElement[]
    if (itemEls.length) gsap.set(itemEls, { yPercent: 120, rotate: 8 })

    const tl = gsap.timeline({ paused: true })

    layers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07)
    })

    const panelStart = layers.length ? (layers.length - 1) * 0.07 + 0.08 : 0
    tl.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.65, ease: 'power4.out' }, panelStart)

    if (itemEls.length) {
      tl.to(itemEls, {
        yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out',
        stagger: { each: 0.1, from: 'start' },
      }, panelStart + 0.1)
    }

    openTlRef.current = tl
    return tl
  }, [])

  const playOpen = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    const tl = buildOpenTl()
    if (tl) {
      tl.eventCallback('onComplete', () => { busyRef.current = false })
      tl.play(0)
    } else {
      busyRef.current = false
    }
  }, [buildOpenTl])

  const playClose = useCallback(() => {
    openTlRef.current?.kill()
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return

    closeTweenRef.current?.kill()
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: 100, duration: 0.32, ease: 'power3.in', overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-item-label')) as HTMLElement[]
        if (itemEls.length) gsap.set(itemEls, { yPercent: 120, rotate: 8 })
        busyRef.current = false
      }
    })
  }, [])

  const animateIcon = useCallback((opening: boolean) => {
    spinTlRef.current?.kill()
    const h = plusHRef.current, v = plusVRef.current
    if (!h || !v) return
    spinTlRef.current = gsap.timeline({ defaults: { ease: 'power4.out' } })
      .to(h, { rotate: opening ? 45 : 0, duration: 0.5 }, 0)
      .to(v, { rotate: opening ? -45 : 90, duration: 0.5 }, 0)
  }, [])

  const toggle = useCallback(() => {
    const next = !openRef.current
    openRef.current = next
    setOpen(next)
    if (next) playOpen(); else playClose()
    animateIcon(next)
  }, [playOpen, playClose, animateIcon])

  // Close on outside click
  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current?.contains(e.target as Node)) return
      openRef.current = false
      setOpen(false)
      playClose()
      animateIcon(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, playClose, animateIcon])

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={toggle}
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
        aria-expanded={open}
        className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:text-white transition-colors md:hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        {/* Custom +/× icon using GSAP-animated spans */}
        <span className="relative flex h-4 w-4 items-center justify-center">
          <span ref={plusHRef} className="absolute h-[2px] w-full rounded-sm bg-current" style={{ willChange: 'transform' }} />
          <span ref={plusVRef} className="absolute h-[2px] w-full rounded-sm bg-current" style={{ willChange: 'transform' }} />
        </span>
      </button>

      {/* Pre-layers + Panel */}
      <div className="fixed inset-0 z-40 md:hidden" style={{ pointerEvents: open ? 'auto' : 'none' }}>
        {/* Pre-layers */}
        <div ref={preLayersRef} className="absolute inset-0 pointer-events-none">
          {['#1a1a1a', '#141414'].map((c, i) => (
            <div key={i} className="sm-pre absolute inset-0" style={{ background: c }} />
          ))}
        </div>

        {/* Panel */}
        <div
          ref={panelRef}
          aria-hidden={!open}
          className="absolute inset-0 flex flex-col px-8 pt-24 pb-10 overflow-y-auto"
          style={{ background: '#0A0A0A' }}
        >
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <div key={item.href} className="overflow-hidden leading-none">
                <a
                  href={item.href}
                  className="sm-item-label inline-block text-[clamp(40px,10vw,72px)] font-black leading-none tracking-tight uppercase transition-colors duration-150"
                  style={{
                    color: item.active ? '#D9F25D' : '#ffffff',
                    willChange: 'transform',
                    transformOrigin: '50% 100%',
                  }}
                  onMouseEnter={e => { if (!item.active) (e.currentTarget as HTMLElement).style.color = '#D9F25D' }}
                  onMouseLeave={e => { if (!item.active) (e.currentTarget as HTMLElement).style.color = '#ffffff' }}
                  onClick={() => { openRef.current = false; setOpen(false); playClose(); animateIcon(false) }}
                >
                  {item.label}
                </a>
              </div>
            ))}
          </nav>

          {footer && <div className="mt-auto pt-8">{footer}</div>}
        </div>
      </div>
    </>
  )
}
