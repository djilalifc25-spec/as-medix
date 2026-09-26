'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Brain,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Play,
  Zap,
  Layers,
  Search,
  Sparkles
} from 'lucide-react';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { INITIAL_COURSES } from '@/lib/db/seedCourses';
import { INITIAL_QCMS } from '@/lib/db/seedQcm';
import { SPECIALTY_THEMES } from '@/components/context/SpecialtyThemeContext';
import { SpecialtyLogo } from '@/components/brand/SpecialtyLogo';
import { useFaculty } from '@/components/context/FacultyContext';

export interface QcmLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialtyId: string;
}

export function QcmLaunchModal({
  isOpen,
  onClose,
  specialtyId,
}: QcmLaunchModalProps) {
  const router = useRouter();
  const { faculty: selectedFaculty } = useFaculty();

  const [step, setStep] = useState<'mode' | 'courses' | 'sources'>('mode');
  const [selectedMode, setSelectedMode] = useState<'SPECIALTY' | 'COURSE' | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const [allCourses, setAllCourses] = useState(INITIAL_COURSES);
  const [allQcms, setAllQcms] = useState(INITIAL_QCMS);
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [userStats, setUserStats] = useState<{
    doneQcmIds: string[];
    statsBySpecialty: Record<string, { totalQcms: number; doneQcms: number }>;
    statsByCourse: Record<string, { totalQcms: number; doneQcms: number }>;
    statsBySource: Record<string, { totalQcms: number; doneQcms: number }>;
  }>({
    doneQcmIds: [],
    statsBySpecialty: {},
    statsByCourse: {},
    statsBySource: {}
  });

  // Load latest courses, QCMs & user progress stats from DB / API
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/courses')
      .then((r) => r.json())
      .then((d) => {
        if (d.courses && Array.isArray(d.courses)) setAllCourses(d.courses);
      })
      .catch(() => {});

    fetch('/api/qcm')
      .then((r) => r.json())
      .then((d) => {
        if (d.qcms && Array.isArray(d.qcms)) setAllQcms(d.qcms);
      })
      .catch(() => {});

    fetch('/api/qcm/attempt')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setUserStats({
            doneQcmIds: d.doneQcmIds || [],
            statsBySpecialty: d.statsBySpecialty || {},
            statsByCourse: d.statsByCourse || {},
            statsBySource: d.statsBySource || {}
          });
        }
      })
      .catch(() => {});
  }, [isOpen]);

  // Reset state whenever modal opens or closes or specialty changes
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setStep('mode');
      setSelectedMode(null);
      setSelectedCourseId('');
      setSearchQuery('');
    }
  }, [isOpen, specialtyId]);

  // Handle modal lifecycle & body class
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      window.dispatchEvent(new Event('modal-state-change'));
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.dispatchEvent(new Event('modal-state-change'));
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.dispatchEvent(new Event('modal-state-change'));
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeSpec = useMemo(
    () => ALL_SPECIALTIES.find((s) => s.id === specialtyId) || ALL_SPECIALTIES[0],
    [specialtyId]
  );

  const theme = useMemo(
    () =>
      SPECIALTY_THEMES[specialtyId as keyof typeof SPECIALTY_THEMES] ||
      SPECIALTY_THEMES['cardio'],
    [specialtyId]
  );

  // Courses for this specialty
  const specialtyCourses = useMemo(() => {
    return allCourses.filter((c) => c.specialtyId === specialtyId);
  }, [allCourses, specialtyId]);

  // Filtered courses based on search
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return specialtyCourses;
    const q = searchQuery.toLowerCase();
    return specialtyCourses.filter((c) => c.title.toLowerCase().includes(q));
  }, [specialtyCourses, searchQuery]);

  // Fetch sources when course or specialty is chosen
  useEffect(() => {
    if (!isOpen) return;
    const params = new URLSearchParams();
    params.set('specialty', specialtyId);
    if (selectedCourseId) params.set('course', selectedCourseId);
    if (selectedFaculty && selectedFaculty !== 'TOUS') {
      params.set('faculty', selectedFaculty);
    }
    fetch(`/api/admin/sources?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.sources && Array.isArray(d.sources)) {
          setAvailableSources(d.sources);
        }
      })
      .catch(() => {});
  }, [isOpen, specialtyId, selectedCourseId, selectedFaculty]);

  // Count helper
  const countQcms = (courseId?: string, sourceName?: string) => {
    return allQcms.filter((q) => {
      const matchSpec = q.specialtyId === specialtyId;
      const matchCourse = !courseId || q.courseId === courseId;
      const matchSrc =
        !sourceName ||
        sourceName === 'TOUS' ||
        (q.source && q.source.toLowerCase().includes(sourceName.toLowerCase()));
      return matchSpec && matchCourse && matchSrc;
    }).length;
  };

  const totalSpecialtyQcms = useMemo(
    () => countQcms(undefined, 'TOUS'),
    [allQcms, specialtyId]
  );

  const countDoneQcms = (courseId?: string, sourceName?: string) => {
    const doneSet = new Set(userStats.doneQcmIds);
    return allQcms.filter((q) => {
      const matchSpec = q.specialtyId === specialtyId;
      const matchCourse = !courseId || q.courseId === courseId;
      const matchSrc =
        !sourceName ||
        sourceName === 'TOUS' ||
        (q.source && q.source.toLowerCase().includes(sourceName.toLowerCase()));
      return matchSpec && matchCourse && matchSrc && doneSet.has(q.id);
    }).length;
  };

  const doneSpecialtyQcms = useMemo(
    () => countDoneQcms(undefined, 'TOUS'),
    [allQcms, specialtyId, userStats.doneQcmIds]
  );

  const selectedCourse = useMemo(
    () => allCourses.find((c) => c.id === selectedCourseId),
    [allCourses, selectedCourseId]
  );

  const [selectedSources, setSelectedSources] = useState<string[]>(['TOUS']);

  const toggleSourceSelection = (src: string) => {
    if (src === 'TOUS') {
      setSelectedSources(['TOUS']);
      return;
    }
    let updated = selectedSources.filter(s => s !== 'TOUS');
    if (updated.includes(src)) {
      updated = updated.filter(s => s !== src);
    } else {
      updated.push(src);
    }
    if (updated.length === 0) {
      updated = ['TOUS'];
    }
    setSelectedSources(updated);
  };

  // Launch Fullscreen Session
  const launchFullscreen = (customSourceStr?: string) => {
    let sourceToUse = customSourceStr;
    if (!sourceToUse) {
      if (selectedSources.includes('TOUS') || selectedSources.length === 0) {
        sourceToUse = 'TOUS';
      } else {
        sourceToUse = selectedSources.join(',');
      }
    }

    const params = new URLSearchParams({
      specialty: activeSpec.id,
      specialtyName: activeSpec.name,
      source: sourceToUse,
      faculty: selectedFaculty || 'TOUS',
    });

    if (selectedMode === 'COURSE' && selectedCourseId) {
      params.set('course', selectedCourseId);
      params.set(
        'courseName',
        selectedCourse?.title || selectedCourseId
      );
    }

    onClose();
    router.push(`/qcm-session?${params.toString()}`);
  };

  if (!isOpen) return null;

  // Build combined source list
  const baseSources = ['Résidanat', 'Externat', 'Annales', 'FARES'];
  const combinedSources = Array.from(
    new Set([...baseSources, ...availableSources])
  );

  const handleCloseClick = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (isClosing) return;
    setIsClosing(true);

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.dispatchEvent(new Event('modal-state-change'));

    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 100);
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-150 ${
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Backdrop with direct click-to-close */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200 cursor-pointer"
        onClick={handleCloseClick}
      />

      {/* Modal Dialog (Responsive, smooth touch scrolling) */}
      <div
        className="relative w-full sm:max-w-xl h-[90dvh] max-h-[90dvh] sm:h-auto sm:max-h-[85vh] rounded-t-[32px] sm:rounded-3xl bg-slate-900/98 dark:bg-[#080d19]/98 border border-white/20 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] flex flex-col text-white backdrop-blur-3xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-250 z-10 select-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe / Drag Handle Indicator */}
        <div
          className="pt-2.5 pb-1 sm:hidden flex justify-center cursor-pointer shrink-0"
          onClick={handleCloseClick}
        >
          <div className="w-12 h-1.5 rounded-full bg-white/30 hover:bg-white/50 active:bg-white/60 transition-colors" />
        </div>

        {/* Top colored specialty accent line */}
        <div
          className="h-1.5 w-full shrink-0 transition-all duration-500"
          style={{
            background: `linear-gradient(90deg, ${theme.color}, ${theme.secondaryColor})`,
          }}
        />

        {/* Sticky Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 bg-slate-900/95 dark:bg-[#080d19]/95 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3 min-w-0">
            {step !== 'mode' ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 'sources') {
                    setStep(selectedMode === 'COURSE' ? 'courses' : 'mode');
                  } else if (step === 'courses') {
                    setStep('mode');
                  }
                }}
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center transition-all shrink-0 cursor-pointer"
                title="Retour"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            ) : (
              <div className="shrink-0">
                <SpecialtyLogo specialtyId={activeSpec.id} size="sm" withGlow={true} />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                  style={{
                    color: theme.color,
                    borderColor: `${theme.color}40`,
                    backgroundColor: `${theme.color}15`,
                  }}
                >
                  Banque QCM
                </span>
                <span className="text-[10px] text-white/50 hidden sm:inline">
                  Plein Écran
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight truncate mt-0.5">
                {activeSpec.name}
              </h2>
            </div>
          </div>

          {/* Prominent High-Contrast Close Button */}
          <button
            type="button"
            onClick={handleCloseClick}
            className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-rose-500/30 hover:border-rose-500/50 border border-white/15 active:scale-90 flex items-center justify-center transition-all text-white hover:text-rose-200 shrink-0 cursor-pointer shadow-sm"
            aria-label="Fermer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body - Smooth Single-Level Scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain touch-pan-y scrollbar-thin space-y-4 flex-1 pb-16 sm:pb-8">
          {/* STEP 1: CHOOSE MODE ("Par spécialité totale" OU "Par cours") */}
          {step === 'mode' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-left space-y-1">
                <h3 className="text-sm sm:text-base font-black text-white">
                  Choisissez votre mode d'entraînement
                </h3>
                <p className="text-xs text-white/60">
                  Voulez-vous réviser l'ensemble du module ou vous concentrer sur un cours précis ?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* OPTION A: Par Spécialité Totale */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMode('SPECIALTY');
                    setSelectedCourseId('');
                    setStep('sources');
                  }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 hover:border-white/35 hover:from-white/15 hover:to-white/10 transition-all text-left flex flex-col justify-between gap-4 group active:scale-[0.98] shadow-lg shadow-black/20 cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-md"
                      style={{
                        backgroundColor: `${theme.color}25`,
                        color: theme.color,
                      }}
                    >
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className="text-xs font-mono font-black px-2.5 py-1 rounded-xl border shadow-xs"
                        style={{
                          color: theme.color,
                          borderColor: `${theme.color}40`,
                          backgroundColor: `${theme.color}15`,
                        }}
                      >
                        {totalSpecialtyQcms} QCMs
                      </span>
                      {doneSpecialtyQcms > 0 && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          ✓ {doneSpecialtyQcms} fait{doneSpecialtyQcms > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm sm:text-base font-black text-white group-hover:text-white transition-colors flex items-center justify-between">
                      <span>Toute la Spécialité</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      Session transversale regroupant l'intégralité des cours de {activeSpec.name}.
                    </p>
                  </div>
                </button>

                {/* OPTION B: Par Cours */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMode('COURSE');
                    setStep('courses');
                  }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 hover:border-white/35 hover:from-white/15 hover:to-white/10 transition-all text-left flex flex-col justify-between gap-4 group active:scale-[0.98] shadow-lg shadow-black/20 cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110 shadow-md">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-black px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
                      {specialtyCourses.length} Cours
                    </span>
                  </div>

                  <div>
                    <div className="text-sm sm:text-base font-black text-white group-hover:text-white transition-colors flex items-center justify-between">
                      <span>Par Cours Spécifique</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      Ciblez un chapitre précis pour approfondir une pathologie ou un thème d'examen.
                    </p>
                  </div>
                </button>
              </div>

              {/* Close Helper Button */}
              <div className="pt-3 flex justify-center sm:hidden">
                <button
                  type="button"
                  onClick={handleCloseClick}
                  className="text-xs text-white/50 hover:text-white py-2 px-4 rounded-xl bg-white/5 border border-white/10"
                >
                  Fermer la fenêtre
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: COURSE SELECTION (Quand l'utilisateur choisit Par Cours) */}
          {step === 'courses' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-white">
                    Sélectionnez un cours de {activeSpec.name}
                  </h3>
                  <p className="text-[11px] text-white/60">
                    {specialtyCourses.length} cours disponibles au programme
                  </p>
                </div>
              </div>

              {/* Sticky Search Bar */}
              {specialtyCourses.length > 3 && (
                <div className="relative sticky top-0 z-10 bg-slate-900/90 dark:bg-[#080d19]/90 backdrop-blur-md pt-1 pb-2">
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrer les cours..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </div>
              )}

              {/* Course list (No nested scroll - flows directly inside the main modal scroll container) */}
              <div className="space-y-2.5">
                {filteredCourses.length === 0 ? (
                  <div className="p-8 text-center text-xs text-white/50 bg-white/5 rounded-2xl border border-white/10">
                    Aucun cours trouvé pour cette recherche.
                  </div>
                ) : (
                  filteredCourses.map((c) => {
                    const qCount = countQcms(c.id, 'TOUS');
                    const doneCount = countDoneQcms(c.id, 'TOUS');
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCourseId(c.id);
                          setStep('sources');
                        }}
                        className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 active:bg-white/15 transition-all text-left flex items-center justify-between gap-3 group active:scale-[0.99] cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/70 group-hover:text-white shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs sm:text-sm font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                              {c.title}
                            </div>
                            <div className="text-[10px] text-white/50 truncate mt-0.5">
                              {c.rang ? `${c.rang} • ` : ''}{qCount} QCMs disponibles
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-white/10 text-white/80">
                            {qCount} QCM
                          </span>
                          {doneCount > 0 ? (
                            <span className="text-[10px] font-bold text-emerald-400">
                              ✓ {doneCount}/{qCount} fait{doneCount > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-[10px] text-white/30">
                              Non fait
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* STEP 3: SOURCE SELECTION & MULTI-SOURCE LAUNCH */}
          {step === 'sources' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Context banner */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-white/50 block">
                    {selectedMode === 'COURSE' ? 'Cours ciblé' : 'Totalité du Module'}
                  </span>
                  <div className="text-xs font-bold text-white truncate mt-0.5">
                    {selectedMode === 'COURSE'
                      ? selectedCourse?.title || selectedCourseId
                      : `Tous les cours de ${activeSpec.name}`}
                  </div>
                </div>

                <div
                  className="px-2.5 py-1 rounded-xl text-xs font-mono font-black shrink-0 border"
                  style={{
                    color: theme.color,
                    borderColor: `${theme.color}40`,
                    backgroundColor: `${theme.color}15`,
                  }}
                >
                  {countQcms(selectedCourseId, 'TOUS')} QCMs
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-white flex items-center justify-between">
                  <span>Choisissez vos sources (Multi-Sélection)</span>
                  <span className="text-[10px] font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-500/30">
                    Cochez 1 ou plusieurs
                  </span>
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  Combinez plusieurs sources pour personnaliser votre épreuve QCM.
                </p>
              </div>

              {/* Multi-source toggle options */}
              <div className="space-y-2">
                {/* TOUS / All sources pill */}
                <button
                  type="button"
                  onClick={() => toggleSourceSelection('TOUS')}
                  className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                    selectedSources.includes('TOUS')
                      ? 'bg-sky-500/25 border-sky-400 text-white shadow-md'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs font-bold ${
                      selectedSources.includes('TOUS') ? 'bg-sky-500 border-sky-400 text-white' : 'border-white/30 bg-white/5'
                    }`}>
                      {selectedSources.includes('TOUS') && '✓'}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Toutes les sources (Combinées)</span>
                      <span className="text-[10px] text-white/50">{countQcms(selectedCourseId, 'TOUS')} questions disponibles</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-sky-500/30 text-sky-300">
                    {countQcms(selectedCourseId, 'TOUS')} QCMs
                  </span>
                </button>

                {/* Individual combined sources */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {combinedSources.map((src) => {
                    const qCount = countQcms(selectedCourseId, src);
                    const doneCount = countDoneQcms(selectedCourseId, src);
                    const isSelected = selectedSources.includes(src);

                    return (
                      <button
                        key={src}
                        type="button"
                        onClick={() => toggleSourceSelection(src)}
                        className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/30 border-blue-400 text-white shadow-sm'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isSelected ? 'bg-blue-500 border-blue-400 text-white' : 'border-white/30 bg-white/5'
                          }`}>
                            {isSelected && '✓'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold truncate block">{src}</span>
                            <span className="text-[10px] text-white/50">
                              {qCount} QCMs {doneCount > 0 ? `• ${doneCount} fait` : ''}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            launchFullscreen(src);
                          }}
                          title={`Lancer uniquement ${src}`}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white shrink-0"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Launch button for selected sources */}
              <button
                type="button"
                onClick={() => launchFullscreen()}
                className="w-full py-4 rounded-2xl text-xs sm:text-sm font-black text-white shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer mt-3"
                style={{
                  background: `linear-gradient(135deg, ${theme.color}, ${theme.secondaryColor})`,
                }}
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  Lancer la session (
                  {selectedSources.includes('TOUS')
                    ? 'Toutes les sources'
                    : `${selectedSources.length} source${selectedSources.length > 1 ? 's' : ''} sélectionnée${selectedSources.length > 1 ? 's' : ''}`}
                  )
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
