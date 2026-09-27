import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  PlusCircle,
  Globe,
  Coffee,
  CheckCircle2,
  AlertCircle,
  X,
  Menu,
  Cloud,
  CloudOff,
  RefreshCw,
  UtensilsCrossed,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    setActiveTab,
    toggleMobileSidebar,
    t,
    globalSearch,
    setGlobalSearch,
    notifications,
    dismissNotification,
    cashRegister,
    firebaseConnected,
    firebaseSyncing,
    manualSyncToCloud,
    isOnline,
    pendingSyncCount,
    isFirestoreSyncing,
    lastFirestoreSyncTime,
    syncPendingOrdersToFirestoreNow,
    customerCalls
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search, 'n' to new bill
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        setShowMobileSearch(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if ((e.key === 'n' || e.key === 'N') && (e.ctrlKey || e.altKey)) {
        e.preventDefault();
        setActiveTab('pos');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'EN' },
    { code: 'mr', label: 'मराठी', sub: 'MR' },
    { code: 'hi', label: 'हिन्दी', sub: 'HI' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="px-2.5 py-2 sm:px-6 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand / Title & Mobile Menu Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Hamburger to open navigation drawer */}
          <button
            type="button"
            onClick={toggleMobileSidebar}
            aria-label="Open navigation menu"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-700 hover:bg-slate-100 active:bg-slate-200 border border-gray-200/90 transition-colors cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5 stroke-[2.5] text-gray-800" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer select-none"
            id="header-brand"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <Coffee className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm sm:text-lg lg:text-xl text-gray-900 tracking-tight leading-none whitespace-nowrap">
                  SYS Cafe
                </span>
                <span className="hidden xs:inline-flex px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                  POS
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium hidden md:block">
                {t('tagline')}
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar (Desktop inline) */}
        <div className="hidden sm:flex flex-1 max-w-xs md:max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              id="global-search-input"
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:bg-white transition-colors"
            />
            {globalSearch ? (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden lg:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-gray-100 border border-gray-200 rounded">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Right Action Icons & Buttons - Fully Responsive */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile search toggle button */}
          <button
            type="button"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            aria-label="Search"
            className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Active Table Calls from QR */}
          {customerCalls.length > 0 && (
            <button
              onClick={() => setActiveTab('tables')}
              className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs animate-bounce shadow-xs cursor-pointer"
              title="Customer called waiter from Table QR stand"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{customerCalls.length}</span>
              <span className="text-[11px] sm:text-xs">Call{customerCalls.length > 1 ? 's' : ''}</span>
            </button>
          )}

          {/* Quick New Bill CTA */}
          <button
            id="btn-header-new-bill"
            onClick={() => setActiveTab('pos')}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs sm:text-sm shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span>{t('newBill')}</span>
          </button>

          {/* Cash Register Drawer Indicator (Desktop only) */}
          <button
            onClick={() => setActiveTab('cash')}
            title="Current Cash in Register"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-slate-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Cash:</span>
            <span className="font-bold text-gray-900">₹{cashRegister.expectedCash.toLocaleString()}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="language-selector-btn"
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[11px] sm:text-xs font-bold text-gray-700 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="hidden md:inline">{language === 'en' ? 'English' : language === 'mr' ? 'मराठी' : 'हिन्दी'}</span>
              <span className="md:hidden font-mono uppercase text-[10px] sm:text-xs">{language}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl border border-gray-200 shadow-xl py-1 z-50">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-orange-50 transition-colors cursor-pointer ${
                      language === lang.code ? 'text-orange-600 bg-orange-50/50 font-bold' : 'text-gray-700'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[10px] text-gray-400">{lang.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              id="notifications-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowLangMenu(false);
              }}
              className="p-1.5 sm:p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 relative transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full mt-1.5 left-2 sm:left-auto sm:w-80 bg-white rounded-xl border border-gray-200 shadow-xl py-2 z-50 max-w-[calc(100vw-1rem)]">
                <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between">
                  <div className="font-bold text-xs text-gray-900">Notifications & Alerts</div>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                    {notifications.length} Active
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-500">No active alerts</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-3 hover:bg-slate-50 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-gray-800">{notif.title}</div>
                          <div className="text-[11px] text-gray-600 mt-0.5 leading-snug break-words">{notif.message}</div>
                          <div className="text-[10px] text-gray-400 mt-1">{notif.timestamp}</div>
                        </div>
                        <button
                          onClick={() => dismissNotification(notif.id)}
                          className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Mobile Search Row */}
      {showMobileSearch && (
        <div className="sm:hidden px-3 pb-2.5 pt-1 border-t border-gray-100 bg-slate-50 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowMobileSearch(false)}
            className="text-xs font-semibold text-gray-600 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* Offline Alert Ribbon (Displays when disconnected or orders are pending in IndexedDB) */}
      {!isOnline && (
        <div className="bg-amber-500 text-white px-3 py-1.5 text-xs font-semibold flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-1.5 truncate">
            <CloudOff className="w-3.5 h-3.5 shrink-0 animate-pulse" />
            <span className="truncate">
              Offline Mode: Orders are cached in IndexedDB. Will auto-sync to Firestore when restored.
            </span>
            {pendingSyncCount > 0 && (
              <span className="bg-amber-900/40 text-amber-100 px-1.5 py-0.2 rounded font-mono text-[10px] shrink-0 font-bold">
                {pendingSyncCount} queued
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => syncPendingOrdersToFirestoreNow()}
            disabled={isFirestoreSyncing}
            className="px-2 py-0.5 bg-white text-amber-800 rounded font-bold text-[11px] hover:bg-amber-50 transition-colors shrink-0 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {isFirestoreSyncing ? 'Syncing...' : 'Retry'}
          </button>
        </div>
      )}
    </header>
  );
};
