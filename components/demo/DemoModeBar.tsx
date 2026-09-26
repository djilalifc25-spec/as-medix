'use client';

import React, { useState, useEffect } from 'react';
import { PlanType } from '@/types';
import { Shield, Sparkles, Check, ChevronDown, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const DemoModeBar: React.FC = () => {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<string>('FREE');
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const match = document.cookie.match(/asmedix_demo_override=([^;]+)/);
    if (match) {
      setActiveMode(match[1]);
    }
  }, []);

  const setDemoPlan = (plan: 'FREE' | 'PRO' | 'PREMIUM' | 'ADMIN') => {
    document.cookie = `asmedix_demo_override=${plan}; path=/; max-age=86400`;
    setActiveMode(plan);
    setIsOpen(false);
    router.refresh();
  };

  const resetDemo = () => {
    document.cookie = `asmedix_demo_override=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    setActiveMode('FREE');
    router.refresh();
  };

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-navy-900/90 text-white dark:bg-navy-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-navy-700/80 p-2 flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-600/30 text-brand-300 rounded-lg border border-brand-500/30">
          <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
          <span className="font-semibold tracking-wide">TEST MODE</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-700 dark:bg-navy-750 text-white font-medium transition-all"
          >
            <span>Plan actuel : <strong>{activeMode}</strong></span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-52 bg-navy-900 dark:bg-navy-800 rounded-xl shadow-2xl border border-navy-700 py-1 overflow-hidden z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-navy-400 uppercase tracking-wider border-b border-navy-800">
                Simuler un accès
              </div>
              <button
                onClick={() => setDemoPlan('FREE')}
                className="w-full text-left px-3 py-2 hover:bg-navy-800 flex items-center justify-between transition-colors"
              >
                <span>Forfait GRATUIT (0 DA)</span>
                {activeMode === 'FREE' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
              <button
                onClick={() => setDemoPlan('PRO')}
                className="w-full text-left px-3 py-2 hover:bg-navy-800 flex items-center justify-between transition-colors"
              >
                <span className="text-brand-300 font-medium">Forfait PRO (4 500 DA)</span>
                {activeMode === 'PRO' && <Check className="w-3.5 h-3.5 text-brand-400" />}
              </button>
              <button
                onClick={() => setDemoPlan('PREMIUM')}
                className="w-full text-left px-3 py-2 hover:bg-navy-800 flex items-center justify-between transition-colors"
              >
                <span className="text-amber-300 font-medium">Forfait PREMIUM (7 000 DA)</span>
                {activeMode === 'PREMIUM' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
              <div className="border-t border-navy-800 my-1"></div>
              <button
                onClick={() => setDemoPlan('ADMIN')}
                className="w-full text-left px-3 py-2 hover:bg-navy-800 flex items-center justify-between text-rose-300 font-medium transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  Rôle ADMIN (CMS & Panel)
                </span>
                {activeMode === 'ADMIN' && <Check className="w-3.5 h-3.5 text-rose-400" />}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={resetDemo}
          title="Réinitialiser"
          className="p-1.5 text-navy-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
