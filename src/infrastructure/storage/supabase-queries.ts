import { supabaseAdmin as supabase } from '@infrastructure/storage/db-client'
import { unstable_cache } from 'next/cache'

export type CompanyStat = { id: string; label: string; value: string; sort_order: number }
export type TeamMember = { id: string; name: string; role: string; bio: string | null; avatar_url: string | null; sort_order: number; is_featured: boolean }
export type Faq = { id: string; question: string; answer: string; sort_order: number }
export type PricingPackage = { id: string; name: string; price: number; features: string[]; is_popular: boolean; sort_order: number }
export type MediaCoverage = { id: string; name: string; logo_url: string | null; sort_order: number }
export type Testimonial = { id: string; author_name: string; author_role: string | null; avatar_url: string | null; content: string; rating: number; is_featured: boolean }
export type Schedule = {
  id: string
  start_date: string
  end_date: string
  city: string
  venue: string
  address: string | null
  seminar: { id: string; title: string; short_desc: string; thumbnail_url: string | null; category: { name: string; color: string | null } }
  tickets: { id: string; name: string; price: number; early_bird_price: number | null; early_bird_until: string | null; quota: number; sold: number }[]
}

export const getCompanyStats = unstable_cache(async () => {
  const { data, error } = await supabase
    .from('company_stats')
    .select('id, label, value, sort_order')
    .order('sort_order')
  return { data: data as CompanyStat[] | null, error }
}, ['company-stats'], { revalidate: 3600, tags: ['content', 'company-stats'] })

export const getTeamMembers = unstable_cache(async () => {
  const { data, error } = await supabase
    .from('team_members')
    .select('id, name, role, bio, avatar_url, sort_order, is_featured')
    .order('sort_order')
  return { data: data as TeamMember[] | null, error }
}, ['team-members'], { revalidate: 3600, tags: ['content', 'team-members'] })

export const getFaqs = unstable_cache(async () => {
  const { data, error } = await supabase
    .from('faqs')
    .select('id, question, answer, sort_order')
    .eq('is_active', true)
    .order('sort_order')
  return { data: data as Faq[] | null, error }
}, ['faqs'], { revalidate: 3600, tags: ['content', 'faqs'] })

export const getPricingPackages = unstable_cache(async () => {
  const { data, error } = await supabase
    .from('pricing_packages')
    .select('id, name, price, features, is_popular, sort_order')
    .eq('is_active', true)
    .order('sort_order')
  return { data: data as PricingPackage[] | null, error }
}, ['pricing-packages'], { revalidate: 3600, tags: ['content', 'pricing-packages'] })

export const getMediaCoverage = unstable_cache(async () => {
  const { data, error } = await supabase
    .from('media_coverage')
    .select('id, name, logo_url, sort_order')
    .order('sort_order')
  return { data: data as MediaCoverage[] | null, error }
}, ['media-coverage'], { revalidate: 3600, tags: ['content', 'media-coverage'] })

export const getFeaturedTestimonials = unstable_cache(async () => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('id, author_name, author_role, avatar_url, content, rating, is_featured')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return { data: data as Testimonial[] | null, error }
}, ['featured-testimonials'], { revalidate: 3600, tags: ['content', 'testimonials'] })

export const getFeaturedSeminars = unstable_cache(async () => {
  const { data, error } = await supabase
    .from('schedules')
    .select(`
      id, start_date, end_date, city, venue, address,
      seminar:seminars!inner(id, title, short_desc, thumbnail_url, category:categories(name, color)),
      tickets(id, name, price, early_bird_price, early_bird_until, quota, sold)
    `)
    .gte('start_date', new Date().toISOString())
    .order('start_date')
    .limit(3)
  return { data: data as unknown as Schedule[] | null, error }
}, ['featured-seminars'], { revalidate: 3600, tags: ['content', 'schedules', 'seminars'] })

export async function getUpcomingSchedules(filters?: { city?: string; month?: number; year?: number }) {
  let query = supabase
    .from('schedules')
    .select(`
      id, start_date, end_date, city, venue, address,
      seminar:seminars!inner(id, title, short_desc, thumbnail_url, category:categories(name, color)),
      tickets(id, name, price, early_bird_price, early_bird_until, quota, sold)
    `)
    .gte('start_date', new Date().toISOString())
    .order('start_date')

  if (filters?.city) query = query.eq('city', filters.city)

  if (filters?.month && filters?.year) {
    const start = new Date(filters.year, filters.month - 1, 1).toISOString()
    const end = new Date(filters.year, filters.month, 0, 23, 59, 59).toISOString()
    query = query.gte('start_date', start).lte('start_date', end)
  }

  const { data, error } = await query
  return { data: data as unknown as Schedule[] | null, error }
}


