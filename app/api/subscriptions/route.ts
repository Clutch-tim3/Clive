import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

/** GET — list current user's subscriptions */
export async function GET() {
  try {
    const user = await requireAuth();
    const snap = await adminDb
      .collection('subscriptions')
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const subs = snap.docs.map(d => {
      const s = d.data();
      return {
        id:           d.id,
        productId:    s.productId,
        tierId:       s.tierId,
        tierName:     s.tierName,
        priceZAR:     s.priceZAR,
        status:       s.status,
        paymentMethod: s.paymentMethod,
        currentPeriodEnd: s.currentPeriodEnd?.toDate()?.toISOString() ?? null,
        createdAt:    s.createdAt?.toDate()?.toISOString() ?? null,
      };
    });
    return NextResponse.json({ subscriptions: subs });
  } catch (err) {
    return handleRouteError(err);
  }
}

/** POST — create a free-tier subscription (no payment needed) */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { productId, tierId } = await req.json();

    const productSnap = await adminDb.collection('products').doc(productId).get();
    if (!productSnap.exists)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const product = productSnap.data()!;
    const tier = (product.tiers as any[]).find(t => t.id === tierId);
    if (!tier) return NextResponse.json({ error: 'Tier not found' }, { status: 404 });
    if (Number(tier.priceZAR) !== 0)
      return NextResponse.json({ error: 'Use payment endpoints for paid tiers' }, { status: 400 });

    // Check for existing active subscription
    const existing = await adminDb
      .collection('subscriptions')
      .where('userId', '==', user.uid)
      .where('productId', '==', productId)
      .where('status', '==', 'active')
      .limit(1)
      .get();
    if (!existing.empty)
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });

    const now    = new Date();
    const period = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const subRef = adminDb.collection('subscriptions').doc();
    await subRef.set({
      id:                 subRef.id,
      userId:             user.uid,
      productId,
      providerId:         product.providerId,
      tierId,
      tierName:           tier.name,
      priceZAR:           0,
      status:             'active',
      paymentMethod:      'free',
      currentPeriodStart: now,
      currentPeriodEnd:   period,
      createdAt:          now,
    });

    // Increment subscriber count
    await adminDb.collection('products').doc(productId).update({
      'stats.totalSubscribers': adminDb.collection('products').doc().id
        ? (await adminDb.collection('products').doc(productId).get()).data()!.stats.totalSubscribers + 1
        : 1,
      updatedAt: now,
    });

    return NextResponse.json({ id: subRef.id }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
