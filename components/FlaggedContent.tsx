'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Trash2, MessageSquare, Calendar as CalendarIcon, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Mock data en attendant l'API Backend
const mockData =[
  { id: '1', type: 'publication', content: 'Contenu inapproprié détecté...', reason: 'Langage offensant', author: 'Jean Dupont', date: '2026-04-28' },
  { id: '2', type: 'event', title: 'Rassemblement non autorisé', reason: 'Fraude suspectée', author: 'Syndicat Taximen', date: '2026-04-29' },
];

export const FlaggedContent: React.FC = () => {
  const t = useTranslations('Flagged');
  const [filter, setFilter] = useState<'all' | 'publication' | 'event'>('all');
  const [items, setItems] = useState(mockData);

  const filteredItems = items.filter(item => filter === 'all' || item.type === filter);

  const handleRemoveItem = (id: string) => {
    // TODO: Connecter à l'API DELETE
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-950">{t('title')}</h1>
            <p className="text-sm text-slate-500 mt-1">{t('subtitle')}</p>
          </div>
          <div className="inline-flex bg-slate-100 p-1 rounded-xl">
            {['all', 'publication', 'event'].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === f ? 'bg-white text-blue-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {t(`tabs.${f === 'publication' ? 'publications' : f === 'event' ? 'events' : 'all'}`)}
                </button>
            ))}
          </div>
        </div>

        {/* LISTE DES SIGNALEMENTS */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredItems.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center bg-white border border-slate-200 rounded-2xl">
                  <AlertTriangle className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">{t('emptyState')}</p>
                </motion.div>
            ) : (
                filteredItems.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-5 items-start transition-hover hover:border-slate-300"
                    >
                      <div className={`p-3 rounded-xl flex-shrink-0 ${item.type === 'publication' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                        {item.type === 'publication' ? <MessageSquare className="w-6 h-6" /> : <CalendarIcon className="w-6 h-6" />}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="error" className="bg-red-50 text-red-700 border-red-100">{item.reason}</Badge>
                          <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                        </div>
                        <h4 className="text-base font-semibold text-blue-950">
                          {item.type === 'publication' ? 'Publication signalée' : item.title}
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          "{item.content || item.title}"
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                          <User className="w-3.5 h-3.5" /> Signalé sur le compte de <span className="font-medium text-slate-700">{item.author}</span>
                        </div>
                      </div>

                      <div className="flex w-full md:w-auto md:flex-col gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 mt-4 md:mt-0">
                        <Button variant="outline" size="sm" onClick={() => handleRemoveItem(item.id)} className="flex-1 md:w-full text-slate-600 border-slate-200 hover:bg-slate-50">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> {t('actions.approve')}
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleRemoveItem(item.id)} className="flex-1 md:w-full">
                          <Trash2 className="w-4 h-4 mr-2" /> {t('actions.delete')}
                        </Button>
                      </div>
                    </motion.div>
                ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
  );
};