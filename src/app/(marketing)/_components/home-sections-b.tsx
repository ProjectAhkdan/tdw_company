import Link from "next/link"
import { Star } from "lucide-react"
import { ServicesSlider, TestimonialSlider } from "./home-interactive"

const L = "#D9F25D"

// ── Section 06: OUR SERVICES heading ─────────────────────────────────────────
export function ServicesHeading() {
  return (
    <section className="px-6 py-16 text-center" style={{ background: "#0A0A0A" }}>
      <h2 className="text-[clamp(72px,12vw,120px)] font-black leading-none tracking-[-0.02em]">
        <span style={{ color: L }}>OUR</span>{" "}
        <span className="ghost-text">SERVICES</span>
      </h2>
      <p className="mt-3 text-[clamp(16px,2.5vw,24px)] font-bold text-white">
        www.tdwresources.id
      </p>
    </section>
  )
}

// ── Section 07: Services cards (client slider) ────────────────────────────────
export function ServicesSection() {
  return (
    <section className="px-6 pb-20" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        <ServicesSlider />
      </div>
    </section>
  )
}

// ── Section 08: Case Studies ──────────────────────────────────────────────────
const CASES = [
  {
    tag: "Bisnis",
    title: "Dari 1 outlet ke 1.000+ outlet",
    desc: "Hendy Setiono menerapkan ilmu dari Pak Tung dan mengembangkan Kebab Turki Baba Rafi ke Malaysia & Filipina.",
    name: "Hendy Setiono",
    role: "Kebab Turki Baba Rafi",
  },
  {
    tag: "Properti",
    title: "BPR LESTARI terbesar di Bali",
    desc: "Dari aset Rp 300 juta di 1999 menjadi 5,13 Trilyun di 2018 setelah menerapkan strategi TDW.",
    name: "Alex P. Chandra",
    role: "Direktur BPR LESTARI",
  },
  {
    tag: "Properti",
    title: "900 unit terjual dalam 45 hari",
    desc: "Berhasil menjual 900 unit apartment dengan omzet 1,2 Trilyun menggunakan strategi dari TDW.",
    name: "Bong Chandra",
    role: "Triniti Property",
  },
]

export function CaseStudiesSection() {
  return (
    <section className="px-6 py-20" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-10 text-[clamp(60px,10vw,100px)] font-black leading-none text-white">CASE</h2>

        {/* Tab filters — static, first tab active */}
        <div className="mb-10 flex flex-wrap gap-2">
          {["Semua", "Bisnis", "Properti", "Sales"].map((t, i) => (
            <span key={t} className="rounded-full px-4 py-1.5 text-[12px] font-medium"
              style={i === 0
                ? { background: L, color: "#0A0A0A" }
                : { border: "1px solid rgba(255,255,255,0.1)", color: "#8A8A8A" }}>
              {t}
            </span>
          ))}
        </div>

        <div className="space-y-8">
          {CASES.map((c, i) => (
            <div key={c.name} className={`grid gap-6 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              {/* Image */}
              <div className="aspect-[4/3] rounded-xl" style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)" }} />
              {/* Content */}
              <div className="flex flex-col justify-center gap-4">
                <span className="text-[11px] font-semibold" style={{ color: L }}>{c.tag}</span>
                <h3 className="text-[18px] font-semibold text-white">{c.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "#8A8A8A" }}>{c.desc}</p>
                <p className="text-[12px]" style={{ color: "#5A5A5A" }}>{c.name} · {c.role}</p>
                <Link href="/seminars" className="pill-lime self-start">
                  Lihat Detail → <span className="pill-dot" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section 09: Testimonials ──────────────────────────────────────────────────
const TESTIMONIALS = [
  { id: "1", author_name: "Tony Robbins", author_role: "Pelatih Sukses #1 di Dunia", content: "Your Accomplishments will impact the lives of many generations to come", rating: 5, is_featured: true },
  { id: "2", author_name: "Hendy Setiono", author_role: "Kebab Turki Baba Rafi", content: "Dari 1 outlet, kini sudah mengoperasikan lebih dari 1.000 outlet di Indonesia, Malaysia & Filipina setelah menerapkan ilmu dari Pak Tung.", rating: 5, is_featured: true },
  { id: "3", author_name: "Alex P. Chandra", author_role: "Direktur BPR LESTARI Bali", content: "BPR LESTARI dari tak dikenal menjadi TERBESAR di BALI. Tahun 1999 Aset Rp 300 juta, akhir tahun 2018 aset 5,13 Trilyun.", rating: 5, is_featured: true },
]

export function TestimonialsSection({ items }: { items: typeof TESTIMONIALS }) {
  const data = items.length ? items : TESTIMONIALS
  return (
    <section className="px-6 py-20" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label mb-3">Klien</p>
            <h2 className="text-[clamp(22px,3vw,32px)] font-bold text-white">
              Dengar apa yang mereka katakan<br />
              <span style={{ color: "#8A8A8A" }}>tentang program kami</span>
            </h2>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
          {/* Left: aggregate rating */}
          <div>
            <p className="text-[48px] font-black text-white leading-none">4.8</p>
            <div className="flex gap-0.5 my-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" style={{ color: L }} />
              ))}
            </div>
            <p className="text-[11px]" style={{ color: "#5A5A5A" }}>Overall Rating</p>
          </div>

          {/* Right: slider */}
          <TestimonialSlider items={data} />
        </div>
      </div>
    </section>
  )
}

// ── Section 10: Awards ────────────────────────────────────────────────────────
const AWARDS = [
  { abbr: "MR", name: "MURI Record — Financial Revolution 10.511 eksemplar", year: "2008" },
  { abbr: "MR", name: "MURI Record — Marketing Revolution 38.878 eksemplar", year: "2010" },
  { abbr: "MM", name: "Majalah Marketing — Pelatih Sukses #1 Indonesia", year: "2012" },
  { abbr: "SW", name: "Majalah SWA — 30 Tokoh Indonesia Bervisi", year: "2015" },
]

export function AwardsSection() {
  return (
    <section className="px-6 py-20" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-2 text-center text-[clamp(60px,10vw,100px)] font-black leading-none ghost-text">
          AWARDS
        </h2>
        <div className="mb-10 text-center">
          <p className="section-label inline">Awards</p>
          <p className="mt-1 text-[13px]" style={{ color: "#5A5A5A" }}>Penghargaan perusahaan</p>
        </div>

        <div className="space-y-0">
          {AWARDS.map((a) => (
            <div key={a.name} className="flex items-center gap-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: "#1A1A1A", color: "#5A5A5A" }}>
                {a.abbr}
              </div>
              <p className="flex-1 text-[14px]" style={{ color: "#CECECE" }}>{a.name}</p>
              <p className="text-[12px]" style={{ color: "#5A5A5A" }}>{a.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
