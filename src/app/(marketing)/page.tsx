export const revalidate = 300 // ISR: regenerate setiap 5 menit

import Link from "next/link"
import { Target, TrendingUp, BarChart3, Shield, Search, CreditCard, Star, MapPin, Calendar } from "lucide-react"
import { PillLink } from "@shared/ui/pill-link"
import {
  getCompanyStats, getFeaturedTestimonials, getFeaturedSeminars,
  getFaqs
} from "@/infrastructure/storage/supabase-queries"

import { FloatingLinesClient } from "@/app/_components/floating-lines-client"
import { FlowingMenuClient } from "@/app/_components/flowing-menu-client"

const GOLD = "oklch(0.78 0.16 55)"

// Fallback data jika Supabase belum ada data
const FALLBACK_STATS = [
  { id: "1", label: "Alumni", value: "10 Juta+", sort_order: 0 },
  { id: "2", label: "Negara", value: "30+", sort_order: 1 },
  { id: "3", label: "Program Training", value: "7+", sort_order: 2 },
  { id: "4", label: "Tahun Pengalaman", value: "20+", sort_order: 3 },
]
const FALLBACK_TESTIMONIALS = [
  { id: "1", author_name: "Tony Robbins", author_role: "Pelatih Sukses #1 di Dunia", avatar_url: null, content: "Your Accomplishments will impact the lives of many generations to come", rating: 5, is_featured: true },
  { id: "2", author_name: "Hendy Setiono", author_role: "Kebab Turki Baba Rafi", avatar_url: null, content: "Dari 1 outlet, kini sudah mengoperasikan lebih dari 1.000 outlet di Indonesia, Malaysia & Filipin setelah menerapkan ilmu dari Pak Tung.", rating: 5, is_featured: true },
  { id: "3", author_name: "Alex P. Chandra", author_role: "Direktur BPR LESTARI Bali", avatar_url: null, content: "BPR LESTARI dari tak dikenal menjadi TERBESAR di BALI. Tahun 1999 Aset Rp 300 juta, akhir tahun 2018 aset 5,13 Trilyun.", rating: 5, is_featured: true },
  { id: "4", author_name: "Bong Chandra", author_role: "Triniti Property", avatar_url: null, content: "Berhasil menjual 900 unit apartment dalam 45 hari dengan omzet 1,2 Trilyun.", rating: 5, is_featured: true },
  { id: "5", author_name: "Rudy Margono", author_role: "Presdir Gapura Prima Group", avatar_url: null, content: "Penjualan 31 proyek property naik 420% hanya dalam waktu 1 bulan.", rating: 5, is_featured: true },
  { id: "6", author_name: "Didiek Harry S.", author_role: "PT. Frisian Flag", avatar_url: null, content: "Target 26M/bln tercapai dalam Minggu ke-2 atau ke-3.", rating: 5, is_featured: true },
]

const FALLBACK_FAQS = [
  { id: "1", question: "Apa itu TDW Resources?", answer: "TDW Resources merupakan affiliate dari Success Resources yang berpusat di Singapore. TDW Resources bergerak di bidang Event Organizer dan seminar pendidikan yang didirikan oleh Mr. Richard Tan dan Mr. Tung Desem Waringin.", sort_order: 0 },
  { id: "2", question: "Apa saja program training yang tersedia?", answer: "TDW Resources menyediakan berbagai program training antara lain: Life Revolution, Business Revolution, Sales Marketing Revolution, Financial Revolution, Property Rich Revolution, Leadership Revolution, dan Service Excellence.", sort_order: 1 },
  { id: "3", question: "Bagaimana cara mendaftar seminar?", answer: "Anda bisa mendaftar melalui website kami dengan memilih seminar, mengisi formulir, dan melakukan pembayaran. Konfirmasi akan dikirim via email. Untuk informasi lebih lanjut hubungi kami di (021)-547-6677 atau info@dahsyat.com.", sort_order: 2 },
  { id: "4", question: "Di mana kantor TDW Resources?", answer: "Kantor kami berlokasi di Jl. Janur Hijau 1, Blok AA-5 No. 16-17, Gading Serpong, Pakulonan Bar, Kec. Tangerang, Tangerang, Banten, 15810.", sort_order: 3 },
  { id: "5", question: "Berapa banyak peserta yang sudah mengikuti program Success Resources?", answer: "Lebih dari 10 juta orang dari 30 negara telah mengikuti program yang diadakan oleh Success Resources, induk perusahaan TDW Resources yang berpusat di Singapore.", sort_order: 4 },
]

