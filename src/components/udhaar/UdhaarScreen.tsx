import React, { useState } from 'react';
import {
  CreditCard,
  Phone,
  MessageCircle,
  Search,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  CheckCircle2,
  Calendar,
  IndianRupee,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer, UdhaarTransaction } from '../../types';

export const UdhaarScreen: React.FC = () => {
  const {
    customers,
    udhaarTransactions,
    collectUdhaarPayment,
    addUdhaarCredit,
    addCustomer,
    businessProfile,
    t
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Modals
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  // Form states
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('');
  const [paymentNote, setPaymentNote] = useState('');
  const [creditAmount, setCreditAmount] = useState<number | ''>('');
  const [creditNote, setCreditNote] = useState('');

  // New Customer form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Filter customers with active udhaar balance or matching search
  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    const match =
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q);
    return match;
  });

  const totalOutstanding = customers.reduce((sum, c) => sum + c.udhaarBalance, 0);
  const totalDebtors = customers.filter(c => c.udhaarBalance > 0).length;
  const collectedToday = udhaarTransactions
    .filter(tx => tx.type === 'payment')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Open Collect Modal
  const handleOpenCollect = (cust: Customer) => {
    setSelectedCustomer(cust);
    setPaymentAmount(cust.udhaarBalance);
    setPaymentNote('Payment received via UPI / Cash');
    setShowCollectModal(true);
  };

  // Open Add Credit Modal
  const handleOpenCredit = (cust: Customer) => {
    setSelectedCustomer(cust);
    setCreditAmount('');
    setCreditNote('');
    setShowCreditModal(true);
  };

  // Open History Modal
  const handleOpenHistory = (cust: Customer) => {
    setSelectedCustomer(cust);
    setShowHistoryModal(true);
  };

  // Submit Collect
  const handleCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !paymentAmount) return;
    collectUdhaarPayment(selectedCustomer.id, Number(paymentAmount), paymentNote);
    setShowCollectModal(false);
  };

  // Submit Credit
  const handleCreditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !creditAmount) return;
    addUdhaarCredit(selectedCustomer.id, Number(creditAmount), creditNote);
    setShowCreditModal(false);
  };

  // Submit New Customer
  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    addCustomer({
      name: newName.trim(),
      phone: newPhone.trim(),
      notes: newNotes.trim() || undefined
    });
    setNewName('');
    setNewPhone('');
    setNewNotes('');
    setShowAddCustomerModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-600" />
            <span>{t('navUdhaar')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Manage customer credit accounts, track repayments and send WhatsApp reminders.
          </p>
        </div>

        <button
          onClick={() => setShowAddCustomerModal(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Customer</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Outstanding Udhaar */}
        <div className="bg-amber-500 text-white p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              {t('totalUdhaar')}
            </span>
            <div className="text-2xl sm:text-3xl font-black mt-1">
              ₹{totalOutstanding.toLocaleString()}
            </div>
            <span className="text-xs text-amber-100 mt-1 block">
              Across {totalDebtors} customers
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Collected Today */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('collectedToday')}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
              ₹{collectedToday.toLocaleString()}
            </div>
            <span className="text-xs text-gray-500 mt-1 block">Deposited into Register</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        {/* Total Debtors */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {t('activeDebtors')}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              {totalDebtors}
            </div>
            <span className="text-xs text-gray-500 mt-1 block">Pending Settlement</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Customer Udhaar List Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name or phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="text-xs font-bold text-gray-500">
            Showing {filteredCustomers.length} registered customers
          </div>
        </div>

        {/* Customer Cards Grid */}
        {filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <CreditCard className="w-10 h-10 mx-auto text-gray-300 mb-2 stroke-[1.5]" />
            <p className="font-bold text-sm text-gray-700">No udhaar records or customers found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Customer credit tabs or new accounts added during billing will be listed here with instant WhatsApp reminders.
            </p>
            <button
              type="button"
              onClick={() => setShowAddCustomerModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Customer</span>
            </button>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map(customer => {
            const hasDue = customer.udhaarBalance > 0;
            const waReminderText = `Hello ${customer.name}, friendly reminder from ${businessProfile.name}: Your pending bill balance is ₹${customer.udhaarBalance}. Kindly clear when convenient. Thank you!`;
            const waUrl = `https://wa.me/91${customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              waReminderText
            )}`;

            return (
              <div
                key={customer.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  hasDue
                    ? 'border-amber-300 bg-amber-50/40 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div>
                  {/* Top info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">{customer.name}</h4>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{customer.phone}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        hasDue
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {hasDue ? 'DUE' : 'CLEAR'}
                    </span>
                  </div>

                  {/* Balance Display */}
                  <div className="my-3 p-2.5 rounded-lg bg-white border border-gray-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">{t('outstanding')}:</span>
                    <span
                      className={`text-lg font-black ${
                        hasDue ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      ₹{customer.udhaarBalance}
                    </span>
                  </div>

                  {/* Customer summary */}
                  <div className="text-[11px] text-gray-500 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Total Visits:</span>
                      <span className="font-bold text-gray-700">{customer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lifetime Spent:</span>
                      <span className="font-bold text-gray-700">₹{customer.totalSpent}</span>
                    </div>
                    {customer.notes && (
                      <div className="text-gray-400 italic truncate pt-0.5">
                        Note: {customer.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions: Embedded Natural Buttons (NO FLOATING BUTTONS) */}
                <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                  {/* Call & WhatsApp buttons inside the card */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <a
                      href={`tel:${customer.phone}`}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-orange-500" />
                      <span>{t('call')}</span>
                    </a>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('whatsapp')}</span>
                    </a>
                  </div>

                  {/* Transaction Actions */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleOpenCollect(customer)}
                      disabled={customer.udhaarBalance <= 0}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      {t('collectPayment')}
                    </button>
                    <button
                      onClick={() => handleOpenCredit(customer)}
                      className="px-2.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      title="Add Manual Credit"
                    >
                      + Credit
                    </button>
                    <button
                      onClick={() => handleOpenHistory(customer)}
                      className="px-2 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg text-xs"
                      title="View Ledger History"
                    >
                      <History className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* COLLECT PAYMENT MODAL */}
      {showCollectModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCollectSubmit}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">{t('collectPayment')}</h3>
                <p className="text-xs text-gray-500">{selectedCustomer.name} ({selectedCustomer.phone})</p>
              </div>
              <span className="font-black text-amber-700 text-base">
                Due: ₹{selectedCustomer.udhaarBalance}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">{t('receivedAmount')} (₹)</label>
              <input
                type="number"
                min="1"
                max={selectedCustomer.udhaarBalance}
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm font-black text-gray-900 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Remaining balance preview */}
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs font-bold">
              <span className="text-gray-500">{t('remainingAmount')}:</span>
              <span className="text-gray-900 font-extrabold">
                ₹{Math.max(0, selectedCustomer.udhaarBalance - (Number(paymentAmount) || 0))}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Note / Reference</label>
              <input
                type="text"
                value={paymentNote}
                onChange={e => setPaymentNote(e.target.value)}
                placeholder="e.g. Paid in Cash, GPay ref #1234"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer"
              >
                {t('savePayment')}
              </button>
              <button
                type="button"
                onClick={() => setShowCollectModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD CREDIT MODAL */}
      {showCreditModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreditSubmit}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Add Credit to Tab</h3>
                <p className="text-xs text-gray-500">{selectedCustomer.name}</p>
              </div>
              <span className="font-black text-gray-900 text-base">
                Current: ₹{selectedCustomer.udhaarBalance}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Credit Amount (₹)</label>
              <input
                type="number"
                min="1"
                value={creditAmount}
                onChange={e => setCreditAmount(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 250"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm font-black text-gray-900 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Reason / Note</label>
              <input
                type="text"
                value={creditNote}
                onChange={e => setCreditNote(e.target.value)}
                placeholder="e.g. Cold Coffee and Burger pending payment"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer"
              >
                Add Credit
              </button>
              <button
                type="button"
                onClick={() => setShowCreditModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* HISTORY MODAL */}
      {showHistoryModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-200 space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Transaction Ledger</h3>
                <p className="text-xs text-gray-500">{selectedCustomer.name} • {selectedCustomer.phone}</p>
              </div>
              <span className="font-extrabold text-amber-700 text-base">
                Due: ₹{selectedCustomer.udhaarBalance}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {udhaarTransactions.filter(tx => tx.customerId === selectedCustomer.id).length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">No transaction history recorded yet</p>
              ) : (
                udhaarTransactions
                  .filter(tx => tx.customerId === selectedCustomer.id)
                  .map(tx => (
                    <div
                      key={tx.id}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        tx.type === 'payment'
                          ? 'border-emerald-200 bg-emerald-50/50'
                          : 'border-amber-200 bg-amber-50/50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold">
                          {tx.type === 'payment' ? (
                            <span className="text-emerald-700">Payment Received</span>
                          ) : (
                            <span className="text-amber-800">Credit Added</span>
                          )}
                          {tx.billNumber && (
                            <span className="text-[10px] text-gray-500">({tx.billNumber})</span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500">{tx.date}</div>
                        {tx.note && <div className="text-[11px] text-gray-600">{tx.note}</div>}
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-black text-sm ${
                            tx.type === 'payment' ? 'text-emerald-700' : 'text-amber-800'
                          }`}
                        >
                          {tx.type === 'payment' ? '-' : '+'}₹{tx.amount}
                        </span>
                        <div className="text-[10px] text-gray-400">
                          Bal: ₹{tx.remainingBalance}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCustomerSubmit}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4"
          >
            <h3 className="font-extrabold text-base text-gray-900">Register New Customer</h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Customer Name</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Full name"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                placeholder="10 digit mobile"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Notes / Preferences</label>
              <input
                type="text"
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                placeholder="e.g. Regular college student"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs"
              >
                Save Customer
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(false)}
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
