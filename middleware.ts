import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/console', '/api/provider', '/api/keys', '/api/admin', '/api/domains/list', '/api/domains/register', '/api/domains/orders', '/api/subscriptions', '/founder', '/dashboard'];
const AUTH_ROUTES        = ['/auth'];

export function middleware(req: NextRequest) {
  const session   = req.cookies.get('__session')?.value;
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some(p => pathname.startsWith(p));

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !session) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('screen', 'signin');
    return NextResponse.redirect(url);
  }

  // Redirect already-authenticated users away from auth page to console
  if (isAuthRoute && session) {
    const url = req.nextUrl.clone();
    url.pathname = '/console';
    url.searchParams.delete('screen');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/console/:path*',
    '/api/provider/:path*',
    '/api/keys/:path*',
    '/api/admin/:path*',
    '/api/domains/list',
    '/api/domains/register',
    '/api/domains/orders',
    '/api/subscriptions/:path*',
    '/founder/:path*',
    '/dashboard/:path*',
    '/auth',
  ],
};
