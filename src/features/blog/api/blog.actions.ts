'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@infrastructure/storage/db-client'
import { getServerSession } from '@infrastructure/session/auth-server'

async function requireAdmin() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') throw new Error('Unauthorized')
}

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const postSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  category: z.string().optional(),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  is_published: z.boolean().default(false),
  read_time: z.number().int().positive().optional(),
})

export async function createPost(input: z.infer<typeof postSchema>) {
  await requireAdmin()
  const data = postSchema.parse(input)
  const slug = data.slug || slugify(data.title)
  const { data: post, error } = await supabaseAdmin
    .from('blog_posts')
    .insert({
      ...data, slug,
      author_name: 'Tung Desem Waringin',
      published_at: data.is_published ? new Date().toISOString() : null,
    } as any)
    .select('id, slug')
    .single()
  if (error) return { error: error.message }
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  return { id: (post as any).id, slug: (post as any).slug }
}

export async function updatePost(id: string, input: Partial<z.infer<typeof postSchema>>) {
  await requireAdmin()
  const update: Record<string, unknown> = { ...input, updated_at: new Date().toISOString() }
  if (input.is_published) update.published_at = new Date().toISOString()
  // @ts-expect-error untyped supabase client
  const { error } = await supabaseAdmin.from('blog_posts').update(update).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  return { success: true }
}

export async function deletePost(id: string) {
  await requireAdmin()
  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  return { success: true }
}

export async function deletePostsBulk(ids: string[]) {
  await requireAdmin()
  const { error } = await supabaseAdmin.from('blog_posts').delete().in('id', ids)
  if (error) return { error: error.message }
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  return { success: true }
}

