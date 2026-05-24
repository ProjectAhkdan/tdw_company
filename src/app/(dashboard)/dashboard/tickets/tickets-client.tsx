import Link from "next/link"
import { CalendarDays, MapPin, QrCode, Download } from "lucide-react"

const GOLD = "#D9F25D"

type Order = {
  id: string
  status: string
  order_items: {
    id: string
    quantity: number
    ticket: { name: string; schedule: { start_date: string; city: string; venue: string; seminar: { title: string } } }
  }[]
}

function TicketCard({ order, active }: { order: Order; active: boolean }) {
  const item = order.order_items?.[0]
  const sched = item?.ticket?.schedule
  if (!item || !sched) return null

  const dateStr = new Date(sched.start_date).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  })

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3"
        style={{ background: active ? `${GOLD}10` : "oklch(0.13 0.008 55 / 0.5)", borderBottom: `1px solid oklch(0.18 0.01 55 / 0.5)` }}>
        <span className="text-xs font-mono text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
        <div className="flex items-center gap-2">
          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ background: `${GOLD}20`, color: GOLD }}>{item.ticket.name}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${active ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
            {active ? "Aktif" : "Selesai"}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold">{sched.seminar.title}</h3>
        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><CalendarDays className="size-3.5" style={{ color: GOLD }} />{dateStr}</p>
          <p className="flex items-center gap-2"><MapPin className="size-3.5" style={{ color: GOLD }} />{sched.venue}, {sched.city}</p>
        </div>
        {active && (
          <div className="mt-4 flex items-center justify-center rounded-xl border border-dashed py-8"
            style={{ borderColor: "oklch(0.22 0.01 55 / 0.5)" }}>
            <QrCode className="size-20 text-muted-foreground/40" />
          </div>
        )}
        <a
          href={`/api/tickets/${order.id}/download`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={active ? { background: GOLD, color: "#0A0A0A", textDecoration: "none" } : { border: `1px solid oklch(0.22 0.01 55 / 0.5)`, color: "oklch(0.65 0 0)", textDecoration: "none" }}>
          <Download className="size-4" /> Unduh Tiket
        </a>
      </div>
    </div>
  )
}

export default function TicketsContent({ active, history, currentTab }: { active: Order[]; history: Order[]; currentTab: string }) {
  const isHistory = currentTab === "history"
  const currentItems = isHistory ? history : active

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Tiket Saya</h1>
        <p className="mt-1 text-sm text-muted-foreground">Kelola dan unduh tiket seminar Anda</p>
      </div>
      <div className="flex gap-1 rounded-xl border p-1 w-fit"
        style={{ borderColor: "oklch(0.22 0.01 55 / 0.4)", background: "oklch(0.10 0.006 55)" }}>
        <Link href="?tab=active"
          className="rounded-lg px-5 py-2 text-sm font-medium transition-all"
          style={!isHistory ? { background: GOLD, color: "#0A0A0A", textDecoration: "none" } : { color: "oklch(0.55 0.01 60)", textDecoration: "none" }}>
          Aktif ({active.length})
        </Link>
        <Link href="?tab=history"
          className="rounded-lg px-5 py-2 text-sm font-medium transition-all"
          style={isHistory ? { background: GOLD, color: "#0A0A0A", textDecoration: "none" } : { color: "oklch(0.55 0.01 60)", textDecoration: "none" }}>
          Riwayat ({history.length})
        </Link>
      </div>
      {currentItems.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Belum ada tiket {isHistory ? 'riwayat' : 'aktif'}.</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {currentItems.map(o => (
          <TicketCard key={o.id} order={o} active={!isHistory} />
        ))}
      </div>
    </div>
  )
}


