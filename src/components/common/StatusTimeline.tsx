import React from 'react';
import { LaundryOrder, LaundryStatus } from '../../types';
import {
  Package,
  Layers,
  Sparkles,
  Wind,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  Clock,
  UserCheck,
} from 'lucide-react';

interface StatusTimelineProps {
  order: LaundryOrder;
  compact?: boolean;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ order }) => {
  const stepsConfig: {
    status: LaundryStatus;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    detail: string;
  }[] = [
    {
      status: 'received',
      label: 'Received',
      icon: Package,
      detail: 'Registered & tagged at hostel laundry desk',
    },
    {
      status: 'sorting',
      label: 'Sorting',
      icon: Layers,
      detail: 'Segregated by fabric, shade & washing temperature',
    },
    {
      status: 'washing',
      label: 'Washing',
      icon: Sparkles,
      detail: 'Undergoing eco-wash cycle in commercial washers',
    },
    {
      status: 'drying',
      label: 'Drying',
      icon: Wind,
      detail: 'Moisture extracted & steam pressed for crisp finish',
    },
    {
      status: 'ready_for_pickup',
      label: 'Ready for Pickup',
      icon: CheckCircle2,
      detail: 'Folded & waiting in slot rack with 4-digit PIN verification',
    },
    {
      status: 'collected',
      label: 'Collected',
      icon: FileCheck2,
      detail: 'Verified and handed over to student',
    },
  ];

  const statusOrder: LaundryStatus[] = [
    'received',
    'sorting',
    'washing',
    'drying',
    'ready_for_pickup',
    'collected',
  ];

  const currentIdx = statusOrder.indexOf(order.status);

  return (
    <div className="w-full">
      {/* Delayed Alert Callout if applicable */}
      {order.isDelayed && order.status !== 'collected' && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 text-amber-200 shadow-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <div className="font-semibold text-amber-200 flex items-center gap-2">
              <span>Notice: Wash Cycle Schedule Adjusted</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/60">
                Temporary Delay
              </span>
            </div>
            <p className="mt-1 text-amber-300/90 leading-relaxed text-xs">
              <strong>Reason:</strong> {order.delayReason || 'Operational facility adjustment at central plant.'}
            </p>
            {order.revisedExpectedDate && (
              <div className="mt-2 text-xs font-medium text-amber-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Revised Expected Collection: <strong>{order.revisedExpectedDate}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visual Stepper Bar for Desktop/Tablet */}
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between">
          {/* Background connecting line */}
          <div className="absolute top-6 left-6 right-6 h-1 bg-slate-800 -z-0" />
          {/* Active progress bar */}
          <div
            className="absolute top-6 left-6 h-1 bg-sky-500 transition-all duration-500 -z-0"
            style={{
              width: `${Math.min(100, Math.max(0, (currentIdx / (stepsConfig.length - 1)) * 100))}%`,
            }}
          />

          {stepsConfig.map((step, idx) => {
            const isDone = idx < currentIdx || (idx === currentIdx && order.status === 'collected');
            const isCurrent = idx === currentIdx && order.status !== 'collected';
            const Icon = step.icon;
            const timelineItem = order.timeline?.find((t) => t.status === step.status);

            return (
              <div
                key={step.status}
                className="flex flex-col items-center text-center relative z-10 max-w-[130px]"
              >
                {/* Step Circle */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shadow-md ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                      : isCurrent
                      ? 'bg-sky-500 text-white ring-4 ring-sky-500/30 shadow-sky-500/40 scale-110'
                      : 'bg-slate-900 text-slate-500 border-2 border-slate-700'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
                  )}
                </div>

                {/* Step Text Label */}
                <span
                  className={`mt-3 text-xs font-semibold ${
                    isCurrent
                      ? 'text-sky-300 font-bold'
                      : isDone
                      ? 'text-emerald-300'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>

                {/* Status indicator tag */}
                {isCurrent && (
                  <span className="mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 animate-pulse">
                    In Progress
                  </span>
                )}
                {isDone && (
                  <span className="mt-1 text-[10px] font-medium text-emerald-400">
                    Completed
                  </span>
                )}
                {!isDone && !isCurrent && (
                  <span className="mt-1 text-[10px] text-slate-500">
                    Pending
                  </span>
                )}

                {/* Timestamp info if available */}
                {timelineItem && timelineItem.timestamp !== 'Pending' && (
                  <span className="mt-1 text-[10px] text-slate-400 leading-tight">
                    {timelineItem.timestamp.split(',')[0]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="md:hidden space-y-3">
        {stepsConfig.map((step, idx) => {
          const isDone = idx < currentIdx || (idx === currentIdx && order.status === 'collected');
          const isCurrent = idx === currentIdx && order.status !== 'collected';
          const Icon = step.icon;
          const timelineItem = order.timeline?.find((t) => t.status === step.status);

          return (
            <div
              key={step.status}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-sky-950/40 border-sky-500/50 ring-1 ring-sky-500/30'
                  : isDone
                  ? 'bg-emerald-950/20 border-emerald-800/40'
                  : 'bg-slate-900/60 border-slate-800 opacity-60'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-sky-500 text-white animate-pulse'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? 'text-sky-300 font-bold'
                        : isDone
                        ? 'text-emerald-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                      Active
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] font-medium text-emerald-400">
                      Done
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {timelineItem?.description || step.detail}
                </p>

                {timelineItem && timelineItem.timestamp !== 'Pending' && (
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{timelineItem.timestamp}</span>
                    {timelineItem.updatedBy && (
                      <span className="hidden xs:inline-flex items-center gap-1 text-[10px] text-slate-500">
                        • <UserCheck className="w-2.5 h-2.5" /> {timelineItem.updatedBy}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
