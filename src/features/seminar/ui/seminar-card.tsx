import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Users } from "lucide-react"
import type { SeminarListItem } from "@/infrastructure/storage/supabase-queries"

const GOLD = "#D9F25D"

function getLowestPrice(seminar: SeminarListItem) {
  const prices: number[] = []
  for (const s of seminar.schedules) {
    for (const t of s.tickets) {
      const now = new Date()
      const isEB = t.early_bird_price && t.early_bird_until && new Date(t.early_bird_until) > now
      prices.push(isEB ? t.early_bird_price! : t.price)
    }
  }
  return prices.length ? Math.min(...prices) : null
}

function getTotalQuota(seminar: SeminarListItem) {
  let quota = 0, sold = 0
  for (const s of seminar.schedules) for (const t of s.tickets) { quota += t.quota; sold += t.sold }
  return { quota, sold, remaining: quota - sold }
}

function getNextSchedule(seminar: SeminarListItem) {
  const upcoming = seminar.schedules
    .filter(s => new Date(s.start_date) > new Date())
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
  return upcoming[0] ?? seminar.schedules[0] ?? null
}

export function SeminarCard({ seminar }: { seminar: SeminarListItem }) {
  const price = getLowestPrice(seminar)
  const { remaining } = getTotalQuota(seminar)
  const next = getNextSchedule(seminar)
  const soldOut = remaining <= 0
  const almostFull = !soldOut && remaining <= 10

  return (
    <Link href={`/seminars/${seminar.slug}`}
      className="glass glass-hover group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden bg-muted/30">
        {seminar.thumbnail_url ? (
          <Image src={seminar.thumbnail_url} alt={seminar.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-bold opacity-10"
            style={{ fontFamily: "'Playfair Display', serif" }}>TDW</div>
        )}
        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm"
            style={{ background: `${GOLD}25`, color: GOLD, border: `1px solid ${GOLD}30` }}>
            {seminar.category.name}
          </span>
          {seminar.is_featured && (
            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-300 backdrop-blur-sm">
              Featured
            </span>
          )}
        </div>
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="rounded-full bg-red-500/20 px-4 py-1.5 text-sm font-semibold text-red-400 border border-red-500/30">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug group-hover:text-[oklch(0.78_0.16_55)] transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {seminar.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{seminar.short_desc}</p>

        {next && (
          <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 shrink-0" style={{ color: GOLD }} />
              {new Date(next.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" style={{ color: GOLD }} />
              {next.city}
            </span>
          </div>
        )}

        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            {price !== null ? (
              <>
                <p className="text-xs text-muted-foreground">Mulai dari</p>
                <p className="text-lg font-bold" style={{ color: GOLD }}>
                  Rp {price.toLocaleString("id-ID")}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Harga belum tersedia</p>
            )}
          </div>
          {!soldOut && (
            <span className={`flex items-center gap-1 text-xs font-medium ${almostFull ? "text-orange-400" : "text-emerald-400"}`}>
              <Users className="size-3" />
              {remaining} kursi
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function SeminarCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-muted/30" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 rounded bg-muted/40" />
        <div className="h-3 w-full rounded bg-muted/30" />
        <div className="h-3 w-2/3 rounded bg-muted/30" />
        <div className="pt-2 flex justify-between">
          <div className="h-5 w-24 rounded bg-muted/40" />
          <div className="h-4 w-16 rounded bg-muted/30" />
        </div>
      </div>
    </div>
  )
}
