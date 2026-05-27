'use client'

import Link from "next/link"
import { CalendarDays, MapPin } from "lucide-react"
import type { Schedule } from "@/infrastructure/storage/supabase-queries"
import { AnimatedList } from "@/shared/ui/animated-list"

const GOLD = "#D9F25D"

function formatPrice(n: number) {
  return "Rp " + n.toLocaleString("id-ID")
}

function getStatus(ticket: Schedule["tickets"][0]) {
  if (ticket.sold >= ticket.quota) return "sold-out"
  if (ticket.sold >= ticket.quota * 0.85) return "almost-full"
  return "available"
}

function StatusBadge({ ticket }: { ticket: Schedule["tickets"][0] }) {
  const status = getStatus(ticket)
  const map = {
    "sold-out": { label: "Sold Out", cls: "bg-red-500/15 text-red-400" },
    "almost-full": { label: "Hampir Penuh", cls: "bg-orange-500/15 text-orange-400" },
    "available": { label: "Tersedia", cls: "bg-emerald-500/15 text-emerald-400" },
  }
  const { label, cls } = map[status]
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${cls}`}>{label}</span>
}

interface Props {
  schedules: Schedule[]
  view: "list" | "grid"
}

export function ScheduleList({ schedules, view }: Props) {
  if (schedules.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Tidak ada seminar untuk filter ini.
      </div>
    )
  }

  if (view === "grid") {
    return (
      <AnimatedList showGradients={false} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {schedules.map((s) => {
          const ticket = s.tickets?.[0]
          const price = ticket?.early_bird_price ?? ticket?.price ?? 0
          const isEarlyBird = !!ticket?.early_bird_price
          const soldOut = ticket ? ticket.sold >= ticket.quota : false
          const startDate = new Date(s.start_date)
          const dateStr = startDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
          return (
            <div key={s.id} className="glass glass-hover rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: `${GOLD}15`, color: GOLD }}>
                  {s.seminar.category.name}
                </span>
                {isEarlyBird && !soldOut && (
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">Early Bird</span>
                )}
              </div>
              <h3 className="text-lg font-semibold leading-snug">{s.seminar.title}</h3>
              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><CalendarDays className="size-3.5" style={{ color: GOLD }} />{dateStr}</span>
                <span className="flex items-center gap-2"><MapPin className="size-3.5" style={{ color: GOLD }} />{s.city} · {s.venue}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold" style={{ color: GOLD }}>{formatPrice(price)}</p>
                {ticket && <StatusBadge ticket={ticket} />}
              </div>
              <Link href={`/checkout?ticket=${ticket?.id}`}
                className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={soldOut ? { background: "oklch(0.18 0.005 55)", color: "oklch(0.45 0 0)", pointerEvents: "none" } : { background: GOLD, color: "#0A0A0A" }}>
                {soldOut ? "Sold Out" : "Daftar Sekarang"}
              </Link>
            </div>
          )
        })}
      </AnimatedList>
    )
  }

  // List view
  return (
    <AnimatedList showGradients className="flex flex-col gap-4">
      {schedules.map((s) => {
        const ticket = s.tickets?.[0]
        const price = ticket?.early_bird_price ?? ticket?.price ?? 0
        const isEarlyBird = !!ticket?.early_bird_price
        const soldOut = ticket ? ticket.sold >= ticket.quota : false
        const startDate = new Date(s.start_date)
        const dateStr = startDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })

        return (
          <div key={s.id} className="glass glass-hover rounded-2xl p-4 sm:p-6">
            {/* Mobile: stack vertically. Desktop: row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                {/* Date block */}
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-center"
                  style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}25` }}>
                  <span className="text-lg font-bold leading-none" style={{ color: GOLD }}>{startDate.getDate()}</span>
                  <span className="text-xs text-muted-foreground">{startDate.toLocaleDateString("id-ID", { month: "short" })}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: `${GOLD}15`, color: GOLD }}>
                      {s.seminar.category.name}
                    </span>
                    {isEarlyBird && !soldOut && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">Early Bird</span>
                    )}
                  </div>
                  <h3 className="mt-1 font-semibold">{s.seminar.title}</h3>
                  <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-3">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 shrink-0" style={{ color: GOLD }} />{dateStr}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" style={{ color: GOLD }} />{s.city} · {s.venue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price + action */}
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                <div className="sm:text-right">
                  <p className="text-xl font-bold" style={{ color: GOLD }}>{formatPrice(price)}</p>
                  {ticket && <StatusBadge ticket={ticket} />}
                </div>
                <Link href={`/checkout?ticket=${ticket?.id}`}
                  className="inline-flex h-10 shrink-0 items-center rounded-xl px-5 text-sm font-semibold transition-all duration-200 hover:opacity-90"
                  style={soldOut ? { background: "oklch(0.18 0.005 55)", color: "oklch(0.45 0 0)", pointerEvents: "none" } : { background: GOLD, color: "#0A0A0A" }}>
                  {soldOut ? "Sold Out" : "Daftar"}
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </AnimatedList>
  )
}
