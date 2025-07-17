import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  const isUserRoute = pathname.startsWith("/dashboard/user")
  const isAdminRoute = pathname.startsWith("/dashboard/admin")

  if (!isUserRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    const role = payload.role

    if (isUserRoute && role !== "DONOR") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    return NextResponse.next()
  } catch (err) {
    console.error("Token inválido:", err)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/dashboard/user*", "/dashboard/admin*"],
}
