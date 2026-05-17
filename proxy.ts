import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const path = request.nextUrl.pathname

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value)
          response = NextResponse.next({ request })
          for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options)
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ── Belum login → redirect ke /login ─────────────────────────────────────
  if (!user && (path.startsWith('/dashboard') || path.startsWith('/admin') || path.startsWith('/checkout'))) {
    const url = new URL('/login', request.url)
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  if (user) {
    // Baca role dari user_metadata (set saat register, tidak perlu query DB)
    const role: string = (user.user_metadata?.role as string) ?? 'USER'

    // ── /admin → hanya ADMIN ────────────────────────────────────────────────
    if (path.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // ── /dashboard → ADMIN harus ke /admin ──────────────────────────────────
    if (path.startsWith('/dashboard') && role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // ── /login atau /register → redirect sesuai role ────────────────────────
    if (path === '/login' || path === '/register') {
      return NextResponse.redirect(new URL(role === 'ADMIN' ? '/admin' : '/dashboard', request.url))
    }
  }

  // ── Tracking affiliate code via cookie ────────────────────────────────────
  const ref = request.nextUrl.searchParams.get('ref')
  if (ref) {
    response.cookies.set('tdw_ref', ref, { maxAge: 30 * 24 * 60 * 60, path: '/' })
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/admin',
    '/admin/:path*',
    '/checkout/:path*',
    '/login',
    '/register',
  ],
}
