import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { products } from '@/lib/products';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/seed-products
 *
 * Seeds all Clive-built products from lib/products.ts into Firestore.
 * Protected by SEED_SECRET env var. Run once after deploy.
 *
 * curl -X POST https://<host>/api/admin/seed-products \
 *   -H "Authorization: Bearer <SEED_SECRET>"
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SEED_SECRET;
  const auth = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!secret || auth !== secret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const db = adminDb();
  const batch = db.batch();
  const seeded: string[] = [];

  for (const product of products) {
    // Use slug as the document ID so it's deterministic
    const ref = db.collection('products').doc(product.slug);
    const existing = await ref.get();

    if (!existing.exists) {
      batch.set(ref, {
        id:          product.slug,
        slug:        product.slug,
        name:        product.name,
        tagline:     product.tagline,
        description: product.description,
        category:    product.category,
        features:    product.features,
        endpoints:   product.endpoints,
        overview:    product.overview,
        pricing:     product.pricing,
        freeTier:    product.freeTier,
        channels:    product.channels,
        licence:     product.licence ?? null,
        isNew:       product.isNew ?? false,
        isRebuilt:   product.isRebuilt ?? false,
        // Firestore-specific fields
        status:        'live',
        providerId:    'clive',
        providerName:  'Clive',
        isCliveProduct: true,
        stats: {
          totalSubscribers: 0,
          monthlyRevenue:   0,
          totalCalls:       0,
          avgLatencyMs:     0,
          uptimePct:        100,
          errorRatePct:     0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      seeded.push(product.slug);
    }
  }

  await batch.commit();

  return NextResponse.json({
    seeded,
    skipped: products.map(p => p.slug).filter(s => !seeded.includes(s)),
    total: products.length,
  });
}
