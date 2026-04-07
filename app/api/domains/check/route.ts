import { NextRequest, NextResponse } from 'next/server';
import { parseDomainInput, checkAllTLDs } from '@/lib/domains/availability';
import { FEATURED_TLDS } from '@/lib/domains/tlds';

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q')?.toLowerCase().trim();
  if (!q) return NextResponse.json({ error: 'Missing q' }, { status: 400 });

  const { sld, tld, fullDomain } = parseDomainInput(q);

  if (!sld || sld.length < 2) {
    return NextResponse.json({ error: 'Domain name too short.' }, { status: 400 });
  }

  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(sld)) {
    return NextResponse.json({
      error: 'Domain names can only contain letters, numbers, and hyphens.',
    }, { status: 400 });
  }

  if (fullDomain && tld) {
    // User typed a specific domain — check that TLD first, suggest others
    const allTLDs = [tld, ...FEATURED_TLDS.filter(t => t !== tld)].slice(0, 8);
    const results = await checkAllTLDs(sld, allTLDs);
    return NextResponse.json({ results, primary: fullDomain });
  }

  // User typed just a name — check all featured TLDs
  const results = await checkAllTLDs(sld, FEATURED_TLDS);
  return NextResponse.json({ results, primary: null });
}
