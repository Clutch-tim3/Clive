import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export function generateApiKey(type: 'live' | 'test'): {
  fullKey: string;
  prefix: string;
  hash: string;
  masked: string;
  lastFour: string;
} {
  const prefix   = type === 'live' ? 'clive_live_sk_' : 'clive_test_sk_';
  const secret   = crypto.randomBytes(24).toString('base64url'); // URL-safe, ~32 chars
  const fullKey  = prefix + secret;
  const hash     = bcrypt.hashSync(fullKey, 10);
  const lastFour = fullKey.slice(-4);
  const masked   = prefix + '•'.repeat(Math.max(secret.length - 4, 4)) + lastFour;
  return { fullKey, prefix, hash, masked, lastFour };
}

export async function verifyApiKey(
  submittedKey: string,
  storedHash: string,
): Promise<boolean> {
  return bcrypt.compare(submittedKey, storedHash);
}
