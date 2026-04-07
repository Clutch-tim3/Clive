import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';
import { renewDomain } from '@/lib/domains/resellerclub';

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  const { domainId, years = 1 } = await req.json();

  const docSnap = await adminDb().collection('domains').doc(domainId).get();
  if (!docSnap.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const doc = docSnap.data()!;
  if (doc.userId !== user.uid)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const expiryDate = Math.floor(new Date(doc.expiresAt.toDate()).getTime() / 1000);
  await renewDomain(doc.rcDomainId, years, String(expiryDate));

  const newExpiry = new Date(doc.expiresAt.toDate());
  newExpiry.setFullYear(newExpiry.getFullYear() + years);

  await docSnap.ref.update({
    expiresAt: newExpiry,
    renewedAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json({ expiresAt: newExpiry.toISOString() });
}
