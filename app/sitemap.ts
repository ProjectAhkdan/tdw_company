import type { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/db/client'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tdwresources.id'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [seminarsRes, postsRes] = await Promise.all([
    supabaseAdmin.from('seminars').select('slug, updated_at').eq('status', 'PUBLISHED'),
    supabaseAdmin.from('blog_posts').select('slug, updated_at').eq('is_published', true),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/seminars`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/schedule`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const seminarRoutes: MetadataRoute.Sitemap = (seminarsRes.data ?? []).map((s: any) => ({
    url: `${BASE}/seminars/${s.slug}`,
    lastModified: new Date(s.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const blogRoutes: MetadataRoute.Sitemap = (postsRes.data ?? []).map((p: any) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...seminarRoutes, ...blogRoutes]
}