function formatPrice(n: number) {
  return "Rp " + n.toLocaleString("id-ID")
}

export default async function HomePage() {
  // Fetch semua data paralel dari Supabase
  const [statsRes, testimonialsRes, seminarsRes, faqsRes] = await Promise.all([
    getCompanyStats(),
    getFeaturedTestimonials(),
    getFeaturedSeminars(),
    getFaqs(),
  ])

  const stats = statsRes.data?.length ? statsRes.data : FALLBACK_STATS
  const testimonials = testimonialsRes.data?.length ? testimonialsRes.data : FALLBACK_TESTIMONIALS
  const seminars = seminarsRes.data ?? []
  const faqs = faqsRes.data?.length ? faqsRes.data : FALLBACK_FAQS

  return (
    <div className="bg-background text-foreground overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Background WebGL Floating Lines */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <FloatingLinesClient 
            linesGradient={['#FF3D00', '#FF6D00', '#FFAB00', '#FFD600']} 
            animationSpeed={0.8}
            parallax={true}
            parallaxStrength={0.15}
            interactive={true}
          />
          {/* Subtle gold glow overlay */}
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.15] blur-[120px]"
            style={{ background: GOLD }} />
          {/* Dark fading gradient overlay at the bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-95" />
          {/* Subtle grid lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(oklch(0.78 0.16 55) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.16 55) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
            style={{ borderColor: `${GOLD}40`, background: `${GOLD}10`, color: GOLD }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
            #1 Seminar Bisnis & Properti di Indonesia
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Ubah Hidup Anda{" "}
            <span className="text-gold-gradient">Bersama TDW</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Affiliate dari Success Resources Singapore. Seminar bisnis, properti, dan pengembangan diri terpercaya di Indonesia.
            Bergabunglah dengan <strong className="text-foreground">10 juta+ peserta</strong> dari 30 negara yang telah mengubah hidup mereka.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <PillLink href="/schedule"
              pillColor={GOLD} textColor="oklch(0.08 0 0)" hoverCircleColor="#120F17" hoverTextColor={GOLD}>
              Lihat Seminar Terdekat →
            </PillLink>
            <a href="#seminars"
              className="inline-flex h-13 items-center rounded-xl border px-8 text-base font-medium transition-all duration-200 hover:bg-white/5"
              style={{ borderColor: "oklch(0.22 0.01 55 / 0.6)", color: "oklch(0.75 0.005 60)" }}>
              Pelajari Program Kami
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-10">
            {stats.map((s) => (
              <div key={s.id} className="text-center">
                <p className="text-3xl font-bold" style={{ color: GOLD, fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-muted-foreground">Scroll</span>
          <div className="h-8 w-px" style={{ background: `linear-gradient(to bottom, ${GOLD}, transparent)` }} />
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 text-center text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
            Keunggulan Kami
          </div>
          <h2 className="text-center text-4xl font-bold sm:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Kenapa Klien Setia Bersama Kami
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Lebih dari dua dekade membantu ribuan pengusaha dan profesional mencapai potensi terbaik mereka.
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Target, title: "Implementasi & Fokus", desc: "Materi yang langsung bisa diterapkan dengan fokus pada hasil nyata dan terukur" },
              { icon: TrendingUp, title: "High-Converting", desc: "Strategi terbukti meningkatkan konversi dan penjualan bisnis Anda secara signifikan" },
              { icon: BarChart3, title: "Maximum ROI", desc: "Investasi edukasi dengan pengembalian berlipat ganda yang telah terbukti" },
              { icon: Shield, title: "Terpercaya 20+ Tahun", desc: "Program terstruktur dari praktisi berpengalaman dengan rekam jejak nyata" },
            ].map((item) => (
              <div key={item.title} className="glass glass-hover group rounded-2xl p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${GOLD}15` }}>
                  <item.icon className="size-6" style={{ color: GOLD }} />
                </div>
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 text-center text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
            Cara Kerja
          </div>
          <h2 className="text-center text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Prosesnya Cepat & Jelas
          </h2>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              { icon: Search, step: "01", title: "Pilih Seminar", desc: "Temukan seminar yang sesuai dengan kebutuhan dan jadwal Anda" },
              { icon: CreditCard, step: "02", title: "Daftar & Bayar", desc: "Proses pendaftaran mudah dengan berbagai metode pembayaran" },
              { icon: Star, step: "03", title: "Hadir & Berkembang", desc: "Dapatkan ilmu, jaringan, dan transformasi nyata dalam hidup Anda" },
            ].map((item, i) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                {i < 2 && (
                  <div className="absolute left-[calc(50%+2.5rem)] top-8 hidden h-px w-[calc(100%-5rem)] sm:block"
                    style={{ background: `linear-gradient(to right, ${GOLD}60, transparent)` }} />
                )}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl glass"
                  style={{ border: `1px solid ${GOLD}30` }}>
                  <item.icon className="size-7" style={{ color: GOLD }} />
                </div>
                <span className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>{item.step}</span>
                <h3 className="mt-1 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED SEMINARS ────────────────────────────────────────────── */}
      <section id="seminars" className="py-28 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 text-center text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
            Program Unggulan
          </div>
          <h2 className="text-center text-4xl font-bold sm:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Seminar Terdekat
          </h2>

          {seminars.length > 0 ? (
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {seminars.map((s) => {
                const ticket = s.tickets?.[0]
                const price = ticket?.early_bird_price ?? ticket?.price ?? 0
                const isEarlyBird = !!ticket?.early_bird_price
                const soldOut = ticket ? ticket.sold >= ticket.quota : false
                const startDate = new Date(s.start_date)
                const dateStr = startDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                return (
                  <div key={s.id} className="glass glass-hover group flex flex-col rounded-2xl p-6">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ background: `${GOLD}20`, color: GOLD }}>
                        {s.seminar.category.name}
                      </span>
                      {isEarlyBird && !soldOut && (
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                          Early Bird
                        </span>
                      )}
                      {soldOut && (
                        <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-medium text-red-400">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-snug">{s.seminar.title}</h3>
                    <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2"><Calendar className="size-3.5" style={{ color: GOLD }} />{dateStr}</span>
                      <span className="flex items-center gap-2"><MapPin className="size-3.5" style={{ color: GOLD }} />{s.city} · {s.venue}</span>
                    </div>
                    <p className="mt-4 text-2xl font-bold" style={{ color: GOLD }}>{formatPrice(price)}</p>
                    <Link href={`/schedule`}
                      className="mt-5 inline-flex h-10 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                      style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
                      Daftar Sekarang
                    </Link>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mt-16 text-center glass rounded-2xl p-10 py-16" style={{ background: "oklch(0.08 0.005 55)", border: "1px solid oklch(0.22 0.01 55 / 0.3)" }}>
              <Calendar className="mx-auto size-12 mb-4 opacity-20" style={{ color: GOLD }} />
              <h3 className="text-lg font-semibold text-foreground">Belum Ada Seminar Terdekat</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Saat ini belum ada jadwal seminar terdekat yang aktif. Silakan hubungi kami untuk informasi program selengkapnya.
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link href="/schedule"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: GOLD }}>
              Lihat semua jadwal →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 text-center text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
            Testimoni
          </div>
          <h2 className="text-center text-4xl font-bold sm:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Apa Kata Mereka
          </h2>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="glass glass-hover flex flex-col rounded-2xl p-7">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" style={{ color: GOLD }} />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: `${GOLD}20`, color: GOLD }}>
                    {t.author_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.author_name}</p>
                    <p className="text-xs text-muted-foreground">{t.author_role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      {faqs && faqs.length > 0 && (
        <section className="py-28 px-6" id="faq">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 text-center text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
              FAQ
            </div>
            <h2 className="mb-12 text-center text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Pertanyaan Umum
            </h2>

            <FlowingMenuClient
              items={faqs.map((faq, i) => ({
                link: `#faq-${faq.id}`,
                text: faq.question,
                marqueeText: faq.answer,
                image: `https://picsum.photos/600/400?random=${i}`
              }))}
              borderColor={`${GOLD}30`}
              marqueeBgColor={GOLD}
              marqueeTextColor="#120F17"
            />
          </div>
        </section>
      )}

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.10] blur-[100px]"
            style={{ background: GOLD }} />
        </div>
        <div className="relative z-10 mx-auto max-w-xl">
          <div className="mb-4 text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
            Mulai Sekarang
          </div>
          <h2 className="text-4xl font-bold sm:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Siap Mengubah Hidup Anda?
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Bergabunglah dengan 10 juta+ peserta dari 30 negara yang telah merasakan transformasi nyata bersama TDW Resources.
          </p>
          <PillLink href="/register" className="mt-10"
            pillColor={GOLD} textColor="oklch(0.08 0 0)" hoverCircleColor="#120F17" hoverTextColor={GOLD}>
            Daftar Sekarang — Gratis
          </PillLink>
        </div>
      </section>

    </div>
  )
}
