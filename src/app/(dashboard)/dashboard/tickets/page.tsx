import { redirect } from "next/navigation"
import { getServerSession } from "@/infrastructure/session/auth-server"
import { getUserOrders } from "@/infrastructure/storage/supabase-queries"
import TicketsClient from "./tickets-client"

export default async function TicketsPage() {
  const session = await getServerSession()
  if (!session) redirect("/login")

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

  return <TicketsClient active={active as any[]} history={history as any[]} />
}
