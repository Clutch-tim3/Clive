import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';
import { generateApiKey } from '@/lib/keys/generator';

/** GET — list user's active API keys (masked, never plaintext) */
export async function GET() {
  try {
    const user = await requireAuth();
    const snap = await adminDb
      .collection('apiKeys')
      .where('userId', '==', user.uid)
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    const keys = snap.docs.map(d => {
      const data = d.data();
      return {
        id:          d.id,
        keyMasked:   data.keyMasked,
        keyType:     data.keyType,
        productId:   data.productId,
        createdAt:   data.createdAt?.toDate()?.toISOString() ?? null,
        lastUsedAt:  data.lastUsedAt?.toDate()?.toISOString() ?? null,
      };
    });
    return NextResponse.json({ keys });
  } catch (err) {
    return handleRouteError(err);
  }
}

/** POST — generate a new API key (returns fullKey ONCE) */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { productId, keyType = 'live' } = await req.json();

    const { fullKey, prefix, hash, masked, lastFour } = generateApiKey(
      keyType === 'test' ? 'test' : 'live',
    );

    const keyRef = adminDb.collection('apiKeys').doc();
    await keyRef.set({
      id:            keyRef.id,
      userId:        user.uid,
      productId:     productId ?? 'platform',
      keyType:       keyType === 'test' ? 'test' : 'live',
      keyPrefix:     prefix,
      keyHash:       hash,
      keyMasked:     masked,
      lastFourChars: lastFour,
      isActive:      true,
      createdAt:     new Date(),
    });

    // fullKey returned ONCE — never stored in plaintext
    return NextResponse.json({ key: fullKey, id: keyRef.id, masked }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
