'use client';

import React from 'react';
import { SuperAdminDashboard } from '@/components/SuperAdminDashboard';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleNavigate = (view: string, data?: unknown) => {
    if (data) {
      // Si des données sont passées, les stocker dans l'URL ou le state
      router.push(`/${view}?data=${JSON.stringify(data)}`);
    } else {
      router.push(`/${view}`);
    }
  };

  return <SuperAdminDashboard onNavigate={handleNavigate} />;
}
