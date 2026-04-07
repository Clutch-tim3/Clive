import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days
    const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });

    // Set the session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('__session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Session creation failed' }, { status: 500 });
  }
}