// ── Admin queries ─────────────────────────────────────────────────────────────

export type AdminOrder = {
  id: string; total_amount: number
  status: string; created_at: string
  user: { email: string; profiles: { full_name: string }[] }
  order_items: { quantity: number; seminar_title: string }[]
  payments: { method: string | null }[]
}

export type AdminUser = {
  id: string; email: string; role: string; created_at: string
  profiles: { full_name: string; phone: string | null; city: string | null }[]
  _count_orders?: number
}

export type AdminStat = { label: string; value: string; sub?: string }

export async function getAdminStats() {
  const [ordersRes, usersRes, seminarsRes] = await Promise.all([
    supabase.rpc('get_paid_orders_stats'),
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('schedules').select('id', { count: 'exact', head: true }).gte('start_date', new Date().toISOString()),
  ])
  const { total_amount: revenue = 0, order_count: orderCount = 0 } = (ordersRes.data as any) ?? {}
  return [
    { label: 'Total Pendapatan', value: 'Rp ' + Number(revenue).toLocaleString('id-ID'), sub: `${orderCount} transaksi` },
    { label: 'Total Pengguna', value: String(usersRes.count ?? 0), sub: 'terdaftar' },
    { label: 'Jadwal Aktif', value: String(seminarsRes.count ?? 0), sub: 'mendatang' },
  ] as AdminStat[]
}

export async function getAdminOrders(limit = 50) {
  const { data, error } = await supabase
    .from('orders')
    .select(`id, total_amount, status, created_at, user_id,
      order_items(quantity, ticket:tickets(name, schedule:schedules(seminar:seminars(title)))),
      payments(method)`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return { data: null, error }

  // Ambil user info terpisah untuk hindari ambiguous FK
  const userIds = [...new Set((data as any[]).map(o => o.user_id).filter(Boolean))]
  const { data: users } = userIds.length > 0
    ? await supabase.from('users').select('id, email, profiles(full_name)').in('id', userIds)
    : { data: [] }

  const userMap = Object.fromEntries(((users as any[]) ?? []).map((u: any) => [u.id, u]))

  const mapped = (data as any[]).map(o => ({
    ...o,
    user: userMap[o.user_id] ?? { email: '—', profiles: [] },
    order_items: o.order_items?.map((item: any) => ({
      ...item,
      seminar_title: item.ticket?.schedule?.seminar?.title ?? null,
    })),
  }))

  return { data: mapped as unknown as AdminOrder[], error: null }
}

export async function getAdminUsers(limit = 100) {
  const { data, error } = await supabase
    .from('users')
    .select(`id, email, role, created_at, profiles(full_name, phone, city)`)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data: data as unknown as AdminUser[] | null, error }
}

// ── Dashboard (user) queries ──────────────────────────────────────────────────

export type UserTicket = {
  id: string; status: string; created_at: string; total_amount: number
  order_items: {
    id: string; quantity: number; unit_price: number
    ticket: {
      name: string
      schedule: { start_date: string; city: string; venue: string; seminar: { title: string } }
    }
  }[]
}

export type UserProfile = {
  id: string; full_name: string; phone: string | null
  city: string | null; occupation: string | null
  avatar_url: string | null
  notify_email: boolean; notify_wa: boolean
  user: { email: string }
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`id, status, created_at, total_amount,
      order_items(id, quantity, unit_price,
        ticket:tickets(name,
          schedule:schedules(start_date, city, venue,
            seminar:seminars(title))))`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data: data as unknown as UserTicket[] | null, error }
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`id, full_name, phone, city, occupation, avatar_url, notify_email, notify_wa, user:users!inner(email)`)
    .eq('user_id', userId)
    .single()
  return { data: data as unknown as UserProfile | null, error }
}


// ── Seminar listing queries ───────────────────────────────────────────────────

