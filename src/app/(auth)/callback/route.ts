import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@infrastructure/storage/db-client'

const db = supabaseAdmin as any

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const isDirectLogin = searchParams.get('_login') === '1'

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  // OAuth flow — exchange code for session
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${origin}/login?error=no_session`)

  // Read role from DB via service role (bypasses RLS)
  const { data: dbUser } = await db
    .from('users')
    .select('id, role')
    .eq('supabase_id', user.id)
    .single()

  // First-time OAuth user — create record
  if (!dbUser) {
    const { data: newUser } = await db
      .from('users')
      .insert({ supabase_id: user.id, email: user.email, role: 'USER' })
      .select('id, role')
      .single()

    if (newUser) {
      const fullName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email!.split('@')[0]
      await db.from('profiles').upsert(
        { user_id: newUser.id, full_name: fullName, phone: user.user_metadata?.phone ?? null },
        { onConflict: 'user_id', ignoreDuplicates: true }
      )
    }
  }

  const role: string = dbUser?.role ?? 'USER'

  // Validate next URL
  let redirectPath: string
  try {
    const url = new URL(next, origin)
    redirectPath = url.origin === origin ? url.pathname + url.search : '/dashboard'
  } catch {
    redirectPath = '/dashboard'
  }

  // Direct login already has correct destination in `next`
  // OAuth flow: route ADMIN to /admin
  const finalDestination = isDirectLogin ? redirectPath : (role === 'ADMIN' ? '/admin' : redirectPath)

  const response = NextResponse.redirect(`${origin}${finalDestination}`)
  response.cookies.set('user_role', role, {
    maxAge: 60 * 60 * 8,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
  return response
}


