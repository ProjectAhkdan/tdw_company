import Link from "next/link"
import { Star } from "lucide-react"
import { ServicesSlider, TestimonialSlider } from "./home-interactive"
import { YoutubeEmbed } from "./youtube-embed"
import { FlowingMenuClient } from "@/app/_components/flowing-menu-client"

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

// ── Section 08: Videos YouTube ───────────────────────────────────────────────
const VIDEOS = [
  { id: "FK63rFTjsDE", title: "Video TDW 1", desc: "Tonton video inspiratif dari Tung Desem Waringin" },
  { id: "g7A34zlAX9U", title: "Video TDW 2", desc: "Strategi bisnis dan pengembangan diri bersama TDW" },
  { id: "BQ5yPlTpUd8", title: "Video TDW 3", desc: "Highlight seminar dan training TDW Resources" },
]

export function VideosSection() {
  return (
    <section className="px-6 py-20" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        <h2 className="mb-10 text-[clamp(60px,10vw,100px)] font-black leading-none text-white">VIDEO</h2>

        <div className="space-y-8">
          {VIDEOS.map((v, i) => (
            <div key={v.id} className={`grid gap-6 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <YoutubeEmbed id={v.id} title={v.title} />
              {/* Content */}
              <div className="flex flex-col justify-center gap-4">
                <span className="text-[11px] font-semibold" style={{ color: L }}>Video</span>
                <h3 className="text-[18px] font-semibold text-white">{v.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "#8A8A8A" }}>{v.desc}</p>
                <a href={`https://youtu.be/${v.id}`} target="_blank" rel="noopener noreferrer"
                  className="pill-lime self-start">
                  Tonton di YouTube → <span className="pill-dot" />
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="/videos" className="pill-lime inline-flex">
            See All Videos → <span className="pill-dot" />
          </a>
        </div>
      </div>
    </section>
  )
}

// ── Section 09: Testimonials ──────────────────────────────────────────────────
const TESTIMONIALS = [
  { id: "1", author_name: "Tony Robbins", author_role: "Pelatih Sukses #1 di Dunia", content: "Your Accomplishments will impact the lives of many generations to come", rating: 5, is_featured: true },
  { id: "2", author_name: "Hendy Setiono", author_role: "Founder & CEO Kebab Turki Baba Rafi", content: "Dari 1 outlet, kini sudah mengoperasikan lebih dari 1.000 outlet di Indonesia, Malaysia & Filipina setelah menerapkan ilmu dari Pak Tung.", rating: 5, is_featured: true },
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
  { abbr: "MR", name: "MURI Record — Financial Revolution 10.511 eksemplar hari pertama", year: "2008" },
  { abbr: "MR", name: "MURI Record — Marketing Revolution 38.878 eksemplar hari pertama", year: "2010" },
  { abbr: "MM", name: "Majalah Marketing — Pelatih Sukses No.1 Indonesia", year: "Ongoing" },
  { abbr: "SW", name: "Majalah SWA — The Most Powerful People and Ideas In Business", year: "Ongoing" },
  { abbr: "JP", name: "Jawa Pos Group & Lions Club — TOP 10 Eksekutif Indonesia", year: "Ongoing" },
  { abbr: "GT", name: "Majalah Gatra — Man of The Year 2020", year: "2020" },
]

const AWARDS_MENU = AWARDS.map(a => ({
  link: "#awards",
  text: a.name,
  image: "",
  marqueeText: `${a.name} · ${a.year}`,
}))

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

        <div style={{ height: `${AWARDS_MENU.length * 72}px` }} className="rounded-2xl overflow-hidden border border-white/5">
          <FlowingMenuClient
            items={AWARDS_MENU}
            bgColor="#111111"
            textColor="#CECECE"
            marqueeBgColor="#D9F25D"
            marqueeTextColor="#0A0A0A"
            borderColor="rgba(255,255,255,0.06)"
            speed={20}
          />
        </div>
      </div>
    </section>
  )
}


