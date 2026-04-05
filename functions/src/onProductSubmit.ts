import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

/**
 * Triggered whenever a product document is written.
 * When status changes to 'review', notify admins.
 */
export const onProductSubmit = onDocumentWritten(
  'products/{productId}',
  async (event) => {
    const after  = event.data?.after?.data();
    const before = event.data?.before?.data();
    if (!after) return; // deletion

    // Only act when status transitions to 'review'
    if (before?.status === after.status) return;
    if (after.status !== 'review') return;

    await admin.firestore().collection('adminNotifications').add({
      type:          'product_review',
      productId:     event.params.productId,
      productName:   after.name,
      providerId:    after.providerId,
      providerEmail: after.providerEmail,
      createdAt:     admin.firestore.FieldValue.serverTimestamp(),
    });
  },
);
