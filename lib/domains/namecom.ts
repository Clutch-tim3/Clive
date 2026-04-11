// ─────────────────────────────────────────────────────────────────────────────
// Name.com v4 API wrapper
// All Name.com calls go through here. Never call fetch() directly from routes.
// ─────────────────────────────────────────────────────────────────────────────

const IS_TEST = process.env.NAMECOM_ENV === 'test' || process.env.NODE_ENV === 'test';

const BASE_URL = IS_TEST
  ? 'https://api.dev.name.com/v4'
  : 'https://api.name.com/v4';

// ── ERROR CLASSES ─────────────────────────────────────────────────────────────

export class NamecomConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NamecomConfigError';
  }
}

export class NamecomError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'NamecomError';
  }
}

// ── CREDENTIALS ───────────────────────────────────────────────────────────────

function getCredentials(): { username: string; token: string } {
  const username = process.env.NAMECOM_USERNAME;
  const token    = process.env.NAMECOM_API_TOKEN;

  if (!username || !token) {
    throw new NamecomConfigError(
      'NAMECOM_USERNAME and NAMECOM_API_TOKEN must be set. ' +
      'Check apphosting.yaml (App Hosting) or .env.local (local dev).'
    );
  }

  return {
    username: IS_TEST ? `${username}-test` : username,
    token,
  };
}

function authHeader(): string {
  const { username, token } = getCredentials();
  return 'Basic ' + Buffer.from(`${username}:${token}`).toString('base64');
}

// ── CORE FETCH ────────────────────────────────────────────────────────────────

async function ncFetch<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: object,
  timeoutMs = 10000
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        Authorization:  authHeader(),
        'Content-Type': 'application/json',
        'Accept':       'application/json',
        'User-Agent':   'Clive-Platform/1.0',
      },
      body:   body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new NamecomError('Name.com API request timed out.', 504, 'TIMEOUT');
    }
    throw new NamecomError(
      `Network error reaching Name.com API: ${err.message}`,
      503, 'NETWORK_ERROR'
    );
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let data: any;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { rawResponse: text }; }

  if (!res.ok) {
    throw new NamecomError(
      data?.message || `Name.com API error ${res.status}`,
      res.status,
      undefined,
      data
    );
  }

  return data as T;
}

// ── TYPES ─────────────────────────────────────────────────────────────────────

export interface NCSearchResult {
  domainName:    string;
  sld:           string;
  tld:           string;
  purchasable:   boolean;
  premium:       boolean;
  purchasePrice: number;
  renewalPrice:  number;
}

export interface NCTld {
  name:          string;
  purchasePrice: number;
  renewalPrice:  number;
  transferPrice: number;
}

export interface NCContact {
  firstName:    string;
  lastName:     string;
  companyName?: string;
  address1:     string;
  city:         string;
  state:        string;
  zip:          string;
  country:      string;
  phone:        string;   // "+27.821234567"
  fax?:         string;
  email:        string;
}

export interface NCContacts {
  registrant: NCContact;
  admin:      NCContact;
  tech:       NCContact;
  billing:    NCContact;
}

export interface NCDomain {
  domainName:        string;
  nameservers:       string[];
  contacts:          NCContacts;
  privacyEnabled:    boolean;
  locked:            boolean;
  autorenewEnabled:  boolean;
  expireDate:        string;
  createDate:        string;
  renewalPrice:      number;
}

export interface NCRegistration {
  domain:    NCDomain;
  order:     number;
  totalPaid: number;
}

// ── AVAILABILITY ──────────────────────────────────────────────────────────────

export async function searchDomains(domainNames: string[]): Promise<NCSearchResult[]> {
  if (domainNames.length === 0) return [];
  const data = await ncFetch<{ results: NCSearchResult[] }>(
    'POST', '/domains:search', { domainNames }
  );
  return data.results || [];
}

// ── TLD PRICING ───────────────────────────────────────────────────────────────