export type SeminarListItem = {
  id: string
  slug: string
  title: string
  short_desc: string
  thumbnail_url: string | null
  is_featured: boolean
  category: { id: string; name: string; color: string | null }
  schedules: {
    id: string
    start_date: string
    city: string
    tickets: { price: number; early_bird_price: number | null; early_bird_until: string | null; quota: number; sold: number }[]
  }[]
}

export const getSeminars = unstable_cache(async (filters?: {
  category_id?: string
  search?: string
  sort?: 'newest' | 'cheapest' | 'popular'
}) => {
  let query = supabase
    .from('seminars')
    .select(`
      id, slug, title, short_desc, thumbnail_url, is_featured,
      category:categories(id, name, color),
      schedules(id, start_date, city,
        tickets(price, early_bird_price, early_bird_until, quota, sold))
    `)
    .eq('status', 'PUBLISHED')

  if (filters?.category_id) query = query.eq('category_id', filters.category_id)
  if (filters?.search) query = query.ilike('title', `%${filters.search}%`)

  if (filters?.sort === 'newest') query = query.order('created_at', { ascending: false })
  else if (filters?.sort === 'popular') query = query.order('is_featured', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data, error } = await query
  return { data: data as unknown as SeminarListItem[] | null, error }
}, ['seminars-list'], { revalidate: 3600, tags: ['content', 'seminars'] })

export const getCategories = unstable_cache(async () => {
  const { data, error } = await supabase.from('categories').select('id, name, color').order('name')
  return { data: data as { id: string; name: string; color: string | null }[] | null, error }
}, ['seminar-categories'], { revalidate: 3600, tags: ['content', 'categories'] })


// ── Seminar detail query ──────────────────────────────────────────────────────

export type SeminarDetail = {
  id: string
  slug: string
  title: string
  short_desc: string
  description: string
  thumbnail_url: string | null
  is_featured: boolean
  meta_title: string | null
  meta_description: string | null
  category: { id: string; name: string; color: string | null }
  schedules: {
    id: string
    start_date: string
    end_date: string
    city: string
    venue: string
    address: string | null
    tickets: {
      id: string
      name: string
      price: number
      early_bird_price: number | null
      early_bird_until: string | null
      quota: number
      sold: number
    }[]
  }[]
}

export async function getSeminarBySlug(slug: string) {
  const { data, error } = await supabase
    .from('seminars')
    .select(`
      id, slug, title, short_desc, description, thumbnail_url, is_featured,
      meta_title, meta_description,
      category:categories(id, name, color),
      schedules(
        id, start_date, end_date, city, venue, address,
        tickets(id, name, price, early_bird_price, early_bird_until, quota, sold)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .single()
  return { data: data as unknown as SeminarDetail | null, error }
}


// ── Blog queries ──────────────────────────────────────────────────────────────

export type BlogPost = {
  id: string; slug: string; title: string; excerpt: string
  thumbnail_url: string | null; author_name: string
  category: string | null; tags: string[]; read_time: number | null
  published_at: string; created_at: string
}

export type BlogPostDetail = BlogPost & { content: string }

export async function getBlogPosts(filters?: { category?: string; search?: string; page?: number }) {
  const PAGE_SIZE = 9
  const page = filters?.page ?? 1
  let query = supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, thumbnail_url, author_name, category, tags, read_time, published_at, created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.search) query = query.ilike('title', `%${filters.search}%`)

  const { data, error } = await query
  return { data: data as BlogPost[] | null, error }
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, content, thumbnail_url, author_name, category, tags, read_time, published_at, created_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return { data: data as unknown as BlogPostDetail | null, error }
}

export async function getRelatedPosts(slug: string, category: string | null) {
  let query = supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, thumbnail_url, author_name, category, read_time, published_at')
    .eq('is_published', true)
    .neq('slug', slug)
    .limit(3)
  if (category) query = query.eq('category', category)
  const { data } = await query
  return (data as BlogPost[] | null) ?? []
}

export const getBlogCategories = unstable_cache(async () => {
  const { data } = await supabase
    .from('blog_posts')
    .select('category')
    .eq('is_published', true)
    .not('category', 'is', null)
  const cats = [...new Set((data ?? []).map((d: any) => d.category).filter(Boolean))]
  return cats as string[]
}, ['blog-categories'], { revalidate: 3600, tags: ['content', 'blog'] })
