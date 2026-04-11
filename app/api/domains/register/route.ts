import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { requireAuth } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';
import {
  registerDomain, lockDomain,
  buildContact, NamecomError,
} from '@/lib/domains/namecom';
import { checkAllTLDs } from '@/lib/domains/availability';
import { getTLDPrice, usdToZAR } from '@/lib/domains/tlds';

export async function POST(req: NextRequest) {
  const user = await requireAuth().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: 'Sign in to register a domain.' }, { status: 401 });
  }

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

  // ── Live availability re-check via RDAP ──────────────────────────────────
  const tld = domainName.endsWith('.co.za') ? 'co.za' : (domainName.split('.').pop() ?? 'com');
  const sld = domainName.endsWith('.co.za')
    ? domainName.replace('.co.za', '')
    : domainName.split('.').slice(0, -1).join('.');

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
      error: 'This domain is no longer available. It was just registered by someone else.',
      code: 'DOMAIN_TAKEN',
    }, { status: 409 });
  }

  // Static fallback prices (USD) in case TLD cache is unavailable
  const FALLBACK_PRICES: Record<string, number> = {
    com: 12.99, net: 12.99, org: 12.99, 'co.za': 14.99,
    io: 39.99, dev: 12.99, app: 12.99, africa: 29.99,
    store: 19.99, online: 19.99, tech: 29.99, site: 19.99,
  };
  const tldInfo = await getTLDPrice(tld).catch(() => null);
  const purchasePrice = tldInfo?.purchasePrice ?? FALLBACK_PRICES[tld] ?? 12.99;

  // ── Belt-and-braces Firestore check ──────────────────────────────────────
  const existing = await adminDb().collection('domains')
    .where('domainName', '==', domainName)
    .where('status', 'in', ['active', 'pending'])
    .limit(1).get();

  if (!existing.empty) {
    return NextResponse.json({ error: 'Domain already registered.' }, { status: 409 });
  }

  // ── Build contact ─────────────────────────────────────────────────────────
  const contact = buildContact(
    firstName, lastName,
    email || user.email,
    phone, address, city, state, zip ?? '', country, company
  );
  const contacts = {
    registrant: contact,
    admin:      contact,
    tech:       contact,
    billing:    contact,
  };

  // ── Register with Name.com ────────────────────────────────────────────────
  let registration;
  try {
    registration = await registerDomain({
      domainName,
      nameservers:    ['ns1.name.com', 'ns2.name.com', 'ns3.name.com', 'ns4.name.com'],
      contacts,
      privacyEnabled: privacyEnabled && !domainName.endsWith('.co.za'),
      purchasePrice,
      years,
    });
  } catch (err: any) {
    if (err instanceof NamecomError) {
      // Audit log — write regardless of charge status
      await adminDb().collection('domainAttempts').add({
        userId:      user.uid,
        domainName,
        error:       err.message,
        statusCode:  err.statusCode,
        attemptedAt: new Date(),
      });
      return NextResponse.json({
        error: `Registration failed: ${err.message}`,
        code:  'NAMECOM_ERROR',
      }, { status: 502 });
    }
    throw err;
  }

  // ── Lock immediately after registration ───────────────────────────────────
  try {
    await lockDomain(domainName);
  } catch {
    console.warn(`Could not lock ${domainName} immediately after registration.`);
  }

  // ── Write to Firestore ────────────────────────────────────────────────────
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + years);

  const priceZAR = usdToZAR(purchasePrice * years);

  const docRef = adminDb().collection('domains').doc();
  await docRef.set({
    id:             docRef.id,
    userId:         user.uid,
    userEmail:      user.email,
    domainName,
    tld,
    years,
    status:         'active',
    locked:         true,
    autoRenew:      true,
    privacyEnabled: privacyEnabled && !domainName.endsWith('.co.za'),
    nameservers:    ['ns1.name.com', 'ns2.name.com', 'ns3.name.com', 'ns4.name.com'],
    priceUSD:       purchasePrice,
    priceZAR,
    ncOrderId:      registration.order,
    registeredAt:   new Date(),
    expiresAt,
    renewedAt:      null,
    contact: {
      firstName, lastName,
      email: email || user.email,
      phone, address, city, state, zip, country,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await adminDb().collection('users').doc(user.uid).update({
    domainCount: FieldValue.increment(1),
    updatedAt:   new Date(),
  });

  return NextResponse.json({
    id:        docRef.id,
    domainName,
    expiresAt: expiresAt.toISOString(),
    order:     registration.order,
    priceUSD:  purchasePrice,
    priceZAR,
  }, { status: 201 });
}
