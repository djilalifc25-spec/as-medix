'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { INITIAL_QCMS } from '@/lib/db/seedQcm';
import { INITIAL_COURSES } from '@/lib/db/seedCourses';
import { SpecialtyIcon } from '@/components/specialty/SpecialtyIcon';
import { SpecialtyLogo } from '@/components/brand/SpecialtyLogo';
import { useFaculty } from '@/components/context/FacultyContext';
import { useToast } from '@/components/context/ToastContext';
import { useSpecialtyTheme } from '@/components/context/SpecialtyThemeContext';
import { QcmLaunchModal } from '@/components/modals/QcmLaunchModal';
import { matchQcmToSource } from '@/lib/sourceUtils';
import { MedicalYear, Specialty } from '@/types';
import {
  Brain, Play, CheckCircle2, XCircle, RotateCcw, Award, ChevronRight, AlertTriangle, Bell,
  BookOpen, Sparkles, Clock, AlertCircle, HelpCircle, GraduationCap
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
  const [selectedYear, setSelectedYear] = useState<MedicalYear | 'TOUS'>(
    initialYear && initialYear >= 1 && initialYear <= 6 ? initialYear : 'TOUS'
  );
  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>(ALL_SPECIALTIES);
  const [reminderStats, setReminderStats] = useState<{ piegesCount: number; dueCount: number }>({ piegesCount: 0, dueCount: 0 });

  React.useEffect(() => {
    fetch('/api/specialties')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.specialties) && d.specialties.length > 0) {
          setSpecialtiesList(d.specialties);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    fetch('/api/reminders')
      .then(r => r.json())
      .then(d => {
        if (d.stats) {
          setReminderStats({
            piegesCount: d.stats.piegesCount || 0,
            dueCount: d.stats.dueTodayCount || 0
          });
        }
      })
      .catch(() => {});
  }, []);
  const [selectedSpecId, setSelectedSpecId] = useState<string>(initialSpec);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState<boolean>(false);
  const [modalSpecialtyId, setModalSpecialtyId] = useState<string>(initialSpec);
  const [modalInitialFolder, setModalInitialFolder] = useState<string | null>(null);

  React.useEffect(() => {
    if (selectedSpecId) {
      setActiveSpecialtyId(selectedSpecId);
    }
  }, [selectedSpecId, setActiveSpecialtyId]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourse);
  const [selectedSource, setSelectedSource] = useState<string>(initialSource);
  const [availableSources, setAvailableSources] = useState<string[]>([]);

  // Dynamic QCMs and Courses
  const [allQcms, setAllQcms] = useState(INITIAL_QCMS);
  const [allCourses, setAllCourses] = useState(INITIAL_COURSES);
  const [trainingMode, setTrainingMode] = useState<'COURSE' | 'SPECIALTY'>(initialCourse ? 'COURSE' : 'COURSE');
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

  // Load dynamic QCMs, Courses and User Progress
  React.useEffect(() => {
    fetch('/api/qcm')
      .then(r => r.json())
      .then(d => {
        if (d.qcms && Array.isArray(d.qcms)) {
          setAllQcms(d.qcms);
        }
      })
      .catch(() => {});

    fetch('/api/courses')
      .then(r => r.json())
      .then(d => {
        if (d.courses && Array.isArray(d.courses)) {
          setAllCourses(d.courses);
        }
      })
      .catch(() => {});

    fetch('/api/qcm/attempt')
      .then(r => r.json())
      .then(d => {
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
  }, []);

  // Reload sources whenever specialty, course or faculty changes
  React.useEffect(() => {
    const loadSources = () => {
      const params = new URLSearchParams();
      if (selectedSpecId) params.set('specialty', selectedSpecId);
      if (selectedCourseId) params.set('course', selectedCourseId);
      if (selectedFaculty && selectedFaculty !== 'TOUS') params.set('faculty', selectedFaculty);
      fetch(`/api/admin/sources?${params}`)
        .then(r => r.json())
        .then(d => { if (d.sources) setAvailableSources(d.sources); })
        .catch(() => {});
    };

    loadSources();
    window.addEventListener('asmedix-content-updated', loadSources);
    return () => {
      window.removeEventListener('asmedix-content-updated', loadSources);
    };
  }, [selectedSpecId, selectedCourseId, selectedFaculty]);

  const { showEmptySourceToast } = useToast();

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

  // Navigate to full-screen session with check for empty source
  const launchSession = (customSourceStr?: string, overrideCourseId?: string) => {
    const courseIdToUse = overrideCourseId !== undefined ? overrideCourseId : (trainingMode === 'SPECIALTY' ? '' : selectedCourseId);
    const spec = ALL_SPECIALTIES.find(s => s.id === selectedSpecId);
    const crs = allCourses.find(c => c.id === courseIdToUse);

    let srcToUse = customSourceStr;
    if (!srcToUse) {
      if (selectedSources.includes('TOUS') || selectedSources.length === 0) {
        srcToUse = 'TOUS';
      } else {
        srcToUse = selectedSources.join(',');
      }
    }

    const selectedSourcesList = srcToUse === 'TOUS' ? [] : srcToUse.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

    // Verify if there are matching questions
    const matchingCount = allQcms.filter(q => {
      const matchSpec = q.specialtyId === selectedSpecId;
      let matchCourse = true;
      if (courseIdToUse && courseIdToUse !== 'TOUS') {
        const qC = (q.courseId || '').toLowerCase();
        const qT = (q.courseTitle || '').toLowerCase();
        const target = courseIdToUse.toLowerCase();
        matchCourse = qC === target || qT === target || Boolean(crs && (qC === crs.id.toLowerCase() || (crs.slug && qC === crs.slug.toLowerCase()) || (crs.title && qT === crs.title.toLowerCase())));
      }
      const matchFac = selectedFaculty === 'TOUS' || !q.faculty || q.faculty === 'TOUS' || q.faculty === selectedFaculty;
      const matchSrc = selectedSourcesList.length === 0 || selectedSourcesList.some(s => matchQcmToSource(q, s));
      return matchSpec && matchCourse && matchFac && matchSrc;
    }).length;

    if (matchingCount === 0) {
      showEmptySourceToast(srcToUse === 'TOUS' ? 'Toutes les sources' : srcToUse, crs?.title || spec?.name);
      return;
    }

    const params = new URLSearchParams({
      specialty: selectedSpecId,
      course: courseIdToUse,
      source: srcToUse,
      faculty: selectedFaculty,
      specialtyName: spec?.name || selectedSpecId,
      courseName: crs?.title || courseIdToUse,
    });
    router.push(`/qcm-session?${params.toString()}`);
  };

  // Synchronize when searchParams change (sidebar clicks)
  React.useEffect(() => {
    const spec = searchParams.get('specialty');
    const crs = searchParams.get('course');
    const src = searchParams.get('source');
    const mode = searchParams.get('mode');

    if (spec) setSelectedSpecId(spec);
    if (mode === 'SPECIALTY') {
      setTrainingMode('SPECIALTY');
      setSelectedCourseId('');
    } else if (mode === 'COURSE' || crs) {
      setTrainingMode('COURSE');
      if (crs) setSelectedCourseId(crs);
    }
    if (src !== null) {
      setSelectedSource(src || 'TOUS');
      if (src) setSelectedSources(src.split(','));
    }
    setActiveQcmIndex(0);
  }, [searchParams]);

  // Quiz active session state
  const [activeQcmIndex, setActiveQcmIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [hasValidated, setHasValidated] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const activeSpecialty = specialtiesList.find(s => s.id === selectedSpecId) || ALL_SPECIALTIES.find(s => s.id === selectedSpecId) || ALL_SPECIALTIES[0];

  // Filtered specialties by Year and Faculty
  const filteredSpecialties = specialtiesList.filter(s => {
    const matchesYear = selectedYear === 'TOUS' || s.year === selectedYear;
    const matchesFac = selectedFaculty === 'TOUS' || !s.faculty || s.faculty === 'TOUS' || s.faculty === selectedFaculty;
    return matchesYear && matchesFac;
  });

  const specialtyCourses = allCourses.filter(c => {
    const matchSpec = c.specialtyId === selectedSpecId;
    const matchFac = selectedFaculty === 'TOUS' || !c.faculty || c.faculty === 'TOUS' || c.faculty === selectedFaculty;
    return matchSpec && matchFac;
  });

  // Filtered QCMs based on specialty, selected course, faculty, and source
  const currentQcms = allQcms.filter(q => {
    if (!q) return false;
    const qSpec = q.specialtyId || '';
    const matchSpec = qSpec.toLowerCase() === selectedSpecId.toLowerCase();
    let matchCourse = true;
    if (selectedCourseId && selectedCourseId !== 'TOUS') {
      const crs = allCourses.find(c => c.id === selectedCourseId);
      const qC = (q.courseId || '').toLowerCase();
      const qT = (q.courseTitle || '').toLowerCase();
      const target = selectedCourseId.toLowerCase();
      matchCourse = qC === target || qT === target || Boolean(crs && (qC === crs.id.toLowerCase() || (crs.slug && qC === crs.slug.toLowerCase()) || (crs.title && qT === crs.title.toLowerCase())));
    }
    const matchFaculty = selectedFaculty === 'TOUS' || !q.faculty || q.faculty === 'TOUS' || (q.faculty as string).toLowerCase() === selectedFaculty.toLowerCase();
    const matchSource = selectedSource === 'TOUS' || matchQcmToSource(q, selectedSource);
    return matchSpec && matchCourse && matchFaculty && matchSource;
  });

  const activeQcm = currentQcms[activeQcmIndex] || currentQcms[0];

  const handleSpecialtySelect = (specId: string) => {
    setSelectedSpecId(specId);
    setActiveSpecialtyId(specId);
    setModalSpecialtyId(specId);
    setModalInitialFolder(null);
    setIsLaunchModalOpen(true);
    setSelectedCourseId('');
    setActiveQcmIndex(0);
    setSelectedAnswers([]);
    setHasValidated(false);
    setCompleted(false);
    setScore(0);
  };

  const handleSourceClickFromDashboard = (src: string) => {
    if (src === 'TOUS') {
      launchSession('TOUS', '');
      return;
    }
    setSelectedSpecId(selectedSpecId);
    setActiveSpecialtyId(selectedSpecId);
    setModalSpecialtyId(selectedSpecId);
    setModalInitialFolder(src);
    setIsLaunchModalOpen(true);
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveQcmIndex(0);
    setSelectedAnswers([]);
    setHasValidated(false);
    setCompleted(false);
    setScore(0);
  };

  const toggleOption = (idx: number) => {
    if (hasValidated || !activeQcm) return;
    if (activeQcm.type === 'SINGLE') {
      setSelectedAnswers([idx]);
    } else {
      if (selectedAnswers.includes(idx)) {
        setSelectedAnswers(selectedAnswers.filter(i => i !== idx));
      } else {
        setSelectedAnswers([...selectedAnswers, idx]);
      }
    }
  };

  const handleValidate = () => {
    if (selectedAnswers.length === 0 || !activeQcm) return;
    setHasValidated(true);

    // Check if answers match exactly
    const isCorrect =
      Array.isArray(activeQcm.correctAnswers) &&
      selectedAnswers.length === activeQcm.correctAnswers.length &&
      selectedAnswers.every(ans => activeQcm.correctAnswers.includes(ans));

    if (isCorrect) {
      setScore(prev => prev + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }

    if (activeQcm) {
      fetch('/api/qcm/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qcmId: activeQcm.id,
          userAnswers: selectedAnswers,
          isCorrect,
          scorePercentage: isCorrect ? 100 : 0,
          timeSpentSeconds: 30
        })
      })
        .then(r => r.json())
        .then(d => {
          if (d.stats) {
            setUserStats({
              doneQcmIds: d.stats.doneQcmIds || [],
              statsBySpecialty: d.stats.statsBySpecialty || {},
              statsByCourse: d.stats.statsByCourse || {},
              statsBySource: d.stats.statsBySource || {}
            });
          }
        })
        .catch(() => {});
    }
  };

  const handleNext = () => {
    if (activeQcmIndex < currentQcms.length - 1) {
      setActiveQcmIndex(prev => prev + 1);
      setSelectedAnswers([]);
      setHasValidated(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setActiveQcmIndex(0);
    setSelectedAnswers([]);
    setHasValidated(false);
    setCompleted(false);
    setScore(0);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-600 text-white shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20">
              <Brain className="w-3.5 h-3.5" />
              <span>Programme Résidanat Algérie</span>
            </div>

            {/* Faculty Switcher Pill */}
            <div className="inline-flex items-center p-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              <button
                onClick={() => {
                  setSelectedFaculty('TOUS');
                  setActiveQcmIndex(0);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedFaculty === 'TOUS'
                    ? 'bg-white text-brand-700 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Toutes Facultés
              </button>
              <button
                onClick={() => {
                  setSelectedFaculty('ORAN');
                  setActiveQcmIndex(0);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedFaculty === 'ORAN'
                    ? 'bg-amber-400 text-navy-950 font-black shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span>🏛️ Oran</span>
              </button>
              <button
                onClick={() => {
                  setSelectedFaculty('SIDI_BEL_ABBES');
                  setActiveQcmIndex(0);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedFaculty === 'SIDI_BEL_ABBES'
                    ? 'bg-white text-indigo-900 font-black shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span>🏛️ Sidi Bel Abbès</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Banque QCM par Spécialité & par Cours
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
            Choisissez votre faculté (Oran ou Sidi Bel Abbès), sélectionnez le module médical et entraînez-vous sur des vignettes cliniques commentées.
          </p>
        </div>
      </div>

      {/* 2. STEP 1: MODULE / SPECIALTY SELECTOR (6 MEDICAL YEARS) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-black text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="text-xs font-black text-navy-950 dark:text-white uppercase tracking-wider">
              Étape 1 : Choisissez le Module Médical
            </h2>
          </div>
          <span suppressHydrationWarning className="text-xs text-navy-400 font-medium">
            {filteredSpecialties.length} modules disponibles
          </span>
        </div>

        {/* Medical Years Tabs for QCM */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedYear('TOUS')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedYear === 'TOUS'
                ? 'bg-brand-600 text-white shadow-xs font-black'
                : 'apple-pill text-navy-600 dark:text-navy-300 hover:border-brand-300'
            }`}
          >
            <span suppressHydrationWarning>🎓 Toutes ({specialtiesList.length})</span>
          </button>
          {MEDICAL_YEARS.map(y => {
            const isSelected = selectedYear === y.id;
            const count = specialtiesList.filter(s => s.year === y.id).length;
            return (
              <button
                key={y.id}
                onClick={() => setSelectedYear(y.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs font-black'
                    : 'apple-pill text-navy-600 dark:text-navy-300 hover:border-brand-300'
                }`}
              >
                <span>{y.label}</span>
                <span suppressHydrationWarning className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-navy-100 dark:bg-navy-800 text-navy-500'
                }`}>
                  {y.badge} ({count})
                </span>
              </button>
            );
          })}
        </div>

        {filteredSpecialties.length === 0 ? (
          <div className="apple-card p-8 text-center space-y-2">
            <span className="text-2xl block">🩺</span>
            <p className="text-xs font-bold text-navy-600 dark:text-navy-300">
              Aucune spécialité ne correspond aux filtres sélectionnés.
            </p>
            <button
              onClick={() => {
                setSelectedYear('TOUS');
                setSelectedFaculty('TOUS');
              }}
              className="text-xs text-brand-600 font-bold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {filteredSpecialties.map(spec => {
              const isSelected = selectedSpecId === spec.id;
              const specQcmCount = allQcms.filter(q => q.specialtyId === spec.id).length;
              const specDoneCount = allQcms.filter(q => q.specialtyId === spec.id && userStats.doneQcmIds.includes(q.id)).length;
              return (
                <button
                  key={spec.id}
                  onClick={() => handleSpecialtySelect(spec.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 relative overflow-hidden ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-600 dark:border-brand-500 ring-2 ring-brand-500/20 shadow-soft'
                      : 'bg-white dark:bg-navy-900 border-navy-100 dark:border-navy-800 hover:border-navy-300'
                  }`}
                >
                  <SpecialtyLogo specialtyId={spec.id} size="sm" withGlow={isSelected} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className={`text-xs font-bold truncate ${
                        isSelected ? 'text-brand-700 dark:text-brand-300' : 'text-navy-900 dark:text-white'
                      }`}>
                        {spec.name}
                      </div>
                      {spec.year && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 shrink-0">
                          {spec.year}A
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-navy-400 mt-0.5">
                      <span className="font-mono">{specQcmCount} QCM</span>
                      {specDoneCount > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          • {specDoneCount} fait{specDoneCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. STEP 2: MODE SELECTOR & COURSE SELECTOR */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              2
            </span>
            <h2 className="text-xs font-black text-navy-950 dark:text-white uppercase tracking-wider">
              Étape 2 : Mode de Révision ({trainingMode === 'COURSE' ? 'Par Cours' : 'Par Spécialité'})
            </h2>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1 rounded-2xl bg-navy-100 dark:bg-navy-800 border border-navy-200 dark:border-navy-700">
            <button
              type="button"
              onClick={() => {
                setTrainingMode('COURSE');
                if (!selectedCourseId && specialtyCourses[0]) {
                  setSelectedCourseId(specialtyCourses[0].id);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                trainingMode === 'COURSE'
                  ? 'bg-white dark:bg-navy-900 text-brand-700 dark:text-brand-300 shadow-sm font-black'
                  : 'text-navy-600 dark:text-navy-400 hover:text-navy-900'
              }`}
            >
              <span>📖</span>
              <span>Par Cours</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTrainingMode('SPECIALTY');
                setSelectedCourseId('');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                trainingMode === 'SPECIALTY'
                  ? 'bg-white dark:bg-navy-900 text-brand-700 dark:text-brand-300 shadow-sm font-black'
                  : 'text-navy-600 dark:text-navy-400 hover:text-navy-900'
              }`}
            >
              <span>🌐</span>
              <span>Toute la Spécialité</span>
            </button>
          </div>
        </div>

        {/* Course Cards / Pills when Mode Par Cours is active */}
        {trainingMode === 'COURSE' && (
          <div className="space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {specialtyCourses.map(c => {
                const isSelected = selectedCourseId === c.id;
                const count = allQcms.filter(q => q.courseId === c.id).length;
                const doneCount = allQcms.filter(q => q.courseId === c.id && userStats.doneQcmIds.includes(q.id)).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCourseSelect(c.id)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-soft font-black ring-2 ring-brand-500/30'
                        : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:border-brand-300'
                    }`}
                  >
                    <span>📖</span>
                    <span>{c.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-navy-100 dark:bg-navy-800 text-navy-500'
                    }`}>
                      {count} QCM{doneCount > 0 ? ` • ${doneCount} fait` : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Course Resource & Source Details Card */}
            {selectedCourseId && (
              <div className="p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/20 border-2 border-indigo-200 dark:border-indigo-800/60 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                        📘 Cours Sélectionné :
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white">
                        {allQcms.filter(q => q.courseId === selectedCourseId).length} QCMs
                        {allQcms.filter(q => q.courseId === selectedCourseId && userStats.doneQcmIds.includes(q.id)).length > 0 && (
                          ` (✓ ${allQcms.filter(q => q.courseId === selectedCourseId && userStats.doneQcmIds.includes(q.id)).length} faits)`
                        )}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-navy-950 dark:text-white mt-0.5">
                      {allCourses.find(c => c.id === selectedCourseId)?.title || selectedCourseId}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => launchSession()}
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-black shadow-soft flex items-center gap-2 shrink-0 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Lancer Session Plein Écran</span>
                  </button>
                </div>

                {/* Sources for this selected course */}
                <div className="space-y-2 pt-1 border-t border-indigo-200/50 dark:border-indigo-800/40">
                  <div className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 flex items-center justify-between">
                    <span>📚 Sources disponibles pour ce cours (Cochez pour combiner multiple) :</span>
                    <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                      {selectedSources.includes('TOUS') ? 'Toutes' : `${selectedSources.length} choisie(s)`}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(() => {
                      const totalCrs = allQcms.filter(q => q.courseId === selectedCourseId).length;
                      const doneCrs = allQcms.filter(q => q.courseId === selectedCourseId && userStats.doneQcmIds.includes(q.id)).length;
                      const isSelected = selectedSources.includes('TOUS');
                      return (
                        <button
                          type="button"
                          onClick={() => toggleSourceSelection('TOUS')}
                          className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                            isSelected
                              ? 'bg-indigo-600 text-white border border-indigo-500 shadow-md font-black'
                              : 'bg-white dark:bg-navy-900 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50'
                          }`}
                        >
                          <span>{isSelected ? '✓ 📋' : '📋'}</span>
                          <span>Toutes les Sources</span>
                          <span className="text-[10px] font-mono opacity-85">
                            ({totalCrs}){doneCrs > 0 ? ` • ${doneCrs} fait` : ''}
                          </span>
                        </button>
                      );
                    })()}

                    {availableSources.map(src => {
                      const count = allQcms.filter(q => q.courseId === selectedCourseId && q.source && q.source.toLowerCase().includes(src.toLowerCase())).length;
                      const doneCount = allQcms.filter(q => q.courseId === selectedCourseId && q.source && q.source.toLowerCase().includes(src.toLowerCase()) && userStats.doneQcmIds.includes(q.id)).length;
                      const isSelected = selectedSources.includes(src);
                      return (
                        <button
                          key={src}
                          type="button"
                          onClick={() => toggleSourceSelection(src)}
                          className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white border border-indigo-500 shadow-md font-black'
                              : 'bg-white dark:bg-navy-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50'
                          }`}
                        >
                          <span>{isSelected ? '✓ 📖' : '📖'}</span>
                          <span>{src}</span>
                          {count > 0 && (
                            <span className="text-[10px] font-mono opacity-85">
                              ({count}){doneCount > 0 ? ` • ${doneCount} fait` : ''}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Specialty Mode Details Card */}
        {trainingMode === 'SPECIALTY' && (
          <div className="p-5 rounded-3xl bg-brand-50/70 dark:bg-brand-950/20 border-2 border-brand-200 dark:border-brand-800/60 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-brand-700 dark:text-brand-300">
                    🌐 Module Transversal :
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-brand-600 text-white">
                    {allQcms.filter(q => q.specialtyId === selectedSpecId).length} QCMs
                    {allQcms.filter(q => q.specialtyId === selectedSpecId && userStats.doneQcmIds.includes(q.id)).length > 0 && (
                      ` (✓ ${allQcms.filter(q => q.specialtyId === selectedSpecId && userStats.doneQcmIds.includes(q.id)).length} faits)`
                    )}
                  </span>
                </div>
                <h3 className="text-sm font-black text-navy-950 dark:text-white mt-0.5">
                  Toutes les questions de {activeSpecialty.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => launchSession('TOUS', '')}
                className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-black shadow-soft flex items-center gap-2 shrink-0 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Lancer Session Transversale Plein Écran</span>
              </button>
            </div>

            <div className="space-y-2 pt-1 border-t border-brand-200/50 dark:border-brand-800/40">
              <div className="text-[11px] font-bold text-brand-900 dark:text-brand-300 flex items-center gap-1.5">
                <span>📚 Sources disponibles pour ce module :</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {['TOUS', ...availableSources].map(src => {
                  const isTous = src === 'TOUS';
                  const count = allQcms.filter(q => {
                    const matchSpec = q.specialtyId === selectedSpecId;
                    const matchFac = selectedFaculty === 'TOUS' || !q.faculty || q.faculty === 'TOUS' || q.faculty === selectedFaculty;
                    const matchSrc = isTous || (q.source && q.source.toLowerCase().includes(src.toLowerCase()));
                    return matchSpec && matchFac && matchSrc;
                  }).length;
                  const doneCount = allQcms.filter(q => {
                    const matchSpec = q.specialtyId === selectedSpecId;
                    const matchFac = selectedFaculty === 'TOUS' || !q.faculty || q.faculty === 'TOUS' || q.faculty === selectedFaculty;
                    const matchSrc = isTous || (q.source && q.source.toLowerCase().includes(src.toLowerCase()));
                    return matchSpec && matchFac && matchSrc && userStats.doneQcmIds.includes(q.id);
                  }).length;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => handleSourceClickFromDashboard(src)}
                      className="group flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-navy-900 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 hover:bg-brand-600 hover:text-white transition-all shadow-xs cursor-pointer"
                    >
                      <span>{isTous ? '📋' : '📁'}</span>
                      <span className="font-bold">{src}</span>
                      {count > 0 && (
                        <span className="text-[10px] font-mono opacity-80">
                          ({count}){doneCount > 0 ? ` • ${doneCount} fait` : ''}
                        </span>
                      )}
                      <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">📂</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>


      {/* 4. STEP 3: HIGH-END PROFESSIONAL QCM PRESENTATION */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-black text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="text-xs font-black text-navy-950 dark:text-white uppercase tracking-wider">
              Étape 3 : Épreuve & Entraînement Clinique
            </h2>
          </div>
          {currentQcms.length > 0 && !completed && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-black font-mono border border-brand-200 dark:border-brand-800">
                Question {activeQcmIndex + 1} / {currentQcms.length}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 text-xs font-bold font-mono">
                Fait : {activeQcmIndex} / {currentQcms.length}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono border border-emerald-200 dark:border-emerald-800/40">
                ✓ {score} correct{score > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {currentQcms.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 space-y-2">
            <HelpCircle className="w-8 h-8 text-navy-300 mx-auto" />
            <p className="text-xs text-navy-500">Aucun QCM spécifique pour ce filtre. Sélectionnez un autre cours ou module.</p>
          </div>
        ) : completed ? (
          /* COMPLETION SCORE CARD */
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-navy-950 dark:text-white">
              Épreuve terminée !
            </h3>
            <div className="text-3xl font-black text-brand-600 dark:text-brand-400">
              Score : {score} / {currentQcms.length} ({Math.round((score / currentQcms.length) * 100)}%)
            </div>
            <p className="text-xs text-navy-500 max-w-sm mx-auto">
              Vos résultats ont été enregistrés dans votre progression globale.
            </p>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-soft"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer cette série</span>
            </button>
          </div>
        ) : (
          /* ACTIVE QCM CARD */
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-6">
            {/* Badges bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-navy-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  {activeQcm?.specialtyName || activeSpecialty.name}
                </span>
                {activeQcm?.faculty === 'ORAN' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    🏛️ Oran
                  </span>
                )}
                {activeQcm?.faculty === 'SIDI_BEL_ABBES' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    🏛️ Sidi Bel Abbès
                  </span>
                )}
                {activeQcm?.source && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    📖 Source : {activeQcm.source}
                  </span>
                )}
                {activeQcm?.courseTitle && (
                  <span className="text-xs font-medium text-navy-500">
                    Cours : <strong>{activeQcm.courseTitle}</strong>
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-navy-500">
                {activeQcm?.type === 'MULTIPLE' ? '☑️ Choix Multiple' : '🔘 Choix Simple'}
              </span>
            </div>

            {/* Vignette */}
            {activeQcm?.vignetteHtml ? (
              <div
                className="p-5 rounded-2xl bg-navy-50 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-700 text-xs sm:text-sm text-navy-800 dark:text-navy-200 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: activeQcm.vignetteHtml }}
              />
            ) : activeQcm?.vignette ? (
              <div className="p-5 rounded-2xl bg-navy-50 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-700 text-xs sm:text-sm text-navy-800 dark:text-navy-200 leading-relaxed italic">
                "{activeQcm.vignette}"
              </div>
            ) : null}

            {/* Question */}
            <h3 className="text-base sm:text-lg font-bold text-navy-950 dark:text-white">
              {activeQcm?.question || ''}
            </h3>

            {/* Options List */}
            <div className="space-y-2">
              {(activeQcm?.options || []).map((opt, idx) => {
                if (!opt) return null;
                const isSelected = selectedAnswers.includes(idx);
                const isCorrect = Array.isArray(activeQcm?.correctAnswers) && activeQcm.correctAnswers.includes(idx);

                let optClass = 'border-navy-200 dark:border-navy-700 hover:border-brand-400 bg-white dark:bg-navy-900 text-navy-800 dark:text-navy-200';
                if (hasValidated) {
                  if (isCorrect) {
                    optClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through';
                  }
                } else if (isSelected) {
                  optClass = 'border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 font-bold ring-2 ring-brand-500/20';
                }

                return (
                  <div
                    key={opt.id || `opt_${idx}`}
                    onClick={() => toggleOption(idx)}
                    className={`py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-xl sm:rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 text-xs sm:text-sm active:scale-[0.99] ${optClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                        hasValidated && isCorrect
                          ? 'bg-emerald-500 text-white'
                          : hasValidated && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300'
                      }`}>
                        {opt.letter || String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{opt.text || ''}</span>
                    </div>

                    {hasValidated && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {hasValidated && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Validation CTA or Immediate Next Question Button */}
            {!hasValidated ? (
              <button
                onClick={handleValidate}
                disabled={selectedAnswers.length === 0}
                className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm shadow-soft transition-all active:scale-95 cursor-pointer"
              >
                Valider ma réponse
              </button>
            ) : (
              <div className="space-y-4 pt-1 animate-in fade-in">
                {/* Immediate Next Question Button right above explanation */}
                <button
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <span>{activeQcmIndex < currentQcms.length - 1 ? 'Question Suivante' : 'Terminer l\'Épreuve'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Explanation Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Justification Médicale & Physiopathologique :</span>
                  </div>
                  <div className="text-xs sm:text-sm text-navy-800 dark:text-navy-200 leading-relaxed">
                    {activeQcm?.explanationHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: activeQcm.explanationHtml }} />
                    ) : (
                      <p>{activeQcm?.explanation || 'Pas d\'explication fournie.'}</p>
                    )}
                  </div>
                  {activeQcm?.reference && (
                    <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold pt-1 border-t border-emerald-100 dark:border-emerald-800/40">
                      Source officielle : {activeQcm.reference}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive QCM Launch Modal (Par spécialité totale / Par cours -> Sources -> Plein écran) */}
      <QcmLaunchModal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        specialtyId={modalSpecialtyId || selectedSpecId}
        initialSourceFolder={modalInitialFolder}
      />
    </div>
  );
}

export default function QcmPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-navy-400">Chargement du moteur QCM...</div>}>
      <QcmHubContent />
    </Suspense>
  );
}
