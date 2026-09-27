import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Banknote,
  QrCode,
  UserCheck,
  Percent,
  Receipt,
  Download,
  Copy,
  Check,
  ExternalLink,
  Utensils,
  Clock,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TableItem, PaymentMethod, CartItem } from '../../types';
import { generateUpiUri, generateQrDataUrl, downloadQrDataUrl } from '../../utils/qrCode';

interface SettleBillModalProps {
  table: TableItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SettleBillModal: React.FC<SettleBillModalProps> = ({ table, isOpen, onClose }) => {
  const {
    businessProfile,
    settleTableBill,
    kitchenOrders,
    bills
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [discount, setDiscount] = useState<number>(0);
  const [cashReceived, setCashReceived] = useState<number | ''>('');
  const [upiQrUrl, setUpiQrUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine items served to this table
  const items: CartItem[] = React.useMemo(() => {
    if (!table) return [];
    if (table.activeItems && table.activeItems.length > 0) {
      return table.activeItems;
    }
    // Fallback: extract from active kitchen tickets for this table
    const activeKot = kitchenOrders.filter(
      k => String(k.tableNumber) === String(table.number) && k.status !== 'completed'
    );
    if (activeKot.length > 0) {
      const list: CartItem[] = [];
      activeKot.forEach(kot => {
        kot.items.forEach((it, idx) => {
          list.push({
            id: `kot-item-${idx}-${it.name}`,
            menuItemId: `m-${idx}`,
            name: it.name,
            nameMr: it.name,
            nameHi: it.name,
            variantName: it.variant,
            quantity: it.quantity,
            sellingPrice: (table.orderTotal || 100) / (kot.items.length || 1),
            costPrice: 0,
            illustration: 'coffee'
          });
        });
      });
      return list;
    }
    return [];
  }, [table, kitchenOrders]);

  const subtotal = items.reduce((sum, it) => sum + it.sellingPrice * it.quantity, 0) || table?.orderTotal || 0;
  const grandTotal = Math.max(0, subtotal - discount);

  // Cash change
  const numericCash = typeof cashReceived === 'number' ? cashReceived : 0;
  const cashChange = Math.max(0, numericCash - grandTotal);

  // Generate UPI QR Code when payment method is UPI
  useEffect(() => {
    if (isOpen && table && paymentMethod === 'upi' && businessProfile.upiId) {
      const upiUri = generateUpiUri({
        upiId: businessProfile.upiId,
        payeeName: businessProfile.name,
        amount: grandTotal,
        note: `Table-${table.number}-FinalBill`
      });

      generateQrDataUrl(upiUri, {
        width: 320,
        margin: 2,
        color: { dark: '#581c87', light: '#ffffff' }
      })
        .then(setUpiQrUrl)
        .catch(err => console.error('Failed to generate settle UPI QR:', err));
    }
  }, [isOpen, table?.id, paymentMethod, grandTotal, businessProfile.upiId, businessProfile.name]);

  if (!isOpen || !table) return null;

  const handleSettle = () => {
    setIsSubmitting(true);
    try {
      settleTableBill(
        table.number,
        paymentMethod,
        discount,
        paymentMethod === 'cash' ? (numericCash || grandTotal) : undefined,
        paymentMethod === 'cash' ? cashChange : undefined
      );
      onClose();
    } catch (e) {
      console.error('Error settling table bill:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg leading-tight">
                  Settle Table Bill & Free Table
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-900">
                  Table {table.number}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Customer finished dining · Collect payment and generate invoice
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

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* Table Meta Summary */}
          <div className="bg-slate-50 rounded-2xl border border-gray-200 p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Dine-In Guest</span>
              <span className="font-extrabold text-sm text-gray-900">
                {table.customerName || 'Dine-In Customer'}
              </span>
              {table.customerPhone && (
                <span className="text-[11px] text-gray-500 block">Ph: {table.customerPhone}</span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Seated Duration</span>
              <span className="font-mono text-gray-700 font-bold">
                {table.seatedAt ? `Since ${table.seatedAt}` : 'Today'}
              </span>
            </div>
          </div>

          {/* Ordered Dishes List */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-extrabold text-xs text-gray-700 uppercase tracking-wider">
                Served Dishes ({items.reduce((s, i) => s + i.quantity, 0)})
              </h3>
              <span className="text-xs font-bold text-gray-500">Rate / Amount</span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 max-h-44 overflow-y-auto shadow-2xs">
              {items.map((item, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center font-black text-xs">
                      {item.quantity}x
                    </span>
                    <div>
                      <span className="font-bold text-gray-900">{item.name}</span>
                      {item.variantName && (
                        <span className="text-[10px] text-gray-500 block">({item.variantName})</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-gray-900">
                      ₹{Math.round(item.sellingPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discount & Totals */}
          <div className="bg-orange-50/50 rounded-2xl border border-orange-200 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Subtotal:</span>
              <span className="font-bold font-mono">₹{subtotal.toFixed(2)}</span>
            </div>

            {/* Quick Discount Controls */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-orange-200/60 text-xs">
              <span className="font-bold text-gray-700 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-orange-600" />
                <span>Discount (₹):</span>
              </span>
              <div className="flex items-center gap-1">
                {[0, 20, 50, 100].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDiscount(amt)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                      discount === amt
                        ? 'bg-orange-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {amt === 0 ? 'None' : `₹${amt}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-orange-200 font-black">
              <span className="text-sm text-gray-900">Total Net Payable:</span>
              <span className="text-xl text-orange-600 font-mono">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Select Payment Method */}
          <div>
            <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2.5 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2.5 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('udhaar')}
                className={`py-2.5 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'udhaar'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Udhaar</span>
              </button>
            </div>
          </div>

          {/* Cash Change Calculation Section */}
          {paymentMethod === 'cash' && (
            <div className="bg-slate-50 rounded-2xl border border-gray-200 p-3.5 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700">Cash Received from Guest:</span>
                <input
                  type="number"
                  placeholder={`₹${grandTotal}`}
                  value={cashReceived}
                  onChange={e => setCashReceived(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-28 px-2.5 py-1 text-right text-xs font-bold font-mono bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Fast Denominations */}
              <div className="flex items-center justify-between gap-1">
                {[grandTotal, 200, 500, 1000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCashReceived(val)}
                    className="flex-1 py-1 bg-white border border-gray-200 hover:border-emerald-500 text-[11px] font-bold text-gray-700 rounded-lg transition-colors cursor-pointer"
                  >
                    {val === grandTotal ? 'Exact' : `₹${val}`}
                  </button>
                ))}
              </div>

              {numericCash > 0 && (
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-bold">Change to Return:</span>
                  <span className="font-mono font-black text-sm text-emerald-600">
                    ₹{cashChange.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Real Dynamic UPI QR Section */}
          {paymentMethod === 'upi' && (
            <div className="bg-purple-50/70 rounded-2xl border border-purple-200 p-4 flex flex-col items-center justify-center text-center space-y-2 animate-in fade-in">
              <span className="text-xs font-black uppercase text-purple-900 tracking-wider">
                Scan to Pay Table #{table.number} Bill
              </span>

              <div className="p-2.5 bg-white rounded-xl border border-purple-300 shadow-sm">
                {upiQrUrl ? (
                  <img
                    src={upiQrUrl}
                    alt="UPI Payment QR"
                    className="w-36 h-36 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center text-xs text-gray-400">
                    Generating UPI QR...
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-purple-900 bg-white px-2.5 py-1 rounded-lg border border-purple-200">
                  {businessProfile.upiId}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(businessProfile.upiId);
                    setCopiedUpi(true);
                    setTimeout(() => setCopiedUpi(false), 2000);
                  }}
                  className="px-2 py-1 bg-white text-purple-800 border border-purple-200 rounded-lg text-xs font-bold hover:bg-purple-100 cursor-pointer"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600 inline" /> : <Copy className="w-3.5 h-3.5 inline" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSettle}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Payment & Free Table {table.number}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
