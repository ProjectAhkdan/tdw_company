export const dynamic = 'force-dynamic'

import { getAdminUsers } from "@/infrastructure/storage/supabase-queries"
import AdminUsersContent from "./users-client"

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string; role?: string }> }) {
  const params = await searchParams
  const { data } = await getAdminUsers(200).catch(() => ({ data: null }))
  
  return <AdminUsersContent 
    users={data ?? []} 
    searchQuery={params.q || ""}
    roleFilter={params.role || "ALL"}
  />
}



