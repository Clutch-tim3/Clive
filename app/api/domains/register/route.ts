import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleRouteError } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';
import { checkAllTLDs } from '@/lib/domains/availability';
import { getTLDPrice, usdToZAR } from '@/lib/domains/tlds';

export const dynamic = 'force-dynamic';

// Static fallback prices (USD) in case TLD cache is unavailable
const FALLBACK_PRICES: Record<string, number> = {
  com: 12.99, net: 12.99, org: 12.99, 'co.za': 14.99,
  io: 39.99, dev: 12.99, app: 12.99, africa: 29.99,
  store: 19.99, online: 19.99, tech: 29.99, site: 19.99,
};

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const {
      domainName,
      years = 1,
      privacyEnabled = true,
      firstName,
      lastName,
      email,
      phone,
      company,
      address,
      city,
      state = 'GP',
      zip,
      country = 'ZA',
    } = body;

    // ── Validate required fields ─────────────────────────────────────────────
    const missing = ['domainName', 'firstName', 'lastName', 'phone', 'address', 'city']
      .filter(f => !body[f]);
    if (missing.length) {
      return NextResponse.json({ error: `Missing: ${missing.join(', ')}` }, { status: 400 });
    }

    // ── Parse TLD + SLD ──────────────────────────────────────────────────────
    const isCoza = domainName.endsWith('.co.za');
    const tld = isCoza ? 'co.za' : (domainName.split('.').pop() ?? 'com');
    const sld = isCoza
      ? domainName.replace('.co.za', '')
      : domainName.split('.').slice(0, -1).join('.');

    // ── Live availability re-check via RDAP ──────────────────────────────────
    let rdapCheck;
    try {
      [rdapCheck] = await checkAllTLDs(sld, [tld]);
    } catch {
      return NextResponse.json({
        error: 'Could not verify domain availability. Please try again.',
      }, { status: 503 });
    }

    if (!rdapCheck || rdapCheck.status !== 'available') {
      return NextResponse.json({
        error: 'This domain is no longer available.',
        code: 'DOMAIN_TAKEN',
      }, { status: 409 });
    }

    // ── Price lookup ─────────────────────────────────────────────────────────
    const tldInfo = await getTLDPrice(tld).catch(() => null);
    const purchasePrice = tldInfo?.purchasePrice ?? FALLBACK_PRICES[tld] ?? 12.99;
    const priceZAR = usdToZAR(purchasePrice * years);

    // ── Prevent duplicate orders ──────────────────────────────────────────────
    const existing = await adminDb()
      .collection('domainOrders')
      .where('domainName', '==', domainName)
      .where('status', 'in', ['pending', 'processing', 'fulfilled'])
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json({ error: 'An order already exists for this domain.' }, { status: 409 });
    }

    // ── Write order to Firestore ──────────────────────────────────────────────
    const orderRef = adminDb().collection('domainOrders').doc();
    await orderRef.set({
      id:             orderRef.id,
      userId:         user.uid,
      userEmail:      user.email,
      domainName,
      tld,
      years,
      status:         'pending',
      privacyEnabled: privacyEnabled && !isCoza,
      nameservers:    ['ns1.name.com', 'ns2.name.com', 'ns3.name.com', 'ns4.name.com'],
      priceUSD:       purchasePrice,
      priceZAR,
      contact: {
        firstName, lastName,
        email: email || user.email,
        phone, address, city, state,
        zip: zip ?? '',
        country,
        company: company ?? '',
      },
      orderedAt:  new Date(),
      createdAt:  new Date(),
      updatedAt:  new Date(),
    });

    // ── Admin notification (fire-and-forget) ─────────────────────────────────
    adminDb().collection('adminNotifications').doc().set({
      type:       'domainOrder',
      orderId:    orderRef.id,
      domainName,
      userEmail:  user.email,
      userId:     user.uid,
      read:       false,
      createdAt:  new Date(),
    }).catch(console.error);

    return NextResponse.json({
      id:         orderRef.id,
      domainName,
      priceZAR,
      status:     'pending',
    }, { status: 201 });

  } catch (err) {
    return handleRouteError(err);
  }
}
