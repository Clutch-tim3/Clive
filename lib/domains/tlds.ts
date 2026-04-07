import { getTLDs, NCTld } from './namecom';
import { adminDb } from '@/lib/firebase/admin';

// TLDs surfaced prominently in the Clive UI at launch.
export const FEATURED_TLDS = [
  'com', 'co.za', 'net', 'org', 'io', 'dev', 'app',
  'africa', 'store', 'online', 'tech', 'site',
];

// Cache TLD prices in Firestore (refresh every 24h)
// to avoid hitting the Name.com API on every page load.
export async function getCachedTLDPrices(): Promise<Record<string, NCTld>> {
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

  await cacheDoc.set({ prices, cachedAt: new Date() });
  return prices;
}

export async function getTLDPrice(tld: string): Promise<NCTld | null> {
  const prices = await getCachedTLDPrices();
  return prices[tld] || null;
}

// Fixed USD→ZAR rate. Wire to an FX API (e.g. FXBridge) for accuracy.
const USD_TO_ZAR = 18.5;

export function usdToZAR(usd: number): number {
  return Math.round(usd * USD_TO_ZAR * 100); // returns cents
}

export function formatZAR(cents: number): string {
  return `R${(cents / 100).toFixed(2)}`;
}
