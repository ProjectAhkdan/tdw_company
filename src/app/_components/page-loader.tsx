"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const BRAND_WORDS = ["TDW", "Resources"]
const BG = "#0A0A0A"
const ACCENT = "#D9F25D"

export function PageLoader() {
  const loaderRef  = useRef<HTMLDivElement>(null)
  const topRef     = useRef<HTMLDivElement>(null)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const labelRef   = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barFillRef = useRef<HTMLDivElement>(null)
  const wordRefs   = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    document.body.style.overflow = "hidden"

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { overwrite: "auto" } })

      // Phase 1 — Word reveal
      tl.from(wordRefs.current, {
        y: "110%", duration: 0.85, ease: "power4.out", stagger: 0.1,
      }, 0)

      // Phase 2 — Label & counter fade in
      tl.fromTo(labelRef.current,
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        0.3
      )
      tl.fromTo(counterRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        0.38
      )

      // Phase 3 — Count up
      const obj = { val: 0 }
      tl.to(obj, {
        val: 100, duration: 2.5, ease: "power2.inOut",
        onUpdate() {
          const v = Math.round(obj.val)
          if (counterRef.current) counterRef.current.textContent = v + " %"
          if (barFillRef.current)  barFillRef.current.style.width = v + "%"
        },
      }, 0.42)

      // Phase 4 — Hold
      tl.to({}, { duration: 0.3 })

      // Phase 5 — Fade teks
      tl.to(
        [labelRef.current, counterRef.current, ...wordRefs.current],
        { opacity: 0, duration: 0.22, ease: "power2.in", stagger: 0.02 }
      )

      // Phase 6 — Curtain split
      tl.to(topRef.current, { y: "-100%", duration: 0.9, ease: "power4.inOut" }, "-=0.05")
      tl.to(bottomRef.current, {
        y: "100%", duration: 0.9, ease: "power4.inOut",
        onComplete() {
          if (loaderRef.current) loaderRef.current.style.display = "none"
          document.body.style.overflow = ""
        }
      }, "<")
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={loaderRef} aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }}>

      {/* Panel Atas */}
      <div ref={topRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "50%", background: BG, zIndex: 2 }} />

      {/* Panel Bawah */}
      <div ref={bottomRef} style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "50%", background: BG, zIndex: 2 }} />

      {/* Brand Name — Tengah */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 3, display: "flex", alignItems: "baseline",
        gap: "clamp(12px, 2vw, 28px)", whiteSpace: "nowrap",
      }}>
        {BRAND_WORDS.map((word, i) => (
          <span key={word} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", lineHeight: 1.05 }}>
            <span
              ref={el => { if (el) wordRefs.current[i] = el }}
              style={{
                display: "block",
                fontSize: "clamp(72px, 13vw, 152px)",
                fontWeight: 900,
                fontFamily: "var(--font-custom-display, 'Poppins', sans-serif)",
                color: "#ffffff",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                willChange: "transform",
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </div>

      {/* Counter + Label — Pojok Kanan Bawah */}
      <div style={{
        position: "absolute",
        bottom: "clamp(20px, 4vh, 48px)", right: "clamp(20px, 4vw, 64px)",
        zIndex: 10, textAlign: "right", userSelect: "none",
      }}>
        <span ref={labelRef} style={{
          display: "block", fontSize: "11px", fontWeight: 400,
          letterSpacing: "0.08em", color: "rgba(255,255,255,0.38)",
          marginBottom: "4px",
          fontFamily: "var(--font-custom-sans, 'Poppins', sans-serif)",
          opacity: 0,
        }}>loading...</span>
        <span ref={counterRef} style={{
          display: "block", fontSize: "clamp(13px, 1.6vw, 18px)", fontWeight: 500,
          letterSpacing: "0.04em", color: "rgba(255,255,255,0.40)",
          fontFamily: "var(--font-custom-sans, 'Poppins', sans-serif)",
          opacity: 0,
        }}>0 %</span>
      </div>

      {/* Progress Bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.06)", zIndex: 10 }}>
        <div ref={barFillRef} style={{ height: "100%", width: "0%", background: ACCENT }} />
      </div>
    </div>
  )
}
