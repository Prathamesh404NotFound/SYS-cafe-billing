import React, { useRef, useState, useEffect } from 'react';
import {
  Printer,
  Share2,
  X,
  CheckCircle2,
  PlusCircle,
  Phone,
  Receipt as ReceiptIcon,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Bill } from '../../types';
import { generateUpiUri, generateQrDataUrl } from '../../utils/qrCode';

interface ReceiptModalProps {
  bill: Bill | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ bill, onClose }) => {
  const { businessProfile, t, setActiveTab } = useApp();
  const printRef = useRef<HTMLDivElement>(null);
  const [receiptQrUrl, setReceiptQrUrl] = useState<string>('');

  useEffect(() => {
    if (bill && businessProfile.upiId) {
      const upiUri = generateUpiUri({
        upiId: businessProfile.upiId,
        payeeName: businessProfile.name,
        amount: bill.total,
        billNumber: bill.billNumber,
        note: `SYS-Bill-${bill.billNumber}`
      });
      generateQrDataUrl(upiUri, {
        width: 220,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' }
      })
        .then(setReceiptQrUrl)
        .catch(err => console.error('Failed to generate receipt QR:', err));
    }
  }, [bill?.id, bill?.total, bill?.billNumber, businessProfile.upiId, businessProfile.name]);

  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const phone = bill.customerPhone ? bill.customerPhone.replace(/[^0-9]/g, '') : '';
  const messageText =
    `*${businessProfile.name} - Bill Receipt*\n` +
    `Bill No: ${bill.billNumber}\n` +
    `Date: ${bill.createdAt}\n` +
    `Order: ${bill.orderType.toUpperCase()}${bill.tableNumber ? ` (Table ${bill.tableNumber})` : ''}\n\n` +
    `*Items:*\n` +
    bill.items
      .map(
        i =>
          `• ${i.name}${i.variantName ? ` (${i.variantName})` : ''} x ${i.quantity} = ₹${
            i.sellingPrice * i.quantity
          }`
      )
      .join('\n') +
    `\n\nSubtotal: ₹${bill.subtotal}\n` +
    (bill.discount > 0 ? `Discount: -₹${bill.discount}\n` : '') +
    `*Total: ₹${bill.total}*\n` +
    `Payment: ${bill.paymentMethod.toUpperCase()} (${bill.paymentStatus.toUpperCase()})\n\n` +
    `Thank you for visiting ${businessProfile.name}!`;

  const whatsAppUrl = phone
    ? `https://wa.me/91${phone}?text=${encodeURIComponent(messageText)}`
    : `https://wa.me/?text=${encodeURIComponent(messageText)}`;

  const handleNewOrder = () => {
    onClose();
    setActiveTab('pos');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Bill Generated Successfully</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Area */}
        <div className="p-6 bg-slate-50 overflow-y-auto max-h-[70vh]">
          <div
            ref={printRef}
            id="thermal-receipt"
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm text-gray-900 text-xs font-mono receipt-container"
          >
            {/* Cafe Info Header */}
            <div className="text-center pb-3 border-b border-dashed border-gray-300">
              <h2 className="text-base font-black tracking-tight text-gray-900 uppercase">
                {businessProfile.name}
              </h2>
              <p className="text-[11px] text-gray-600 font-sans mt-0.5">{businessProfile.tagline}</p>
              <p className="text-[10px] text-gray-500 font-sans mt-1 leading-snug">
                {businessProfile.address}
              </p>
              <p className="text-[10px] text-gray-600 font-sans mt-0.5">
                Tel: {businessProfile.phone}
              </p>
              {businessProfile.gstNumber && (
                <p className="text-[10px] text-gray-500 font-sans">
                  GST: {businessProfile.gstNumber}
                </p>
              )}
            </div>

            {/* Bill Meta */}
            <div className="py-2.5 border-b border-dashed border-gray-300 space-y-1 text-[11px]">
              <div className="flex justify-between font-bold">
                <span>INVOICE: {bill.billNumber}</span>
                <span>{bill.orderType.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Date: {bill.createdAt}</span>
                {bill.tableNumber && <span>Table: {bill.tableNumber}</span>}
              </div>
              {bill.customerName && (
                <div className="flex justify-between text-gray-600">
                  <span>Customer: {bill.customerName}</span>
                  {bill.customerPhone && <span>Ph: {bill.customerPhone}</span>}
                </div>
              )}
              <div className="flex justify-between text-gray-500 text-[10px]">
                <span>Cashier: {bill.createdBy || 'Santosh'}</span>
                <span>Payment: {bill.paymentMethod.toUpperCase()}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-3 border-b border-dashed border-gray-300">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-gray-500 uppercase border-b border-gray-200">
                    <th className="pb-1">Item</th>
                    <th className="pb-1 text-center">Qty</th>
                    <th className="pb-1 text-right">Rate</th>
                    <th className="pb-1 text-right">Amt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-[11px]">
                  {bill.items.map((item, idx) => (
                    <tr key={idx} className="py-1">
                      <td className="py-1 pr-1 font-semibold">
                        {item.name}
                        {item.variantName && (
                          <span className="block text-[9px] text-gray-500 font-normal">
                            ({item.variantName})
                          </span>
                        )}
                      </td>
                      <td className="py-1 text-center text-gray-700">{item.quantity}</td>
                      <td className="py-1 text-right text-gray-700">₹{item.sellingPrice}</td>
                      <td className="py-1 text-right font-bold">₹{item.sellingPrice * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Calculation */}
            <div className="py-2.5 space-y-1 text-right">
              <div className="flex justify-between text-[11px] text-gray-600">
                <span>Subtotal:</span>
                <span>₹{bill.subtotal.toFixed(2)}</span>
              </div>
              {bill.discount > 0 && (
                <div className="flex justify-between text-[11px] text-emerald-600 font-semibold">
                  <span>Discount:</span>
                  <span>- ₹{bill.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black border-t border-b border-dashed border-gray-300 py-1.5 mt-1">
                <span>NET PAYABLE:</span>
                <span className="text-orange-600">₹{bill.total.toFixed(2)}</span>
              </div>

              {/* Cash Breakup if cash */}
              {bill.paymentMethod === 'cash' && bill.cashReceived !== undefined && (
                <div className="text-[10px] text-gray-500 pt-1 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Cash Received:</span>
                    <span>₹{bill.cashReceived.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>Change Returned:</span>
                    <span>₹{(bill.cashChange || 0).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {bill.paymentMethod === 'udhaar' && (
                <div className="bg-amber-50 text-amber-900 text-[10px] font-bold p-1 rounded text-center mt-1 border border-amber-200">
                  RECORDED AS UDHAAR (CREDIT)
                </div>
              )}
            </div>

            {/* Scannable UPI QR on Receipt */}
            {receiptQrUrl && (
              <div className="py-2.5 my-1.5 border-t border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 block">
                  Scan to Pay / Verify
                </span>
                <img
                  src={receiptQrUrl}
                  alt="Bill Payment QR"
                  className="w-24 h-24 object-contain my-1 border border-gray-200 p-0.5 rounded bg-white"
                />
                <span className="text-[9px] font-mono text-gray-600 block">
                  UPI: {businessProfile.upiId}
                </span>
                <span className="text-[9px] font-bold text-gray-900">
                  Total: ₹{bill.total.toFixed(2)}
                </span>
              </div>
            )}

            {/* Footer Thank You Note */}
            <div className="text-center pt-3 border-t border-dashed border-gray-300 text-[10px] text-gray-500 space-y-1">
              <p className="font-semibold text-gray-700">{t('thankYou')}</p>
              <p>Wi-Fi: SYS-CAFE-GUEST / Pass: syscafe@123</p>
              <p className="text-[9px] text-gray-400">Powered by SYS Cafe POS v1.0</p>
            </div>
          </div>
        </div>

        {/* Action Controls - Print, WhatsApp, New Order */}
        <div className="p-4 bg-white border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t('printReceipt')}</span>
          </button>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={handleNewOrder}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('newOrder')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
