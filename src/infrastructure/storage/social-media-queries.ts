import { supabaseAdmin as supabase } from '@infrastructure/storage/db-client'
import { unstable_cache } from 'next/cache'
import type { Platform, SocialMediaContent } from '@/shared/types/domain.types'

export const getSocialMediaContents = unstable_cache(async () => {
  const { data, error } = await supabase
    .from('social_media_contents')
    .select('id, platform, title, caption, content_url, embed_id, thumbnail_url, view_count, like_count, is_featured, is_active, published_at, sort_order')
    .eq('is_active', true)
    .order('sort_order')
  return { data: data as SocialMediaContent[] | null, error }
}, ['social-media-contents'], { revalidate: 600, tags: ['social-media'] })

export const getFeaturedSocialMediaByPlatform = unstable_cache(async (platform: Platform) => {
  const { data, error } = await supabase
    .from('social_media_contents')
    .select('id, platform, title, caption, content_url, embed_id, thumbnail_url, view_count, like_count, is_featured, is_active, published_at, sort_order')
    .eq('platform', platform)
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('sort_order')
    .limit(1)
    .single()
  return { data: data as SocialMediaContent | null, error }
}, ['social-media-featured'], { revalidate: 600, tags: ['social-media'] })

export const getSocialMediaByPlatform = unstable_cache(async (platform: Platform) => {
  const { data, error } = await supabase
    .from('social_media_contents')
    .select('id, platform, title, caption, content_url, embed_id, thumbnail_url, view_count, like_count, is_featured, is_active, published_at, sort_order')
    .eq('platform', platform)
    .eq('is_active', true)
    .order('sort_order')
  return { data: data as SocialMediaContent[] | null, error }
}, ['social-media-by-platform'], { revalidate: 600, tags: ['social-media'] })
