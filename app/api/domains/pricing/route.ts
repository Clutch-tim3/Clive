import { NextResponse } from 'next/server';

// Static pricing table — update when ResellerClub account is live
// Prices in ZAR cents
export const DOMAIN_PRICING: Record<string, {
  register: number;  // ZAR cents for 1 year
  renew:    number;
  transfer: number;
  privacy:  number;
}> = {
  'com':   { register: 19900, renew: 19900, transfer: 19900, privacy: 9900 },
  'net':   { register: 21900, renew: 21900, transfer: 21900, privacy: 9900 },
  'org':   { register: 22900, renew: 22900, transfer: 22900, privacy: 9900 },
  'co.za': { register: 14900, renew: 14900, transfer: 14900, privacy: 0 },
  // .co.za WHOIS is limited by ZACR policy — privacy protection not applicable
};

export async function GET() {
  return NextResponse.json({ pricing: DOMAIN_PRICING });
}
