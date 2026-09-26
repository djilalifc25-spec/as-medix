'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, Siren, X } from 'lucide-react';
import Link from 'next/link';

export function PwaRegister() {
  const [isOffline, setIsOffline] = useState(false);
  const [dismissBanner, setDismissBanner] = useState(false);

  useEffect(() => {
    // 1. In local development (localhost), unregister SW and clear stale caches
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            reg.unregister();
          }
        });
      }
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      }
      return;
    }

    // 1. Register Service Worker in production
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    }

    // 2. Track Network Online / Offline Status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsOffline(true);
      setDismissBanner(false);
    };

    if (typeof window !== 'undefined') {
      if (!navigator.onLine) setIsOffline(true);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  if (!isOffline || dismissBanner) return null;

  return (
    <aside aria-label="Alerte de connexion" style={{ top: "calc(max(1rem, env(safe-area-inset-top, 0px)) + 3.75rem)" }} className="fixed left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto bg-slate-900/95 border border-amber-500/40 text-slate-100 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
        <WifiOff className="w-4 h-4" />
      </div>

      <div className="flex-1 text-xs">
        <p className="font-semibold text-white flex items-center gap-1.5">
          <span>Mode Hors-Ligne</span>
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </p>
        <p className="text-slate-400">
          Mode Garde H24 actif & calculateurs prêts.
        </p>
      </div>

      <Link
        href="/garde"
        className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 text-xs font-semibold transition-colors shrink-0 flex items-center gap-1"
      >
        <Siren className="w-3 h-3 text-rose-400" />
        <span>Garde</span>
      </Link>

      <button
        onClick={() => setDismissBanner(true)}
        className="p-1 text-slate-500 hover:text-slate-300 transition-colors shrink-0"
        title="Fermer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}