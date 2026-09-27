import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Calendar,
  Truck,
  IndianRupee,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PurchasesScreen: React.FC = () => {
  const { purchases, suppliers, menuItems, addStockRefill, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [itemId, setItemId] = useState(menuItems[0]?.id || '');
  const [quantity, setQuantity] = useState(50);
  const [rate, setRate] = useState(25);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');

  const filteredPurchases = purchases.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.itemName.toLowerCase().includes(q) ||
      p.supplierName.toLowerCase().includes(q) ||
      p.paymentMethod.toLowerCase().includes(q)
    );
  });

  const totalPurchasesAmount = purchases.reduce((sum, p) => sum + p.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStockRefill(supplierId, itemId, Number(quantity), Number(rate), paymentMethod, notes);
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-orange-600" />
            <span>{t('navPurchases')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Log raw material, bun, dairy, syrup and packaging purchases and inventory refills.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('recordPurchase')}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Purchase Value</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            ₹{totalPurchasesAmount.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Recorded refills</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Invoices</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            {purchases.length}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Refill transactions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Suppliers</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            {suppliers.length}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Bakery, Dairy, Groceries</span>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search purchase, item or supplier..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div className="text-xs font-medium text-gray-500">
            Showing {filteredPurchases.length} purchase records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-200">
                <th className="p-3">Date</th>
                <th className="p-3">Item / Description</th>
                <th className="p-3">Supplier</th>
                <th className="p-3 text-center">Quantity</th>
                <th className="p-3 text-right">Rate / Unit</th>
                <th className="p-3 text-right">Total Amount</th>
                <th className="p-3 text-center">Payment</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPurchases.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-gray-600 font-mono text-[11px] whitespace-nowrap">
                    {p.date}
                  </td>
                  <td className="p-3 font-bold text-gray-900">{p.itemName}</td>
                  <td className="p-3 text-gray-700 font-medium">{p.supplierName}</td>
                  <td className="p-3 text-center font-bold text-gray-800">
                    {p.quantity} {p.unit}
                  </td>
                  <td className="p-3 text-right text-gray-600">₹{p.purchasePrice}</td>
                  <td className="p-3 text-right font-black text-gray-900">₹{p.total}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 text-[11px] italic max-w-xs truncate">
                    {p.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PURCHASE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <h3 className="font-extrabold text-base text-gray-900">{t('recordPurchase')}</h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Supplier</label>
                <select
                  value={supplierId}
                  onChange={e => setSupplierId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Item to Refill</label>
                <select
                  value={itemId}
                  onChange={e => {
                    setItemId(e.target.value);
                    const selected = menuItems.find(m => m.id === e.target.value);
                    if (selected) setRate(selected.costPrice);
                  }}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium"
                >
                  {menuItems.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Rate / Unit (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={rate}
                  onChange={e => setRate(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs font-bold">
              <span className="text-gray-600">Total Purchase Amount:</span>
              <span className="text-orange-600 text-base font-black">
                ₹{quantity * rate}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
              >
                <option value="Cash">Cash (Deduct from Register)</option>
                <option value="UPI">UPI / Online Transfer</option>
                <option value="Bank Transfer">Bank NEFT/RTGS</option>
                <option value="Credit">Credit (Pay Later)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Invoice Notes / Batch</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Bill number, supplier invoice..."
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs"
              >
                Record Purchase & Restock
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
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
