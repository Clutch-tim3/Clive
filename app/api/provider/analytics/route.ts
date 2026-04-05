import { NextRequest, NextResponse } from 'next/server';
import { requireProvider, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

/** GET — analytics for a provider's products
 *  Query params: productId (optional), period = '7d' | '30d' | '90d' (default 30d)
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireProvider();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const period    = searchParams.get('period') ?? '30d';

    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split('T')[0];

    // Which products to query
    let productIds: string[] = [];
    if (productId) {
      // Verify ownership
      const doc = await adminDb.collection('products').doc(productId).get();
      if (!doc.exists || doc.data()!.providerId !== user.uid)
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      productIds = [productId];
    } else {
      const snap = await adminDb
        .collection('products')
        .where('providerId', '==', user.uid)
        .get();
      productIds = snap.docs.map(d => d.id);
    }

    // Fetch analytics for each product
    const results: Record<string, any[]> = {};
    for (const pid of productIds) {
      const snap = await adminDb
        .collection('products').doc(pid)
        .collection('analytics')
        .where('date', '>=', sinceStr)
        .orderBy('date', 'asc')
        .get();
      results[pid] = snap.docs.map(d => d.data());
    }

    return NextResponse.json({ analytics: results, period, since: sinceStr });
  } catch (err) {
    return handleRouteError(err);
  }
}
