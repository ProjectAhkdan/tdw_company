import { redirect } from "next/navigation"
import Link from "next/link"
import { CalendarDays, Ticket, Wallet, MapPin, ArrowRight } from "lucide-react"
import { getServerSession } from "@/infrastructure/session/auth-server"
import { getUserOrders, getFeaturedSeminars } from "@/infrastructure/storage/supabase-queries"

const GOLD = "oklch(0.78 0.16 55)"

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session) redirect("/login")

  const [{ data: orders }, { data: upcoming }] = await Promise.all([
    getUserOrders(session.id),
    getFeaturedSeminars(),
  ])

  const paidOrders = (orders ?? []).filter(o => o.status === 'PAID')
  const totalSpent = paidOrders.reduce((s, o) => s + o.total_amount, 0)
  const now = new Date()
  const activeTickets = paidOrders.filter(o =>
    o.order_items?.some((item: any) => new Date(item.ticket?.schedule?.start_date) > now)
  )

  const profiles = (session as any).profiles
  const profile = Array.isArray(profiles) ? profiles[0] : profiles
  const firstName = profile?.full_name?.split(' ')[0] ?? session.email?.split('@')[0] ?? 'Pengguna'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Selamat Datang, {firstName}! 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Pantau seminar dan tiket Anda di sini.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: CalendarDays, label: "Seminar Diikuti", value: String(paidOrders.length) },
          { icon: Ticket, label: "Tiket Aktif", value: String(activeTickets.length) },
          { icon: Wallet, label: "Total Pengeluaran", value: `Rp ${totalSpent.toLocaleString("id-ID")}` },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3" style={{ background: `${GOLD}15` }}>
              <s.icon className="size-5" style={{ color: GOLD }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: GOLD }}>{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tiket Aktif */}
      {activeTickets.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Tiket Aktif</h2>
            <Link href="/dashboard/tickets" className="flex items-center gap-1 text-xs hover:opacity-80" style={{ color: GOLD }}>
              Lihat semua <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {activeTickets.slice(0, 2).map(o => {
              const item = (o.order_items as any[])?.[0]
              const sched = item?.ticket?.schedule
              if (!sched) return null
              return (
                <div key={o.id} className="glass glass-hover rounded-2xl p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{sched.seminar?.title}</h3>
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: `${GOLD}20`, color: GOLD }}>
                      {item.ticket.name}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><CalendarDays className="size-3.5" style={{ color: GOLD }} />
                      {new Date(sched.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <p className="flex items-center gap-2"><MapPin className="size-3.5" style={{ color: GOLD }} />{sched.city} · {sched.venue}</p>
                  </div>
                  <Link href="/dashboard/tickets"
                    className="mt-4 flex h-9 items-center justify-center rounded-xl text-sm font-medium transition-all hover:opacity-90"
                    style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
                    Lihat Tiket
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Rekomendasi dari Supabase */}
      {(upcoming ?? []).length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Seminar Rekomendasi</h2>
            <Link href="/seminars" className="flex items-center gap-1 text-xs hover:opacity-80" style={{ color: GOLD }}>
              Lihat semua <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(upcoming ?? []).slice(0, 2).map(s => {
              const ticket = s.tickets?.[0]
              const price = ticket?.early_bird_price ?? ticket?.price ?? 0
              return (
                <div key={s.id} className="glass glass-hover rounded-2xl p-5">
                  <h3 className="font-semibold">{s.seminar.title}</h3>
                  <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><CalendarDays className="size-3.5" style={{ color: GOLD }} />
                      {new Date(s.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <p className="flex items-center gap-2"><MapPin className="size-3.5" style={{ color: GOLD }} />{s.city}</p>
                  </div>
                  <p className="mt-3 text-lg font-bold" style={{ color: GOLD }}>Rp {price.toLocaleString("id-ID")}</p>
                  <Link href="/seminars"
                    className="mt-4 flex h-9 items-center justify-center rounded-xl border text-sm font-medium transition-all hover:bg-white/5"
                    style={{ borderColor: `${GOLD}40`, color: GOLD }}>
                    Lihat Detail
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
