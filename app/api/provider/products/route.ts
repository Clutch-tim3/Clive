import { NextResponse } from 'next/server';
import { requireProvider, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

/** GET — provider's own products (all statuses) */
export async function GET() {
  try {
    const user = await requireProvider();
    const snap = await adminDb()
      .collection('products')
      .where('providerId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const products = snap.docs.map(d => d.data());
    return NextResponse.json({ products });
  } catch (err) {
    return handleRouteError(err);
  }
}
