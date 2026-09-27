import React, { createContext, useContext, useState, useEffect } from 'react';
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
  KitchenStatus
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
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadStorage('suppliers', initialSuppliers));
  const [purchases, setPurchases] = useState<Purchase[]>(() => loadStorage('purchases', initialPurchases));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadStorage('expenses', initialExpenses));
  const [cashRegister, setCashRegister] = useState<CashRegister>(() =>
    loadStorage('cash_reg', initialCashRegister)
  );
  const [tables, setTables] = useState<TableItem[]>(() => loadStorage('tables', initialTables));
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>(() =>
    loadStorage('kitchen', initialKitchenOrders)
  );
  const [staff, setStaff] = useState<StaffMember[]>(() => loadStorage('staff', initialStaffMembers));
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() =>
    loadStorage('profile', initialBusinessProfile)
  );

  // Active receipt modal
  const [activeReceiptBill, setActiveReceiptBill] = useState<Bill | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Sync to localStorage
  useEffect(() => saveStorage('language', language), [language]);
  useEffect(() => saveStorage('menu', menuItems), [menuItems]);
  useEffect(() => saveStorage('bills', bills), [bills]);
  useEffect(() => saveStorage('customers', customers), [customers]);
  useEffect(() => saveStorage('udhaar', udhaarTransactions), [udhaarTransactions]);
  useEffect(() => saveStorage('suppliers', suppliers), [suppliers]);
  useEffect(() => saveStorage('purchases', purchases), [purchases]);
  useEffect(() => saveStorage('expenses', expenses), [expenses]);
  useEffect(() => saveStorage('cash_reg', cashRegister), [cashRegister]);
  useEffect(() => saveStorage('tables', tables), [tables]);
  useEffect(() => saveStorage('kitchen', kitchenOrders), [kitchenOrders]);
  useEffect(() => saveStorage('staff', staff), [staff]);
  useEffect(() => saveStorage('profile', businessProfile), [businessProfile]);

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

    // Set active receipt modal
    setActiveReceiptBill(newBill);

    // Clear cart
    clearCart();

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

  // Tables
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
