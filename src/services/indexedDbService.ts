import { Bill, KitchenOrder, MenuItem, Category } from '../types';

export interface CachedOrder extends Bill {
  syncStatus?: 'pending' | 'syncing' | 'synced' | 'failed';
  cachedAt?: number;
  syncedAt?: number;
  syncError?: string;
}

export interface SyncQueueItem {
  id: string; // bill id or order id
  type: 'bill' | 'kitchen_order';
  payload: any;
  timestamp: number;
  status: 'pending' | 'syncing' | 'failed' | 'synced';
  retryCount: number;
  lastAttempt?: number;
  error?: string;
}

const DB_NAME = 'sys_cafe_pos_db';
const DB_VERSION = 1;

const STORES = {
  ORDERS: 'pos_orders',
  SYNC_QUEUE: 'pos_sync_queue',
  KITCHEN_ORDERS: 'pos_kitchen_orders',
  MENU_CACHE: 'pos_menu_cache'
} as const;

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Open or initialize the IndexedDB database
 */
export function getIndexedDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB is not supported in this environment'));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Orders Store
        if (!db.objectStoreNames.contains(STORES.ORDERS)) {
          const orderStore = db.createObjectStore(STORES.ORDERS, { keyPath: 'id' });
          orderStore.createIndex('billNumber', 'billNumber', { unique: false });
          orderStore.createIndex('createdAt', 'createdAt', { unique: false });
          orderStore.createIndex('syncStatus', 'syncStatus', { unique: false });
          orderStore.createIndex('cachedAt', 'cachedAt', { unique: false });
        }

        // 2. Sync Queue Store
        if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
          const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id' });
          syncStore.createIndex('status', 'status', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('type', 'type', { unique: false });
        }

        // 3. Kitchen Orders Store
        if (!db.objectStoreNames.contains(STORES.KITCHEN_ORDERS)) {
          const kitchenStore = db.createObjectStore(STORES.KITCHEN_ORDERS, { keyPath: 'id' });
          kitchenStore.createIndex('status', 'status', { unique: false });
          kitchenStore.createIndex('tableNumber', 'tableNumber', { unique: false });
        }

        // 4. Menu Cache Store
        if (!db.objectStoreNames.contains(STORES.MENU_CACHE)) {
          db.createObjectStore(STORES.MENU_CACHE, { keyPath: 'id' });
        }
      };

      request.onsuccess = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onerror = event => {
        console.error('Failed to open IndexedDB:', (event.target as IDBOpenDBRequest).error);
        dbPromise = null;
        reject((event.target as IDBOpenDBRequest).error);
      };

      request.onblocked = () => {
        console.warn('IndexedDB database upgrade blocked. Close other tabs.');
      };
    } catch (err) {
      dbPromise = null;
      reject(err);
    }
  });

  return dbPromise;
}

/**
 * Cache an order in IndexedDB
 */
export async function cacheOrderInIndexedDB(
  bill: Bill,
  syncStatus: 'pending' | 'syncing' | 'synced' | 'failed' = 'pending'
): Promise<void> {
  try {
    const db = await getIndexedDB();
    const tx = db.transaction([STORES.ORDERS], 'readwrite');
    const store = tx.objectStore(STORES.ORDERS);

    const record: CachedOrder = {
      ...bill,
      syncStatus,
      cachedAt: Date.now(),
      syncedAt: syncStatus === 'synced' ? Date.now() : undefined
    };

    store.put(record);

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Error caching order in IndexedDB:', err);
  }
}

/**
 * Get all cached orders from IndexedDB
 */
export async function getCachedOrdersFromIndexedDB(): Promise<CachedOrder[]> {
  try {
    const db = await getIndexedDB();
    const tx = db.transaction([STORES.ORDERS], 'readonly');
    const store = tx.objectStore(STORES.ORDERS);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const orders = (request.result || []) as CachedOrder[];
        // Sort newest first
        orders.sort((a, b) => (b.cachedAt || 0) - (a.cachedAt || 0));
        resolve(orders);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Error getting cached orders from IndexedDB:', err);
    return [];
  }
}

/**
 * Queue an item for automatic Firestore synchronization
 */
export async function enqueueOrderForSync(
  id: string,
  type: 'bill' | 'kitchen_order',
  payload: any
): Promise<void> {
  try {
    const db = await getIndexedDB();
    const tx = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
    const store = tx.objectStore(STORES.SYNC_QUEUE);

    const queueItem: SyncQueueItem = {
      id,
      type,
      payload,
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0
    };

    store.put(queueItem);

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Error enqueueing order for sync:', err);
  }
}

/**
 * Retrieve all pending or failed items in the sync queue
 */
