'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
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
  Brain, Play, CheckCircle2, ChevronRight, Filter, Eye, EyeOff,
  Search, Flame, Check, ArrowRight, ExternalLink, RefreshCw, X,
  SlidersHorizontal, BookOpen, Layers, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

/* ─────────────────────────────────────────────────────────── */
/*  Types & constants                                          */
/* ─────────────────────────────────────────────────────────── */

type StatusFilter = 'ALL' | 'UNSOLVED' | 'CORRECT' | 'WRONG';
type SortMode    = 'DEFAULT' | 'HYPER_FIRST' | 'YEAR_DESC';
type ViewMode    = 'LIST' | 'EXAM';

/* ─────────────────────────────────────────────────────────── */
/*  Main component                                             */
/* ─────────────────────────────────────────────────────────── */

function QcmHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { faculty: selectedFaculty, setFaculty: setSelectedFaculty } = useFaculty();
  const { showEmptySourceToast } = useToast();
  const { setActiveSpecialtyId } = useSpecialtyTheme();

  /* ── Core selection state ────────────────────────────────── */
  const [selectedSpecId,    setSelectedSpecId]    = useState<string>(searchParams.get('specialty') || 'cardio');
  const [selectedCourseId,  setSelectedCourseId]  = useState<string>(searchParams.get('course')    || '');
  const [sourceFilterMode,  setSourceFilterMode]  = useState<'SYSTEM'|'CUSTOM'>('SYSTEM');
  const [selectedSources,   setSelectedSources]   = useState<string[]>(['TOUS']);
  const [onlyHyperProbable, setOnlyHyperProbable] = useState<boolean>(false);
  const [statusFilter,      setStatusFilter]      = useState<StatusFilter>('ALL');
  const [searchQuery,       setSearchQuery]       = useState<string>('');
  const [sortBy,            setSortBy]            = useState<SortMode>('HYPER_FIRST');
  const [viewMode,          setViewMode]          = useState<ViewMode>('LIST');

  /* ── Modal state ─────────────────────────────────────────── */
  const [isModalOpen,  setIsModalOpen]  = useState<boolean>(false);
  /* Draft state — written inside modal, committed on "Appliquer" */
  const [draftSpecId,      setDraftSpecId]      = useState<string>('');
  const [draftCourseId,    setDraftCourseId]    = useState<string>('');
  const [draftSrcMode,     setDraftSrcMode]     = useState<'SYSTEM'|'CUSTOM'>('SYSTEM');
  const [draftSources,     setDraftSources]     = useState<string[]>(['TOUS']);
  const [draftHyper,       setDraftHyper]       = useState<boolean>(false);
  const [draftStatus,      setDraftStatus]      = useState<StatusFilter>('ALL');
  const [draftSearch,      setDraftSearch]      = useState<string>('');
  const [draftFaculty,     setDraftFaculty]     = useState<string>('TOUS');

  /* ── Data ────────────────────────────────────────────────── */
  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>(ALL_SPECIALTIES);
  const [allQcms,         setAllQcms]         = useState<QCM[]>(INITIAL_QCMS);
  const [allCourses,      setAllCourses]      = useState<Course[]>(INITIAL_COURSES);
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [draftAvailableSources, setDraftAvailableSources] = useState<string[]>([]);
  const [userStats, setUserStats] = useState<{
    doneQcmIds: string[]; correctQcmIds: string[]; wrongQcmIds: string[];
  }>({ doneQcmIds: [], correctQcmIds: [], wrongQcmIds: [] });

  /* ── Pagination ──────────────────────────────────────────── */
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  /* ── Answer / interaction state ─────────────────────────── */
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string,boolean>>({});
  const [userSelections,  setUserSelections]  = useState<Record<string,number[]>>({});
  const [validatedQcms,   setValidatedQcms]   = useState<Record<string,boolean>>({});

  /* ── Exam mode ───────────────────────────────────────────── */
  const [activeExamIndex,      setActiveExamIndex]      = useState<number>(0);
  const [examSelectedAnswers,  setExamSelectedAnswers]  = useState<number[]>([]);
  const [examHasValidated,     setExamHasValidated]     = useState<boolean>(false);
  const [examScore,            setExamScore]            = useState<number>(0);
  const [examCompleted,        setExamCompleted]        = useState<boolean>(false);

  /* ── Effects ─────────────────────────────────────────────── */

  // Sync theme
  useEffect(() => { if (selectedSpecId) setActiveSpecialtyId(selectedSpecId); }, [selectedSpecId, setActiveSpecialtyId]);

  // Fetch specialties
  useEffect(() => {
    fetch('/api/specialties').then(r=>r.json()).then(d => {
      if (d.success && Array.isArray(d.specialties) && d.specialties.length > 0)
        setSpecialtiesList(d.specialties);
    }).catch(()=>{});
  }, []);

  // Fetch QCMs, courses, attempts
  const fetchData = useCallback(async () => {
    try {
      const [qcmRes, crsRes, attRes] = await Promise.all([
        fetch('/api/qcm').then(r=>r.json()),
        fetch('/api/courses').then(r=>r.json()),
        fetch('/api/qcm/attempt').then(r=>r.json()),
      ]);
      if (qcmRes.qcms && Array.isArray(qcmRes.qcms)) setAllQcms(qcmRes.qcms);
      if (crsRes.courses && Array.isArray(crsRes.courses)) setAllCourses(crsRes.courses);
      if (attRes.success) {
        setUserStats({
          doneQcmIds:    attRes.doneQcmIds    || [],
          correctQcmIds: attRes.correctQcmIds || [],
          wrongQcmIds:   attRes.wrongQcmIds   || [],
        });
      }
    } catch(_){}
  }, []);

  useEffect(() => {
    fetchData();
    window.addEventListener('asmedix-content-updated', fetchData);
    return () => window.removeEventListener('asmedix-content-updated', fetchData);
  }, [fetchData]);

  // Load sources for active filters
  const loadSources = useCallback(async (specId: string, courseId: string, faculty: string) => {
    const params = new URLSearchParams();
    if (specId) params.set('specialty', specId);
    if (courseId) params.set('course', courseId);
    if (faculty && faculty !== 'TOUS') params.set('faculty', faculty);
    try {
      const d = await fetch(`/api/admin/sources?${params}`).then(r=>r.json());
      if (d.sources && Array.isArray(d.sources)) return d.sources as string[];
    } catch(_){}
    return [];
  }, []);

  useEffect(() => {
    loadSources(selectedSpecId, selectedCourseId, selectedFaculty)
      .then(srcs => setAvailableSources(srcs));
  }, [selectedSpecId, selectedCourseId, selectedFaculty, loadSources]);

  // When modal opens: copy live state into draft
  useEffect(() => {
    if (isModalOpen) {
      setDraftSpecId(selectedSpecId);
      setDraftCourseId(selectedCourseId);
      setDraftSrcMode(sourceFilterMode);
      setDraftSources([...selectedSources]);
      setDraftHyper(onlyHyperProbable);
      setDraftStatus(statusFilter);
      setDraftSearch(searchQuery);
      setDraftFaculty(selectedFaculty);
      // Load sources for draft scope
      loadSources(selectedSpecId, selectedCourseId, selectedFaculty)
        .then(srcs => setDraftAvailableSources(srcs));
    }
  }, [isModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload draft sources when draft spec/course/faculty changes inside modal
  useEffect(() => {
    if (!isModalOpen) return;
    loadSources(draftSpecId, draftCourseId, draftFaculty)
      .then(srcs => setDraftAvailableSources(srcs));
  }, [draftSpecId, draftCourseId, draftFaculty, isModalOpen, loadSources]);

  /* ── Derived data ────────────────────────────────────────── */

  const specialtyCourses = useMemo(() =>
    allCourses.filter(c => {
      const matchSpec = c.specialtyId === selectedSpecId;
      const matchFac  = selectedFaculty === 'TOUS' || !c.faculty || c.faculty === 'TOUS' || c.faculty === selectedFaculty;
      return matchSpec && matchFac;
    }),
    [allCourses, selectedSpecId, selectedFaculty]
  );

  const draftSpecialtyCourses = useMemo(() =>
    allCourses.filter(c => {
      const matchSpec = c.specialtyId === draftSpecId;
      const matchFac  = draftFaculty === 'TOUS' || !c.faculty || c.faculty === 'TOUS' || c.faculty === draftFaculty;
      return matchSpec && matchFac;
    }),
    [allCourses, draftSpecId, draftFaculty]
  );

  const activeSpecialty = useMemo(() =>
    specialtiesList.find(s => s.id === selectedSpecId) ||
    ALL_SPECIALTIES.find(s => s.id === selectedSpecId) ||
    ALL_SPECIALTIES[0],
    [specialtiesList, selectedSpecId]
  );

  const draftActiveSpecialty = useMemo(() =>
    specialtiesList.find(s => s.id === draftSpecId) ||
    ALL_SPECIALTIES.find(s => s.id === draftSpecId) ||
    ALL_SPECIALTIES[0],
    [specialtiesList, draftSpecId]
  );

  const filteredSpecialties = useMemo(() =>
    specialtiesList.filter(s => {
      const matchFac = selectedFaculty === 'TOUS' || !s.faculty || s.faculty === 'TOUS' || s.faculty === selectedFaculty;
      return matchFac;
    }),
    [specialtiesList, selectedFaculty]
  );

  /* ── Main filtering engine ───────────────────────────────── */

  const buildFilteredQcms = useCallback((
    specId: string, courseId: string, faculty: string,
    srcMode: 'SYSTEM'|'CUSTOM', srcs: string[],
    hyper: boolean, status: StatusFilter, query: string
  ) => {
    let result = allQcms.filter(q => {
      if (!q) return false;
      if ((q.specialtyId||'').toLowerCase() !== specId.toLowerCase()) return false;
      if (courseId && courseId !== 'TOUS') {
        const crs = allCourses.find(c => c.id === courseId);
        const qC = (q.courseId||'').toLowerCase();
        const qT = (q.courseTitle||'').toLowerCase();
        const target = courseId.toLowerCase();
        const ok = qC === target || qT === target || Boolean(crs && (
          qC === crs.id.toLowerCase() ||
          (crs.slug  && qC === crs.slug.toLowerCase()) ||
          (crs.title && qT === crs.title.toLowerCase())
        ));
        if (!ok) return false;
      }
      if (faculty !== 'TOUS') {
        const qFac = (q.faculty||'TOUS').toUpperCase();
        if (qFac !== 'TOUS' && qFac !== faculty.toUpperCase()) return false;
      }
      if (srcMode === 'CUSTOM' && !srcs.includes('TOUS')) {
        if (!srcs.some(s => matchQcmToSource(q, s))) return false;
      }
      if (hyper && !q.isHyperProbable) return false;
      if (status === 'UNSOLVED' && userStats.doneQcmIds.includes(q.id)) return false;
      if (status === 'CORRECT'  && !userStats.correctQcmIds.includes(q.id)) return false;
      if (status === 'WRONG'    && !userStats.wrongQcmIds.includes(q.id)) return false;
      if (query.trim()) {
        const t = query.toLowerCase().trim();
        const s = `${q.question||''} ${q.title||''} ${q.vignette||''} ${q.source||''} ${q.courseTitle||''}`.toLowerCase();
        if (!s.includes(t)) return false;
      }
      return true;
    });

    if (sortBy === 'HYPER_FIRST') {
      result.sort((a,b) => {
        if (Boolean(a.isHyperProbable) === Boolean(b.isHyperProbable)) return 0;
        return a.isHyperProbable ? -1 : 1;
      });
    } else if (sortBy === 'YEAR_DESC') {
      result.sort((a,b) => (Number(b.year)||0) - (Number(a.year)||0));
    }
    return result;
  }, [allQcms, allCourses, userStats, sortBy]);

  const filteredQcms = useMemo(() =>
    buildFilteredQcms(
      selectedSpecId, selectedCourseId, selectedFaculty,
      sourceFilterMode, selectedSources,
      onlyHyperProbable, statusFilter, searchQuery
    ),
    [buildFilteredQcms, selectedSpecId, selectedCourseId, selectedFaculty,
     sourceFilterMode, selectedSources, onlyHyperProbable, statusFilter, searchQuery]
  );

  // Live preview count inside modal based on draft values
  const draftPreviewCount = useMemo(() =>
    buildFilteredQcms(
      draftSpecId, draftCourseId, draftFaculty,
      draftSrcMode, draftSources,
      draftHyper, draftStatus, draftSearch
    ).length,
    [buildFilteredQcms, draftSpecId, draftCourseId, draftFaculty,
     draftSrcMode, draftSources, draftHyper, draftStatus, draftSearch]
  );

  const totalPages  = Math.ceil(filteredQcms.length / itemsPerPage) || 1;
  const paginatedQcms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQcms.slice(start, start + itemsPerPage);
  }, [filteredQcms, currentPage, itemsPerPage]);

  const hyperProbableCount = useMemo(() =>
    allQcms.filter(q => {
      const mS = (q.specialtyId||'').toLowerCase() === selectedSpecId.toLowerCase();
      const mC = !selectedCourseId ||
        (q.courseId||'').toLowerCase() === selectedCourseId.toLowerCase() ||
        (q.courseTitle||'').toLowerCase() === selectedCourseId.toLowerCase();
      return mS && mC && q.isHyperProbable;
    }).length,
    [allQcms, selectedSpecId, selectedCourseId]
  );

  const activeFiltersCount = useMemo(() => {
    let n = 0;
    if (selectedCourseId) n++;
    if (sourceFilterMode === 'CUSTOM' && !selectedSources.includes('TOUS')) n += selectedSources.length;
    if (onlyHyperProbable) n++;
    if (statusFilter !== 'ALL') n++;
    if (searchQuery.trim()) n++;
    if (selectedFaculty !== 'TOUS') n++;
    return n;
  }, [selectedCourseId, sourceFilterMode, selectedSources, onlyHyperProbable, statusFilter, searchQuery, selectedFaculty]);

  /* ── Handlers ────────────────────────────────────────────── */

  const handleResetFilters = () => {
    setSelectedCourseId('');
    setSourceFilterMode('SYSTEM');
    setSelectedSources(['TOUS']);
    setOnlyHyperProbable(false);
    setStatusFilter('ALL');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const openModalForSpec = (specId: string) => {
    setSelectedSpecId(specId);
    setSelectedCourseId('');
    setCurrentPage(1);
    setIsModalOpen(true);
  };

  // Apply draft → live
  const applyFilters = (andLaunch = false) => {
    setSelectedSpecId(draftSpecId);
    setSelectedCourseId(draftCourseId);
    setSelectedFaculty(draftFaculty as any);
    setSourceFilterMode(draftSrcMode);
    setSelectedSources([...draftSources]);
    setOnlyHyperProbable(draftHyper);
    setStatusFilter(draftStatus);
    setSearchQuery(draftSearch);
    setCurrentPage(1);
    setIsModalOpen(false);

    if (andLaunch) {
      const spec = specialtiesList.find(s => s.id === draftSpecId) || ALL_SPECIALTIES.find(s => s.id === draftSpecId);
      const crs  = allCourses.find(c => c.id === draftCourseId);
      const srcStr = (draftSrcMode === 'CUSTOM' && !draftSources.includes('TOUS'))
        ? draftSources.join(',') : 'TOUS';
      if (draftPreviewCount === 0) {
        showEmptySourceToast(srcStr, crs?.title || spec?.name);
        return;
      }
      const p = new URLSearchParams({
        specialty: draftSpecId,
        course: draftCourseId,
        source: srcStr,
        faculty: draftFaculty,
        specialtyName: spec?.name || draftSpecId,
        courseName: crs?.title || draftCourseId,
        ...(draftHyper ? { hyper: 'true' } : {}),
      });
      router.push(`/qcm-session?${p.toString()}`);
    }
  };

  const launchSession = () => {
    const spec   = activeSpecialty;
    const crs    = allCourses.find(c => c.id === selectedCourseId);
    const srcStr = (sourceFilterMode === 'CUSTOM' && !selectedSources.includes('TOUS'))
      ? selectedSources.join(',') : 'TOUS';
    if (filteredQcms.length === 0) { showEmptySourceToast(srcStr, crs?.title || spec?.name); return; }
    const p = new URLSearchParams({
      specialty: selectedSpecId, course: selectedCourseId,
      source: srcStr, faculty: selectedFaculty,
      specialtyName: spec?.name || selectedSpecId, courseName: crs?.title || selectedCourseId,
      ...(onlyHyperProbable ? { hyper: 'true' } : {}),
    });
    router.push(`/qcm-session?${p.toString()}`);
  };

  const toggleDraftSource = (src: string) => {
    if (src === 'TOUS') {
      setDraftSrcMode('SYSTEM'); setDraftSources(['TOUS']); return;
    }
    setDraftSrcMode('CUSTOM');
    setDraftSources(prev => {
      const without = prev.filter(s => s !== 'TOUS' && s !== src);
      if (prev.includes(src)) return without.length === 0 ? ['TOUS'] : without;
      return [...without, src];
    });
  };

  const handleCardOptionClick = (qcm: QCM, optIdx: number) => {
    const cur = userSelections[qcm.id] || [];
    const upd = qcm.type === 'SINGLE' ? [optIdx]
      : cur.includes(optIdx) ? cur.filter(i => i !== optIdx) : [...cur, optIdx];
    setUserSelections(prev => ({ ...prev, [qcm.id]: upd }));
  };

  const handleValidateCard = (qcm: QCM) => {
    const sel = userSelections[qcm.id] || [];
    if (sel.length === 0) return;
    const ok = Array.isArray(qcm.correctAnswers) &&
      sel.length === qcm.correctAnswers.length &&
      sel.every(a => qcm.correctAnswers.includes(a));
    setValidatedQcms(prev => ({ ...prev, [qcm.id]: true }));
    setRevealedAnswers(prev => ({ ...prev, [qcm.id]: true }));
    if (ok) confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    fetch('/api/qcm/attempt', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qcmId: qcm.id, userAnswers: sel, isCorrect: ok, scorePercentage: ok?100:0, timeSpentSeconds: 30 })
    }).then(r=>r.json()).then(d => {
      if (d.stats) {
        setUserStats(prev => ({
          doneQcmIds:    Array.from(new Set([...prev.doneQcmIds, qcm.id])),
          correctQcmIds: ok ? Array.from(new Set([...prev.correctQcmIds, qcm.id])) : prev.correctQcmIds,
          wrongQcmIds:  !ok ? Array.from(new Set([...prev.wrongQcmIds,   qcm.id])) : prev.wrongQcmIds,
        }));
      }
    }).catch(()=>{});
  };

  const activeExamQcm = filteredQcms[activeExamIndex] || filteredQcms[0];

  const handleExamValidate = () => {
    if (examSelectedAnswers.length === 0 || !activeExamQcm) return;
    setExamHasValidated(true);
    const ok = Array.isArray(activeExamQcm.correctAnswers) &&
      examSelectedAnswers.length === activeExamQcm.correctAnswers.length &&
      examSelectedAnswers.every(a => activeExamQcm.correctAnswers.includes(a));
    if (ok) { setExamScore(prev=>prev+1); confetti({ particleCount:50, spread:60, origin:{y:0.7} }); }
    fetch('/api/qcm/attempt', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ qcmId: activeExamQcm.id, userAnswers: examSelectedAnswers, isCorrect: ok, scorePercentage: ok?100:0, timeSpentSeconds:30 })
    }).catch(()=>{});
  };

  const handleExamNext = () => {
    if (activeExamIndex < filteredQcms.length - 1) {
      setActiveExamIndex(prev=>prev+1); setExamSelectedAnswers([]); setExamHasValidated(false);
    } else { setExamCompleted(true); }
  };

  /* ─────────────────────────────────────────────────────────── */
  /*  Render                                                     */
  /* ─────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO BANNER                                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="p-5 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 text-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
              <Brain className="w-3.5 h-3.5" /><span>Banque QCM Médicale · Résidanat</span>
            </div>
            {/* Faculty quick-switch */}
            <div className="inline-flex items-center p-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              {(['TOUS','ORAN','SIDI_BEL_ABBES'] as const).map(f => (
                <button key={f} onClick={() => setSelectedFaculty(f)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedFaculty === f ? 'bg-white text-brand-800 shadow-sm font-black' : 'text-white/80 hover:text-white'
                  }`}>
                  {f === 'TOUS' ? 'Toutes Facultés' : f === 'ORAN' ? '🏛️ Oran' : '🏛️ SBA'}
                </button>
              ))}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Révision QCM par Module &amp; Source
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
            Cliquez sur un module dans la barre latérale puis appuyez sur{' '}
            <strong>🎛️ Filtre</strong> pour personnaliser les sources, le cours et lancer l'épreuve.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
          <button type="button" onClick={() => setIsModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-brand-50 text-brand-700 active:scale-95 text-xs font-black shadow-soft flex items-center justify-center gap-2 transition-all cursor-pointer">
            <SlidersHorizontal className="w-4 h-4" />
            <span>🎛️ Filtres Avancés</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-brand-700 text-white font-mono">{activeFiltersCount}</span>
            )}
          </button>

          <button type="button" onClick={launchSession} disabled={filteredQcms.length === 0}
            className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50">
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Lancer Session ({filteredQcms.length} QCMs)</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* 2-COLUMN LAYOUT                                         */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ─────────────────────────────────────────────────── */}
        {/* LEFT SIDEBAR — Minimaliste : liste modules + Filtre */}
        {/* ─────────────────────────────────────────────────── */}
        <aside className="lg:col-span-3 xl:col-span-3 space-y-3 lg:sticky lg:top-20">
          <div className="apple-card p-4 border-2 border-brand-500/20 shadow-soft space-y-3">

            {/* Sidebar title */}
            <div className="flex items-center justify-between pb-2 border-b border-navy-100 dark:border-navy-800">
              <div className="flex items-center gap-2 text-navy-950 dark:text-white font-black text-sm">
                <Layers className="w-4 h-4 text-brand-600" />
                <span>Modules Médicaux</span>
              </div>
              <span className="text-[10px] text-navy-400 font-bold">{filteredSpecialties.length} modules</span>
            </div>

            {/* Modules list */}
            <div className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-0.5 scrollbar-thin">
              {filteredSpecialties.map(spec => {
                const isSelected = selectedSpecId === spec.id;
                const count = allQcms.filter(q => q.specialtyId === spec.id).length;
                return (
                  <div key={spec.id}
                    className={`flex items-center gap-2 p-2 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-400 ring-2 ring-brand-500/20 shadow-xs'
                        : 'bg-white dark:bg-navy-900 border-navy-100 dark:border-navy-800 hover:border-brand-300'
                    }`}>

                    {/* Module selector button */}
                    <button type="button"
                      onClick={() => { setSelectedSpecId(spec.id); setSelectedCourseId(''); setCurrentPage(1); }}
                      className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer"
                      title={`Voir les QCMs de ${spec.name}`}>
                      <SpecialtyLogo specialtyId={spec.id} size="sm" withGlow={isSelected} />
                      <div className="min-w-0 flex-1">
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-brand-700 dark:text-brand-300 font-black' : 'text-navy-900 dark:text-white'}`}>
                          {spec.name}
                        </div>
                        <div className="text-[10px] text-navy-400 font-mono">{count} QCMs</div>
                      </div>
                    </button>

                    {/* 🎛️ Filtre button — opens popup for this module */}
                    <button type="button"
                      onClick={() => openModalForSpec(spec.id)}
                      title={`Filtrer les QCMs de ${spec.name}`}
                      className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-xs ${
                        isSelected
                          ? 'bg-brand-600 hover:bg-brand-700 text-white'
                          : 'bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-navy-600 dark:text-navy-300 hover:bg-brand-600 hover:text-white hover:border-brand-600'
                      }`}>
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>Filtre</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick live stats at bottom */}
            <div className="pt-2 border-t border-navy-100 dark:border-navy-800 space-y-2">
              {/* Current selection summary */}
              <div className="p-2.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/50 dark:border-brand-800/40 space-y-1 text-[11px]">
                <div className="font-black text-brand-800 dark:text-brand-300 flex items-center gap-1.5">
                  <span>📊</span>
                  <span>{activeSpecialty.name}</span>
                </div>
                {selectedCourseId && (
                  <div className="text-navy-600 dark:text-navy-400 font-bold truncate">
                    📘 {allCourses.find(c=>c.id===selectedCourseId)?.title || selectedCourseId}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-navy-500">{filteredQcms.length} QCMs affichés</span>
                  {onlyHyperProbable && <span className="text-amber-600 font-black">🔥 Hyper Probables</span>}
                </div>
              </div>

              {/* Launch from sidebar */}
              <button type="button" onClick={launchSession} disabled={filteredQcms.length === 0}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-98 text-white text-xs font-black shadow-soft flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50">
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Lancer ({filteredQcms.length})</span>
              </button>

              {/* Reset */}
              {activeFiltersCount > 0 && (
                <button type="button" onClick={handleResetFilters}
                  className="w-full py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs font-bold text-navy-600 dark:text-navy-300 hover:bg-navy-50 dark:hover:bg-navy-800 flex items-center justify-center gap-1 transition-all cursor-pointer">
                  <RefreshCw className="w-3 h-3" />
                  <span>Réinitialiser les filtres ({activeFiltersCount})</span>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ─────────────────────────────────────────────────── */}
        {/* RIGHT: MAIN QCM FEED                                */}
        {/* ─────────────────────────────────────────────────── */}
        <main className="lg:col-span-9 xl:col-span-9 space-y-4">

          {/* Results header bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-navy-950 dark:text-white flex items-center gap-1.5">
                  <span>{activeSpecialty.name}</span>
                  {selectedCourseId && (<>
                    <ChevronRight className="w-3 h-3 text-navy-400" />
                    <span className="text-brand-600 dark:text-brand-400">
                      {allCourses.find(c=>c.id===selectedCourseId)?.title || selectedCourseId}
                    </span>
                  </>)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-500/10 text-brand-600 dark:bg-brand-950 dark:text-brand-300 border border-brand-500/20">
                  {filteredQcms.length} QCM(s)
                </span>
                {onlyHyperProbable && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white flex items-center gap-1 animate-pulse">
                    🔥 Hyper Probables
                  </span>
                )}
              </div>

              {/* Active source chips */}
              <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-navy-500">
                <span className="font-bold">Sources :</span>
                {sourceFilterMode === 'SYSTEM' || selectedSources.includes('TOUS') ? (
                  <button type="button" onClick={() => setIsModalOpen(true)}
                    className="px-2 py-0.5 rounded-md bg-navy-100 dark:bg-navy-800 font-bold text-navy-700 dark:text-navy-300 hover:bg-navy-200 cursor-pointer flex items-center gap-1">
                    Toutes les sources ⚙️
                  </button>
                ) : selectedSources.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold flex items-center gap-1">
                    📁 {s}
                    <button type="button" onClick={() => {
                      const upd = selectedSources.filter(x=>x!==s);
                      if (upd.length===0) { setSourceFilterMode('SYSTEM'); setSelectedSources(['TOUS']); }
                      else setSelectedSources(upd);
                      setCurrentPage(1);
                    }} className="hover:text-rose-500 font-black cursor-pointer">✕</button>
                  </span>
                ))}
                <button type="button" onClick={() => setIsModalOpen(true)}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-0.5 ml-1 cursor-pointer">
                  <SlidersHorizontal className="w-3 h-3" /><span>Filtres</span>
                </button>
              </div>
            </div>

            {/* Sort & view mode */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <select value={sortBy} onChange={e=>setSortBy(e.target.value as SortMode)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-800 dark:text-navy-200 cursor-pointer">
                <option value="HYPER_FIRST">🔥 Hyper Probables d'abord</option>
                <option value="DEFAULT">Ordre par défaut</option>
                <option value="YEAR_DESC">📅 Par Année Récente</option>
              </select>

              <div className="flex items-center p-1 rounded-xl bg-navy-100 dark:bg-navy-800 text-xs font-bold">
                {(['LIST','EXAM'] as const).map(m => (
                  <button key={m} type="button" onClick={() => setViewMode(m)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      viewMode === m ? 'bg-white dark:bg-navy-900 text-brand-700 dark:text-brand-300 shadow-xs font-black' : 'text-navy-500'
                    }`}>
                    {m === 'LIST' ? '📋 Liste' : '⚡ Épreuve'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ────────── LIST VIEW ────────── */}
          {viewMode === 'LIST' && (
            <div className="space-y-4">
              {filteredQcms.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-brand-50 dark:bg-brand-950 flex items-center justify-center mx-auto text-2xl">🩺</div>
                  <h3 className="text-base font-bold text-navy-950 dark:text-white">Aucun QCM pour cette sélection</h3>
                  <p className="text-xs text-navy-500 max-w-md mx-auto">
                    Ajustez vos filtres via le bouton <strong>🎛️ Filtre</strong> à côté du module.
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button type="button" onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-all cursor-pointer flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5" /><span>Ouvrir les Filtres</span>
                    </button>
                    <button type="button" onClick={handleResetFilters}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-navy-800 text-navy-800 dark:text-navy-200 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer">
                      Réinitialiser
                    </button>
                  </div>
                </div>
              ) : (
                paginatedQcms.map((qcm, index) => {
                  const globalIdx = (currentPage - 1) * itemsPerPage + index + 1;
                  const isAnswerVisible = Boolean(revealedAnswers[qcm.id]);
                  const selectedOpts = userSelections[qcm.id] || [];
                  const isValidated  = Boolean(validatedQcms[qcm.id]);
                  return (
                    <article key={qcm.id}
                      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4 transition-all hover:border-brand-300 dark:hover:border-brand-700">

                      {/* Card header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-navy-100 dark:border-navy-800">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 font-mono">#{globalIdx}</span>

                          {qcm.source && (
                            <span className="px-3 py-1 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 flex items-center gap-1 shadow-2xs">
                              🏷️ Source : {qcm.source}
                            </span>
                          )}

                          {qcm.isHyperProbable && (
                            <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-1 shadow-xs">
                              🔥 Hyper Probable Résidanat
                            </span>
                          )}

                          {qcm.faculty && qcm.faculty !== 'TOUS' && (
                            <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              🏛️ {qcm.faculty === 'ORAN' ? 'Oran' : 'SBA'}
                            </span>
                          )}

                          {qcm.year && (
                            <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300">
                              📅 {qcm.year}
                            </span>
                          )}

                          {qcm.courseTitle && (
                            <Link href={`/cours/${qcm.courseId||''}`}
                              className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 hover:text-brand-600 flex items-center gap-1 transition-colors"
                              title="Ouvrir le cours">
                              📘 {qcm.courseTitle}<ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-navy-500 dark:text-navy-400">
                          {qcm.type === 'MULTIPLE' ? '☑️ Choix Multiple' : '🔘 Choix Simple'}
                        </span>
                      </div>

                      {/* Clinical vignette */}
                      {qcm.vignetteHtml ? (
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-navy-700 text-xs sm:text-sm text-navy-800 dark:text-navy-200 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: qcm.vignetteHtml }} />
                      ) : qcm.vignette ? (
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-navy-700 text-xs sm:text-sm text-navy-800 dark:text-navy-200 leading-relaxed italic font-serif">
                          "{qcm.vignette}"
                        </div>
                      ) : null}

                      <h3 className="text-sm sm:text-base font-bold text-navy-950 dark:text-white leading-snug">
                        {qcm.question || qcm.title}
                      </h3>

                      {/* Options */}
                      <div className="space-y-2">
                        {(qcm.options || []).map((opt, optIdx) => {
                          if (!opt) return null;
                          const isSel   = selectedOpts.includes(optIdx);
                          const isCorr  = Array.isArray(qcm.correctAnswers) && qcm.correctAnswers.includes(optIdx);
                          let st = 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-800 dark:text-navy-200 hover:border-brand-400';
                          if (isAnswerVisible) {
                            if (isCorr) st = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold ring-1 ring-emerald-500/30';
                            else if (isSel) st = 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 line-through';
                          } else if (isSel) {
                            st = 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 font-bold ring-2 ring-brand-500/20';
                          }
                          return (
                            <button key={opt.id||optIdx} type="button"
                              onClick={() => handleCardOptionClick(qcm, optIdx)}
                              className={`w-full p-3 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${st}`}>
                              <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                                isAnswerVisible && isCorr ? 'bg-emerald-600 text-white' :
                                isSel ? 'bg-brand-600 text-white' : 'bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300'
                              }`}>
                                {isAnswerVisible && isCorr ? '✓' : opt.letter || String.fromCharCode(65+optIdx)}
                              </span>
                              <span className="flex-1 mt-0.5">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-navy-100 dark:border-navy-800">
                        <div className="flex items-center gap-2 flex-wrap">
                          {selectedOpts.length > 0 && !isValidated && (
                            <button type="button" onClick={() => handleValidateCard(qcm)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-all cursor-pointer">
                              Valider mon choix
                            </button>
                          )}
                          <button type="button"
                            onClick={() => setRevealedAnswers(prev=>({...prev,[qcm.id]:!prev[qcm.id]}))}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
                              isAnswerVisible
                                ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                            }`}>
                            {isAnswerVisible ? <><EyeOff className="w-3.5 h-3.5" /><span>Masquer</span></>
                              : <><Eye className="w-3.5 h-3.5" /><span>👁️ Voir la réponse</span></>}
                          </button>
                        </div>
                        {qcm.courseTitle && (
                          <Link href={`/cours/${qcm.courseId||''}`}
                            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
                            Ouvrir cours complet<ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>

                      {/* Explanation */}
                      {isAnswerVisible && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3 animate-in fade-in duration-200">
                          <div className="flex items-center gap-2 text-xs font-black text-emerald-800 dark:text-emerald-200 uppercase tracking-wide">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Réponse Exacte :{' '}
                              {Array.isArray(qcm.correctAnswers)
                                ? qcm.correctAnswers.map(i=>String.fromCharCode(65+i)).join(', ')
                                : 'A'}
                            </span>
                          </div>
                          {qcm.explanationHtml ? (
                            <div className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: qcm.explanationHtml }} />
                          ) : qcm.explanation ? (
                            <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed">{qcm.explanation}</p>
                          ) : (
                            <p className="text-xs text-emerald-800/80 italic">Justification clinique conforme aux annales.</p>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-xs">
                  <button type="button" onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 text-navy-800 dark:text-navy-200 disabled:opacity-40 transition-all cursor-pointer">
                    ← Précédent
                  </button>
                  <span className="text-xs font-bold text-navy-600 dark:text-navy-300">
                    Page <strong>{currentPage}</strong> / <strong>{totalPages}</strong> ({filteredQcms.length} QCMs)
                  </span>
                  <button type="button" onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 text-navy-800 dark:text-navy-200 disabled:opacity-40 transition-all cursor-pointer">
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ────────── EXAM VIEW ────────── */}
          {viewMode === 'EXAM' && (
            <div className="space-y-4">
              {filteredQcms.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 space-y-2">
                  <HelpCircle className="w-8 h-8 text-navy-300 mx-auto" />
                  <p className="text-xs text-navy-500">Aucun QCM pour cette sélection.</p>
                </div>
              ) : examCompleted ? (
                <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-2xl">🏆</div>
                  <h3 className="text-2xl font-black text-navy-950 dark:text-white">Série terminée !</h3>
                  <div className="text-3xl font-black text-brand-600">
                    Score : {examScore} / {filteredQcms.length} ({Math.round((examScore/filteredQcms.length)*100)}%)
                  </div>
                  <button type="button"
                    onClick={() => { setActiveExamIndex(0); setExamSelectedAnswers([]); setExamHasValidated(false); setExamCompleted(false); setExamScore(0); }}
                    className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-soft">
                    Recommencer cette série
                  </button>
                </div>
              ) : (
                <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-navy-100 dark:border-navy-800">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl text-xs font-black bg-brand-500/10 text-brand-600 font-mono">
                        Question {activeExamIndex+1} / {filteredQcms.length}
                      </span>
                      {activeExamQcm?.source && (
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                          🏷️ {activeExamQcm.source}
                        </span>
                      )}
                      {activeExamQcm?.isHyperProbable && (
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-amber-500 text-white">🔥 Hyper Probable</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-emerald-600 font-mono">✓ {examScore} correct(s)</span>
                  </div>

                  {activeExamQcm?.vignette && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border text-xs sm:text-sm italic">
                      "{activeExamQcm.vignette}"
                    </div>
                  )}
                  <h3 className="text-base sm:text-lg font-bold text-navy-950 dark:text-white">
                    {activeExamQcm?.question || activeExamQcm?.title}
                  </h3>

                  <div className="space-y-2">
                    {(activeExamQcm?.options || []).map((opt, idx) => {
                      const isSel  = examSelectedAnswers.includes(idx);
                      const isCorr = Array.isArray(activeExamQcm?.correctAnswers) && activeExamQcm.correctAnswers.includes(idx);
                      let c = 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-800 dark:text-navy-200';
                      if (examHasValidated) {
                        if (isCorr) c = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                        else if (isSel) c = 'border-rose-400 bg-rose-50 text-rose-950 line-through';
                      } else if (isSel) c = 'border-brand-600 bg-brand-50 text-brand-900 font-bold ring-2 ring-brand-500/20';
                      return (
                        <button key={idx} type="button"
                          onClick={() => {
                            if (examHasValidated) return;
                            if (activeExamQcm.type === 'SINGLE') setExamSelectedAnswers([idx]);
                            else setExamSelectedAnswers(prev => prev.includes(idx) ? prev.filter(i=>i!==idx) : [...prev, idx]);
                          }}
                          className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm flex items-center gap-3 transition-all ${c}`}>
                          <span className="w-6 h-6 rounded-lg text-xs font-black bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
                            {opt.letter || String.fromCharCode(65+idx)}
                          </span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-navy-100 dark:border-navy-800">
                    {!examHasValidated ? (
                      <button type="button" onClick={handleExamValidate} disabled={examSelectedAnswers.length===0}
                        className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black shadow-soft disabled:opacity-50">
                        Valider la réponse
                      </button>
                    ) : (
                      <button type="button" onClick={handleExamNext}
                        className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black shadow-soft flex items-center gap-1.5">
                        Question Suivante<ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* INTELLIGENT PROFESSIONAL POP-UP FILTER MODAL                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-navy-950/75 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>

          <div
            className="w-full sm:max-w-2xl md:max-w-3xl bg-white dark:bg-navy-900 rounded-t-3xl sm:rounded-3xl border border-navy-100 dark:border-navy-800 shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[88vh] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
            role="dialog" aria-modal="true">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-navy-100 dark:border-navy-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-brand-600 flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-navy-950 dark:text-white">
                    🎛️ Personnaliser les Filtres QCM
                  </h2>
                  <p className="text-[11px] text-navy-500 dark:text-navy-400">
                    {draftPreviewCount} QCM(s) correspondent à la sélection actuelle
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 dark:hover:bg-navy-700 flex items-center justify-center transition-colors cursor-pointer shrink-0">
                <X className="w-4 h-4 text-navy-600 dark:text-navy-300" />
              </button>
            </div>

            {/* Modal scrollable body */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5 scrollbar-thin">

              {/* ── SECTION 1: Faculté ── */}
              <section className="space-y-2">
                <label className="block text-[11px] font-black uppercase text-navy-500 dark:text-navy-400 tracking-wider flex items-center gap-1.5">
                  🏛️ Faculté Médicale
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { val: 'TOUS',           label: 'Toutes Facultés' },
                    { val: 'ORAN',           label: '🏛️ Oran' },
                    { val: 'SIDI_BEL_ABBES', label: '🏛️ Sidi Bel Abbès' },
                  ].map(f => (
                    <button key={f.val} type="button"
                      onClick={() => setDraftFaculty(f.val)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        draftFaculty === f.val
                          ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                          : 'bg-white dark:bg-navy-900 border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:border-brand-400'
                      }`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* ── SECTION 2: Module ── */}
              <section className="space-y-2">
                <label className="block text-[11px] font-black uppercase text-navy-500 dark:text-navy-400 tracking-wider flex items-center gap-1.5">
                  🩺 Module Médical
                  <span className="ml-auto text-[10px] font-bold text-navy-400 normal-case">{draftActiveSpecialty.name}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto scrollbar-thin pr-0.5">
                  {filteredSpecialties.map(spec => {
                    const isSel  = draftSpecId === spec.id;
                    const count  = allQcms.filter(q => q.specialtyId === spec.id).length;
                    return (
                      <button key={spec.id} type="button"
                        onClick={() => { setDraftSpecId(spec.id); setDraftCourseId(''); }}
                        className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          isSel
                            ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
                            : 'bg-white dark:bg-navy-900 border-navy-100 dark:border-navy-800 hover:border-brand-300'
                        }`}>
                        <SpecialtyLogo specialtyId={spec.id} size="sm" withGlow={isSel} />
                        <div className="min-w-0 flex-1">
                          <div className={`text-[11px] font-bold truncate ${isSel ? 'text-brand-700 dark:text-brand-300 font-black' : 'text-navy-900 dark:text-white'}`}>
                            {spec.name}
                          </div>
                          <div className="text-[9px] text-navy-400 font-mono">{count} QCMs</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* ── SECTION 3: Cours ── */}
              <section className="space-y-2 pt-1 border-t border-navy-100 dark:border-navy-800">
                <label className="block text-[11px] font-black uppercase text-navy-500 dark:text-navy-400 tracking-wider">
                  📖 Périmètre dans {draftActiveSpecialty.name}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Whole module */}
                  <button type="button" onClick={() => setDraftCourseId('')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      !draftCourseId
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
                        : 'bg-white dark:bg-navy-900 border-navy-200 dark:border-navy-700 hover:border-brand-300'
                    }`}>
                    <div className="text-xs font-black text-navy-900 dark:text-white flex items-center gap-1.5">
                      🌐 Tout le Module
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-navy-100 dark:bg-navy-800 text-navy-600">
                        {allQcms.filter(q=>q.specialtyId===draftSpecId).length} QCMs
                      </span>
                    </div>
                    <div className="text-[11px] text-navy-500 dark:text-navy-400 mt-0.5">Tous les cours de {draftActiveSpecialty.name}</div>
                  </button>

                  {/* Specific course */}
                  <button type="button"
                    onClick={() => { if (draftSpecialtyCourses[0] && !draftCourseId) setDraftCourseId(draftSpecialtyCourses[0].id); }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      draftCourseId
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-white dark:bg-navy-900 border-navy-200 dark:border-navy-700 hover:border-indigo-300'
                    }`}>
                    <div className="text-xs font-black text-navy-900 dark:text-white flex items-center gap-1.5">
                      📘 Par Cours Spécifique
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-navy-100 dark:bg-navy-800 text-navy-600">
                        {draftSpecialtyCourses.length} cours
                      </span>
                    </div>
                    <div className="text-[11px] text-navy-500 dark:text-navy-400 mt-0.5">Cibler un cours précis</div>
                  </button>
                </div>

                {/* Course picker dropdown */}
                {draftCourseId && (
                  <div className="pt-1 animate-in fade-in duration-150">
                    <select value={draftCourseId} onChange={e => setDraftCourseId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-navy-900 text-navy-900 dark:text-white font-bold text-xs cursor-pointer">
                      {draftSpecialtyCourses.map(c => {
                        const n = allQcms.filter(q => q.courseId === c.id).length;
                        return <option key={c.id} value={c.id}>📖 {c.title} ({n} QCMs)</option>;
                      })}
                    </select>
                  </div>
                )}
              </section>

              {/* ── SECTION 4: Sources ── */}
              <section className="space-y-3 pt-1 border-t border-navy-100 dark:border-navy-800">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase text-navy-500 dark:text-navy-400 tracking-wider">
                    📚 Sources des Questions
                  </label>
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <button type="button" onClick={() => { setDraftSrcMode('CUSTOM'); setDraftSources([...draftAvailableSources]); }}
                      className="text-indigo-600 hover:underline cursor-pointer">Tout cocher</button>
                    <span className="text-navy-300">•</span>
                    <button type="button" onClick={() => { setDraftSrcMode('SYSTEM'); setDraftSources(['TOUS']); }}
                      className="text-navy-500 hover:underline cursor-pointer">Tout décocher</button>
                  </div>
                </div>

                {/* Mode toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => { setDraftSrcMode('SYSTEM'); setDraftSources(['TOUS']); }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      draftSrcMode === 'SYSTEM'
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 ring-2 ring-brand-500/20 shadow-xs'
                        : 'bg-white dark:bg-navy-900 border-navy-200 dark:border-navy-700 hover:border-brand-300'
                    }`}>
                    <div className="text-xs font-black text-navy-900 dark:text-white">⚡ Toutes les Sources</div>
                    <div className="text-[10px] text-navy-500 mt-0.5">Couverture exhaustive (recommandé)</div>
                  </button>
                  <button type="button" onClick={() => { setDraftSrcMode('CUSTOM'); if (draftSources.includes('TOUS')) setDraftSources(draftAvailableSources.slice(0,2)); }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      draftSrcMode === 'CUSTOM'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-white dark:bg-navy-900 border-navy-200 dark:border-navy-700 hover:border-indigo-300'
                    }`}>
                    <div className="text-xs font-black text-navy-900 dark:text-white">🎯 Sélection Personnalisée</div>
                    <div className="text-[10px] text-navy-500 mt-0.5">Cochez les sources souhaitées</div>
                  </button>
                </div>

                {/* Source checklist */}
                {draftAvailableSources.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto scrollbar-thin pr-0.5">
                    {draftAvailableSources.map(src => {
                      const isChk = draftSrcMode === 'CUSTOM' && draftSources.includes(src);
                      const cnt   = allQcms.filter(q => {
                        const mS = q.specialtyId === draftSpecId;
                        const mC = !draftCourseId || q.courseId === draftCourseId;
                        return mS && mC && matchQcmToSource(q, src);
                      }).length;
                      return (
                        <label key={src}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all select-none ${
                            isChk
                              ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-400 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-400/30'
                              : 'bg-white dark:bg-navy-900 border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:border-indigo-300'
                          }`}>
                          <div className="flex items-center gap-2 min-w-0">
                            <input type="checkbox" checked={isChk} onChange={() => toggleDraftSource(src)}
                              className="w-4 h-4 text-indigo-600 rounded cursor-pointer shrink-0 accent-indigo-600" />
                            <span className="truncate" title={src}>📁 {src}</span>
                          </div>
                          <span className="shrink-0 ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-400">
                            {cnt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
                {draftAvailableSources.length === 0 && (
                  <p className="text-[11px] text-navy-400 italic">Aucune source disponible pour cette sélection.</p>
                )}
              </section>

              {/* ── SECTION 5: Hyper Probable ── */}
              <section className="pt-1 border-t border-navy-100 dark:border-navy-800">
                <label className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-amber-400/50 dark:border-amber-500/40 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔥</span>
                    <div>
                      <div className="text-xs font-black text-amber-950 dark:text-amber-200">
                        Hyper Probables Résidanat Uniquement
                      </div>
                      <div className="text-[10px] text-amber-800/80 dark:text-amber-300/80">
                        Questions récurrentes clés du concours national — {hyperProbableCount} disponibles dans ce module
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {draftHyper && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">Actif</span>
                    )}
                    <input type="checkbox" checked={draftHyper} onChange={e => setDraftHyper(e.target.checked)}
                      className="w-5 h-5 rounded cursor-pointer accent-amber-500" />
                  </div>
                </label>
              </section>

              {/* ── SECTION 6: Recherche & Statut ── */}
              <section className="space-y-3 pt-1 border-t border-navy-100 dark:border-navy-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Search */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black uppercase text-navy-500 dark:text-navy-400 tracking-wider">
                      🔍 Recherche Mot-Clé
                    </label>
                    <div className="relative">
                      <input type="text" value={draftSearch} onChange={e => setDraftSearch(e.target.value)}
                        placeholder="ex: souffle systolique, HTA 2021..."
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white font-bold placeholder:font-normal focus:ring-2 focus:ring-brand-500" />
                      <Search className="w-3.5 h-3.5 text-navy-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black uppercase text-navy-500 dark:text-navy-400 tracking-wider">
                      🎯 Statut de Progression
                    </label>
                    <select value={draftStatus} onChange={e => setDraftStatus(e.target.value as StatusFilter)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white font-bold cursor-pointer">
                      <option value="ALL">Tous les QCMs</option>
                      <option value="UNSOLVED">⏳ Non résolus uniquement</option>
                      <option value="CORRECT">✓ Déjà réussis</option>
                      <option value="WRONG">✕ À réviser (Erreurs)</option>
                    </select>
                  </div>
                </div>
              </section>

            </div>{/* end modal body */}

            {/* Modal Footer — sticky */}
            <div className="shrink-0 border-t border-navy-100 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 p-4 sm:p-5">
              {/* Live preview counter */}
              <div className="flex items-center gap-2 mb-3 p-3 rounded-xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-xs font-black text-navy-950 dark:text-white">
                  <strong className="text-brand-600 dark:text-brand-400 text-sm">{draftPreviewCount}</strong>
                  {' '}QCM(s) correspondent à vos critères
                </span>
                {draftPreviewCount === 0 && (
                  <span className="ml-auto text-[10px] text-rose-500 font-bold">⚠️ Aucun résultat</span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button type="button" onClick={handleResetFilters}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-navy-600 dark:text-navy-300 border border-navy-200 dark:border-navy-700 hover:bg-navy-100 dark:hover:bg-navy-800 transition-all cursor-pointer flex items-center justify-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Réinitialiser</span>
                </button>

                <button type="button" onClick={() => applyFilters(false)}
                  className="flex-1 px-5 py-2.5 rounded-xl text-xs font-black bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all cursor-pointer flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Appliquer et Voir les QCMs ({draftPreviewCount})</span>
                </button>

                <button type="button" onClick={() => applyFilters(true)} disabled={draftPreviewCount === 0}
                  className="flex-1 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-soft transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>🚀 Lancer l'Épreuve Directement</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function QcmPage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-navy-500 space-y-3">
        <div className="w-10 h-10 rounded-full border-4 border-brand-600 border-t-transparent animate-spin mx-auto" />
        <p>Chargement de la banque QCM...</p>
      </div>
    }>
      <QcmHubContent />
    </Suspense>
  );
}
