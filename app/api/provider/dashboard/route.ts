import { NextResponse } from 'next/server';
import { requireProvider, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireProvider();

    // Provider's products
    const productsSnap = await adminDb()
      .collection('products')
      .where('providerId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .get();
    const products = productsSnap.docs.map(d => d.data());

    // Aggregate quick stats
    const totalSubscribers = products.reduce((s, p) => s + (p.stats?.totalSubscribers ?? 0), 0);
    const monthlyRevenue   = products.reduce((s, p) => s + (p.stats?.monthlyRevenue ?? 0), 0);
    const avgLatency       = products.length
      ? Math.round(products.reduce((s, p) => s + (p.stats?.avgLatencyMs ?? 0), 0) / products.length)
      : 0;

    // Calls over last 30 days (from analytics subcollections)
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const sinceStr = since.toISOString().split('T')[0];

    let totalCalls = 0;
    for (const p of products) {
      const analyticsSnap = await adminDb()
        .collection('products').doc(p.id)
        .collection('analytics')
        .where('date', '>=', sinceStr)
        .get();
      totalCalls += analyticsSnap.docs.reduce((s, d) => s + (d.data().calls ?? 0), 0);
    }

    // Recent transactions (last 10)
    const txSnap = await adminDb()
      .collection('transactions')
      .where('providerId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();
    const transactions = txSnap.docs.map(d => {
      const tx = d.data();
      return {
        id:           d.id,
        tierName:     tx.tierName,
        grossAmountZAR: tx.grossAmountZAR,
        netAmountZAR:   tx.netAmountZAR,
        status:         tx.status,
        paymentMethod:  tx.paymentMethod,
        paidAt:         tx.paidAt?.toDate()?.toISOString() ?? null,
      };
    });

    // Recent subscriptions (last 10) for activity feed
    const subSnap = await adminDb()
      .collection('subscriptions')
      .where('providerId', '==', user.uid)
      .orderBy('acquiredAt', 'desc')
      .limit(10)
      .get();
    const recentSubs = subSnap.docs.map(d => {
      const s = d.data();
      return {
        id:         d.id,
        productName: s.productName,
        tierName:   s.tierName,
        acquiredAt: s.acquiredAt?.toDate()?.toISOString() ?? null,
      };
    });

    // Monthly chart (current calendar year)
    const monthlyChart = await getMonthlyRevenue(user.uid);

    return NextResponse.json({
      stats: {
        totalRevenue:      monthlyRevenue,
        totalCalls,
        activeSubscribers: totalSubscribers,
        avgResponseTime:   avgLatency,
      },
      products: products.map(p => ({
        id: p.id, name: p.name, status: p.status,
        category: p.category, iconEmoji: p.iconEmoji, stats: p.stats,
      })),
      transactions,
      recentSubs,
      monthlyChart,
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

async function getMonthlyRevenue(providerId: string): Promise<number[]> {
  const result = Array(12).fill(0);
  const txSnap = await adminDb()
    .collection('transactions')
    .where('providerId', '==', providerId)
    .where('status', '==', 'completed')
    .orderBy('paidAt', 'desc')
    .limit(1000)
    .get();

  txSnap.docs.forEach(d => {
    const tx = d.data();
    if (tx.paidAt) {
      const month = new Date(tx.paidAt.toDate()).getMonth();
      result[month] += (tx.netAmountZAR ?? 0) / 100;
    }
  });
  return result;
}
