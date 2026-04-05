import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

/** POST — exchange Firebase ID token for a 14-day session cookie */
export async function POST(req: NextRequest) {
  try {
    const { idToken, role } = await req.json();
    if (!idToken) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    const decoded    = await adminAuth().verifyIdToken(idToken);
    const expiresIn  = 60 * 60 * 24 * 14 * 1000; // 14 days ms
    const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });

    // Create user doc on first sign-in
    const userRef  = adminDb().collection('users').doc(decoded.uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      await userRef.set({
        uid:         decoded.uid,
        email:       decoded.email ?? '',
        displayName: decoded.name ?? decoded.email?.split('@')[0] ?? '',
        photoURL:    decoded.picture ?? null,
        role:        role ?? 'consumer',
        createdAt:   new Date(),
        updatedAt:   new Date(),
      });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set('__session', sessionCookie, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   expiresIn / 1000,
      path:     '/',
    });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

/** DELETE — sign out (clear session cookie) */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('__session');
  return res;
}
