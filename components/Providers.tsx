'use client';

import React from 'react';
import { StoreProvider, useStore } from '@/lib/store-context';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { ZaloContactWidget } from '@/components/ZaloContactWidget';
import { DEFAULT_STORE_INFO } from '@/lib/stationery-data';

function GlobalToast() {
  const { toastMessage } = useStore();
  if (!toastMessage) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm bg-slate-900/95 text-white px-4 py-3 rounded-2xl border border-emerald-500/50 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <span className="text-xs font-semibold leading-snug">{toastMessage}</span>
    </div>
  );
}

function GlobalZalo() {
  return (
    <ZaloContactWidget
      hotline={DEFAULT_STORE_INFO.hotline}
      zaloNumber="0908123456"
      storeAddress={`${DEFAULT_STORE_INFO.address}, ${DEFAULT_STORE_INFO.wardDistrictCity}`}
    />
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      {children}
      <GlobalToast />
      <GlobalZalo />
    </StoreProvider>
  );
}
