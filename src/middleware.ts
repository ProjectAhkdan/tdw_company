import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function proxy(request: NextRequest) {
  // Admin client dibuat di dalam fungsi agar env vars tersedia di Edge Runtime
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

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

  // Proteksi route jika belum login
  if (!user && (isDashboard || isAdmin)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access & Auth Redirect
  if (user && (isDashboard || isAdmin || isAuth)) {
    // 1. Coba baca role dari cookie
    let role = request.cookies.get("user_role")?.value;
    const verifiedAt = Number(request.cookies.get("role_verified_at")?.value ?? "0");
    const stale = Date.now() - verifiedAt > 5 * 60 * 1000; // 5 menit

    // 2. Fetch dari DB jika tidak ada atau sudah stale (>5 menit)
    if (!role || stale) {
      const { data: profile } = await supabaseAdmin
        .from("users")
        .select("role")
        .eq("supabase_id", user.id)
        .single();
      role = profile?.role ?? "USER";

      supabaseResponse.cookies.set("user_role", role as string, {
        maxAge: 3600,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      supabaseResponse.cookies.set("role_verified_at", String(Date.now()), {
        maxAge: 3600,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    // 3. Routing logic
    if (isAdmin && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (isDashboard && role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (isAuth) {
      return NextResponse.redirect(new URL(role === "ADMIN" ? "/admin" : "/dashboard", request.url));
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
