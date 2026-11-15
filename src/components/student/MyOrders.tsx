import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { StatusBadge } from '../common/Badge';
import {
  FolderClock,
  Search,
  Filter,
  ArrowRight,
  Shirt,
  Calendar,
  KeyRound,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const MyOrders: React.FC = () => {
  const { orders, setSelectedOrderId, setActiveTab, currentStudent } = useLaundry();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Student orders
  const studentOrders = orders.filter((o) => o.studentId === currentStudent.studentId);

  // Filter criteria
  const filteredOrders = studentOrders.filter((order) => {
    // Search query filter
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.hostel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.specialCare?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'in_progress')
      return ['received', 'sorting', 'washing', 'drying'].includes(order.status) && !order.isDelayed;
    if (activeFilter === 'ready_for_pickup')
      return order.status === 'ready_for_pickup';
    if (activeFilter === 'completed')
      return order.status === 'collected';
    if (activeFilter === 'delayed')
      return !!order.isDelayed && order.status !== 'collected';

    return true;
  });

  // Tab counts
  const counts = {
    all: studentOrders.length,
    in_progress: studentOrders.filter(
      (o) => ['received', 'sorting', 'washing', 'drying'].includes(o.status) && !o.isDelayed
    ).length,
    ready_for_pickup: studentOrders.filter((o) => o.status === 'ready_for_pickup').length,
    completed: studentOrders.filter((o) => o.status === 'collected').length,
    delayed: studentOrders.filter((o) => !!o.isDelayed && o.status !== 'collected').length,
  };

  const tabs = [
    { id: 'all', label: 'All Orders', count: counts.all },
    { id: 'in_progress', label: 'In Progress', count: counts.in_progress },
    { id: 'ready_for_pickup', label: 'Ready for Pickup', count: counts.ready_for_pickup },
    { id: 'delayed', label: 'Delayed', count: counts.delayed },
    { id: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold mb-2">
            <FolderClock className="w-3.5 h-3.5 text-slate-600" />
            <span>Order History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            My Laundry Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete record of your current and past laundry submissions at LPU.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID or care note..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 shadow-xs"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => {
            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm">
                        <Shirt className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-mono text-base font-bold text-slate-900">
                          {order.id}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {order.submissionDate}
                        </div>
                      </div>
                    </div>

                    <StatusBadge status={order.status} isDelayed={order.isDelayed} />
                  </div>

                  {/* Delay Reason Callout if applicable */}
                  {order.isDelayed && order.status !== 'collected' && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="leading-snug">
                        <span className="font-bold">Operational Delay: </span>
                        {order.delayReason || 'Line maintenance in washing unit.'}
                      </div>
                    </div>
                  )}

                  {/* Garment details */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Garment Count:</span>
                      <span className="font-bold text-slate-900">{order.totalItems} clothes</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Expected Ready:</span>
                      <span className="font-bold text-slate-800">
                        {order.isDelayed && order.revisedExpectedDate
                          ? order.revisedExpectedDate
                          : order.expectedCollectionDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <KeyRound className="w-3 h-3 text-sky-600" />
                        Verification PIN:
                      </span>
                      <span className="font-mono font-bold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded">
                        {order.collectionPin}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom View Button */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setActiveTab('track');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>View Timeline Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching orders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or filter criteria to see your orders.
          </p>
        </div>
      )}
    </div>
  );
};
