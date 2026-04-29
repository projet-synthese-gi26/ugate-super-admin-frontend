'use client';

import React, { useEffect } from 'react';
import { Login } from '@/components/Login';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from '@/lib/i18n/routing';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Rediriger vers le dashboard si l'admin est déjà connecté
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Spinner de chargement pendant la vérification du token
  if (isLoading) {
    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#1877F2] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  // Si non connecté, afficher l'interface de connexion premium
  if (!isAuthenticated) {
    return <Login />;
  }

  // Ne s'affiche jamais théoriquement
  return null;
}