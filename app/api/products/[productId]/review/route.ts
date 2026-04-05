import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

/** POST — admin approves or rejects a product */
export async function POST(
  req: NextRequest,
  { params }: { params: { productId: string } },
) {
  try {
    const admin = await requireAdmin();
    const { action, notes } = await req.json(); // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action))
      return NextResponse.json({ error: 'action must be "approve" or "reject"' }, { status: 400 });

    await adminDb.collection('products').doc(params.productId).update({
      status:      action === 'approve' ? 'live' : 'rejected',
      reviewNotes: notes ?? null,
      reviewedAt:  new Date(),
      reviewedBy:  admin.uid,
      updatedAt:   new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
