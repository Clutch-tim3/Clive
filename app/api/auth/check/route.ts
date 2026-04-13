import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Lightweight auth check — no Firebase Admin, no Firestore.
 * Just checks if __session cookie is present in the request.
 * Used by the Nav as a fallback for sessions that predate the __auth cookie.
 */
export async function GET(req: NextRequest) {
  const hasSession = !!req.cookies.get('__session')?.value;
  return NextResponse.json({ authed: hasSession });
}
