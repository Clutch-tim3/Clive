import { NextResponse } from 'next/server';
import { requireAuth, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuth();

    const snap = await adminDb()
      .collection('domainOrders')
      .where('userId', '==', user.uid)
      .get();

    const orders = snap.docs
      .map(d => {
        const s = d.data();
        return {
          id:         d.id,
          domainName: s.domainName as string,
          tld:        s.tld as string,
          status:     s.status as string,
          priceZAR:   s.priceZAR as number,
          years:      s.years as number,
          orderedAt:  s.orderedAt?.toDate()?.toISOString() ?? null,
        };
      })
      .sort((a, b) => (b.orderedAt ?? '').localeCompare(a.orderedAt ?? ''));

    return NextResponse.json({ orders });
  } catch (err) {
    return handleRouteError(err);
  }
}
