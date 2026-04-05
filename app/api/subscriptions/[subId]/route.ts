import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

type Ctx = { params: { subId: string } };

/** DELETE — cancel a subscription */
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const user   = await requireAuth();
    const subRef = adminDb().collection('subscriptions').doc(params.subId);
    const subDoc = await subRef.get();

    if (!subDoc.exists)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (subDoc.data()!.userId !== user.uid)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await subRef.update({ status: 'cancelled', cancelledAt: new Date() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
