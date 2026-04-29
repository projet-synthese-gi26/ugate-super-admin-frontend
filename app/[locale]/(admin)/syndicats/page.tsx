'use client';

import React from 'react';
import { SyndicatsManagement } from '@/components/SyndicatsManagement';
import { useRouter } from 'next/navigation';

export default function SyndicatsPage() {
  const router = useRouter();

  const handleNavigate = (view: string, data?: unknown) => {
    if (data) {
      router.push(`/${view}?data=${JSON.stringify(data)}`);
    } else {
      router.push(`/${view}`);
    }
  };

  return <SyndicatsManagement onNavigate={handleNavigate} />;
}
