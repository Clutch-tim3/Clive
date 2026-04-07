export type TLD = 'com' | 'net' | 'org' | 'co.za';

export interface RDAPResult {
  domain:      string;           // e.g. "myapp.com"
  tld:         TLD;
  available:   boolean;
  status:      'available' | 'taken' | 'unsupported' | 'error';
  registrar?:  string;           // if taken: who registered it
  expiresAt?:  string;           // if taken: expiry date (ISO string)
  createdAt?:  string;           // if taken: registration date
  nameservers?: string[];        // if taken: current nameservers
  rawStatus?:  string[];         // EPP status codes
  errorMessage?: string;
}

const RDAP_ENDPOINTS: Record<TLD, string> = {
  'com':   'https://rdap.verisign.com/com/v1/domain',
  'net':   'https://rdap.verisign.com/net/v1/domain',
  'org':   'https://rdap.publicinterestregistry.org/rdap/domain',
  'co.za': 'https://rdap.registry.net.za/domain',
};

export const SUPPORTED_TLDS: TLD[] = ['com', 'net', 'org', 'co.za'];

export function extractTLD(domain: string): TLD | null {
  const lower = domain.toLowerCase().trim();
  if (lower.endsWith('.co.za')) return 'co.za';
  const parts = lower.split('.');
  const tld = parts[parts.length - 1] as TLD;
  if (SUPPORTED_TLDS.includes(tld)) return tld;
  return null;
}

export function getSLD(domain: string, tld: TLD): string {
  // Returns the second-level domain (name without TLD)
  const lower = domain.toLowerCase().trim();
  if (tld === 'co.za') return lower.replace('.co.za', '');
  return lower.replace(`.${tld}`, '');
}

export async function checkRDAP(domain: string): Promise<RDAPResult> {
  const lower = domain.toLowerCase().trim();

  // Validate format
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/.test(lower)) {
    return {
      domain: lower, tld: 'com', available: false,
      status: 'error',
      errorMessage: 'Invalid domain format. Use letters, numbers, and hyphens only.',
    };
  }

  const tld = extractTLD(lower);

  if (!tld) {
    return {
      domain: lower, tld: 'com', available: false,
      status: 'unsupported',
      errorMessage: `We currently support .com, .net, .org, and .co.za only.`,
    };
  }

  const endpoint = RDAP_ENDPOINTS[tld];

  try {
    const res = await fetch(`${endpoint}/${encodeURIComponent(lower)}`, {
      headers: { Accept: 'application/rdap+json' },
      next: { revalidate: 60 }, // cache result for 60s
    });

    if (res.status === 404) {
      // 404 = not found in registry = AVAILABLE
      return { domain: lower, tld, available: true, status: 'available' };
    }

    if (res.status === 200) {
      // 200 = found in registry = TAKEN
      const data = await res.json();

      const registrar = data.entities
        ?.find((e: any) => e.roles?.includes('registrar'))
        ?.vcardArray?.[1]
        ?.find((v: any) => v[0] === 'fn')?.[3]
        || 'Unknown registrar';

      const events = data.events || [];
      const expiresAt = events.find((e: any) => e.eventAction === 'expiration')?.eventDate;
      const createdAt = events.find((e: any) => e.eventAction === 'registration')?.eventDate;

      const nameservers = data.nameservers?.map((ns: any) => ns.ldhName) || [];
      const rawStatus   = data.status || [];

      return {
        domain: lower, tld, available: false, status: 'taken',
        registrar, expiresAt, createdAt, nameservers, rawStatus,
      };
    }

    // Any other status (rate limit, server error)
    return {
      domain: lower, tld, available: false,
      status: 'error',
      errorMessage: `Registry returned status ${res.status}. Try again in a moment.`,
    };
  } catch (err: any) {
    return {
      domain: lower, tld, available: false,
      status: 'error',
      errorMessage: 'Could not reach the domain registry. Check your connection.',
    };
  }
}

// Check a single name across all 4 supported TLDs in parallel
export async function checkAllTLDs(name: string): Promise<RDAPResult[]> {
  // name = just the SLD, e.g. "myapp" (no TLD)
  const queries = SUPPORTED_TLDS.map(tld => {
    const full = tld === 'co.za' ? `${name}.co.za` : `${name}.${tld}`;
    return checkRDAP(full);
  });
  return Promise.all(queries);
}
