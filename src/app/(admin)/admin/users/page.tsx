import { getAdminUsers } from "@/infrastructure/storage/supabase-queries"
import AdminUsersClient from "./users-client"

export default async function AdminUsersPage() {
  const { data } = await getAdminUsers(200).catch(() => ({ data: null }))
  return <AdminUsersClient users={data ?? []} />
}
