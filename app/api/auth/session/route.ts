import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken, name, remember } = body as { idToken?: string; name?: string; remember?: boolean };

    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    // Verify the ID token to get user info
    const decoded = await adminAuth().verifyIdToken(idToken);
    const { uid, email, name: tokenName } = decoded;

    // Upsert Firestore user document — creates on signup, no-ops on subsequent logins
    const userRef = adminDb().collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // First time: create the document
      await userRef.set({
        uid,
        email: email ?? '',
        displayName: name ?? tokenName ?? email?.split('@')[0] ?? 'User',
        role: 'consumer',
        domainCount: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else {
      // Existing user: just update the timestamp
      await userRef.update({ updatedAt: FieldValue.serverTimestamp() });
    }

    // Cookie lifetime: 7 days when "Remember this device" is checked, 1 hour otherwise
    const expiresIn = remember ? 60 * 60 * 24 * 7 * 1000 : 60 * 60 * 1000;
    const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ success: true });

    // __session: httpOnly (secure, JS cannot read)
    response.cookies.set('__session', sessionCookie, {
      ...(remember ? { maxAge: expiresIn / 1000 } : {}),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    // __auth: NOT httpOnly — lets client-side JS detect auth state instantly
    // without any server call or CDN-cached HTML dependency.
    response.cookies.set('__auth', '1', {
      ...(remember ? { maxAge: expiresIn / 1000 } : {}),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Session creation error:', error.message);
    return NextResponse.json(
      { error: `Session creation failed: ${error.message ?? error.code ?? 'Unknown error'}` },
      { status: 500 }
    );
  }
}
