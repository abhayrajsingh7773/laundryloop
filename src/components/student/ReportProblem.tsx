import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { StatusBadge } from '../common/Badge';
import { ComplaintCategory, Complaint } from '../../types';
import {
  AlertCircle,
  ShieldAlert,
  FileText,
  Clock,
  CheckCircle2,
  Send,
  HelpCircle,
  Shirt,
  Calendar,
  Building,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const ReportProblem: React.FC = () => {
  const {
    orders,
    complaints,
    createComplaint,
    currentStudent,
    selectedOrderId,
    setSelectedOrderId,
    setActiveTab,
  } = useLaundry();

  const [activeSubTab, setActiveSubTab] = useState<'new' | 'list'>('new');

  // Form State
  const [orderId, setOrderId] = useState<string>(selectedOrderId || orders[0]?.id || 'LD-1001');
  const [category, setCategory] = useState<ComplaintCategory>('missing_clothes');
  const [description, setDescription] = useState<string>('');
  const [preferredResolution, setPreferredResolution] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [justSubmittedComplaint, setJustSubmittedComplaint] = useState<Complaint | null>(null);

  const studentComplaints = complaints.filter(
    (c) => c.studentId === currentStudent.studentId || c.studentName === currentStudent.name
  );

  const categoryOptions: { id: ComplaintCategory; label: string; desc: string }[] = [
    {
      id: 'missing_clothes',
      label: 'Missing Clothes',
      desc: 'One or more items from your recorded count are missing',
    },
    {
      id: 'wrong_clothes',
      label: 'Wrong Clothes Received',
      desc: 'Received garments belonging to another hosteller',
    },
    {
      id: 'damaged_clothes',
      label: 'Damaged Clothes',
      desc: 'Torn fabric, broken zippers, color bleed, or burns',
    },
    {
      id: 'laundry_delay',
      label: 'Excessive Turnaround Delay',
      desc: 'Turnaround overdue beyond 48 hours without explanation',
    },
    {
      id: 'incorrect_item_count',
      label: 'Incorrect Item Count',
      desc: 'Counter bag intake recorded wrong number of pieces',
    },
    {
      id: 'other',
      label: 'Other Laundry Dispute',
      desc: 'Counter behavior, hygiene, or lost token concerns',
    },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!orderId) errs.orderId = 'Please select the associated laundry order';
    if (!description.trim() || description.trim().length < 15) {
      errs.description = 'Please provide at least 15 characters describing the specific problem';
    }
    if (!preferredResolution.trim()) {
      errs.preferredResolution = 'Please state your requested resolution (e.g. search rack, compensation, expedite)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newComp = createComplaint({
      orderId,
      category,
      description,
      preferredResolution,
    });

    setJustSubmittedComplaint(newComp);
    setDescription('');
    setPreferredResolution('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Hostel Redressal System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Report a Laundry Issue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complaints are routed directly to Hostel Warden Dr. Sanjeev Gupta for investigation.
          </p>
        </div>

        {/* Tab switch between file new and view existing */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('new')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'new'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            File Complaint
          </button>
          <button
            onClick={() => setActiveSubTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'list'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Complaints</span>
            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">
              {studentComplaints.length}
            </span>
          </button>
        </div>
      </div>

      {activeSubTab === 'new' ? (
        /* Form View */
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Field 1: Associated Order ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Associated Laundry Order *
              </label>
              <select
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 bg-white cursor-pointer"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} — {o.studentName} ({o.totalItems} items, Status: {o.status.toUpperCase()})
                  </option>
                ))}
              </select>
              {errors.orderId && <p className="text-xs text-red-600 mt-1">{errors.orderId}</p>}
            </div>

            {/* Field 2: Issue Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Select Issue Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categoryOptions.map((opt) => {
                  const isSelected = category === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setCategory(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-200 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? 'text-amber-950' : 'text-slate-800'}`}>
                          {opt.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {opt.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Field 3: Problem Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                3. Describe the Problem in Detail *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide color, brand, size of item or details of missing/damaged pieces so the supervisor can inspect the sorting bins..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.description
                    ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                    : 'border-slate-200 focus:ring-amber-200 focus:border-amber-500 bg-white'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Field 4: Preferred Resolution */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                4. Preferred Resolution or Action Requested *
              </label>
              <input
                type="text"
                value={preferredResolution}
                onChange={(e) => setPreferredResolution(e.target.value)}
                placeholder="e.g. Check sorting bay CCTV footage, locate missing black t-shirt, or refund express fee"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.preferredResolution
                    ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                    : 'border-slate-200 focus:ring-amber-200 focus:border-amber-500 bg-white'
                }`}
              />
              {errors.preferredResolution && (
                <p className="text-xs text-red-600 mt-1">{errors.preferredResolution}</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                <span>Submit Complaint to Warden</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Complaints List View */
        <div className="space-y-4">
          {studentComplaints.length > 0 ? (
            studentComplaints.map((c) => {
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-slate-900">{c.id}</span>
                      <StatusBadge status={c.status} />
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Submitted: {c.submittedAt}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 font-semibold uppercase">Related Order:</span>
                      <div className="font-mono font-bold text-slate-800">{c.orderId}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold uppercase">Category:</span>
                      <div className="font-bold text-slate-800 capitalize">
                        {c.category.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Issue Description:
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      {c.description}
                    </p>
                  </div>

                  {c.preferredResolution && (
                    <div className="text-xs text-slate-600">
                      <strong>Requested Resolution:</strong> {c.preferredResolution}
                    </div>
                  )}

                  {/* Warden Resolution Note */}
                  {c.wardenNote && (
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Official Warden Action Note (Dr. Sanjeev Gupta):</span>
                      </div>
                      <p className="text-xs text-emerald-900 leading-relaxed pl-5.5">
                        {c.wardenNote}
                      </p>
                      {c.resolvedAt && (
                        <div className="text-[10px] text-emerald-700 pl-5.5 mt-1">
                          Resolved on: {c.resolvedAt}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No active complaints</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All your past hostel laundry batches have been verified or completed without open disputes.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal when complaint is submitted */}
      {justSubmittedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Complaint Registered Successfully
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your dispute has been logged under official ticket reference:
              </p>
              <div className="font-mono text-2xl font-black text-amber-700 my-2">
                {justSubmittedComplaint.id}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hostel Warden Dr. Sanjeev Gupta and the central laundry supervisor will inspect the camera footage and sorting bins. You can switch to the <strong>Warden role</strong> anytime in this demo to test how issues are reviewed and resolved!
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setJustSubmittedComplaint(null);
                  setActiveSubTab('list');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                View My Complaints
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
