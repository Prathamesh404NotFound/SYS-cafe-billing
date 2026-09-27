import React, { useState } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
  CreditCard,
  Banknote,
  QrCode,
  UserCheck,
  Check,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Clock,
  Layers,
  ShoppingCart,
  ArrowLeft,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem, PaymentMethod, OrderType } from '../../types';
import { FoodIllustration } from '../illustrations/FoodIllustrations';

export const POSScreen: React.FC = () => {
  const {
    menuItems,
    categories,
    selectedCategory,
    setSelectedCategory,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotal,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    discount,
    setDiscount,
    cartNotes,
    setCartNotes,
    completeBill,
    language,
    t,
    customers,
    businessProfile
  } = useApp();

  const [mobilePosView, setMobilePosView] = useState<'menu' | 'cart'>('menu');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedVariantItem, setSelectedVariantItem] = useState<MenuItem | null>(null);

  // Cash payment calculation state
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState<number | ''>('');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filter items by category & search
  const filteredItems = menuItems.filter(item => {
    const matchesCategory =
      selectedCategory === 'all' || item.categoryId === selectedCategory;

    const q = localSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      (item.nameMr && item.nameMr.toLowerCase().includes(q)) ||
      (item.nameHi && item.nameHi.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Handle item click
  const handleItemClick = (item: MenuItem) => {
    if (!item.isAvailable) return;
    if (item.variants && item.variants.length > 0) {
      setSelectedVariantItem(item);
    } else {
      addToCart(item);
    }
  };

  // Handle decrease item from menu card
  const handleDecreaseItem = (item: MenuItem) => {
    const matchingCartItems = cart.filter(c => c.menuItemId === item.id);
    if (matchingCartItems.length === 0) return;

    // Decrease the last matching item in cart
    const targetItem = matchingCartItems[matchingCartItems.length - 1];
    updateCartQuantity(targetItem.id, -1);
  };

  // Cash change calculation
  const numericCashReceived = typeof cashReceived === 'number' ? cashReceived : 0;
  const cashChange = Math.max(0, numericCashReceived - cartTotal);

  const quickCashOptions = [
    { label: 'Exact', value: cartTotal },
    { label: '₹100', value: 100 },
    { label: '₹200', value: 200 },
    { label: '₹500', value: 500 },
    { label: '₹1000', value: 1000 }
  ];

  // Quick discount calculation
  const applyDiscountPercent = (pct: number) => {
    if (pct === 0) {
      setDiscount(0);
    } else {
      setDiscount(Math.round((cartSubtotal * pct) / 100));
    }
  };

  // Complete bill handler
  const handleCompleteBill = () => {
    if (cart.length === 0) return;

    if (selectedPayment === 'udhaar' && !customerName.trim() && !customerPhone.trim()) {
      setFormError('Please enter Customer Name or Mobile Number to record Udhaar (Credit).');
      return;
    }
    setFormError(null);

    setIsSubmitting(true);
    try {
      completeBill(
        selectedPayment,
        typeof cashReceived === 'number' ? cashReceived : cartTotal,
        cashChange,
        cartNotes
      );
      setCashReceived('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-complete customer lookup
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomerPhone(val);
    if (val.length >= 4) {
      const match = customers.find(c => c.phone.includes(val));
      if (match && !customerName) {
        setCustomerName(match.name);
      }
    }
  };

  const totalCartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Sub-renderer for Order Setup (Order Type + Table + Customer Details)
  const renderOrderSetup = (isMobile: boolean) => (
    <div className={`bg-white rounded-xl border border-gray-200/90 ${isMobile ? 'p-3 space-y-2.5 shadow-2xs' : 'p-3 border-b bg-slate-50 space-y-2 shrink-0'}`}>
      {/* Order Type Chips */}
      <div className="grid grid-cols-4 gap-1.5">
        {(['dine_in', 'takeaway', 'parcel', 'delivery'] as OrderType[]).map(type => (
          <button
            key={type}
            type="button"
            onClick={() => setOrderType(type)}
            className={`py-1.5 px-1 rounded-lg text-xs font-bold text-center capitalize transition-colors cursor-pointer ${
              orderType === type
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {type === 'dine_in' ? 'Dine In' : type}
          </button>
        ))}
      </div>

      {/* Table Selector & Customer Details */}
      <div className="flex items-center gap-2">
        {orderType === 'dine_in' && (
          <div className="w-20 shrink-0">
            <label className="block text-[10px] font-bold text-gray-500 uppercase">Table</label>
            <select
              value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg py-1 px-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <option key={n} value={String(n)}>
                  T-{n}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex-1 grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase">Customer Name</label>
            <input
              type="text"
              placeholder="e.g. Rahul"
              value={customerName}
              onChange={e => {
                setCustomerName(e.target.value);
                if (formError) setFormError(null);
              }}
              className="w-full bg-white border border-gray-200 rounded-lg py-1 px-2 text-xs text-gray-800 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase">Mobile No.</label>
            <input
              type="tel"
              placeholder="9822XXXXXX"
              value={customerPhone}
              onChange={e => {
                handlePhoneChange(e);
                if (formError) setFormError(null);
              }}
              className="w-full bg-white border border-gray-200 rounded-lg py-1 px-2 text-xs text-gray-800 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Sub-renderer for Cart Items List
  const renderCartItems = (isMobile: boolean) => (
    <div className={`space-y-2 ${isMobile ? 'bg-white rounded-xl border border-gray-200/90 p-3 shadow-2xs' : ''}`}>
      <div className="flex items-center justify-between pb-1 border-b border-gray-100">
        <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
          Order Items ({totalCartItemCount})
        </span>
        {cart.length > 0 && (
          <span className="text-xs font-bold text-gray-500">
            ₹{cartSubtotal}
          </span>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="py-8 px-4 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-400 mb-2">
            <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
          </div>
          <p className="font-bold text-xs sm:text-sm text-gray-700">{t('noItemsInCart')}</p>
          <p className="text-[11px] text-gray-400 max-w-[200px] mt-0.5">
            {t('tapItemToAdd')}
          </p>
          {isMobile && (
            <button
              type="button"
              onClick={() => setMobilePosView('menu')}
              className="mt-3 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Browse Menu Dishes</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {cart.map(item => (
            <div
              key={item.id}
              className="bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl p-2.5 border border-gray-200/90 flex items-center justify-between gap-2 shadow-2xs"
            >
              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                  {item.name}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                  <span className="font-semibold text-gray-700">₹{item.sellingPrice}</span>
                  {item.variantName && (
                    <span className="px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 font-bold text-[9px]">
                      {item.variantName}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-2xs shrink-0">
                <button
                  type="button"
                  onClick={() => updateCartQuantity(item.id, -1)}
                  className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 text-gray-600 active:scale-95 transition-all cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <span className="w-6 text-center font-black text-xs text-gray-900 select-none">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(item.id, 1)}
                  className="w-7 h-7 rounded flex items-center justify-center hover:bg-orange-50 text-orange-600 active:scale-95 transition-all cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Line Total & Trash */}
              <div className="text-right shrink-0 flex items-center gap-2">
                <div className="font-black text-xs sm:text-sm text-gray-900 min-w-[44px]">
                  ₹{item.sellingPrice * item.quantity}
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Sub-renderer for Bill Summary
  const renderBillSummary = () => (
    <div className="bg-white rounded-xl border border-gray-200/90 p-3 space-y-2 shadow-2xs">
      <div className="flex justify-between items-center text-xs text-gray-600">
        <span>{t('subtotal')}:</span>
        <span className="font-bold text-gray-800">₹{cartSubtotal}</span>
      </div>

      {/* Discount with Quick Presets */}
      <div className="space-y-1.5 pt-1 border-t border-dashed border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{t('discount')}:</span>
          <div className="flex items-center gap-1">
            <span>- ₹</span>
            <input
              type="number"
              min="0"
              max={cartSubtotal}
              value={discount === 0 ? '' : discount}
              onChange={e => setDiscount(Math.max(0, Math.min(cartSubtotal, Number(e.target.value))))}
              placeholder="0"
              className="w-16 text-right px-2 py-0.5 bg-slate-50 border border-gray-200 rounded-md text-xs font-bold text-gray-800 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
        {cartSubtotal > 0 && (
          <div className="flex items-center gap-1 justify-end pt-0.5">
            {[0, 5, 10, 15].map(pct => {
              const val = pct === 0 ? 0 : Math.round((cartSubtotal * pct) / 100);
              const isActive = discount === val && (pct !== 0 || discount === 0);
              return (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyDiscountPercent(pct)}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {pct === 0 ? 'None' : `${pct}%`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-sm font-black text-gray-900">
        <span>{t('total')}:</span>
        <span className="text-orange-600 text-lg font-black">₹{cartTotal}</span>
      </div>
    </div>
  );

  // Sub-renderer for Payment Method Selector & Cash Tender
  const renderPaymentMethods = () => (
    <div className="bg-white rounded-xl border border-gray-200/90 p-3 space-y-2 shadow-2xs">
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        {t('selectPayment')}
      </label>
      <div className="grid grid-cols-4 gap-1.5">
        <button
          type="button"
          onClick={() => {
            setSelectedPayment('cash');
            if (formError) setFormError(null);
          }}
          className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
            selectedPayment === 'cash'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Banknote className="w-4 h-4 mb-0.5" />
          <span>Cash</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedPayment('upi');
            setShowUpiModal(true);
            if (formError) setFormError(null);
          }}
          className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
            selectedPayment === 'upi'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-slate-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <QrCode className="w-4 h-4 mb-0.5" />
          <span>UPI / QR</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedPayment('card');
            if (formError) setFormError(null);
          }}
          className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
            selectedPayment === 'card'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="w-4 h-4 mb-0.5" />
          <span>Card</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedPayment('udhaar')}
          className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
            selectedPayment === 'udhaar'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100'
          }`}
        >
          <UserCheck className="w-4 h-4 mb-0.5" />
          <span>Udhaar</span>
        </button>
      </div>

      {formError && (
        <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{formError}</span>
        </div>
      )}

      {/* Cash Tender Calculator (If Cash Selected) */}
      {selectedPayment === 'cash' && cart.length > 0 && (
        <div className="bg-slate-50 p-2.5 rounded-xl border border-gray-200 space-y-2 mt-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-gray-600">Tender Received:</span>
            <input
              type="number"
              placeholder={`₹${cartTotal}`}
              value={cashReceived}
              onChange={e => setCashReceived(e.target.value ? Number(e.target.value) : '')}
              className="w-24 bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-right text-gray-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Quick Cash Suggestions */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {quickCashOptions.map(opt => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setCashReceived(opt.value)}
                className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-700 hover:bg-gray-100 whitespace-nowrap transition-colors cursor-pointer"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Change calculation */}
          {typeof cashReceived === 'number' && cashReceived >= cartTotal && (
            <div className="flex justify-between text-xs font-black text-emerald-700 pt-0.5 border-t border-emerald-100">
              <span>Return Change:</span>
              <span>₹{cashChange}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Sub-renderer for Action CTAs (Clear Cart & Complete Bill)
  const renderActionButtons = () => (
    <div className="flex items-center gap-2 w-full">
      <button
        type="button"
        onClick={clearCart}
        disabled={cart.length === 0}
        className="px-3 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 font-bold rounded-xl text-xs flex items-center justify-center transition-colors cursor-pointer shrink-0"
        title="Clear Cart"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        type="button"
        id="btn-complete-bill"
        onClick={handleCompleteBill}
        disabled={cart.length === 0 || isSubmitting}
        className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-40 text-white font-black rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Check className="w-4 h-4 stroke-[3]" />
        <span>{t('completeBill')} • ₹{cartTotal}</span>
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full min-h-0 min-w-0 overflow-hidden bg-slate-100 relative">
      {/* Mobile Top View Switcher (Dishes vs Current Bill) */}
      <div className="lg:hidden flex items-center bg-white border-b border-gray-200 px-3 py-2 shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setMobilePosView('menu')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobilePosView === 'menu'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Menu Dishes</span>
        </button>
        <button
          type="button"
          onClick={() => setMobilePosView('cart')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
            mobilePosView === 'cart'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Current Bill</span>
          {totalCartItemCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                mobilePosView === 'cart'
                  ? 'bg-white text-orange-600'
                  : 'bg-orange-500 text-white'
              }`}
            >
              {totalCartItemCount} (₹{cartTotal})
            </span>
          )}
        </button>
      </div>

      {/* LEFT / TOP SECTION: Menu & Categories */}
      <div
        className={`flex-1 flex-col min-w-0 min-h-0 bg-slate-50 border-r border-gray-200 overflow-hidden ${
          mobilePosView === 'menu' ? 'flex' : 'hidden lg:flex'
        }`}
      >
        {/* Search & Category Filter Bar */}
        <div className="p-2.5 sm:p-3 bg-white border-b border-gray-200 shrink-0 space-y-2">
          {/* Quick Item Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="pos-item-search"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search dishes (Burger, Fries, Momos, Shakes...)"
              className="w-full pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => setLocalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Horizontal Category Scroll Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat.id;
              const catName =
                language === 'mr' && cat.nameMr
                  ? cat.nameMr
                  : language === 'hi' && cat.nameHi
                  ? cat.nameHi
                  : cat.name;

              return (
                <button
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  <span>{catName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items Grid:
            Crucial requirement: 3 cards per row on mobile (`grid-cols-3`)!
            4 on tablet, 4-5 on desktop.
        */}
        <div className="flex-1 min-h-0 overflow-y-auto p-1.5 sm:p-4 custom-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <ShoppingBag className="w-12 h-12 mb-2 stroke-[1.5]" />
              <p className="font-semibold text-sm">No dishes found</p>
              <p className="text-xs">Try searching another category or dish name</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 sm:gap-3">
              {filteredItems.map(item => {
                const displayName =
                  language === 'mr' && item.nameMr
                    ? item.nameMr
                    : language === 'hi' && item.nameHi
                    ? item.nameHi
                    : item.name;

                const isLowStock = item.stock <= item.minimumStock && item.stock > 0;
                const isOutOfStock = item.stock <= 0;
                const inCartQty = cart
                  .filter(c => c.menuItemId === item.id)
                  .reduce((s, c) => s + c.quantity, 0);

                return (
                  <div
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    onClick={() => handleItemClick(item)}
                    className={`relative bg-white rounded-xl border p-1.5 sm:p-3 flex flex-col justify-between transition-all cursor-pointer select-none text-left overflow-hidden ${
                      isOutOfStock
                        ? 'opacity-50 border-gray-200 cursor-not-allowed bg-gray-50'
                        : inCartQty > 0
                        ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-sm'
                        : 'border-gray-200 hover:border-orange-400 hover:shadow-sm'
                    }`}
                  >
                    {/* In-Cart Quantity Badge */}
                    {inCartQty > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-orange-600 text-white text-[10px] sm:text-[11px] font-black flex items-center justify-center shadow z-10">
                        {inCartQty}
                      </span>
                    )}

                    {/* Food Illustration */}
                    <div className="w-full flex items-center justify-center py-0.5 sm:py-2">
                      <FoodIllustration type={item.illustration} className="w-8 h-8 sm:w-14 sm:h-14" />
                    </div>

                    {/* Details */}
                    <div className="mt-1 min-w-0">
                      <h4 className="font-bold text-[10px] sm:text-xs text-gray-900 line-clamp-2 leading-tight">
                        {displayName}
                      </h4>
                      {item.variants && item.variants.length > 0 && (
                        <span className="text-[9px] sm:text-[10px] text-orange-600 font-semibold flex items-center gap-0.5 mt-0.5">
                          <Layers className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">Half/Full</span>
                        </span>
                      )}
                    </div>

                    {/* Price & Add/Minus Controls */}
                    <div className="mt-1.5 pt-1 border-t border-gray-100 flex items-center justify-between gap-1">
                      <span className="font-extrabold text-[11px] sm:text-sm text-gray-900 truncate">
                        ₹{item.sellingPrice}
                      </span>
                      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          id={`btn-minus-${item.id}`}
                          aria-label={`Decrease ${displayName}`}
                          disabled={inCartQty === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDecreaseItem(item);
                          }}
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center transition-all ${
                            inCartQty > 0
                              ? 'bg-orange-100 hover:bg-orange-200 text-orange-700 active:scale-95 cursor-pointer shadow-2xs'
                              : 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-100'
                          }`}
                        >
                          <Minus className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                        </button>

                        {inCartQty > 0 && (
                          <span className="font-black text-[10px] sm:text-xs text-orange-700 min-w-[12px] sm:min-w-[14px] text-center select-none">
                            {inCartQty}
                          </span>
                        )}

                        <button
                          type="button"
                          id={`btn-plus-${item.id}`}
                          aria-label={`Add ${displayName}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick(item);
                          }}
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                            inCartQty > 0
                              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-2xs'
                              : 'bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200'
                          }`}
                        >
                          <Plus className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    {/* Stock Alert Badge if low */}
                    {isLowStock && (
                      <div className="absolute top-1 left-1 bg-amber-50 border border-amber-300 text-amber-800 text-[8px] sm:text-[9px] font-bold px-1 rounded">
                        {item.stock} left
                      </div>
                    )}
                    {isOutOfStock && (
                      <div className="absolute top-1 left-1 bg-red-100 text-red-700 text-[8px] sm:text-[9px] font-bold px-1 rounded">
                        Out
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Floating Cart Summary Bar (When in Menu View & has items) */}
        {totalCartItemCount > 0 && mobilePosView === 'menu' && (
          <div className="lg:hidden p-2 bg-white border-t border-gray-200 shadow-lg shrink-0 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs shrink-0">
                {totalCartItemCount}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-gray-500 font-semibold truncate">Total Order</div>
                <div className="text-xs sm:text-sm font-extrabold text-gray-900">₹{cartTotal}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobilePosView('cart')}
              className="py-1.5 px-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>View Cart & Pay</span>
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* RIGHT / BILL SECTION: Current Cart & Checkout */}
      <div
        className={`w-full lg:w-[440px] xl:w-[470px] bg-white shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 h-full min-h-0 min-w-0 overflow-hidden ${
          mobilePosView === 'cart' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'
        }`}
      >
        {/* MOBILE VIEW (< lg): Fluid vertical scroll for order setup + items + summary + payment, with pinned bottom checkout bar */}
        <div className="lg:hidden flex flex-col h-full min-h-0 overflow-hidden">
          {/* Mobile Top Navigation Bar */}
          <div className="p-3 bg-white border-b border-gray-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setMobilePosView('menu')}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-orange-600 py-1.5 px-2.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Add More Dishes</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-gray-900">
                Current Cart ({totalCartItemCount})
              </span>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-bold text-red-500 hover:text-red-700 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Mobile Fluid Scrollable Area (Order Setup, Cart Items, Bill Breakdown, Payment Methods) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 custom-scrollbar bg-slate-50/60">
            {renderOrderSetup(true)}
            {renderCartItems(true)}
            {renderBillSummary()}
            {renderPaymentMethods()}
          </div>

          {/* Mobile Pinned Bottom Checkout Bar (Above mobile nav, completely visible, no pb-20) */}
          <div className="p-3 bg-white border-t border-gray-200 shrink-0 shadow-lg flex items-center gap-2">
            {renderActionButtons()}
          </div>
        </div>

        {/* DESKTOP VIEW (>= lg): Pinned Top Setup, Middle Scrollable Items List, Pinned Bottom Summary & Checkout */}
        <div className="hidden lg:flex flex-col h-full min-h-0 overflow-hidden">
          <div className="shrink-0">
            {renderOrderSetup(false)}
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 min-h-0 custom-scrollbar bg-slate-50/30">
            {renderCartItems(false)}
          </div>

          <div className="shrink-0 border-t border-gray-200 p-3.5 space-y-3 bg-white shadow-2xs">
            {renderBillSummary()}
            {renderPaymentMethods()}
            {renderActionButtons()}
          </div>
        </div>
      </div>

      {/* VARIANT PICKER MODAL (For Portion / Half / Full) */}
      {selectedVariantItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <FoodIllustration type={selectedVariantItem.illustration} className="w-10 h-10" />
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">{selectedVariantItem.name}</h3>
                <p className="text-xs text-gray-500">{t('selectVariant')}</p>
              </div>
            </div>

            <div className="py-4 space-y-2">
              {selectedVariantItem.variants?.map(v => (
                <button
                  key={v.id}
                  onClick={() => {
                    addToCart(selectedVariantItem, v.id);
                    setSelectedVariantItem(null);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors group cursor-pointer text-left"
                >
                  <div>
                    <span className="font-bold text-sm text-gray-900 group-hover:text-orange-700">
                      {v.name} Portion
                    </span>
                    <span className="block text-[11px] text-gray-500">Standard serving</span>
                  </div>
                  <span className="font-extrabold text-base text-gray-900 group-hover:text-orange-600">
                    ₹{v.sellingPrice}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSelectedVariantItem(null)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* UPI QR CODE POPUP MODAL */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl text-center border border-gray-200">
            <h3 className="font-extrabold text-base text-gray-900">SYS Cafe UPI Payment</h3>
            <p className="text-xs text-gray-500 mt-0.5">Scan to pay directly to cafe account</p>

            {/* Simulated UPI QR Box */}
            <div className="my-4 p-4 bg-purple-50 rounded-xl border-2 border-dashed border-purple-300 flex flex-col items-center justify-center">
              <QrCode className="w-32 h-32 text-purple-700" />
              <div className="mt-2 text-xs font-mono font-bold text-purple-900">
                {businessProfile.upiId}
              </div>
              <div className="text-xs font-extrabold text-gray-900 mt-1">
                Amount: ₹{cartTotal}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowUpiModal(false)}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs"
              >
                Done
              </button>
              <button
                onClick={() => setShowUpiModal(false)}
                className="px-3 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
