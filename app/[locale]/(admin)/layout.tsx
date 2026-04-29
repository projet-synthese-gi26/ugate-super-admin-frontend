'use client';

import React, { useEffect, useState } from 'react';
import { SuperAdminLayout } from '@/components/SuperAdminLayout';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from '@/lib/i18n/routing';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Évite les erreurs d'hydratation entre le serveur et le client
  useEffect(() => {
    setMounted(true);
  },[]);

  // Redirection automatique si le token expire ou est absent
  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.replace('/');
    }
  },[isAuthenticated, isLoading, router, mounted]);

  // Écran de chargement pendant la vérification du token
  if (!mounted || isLoading || !isAuthenticated) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
          <Loader2 className="w-12 h-12 text-[#1877F2] animate-spin" />
        </div>
    );
  }

  return <SuperAdminLayout>{children}</SuperAdminLayout>;
}