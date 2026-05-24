export const dynamic = 'force-dynamic'

import { supabaseAdmin } from "@/infrastructure/storage/db-client"
import AdminPaymentsClient from "./payments-client"

export default async function AdminPaymentsPage() {
  // Orders waiting for verification (status = CONFIRMED = user uploaded proof)
  const { data: pending } = await supabaseAdmin
    .from("orders")
    .select(`id, unique_amount, total_amount, proof_url, created_at, updated_at,
      bank:bank_accounts(bank_name, account_no),
      user:users!inner(email, profiles(full_name)),
      order_items(quantity, ticket:tickets!inner(name,
        schedule:schedules!inner(start_date, city,
          seminar:seminars!inner(title))))`)
    .eq("status", "CONFIRMED")
    .order("updated_at", { ascending: true })

  return <AdminPaymentsClient orders={(pending as any[]) ?? []} />
}



