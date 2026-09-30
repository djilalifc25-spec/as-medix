'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { INITIAL_QCMS } from '@/lib/db/seedQcm';
import { INITIAL_COURSES } from '@/lib/db/seedCourses';
import { SpecialtyLogo } from '@/components/brand/SpecialtyLogo';
import { useFaculty } from '@/components/context/FacultyContext';
import { useToast } from '@/components/context/ToastContext';
import { useSpecialtyTheme } from '@/components/context/SpecialtyThemeContext';
import { matchQcmToSource } from '@/lib/sourceUtils';
import { MedicalYear, Specialty, QCM, Course } from '@/types';
import {
  Brain, Play, CheckCircle2, XCircle, RotateCcw, Award, ChevronRight, AlertTriangle,
  BookOpen, Sparkles, Clock, AlertCircle, HelpCircle, GraduationCap, Filter, Eye, EyeOff,
  Search, Layers, Flame, Check, ArrowRight, ExternalLink, RefreshCw, X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const MEDICAL_YEARS: { id: MedicalYear; label: string; badge: string; desc: string }[] = [
  { id: 1, label: '1ère Année', badge: 'PCEM1', desc: 'Sciences fondamentales' },
  { id: 2, label: '2ème Année', badge: 'PCEM2', desc: 'Physiologie & Morphologie' },
  { id: 3, label: '3ème Année', badge: 'DCEM1', desc: 'Sémiologie & Pathologie' },
  { id: 4, label: '4ème Année', badge: 'DCEM2', desc: 'Pathologie Médicale I' },
  { id: 5, label: '5ème Année', badge: 'DCEM3', desc: 'Pathologie Médicale II' },
  { id: 6, label: '6ème Année', badge: 'DCEM4', desc: 'Pédiatrie, Gynéco & Stages' },
];

function QcmHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSpec = searchParams.get('specialty') || 'cardio';
  const initialCourse = searchParams.get('course') || '';
  const initialSource = searchParams.get('source') || 'TOUS';
  const initialYearParam = searchParams.get('year');
  const initialYear = initialYearParam ? (parseInt(initialYearParam, 10) as MedicalYear) : null;

  const { faculty: selectedFaculty, setFaculty: setSelectedFaculty } = useFaculty();
  const { setActiveSpecialtyId } = useSpecialtyTheme();
  const { showEmptySourceToast } = useToast();

  // Primary filter state
  const [selectedYear, setSelectedYear] = useState<MedicalYear | 'TOUS'>(
    initialYear && initialYear >= 1 && initialYear <= 6 ? initialYear : 'TOUS'
  );
  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>(ALL_SPECIALTIES);
  const [selectedSpecId, setSelectedSpecId] = useState<string>(initialSpec);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourse);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Source selection state: "SYSTEM" (All sources of current scope) or "CUSTOM" (Multi-select filter)
  const [sourceFilterMode, setSourceFilterMode] = useState<'SYSTEM' | 'CUSTOM'>('SYSTEM');
  const [selectedSources, setSelectedSources] = useState<string[]>(
    initialSource && initialSource !== 'TOUS' ? initialSource.split(',') : ['TOUS']
  );
  const [availableSources, setAvailableSources] = useState<string[]>([]);

  // Hyper Probable Résidanat filter toggle
  const [onlyHyperProbable, setOnlyHyperProbable] = useState<boolean>(false);

  // Status progression filter
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNSOLVED' | 'CORRECT' | 'WRONG'>('ALL');

  // View presentation mode: "LIST" (direct cards feed) or "EXAM" (focused single question training)
  const [viewMode, setViewMode] = useState<'LIST' | 'EXAM'>('LIST');
  const [sortBy, setSortBy] = useState<'DEFAULT' | 'HYPER_FIRST' | 'YEAR_DESC'>('HYPER_FIRST');

  // Pagination for list mode
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Answers & interaction states
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [userSelections, setUserSelections] = useState<Record<string, number[]>>({});
  const [validatedQcms, setValidatedQcms] = useState<Record<string, boolean>>({});

  // Dynamic datasets
  const [allQcms, setAllQcms] = useState<QCM[]>(INITIAL_QCMS);
  const [allCourses, setAllCourses] = useState<Course[]>(INITIAL_COURSES);
  const [userStats, setUserStats] = useState<{
    doneQcmIds: string[];
    correctQcmIds: string[];
    wrongQcmIds: string[];
    statsBySpecialty: Record<string, { totalQcms: number; doneQcms: number }>;
    statsByCourse: Record<string, { totalQcms: number; doneQcms: number }>;
    statsBySource: Record<string, { totalQcms: number; doneQcms: number }>;
  }>({
    doneQcmIds: [],
    correctQcmIds: [],
    wrongQcmIds: [],
    statsBySpecialty: {},
    statsByCourse: {},
    statsBySource: {}
  });

  // Focused 1-by-1 quiz state (Exam mode)
  const [activeExamIndex, setActiveExamIndex] = useState<number>(0);
  const [examSelectedAnswers, setExamSelectedAnswers] = useState<number[]>([]);
  const [examHasValidated, setExamHasValidated] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number>(0);
  const [examCompleted, setExamCompleted] = useState<boolean>(false);

  // Sync theme
  useEffect(() => {
    if (selectedSpecId) {
      setActiveSpecialtyId(selectedSpecId);
    }
  }, [selectedSpecId, setActiveSpecialtyId]);

  // Fetch initial specialties
  useEffect(() => {
    fetch('/api/specialties')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.specialties) && d.specialties.length > 0) {
          setSpecialtiesList(d.specialties);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch QCMs, Courses and attempts
  const fetchData = async () => {
    try {
      const [qcmRes, crsRes, attRes] = await Promise.all([
        fetch('/api/qcm').then(r => r.json()),
        fetch('/api/courses').then(r => r.json()),
        fetch('/api/qcm/attempt').then(r => r.json())
      ]);

      if (qcmRes.qcms && Array.isArray(qcmRes.qcms)) {
        setAllQcms(qcmRes.qcms);
      }
      if (crsRes.courses && Array.isArray(crsRes.courses)) {
        setAllCourses(crsRes.courses);
      }
      if (attRes.success) {
        setUserStats({
          doneQcmIds: attRes.doneQcmIds || [],
          correctQcmIds: attRes.correctQcmIds || [],
          wrongQcmIds: attRes.wrongQcmIds || [],
          statsBySpecialty: attRes.statsBySpecialty || {},
          statsByCourse: attRes.statsByCourse || {},
          statsBySource: attRes.statsBySource || {}
        });
      }
    } catch (_err) {}
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('asmedix-content-updated', fetchData);
    return () => {
      window.removeEventListener('asmedix-content-updated', fetchData);
    };
  }, []);

  // Load available sources whenever module, course or faculty changes
  useEffect(() => {
    const loadSources = () => {
      const params = new URLSearchParams();
      if (selectedSpecId) params.set('specialty', selectedSpecId);
      if (selectedCourseId) params.set('course', selectedCourseId);
      if (selectedFaculty && selectedFaculty !== 'TOUS') params.set('faculty', selectedFaculty);
      fetch(`/api/admin/sources?${params}`)
        .then(r => r.json())
        .then(d => {
          if (d.sources && Array.isArray(d.sources)) {
            setAvailableSources(d.sources);
          }
        })
        .catch(() => {});
    };

    loadSources();
  }, [selectedSpecId, selectedCourseId, selectedFaculty]);

  // Synchronize when URL searchParams change
  useEffect(() => {
    const spec = searchParams.get('specialty');
    const crs = searchParams.get('course');
    const src = searchParams.get('source');
    const hyper = searchParams.get('hyper');

    if (spec) setSelectedSpecId(spec);
    if (crs) setSelectedCourseId(crs);
    if (src !== null) {
      if (src === 'TOUS' || !src) {
        setSelectedSources(['TOUS']);
        setSourceFilterMode('SYSTEM');
      } else {
        setSelectedSources(src.split(','));
        setSourceFilterMode('CUSTOM');
      }
    }
    if (hyper === 'true') {
      setOnlyHyperProbable(true);
    }
    setCurrentPage(1);
    setActiveExamIndex(0);
  }, [searchParams]);

  // Courses belonging to the selected specialty
  const specialtyCourses = useMemo(() => {
    return allCourses.filter(c => {
      const matchSpec = c.specialtyId === selectedSpecId;
      const matchFac = selectedFaculty === 'TOUS' || !c.faculty || c.faculty === 'TOUS' || c.faculty === selectedFaculty;
      return matchSpec && matchFac;
    });
  }, [allCourses, selectedSpecId, selectedFaculty]);

  // Current active specialty object
  const activeSpecialty = useMemo(() => {
    return specialtiesList.find(s => s.id === selectedSpecId) ||
      ALL_SPECIALTIES.find(s => s.id === selectedSpecId) ||
      ALL_SPECIALTIES[0];
  }, [specialtiesList, selectedSpecId]);

  // Filter specialties by study year
  const filteredSpecialties = useMemo(() => {
    return specialtiesList.filter(s => {
      const matchesYear = selectedYear === 'TOUS' || s.year === selectedYear;
      const matchesFac = selectedFaculty === 'TOUS' || !s.faculty || s.faculty === 'TOUS' || s.faculty === selectedFaculty;
      return matchesYear && matchesFac;
    });
  }, [specialtiesList, selectedYear, selectedFaculty]);

  // Toggle custom source selection in sidebar
  const toggleSourceSelection = (srcName: string) => {
    if (sourceFilterMode !== 'CUSTOM') {
      setSourceFilterMode('CUSTOM');
    }

    if (srcName === 'TOUS') {
      setSelectedSources(['TOUS']);
      setSourceFilterMode('SYSTEM');
      setCurrentPage(1);
      return;
    }

    let updated = selectedSources.filter(s => s !== 'TOUS');
    if (updated.includes(srcName)) {
      updated = updated.filter(s => s !== srcName);
    } else {
      updated.push(srcName);
    }

    if (updated.length === 0) {
      updated = ['TOUS'];
      setSourceFilterMode('SYSTEM');
    }
    setSelectedSources(updated);
    setCurrentPage(1);
  };

  // Main Filtering Engine: computes matching QCMs instantly
  const filteredQcms = useMemo(() => {
    let result = allQcms.filter(q => {
      if (!q) return false;

      // 1. Specialty / Module Match
      const qSpec = (q.specialtyId || '').toLowerCase();
      if (qSpec !== selectedSpecId.toLowerCase()) return false;

      // 2. Course Match (if a specific course is chosen)
      if (selectedCourseId && selectedCourseId !== 'TOUS') {
        const crs = allCourses.find(c => c.id === selectedCourseId);
        const qC = (q.courseId || '').toLowerCase();
        const qT = (q.courseTitle || '').toLowerCase();
        const target = selectedCourseId.toLowerCase();
        const matchesCourse = qC === target || qT === target || Boolean(crs && (
          qC === crs.id.toLowerCase() ||
          (crs.slug && qC === crs.slug.toLowerCase()) ||
          (crs.title && qT === crs.title.toLowerCase())
        ));
        if (!matchesCourse) return false;
      }

      // 3. Faculty Match
      if (selectedFaculty !== 'TOUS') {
        const qFac = (q.faculty || 'TOUS').toUpperCase();
        if (qFac !== 'TOUS' && qFac !== selectedFaculty.toUpperCase()) return false;
      }

      // 4. Source Match (Multi-sources or System Actuel)
      if (sourceFilterMode === 'CUSTOM' && !selectedSources.includes('TOUS')) {
        const matchesAnySource = selectedSources.some(src => matchQcmToSource(q, src));
        if (!matchesAnySource) return false;
      }

      // 5. Hyper Probable Résidanat Match
      if (onlyHyperProbable && !q.isHyperProbable) {
        return false;
      }

      // 6. User Progression / Status Match
      if (statusFilter === 'UNSOLVED' && userStats.doneQcmIds.includes(q.id)) {
        return false;
      }
      if (statusFilter === 'CORRECT' && !userStats.correctQcmIds.includes(q.id)) {
        return false;
      }
      if (statusFilter === 'WRONG' && !userStats.wrongQcmIds.includes(q.id)) {
        return false;
      }

      // 7. Search keyword match
      if (searchQuery.trim()) {
        const qTerm = searchQuery.toLowerCase().trim();
        const qText = `${q.question || ''} ${q.title || ''} ${q.vignette || ''} ${q.source || ''} ${q.courseTitle || ''}`.toLowerCase();
        if (!qText.includes(qTerm)) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'HYPER_FIRST') {
      result.sort((a, b) => {
        if (Boolean(a.isHyperProbable) === Boolean(b.isHyperProbable)) return 0;
        return a.isHyperProbable ? -1 : 1;
      });
    } else if (sortBy === 'YEAR_DESC') {
      result.sort((a, b) => {
        const yA = Number(a.year) || 0;
        const yB = Number(b.year) || 0;
        return yB - yA;
      });
    }

    return result;
  }, [
    allQcms, selectedSpecId, selectedCourseId, selectedFaculty,
    sourceFilterMode, selectedSources, onlyHyperProbable,
    statusFilter, searchQuery, sortBy, allCourses, userStats
  ]);

  // Paginated QCMs
  const totalPages = Math.ceil(filteredQcms.length / itemsPerPage) || 1;
  const paginatedQcms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQcms.slice(start, start + itemsPerPage);
  }, [filteredQcms, currentPage, itemsPerPage]);

  // Count Hyper Probables in current scope
  const hyperProbableCount = useMemo(() => {
    return allQcms.filter(q => {
      const matchSpec = (q.specialtyId || '').toLowerCase() === selectedSpecId.toLowerCase();
      let matchCrs = true;
      if (selectedCourseId) {
        matchCrs = (q.courseId || '').toLowerCase() === selectedCourseId.toLowerCase() ||
          (q.courseTitle || '').toLowerCase() === selectedCourseId.toLowerCase();
      }
      return matchSpec && matchCrs && q.isHyperProbable;
    }).length;
  }, [allQcms, selectedSpecId, selectedCourseId]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCourseId('');
    setSourceFilterMode('SYSTEM');
    setSelectedSources(['TOUS']);
    setOnlyHyperProbable(false);
    setStatusFilter('ALL');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Launch Fullscreen Exam Session
  const launchSession = () => {
    const spec = activeSpecialty;
    const crs = allCourses.find(c => c.id === selectedCourseId);

    const srcStr = sourceFilterMode === 'CUSTOM' && !selectedSources.includes('TOUS')
      ? selectedSources.join(',')
      : 'TOUS';

    if (filteredQcms.length === 0) {
      showEmptySourceToast(srcStr, crs?.title || spec?.name);
      return;
    }

    const params = new URLSearchParams({
      specialty: selectedSpecId,
      course: selectedCourseId,
      source: srcStr,
      faculty: selectedFaculty,
      specialtyName: spec?.name || selectedSpecId,
      courseName: crs?.title || selectedCourseId,
      ...(onlyHyperProbable ? { hyper: 'true' } : {})
    });
    router.push(`/qcm-session?${params.toString()}`);
  };

  // Handle single QCM option click (Interactive directly in card)
  const handleCardOptionClick = (qcm: QCM, optionIdx: number) => {
    const current = userSelections[qcm.id] || [];
    let updated: number[];
    if (qcm.type === 'SINGLE') {
      updated = [optionIdx];
    } else {
      updated = current.includes(optionIdx)
        ? current.filter(i => i !== optionIdx)
        : [...current, optionIdx];
    }
    setUserSelections(prev => ({ ...prev, [qcm.id]: updated }));
  };

  // Handle Validate in Card
  const handleValidateCard = (qcm: QCM) => {
    const selected = userSelections[qcm.id] || [];
    if (selected.length === 0) return;

    const isCorrect =
      Array.isArray(qcm.correctAnswers) &&
      selected.length === qcm.correctAnswers.length &&
      selected.every(ans => qcm.correctAnswers.includes(ans));

    setValidatedQcms(prev => ({ ...prev, [qcm.id]: true }));
    setRevealedAnswers(prev => ({ ...prev, [qcm.id]: true }));

    if (isCorrect) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    }

    // Save attempt to API
    fetch('/api/qcm/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qcmId: qcm.id,
        userAnswers: selected,
        isCorrect,
        scorePercentage: isCorrect ? 100 : 0,
        timeSpentSeconds: 30
      })
    })
      .then(r => r.json())
      .then(d => {
        if (d.stats) {
          setUserStats(prev => ({
            ...prev,
            doneQcmIds: Array.from(new Set([...prev.doneQcmIds, qcm.id])),
            correctQcmIds: isCorrect ? Array.from(new Set([...prev.correctQcmIds, qcm.id])) : prev.correctQcmIds,
            wrongQcmIds: !isCorrect ? Array.from(new Set([...prev.wrongQcmIds, qcm.id])) : prev.wrongQcmIds,
          }));
        }
      })
      .catch(() => {});
  };

  // Exam 1-by-1 Mode controls
  const activeExamQcm = filteredQcms[activeExamIndex] || filteredQcms[0];

  const handleExamValidate = () => {
    if (examSelectedAnswers.length === 0 || !activeExamQcm) return;
    setExamHasValidated(true);

    const isCorrect =
      Array.isArray(activeExamQcm.correctAnswers) &&
      examSelectedAnswers.length === activeExamQcm.correctAnswers.length &&
      examSelectedAnswers.every(ans => activeExamQcm.correctAnswers.includes(ans));

    if (isCorrect) {
      setExamScore(prev => prev + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }

    fetch('/api/qcm/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qcmId: activeExamQcm.id,
        userAnswers: examSelectedAnswers,
        isCorrect,
        scorePercentage: isCorrect ? 100 : 0,
        timeSpentSeconds: 30
      })
    }).catch(() => {});
  };

  const handleExamNext = () => {
    if (activeExamIndex < filteredQcms.length - 1) {
      setActiveExamIndex(prev => prev + 1);
      setExamSelectedAnswers([]);
      setExamHasValidated(false);
    } else {
      setExamCompleted(true);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. HERO BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 text-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
              <Brain className="w-3.5 h-3.5" />
              <span>Plateforme Nationale de Révision Médicale</span>
            </div>

            {/* Faculty Switcher */}
            <div className="inline-flex items-center p-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              <button
                onClick={() => setSelectedFaculty('TOUS')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedFaculty === 'TOUS' ? 'bg-white text-brand-800 shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                Toutes Facultés
              </button>
              <button
                onClick={() => setSelectedFaculty('ORAN')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedFaculty === 'ORAN' ? 'bg-amber-400 text-navy-950 font-black shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                🏛️ Oran
              </button>
              <button
                onClick={() => setSelectedFaculty('SIDI_BEL_ABBES')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedFaculty === 'SIDI_BEL_ABBES' ? 'bg-white text-indigo-900 font-black shadow-sm' : 'text-white/80 hover:text-white'
                }`}
              >
                🏛️ SBA
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Banque QCM Clinique & Filtre par Source
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
            Sélectionnez votre module et vos sources dans la barre latérale. Toutes les questions correspondantes apparaissent instantanément avec leur source et leurs explications détaillées.
          </p>
        </div>

        {/* Global CTA & Progress Quick Summary */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
          <button
            type="button"
            onClick={launchSession}
            disabled={filteredQcms.length === 0}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-brand-50 text-brand-700 active:scale-95 text-xs font-black shadow-soft flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-brand-700 text-brand-700" />
            <span>Lancer Session Plein Écran ({filteredQcms.length})</span>
          </button>

          <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center text-xs font-bold text-white flex items-center justify-center gap-2">
            <span>📊</span>
            <span>{userStats.doneQcmIds.length} QCMs résolus sur la plateforme</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT: SIDEBAR FILTER (LEFT) + LIVE QCM FEED (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ========================================================= */}
        {/* LEFT SIDEBAR: ADVANCED PROFESSIONAL FILTERING SYSTEM      */}
        {/* ========================================================= */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-20">
          <div className="apple-card p-5 space-y-5 border-2 border-brand-500/20 shadow-soft">
            
            {/* Sidebar Title & Reset Button */}
            <div className="flex items-center justify-between pb-3 border-b border-navy-100 dark:border-navy-800">
              <div className="flex items-center gap-2 text-navy-950 dark:text-white font-black text-sm">
                <Filter className="w-4 h-4 text-brand-600" />
                <span>Filtres de Sélection</span>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
                title="Réinitialiser tous les filtres"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            </div>

            {/* 1. MODULE / SPECIALTY SELECTOR */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-navy-500 dark:text-navy-400 tracking-wider">
                🩺 Module Médical :
              </label>
              <select
                value={selectedSpecId}
                onChange={e => {
                  setSelectedSpecId(e.target.value);
                  setSelectedCourseId('');
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
              >
                {filteredSpecialties.map(spec => {
                  const count = allQcms.filter(q => q.specialtyId === spec.id).length;
                  return (
                    <option key={spec.id} value={spec.id}>
                      {spec.name} ({count} QCMs)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. MODE: TOUS LES COURS vs COURS SPÉCIFIQUE */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase text-navy-500 dark:text-navy-400 tracking-wider">
                📖 Périmètre du Module :
              </label>

              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-navy-100 dark:bg-navy-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourseId('');
                    setCurrentPage(1);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                    !selectedCourseId
                      ? 'bg-white dark:bg-navy-900 text-brand-700 dark:text-brand-300 shadow-xs font-black'
                      : 'text-navy-600 dark:text-navy-400 hover:text-navy-900'
                  }`}
                >
                  🌐 Tout le module
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (specialtyCourses[0] && !selectedCourseId) {
                      setSelectedCourseId(specialtyCourses[0].id);
                    }
                    setCurrentPage(1);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                    selectedCourseId
                      ? 'bg-white dark:bg-navy-900 text-brand-700 dark:text-brand-300 shadow-xs font-black'
                      : 'text-navy-600 dark:text-navy-400 hover:text-navy-900'
                  }`}
                >
                  📘 Par Cours
                </button>
              </div>

              {/* Course dropdown if "Par Cours" is selected */}
              {selectedCourseId !== '' && (
                <div className="pt-1 animate-in fade-in duration-150">
                  <select
                    value={selectedCourseId}
                    onChange={e => {
                      setSelectedCourseId(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-navy-900 text-navy-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="">Sélectionnez un cours...</option>
                    {specialtyCourses.map(c => {
                      const count = allQcms.filter(q => q.courseId === c.id).length;
                      return (
                        <option key={c.id} value={c.id}>
                          {c.title} ({count} QCM)
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>

            {/* 3. 🔥 HYPER PROBABLE RÉSIDANAT TOGGLE */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-amber-400/60 dark:border-amber-500/40 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔥</span>
                  <div>
                    <div className="text-xs font-black text-amber-950 dark:text-amber-200">
                      Hyper Probables Résidanat
                    </div>
                    <div className="text-[10px] text-amber-800/80 dark:text-amber-300/80">
                      Questions récurrentes & clés concours
                    </div>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={onlyHyperProbable}
                  onChange={e => {
                    setOnlyHyperProbable(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-5 h-5 text-amber-600 rounded cursor-pointer accent-amber-500"
                />
              </label>

              <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 dark:text-amber-300 pt-1 border-t border-amber-300/40">
                <span>Disponibles dans ce périmètre :</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-black">
                  {hyperProbableCount} QCMs
                </span>
              </div>
            </div>

            {/* 4. SOURCES SELECTOR: SYSTEM ACTUEL vs MULTI-SOURCES CUSTOM */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase text-navy-500 dark:text-navy-400 tracking-wider">
                  📚 Sources des Questions :
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (sourceFilterMode === 'SYSTEM') {
                      setSourceFilterMode('CUSTOM');
                      setSelectedSources(availableSources.slice(0, 2));
                    } else {
                      setSourceFilterMode('SYSTEM');
                      setSelectedSources(['TOUS']);
                    }
                    setCurrentPage(1);
                  }}
                  className="text-[10px] font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                >
                  {sourceFilterMode === 'SYSTEM' ? '⚡ Choisir filtres' : '✓ Toutes les sources'}
                </button>
              </div>

              {/* Mode indicator */}
              <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-navy-100 dark:bg-navy-800 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setSourceFilterMode('SYSTEM');
                    setSelectedSources(['TOUS']);
                    setCurrentPage(1);
                  }}
                  className={`py-1 rounded-lg text-center transition-all cursor-pointer ${
                    sourceFilterMode === 'SYSTEM'
                      ? 'bg-white dark:bg-navy-900 text-brand-700 dark:text-brand-300 shadow-xs font-black'
                      : 'text-navy-600 dark:text-navy-400'
                  }`}
                >
                  Système Actuel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSourceFilterMode('CUSTOM');
                    if (selectedSources.includes('TOUS')) {
                      setSelectedSources(availableSources.slice(0, 2));
                    }
                    setCurrentPage(1);
                  }}
                  className={`py-1 rounded-lg text-center transition-all cursor-pointer ${
                    sourceFilterMode === 'CUSTOM'
                      ? 'bg-white dark:bg-navy-900 text-indigo-700 dark:text-indigo-300 shadow-xs font-black'
                      : 'text-navy-600 dark:text-navy-400'
                  }`}
                >
                  Filtre Choisi ({selectedSources.includes('TOUS') ? 'Toutes' : selectedSources.length})
                </button>
              </div>

              {/* Multi-Sources Checklist */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {/* "Toutes les sources" Option */}
                <label className={`flex items-center justify-between p-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  selectedSources.includes('TOUS') || sourceFilterMode === 'SYSTEM'
                    ? 'bg-brand-50/80 dark:bg-brand-950/40 border-brand-500 text-brand-900 dark:text-brand-200'
                    : 'bg-white dark:bg-navy-900 border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:border-brand-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSources.includes('TOUS') || sourceFilterMode === 'SYSTEM'}
                      onChange={() => toggleSourceSelection('TOUS')}
                      className="w-4 h-4 text-brand-600 rounded cursor-pointer"
                    />
                    <span>📋 Toutes les Sources</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 font-mono">
                    {allQcms.filter(q => q.specialtyId === selectedSpecId && (!selectedCourseId || q.courseId === selectedCourseId)).length}
                  </span>
                </label>

                {/* Individual Sources Available */}
                {availableSources.map(src => {
                  const isChecked = sourceFilterMode === 'CUSTOM' && selectedSources.includes(src);
                  const countInScope = allQcms.filter(q => {
                    const matchSpec = q.specialtyId === selectedSpecId;
                    const matchCrs = !selectedCourseId || q.courseId === selectedCourseId;
                    return matchSpec && matchCrs && matchQcmToSource(q, src);
                  }).length;

                  return (
                    <label
                      key={src}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200'
                          : 'bg-white dark:bg-navy-900 border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSourceSelection(src)}
                          className="w-4 h-4 text-indigo-600 rounded cursor-pointer shrink-0"
                        />
                        <span className="truncate" title={src}>📁 {src}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-400 font-mono shrink-0 ml-1">
                        {countInScope}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 5. SEARCH KEYWORD */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-black uppercase text-navy-500 dark:text-navy-400 tracking-wider">
                🔍 Rechercher dans les QCMs :
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="ex: souffle systolique, 2021..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white font-bold placeholder:font-normal focus:ring-2 focus:ring-brand-500"
                />
                <Search className="w-3.5 h-3.5 text-navy-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* 6. STATUS FILTER (Non résolus / Réussis / Erreurs) */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-black uppercase text-navy-500 dark:text-navy-400 tracking-wider">
                🎯 Statut de Progression :
              </label>
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white font-bold cursor-pointer"
              >
                <option value="ALL">Tous les QCMs</option>
                <option value="UNSOLVED">⏳ Non résolus uniquement</option>
                <option value="CORRECT">✓ Réussis</option>
                <option value="WRONG">✕ À réviser (Erreurs)</option>
              </select>
            </div>

            {/* SIDEBAR CTA: LAUNCH SESSION */}
            <div className="pt-2">
              <button
                type="button"
                onClick={launchSession}
                disabled={filteredQcms.length === 0}
                className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-98 text-white text-xs font-black shadow-soft flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Lancer Session Plein Écran ({filteredQcms.length})</span>
              </button>
            </div>

          </div>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT MAIN CONTENT: INSTANT REACTIVE QCM LIST & CARDS     */}
        {/* ========================================================= */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-4">
          
          {/* Top Results Header Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-navy-950 dark:text-white flex items-center gap-1.5">
                  <span>{activeSpecialty.name}</span>
                  {selectedCourseId && (
                    <>
                      <ChevronRight className="w-3 h-3 text-navy-400" />
                      <span className="text-brand-600 dark:text-brand-400">
                        {allCourses.find(c => c.id === selectedCourseId)?.title || selectedCourseId}
                      </span>
                    </>
                  )}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-500/10 text-brand-600 dark:bg-brand-950 dark:text-brand-300 border border-brand-500/20">
                  {filteredQcms.length} QCM(s) trouvé(s)
                </span>

                {onlyHyperProbable && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white flex items-center gap-1 animate-pulse">
                    <span>🔥</span>
                    <span>Hyper Probables Seuls</span>
                  </span>
                )}
              </div>

              {/* Active Filter Chips */}
              <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-navy-500">
                <span className="font-bold">Sources actives :</span>
                {sourceFilterMode === 'SYSTEM' || selectedSources.includes('TOUS') ? (
                  <span className="px-2 py-0.5 rounded-md bg-navy-100 dark:bg-navy-800 font-bold text-navy-700 dark:text-navy-300">
                    Toutes les sources du système
                  </span>
                ) : (
                  selectedSources.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold flex items-center gap-1">
                      <span>📁 {s}</span>
                      <button
                        type="button"
                        onClick={() => toggleSourceSelection(s)}
                        className="hover:text-rose-500 font-black cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* View Mode & Sort Dropdowns */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-800 dark:text-navy-200 cursor-pointer"
              >
                <option value="HYPER_FIRST">🔥 Hyper Probables en premier</option>
                <option value="DEFAULT">Ordre par défaut</option>
                <option value="YEAR_DESC">📅 Par Année Récente</option>
              </select>

              <div className="flex items-center p-1 rounded-xl bg-navy-100 dark:bg-navy-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode('LIST')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'LIST'
                      ? 'bg-white dark:bg-navy-900 text-brand-700 dark:text-brand-300 shadow-xs font-black'
                      : 'text-navy-500'
                  }`}
                  title="Affichage direct en liste de questions"
                >
                  📋 Liste
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('EXAM')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'EXAM'
                      ? 'bg-white dark:bg-navy-900 text-brand-700 dark:text-brand-300 shadow-xs font-black'
                      : 'text-navy-500'
                  }`}
                  title="Affichage focalisé question par question"
                >
                  ⚡ Épreuve
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* VIEW MODE 1: DIRECT QCM CARDS FEED (Default & Requested)  */}
          {/* ========================================================= */}
          {viewMode === 'LIST' && (
            <div className="space-y-4">
              {filteredQcms.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-brand-50 dark:bg-brand-950 flex items-center justify-center mx-auto text-2xl">
                    🩺
                  </div>
                  <h3 className="text-base font-bold text-navy-950 dark:text-white">
                    Aucun QCM ne correspond à cette combinaison de filtres
                  </h3>
                  <p className="text-xs text-navy-500 max-w-md mx-auto">
                    Essayez de cocher "Toutes les sources" ou d'élargir la recherche à tous les cours du module.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-all cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                paginatedQcms.map((qcm, index) => {
                  const globalIdx = (currentPage - 1) * itemsPerPage + index + 1;
                  const isAnswerVisible = Boolean(revealedAnswers[qcm.id]);
                  const selectedOpts = userSelections[qcm.id] || [];
                  const isValidated = Boolean(validatedQcms[qcm.id]);

                  return (
                    <article
                      key={qcm.id}
                      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4 transition-all hover:border-brand-300 dark:hover:border-brand-700"
                    >
                      {/* CARD HEADER: BADGES BAR INCLUDING PROMINENT SOURCE */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-navy-100 dark:border-navy-800">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Question Number */}
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 font-mono">
                            #{globalIdx}
                          </span>

                          {/* PROMINENT SOURCE BADGE (Requested: "acote de chaque qcm the source apparaitre") */}
                          {qcm.source && (
                            <span className="px-3 py-1 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 flex items-center gap-1 shadow-2xs">
                              <span>🏷️</span>
                              <span>Source : {qcm.source}</span>
                            </span>
                          )}

                          {/* HYPER PROBABLE FLAME BADGE */}
                          {qcm.isHyperProbable && (
                            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-1 shadow-xs">
                              <span>🔥</span>
                              <span>Hyper Probable Résidanat</span>
                            </span>
                          )}

                          {/* FACULTY BADGE */}
                          {qcm.faculty && qcm.faculty !== 'TOUS' && (
                            <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              🏛️ {qcm.faculty === 'ORAN' ? 'Oran' : 'SBA'}
                            </span>
                          )}

                          {/* YEAR BADGE */}
                          {qcm.year && (
                            <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                              📅 {qcm.year}
                            </span>
                          )}

                          {/* COURSE BADGE (CLICKABLE TO OPEN LESSON) */}
                          {qcm.courseTitle && (
                            <Link
                              href={`/cours/${qcm.courseId || ''}`}
                              className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 hover:text-brand-600 flex items-center gap-1 transition-colors"
                              title="Ouvrir la fiche de ce cours"
                            >
                              <span>📘 {qcm.courseTitle}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          )}
                        </div>

                        {/* Question Type Badge */}
                        <span className="text-[11px] font-bold text-navy-500 dark:text-navy-400">
                          {qcm.type === 'MULTIPLE' ? '☑️ Choix Multiple' : '🔘 Choix Simple'}
                        </span>
                      </div>

                      {/* CLINICAL VIGNETTE IF PRESENT */}
                      {qcm.vignetteHtml ? (
                        <div
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-navy-700 text-xs sm:text-sm text-navy-800 dark:text-navy-200 leading-relaxed font-sans"
                          dangerouslySetInnerHTML={{ __html: qcm.vignetteHtml }}
                        />
                      ) : qcm.vignette ? (
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-navy-700 text-xs sm:text-sm text-navy-800 dark:text-navy-200 leading-relaxed italic font-serif">
                          "{qcm.vignette}"
                        </div>
                      ) : null}

                      {/* QUESTION TEXT */}
                      <h3 className="text-sm sm:text-base font-bold text-navy-950 dark:text-white leading-snug">
                        {qcm.question || qcm.title}
                      </h3>

                      {/* OPTIONS LIST */}
                      <div className="space-y-2">
                        {(qcm.options || []).map((opt, optIdx) => {
                          if (!opt) return null;
                          const isSelected = selectedOpts.includes(optIdx);
                          const isCorrect = Array.isArray(qcm.correctAnswers) && qcm.correctAnswers.includes(optIdx);

                          let optStyles = 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-800 dark:text-navy-200 hover:border-brand-400';
                          if (isAnswerVisible) {
                            if (isCorrect) {
                              optStyles = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold ring-1 ring-emerald-500/30';
                            } else if (isSelected && !isCorrect) {
                              optStyles = 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 line-through';
                            }
                          } else if (isSelected) {
                            optStyles = 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 font-bold ring-2 ring-brand-500/20';
                          }

                          return (
                            <button
                              key={opt.id || optIdx}
                              type="button"
                              onClick={() => handleCardOptionClick(qcm, optIdx)}
                              className={`w-full p-3 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${optStyles}`}
                            >
                              <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                                isAnswerVisible && isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : isSelected
                                  ? 'bg-brand-600 text-white'
                                  : 'bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300'
                              }`}>
                                {isAnswerVisible && isCorrect ? '✓' : opt.letter || String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1 mt-0.5">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* CARD FOOTER & INDIVIDUAL ANSWER REVEAL BUTTON */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-navy-100 dark:border-navy-800">
                        <div className="flex items-center gap-2">
                          {/* Option to validate selections in place */}
                          {selectedOpts.length > 0 && !isValidated && (
                            <button
                              type="button"
                              onClick={() => handleValidateCard(qcm)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-all cursor-pointer"
                            >
                              Valider mon choix
                            </button>
                          )}

                          {/* Dedicated Per-QCM Reveal Button */}
                          <button
                            type="button"
                            onClick={() => setRevealedAnswers(prev => ({ ...prev, [qcm.id]: !prev[qcm.id] }))}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
                              isAnswerVisible
                                ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                            }`}
                          >
                            {isAnswerVisible ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Masquer la réponse</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>👁️ Voir la réponse de ce QCM</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Direct link to course */}
                        {qcm.courseTitle && (
                          <Link
                            href={`/cours/${qcm.courseId || ''}`}
                            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                          >
                            <span>Ouvrir cours complet</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>

                      {/* EXPLANATION ACCORDION (Revealed) */}
                      {isAnswerVisible && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3 animate-in fade-in duration-200">
                          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-200 uppercase tracking-wide">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>
                              Réponse Exacte :{' '}
                              {Array.isArray(qcm.correctAnswers)
                                ? qcm.correctAnswers.map(idx => String.fromCharCode(65 + idx)).join(', ')
                                : 'A'}
                            </span>
                          </div>

                          {qcm.explanationHtml ? (
                            <div
                              className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed font-sans space-y-1.5"
                              dangerouslySetInnerHTML={{ __html: qcm.explanationHtml }}
                            />
                          ) : qcm.explanation ? (
                            <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed">
                              {qcm.explanation}
                            </p>
                          ) : (
                            <p className="text-xs text-emerald-800/80 italic">
                              Justification clinique conforme aux annales et aux recommandations du Collège Médical.
                            </p>
                          )}

                          {qcm.reference && (
                            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/40">
                              📚 Référence : {qcm.reference}
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })
              )}

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 text-navy-800 dark:text-navy-200 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    ← Précédent
                  </button>

                  <span className="text-xs font-bold text-navy-600 dark:text-navy-300">
                    Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong> ({filteredQcms.length} QCMs)
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 text-navy-800 dark:text-navy-200 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW MODE 2: EXAM MODE (1 Question at a time)             */}
          {/* ========================================================= */}
          {viewMode === 'EXAM' && (
            <div className="space-y-4">
              {filteredQcms.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 space-y-2">
                  <HelpCircle className="w-8 h-8 text-navy-300 mx-auto" />
                  <p className="text-xs text-navy-500">Aucun QCM pour cette sélection.</p>
                </div>
              ) : examCompleted ? (
                /* Completion score card */
                <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                    🏆
                  </div>
                  <h3 className="text-2xl font-black text-navy-950 dark:text-white">
                    Série d'entraînement terminée !
                  </h3>
                  <div className="text-3xl font-black text-brand-600">
                    Score : {examScore} / {filteredQcms.length} ({Math.round((examScore / filteredQcms.length) * 100)}%)
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveExamIndex(0);
                      setExamSelectedAnswers([]);
                      setExamHasValidated(false);
                      setExamCompleted(false);
                      setExamScore(0);
                    }}
                    className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-soft"
                  >
                    Recommencer cette série
                  </button>
                </div>
              ) : (
                /* Focused Single QCM Card */
                <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-6">
                  {/* Question header info */}
                  <div className="flex items-center justify-between pb-3 border-b border-navy-100 dark:border-navy-800">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl text-xs font-black bg-brand-500/10 text-brand-600 font-mono">
                        Question {activeExamIndex + 1} / {filteredQcms.length}
                      </span>
                      {activeExamQcm?.source && (
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                          🏷️ {activeExamQcm.source}
                        </span>
                      )}
                      {activeExamQcm?.isHyperProbable && (
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-500 text-white">
                          🔥 Hyper Probable
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-emerald-600 font-mono">
                      ✓ {examScore} correct(s)
                    </span>
                  </div>

                  {/* Vignette */}
                  {activeExamQcm?.vignette && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border text-xs sm:text-sm italic">
                      "{activeExamQcm.vignette}"
                    </div>
                  )}

                  {/* Question */}
                  <h3 className="text-base sm:text-lg font-bold text-navy-950 dark:text-white">
                    {activeExamQcm?.question || activeExamQcm?.title}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2">
                    {(activeExamQcm?.options || []).map((opt, idx) => {
                      const isSelected = examSelectedAnswers.includes(idx);
                      const isCorrect = Array.isArray(activeExamQcm?.correctAnswers) && activeExamQcm.correctAnswers.includes(idx);

                      let c = 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-800 dark:text-navy-200';
                      if (examHasValidated) {
                        if (isCorrect) c = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                        else if (isSelected && !isCorrect) c = 'border-rose-400 bg-rose-50 text-rose-950 line-through';
                      } else if (isSelected) {
                        c = 'border-brand-600 bg-brand-50 text-brand-900 font-bold ring-2 ring-brand-500/20';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (examHasValidated) return;
                            if (activeExamQcm.type === 'SINGLE') setExamSelectedAnswers([idx]);
                            else {
                              setExamSelectedAnswers(prev =>
                                prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                              );
                            }
                          }}
                          className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm flex items-center gap-3 transition-all ${c}`}
                        >
                          <span className="w-6 h-6 rounded-lg text-xs font-black bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
                            {opt.letter || String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-navy-100 dark:border-navy-800">
                    {!examHasValidated ? (
                      <button
                        type="button"
                        onClick={handleExamValidate}
                        disabled={examSelectedAnswers.length === 0}
                        className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black shadow-soft disabled:opacity-50"
                      >
                        Valider la réponse
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleExamNext}
                        className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black shadow-soft flex items-center gap-1.5"
                      >
                        <span>Question Suivante</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default function QcmPage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-navy-500">
        Chargement de la banque QCM...
      </div>
    }>
      <QcmHubContent />
    </Suspense>
  );
}
