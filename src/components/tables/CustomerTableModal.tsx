import React, { useState, useMemo } from 'react';
import {
  X,
  Coffee,
  Bell,
  Receipt,
  QrCode,
  CheckCircle2,
  UtensilsCrossed,
  Sparkles,
  Search,
  ExternalLink,
  Phone,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateUpiUri, generateQrDataUrl } from '../../utils/qrCode';
import { pushToRtdb, RTDB_PATHS } from '../../services/firebase';

interface CustomerTableModalProps {
  tableNumber: number;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerTableModal: React.FC<CustomerTableModalProps> = ({
  tableNumber,
  isOpen,
  onClose
}) => {
  const {
    tables,
    kitchenOrders,
    bills,
    menuItems,
    categories,
    businessProfile,
    updateTableStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState<'order' | 'menu' | 'pay'>('order');
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [callSent, setCallSent] = useState<string | null>(null);
  const [upiQrUrl, setUpiQrUrl] = useState<string>('');
  const [isCalling, setIsCalling] = useState(false);

  // Find table details
  const table = tables.find(t => Number(t.number) === Number(tableNumber)) || {
    id: `temp-${tableNumber}`,
    number: tableNumber,
    name: `Table ${tableNumber}`,
    status: 'available',
    capacity: 4
  };

  // Find active orders / kitchen tickets for this table
  const activeKitchen = kitchenOrders.filter(
    ko => String(ko.tableNumber) === String(tableNumber) && ko.status !== 'completed'
  );

  // Find latest bill for this table if any
  const latestBill = bills.find(
    b => String(b.tableNumber) === String(tableNumber) && !b.isRefunded
  );

  const activeItems = activeKitchen.flatMap(k => k.items);
  const totalAmount = table.orderTotal || latestBill?.total || 0;

  // Filtered menu items for browsing
  const filteredMenu = useMemo(() => {
    return menuItems.filter(item => {
      if (selectedCat !== 'all' && item.categoryId !== selectedCat) return false;
      if (menuSearch.trim()) {
        const q = menuSearch.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.nameMr?.toLowerCase().includes(q) ||
          item.nameHi?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [menuItems, selectedCat, menuSearch]);

  if (!isOpen) return null;

  // Call waiter or request bill via Firebase Realtime Database
  const handleCallService = async (type: 'waiter' | 'bill' | 'water') => {
    setIsCalling(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const message =
      type === 'bill'
        ? `Table ${tableNumber} requested the bill`
        : type === 'water'
        ? `Table ${tableNumber} requested drinking water`
        : `Table ${tableNumber} called for waiter assistance`;

    // Push to Firebase RTDB
    await pushToRtdb(RTDB_PATHS.CUSTOMER_CALLS, {
      id: `call-${Date.now()}`,
      tableNumber,
      type,
      message,
      timestamp: timeStr,
      status: 'pending'
    });

    if (type === 'bill') {
      updateTableStatus(table.id, 'bill_pending');
    }

    setIsCalling(false);
    setCallSent(type);
    setTimeout(() => setCallSent(null), 4000);
  };

  // Generate UPI QR for this table's running bill
  const handleOpenUpi = async () => {
    setActiveTab('pay');
    const amount = totalAmount > 0 ? totalAmount : 100;
    const upiUri = generateUpiUri({
      upiId: businessProfile.upiId,
      payeeName: businessProfile.name,
      amount,
      note: `Table-${tableNumber}-Bill`
    });

    try {
      const url = await generateQrDataUrl(upiUri, {
        width: 320,
        margin: 2,
        color: { dark: '#581c87', light: '#ffffff' }
      });
      setUpiQrUrl(url);
    } catch (e) {
      console.error('Error generating UPI QR', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-linear-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg leading-tight">
                  {businessProfile.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-900">
                  Table {tableNumber}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Digital Guest Portal · Powered by SYS Cafe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-gray-200 bg-slate-50 px-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('order')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
              activeTab === 'order'
                ? 'border-orange-500 text-orange-600 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Active Order
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
              activeTab === 'menu'
                ? 'border-orange-500 text-orange-600 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Browse Menu
          </button>
          <button
            type="button"
            onClick={handleOpenUpi}
            className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
              activeTab === 'pay'
                ? 'border-purple-600 text-purple-700 bg-white rounded-t-xl shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Pay via UPI
          </button>
        </div>

        {/* Call Feedback Banner */}
        {callSent && (
          <div className="bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {callSent === 'bill'
                  ? 'Bill request sent to counter! A waiter is coming with your bill.'
                  : callSent === 'water'
                  ? 'Water request sent! Fresh water is on the way.'
                  : 'Call sent! A waiter is heading to your table.'}
              </span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">Synced to Cloud</span>
          </div>
        )}

        {/* Tab 1: Active Table Order */}
        {activeTab === 'order' && (
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
            {/* Status card */}
            <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700 block">
                    Table Status
                  </span>
                  <div className="text-base font-black text-gray-900 mt-0.5">
                    {table.status === 'occupied'
                      ? 'Dine-In Session Active'
                      : table.status === 'bill_pending'
                      ? 'Bill Requested · Processing'
                      : 'Table Ready · Welcome!'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-500 block">Current Bill</span>
                  <div className="text-xl font-black text-orange-600">₹{totalAmount}</div>
                </div>
              </div>

              {table.seatedAt && (
                <div className="mt-2 pt-2 border-t border-orange-200/60 flex items-center gap-1.5 text-xs text-orange-900/80">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>Seated at {table.seatedAt}</span>
                </div>
              )}
            </div>

            {/* Quick Service Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isCalling}
                onClick={() => handleCallService('waiter')}
                className="p-3 bg-white border border-gray-200 hover:border-orange-500 hover:bg-orange-50 rounded-xl text-center flex flex-col items-center gap-1 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-800">Call Waiter</span>
              </button>

              <button
                type="button"
                disabled={isCalling}
                onClick={() => handleCallService('water')}
                className="p-3 bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl text-center flex flex-col items-center gap-1 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-800">Need Water</span>
              </button>

              <button
                type="button"
                disabled={isCalling}
                onClick={() => handleCallService('bill')}
                className="p-3 bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl text-center flex flex-col items-center gap-1 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Receipt className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-gray-800">Ask for Bill</span>
              </button>
            </div>

            {/* Active Dishes in Preparation or Served */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-xs text-gray-700 uppercase tracking-wider">
                  Dishes Ordered at this Table
                </h3>
                <span className="text-[11px] font-bold text-gray-500">
                  {activeItems.length > 0
                    ? `${activeItems.reduce((s, i) => s + i.quantity, 0)} items`
                    : 'No active dishes'}
                </span>
              </div>

              {activeItems.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl border border-dashed border-gray-300 p-6 text-center">
                  <p className="text-xs text-gray-500 font-medium">
                    No active dishes currently placed for Table {tableNumber}.
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Browse the menu tab or call your server to place your order!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('menu')}
                    className="mt-3 px-3 py-1.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-orange-600 cursor-pointer"
                  >
                    View Menu Catalog
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-2xs">
                  {activeItems.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs">
                          {item.quantity}x
                        </div>
                        <div>
                          <div className="font-bold text-xs text-gray-900">{item.name}</div>
                          {item.notes && (
                            <div className="text-[10px] text-gray-500">Note: {item.notes}</div>
                          )}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Preparing
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pay Via UPI Callout */}
            {totalAmount > 0 && (
              <button
                type="button"
                onClick={handleOpenUpi}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>Pay ₹{totalAmount} Instantly with Any UPI App</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 2: Browse Menu */}
        {activeTab === 'menu' && (
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={menuSearch}
                onChange={e => setMenuSearch(e.target.value)}
                placeholder="Search coffee, pizza, burgers, shakes..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCat('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCat === 'all'
                    ? 'bg-orange-500 text-white shadow-2xs'
                    : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
                }`}
              >
                All Dishes
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    selectedCat === cat.id
                      ? 'bg-orange-500 text-white shadow-2xs'
                      : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Dishes list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredMenu.map(item => (
                <div
                  key={item.id}
                  className="p-3 bg-white rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-extrabold text-xs text-gray-900">{item.name}</div>
                    {item.nameMr && (
                      <div className="text-[10px] text-gray-500 font-medium">{item.nameMr}</div>
                    )}
                    <div className="text-xs font-black text-orange-600 mt-1">
                      ₹{item.sellingPrice}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      item.isAvailable
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Sold Out'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Dynamic UPI QR Code */}
        {activeTab === 'pay' && (
          <div className="p-5 overflow-y-auto flex-1 flex flex-col items-center justify-center text-center space-y-3">
            <h3 className="font-black text-sm text-gray-900">
              Scan & Pay at Table {tableNumber}
            </h3>
            <p className="text-xs text-gray-500 max-w-xs">
              Open Google Pay, PhonePe, Paytm, BHIM, or any banking app to scan
            </p>

            {/* Dynamic UPI QR Code */}
            <div className="p-3 bg-white rounded-2xl border-2 border-purple-500 shadow-lg relative my-1">
              {upiQrUrl ? (
                <img
                  src={upiQrUrl}
                  alt="UPI QR Code"
                  className="w-52 h-52 object-contain rounded-xl"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center bg-slate-50 text-xs text-gray-400">
                  Generating UPI QR...
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-xl font-black text-purple-700">
                Amount: ₹{totalAmount > 0 ? totalAmount : 100}
              </div>
              <div className="text-xs font-mono font-bold text-gray-700 bg-slate-100 px-3 py-1 rounded-lg inline-block">
                {businessProfile.upiId}
              </div>
            </div>

            {/* Direct UPI Intent Link for Mobile Phone Users */}
            <div className="w-full pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={generateUpiUri({
                  upiId: businessProfile.upiId,
                  payeeName: businessProfile.name,
                  amount: totalAmount > 0 ? totalAmount : 100,
                  note: `Table-${tableNumber}`
                })}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs text-center"
              >
                Open in UPI App (GPay/PhonePe)
              </a>

              <button
                type="button"
                onClick={() => handleCallService('bill')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-800 font-bold text-xs rounded-xl text-center cursor-pointer"
              >
                I Paid, Notify Counter
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <div className="flex items-center gap-1 font-semibold text-gray-700">
            <Coffee className="w-3.5 h-3.5 text-orange-500" />
            <span>SYS Cafe · Live Cloud Synced</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
