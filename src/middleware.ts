import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/register");

  if (!user && (isDashboard || isAdmin)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && (isDashboard || isAdmin || isAuth)) {
    let role = request.cookies.get("user_role")?.value

    // BUG-005: cookie hilang tapi session masih valid → baca role dari DB
    if (!role) {
      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("supabase_id", user.id)
        .single()
      role = (data as { role?: string } | null)?.role ?? "USER"
      // Set cookie di response agar tidak perlu fetch lagi
      supabaseResponse.cookies.set("user_role", role, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })
    }

    if (isAdmin && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    if (isDashboard && role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    if (isAuth) {
      return NextResponse.redirect(new URL(role === "ADMIN" ? "/admin" : "/dashboard", request.url))
    }
  }

  return supabaseResponse;
}

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
