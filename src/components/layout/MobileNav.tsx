import React from 'react';
import {
  Utensils,
  LayoutDashboard,
  ChefHat,
  CreditCard,
  Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, toggleMobileSidebar, kitchenOrders, udhaarTransactions } = useApp();

  const pendingKitchenCount = kitchenOrders.filter(o => o.status !== 'completed').length;
  const pendingUdhaarCount = udhaarTransactions.filter(t => t.type === 'credit').length;

  const mainTabs: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'pos', label: 'POS', icon: Utensils },
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'kitchen', label: 'Kitchen', icon: ChefHat, badge: pendingKitchenCount || undefined },
    { id: 'udhaar', label: 'Udhaar', icon: CreditCard, badge: pendingUdhaarCount || undefined }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-1 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-pb">
      {mainTabs.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
              isActive ? 'text-orange-600 font-bold' : 'text-gray-600 font-medium hover:text-gray-900'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl relative transition-all ${
                isActive ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-600 text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
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
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-gray-600 font-medium hover:text-gray-900 transition-colors cursor-pointer"
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
