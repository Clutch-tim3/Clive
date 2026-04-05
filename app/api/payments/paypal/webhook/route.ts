import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyPayPalWebhook } from '@/lib/payments/paypal';
import { FieldValue } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();

  const headers: Record<string, string> = {};
  req.headers.forEach((v, k) => { headers[k] = v; });

  const isValid = await verifyPayPalWebhook(headers, body);
  if (!isValid)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

  const event = JSON.parse(body);

  if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    const orderId = event.resource?.supplementary_data?.related_ids?.order_id;
    if (orderId) await handleCapture(orderId);
  }

  if (event.event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
    const subId = event.resource?.custom_id;
    if (subId) {
      await adminDb().collection('subscriptions').doc(subId).update({
        status: 'cancelled', cancelledAt: new Date(),
      });
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCapture(orderId: string) {
  const subSnap = await adminDb()
    .collection('subscriptions')
    .where('paypalOrderId', '==', orderId)
    .limit(1)
    .get();
  if (subSnap.empty) return;

  const sub    = subSnap.docs[0].data();
  const subRef = subSnap.docs[0].ref;
  const gross      = Number(sub.priceZAR);
  const commission = Math.round(gross * 0.12);
  const net        = gross - commission;
  const now        = new Date();

  await subRef.update({
    status:             'active',
    currentPeriodStart: now,
    currentPeriodEnd:   new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
  });

  await adminDb().collection('transactions').add({
    subscriptionId:   subRef.id,
    userId:           sub.userId,
    providerId:       sub.providerId,
    productId:        sub.productId,
    tierName:         sub.tierName,
    grossAmountZAR:   gross,
    commissionZAR:    commission,
    netAmountZAR:     net,
    status:           'completed',
    paymentMethod:    'paypal',
    paymentReference: orderId,
    paidAt:           now,
    createdAt:        now,
  });

  await adminDb().collection('users').doc(sub.providerId).update({
    'providerProfile.availableBalance': FieldValue.increment(net),
    'providerProfile.totalEarned':      FieldValue.increment(net),
    updatedAt: now,
  });

  await adminDb().collection('products').doc(sub.productId).update({
    'stats.totalSubscribers': FieldValue.increment(1),
    'stats.monthlyRevenue':   FieldValue.increment(gross),
    updatedAt: now,
  });
}
