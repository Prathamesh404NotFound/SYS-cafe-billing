export type Language = 'en' | 'mr' | 'hi';

export type ActiveTab =
  | 'pos'
  | 'dashboard'
  | 'orders'
  | 'bills'
  | 'inventory'
  | 'purchases'
  | 'menu'
  | 'customers'
  | 'udhaar'
  | 'suppliers'
  | 'expenses'
  | 'cash'
  | 'tables'
  | 'kitchen'
  | 'reports'
  | 'staff'
  | 'settings';

export interface Category {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  icon: string;
}

export interface MenuItemVariant {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  sellingPrice: number;
  costPrice: number;
}

export interface MenuItem {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  categoryId: string;
  illustration: string;
  sellingPrice: number;
  costPrice: number;
  stock: number;
  unit: string;
  minimumStock: number;
  isAvailable: boolean;
  variants?: MenuItemVariant[];
  sku?: string;
  description?: string;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  nameMr: string;
  nameHi: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  sellingPrice: number;
  costPrice: number;
  illustration: string;
  notes?: string;
}

export type OrderType = 'dine_in' | 'takeaway' | 'parcel' | 'delivery';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'online' | 'udhaar' | 'mixed';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';

export interface Bill {
  id: string;
  billNumber: string;
  items: CartItem[];
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  orderType: OrderType;
  tableNumber?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  costTotal: number;
  profit: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  cashReceived?: number;
  cashChange?: number;
  createdAt: string;
  createdBy: string;
  notes?: string;
  isRefunded?: boolean;
  refundReason?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  udhaarBalance: number;
  lastVisit: string;
  notes?: string;
}

export interface UdhaarTransaction {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  type: 'credit' | 'payment';
  amount: number;
  remainingBalance: number;
  date: string;
  billId?: string;
  billNumber?: string;
  note?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  minimumStock: number;
  supplierId?: string;
  supplierName?: string;
  lastRefillDate: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface Purchase {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  purchasePrice: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending';
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone: string;
  whatsapp?: string;
  category?: string;
  address?: string;
  products?: string[];
  totalPurchases: number;
  pendingPayment: number;
  pendingBalance?: number;
  lastPurchaseDate?: string;
}

export type ExpenseCategory =
  | 'Electricity'
  | 'Gas'
  | 'Rent'
  | 'Staff'
  | 'Raw Material'
  | 'Packaging'
  | 'Maintenance'
  | 'Delivery'
  | 'Marketing'
  | 'Miscellaneous'
  | 'Misc';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  paymentMethod: string;
  description: string;
  date: string;
  receiptRef?: string;
}

export interface CashRegister {
  openingCash: number;
  cashSales: number;
  cashExpenses: number;
  cashReceived: number;
  cashWithdrawn: number;
  expectedCash: number;
  actualCash?: number;
  difference?: number;
  isClosed: boolean;
  closedAt?: string;
  notes?: string;
}

export interface TableItem {
  id: string;
  number: number;
  tableNumber?: number;
  name: string;
  capacity?: number;
  floor?: string;
  status: 'available' | 'occupied' | 'bill_pending' | 'vacant' | 'billed';
  currentBillId?: string;
  currentBillAmount?: number;
  customerName?: string;
  customerPhone?: string;
  orderTotal?: number;
  seatedAt?: string;
  itemsCount?: number;
  activeItems?: CartItem[];
}

export type CafeTable = TableItem;

export type KitchenStatus = 'new' | 'pending' | 'preparing' | 'ready' | 'completed';

export interface KitchenOrder {
  id: string;
  kotNumber?: number;
  billNumber: string;
  tableNumber?: string;
  orderType: OrderType;
  items: { name: string; quantity: number; notes?: string; variant?: string }[];
  status: KitchenStatus;
  createdAt: string;
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Owner' | 'Manager' | 'Cashier' | 'Staff' | 'chef' | 'owner' | 'manager' | 'cashier';
  phone: string;
  status?: 'active' | 'inactive';
  isActive?: boolean;
  salary?: number;
  shift?: string;
  permissions?: {
    canCreateBills: boolean;
    canEditPrices: boolean;
    canManageStock: boolean;
    canViewReports: boolean;
    canManageExpenses: boolean;
    canManageCustomers: boolean;
  };
}

export interface BusinessProfile {
  name: string;
  tagline: string;
  phone: string;
  whatsapp?: string;
  address: string;
  openingHours?: string;
  gstNumber?: string;
  gstin?: string;
  fssai?: string;
  receiptFooter?: string;
  enableGst?: boolean;
  defaultGstRate?: number;
  soundEnabled?: boolean;
  upiId: string;
}

export interface CustomerCall {
  id: string;
  tableNumber: string | number;
  type: 'waiter' | 'bill' | 'water' | 'other';
  message: string;
  timestamp: string;
  status: 'pending' | 'resolved';
}
