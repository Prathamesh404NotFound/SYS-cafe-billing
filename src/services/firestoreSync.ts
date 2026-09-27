import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { firestore } from './firebase';
import { Bill, KitchenOrder } from '../types';
import {
  getPendingSyncQueue,
  markQueueItemSyncing,
  markQueueItemSynced,
  markQueueItemFailed,
  cacheOrderInIndexedDB
} from './indexedDbService';

// Firestore collection names
export const FIRESTORE_COLLECTIONS = {
  ORDERS: 'orders',
  BILLS: 'bills',
  KITCHEN_ORDERS: 'kitchen_orders',
  AUDIT_LOGS: 'sync_logs'
} as const;

/**
 * Remove undefined values so Firestore doesn't throw exceptions
 */
function sanitizeForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);

  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      clean[key] = sanitizeForFirestore(val);
    }
  }
  return clean;
}

/**
 * Sync a single completed bill/order directly to Firestore
 */
export async function syncBillToFirestore(bill: Bill): Promise<boolean> {
  try {
    const docRef = doc(firestore, FIRESTORE_COLLECTIONS.ORDERS, bill.id);
    const sanitized = sanitizeForFirestore({
      ...bill,
      firestoreSyncedAt: new Date().toISOString(),
      updatedAtServer: serverTimestamp()
    });

    await setDoc(docRef, sanitized, { merge: true });

    // Also mirror to 'bills' collection for reporting queries
    const billDocRef = doc(firestore, FIRESTORE_COLLECTIONS.BILLS, bill.id);
    await setDoc(billDocRef, sanitized, { merge: true });

    // Update in local IndexedDB as synced
    await cacheOrderInIndexedDB(bill, 'synced');
    return true;
  } catch (error: any) {
    console.warn(`Firestore sync for bill ${bill.id} failed:`, error?.message || error);
    return false;
  }
}

/**
 * Sync a kitchen order / KOT ticket directly to Firestore
 */
export async function syncKitchenOrderToFirestore(order: KitchenOrder): Promise<boolean> {
  try {
    const docRef = doc(firestore, FIRESTORE_COLLECTIONS.KITCHEN_ORDERS, order.id);
    const sanitized = sanitizeForFirestore({
      ...order,
      firestoreSyncedAt: new Date().toISOString(),
      updatedAtServer: serverTimestamp()
    });

    await setDoc(docRef, sanitized, { merge: true });
    return true;
  } catch (error: any) {
    console.warn(`Firestore sync for KOT ${order.id} failed:`, error?.message || error);
    return false;
  }
}

/**
 * Process all queued offline orders from IndexedDB and sync to Firestore
 */
export async function processPendingFirestoreSyncQueue(): Promise<{
  total: number;
  succeeded: number;
  failed: number;
  syncedBillNumbers: string[];
}> {
  const pendingItems = await getPendingSyncQueue();
  if (pendingItems.length === 0) {
    return { total: 0, succeeded: 0, failed: 0, syncedBillNumbers: [] };
  }

  let succeeded = 0;
  let failed = 0;
  const syncedBillNumbers: string[] = [];

  for (const item of pendingItems) {
    await markQueueItemSyncing(item.id);
    try {
      if (item.type === 'bill') {
        const bill = item.payload as Bill;
        const docRef = doc(firestore, FIRESTORE_COLLECTIONS.ORDERS, bill.id);
        const sanitized = sanitizeForFirestore({
          ...bill,
          syncedFromOfflineQueue: true,
          offlineQueuedAt: new Date(item.timestamp).toISOString(),
          firestoreSyncedAt: new Date().toISOString(),
          updatedAtServer: serverTimestamp()
        });

        await setDoc(docRef, sanitized, { merge: true });

        // Also update bills collection
        const billDocRef = doc(firestore, FIRESTORE_COLLECTIONS.BILLS, bill.id);
        await setDoc(billDocRef, sanitized, { merge: true });

        await markQueueItemSynced(item.id);
        succeeded++;
        if (bill.billNumber) syncedBillNumbers.push(bill.billNumber);
      } else if (item.type === 'kitchen_order') {
        const order = item.payload as KitchenOrder;
        const docRef = doc(firestore, FIRESTORE_COLLECTIONS.KITCHEN_ORDERS, order.id);
        const sanitized = sanitizeForFirestore({
          ...order,
          syncedFromOfflineQueue: true,
          offlineQueuedAt: new Date(item.timestamp).toISOString(),
          firestoreSyncedAt: new Date().toISOString(),
          updatedAtServer: serverTimestamp()
        });

        await setDoc(docRef, sanitized, { merge: true });
        await markQueueItemSynced(item.id);
        succeeded++;
      }
    } catch (err: any) {
      console.error(`Failed to sync queued item ${item.id} to Firestore:`, err);
      await markQueueItemFailed(item.id, err?.message || 'Network sync error');
      failed++;
    }
  }

  return {
    total: pendingItems.length,
    succeeded,
    failed,
    syncedBillNumbers
  };
}

/**
 * Fetch latest synced orders from Firestore
 */
export async function fetchRecentFirestoreOrders(limitCount = 20): Promise<Bill[]> {
  try {
    const q = query(
      collection(firestore, FIRESTORE_COLLECTIONS.ORDERS),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    const orders: Bill[] = [];
    snap.forEach(docSnap => {
      orders.push(docSnap.data() as Bill);
    });
    return orders;
  } catch (err) {
    console.warn('Could not fetch orders from Firestore:', err);
    return [];
  }
}
