import { searchDomains, NCSearchResult } from './namecom';
import { getCachedTLDPrices, usdToZAR, NO_PRIVACY_TLDS } from './tlds';

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
  privacyAvailable: boolean;
  errorMessage?: string;
}

// Spec alias
export type DomainAvailabilityResult = AvailabilityResult;

export function parseDomainInput(query: string): {
  sld: string;
  tld: string | null;
  fullDomain: string | null;
} {
  const q = query.toLowerCase().trim()
    .replace(/^https?:\/\//, '').replace(/\/$/, '')
    .replace(/[^a-z0-9.-]/g, '');

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

// Spec alias
export const parseDomainQuery = parseDomainInput;

/** Validate SLD format — returns error message or null if valid */
export function validateSLD(sld: string): string | null {
  if (!sld) return 'Please enter a domain name.';
  if (sld.length < 2) return 'Domain name must be at least 2 characters.';
  if (sld.length > 63) return 'Domain name must be 63 characters or less.';
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(sld))
    return 'Domain names can only contain letters, numbers, and hyphens, and cannot start or end with a hyphen.';
  return null;
}

export async function checkAllTLDs(
  sld: string,
  tlds: string[] = ['com', 'co.za', 'net', 'org', 'io', 'dev', 'app']
): Promise<AvailabilityResult[]> {
  const validationError = validateSLD(sld);
  if (validationError) {
    return tlds.map(tld => ({
      domainName: tld === 'co.za' ? `${sld}.co.za` : `${sld}.${tld}`,
      tld, sld, status: 'error' as const, purchasable: false, isPremium: false,
      privacyAvailable: !NO_PRIVACY_TLDS.includes(tld),
      errorMessage: validationError,
    }));
  }

  const domainNames = tlds.map(tld =>
    tld === 'co.za' ? `${sld}.co.za` : `${sld}.${tld}`
  );

  const [priceMap, ncResults] = await Promise.allSettled([
    getCachedTLDPrices(),
    searchDomains(domainNames),
  ]);

  const prices = priceMap.status === 'fulfilled' ? priceMap.value : {};
  const results: NCSearchResult[] =
    ncResults.status === 'fulfilled' ? ncResults.value : [];

  if (ncResults.status === 'rejected') {
    return tlds.map(tld => ({
      domainName:   tld === 'co.za' ? `${sld}.co.za` : `${sld}.${tld}`,
      tld, sld, status: 'error' as const, purchasable: false, isPremium: false,
      privacyAvailable: !NO_PRIVACY_TLDS.includes(tld),
      errorMessage: 'Registry unreachable. Try again in a moment.',
    }));
  }

  const resultMap = new Map(results.map(r => [r.domainName, r]));

  return tlds.map(tld => {
    const domainName = tld === 'co.za' ? `${sld}.co.za` : `${sld}.${tld}`;
    const r = resultMap.get(domainName);
    const privacyAvailable = !NO_PRIVACY_TLDS.includes(tld);

    if (!r) {
      return {
        domainName, tld, sld, status: 'unsupported' as const,
        purchasable: false, isPremium: false, privacyAvailable,
        errorMessage: `We cannot currently register .${tld} domains.`,
      };
    }

    if (!r.purchasable) {
      return {
        domainName, tld, sld, status: 'taken' as const,
        purchasable: false, isPremium: r.premium, privacyAvailable,
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
      privacyAvailable,
      priceUSD,
      priceZAR:    usdToZAR(priceUSD),
      renewalUSD,
      renewalZAR:  usdToZAR(renewalUSD),
    };
  });
}

// Spec alias
export const checkDomainAvailability = checkAllTLDs;
