import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { StatusBadge } from '../common/Badge';
import { PinVerificationModal } from './PinVerificationModal';
import { LaundryOrder, LaundryStatus } from '../../types';
import {
  ClipboardList,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  KeyRound,
  Edit3,
  Calendar,
  Building,
  Shirt,
  UserCheck,
  ChevronRight,
  X,
  Save,
  Package,
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { orders, updateOrderStatus } = useLaundry();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<LaundryOrder | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [targetOrderForPin, setTargetOrderForPin] = useState<LaundryOrder | null>(null);

  // Edit Modal State
  const [newStatus, setNewStatus] = useState<LaundryStatus>('washing');
  const [delayReason, setDelayReason] = useState<string>('');
  const [revisedDate, setRevisedDate] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');

  // Metrics
  const totalActive = orders.filter((o) => o.status !== 'collected').length;
  const awaitingProcessing = orders.filter((o) => ['received', 'sorting'].includes(o.status)).length;
  const inWashingDrying = orders.filter((o) => ['washing', 'drying'].includes(o.status)).length;
  const readyForCollection = orders.filter((o) => o.status === 'ready_for_pickup').length;
  const delayedOrders = orders.filter((o) => !!o.isDelayed && o.status !== 'collected').length;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.studentId.includes(searchQuery) ||
      o.hostel.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'awaiting') return ['received', 'sorting'].includes(o.status);
    if (statusFilter === 'washing_drying') return ['washing', 'drying'].includes(o.status);
    if (statusFilter === 'ready') return o.status === 'ready_for_pickup';
    if (statusFilter === 'delayed') return !!o.isDelayed && o.status !== 'collected';
    if (statusFilter === 'collected') return o.status === 'collected';

    return true;
  });

  const handleOpenEditModal = (order: LaundryOrder) => {
    setSelectedOrderForEdit(order);
    setNewStatus(order.status);
    setDelayReason(order.delayReason || '');
    setRevisedDate(order.revisedExpectedDate || '');
    setCustomNote('');
  };

  const handleSaveStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForEdit) return;

    updateOrderStatus(
      selectedOrderForEdit.id,
      newStatus,
      customNote || undefined,
      revisedDate || undefined,
      delayReason || undefined
    );

    setSelectedOrderForEdit(null);
  };

  const handleLaunchPinVerify = (order: LaundryOrder) => {
    setTargetOrderForPin(order);
    setIsPinModalOpen(true);
  };

  const delayPresets = [
    'Central steam boiler line pressure maintenance',
    'High humidity drying cycle elongation',
    'Commercial machine power calibration',
    'Special color separation and gentle cycle queuing',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-semibold mb-2">
            <ClipboardList className="w-3.5 h-3.5 text-indigo-600" />
            <span>Staff Operational Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Central Laundry Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Update machine stages, manage wash turnaround schedules, and verify student collection PINs.
          </p>
        </div>

        {/* Counter Action */}
        <button
          onClick={() => {
            setTargetOrderForPin(null);
            setIsPinModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer self-start sm:self-auto transform hover:-translate-y-0.5"
        >
          <KeyRound className="w-4 h-4" />
          <span>Verify Student Pickup PIN</span>
        </button>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Active
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalActive}</div>
          <div className="text-[11px] text-slate-500">Orders currently in laundry system</div>
        </div>

        {/* KPI 2: Awaiting */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Awaiting Wash
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-700">{awaitingProcessing}</div>
          <div className="text-[11px] text-slate-500">Received & in sorting rack</div>
        </div>

        {/* KPI 3: Ready for pickup */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ready for Pickup
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">{readyForCollection}</div>
          <div className="text-[11px] text-slate-500">Awaiting student 4-digit PIN</div>
        </div>

        {/* KPI 4: Delayed */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Delayed Batches
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700">{delayedOrders}</div>
          <div className="text-[11px] text-slate-500">Exceeded standard timeline</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Student name, or ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'awaiting', label: 'Awaiting' },
            { id: 'washing_drying', label: 'Washing/Drying' },
            { id: 'ready', label: 'Ready for Pickup' },
            { id: 'delayed', label: 'Delayed' },
            { id: 'collected', label: 'Collected' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-4 px-5">Order ID</th>
                <th className="py-4 px-5">Student / Hostel</th>
                <th className="py-4 px-5">Garments</th>
                <th className="py-4 px-5">Submission</th>
                <th className="py-4 px-5">Expected Ready</th>
                <th className="py-4 px-5">Current Status</th>
                <th className="py-4 px-5 text-right">Staff Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Order ID & PIN */}
                      <td className="py-4 px-5">
                        <div className="font-mono font-bold text-slate-900 text-sm">
                          {order.id}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <KeyRound className="w-3 h-3 text-slate-400" />
                          <span>PIN: <strong>{order.collectionPin}</strong></span>
                        </div>
                      </td>

                      {/* Student & Hostel */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900">{order.studentName}</div>
                        <div className="text-slate-500 text-[11px]">
                          {order.hostel} • R-{order.roomNo}
                        </div>
                      </td>

                      {/* Garment count */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-800">
                          {order.totalItems} Items
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                          {order.itemBreakdown.shirts}S / {order.itemBreakdown.trousers}T / {order.itemBreakdown.tshirts}TS
                        </div>
                      </td>

                      {/* Submission Date */}
                      <td className="py-4 px-5 text-slate-600">
                        {order.submissionDate.split(',')[0]}
                      </td>

                      {/* Expected Collection Date */}
                      <td className="py-4 px-5">
                        <div className="font-medium text-slate-800">
                          {order.isDelayed && order.revisedExpectedDate
                            ? order.revisedExpectedDate
                            : order.expectedCollectionDate}
                        </div>
                        {order.isDelayed && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Delayed
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <StatusBadge status={order.status} isDelayed={order.isDelayed} size="sm" />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEditModal(order)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors cursor-pointer"
                          title="Change machine stage or log delay"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Update Stage</span>
                        </button>

                        {!order.isCollected && (
                          <button
                            onClick={() => handleLaunchPinVerify(order)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition-colors cursor-pointer"
                            title="Verify PIN and hand over garments"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Verify Handover</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No matching laundry orders found for selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Update Stage Modal */}
      {selectedOrderForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-heading">
                  Update Laundry Stage: {selectedOrderForEdit.id}
                </h2>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Student: {selectedOrderForEdit.studentName} ({selectedOrderForEdit.hostel})
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForEdit(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveStatusUpdate} className="p-6 space-y-4">
              {/* Select Stage */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select New Stage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      'received',
                      'sorting',
                      'washing',
                      'drying',
                      'ready_for_pickup',
                      'collected',
                    ] as LaundryStatus[]
                  ).map((st) => {
                    const isSelected = newStatus === st;
                    return (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setNewStatus(st)}
                        className={`p-2.5 rounded-xl text-left border text-xs font-semibold capitalize transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-200 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {st.replace(/_/g, ' ')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delay Reason Presets & Custom Input */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Delay Reason (Leave blank if running on schedule)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {delayPresets.map((pr) => (
                    <button
                      type="button"
                      key={pr}
                      onClick={() => setDelayReason(pr)}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      {pr.split(' ')[0]} {pr.split(' ')[1]}...
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  placeholder="e.g. Steam boiler maintenance in Block B; resumed at 10 AM"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                />
              </div>

              {/* Revised Date */}
              {delayReason && (
                <div>
                  <label className="block text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                    Revised Expected Collection Date & Time
                  </label>
                  <input
                    type="text"
                    value={revisedDate}
                    onChange={(e) => setRevisedDate(e.target.value)}
                    placeholder="e.g. 26 Oct 2026, 12:00 PM"
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 bg-amber-50/30"
                  />
                </div>
              )}

              {/* Operator Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Operator Stage Note (Optional)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Rack slot B-14 allocated; delicate wash completed"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForEdit(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Stage Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Counter PIN Verification Modal */}
      {isPinModalOpen && (
        <PinVerificationModal
          order={targetOrderForPin}
          onClose={() => {
            setIsPinModalOpen(false);
            setTargetOrderForPin(null);
          }}
        />
      )}
    </div>
  );
};
