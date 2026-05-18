"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { CalendarDays, MapPin, LayoutGrid, List, AlertCircle } from "lucide-react"
import type { Schedule } from "@/infrastructure/storage/supabase-queries"

const GOLD = "oklch(0.78 0.16 55)"

// Fallback data jika Supabase belum ada data
const FALLBACK: Schedule[] = [
  { id: "1", start_date: "2026-06-15T09:00:00Z", end_date: "2026-06-15T17:00:00Z", city: "Jakarta", venue: "JCC Senayan", address: null, seminar: { id: "1", title: "Property Revolution", short_desc: "", thumbnail_url: null, category: { name: "Properti", color: null } }, tickets: [{ id: "1", name: "Regular", price: 2500000, early_bird_price: null, early_bird_until: null, quota: 500, sold: 200 }] },
  { id: "2", start_date: "2026-06-22T09:00:00Z", end_date: "2026-06-22T17:00:00Z", city: "Surabaya", venue: "Grand City Hall", address: null, seminar: { id: "2", title: "Sales Mastery", short_desc: "", thumbnail_url: null, category: { name: "Sales", color: null } }, tickets: [{ id: "2", name: "Regular", price: 1800000, early_bird_price: null, early_bird_until: null, quota: 300, sold: 280 }] },
  { id: "3", start_date: "2026-07-05T09:00:00Z", end_date: "2026-07-05T17:00:00Z", city: "Bandung", venue: "Trans Convention", address: null, seminar: { id: "3", title: "Business Breakthrough", short_desc: "", thumbnail_url: null, category: { name: "Bisnis", color: null } }, tickets: [{ id: "3", name: "Regular", price: 3000000, early_bird_price: 2500000, early_bird_until: "2026-06-25T00:00:00Z", quota: 400, sold: 100 }] },
  { id: "4", start_date: "2026-07-12T09:00:00Z", end_date: "2026-07-12T17:00:00Z", city: "Jakarta", venue: "ICE BSD", address: null, seminar: { id: "4", title: "Life Revolution", short_desc: "", thumbnail_url: null, category: { name: "Life", color: null } }, tickets: [{ id: "4", name: "Regular", price: 2000000, early_bird_price: null, early_bird_until: null, quota: 600, sold: 150 }] },
  { id: "5", start_date: "2026-07-19T09:00:00Z", end_date: "2026-07-19T17:00:00Z", city: "Medan", venue: "Santika Convention", address: null, seminar: { id: "5", title: "Property Mastery", short_desc: "", thumbnail_url: null, category: { name: "Properti", color: null } }, tickets: [{ id: "5", name: "Regular", price: 2800000, early_bird_price: null, early_bird_until: null, quota: 250, sold: 50 }] },
  { id: "6", start_date: "2026-07-26T09:00:00Z", end_date: "2026-07-26T17:00:00Z", city: "Jakarta", venue: "Balai Kartini", address: null, seminar: { id: "6", title: "Sales Champion", short_desc: "", thumbnail_url: null, category: { name: "Sales", color: null } }, tickets: [{ id: "6", name: "Regular", price: 1500000, early_bird_price: null, early_bird_until: null, quota: 300, sold: 300 }] },
  { id: "7", start_date: "2026-08-02T09:00:00Z", end_date: "2026-08-02T17:00:00Z", city: "Surabaya", venue: "Ciputra World", address: null, seminar: { id: "7", title: "Business Mastery", short_desc: "", thumbnail_url: null, category: { name: "Bisnis", color: null } }, tickets: [{ id: "7", name: "Regular", price: 3500000, early_bird_price: 3000000, early_bird_until: "2026-07-25T00:00:00Z", quota: 400, sold: 80 }] },
  { id: "8", start_date: "2026-08-09T09:00:00Z", end_date: "2026-08-09T17:00:00Z", city: "Bali", venue: "Bali Nusa Dua", address: null, seminar: { id: "8", title: "Life Mastery", short_desc: "", thumbnail_url: null, category: { name: "Life", color: null } }, tickets: [{ id: "8", name: "Regular", price: 2200000, early_bird_price: null, early_bird_until: null, quota: 200, sold: 170 }] },
]

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
  error: string | null
}

