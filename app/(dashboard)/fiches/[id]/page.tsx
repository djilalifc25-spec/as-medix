'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Fiche } from '@/types';
import { INITIAL_FICHES } from '@/lib/db/seedFiches';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import { useMemorization } from '@/lib/hooks/useMemorization';
import {
  ArrowLeft, Clock, Zap, Maximize2, Minimize2, CheckCircle2, ChevronLeft, ChevronRight,
  Sparkles, Copy, Check, Type, X, LayoutGrid, Columns
} from 'lucide-react';

export default function FicheFullScreenPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ficheIdOrSlug = params.id as string;

  const { scheduleReview } = useMemorization();
  const [mounted, setMounted] = useState(false);
  const [fiches, setFiches] = useState<Fiche[]>(INITIAL_FICHES);
  const [currentFiche, setCurrentFiche] = useState<Fiche | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [isWide, setIsWide] = useState(true);
  const [copied, setCopied] = useState(false);
  const [ratedQuality, setRatedQuality] = useState<string | null>(null);
  const [isNativeFs, setIsNativeFs] = useState(false);

  // Mount effect & lock body scroll for true full screen experience
  useEffect(() => {
    setMounted(true);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleFsChange = () => {
      setIsNativeFs(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  // Fetch all fiches from API
  useEffect(() => {
    fetch('/api/fiches')
      .then(r => r.json())
      .then(d => {
        if (d.fiches && Array.isArray(d.fiches) && d.fiches.length > 0) {
          setFiches(d.fiches);
        }
      })
      .catch(() => {});
  }, []);

  // Match current fiche by id, slug, or title
  useEffect(() => {
    if (!ficheIdOrSlug) return;
    const decoded = decodeURIComponent(ficheIdOrSlug);
    const target = decoded.toLowerCase().trim();

    const found = fiches.find(f =>
      f.id === decoded ||
      f.slug === decoded ||
      f.id.toLowerCase() === target ||
      f.slug.toLowerCase() === target ||
      f.title.toLowerCase().includes(target)
    );

    if (found) {
      setCurrentFiche(found);
    } else {
      const fallback = INITIAL_FICHES.find(f =>
        f.id === decoded ||
        f.slug === decoded ||
        f.id.toLowerCase() === target ||
        f.slug.toLowerCase() === target
      );
      if (fallback) setCurrentFiche(fallback);
    }
  }, [ficheIdOrSlug, fiches]);

  // Next and Previous fiches in same specialty for sequential study
  const sameSpecialtyFiches = currentFiche ? fiches.filter(f =>
    f.specialtyId === currentFiche.specialtyId ||
    (f as any).specialty_id === currentFiche.specialtyId ||
    (f.specialtyName && f.specialtyName.toLowerCase() === currentFiche.specialtyName.toLowerCase())
  ) : [];

  const currentIndex = currentFiche ? sameSpecialtyFiches.findIndex(f => f.id === currentFiche.id) : -1;
  const prevFiche = currentIndex > 0 ? sameSpecialtyFiches[currentIndex - 1] : null;
  const nextFiche = currentIndex >= 0 && currentIndex < sameSpecialtyFiches.length - 1 ? sameSpecialtyFiches[currentIndex + 1] : null;

  // Keyboard navigation (Esc to exit, Arrow keys for prev/next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          router.push('/fiches');
        }
      } else if (e.key === 'ArrowLeft' && prevFiche && !(e.target as HTMLElement)?.matches('input, textarea')) {
        router.push(`/fiches/${prevFiche.id}?fullscreen=true`);
      } else if (e.key === 'ArrowRight' && nextFiche && !(e.target as HTMLElement)?.matches('input, textarea')) {
        router.push(`/fiches/${nextFiche.id}?fullscreen=true`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevFiche, nextFiche, router]);

  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      const el = document.getElementById('asmedix-fullscreen-fiche') || document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRateSRS = (quality: 'hard' | 'medium' | 'easy' | 'perfect') => {
    if (!currentFiche) return;
    scheduleReview('fiche', currentFiche.id, currentFiche.title, currentFiche.specialtyName, quality);
    setRatedQuality(quality);
    setTimeout(() => setRatedQuality(null), 3000);
  };

  const fontClasses = {
    sm: 'text-xs leading-relaxed',
    md: 'text-sm leading-relaxed',
    lg: 'text-base leading-relaxed',
    xl: 'text-lg leading-loose'
  }[fontSize];

  if (!currentFiche) {
    return (
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-6 bg-slate-950 text-white">
        <div className="text-center space-y-4">
          <Zap className="w-12 h-12 text-amber-500 animate-pulse mx-auto" />
          <h2 className="text-xl font-bold">Chargement de la Fiche Flash...</h2>
          <p className="text-xs text-slate-400">Si la fiche ne s'affiche pas, vérifiez son identifiant.</p>
          <Link
            href="/fiches"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400"
          >
            ← Retour aux Fiches Flash
          </Link>
        </div>
      </div>
    );
  }

  const content = (
    <div
      id="asmedix-fullscreen-fiche"
      className="fixed inset-0 z-[999999] w-full max-w-full h-[100dvh] bg-slate-950 text-slate-100 overflow-y-auto overflow-x-hidden flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950"
      style={{
        minHeight: '100dvh',
        height: '100dvh',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      {/* SCOPED CSS SAFEGUARD: Guarantees high contrast across all cards and text */}
      <style jsx global>{`
        .fiche-article div[class*="bg-white"],
        .fiche-article div[class*="bg-slate-50"],
        .fiche-article div[class*="bg-blue-50"],
        .fiche-article div[class*="bg-rose-50"],
        .fiche-article div[class*="bg-amber-50"],
        .fiche-article div[class*="bg-emerald-50"],
        .fiche-article div[class*="bg-purple-50"],
        .fiche-article div[class*="bg-indigo-50"] {
          background-color: rgba(15, 23, 42, 0.9) !important;
          color: #f1f5f9 !important;
          border-color: rgba(148, 163, 184, 0.25) !important;
        }
        .fiche-article strong {
          color: #ffffff !important;
        }
        .fiche-article h1, .fiche-article h2, .fiche-article h3, .fiche-article h4 {
          color: #f8fafc !important;
        }
        .fiche-article table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 1.25rem 0 !important;
        }
        .fiche-article th {
          background-color: rgba(30, 41, 59, 0.95) !important;
          color: #fbbf24 !important;
          padding: 0.6rem 0.8rem !important;
        }
        .fiche-article td {
          padding: 0.6rem 0.8rem !important;
          border-color: rgba(51, 65, 85, 0.7) !important;
          color: #e2e8f0 !important;
        }
      `}</style>

      {/* 1. TOP IMMERSIVE TOOLBAR */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 shadow-2xl shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={() => router.push('/fiches')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold shrink-0 border border-white/5 active:scale-95"
            title="Quitter et revenir au hub des fiches"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Hub Fiches</span>
          </button>

          <div className="h-5 w-px bg-white/10 hidden sm:block shrink-0" />

          <div className="flex items-center gap-2 truncate min-w-0">
            <span className="text-xl shrink-0">{getSpecialtyEmoji(currentFiche.specialtyId)}</span>
            <div className="truncate min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block truncate">
                {currentFiche.specialtyName} • PLEIN ÉCRAN
              </span>
              <h1 className="text-xs sm:text-sm font-black text-white truncate max-w-xs sm:max-w-md md:max-w-xl">
                {currentFiche.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Right Actions Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Width Mode Toggle (Normal vs Wide) */}
          <button
            onClick={() => setIsWide(!isWide)}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isWide
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isWide ? 'Passer en largeur normale (centrée)' : 'Passer en mode grand écran large'}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="text-[11px]">{isWide ? 'Large' : 'Centré'}</span>
          </button>

          {/* Font Size Adjuster */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <Type className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {(['sm', 'md', 'lg', 'xl'] as const).map(sz => (
              <button
                key={sz}
                onClick={() => setFontSize(sz)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                  fontSize === sz
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Native OS Fullscreen Button */}
          <button
            onClick={toggleNativeFullscreen}
            className={`p-2 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5 ${
              isNativeFs
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                : 'bg-white/5 hover:bg-white/15 border-white/10 text-slate-300 hover:text-white'
            }`}
            title={isNativeFs ? 'Quitter le mode plein écran OS' : 'Plein écran immersif (OS)'}
          >
            {isNativeFs ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 text-amber-400" />}
            <span className="hidden lg:inline">{isNativeFs ? 'Fenêtré' : 'Plein Écran'}</span>
          </button>

          {/* Share / Copy link */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
            title="Copier le lien direct de la fiche"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden xl:inline">{copied ? 'Copié !' : 'Partager'}</span>
          </button>

          {/* Close / Return Button */}
          <button
            onClick={() => router.push('/fiches')}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-amber-500/20"
            title="Quitter"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Fermer</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN FULLSCREEN READING BODY (WIDE, SPACIOUS, RESPONSIVE) */}
      <main className={`flex-1 w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-8 animate-fade-in ${
        isWide ? 'max-w-6xl' : 'max-w-4xl'
      }`}>
        
        {/* Header Hero Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentFiche.category || 'Synthèse & Fiche Flash Express'}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentFiche.estimatedReadTime}</span>
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                {currentFiche.accessLevel}
              </span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
            {currentFiche.title}
          </h2>

          {/* Key Takeaways Points Cardinaux */}
          {Array.isArray(currentFiche.keyTakeaways) && currentFiche.keyTakeaways.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm space-y-2.5">
              <div className="font-extrabold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>⚡ Points Cardinaux & Pièges Concours (Réflexes) :</span>
              </div>
              <ul className="space-y-1.5 text-slate-200">
                {currentFiche.keyTakeaways.map((point: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Dynamic HTML Content with High-Contrast Dark Theme */}
        <article className={`fiche-article prose prose-invert max-w-none ${fontClasses} bg-slate-900/70 p-6 sm:p-10 rounded-3xl border border-white/5 shadow-2xl`}>
          <div dangerouslySetInnerHTML={{ __html: currentFiche.htmlContent }} />
        </article>

        {/* SRS Active Recall Rating Bar */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4 shadow-xl text-center">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Évaluation Active Recall (Algorithme Ebbinghaus)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Évaluez votre niveau de maîtrise pour programmer la prochaine révision automatique.
            </p>
          </div>

          {ratedQuality && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fade-in">
              ✓ Révision programmée dans votre algorithme SRS avec succès !
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            <button
              onClick={() => handleRateSRS('hard')}
              className="p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all text-center space-y-0.5 active:scale-95"
            >
              <div className="font-black">🔴 À revoir</div>
              <div className="text-[10px] text-rose-400">Rappel J+1</div>
            </button>

            <button
              onClick={() => handleRateSRS('medium')}
              className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all text-center space-y-0.5 active:scale-95"
            >
              <div className="font-black">🟡 Moyen</div>
              <div className="text-[10px] text-amber-400">Rappel J+3</div>
            </button>

            <button
              onClick={() => handleRateSRS('easy')}
              className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all text-center space-y-0.5 active:scale-95"
            >
              <div className="font-black">🟢 Facile</div>
              <div className="text-[10px] text-emerald-400">Rappel J+7</div>
            </button>

            <button
              onClick={() => handleRateSRS('perfect')}
              className="p-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all text-center space-y-0.5 active:scale-95"
            >
              <div className="font-black">🔵 Parfait</div>
              <div className="text-[10px] text-indigo-400">Rappel J+30</div>
            </button>
          </div>
        </div>

        {/* Sequential Navigation Buttons (Prev / Next Fiche in Specialty) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          {prevFiche ? (
            <Link
              href={`/fiches/${prevFiche.id}?fullscreen=true`}
              className="w-full sm:w-auto p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-left transition-all group flex items-center gap-3"
            >
              <ChevronLeft className="w-5 h-5 text-amber-400 group-hover:-translate-x-1 transition-transform shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fiche Précédente (←)</span>
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate block">
                  {prevFiche.title}
                </span>
              </div>
            </Link>
          ) : <div />}

          {nextFiche ? (
            <Link
              href={`/fiches/${nextFiche.id}?fullscreen=true`}
              className="w-full sm:w-auto p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-right transition-all group flex items-center gap-3 sm:ml-auto"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fiche Suivante (→)</span>
                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate block">
                  {nextFiche.title}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          ) : <div />}
        </div>
      </main>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(content, document.body);
}
