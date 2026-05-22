export const dynamic = 'force-dynamic'

import { supabaseAdmin } from "@/infrastructure/storage/db-client"
import AdminReportsContent from "./reports-client"

export default async function AdminReportsPage({ searchParams }: { searchParams: Promise<{ from?: string, to?: string, q?: string }> }) {
  const params = await searchParams
  
  // Default values
  const d = new Date()
  d.setDate(1)
  const defaultFrom = d.toISOString().slice(0, 10)
  const defaultTo = new Date().toISOString().slice(0, 10)
  
  const dateFrom = params.from || defaultFrom
  const dateTo = params.to || defaultTo
  const q = params.q || ""

  const [ordersRes, categoryRes] = await Promise.all([
    supabaseAdmin
      .from("orders")
      .select(`id, total_amount, status, created_at,
        payments(method),
        order_items(ticket:tickets!inner(schedule:schedules!inner(seminar:seminars!inner(category:categories(name)))))`)
      .eq("status", "PAID")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("categories")
      .select("id, name"),
  ])

  return (
    <AdminReportsContent
      orders={(ordersRes.data as any[]) ?? []}
      categories={(categoryRes.data as any[]) ?? []}
      dateFrom={dateFrom}
      dateTo={dateTo}
      q={q}
    />
  )
}
