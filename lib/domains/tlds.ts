import { getTLDs, NCTld } from './namecom';
import { adminDb } from '@/lib/firebase/admin';

// TLDs surfaced prominently in the Clive UI at launch.
export const FEATURED_TLDS = [
  'com', 'co.za', 'net', 'org', 'io', 'dev', 'app',
  'africa', 'store', 'online', 'tech', 'site',
];

// TLDs where WHOIS privacy is not available due to registry policy
export const NO_PRIVACY_TLDS = ['co.za', 'za'];

// Default Name.com nameservers
export const DEFAULT_NAMESERVERS = [
  'ns1.name.com', 'ns2.name.com', 'ns3.name.com', 'ns4.name.com',
];

// Cache TLD prices in Firestore (refresh every 24h)
// to avoid hitting the Name.com API on every page load.
export async function getCachedTLDPrices(): Promise<Record<string, NCTld>> {
  try {
    const cacheDoc = adminDb().collection('system').doc('tldPrices');
    const snap = await cacheDoc.get();

    if (snap.exists) {
      const data = snap.data()!;
      const age = Date.now() - (data.cachedAt?.toMillis?.() ?? 0);
      if (age < 24 * 60 * 60 * 1000) {
        return data.prices as Record<string, NCTld>;
      }
    }

    // Cache miss or stale — fetch fresh
    const tlds = await getTLDs();
    const prices: Record<string, NCTld> = {};
    tlds.forEach(tld => { prices[tld.name] = tld; });

    // Non-blocking write
    cacheDoc.set({ prices, cachedAt: new Date() }).catch(err =>
      console.error('Failed to write TLD price cache:', err)
    );

    return prices;
  } catch (err) {
    console.error('[TLDs] getCachedTLDPrices error:', err);
    throw err;
  }
}

export async function getTLDPrice(tld: string): Promise<NCTld | null> {
  const prices = await getCachedTLDPrices();
  return prices[tld] || null;
}

// Fixed USD→ZAR rate. Wire to FXBridge API for live accuracy.
const USD_TO_ZAR = 18.5;

/** Returns ZAR in cents */
export function usdToZAR(usd: number): number {
  return Math.round(usd * USD_TO_ZAR * 100);
}

/** Alias matching spec naming */
export const usdToZARCents = usdToZAR;

export function formatZAR(cents: number): string {
  return `R${(cents / 100).toFixed(2)}`;
}

export function formatUSD(dollars: number): string {
  return `$${dollars.toFixed(2)}`;
}

// ── FEATURED TLD PRICES ───────────────────────────────────────────────────────

export interface PricedTLD {
  tld:              string;
  priceUSD:         number;
  priceZARCents:    number;
  priceZAR:         string;
  renewalUSD:       number;
  renewalZARCents:  number;
  renewalZAR:       string;
  transferUSD:      number;
  transferZARCents: number;
  privacyAvailable: boolean;
}

export async function getFeaturedTLDPrices(): Promise<PricedTLD[]> {
  const prices = await getCachedTLDPrices();
  return FEATURED_TLDS
    .map(tld => {
      const p = prices[tld];
      if (!p) return null;
      return {
        tld,
        priceUSD:         p.purchasePrice,
        priceZARCents:    usdToZAR(p.purchasePrice),
        priceZAR:         formatZAR(usdToZAR(p.purchasePrice)),
        renewalUSD:       p.renewalPrice,
        renewalZARCents:  usdToZAR(p.renewalPrice),
        renewalZAR:       formatZAR(usdToZAR(p.renewalPrice)),
        transferUSD:      p.transferPrice,
        transferZARCents: usdToZAR(p.transferPrice),
        privacyAvailable: !NO_PRIVACY_TLDS.includes(tld),
      } as PricedTLD;
    })
    .filter((p): p is PricedTLD => p !== null);
}
