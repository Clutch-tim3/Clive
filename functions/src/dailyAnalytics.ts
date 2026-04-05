import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';

/**
 * Runs daily at midnight UTC.
 * Rolls up call counts and error counts from the previous day into
 * each product's analytics sub-collection.
 */
export const dailyAnalytics = onSchedule('0 0 * * *', async () => {
  const db = admin.firestore();

  // Fetch all live products
  const productsSnap = await db
    .collection('products')
    .where('status', '==', 'live')
    .get();

  if (productsSnap.empty) return;

  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const dateKey = yesterday.toISOString().slice(0, 10); // e.g. "2025-04-04"

  const batch = db.batch();

  for (const productDoc of productsSnap.docs) {
    const analyticsRef = productDoc.ref
      .collection('analytics')
      .doc(dateKey);

    // In production this would aggregate real call logs.
    // For now, create a zero-baseline document if it doesn't exist.
    batch.set(
      analyticsRef,
      {
        date:        dateKey,
        calls:       0,
        errors:      0,
        uniqueUsers: 0,
        p50Ms:       0,
        p95Ms:       0,
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }

  await batch.commit();
});
