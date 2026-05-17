import { supabaseAdmin } from "@/lib/db/client"
import AdminReportsClient from "./reports-client"

export default async function AdminReportsPage() {
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
    <AdminReportsClient
      orders={(ordersRes.data as any[]) ?? []}
      categories={(categoryRes.data as any[]) ?? []}
    />
  )
}
