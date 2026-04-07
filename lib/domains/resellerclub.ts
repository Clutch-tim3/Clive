const BASE = process.env.RESELLERCLUB_ENV === 'sandbox'
  ? 'https://test.httpapi.com/api'
  : 'https://httpapi.com/api';

const AUTH = {
  'auth-userid': process.env.RESELLERCLUB_RESELLER_ID!,
  'api-key':     process.env.RESELLERCLUB_API_KEY!,
};

function buildParams(extra: Record<string, string | number | boolean>) {
  const params = new URLSearchParams();
  Object.entries({ ...AUTH, ...extra }).forEach(([k, v]) =>
    params.append(k, String(v))
  );
  return params;
}

async function rcFetch(path: string, params: URLSearchParams) {
  const url = `${BASE}${path}?${params.toString()}`;
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ResellerClub API error ${res.status}: ${text}`);
  }
  return res.json();
}

// ── PRICING ──────────────────────────────────────────────────────────
export async function getDomainPricing(tlds: string[] = ['com','net','org','co.za']) {
  // Returns reseller cost prices — you mark these up in your UI
  const params = buildParams({});
  tlds.forEach(tld => params.append('tlds', tld));
  return rcFetch('/products/reseller/details.json', params);
}

// ── AVAILABILITY (ResellerClub version — use as secondary check) ───
export async function checkAvailabilityRC(
  domainNames: string[],
  tlds: string[]
) {
  const params = buildParams({});
  domainNames.forEach(d => params.append('domain-name', d));
  tlds.forEach(t => params.append('tlds', t));
  return rcFetch('/domains/available.json', params);
}

// ── REGISTRATION ──────────────────────────────────────────────────────
export interface RegistrationDetails {
  domainName:       string;   // e.g. "myapp.com"
  years:            number;   // 1–10
  customerId:       string;   // ResellerClub customer ID
  regContactId:     string;   // registrant contact ID
  adminContactId:   string;
  techContactId:    string;
  billingContactId: string;
  nameservers:      string[]; // at least 2, e.g. ["ns1.clive.dev","ns2.clive.dev"]
  purchasePrivacy:  boolean;  // WHOIS privacy protection
  protectPrivacy:   boolean;
}

export async function registerDomain(details: RegistrationDetails) {
  const params = buildParams({
    'domain-name':        details.domainName,
    'years':              details.years,
    'ns':                 details.nameservers.join(','),
    'customer-id':        details.customerId,
    'reg-contact-id':     details.regContactId,
    'admin-contact-id':   details.adminContactId,
    'tech-contact-id':    details.techContactId,
    'billing-contact-id': details.billingContactId,
    'invoice-option':     'NoInvoice',
    'purchase-privacy':   details.purchasePrivacy,
    'protect-privacy':    details.protectPrivacy,
  });
  return rcFetch('/domains/register.json', params);
}

// ── CUSTOMER MANAGEMENT ──────────────────────────────────────────────
export interface CustomerDetails {
  username:    string;  // email address
  passwd:      string;  // temporary password (we generate this)
  name:        string;
  company:     string;
  address:     string;
  city:        string;
  state:       string;
  country:     string;  // "ZA" for South Africa
  zipcode:     string;
  phone:       string;  // "+27.821234567"
  fax?:        string;
  langpref:    string;  // "en"
}

export async function createRCCustomer(details: CustomerDetails) {
  const params = buildParams({
    username:             details.username,
    passwd:               details.passwd,
    name:                 details.name,
    company:              details.company || details.name,
    'address-line-1':     details.address,
    city:                 details.city,
    state:                details.state,
    country:              details.country || 'ZA',
    zipcode:              details.zipcode || '0000',
    'phone-cc':           '27',
    phone:                details.phone,
    'lang-pref':          'en',
    'sales-contact-id':   -1,
    'support-contact-id': -1,
  });
  return rcFetch('/customers/signup.json', params);
}

export async function getRCCustomerByEmail(email: string) {
  const params = buildParams({ username: email });
  return rcFetch('/customers/details.json', params);
}

// ── CONTACT MANAGEMENT ───────────────────────────────────────────────
export interface ContactDetails {
  customerId:    string;
  name:          string;
  company:       string;
  email:         string;
  address:       string;
  city:          string;
  state:         string;
  country:       string;
  zipcode:       string;
  phoneCC:       string;  // "27"
  phone:         string;  // "821234567"
  type:          'Contact';
}

export async function createRCContact(c: ContactDetails) {
  const params = buildParams({
    'customer-id':    c.customerId,
    name:             c.name,
    company:          c.company || c.name,
    email:            c.email,
    'address-line-1': c.address,
    city:             c.city,
    state:            c.state,
    country:          c.country || 'ZA',
    zipcode:          c.zipcode || '0000',
    'phone-cc':       c.phoneCC || '27',
    phone:            c.phone,
    type:             'Contact',
  });
  return rcFetch('/contacts/add.json', params);
}

// ── DOMAIN MANAGEMENT ────────────────────────────────────────────────
export async function getDomainsByCustomer(customerId: string) {
  const params = buildParams({ 'customer-id': customerId });
  return rcFetch('/domains/list.json', params);
}

export async function getDomainDetails(domainId: string) {
  const params = buildParams({ 'domain-id': domainId });
  return rcFetch('/domains/details.json', params);
}

export async function renewDomain(domainId: string, years: number, expiryDate: string) {
  const params = buildParams({
    'domain-id':      domainId,
    years,
    'exp-date':       expiryDate,
    'invoice-option': 'NoInvoice',
  });
  return rcFetch('/domains/renew.json', params);
}

// ── WHOIS PRIVACY ─────────────────────────────────────────────────────
export async function enablePrivacy(domainId: string) {
  const params = buildParams({ 'domain-id': domainId, 'protect-privacy': true });
  return rcFetch('/domains/privacy-protect.json', params);
}
