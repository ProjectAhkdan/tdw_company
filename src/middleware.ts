import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const isDashboard = pathname.startsWith("/dashboard")
  const isAdmin     = pathname.startsWith("/admin")
  const isAuth      = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isCallback  = pathname.startsWith("/callback")

  // Let callback route handle itself
  if (isCallback) return supabaseResponse

  if (!user && (isDashboard || isAdmin)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user && (isDashboard || isAdmin || isAuth)) {
    const cookieRole = request.cookies.get("user_role")?.value

    if (cookieRole) {
      if (isAdmin && cookieRole !== "ADMIN") return NextResponse.redirect(new URL("/dashboard", request.url))
      if (isDashboard && cookieRole === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url))
      if (isAuth) return NextResponse.redirect(new URL(cookieRole === "ADMIN" ? "/admin" : "/dashboard", request.url))
      return supabaseResponse
    }

    // Cookie missing — redirect to /callback to re-set it
    return NextResponse.redirect(
      new URL(`/callback?_login=1&next=${encodeURIComponent(pathname)}`, request.url)
    )
  }

  return supabaseResponse
}

export default proxy

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
