import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

type Ctx = { params: { productId: string } };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const doc = await adminDb.collection('products').doc(params.productId).get();
    if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data = doc.data()!;
    // Only return live products publicly; others need auth
    if (data.status !== 'live') {
      const user = await requireAuth();
      if (user.role !== 'admin' && data.providerId !== user.uid)
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ product: data });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const user   = await requireAuth();
    const docRef = adminDb.collection('products').doc(params.productId);
    const doc    = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data = doc.data()!;
    const isAdmin    = user.role === 'admin';
    const isOwner    = data.providerId === user.uid;
    const canEdit    = data.status === 'draft' || data.status === 'rejected';

    if (!isAdmin && !(isOwner && canEdit))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    await docRef.update({ ...body, updatedAt: new Date() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    await requireAdmin();
    await adminDb.collection('products').doc(params.productId).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
