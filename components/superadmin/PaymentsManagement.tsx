'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, Download, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const mockPayments =[
    { id: 'TX-1092', syndicat: 'Syndicat des Taximen', amount: 45000, date: '2026-04-28', status: 'COMPLETED', method: 'Orange Money' },
    { id: 'TX-1093', syndicat: 'Syndicat des Enseignants', amount: 120000, date: '2026-04-27', status: 'PENDING', method: 'Virement' },
    { id: 'TX-1094', syndicat: 'Syndicat du Commerce', amount: 25000, date: '2026-04-26', status: 'FAILED', method: 'MTN Mobile Money' },
];

export const PaymentsManagement: React.FC = () => {
    const t = useTranslations('Payments');
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">{t('title')}</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">{t('subtitle')}</p>
                </div>
                <Button variant="secondary" className="bg-white border-slate-200 text-slate-700 shadow-sm rounded-xl font-bold">
                    <Download className="w-4 h-4 mr-2" /> {t('export')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100"><TrendingUp className="w-5 h-5 text-emerald-600"/></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('revenue')}</p><h3 className="text-2xl font-black text-slate-900">190,000 XAF</h3></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100"><Clock className="w-5 h-5 text-orange-600"/></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('pending')}</p><h3 className="text-2xl font-black text-slate-900">120,000 XAF</h3></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center border border-red-100"><AlertCircle className="w-5 h-5 text-red-600"/></div>
                    <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('failed')}</p><h3 className="text-2xl font-black text-slate-900">25,000 XAF</h3></div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder={t('searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#1877F2] focus:ring-2 focus:ring-[#1877F2]/10 font-medium" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">{t('table.transaction')}</th>
                            <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">{t('table.amount')}</th>
                            <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">{t('table.method')}</th>
                            <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">{t('table.date')}</th>
                            <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">{t('table.status')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {mockPayments.map((p) => (
                            <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900">{p.syndicat}</div>
                                    <div className="text-[10px] text-slate-400 font-black mt-0.5">{p.id}</div>
                                </td>
                                <td className="px-6 py-4 font-black text-slate-700">{p.amount.toLocaleString()} XAF</td>
                                <td className="px-6 py-4 font-medium text-slate-600">{p.method}</td>
                                <td className="px-6 py-4 font-medium text-slate-500">{p.date}</td>
                                <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${p.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : p.status === 'PENDING' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {p.status === 'COMPLETED' && <CheckCircle className="w-3 h-3" />}
                        {p.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {p.status === 'FAILED' && <AlertCircle className="w-3 h-3" />}
                        {p.status}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};