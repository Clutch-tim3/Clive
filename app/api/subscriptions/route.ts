import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';
import { requireAuth, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';
import { getProductBySlug, getAcquireTiers } from '@/lib/products';

export const dynamic = 'force-dynamic';

/** GET — list current user's active subscriptions */
export async function GET() {
  try {
    const user = await requireAuth();
    const snap = await adminDb()
      .collection('subscriptions')
      .where('userId', '==', user.uid)
      .where('status', '==', 'active')
      .get();

    const subs = snap.docs
      .map(d => {
        const s = d.data();
        return {
          id:               d.id,
          productId:        s.productId,
          productName:      s.productName,
          productSlug:      s.productSlug,
          tierId:           s.tierId,
          tierName:         s.tierName,
          priceZAR:         s.priceZAR,
          status:           s.status,
          apiKey:           s.apiKey,
          callsUsed:        s.callsUsed ?? 0,
          callsLimit:       s.callsLimit,
          rateLimit:        s.rateLimit ?? 10,
          paymentMethod:    s.paymentMethod,
          acquiredAt:       s.acquiredAt?.toDate()?.toISOString() ?? null,
          currentPeriodEnd: s.currentPeriodEnd?.toDate()?.toISOString() ?? null,
          createdAt:        s.createdAt?.toDate()?.toISOString() ?? null,
        };
      })
      .sort((a, b) => (b.acquiredAt ?? '').localeCompare(a.acquiredAt ?? ''));

    return NextResponse.json({ subscriptions: subs });
  } catch (err) {
    return handleRouteError(err);
  }
}

/** POST — acquire a free-tier subscription (no payment) */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { productId, tierId } = await req.json();

    if (!productId || !tierId) {
      return NextResponse.json({ error: 'Missing productId or tierId' }, { status: 400 });
    }

    // Look up product from in-memory catalogue (not Firestore)
    const product = getProductBySlug(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const tiers = getAcquireTiers(productId);
    const tier  = tiers.find(t => t.id === tierId);
    if (!tier) {
      return NextResponse.json({ error: 'Tier not found' }, { status: 404 });
    }

    // Only free tier here — paid requires payment flow
    if (tier.priceZAR !== 0) {
      return NextResponse.json({
        requiresPayment: true,
        tierId,
        tierName: tier.name,
        priceZAR: tier.priceZAR,
      });
    }

    // Prevent duplicate subscriptions
    const existing = await adminDb()
      .collection('subscriptions')
      .where('userId', '==', user.uid)
      .where('productId', '==', productId)
      .where('status', '==', 'active')
      .limit(1)
      .get();

    if (!existing.empty) {
      const sub = existing.docs[0].data();
      return NextResponse.json({
        error:          'You already have access to this product.',
        subscriptionId: existing.docs[0].id,
        apiKey:         sub.apiKey,
      }, { status: 409 });
    }

    // Generate scoped API key
    const apiKey  = `clive_${productId.slice(0, 6)}_${crypto.randomBytes(16).toString('hex')}`;
    const now     = new Date();
    const subRef  = adminDb().collection('subscriptions').doc();

    await subRef.set({
      id:                 subRef.id,
      userId:             user.uid,
      userEmail:          user.email,
      productId,
      productName:        product.name,
      productSlug:        product.slug,
      tierId:             tier.id,
      tierName:           tier.name,
      priceZAR:           0,
      status:             'active',
      paymentMethod:      'free',
      apiKey,
      callsUsed:          0,
      callsLimit:         tier.callsPerMonth,
      rateLimit:          tier.rateLimit,
      currentPeriodStart: now,
      currentPeriodEnd:   null,
      acquiredAt:         now,
      createdAt:          now,
      updatedAt:          now,
    });

    // Best-effort subscriber count increment
    adminDb().collection('products').doc(productId).update({
      'stats.totalSubscribers': FieldValue.increment(1),
      updatedAt: now,
    }).catch(() => {});

    return NextResponse.json({
      subscriptionId: subRef.id,
      apiKey,
      tierName:       tier.name,
      callsLimit:     tier.callsPerMonth,
    }, { status: 201 });

  } catch (err) {
    return handleRouteError(err);
  }
}
