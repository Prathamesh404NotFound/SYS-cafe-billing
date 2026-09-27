import React from 'react';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  UtensilsCrossed,
  Timer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KitchenOrder } from '../../types';

export const KitchenScreen: React.FC = () => {
  const { kitchenOrders, updateKitchenOrderStatus, t } = useApp();

  const activeOrders = kitchenOrders.filter(o => o.status !== 'completed');
  const completedOrders = kitchenOrders.filter(o => o.status === 'completed');

  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-3 sm:p-6 custom-scrollbar space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-orange-600" />
            <span>{t('navKitchen')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Live Kitchen Order Tickets (KOT) with prep status and table assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-xl text-xs font-black flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>{activeOrders.length} Orders in Kitchen</span>
          </span>
        </div>
      </div>

      {/* Active KOT Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeOrders.map(order => {
          const isPreparing = order.status === 'preparing';
          const isReady = order.status === 'ready';

          return (
            <div
              key={order.id}
              className={`bg-white rounded-2xl border-2 shadow-sm p-4 flex flex-col justify-between transition-all ${
                isReady
                  ? 'border-emerald-500 bg-emerald-50/20'
                  : isPreparing
                  ? 'border-amber-400'
                  : 'border-gray-200'
              }`}
            >
              <div>
                {/* KOT Top Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-gray-900">
                      #{order.kotNumber}
                    </span>
                    <span className="text-xs text-gray-400">({order.orderType})</span>
                  </div>

                  {order.tableNumber ? (
                    <span className="px-2.5 py-0.5 rounded-lg bg-orange-500 text-white text-xs font-black">
                      Table {order.tableNumber}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-black uppercase">
                      Parcel
                    </span>
                  )}
                </div>

                {/* Time created */}
                <div className="flex items-center gap-1 text-[11px] text-gray-400 py-1.5 font-mono">
                  <Timer className="w-3.5 h-3.5" />
                  <span>Placed at {order.createdAt}</span>
                </div>

                {/* Items List */}
                <div className="py-2 space-y-2">
                  {order.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-2 rounded-xl bg-slate-50 border border-gray-100"
                    >
                      <div>
                        <span className="font-bold text-xs text-gray-900 block">
                          {it.name}
                        </span>
                        {it.variant && (
                          <span className="text-[10px] font-bold text-orange-600">
                            Portion: {it.variant}
                          </span>
                        )}
                        {it.notes && (
                          <span className="text-[10px] text-red-600 block italic">
                            * {it.notes}
                          </span>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-orange-100 text-orange-950 font-black text-xs">
                        x{it.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex gap-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateKitchenOrderStatus(order.id, 'preparing')}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    Start Cooking
                  </button>
                )}

                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateKitchenOrderStatus(order.id, 'ready')}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    Mark Ready to Serve
                  </button>
                )}

                {order.status === 'ready' && (
                  <button
                    onClick={() => updateKitchenOrderStatus(order.id, 'completed')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Delivered to Customer</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {activeOrders.length === 0 && (
          <div className="col-span-full py-16 bg-white rounded-2xl border border-gray-200 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-extrabold text-base text-gray-900">All Kitchen Orders Cleared</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No pending dishes right now. When orders are billed from the POS screen, new KOT tickets will appear here instantly.
            </p>
          </div>
        )}
      </div>

      {/* Completed Orders history toggle */}
      {completedOrders.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
          <h3 className="font-extrabold text-xs text-gray-500 uppercase tracking-wider">
            Recently Prepared Tickets ({completedOrders.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {completedOrders.slice(0, 8).map(o => (
              <div
                key={o.id}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-gray-200 text-xs text-gray-600 flex items-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-mono font-bold">#{o.kotNumber}</span>
                <span>{o.tableNumber ? `Table ${o.tableNumber}` : 'Takeaway'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
