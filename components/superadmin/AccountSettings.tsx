'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { User, Lock, Save, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { updateProfile, changePassword } from '@/lib/services/superadmin.service';
import { useAuth } from '@/lib/contexts/AuthContext';

export const AccountSettings: React.FC = () => {
  const t = useTranslations('Settings');
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success'|'error', text: string } | null>(null);

  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: ''
      });
    }
  },[user]);

  const handleProfileSave = async () => {
    setIsLoading(true); setMessage(null);
    try {
      await updateProfile({ firstName: profile.firstName, lastName: profile.lastName, email: profile.email });
      setMessage({ type: 'success', text: t('successProfile') });
    } catch (e) {
      setMessage({ type: 'error', text: "Erreur" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (password.new !== password.confirm) return setMessage({ type: 'error', text: t('errorMismatch') });
    setIsLoading(true); setMessage(null);
    try {
      if(user?.id) {
        await changePassword(user.id, { currentPassword: password.current, newPassword: password.new });
        setMessage({ type: 'success', text: t('successPassword') });
        setPassword({ current: '', new: '', confirm: '' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: "Erreur" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">{t('title')}</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">{t('subtitle')}</p>
        </div>

        {message && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl flex items-center gap-3 font-medium text-sm border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
              {message.text}
            </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-900 font-bold text-sm">
              <User className="w-4 h-4 text-[#1877F2]" /> {t('profile')}
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white hover:shadow-sm hover:border hover:border-slate-200 border border-transparent font-bold text-sm transition-all">
              <Lock className="w-4 h-4" /> {t('security')}
            </button>
          </div>

          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* Formulaire Profil */}
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('firstName')}</label>
                    <input type="text" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1877F2]/20 outline-none transition-all text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('lastName')}</label>
                    <input type="text" value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1877F2]/20 outline-none transition-all text-sm font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('email')}</label>
                  <input type="email" value={profile.email} disabled className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed text-sm font-medium" />
                </div>
              </div>
              <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end">
                <Button onClick={handleProfileSave} disabled={isLoading} className="bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl px-6 font-bold shadow-lg shadow-slate-900/20">
                  {isLoading ? t('saving') : t('save')}
                </Button>
              </div>
            </div>

            {/* Formulaire Mot de passe */}
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('currentPassword')}</label>
                  <input type="password" value={password.current} onChange={e => setPassword({...password, current: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1877F2]/20 outline-none transition-all text-sm font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('newPassword')}</label>
                    <input type="password" value={password.new} onChange={e => setPassword({...password, new: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1877F2]/20 outline-none transition-all text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('confirmPassword')}</label>
                    <input type="password" value={password.confirm} onChange={e => setPassword({...password, confirm: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1877F2]/20 outline-none transition-all text-sm font-medium" />
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end">
                <Button onClick={handlePasswordSave} disabled={isLoading} variant="secondary" className="rounded-xl px-6 font-bold shadow-sm">
                  {isLoading ? t('saving') : t('save')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
  );
};