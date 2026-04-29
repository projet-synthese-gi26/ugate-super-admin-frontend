'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckCircle, XCircle, Eye, Power, Download, FileText,
  Building2, ChevronLeft, ChevronRight, Users, MapPin
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import {
  getAllSyndicates, approveSyndicate, disapproveSyndicate,
  activateSyndicate, deactivateSyndicate, SyndicateResponse
} from '@/lib/services/superadmin.service';

export const SyndicatsManagement: React.FC = () => {
  const t = useTranslations('Syndicats');
  const router = useRouter();

  const[searchTerm, setSearchTerm] = useState('');
  const[filterStatus, setFilterStatus] = useState<'all'|'approved'|'pending'|'active'|'inactive'>('all');

  const[syndicats, setSyndicats] = useState<SyndicateResponse[]>([]);
  const[isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const [selectedSyndicat, setSelectedSyndicat] = useState<SyndicateResponse | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => { loadSyndicats(); }, [currentPage]);

  const loadSyndicats = async () => {
    setIsLoading(true);
    try {
      const response = await getAllSyndicates(currentPage, pageSize);
      setSyndicats(response.content ||[]);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSyndicats = syndicats.filter(s => {
    const match = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.domain?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === 'approved') return match && s.isApproved;
    if (filterStatus === 'pending') return match && !s.isApproved;
    if (filterStatus === 'active') return match && s.isActive;
    if (filterStatus === 'inactive') return match && !s.isActive;
    return match;
  });

  const handleAction = async (actionFn: any, id: string) => {
    try {
      await actionFn(id);
      await loadSyndicats();
      setShowProfileModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 p-4 sm:p-8 w-full max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-950">{t('title')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('subtitle')}</p>
        </div>

        {/* BARRE DE CONTRÔLES */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="inline-flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto hide-scrollbar">
            {['all', 'approved', 'pending', 'active', 'inactive'].map((filter) => (
                <button
                    key={filter}
                    onClick={() => setFilterStatus(filter as any)}
                    className={cn(
                        "px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap outline-none",
                        filterStatus === filter ? "bg-white text-blue-950 shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                    )}
                >
                  {t(`filters.${filter}`)}
                </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1877F2]/20 focus:border-[#1877F2] transition-all shadow-sm"
            />
          </div>
        </div>

        {/* TABLEAU */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('table.syndicate')}</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('table.domain')}</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('table.status')}</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px]">{t('table.date')}</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-widest text-[10px] text-right">{t('table.actions')}</th>
              </tr>
              </thead>

              <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.tbody key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-b border-slate-100">
                            <td className="px-6 py-4"><Skeleton className="h-10 w-64" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                            <td className="px-6 py-4"><div className="flex justify-end"><Skeleton className="h-8 w-32" /></div></td>
                          </tr>
                      ))}
                    </motion.tbody>
                ) : filteredSyndicats.length === 0 ? (
                    <motion.tbody key="empty">
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                          <p className="text-slate-500 font-medium">{t('emptyState')}</p>
                        </td>
                      </tr>
                    </motion.tbody>
                ) : (
                    <motion.tbody key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {filteredSyndicats.map((syndicat) => (
                          <tr key={syndicat.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                {syndicat.logoUrl ? (
                                    <img src={syndicat.logoUrl} alt="Logo" className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm" />
                                ) : (
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold border border-slate-200 text-lg">
                                      {syndicat.name?.charAt(0)}
                                    </div>
                                )}
                                <div>
                                  <div className="font-bold text-blue-950 text-[15px]">{syndicat.name}</div>
                                  <div className="text-xs text-slate-500 truncate max-w-[250px] mt-0.5">{syndicat.description || t('noDescription')}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <Badge variant="outline" className="bg-white text-slate-600 font-bold text-[10px]">{syndicat.domain || "N/A"}</Badge>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex gap-2">
                                <Badge variant={syndicat.isApproved ? 'success' : 'warning'} className="text-[10px] font-bold px-2 py-1">
                                  {syndicat.isApproved ? t('status.approved') : t('status.pending')}
                                </Badge>
                                <Badge variant={syndicat.isActive ? 'info' : 'default'} className="text-[10px] font-bold px-2 py-1">
                                  {syndicat.isActive ? t('status.active') : t('status.inactive')}
                                </Badge>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-slate-500 font-medium">
                              {syndicat.createdAt ? new Date(syndicat.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => { setSelectedSyndicat(syndicat); setShowProfileModal(true); }}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-all"
                                    title={t('actions.profile')}
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => router.push(`/syndicats/${syndicat.id}/members`)}
                                    className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 border border-transparent hover:border-purple-100 rounded-lg transition-all"
                                    title={t('actions.members')}
                                >
                                  <Users className="w-5 h-5" />
                                </button>
                                <div className="w-px h-5 bg-slate-200 mx-2" />
                                {syndicat.isApproved ? (
                                    <button onClick={() => handleAction(disapproveSyndicate, syndicat.id)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title={t('actions.disapprove')}><XCircle className="w-5 h-5" /></button>
                                ) : (
                                    <button onClick={() => handleAction(approveSyndicate, syndicat.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title={t('actions.approve')}><CheckCircle className="w-5 h-5" /></button>
                                )}
                                <button
                                    onClick={() => handleAction(syndicat.isActive ? deactivateSyndicate : activateSyndicate, syndicat.id)}
                                    className={cn("p-2 rounded-lg transition-colors", syndicat.isActive ? "text-red-500 hover:bg-red-50" : "text-emerald-600 hover:bg-emerald-50")}
                                    title={syndicat.isActive ? t('actions.deactivate') : t('actions.activate')}
                                >
                                  <Power className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                      ))}
                    </motion.tbody>
                )}
              </AnimatePresence>
            </table>
          </div>

          {/* PAGINATION */}
          {!isLoading && totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm font-medium text-slate-500">
              {t('pagination.page')} {currentPage + 1} / {totalPages}
            </span>
                <div className="flex gap-2">
                  <button
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                      className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 flex items-center outline-none shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> {t('pagination.previous')}
                  </button>
                  <button
                      disabled={currentPage >= totalPages - 1}
                      onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                      className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 flex items-center outline-none shadow-sm"
                  >
                    {t('pagination.next')} <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
          )}
        </div>

        {/* MODAL PROFIL AVEC DOCUMENTS */}
        <AnimatePresence>
          {showProfileModal && selectedSyndicat && (
              <div className="fixed inset-0 bg-slate-900/40 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]"
                >
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-xl font-bold text-blue-950">{t('profileModal.title')}</h2>
                    <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                      <XCircle className="w-6 h-6 text-slate-500" />
                    </button>
                  </div>

                  <div className="p-6 md:p-10 overflow-y-auto">
                    <div className="flex items-center gap-6 mb-10">
                      {selectedSyndicat.logoUrl ? (
                          <img src={selectedSyndicat.logoUrl} alt="Logo" className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-md" />
                      ) : (
                          <div className="w-24 h-24 rounded-2xl bg-primary-800 text-white flex items-center justify-center text-3xl font-black shadow-md">
                            {selectedSyndicat.name.charAt(0)}
                          </div>
                      )}
                      <div>
                        <h3 className="text-3xl font-black text-blue-950 tracking-tight">{selectedSyndicat.name}</h3>
                        <p className="text-slate-500 flex items-center gap-2 mt-2 font-medium text-lg">
                          <MapPin size={18} className="text-primary-500"/> {selectedSyndicat.domain}
                        </p>
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-900 mb-4 text-lg">{t('profileModal.generalInfo')}</h4>
                    <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t('profileModal.organizationId')}</p>
                        <p className="font-mono text-sm text-slate-900 font-medium">{selectedSyndicat.id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t('table.date')}</p>
                        <p className="font-bold text-slate-900">{selectedSyndicat.createdAt ? new Date(selectedSyndicat.createdAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{t('profileModal.description')}</p>
                        <p className="text-slate-700 leading-relaxed font-medium">{selectedSyndicat.description || t('noDescription')}</p>
                      </div>
                    </div>

                    {/* NOUVEAU: SECTION DOCUMENTS OFFICIELS */}
                    <h4 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
                      <FileText className="text-primary-600" size={20}/> {t('profileModal.documents')}
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                      {/* Charte */}
                      <div className="border border-slate-200 rounded-2xl p-5 flex items-center gap-4 bg-white shadow-sm">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                          <FileText size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{t('profileModal.charte')}</p>
                          {selectedSyndicat.charteUrl ? (
                              <a href={selectedSyndicat.charteUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#1877F2] hover:underline flex items-center gap-1 mt-1">
                                <Download size={14} /> {t('profileModal.viewDoc')}
                              </a>
                          ) : (
                              <p className="text-xs font-medium text-slate-400 mt-1 italic">{t('profileModal.noDoc')}</p>
                          )}
                        </div>
                      </div>
                      {/* Statuts */}
                      <div className="border border-slate-200 rounded-2xl p-5 flex items-center gap-4 bg-white shadow-sm">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                          <FileText size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{t('profileModal.statusDoc')}</p>
                          {selectedSyndicat.statusUrl ? (
                              <a href={selectedSyndicat.statusUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#1877F2] hover:underline flex items-center gap-1 mt-1">
                                <Download size={14} /> {t('profileModal.viewDoc')}
                              </a>
                          ) : (
                              <p className="text-xs font-medium text-slate-400 mt-1 italic">{t('profileModal.noDoc')}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-6 border-t border-slate-100">
                      {!selectedSyndicat.isApproved ? (
                          <button onClick={() => handleAction(approveSyndicate, selectedSyndicat.id)} className="px-6 py-3 bg-emerald-50 text-emerald-600 font-bold rounded-xl hover:bg-emerald-100 transition-colors">
                            {t('actions.approve')}
                          </button>
                      ) : (
                          <button onClick={() => handleAction(disapproveSyndicate, selectedSyndicat.id)} className="px-6 py-3 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-100 transition-colors">
                            {t('actions.disapprove')}
                          </button>
                      )}

                      <button onClick={() => handleAction(selectedSyndicat.isActive ? deactivateSyndicate : activateSyndicate, selectedSyndicat.id)} className={cn("px-6 py-3 font-bold rounded-xl transition-all text-white shadow-lg", selectedSyndicat.isActive ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20")}>
                        {selectedSyndicat.isActive ? t('actions.deactivate') : t('actions.activate')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
          )}
        </AnimatePresence>

      </motion.div>
  );
};