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
exports.dailyAnalytics = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const admin = __importStar(require("firebase-admin"));
/**
 * Runs daily at midnight UTC.
 * Rolls up call counts and error counts from the previous day into
 * each product's analytics sub-collection.
 */
exports.dailyAnalytics = (0, scheduler_1.onSchedule)('0 0 * * *', async () => {
    const db = admin.firestore();
    // Fetch all live products
    const productsSnap = await db
        .collection('products')
        .where('status', '==', 'live')
        .get();
    if (productsSnap.empty)
        return;
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
        batch.set(analyticsRef, {
            date: dateKey,
            calls: 0,
            errors: 0,
            uniqueUsers: 0,
            p50Ms: 0,
            p95Ms: 0,
            generatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    }
    await batch.commit();
});
//# sourceMappingURL=dailyAnalytics.js.map