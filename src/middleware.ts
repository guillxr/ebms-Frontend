import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Codifica o segredo JWT
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Lista de rotas públicas
const publicRoutes = ["/", "/login", "/register"];

// Middleware principal
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isDashboardUser = pathname.startsWith("/dashboard/user");
  const isDashboardAdmin = pathname.startsWith("/dashboard/admin");
  const isProfileRoute = pathname === "/profile" || pathname.startsWith("/profile/");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (!token) {
    // Usuário não autenticado tentando acessar rota protegida
    if (!isPublicRoute && (isDashboardUser || isDashboardAdmin || isProfileRoute)) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role;

    // Usuário já logado tentando acessar página de login/registro
    if (isAuthRoute) {
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
      if (role === "DONOR") {
        return NextResponse.redirect(new URL("/dashboard/user", request.url));
      }
    }

    // Restringe o acesso entre perfis
    if (role === "DONOR" && isDashboardAdmin) {
      return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }

    if (role === "ADMIN" && isDashboardUser) {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }

    if (isProfileRoute && role !== "DONOR") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch {
    // Token inválido
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
}

// Configura as rotas para as quais o middleware deve ser aplicado
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // ignora rotas estáticas
  ],
};
