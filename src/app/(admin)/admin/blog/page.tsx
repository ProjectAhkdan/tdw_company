export const dynamic = 'force-dynamic'

import { supabaseAdmin } from "@/infrastructure/storage/db-client"
import AdminBlogContent from "./blog-client"

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams
  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("id, slug, title, category, is_published, published_at, created_at")
    .order("created_at", { ascending: false })
  return <AdminBlogContent posts={(data as any[]) ?? []} searchQuery={params.q || ""} />
}
