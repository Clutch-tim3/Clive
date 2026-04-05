import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

/**
 * When a new active subscription is created, automatically generate
 * a live API key for the subscriber if they don't already have one
 * for this product.
 */
export const onSubscriptionCreate = onDocumentCreated(
  'subscriptions/{subId}',
  async (event) => {
    const sub = event.data?.data();
    if (!sub || sub.status !== 'active') return;

    const db = admin.firestore();

    // Check if user already has an active key for this product
    const existing = await db
      .collection('apiKeys')
      .where('userId',    '==', sub.userId)
      .where('productId', '==', sub.productId)
      .where('isActive',  '==', true)
      .limit(1)
      .get();

    if (!existing.empty) return; // key already exists

    // Generate key
    const prefix   = 'clive_live_sk_';
    const secret   = crypto.randomBytes(24).toString('base64url');
    const fullKey  = prefix + secret;
    const hash     = bcrypt.hashSync(fullKey, 10);
    const lastFour = fullKey.slice(-4);
    const masked   = prefix + '•'.repeat(secret.length - 4) + lastFour;

    const keyRef = db.collection('apiKeys').doc();
    await keyRef.set({
      id:            keyRef.id,
      userId:        sub.userId,
      productId:     sub.productId,
      keyType:       'live',
      keyPrefix:     prefix,
      keyHash:       hash,
      keyMasked:     masked,
      lastFourChars: lastFour,
      isActive:      true,
      createdAt:     admin.firestore.FieldValue.serverTimestamp(),
      note:          'Auto-generated on subscription',
    });
  },
);
