import { notFound } from "next/navigation"
import Image from "next/image"
import type { Metadata } from "next"
import { Calendar, MapPin, Users, Award } from "lucide-react"
import { getSeminarBySlug } from "@/infrastructure/storage/supabase-queries"
import TicketPicker from "@/features/seminar/ui/ticket-picker"

const GOLD = "#D9F25D"
const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tdwresources.id'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data } = await getSeminarBySlug(slug)
  if (!data) return { title: "Seminar Tidak Ditemukan" }
  return {
    title: data.meta_title ?? data.title,
    description: data.meta_description ?? data.short_desc,
    openGraph: {
      title: data.title, description: data.short_desc, type: 'website',
      images: data.thumbnail_url ? [data.thumbnail_url] : [],
      url: `${BASE}/seminars/${data.slug}`,
    },
    alternates: { canonical: `${BASE}/seminars/${data.slug}` },
  }
}

export default async function SeminarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: seminar } = await getSeminarBySlug(slug)

  if (!seminar) notFound()

  const upcomingSchedules = seminar.schedules
    .filter(s => new Date(s.start_date) > new Date())
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())

  const nextSchedule = upcomingSchedules[0] ?? seminar.schedules[0]
  const totalQuota = seminar.schedules.flatMap(s => s.tickets).reduce((a, t) => a + t.quota, 0)
  const totalSold = seminar.schedules.flatMap(s => s.tickets).reduce((a, t) => a + t.sold, 0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {nextSchedule && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Event',
          name: seminar.title, description: seminar.short_desc,
          startDate: nextSchedule.start_date, endDate: nextSchedule.end_date,
          location: { '@type': 'Place', name: nextSchedule.venue, address: { '@type': 'PostalAddress', addressLocality: nextSchedule.city, addressCountry: 'ID' } },
          organizer: { '@type': 'Organization', name: 'TDW Resources', url: BASE },
          image: seminar.thumbnail_url ?? undefined,
          url: `${BASE}/seminars/${seminar.slug}`,
        }) }} />
      )}

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative">
        {/* Thumbnail */}
        <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
          {seminar.thumbnail_url ? (
            <Image src={seminar.thumbnail_url} alt={seminar.title} fill className="object-cover" priority />
          ) : (
            <div className="flex h-full items-center justify-center" style={{ background: `${GOLD}08` }}>
              <span className="text-6xl font-bold opacity-10" style={{ fontFamily: "'Playfair Display', serif" }}>TDW</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Hero content */}
        <div className="mx-auto max-w-6xl px-6 pb-8 -mt-24 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: `${GOLD}20`, color: GOLD }}>
              {seminar.category.name}
            </span>
            {seminar.is_featured && (
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            {seminar.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{seminar.short_desc}</p>

          {nextSchedule && (
            <div className="mt-5 flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="size-4" style={{ color: GOLD }} />
                {new Date(nextSchedule.start_date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-4" style={{ color: GOLD }} />
                {nextSchedule.venue}, {nextSchedule.city}
              </span>
              <span className="flex items-center gap-2">
                <Users className="size-4" style={{ color: GOLD }} />
                {totalSold} peserta terdaftar
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── Main content + Sidebar ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">

          {/* Left: Description + Speaker */}
          <div className="space-y-10">

            {/* Description */}
            <section>
              <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Tentang Seminar
              </h2>
              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {seminar.description}
              </div>
            </section>

            {/* Schedules */}
            {seminar.schedules.length > 1 && (
              <section>
                <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Semua Jadwal
                </h2>
                <div className="space-y-3">
                  {seminar.schedules.map(s => {
                    const minPrice = Math.min(...s.tickets.map(t => {
                      const now = new Date()
                      return t.early_bird_price && t.early_bird_until && new Date(t.early_bird_until) > now
                        ? t.early_bird_price : t.price
                    }))
                    const rem = s.tickets.reduce((a, t) => a + (t.quota - t.sold), 0)
                    return (
                      <div key={s.id} className="glass rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-2 font-medium">
                            <Calendar className="size-3.5" style={{ color: GOLD }} />
                            {new Date(s.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                          <p className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="size-3.5" style={{ color: GOLD }} />
                            {s.venue}, {s.city}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: GOLD }}>Rp {minPrice.toLocaleString("id-ID")}</p>
                          <p className="text-xs text-muted-foreground">Sisa {rem} kursi</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Speaker */}
            <section>
              <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Pembicara
              </h2>
              <div className="glass rounded-2xl p-6 flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold"
                  style={{ background: `${GOLD}20`, color: GOLD, fontFamily: "'Playfair Display', serif" }}>
                  TDW
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Tung Desem Waringin</h3>
                  <p className="text-sm" style={{ color: GOLD }}>Motivator & Business Coach #1 Indonesia</p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Lebih dari 20 tahun pengalaman membantu ribuan pengusaha dan profesional mencapai potensi terbaik mereka melalui seminar bisnis, properti, dan pengembangan diri.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["50.000+ Alumni", "200+ Seminar", "Best-Seller Author"].map(tag => (
                      <span key={tag} className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs"
                        style={{ background: `${GOLD}10`, color: GOLD }}>
                        <Award className="size-3" />{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right: Sticky sidebar */}
          <aside>
            <div className="sticky top-24">
              <div className="glass rounded-2xl p-6" style={{ border: `1px solid ${GOLD}20` }}>
                <div className="mb-4 border-b pb-4" style={{ borderColor: "oklch(0.22 0.01 55 / 0.3)" }}>
                  <p className="text-xs text-muted-foreground">Mulai dari</p>
                  {(() => {
                    const allPrices = seminar.schedules.flatMap(s => s.tickets.map(t => {
                      const now = new Date()
                      return t.early_bird_price && t.early_bird_until && new Date(t.early_bird_until) > now
                        ? t.early_bird_price : t.price
                    }))
                    const min = allPrices.length ? Math.min(...allPrices) : null
                    return min !== null ? (
                      <p className="text-2xl font-bold" style={{ color: GOLD }}>
                        Rp {min.toLocaleString("id-ID")}
                      </p>
                    ) : null
                  })()}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {totalQuota - totalSold} kursi tersisa dari {totalQuota}
                  </p>
                </div>
                <TicketPicker schedules={seminar.schedules} />
              </div>
            </div>
          </aside>

        </div>
      </div>

    </div>
  )
}
