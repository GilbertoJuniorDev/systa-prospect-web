import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session-edge';

const publicRoutes = ['/'];
const protectedRoutes = ['/dashboard', '/consulta', '/creditos', '/busca-cnpj', '/certificados'];
const publicAuthRoutes = ['/login', '/forgot-password', '/reset-password', '/register'];

export default async function middleware(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname;

  if (publicRoutes.includes(path)) return NextResponse.next();

  const isProtected = protectedRoutes.some((r) => path.startsWith(r));
  const isPublicAuth = publicAuthRoutes.some((r) => path.startsWith(r));

  const sessionCookie = req.cookies.get('session')?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;
  const isAuthenticated =
    session !== null && new Date(session.expiresAt) > new Date();

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isPublicAuth && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:png|ico|svg)$).*)'],
};
