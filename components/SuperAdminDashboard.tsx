'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, Users, Wallet, Loader2, ArrowRight } from 'lucide-react';
import { getDashboardStats, StatsResponse } from '@/lib/services/superadmin.service';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Link } from '@/lib/i18n/routing';

export const SuperAdminDashboard: React.FC = () => {
  const t = useTranslations('Dashboard');
  const { user } = useAuth();
  const[stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  },[]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#1877F2] w-10 h-10" /></div>;

  return (
      <div className="flex flex-col pb-20 w-full">
        {/* COCKPIT PREMIUM */}
        <div className="bg-[#0F172A] pt-16 pb-28 relative border-b border-slate-800 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1877F2]/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 mix-blend-overlay pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
                Bonjour, {user?.firstName || 'Admin'}
              </h1>
              <p className="text-slate-400 text-lg max-w-xl font-light">
                {t('subtitle')}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex gap-4">
              <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 min-w-[140px] flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-white mb-1">{stats?.pendingSyndicats || 0}</div>
                <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">En attente</div>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 min-w-[140px] flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">OK</div>
                <div className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest">{t('systemOperational')}</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CONTENEUR PRINCIPAL */}
        <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20 w-full flex-1">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col h-full">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><Building2 size={24} /></div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{stats?.totalSyndicats || 0}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('totalSyndicates')}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><ShieldCheck size={24} /></div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{stats?.activeSyndicats || 0}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('activeSyndicates')}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col h-full">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4"><Users size={24} /></div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{stats?.totalMembers || 0}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('activeMembers')}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col h-full">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4"><Wallet size={24} /></div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{stats?.totalRevenue ? `${stats.totalRevenue.toLocaleString()}` : '0'}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('totalRevenue')}</p>
              </div>
            </motion.div>
          </div>

          {/* Bannières d'action rapide */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Link href="/syndicats">
              <div className="bg-gradient-to-br from-[#0F172A] to-blue-900 p-8 rounded-[2.5rem] text-white flex items-center justify-between hover:scale-[1.02] transition-transform shadow-xl shadow-slate-900/20">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{t('manageSyndicates')}</h3>
                  <p className="text-blue-200 text-sm">{t('manageSyndicatesDesc')}</p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20"><ArrowRight /></div>
              </div>
            </Link>
            <Link href="/users">
              <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-blue-300 hover:shadow-xl transition-all">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('manageUsers')}</h3>
                  <p className="text-slate-500 text-sm">{t('manageUsersDesc')}</p>
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 text-[#1877F2]"><ArrowRight /></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
  );
};