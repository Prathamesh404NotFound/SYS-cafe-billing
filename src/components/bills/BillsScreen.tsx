import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Calendar,
  Filter,
  Printer,
  RotateCcw,
  IndianRupee,
  Eye,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Tag,
  Clock,
  User,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Bill } from '../../types';

export const BillsScreen: React.FC = () => {
  const { bills, refundBill, setActiveReceiptBill, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null);

  const filteredBills = bills.filter(b => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      b.billNumber.toLowerCase().includes(q) ||
      (b.customerName && b.customerName.toLowerCase().includes(q)) ||
      (b.customerPhone && b.customerPhone.includes(q));

    const matchesPayment = filterPayment === 'all' || b.paymentMethod === filterPayment;
    const matchesType = filterType === 'all' || b.orderType === filterType;

    return matchesSearch && matchesPayment && matchesType;
  });

  const totalSalesFiltered = filteredBills.reduce((s, b) => s + (b.isRefunded ? 0 : b.total), 0);
  const totalProfitFiltered = filteredBills.reduce((s, b) => s + (b.isRefunded ? 0 : b.profit), 0);

  const handleRefundClick = (bill: Bill) => {
    if (confirm(`Are you sure you want to refund and cancel Bill #${bill.billNumber}? Stock will be automatically restocked.`)) {
      refundBill(bill.id, 'Cancelled & Refunded by Cashier');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Bill No', 'Date', 'Customer', 'Phone', 'Order Type', 'Payment', 'Subtotal', 'Discount', 'Total', 'Profit', 'Status'];
    const rows = filteredBills.map(b => [
      b.billNumber,
      `"${b.createdAt}"`,
      `"${b.customerName || 'Walk-in'}"`,
      `"${b.customerPhone || ''}"`,
      b.orderType,
      b.paymentMethod,
      b.subtotal,
      b.discount,
      b.total,
      b.profit,
      b.isRefunded ? 'Refunded' : 'Paid'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sys_cafe_bills_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleExpand = (id: string) => {
    setExpandedBillId(prev => (prev === id ? null : id));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/80 p-4 sm:p-6 lg:p-8 custom-scrollbar space-y-6 pb-24 md:pb-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <Receipt className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-gray-900 tracking-tight">
                {t('billsHistoryTitle')}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Detailed transaction records, customer receipts, order items and tax breakdowns
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:border-gray-400 hover:bg-slate-50 text-gray-700 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Excel / CSV</span>
        </button>
      </div>

      {/* Summary Chips - Clean, spacious cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-0">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm relative z-0 min-w-0">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Bills</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1.5">{filteredBills.length}</div>
          <p className="text-[11px] text-gray-500 mt-1">Orders processed</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm relative z-0 min-w-0">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1.5 truncate">₹{totalSalesFiltered.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Gross paid volume</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm relative z-0 min-w-0">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Net Profit</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1.5 truncate">₹{totalProfitFiltered.toLocaleString()}</div>
          <p className="text-[11px] text-gray-500 mt-1">After ingredient cost</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm relative z-0 min-w-0">
          <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">Average Bill</span>
          <div className="text-2xl sm:text-3xl font-black text-orange-600 mt-1.5 truncate">
            ₹{filteredBills.length > 0 ? Math.round(totalSalesFiltered / filteredBills.length) : 0}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Per transaction ticket</p>
        </div>
      </div>

      {/* Main Table / List Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Search & Filter Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Bill #, customer name, mobile..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all shadow-sm"
              />
            </div>

            {/* Payment Filter */}
            <select
              value={filterPayment}
              onChange={e => setFilterPayment(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-700 shadow-sm focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Payment Methods</option>
              <option value="cash">Cash Only</option>
              <option value="upi">UPI / Online</option>
              <option value="udhaar">Udhaar (Credit)</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-700 shadow-sm focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Order Types</option>
              <option value="dine_in">Dine-In</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
              <option value="parcel">Parcel</option>
            </select>
          </div>

          <div className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{filteredBills.length} bills listed</span>
          </div>
        </div>

        {/* Empty State */}
        {filteredBills.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
              <Receipt className="w-7 h-7 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-800">No bills found</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                {bills.length === 0
                  ? "You have a fresh database. Orders completed at the POS checkout screen will be recorded here with full thermal slip records."
                  : "No bills match your current search and filter settings. Try adjusting your query."}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Mobile / Tablet Friendly Cards View (< lg) */}
            <div className="lg:hidden divide-y divide-gray-100">
              {filteredBills.map(b => {
                const isExpanded = expandedBillId === b.id;
                return (
                  <div
                    key={b.id}
                    className={`p-4 transition-all ${
                      b.isRefunded ? 'bg-red-50/30' : 'bg-white hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Top Row: Bill No & Total */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-gray-900">
                            {b.billNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide ${
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
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold capitalize">
                            {b.orderType.replace('_', ' ')}
                            {b.tableNumber ? ` (T-${b.tableNumber})` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{b.createdAt}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-base text-gray-900">₹{b.total}</span>
                        <div className="text-[11px] font-bold text-emerald-600">
                          Profit: ₹{b.profit}
                        </div>
                      </div>
                    </div>

                    {/* Customer Row */}
                    <div className="mt-3 flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 border border-gray-100">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-bold text-gray-800">{b.customerName || 'Walk-in Customer'}</span>
                        {b.customerPhone && (
                          <span className="text-gray-400 font-mono text-[11px]">({b.customerPhone})</span>
                        )}
                      </div>
                      <span className="text-gray-500 text-[11px]">
                        {b.items.reduce((s, i) => s + i.quantity, 0)} items
                      </span>
                    </div>

                    {/* Collapsible Order Items Details */}
                    {isExpanded && (
                      <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2 animate-in fade-in duration-150">
                        <div className="font-bold text-gray-700 text-[11px] uppercase tracking-wider">
                          Ordered Dishes Breakdown
                        </div>
                        <div className="space-y-1.5">
                          {b.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-gray-700">
                              <div>
                                <span className="font-semibold">{item.name}</span>
                                {item.variantName && (
                                  <span className="ml-1 text-[10px] text-gray-500">({item.variantName})</span>
                                )}
                                <span className="text-gray-400 ml-1.5">× {item.quantity}</span>
                              </div>
                              <span className="font-bold font-mono">₹{item.sellingPrice * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        {b.discount > 0 && (
                          <div className="pt-2 border-t border-gray-200 flex justify-between text-orange-700 font-bold">
                            <span>Discount Applied:</span>
                            <span>-₹{b.discount}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions Bar */}
                    <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleExpand(b.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide items' : 'View dishes'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveReceiptBill(b)}
                          className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                        {!b.isRefunded && (
                          <button
                            onClick={() => handleRefundClick(b)}
                            className="p-1.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                            title="Cancel & Restock"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= lg) - Roomy with generous padding */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                    <th className="py-3.5 px-5">Bill Details</th>
                    <th className="py-3.5 px-5">Customer</th>
                    <th className="py-3.5 px-5">Order Items</th>
                    <th className="py-3.5 px-4 text-center">Type</th>
                    <th className="py-3.5 px-4 text-center">Payment</th>
                    <th className="py-3.5 px-5 text-right">Total Amount</th>
                    <th className="py-3.5 px-4 text-right">Profit</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBills.map(b => (
                    <React.Fragment key={b.id}>
                      <tr
                        className={`hover:bg-slate-50/80 transition-colors ${
                          b.isRefunded ? 'bg-red-50/30 text-gray-400' : ''
                        }`}
                      >
                      {/* Bill details */}
                      <td className="py-4 px-5">
                        <div className="font-mono font-black text-sm text-gray-900">
                          {b.billNumber}
                        </div>
                        <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                          {b.createdAt}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-gray-900">
                          {b.customerName || 'Walk-in'}
                        </div>
                        {b.customerPhone ? (
                          <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                            {b.customerPhone}
                          </div>
                        ) : (
                          <div className="text-[11px] text-gray-400 mt-0.5">No contact</div>
                        )}
                      </td>

                      {/* Items Summary */}
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap items-center gap-1.5 max-w-sm">
                          {b.items.slice(0, 2).map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-gray-200/80 text-[11px] font-semibold text-gray-800"
                            >
                              <span className="font-bold text-orange-600">{item.quantity}×</span>
                              <span className="truncate max-w-[110px]">{item.name}</span>
                              {item.variantName && (
                                <span className="text-[9px] text-gray-500">({item.variantName})</span>
                              )}
                            </span>
                          ))}
                          {b.items.length > 2 && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(b.id)}
                              className="text-[10px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                            >
                              +{b.items.length - 2} more
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-400">
                            {b.items.reduce((s, i) => s + i.quantity, 0)} items total
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleExpand(b.id)}
                            className="text-[11px] font-bold text-gray-500 hover:text-gray-800 inline-flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>{expandedBillId === b.id ? 'Hide items' : 'View dishes'}</span>
                            {expandedBillId === b.id ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Order Type */}
                      <td className="py-4 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold capitalize">
                          {b.orderType.replace('_', ' ')}
                          {b.tableNumber ? ` (T-${b.tableNumber})` : ''}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
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

                      {/* Total */}
                      <td className="py-4 px-5 text-right font-black text-gray-900 text-base">
                        ₹{b.total}
                        {b.discount > 0 && (
                          <div className="text-[10px] font-medium text-orange-600">
                            -₹{b.discount} disc
                          </div>
                        )}
                      </td>

                      {/* Profit */}
                      <td className="py-4 px-4 text-right font-black text-emerald-700 text-sm">
                        ₹{b.profit}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        {b.isRefunded ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                            REFUNDED
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            PAID
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveReceiptBill(b)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Slip</span>
                          </button>
                          {!b.isRefunded && (
                            <button
                              onClick={() => handleRefundClick(b)}
                              className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                              title="Cancel & Restock"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Desktop Expanded Order Items Sub-row */}
                    {expandedBillId === b.id && (
                      <tr key={`${b.id}-details`} className="bg-slate-50/90 border-b border-gray-200 animate-in fade-in duration-150">
                        <td colSpan={9} className="py-3 px-6">
                          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                              <span className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">
                                Full Order Items Breakdown for {b.billNumber}
                              </span>
                              <span className="text-xs text-gray-500 font-medium">
                                Cashier: {b.createdBy} · {b.createdAt}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {b.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="p-2.5 rounded-lg bg-slate-50 border border-gray-200/80 flex items-center justify-between text-xs"
                                >
                                  <div>
                                    <span className="font-bold text-gray-900 block">{item.name}</span>
                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                                      <span>Rate: ₹{item.sellingPrice}</span>
                                      {item.variantName && (
                                        <span className="text-orange-600 font-semibold">({item.variantName})</span>
                                      )}
                                      <span>× {item.quantity}</span>
                                    </div>
                                  </div>
                                  <span className="font-mono font-bold text-gray-900 text-sm">
                                    ₹{item.sellingPrice * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-600">
                              <div>
                                {b.discount > 0 && (
                                  <span className="text-orange-600 font-bold mr-4">Discount Applied: -₹{b.discount}</span>
                                )}
                                <span>Subtotal: ₹{b.subtotal}</span>
                              </div>
                              <div className="font-black text-gray-900 text-sm">
                                Total Bill: <span className="text-orange-600">₹{b.total}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

