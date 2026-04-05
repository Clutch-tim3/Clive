import { NextRequest, NextResponse } from 'next/server';
import { requireProvider, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';

/** GET — public list of live products */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let query = adminDb
      .collection('products')
      .where('status', '==', 'live')
      .orderBy('stats.totalSubscribers', 'desc') as FirebaseFirestore.Query;

    if (category) query = query.where('category', '==', category);

    const snap     = await query.get();
    const products = snap.docs.map(d => d.data());
    return NextResponse.json({ products });
  } catch (err) {
    return handleRouteError(err);
  }
}

/** POST — provider submits a new product for review */
export async function POST(req: NextRequest) {
  try {
    const user = await requireProvider();
    const body = await req.json();

    // Validate required fields
    const required = ['name', 'tagline', 'description', 'baseUrl', 'endpoints', 'tiers'];
    for (const f of required) {
      if (!body[f]) return NextResponse.json({ error: `Missing: ${f}` }, { status: 400 });
    }

    // Enforce free tier
    const hasFree = (body.tiers as any[]).some(t => Number(t.priceZAR) === 0);
    if (!hasFree) {
      return NextResponse.json(
        { error: 'At least one free tier is required.' },
        { status: 400 },
      );
    }

    // Generate unique slug
    const baseSlug = String(body.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slugCheck = await adminDb
      .collection('products')
      .where('slug', '==', baseSlug)
      .limit(1)
      .get();
    const slug = slugCheck.empty ? baseSlug : `${baseSlug}-${Date.now()}`;

    const docRef = adminDb.collection('products').doc();
    await docRef.set({
      id:              docRef.id,
      providerId:      user.uid,
      providerName:    user.displayName ?? '',
      providerEmail:   user.email ?? '',
      name:            body.name,
      slug,
      tagline:         body.tagline,
      description:     body.description,
      category:        body.category ?? 'Developer API',
      tags:            body.tags ?? ['REST', 'JSON'],
      iconEmoji:       body.iconEmoji ?? '⚡',
      baseUrl:         body.baseUrl,
      apiVersion:      body.apiVersion ?? 'v1',
      authType:        body.authType ?? 'API Key (Header)',
      apiKeyHeader:    body.apiKeyHeader ?? 'X-Clive-Key',
      endpoints:       body.endpoints,
      tiers:           body.tiers,
      status:          'review',
      isProviderProduct: true,
      listingType:     'provider',
      submittedAt:     new Date(),
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

    // Upgrade user role to provider if not already
    if (user.role === 'consumer') {
      await adminDb.collection('users').doc(user.uid).update({
        role: 'provider', updatedAt: new Date(),
      });
    }

    return NextResponse.json({ id: docRef.id, slug }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}
