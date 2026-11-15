import React from 'react';
import { LaundryStatus, ComplaintStatus } from '../../types';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  Package, 
  HelpCircle,
  FileCheck2,
  Hourglass
} from 'lucide-react';

interface StatusBadgeProps {
  status: LaundryStatus | ComplaintStatus | string;
  isDelayed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  isDelayed = false,
  size = 'md',
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  // Delayed takes precedence for visual clarity
  if (isDelayed && status !== 'collected') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/80 shadow-xs ${sizeClasses}`}
      >
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
        <span>Delayed</span>
      </span>
    );
  }

  switch (status) {
    case 'received':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-sky-950/60 text-sky-300 border border-sky-800/70 shadow-xs ${sizeClasses}`}
        >
          {showIcon && <Package className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
          <span>Received</span>
        </span>
      );

    case 'sorting':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/70 shadow-xs ${sizeClasses}`}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
          <span>Sorting</span>
        </span>
      );

    case 'washing':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/70 shadow-xs ${sizeClasses}`}
        >
          {showIcon && <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 animate-pulse" />}
          <span>Washing</span>
        </span>
      );

    case 'drying':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/70 shadow-xs ${sizeClasses}`}
        >
          {showIcon && <Hourglass className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
          <span>Drying</span>
        </span>
      );

    case 'ready_for_pickup':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/70 font-semibold shadow-xs ${sizeClasses}`}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
          <span>Ready for Pickup</span>
        </span>
      );

    case 'collected':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 shadow-xs ${sizeClasses}`}
        >
          {showIcon && <FileCheck2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          <span>Collected</span>
        </span>
      );

    // Complaint statuses
    case 'submitted':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/70 shadow-xs ${sizeClasses}`}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
          <span>Submitted</span>
        </span>
      );

    case 'under_review':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/70 shadow-xs ${sizeClasses}`}
        >
          {showIcon && <Hourglass className="w-3.5 h-3.5 text-blue-400 shrink-0 animate-spin-slow" />}
          <span>Under Review</span>
        </span>
      );

    case 'resolved':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/70 shadow-xs ${sizeClasses}`}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
          <span>Resolved</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-800 text-slate-300 border border-slate-700 shadow-xs ${sizeClasses}`}
        >
          {showIcon && <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          <span className="capitalize">{status}</span>
        </span>
      );
  }
};
