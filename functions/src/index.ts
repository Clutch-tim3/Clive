import * as admin from 'firebase-admin';
if (!admin.apps.length) admin.initializeApp();

export { onProductSubmit }      from './onProductSubmit';
export { onSubscriptionCreate } from './onSubscriptionCreate';
export { dailyAnalytics }       from './dailyAnalytics';
export { sendEmail }            from './sendEmail';
