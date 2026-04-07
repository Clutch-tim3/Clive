// ─────────────────────────────────────────────────────────────────────────────
// Name.com v4 API wrapper
// All Name.com calls go through here. Never call fetch() directly from routes.
// ─────────────────────────────────────────────────────────────────────────────

const ENV      = process.env.NAMECOM_ENV === 'test' ? 'test' : 'production';
const BASE_URL = ENV === 'test'
  ? 'https://api.dev.name.com/v4'
  : 'https://api.name.com/v4';

// Test env uses username + "-test"
const USERNAME = ENV === 'test'
  ? `${process.env.NAMECOM_USERNAME}-test`
  : process.env.NAMECOM_USERNAME!;

const TOKEN = process.env.NAMECOM_API_TOKEN!;

function authHeader(): string {
  return 'Basic ' + Buffer.from(`${USERNAME}:${TOKEN}`).toString('base64');
}

async function ncFetch<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: object
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization:  authHeader(),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: any;
  try { data = JSON.parse(text); } catch { data = { rawResponse: text }; }

  if (!res.ok) {
    throw new NamecomError(
      data?.message || `Name.com API error ${res.status}`,
      res.status,
      data
    );
  }
  return data as T;
}

export class NamecomError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'NamecomError';
  }
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

export interface NCRegistration {
  domain:     NCDomain;
  order:      number;
  totalPaid:  number;
}

// ── AVAILABILITY ──────────────────────────────────────────────────────────────

export async function searchDomains(domainNames: string[]): Promise<NCSearchResult[]> {
  const qs = domainNames.map(d => `domainNames=${encodeURIComponent(d)}`).join('&');
  const data = await ncFetch<{ results: NCSearchResult[] }>('GET', `/domains:search?${qs}`);
  return data.results || [];
}

// ── TLD PRICING ───────────────────────────────────────────────────────────────

export async function getTLDs(): Promise<NCTld[]> {
  const data = await ncFetch<{ tlds: NCTld[] }>('GET', '/tlds');
  return data.tlds || [];
}

// ── REGISTRATION ──────────────────────────────────────────────────────────────

export interface RegisterDomainInput {
  domainName:       string;
  nameservers:      string[];
  contacts:         NCContacts;
  privacyEnabled:   boolean;
  purchasePrice:    number;
  purchaseType:     'registration';
  years?:           number;
  tldRequirements?: Record<string, string>;
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
    ...(input.tldRequirements && { tldRequirements: input.tldRequirements }),
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
  return ncFetch<NCDomain>('GET', `/domains/${domainName}`);
}

export async function renewDomain(
  domainName: string,
  purchasePrice: number,
  years = 1
): Promise<{ order: number; totalPaid: number }> {
  return ncFetch('POST', `/domains/${domainName}:renew`, { purchasePrice, years });
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
  return ncFetch<NCDomain>('PUT', `/domains/${domainName}`, updates);
}

export async function lockDomain(domainName: string): Promise<void> {
  await ncFetch('POST', `/domains/${domainName}:lock`, {});
}

export async function unlockDomain(domainName: string): Promise<void> {
  await ncFetch('POST', `/domains/${domainName}:unlock`, {});
}

// ── HELPER — build NC contact from Clive user data ────────────────────────────

export function buildContact(
  firstName: string,
  lastName:  string,
  email:     string,
  phone:     string,   // raw digits: "821234567"
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
    companyName: company,
    address1:    address,
    city,
    state,
    zip:         zip || '0000',
    country,
    phone:       `+${cc}.${cleanPhone}`,
    email,
  };
}
