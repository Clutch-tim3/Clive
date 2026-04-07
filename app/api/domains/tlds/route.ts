import { NextResponse } from 'next/server';
import { getCachedTLDPrices, usdToZAR, FEATURED_TLDS } from '@/lib/domains/tlds';

export async function GET() {
  try {
    const prices = await getCachedTLDPrices();

    const featured = FEATURED_TLDS.map(tld => {
      const p = prices[tld];
      if (!p) return null;
      return {
        tld,
        priceUSD:    p.purchasePrice,
        priceZAR:    usdToZAR(p.purchasePrice),
        renewalUSD:  p.renewalPrice,
        renewalZAR:  usdToZAR(p.renewalPrice),
        transferUSD: p.transferPrice,
        transferZAR: usdToZAR(p.transferPrice),
      };
    }).filter(Boolean);

    return NextResponse.json({ tlds: featured });
  } catch {
    return NextResponse.json({ error: 'Could not load TLD prices.' }, { status: 503 });
  }
}
