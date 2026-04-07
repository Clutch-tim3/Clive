import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/firebase/auth';
import { adminDb } from '@/lib/firebase/admin';
import { updateDomain, lockDomain, unlockDomain } from '@/lib/domains/namecom';

// GET — domain details
export async function GET(
  req: NextRequest,
  { params }: { params: { domain: string } }
) {
  const user = await requireAuth().catch(() => null);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const domainName = decodeURIComponent(params.domain);
  const snap = await adminDb().collection('domains')
    .where('domainName', '==', domainName)
    .where('userId', '==', user.uid)
    .limit(1).get();

  if (snap.empty) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const data = snap.docs[0].data();
  return NextResponse.json({
    ...data,
    registeredAt: data.registeredAt?.toDate()?.toISOString(),
    expiresAt:    data.expiresAt?.toDate()?.toISOString(),
    renewedAt:    data.renewedAt?.toDate()?.toISOString() ?? null,
  });
}

// PUT — update autoRenew, nameservers, or lock state
export async function PUT(
  req: NextRequest,
  { params }: { params: { domain: string } }
) {
  const user = await requireAuth().catch(() => null);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const domainName = decodeURIComponent(params.domain);
  const body = await req.json();

  const snap = await adminDb().collection('domains')
    .where('domainName', '==', domainName)
    .where('userId', '==', user.uid)
    .limit(1).get();

  if (snap.empty) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updates: Record<string, any> = { updatedAt: new Date() };

  if (body.nameservers) {
    await updateDomain(domainName, { nameservers: body.nameservers });
    updates.nameservers = body.nameservers;
  }

  if (typeof body.autoRenew === 'boolean') {
    await updateDomain(domainName, { autorenewEnabled: body.autoRenew });
    updates.autoRenew = body.autoRenew;
  }

  if (typeof body.locked === 'boolean') {
    if (body.locked) await lockDomain(domainName);
    else await unlockDomain(domainName);
    updates.locked = body.locked;
  }

  if (typeof body.privacyEnabled === 'boolean') {
    await updateDomain(domainName, { privacyEnabled: body.privacyEnabled });
    updates.privacyEnabled = body.privacyEnabled;
  }

  await snap.docs[0].ref.update(updates);
  return NextResponse.json({ ok: true });
}
