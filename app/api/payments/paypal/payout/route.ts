import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';
import { sendPayPalPayout } from '@/lib/payments/paypal';
import { FieldValue } from 'firebase-admin/firestore';

/** POST — admin triggers a payout to a provider */
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { providerId, amountZAR } = await req.json();

    const userDoc  = await adminDb.collection('users').doc(providerId).get();
    if (!userDoc.exists) return NextResponse.json({ error: 'Provider not found' }, { status: 404 });

    const profile = userDoc.data()!.providerProfile;
    if (!profile?.paypalEmail)
      return NextResponse.json({ error: 'Provider has no PayPal email on file' }, { status: 400 });

    const reference = `clv-payout-${providerId.slice(0, 6)}-${Date.now()}`;
    const result    = await sendPayPalPayout(profile.paypalEmail, amountZAR, reference);

    const payoutRef = adminDb.collection('payouts').doc();
    await payoutRef.set({
      id:            payoutRef.id,
      providerId,
      amountZAR,
      status:        'processing',
      paymentMethod: 'paypal',
      reference,
      requestedAt:   new Date(),
    });

    // Deduct from available balance
    await adminDb.collection('users').doc(providerId).update({
      'providerProfile.availableBalance': FieldValue.increment(-amountZAR),
      'providerProfile.pendingPayout':    FieldValue.increment(amountZAR),
      updatedAt: new Date(),
    });

    return NextResponse.json({ ok: true, reference, result });
  } catch (err) {
    return handleRouteError(err);
  }
}
