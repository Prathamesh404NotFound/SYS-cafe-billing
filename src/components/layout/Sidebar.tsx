import React from 'react';
import {
  Utensils,
  LayoutDashboard,
  ChefHat,
  LayoutGrid,
  Receipt,
  Boxes,
  ShoppingBag,
  BookOpen,
  Users,
  CreditCard,
  Truck,
  Wallet,
  Banknote,
  BarChart3,
  ShieldCheck,
  Settings,
  Phone,
  MessageCircle,
  Coffee,
  X,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

interface NavItem {
  id: ActiveTab;
  labelKey: string;
  icon: React.ElementType;
  badge?: number;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    t,
    businessProfile,
    udhaarTransactions,
    kitchenOrders
  } = useApp();

  const pendingKitchenCount = kitchenOrders.filter(o => o.status !== 'completed').length;
  const pendingUdhaarCount = udhaarTransactions.filter(t => t.type === 'credit').length;

  const navItems: NavItem[] = [
    { id: 'pos', labelKey: 'navPos', icon: Utensils, highlight: true },
    { id: 'dashboard', labelKey: 'navDashboard', icon: LayoutDashboard },
    { id: 'kitchen', labelKey: 'navKitchen', icon: ChefHat, badge: pendingKitchenCount || undefined },
    { id: 'tables', labelKey: 'navTables', icon: LayoutGrid },
    { id: 'bills', labelKey: 'navBills', icon: Receipt },
    { id: 'inventory', labelKey: 'navInventory', icon: Boxes },
    { id: 'purchases', labelKey: 'navPurchases', icon: ShoppingBag },
    { id: 'menu', labelKey: 'navMenu', icon: BookOpen },
    { id: 'customers', labelKey: 'navCustomers', icon: Users },
    { id: 'udhaar', labelKey: 'navUdhaar', icon: CreditCard, badge: pendingUdhaarCount || undefined },
    { id: 'suppliers', labelKey: 'navSuppliers', icon: Truck },
    { id: 'expenses', labelKey: 'navExpenses', icon: Wallet },
    { id: 'cash', labelKey: 'navCash', icon: Banknote },
    { id: 'reports', labelKey: 'navReports', icon: BarChart3 },
    { id: 'staff', labelKey: 'navStaff', icon: ShieldCheck },
    { id: 'settings', labelKey: 'navSettings', icon: Settings }
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-60 bg-white border-r border-gray-200 flex flex-col shrink-0 select-none h-full shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand header area */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <Coffee className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-extrabold text-base text-gray-900 tracking-tight leading-tight truncate">
                {businessProfile.name}
              </h1>
              <p className="text-[11px] text-gray-500 font-medium truncate">
                POS & Cafe Engine
              </p>
            </div>
          </div>

          {/* Close button for phone view */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close navigation"
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 md:py-2 rounded-xl text-xs md:text-xs font-bold transition-all text-left cursor-pointer active:scale-[0.98] ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm'
                    : item.highlight
                    ? 'bg-orange-50 text-orange-700 hover:bg-orange-100/80'
                    : 'text-gray-700 hover:bg-slate-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 md:w-4 md:h-4 shrink-0 stroke-[2.2] ${
                      isActive ? 'text-white' : item.highlight ? 'text-orange-500' : 'text-gray-500'
                    }`}
                  />
                  <span className="truncate">{t(item.labelKey as any)}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 md:hidden opacity-80" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Cafe Contact & Staff info footer */}
        <div className="p-3.5 md:p-3 border-t border-gray-200 bg-slate-50 space-y-2 shrink-0">
          <div className="text-[11px] font-bold text-gray-600 flex items-center justify-between">
            <span>SYS Support</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100/80 px-1.5 py-0.5 rounded">
              Open
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <a
              href={`tel:${businessProfile.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center justify-center gap-1.5 py-2 md:py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-orange-500" />
              <span>Call</span>
            </a>
            <a
              href={`https://wa.me/${(businessProfile.whatsapp || businessProfile.phone).replace(/[^0-9]/g, '')}?text=Hello%20SYS%20Cafe`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 md:py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
