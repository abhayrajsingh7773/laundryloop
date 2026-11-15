import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { StatusBadge } from '../common/Badge';
import { Complaint, ComplaintStatus } from '../../types';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  FileText,
  Building,
  Calendar,
  MessageSquare,
  X,
  Save,
  AlertTriangle,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export const WardenOverview: React.FC = () => {
  const { complaints, updateComplaintStatus, orders } = useLaundry();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Review Modal Form State
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('under_review');
  const [resolutionNote, setResolutionNote] = useState<string>('');

  // Statistics
  const totalComplaints = complaints.length;
  const underReviewCount = complaints.filter((c) => c.status === 'under_review').length;
  const submittedCount = complaints.filter((c) => c.status === 'submitted').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  const handleOpenReviewModal = (comp: Complaint) => {
    setSelectedComplaint(comp);
    setNewStatus(comp.status === 'submitted' ? 'under_review' : comp.status);
    setResolutionNote(comp.wardenNote || '');
  };

  const handleSaveResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    updateComplaintStatus(selectedComplaint.id, newStatus, resolutionNote);
    setSelectedComplaint(null);
  };

  const resolutionPresets = [
    'Reviewed central laundry intake CCTV footage; garment located in lost & found bin.',
    'Express drying priority granted; formal attire pressed and released to student.',
    'Inventory reconciliation completed with counter staff Ramesh; compensation approved.',
    'Misplaced hoodie returned to student room with verified student sign-off.',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hostel Warden Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Student Laundry Grievances & Resolution
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Official portal for Chief Warden Dr. Sanjeev Gupta to review and resolve hostel laundry disputes.
          </p>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Grievances
          </span>
          <div className="text-2xl font-black text-slate-900">{totalComplaints}</div>
          <div className="text-[11px] text-slate-500">Submitted across hostels</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Newly Submitted
          </span>
          <div className="text-2xl font-black text-amber-700">{submittedCount}</div>
          <div className="text-[11px] text-slate-500">Awaiting warden initial review</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Under Investigation
          </span>
          <div className="text-2xl font-black text-blue-700">{underReviewCount}</div>
          <div className="text-[11px] text-slate-500">CCTV & sorting rack verification</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Resolved Cases
          </span>
          <div className="text-2xl font-black text-emerald-700">{resolvedCount}</div>
          <div className="text-[11px] text-slate-500">Closed with official sign-off</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search complaint ID, order, or description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'all', label: 'All Cases' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'resolved', label: 'Resolved' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-4 px-5">Ticket ID</th>
                <th className="py-4 px-5">Related Order</th>
                <th className="py-4 px-5">Hostel Student</th>
                <th className="py-4 px-5">Issue Category</th>
                <th className="py-4 px-5">Submission Date</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => {
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-slate-900">
                        {c.id}
                      </td>

                      <td className="py-4 px-5 font-mono font-medium text-slate-700">
                        {c.orderId}
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900">{c.studentName}</div>
                        <div className="text-[11px] text-slate-500">
                          {c.hostel} • R-{c.roomNo}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="font-medium text-slate-800 capitalize">
                          {c.category.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-slate-600">
                        {c.submittedAt.split(',')[0]}
                      </td>

                      <td className="py-4 px-5">
                        <StatusBadge status={c.status} size="sm" />
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleOpenReviewModal(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Review & Resolve</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No student grievances match the active filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Resolution Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-heading">
                  Warden Review: {selectedComplaint.id}
                </h2>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Order: {selectedComplaint.orderId} • Student: {selectedComplaint.studentName}
                </p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveResolution} className="p-6 space-y-4">
              {/* Problem Description Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-400 uppercase">Category:</span>
                  <div className="font-bold text-slate-900 capitalize">
                    {selectedComplaint.category.replace(/_/g, ' ')}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-400 uppercase">Student Description:</span>
                  <p className="text-slate-800 mt-0.5 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                    {selectedComplaint.description}
                  </p>
                </div>

                {selectedComplaint.preferredResolution && (
                  <div>
                    <span className="font-semibold text-slate-400 uppercase">Requested Resolution:</span>
                    <div className="text-slate-700 italic mt-0.5">
                      "{selectedComplaint.preferredResolution}"
                    </div>
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Update Grievance Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStatus('under_review')}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      newStatus === 'under_review'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-200'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Mark as Under Review
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewStatus('resolved')}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      newStatus === 'resolved'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>

              {/* Resolution Note Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Quick Resolution Presets (Click to insert)
                </label>
                <div className="flex flex-col gap-1.5 mb-2">
                  {resolutionPresets.map((pr, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setResolutionNote(pr)}
                      className="text-left text-[11px] p-2 rounded-lg bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200 text-emerald-950 transition-colors cursor-pointer"
                    >
                      • {pr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Official Warden Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Warden Action Note *
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Record steps taken, supervisor inquiries, or resolution outcome..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Warden Action</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
