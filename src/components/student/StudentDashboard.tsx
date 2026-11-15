import React from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { StatusBadge } from '../common/Badge';
import { StatusTimeline } from '../common/StatusTimeline';
import {
  PlusCircle,
  Search,
  AlertCircle,
  Clock,
  Sparkles,
  KeyRound,
  ArrowRight,
  Shirt,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  Building,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentStudent,
    activeOrder,
    orders,
    complaints,
    setActiveTab,
    setSelectedOrderId,
    setIsGuideModalOpen,
  } = useLaundry();

  const studentOrders = orders.filter((o) => o.studentId === currentStudent.studentId);
  const studentComplaints = complaints.filter((c) => c.studentId === currentStudent.studentId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-xs">
            <Building className="w-3.5 h-3.5" />
            <span>{currentStudent.hostel} • Room {currentStudent.roomNo}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {currentStudent.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Track your laundry batches in real-time, view verified collection PINs, and avoid the unpredictability of hostel laundry day.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setActiveTab('submit')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Laundry</span>
          </button>
        </div>
      </div>

      {/* Primary Active Order Card */}
      {activeOrder ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg shadow-inner">
                <Shirt className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-slate-900 font-heading">
                    Active Order {activeOrder.id}
                  </h2>
                  <StatusBadge status={activeOrder.status} isDelayed={activeOrder.isDelayed} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submitted on {activeOrder.submissionDate} • {activeOrder.totalItems} Items
                </p>
              </div>
            </div>

            {/* Collection PIN Highlight Badge */}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Collection PIN
                </div>
                <div className="text-lg font-mono font-extrabold text-sky-700 tracking-wider">
                  {activeOrder.collectionPin}
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Key details summary grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Expected Collection
                </span>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  <span>
                    {activeOrder.isDelayed && activeOrder.revisedExpectedDate
                      ? activeOrder.revisedExpectedDate
                      : activeOrder.expectedCollectionDate}
                  </span>
                </div>
                {activeOrder.isDelayed && (
                  <span className="text-[11px] text-amber-700 font-medium">
                    (Revised due to maintenance)
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Item Segregation
                </span>
                <div className="text-xs text-slate-700 flex flex-wrap gap-1.5 mt-0.5">
                  {activeOrder.itemBreakdown.shirts > 0 && (
                    <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 font-medium">
                      {activeOrder.itemBreakdown.shirts} Shirts
                    </span>
                  )}
                  {activeOrder.itemBreakdown.trousers > 0 && (
                    <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 font-medium">
                      {activeOrder.itemBreakdown.trousers} Trousers
                    </span>
                  )}
                  {activeOrder.itemBreakdown.tshirts > 0 && (
                    <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 font-medium">
                      {activeOrder.itemBreakdown.tshirts} T-Shirts
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pickup Counter
                </span>
                <div className="text-sm font-bold text-slate-900">
                  Central Laundry Wing B
                </div>
                <span className="text-[11px] text-slate-500">
                  Open 08:00 AM – 08:00 PM
                </span>
              </div>
            </div>

            {/* Visual Step Progress Tracker */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Live Turnaround Progress
              </div>
              <StatusTimeline order={activeOrder} />
            </div>

            {/* Quick Actions Footer inside card */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Show your 4-digit PIN {activeOrder.collectionPin} at the counter for pickup.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedOrderId(activeOrder.id);
                    setActiveTab('track');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Full Order Details</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedOrderId(activeOrder.id);
                    setActiveTab('complaints');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Report an Issue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State if no active orders */
        <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <Shirt className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No active laundry order</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Drop off your clothes at the hostel laundry counter and register a new order to track its progress.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('submit')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Laundry</span>
          </button>
        </div>
      )}

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Action 1: Submit */}
        <div
          onClick={() => setActiveTab('submit')}
          className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group hover-lift"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>Submit Laundry</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Create a new laundry request, log item counts, and receive an instant pickup PIN.
          </p>
        </div>

        {/* Action 2: Track */}
        <div
          onClick={() => {
            if (activeOrder) setSelectedOrderId(activeOrder.id);
            setActiveTab('track');
          }}
          className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group hover-lift"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>Track Order</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Follow the 6 wash cycle stages in real-time and review verified operator updates.
          </p>
        </div>

        {/* Action 3: Report Issue */}
        <div
          onClick={() => setActiveTab('complaints')}
          className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group hover-lift"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>Report an Issue</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            File complaints for missing clothes, delays, or damages directly to the hostel warden.
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Your Laundry History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review current and completed laundry batches
            </p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {studentOrders.slice(0, 3).map((order) => {
            return (
              <div
                key={order.id}
                className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {order.id}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{order.id}</span>
                      <StatusBadge status={order.status} isDelayed={order.isDelayed} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      Submitted: {order.submissionDate} • {order.totalItems} clothes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:block text-right">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">
                      PIN Code
                    </div>
                    <div className="font-mono text-xs font-bold text-slate-700">
                      {order.collectionPin}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      setActiveTab('track');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
