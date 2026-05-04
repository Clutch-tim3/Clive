"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSubscriptionCreate = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
const bcrypt = __importStar(require("bcryptjs"));
/**
 * When a new active subscription is created, automatically generate
 * a live API key for the subscriber if they don't already have one
 * for this product.
 */
exports.onSubscriptionCreate = (0, firestore_1.onDocumentCreated)('subscriptions/{subId}', async (event) => {
    const sub = event.data?.data();
    if (!sub || sub.status !== 'active')
        return;
    const db = admin.firestore();
    // Check if user already has an active key for this product
    const existing = await db
        .collection('apiKeys')
        .where('userId', '==', sub.userId)
        .where('productId', '==', sub.productId)
        .where('isActive', '==', true)
        .limit(1)
        .get();
    if (!existing.empty)
        return; // key already exists
    // Generate key
    const prefix = 'clive_live_sk_';
    const secret = crypto.randomBytes(24).toString('base64url');
    const fullKey = prefix + secret;
    const hash = bcrypt.hashSync(fullKey, 10);
    const lastFour = fullKey.slice(-4);
    const masked = prefix + '•'.repeat(secret.length - 4) + lastFour;
    const keyRef = db.collection('apiKeys').doc();
    await keyRef.set({
        id: keyRef.id,
        userId: sub.userId,
        productId: sub.productId,
        keyType: 'live',
        keyPrefix: prefix,
        keyHash: hash,
        keyMasked: masked,
        lastFourChars: lastFour,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        note: 'Auto-generated on subscription',
    });
});
//# sourceMappingURL=onSubscriptionCreate.js.map