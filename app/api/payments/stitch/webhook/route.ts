import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyStitchWebhook } from '@/lib/payments/stitch';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  const body      = await req.text();
  const signature = req.headers.get('stitch-signature') ?? '';

  if (!verifyStitchWebhook(body, signature))
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

  const event = JSON.parse(body);

  if (event.status === 'Complete' && event.externalReference) {
    const subSnap = await adminDb
      .collection('subscriptions')
      .where('stitchReference', '==', event.externalReference)
      .limit(1)
      .get();

    if (!subSnap.empty) {
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

      await adminDb.collection('transactions').add({
        subscriptionId:   subRef.id,
        userId:           sub.userId,
        providerId:       sub.providerId,
        productId:        sub.productId,
        tierName:         sub.tierName,
        grossAmountZAR:   gross,
        commissionZAR:    commission,
        netAmountZAR:     net,
        status:           'completed',
        paymentMethod:    'stitch',
        paymentReference: event.externalReference,
        paidAt:           now,
        createdAt:        now,
      });

      await adminDb.collection('users').doc(sub.providerId).update({
        'providerProfile.availableBalance': FieldValue.increment(net),
        'providerProfile.totalEarned':      FieldValue.increment(net),
        updatedAt: now,
      });

      await adminDb.collection('products').doc(sub.productId).update({
        'stats.totalSubscribers': FieldValue.increment(1),
        'stats.monthlyRevenue':   FieldValue.increment(gross),
        updatedAt: now,
      });
    }
  }

  return NextResponse.json({ received: true });
}
