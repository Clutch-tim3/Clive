import { NextResponse } from 'next/server';
import { requireProvider, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

/** GET — provider earnings: transactions, payouts, and balance */
export async function GET() {
  try {
    const user = await requireProvider();

    // User doc for balance figures
    const userDoc  = await adminDb.collection('users').doc(user.uid).get();
    const userData = userDoc.data()!;
    const profile  = userData.providerProfile ?? {};

    // Transaction history
    const txSnap = await adminDb
      .collection('transactions')
      .where('providerId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    const transactions = txSnap.docs.map(d => {
      const tx = d.data();
      return {
        id:             d.id,
        tierName:       tx.tierName,
        grossAmountZAR: tx.grossAmountZAR,
        commissionZAR:  tx.commissionZAR,
        netAmountZAR:   tx.netAmountZAR,
        status:         tx.status,
        paymentMethod:  tx.paymentMethod,
        paymentReference: tx.paymentReference,
        paidAt:         tx.paidAt?.toDate()?.toISOString() ?? null,
        createdAt:      tx.createdAt?.toDate()?.toISOString() ?? null,
      };
    });

    // Payout history
    const payoutSnap = await adminDb
      .collection('payouts')
      .where('providerId', '==', user.uid)
      .orderBy('requestedAt', 'desc')
      .limit(20)
      .get();
    const payouts = payoutSnap.docs.map(d => {
      const p = d.data();
      return {
        id:            d.id,
        amountZAR:     p.amountZAR,
        status:        p.status,
        paymentMethod: p.paymentMethod,
        reference:     p.reference ?? null,
        requestedAt:   p.requestedAt?.toDate()?.toISOString() ?? null,
        processedAt:   p.processedAt?.toDate()?.toISOString() ?? null,
      };
    });

    return NextResponse.json({
      availableBalance: profile.availableBalance ?? 0,
      pendingPayout:    profile.pendingPayout    ?? 0,
      totalEarned:      profile.totalEarned      ?? 0,
      payoutMethod:     profile.payoutMethod     ?? null,
      transactions,
      payouts,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
