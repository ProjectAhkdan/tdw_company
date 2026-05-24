export const dynamic = 'force-dynamic'

import { getAdminOrders } from "@/infrastructure/storage/supabase-queries"
import AdminOrdersContent from "./orders-client"

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const params = await searchParams
  const { data, error } = await getAdminOrders(100)
  if (error) console.error('[AdminOrders] query error:', error)
  console.log('[AdminOrders] data count:', data?.length ?? 0)
  
  return <AdminOrdersContent 
    orders={data ?? []} 
    searchQuery={params.q || ""}
    statusFilter={params.status || "ALL"}
  />
}



