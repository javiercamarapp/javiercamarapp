import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes
  const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith("/api")
  const isStaticRoute = pathname.startsWith("/_next") || pathname.startsWith("/static")

  if (isApiRoute || isStaticRoute) {
    return supabaseResponse
  }

  // Not authenticated → redirect to login
  if (!user && !isPublicRoute && pathname !== "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Authenticated → check onboarding
  if (user && !isPublicRoute && pathname !== "/onboarding") {
    const { data: profile } = await supabase
      .from("perfiles")
      .select("onboarding_completado, tipo_cuenta")
      .eq("id", user.id)
      .single()

    if (profile && !profile.onboarding_completado && pathname !== "/onboarding") {
      const url = request.nextUrl.clone()
      url.pathname = "/onboarding"
      return NextResponse.redirect(url)
    }
  }

  // Authenticated on public route → redirect to dashboard
  if (user && isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
