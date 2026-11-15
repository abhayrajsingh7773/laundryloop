import React from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { Sparkles, RotateCcw, Compass, HelpCircle } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { resetDemoData, setIsGuideModalOpen } = useLaundry();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white text-xs border-b border-sky-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-semibold tracking-wide uppercase text-[10px]">
            <Sparkles className="w-3 h-3 text-sky-400" />
            INT335 Prototype
          </span>
          <span className="text-slate-200">
            <strong>Laundry Day Roulette Solution</strong> — Lovely Professional University (LPU) Hostel Laundry System
          </span>
          <span className="hidden md:inline-block text-slate-400 text-[11px]">
            (Data persisted in browser local storage)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Try the Prototype Tasks</span>
          </button>

          <button
            onClick={resetDemoData}
            title="Reset demo orders, complaints and roles to original benchmark state"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-slate-300" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
