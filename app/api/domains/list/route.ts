import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  const user = await requireAuth().catch(() => null);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const snap = await adminDb().collection('domains')
    .where('userId', '==', user.uid)
    .orderBy('registeredAt', 'desc')
    .get();

  const domains = snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      registeredAt: data.registeredAt?.toDate()?.toISOString(),
      expiresAt:    data.expiresAt?.toDate()?.toISOString(),
      renewedAt:    data.renewedAt?.toDate()?.toISOString() ?? null,
    };
  });

  return NextResponse.json({ domains });
}
