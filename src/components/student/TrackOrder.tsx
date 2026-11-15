import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { StatusBadge } from '../common/Badge';
import { StatusTimeline } from '../common/StatusTimeline';
import {
  Search,
  KeyRound,
  Copy,
  Check,
  AlertCircle,
  Calendar,
  Clock,
  Shirt,
  Building,
  QrCode,
  Eye,
  EyeOff,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export const TrackOrder: React.FC = () => {
  const {
    orders,
    selectedOrderId,
    setSelectedOrderId,
    setActiveTab,
    currentStudent,
  } = useLaundry();

  const [searchInput, setSearchInput] = useState('');
  const [showPin, setShowPin] = useState(true);
  const [copied, setCopied] = useState(false);

  // Active tracked order
  const currentOrder =
    orders.find((o) => o.id.toLowerCase() === (selectedOrderId || '').toLowerCase()) ||
    orders.find((o) => o.studentId === currentStudent.studentId) ||
    orders[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === searchInput.trim().toLowerCase() ||
        o.studentId === searchInput.trim()
    );
    if (found) {
      setSelectedOrderId(found.id);
    }
  };

  const copyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-semibold mb-2">
            <Search className="w-3.5 h-3.5 text-indigo-600" />
            <span>Live Laundry Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Track Laundry Order
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time step updates from LPU central washing bays and ironing units.
          </p>
        </div>

        {/* Quick Order Switcher / Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Order:
          </label>
          <select
            value={currentOrder?.id || ''}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-300 cursor-pointer"
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id} — {o.studentName} ({o.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentOrder ? (
        <div className="space-y-6">
          {/* Main Order Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-mono font-black tracking-tight text-white">
                    {currentOrder.id}
                  </span>
                  <StatusBadge status={currentOrder.status} isDelayed={currentOrder.isDelayed} size="lg" />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-sky-400" />
                    {currentOrder.hostel} • Room {currentOrder.roomNo}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-sky-400" />
                    {currentOrder.totalItems} Total Garments
                  </span>
                  <span className="text-slate-500">•</span>
                  <span>Registered for: <strong>{currentOrder.studentName}</strong></span>
                </div>
              </div>

              {/* 4-Digit Collection PIN Box */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center md:text-right shrink-0">
                <div className="flex items-center justify-between md:justify-end gap-2 text-xs font-semibold text-sky-200 mb-1">
                  <span>Collection Verification PIN</span>
                  <button
                    onClick={() => setShowPin(!showPin)}
                    className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title={showPin ? 'Hide PIN' : 'Reveal PIN'}
                  >
                    {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-center md:justify-end gap-2.5">
                  <span className="font-mono text-2xl font-black text-white tracking-widest">
                    {showPin ? currentOrder.collectionPin : '••••'}
                  </span>

                  <button
                    onClick={() => copyPin(currentOrder.collectionPin)}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                    title="Copy PIN code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[10px] text-slate-300 mt-1">
                  Show at collection counter to prevent mix-ups
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="p-6 bg-slate-50 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wider">
                  Submitted On
                </span>
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                  <span>{currentOrder.submissionDate}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wider">
                  Expected Collection
                </span>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    {currentOrder.isDelayed && currentOrder.revisedExpectedDate
                      ? currentOrder.revisedExpectedDate
                      : currentOrder.expectedCollectionDate}
                  </span>
                </div>
                {currentOrder.isDelayed && (
                  <span className="text-[10px] text-amber-700 font-semibold uppercase">
                    (Revised Schedule)
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wider">
                  Last Updated
                </span>
                <div className="font-bold text-slate-800">
                  {currentOrder.lastUpdated || currentOrder.submissionDate}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wider">
                  Handover Status
                </span>
                <div className="font-bold">
                  {currentOrder.isCollected ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" /> Collected on {currentOrder.collectedAt?.split(',')[0]}
                    </span>
                  ) : (
                    <span className="text-slate-600">Awaiting Pickup Handover</span>
                  )}
                </div>
              </div>
            </div>

            {/* Garment Segregation Breakdown */}
            <div className="p-6 border-b border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Logged Garments & Care Instructions
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(currentOrder.itemBreakdown).map(([key, val]) => {
                  if (val === 0) return null;
                  return (
                    <span
                      key={key}
                      className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 capitalize"
                    >
                      {val} {key}
                    </span>
                  );
                })}
              </div>

              {currentOrder.specialCare && (
                <div className="mt-2 text-xs text-indigo-900 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    <strong>Care Note:</strong> {currentOrder.specialCare}
                  </span>
                </div>
              )}
            </div>

            {/* Stepper Timeline Section */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Stage-by-Stage Processing History
                </h3>
                <span className="text-xs text-slate-500">
                  Current Stage: <strong className="capitalize">{currentOrder.status.replace(/_/g, ' ')}</strong>
                </span>
              </div>

              <StatusTimeline order={currentOrder} />
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <QrCode className="w-4 h-4 text-slate-400" />
                <span>Tag ID: <strong>{currentOrder.id}-BARCODE-LPU</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedOrderId(currentOrder.id);
                    setActiveTab('complaints');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-800 text-xs font-semibold hover:bg-amber-50 shadow-xs transition-colors cursor-pointer"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Report an Issue for this Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <p className="text-sm text-slate-500">No matching laundry order found.</p>
        </div>
      )}
    </div>
  );
};
