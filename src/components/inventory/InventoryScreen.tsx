import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PackagePlus,
  Filter,
  ArrowUpDown,
  Download,
  IndianRupee
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem } from '../../types';
import { FoodIllustration } from '../illustrations/FoodIllustrations';

export const InventoryScreen: React.FC = () => {
  const {
    menuItems,
    categories,
    suppliers,
    addStockRefill,
    updateMenuItem,
    t,
    language
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStockStatus, setFilterStockStatus] = useState<'all' | 'low' | 'out'>('all');

  // Refill Modal state
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [targetItem, setTargetItem] = useState<MenuItem | null>(null);
  const [refillSupplierId, setRefillSupplierId] = useState(suppliers[0]?.id || '');
  const [refillQuantity, setRefillQuantity] = useState(20);
  const [refillRate, setRefillRate] = useState(35);
  const [refillPaymentMethod, setRefillPaymentMethod] = useState('Cash');
  const [refillNotes, setRefillNotes] = useState('');

  // Quick edit stock modal
  const [showEditStockModal, setShowEditStockModal] = useState(false);
  const [editItemStock, setEditItemStock] = useState<number>(0);
  const [editItemMinStock, setEditItemMinStock] = useState<number>(0);

  // Metrics
  const totalItems = menuItems.length;
  const lowStockItems = menuItems.filter(m => m.stock <= m.minimumStock && m.stock > 0);
  const outOfStockItems = menuItems.filter(m => m.stock <= 0);
  const totalStockValue = menuItems.reduce((sum, m) => sum + m.stock * m.costPrice, 0);

  // Filtered Items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nameMr && item.nameMr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.nameHi && item.nameHi.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      filterCategory === 'all' || item.categoryId === filterCategory;

    let matchesStock = true;
    if (filterStockStatus === 'low') {
      matchesStock = item.stock <= item.minimumStock && item.stock > 0;
    } else if (filterStockStatus === 'out') {
      matchesStock = item.stock <= 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenRefill = (item: MenuItem) => {
    setTargetItem(item);
    setRefillRate(item.costPrice);
    setRefillQuantity(20);
    setRefillNotes(`Restock ${item.name}`);
    setShowRefillModal(true);
  };

  const handleRefillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetItem) return;
    addStockRefill(
      refillSupplierId || suppliers[0]?.id || 's1',
      targetItem.id,
      Number(refillQuantity),
      Number(refillRate),
      refillPaymentMethod,
      refillNotes
    );
    setShowRefillModal(false);
  };

  const handleOpenEditStock = (item: MenuItem) => {
    setTargetItem(item);
    setEditItemStock(item.stock);
    setEditItemMinStock(item.minimumStock);
    setShowEditStockModal(true);
  };

  const handleEditStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetItem) return;
    updateMenuItem({
      ...targetItem,
      stock: Number(editItemStock),
      minimumStock: Number(editItemMinStock)
    });
    setShowEditStockModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-orange-600" />
            <span>{t('inventoryTitle')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Track real-time stock levels, purchase prices, low-stock thresholds, and re-order supplies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (menuItems.length > 0) {
                handleOpenRefill(menuItems[0]);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <PackagePlus className="w-4 h-4" />
            <span>{t('recordPurchase')}</span>
          </button>
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Stock Value */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('stockValue')}</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            ₹{totalStockValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">At item cost price</span>
        </div>

        {/* Total Items */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('totalItems')}</span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            {totalItems}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Active dishes & beverages</span>
        </div>

        {/* Low Stock Count */}
        <div
          onClick={() => setFilterStockStatus(filterStockStatus === 'low' ? 'all' : 'low')}
          className={`p-4 rounded-2xl border shadow-sm cursor-pointer transition-colors ${
            lowStockItems.length > 0
              ? 'bg-amber-50 border-amber-300 hover:border-amber-400'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              {t('lowStockCount')}
            </span>
            {lowStockItems.length > 0 && <AlertTriangle className="w-4 h-4 text-amber-600" />}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800 mt-2">
            {lowStockItems.length}
          </div>
          <span className="text-[11px] text-amber-700 mt-1 block">Need immediate refill</span>
        </div>

        {/* Out of Stock Count */}
        <div
          onClick={() => setFilterStockStatus(filterStockStatus === 'out' ? 'all' : 'out')}
          className={`p-4 rounded-2xl border shadow-sm cursor-pointer transition-colors ${
            outOfStockItems.length > 0
              ? 'bg-red-50 border-red-300 hover:border-red-400'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-800 uppercase tracking-wider">
              Out of Stock
            </span>
            {outOfStockItems.length > 0 && <XCircle className="w-4 h-4 text-red-600" />}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-800 mt-2">
            {outOfStockItems.length}
          </div>
          <span className="text-[11px] text-red-600 mt-1 block">Unavailable to bill</span>
        </div>
      </div>

      {/* Main Stock Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Controls Bar: Search & Category Filter */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dish or ingredient..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="bg-slate-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-700 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterStockStatus('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  filterStockStatus === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStockStatus('low')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  filterStockStatus === 'low'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                Low ({lowStockItems.length})
              </button>
              <button
                onClick={() => setFilterStockStatus('out')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                  filterStockStatus === 'out'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                Out ({outOfStockItems.length})
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Showing {filteredItems.length} of {menuItems.length} items
          </div>
        </div>

        {/* Phone Cards View (< md) */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              No inventory items found
            </div>
          ) : (
            filteredItems.map(item => {
              const isLow = item.stock <= item.minimumStock && item.stock > 0;
              const isOut = item.stock <= 0;
              const margin = ((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100;

              return (
                <div key={item.id} className="p-3 bg-white space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FoodIllustration type={item.illustration} className="w-8 h-8 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-gray-900 truncate">{item.name}</div>
                        <div className="text-[10px] text-gray-500 capitalize">{item.categoryId.replace('_', ' ')} • Unit: {item.unit}</div>
                      </div>
                    </div>
                    <div>
                      {isOut ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-100 text-red-800">
                          Out
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-900">
                          Low
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                          In Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-xl border border-gray-100 text-center">
                    <div>
                      <span className="text-[9px] text-gray-500 block uppercase font-bold">Stock</span>
                      <span
                        onClick={() => handleOpenEditStock(item)}
                        className={`font-black text-xs cursor-pointer ${
                          isOut ? 'text-red-700' : isLow ? 'text-amber-800' : 'text-gray-900'
                        }`}
                      >
                        {item.stock} {item.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 block uppercase font-bold">Cost / Sell</span>
                      <span className="font-extrabold text-xs text-gray-800">
                        ₹{item.costPrice} / ₹{item.sellingPrice}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 block uppercase font-bold">Margin</span>
                      <span className="font-bold text-xs text-emerald-700">
                        {margin.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-0.5">
                    <button
                      onClick={() => handleOpenEditStock(item)}
                      className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Adjust Stock
                    </button>
                    <button
                      onClick={() => handleOpenRefill(item)}
                      className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      + Refill
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Stock Items Table (Desktop >= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-200">
                <th className="p-3">Item Details</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">Current Stock</th>
                <th className="p-3 text-center">Min Level</th>
                <th className="p-3 text-right">Cost Price</th>
                <th className="p-3 text-right">Selling Price</th>
                <th className="p-3 text-right">Margin</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map(item => {
                const isLow = item.stock <= item.minimumStock && item.stock > 0;
                const isOut = item.stock <= 0;
                const margin = ((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Item */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <FoodIllustration type={item.illustration} className="w-8 h-8 shrink-0" />
                        <div>
                          <div className="font-bold text-gray-900">{item.name}</div>
                          <div className="text-[10px] text-gray-500">
                            Unit: {item.unit}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3 capitalize font-medium text-gray-600">
                      {item.categoryId.replace('_', ' ')}
                    </td>

                    {/* Current Stock */}
                    <td className="p-3 text-center">
                      <span
                        onClick={() => handleOpenEditStock(item)}
                        className={`inline-block px-2.5 py-1 rounded-lg font-black text-xs cursor-pointer ${
                          isOut
                            ? 'bg-red-100 text-red-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-900 font-bold'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                        title="Click to adjust stock"
                      >
                        {item.stock} {item.unit}
                      </span>
                    </td>

                    {/* Min Stock */}
                    <td className="p-3 text-center text-gray-500 font-medium">
                      {item.minimumStock} {item.unit}
                    </td>

                    {/* Cost */}
                    <td className="p-3 text-right font-medium text-gray-600">
                      ₹{item.costPrice}
                    </td>

                    {/* Selling */}
                    <td className="p-3 text-right font-bold text-gray-900">
                      ₹{item.sellingPrice}
                    </td>

                    {/* Margin */}
                    <td className="p-3 text-right">
                      <span className="font-bold text-emerald-700">
                        {margin.toFixed(0)}%
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3 text-center">
                      {isOut ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800">
                          {t('statusOutOfStock')}
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900">
                          {t('statusLowStock')}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {t('statusInStock')}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenRefill(item)}
                        className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        + Refill
                      </button>
                      <button
                        onClick={() => handleOpenEditStock(item)}
                        className="px-2 py-1 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* REFILL STOCK MODAL */}
      {showRefillModal && targetItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleRefillSubmit}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <FoodIllustration type={targetItem.illustration} className="w-10 h-10" />
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Refill Stock</h3>
                <p className="text-xs text-gray-500">{targetItem.name} (Current: {targetItem.stock})</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Select Supplier</label>
              <select
                value={refillSupplierId}
                onChange={e => setRefillSupplierId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Add Quantity ({targetItem.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  value={refillQuantity}
                  onChange={e => setRefillQuantity(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-black text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Purchase Rate / Unit (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={refillRate}
                  onChange={e => setRefillRate(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-black text-gray-900"
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs font-bold">
              <span className="text-gray-600">Total Purchase Amount:</span>
              <span className="text-orange-600 text-sm font-black">
                ₹{refillQuantity * refillRate}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Payment Method</label>
              <select
                value={refillPaymentMethod}
                onChange={e => setRefillPaymentMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
              >
                <option value="Cash">Cash (Deduct from Register)</option>
                <option value="UPI">UPI / Online</option>
                <option value="Credit">Supplier Credit (Pay Later)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Notes</label>
              <input
                type="text"
                value={refillNotes}
                onChange={e => setRefillNotes(e.target.value)}
                placeholder="Bill / invoice ref, brand details"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer"
              >
                Confirm Stock Refill
              </button>
              <button
                type="button"
                onClick={() => setShowRefillModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QUICK EDIT STOCK MODAL */}
      {showEditStockModal && targetItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleEditStockSubmit}
            className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <h3 className="font-extrabold text-base text-gray-900">Adjust Stock Count</h3>
            <p className="text-xs text-gray-500">{targetItem.name}</p>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Actual Physical Stock ({targetItem.unit})
              </label>
              <input
                type="number"
                min="0"
                value={editItemStock}
                onChange={e => setEditItemStock(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm font-black text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Minimum Warning Stock
              </label>
              <input
                type="number"
                min="0"
                value={editItemMinStock}
                onChange={e => setEditItemMinStock(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold text-gray-700"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowEditStockModal(false)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
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
