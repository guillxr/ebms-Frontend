import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  const isUserRoute = pathname.startsWith("/dashboard/user")
  const isAdminRoute = pathname.startsWith("/dashboard/admin")
  const isProfileRoute = pathname === "/profile" || pathname.startsWith("/profile/")
  const isLoginPage = pathname === "/login"

  if (!isUserRoute && !isAdminRoute && !isProfileRoute && !isLoginPage) {
    return NextResponse.next()
  }

  if (!token) {
    if (isLoginPage) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    const role = payload.role

    if (isLoginPage) {
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url))
      }
      if (role === "DONOR") {
        return NextResponse.redirect(new URL("/dashboard/user", request.url))
      }
      return NextResponse.next()
    }

    if (role === "DONOR" && isAdminRoute) {
      return NextResponse.redirect(new URL("/dashboard/user", request.url))
    }

    if (role === "ADMIN" && isUserRoute) {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url))
    }

    if (isProfileRoute && role !== "DONOR") {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    "/dashboard/user/:path*",
    "/dashboard/admin/:path*",
    "/profile/:path*",
    "/profile",
    "/login",
  ],
}