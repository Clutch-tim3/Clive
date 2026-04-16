import { getCachedTLDPrices, usdToZAR, NO_PRIVACY_TLDS } from './tlds';

export interface AvailabilityResult {
  domainName:       string;
  tld:              string;
  sld:              string;
  status:           'available' | 'taken' | 'premium' | 'unsupported' | 'error';
  purchasable:      boolean;
  priceUSD?:        number;
  priceZAR?:        number;
  renewalUSD?:      number;
  renewalZAR?:      number;
  isPremium:        boolean;
  privacyAvailable: boolean;
  errorMessage?:    string;
}

// Spec alias
export type DomainAvailabilityResult = AvailabilityResult;

// ── RDAP servers ─────────────────────────────────────────────────────────────
// RDAP is the IETF standard for domain availability checking.
// 200 = domain exists (taken), 404 = domain available.
// No API key or account required.

// RDAP servers per TLD — from IANA bootstrap data.
// Verisign:        .com/.net
// Centralnic:      .store/.online/.site/.cloud/.shop
// Google:          .dev/.app/.page
// Identity Digital (formerly Donuts): .tech and all Donuts gTLDs via single server
// IANA/ccTLD:      .io/.africa/.ai/.co/.me
// Afilias/Identity Digital: .org/.biz/.info
export const RDAP_SERVERS: Record<string, string> = {
  // Core / highest traffic
  com:        'https://rdap.verisign.com/com/v1',
  net:        'https://rdap.verisign.com/net/v1',
  org:        'https://rdap.org',
  'co.za':    'https://rdap.registry.net.za',
  io:         'https://rdap.nic.io',
  // Google registry
  dev:        'https://rdap.registry.google/dev',
  app:        'https://rdap.registry.google/app',
  page:       'https://rdap.registry.google/page',
  // Centralnic group
  store:      'https://rdap.centralnic.com/store',
  online:     'https://rdap.centralnic.com/online',
  site:       'https://rdap.centralnic.com/site',
  cloud:      'https://rdap.centralnic.com/cloud',
  shop:       'https://rdap.centralnic.com/shop',
  // ccTLDs / specialty
  africa:     'https://rdap.nic.africa',
  ai:         'https://rdap.nic.ai',
  co:         'https://rdap.nic.co',
  me:         'https://rdap.nic.me',
  // Afilias / Identity Digital
  biz:        'https://rdap.nic.biz',
  info:       'https://rdap.nic.info',
  // Identity Digital / Donuts (single RDAP server for all their gTLDs)
  tech:       'https://rdap.donuts.co',
  digital:    'https://rdap.donuts.co',
  studio:     'https://rdap.donuts.co',
  design:     'https://rdap.donuts.co',
  media:      'https://rdap.donuts.co',
  agency:     'https://rdap.donuts.co',
  solutions:  'https://rdap.donuts.co',
  services:   'https://rdap.donuts.co',
  consulting: 'https://rdap.donuts.co',
  systems:    'https://rdap.donuts.co',
  group:      'https://rdap.donuts.co',
  global:     'https://rdap.donuts.co',
  world:      'https://rdap.donuts.co',
  network:    'https://rdap.donuts.co',
  works:      'https://rdap.donuts.co',
  run:        'https://rdap.donuts.co',
};

async function checkViaRDAP(
  domainName: string,
  tld: string
): Promise<'available' | 'taken' | 'error'> {
  const base = RDAP_SERVERS[tld];
  if (!base) return 'error';

  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(`${base}/domain/${encodeURIComponent(domainName)}`, {
      headers: { Accept: 'application/rdap+json' },
      signal:  ctrl.signal,
    });

    if (res.status === 404) return 'available';

    if (res.status === 200) {
      // Must be a valid RDAP domain object — not a generic 200 page.
      // All RDAP domain responses include objectClassName:"domain" and/or ldhName.
      const ct = res.headers.get('content-type') ?? '';
      if (!ct.includes('json')) return 'error';
      const json: any = await res.json().catch(() => null);
      if (json && (json.objectClassName === 'domain' || json.ldhName)) {
        return 'taken';
      }
      return 'error';
    }

    return 'error';
  } catch {
    return 'error';
  } finally {
    clearTimeout(timer);
  }
}

// ── Parsing ───────────────────────────────────────────────────────────────────

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
  if (parts.length === 1) return { sld: q, tld: null, fullDomain: null };
  if (parts.length === 2) return { sld: parts[0], tld: parts[1], fullDomain: q };

  const tld = parts[parts.length - 1];
  const sld = parts.slice(0, -1).join('.');
  return { sld, tld, fullDomain: q };
}

// Spec alias
export const parseDomainQuery = parseDomainInput;

/** Returns an error message string if invalid, null if valid */
export function validateSLD(sld: string): string | null {
  if (!sld) return 'Please enter a domain name.';
  if (sld.length < 2) return 'Domain name must be at least 2 characters.';
  if (sld.length > 63) return 'Domain name must be 63 characters or less.';
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(sld))
    return 'Domain names can only contain letters, numbers, and hyphens, and cannot start or end with a hyphen.';
  return null;
}

// ── Availability check ────────────────────────────────────────────────────────

export async function checkAllTLDs(
  sld:  string,
  tlds: string[] = ['com', 'co.za', 'net', 'org', 'io', 'dev', 'app']
): Promise<AvailabilityResult[]> {
  const validationError = validateSLD(sld);
  if (validationError) {
    return tlds.map(tld => ({
      domainName:       tld === 'co.za' ? `${sld}.co.za` : `${sld}.${tld}`,
      tld, sld, status: 'error' as const, purchasable: false, isPremium: false,
      privacyAvailable: !NO_PRIVACY_TLDS.includes(tld),
      errorMessage:     validationError,
    }));
  }

  const domainNames = tlds.map(tld =>
    tld === 'co.za' ? `${sld}.co.za` : `${sld}.${tld}`
  );

  // Fetch TLD prices and run all RDAP checks in parallel
  const [priceMap, ...rdapSettled] = await Promise.allSettled([
    getCachedTLDPrices(),
    ...tlds.map((tld, i) => checkViaRDAP(domainNames[i], tld)),
  ]);

  const prices = priceMap.status === 'fulfilled' ? priceMap.value : {};

  return tlds.map((tld, i) => {
    const domainName       = domainNames[i];
    const privacyAvailable = !NO_PRIVACY_TLDS.includes(tld);
    const tldInfo          = prices[tld];

    if (!RDAP_SERVERS[tld]) {
      return {
        domainName, tld, sld, status: 'unsupported' as const,
        purchasable: false, isPremium: false, privacyAvailable,
        errorMessage: `We cannot currently register .${tld} domains.`,
      };
    }

    const rdapResult   = rdapSettled[i];
    const availability = rdapResult.status === 'fulfilled' ? rdapResult.value : 'error';

    if (availability === 'error') {
      return {
        domainName, tld, sld, status: 'error' as const,
        purchasable: false, isPremium: false, privacyAvailable,
        errorMessage: 'Registry unreachable. Try again in a moment.',
      };
    }

    if (availability === 'taken') {
      return {
        domainName, tld, sld, status: 'taken' as const,
        purchasable: false, isPremium: false, privacyAvailable,
      };
    }

    // Available
    const priceUSD   = tldInfo?.purchasePrice ?? 0;
    const renewalUSD = tldInfo?.renewalPrice  ?? 0;
    return {
      domainName, tld, sld,
      status:      'available' as const,
      purchasable: true,
      isPremium:   false,
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
