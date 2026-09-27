import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Percent,
  IndianRupee,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem } from '../../types';
import { FoodIllustration, FoodIllustrationType } from '../illustrations/FoodIllustrations';

export const MenuScreen: React.FC = () => {
  const {
    menuItems,
    categories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    t,
    language
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formNameMr, setFormNameMr] = useState('');
  const [formNameHi, setFormNameHi] = useState('');
  const [formCategory, setFormCategory] = useState(categories[1]?.id || 'burger');
  const [formIllustration, setFormIllustration] = useState<FoodIllustrationType>('burger');
  const [formSellingPrice, setFormSellingPrice] = useState<number | ''>(70);
  const [formCostPrice, setFormCostPrice] = useState<number | ''>(35);
  const [formStock, setFormStock] = useState<number | ''>(25);
  const [formUnit, setFormUnit] = useState('pcs');
  const [formMinStock, setFormMinStock] = useState<number | ''>(10);
  const [formDescription, setFormDescription] = useState('');
  const [hasVariants, setHasVariants] = useState(false);
  const [halfPrice, setHalfPrice] = useState<number | ''>(50);
  const [halfCost, setHalfCost] = useState<number | ''>(25);
  const [fullPrice, setFullPrice] = useState<number | ''>(80);
  const [fullCost, setFullCost] = useState<number | ''>(40);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nameMr && item.nameMr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.nameHi && item.nameHi.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || item.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormNameMr('');
    setFormNameHi('');
    setFormCategory('burger');
    setFormIllustration('burger');
    setFormSellingPrice(70);
    setFormCostPrice(35);
    setFormStock(25);
    setFormUnit('pcs');
    setFormMinStock(10);
    setFormDescription('');
    setHasVariants(false);
    setShowItemModal(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormNameMr(item.nameMr || '');
    setFormNameHi(item.nameHi || '');
    setFormCategory(item.categoryId);
    setFormIllustration(item.illustration as FoodIllustrationType);
    setFormSellingPrice(item.sellingPrice);
    setFormCostPrice(item.costPrice);
    setFormStock(item.stock);
    setFormUnit(item.unit);
    setFormMinStock(item.minimumStock);
    setFormDescription(item.description || '');
    if (item.variants && item.variants.length > 0) {
      setHasVariants(true);
      const half = item.variants.find(v => v.name === 'Half');
      const full = item.variants.find(v => v.name === 'Full');
      if (half) {
        setHalfPrice(half.sellingPrice);
        setHalfCost(half.costPrice);
      }
      if (full) {
        setFullPrice(full.sellingPrice);
        setFullCost(full.costPrice);
      }
    } else {
      setHasVariants(false);
    }
    setShowItemModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSellingPrice) return;

    const variants = hasVariants
      ? [
          {
            id: `${editingItem ? editingItem.id : Date.now()}_half`,
            name: 'Half',
            nameMr: 'हाफ',
            nameHi: 'हाफ',
            sellingPrice: Number(halfPrice) || Number(formSellingPrice),
            costPrice: Number(halfCost) || Number(formCostPrice)
          },
          {
            id: `${editingItem ? editingItem.id : Date.now()}_full`,
            name: 'Full',
            nameMr: 'फुल',
            nameHi: 'फुल',
            sellingPrice: Number(fullPrice) || Number(formSellingPrice),
            costPrice: Number(fullCost) || Number(formCostPrice)
          }
        ]
      : undefined;

    if (editingItem) {
      updateMenuItem({
        ...editingItem,
        name: formName.trim(),
        nameMr: formNameMr.trim() || formName.trim(),
        nameHi: formNameHi.trim() || formName.trim(),
        categoryId: formCategory,
        illustration: formIllustration,
        sellingPrice: Number(formSellingPrice),
        costPrice: Number(formCostPrice),
        stock: Number(formStock),
        unit: formUnit,
        minimumStock: Number(formMinStock),
        description: formDescription.trim() || undefined,
        variants
      });
    } else {
      addMenuItem({
        name: formName.trim(),
        nameMr: formNameMr.trim() || formName.trim(),
        nameHi: formNameHi.trim() || formName.trim(),
        categoryId: formCategory,
        illustration: formIllustration,
        sellingPrice: Number(formSellingPrice),
        costPrice: Number(formCostPrice),
        stock: Number(formStock),
        unit: formUnit,
        minimumStock: Number(formMinStock),
        isAvailable: true,
        description: formDescription.trim() || undefined,
        variants
      });
    }

    setShowItemModal(false);
  };

  const handleToggleAvailable = (item: MenuItem) => {
    updateMenuItem({
      ...item,
      isAvailable: !item.isAvailable
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this dish from the menu?')) {
      deleteMenuItem(id);
    }
  };

  const illustrationOptions: FoodIllustrationType[] = [
    'burger',
    'fries',
    'khandoli',
    'momos',
    'nuggets',
    'maggie',
    'pasta',
    'mocktail',
    'tea',
    'coffee',
    'colddrink',
    'milkshake',
    'sandwich',
    'pizza',
    'water'
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-orange-600" />
            <span>{t('menuTitle')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Configure menu dishes, prices, portion sizes, recipes cost and availability.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('addItem')}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by dish name (English, मराठी, हिन्दी)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div className="text-xs font-bold text-gray-500">
            Total Dishes: {menuItems.length}
          </div>
        </div>

        {/* Category Horizontal Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-slate-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredItems.map(item => {
          const profit = item.sellingPrice - item.costPrice;
          const margin = ((profit / item.sellingPrice) * 100).toFixed(0);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col justify-between transition-all ${
                !item.isAvailable ? 'border-gray-200 opacity-60 bg-gray-50' : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <div>
                {/* Top bar: Category & Availability */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-orange-50 text-orange-800">
                    {item.categoryId.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => handleToggleAvailable(item)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                      item.isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Paused'}
                  </button>
                </div>

                {/* Illustration & Name */}
                <div className="my-3 flex items-center gap-3">
                  <FoodIllustration type={item.illustration} className="w-12 h-12 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-gray-900 truncate">{item.name}</h4>
                    {item.nameMr && (
                      <p className="text-[11px] text-gray-500 truncate">{item.nameMr}</p>
                    )}
                    {item.variants && (
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded">
                        Half / Full
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing & Margin Box */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-gray-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selling Price:</span>
                    <span className="font-black text-gray-900">₹{item.sellingPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cost Price:</span>
                    <span className="font-medium text-gray-600">₹{item.costPrice}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-200 text-[11px] font-bold">
                    <span className="text-emerald-700">Profit Margin:</span>
                    <span className="text-emerald-700">₹{profit} ({margin}%)</span>
                  </div>
                </div>

                {/* Stock info */}
                <div className="mt-2 text-[11px] text-gray-500 flex justify-between">
                  <span>Stock: {item.stock} {item.unit}</span>
                  <span className={item.stock <= item.minimumStock ? 'text-amber-600 font-bold' : ''}>
                    Min: {item.minimumStock}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT DISH MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-gray-200 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95"
          >
            <h3 className="font-extrabold text-base text-gray-900">
              {editingItem ? 'Edit Dish Details' : 'Add New Dish to Menu'}
            </h3>

            {/* Names */}
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Item Name (English) *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Cheese Peri Peri Fries"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Marathi Name (मराठी)
                  </label>
                  <input
                    type="text"
                    value={formNameMr}
                    onChange={e => setFormNameMr(e.target.value)}
                    placeholder="उदा. चीझ पेरी पेरी फ्राईज"
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Hindi Name (हिन्दी)
                  </label>
                  <input
                    type="text"
                    value={formNameHi}
                    onChange={e => setFormNameHi(e.target.value)}
                    placeholder="उदा. चीज़ पेरी पेरी फ्राइज़"
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Category & Illustration */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
                >
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Icon Style</label>
                <select
                  value={formIllustration}
                  onChange={e => setFormIllustration(e.target.value as FoodIllustrationType)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
                >
                  {illustrationOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formSellingPrice}
                  onChange={e => setFormSellingPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-black text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Cost Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formCostPrice}
                  onChange={e => setFormCostPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-black text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Stock & Unit */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Current Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formStock}
                  onChange={e => setFormStock(e.target.value ? Number(e.target.value) : '')}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Unit</label>
                <input
                  type="text"
                  value={formUnit}
                  onChange={e => setFormUnit(e.target.value)}
                  placeholder="pcs / plates / bowls"
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Min. Alert Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formMinStock}
                  onChange={e => setFormMinStock(e.target.value ? Number(e.target.value) : '')}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold"
                  required
                />
              </div>
            </div>

            {/* Portions / Variants checkbox (Half / Full) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={e => setHasVariants(e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-xs font-bold text-gray-800">
                  Has Half & Full Portions (like Khandoli, Momos)
                </span>
              </label>

              {hasVariants && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-gray-600">Half Portion</span>
                    <input
                      type="number"
                      placeholder="Half Selling ₹"
                      value={halfPrice}
                      onChange={e => setHalfPrice(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded p-1.5 text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Half Cost ₹"
                      value={halfCost}
                      onChange={e => setHalfCost(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded p-1.5 text-xs text-gray-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-gray-600">Full Portion</span>
                    <input
                      type="number"
                      placeholder="Full Selling ₹"
                      value={fullPrice}
                      onChange={e => setFullPrice(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded p-1.5 text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Full Cost ₹"
                      value={fullCost}
                      onChange={e => setFullCost(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded p-1.5 text-xs text-gray-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
              <textarea
                rows={2}
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Ingredients, recipe notes..."
                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer"
              >
                {editingItem ? 'Update Dish' : 'Save Dish'}
              </button>
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
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
