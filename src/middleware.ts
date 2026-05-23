import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Admin client (bypass RLS) — hanya untuk baca role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

  // Proteksi route jika belum login
  if (!user && (isDashboard || isAdmin)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access & Auth Redirect
  if (user && (isDashboard || isAdmin || isAuth)) {
    // 1. Coba baca role dari cookie untuk menghindari DB hit
    let role = request.cookies.get("user_role")?.value;

    // 2. Jika tidak ada di cookie, fetch dari DB
    if (!role) {
      const { data: profile } = await supabaseAdmin
        .from("users")
        .select("role")
        .eq("supabase_id", user.id)
        .single();
      role = profile?.role ?? "USER";

      // Simpan role ke cookie (cache 1 jam)
      supabaseResponse.cookies.set("user_role", role as string, { 
        maxAge: 3600, 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
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
