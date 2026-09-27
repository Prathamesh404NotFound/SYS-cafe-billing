import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Language,
  ActiveTab,
  MenuItem,
  Category,
  CartItem,
  Bill,
  Customer,
  UdhaarTransaction,
  Purchase,
  Supplier,
  Expense,
  CashRegister,
  TableItem,
  KitchenOrder,
  StaffMember,
  BusinessProfile,
  OrderType,
  PaymentMethod,
  KitchenStatus,
  CustomerCall
} from '../types';
import {
  initialCategories,
  initialMenuItems,
  initialCustomers,
  initialUdhaarTransactions,
  initialBills,
  initialSuppliers,
  initialPurchases,
  initialExpenses,
  initialCashRegister,
  initialTables,
  initialKitchenOrders,
  initialStaffMembers,
  initialBusinessProfile
} from '../data/initialData';
import { translations, getTranslation } from '../i18n/translations';
import {
  subscribeConnectionStatus,
  subscribeRtdb,
  writeToRtdb,
  RTDB_PATHS
} from '../services/firebase';
import {
  cacheOrderInIndexedDB,
  enqueueOrderForSync,
  getPendingSyncCount,
  cacheMenuInIndexedDB,
  getCachedOrdersFromIndexedDB
} from '../services/indexedDbService';
import {
  syncBillToFirestore,
  syncKitchenOrderToFirestore,
  processPendingFirestoreSyncQueue
} from '../services/firestoreSync';
import {
  registerServiceWorker,
  notifyServiceWorkerNewOrder
} from '../services/serviceWorkerRegistration';

interface NotificationItem {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
}

interface AppContextType {
  // Navigation & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  t: (key: keyof typeof translations.en) => string;
  globalSearch: string;
  setGlobalSearch: (s: string) => void;

  // Firebase Realtime DB Sync
  firebaseConnected: boolean;
  firebaseSyncing: boolean;
  lastSyncTime: Date | null;
  manualSyncToCloud: () => Promise<void>;

  // Offline & Firestore Sync for POS Module
  isOnline: boolean;
  pendingSyncCount: number;
  isFirestoreSyncing: boolean;
  lastFirestoreSyncTime: Date | null;
  syncPendingOrdersToFirestoreNow: () => Promise<{ succeeded: number; failed: number }>;

  // Customer Calls (From Table QR codes)
  customerCalls: CustomerCall[];
  dismissCustomerCall: (id: string) => void;

  // Menu & Categories
  categories: Category[];
  menuItems: MenuItem[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;

  // POS / Cart
  cart: CartItem[];
  orderType: OrderType;
  setOrderType: (t: OrderType) => void;
  tableNumber: string;
  setTableNumber: (tbl: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  discount: number;
  setDiscount: (d: number) => void;
  cartNotes: string;
  setCartNotes: (n: string) => void;
  addToCart: (item: MenuItem, variantId?: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotal: number;

  // Bills & Checkout
  bills: Bill[];
  completeBill: (
    paymentMethod: PaymentMethod,
    cashReceived?: number,
    cashChange?: number,
    notes?: string
  ) => Bill;
  placeTableOrder: (
    tableNumber: string | number,
    itemsToOrder?: CartItem[],
    guestName?: string,
    guestPhone?: string,
    notes?: string
  ) => KitchenOrder;
  settleTableBill: (
    tableNumber: string | number,
    paymentMethod: PaymentMethod,
    billDiscount?: number,
    cashReceived?: number,
    cashChange?: number,
    notes?: string
  ) => Bill;
  refundBill: (billId: string, reason: string) => void;
  activeReceiptBill: Bill | null;
  setActiveReceiptBill: (bill: Bill | null) => void;

  // Udhaar / Customers
  customers: Customer[];
  udhaarTransactions: UdhaarTransaction[];
  collectUdhaarPayment: (customerId: string, amount: number, note?: string) => void;
  addUdhaarCredit: (customerId: string, amount: number, note?: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'udhaarBalance' | 'lastVisit'>) => Customer;
  updateCustomer: (customer: Customer) => void;

  // Inventory & Purchases
  purchases: Purchase[];
  suppliers: Supplier[];
  addStockRefill: (
    supplierId: string,
    itemId: string,
    quantity: number,
    rate: number,
    paymentMethod: string,
    notes?: string
  ) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'totalPurchases' | 'pendingPayment' | 'lastPurchaseDate'>) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (category: any, amount: number, paymentMethod: string, description: string) => void;

  // Cash Register
  cashRegister: CashRegister;
  closeDayRegister: (actualCash: number, notes?: string) => void;
  addCashTransaction: (type: 'in' | 'out', amount: number, note?: string) => void;

  // Tables & Kitchen
  tables: TableItem[];
  setSelectedTable: (tbl: string | number | null) => void;
  addTable: (tableData: { number: number; name: string; capacity?: number; floor?: string }) => { success: boolean; error?: string };
  updateTable: (tableId: string, tableData: Partial<TableItem>) => { success: boolean; error?: string };
  deleteTable: (tableId: string) => { success: boolean; error?: string };
  updateTableStatus: (tableId: string, status: TableItem['status'], customerName?: string, orderTotal?: number) => void;
  kitchenOrders: KitchenOrder[];
  updateKitchenStatus: (orderId: string, status: KitchenStatus) => void;
  updateKitchenOrderStatus: (orderId: string, status: KitchenStatus) => void;

  // Staff
  staff: StaffMember[];
  addStaffMember: (member: Omit<StaffMember, 'id'>) => void;
  addStaff: (member: any) => void;
  updateStaff: (member: any) => void;

  // Settings & Profile
  businessProfile: BusinessProfile;
  updateBusinessProfile: (p: BusinessProfile) => void;

  // Notifications
  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;

  // Reset demo data
  resetAllData: () => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'sys_cafe_data_v2_';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading storage', key, e);
  }
  return fallback;
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving storage', key, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => loadStorage('language', 'en'));
  const [activeTab, setActiveTab] = useState<ActiveTab>('pos');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev);
  const [globalSearch, setGlobalSearch] = useState('');

