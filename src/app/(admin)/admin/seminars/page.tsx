import { supabaseAdmin } from "@/infrastructure/storage/db-client"
import AdminSeminarsClient from "./seminars-client"

export default async function AdminSeminarsPage() {
  const { data } = await supabaseAdmin
    .from("seminars")
    .select(`id, slug, title, status, is_featured, created_at,
      category:categories(name),
      schedules(id, start_date, city,
        tickets(id, name, price, quota, sold))`)
    .order("created_at", { ascending: false })

  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("id, name")
    .order("name")

  return (
    <AdminSeminarsClient
      seminars={(data as any[]) ?? []}
      categories={(categories as any[]) ?? []}
    />
  )
}
