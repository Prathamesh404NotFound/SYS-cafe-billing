import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageCircle,
  Award,
  CreditCard,
  UserCheck,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';

export const CustomersScreen: React.FC = () => {
  const { customers, addCustomer, businessProfile, setActiveTab, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    addCustomer({
      name: name.trim(),
      phone: phone.trim(),
      notes: notes.trim() || undefined
    });
    setName('');
    setPhone('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-600" />
            <span>{t('customersTitle')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Customer directory, loyalty points, visit histories and WhatsApp contact.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Customer</span>
        </button>
      </div>

      {/* Search & List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer by name or phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div className="text-xs font-bold text-gray-500">
            {filteredCustomers.length} Customers Registered
          </div>
        </div>

        {/* Grid of Customer Cards */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map(customer => {
            const waUrl = `https://wa.me/91${customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `Hello ${customer.name}! Greetings from ${businessProfile.name}. We hope you enjoyed your visit!`
            )}`;

            return (
              <div
                key={customer.id}
                className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">{customer.name}</h4>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{customer.phone}</p>
                    </div>
                    {customer.udhaarBalance > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900">
                        Due: ₹{customer.udhaarBalance}
                      </span>
                    )}
                  </div>

                  <div className="my-3 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-[10px] text-gray-400 block">Orders</span>
                      <span className="font-black text-xs text-gray-900">
                        {customer.totalOrders}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-[10px] text-gray-400 block">Spent</span>
                      <span className="font-black text-xs text-emerald-700">
                        ₹{customer.totalSpent}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-[10px] text-gray-400 block">Points</span>
                      <span className="font-black text-xs text-orange-600">
                        {Math.floor(customer.totalSpent / 50)}
                      </span>
                    </div>
                  </div>

                  {customer.notes && (
                    <p className="text-[11px] text-gray-500 italic truncate">
                      Note: {customer.notes}
                    </p>
                  )}
                </div>

                {/* Natural buttons inside card (NO floating buttons!) */}
                <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5">
                  <a
                    href={`tel:${customer.phone}`}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-orange-500" />
                    <span>Call</span>
                  </a>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>

                  {customer.udhaarBalance > 0 && (
                    <button
                      onClick={() => setActiveTab('udhaar')}
                      className="py-1.5 px-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Udhaar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD CUSTOMER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4"
          >
            <h3 className="font-extrabold text-base text-gray-900">Register New Customer</h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Customer Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="10 digit mobile"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Notes / Preferences</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Regular cold coffee lover"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer"
              >
                Save Customer
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs cursor-pointer"
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
