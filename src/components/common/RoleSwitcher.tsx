import React from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { UserRole } from '../../types';
import { GraduationCap, Shirt, ShieldCheck, Check } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, setCurrentRole, currentStudent } = useLaundry();

  const roles: {
    id: UserRole;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }[] = [
    {
      id: 'student',
      label: 'Student',
      sublabel: `${currentStudent.name} (BH-3)`,
      icon: GraduationCap,
      accentColor: 'text-sky-600 bg-sky-50 border-sky-200',
    },
    {
      id: 'staff',
      label: 'Laundry Staff',
      sublabel: 'Counter / Bay',
      icon: Shirt,
      accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      id: 'warden',
      label: 'Hostel Warden',
      sublabel: 'Dr. Gupta',
      icon: ShieldCheck,
      accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 shadow-xs">
      <div className="hidden lg:flex items-center px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        Active Role:
      </div>
      <div className="flex items-center gap-1">
        {roles.map((r) => {
          const isActive = currentRole === r.id;
          const Icon = r.icon;

          return (
            <button
              key={r.id}
              onClick={() => setCurrentRole(r.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs border border-slate-600 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
              title={`Switch to ${r.label} role view`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>{r.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