export default function ScheduleClient({ schedules, error }: Props) {
  const data = schedules.length ? schedules : FALLBACK

  // Derive available months & cities from data
  const months = useMemo(() => {
    const seen = new Set<string>()
    const result: { key: string; label: string; year: number; month: number }[] = []
    data.forEach((s) => {
      const d = new Date(s.start_date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (!seen.has(key)) {
        seen.add(key)
        result.push({
          key,
          label: d.toLocaleDateString("id-ID", { month: "short", year: "numeric" }),
          year: d.getFullYear(),
          month: d.getMonth(),
        })
      }
    })
    return result
  }, [data])

  const cities = useMemo(() => {
    const set = new Set(data.map((s) => s.city))
    return ["Semua Kota", ...Array.from(set).sort()]
  }, [data])

  const [monthKey, setMonthKey] = useState<string>("all")
  const [city, setCity] = useState("Semua Kota")
  const [view, setView] = useState<"list" | "grid">("list")

  const filtered = useMemo(() => {
    return data.filter((s) => {
      const d = new Date(s.start_date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const matchMonth = monthKey === "all" || key === monthKey
      const matchCity = city === "Semua Kota" || s.city === city
      return matchMonth && matchCity
    })
  }, [data, monthKey, city])

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28 px-6 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full opacity-[0.08] blur-[80px]"
            style={{ background: GOLD }} />
        </div>
        <div className="relative z-10">
          <div className="mb-4 text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
            Jadwal
          </div>
          <h1 className="text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Jadwal Seminar
          </h1>
          <p className="mt-4 text-muted-foreground">
            Temukan seminar yang sesuai dengan jadwal dan kebutuhan Anda
          </p>
        </div>
      </section>

      {/* ── FILTERS ──────────────────────────────────────────────────────── */}
      <div className="sticky top-[72px] z-30 border-b px-6 py-4"
        style={{ background: "oklch(0.07 0.005 260 / 0.9)", backdropFilter: "blur(16px)", borderColor: "oklch(0.22 0.01 55 / 0.3)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          {/* Month filter */}
          <div className="flex gap-1 rounded-xl border p-1"
            style={{ borderColor: "oklch(0.22 0.01 55 / 0.4)", background: "oklch(0.10 0.006 55)" }}>
            <button
              onClick={() => setMonthKey("all")}
              className="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200"
              style={monthKey === "all"
                ? { background: GOLD, color: "oklch(0.08 0 0)" }
                : { color: "oklch(0.58 0.01 60)" }}>
              Semua
            </button>
            {months.map((m) => (
              <button
                key={m.key}
                onClick={() => setMonthKey(m.key)}
                className="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200"
                style={monthKey === m.key
                  ? { background: GOLD, color: "oklch(0.08 0 0)" }
                  : { color: "oklch(0.58 0.01 60)" }}>
                {m.label}
              </button>
            ))}
          </div>

          {/* City filter */}
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-xl border px-4 py-2 text-sm transition-colors"
            style={{
              borderColor: "oklch(0.22 0.01 55 / 0.4)",
              background: "oklch(0.10 0.006 55)",
              color: "oklch(0.75 0.005 60)",
            }}>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* View toggle */}
          <div className="ml-auto flex gap-1 rounded-xl border p-1"
            style={{ borderColor: "oklch(0.22 0.01 55 / 0.4)", background: "oklch(0.10 0.006 55)" }}>
            <button
              onClick={() => setView("list")}
              className="rounded-lg p-2 transition-all duration-200"
              style={view === "list" ? { background: GOLD, color: "oklch(0.08 0 0)" } : { color: "oklch(0.58 0.01 60)" }}>
              <List className="size-4" />
            </button>
            <button
              onClick={() => setView("grid")}
              className="rounded-lg p-2 transition-all duration-200"
              style={view === "grid" ? { background: GOLD, color: "oklch(0.08 0 0)" } : { color: "oklch(0.58 0.01 60)" }}>
              <LayoutGrid className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── ERROR ────────────────────────────────────────────────────────── */}
      {error && (
        <div className="mx-auto mt-6 max-w-6xl px-6">
          <div className="flex items-center gap-3 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-400">
            <AlertCircle className="size-4 shrink-0" />
            Menggunakan data contoh. {error}
          </div>
        </div>
      )}

      {/* ── SCHEDULE LIST ────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            Tidak ada seminar untuk filter ini.
          </div>
        ) : (
          <div className={view === "grid" ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
            {filtered.map((s) => {
              const ticket = s.tickets?.[0]
              const price = ticket?.early_bird_price ?? ticket?.price ?? 0
              const isEarlyBird = !!ticket?.early_bird_price
              const soldOut = ticket ? ticket.sold >= ticket.quota : false
              const startDate = new Date(s.start_date)
              const dateStr = startDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })

              return (
                <div key={s.id} className="glass glass-hover rounded-2xl p-6">
                  {view === "list" ? (
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* Date block */}
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-center"
                          style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}25` }}>
                          <span className="text-lg font-bold leading-none" style={{ color: GOLD }}>
                            {startDate.getDate()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {startDate.toLocaleDateString("id-ID", { month: "short" })}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full px-2 py-0.5 text-xs font-medium"
                              style={{ background: `${GOLD}15`, color: GOLD }}>
                              {s.seminar.category.name}
                            </span>
                            {isEarlyBird && !soldOut && (
                              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                                Early Bird
                              </span>
                            )}
                          </div>
                          <h3 className="mt-1 font-semibold">{s.seminar.title}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <CalendarDays className="size-3.5" style={{ color: GOLD }} />{dateStr}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="size-3.5" style={{ color: GOLD }} />{s.city} · {s.venue}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xl font-bold" style={{ color: GOLD }}>{formatPrice(price)}</p>
                          {ticket && <StatusBadge ticket={ticket} />}
                        </div>
                        <Link href={`/schedule`}
                          className="inline-flex h-10 items-center rounded-xl px-5 text-sm font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-40"
                          style={soldOut
                            ? { background: "oklch(0.18 0.005 55)", color: "oklch(0.45 0 0)", pointerEvents: "none" }
                            : { background: GOLD, color: "oklch(0.08 0 0)" }}>
                          {soldOut ? "Sold Out" : "Daftar"}
                        </Link>
                      </div>
                    </div>
                  ) : (
                    /* Grid view */
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{ background: `${GOLD}15`, color: GOLD }}>
                          {s.seminar.category.name}
                        </span>
                        {isEarlyBird && !soldOut && (
                          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                            Early Bird
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold leading-snug">{s.seminar.title}</h3>
                      <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <CalendarDays className="size-3.5" style={{ color: GOLD }} />{dateStr}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="size-3.5" style={{ color: GOLD }} />{s.city} · {s.venue}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold" style={{ color: GOLD }}>{formatPrice(price)}</p>
                        {ticket && <StatusBadge ticket={ticket} />}
                      </div>
                      <Link href={`/schedule`}
                        className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all duration-200 hover:opacity-90"
                        style={soldOut
                          ? { background: "oklch(0.18 0.005 55)", color: "oklch(0.45 0 0)", pointerEvents: "none" }
                          : { background: GOLD, color: "oklch(0.08 0 0)" }}>
                        {soldOut ? "Sold Out" : "Daftar Sekarang"}
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
