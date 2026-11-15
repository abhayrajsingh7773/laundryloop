import React from 'react';
import { useLaundry } from '../../context/LaundryContext';
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  FolderClock,
  AlertCircle,
  ClipboardList,
  ShieldAlert,
  KeyRound,
  Building2,
  Compass,
  ArrowRightLeft,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    currentRole,
    setCurrentRole,
    activeTab,
    setActiveTab,
    currentStudent,
    updateStudentProfile,
    orders,
    complaints,
    setIsGuideModalOpen,
    activeOrder,
  } = useLaundry();

  const [isEditingName, setIsEditingName] = React.useState(false);
  const [editedName, setEditedName] = React.useState(currentStudent.name);

  const studentOrdersCount = orders.filter((o) => o.studentId === currentStudent.studentId).length;
  const activeStudentOrdersCount = orders.filter(
    (o) => o.studentId === currentStudent.studentId && !o.isCollected
  ).length;
  const pendingComplaintsCount = complaints.filter((c) => c.status !== 'resolved').length;
  const staffPendingOrdersCount = orders.filter((o) => o.status !== 'collected').length;

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    onClose();
  };

  const handleSaveProfileName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedName.trim()) return;
    updateStudentProfile({ name: editedName.trim() });
    setIsEditingName(false);
  };

  const studentInitials = currentStudent.name.slice(0, 2).toUpperCase() || 'UN';

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 z-50 lg:z-30 h-screen lg:h-[calc(100vh-4rem)] w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* User Profile Mini Card */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xs relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold text-sm">
                {currentRole === 'student' ? studentInitials : currentRole === 'staff' ? 'RK' : 'SG'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {currentRole === 'student'
                      ? 'Student Profile'
                      : currentRole === 'staff'
                      ? 'Staff Operator'
                      : 'Chief Warden'}
                  </span>
                  {currentRole === 'student' && !isEditingName && (
                    <button
                      onClick={() => {
                        setEditedName(currentStudent.name);
                        setIsEditingName(true);
                      }}
                      className="text-[10px] text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
                      title="Edit username"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditingName ? (
                  <form onSubmit={handleSaveProfileName} className="mt-1 space-y-1.5">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-sky-400/60 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 bg-slate-900 font-bold text-white"
                      autoFocus
                    />
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditingName(false)}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-[10px] px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 className="text-sm font-bold text-white truncate">
                      {currentRole === 'student'
                        ? currentStudent.name
                        : currentRole === 'staff'
                        ? 'Ramesh Kumar'
                        : 'Dr. Sanjeev Gupta'}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      {currentRole === 'student'
                        ? `${currentStudent.hostel} • R-${currentStudent.roomNo}`
                        : currentRole === 'staff'
                        ? 'Central Laundry Desk (LPU)'
                        : 'Disciplinary & Hostel Affairs'}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Quick Active Order PIN preview for student */}
            {currentRole === 'student' && activeOrder && !activeOrder.isCollected && (
              <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Active Order PIN:</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 tracking-wider">
                  {activeOrder.collectionPin}
                </span>
              </div>
            )}
          </div>

          {/* Student Navigation Group */}
          {currentRole === 'student' && (
            <div className="space-y-1">
              <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Student Portal
              </div>

              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-sky-400" />
                  <span>Dashboard</span>
                </div>
                {activeStudentOrdersCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {activeStudentOrdersCount} Active
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('submit')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'submit'
                    ? 'bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Submit Laundry</span>
                </div>
                <span className="text-[10px] uppercase font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-1.5 py-0.5 rounded">
                  New
                </span>
              </button>

              <button
                onClick={() => handleNavClick('track')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'track'
                    ? 'bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-indigo-400" />
                  <span>Track Laundry</span>
                </div>
              </button>

              <button
                onClick={() => handleNavClick('orders')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderClock className="w-4 h-4 text-slate-400" />
                  <span>My Orders</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">{studentOrdersCount}</span>
              </button>

              <button
                onClick={() => handleNavClick('complaints')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'complaints'
                    ? 'bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Report an Issue</span>
                </div>
                {pendingComplaintsCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    {pendingComplaintsCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Staff Navigation Group */}
          {currentRole === 'staff' && (
            <div className="space-y-1">
              <div className="px-3 text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                Staff Operations
              </div>

              <button
                onClick={() => handleNavClick('staff_dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'staff_dashboard'
                    ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 text-indigo-400" />
                  <span>Staff Dashboard</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {staffPendingOrdersCount} Active
                </span>
              </button>

              <button
                onClick={() => handleNavClick('staff_pin_verify')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'staff_pin_verify'
                    ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span>Verify Collection PIN</span>
                </div>
              </button>
            </div>
          )}

          {/* Warden Navigation Group */}
          {currentRole === 'warden' && (
            <div className="space-y-1">
              <div className="px-3 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Warden Oversight
              </div>

              <button
                onClick={() => handleNavClick('warden_overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'warden_overview'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>Complaints Overview</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {complaints.length} Total
                </span>
              </button>
            </div>
          )}

          {/* Cross-Role Quick Jump Box for Demo Convenience */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Switch Role View</span>
              <ArrowRightLeft className="w-3 h-3 text-slate-500" />
            </div>

            <div className="grid grid-cols-3 gap-1 px-1">
              <button
                onClick={() => setCurrentRole('student')}
                className={`p-2 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
                  currentRole === 'student'
                    ? 'bg-sky-600 text-white shadow-xs font-bold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setCurrentRole('staff')}
                className={`p-2 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
                  currentRole === 'staff'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                Staff
              </button>
              <button
                onClick={() => setCurrentRole('warden')}
                className={`p-2 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
                  currentRole === 'warden'
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                Warden
              </button>
            </div>
          </div>

          {/* Try Prototype CTA Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-sky-950/70 border border-sky-900/60 text-slate-200">
            <div className="flex items-center gap-2 font-bold text-xs text-sky-400">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>INT335 Testing Guide</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Demonstrate the 6 core classroom evaluation tasks with pre-configured data.
            </p>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Open Evaluation Tasks
            </button>
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>LPU Campus System</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">v1.2-demo</span>
        </div>
      </aside>
    </>
  );
};
