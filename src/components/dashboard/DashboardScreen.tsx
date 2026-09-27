import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Users,
  Plus,
  AlertTriangle,
  ArrowUpRight,
  Receipt,
  CreditCard,
  Banknote,
  QrCode,
  Package,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodIllustration } from '../illustrations/FoodIllustrations';

export const DashboardScreen: React.FC = () => {
  const {
    bills,
    menuItems,
    customers,
    setActiveTab,
    setActiveReceiptBill,
    t,
    addStockRefill,
    addExpense,
    suppliers
  } = useApp();

  // Modals for Quick Actions
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Form states for quick modals
  const [refillItemId, setRefillItemId] = useState(menuItems[0]?.id || '');
  const [refillQuantity, setRefillQuantity] = useState(10);
  const [refillRate, setRefillRate] = useState(30);

  const [expCategory, setExpCategory] = useState('Packaging');
  const [expAmount, setExpAmount] = useState<number | ''>(250);
  const [expDesc, setExpDesc] = useState('Milk and Parcel boxes');

  // Calculations
  const todaySales = bills.reduce((sum, b) => sum + (b.isRefunded ? 0 : b.total), 0);
  const totalOrders = bills.filter(b => !b.isRefunded).length;
  const estimatedProfit = bills.reduce((sum, b) => sum + (b.isRefunded ? 0 : b.profit), 0);
  const pendingUdhaar = customers.reduce((sum, c) => sum + c.udhaarBalance, 0);

  // Payment Breakdown
  const paymentBreakdown = {
    cash: bills.filter(b => b.paymentMethod === 'cash' && !b.isRefunded).reduce((s, b) => s + b.total, 0),
    upi: bills.filter(b => b.paymentMethod === 'upi' && !b.isRefunded).reduce((s, b) => s + b.total, 0),
    card: bills.filter(b => b.paymentMethod === 'card' && !b.isRefunded).reduce((s, b) => s + b.total, 0),
    udhaar: bills.filter(b => b.paymentMethod === 'udhaar' && !b.isRefunded).reduce((s, b) => s + b.total, 0)
  };

  // Top Selling Items
  const itemSalesMap: { [key: string]: { name: string; qty: number; revenue: number; illustration: any } } = {};
  bills.forEach(b => {
    if (!b.isRefunded) {
      b.items.forEach(i => {
        if (!itemSalesMap[i.menuItemId]) {
          itemSalesMap[i.menuItemId] = {
            name: i.name,
            qty: 0,
            revenue: 0,
            illustration: i.illustration
          };
        }
        itemSalesMap[i.menuItemId].qty += i.quantity;
        itemSalesMap[i.menuItemId].revenue += i.sellingPrice * i.quantity;
      });
    }
  });

  const topSelling = Object.values(itemSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Low stock items
  const lowStockItems = menuItems.filter(m => m.stock <= m.minimumStock);

  const handleQuickRefillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers[0]?.id || 's1';
    addStockRefill(sup, refillItemId, Number(refillQuantity), Number(refillRate), 'Cash', 'Quick refill from Dashboard');
    setShowRefillModal(false);
  };

  const handleQuickExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expAmount) return;
    addExpense(expCategory as any, Number(expAmount), 'Cash', expDesc);
    setShowExpenseModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 custom-scrollbar space-y-5 pb-24 md:pb-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight">
            {t('goodMorning')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {t('todayOverview')}
          </p>
        </div>

        {/* Quick Action Buttons: NOT floating, embedded cleanly */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('pos')}
            className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('newBill')}</span>
          </button>

          <button
            onClick={() => setShowRefillModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4 text-orange-500" />
            <span>{t('addStock')}</span>
          </button>

          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span>{t('addExpense')}</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-0">
        {/* Today's Sales */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between relative z-0 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('todaySales')}</span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 truncate">
              ₹{todaySales.toLocaleString()}
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-time updated</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between relative z-0 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('totalOrders')}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-gray-900">
              {totalOrders}
            </div>
            <div className="text-[11px] font-medium text-gray-500 mt-1">
              Dine-In & Takeaway
            </div>
          </div>
        </div>

        {/* Estimated Profit */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between relative z-0 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('estimatedProfit')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 truncate">
              ₹{estimatedProfit.toLocaleString()}
            </div>
            <div className="text-[11px] font-semibold text-gray-500 mt-1">
              After dish cost deduction
            </div>
          </div>
        </div>

        {/* Pending Udhaar */}
        <div
          onClick={() => setActiveTab('udhaar')}
          className="bg-white p-4 rounded-2xl border border-amber-200 hover:border-amber-400 shadow-sm flex flex-col justify-between cursor-pointer transition-colors relative z-0 min-w-0"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">{t('pendingUdhaar')}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-800 truncate">
              ₹{pendingUdhaar.toLocaleString()}
            </div>
            <div className="text-[11px] font-bold text-amber-700 mt-1 flex items-center gap-0.5">
              <span>Collect now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Payment Breakdown & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payment Breakdown */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-gray-900">{t('paymentBreakdown')}</h3>
            <span className="text-xs text-gray-500 font-bold">₹{todaySales}</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Cash */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-gray-700">Cash:</span>
              </div>
              <span className="font-bold text-gray-900">₹{paymentBreakdown.cash}</span>
            </div>

            {/* UPI */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span className="font-semibold text-gray-700">UPI:</span>
              </div>
              <span className="font-bold text-gray-900">₹{paymentBreakdown.upi}</span>
            </div>

            {/* Card */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="font-semibold text-gray-700">Card:</span>
              </div>
              <span className="font-bold text-gray-900">₹{paymentBreakdown.card}</span>
            </div>

            {/* Udhaar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="font-semibold text-gray-700">Udhaar (Credit):</span>
              </div>
              <span className="font-bold text-amber-700">₹{paymentBreakdown.udhaar}</span>
            </div>
          </div>

          {/* Simple proportional visual bar */}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${todaySales > 0 ? (paymentBreakdown.cash / todaySales) * 100 : 0}%` }}
              className="bg-emerald-500 h-full"
            />
            <div
              style={{ width: `${todaySales > 0 ? (paymentBreakdown.upi / todaySales) * 100 : 0}%` }}
              className="bg-purple-500 h-full"
            />
            <div
              style={{ width: `${todaySales > 0 ? (paymentBreakdown.card / todaySales) * 100 : 0}%` }}
              className="bg-blue-500 h-full"
            />
            <div
              style={{ width: `${todaySales > 0 ? (paymentBreakdown.udhaar / todaySales) * 100 : 0}%` }}
              className="bg-amber-500 h-full"
            />
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-gray-900">{t('topSellingItems')}</h3>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs text-orange-600 font-bold hover:underline"
            >
              {t('viewAll')}
            </button>
          </div>

          <div className="space-y-2">
            {topSelling.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No dishes sold yet today</p>
            ) : (
              topSelling.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-gray-400 w-4">#{idx + 1}</span>
                    <FoodIllustration type={it.illustration} className="w-6 h-6" />
                    <div>
                      <span className="font-bold text-xs text-gray-900">{it.name}</span>
                      <span className="block text-[10px] text-gray-500">{it.qty} {t('sold')}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-xs text-gray-900">₹{it.revenue}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Warnings */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="font-extrabold text-sm text-gray-900">{t('lowStockAlerts')}</h3>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs text-orange-600 font-bold hover:underline"
            >
              {t('viewAll')}
            </button>
          </div>

          <div className="space-y-2">
            {lowStockItems.length === 0 ? (
              <div className="flex items-center justify-center text-xs text-emerald-600 font-medium py-6 gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>All ingredients & items in healthy stock</span>
              </div>
            ) : (
              lowStockItems.slice(0, 4).map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-gray-900">{item.name}</span>
                    <div className="text-[10px] text-amber-800 font-medium">
                      Stock: {item.stock} {item.unit} (Min: {item.minimumStock})
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setRefillItemId(item.id);
                      setShowRefillModal(true);
                    }}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] shadow-sm"
                  >
                    + Refill
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Transactions Table */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-gray-900">{t('recentTransactions')}</h3>
            <p className="text-xs text-gray-500">Live feed of orders and bills generated</p>
          </div>
          <button
            onClick={() => setActiveTab('bills')}
            className="text-xs text-orange-600 font-bold hover:underline"
          >
            {t('viewAll')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase border-b border-gray-200">
                <th className="pb-2 font-bold">Bill No.</th>
                <th className="pb-2 font-bold">Customer</th>
                <th className="pb-2 font-bold">Type</th>
                <th className="pb-2 font-bold">Payment</th>
                <th className="pb-2 font-bold text-right">Total</th>
                <th className="pb-2 font-bold text-right">Profit</th>
                <th className="pb-2 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    <p className="font-semibold text-xs text-gray-500">No transactions yet</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Orders generated in POS will appear here live</p>
                  </td>
                </tr>
              ) : (
                bills.slice(0, 5).map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-bold text-gray-900">{b.billNumber}</td>
                    <td className="py-2.5 text-gray-600">{b.customerName || 'Walk-in'}</td>
                    <td className="py-2.5 capitalize text-gray-600">
                      {b.orderType.replace('_', ' ')}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.paymentMethod === 'cash'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.paymentMethod === 'upi'
                            ? 'bg-purple-100 text-purple-800'
                            : b.paymentMethod === 'udhaar'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {b.paymentMethod}
                      </span>
                    </td>
                    <td className="py-2.5 font-black text-right text-gray-900">₹{b.total}</td>
                    <td className="py-2.5 font-bold text-right text-emerald-600">₹{b.profit}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => setActiveReceiptBill(b)}
                        className="text-orange-600 hover:text-orange-800 font-bold text-xs"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REFILL MODAL */}
      {showRefillModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleQuickRefillSubmit}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4"
          >
            <h3 className="font-extrabold text-base text-gray-900">Refill Stock Item</h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Select Item</label>
              <select
                value={refillItemId}
                onChange={e => setRefillItemId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium"
              >
                {menuItems.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Stock: {m.stock} {m.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={refillQuantity}
                  onChange={e => setRefillQuantity(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Rate / Unit (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={refillRate}
                  onChange={e => setRefillRate(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
                  required
                />
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-bold text-gray-800 flex justify-between">
              <span>Total Purchase Value:</span>
              <span className="text-orange-600">₹{refillQuantity * refillRate}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs"
              >
                Record Stock Refill
              </button>
              <button
                type="button"
                onClick={() => setShowRefillModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleQuickExpenseSubmit}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4"
          >
            <h3 className="font-extrabold text-base text-gray-900">Record Cafe Expense</h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
              <select
                value={expCategory}
                onChange={e => setExpCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium"
              >
                {['Electricity', 'Gas', 'Rent', 'Staff', 'Raw Material', 'Packaging', 'Maintenance', 'Delivery', 'Marketing', 'Misc'].map(
                  cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Amount (₹)</label>
              <input
                type="number"
                min="1"
                value={expAmount}
                onChange={e => setExpAmount(e.target.value ? Number(e.target.value) : '')}
                placeholder="250"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Description / Note</label>
              <input
                type="text"
                value={expDesc}
                onChange={e => setExpDesc(e.target.value)}
                placeholder="Details of expense..."
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                Save Expense
              </button>
              <button
                type="button"
                onClick={() => setShowExpenseModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
