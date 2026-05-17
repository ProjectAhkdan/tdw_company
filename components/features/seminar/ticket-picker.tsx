"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, ChevronDown } from "lucide-react"
import type { SeminarDetail } from "@/lib/supabase/queries"

const GOLD = "oklch(0.78 0.16 55)"

type Schedule = SeminarDetail["schedules"][0]
type Ticket = Schedule["tickets"][0]

function getEffectivePrice(t: Ticket) {
  const now = new Date()
  if (t.early_bird_price && t.early_bird_until && new Date(t.early_bird_until) > now)
    return { price: t.early_bird_price, isEB: true }
  return { price: t.price, isEB: false }
}

export default function TicketPicker({ schedules }: { schedules: SeminarDetail["schedules"] }) {
  const router = useRouter()
  const upcoming = schedules
    .filter(s => new Date(s.start_date) > new Date())
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())

  const allSchedules = upcoming.length ? upcoming : schedules
  const [selectedScheduleId, setSelectedScheduleId] = useState(allSchedules[0]?.id ?? "")
  const [selectedTicketId, setSelectedTicketId] = useState<string>("")
  const [qty, setQty] = useState(1)

  const schedule = allSchedules.find(s => s.id === selectedScheduleId)
  const ticket = schedule?.tickets.find(t => t.id === selectedTicketId)
  const { price, isEB } = ticket ? getEffectivePrice(ticket) : { price: 0, isEB: false }
  const remaining = ticket ? ticket.quota - ticket.sold : 0
  const soldOut = ticket ? remaining <= 0 : false

  function handleBuy() {
    if (!selectedTicketId) return
    router.push(`/checkout?ticket=${selectedTicketId}&qty=${qty}`)
  }

  if (!allSchedules.length) {
    return (
      <div className="glass rounded-2xl p-6 text-center text-sm text-muted-foreground">
        Belum ada jadwal tersedia
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Schedule selector */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Pilih Jadwal</label>
        <div className="relative">
          <select
            value={selectedScheduleId}
            onChange={e => { setSelectedScheduleId(e.target.value); setSelectedTicketId("") }}
            className="h-10 w-full appearance-none rounded-xl border px-3 pr-8 text-sm outline-none"
            style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }}>
            {allSchedules.map(s => (
              <option key={s.id} value={s.id}>
                {new Date(s.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} — {s.city}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>
        {schedule && (
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5"><Calendar className="size-3.5" style={{ color: GOLD }} />
              {new Date(schedule.start_date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="flex items-center gap-1.5"><MapPin className="size-3.5" style={{ color: GOLD }} />
              {schedule.venue}, {schedule.city}
            </p>
          </div>
        )}
      </div>

      {/* Ticket type selector */}
      {schedule && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Pilih Tipe Tiket</label>
          <div className="space-y-2">
            {schedule.tickets.map(t => {
              const { price: p, isEB: eb } = getEffectivePrice(t)
              const rem = t.quota - t.sold
              const full = rem <= 0
              const selected = selectedTicketId === t.id
              return (
                <button key={t.id} disabled={full}
                  onClick={() => setSelectedTicketId(t.id)}
                  className="w-full rounded-xl border p-3 text-left transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    borderColor: selected ? GOLD : "oklch(0.22 0.01 55 / 0.4)",
                    background: selected ? `${GOLD}10` : "oklch(0.11 0.008 55 / 0.5)",
                  }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: selected ? GOLD : "oklch(0.35 0.01 55)" }}>
                        {selected && <div className="h-2 w-2 rounded-full" style={{ background: GOLD }} />}
                      </div>
                      <span className="text-sm font-medium">{t.name}</span>
                      {eb && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-400">Early Bird</span>}
                      {full && <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-400">Sold Out</span>}
                    </div>
                    <span className="text-sm font-bold" style={{ color: GOLD }}>
                      Rp {p.toLocaleString("id-ID")}
                    </span>
                  </div>
                  {!full && (
                    <p className="mt-1 pl-6 text-xs text-muted-foreground">Sisa {rem} kursi</p>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      {selectedTicketId && !soldOut && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Jumlah Tiket</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setQty(q => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border text-lg font-medium transition-colors hover:bg-white/5"
              style={{ borderColor: "oklch(0.22 0.01 55 / 0.5)" }}>−</button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button onClick={() => setQty(q => Math.min(remaining, q + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-xl border text-lg font-medium transition-colors hover:bg-white/5"
              style={{ borderColor: "oklch(0.22 0.01 55 / 0.5)" }}>+</button>
          </div>
        </div>
      )}

      {/* Total + CTA */}
      {selectedTicketId && (
        <div className="border-t pt-4" style={{ borderColor: "oklch(0.22 0.01 55 / 0.3)" }}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="text-lg font-bold" style={{ color: GOLD }}>
              Rp {(price * qty).toLocaleString("id-ID")}
            </span>
          </div>
          <button onClick={handleBuy} disabled={soldOut}
            className="mt-3 h-11 w-full rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
            Beli Tiket Sekarang
          </button>
        </div>
      )}

      {!selectedTicketId && (
        <button disabled
          className="h-11 w-full rounded-xl text-sm font-bold opacity-40 cursor-not-allowed"
          style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
          Pilih Tipe Tiket
        </button>
      )}
    </div>
  )
}
