import Link from "next/link"
import { Target, TrendingUp, BarChart3, Shield, Search, CreditCard, Star, Check, MapPin, Calendar } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import {
  getCompanyStats, getFeaturedTestimonials, getFeaturedSeminars,
  getPricingPackages, getFaqs
} from "@/lib/supabase/queries"

const GOLD = "oklch(0.78 0.16 55)"

// Fallback data jika Supabase belum ada data
const FALLBACK_STATS = [
  { id: "1", label: "Alumni", value: "50.000+", sort_order: 0 },
  { id: "2", label: "Seminar", value: "200+", sort_order: 1 },
  { id: "3", label: "Kota", value: "25+", sort_order: 2 },
  { id: "4", label: "Tahun", value: "20+", sort_order: 3 },
]
const FALLBACK_TESTIMONIALS = [
  { id: "1", author_name: "Budi Santoso", author_role: "CEO PT Maju Jaya", avatar_url: null, content: "Seminar TDW mengubah cara saya memimpin bisnis. Omzet naik 3x dalam 6 bulan setelah menerapkan ilmu yang didapat.", rating: 5, is_featured: true },
  { id: "2", author_name: "Sari Dewi", author_role: "Manager Marketing", avatar_url: null, content: "Materi yang diajarkan sangat aplikatif. Langsung bisa diterapkan di pekerjaan sehari-hari dengan hasil nyata.", rating: 5, is_featured: true },
  { id: "3", author_name: "Rudi Hartono", author_role: "Pengusaha", avatar_url: null, content: "Investasi terbaik yang pernah saya keluarkan. Networking dan ilmu yang didapat tidak ternilai harganya.", rating: 5, is_featured: true },
]
const FALLBACK_PRICING = [
  { id: "1", name: "Starter", price: 1500000, features: ["1 Seminar pilihan", "Materi digital", "Sertifikat", "Grup komunitas"], is_popular: false, sort_order: 0 },
  { id: "2", name: "Pro", price: 2500000, features: ["3 Seminar pilihan", "Materi digital + fisik", "Sertifikat", "Grup komunitas", "Konsultasi 1x", "Akses rekaman"], is_popular: true, sort_order: 1 },
  { id: "3", name: "Premium", price: 4000000, features: ["Semua seminar 1 tahun", "Materi digital + fisik", "Sertifikat", "Grup VIP", "Konsultasi 4x", "Akses rekaman", "Seat prioritas"], is_popular: false, sort_order: 2 },
]
const FALLBACK_FAQS = [
  { id: "1", question: "Bagaimana cara mendaftar seminar?", answer: "Anda bisa mendaftar melalui website kami dengan memilih seminar, mengisi formulir, dan melakukan pembayaran. Konfirmasi akan dikirim via email dan WhatsApp.", sort_order: 0 },
  { id: "2", question: "Metode pembayaran apa saja yang tersedia?", answer: "Kami menerima transfer bank (BCA, Mandiri, BNI), kartu kredit, dan e-wallet (GoPay, OVO, Dana) melalui payment gateway Midtrans.", sort_order: 1 },
  { id: "3", question: "Apakah peserta mendapat sertifikat?", answer: "Ya, setiap peserta yang menghadiri seminar akan mendapatkan sertifikat digital yang bisa diunduh melalui dashboard akun Anda.", sort_order: 2 },
  { id: "4", question: "Bagaimana kebijakan refund?", answer: "Refund dapat diajukan maksimal 7 hari sebelum acara dengan potongan admin 10%. Setelah itu, tiket bisa dipindahtangankan ke orang lain.", sort_order: 3 },
  { id: "5", question: "Di mana lokasi seminar diadakan?", answer: "Seminar diadakan di hotel-hotel bintang 4-5 di kota-kota besar Indonesia seperti Jakarta, Surabaya, Bandung, Bali, dan Medan.", sort_order: 4 },
]

function formatPrice(n: number) {
  return "Rp " + n.toLocaleString("id-ID")
}

