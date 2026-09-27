import React, { useState } from 'react';
import {
  Truck,
  Search,
  Plus,
  Phone,
  MessageCircle,
  IndianRupee,
  Building,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Supplier } from '../../types';

export const SuppliersScreen: React.FC = () => {
  const { suppliers, addSupplier, setActiveTab, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Dairy & Milk');
  const [address, setAddress] = useState('');

  const filteredSuppliers = suppliers.filter(s => {
    const q = searchQuery.toLowerCase();
    const catMatch = s.category ? s.category.toLowerCase().includes(q) : false;
    return (
      s.name.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      catMatch
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    addSupplier({
      name: name.trim(),
      contactPerson: contactPerson.trim() || undefined,
      phone: phone.trim(),
      whatsapp: phone.trim(),
      category,
      address: address.trim() || undefined,
      products: [category]
    });
    setName('');
    setContactPerson('');
    setPhone('');
    setAddress('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-orange-600" />
            <span>{t('suppliersTitle')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Vendor contact book for milk, bakery buns, syrups, ice cream and packaging boxes.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Supplier</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map(supplier => {
          const due = supplier.pendingPayment ?? supplier.pendingBalance ?? 0;
          return (
            <div
              key={supplier.id}
              className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-base text-gray-900">{supplier.name}</h4>
                    {supplier.category && (
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-orange-50 text-orange-800 uppercase">
                        {supplier.category}
                      </span>
                    )}
                  </div>
                  {due > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                      Payable: ₹{due}
                    </span>
                  )}
                </div>

                <div className="my-4 space-y-1 text-xs text-gray-600">
                  {supplier.contactPerson && (
                    <p>Contact: <span className="font-bold text-gray-800">{supplier.contactPerson}</span></p>
                  )}
                  <p>Phone: <span className="font-mono font-bold text-gray-800">{supplier.phone}</span></p>
                  {supplier.address && (
                    <p className="text-gray-400 truncate">{supplier.address}</p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${supplier.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-500" />
                  <span>Call Vendor</span>
                </a>

                <button
                  onClick={() => setActiveTab('purchases')}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Order Refill
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD SUPPLIER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4"
          >
            <h3 className="font-extrabold text-base text-gray-900">Add New Supplier</h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Company / Vendor Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Pune Dairy Fresh"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
              >
                <option value="Dairy & Milk">Dairy & Milk</option>
                <option value="Bakery & Buns">Bakery & Buns</option>
                <option value="Packaging & Cups">Packaging & Cups</option>
                <option value="Beverages & Syrups">Beverages & Syrups</option>
                <option value="Groceries & Spices">Groceries & Spices</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                placeholder="Agent / Manager name"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="10 digit phone"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Address / Market</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Market area, city"
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer"
              >
                Save Supplier
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
