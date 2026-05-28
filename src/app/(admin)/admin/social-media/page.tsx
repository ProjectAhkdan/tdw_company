export const dynamic = 'force-dynamic'

import { supabaseAdmin } from "@/infrastructure/storage/db-client"
import { SocialMediaAdmin } from "./social-media-admin"

export default async function AdminSocialMediaPage() {
  const { data } = await supabaseAdmin
    .from("social_media_contents")
    .select("id, platform, title, embed_id, content_url, view_count, like_count, is_featured, is_active, published_at, sort_order")
    .order("platform")
    .order("sort_order")
  return <SocialMediaAdmin items={(data as any[]) ?? []} />
}
