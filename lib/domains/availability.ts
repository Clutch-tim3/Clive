import { searchDomains, NCSearchResult } from './namecom';
import { getCachedTLDPrices, usdToZAR } from './tlds';

export interface AvailabilityResult {
  domainName:    string;
  tld:           string;
  sld:           string;
  status:        'available' | 'taken' | 'premium' | 'unsupported' | 'error';
  purchasable:   boolean;
  priceUSD?:     number;
  priceZAR?:     number;
  renewalUSD?:   number;
  renewalZAR?:   number;
  isPremium:     boolean;
  errorMessage?: string;
}

export function parseDomainInput(query: string): {
  sld: string;
  tld: string | null;
  fullDomain: string | null;
} {
  const q = query.toLowerCase().trim()
    .replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (q.endsWith('.co.za')) {
    const sld = q.replace('.co.za', '');
    return { sld, tld: 'co.za', fullDomain: q };
  }

  const parts = q.split('.');
  if (parts.length === 1) {
    return { sld: q, tld: null, fullDomain: null };
  }
  if (parts.length === 2) {
    return { sld: parts[0], tld: parts[1], fullDomain: q };
  }
  // 3+ parts — use last segment as TLD
  const tld = parts[parts.length - 1];
  const sld = parts.slice(0, -1).join('.');
  return { sld, tld, fullDomain: q };
}

export async function checkAllTLDs(
  sld: string,
  tlds: string[] = ['com', 'co.za', 'net', 'org', 'io', 'dev', 'app']
): Promise<AvailabilityResult[]> {
  const domainNames = tlds.map(tld =>
    tld === 'co.za' ? `${sld}.co.za` : `${sld}.${tld}`
  );

  const prices = await getCachedTLDPrices();

  let results: NCSearchResult[] = [];
  try {
    results = await searchDomains(domainNames);
  } catch {
    return tlds.map(tld => ({
      domainName:   tld === 'co.za' ? `${sld}.co.za` : `${sld}.${tld}`,
      tld, sld, status: 'error' as const, purchasable: false, isPremium: false,
      errorMessage: 'Registry unreachable. Try again in a moment.',
    }));
  }

  const resultMap = new Map(results.map(r => [r.domainName, r]));

  return tlds.map(tld => {
    const domainName = tld === 'co.za' ? `${sld}.co.za` : `${sld}.${tld}`;
    const r = resultMap.get(domainName);

    if (!r) {
      return {
        domainName, tld, sld, status: 'unsupported' as const,
        purchasable: false, isPremium: false,
        errorMessage: `We cannot currently register .${tld} domains.`,
      };
    }

    if (!r.purchasable) {
      return {
        domainName, tld, sld, status: 'taken' as const,
        purchasable: false, isPremium: r.premium,
      };
    }

    const tldInfo = prices[tld];
    const priceUSD   = r.purchasePrice || tldInfo?.purchasePrice || 0;
    const renewalUSD = r.renewalPrice  || tldInfo?.renewalPrice  || 0;

    return {
      domainName, tld, sld,
      status:      r.premium ? 'premium' as const : 'available' as const,
      purchasable: true,
      isPremium:   r.premium,
      priceUSD,
      priceZAR:    usdToZAR(priceUSD),
      renewalUSD,
      renewalZAR:  usdToZAR(renewalUSD),
    };
  });
}
