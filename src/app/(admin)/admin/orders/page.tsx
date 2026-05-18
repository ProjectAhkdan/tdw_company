import { getAdminOrders } from "@/infrastructure/storage/supabase-queries"
import AdminOrdersClient from "./orders-client"

export default async function AdminOrdersPage() {
  const { data } = await getAdminOrders(100).catch(() => ({ data: null }))
  return <AdminOrdersClient orders={data ?? []} />
}
