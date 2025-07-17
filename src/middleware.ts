import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de rotas que exigem autenticação
const protectedRoutes = ['/dashboard', '/profile'];
// Lista de rotas de autenticação que não devem ser redirecionadas se o usuário já estiver logado
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('session_token'); // Exemplo: verificar um cookie de sessão

  const { pathname } = request.nextUrl;

  // Redireciona para o login
  if (protectedRoutes.includes(pathname) && !isAuthenticated) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
