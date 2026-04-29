'use client';

import React, { useState } from 'react';
import { Shield, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const { login, error: authError, isLoading: authLoading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const[password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!identifier || !password) {
      setLocalError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      await login({ identifier, password });
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
    }
  };

  return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0F172A]">

        {/* 1. ARRIÈRE-PLAN AVEC FILTRE ADOUCI */}
        <div className="absolute inset-0 z-0">
          <img
              src="https://plus.unsplash.com/premium_vector-1682310916908-3dd53df309b8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Architecture Business"
              className="w-full h-full object-cover"
          />
          {/* Filtre beaucoup plus léger pour laisser apparaître l'image */}
          <div className="absolute inset-0 bg-[#0F172A]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/20 to-transparent" />
        </div>

        {/* 2. CARTE DE CONNEXION : GLASSMORPHISM CLAIR (Premium) */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-[420px] relative z-10"
        >
          {/* L'effet "Verre Givré Blanc" */}
          <div
              className="bg-white/75 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.15)] p-8 sm:p-10 border border-white/60">

            {/* Logo & Titre */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div
                    className="w-16 h-16 bg-[#1877F2] rounded-full flex items-center justify-center shadow-lg shadow-[#1877F2]/20 border border-[#1877F2]/50">
                  <span className="text-white font-black text-3xl">U</span>
                </div>
                <span className="text-4xl font-black text-slate-900 tracking-tighter">UGate</span>
              </div>

              <h1 className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-widest">Super Admin</h1>
              <p className="text-slate-600 font-medium text-xs">Contrôle d'accès sécurisé</p>
            </div>

            {/* Alertes d'Erreur */}
            {(localError || authError) && (
                <motion.div
                    initial={{opacity: 0, scale: 0.95}}
                    animate={{opacity: 1, scale: 1}}
                    className="mb-6 p-4 bg-red-50/90 border border-red-200 rounded-xl flex items-start gap-3 backdrop-blur-md"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"/>
                  <p className="text-sm font-medium text-red-700">{localError || authError}</p>
                </motion.div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-widest">
                  Identifiant
                </label>
                <div className="relative group">
                  <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1877F2] transition-colors"/>
                  <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 shadow-inner rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1877F2]/15 focus:bg-white focus:border-[#1877F2] transition-all text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                      placeholder="admin@ugate.com"
                      disabled={authLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-widest">
                  Mot de passe
                </label>
                <div className="relative group">
                  <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#1877F2] transition-colors"/>
                  <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 shadow-inner rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1877F2]/15 focus:bg-white focus:border-[#1877F2] transition-all text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                      placeholder="••••••••"
                      disabled={authLoading}
                  />
                </div>
              </div>

              <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-8 py-3.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed outline-none"
              >
                {authLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : null}
                {authLoading ? 'Authentification...' : 'Accéder à la plateforme'}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-300/80 text-xs mt-8 font-medium backdrop-blur-sm inline-block px-4 py-1 rounded-full bg-[#0F172A]/20">
            © {new Date().getFullYear()} U-Gate Platform. Accès strictement réservé.
          </p>
        </motion.div>
      </div>
  );
};