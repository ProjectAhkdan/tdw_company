import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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

  // Ambil user yang baru login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_user`)
  }

  // Sync ke public.users (upsert — trigger sudah handle insert, ini fallback)
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, role')
    .eq('supabase_id', user.id)
    .single()

  if (!existingUser) {
    // Trigger belum jalan (misal OAuth) → insert manual
    const { data: newUser } = await supabase
      .from('users')
      .insert({ supabase_id: user.id, email: user.email!, role: 'USER' })
      .select('id, role')
      .single()

    if (newUser) {
      const fullName = user.user_metadata?.full_name
        ?? user.user_metadata?.name
        ?? user.email!.split('@')[0]

      await supabase.from('profiles').upsert({
        user_id: newUser.id,
        full_name: fullName,
        phone: user.user_metadata?.phone ?? null,
      }, { onConflict: 'user_id', ignoreDuplicates: true })
    }
  }

  // Redirect berdasarkan role
  const role = existingUser?.role ?? 'USER'
  const redirectTo = role === 'ADMIN' ? '/admin' : (next.startsWith('/') ? next : '/dashboard')

  return NextResponse.redirect(`${origin}${redirectTo}`)
}
