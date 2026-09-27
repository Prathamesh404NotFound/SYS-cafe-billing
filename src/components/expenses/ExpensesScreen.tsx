import React, { useState } from 'react';
import {
  Wallet,
  Search,
  Plus,
  IndianRupee,
  Calendar,
  Tag,
  Filter,
  ArrowDownRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory } from '../../types';

export const ExpensesScreen: React.FC = () => {
  const { expenses, addExpense, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Packaging');
  const [formAmount, setFormAmount] = useState<number | ''>(350);
  const [formPaymentMethod, setFormPaymentMethod] = useState('Cash');
  const [formDescription, setFormDescription] = useState('');

  const categoriesList: ExpenseCategory[] = [
    'Electricity',
    'Gas',
    'Rent',
    'Staff',
    'Raw Material',
    'Packaging',
    'Maintenance',
    'Delivery',
    'Marketing',
    'Misc'
  ];

  const filteredExpenses = expenses.filter(exp => {
    const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
    const matchesSearch =
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalExpenseSum = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount) return;
    addExpense(formCategory, Number(formAmount), formPaymentMethod, formDescription);
    setShowAddModal(false);
    setFormDescription('');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-red-500" />
            <span>{t('expensesTitle')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Log overhead, LPG cylinder refills, electricity, dairy supplies and daily staff allowances.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('addExpenseBtn')}</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Expenses Logged
            </span>
            <div className="text-2xl sm:text-3xl font-black text-red-700 mt-2">
              ₹{totalExpenseSum.toLocaleString()}
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">Across {expenses.length} records</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Cash Drawer Deductions
            </span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
              ₹{expenses.filter(e => e.paymentMethod.toLowerCase() === 'cash').reduce((s, e) => s + e.amount, 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">Paid directly from register</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Top Expense Category
            </span>
            <div className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
              LPG Gas & Electric
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">Kitchen operations</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Tag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Expenses List Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search description, bill ref..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:bg-white"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-gray-200 rounded-lg py-1.5 px-3 text-xs font-bold text-gray-700"
            >
              <option value="all">All Categories</option>
              {categoriesList.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs font-medium text-gray-500">
            Showing {filteredExpenses.length} entries
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-200">
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Payment Mode</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-gray-600 font-mono text-[11px] whitespace-nowrap">
                    {exp.date}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-100 text-slate-800">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-gray-800">{exp.description}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                      {exp.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3 text-right font-black text-red-600 text-sm">
                    ₹{exp.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <h3 className="font-extrabold text-base text-gray-900">{t('addExpenseBtn')}</h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Expense Category</label>
              <select
                value={formCategory}
                onChange={e => setFormCategory(e.target.value as ExpenseCategory)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Amount (₹)</label>
              <input
                type="number"
                min="1"
                value={formAmount}
                onChange={e => setFormAmount(e.target.value ? Number(e.target.value) : '')}
                placeholder="250"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm font-black text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Payment Method</label>
              <select
                value={formPaymentMethod}
                onChange={e => setFormPaymentMethod(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
              >
                <option value="Cash">Cash (Deducts from Cash Register)</option>
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Bank">Bank Account Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Description / Vendor Note
              </label>
              <textarea
                rows={2}
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="e.g. 50 plastic takeaway cups, 2 tape rolls"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs"
              >
                Record Expense
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
