'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/lib/i18n/routing';
import { LayoutDashboard, Building2, Users, DollarSign, Settings, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export const SuperAdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const[isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const NAV_ITEMS =[
    { id: 'dashboard', label: t('dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { id: 'syndicats', label: t('syndicates'), href: '/syndicats', icon: Building2 },
    { id: 'users', label: t('users'), href: '/users', icon: Users },
    { id: 'payments', label: t('payments'), href: '/payments', icon: DollarSign },
    { id: 'settings', label: t('settings'), href: '/settings', icon: Settings },
  ];

  return (
      <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
        {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* SIDEBAR ÉPURÉE */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-8 flex-1 flex flex-col">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center text-white font-black shadow-lg">U</div>
                <div>
                  <span className="font-black text-xl text-slate-900 tracking-tighter block leading-none">U-Gate</span>
                  <span className="text-[10px] font-bold text-[#1877F2] uppercase tracking-widest">Super Admin</span>
                </div>
              </div>
              <button className="lg:hidden text-slate-500" onClick={() => setIsMobileMenuOpen(false)}><X size={24}/></button>
            </div>

            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.includes(item.href);
                return (
                    <Link key={item.id} href={item.href} className={cn("flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300", isActive ? "bg-[#0F172A] text-white shadow-xl shadow-slate-900/20 translate-x-1" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")}>
                      <item.icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
                      {item.label}
                    </Link>
                );
              })}
            </nav>
          </div>

          {/* FOOTER SIDEBAR */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-center mb-4"><LanguageSwitcher variant="light" /></div>
            <div className="flex items-center gap-3 px-2 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-black text-xs shadow-sm">SA</div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-bold text-slate-900 truncate">{user?.firstName || 'Super Admin'}</div>
                <div className="text-[10px] font-bold text-slate-500 truncate">{user?.email || 'admin@ugate.com'}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 font-bold hover:bg-red-50 transition-all text-sm group">
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              {t('logout')}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-72 relative">
          <button className="lg:hidden fixed top-4 right-4 z-40 p-2 bg-white rounded-xl shadow-md text-slate-700" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          {children}
        </div>
      </div>
  );
};