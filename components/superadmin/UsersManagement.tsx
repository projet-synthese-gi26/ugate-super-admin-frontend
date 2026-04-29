'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldAlert, ShieldCheck, Trash2, Users as UsersIcon, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { getAllUsers, deleteUser, assignRole, removeRole, UserResponse } from '@/lib/services/superadmin.service';
import toast from 'react-hot-toast';

export const UsersManagement: React.FC = () => {
    const t = useTranslations('Users');
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data ||[]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); },[]);

    const handleToggleAdmin = async (userId: string, isCurrentlyAdmin: boolean) => {
        try {
            if (isCurrentlyAdmin) {
                await removeRole(userId, 'SUPER_ADMIN');
            } else {
                await assignRole(userId, 'SUPER_ADMIN');
            }
            fetchUsers();
        } catch (error) {
            toast.error(t('alerts.errorModify'));
        }
    };

    const handleDelete = async (email: string) => {
        if (window.confirm(t('alerts.deleteConfirm', { email }))) {
            try {
                await deleteUser(email);
                fetchUsers();
            } catch (error) {
                toast.error(t('alerts.errorDelete'));
            }
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('title')}</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">{t('subtitle')}</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20 focus:border-[#1877F2] transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('table.user')}</th>
                            <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('table.service')}</th>
                            <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('table.roles')}</th>
                            <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right">{t('table.actions')}</th>
                        </tr>
                        </thead>

                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.tbody key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-[#1877F2] mx-auto"/></td>
                                    </tr>
                                </motion.tbody>
                            ) : filteredUsers.length === 0 ? (
                                <motion.tbody key="empty">
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <UsersIcon className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                                            <p className="text-slate-500 font-medium">{t('emptyState')}</p>
                                        </td>
                                    </tr>
                                </motion.tbody>
                            ) : (
                                <motion.tbody key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    {filteredUsers.map((user) => {
                                        const isSuperAdmin = user.roles.includes('SUPER_ADMIN');
                                        return (
                                            <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                                            {user.firstName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{user.firstName} {user.lastName}</div>
                                                            <div className="text-xs text-slate-400">{user.email} • {user.phone || t('noPhone')}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4"><Badge variant="outline" className="bg-white text-[10px] font-bold">{user.service || 'N/A'}</Badge></td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {user.roles.map(r => (
                                                            <Badge key={r} variant={r === 'SUPER_ADMIN' ? 'success' : 'default'} className="text-[10px] font-bold px-2">{r}</Badge>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleToggleAdmin(user.id, isSuperAdmin)}
                                                            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold border ${isSuperAdmin ? 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'}`}
                                                        >
                                                            {isSuperAdmin ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                                                            {isSuperAdmin ? t('actions.revokeAdmin') : t('actions.grantAdmin')}
                                                        </button>
                                                        <button onClick={() => handleDelete(user.email)} className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors" title={t('actions.delete')}><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </motion.tbody>
                            )}
                        </AnimatePresence>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};