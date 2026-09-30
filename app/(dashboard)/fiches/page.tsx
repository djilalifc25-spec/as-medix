'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { INITIAL_FICHES } from '@/lib/db/seedFiches';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import { useMemorization } from '@/lib/hooks/useMemorization';
import {
  Zap, Search, Clock, ArrowRight, ArrowLeft, ChevronRight,
  FileText, Sparkles, CheckCircle2, Maximize2
} from 'lucide-react';

function FichesHubContent() {
  const searchParams = useSearchParams();
  const initialSpec = searchParams.get('specialty') || '';
  const { scheduleReview } = useMemorization();

  // Tab state: if selectedSpecId is empty, user is on Step 1 (Browse Specialties)
  const [selectedSpecId, setSelectedSpecId] = useState<string>(initialSpec);
  const [search, setSearch] = useState('');

  const [allFiches, setAllFiches] = useState<any[]>(INITIAL_FICHES);

  useEffect(() => {
    fetch('/api/fiches')
      .then(r => r.json())
      .then(d => {
        if (d.fiches && Array.isArray(d.fiches) && d.fiches.length > 0) {
          setAllFiches(d.fiches);
        }
      })
      .catch(() => {});
  }, []);

  // 3D Active Recall Trainer State
  const [trainerOpen, setTrainerOpen] = useState(false);
  const [trainerIndex, setTrainerIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeSpecialty = ALL_SPECIALTIES.find(s => s.id === selectedSpecId);

  function matchesFicheSpec(f: any, specId: string, specName?: string): boolean {
    if (!f || !specId) return false;
    const fId = (f.specialtyId || f.specialty_id || '').toLowerCase().trim();
    const sId = specId.toLowerCase().trim();
    if (fId === sId) return true;
    if (sId === 'orl' && (fId === 'orl' || (f.specialtyName && f.specialtyName.toLowerCase().includes('orl')))) return true;
    if (f.specialtyName && specName && f.specialtyName.toLowerCase() === specName.toLowerCase()) return true;
    return false;
  }

  // Filter fiches by active specialty
  const activeSpecialtiesWithFiches = ALL_SPECIALTIES.filter(spec =>
    allFiches.some(f => matchesFicheSpec(f, spec.id, spec.name))
  );

  const specialtyFiches = selectedSpecId
    ? allFiches.filter(f => matchesFicheSpec(f, selectedSpecId, activeSpecialty?.name))
    : allFiches;


  const displayFiches = specialtyFiches.filter(f =>
    !search ||
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.specialtyName.toLowerCase().includes(search.toLowerCase()) ||
    (Array.isArray(f.keyTakeaways) && f.keyTakeaways.some((t: string) => t.toLowerCase().includes(search.toLowerCase())))
  );

  const handleRateCard = (quality: 'hard' | 'medium' | 'easy' | 'perfect') => {
    if (!displayFiches[trainerIndex]) return;
    const item = displayFiches[trainerIndex];
    scheduleReview('fiche', item.id, item.title, item.specialtyName, quality);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner Apple Glassmorphism */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Fiches de Révision Flash Express • Rappels de Garde</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
            {activeSpecialty ? (
              <span className="flex items-center gap-2">
                <span>{getSpecialtyEmoji(activeSpecialty.id)}</span>
                <span>Fiches Flash en {activeSpecialty.name}</span>
              </span>
            ) : (
              'Fiches de Révision Flash par Spécialité'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 dark:text-navy-300 leading-relaxed">
            {activeSpecialty
              ? `Consultez les résumés réflexes et scores mémorisables en 5 minutes pour cette spécialité.`
              : `Sélectionnez une spécialité ci-dessous pour afficher ses fiches flash mémotechniques.`}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {selectedSpecId && (
            <button
              onClick={() => setSelectedSpecId('')}
              className="apple-pill px-4 py-2.5 text-xs font-bold text-navy-700 dark:text-navy-200 hover:text-brand-600 flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Toutes les spécialités</span>
            </button>
          )}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un score, fiche..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/60 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Top Horizontal Pills & Active Recall Studio Launcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {selectedSpecId ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedSpecId('')}
              className="apple-pill px-3.5 py-1.5 rounded-full text-xs font-bold text-navy-600 dark:text-navy-300 shrink-0"
            >
              ← Vue Grille
            </button>
            {activeSpecialtiesWithFiches.map(s => {
              const isSelected = selectedSpecId === s.id;
              const count = allFiches.filter(f => matchesFicheSpec(f, s.id, s.name)).length;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSpecId(s.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                    isSelected
                      ? 'apple-badge-purple'
                      : 'apple-pill text-navy-600 dark:text-navy-300 hover:border-amber-300'
                  }`}
                >
                  <span>{getSpecialtyEmoji(s.id)}</span>
                  <span>{s.shortName}</span>
                  <span className="text-[10px] opacity-75 font-semibold">({count})</span>
                </button>
              );
            })}

          </div>
        ) : <div />}

        <button
          onClick={() => {
            setTrainerIndex(0);
            setIsFlipped(false);
            setTrainerOpen(true);
          }}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white text-xs font-bold shadow-md hover:scale-102 transition-all flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Session Active Recall (Flashcards 3D)</span>
        </button>
      </div>

      {/* 3. FLASHCARDS ACTIVE RECALL TRAINER MODAL */}
      {trainerOpen && displayFiches.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-navy-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center text-base">
                  ⚡
                </span>
                <div>
                  <h3 className="text-sm font-black text-navy-950 dark:text-white">
                    Mode Entraînement Active Recall
                  </h3>
                  <p className="text-[11px] text-navy-400">
                    Carte {trainerIndex + 1} sur {displayFiches.length} • {displayFiches[trainerIndex].specialtyName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTrainerOpen(false)}
                className="p-1.5 rounded-xl bg-navy-100 dark:bg-navy-800 text-navy-500 hover:text-navy-900 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 3D Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer min-h-[260px] p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-amber-50/40 dark:from-navy-850 dark:to-navy-800 border-2 border-amber-200/80 dark:border-amber-900/50 shadow-inner flex flex-col justify-between transition-all duration-300 hover:border-amber-400 relative group overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs text-navy-400">
                <span className="font-bold text-amber-600 uppercase tracking-wider text-[10px]">
                  {isFlipped ? '📖 Réponse & Détails Cliniques' : '❓ Recto - Test de Mémoire'}
                </span>
                <span className="text-[11px] font-semibold text-brand-600 group-hover:underline flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isFlipped ? 'Cliquer pour retourner (Recto)' : 'Cliquer pour révéler (Verso)'}</span>
                </span>
              </div>

              <div className="py-4 my-auto">
                {!isFlipped ? (
                  <div className="space-y-3 text-center">
                    <span className="text-3xl block">
                      {getSpecialtyEmoji(displayFiches[trainerIndex].specialtyId)}
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-navy-950 dark:text-white">
                      {displayFiches[trainerIndex].title}
                    </h4>
                    <p className="text-xs text-navy-500 max-w-sm mx-auto">
                      Restituez mentalement les points clés et conduites à tenir avant de retourner la carte.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-navy-900 border border-amber-200 dark:border-amber-800 text-xs space-y-1.5">
                      <span className="font-bold text-amber-700 dark:text-amber-300 block uppercase text-[10px]">
                        ⚡ Points Clés Mémorisables :
                      </span>
                      {displayFiches[trainerIndex].keyTakeaways.map((point: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5 text-navy-800 dark:text-navy-200">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center text-[10px] text-navy-400">
                💡 Astuce : Évaluez honnêtement votre niveau d'assimilation ci-dessous
              </div>
            </div>

            {/* SRS Rating Buttons (Ebbinghaus Forgetting Curve) */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block text-center">
                Prochaine révision Ebbinghaus :
              </span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    handleRateCard('hard');
                    if (trainerIndex < displayFiches.length - 1) {
                      setTrainerIndex(trainerIndex + 1);
                      setIsFlipped(false);
                    } else setTrainerOpen(false);
                  }}
                  className="py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 hover:bg-rose-500 hover:text-white transition-all text-center space-y-0.5"
                >
                  <div className="text-xs font-black">🔴 À revoir</div>
                  <div className="text-[9px] opacity-80">J+1</div>
                </button>

                <button
                  onClick={() => {
                    handleRateCard('medium');
                    if (trainerIndex < displayFiches.length - 1) {
                      setTrainerIndex(trainerIndex + 1);
                      setIsFlipped(false);
                    } else setTrainerOpen(false);
                  }}
                  className="py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 hover:bg-amber-500 hover:text-white transition-all text-center space-y-0.5"
                >
                  <div className="text-xs font-black">🟡 Moyen</div>
                  <div className="text-[9px] opacity-80">J+3</div>
                </button>

                <button
                  onClick={() => {
                    handleRateCard('easy');
                    if (trainerIndex < displayFiches.length - 1) {
                      setTrainerIndex(trainerIndex + 1);
                      setIsFlipped(false);
                    } else setTrainerOpen(false);
                  }}
                  className="py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white transition-all text-center space-y-0.5"
                >
                  <div className="text-xs font-black">🟢 Facile</div>
                  <div className="text-[9px] opacity-80">J+7</div>
                </button>

                <button
                  onClick={() => {
                    handleRateCard('perfect');
                    if (trainerIndex < displayFiches.length - 1) {
                      setTrainerIndex(trainerIndex + 1);
                      setIsFlipped(false);
                    } else setTrainerOpen(false);
                  }}
                  className="py-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-300 hover:bg-brand-600 hover:text-white transition-all text-center space-y-0.5"
                >
                  <div className="text-xs font-black">🔵 Parfait</div>
                  <div className="text-[9px] opacity-80">J+30</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. STEP 1: If no specialty selected, display 20 Specialties Apple Grid */}
      {!selectedSpecId ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-navy-950 dark:text-white uppercase tracking-wider text-xs">
              1. Choisissez une Spécialité Médicale :
            </h2>
            <span className="text-xs text-navy-500 font-medium">
              {activeSpecialtiesWithFiches.length} Modules de Révision Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {activeSpecialtiesWithFiches.map((spec) => {
              const count = allFiches.filter(f => matchesFicheSpec(f, spec.id, spec.name)).length;
              const emoji = getSpecialtyEmoji(spec.id);


              return (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpecId(spec.id)}
                  className="apple-card p-5 text-left group hover:scale-102 hover:border-amber-400 transition-all flex flex-col justify-between h-36 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {emoji}
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      count > 0
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'text-navy-400'
                    }`}>
                      {count} fiche{count > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-navy-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                      {spec.name}
                    </div>
                    <div className="text-[10px] text-navy-500 dark:text-navy-400 mt-0.5 flex items-center justify-between">
                      <span>{spec.shortName}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-500" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* 5. STEP 2: When Specialty Selected, display Fiches directly in this same tab! */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-navy-100 dark:border-navy-800">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getSpecialtyEmoji(activeSpecialty?.id || '')}</span>
              <div>
                <h2 className="text-base font-black text-navy-950 dark:text-white">
                  {activeSpecialty?.name}
                </h2>
                <p className="text-xs text-navy-500">
                  {displayFiches.length} fiche{displayFiches.length > 1 ? 's' : ''} mémotechnique{displayFiches.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {displayFiches.length === 0 ? (
            <div className="apple-card p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-3xl">
                ⚡
              </div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white">
                Aucune fiche flash spécifique pour le moment dans cette spécialité
              </h3>
              <p className="text-xs text-navy-600 dark:text-navy-300 max-w-md mx-auto">
                Nos enseignants préparent les fiches synthétiques pour ce module. Découvrez les fiches disponibles en Urgences, Neurologie ou Néphrologie.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setSelectedSpecId('urgences')}
                  className="apple-badge-purple px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Voir Fiches Urgences</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayFiches.map(fiche => (
                <div
                  id={fiche.id}
                  key={fiche.id}
                  className="apple-card p-6 flex flex-col justify-between space-y-4 hover:border-amber-400 group transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                        <span>{getSpecialtyEmoji(fiche.specialtyId)}</span>
                        <span>{fiche.specialtyName}</span>
                      </span>
                      <span className="flex items-center gap-1 text-navy-400 font-medium">
                        <Clock className="w-3.5 h-3.5" /> {fiche.estimatedReadTime}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-navy-950 dark:text-white group-hover:text-amber-600 transition-colors leading-snug">
                      {fiche.title}
                    </h3>

                    <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 text-xs space-y-1.5 text-navy-700 dark:text-navy-300">
                      <span className="font-bold text-amber-900 dark:text-amber-200 block text-[11px] uppercase tracking-wider">
                        ⚡ Points cardinaux :
                      </span>
                      {fiche.keyTakeaways.map((point: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="pt-2 text-xs text-navy-600 dark:text-navy-300 leading-relaxed max-h-48 overflow-hidden relative"
                    dangerouslySetInnerHTML={{ __html: fiche.htmlContent }}
                  />

                  <div className="pt-3 border-t border-navy-100 dark:border-navy-800 flex items-center justify-between gap-2">
                    <Link
                      href={`/fiches/${fiche.id}?fullscreen=true`}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Ouvrir en Mode Plein Écran</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FichesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-navy-400">Chargement des fiches flash...</div>}>
      <FichesHubContent />
    </Suspense>
  );
}

