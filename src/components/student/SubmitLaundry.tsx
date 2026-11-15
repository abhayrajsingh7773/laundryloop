import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { HOSTEL_LIST } from '../../data/initialData';
import { LaundryOrder } from '../../types';
import {
  PlusCircle,
  Shirt,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const SubmitLaundry: React.FC = () => {
  const { currentStudent, createOrder, setActiveTab, setSelectedOrderId } = useLaundry();

  // Form State
  const [formData, setFormData] = useState({
    studentName: currentStudent.name,
    studentId: currentStudent.studentId,
    hostel: currentStudent.hostel,
    roomNo: currentStudent.roomNo,
    phone: currentStudent.phone,
    specialCare: '',
    notes: '',
  });

  const [categories, setCategories] = useState({
    shirts: 2,
    trousers: 2,
    tshirts: 2,
    undergarments: 0,
    bedding: 0,
    others: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedOrder, setSubmittedOrder] = useState<LaundryOrder | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Total items computed dynamically
  const totalItems = Object.values(categories).reduce((acc, curr) => acc + curr, 0);

  const handleCategoryChange = (key: keyof typeof categories, delta: number) => {
    setCategories((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
    if (errors.totalItems) {
      setErrors((prev) => {
        const rest = { ...prev };
        delete rest.totalItems;
        return rest;
      });
    }
  };

  const handleCareTagClick = (tag: string) => {
    setFormData((prev) => {
      const existing = prev.specialCare ? prev.specialCare.split(', ') : [];
      if (existing.includes(tag)) {
        return {
          ...prev,
          specialCare: existing.filter((t) => t !== tag).join(', '),
        };
      } else {
        return {
          ...prev,
          specialCare: existing.length > 0 ? `${prev.specialCare}, ${tag}` : tag,
        };
      }
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.studentName.trim()) errs.studentName = 'Student name is required';
    if (!formData.studentId.trim()) errs.studentId = 'Student ID is required';
    if (!formData.hostel) errs.hostel = 'Please select your hostel block';
    if (!formData.roomNo.trim()) errs.roomNo = 'Room number is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required for notification';

    if (totalItems <= 0) {
      errs.totalItems = 'Please add at least 1 clothing item to submit a laundry request.';
    } else if (totalItems > 15) {
      errs.totalItems = 'Standard hostel quota allows max 15 items per batch drop-off.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newOrder = createOrder({
      studentName: formData.studentName,
      studentId: formData.studentId,
      hostel: formData.hostel,
      roomNo: formData.roomNo,
      phone: formData.phone,
      totalItems,
      itemBreakdown: categories,
      specialCare: formData.specialCare,
      notes: formData.notes,
    });

    setSubmittedOrder(newOrder);
  };

  const copyPinToClipboard = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const carePresets = [
    'Separate dark colors',
    'Gentle spin cycle',
    'No high-heat drying',
    'Delicate woolens inside',
    'Crisp collar press',
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
          <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>New Laundry Request</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
          Submit Laundry Batch
        </h1>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Log your clothing count before dropping clothes at the hostel counter. You will receive a verifiable collection PIN upon submission.
        </p>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Student Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900 font-heading">
              1. Student Details (LPU Hosteller)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.studentName
                    ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                    : 'border-slate-200 focus:ring-sky-200 focus:border-sky-500 bg-white'
                }`}
                placeholder="e.g. Username"
              />
              {errors.studentName && (
                <p className="text-xs text-red-600 mt-1">{errors.studentName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Student Registration ID *
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 transition-all ${
                  errors.studentId
                    ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                    : 'border-slate-200 focus:ring-sky-200 focus:border-sky-500 bg-white'
                }`}
                placeholder="e.g. 12104592"
              />
              {errors.studentId && (
                <p className="text-xs text-red-600 mt-1">{errors.studentId}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Hostel / Block *
              </label>
              <select
                value={formData.hostel}
                onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 bg-white cursor-pointer"
              >
                {HOSTEL_LIST.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              {errors.hostel && <p className="text-xs text-red-600 mt-1">{errors.hostel}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Room No *
                </label>
                <input
                  type="text"
                  value={formData.roomNo}
                  onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 bg-white"
                  placeholder="e.g. 312-B"
                />
                {errors.roomNo && <p className="text-xs text-red-600 mt-1">{errors.roomNo}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Phone *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 bg-white"
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Clothing Item Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Shirt className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 font-heading">
                2. Clothing Categories & Quantity
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Items:</span>
              <span
                className={`font-mono text-base font-extrabold px-3 py-0.5 rounded-full ${
                  totalItems > 0 && totalItems <= 15
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {totalItems} / 15
              </span>
            </div>
          </div>

          {errors.totalItems && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errors.totalItems}</span>
            </div>
          )}

          {/* Stepper Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: 'shirts' as const, label: 'Shirts (Formal/Casual)', helper: 'Includes collared shirts' },
              { key: 'trousers' as const, label: 'Trousers & Jeans', helper: 'Pants, denims, joggers' },
              { key: 'tshirts' as const, label: 'T-Shirts & Tops', helper: 'Polo, round neck, dry-fit' },
              { key: 'undergarments' as const, label: 'Undergarments & Socks', helper: 'Delicates / smalls' },
              { key: 'bedding' as const, label: 'Bedsheet & Towel', helper: 'Pillow covers, single sheet' },
              { key: 'others' as const, label: 'Other Items', helper: 'Lab coats, jackets, hoodie' },
            ].map((item) => (
              <div
                key={item.key}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{item.label}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.helper}</p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60">
                  <span className="text-xs font-semibold text-slate-500">Count</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCategoryChange(item.key, -1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer text-sm"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-sm text-slate-900">
                      {categories[item.key]}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange(item.key, 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Care Instructions & Notes */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 font-heading">
              3. Special Care & Instructions
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Quick Care Tags (Click to select/add)
            </label>
            <div className="flex flex-wrap gap-2">
              {carePresets.map((preset) => {
                const isSelected = formData.specialCare.includes(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleCareTagClick(preset)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Custom Care Instructions
            </label>
            <input
              type="text"
              value={formData.specialCare}
              onChange={(e) => setFormData({ ...formData, specialCare: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white"
              placeholder="e.g. Formal navy shirt: gentle spin only; Do not iron rubber prints"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Optional Student Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white"
              placeholder="e.g. Lab coat is inside blue laundry bag with nametag"
            />
          </div>
        </div>

        {/* Disclaimer Callout Box */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Transparent Service Notice:</span>
            <p className="leading-relaxed text-amber-800">
              Expected collection date and turnaround times are <strong>estimates</strong> based on current laundry bay load and machine availability. While we aim for 48 hours, delays due to boiler maintenance, drying cycles, or weather will be flagged directly on your tracker.
            </p>
          </div>
        </div>

        {/* Form Submission Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Generate Order & Secure PIN</span>
          </button>
        </div>
      </form>

      {/* Confirmation Modal upon Successful Submission */}
      {submittedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">
                Laundry Request Registered!
              </h2>
              <p className="text-xs text-emerald-100 mt-1">
                Your clothes have been digitally tagged at the LPU central laundry queue.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* PIN Code Box */}
              <div className="p-5 rounded-2xl bg-sky-50 border-2 border-dashed border-sky-300 text-center relative">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800">
                  Your 4-Digit Collection PIN
                </span>
                <div className="text-4xl font-mono font-black text-sky-950 my-1 tracking-widest">
                  {submittedOrder.collectionPin}
                </div>
                <p className="text-[11px] text-sky-700">
                  Keep this confidential. Staff will verify this PIN before handing your clothes back.
                </p>

                <button
                  onClick={() => copyPinToClipboard(submittedOrder.collectionPin)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-sky-200 text-xs font-semibold text-sky-700 hover:bg-sky-100 transition-colors cursor-pointer shadow-xs"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'PIN Copied!' : 'Copy PIN'}</span>
                </button>
              </div>

              {/* Order Summary Specs */}
              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Order ID</span>
                  <span className="font-mono font-bold text-slate-900">{submittedOrder.id}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Total Items</span>
                  <span className="font-bold text-slate-900">{submittedOrder.totalItems} garments</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Estimated Pickup</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    {submittedOrder.expectedCollectionDate}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Drop-off Counter</span>
                  <span className="font-medium text-slate-700">Central Laundry Desk B</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-200">
                Note: Turnaround time is an estimate and not an absolute guarantee. You can check the live status anytime on the Track page.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setSubmittedOrder(null);
                  setActiveTab('dashboard');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setSelectedOrderId(submittedOrder.id);
                  setSubmittedOrder(null);
                  setActiveTab('track');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <span>Track This Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