export async function getTLDs(): Promise<NCTld[]> {
  const all: NCTld[] = [];
  let page = 1;
  while (true) {
    const data = await ncFetch<{ tlds: NCTld[]; nextPage?: number }>(
      'GET', `/tlds?page=${page}&perPage=1000`
    );
    const batch = data.tlds || [];
    all.push(...batch);
    if (!data.nextPage || batch.length === 0) break;
    page = data.nextPage;
  }
  return all;
}

// ── REGISTRATION ──────────────────────────────────────────────────────────────

export interface RegisterDomainInput {
  domainName:      string;
  nameservers:     string[];
  contacts:        NCContacts;
  privacyEnabled:  boolean;
  purchasePrice:   number;
  purchaseType:    'registration';
  years?:          number;
}

export async function registerDomain(input: RegisterDomainInput): Promise<NCRegistration> {
  return ncFetch<NCRegistration>('POST', '/domains', {
    domain: {
      domainName:       input.domainName,
      nameservers:      input.nameservers,
      contacts:         input.contacts,
      privacyEnabled:   input.privacyEnabled,
      autorenewEnabled: true,
    },
    purchasePrice: input.purchasePrice,
    purchaseType:  'registration',
    years:         input.years || 1,
  });
}

// ── DOMAIN MANAGEMENT ─────────────────────────────────────────────────────────

export async function listDomains(page = 1, perPage = 1000): Promise<NCDomain[]> {
  const data = await ncFetch<{ domains: NCDomain[]; nextPage: number }>(
    'GET', `/domains?page=${page}&perPage=${perPage}`
  );
  return data.domains || [];
}

export async function getDomain(domainName: string): Promise<NCDomain> {
  return ncFetch<NCDomain>('GET', `/domains/${encodeURIComponent(domainName)}`);
}

export async function renewDomain(
  domainName: string,
  purchasePrice: number,
  years = 1
): Promise<{ order: number; totalPaid: number }> {
  return ncFetch('POST', `/domains/${encodeURIComponent(domainName)}:renew`, { purchasePrice, years });
}

export async function updateDomain(
  domainName: string,
  updates: Partial<{
    nameservers:      string[];
    contacts:         NCContacts;
    privacyEnabled:   boolean;
    autorenewEnabled: boolean;
  }>
): Promise<NCDomain> {
  return ncFetch<NCDomain>('PUT', `/domains/${encodeURIComponent(domainName)}`, updates);
}

export async function lockDomain(domainName: string): Promise<void> {
  await ncFetch('POST', `/domains/${encodeURIComponent(domainName)}:lock`, {});
}

export async function unlockDomain(domainName: string): Promise<void> {
  await ncFetch('POST', `/domains/${encodeURIComponent(domainName)}:unlock`, {});
}

// ── CONTACT BUILDER ───────────────────────────────────────────────────────────

/** Build a single NCContact from Clive form data (positional args) */
export function buildContact(
  firstName: string,
  lastName:  string,
  email:     string,
  phone:     string,
  address:   string,
  city:      string,
  state:     string,
  zip:       string,
  country = 'ZA',
  company?:  string,
): NCContact {
  const cc = country === 'ZA' ? '27' : '1';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return {
    firstName,
    lastName,
    ...(company ? { companyName: company } : {}),
    address1: address,
    city,
    state,
    zip:      zip || '0000',
    country,
    phone:    `+${cc}.${cleanPhone}`,
    email,
  };
}

/** Build identical contacts for all 4 roles using object params */
export function buildAllContacts(params: {
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  address:   string;
  city:      string;
  state:     string;
  zip?:      string;
  country?:  string;
  company?:  string;
}): NCContacts {
  const contact = buildContact(
    params.firstName,
    params.lastName,
    params.email,
    params.phone,
    params.address,
    params.city,
    params.state,
    params.zip ?? '0000',
    params.country ?? 'ZA',
    params.company,
  );
  return { registrant: contact, admin: contact, tech: contact, billing: contact };
}

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────

/** Verify Name.com API credentials are working */
export async function verifyNamecomCredentials(): Promise<boolean> {
  try {
    await ncFetch('GET', '/domains?perPage=1');
    return true;
  } catch (err) {
    if (err instanceof NamecomConfigError) throw err;
    return false;
  }
}
