import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { checkRDAP } from '@/lib/domains/rdap';
import {
  createRCCustomer, getRCCustomerByEmail,
  createRCContact, registerDomain
} from '@/lib/domains/resellerclub';

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  const body = await req.json();

  const {
    domain,          // e.g. "myapp.co.za"
    years = 1,
    privacy = true,
    // Registrant contact details (collected in UI)
    contactName,
    contactAddress,
    contactCity,
    contactState,
    contactZipcode,
    contactPhone,    // "821234567" — no country code
  } = body;

  if (!domain || !contactName || !contactAddress || !contactCity || !contactPhone) {
    return NextResponse.json({ error: 'Missing required registration details.' }, { status: 400 });
  }

  // ── 1. Live RDAP re-check immediately before registration ──────────
  // This is critical — do not skip. The domain may have been registered
  // by someone else in the time between the user's search and checkout.
  const rdapCheck = await checkRDAP(domain);

  if (!rdapCheck.available) {
    return NextResponse.json({
      error: 'This domain is no longer available. It may have just been registered.',
      status: rdapCheck.status,
    }, { status: 409 });
  }

  // ── 2. Check if domain is already in our Firestore (belt + braces) ─
  const existingSnap = await adminDb().collection('domains')
    .where('domainName', '==', domain)
    .where('status', 'in', ['active', 'pending'])
    .limit(1).get();

  if (!existingSnap.empty) {
    return NextResponse.json({ error: 'Domain already registered.' }, { status: 409 });
  }

  // ── 3. Get or create ResellerClub customer for this user ───────────
  let rcCustomerId: string;
  let rcContactId: string;

  try {
    // Try to find existing RC customer
    const existing = await getRCCustomerByEmail(user.email);
    rcCustomerId = String(existing.customerid);
  } catch {
    // Customer doesn't exist — create them
    const tempPw = crypto.randomUUID().slice(0, 12) + 'Clv!';
    const newCustomer = await createRCCustomer({
      username:  user.email,
      passwd:    tempPw,
      name:      contactName,
      company:   user.displayName || contactName,
      address:   contactAddress,
      city:      contactCity,
      state:     contactState || 'GP',
      country:   'ZA',
      zipcode:   contactZipcode || '0000',
      phone:     contactPhone,
      langpref:  'en',
    });
    rcCustomerId = String(newCustomer.customerid || newCustomer);
  }

  // Create contact record in ResellerClub
  const contact = await createRCContact({
    customerId: rcCustomerId,
    name:       contactName,
    company:    user.displayName || contactName,
    email:      user.email,
    address:    contactAddress,
    city:       contactCity,
    state:      contactState || 'GP',
    country:    'ZA',
    zipcode:    contactZipcode || '0000',
    phoneCC:    '27',
    phone:      contactPhone,
    type:       'Contact',
  });
  rcContactId = String(contact.contactid || contact);

  // ── 4. Register the domain ────────────────────────────────────────
  const tld = domain.includes('.co.za') ? 'co.za'
    : domain.split('.').pop() as string;

  const registration = await registerDomain({
    domainName:       domain,
    years,
    customerId:       rcCustomerId,
    regContactId:     rcContactId,
    adminContactId:   rcContactId,
    techContactId:    rcContactId,
    billingContactId: rcContactId,
    nameservers:      ['ns1.clive.dev', 'ns2.clive.dev'],
    purchasePrivacy:  privacy && tld !== 'co.za',
    protectPrivacy:   privacy && tld !== 'co.za',
  });

  // ── 5. Write to Firestore ────────────────────────────────────────
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + years);

  const docRef = adminDb().collection('domains').doc();
  const domainDoc = {
    id:               docRef.id,
    userId:           user.uid,
    userEmail:        user.email,
    domainName:       domain,
    tld,
    years,
    status:           'active',
    autoRenew:        true,
    privacyEnabled:   privacy && tld !== 'co.za',
    rcDomainId:       String(registration.entityid || registration),
    rcCustomerId,
    rcContactId,
    nameservers:      ['ns1.clive.dev', 'ns2.clive.dev'],
    priceZAR:         19900 * years, // Placeholder pricing
    registeredAt:     new Date(),
    expiresAt,
    renewedAt:        null,
    createdAt:        new Date(),
    updatedAt:        new Date(),
  };

  await docRef.set(domainDoc);

  // ── 6. Update user's domain count ────────────────────────────────
  await adminDb().collection('users').doc(user.uid).update({
    domainCount: FieldValue.increment(1),
    updatedAt: new Date(),
  });

  return NextResponse.json({
    id:          docRef.id,
    domain,
    expiresAt:   expiresAt.toISOString(),
    rcDomainId:  String(registration.entityid || registration),
  }, { status: 201 });
}
