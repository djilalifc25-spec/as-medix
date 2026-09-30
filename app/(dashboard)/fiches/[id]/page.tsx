'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Fiche } from '@/types';
import { INITIAL_FICHES } from '@/lib/db/seedFiches';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import { useMemorization } from '@/lib/hooks/useMemorization';
import {
  ArrowLeft, Clock, Zap, Maximize2, Minimize2, CheckCircle2, ChevronLeft, ChevronRight,
  BookOpen, Sparkles, Share2, Copy, Check, Type, Eye
} from 'lucide-react';

export default function FicheFullScreenPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ficheIdOrSlug = params.id as string;
  const isFullscreen = searchParams.get('fullscreen') === 'true';

  const { scheduleReview } = useMemorization();
  const [fiches, setFiches] = useState<Fiche[]>(INITIAL_FICHES);
  const [currentFiche, setCurrentFiche] = useState<Fiche | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [copied, setCopied] = useState(false);
  const [ratedQuality, setRatedQuality] = useState<string | null>(null);

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
      // Fallback in case state hasn't loaded yet
      const fallback = INITIAL_FICHES.find(f =>
        f.id === decoded ||
        f.slug === decoded ||
        f.id.toLowerCase() === target ||
        f.slug.toLowerCase() === target
      );
      if (fallback) setCurrentFiche(fallback);
    }
  }, [ficheIdOrSlug, fiches]);

  if (!currentFiche) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white">
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

  // Next and Previous fiches in same specialty for sequential study
  const sameSpecialtyFiches = fiches.filter(f =>
    f.specialtyId === currentFiche.specialtyId ||
    (f as any).specialty_id === currentFiche.specialtyId ||
    (f.specialtyName && f.specialtyName.toLowerCase() === currentFiche.specialtyName.toLowerCase())
  );

  const currentIndex = sameSpecialtyFiches.findIndex(f => f.id === currentFiche.id);
  const prevFiche = currentIndex > 0 ? sameSpecialtyFiches[currentIndex - 1] : null;
  const nextFiche = currentIndex < sameSpecialtyFiches.length - 1 ? sameSpecialtyFiches[currentIndex + 1] : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRateSRS = (quality: 'hard' | 'medium' | 'easy' | 'perfect') => {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* 1. TOP FULLSCREEN TOOLBAR */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push('/fiches')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold shrink-0"
            title="Quitter le mode plein écran"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour Hub Fiches</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2 truncate">
            <span className="text-xl shrink-0">{getSpecialtyEmoji(currentFiche.specialtyId)}</span>
            <div className="truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block truncate">
                {currentFiche.specialtyName} • Fiche Flash Plein Écran
              </span>
              <h1 className="text-sm font-black text-white truncate max-w-md sm:max-w-xl">
                {currentFiche.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Right Actions Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Font Size Adjuster */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            <Type className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {(['sm', 'md', 'lg', 'xl'] as const).map(sz => (
              <button
                key={sz}
                onClick={() => setFontSize(sz)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  fontSize === sz
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5"
            title="Copier le lien direct"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden lg:inline">{copied ? 'Copié !' : 'Partager'}</span>
          </button>

          <button
            onClick={() => router.push('/fiches')}
            className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all text-xs font-bold flex items-center gap-1.5"
            title="Quitter le plein écran"
          >
            <Minimize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Réduire</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN FULLSCREEN READING BODY */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:px-8 space-y-8 animate-fade-in">
        
        {/* Header Hero Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
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

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
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

        {/* Dynamic HTML Content */}
        <article className={`prose prose-invert max-w-none ${fontClasses} bg-slate-900/60 p-6 sm:p-10 rounded-3xl border border-white/5 shadow-xl`}>
          <div dangerouslySetInnerHTML={{ __html: currentFiche.htmlContent }} />
        </article>

        {/* SRS Active Recall Rating Bar */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4 shadow-xl text-center">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Évaluation Active Recall (Ebbinghaus)</span>
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
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fiche Précédente</span>
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
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fiche Suivante</span>
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
}
