"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function PageLoader() {
  const loaderRef  = useRef<HTMLDivElement>(null)
  const topRef     = useRef<HTMLDivElement>(null)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const labelRef   = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    document.body.style.overflow = "hidden"

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { overwrite: "auto" } })

      // 1. Label muncul
      tl.fromTo(labelRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      )

      // 2. Counter 0→100
      const obj = { val: 0 }
      tl.to(obj, {
        val: 100,
        duration: 2.6,
        ease: "power3.inOut",
        onUpdate() {
          if (counterRef.current)
            counterRef.current.textContent = Math.round(obj.val) + "%"
        },
      }, "-=0.35")

      // 3. Hold
      tl.to({}, { duration: 0.35 })

      // 4. Fade out teks
      tl.to([labelRef.current, counterRef.current], {
        opacity: 0, duration: 0.2, ease: "power2.in"
      })

      // 5. Curtain split
      tl.to(topRef.current,
        { y: "-100%", duration: 0.9, ease: "power4.inOut" },
        "-=0.05"
      )
      tl.to(bottomRef.current, {
        y: "100%",
        duration: 0.9,
        ease: "power4.inOut",
        onComplete() {
          if (loaderRef.current) loaderRef.current.style.display = "none"
          document.body.style.overflow = ""
        }
      }, "<")
    })

    return () => ctx.revert()
  }, [])

  const BG = "#0A0A0A"

  return (
    <div ref={loaderRef} aria-hidden="true" style={{
      position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none",
    }}>
      {/* Panel atas */}
      <div ref={topRef} style={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: "50%",
        background: BG,
      }} />

      {/* Panel bawah */}
      <div ref={bottomRef} style={{
        position: "absolute", bottom: 0, left: 0,
        width: "100%", height: "50%",
        background: BG,
      }} />

      {/* Counter — pojok kiri bawah */}
      <div style={{
        position: "absolute",
        bottom: "8%",
        left: "clamp(24px, 6vw, 80px)",
        zIndex: 10,
        lineHeight: 1,
        userSelect: "none",
      }}>
        <span ref={labelRef} style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 400,
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.45)",
          marginBottom: "8px",
          opacity: 0,
          fontFamily: "var(--font-custom-sans, system-ui, sans-serif)",
        }}>
          loading...
        </span>
        <span ref={counterRef} style={{
          display: "block",
          fontSize: "clamp(80px, 11vw, 128px)",
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.025em",
          fontFamily: "var(--font-custom-sans, system-ui, sans-serif)",
        }}>
          0%
        </span>
      </div>
    </div>
  )
}
