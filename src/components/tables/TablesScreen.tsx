import React from 'react';
import {
  LayoutGrid,
  Users,
  Utensils
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TableItem } from '../../types';

export const TablesScreen: React.FC = () => {
  const { tables, updateTableStatus, setSelectedTable, setActiveTab, t } = useApp();

  const handleSelectTableForPOS = (table: TableItem) => {
    setSelectedTable(table.number);
    setActiveTab('pos');
  };

  const handleClearTable = (table: TableItem) => {
    updateTableStatus(table.id, 'available');
  };

  const occupiedCount = tables.filter(t => t.status !== 'available').length;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-orange-600" />
            <span>{t('tablesTitle')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Monitor dine-in tables, live customer bills, occupancy status and free seats.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800">
            {tables.length - occupiedCount} Free
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-orange-100 text-orange-800">
            {occupiedCount} Occupied
          </span>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {tables.map(table => {
          const isOccupied = table.status === 'occupied';
          const isBilled = table.status === 'bill_pending';
          const isAvailable = table.status === 'available';

          return (
            <div
              key={table.id}
              className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                isOccupied
                  ? 'border-orange-400 bg-orange-50/40 shadow-sm'
                  : isBilled
                  ? 'border-blue-400 bg-blue-50/40 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-lg text-gray-900">
                    T-{table.number}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      isOccupied
                        ? 'bg-orange-200 text-orange-900'
                        : isBilled
                        ? 'bg-blue-200 text-blue-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isOccupied ? 'Occupied' : isBilled ? 'Bill Due' : 'Available'}
                  </span>
                </div>

                <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{table.name}</span>
                </div>

                {/* Bill info if occupied */}
                {table.orderTotal !== undefined && table.orderTotal > 0 ? (
                  <div className="mt-3 p-2 rounded-xl bg-white border border-gray-200 text-center">
                    <span className="text-[10px] text-gray-400 block">Current Bill</span>
                    <span className="font-black text-sm text-gray-900">
                      ₹{table.orderTotal}
                    </span>
                    {table.customerName && (
                      <span className="text-[10px] text-gray-500 block truncate mt-0.5">
                        {table.customerName}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 py-2 text-center text-xs text-gray-400">
                    Table Ready
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-1.5">
                <button
                  onClick={() => handleSelectTableForPOS(table)}
                  className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition-colors cursor-pointer"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>{isOccupied ? 'Add Items' : 'Start Bill'}</span>
                </button>

                {!isAvailable && (
                  <button
                    onClick={() => handleClearTable(table)}
                    className="w-full py-1 text-[11px] font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    Clear & Free Table
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
