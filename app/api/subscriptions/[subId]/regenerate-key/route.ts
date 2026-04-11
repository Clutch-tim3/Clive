import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAuth, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function POST(
  _req: NextRequest,
  { params }: { params: { subId: string } }
) {
  try {
    const user = await requireAuth();
    const snap = await adminDb().collection('subscriptions').doc(params.subId).get();

    if (!snap.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (snap.data()!.userId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const productId = snap.data()!.productId as string;
    const newKey    = `clive_${productId.slice(0, 6)}_${crypto.randomBytes(16).toString('hex')}`;

    await snap.ref.update({ apiKey: newKey, updatedAt: new Date() });

    return NextResponse.json({ apiKey: newKey });
  } catch (err) {
    return handleRouteError(err);
  }
}
