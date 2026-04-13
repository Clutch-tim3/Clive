import { NextRequest, NextResponse } from 'next/server';

const cookieClear = (httpOnly: boolean) => ({
  maxAge: 0,
  httpOnly,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
});

/** POST — used programmatically (fetch) */
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('__session', '', cookieClear(true));
  response.cookies.set('__auth', '', cookieClear(false));
  return response;
}

/** GET — browser navigation signout: clears cookies and redirects to home */
export async function GET(req: NextRequest) {
  const home = new URL('/', req.url);
  const response = NextResponse.redirect(home);
  response.cookies.set('__session', '', cookieClear(true));
  response.cookies.set('__auth', '', cookieClear(false));
  return response;
}
