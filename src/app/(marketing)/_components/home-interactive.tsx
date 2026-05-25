"use client"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

// ── Stats count-up ────────────────────────────────────────────────────────────
export function StatNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const dur = 1500
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          setDisplay(Math.round(ease * value))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return <span ref={ref}>{display}{suffix}</span>
}

// ── Testimonial slider ────────────────────────────────────────────────────────
type Testimonial = {
  id: string
  author_name: string
  author_role: string | null
  content: string
  rating: number
}

export function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const [idx, setIdx] = useState(0)
  const t = items[idx]
  if (!t) return null

  return (
    <div className="relative rounded-xl p-6" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* nav buttons */}
      <div className="absolute right-4 top-4 flex gap-2">
        <button className="nav-arrow-btn" onClick={() => setIdx((idx - 1 + items.length) % items.length)}>
          <ChevronLeft className="size-4" />
        </button>
        <button className="nav-arrow-btn" onClick={() => setIdx((idx + 1) % items.length)}>
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-4 fill-current" style={{ color: "#D9F25D" }} />
        ))}
      </div>

      <p className="text-[13px] leading-[1.7] mb-6" style={{ color: "#CECECE" }}>
        &ldquo;{t.content}&rdquo;
      </p>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
          style={{ background: "rgba(217,242,93,0.15)", color: "#D9F25D" }}>
          {t.author_name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{t.author_name}</p>
          {t.author_role && <p className="text-xs" style={{ color: "#5A5A5A" }}>{t.author_role}</p>}
        </div>
      </div>
    </div>
  )
}

// ── Services slider ───────────────────────────────────────────────────────────
type Service = { num: string; icon: string; name: string; img?: string }

const SERVICES: Service[] = [
  { num: "01", icon: "✦",  name: "Life Revolution",              img: "/images/service/LR Logo PNG.png" },
  { num: "02", icon: "💼", name: "Business Revolution",          img: "/images/service/BR Logo PNG.png" },
  { num: "03", icon: "📈", name: "Financial Revolution",         img: "/images/service/FR Logo PNG.png" },
  { num: "04", icon: "🏢", name: "Property Rich Revolution",     img: "/images/service/PRR Logo PNG.png" },
  { num: "05", icon: "📣", name: "Sales & Marketing Revolution", img: "/images/service/SMR Logo PNG.png" },
  { num: "06", icon: "👑", name: "Leadership Revolution" },
  { num: "07", icon: "⭐", name: "Service Excellence" },
]

export function ServicesSlider() {
  const [start, setStart] = useState(0)
  const visible = 3

  return (
    <div>
      {/* heading row */}
      <div className="relative mb-8 flex items-end justify-between">
        <div>
          <p className="section-label mb-3">Services</p>
          <h3 className="text-[clamp(28px,4vw,42px)] font-bold leading-[1.2] text-white">
            Kami Menyediakan<br />
            Program <span style={{ color: "#D9F25D" }}>untuk Anda</span>
          </h3>
        </div>
        <div className="flex gap-2">
          <button className="nav-arrow-btn" onClick={() => setStart(Math.max(0, start - 1))}>
            <ChevronLeft className="size-4" />
          </button>
          <button className="nav-arrow-btn" onClick={() => setStart(Math.min(SERVICES.length - visible, start + 1))}>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.slice(start, start + visible).map((s) => (
          <div key={s.num} className="dark-card relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-1">
            <span className="pointer-events-none absolute right-3 top-2 text-[48px] font-black select-none"
              style={{ color: "rgba(255,255,255,0.05)", lineHeight: 1 }}>
              {s.num}
            </span>
            {s.img
              ? <img src={s.img} alt={s.name} className="w-10 h-10 rounded-lg object-contain bg-white p-1" />
              : <span className="text-3xl">{s.icon}</span>
            }
            <p className="mt-3 text-[15px] font-semibold text-white">{s.name}</p>
            <div className="mt-4 h-28 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }} />
          </div>
        ))}
      </div>
    </div>
  )
}


