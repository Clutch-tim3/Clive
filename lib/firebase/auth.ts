import { adminAuth, adminDb } from './admin';
import { cookies } from 'next/headers';

export interface SessionUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'consumer' | 'provider' | 'admin';
  [key: string]: any;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('__session')?.value;
    if (!sessionCookie) return null;

    const decoded = await adminAuth().verifySessionCookie(sessionCookie, true);
    const userDoc  = await adminDb().collection('users').doc(decoded.uid).get();

    if (!userDoc.exists) return null;
    return { uid: decoded.uid, ...userDoc.data() } as SessionUser;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error('UNAUTHENTICATED');
  return user;
}

export async function requireProvider(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error('UNAUTHENTICATED');
  if (!['provider', 'admin'].includes(user.role)) throw new Error('FORBIDDEN');
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error('UNAUTHENTICATED');
  if (user.role !== 'admin') throw new Error('FORBIDDEN');
  return user;
}

/** Shared error handler for all API routes */
export function handleRouteError(err: unknown) {
  const { NextResponse } = require('next/server');
  if (err instanceof Error) {
    if (err.message === 'UNAUTHENTICATED')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  console.error(err);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
