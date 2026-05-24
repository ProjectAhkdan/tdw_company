import Link from "next/link"
import { StatNumber } from "./home-interactive"

const L = "#D9F25D"

// ── Section 02: Hero ──────────────────────────────────────────────────────────
export function HeroSection() {
  return (
    <section className="pt-20 pb-8 px-6" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        {/* Upper: H1 left + desc right */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* H1 */}
          <div>
            <div className="flex items-baseline gap-4">
              <h1 className="text-[clamp(52px,8vw,80px)] font-black leading-none tracking-[-0.02em]" style={{ color: "#FFFFFF" }}>UBAH</h1>
              <h1 className="text-[clamp(52px,8vw,80px)] font-black leading-none tracking-[-0.02em]" style={{ color: L }}>HIDUP</h1>
            </div>
            <h1 className="text-[clamp(52px,8vw,80px)] font-black leading-none tracking-[-0.02em]" style={{ color: L }}>ANDA</h1>
          </div>

          {/* Right col */}
          <div className="max-w-[260px]">
            <p className="text-[13px] leading-[1.6] mb-5" style={{ color: "#8A8A8A" }}>
              Seminar bisnis, properti, dan pengembangan diri terpercaya di Indonesia.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/schedule" className="pill-lime">
                Daftar Sekarang <span className="pill-dot" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#8A8A8A" }}>
                  10M+
                </div>
                <span className="text-[12px]" style={{ color: "#8A8A8A" }}>peserta</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero photo */}
        <div className="relative mt-8 overflow-hidden rounded-2xl"
          style={{
            height: "clamp(200px,35vw,380px)",
            backgroundImage: "url('/images/hero/bg-homepage-new.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none text-[clamp(24px,4vw,48px)] font-black tracking-[0.3em]"
              style={{ color: "rgba(255,255,255,0.08)" }}>
              TDW RESOURCES
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section 03: Logo Bar ──────────────────────────────────────────────────────
const PARTNERS = ["Pilar Bisnis", "Jawa Pos", "Majalah Marketing", "Metro TV", "SCTV"]

export function LogoBar() {
  return (
    <section className="px-6 py-7" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-10">
        <div>
          <p className="text-[13px]" style={{ color: "#8A8A8A" }}>
            Trusted by <span style={{ color: L }}>10 Juta+</span>
          </p>
          <p className="text-[12px]" style={{ color: "#8A8A8A" }}>peserta</p>
        </div>
        {PARTNERS.map((p, i) => (
          <span key={p} className="flex items-center gap-6">
            {i > 0 && <span style={{ color: "#2A2A2A" }}>●</span>}
            <span className="text-[14px] font-semibold cursor-default transition-colors hover:text-[#8A8A8A]"
              style={{ color: "#3A3A3A" }}>
              {p}
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}

// ── Section 04: About ─────────────────────────────────────────────────────────
export function AboutSection() {
  return (
    <section className="relative px-6 py-20" style={{ background: "#0A0A0A" }}>
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full"
        style={{ background: "radial-gradient(circle,rgba(100,150,30,0.07) 0%,transparent 70%)", filter: "blur(60px)" }} />
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[1fr_3fr]">
        <p className="section-label">Tentang Kami</p>
        <h2 className="text-[clamp(22px,3vw,32px)] font-normal leading-[1.5]" style={{ color: "#CECECE" }}>
          Kami berdedikasi menciptakan pengalaman seminar yang memadukan{" "}
          <span className="font-bold" style={{ color: L }}>bisnis dan transformasi</span>
        </h2>
      </div>
    </section>
  )
}

// ── Section 05: Stats ─────────────────────────────────────────────────────────
const STATS = [
  { label: "Berdiri sejak", num: 20, suffix: "", unit: "Tahun" },
  { label: "Hadir di", num: 30, suffix: "", unit: "Negara" },
  { label: "Lebih dari", num: 7, suffix: "+", unit: "Program" },
]

export function StatsSection() {
  return (
    <section className="px-6 py-16" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto grid max-w-[1280px] gap-8 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.5fr]">
        {STATS.map((s) => (
          <div key={s.unit}>
            <p className="mb-2 text-[12px]" style={{ color: "#5A5A5A" }}>{s.label}</p>
            <p className="text-[clamp(64px,10vw,96px)] font-black leading-none tracking-[-0.03em] text-white">
              <StatNumber value={s.num} suffix={s.suffix} />
              <span style={{ color: L }}>.</span>
            </p>
            <p className="mt-1 text-[11px]" style={{ color: "#5A5A5A" }}>{s.unit}</p>
          </div>
        ))}
        <p className="text-[13px] leading-[1.7] self-center" style={{ color: "#5A5A5A" }}>
          Lebih dari 10 juta orang dari 30 negara telah mengikuti program Success Resources,
          induk perusahaan TDW Resources yang berpusat di Singapore.
        </p>
      </div>
    </section>
  )
}
