import { supabaseAdmin } from "@/infrastructure/storage/db-client"
import AdminSeminarsClient from "./seminars-client"

export const dynamic = 'force-dynamic'

export default async function AdminSeminarsPage() {
  const { data } = await supabaseAdmin
    .from("seminars")
    .select(`id, slug, title, short_desc, description, status, is_featured, thumbnail_url, created_at,
      category:categories(id, name),
      schedules(id, start_date, end_date, city, venue,
        tickets(id, name, price, early_bird_price, quota, sold))`)
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