  // Core records
  const [categories] = useState<Category[]>(initialCategories);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => loadStorage('menu', initialMenuItems));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Cart & POS
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [tableNumber, setTableNumber] = useState<string>('1');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [cartNotes, setCartNotes] = useState<string>('');

  // Business Transactions
  const [bills, setBills] = useState<Bill[]>(() => loadStorage('bills', initialBills));
  const [customers, setCustomers] = useState<Customer[]>(() => loadStorage('customers', initialCustomers));
  const [udhaarTransactions, setUdhaarTransactions] = useState<UdhaarTransaction[]>(() =>
    loadStorage('udhaar', initialUdhaarTransactions)
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const loaded = loadStorage('suppliers', initialSuppliers);
    if (Array.isArray(loaded)) {
      return loaded.filter(s => !['s1', 's2', 's3'].includes(s.id));
    }
    return [];
  });
  const [purchases, setPurchases] = useState<Purchase[]>(() => loadStorage('purchases', initialPurchases));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadStorage('expenses', initialExpenses));
  const [cashRegister, setCashRegister] = useState<CashRegister>(() =>
    loadStorage('cash_reg', initialCashRegister)
  );
  const [tables, setTables] = useState<TableItem[]>(() => loadStorage('tables', initialTables));
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>(() =>
    loadStorage('kitchen', initialKitchenOrders)
  );
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const loaded = loadStorage('staff', initialStaffMembers);
    if (Array.isArray(loaded)) {
      return loaded.filter(s => !['st-1', 'st-2', 'st-3'].includes(s.id));
    }
    return [];
  });
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() =>
    loadStorage('profile', initialBusinessProfile)
  );

  // Active receipt modal
  const [activeReceiptBill, setActiveReceiptBill] = useState<Bill | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Firebase Realtime State
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(false);
  const [firebaseSyncing, setFirebaseSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [customerCalls, setCustomerCalls] = useState<CustomerCall[]>([]);

  // Offline & Firestore Sync for POS Module (Service Worker + IndexedDB)
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isFirestoreSyncing, setIsFirestoreSyncing] = useState<boolean>(false);
  const [lastFirestoreSyncTime, setLastFirestoreSyncTime] = useState<Date | null>(null);

  // Sync pending offline orders from IndexedDB to Firestore
  const syncPendingOrdersToFirestoreNow = async (): Promise<{ succeeded: number; failed: number }> => {
    setIsFirestoreSyncing(true);
    try {
      const res = await processPendingFirestoreSyncQueue();
      const count = await getPendingSyncCount();
      setPendingSyncCount(count);

      if (res.succeeded > 0) {
        setLastFirestoreSyncTime(new Date());
        setNotifications(prev => [
          {
            id: `fs-sync-${Date.now()}`,
            type: 'success',
            title: 'Firestore Sync Complete',
            message: `Successfully synchronized ${res.succeeded} offline order${
              res.succeeded > 1 ? 's' : ''
            } from IndexedDB to Firestore!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          ...prev
        ]);
      }
      return { succeeded: res.succeeded, failed: res.failed };
    } catch (err) {
      console.error('Error syncing offline queue to Firestore:', err);
      return { succeeded: 0, failed: 0 };
    } finally {
      setIsFirestoreSyncing(false);
    }
  };

  // Service worker registration, IndexedDB initialization, and Auto-sync on connection restore
  useEffect(() => {
    // 1. Check initial pending orders count in IndexedDB
    getPendingSyncCount().then(cnt => {
      setPendingSyncCount(cnt);
      if (cnt > 0 && navigator.onLine) {
        syncPendingOrdersToFirestoreNow();
      }
    });

    // 2. Cache initial menu & categories into IndexedDB for offline POS support
    cacheMenuInIndexedDB(categories, menuItems);

    // 3. Register Service Worker with Background Sync listener
    registerServiceWorker({
      onSyncTriggered: source => {
        console.log(`Service Worker triggered sync from: ${source}`);
        if (navigator.onLine) {
          syncPendingOrdersToFirestoreNow();
        }
      }
    });

    // 4. Online and Offline window event listeners for automatic restoration sync
    const handleOnline = () => {
      setIsOnline(true);
      setNotifications(prev => [
        {
          id: `online-${Date.now()}`,
          type: 'info',
          title: 'Internet Restored',
          message: 'Connection is back! Automatically syncing cached IndexedDB orders to Firestore...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
      // Trigger auto-sync to Firestore immediately upon reconnecting!
      syncPendingOrdersToFirestoreNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNotifications(prev => [
        {
          id: `offline-${Date.now()}`,
          type: 'warning',
          title: 'Offline Mode Active',
          message: 'Internet disconnected. POS orders will be saved locally in IndexedDB and automatically synced to Firestore when reconnected.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 5. Periodic check every 30s to sync pending queue if connected
    const heartbeat = setInterval(() => {
      if (navigator.onLine) {
        getPendingSyncCount().then(c => {
          setPendingSyncCount(c);
          if (c > 0) {
            syncPendingOrdersToFirestoreNow();
          }
        });
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(heartbeat);
    };
  }, []);

  // Flags to prevent echo writes between local state and RTDB
  const isRemoteUpdateRef = useRef<Record<string, boolean>>({});

  // 1. Subscribe to Firebase connection state (.info/connected)
  useEffect(() => {
    const unsub = subscribeConnectionStatus(connected => {
      setFirebaseConnected(connected);
    });
    return () => unsub();
  }, []);

  // 2. Subscribe to Firebase RTDB nodes on mount
  useEffect(() => {
    setFirebaseSyncing(true);

    const unsubMenu = subscribeRtdb<MenuItem[]>(RTDB_PATHS.MENU_ITEMS, data => {
      if (data && Array.isArray(data) && data.length > 0) {
        isRemoteUpdateRef.current['menu'] = true;
        setMenuItems(data);
      } else {
        writeToRtdb(RTDB_PATHS.MENU_ITEMS, menuItems);
      }
    });

    const unsubBills = subscribeRtdb<Bill[]>(RTDB_PATHS.BILLS, data => {
      if (data && Array.isArray(data)) {
        isRemoteUpdateRef.current['bills'] = true;
        setBills(data);
      } else {
        writeToRtdb(RTDB_PATHS.BILLS, bills);
      }
    });

    const unsubTables = subscribeRtdb<TableItem[]>(RTDB_PATHS.TABLES, data => {
      if (data && Array.isArray(data) && data.length > 0) {
        isRemoteUpdateRef.current['tables'] = true;
        setTables(data);
      } else {
        writeToRtdb(RTDB_PATHS.TABLES, tables);
      }
    });

    const unsubKitchen = subscribeRtdb<KitchenOrder[]>(RTDB_PATHS.KITCHEN_ORDERS, data => {
      if (data && Array.isArray(data)) {
        isRemoteUpdateRef.current['kitchen'] = true;
        setKitchenOrders(data);
      } else {
        writeToRtdb(RTDB_PATHS.KITCHEN_ORDERS, kitchenOrders);
      }
    });

    const unsubCustomers = subscribeRtdb<Customer[]>(RTDB_PATHS.CUSTOMERS, data => {
      if (data && Array.isArray(data)) {
        isRemoteUpdateRef.current['customers'] = true;
        setCustomers(data);
      } else {
        writeToRtdb(RTDB_PATHS.CUSTOMERS, customers);
      }
    });

    const unsubUdhaar = subscribeRtdb<UdhaarTransaction[]>(RTDB_PATHS.UDHAAR, data => {
      if (data && Array.isArray(data)) {
        isRemoteUpdateRef.current['udhaar'] = true;
        setUdhaarTransactions(data);
      } else {
        writeToRtdb(RTDB_PATHS.UDHAAR, udhaarTransactions);
      }
    });

    const unsubSuppliers = subscribeRtdb<Supplier[]>(RTDB_PATHS.SUPPLIERS, data => {
      if (data && Array.isArray(data)) {
        isRemoteUpdateRef.current['suppliers'] = true;
        setSuppliers(data);
      } else {
        writeToRtdb(RTDB_PATHS.SUPPLIERS, suppliers);
      }
    });

    const unsubPurchases = subscribeRtdb<Purchase[]>(RTDB_PATHS.PURCHASES, data => {
      if (data && Array.isArray(data)) {
        isRemoteUpdateRef.current['purchases'] = true;
        setPurchases(data);
      } else {
        writeToRtdb(RTDB_PATHS.PURCHASES, purchases);
      }
    });

    const unsubExpenses = subscribeRtdb<Expense[]>(RTDB_PATHS.EXPENSES, data => {
      if (data && Array.isArray(data)) {
        isRemoteUpdateRef.current['expenses'] = true;
        setExpenses(data);
      } else {
        writeToRtdb(RTDB_PATHS.EXPENSES, expenses);
      }
    });

    const unsubCash = subscribeRtdb<CashRegister>(RTDB_PATHS.CASH_REGISTER, data => {
      if (data && typeof data === 'object') {
        isRemoteUpdateRef.current['cash'] = true;
        setCashRegister(data);
      } else {
        writeToRtdb(RTDB_PATHS.CASH_REGISTER, cashRegister);
      }
    });

    const unsubStaff = subscribeRtdb<StaffMember[]>(RTDB_PATHS.STAFF, data => {
      if (data && Array.isArray(data)) {
        isRemoteUpdateRef.current['staff'] = true;
        setStaff(data);
      } else {
        writeToRtdb(RTDB_PATHS.STAFF, staff);
      }
    });

    const unsubProfile = subscribeRtdb<BusinessProfile>(RTDB_PATHS.BUSINESS_PROFILE, data => {
      if (data && typeof data === 'object') {
        isRemoteUpdateRef.current['profile'] = true;
        setBusinessProfile(data);
      } else {
        writeToRtdb(RTDB_PATHS.BUSINESS_PROFILE, businessProfile);
      }
    });

    // Customer calls subscription (from Table QR stands)
    const unsubCalls = subscribeRtdb<Record<string, CustomerCall>>(RTDB_PATHS.CUSTOMER_CALLS, val => {
      if (val && typeof val === 'object') {
        const callsArray = Object.values(val).filter(c => c && c.status === 'pending');
        setCustomerCalls(callsArray);

        // Add notification for any new pending call
        callsArray.forEach(call => {
          setNotifications(prev => {
            if (prev.some(n => n.id === call.id)) return prev;
            return [
              {
                id: call.id,
                type: 'warning',
                title: `Table ${call.tableNumber} Request`,
                message: call.message,
                timestamp: call.timestamp
              },
              ...prev
            ];
          });
        });
      }
    });

    setFirebaseSyncing(false);
    setLastSyncTime(new Date());

    return () => {
      unsubMenu();
      unsubBills();
      unsubTables();
      unsubKitchen();
      unsubCustomers();
      unsubUdhaar();
      unsubSuppliers();
      unsubPurchases();
      unsubExpenses();
      unsubCash();
      unsubStaff();
      unsubProfile();
      unsubCalls();
    };
  }, []);

  // 3. Sync local changes to localStorage AND Firebase Realtime Database
  useEffect(() => saveStorage('language', language), [language]);

  useEffect(() => {
    saveStorage('menu', menuItems);
    if (!isRemoteUpdateRef.current['menu']) {
      writeToRtdb(RTDB_PATHS.MENU_ITEMS, menuItems);
      setLastSyncTime(new Date());
    }
    isRemoteUpdateRef.current['menu'] = false;
  }, [menuItems]);

  useEffect(() => {
    saveStorage('bills', bills);
    if (!isRemoteUpdateRef.current['bills']) {
      writeToRtdb(RTDB_PATHS.BILLS, bills);
      setLastSyncTime(new Date());
    }
    isRemoteUpdateRef.current['bills'] = false;
  }, [bills]);

  useEffect(() => {
    saveStorage('customers', customers);
    if (!isRemoteUpdateRef.current['customers']) {
      writeToRtdb(RTDB_PATHS.CUSTOMERS, customers);
      setLastSyncTime(new Date());
    }
    isRemoteUpdateRef.current['customers'] = false;
  }, [customers]);

  useEffect(() => {
    saveStorage('udhaar', udhaarTransactions);
    if (!isRemoteUpdateRef.current['udhaar']) {
      writeToRtdb(RTDB_PATHS.UDHAAR, udhaarTransactions);
      setLastSyncTime(new Date());
    }
    isRemoteUpdateRef.current['udhaar'] = false;
  }, [udhaarTransactions]);

  useEffect(() => {
    saveStorage('suppliers', suppliers);
    if (!isRemoteUpdateRef.current['suppliers']) {
      writeToRtdb(RTDB_PATHS.SUPPLIERS, suppliers);
      setLastSyncTime(new Date());
    }
    isRemoteUpdateRef.current['suppliers'] = false;
  }, [suppliers]);

  useEffect(() => {
    saveStorage('purchases', purchases);
    if (!isRemoteUpdateRef.current['purchases']) {
      writeToRtdb(RTDB_PATHS.PURCHASES, purchases);
      setLastSyncTime(new Date());
    }
    isRemoteUpdateRef.current['purchases'] = false;
  }, [purchases]);

  useEffect(() => {
    saveStorage('expenses', expenses);
    if (!isRemoteUpdateRef.current['expenses']) {
      writeToRtdb(RTDB_PATHS.EXPENSES, expenses);
      setLastSyncTime(new Date());
    }
    isRemoteUpdateRef.current['expenses'] = false;
  }, [expenses]);

  useEffect(() => {
    saveStorage('cash_reg', cashRegister);
    if (!isRemoteUpdateRef.current['cash']) {
      writeToRtdb(RTDB_PATHS.CASH_REGISTER, cashRegister);
      setLastSyncTime(new Date());
    }
    isRemoteUpdateRef.current['cash'] = false;
  }, [cashRegister]);

  useEffect(() => {
    saveStorage('tables', tables);
    if (!isRemoteUpdateRef.current['tables']) {
      writeToRtdb(RTDB_PATHS.TABLES, tables);
      setLastSyncTime(new Date());
    }
    isRemoteUpdateRef.current['tables'] = false;
  }, [tables]);

  useEffect(() => {
    saveStorage('kitchen', kitchenOrders);
    if (!isRemoteUpdateRef.current['kitchen']) {
      writeToRtdb(RTDB_PATHS.KITCHEN_ORDERS, kitchenOrders);
      setLastSyncTime(new Date());
    }
    isRemoteUpdateRef.current['kitchen'] = false;
  }, [kitchenOrders]);

  useEffect(() => {
    saveStorage('staff', staff);
    if (!isRemoteUpdateRef.current['staff']) {
      writeToRtdb(RTDB_PATHS.STAFF, staff);
      setLastSyncTime(new Date());
    }
    isRemoteUpdateRef.current['staff'] = false;
  }, [staff]);

  useEffect(() => {
    saveStorage('profile', businessProfile);
    if (!isRemoteUpdateRef.current['profile']) {
      writeToRtdb(RTDB_PATHS.BUSINESS_PROFILE, businessProfile);
      setLastSyncTime(new Date());
    }
    isRemoteUpdateRef.current['profile'] = false;
  }, [businessProfile]);

  const manualSyncToCloud = async () => {
    setFirebaseSyncing(true);
    try {
      await Promise.all([
        writeToRtdb(RTDB_PATHS.MENU_ITEMS, menuItems),
        writeToRtdb(RTDB_PATHS.BILLS, bills),
        writeToRtdb(RTDB_PATHS.TABLES, tables),
        writeToRtdb(RTDB_PATHS.KITCHEN_ORDERS, kitchenOrders),
        writeToRtdb(RTDB_PATHS.CUSTOMERS, customers),
        writeToRtdb(RTDB_PATHS.UDHAAR, udhaarTransactions),
        writeToRtdb(RTDB_PATHS.SUPPLIERS, suppliers),
        writeToRtdb(RTDB_PATHS.PURCHASES, purchases),
        writeToRtdb(RTDB_PATHS.EXPENSES, expenses),
        writeToRtdb(RTDB_PATHS.CASH_REGISTER, cashRegister),
        writeToRtdb(RTDB_PATHS.STAFF, staff),
        writeToRtdb(RTDB_PATHS.BUSINESS_PROFILE, businessProfile)
      ]);
      setLastSyncTime(new Date());
      setNotifications(prev => [
        {
          id: `sync-${Date.now()}`,
          type: 'success',
          title: 'Cloud Sync Completed',
          message: 'All cafe data successfully synchronized with Firebase Realtime Database!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    } catch (e) {
      console.error('Manual sync failed:', e);
    } finally {
      setFirebaseSyncing(false);
    }
  };

  const dismissCustomerCall = async (id: string) => {
    setCustomerCalls(prev => prev.filter(c => c.id !== id));
    dismissNotification(id);
    await writeToRtdb(`${RTDB_PATHS.CUSTOMER_CALLS}/${id}/status`, 'resolved');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: keyof typeof translations.en) => {
    return getTranslation(language, key);
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const cartTotal = Math.max(0, cartSubtotal - discount);

  // Cart operations
  const addToCart = (item: MenuItem, variantId?: string) => {
    setCart(prev => {
      let variant = item.variants?.find(v => v.id === variantId);
      const cartItemId = variant ? `${item.id}_${variant.id}` : item.id;
      const existing = prev.find(i => i.id === cartItemId);

      if (existing) {
        return prev.map(i =>
          i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      const newItem: CartItem = {
        id: cartItemId,
        menuItemId: item.id,
        name: item.name,
        nameMr: item.nameMr,
        nameHi: item.nameHi,
        variantId: variant?.id,
        variantName: variant?.name,
        quantity: 1,
        sellingPrice: variant ? variant.sellingPrice : item.sellingPrice,
        costPrice: variant ? variant.costPrice : item.costPrice,
        illustration: item.illustration
      };
      return [...prev, newItem];
    });
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setCartNotes('');
  };

  // Complete bill workflow
  const completeBill = (
    paymentMethod: PaymentMethod,
    cashReceived?: number,
    cashChange?: number,
    notes?: string
  ): Bill => {
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    const nextBillNum = `SYS-${1045 + bills.length}`;
    const costTotal = cart.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
    const profit = cartTotal - costTotal;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Create bill record
    const newBill: Bill = {
      id: `bill-${Date.now()}`,
      billNumber: nextBillNum,
      items: [...cart],
      customerId: undefined,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      subtotal: cartSubtotal,
      discount,
      tax: 0,
      total: cartTotal,
      costTotal,
      profit,
      paymentMethod,
      paymentStatus: paymentMethod === 'udhaar' ? 'pending' : 'paid',
      cashReceived: paymentMethod === 'cash' ? (cashReceived || cartTotal) : undefined,
      cashChange: paymentMethod === 'cash' ? (cashChange || 0) : undefined,
      createdAt: formattedDate,
      createdBy: 'Santosh (Owner)',
      notes: notes || cartNotes || undefined
    };

    // 1. Auto-deduct inventory
    setMenuItems(prev =>
      prev.map(menuItem => {
        const matchingCartItems = cart.filter(c => c.menuItemId === menuItem.id);
        if (matchingCartItems.length > 0) {
          const totalSold = matchingCartItems.reduce((s, c) => s + c.quantity, 0);
          const newStock = Math.max(0, menuItem.stock - totalSold);
          return { ...menuItem, stock: newStock };
        }
        return menuItem;
      })
    );

    // 2. Add customer or update customer
    if (customerPhone.trim() || customerName.trim()) {
      const phoneClean = customerPhone.trim();
      const existing = customers.find(c => c.phone === phoneClean && phoneClean !== '');
      if (existing) {
        newBill.customerId = existing.id;
        setCustomers(prev =>
          prev.map(c =>
            c.id === existing.id
              ? {
                  ...c,
                  totalOrders: c.totalOrders + 1,
                  totalSpent: c.totalSpent + cartTotal,
                  udhaarBalance: paymentMethod === 'udhaar' ? c.udhaarBalance + cartTotal : c.udhaarBalance,
                  lastVisit: 'Today'
                }
              : c
          )
        );
      } else {
        const newCustId = `c-${Date.now()}`;
        newBill.customerId = newCustId;
        const newCustomer: Customer = {
          id: newCustId,
          name: customerName.trim() || 'Guest Customer',
          phone: customerPhone.trim() || 'N/A',
          totalOrders: 1,
          totalSpent: cartTotal,
          udhaarBalance: paymentMethod === 'udhaar' ? cartTotal : 0,
          lastVisit: 'Today'
        };
        setCustomers(prev => [newCustomer, ...prev]);
      }
    }

    // 3. If Udhaar, record Udhaar transaction
    if (paymentMethod === 'udhaar') {
      const udhaarCustName = customerName.trim() || 'Customer';
      const udhaarCustPhone = customerPhone.trim() || 'N/A';
      const newUdhaarTx: UdhaarTransaction = {
        id: `ut-${Date.now()}`,
        customerId: newBill.customerId || 'c-guest',
        customerName: udhaarCustName,
        customerPhone: udhaarCustPhone,
        type: 'credit',
        amount: cartTotal,
        remainingBalance: cartTotal,
        date: formattedDate,
        billId: newBill.id,
        billNumber: newBill.billNumber,
        note: notes || 'New bill added to udhaar'
      };
      setUdhaarTransactions(prev => [newUdhaarTx, ...prev]);
    }

    // 4. If Cash, update Cash Register
    if (paymentMethod === 'cash') {
      setCashRegister(prev => ({
        ...prev,
        cashSales: prev.cashSales + cartTotal,
        expectedCash: prev.expectedCash + cartTotal
      }));
    }

    // 5. Send to kitchen
    const newKitchenTicket: KitchenOrder = {
      id: `ko-${Date.now()}`,
      billNumber: nextBillNum,
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      orderType,
      items: cart.map(i => ({
        name: i.variantName ? `${i.name} (${i.variantName})` : i.name,
        quantity: i.quantity,
        notes: i.notes
      })),
      status: 'new',
      createdAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: notes || cartNotes || undefined
    };
    setKitchenOrders(prev => [newKitchenTicket, ...prev]);

    // 6. If table was used, mark table as occupied/pending
    if (orderType === 'dine_in' && tableNumber) {
      setTables(prev =>
        prev.map(t =>
          String(t.number) === String(tableNumber)
            ? {
                ...t,
                status: 'occupied',
                customerName: customerName.trim() || 'Dine-in Guest',
                orderTotal: cartTotal,
                seatedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                itemsCount: cart.reduce((s, i) => s + i.quantity, 0)
              }
            : t
        )
      );
    }

    // Save bill
    setBills(prev => [newBill, ...prev]);

    // 7. IndexedDB Caching and Automatic Firestore Sync for POS Module
    cacheOrderInIndexedDB(newBill, isOnline ? 'synced' : 'pending');

    if (isOnline) {
      syncBillToFirestore(newBill).then(success => {
        if (!success) {
          enqueueOrderForSync(newBill.id, 'bill', newBill).then(() => {
            getPendingSyncCount().then(setPendingSyncCount);
            notifyServiceWorkerNewOrder();
          });
        } else {
          setLastFirestoreSyncTime(new Date());
        }
      });
    } else {
      enqueueOrderForSync(newBill.id, 'bill', newBill).then(() => {
        getPendingSyncCount().then(setPendingSyncCount);
        notifyServiceWorkerNewOrder();
      });
      setNotifications(prev => [
        {
          id: `offline-order-${Date.now()}`,
          type: 'warning',
          title: 'Order Saved Offline in IndexedDB',
          message: `Bill #${newBill.billNumber} is safely stored locally. Will auto-sync to Firestore when internet returns.`,
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    }

    // Set active receipt modal
    setActiveReceiptBill(newBill);

    // Clear cart
    clearCart();

    return newBill;
  };

  // 1. DINE-IN WORKFLOW: Place order first -> Served to table
  const placeTableOrder = (
    tblNum: string | number,
    itemsToOrder?: CartItem[],
    guestName?: string,
    guestPhone?: string,
    notes?: string
  ): KitchenOrder => {
    const orderItems = itemsToOrder || cart;
    if (orderItems.length === 0) {
      throw new Error('No items in order');
    }

    const targetTableNum = Number(tblNum);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Deduct stock for dishes sent to kitchen
    setMenuItems(prev =>
      prev.map(menuItem => {
        const matchingCartItems = orderItems.filter(c => c.menuItemId === menuItem.id);
        if (matchingCartItems.length > 0) {
          const totalSold = matchingCartItems.reduce((s, c) => s + c.quantity, 0);
          const newStock = Math.max(0, menuItem.stock - totalSold);
          return { ...menuItem, stock: newStock };
        }
        return menuItem;
      })
    );

    // Create KOT Ticket for Kitchen Screen
    const kotNumber = 101 + kitchenOrders.length;
    const newKitchenTicket: KitchenOrder = {
      id: `ko-${Date.now()}`,
      kotNumber,
      billNumber: `KOT-${kotNumber}`,
      tableNumber: String(targetTableNum),
      orderType: 'dine_in',
      items: orderItems.map(i => ({
        name: i.name,
        quantity: i.quantity,
        variant: i.variantName,
        notes: i.notes
      })),
      status: 'new',
      createdAt: timeStr,
      notes: notes || cartNotes || undefined
    };

    setKitchenOrders(prev => [newKitchenTicket, ...prev]);

    // Sync KOT to Firestore or queue in IndexedDB
    if (isOnline) {
      syncKitchenOrderToFirestore(newKitchenTicket);
    } else {
      enqueueOrderForSync(newKitchenTicket.id, 'kitchen_order', newKitchenTicket).then(() => {
        getPendingSyncCount().then(setPendingSyncCount);
        notifyServiceWorkerNewOrder();
      });
    }

    // Update table with active items & running total
    setTables(prev =>
      prev.map(t => {
        if (Number(t.number) === targetTableNum) {
          const existingItems = t.activeItems || [];
          // Merge items
          const merged: CartItem[] = [...existingItems];
          orderItems.forEach(newItem => {
            const existingIdx = merged.findIndex(m => m.id === newItem.id);
            if (existingIdx >= 0) {
              merged[existingIdx] = {
                ...merged[existingIdx],
                quantity: merged[existingIdx].quantity + newItem.quantity
              };
            } else {
              merged.push({ ...newItem });
            }
          });

          const total = merged.reduce((sum, it) => sum + it.sellingPrice * it.quantity, 0);

          return {
            ...t,
            status: 'occupied',
            customerName: guestName?.trim() || customerName.trim() || t.customerName || 'Dine-In Guest',
            customerPhone: guestPhone?.trim() || customerPhone.trim() || t.customerPhone,
            orderTotal: total,
            seatedAt: t.seatedAt || timeStr,
            itemsCount: merged.reduce((s, i) => s + i.quantity, 0),
            activeItems: merged
          };
        }
        return t;
      })
    );

    // Success notification
    setNotifications(prev => [
      {
        id: `kot-${Date.now()}`,
        type: 'success',
        title: `Order Placed for Table ${targetTableNum}`,
        message: `${orderItems.reduce((s, i) => s + i.quantity, 0)} dishes sent to kitchen. Diners will pay after eating.`,
        timestamp: timeStr
      },
      ...prev
    ]);

    // Clear cart
    clearCart();

    return newKitchenTicket;
  };

  // 2. DINE-IN WORKFLOW: Settle bill after eating -> Collect payment & free table
  const settleTableBill = (
    tblNum: string | number,
    paymentMethod: PaymentMethod,
    billDiscount = 0,
    cashRec?: number,
    cashChg?: number,
    notes?: string
  ): Bill => {
    const targetTableNum = Number(tblNum);
    const targetTable = tables.find(t => Number(t.number) === targetTableNum);

    // Collect items from table or kitchen
    const tableItems = targetTable?.activeItems && targetTable.activeItems.length > 0
      ? targetTable.activeItems
      : cart.length > 0
      ? cart
      : [
          {
            id: `served-item-${Date.now()}`,
            menuItemId: 'm-served',
            name: `Table ${targetTableNum} Dine-in Order`,
            nameMr: `टेबल ${targetTableNum} ऑर्डर`,
            nameHi: `टेबल ${targetTableNum} आर्डर`,
            quantity: 1,
            sellingPrice: targetTable?.orderTotal || 100,
            costPrice: 0,
            illustration: 'coffee'
          }
        ];

    const subtotal = tableItems.reduce((s, i) => s + i.sellingPrice * i.quantity, 0) || targetTable?.orderTotal || 0;
    const finalTotal = Math.max(0, subtotal - billDiscount);
    const costTotal = tableItems.reduce((s, i) => s + (i.costPrice || 0) * i.quantity, 0);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const nextBillNum = `SYS-${1045 + bills.length}`;

    const newBill: Bill = {
      id: `bill-${Date.now()}`,
      billNumber: nextBillNum,
      items: tableItems,
      customerId: undefined,
      customerName: targetTable?.customerName || customerName.trim() || undefined,
      customerPhone: targetTable?.customerPhone || customerPhone.trim() || undefined,
      orderType: 'dine_in',
      tableNumber: String(targetTableNum),
      subtotal,
      discount: billDiscount,
      tax: 0,
      total: finalTotal,
      costTotal,
      profit: finalTotal - costTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'udhaar' ? 'pending' : 'paid',
      cashReceived: paymentMethod === 'cash' ? (cashRec || finalTotal) : undefined,
      cashChange: paymentMethod === 'cash' ? (cashChg || 0) : undefined,
      createdAt: formattedDate,
      createdBy: 'Santosh (Owner)',
      notes: notes || undefined
    };

    // Update Customer
    const phoneClean = (targetTable?.customerPhone || customerPhone).trim();
    const nameClean = (targetTable?.customerName || customerName).trim();
    if (phoneClean || nameClean) {
      const existing = customers.find(c => c.phone === phoneClean && phoneClean !== '');
      if (existing) {
        newBill.customerId = existing.id;
        setCustomers(prev =>
          prev.map(c =>
            c.id === existing.id
              ? {
                  ...c,
                  totalOrders: c.totalOrders + 1,
                  totalSpent: c.totalSpent + finalTotal,
                  udhaarBalance: paymentMethod === 'udhaar' ? c.udhaarBalance + finalTotal : c.udhaarBalance,
                  lastVisit: 'Today'
                }
              : c
          )
        );
      } else {
        const newCustId = `c-${Date.now()}`;
        newBill.customerId = newCustId;
        setCustomers(prev => [
          {
            id: newCustId,
            name: nameClean || 'Dine-In Customer',
            phone: phoneClean || 'N/A',
            totalOrders: 1,
            totalSpent: finalTotal,
            udhaarBalance: paymentMethod === 'udhaar' ? finalTotal : 0,
            lastVisit: 'Today'
          },
          ...prev
        ]);
      }
    }

    // Udhaar transaction
    if (paymentMethod === 'udhaar') {
      setUdhaarTransactions(prev => [
        {
          id: `ut-${Date.now()}`,
          customerId: newBill.customerId || 'c-guest',
          customerName: nameClean || 'Customer',
          customerPhone: phoneClean || 'N/A',
          type: 'credit',
          amount: finalTotal,
          remainingBalance: finalTotal,
          date: formattedDate,
          billId: newBill.id,
          billNumber: newBill.billNumber,
          note: notes || `Table ${targetTableNum} bill settled as Udhaar`
        },
        ...prev
      ]);
    }

    // Cash Register update
    if (paymentMethod === 'cash') {
      setCashRegister(prev => ({
        ...prev,
        cashSales: prev.cashSales + finalTotal,
        expectedCash: prev.expectedCash + finalTotal
      }));
    }

    // Free the table back to available
    setTables(prev =>
      prev.map(t =>
        Number(t.number) === targetTableNum
          ? {
              ...t,
              status: 'available',
              customerName: undefined,
              customerPhone: undefined,
              orderTotal: undefined,
              seatedAt: undefined,
              itemsCount: undefined,
              activeItems: []
            }
          : t
      )
    );

    // Save Bill
    setBills(prev => [newBill, ...prev]);

    // IndexedDB Caching & Firestore Sync for POS Module
    cacheOrderInIndexedDB(newBill, isOnline ? 'synced' : 'pending');

    if (isOnline) {
      syncBillToFirestore(newBill).then(success => {
        if (!success) {
          enqueueOrderForSync(newBill.id, 'bill', newBill).then(() => {
            getPendingSyncCount().then(setPendingSyncCount);
            notifyServiceWorkerNewOrder();
          });
        } else {
          setLastFirestoreSyncTime(new Date());
        }
      });
    } else {
      enqueueOrderForSync(newBill.id, 'bill', newBill).then(() => {
        getPendingSyncCount().then(setPendingSyncCount);
        notifyServiceWorkerNewOrder();
      });
      setNotifications(prev => [
        {
          id: `offline-settle-${Date.now()}`,
          type: 'warning',
          title: 'Table Bill Settled Offline',
          message: `Table ${targetTableNum} bill #${newBill.billNumber} saved in IndexedDB. Will auto-sync to Firestore when connected.`,
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    }

    // Open receipt modal
    setActiveReceiptBill(newBill);

    return newBill;
  };

  // Refund Bill
  const refundBill = (billId: string, reason: string) => {
    setBills(prev =>
      prev.map(b => {
        if (b.id === billId) {
          // Restore inventory
          setMenuItems(curr =>
            curr.map(m => {
              const matched = b.items.filter(it => it.menuItemId === m.id);
              if (matched.length > 0) {
                const restQty = matched.reduce((sum, it) => sum + it.quantity, 0);
                return { ...m, stock: m.stock + restQty };
              }
              return m;
            })
          );
          return {
            ...b,
            paymentStatus: 'refunded',
            isRefunded: true,
            refundReason: reason
          };
        }
        return b;
      })
    );
  };

  // Collect Udhaar payment
  const collectUdhaarPayment = (customerId: string, amount: number, note?: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const remaining = Math.max(0, customer.udhaarBalance - amount);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const tx: UdhaarTransaction = {
      id: `ut-${Date.now()}`,
      customerId,
      customerName: customer.name,
      customerPhone: customer.phone,
      type: 'payment',
      amount,
      remainingBalance: remaining,
      date: formattedDate,
      note: note || 'Udhaar collection received'
    };

    setUdhaarTransactions(prev => [tx, ...prev]);
    setCustomers(prev =>
      prev.map(c => (c.id === customerId ? { ...c, udhaarBalance: remaining } : c))
    );

    // Update Cash register
    setCashRegister(prev => ({
      ...prev,
      cashReceived: prev.cashReceived + amount,
      expectedCash: prev.expectedCash + amount
    }));
  };

  const addUdhaarCredit = (customerId: string, amount: number, note?: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const newBalance = customer.udhaarBalance + amount;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const tx: UdhaarTransaction = {
      id: `ut-${Date.now()}`,
      customerId,
      customerName: customer.name,
      customerPhone: customer.phone,
      type: 'credit',
      amount,
      remainingBalance: newBalance,
      date: formattedDate,
      note: note || 'Manual credit added'
    };

    setUdhaarTransactions(prev => [tx, ...prev]);
    setCustomers(prev =>
      prev.map(c => (c.id === customerId ? { ...c, udhaarBalance: newBalance } : c))
    );
  };

  const addCustomer = (data: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'udhaarBalance' | 'lastVisit'>): Customer => {
    const newCust: Customer = {
      id: `c-${Date.now()}`,
      ...data,
      totalOrders: 0,
      totalSpent: 0,
      udhaarBalance: 0,
      lastVisit: 'Today'
    };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (updated: Customer) => {
    setCustomers(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  // Stock Refill / Purchase
  const addStockRefill = (
    supplierId: string,
    itemId: string,
    quantity: number,
    rate: number,
    paymentMethod: string,
    notes?: string
  ) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    const item = menuItems.find(m => m.id === itemId);
    const total = quantity * rate;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;

    const purchase: Purchase = {
      id: `pur-${Date.now()}`,
      supplierId,
      supplierName: supplier ? supplier.name : 'Unknown Supplier',
      date: dateStr,
      itemId,
      itemName: item ? item.name : 'Stock Item',
      quantity,
      unit: item ? item.unit : 'pcs',
      purchasePrice: rate,
      total,
      paymentMethod,
      paymentStatus: 'paid',
      notes
    };

    // 1. Add purchase record
    setPurchases(prev => [purchase, ...prev]);

    // 2. Increase stock
    if (item) {
      setMenuItems(prev =>
        prev.map(m => (m.id === itemId ? { ...m, stock: m.stock + quantity } : m))
      );
    }

    // 3. Update supplier totals
    if (supplier) {
      setSuppliers(prev =>
        prev.map(s =>
          s.id === supplierId
            ? { ...s, totalPurchases: s.totalPurchases + total, lastPurchaseDate: dateStr }
            : s
        )
      );
    }

    // 4. Update cash register if paid in cash
    if (paymentMethod.toLowerCase() === 'cash') {
      setCashRegister(prev => ({
        ...prev,
        cashExpenses: prev.cashExpenses + total,
        expectedCash: prev.expectedCash - total
      }));
    }
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'totalPurchases' | 'pendingPayment' | 'lastPurchaseDate'>) => {
    const newSup: Supplier = {
      id: `s-${Date.now()}`,
      ...supplierData,
      totalPurchases: 0,
      pendingPayment: 0,
      lastPurchaseDate: 'N/A'
    };
    setSuppliers(prev => [newSup, ...prev]);
  };

  // Expenses
  const addExpense = (category: any, amount: number, paymentMethod: string, description: string) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      category,
      amount,
      paymentMethod,
      description,
      date: dateStr
    };

    setExpenses(prev => [newExp, ...prev]);

    if (paymentMethod.toLowerCase() === 'cash') {
      setCashRegister(prev => ({
        ...prev,
        cashExpenses: prev.cashExpenses + amount,
        expectedCash: prev.expectedCash - amount
      }));
    }
  };

  // Cash Register
  const closeDayRegister = (actualCash: number, notes?: string) => {
    const now = new Date();
    const closedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCashRegister(prev => ({
      ...prev,
      actualCash,
      difference: actualCash - prev.expectedCash,
      isClosed: true,
      closedAt: closedTime,
      notes
    }));
  };

  const addCashTransaction = (type: 'in' | 'out', amount: number, note?: string) => {
    setCashRegister(prev => {
      if (type === 'in') {
        return {
          ...prev,
          cashReceived: prev.cashReceived + amount,
          expectedCash: prev.expectedCash + amount
        };
      } else {
        return {
          ...prev,
          cashWithdrawn: prev.cashWithdrawn + amount,
          expectedCash: prev.expectedCash - amount
        };
      }
    });
  };

  // Tables CRUD
  const addTable = (tableData: { number: number; name: string; capacity?: number; floor?: string }) => {
    const num = Number(tableData.number);
    if (!num || num <= 0) {
      return { success: false, error: 'Please enter a valid table number.' };
    }
    const existing = tables.find(t => Number(t.number) === num);
    if (existing) {
      return { success: false, error: `Table number T-${num} already exists.` };
    }
    const newTable: TableItem = {
      id: `table-${Date.now()}`,
      number: num,
      tableNumber: num,
      name: tableData.name.trim() || `Table ${num}`,
      capacity: Number(tableData.capacity) || 4,
      floor: tableData.floor?.trim() || 'Main Floor',
      status: 'available'
    };
    setTables(prev => [...prev, newTable].sort((a, b) => a.number - b.number));
    return { success: true };
  };

  const updateTable = (tableId: string, tableData: Partial<TableItem>) => {
    if (tableData.number !== undefined) {
      const num = Number(tableData.number);
      if (!num || num <= 0) {
        return { success: false, error: 'Please enter a valid table number.' };
      }
      const duplicate = tables.find(
        t => t.id !== tableId && Number(t.number) === num
      );
      if (duplicate) {
        return { success: false, error: `Table number T-${num} is already in use.` };
      }
    }
    setTables(prev =>
      prev
        .map(t =>
          t.id === tableId
            ? {
                ...t,
                ...tableData,
                number: tableData.number !== undefined ? Number(tableData.number) : t.number,
                tableNumber: tableData.number !== undefined ? Number(tableData.number) : t.tableNumber,
                capacity: tableData.capacity !== undefined ? Number(tableData.capacity) : t.capacity,
                floor: tableData.floor !== undefined ? tableData.floor : t.floor,
                name: tableData.name !== undefined ? tableData.name.trim() : t.name
              }
            : t
        )
        .sort((a, b) => a.number - b.number)
    );
    return { success: true };
  };

  const deleteTable = (tableId: string) => {
    const target = tables.find(t => t.id === tableId);
    if (!target) return { success: false, error: 'Table not found.' };

    if (target.status === 'occupied' || target.status === 'bill_pending') {
      return {
        success: false,
        error: `Cannot delete Table T-${target.number} while it is occupied. Please clear or complete the bill first.`
      };
    }

    setTables(prev => prev.filter(t => t.id !== tableId));
    return { success: true };
  };

  const updateTableStatus = (
    tableId: string,
    status: TableItem['status'],
    customerName?: string,
    orderTotal?: number
  ) => {
    setTables(prev =>
      prev.map(t =>
        t.id === tableId
          ? {
              ...t,
              status,
              customerName: status === 'available' ? undefined : customerName || t.customerName,
              orderTotal: status === 'available' ? undefined : orderTotal || t.orderTotal,
              seatedAt: status === 'available' ? undefined : t.seatedAt
            }
          : t
      )
    );
  };

  // Kitchen
  const updateKitchenStatus = (orderId: string, status: KitchenStatus) => {
    setKitchenOrders(prev =>
      prev.map(ko => (ko.id === orderId ? { ...ko, status } : ko))
    );
  };

  // Menu items
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      ...itemData
    };
    setMenuItems(prev => [newItem, ...prev]);
  };

  const updateMenuItem = (item: MenuItem) => {
    setMenuItems(prev => prev.map(m => (m.id === item.id ? item : m)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
  };

  // Staff
  const addStaffMember = (memberData: Omit<StaffMember, 'id'>) => {
    const newStaff: StaffMember = {
      id: `st-${Date.now()}`,
      ...memberData
    };
    setStaff(prev => [...prev, newStaff]);
  };

  // Profile
  const updateBusinessProfile = (p: BusinessProfile) => {
    setBusinessProfile(p);
  };

  // Notifications
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Reset
  const resetAllData = () => {
    setMenuItems(initialMenuItems);
    setBills(initialBills);
    setCustomers(initialCustomers);
    setUdhaarTransactions(initialUdhaarTransactions);
    setSuppliers(initialSuppliers);
    setPurchases(initialPurchases);
    setExpenses(initialExpenses);
    setCashRegister(initialCashRegister);
    setTables(initialTables);
    setKitchenOrders(initialKitchenOrders);
    setStaff(initialStaffMembers);
    setBusinessProfile(initialBusinessProfile);
    localStorage.clear();
  };

  const addStaff = (member: any) => addStaffMember(member);
  const updateStaff = (member: any) => {
    setStaff(prev => prev.map(s => (s.id === member.id ? { ...s, ...member } : s)));
  };
  const resetToDefaultData = () => resetAllData();
  const setSelectedTable = (tbl: string | number | null) => setTableNumber(tbl ? String(tbl) : '');
  const updateKitchenOrderStatus = (orderId: string, status: KitchenStatus) => updateKitchenStatus(orderId, status);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
        t,
        globalSearch,
        setGlobalSearch,
        categories,
        menuItems,
        selectedCategory,
        setSelectedCategory,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        cart,
        orderType,
        setOrderType,
        tableNumber,
        setTableNumber,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        discount,
        setDiscount,
        cartNotes,
        setCartNotes,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotal,
        bills,
        completeBill,
        placeTableOrder,
        settleTableBill,
        refundBill,
        activeReceiptBill,
        setActiveReceiptBill,
        customers,
        udhaarTransactions,
        collectUdhaarPayment,
        addUdhaarCredit,
        addCustomer,
        updateCustomer,
        purchases,
        suppliers,
        addStockRefill,
        addSupplier,
        expenses,
        addExpense,
        cashRegister,
        closeDayRegister,
        addCashTransaction,
        tables,
        setSelectedTable,
        addTable,
        updateTable,
        deleteTable,
        updateTableStatus,
        kitchenOrders,
        updateKitchenStatus,
        updateKitchenOrderStatus,
        staff,
        addStaffMember,
        addStaff,
        updateStaff,
        businessProfile,
        updateBusinessProfile,
        notifications,
        dismissNotification,
        firebaseConnected,
        firebaseSyncing,
        lastSyncTime,
        manualSyncToCloud,
        isOnline,
        pendingSyncCount,
        isFirestoreSyncing,
        lastFirestoreSyncTime,
        syncPendingOrdersToFirestoreNow,
        customerCalls,
        dismissCustomerCall,
        resetAllData,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
