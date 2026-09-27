import React, { useState } from 'react';
import {
  Settings,
  Store,
  QrCode,
  Globe,
  Percent,
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

export const SettingsScreen: React.FC = () => {
  const {
    businessProfile,
    updateBusinessProfile,
    language,
    setLanguage,
    resetToDefaultData,
    t
  } = useApp();

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states initialized with businessProfile
  const [name, setName] = useState(businessProfile.name);
  const [tagline, setTagline] = useState(businessProfile.tagline || '');
  const [address, setAddress] = useState(businessProfile.address);
  const [phone, setPhone] = useState(businessProfile.phone);
  const [upiId, setUpiId] = useState(businessProfile.upiId || '');
  const [gstin, setGstin] = useState(businessProfile.gstin || '');
  const [fssai, setFssai] = useState(businessProfile.fssai || '');
  const [receiptFooter, setReceiptFooter] = useState(businessProfile.receiptFooter || '');
  const [enableGst, setEnableGst] = useState(businessProfile.enableGst);
  const [defaultGstRate, setDefaultGstRate] = useState(businessProfile.defaultGstRate);
  const [soundEnabled, setSoundEnabled] = useState(businessProfile.soundEnabled);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile({
      name: name.trim(),
      tagline: tagline.trim(),
      address: address.trim(),
      phone: phone.trim(),
      upiId: upiId.trim(),
      gstin: gstin.trim() || undefined,
      fssai: fssai.trim() || undefined,
      receiptFooter: receiptFooter.trim(),
      enableGst,
      defaultGstRate: Number(defaultGstRate),
      soundEnabled
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const data = {
      timestamp: new Date().toISOString(),
      businessProfile,
      version: '1.0'
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(localStorage)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `sys_cafe_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data back to the clean SYS Cafe starter menu and records? This will overwrite your current browser cache.')) {
      resetToDefaultData();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-orange-600" />
            <span>{t('settingsTitle')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Configure cafe identity, receipt header/footer, QR payments, languages and data backups.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Main Settings Form */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-2 space-y-5">
          {/* Cafe Profile */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Store className="w-5 h-5 text-orange-600" />
              <h3 className="font-extrabold text-sm text-gray-900">Cafe Business Profile</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Cafe / Brand Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="Taste the freshness"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Cafe Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* UPI & Payment Settings */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <QrCode className="w-5 h-5 text-purple-600" />
              <h3 className="font-extrabold text-sm text-gray-900">UPI Payment & QR Codes</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">UPI ID (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="syscafe@okaxis"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-mono font-bold"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  Used to generate dynamic payment QR codes on receipts
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">FSSAI License No.</label>
                <input
                  type="text"
                  value={fssai}
                  onChange={e => setFssai(e.target.value)}
                  placeholder="14-digit FSSAI Number"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Receipt Footer Note</label>
                <input
                  type="text"
                  value={receiptFooter}
                  onChange={e => setReceiptFooter(e.target.value)}
                  placeholder="Thank you for visiting SYS Cafe! Please come again."
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Tax & POS Options */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Percent className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-sm text-gray-900">Taxes & POS Configuration</h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableGst}
                  onChange={e => setEnableGst(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Enable GST on Bills</span>
                  <span className="text-[11px] text-gray-500">
                    Add GST percentage automatically to bills
                  </span>
                </div>
              </label>

              {enableGst && (
                <div className="pl-6 flex items-center gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">GST Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="28"
                      value={defaultGstRate}
                      onChange={e => setDefaultGstRate(Number(e.target.value))}
                      className="w-24 border border-gray-300 rounded-lg p-1.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={e => setGstin(e.target.value)}
                      placeholder="27AAAAA0000A1Z5"
                      className="border border-gray-300 rounded-lg p-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2.5 cursor-pointer pt-2 border-t border-gray-100">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={e => setSoundEnabled(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Audio Feedback</span>
                  <span className="text-[11px] text-gray-500">
                    Play sound on adding items and printing bills
                  </span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl text-sm shadow-md transition-all cursor-pointer"
          >
            Save All Settings
          </button>
        </form>

        {/* Right 1 Col: Language & Data Tools */}
        <div className="space-y-5">
          {/* Language Switcher */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Globe className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-sm text-gray-900">System Language</h3>
            </div>

            <p className="text-xs text-gray-500">
              Switch the complete cafe UI and menu labels into your preferred language:
            </p>

            <div className="space-y-2 pt-1">
              {(
                [
                  { id: 'en', label: 'English', sub: 'Standard' },
                  { id: 'mr', label: 'मराठी (Marathi)', sub: 'महाराष्ट्र प्राधान्य' },
                  { id: 'hi', label: 'हिन्दी (Hindi)', sub: 'राष्ट्रीय भाषा' }
                ] as const
              ).map(lang => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setLanguage(lang.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    language === lang.id
                      ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{lang.label}</span>
                    <span className="text-[10px] text-gray-500">{lang.sub}</span>
                  </div>
                  {language === lang.id && (
                    <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Backup & Reset */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Database className="w-5 h-5 text-gray-700" />
              <h3 className="font-extrabold text-sm text-gray-900">Data Management</h3>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleExportBackup}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Export System Data (JSON)</span>
              </button>

              <button
                type="button"
                onClick={handleResetData}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-red-600" />
                <span>Reset to Fresh / Clean State</span>
              </button>
            </div>

            <p className="text-[10px] text-gray-400">
              All menu items, sales records, customer udhaar tabs and expenses are persisted in local browser storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
