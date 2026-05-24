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

  const { pathname } = request.nextUrl

  const isDashboard = pathname.startsWith("/dashboard")
  const isAdmin     = pathname.startsWith("/admin")
  const isAuth      = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isCallback  = pathname.startsWith("/callback")

  if (isCallback) return supabaseResponse

  // Skip auth check for public routes — saves a network round-trip
  if (!isDashboard && !isAdmin && !isAuth) return supabaseResponse

  const { data: { user } } = await supabase.auth.getUser()

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

    // Cookie missing — query DB directly, NEVER redirect to /callback (causes loop)
    try {
      const { data: roleData } = await supabase.rpc('get_my_role')
      const role: string = roleData ?? "USER"
      const cookieOptions = {
        maxAge: 60 * 60 * 8,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      }

      if (isAuth) {
        const res = NextResponse.redirect(new URL(role === "ADMIN" ? "/admin" : "/dashboard", request.url))
        res.cookies.set("user_role", role, cookieOptions)
        return res
      }
      if (isAdmin && role !== "ADMIN") return NextResponse.redirect(new URL("/dashboard", request.url))
      if (isDashboard && role === "ADMIN") {
        const res = NextResponse.redirect(new URL("/admin", request.url))
        res.cookies.set("user_role", role, cookieOptions)
        return res
      }

      supabaseResponse.cookies.set("user_role", role, cookieOptions)
      return supabaseResponse
    } catch {
      return supabaseResponse
    }
  }

  return supabaseResponse
}

export default proxy

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
