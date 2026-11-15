import React, { useState } from 'react';
import { useLaundry } from '../../context/LaundryContext';
import { RoleSwitcher } from '../common/RoleSwitcher';
import {
  Waves,
  Bell,
  Menu,
  X,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  const {
    notifications,
    markNotificationAsRead,
    setIsGuideModalOpen,
    setActiveTab,
    currentRole,
    setSelectedOrderId,
  } = useLaundry();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Mobile Menu & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <div
              onClick={() => {
                if (currentRole === 'student') setActiveTab('dashboard');
                else if (currentRole === 'staff') setActiveTab('staff_dashboard');
                else setActiveTab('warden_overview');
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Waves className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-white font-heading">
                    laundry<span className="text-sky-400">loop</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 tracking-wide uppercase">
                    LPU
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Hostel Laundry Management System
                </p>
              </div>
            </div>
          </div>

          {/* Center: Role Switcher */}
          <div className="hidden sm:flex items-center">
            <RoleSwitcher />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Guide Button */}
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-semibold border border-sky-500/30 transition-colors cursor-pointer"
              title="Open INT335 Evaluation Tasks"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Usability Tasks</span>
            </button>

            {/* Notification Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popup */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 z-50 overflow-hidden animate-in fade-in">
                  <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Notifications ({unreadCount} new)
                    </span>
                    <button
                      onClick={() => {
                        notifications.forEach((n) => markNotificationAsRead(n.id));
                      }}
                      className="text-[11px] font-medium text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/80">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        return (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markNotificationAsRead(notif.id);
                              if (notif.orderId) {
                                setSelectedOrderId(notif.orderId);
                                setActiveTab('track');
                                setIsNotifOpen(false);
                              }
                            }}
                            className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-800/70 flex items-start gap-3 ${
                              !notif.read ? 'bg-sky-950/30' : ''
                            }`}
                          >
                            <div className="shrink-0 mt-0.5">
                              {notif.type === 'success' && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              )}
                              {notif.type === 'warning' && (
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                              )}
                              {notif.type !== 'success' && notif.type !== 'warning' && (
                                <Info className="w-4 h-4 text-sky-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4
                                  className={`text-xs font-semibold truncate ${
                                    !notif.read ? 'text-white font-bold' : 'text-slate-300'
                                  }`}
                                >
                                  {notif.title}
                                </h4>
                                {!notif.read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                                {notif.message}
                              </p>
                              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                                <span>{notif.timestamp}</span>
                                {notif.orderId && (
                                  <span className="text-sky-400 flex items-center gap-0.5 font-medium">
                                    View Order <ExternalLink className="w-2.5 h-2.5" />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Role Switcher Bar */}
        <div className="sm:hidden pb-3 pt-1 border-t border-slate-800 flex justify-center">
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
};
