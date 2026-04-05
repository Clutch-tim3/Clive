import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';
import { initiateStitchPayment } from '@/lib/payments/stitch';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { productId, tierId } = await req.json();

    const productSnap = await adminDb.collection('products').doc(productId).get();
    if (!productSnap.exists)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const product = productSnap.data()!;
    const tier    = (product.tiers as any[]).find(t => t.id === tierId);
    if (!tier || Number(tier.priceZAR) === 0)
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });

    const reference = `clive-sub-${user.uid.slice(0, 6)}-${Date.now()}`;
    const payment   = await initiateStitchPayment(
      Number(tier.priceZAR),
      reference,
      'Clive Platform',
    );

    await adminDb.collection('subscriptions').add({
      userId:          user.uid,
      productId,
      tierId,
      tierName:        tier.name,
      priceZAR:        tier.priceZAR,
      providerId:      product.providerId,
      status:          'pending',
      paymentMethod:   'stitch',
      stitchPaymentId: payment.id,
      stitchReference: reference,
      createdAt:       new Date(),
    });

    return NextResponse.json({ redirectUrl: payment.url, paymentId: payment.id });
  } catch (err) {
    return handleRouteError(err);
  }
}
