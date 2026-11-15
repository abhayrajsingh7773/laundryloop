import React from 'react';
import { Waves, ShieldCheck, Heart, Sparkles, Building2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Brand Details */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                laundryloop — Laundry Day Roulette Prototype
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                INT335 Design Thinking Project • Lovely Professional University (LPU)
              </p>
            </div>
          </div>

          {/* Center Pillar Goals */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Predictable Turnaround
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              PIN Collection Verification
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              Transparent Warden Escalation
            </span>
          </div>

          {/* Right Disclaimer */}
          <div className="text-center md:text-right text-[11px] text-slate-400">
            <div>Educational Prototype for INT335 Testing</div>
            <div>Data stored locally in browser session</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
