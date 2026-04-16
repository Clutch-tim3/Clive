import { NextResponse } from 'next/server';
import { getCachedTLDPrices, usdToZAR, FEATURED_TLDS } from '@/lib/domains/tlds';

// Hardcoded fallback USD prices — used when Name.com price cache hasn't populated
// a given TLD yet. All prices approximate market rates.
const FALLBACK_USD: Record<string, { purchase: number; renewal: number }> = {
  com:        { purchase: 10.99, renewal: 14.99 },
  'co.za':    { purchase:  7.99, renewal:  9.99 },
  net:        { purchase: 11.99, renewal: 14.99 },
  org:        { purchase: 11.99, renewal: 14.99 },
  io:         { purchase: 39.99, renewal: 39.99 },
  dev:        { purchase: 12.99, renewal: 12.99 },
  app:        { purchase: 14.99, renewal: 14.99 },
  africa:     { purchase: 24.99, renewal: 24.99 },
  store:      { purchase: 19.99, renewal: 29.99 },
  online:     { purchase:  4.99, renewal: 29.99 },
  tech:       { purchase: 29.99, renewal: 49.99 },
  site:       { purchase:  4.99, renewal: 29.99 },
  ai:         { purchase: 79.99, renewal: 79.99 },
  co:         { purchase: 29.99, renewal: 29.99 },
  shop:       { purchase: 19.99, renewal: 29.99 },
  cloud:      { purchase: 19.99, renewal: 29.99 },
  digital:    { purchase: 34.99, renewal: 49.99 },
  me:         { purchase: 19.99, renewal: 19.99 },
  biz:        { purchase: 14.99, renewal: 19.99 },
  info:       { purchase:  5.99, renewal: 19.99 },
};

export async function GET() {
  try {
    const prices = await getCachedTLDPrices();

    const featured = FEATURED_TLDS.map(tld => {
      const p        = prices[tld];
      const fallback = FALLBACK_USD[tld];

      const purchasePrice = p?.purchasePrice ?? fallback?.purchase ?? 0;
      const renewalPrice  = p?.renewalPrice  ?? fallback?.renewal  ?? 0;
      const transferPrice = p?.transferPrice ?? fallback?.purchase ?? 0;

      if (purchasePrice === 0) return null; // truly unknown — omit

      return {
        tld,
        priceUSD:    purchasePrice,
        priceZAR:    usdToZAR(purchasePrice),
        renewalUSD:  renewalPrice,
        renewalZAR:  usdToZAR(renewalPrice),
        transferUSD: transferPrice,
        transferZAR: usdToZAR(transferPrice),
      };
    }).filter(Boolean);

    return NextResponse.json({ tlds: featured });
  } catch {
    return NextResponse.json({ error: 'Could not load TLD prices.' }, { status: 503 });
  }
}
