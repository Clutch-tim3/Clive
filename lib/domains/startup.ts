import { verifyNamecomCredentials, NamecomConfigError } from './namecom';

let verified = false;

export async function verifyDomainServiceOnStartup(): Promise<void> {
  if (verified) return;
  try {
    const ok = await verifyNamecomCredentials();
    if (ok) {
      console.log('[DomainService] Name.com credentials verified ✓');
      verified = true;
    } else {
      console.warn('[DomainService] Name.com API unreachable — domain service degraded');
    }
  } catch (err) {
    if (err instanceof NamecomConfigError) {
      console.error('[DomainService] CONFIGURATION ERROR:', err.message);
      console.error('[DomainService] Set NAMECOM_USERNAME and NAMECOM_API_TOKEN in:');
      console.error('[DomainService]   → apphosting.yaml (Firebase App Hosting)');
      console.error('[DomainService]   → .env.local (local development)');
    } else {
      console.error('[DomainService] Startup verification failed:', err);
    }
  }
}
