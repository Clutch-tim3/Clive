import { NextResponse } from 'next/server';
import { requireAdmin, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

/** GET — list products pending review */
export async function GET() {
  try {
    await requireAdmin();
    const snap = await adminDb
      .collection('products')
      .where('status', '==', 'review')
      .orderBy('submittedAt', 'asc')
      .get();

    const products = snap.docs.map(d => {
      const p = d.data();
      return {
        id:           d.id,
        name:         p.name,
        slug:         p.slug,
        providerName: p.providerName,
        providerEmail: p.providerEmail,
        category:     p.category,
        submittedAt:  p.submittedAt?.toDate()?.toISOString() ?? null,
        endpointCount: (p.endpoints as any[])?.length ?? 0,
        tierCount:     (p.tiers as any[])?.length ?? 0,
      };
    });

    return NextResponse.json({ products });
  } catch (err) {
    return handleRouteError(err);
  }
}
