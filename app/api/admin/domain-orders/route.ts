import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['pending', 'processing', 'fulfilled', 'failed'];

/** GET — list all domain orders (admin only) */
export async function GET() {
  try {
    await requireAdmin();

    const snap = await adminDb()
      .collection('domainOrders')
      .orderBy('orderedAt', 'desc')
      .limit(200)
      .get();

    const orders = snap.docs.map(d => {
      const s = d.data();
      return {
        id:         d.id,
        userId:     s.userId,
        userEmail:  s.userEmail,
        domainName: s.domainName,
        tld:        s.tld,
        status:     s.status,
        priceZAR:   s.priceZAR,
        priceUSD:   s.priceUSD,
        years:      s.years,
        orderedAt:  s.orderedAt?.toDate()?.toISOString() ?? null,
        updatedAt:  s.updatedAt?.toDate()?.toISOString() ?? null,
      };
    });

    return NextResponse.json({ orders });
  } catch (err) {
    return handleRouteError(err);
  }
}

/** PATCH — update a single order's status (admin only) */
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();

    const { orderId, status } = await req.json() as { orderId?: string; status?: string };

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
    }

    const ref = adminDb().collection('domainOrders').doc(orderId);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    await ref.update({ status, updatedAt: new Date() });

    return NextResponse.json({ ok: true, orderId, status });
  } catch (err) {
    return handleRouteError(err);
  }
}
