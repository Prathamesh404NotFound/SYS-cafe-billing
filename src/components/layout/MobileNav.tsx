import React from 'react';
import {
  Utensils,
  LayoutGrid,
  ChefHat,
  CreditCard,
  Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const MobileNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    toggleMobileSidebar,
    kitchenOrders,
    udhaarTransactions,
    tables,
    pendingSyncCount
  } = useApp();

  const pendingKitchenCount = kitchenOrders.filter(o => o.status !== 'completed').length;
  const pendingUdhaarCount = udhaarTransactions.filter(t => t.type === 'credit').length;
  const occupiedTablesCount = tables.filter(
    t => t.status === 'occupied' || (t.activeItems && t.activeItems.length > 0)
  ).length;

  const mainTabs: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'pos',
      label: 'POS',
      icon: Utensils,
      badge: pendingSyncCount > 0 ? pendingSyncCount : undefined,
      badgeColor: 'bg-amber-500'
    },
    {
      id: 'tables',
      label: 'Tables',
      icon: LayoutGrid,
      badge: occupiedTablesCount || undefined,
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'kitchen',
      label: 'Kitchen',
      icon: ChefHat,
      badge: pendingKitchenCount || undefined,
      badgeColor: 'bg-purple-600'
    },
    {
      id: 'udhaar',
      label: 'Udhaar',
      icon: CreditCard,
      badge: pendingUdhaarCount || undefined,
      badgeColor: 'bg-rose-500'
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-1 py-1 flex items-center justify-around shadow-[0_-2px_12px_rgba(0,0,0,0.06)] pb-[calc(env(safe-area-inset-bottom,0px)+0.25rem)]">
      {mainTabs.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative min-w-[56px] ${
              isActive ? 'text-orange-600 font-bold' : 'text-gray-600 font-medium hover:text-gray-900 active:scale-95'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl relative transition-all ${
                isActive ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full ${
                    item.badgeColor || 'bg-orange-600'
                  } text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-xs`}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 leading-tight">{item.label}</span>
          </button>
        );
      })}

      {/* "Menu" button triggers the full Left Navbar Drawer */}
      <button
        onClick={toggleMobileSidebar}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-gray-600 font-medium hover:text-gray-900 transition-colors cursor-pointer min-w-[56px] active:scale-95"
        aria-label="Open full cafe menu sidebar"
      >
        <div className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <Menu className="w-4 h-4 stroke-[2.2]" />
        </div>
        <span className="text-[10px] mt-0.5 leading-tight">All Menu</span>
      </button>
    </nav>
  );
};
