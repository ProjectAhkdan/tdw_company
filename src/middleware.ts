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
    // Baca role dari cookie — di-set saat login di /auth/callback
    // Jika belum ada, default USER (akan di-redirect ke dashboard, bukan admin)
    const role = request.cookies.get("user_role")?.value ?? "USER";

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
