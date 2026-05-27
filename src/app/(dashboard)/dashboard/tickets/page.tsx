import { redirect } from "next/navigation"
import { getServerSession } from "@/infrastructure/session/auth-server"
import { getUserOrders } from "@/infrastructure/storage/supabase-queries"
import TicketsContent from "./tickets-client"

export default async function TicketsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await getServerSession()
  if (!session) redirect("/login")

  const params = await searchParams
  const tab = params.tab === "history" ? "history" : params.tab === "pending" ? "pending" : "active"

  const { data: orders } = await getUserOrders(session.id)

  const now = new Date()
  const active = (orders ?? []).filter(o =>
    o.status === 'PAID' && o.order_items?.some((item: any) =>
      new Date(item.ticket?.schedule?.start_date) > now
    )
  )
  const history = (orders ?? []).filter(o =>
    o.status === 'PAID' && !active.includes(o)
  )
  // PENDING = belum kirim bukti, CONFIRMED = sudah kirim, menunggu verifikasi admin
  const pending = (orders ?? []).filter(o =>
    o.status === 'PENDING' || o.status === 'CONFIRMED'
  )

  return <TicketsContent active={active as any[]} history={history as any[]} pending={pending as any[]} currentTab={tab} />
}