export async function getPendingSyncQueue(): Promise<SyncQueueItem[]> {
  try {
    const db = await getIndexedDB();
    const tx = db.transaction([STORES.SYNC_QUEUE], 'readonly');
    const store = tx.objectStore(STORES.SYNC_QUEUE);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const items = (request.result || []) as SyncQueueItem[];
        // Filter for items needing sync
        const pending = items.filter(i => i.status === 'pending' || i.status === 'failed' || i.status === 'syncing');
        pending.sort((a, b) => a.timestamp - b.timestamp);
        resolve(pending);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Error fetching pending sync queue:', err);
    return [];
  }
}

/**
 * Get count of pending sync items
 */
export async function getPendingSyncCount(): Promise<number> {
  const queue = await getPendingSyncQueue();
  return queue.length;
}

/**
 * Mark a queue item as syncing
 */
export async function markQueueItemSyncing(id: string): Promise<void> {
  try {
    const db = await getIndexedDB();
    const tx = db.transaction([STORES.SYNC_QUEUE], 'readwrite');
    const store = tx.objectStore(STORES.SYNC_QUEUE);
    const request = store.get(id);

    request.onsuccess = () => {
      const item = request.result as SyncQueueItem | undefined;
      if (item) {
        item.status = 'syncing';
        item.lastAttempt = Date.now();
        store.put(item);
      }
    };
  } catch (err) {
    console.error('Error updating queue item status to syncing:', err);
  }
}

/**
 * Mark a queue item as successfully synced and update order record
 */
export async function markQueueItemSynced(id: string): Promise<void> {
  try {
    const db = await getIndexedDB();
    const tx = db.transaction([STORES.SYNC_QUEUE, STORES.ORDERS], 'readwrite');
    const queueStore = tx.objectStore(STORES.SYNC_QUEUE);
    const ordersStore = tx.objectStore(STORES.ORDERS);

    // Remove from queue or mark synced
    queueStore.delete(id);

    // Update order status if present
    const orderReq = ordersStore.get(id);
    orderReq.onsuccess = () => {
      const order = orderReq.result as CachedOrder | undefined;
      if (order) {
        order.syncStatus = 'synced';
        order.syncedAt = Date.now();
        delete order.syncError;
        ordersStore.put(order);
      }
    };

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Error marking queue item synced:', err);
  }
}

/**
 * Mark a queue item as failed with error details
 */
export async function markQueueItemFailed(id: string, errorMessage: string): Promise<void> {
  try {
    const db = await getIndexedDB();
    const tx = db.transaction([STORES.SYNC_QUEUE, STORES.ORDERS], 'readwrite');
    const queueStore = tx.objectStore(STORES.SYNC_QUEUE);
    const ordersStore = tx.objectStore(STORES.ORDERS);

    const queueReq = queueStore.get(id);
    queueReq.onsuccess = () => {
      const item = queueReq.result as SyncQueueItem | undefined;
      if (item) {
        item.status = 'failed';
        item.retryCount = (item.retryCount || 0) + 1;
        item.error = errorMessage;
        item.lastAttempt = Date.now();
        queueStore.put(item);
      }
    };

    const orderReq = ordersStore.get(id);
    orderReq.onsuccess = () => {
      const order = orderReq.result as CachedOrder | undefined;
      if (order) {
        order.syncStatus = 'failed';
        order.syncError = errorMessage;
        ordersStore.put(order);
      }
    };
  } catch (err) {
    console.error('Error marking queue item failed:', err);
  }
}

/**
 * Cache Menu and Categories in IndexedDB for 100% offline POS operation
 */
export async function cacheMenuInIndexedDB(categories: Category[], menuItems: MenuItem[]): Promise<void> {
  try {
    const db = await getIndexedDB();
    const tx = db.transaction([STORES.MENU_CACHE], 'readwrite');
    const store = tx.objectStore(STORES.MENU_CACHE);

    store.put({ id: 'categories', data: categories, updatedAt: Date.now() });
    store.put({ id: 'menuItems', data: menuItems, updatedAt: Date.now() });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Error caching menu in IndexedDB:', err);
  }
}

/**
 * Retrieve cached Menu and Categories from IndexedDB
 */
export async function getCachedMenuFromIndexedDB(): Promise<{
  categories: Category[];
  menuItems: MenuItem[];
} | null> {
  try {
    const db = await getIndexedDB();
    const tx = db.transaction([STORES.MENU_CACHE], 'readonly');
    const store = tx.objectStore(STORES.MENU_CACHE);

    const catReq = store.get('categories');
    const itemsReq = store.get('menuItems');

    return new Promise(resolve => {
      tx.oncomplete = () => {
        if (catReq.result && itemsReq.result) {
          resolve({
            categories: catReq.result.data || [],
            menuItems: itemsReq.result.data || []
          });
        } else {
          resolve(null);
        }
      };
      tx.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}
