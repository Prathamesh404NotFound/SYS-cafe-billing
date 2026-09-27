import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getDatabase,
  ref,
  onValue,
  set,
  get,
  update,
  push,
  off,
  DatabaseReference
} from "firebase/database";
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";

// Web app's Firebase configuration (supports .env via import.meta.env)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDGeIyIxQ-Au77JOTHUj_boaAWBsidhYFc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sys-cafe.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://sys-cafe-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sys-cafe",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sys-cafe.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "259469191590",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:259469191590:web:821ec6a6db8ec053d38767",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ER7XWQWCTN"
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Realtime Database
export const rtdb = getDatabase(app);

// Initialize Firebase Firestore
export const firestore: Firestore = getFirestore(app);

// Initialize Analytics safely
export let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported()
    .then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // analytics unsupported or blocked
    });
}

// RTDB Master Node Paths
export const RTDB_PATHS = {
  CATEGORIES: "cafe/categories",
  MENU_ITEMS: "cafe/menuItems",
  BILLS: "cafe/bills",
  TABLES: "cafe/tables",
  KITCHEN_ORDERS: "cafe/kitchenOrders",
  CUSTOMERS: "cafe/customers",
  UDHAAR: "cafe/udhaarTransactions",
  PURCHASES: "cafe/purchases",
  SUPPLIERS: "cafe/suppliers",
  EXPENSES: "cafe/expenses",
  CASH_REGISTER: "cafe/cashRegister",
  STAFF: "cafe/staff",
  BUSINESS_PROFILE: "cafe/businessProfile",
  CUSTOMER_CALLS: "cafe/customerCalls"
} as const;

export type RtdbPathKey = keyof typeof RTDB_PATHS;

/**
 * Listen to Firebase connection state (.info/connected)
 */
export function subscribeConnectionStatus(callback: (connected: boolean) => void): () => void {
  const connectedRef = ref(rtdb, ".info/connected");
  const unsubscribe = onValue(
    connectedRef,
    snapshot => {
      const isConnected = !!snapshot.val();
      callback(isConnected);
    },
    error => {
      console.warn("RTDB Connection status check failed:", error);
      callback(false);
    }
  );
  return () => off(connectedRef, "value", unsubscribe);
}

/**
 * Write/Update data at a specific RTDB path
 */
export async function writeToRtdb<T>(path: string, data: T): Promise<boolean> {
  try {
    const nodeRef = ref(rtdb, path);
    // Remove undefined values to avoid RTDB error
    const sanitized = JSON.parse(JSON.stringify(data));
    await set(nodeRef, sanitized);
    return true;
  } catch (error) {
    console.error(`Failed to write to RTDB path "${path}":`, error);
    return false;
  }
}

/**
 * Read data once from an RTDB path
 */
export async function readFromRtdb<T>(path: string): Promise<T | null> {
  try {
    const nodeRef = ref(rtdb, path);
    const snapshot = await get(nodeRef);
    if (snapshot.exists()) {
      return snapshot.val() as T;
    }
    return null;
  } catch (error) {
    console.error(`Failed to read from RTDB path "${path}":`, error);
    return null;
  }
}

/**
 * Subscribe in real time to an RTDB path
 */
export function subscribeRtdb<T>(
  path: string,
  onData: (data: T | null) => void,
  onError?: (err: Error) => void
): () => void {
  const nodeRef = ref(rtdb, path);
  const handler = onValue(
    nodeRef,
    snapshot => {
      if (snapshot.exists()) {
        onData(snapshot.val() as T);
      } else {
        onData(null);
      }
    },
    err => {
      console.warn(`RTDB subscription error on "${path}":`, err);
      if (onError) onError(err);
    }
  );
  return () => off(nodeRef, "value", handler);
}

/**
 * Push a new item to a list in RTDB (e.g. customer waiter call, customer message)
 */
export async function pushToRtdb<T>(path: string, item: T): Promise<string | null> {
  try {
    const listRef = ref(rtdb, path);
    const newItemRef = push(listRef);
    const sanitized = JSON.parse(JSON.stringify(item));
    await set(newItemRef, sanitized);
    return newItemRef.key;
  } catch (error) {
    console.error(`Failed to push to RTDB path "${path}":`, error);
    return null;
  }
}
