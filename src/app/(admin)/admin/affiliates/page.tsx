import { supabaseAdmin } from "@/infrastructure/storage/db-client"
import AdminAffiliatesClient from "./affiliates-client"

export default async function AdminAffiliatesPage() {
  const { data: affiliates } = await supabaseAdmin
    .from("affiliates")
    .select(`id, code, is_approved, total_earned, total_withdrawn, created_at,
      user:users!inner(email, profiles(full_name))`)
    .order("created_at", { ascending: false })

  const { data: withdrawals } = await supabaseAdmin
    .from("withdrawals")
    .select(`id, amount, status, created_at,
      affiliate:affiliates!inner(code, user:users!inner(email, profiles(full_name)))`)
    .eq("status", "PENDING")
    .order("created_at")

  return (
    <AdminAffiliatesClient
      affiliates={(affiliates as any[]) ?? []}
      withdrawals={(withdrawals as any[]) ?? []}
    />
  )
}
