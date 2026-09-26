'use client';

import React, { useEffect, useState } from 'react';
import { Download, Share2, PlusSquare, X, Sparkles, Smartphone, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if app is already installed / standalone
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(isStandaloneMode);
    if (isStandaloneMode) return;

    // Check if user dismissed prompt recently (7 days cooldown)
    const dismissedAt = localStorage.getItem('asmedix_pwa_dismissed');
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(ua);
    setIsIos(isAppleDevice);

    // Listen for Chromium beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Wait 3 seconds after page load before showing prompt smoothly
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, if not standalone, show prompt after 4 seconds
    if (isAppleDevice) {
      setTimeout(() => setShowPrompt(true), 4000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIosGuide(false);
    localStorage.setItem('asmedix_pwa_dismissed', Date.now().toString());
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <>
      {/* Floating Bottom Card */}
      <aside aria-label="Installation de l'application" className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40 max-w-sm w-[calc(100%-1.5rem)] sm:w-96 bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-sky-500/30 rounded-2xl shadow-2xl p-4 backdrop-blur-xl animate-in slide-in-from-bottom-6 duration-400">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-3.5 pr-6">
          {/* Logo Badge */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Application Mobile</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <h4 className="font-bold text-white text-sm leading-snug">
              Installer AS MEDIX
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Accès 1-clic plein écran sans barre d'adresse et Mode Garde H24 disponible sans réseau.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-sky-500/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>{isIos ? 'Ajouter à l\'écran d\'accueil' : 'Installer l\'application'}</span>
          </button>

          <button
            onClick={handleDismiss}
            className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
          >
            Plus tard
          </button>
        </div>
      </aside>

      {/* iOS Installation Instructions Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowIosGuide(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white mx-auto flex items-center justify-center shadow-xl shadow-sky-500/20">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Installer sur iPhone / iPad</h3>
              <p className="text-xs text-slate-400">
                Suivez ces 2 étapes simples sur Safari pour installer l'application sur votre écran d'accueil :
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p>Appuyez sur le bouton <strong>Partager</strong> <Share2 className="w-4 h-4 inline-block text-sky-400 mx-1" /> dans la barre de navigation Safari.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p>Faites défiler vers le bas et touchez <strong>"Sur l'écran d'accueil"</strong> <PlusSquare className="w-4 h-4 inline-block text-sky-400 mx-1" />.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs shadow-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>J'ai compris</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}