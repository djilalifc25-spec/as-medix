'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, Siren, ArrowRight, RefreshCw, Activity, ShieldCheck } from 'lucide-react';

export default function OfflinePage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-sky-500">
      {/* Glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        {/* Offline Icon Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl text-sky-400 mb-2 relative">
          <WifiOff className="w-10 h-10 text-amber-400 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        <div>
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Hors-Ligne • Réseau Indisponible
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-3 text-white">
            Connexion Interrompue
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Vous êtes actuellement hors de portée d'une connexion internet (sous-sol d'hôpital, ascenseur ou zone blanche).
          </p>
        </div>

        {/* Highlight Card: Mode Garde H24 Still Available */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-sky-500/30 shadow-xl text-left space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <Siren className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Mode Garde H24 Disponible</h3>
              <p className="text-xs text-slate-400">Fonctionne à 100% sans aucune connexion</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pl-1">
            Les calculateurs posologiques pédiatriques, GDS, PSE et protocoles d'urgences vitales restent entièrement opérationnels en mode hors-ligne.
          </p>

          <Link
            href="/garde"
            className="w-full mt-2 inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-sky-500/25 transition-all active:scale-[0.98]"
          >
            <span>Ouvrir le Mode Garde H24</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Retry Button */}
        <div className="pt-2">
          <button
            onClick={handleReload}
            className="inline-flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-slate-900/50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réessayer la connexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}