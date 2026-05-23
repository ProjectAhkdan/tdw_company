import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@infrastructure/storage/db-client'

// Cast ke any karena supabaseAdmin tidak punya generated database types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

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

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_user`)
  }

  // Baca user dari DB (bypass RLS via admin)
  const { data: existingUser } = await db
    .from('users')
    .select('id, role')
    .eq('supabase_id', user.id)
    .single()

  if (!existingUser) {
    // Trigger belum jalan (misal OAuth) → insert manual
    const { data: newUser } = await db
      .from('users')
      .insert({ supabase_id: user.id, email: user.email, role: 'USER' })
      .select('id, role')
      .single()

    if (newUser) {
      const fullName = user.user_metadata?.full_name
        ?? user.user_metadata?.name
        ?? user.email!.split('@')[0]

      await db.from('profiles').upsert(
        { user_id: newUser.id, full_name: fullName, phone: user.user_metadata?.phone ?? null },
        { onConflict: 'user_id', ignoreDuplicates: true }
      )
    }
  }

  const role: string = existingUser?.role ?? 'USER'
  const safeNext = (() => {
    try {
      const url = new URL(next, origin)
      return url.origin === origin ? url.pathname + url.search : '/dashboard'
    } catch {
      return '/dashboard'
    }
  })()
  const redirectTo = role === 'ADMIN' ? '/admin' : safeNext

  const response = NextResponse.redirect(`${origin}${redirectTo}`)
  response.cookies.set('user_role', role, {
    maxAge: 3600,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
  return response
}
