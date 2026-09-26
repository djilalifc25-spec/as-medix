'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { INITIAL_CAT } from '@/lib/db/seedCat';
import { CATProtocol } from '@/types';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import {
  ArrowLeft, Siren, Stethoscope, FileText, Check, Copy, Printer,
  Minimize2, Maximize2, X, AlertTriangle, Activity, FlaskConical
} from 'lucide-react';

function CatDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [protocols, setProtocols] = useState<CATProtocol[]>(INITIAL_CAT);
  const [activeTab, setActiveTab] = useState<'tab-urgence' | 'tab-clinique' | 'tab-ordo'>('tab-urgence');
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fullscreen open by default as requested
  const initialFullscreen = searchParams.get('fullscreen') !== 'false';
  const [isFullscreen, setIsFullscreen] = useState(initialFullscreen);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch updated list from /api/cat
  useEffect(() => {
    fetch('/api/cat')
      .then(res => res.json())
      .then(data => {
        if (data.protocols && Array.isArray(data.protocols)) {
          setProtocols(data.protocols);
        }
      })
      .catch(() => {});
  }, []);

  const cat = protocols.find(c => c.slug === slug || c.id === slug || c.id === `cat_${slug}`);

  // Body scroll locking and modal synchronization in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('fullscreen-mode', 'modal-open');
      window.dispatchEvent(new Event('modal-state-change'));
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('fullscreen-mode', 'modal-open');
      window.dispatchEvent(new Event('modal-state-change'));
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('fullscreen-mode', 'modal-open');
      window.dispatchEvent(new Event('modal-state-change'));
    };
  }, [isFullscreen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  if (!cat) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Protocole non trouvé.</h2>
        <p className="text-xs text-slate-500">Le protocole demandé n'existe pas ou est en cours de révision.</p>
        <Link href="/cat" className="apple-badge-purple px-4 py-2 text-xs font-bold inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour aux Conduites à Tenir
        </Link>
      </div>
    );
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleCopyOrdonnance = () => {
    if (!cat.ordonnance || cat.ordonnance.length === 0) return;
    const lines = [
      `╔══════════════════════════════════════════════════════════════╗`,
      `  ORDONNANCE MÉDICALE D'URGENCE - AS-MEDIX DZ`,
      `  Protocole : ${cat.title}`,
      `  Discipline : ${cat.category || cat.specialtyName} (${cat.page || ''})`,
      `╚══════════════════════════════════════════════════════════════╝`,
      ``,
      ...cat.ordonnance.map((item, idx) =>
        `${idx + 1}. ${item.drug.toUpperCase()} ${item.dose ? `(${item.dose})` : ''}\n   Posologie : ${item.poso}\n   Quantité : ${item.qty || '1 boîte'}\n`
      ),
      cat.conseils ? `Conseils d'hygiène & surveillance :\n${cat.conseils}\n` : '',
      `Date : ${new Date().toLocaleDateString('fr-FR')} • Carnet de CAT Dr Abu Imad`
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const severityDotClass = cat.severity === 'red'
    ? 'bg-rose-500 animate-pulse'
    : (cat.severity === 'amber' ? 'bg-amber-500' : 'bg-emerald-500');

  const ContentBody = () => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
      {/* 1. Modal / Fullscreen Header */}
      <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 ${severityDotClass}`} />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {cat.title}
              </h2>
              {cat.page && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  Carnet : {cat.page}
                </span>
              )}
            </div>
            <div className="text-xs font-medium text-cyan-600 dark:text-cyan-400">
              {cat.category || cat.specialtyName} — Conduite à Tenir Clinique
            </div>
            {cat.synopsis && (
              <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed font-normal">
                {cat.synopsis}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handlePrint}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Imprimer la CAT"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyOrdonnance}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Copier l'ordonnance"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
          >
            {isFullscreen ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. EXACT THREE-TAB NAVIGATION BAR */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 gap-6 text-sm font-medium overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('tab-urgence')}
          className={`py-3 flex items-center gap-2 border-b-2 shrink-0 transition-all font-semibold ${
            activeTab === 'tab-urgence'
              ? 'text-cyan-600 dark:text-cyan-400 border-cyan-600 dark:border-cyan-400'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border-transparent'
          }`}
        >
          <Siren className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Prise en Charge Immédiate</span>
        </button>

        <button
          onClick={() => setActiveTab('tab-clinique')}
          className={`py-3 flex items-center gap-2 border-b-2 shrink-0 transition-all font-semibold ${
            activeTab === 'tab-clinique'
              ? 'text-cyan-600 dark:text-cyan-400 border-cyan-600 dark:border-cyan-400'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border-transparent'
          }`}
        >
          <Stethoscope className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Signes & Bilans</span>
        </button>

        <button
          onClick={() => setActiveTab('tab-ordo')}
          className={`py-3 flex items-center gap-2 border-b-2 shrink-0 transition-all font-semibold ${
            activeTab === 'tab-ordo'
              ? 'text-cyan-600 dark:text-cyan-400 border-cyan-600 dark:border-cyan-400'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border-transparent'
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-600 shrink-0" />
          <span>Ordonnance Type</span>
        </button>
      </div>

      {/* 3. Modal / Fullscreen Body Content */}
      <div className="p-4 sm:p-6 space-y-6 flex-1 text-sm leading-relaxed overflow-y-auto">
        {/* ── SECTION 1: Prise en Charge Immédiate (PDF) ── */}
        <div id="tab-urgence" className={`space-y-4 animate-in fade-in duration-200 ${activeTab === 'tab-urgence' ? 'block' : 'hidden'}`}>
          {/* Urgence Steps */}
          <div className="p-4 sm:p-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2">
            <h4 className="font-bold flex items-center gap-2 mb-2 text-sm sm:text-base text-slate-900 dark:text-slate-100">
              <Siren className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
              <span>Prise en Charge Immédiate aux Urgences (PDF)</span>
            </h4>
            <div
              className="text-xs sm:text-sm space-y-2 text-slate-800 dark:text-slate-200 leading-relaxed font-medium"
              dangerouslySetInnerHTML={{ __html: cat.urgenceHtml || '' }}
            />
          </div>

          {/* Protocole & Paliers d'Administration */}
          {cat.protocoleHtml && (
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2 text-sm sm:text-base">
                <Activity className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Protocole & Paliers d'Administration</span>
              </h4>
              <div
                className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: cat.protocoleHtml }}
              />
            </div>
          )}

          {/* Red Flag Alert */}
          {(cat.alertes || (cat.redFlags && cat.redFlags.length > 0)) && (
            <div className="p-4 sm:p-5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold block text-sm">Critères d'Avis Spécialisé / Réanimation / Hospitalisation :</span>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed">
                  {cat.alertes || cat.redFlags?.join(' • ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── SECTION 2: Signes & Bilans ── */}
        <div id="tab-clinique" className={`space-y-4 animate-in fade-in duration-200 ${activeTab === 'tab-clinique' ? 'block' : 'hidden'}`}>
          {/* Tableau Clinique */}
          <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/60 p-4 sm:p-5 rounded-xl space-y-2">
            <h4 className="font-bold text-cyan-900 dark:text-cyan-300 flex items-center gap-2 mb-1 text-sm sm:text-base">
              <Stethoscope className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>Tableau Clinique & Symptômes</span>
            </h4>
            <div
              className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: cat.cliniqueHtml || '' }}
            />
          </div>

          {/* Bilan Biologique & Imagerie Demandée */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 p-4 sm:p-5 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1 text-sm sm:text-base">
              <FlaskConical className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Bilan Biologique & Imagerie Demandée</span>
            </h4>
            <div
              className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800"
              dangerouslySetInnerHTML={{ __html: cat.bilanHtml || '' }}
            />
          </div>
        </div>

        {/* ── SECTION 3: Ordonnance Type ── */}
        <div id="tab-ordo" className={`space-y-4 animate-in fade-in duration-200 ${activeTab === 'tab-ordo' ? 'block' : 'hidden'}`}>
          <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-cyan-500/40 p-4 sm:p-5 rounded-xl relative shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                ORDONNANCE TYPE D'URGENCE / SORTIE
              </div>
              <button
                onClick={handleCopyOrdonnance}
                className="text-xs bg-cyan-50 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 px-2.5 py-1 rounded-md font-semibold hover:bg-cyan-100 dark:hover:bg-cyan-900 transition flex items-center gap-1 active:scale-95 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>

            {/* Dynamic list of medications */}
            <div className="space-y-3 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              {cat.ordonnance && cat.ordonnance.length > 0 ? (
                cat.ordonnance.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:border-cyan-400 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 text-xs flex items-center justify-center font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span>{item.drug}</span>
                        {item.dose && (
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            ({item.dose})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 pl-7 font-sans mt-0.5">
                        {item.poso}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 self-start sm:self-center ml-7 sm:ml-0 shrink-0">
                      {item.qty || '1 boîte'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 italic">
                  Prise en charge essentiellement hospitalière et gestuelle immédiate en milieu réanimatoire.
                </div>
              )}
            </div>

            {cat.conseils && (
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                <strong className="text-slate-700 dark:text-slate-200">Conseils d'hygiène & surveillance :</strong>{' '}
                <span>{cat.conseils}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Modal / Fullscreen Footer */}
      <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
        <span>Basé sur le carnet d'urgences manuscrit 'CAT Abu Imad' {cat.page ? `(${cat.page})` : ''}</span>
        <button
          onClick={toggleFullscreen}
          className="px-4 py-2 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition active:scale-95"
        >
          {isFullscreen ? 'Quitter le Plein Écran' : 'Fermer'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* FULLSCREEN OVERLAY MODE (Default on open) */}
      {isFullscreen && mounted && createPortal(
        <div 
          id="asmedix-fullscreen-cat"
          className="fixed inset-0 z-[999999] w-screen h-[100dvh] bg-[#f8f9ff] dark:bg-slate-950 overflow-y-auto overscroll-contain flex flex-col animate-in fade-in duration-200"
          style={{
            minHeight: '100dvh',
            height: '100dvh',
          }}
        >
          {/* Top Sticky Bar */}
          <div 
            className="sticky top-0 z-50 px-3 sm:px-6 py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2"
            style={{
              paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))',
              paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
              paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
            }}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-xl shrink-0">{getSpecialtyEmoji(cat.specialtyId)}</span>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block truncate">
                  {cat.category || cat.specialtyName} • {cat.page || ''}
                </span>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                  {cat.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/cat"
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-600 flex items-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                title="Retour au hub CAT"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hub CAT</span>
              </Link>

              <button
                onClick={toggleFullscreen}
                className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all bg-cyan-600 text-white hover:bg-cyan-700"
                title="Quitter le plein écran"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quitter plein écran</span>
                <span className="sm:hidden">Réduire</span>
              </button>
            </div>
          </div>

          <div 
            className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6"
            style={{
              paddingBottom: 'max(5rem, env(safe-area-inset-bottom, 0px))',
            }}
          >
            <ContentBody />
          </div>

          {/* Floating Exit Button for Mobile */}
          <button
            onClick={toggleFullscreen}
            className="sm:hidden fixed right-4 z-50 w-11 h-11 rounded-full bg-rose-600 text-white shadow-lg flex items-center justify-center active:scale-90 transition-transform"
            style={{
              bottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))',
            }}
            title="Quitter le plein écran"
            aria-label="Quitter le plein écran"
          >
            <X className="w-5 h-5" />
          </button>
        </div>,
        document.body
      )}

      {/* Standard In-Dashboard View (when fullscreen is minimized) */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <Link
            href="/cat"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux protocoles de CAT</span>
          </Link>

          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all bg-cyan-600 text-white hover:bg-cyan-700"
            title="Mode Plein Écran pour la Garde"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Plein Écran</span>
          </button>
        </div>

        <ContentBody />
      </div>
    </>
  );
}

export default function CatDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-bold text-slate-400">Chargement de la conduite à tenir...</div>}>
      <CatDetailContent />
    </Suspense>
  );
}
