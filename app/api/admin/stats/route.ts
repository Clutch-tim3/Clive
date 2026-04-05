import { NextResponse } from 'next/server';
import { requireAdmin, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

/** GET — platform-wide stats for admin dashboard */
export async function GET() {
  try {
    await requireAdmin();

    const [usersSnap, productsSnap, subsSnap, txSnap] = await Promise.all([
      adminDb().collection('users').count().get(),
      adminDb().collection('products').where('status', '==', 'live').count().get(),
      adminDb().collection('subscriptions').where('status', '==', 'active').count().get(),
      adminDb().collection('transactions').where('status', '==', 'completed').get(),
    ]);

    const totalRevenue = txSnap.docs.reduce(
      (s, d) => s + (d.data().grossAmountZAR ?? 0), 0,
    );
    const totalCommission = txSnap.docs.reduce(
      (s, d) => s + (d.data().commissionZAR ?? 0), 0,
    );

    return NextResponse.json({
      totalUsers:       usersSnap.data().count,
      liveProducts:     productsSnap.data().count,
      activeSubscriptions: subsSnap.data().count,
      totalRevenue,     // cents ZAR
      totalCommission,  // Clive's 12%
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
