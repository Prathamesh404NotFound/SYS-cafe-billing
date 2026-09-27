import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  IndianRupee,
  TrendingUp,
  Download,
  Printer,
  PieChart,
  ShoppingBag,
  Award,
  Wallet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodIllustration } from '../illustrations/FoodIllustrations';

export const ReportsScreen: React.FC = () => {
  const { bills, expenses, menuItems, customers, businessProfile, t } = useApp();

  const [dateRange, setDateRange] = useState<'today' | '7days' | 'month' | 'all'>('today');

  // Calculations
  const nonRefundedBills = bills.filter(b => !b.isRefunded);
  const totalRevenue = nonRefundedBills.reduce((s, b) => s + b.total, 0);
  const totalCOGS = nonRefundedBills.reduce((s, b) => s + (b.total - b.profit), 0);
  const grossProfit = totalRevenue - totalCOGS;
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = grossProfit - totalExpenses;
  const pendingUdhaar = customers.reduce((s, c) => s + c.udhaarBalance, 0);

  // Payment Breakdown
  const paymentBreakdown = {
    cash: nonRefundedBills.filter(b => b.paymentMethod === 'cash').reduce((s, b) => s + b.total, 0),
    upi: nonRefundedBills.filter(b => b.paymentMethod === 'upi').reduce((s, b) => s + b.total, 0),
    udhaar: nonRefundedBills.filter(b => b.paymentMethod === 'udhaar').reduce((s, b) => s + b.total, 0)
  };

  // Order Type Breakdown
  const orderTypeBreakdown = {
    dineIn: nonRefundedBills.filter(b => b.orderType === 'dine_in').length,
    takeaway: nonRefundedBills.filter(b => b.orderType === 'takeaway').length,
    delivery: nonRefundedBills.filter(b => b.orderType === 'delivery').length
  };

  // Dish Performance
  const itemMap: { [id: string]: { name: string; qty: number; revenue: number; profit: number; illustration: any } } = {};
  nonRefundedBills.forEach(b => {
    b.items.forEach(i => {
      if (!itemMap[i.menuItemId]) {
        itemMap[i.menuItemId] = {
          name: i.name,
          qty: 0,
          revenue: 0,
          profit: 0,
          illustration: i.illustration
        };
      }
      itemMap[i.menuItemId].qty += i.quantity;
      itemMap[i.menuItemId].revenue += i.sellingPrice * i.quantity;
      itemMap[i.menuItemId].profit += (i.sellingPrice - i.costPrice) * i.quantity;
    });
  });

  const bestSellers = Object.values(itemMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-orange-600" />
            <span>{t('navReports')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Financial analytics, profit & loss statement, best-sellers and payment channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['today', '7days', 'month', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                  dateRange === range
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {range === '7days' ? 'Last 7 Days' : range}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrintSummary}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-gray-600" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* P&L Statement Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Gross Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Sales Revenue</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1.5">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">From {nonRefundedBills.length} orders</span>
        </div>

        {/* Cost of Goods Sold */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cost of Ingredients</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-700 mt-1.5">
            ₹{totalCOGS.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Direct dish prep cost</span>
        </div>

        {/* Operating Expenses */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cafe Expenses</span>
          <div className="text-2xl sm:text-3xl font-black text-red-600 mt-1.5">
            ₹{totalExpenses.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500 mt-1 block">Gas, electricity, packaging</span>
        </div>

        {/* Net Profit */}
        <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-sm">
          <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Net Real Profit</span>
          <div className="text-2xl sm:text-3xl font-black mt-1.5">
            ₹{netProfit.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-100 mt-1 block">Gross Profit minus Expenses</span>
        </div>
      </div>

      {/* Row 2: Charts & Deep Dives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Payment Channels Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-gray-900">Payment Modes Breakdown</h3>
            <span className="text-xs font-bold text-gray-500">₹{totalRevenue}</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Cash Payments', val: paymentBreakdown.cash, color: 'bg-emerald-500', barColor: '#10b981' },
              { label: 'UPI / QR Payments', val: paymentBreakdown.upi, color: 'bg-purple-500', barColor: '#a855f7' },
              { label: 'Customer Udhaar', val: paymentBreakdown.udhaar, color: 'bg-amber-500', barColor: '#f59e0b' }
            ].map(item => {
              const pct = totalRevenue > 0 ? ((item.val / totalRevenue) * 100).toFixed(1) : '0';
              return (
                <div key={item.label} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="text-gray-900">₹{item.val} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
            <span className="font-medium text-gray-600">Pending Customer Udhaar:</span>
            <span className="font-black text-amber-700">₹{pendingUdhaar}</span>
          </div>
        </div>

        {/* Order Types & Dine-in vs Takeaway */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-gray-900">Order Channel Volumes</h3>
            <span className="text-xs font-bold text-gray-500">{nonRefundedBills.length} Orders</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100">
              <span className="text-[11px] font-bold text-orange-800">Dine-In</span>
              <div className="text-2xl font-black text-orange-950 mt-1">
                {orderTypeBreakdown.dineIn}
              </div>
              <span className="text-[10px] text-orange-600">Tables served</span>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
              <span className="text-[11px] font-bold text-blue-800">Takeaway</span>
              <div className="text-2xl font-black text-blue-950 mt-1">
                {orderTypeBreakdown.takeaway}
              </div>
              <span className="text-[10px] text-blue-600">Parcel orders</span>
            </div>

            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
              <span className="text-[11px] font-bold text-purple-800">Delivery</span>
              <div className="text-2xl font-black text-purple-950 mt-1">
                {orderTypeBreakdown.delivery}
              </div>
              <span className="text-[10px] text-purple-600">Dispatched</span>
            </div>
          </div>

          {/* Average metrics */}
          <div className="space-y-2 pt-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-slate-50">
              <span className="text-gray-600 font-medium">Average Revenue Per Order:</span>
              <span className="font-black text-gray-900">
                ₹{nonRefundedBills.length > 0 ? (totalRevenue / nonRefundedBills.length).toFixed(1) : 0}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-50">
              <span className="text-gray-600 font-medium">Overall Profit Margin:</span>
              <span className="font-black text-emerald-700">
                {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Sellers Leaderboard */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-sm text-gray-900">Top 5 Best-Selling Dishes</h3>
          </div>
          <span className="text-xs text-gray-500">Sorted by Units Sold</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-200">
                <th className="p-3">Rank</th>
                <th className="p-3">Dish Name</th>
                <th className="p-3 text-center">Units Sold</th>
                <th className="p-3 text-right">Revenue Generated</th>
                <th className="p-3 text-right">Gross Profit Contributed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bestSellers.map((it, idx) => (
                <tr key={it.name} className="hover:bg-slate-50">
                  <td className="p-3 font-black text-amber-600">#{idx + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FoodIllustration type={it.illustration} className="w-6 h-6" />
                      <span className="font-bold text-gray-900">{it.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold text-gray-800">{it.qty} plates</td>
                  <td className="p-3 text-right font-black text-gray-900">₹{it.revenue}</td>
                  <td className="p-3 text-right font-bold text-emerald-700">₹{it.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
