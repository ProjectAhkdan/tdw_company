import { supabaseAdmin } from "@/infrastructure/storage/db-client"
import AdminBlogClient from "./blog-client"

export default async function AdminBlogPage() {
  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("id, slug, title, category, is_published, published_at, created_at")
    .order("created_at", { ascending: false })
  return <AdminBlogClient posts={(data as any[]) ?? []} />
}
