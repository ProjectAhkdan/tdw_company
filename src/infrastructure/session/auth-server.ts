import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@infrastructure/storage/db-client'

export async function createSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        },
      },
    }
  )
}

export async function getServerSession() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabaseAdmin
    .from('users')
    .select('*, profiles(*)')
    .eq('supabase_id', user.id)
    .single()

  return data as { id: string; role: string; email: string; profiles: unknown } | null
}

export async function requireRole(role: 'ADMIN') {
  const session = await getServerSession()
  if (!session || session.role !== role) throw new Error('Unauthorized')
  return session
}

