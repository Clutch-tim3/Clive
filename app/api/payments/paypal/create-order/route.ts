import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';
import { createPayPalOrder } from '@/lib/payments/paypal';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { productId, tierId } = await req.json();

    const productSnap = await adminDb.collection('products').doc(productId).get();
    if (!productSnap.exists)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const product = productSnap.data()!;
    const tier    = (product.tiers as any[]).find(t => t.id === tierId);
    if (!tier)  return NextResponse.json({ error: 'Tier not found' },  { status: 404 });
    if (Number(tier.priceZAR) === 0)
      return NextResponse.json({ error: 'Free tier — no payment needed' }, { status: 400 });

    const order = await createPayPalOrder(
      Number(tier.priceZAR),
      `${product.name} — ${tier.name} plan`,
    );

    // Store pending subscription intent
    await adminDb.collection('subscriptions').add({
      userId:        user.uid,
      productId,
      tierId,
      tierName:      tier.name,
      priceZAR:      tier.priceZAR,
      providerId:    product.providerId,
      status:        'pending',
      paymentMethod: 'paypal',
      paypalOrderId: order.id,
      createdAt:     new Date(),
    });

    const approveUrl = (order.links as any[])?.find((l: any) => l.rel === 'approve')?.href;
    return NextResponse.json({ orderId: order.id, approveUrl });
  } catch (err) {
    return handleRouteError(err);
  }
}
