import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  Users,
  Utensils,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Search,
  RotateCcw,
  Sparkles,
  Layers,
  Clock,
  DollarSign,
  QrCode,
  Receipt
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TableItem } from '../../types';
import { TableQrModal } from './TableQrModal';
import { CustomerTableModal } from './CustomerTableModal';
import { SettleBillModal } from './SettleBillModal';

interface TableFormData {
  number: number | '';
  name: string;
  capacity: number;
  floor: string;
}

const DEFAULT_FLOORS = ['Main Floor', 'AC Hall', 'Balcony', 'Outdoor Garden'];

export const TablesScreen: React.FC = () => {
  const {
    tables,
    addTable,
    updateTable,
    deleteTable,
    updateTableStatus,
    setSelectedTable,
    setActiveTab,
    kitchenOrders,
    bills,
    t
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'occupied' | 'bill_pending'>('all');
  const [filterFloor, setFilterFloor] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableItem | null>(null);
  const [formData, setFormData] = useState<TableFormData>({
    number: '',
    name: '',
    capacity: 4,
    floor: 'Main Floor'
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirmation state
  const [deletingTable, setDeletingTable] = useState<TableItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Table QR Stand & Customer View state
  const [qrModalTable, setQrModalTable] = useState<TableItem | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [customerViewTableNum, setCustomerViewTableNum] = useState<number | null>(null);
  const [settlingTable, setSettlingTable] = useState<TableItem | null>(null);

  // Auto-extract unique floors/sections from existing tables
  const availableFloors = useMemo(() => {
    const set = new Set<string>(DEFAULT_FLOORS);
    tables.forEach(t => {
      if (t.floor) set.add(t.floor);
    });
    return Array.from(set);
  }, [tables]);

  // Next suggested table number
  const nextSuggestedNumber = useMemo(() => {
    if (tables.length === 0) return 1;
    const maxNum = Math.max(...tables.map(t => Number(t.number) || 0));
    return maxNum + 1;
  }, [tables]);

  // Filtered tables
  const filteredTables = useMemo(() => {
    return tables.filter(tbl => {
      // Search by number or name
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchNumber = String(tbl.number).includes(q) || `t-${tbl.number}`.toLowerCase().includes(q);
        const matchName = tbl.name.toLowerCase().includes(q);
        const matchCustomer = tbl.customerName?.toLowerCase().includes(q);
        if (!matchNumber && !matchName && !matchCustomer) return false;
      }

      // Filter by status
      if (filterStatus !== 'all') {
        if (filterStatus === 'available' && tbl.status !== 'available') return false;
        if (filterStatus === 'occupied' && tbl.status !== 'occupied') return false;
        if (filterStatus === 'bill_pending' && tbl.status !== 'bill_pending') return false;
      }

      // Filter by floor
      if (filterFloor !== 'all' && (tbl.floor || 'Main Floor') !== filterFloor) {
        return false;
      }

      return true;
    });
  }, [tables, searchQuery, filterStatus, filterFloor]);

  // Aggregate stats
  const totalTables = tables.length;
  const occupiedCount = tables.filter(t => t.status === 'occupied').length;
  const billedCount = tables.filter(t => t.status === 'bill_pending').length;
  const freeCount = tables.filter(t => t.status === 'available').length;
  const totalLiveRevenue = tables.reduce((sum, t) => sum + (t.orderTotal || 0), 0);
  const totalCapacity = tables.reduce((sum, t) => sum + (t.capacity || 4), 0);

  // Actions
  const handleSelectTableForPOS = (table: TableItem) => {
    setSelectedTable(table.number);
    setActiveTab('pos');
  };

  const handleClearTable = (table: TableItem) => {
    updateTableStatus(table.id, 'available');
  };

  const handleOpenAddModal = () => {
    setEditingTable(null);
    setFormData({
      number: nextSuggestedNumber,
      name: `Table ${nextSuggestedNumber}`,
      capacity: 4,
      floor: 'Main Floor'
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (table: TableItem) => {
    setEditingTable(table);
    setFormData({
      number: table.number,
      name: table.name || `Table ${table.number}`,
      capacity: table.capacity || 4,
      floor: table.floor || 'Main Floor'
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.number || Number(formData.number) <= 0) {
      setFormError('Please enter a valid table number greater than 0.');
      return;
    }

    if (editingTable) {
      // Update existing
      const res = updateTable(editingTable.id, {
        number: Number(formData.number),
        name: formData.name.trim() || `Table ${formData.number}`,
        capacity: Number(formData.capacity) || 4,
        floor: formData.floor.trim() || 'Main Floor'
      });
      if (!res.success) {
        setFormError(res.error || 'Failed to update table.');
        return;
      }
    } else {
      // Add new
      const res = addTable({
        number: Number(formData.number),
        name: formData.name.trim() || `Table ${formData.number}`,
        capacity: Number(formData.capacity) || 4,
        floor: formData.floor.trim() || 'Main Floor'
      });
      if (!res.success) {
        setFormError(res.error || 'Failed to add table.');
        return;
      }
    }

    setIsModalOpen(false);
    setEditingTable(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingTable) return;
    const res = deleteTable(deletingTable.id);
    if (!res.success) {
      setDeleteError(res.error || 'Failed to delete table.');
      return;
    }
    setDeletingTable(null);
    setDeleteError(null);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner & Live Stats */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-gray-900 tracking-tight">
                {t('tablesTitle') || 'Table Management'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Organize dine-in seating, monitor live occupancy, and manage floor tables with real-time billing.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: QR Stands & Add New Table */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setQrModalTable(tables[0] || null);
              setIsQrModalOpen(true);
            }}
            className="px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Generate and print Table Tent QR Stands"
          >
            <QrCode className="w-4 h-4" />
            <span>Table QR Stands</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Table</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Total Tables</span>
          <div className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
            {totalTables}
          </div>
          <span className="text-[11px] text-gray-500 mt-0.5 block">
            {totalCapacity} guest seats total
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Available</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            {freeCount}
          </div>
          <span className="text-[11px] text-emerald-700/80 mt-0.5 block">
            Ready for new guests
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block">Occupied / Billed</span>
          <div className="text-xl sm:text-2xl font-black text-orange-600 mt-1">
            {occupiedCount + billedCount}
          </div>
          <span className="text-[11px] text-orange-700/80 mt-0.5 block">
            {occupiedCount} dining · {billedCount} bill due
          </span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">Live Running Total</span>
          <div className="text-xl sm:text-2xl font-black text-purple-700 mt-1">
            ₹{totalLiveRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-500 mt-0.5 block">
            Active dine-in orders
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search table # or name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls (Segmented clean buttons) */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({tables.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('available')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'available'
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Available ({freeCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('occupied')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'occupied'
                  ? 'bg-white text-orange-700 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Occupied ({occupiedCount})
            </button>
          </div>

          {/* Floor / Section Filter */}
          <select
            value={filterFloor}
            onChange={e => setFilterFloor(e.target.value)}
            className="bg-slate-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Sections</option>
            {availableFloors.map(floor => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tables Grid */}
      {filteredTables.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-400 mb-3">
            <LayoutGrid className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">No tables found</h3>
          <p className="text-xs text-gray-500 max-w-sm mt-1">
            {searchQuery || filterStatus !== 'all' || filterFloor !== 'all'
              ? 'Try changing your search query or filters.'
              : 'Add your first dining table to start managing seat reservations and orders.'}
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            + Add New Table
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredTables.map(table => {
            const isOccupied = table.status === 'occupied';
            const isBilled = table.status === 'bill_pending';
            const isAvailable = table.status === 'available';

            // Find active ordered items for this table
            const activeKitchen = kitchenOrders.find(
              ko => String(ko.tableNumber) === String(table.number) && ko.status !== 'completed'
            );
            const latestBill = bills.find(
              b => String(b.tableNumber) === String(table.number) && !b.isRefunded
            );
            const itemsList = activeKitchen?.items || latestBill?.items;

            return (
              <div
                key={table.id}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all bg-white relative group shadow-2xs hover:shadow-sm ${
                  isOccupied
                    ? 'border-orange-400 bg-orange-50/20'
                    : isBilled
                    ? 'border-blue-400 bg-blue-50/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  {/* Top Bar: Table Number, Floor tag, and Edit/Delete controls */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg text-gray-900">
                        T-{table.number}
                      </span>
                      {table.floor && (
                        <span className="text-[10px] font-semibold text-gray-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {table.floor}
                        </span>
                      )}
                    </div>

                    {/* Quick Edit/Delete/QR buttons */}
                    <div className="flex items-center gap-0.5 opacity-90 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          setQrModalTable(table);
                          setIsQrModalOpen(true);
                        }}
                        className="p-1 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                        title="View Table QR Stand & Menu"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(table)}
                        className="p-1 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit Table"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeletingTable(table);
                          setDeleteError(null);
                        }}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Table"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Status Indicator & Name */}
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-700 truncate pr-2">
                      {table.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                        isOccupied
                          ? 'bg-orange-100 text-orange-800'
                          : isBilled
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isOccupied ? 'Occupied' : isBilled ? 'Bill Due' : 'Available'}
                    </span>
                  </div>

                  {/* Seating Capacity */}
                  <div className="mt-1.5 text-[11px] text-gray-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>{table.capacity || 4} Guests Capacity</span>
                  </div>

                  {/* Occupied Bill Info & Items Preview */}
                  {table.orderTotal !== undefined && table.orderTotal > 0 ? (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-gray-200/90 text-center space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-semibold uppercase">
                          Current Bill
                        </span>
                        <span className="font-black text-sm text-gray-900">
                          ₹{table.orderTotal}
                        </span>
                      </div>

                      {table.customerName && (
                        <div className="text-left text-[11px] text-gray-700 font-medium truncate flex items-center gap-1">
                          <span className="text-gray-400">Guest:</span>
                          <span className="font-bold">{table.customerName}</span>
                        </div>
                      )}

                      {/* Active Order Items Preview */}
                      {itemsList && itemsList.length > 0 && (
                        <div className="text-[10px] text-left bg-white p-2 rounded-lg border border-gray-200 text-gray-700">
                          <span className="font-bold text-orange-700 block text-[9px] uppercase tracking-wider mb-0.5">
                            Order Items ({itemsList.reduce((s, i) => s + i.quantity, 0)}):
                          </span>
                          <span className="line-clamp-2 leading-tight font-medium">
                            {itemsList.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 py-3 text-center text-xs text-gray-400 bg-slate-50/50 rounded-xl border border-dashed border-gray-200">
                      Table Ready & Clean
                    </div>
                  )}
                </div>

                {/* Card Action Buttons: Order First -> Settle & Pay After Dining */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-1.5">
                  {!isAvailable ? (
                    <>
                      {/* Customer has finished eating -> Settle & Pay */}
                      <button
                        type="button"
                        onClick={() => setSettlingTable(table)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Settle & Collect Payment (₹{table.orderTotal || 0})</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSelectTableForPOS(table)}
                          className="flex-1 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-orange-200 transition-colors cursor-pointer"
                        >
                          <Utensils className="w-3.5 h-3.5" />
                          <span>+ Add More Dishes</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleClearTable(table)}
                          className="px-2.5 py-1.5 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl border border-gray-200 transition-colors cursor-pointer"
                          title="Free Table directly"
                        >
                          Free Table
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Table is empty -> Place order first */
                    <button
                      type="button"
                      onClick={() => handleSelectTableForPOS(table)}
                      className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Take Order & Seat Table</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT TABLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-200 relative animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-gray-900">
                  {editingTable ? `Edit Table T-${editingTable.number}` : 'Add New Dining Table'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveTable} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                {/* Table Number */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Table Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xs">
                      T-
                    </span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.number}
                      onChange={e => {
                        const val = e.target.value ? Number(e.target.value) : '';
                        setFormData(prev => ({
                          ...prev,
                          number: val,
                          name: prev.name.startsWith('Table ') ? `Table ${val}` : prev.name
                        }));
                        if (formError) setFormError(null);
                      }}
                      placeholder="1"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-black text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Guest Capacity *
                  </label>
                  <select
                    value={formData.capacity}
                    onChange={e => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white cursor-pointer"
                  >
                    {[1, 2, 3, 4, 6, 8, 10, 12, 16].map(cap => (
                      <option key={cap} value={cap}>
                        {cap} {cap === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table Name / Alias */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Table Name / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Corner Window Table"
                  value={formData.name}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    if (formError) setFormError(null);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
              </div>

              {/* Floor / Section */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Floor / Zone / Section
                </label>
                <input
                  type="text"
                  list="floor-suggestions"
                  placeholder="e.g. Main Floor, AC Hall, Balcony"
                  value={formData.floor}
                  onChange={e => setFormData(prev => ({ ...prev, floor: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white"
                />
                <datalist id="floor-suggestions">
                  {availableFloors.map(floor => (
                    <option key={floor} value={floor} />
                  ))}
                </datalist>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingTable ? 'Save Changes' : 'Create Table'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingTable && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-gray-200 relative animate-in zoom-in-95 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  Delete Table T-{deletingTable.number}?
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Are you sure you want to remove {deletingTable.name}?
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{deleteError}</span>
              </div>
            )}

            <p className="text-xs text-gray-600 bg-slate-50 p-3 rounded-xl border border-gray-200">
              Removing this table will take it off the live POS floor map.
              {deletingTable.status !== 'available' && (
                <span className="block mt-1 text-red-600 font-bold">
                  Note: This table is currently {deletingTable.status}. Please clear the table before deleting.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeletingTable(null);
                  setDeleteError(null);
                }}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Table</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table QR Stand Modal */}
      <TableQrModal
        isOpen={isQrModalOpen}
        initialTable={qrModalTable}
        onClose={() => {
          setIsQrModalOpen(false);
          setQrModalTable(null);
        }}
        onOpenCustomerView={tableNum => {
          setIsQrModalOpen(false);
          setCustomerViewTableNum(tableNum);
        }}
      />

      {/* Interactive Customer Table View Modal */}
      {customerViewTableNum !== null && (
        <CustomerTableModal
          tableNumber={customerViewTableNum}
          isOpen={customerViewTableNum !== null}
          onClose={() => setCustomerViewTableNum(null)}
        />
      )}

      {/* Settle Bill & Free Table Modal */}
      {settlingTable && (
        <SettleBillModal
          table={settlingTable}
          isOpen={settlingTable !== null}
          onClose={() => setSettlingTable(null)}
        />
      )}
    </div>
  );
};
