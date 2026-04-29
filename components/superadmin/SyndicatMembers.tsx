'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, Users as UsersIcon, Loader2, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Link } from '@/lib/i18n/routing';
import { getSyndicateMembers, MemberResponse } from '@/lib/services/superadmin.service';

export const SyndicatMembers: React.FC<{ syndicatId: string }> = ({ syndicatId }) => {
    const t = useTranslations('SyndicatMembers');
    const [members, setMembers] = useState<MemberResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await getSyndicateMembers(syndicatId);
                setMembers(data ||[]);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMembers();
    }, [syndicatId]);

    const filteredMembers = members.filter(m =>
        m.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-4 sm:p-8 w-full max-w-[1600px] mx-auto">

            {/* BOUTON RETOUR */}
            <Link href="/syndicats" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1877F2] transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit">
                <ChevronLeft size={16} /> {t('back')}
            </Link>

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-950">{t('title')}</h1>
                    <p className="text-sm text-slate-500 mt-1">{t('subtitle')}</p>
                </div>
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20 focus:border-[#1877F2] transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* TABLEAU DES MEMBRES */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">{t('table.member')}</th>
                            <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">{t('table.role')}</th>
                            <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">{t('table.branch')}</th>
                            <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">{t('table.joinedAt')}</th>
                        </tr>
                        </thead>

                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.tbody key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="border-b border-slate-50">
                                            <td className="px-6 py-4"><Skeleton className="h-10 w-48" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                                            <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                                            <td className="px-6 py-4 flex justify-end"><Skeleton className="h-5 w-24" /></td>
                                        </tr>
                                    ))}
                                </motion.tbody>
                            ) : filteredMembers.length === 0 ? (
                                <motion.tbody key="empty">
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center">
                                            <UsersIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                                            <p className="text-slate-500 font-medium">{t('emptyState')}</p>
                                        </td>
                                    </tr>
                                </motion.tbody>
                            ) : (
                                <motion.tbody key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    {filteredMembers.map((member) => (
                                        <tr key={member.userId} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    {member.profileImageUrl ? (
                                                        <img src={member.profileImageUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm border border-blue-100">
                                                            {member.firstName?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-blue-950">{member.firstName} {member.lastName}</div>
                                                        <div className="text-xs text-slate-400">{member.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={['ADMIN','PRESIDENT','MODERATOR'].includes(member.role) ? 'info' : 'default'} className="font-bold text-[10px]">
                                                    {member.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{member.branchId}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium text-sm">
                          <Calendar size={14} className="text-slate-400" />
                            {new Date(member.joinedAt).toLocaleDateString()}
                        </span>
                                            </td>
                                        </tr>
                                    ))}
                                </motion.tbody>
                            )}
                        </AnimatePresence>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};