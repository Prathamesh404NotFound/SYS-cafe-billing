import React, { useState } from 'react';
import {
  Banknote,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Coins,
  Receipt,
  RotateCcw,
  IndianRupee
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CashRegisterScreen: React.FC = () => {
  const { cashRegister, closeDayRegister, addCashTransaction, t } = useApp();

  const [actualCount, setActualCount] = useState<number | ''>(cashRegister.expectedCash);
  const [closingNotes, setClosingNotes] = useState('');
  const [showCloseModal, setShowCloseModal] = useState(false);

  // Cash in/out modal
  const [showCashInOutModal, setShowCashInOutModal] = useState(false);
  const [txType, setTxType] = useState<'in' | 'out'>('in');
  const [txAmount, setTxAmount] = useState<number | ''>(500);
  const [txNote, setTxNote] = useState('');

  const numericActual = typeof actualCount === 'number' ? actualCount : 0;
  const difference = numericActual - cashRegister.expectedCash;

  const handleCloseRegister = (e: React.FormEvent) => {
    e.preventDefault();
    closeDayRegister(numericActual, closingNotes);
    setShowCloseModal(false);
  };

  const handleCashInOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount) return;
    addCashTransaction(txType, Number(txAmount), txNote);
    setShowCashInOutModal(false);
    setTxNote('');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-2">
            <Banknote className="w-6 h-6 text-emerald-600" />
            <span>{t('cashRegisterTitle')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Monitor cash drawer balance, audit opening & closing cash, reconcile end-of-day register.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTxType('in');
              setShowCashInOutModal(true);
            }}
            className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            <span>+ Cash In</span>
          </button>
          <button
            onClick={() => {
              setTxType('out');
              setShowCashInOutModal(true);
            }}
            className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 text-red-600" />
            <span>- Cash Out</span>
          </button>
        </div>
      </div>

      {/* Main Register Drawer Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Expected Cash Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-gray-900">
              Cash Drawer Tally Calculation
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                cashRegister.isClosed
                  ? 'bg-red-100 text-red-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {cashRegister.isClosed ? 'CLOSED FOR TODAY' : 'DRAWER ACTIVE'}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Opening cash */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-gray-100">
              <span className="font-bold text-gray-600">(+) Opening Balance:</span>
              <span className="font-mono font-bold text-gray-900">
                ₹{cashRegister.openingCash.toLocaleString()}
              </span>
            </div>

            {/* Cash Sales */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <span className="font-bold text-emerald-800">(+) Cash Bill Sales:</span>
              <span className="font-mono font-black text-emerald-700">
                + ₹{cashRegister.cashSales.toLocaleString()}
              </span>
            </div>

            {/* Udhaar collected */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <span className="font-bold text-emerald-800">(+) Udhaar Repayments:</span>
              <span className="font-mono font-black text-emerald-700">
                + ₹{cashRegister.cashReceived.toLocaleString()}
              </span>
            </div>

            {/* Cash Expenses */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/50 border border-red-100">
              <span className="font-bold text-red-800">(-) Cash Expenses / Refills:</span>
              <span className="font-mono font-black text-red-600">
                - ₹{cashRegister.cashExpenses.toLocaleString()}
              </span>
            </div>

            {/* Cash Out */}
            {cashRegister.cashWithdrawn > 0 && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/50 border border-red-100">
                <span className="font-bold text-red-800">(-) Cash Withdrawn:</span>
                <span className="font-mono font-black text-red-600">
                  - ₹{cashRegister.cashWithdrawn.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Expected Cash in drawer */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                Expected Cash in Drawer:
              </span>
              <p className="text-[11px] text-gray-400">Calculated mathematically</p>
            </div>
            <div className="text-2xl font-black text-gray-900 font-mono">
              ₹{cashRegister.expectedCash.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Right: Actual Cash Verification & Day Closing */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-gray-900">
              Physical Cash Reconcile (Counter Count)
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Count all notes & coins in the drawer and enter here:
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-3">
              <label className="block text-xs font-bold text-gray-700">
                Actual Physical Cash Counted (₹)
              </label>
              <input
                type="number"
                min="0"
                value={actualCount}
                onChange={e => setActualCount(e.target.value ? Number(e.target.value) : '')}
                placeholder="Counted cash in drawer"
                className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xl font-mono font-black text-gray-900 text-right focus:outline-none focus:border-orange-500"
              />

              {/* Live difference result */}
              <div className="pt-2">
                {difference === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100/70 p-2.5 rounded-lg text-xs font-black">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>PERFECT TALLY! Cash drawer exactly matches system calculation.</span>
                  </div>
                ) : difference > 0 ? (
                  <div className="flex items-center gap-2 text-blue-800 bg-blue-100/70 p-2.5 rounded-lg text-xs font-bold">
                    <AlertTriangle className="w-5 h-5 text-blue-600" />
                    <span>CASH SURPLUS: +₹{difference} extra cash found in drawer.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-800 bg-red-100/70 p-2.5 rounded-lg text-xs font-bold">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span>CASH SHORTAGE: -₹{Math.abs(difference)} missing from drawer.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Close Day Button */}
          <div className="pt-3 border-t border-gray-200">
            {cashRegister.isClosed ? (
              <div className="p-3 rounded-xl bg-slate-100 text-center text-xs font-bold text-gray-600">
                Register closed at {cashRegister.closedAt || 'Evening'}. Final Difference: ₹
                {cashRegister.difference}.
              </div>
            ) : (
              <button
                onClick={() => setShowCloseModal(true)}
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{t('closeDay')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRM CLOSE DAY MODAL */}
      {showCloseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCloseRegister}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <h3 className="font-extrabold text-base text-gray-900">Close Day Register</h3>
            <p className="text-xs text-gray-500">
              Confirm closing tally for SYS Cafe. Once closed, today's register report is saved.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs font-bold">
              <div className="flex justify-between">
                <span>Expected:</span>
                <span>₹{cashRegister.expectedCash}</span>
              </div>
              <div className="flex justify-between">
                <span>Actual Counted:</span>
                <span>₹{numericActual}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-gray-200 font-extrabold">
                <span>Tally Difference:</span>
                <span className={difference === 0 ? 'text-emerald-600' : 'text-red-600'}>
                  {difference >= 0 ? `+₹${difference}` : `-₹${Math.abs(difference)}`}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Closing Notes</label>
              <textarea
                rows={2}
                value={closingNotes}
                onChange={e => setClosingNotes(e.target.value)}
                placeholder="End of day comments, handed cash to owner..."
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs"
              >
                Confirm Closing
              </button>
              <button
                type="button"
                onClick={() => setShowCloseModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CASH IN / OUT MODAL */}
      {showCashInOutModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCashInOutSubmit}
            className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95"
          >
            <h3 className="font-extrabold text-base text-gray-900">
              {txType === 'in' ? 'Deposit Cash Into Drawer' : 'Withdraw Cash From Drawer'}
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Amount (₹)</label>
              <input
                type="number"
                min="1"
                value={txAmount}
                onChange={e => setTxAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full border border-gray-300 rounded-lg p-2 text-base font-black"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Reason / Note</label>
              <input
                type="text"
                value={txNote}
                onChange={e => setTxNote(e.target.value)}
                placeholder={txType === 'in' ? 'Added loose change' : 'Bank deposit / Owner withdrawal'}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
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
                onClick={() => setShowCashInOutModal(false)}
                className="px-3 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
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
