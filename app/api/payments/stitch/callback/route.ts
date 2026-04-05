import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

/** GET — Stitch redirects here after the user completes the bank payment */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('id');
    const status    = searchParams.get('status'); // 'Complete' | 'Failed'

    if (!paymentId || status !== 'Complete')
      return NextResponse.redirect(new URL('/products?payment=failed', req.url));

    const subSnap = await adminDb
      .collection('subscriptions')
      .where('stitchPaymentId', '==', paymentId)
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
        paymentReference: sub.stitchReference,
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

    return NextResponse.redirect(new URL('/console?payment=success', req.url));
  } catch (err) {
    console.error('Stitch callback error:', err);
    return NextResponse.redirect(new URL('/products?payment=error', req.url));
  }
}
