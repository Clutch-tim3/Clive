import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

/** DELETE — revoke an API key */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { keyId: string } },
) {
  try {
    const user   = await requireAuth();
    const keyRef = adminDb.collection('apiKeys').doc(params.keyId);
    const keyDoc = await keyRef.get();

    if (!keyDoc.exists)
      return NextResponse.json({ error: 'Key not found' }, { status: 404 });
    if (keyDoc.data()!.userId !== user.uid)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await keyRef.update({ isActive: false, revokedAt: new Date() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
