import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import {
  X,
  Compass,
  CheckSquare,
  Square,
  ArrowRight,
  Sparkles,
  Shirt,
  Search,
  Clock,
  AlertOctagon,
  Wrench,
  ShieldAlert,
} from 'lucide-react';

export const PrototypeGuideModal: React.FC = () => {
  const {
    isGuideModalOpen,
    setIsGuideModalOpen,
    setCurrentRole,
    setActiveTab,
    setSelectedOrderId,
  } = useLaundry();

  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  if (!isGuideModalOpen) return null;

  const toggleTask = (taskId: number) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const tasks = [
    {
      id: 1,
      title: '1. Submit a new laundry request',
      role: 'Student',
      description:
        'Fill in the student details, clothing count (shirts, trousers, etc.), special care instructions, and submit to generate a unique Order ID and 4-digit Collection PIN.',
      icon: Shirt,
      action: () => {
        setCurrentRole('student');
        setActiveTab('submit');
        setIsGuideModalOpen(false);
      },
      actionLabel: 'Go to Submit Page',
    },
    {
      id: 2,
      title: '2. Track an existing laundry order',
      role: 'Student',
      description:
        'View the live step-by-step timeline of active order LD-1001 (Washing) or switch to delayed order LD-1003.',
      icon: Search,
      action: () => {
        setCurrentRole('student');
        setSelectedOrderId('LD-1001');
        setActiveTab('track');
        setIsGuideModalOpen(false);
      },
      actionLabel: 'Open Order Tracker',
    },
    {
      id: 3,
      title: '3. Identify when the laundry will be ready',
      role: 'Student',
      description:
        'Inspect expected collection timestamps and check how delayed orders (e.g., LD-1003) display the revised collection date and boiler delay explanation.',
      icon: Clock,
      action: () => {
        setCurrentRole('student');
        setSelectedOrderId('LD-1003');
        setActiveTab('track');
        setIsGuideModalOpen(false);
      },
      actionLabel: 'Inspect Delayed Order (LD-1003)',
    },
    {
      id: 4,
      title: '4. Report a missing-clothes issue',
      role: 'Student',
      description:
        'Submit a formal complaint under "Missing clothes" with preferred resolution to generate an official complaint ticket (CMP reference ID).',
      icon: AlertOctagon,
      action: () => {
        setCurrentRole('student');
        setActiveTab('complaints');
        setIsGuideModalOpen(false);
      },
      actionLabel: 'Open Complaint Form',
    },
    {
      id: 5,
      title: '5. Switch to Staff role & update order / verify PIN',
      role: 'Staff',
      description:
        'Switch to Laundry Staff role, advance an order to "Ready for Pickup", and use the PIN Verification tool to simulate counter collection with student 4-digit PIN.',
      icon: Wrench,
      action: () => {
        setCurrentRole('staff');
        setActiveTab('staff_dashboard');
        setIsGuideModalOpen(false);
      },
      actionLabel: 'Switch to Staff Dashboard',
    },
    {
      id: 6,
      title: '6. Switch to Warden role & review a complaint',
      role: 'Warden',
      description:
        'Switch to Hostel Warden role, inspect student complaints (CMP-801 / CMP-802), update status to "Under Review" or "Resolved", and record an official warden resolution note.',
      icon: ShieldAlert,
      action: () => {
        setCurrentRole('warden');
        setActiveTab('warden_overview');
        setIsGuideModalOpen(false);
      },
      actionLabel: 'Switch to Warden View',
    },
  ];

  const progressPercent = Math.round((completedTasks.length / tasks.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              INT335 Evaluation Guide
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Try the Prototype — Usability Tasks
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Complete these 6 core tasks to evaluate how <strong>laundryloop</strong> addresses uncertain turnaround, mixed-up clothes, and transparent complaint resolution.
            </p>
          </div>
          <button
            onClick={() => setIsGuideModalOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close prototype guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Task Completion Progress</span>
              <span>
                {completedTasks.length} / {tasks.length} Completed ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-100">
          {tasks.map((task) => {
            const isCompleted = completedTasks.includes(task.id);
            const Icon = task.icon;

            return (
              <div
                key={task.id}
                className={`pt-3.5 first:pt-0 flex items-start gap-3.5 p-3 rounded-xl transition-all ${
                  isCompleted ? 'bg-emerald-50/50 border border-emerald-200/60' : 'hover:bg-slate-50'
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                  title={isCompleted ? 'Mark uncompleted' : 'Mark completed'}
                >
                  {isCompleted ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3
                      className={`text-sm font-semibold ${
                        isCompleted ? 'text-slate-600 line-through' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {task.role} Role
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={task.action}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>{task.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Design Thinking note: Authentic user feedback from LPU hostel students and laundry staff will be gathered during live testing to iterate on these flows.
        </div>
      </div>
    </div>
  );
};
