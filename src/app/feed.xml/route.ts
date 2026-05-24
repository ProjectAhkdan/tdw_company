import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@infrastructure/storage/db-client'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tdwresources.id'

export async function GET() {
  const { data: posts } = await supabaseAdmin
    .from('blog_posts')
    .select('slug, title, excerpt, author_name, published_at, category')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(20)

  const items = (posts ?? []).map((p: any) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${APP_URL}/blog/${p.slug}</link>
      <guid>${APP_URL}/blog/${p.slug}</guid>
      <description><![CDATA[${p.excerpt}]]></description>
      <author>${p.author_name}</author>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
      ${p.category ? `<category>${p.category}</category>` : ''}
    </item>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TDW Resources — Blog</title>
    <link>${APP_URL}/blog</link>
    <description>Insight dan strategi dari Tung Desem Waringin</description>
    <language>id</language>
    <atom:link href="${APP_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}

