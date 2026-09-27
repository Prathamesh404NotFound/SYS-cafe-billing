import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Feature screens
import { POSScreen } from './components/pos/POSScreen';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { KitchenScreen } from './components/kitchen/KitchenScreen';
import { TablesScreen } from './components/tables/TablesScreen';
import { BillsScreen } from './components/bills/BillsScreen';
import { InventoryScreen } from './components/inventory/InventoryScreen';
import { PurchasesScreen } from './components/inventory/PurchasesScreen';
import { MenuScreen } from './components/menu/MenuScreen';
import { CustomersScreen } from './components/customers/CustomersScreen';
import { UdhaarScreen } from './components/udhaar/UdhaarScreen';
import { SuppliersScreen } from './components/suppliers/SuppliersScreen';
import { ExpensesScreen } from './components/expenses/ExpensesScreen';
import { CashRegisterScreen } from './components/cash/CashRegisterScreen';
import { ReportsScreen } from './components/reports/ReportsScreen';
import { StaffScreen } from './components/staff/StaffScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { ReceiptModal } from './components/pos/ReceiptModal';

const MainLayout: React.FC = () => {
  const { activeTab, activeReceiptBill, setActiveReceiptBill } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'pos':
        return <POSScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'kitchen':
        return <KitchenScreen />;
      case 'tables':
        return <TablesScreen />;
      case 'bills':
        return <BillsScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'purchases':
        return <PurchasesScreen />;
      case 'menu':
        return <MenuScreen />;
      case 'customers':
        return <CustomersScreen />;
      case 'udhaar':
        return <UdhaarScreen />;
      case 'suppliers':
        return <SuppliersScreen />;
      case 'expenses':
        return <ExpensesScreen />;
      case 'cash':
        return <CashRegisterScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'staff':
        return <StaffScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <POSScreen />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 text-gray-900 font-sans overflow-hidden">
      {/* Top Universal App Header */}
      <Header />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Left Sidebar */}
        <Sidebar />

        {/* Dynamic Screen Viewport */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative pb-16 md:pb-0">
          {renderActiveScreen()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (hidden on desktop md:) */}
      <MobileNav />

      {/* Global Printable Thermal Receipt Modal */}
      {activeReceiptBill && (
        <ReceiptModal
          bill={activeReceiptBill}
          onClose={() => setActiveReceiptBill(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
