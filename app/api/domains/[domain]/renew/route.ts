import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { requireAuth } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';
import { getDomain, renewDomain as ncRenew } from '@/lib/domains/namecom';
import { usdToZAR } from '@/lib/domains/tlds';

export async function POST(
  req: NextRequest,
  { params }: { params: { domain: string } }
) {
  const user = await requireAuth().catch(() => null);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { years = 1 } = await req.json();
  const domainName = decodeURIComponent(params.domain);

  const snap = await adminDb().collection('domains')
    .where('domainName', '==', domainName)
    .where('userId', '==', user.uid)
    .limit(1).get();

  if (snap.empty) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Get current renewal price from Name.com (always real-time for renewals)
  const ncDomain = await getDomain(domainName);
  const priceUSD = ncDomain.renewalPrice;

  await ncRenew(domainName, priceUSD, years);

  const newExpiry = new Date(ncDomain.expireDate);
  newExpiry.setFullYear(newExpiry.getFullYear() + years);

  await snap.docs[0].ref.update({
    expiresAt:   newExpiry,
    renewedAt:   new Date(),
    updatedAt:   new Date(),
    renewCount:  FieldValue.increment(1),
  });

  return NextResponse.json({
    expiresAt: newExpiry.toISOString(),
    priceUSD,
    priceZAR:  usdToZAR(priceUSD * years),
  });
}