export default async function HomePage() {
  // Fetch semua data paralel dari Supabase
  const [statsRes, testimonialsRes, seminarsRes, pricingRes, faqsRes] = await Promise.all([
    getCompanyStats(),
    getFeaturedTestimonials(),
    getFeaturedSeminars(),
    getPricingPackages(),
    getFaqs(),
  ])

  const stats = statsRes.data?.length ? statsRes.data : FALLBACK_STATS
  const testimonials = testimonialsRes.data?.length ? testimonialsRes.data : FALLBACK_TESTIMONIALS
  const seminars = seminarsRes.data ?? []
  const pricing = pricingRes.data?.length ? pricingRes.data : FALLBACK_PRICING
  const faqs = faqsRes.data?.length ? faqsRes.data : FALLBACK_FAQS

  return (
    <div className="bg-background text-foreground overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-[120px]"
            style={{ background: GOLD }} />
          <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full opacity-[0.06] blur-[80px]"
            style={{ background: GOLD }} />
          <div className="absolute bottom-0 left-0 h-[250px] w-[250px] rounded-full opacity-[0.05] blur-[80px]"
            style={{ background: GOLD }} />
          {/* Grid lines */}
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
            Seminar bisnis, properti, dan pengembangan diri terpercaya di Indonesia.
            Bergabunglah dengan <strong className="text-foreground">50.000+ alumni</strong> yang telah mengubah hidup mereka.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/schedule"
              className="group inline-flex h-13 items-center gap-2 rounded-xl px-8 text-base font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={{ background: GOLD, color: "oklch(0.08 0 0)", boxShadow: `0 0 30px ${GOLD}40` }}>
              Lihat Seminar Terdekat
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
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
            /* Fallback cards jika belum ada data di Supabase */
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Property Revolution", category: "Properti", city: "Jakarta", price: "Rp 2.500.000", date: "15 Juni 2026" },
                { title: "Sales Mastery", category: "Sales", city: "Surabaya", price: "Rp 1.800.000", date: "22 Juni 2026" },
                { title: "Business Breakthrough", category: "Bisnis", city: "Bandung", price: "Rp 3.000.000", date: "29 Juni 2026" },
              ].map((s) => (
                <div key={s.title} className="glass glass-hover flex flex-col rounded-2xl p-6">
                  <span className="w-fit rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ background: `${GOLD}20`, color: GOLD }}>{s.category}</span>
                  <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                  <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2"><Calendar className="size-3.5" style={{ color: GOLD }} />{s.date}</span>
                    <span className="flex items-center gap-2"><MapPin className="size-3.5" style={{ color: GOLD }} />{s.city}</span>
                  </div>
                  <p className="mt-4 text-2xl font-bold" style={{ color: GOLD }}>{s.price}</p>
                  <Link href="/schedule"
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                    style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
                    Daftar Sekarang
                  </Link>
                </div>
              ))}
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

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 text-center text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
            Paket Harga
          </div>
          <h2 className="text-center text-4xl font-bold sm:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pilih Paket Yang Sesuai
          </h2>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pricing.map((p) => (
              <div key={p.id}
                className="relative flex flex-col rounded-2xl p-7 transition-all duration-300"
                style={{
                  background: p.is_popular ? `${GOLD}08` : "oklch(0.11 0.008 55 / 0.6)",
                  border: `1px solid ${p.is_popular ? `${GOLD}50` : "oklch(0.22 0.01 55 / 0.4)"}`,
                  backdropFilter: "blur(16px)",
                  boxShadow: p.is_popular ? `0 0 40px ${GOLD}15` : "none",
                }}>
                {p.is_popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold"
                    style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
                    Paling Populer
                  </span>
                )}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-2 text-3xl font-bold" style={{ color: GOLD, fontFamily: "'Playfair Display', serif" }}>
                  {formatPrice(p.price)}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0" style={{ color: GOLD }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register"
                  className="mt-8 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                  style={p.is_popular
                    ? { background: GOLD, color: "oklch(0.08 0 0)" }
                    : { border: `1px solid ${GOLD}40`, color: GOLD }}>
                  Daftar Sekarang
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 text-center text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
            FAQ
          </div>
          <h2 className="text-center text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pertanyaan Umum
          </h2>

          <Accordion className="mt-12">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.id} value={`faq-${i}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent><p>{faq.answer}</p></AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

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
            Bergabunglah dengan 50.000+ alumni yang telah merasakan transformasi nyata bersama TDW Resources.
          </p>
          <Link href="/register"
            className="mt-10 inline-flex h-14 items-center rounded-xl px-10 text-base font-bold transition-all duration-300 hover:scale-[1.02]"
            style={{ background: GOLD, color: "oklch(0.08 0 0)", boxShadow: `0 0 40px ${GOLD}40` }}>
            Daftar Sekarang — Gratis
          </Link>
        </div>
      </section>

    </div>
  )
}
