'use client';

import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { INITIAL_QCMS } from '@/lib/db/seedQcm';
import {
  ChevronLeft, ChevronRight, X, CheckCircle2, XCircle,
  RotateCcw, Award, BookOpen, Brain, Zap,
  HelpCircle, Flag, ChevronDown, Check, ArrowRight, Bell,
  Eye, EyeOff, Sparkles, SlidersHorizontal, Lock, Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReminderModal } from '@/components/study/ReminderModal';
import { CoursePreviewModal } from '@/components/qcm/CoursePreviewModal';
import { StudyReminder, User } from '@/types';
import { matchQcmToSource } from '@/lib/sourceUtils';

// Helper to verify user permissions for QCM access level
function canUserAccessQcm(user: { role?: string; plan?: string } | null, accessLevel?: string): boolean {
  if (!accessLevel || accessLevel === 'FREE') return true;
  if (!user) return false;
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return true;
  if (accessLevel === 'PRO') {
    return user.plan === 'PRO' || user.plan === 'PREMIUM';
  }
  if (accessLevel === 'PREMIUM') {
    return user.plan === 'PREMIUM';
  }
  return true;
}

// Helper for strict grading
function isAnswerCorrect(selected: number[], correctAnswers?: number[]) {
  if (!Array.isArray(correctAnswers) || correctAnswers.length === 0) return false;
  if (!Array.isArray(selected)) return false;
  if (correctAnswers.length === 1 && selected.length > 1) {
    return false;
  }
  return selected.length === correctAnswers.length && selected.every(a => correctAnswers.includes(a));
}

// ── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Question Navigator Overlay Grid ────────────────────────────────────────────────
function QuestionNavigator({
  total,
  current,
  userAnswersMap,
  flaggedQuestionsMap,
  isResultsRevealed,
  revealedSingleQcmMap,
  validatedImmediateMap,
  qcms,
  onJump,
  onClose,
}: {
  total: number;
  current: number;
  userAnswersMap: Record<number, number[]>;
  flaggedQuestionsMap: Record<number, boolean>;
  isResultsRevealed: boolean;
  revealedSingleQcmMap?: Record<number, boolean>;
  validatedImmediateMap?: Record<number, boolean>;
  qcms: any[];
  onJump: (i: number) => void;
  onClose: () => void;
}) {
  const answeredCount = Object.keys(userAnswersMap).filter(k => (userAnswersMap[Number(k)] || []).length > 0).length;
  const remainingCount = total - answeredCount;

  let correctCount = 0;
  let incorrectCount = 0;
  let revealedCount = 0;

  (qcms || []).forEach((q, i) => {
    const selected = userAnswersMap[i] || [];
    const isRevealed = isResultsRevealed || !!validatedImmediateMap?.[i] || !!revealedSingleQcmMap?.[i];
    if (isRevealed && selected.length > 0) {
      revealedCount++;
      const isCorrect = q && isAnswerCorrect(selected, q.correctAnswers);
      if (isCorrect) correctCount++;
      else incorrectCount++;
    }
  });

  return (
    <div className="absolute top-14 right-2 sm:right-4 z-50 bg-slate-900/98 dark:bg-navy-950/98 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-4 w-72 sm:w-80 animate-in fade-in zoom-in-95 duration-150 text-white">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black uppercase tracking-wider text-white">
          Grille de Réponses ({total} QCMs)
        </span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-center mb-3 text-[10px]">
        <div>
          <div className="font-mono text-xs font-black text-white">{answeredCount}/{total}</div>
          <div className="text-white/50">Répondues</div>
        </div>
        {(isResultsRevealed || revealedCount > 0) ? (
          <>
            <div>
              <div className="font-mono text-xs font-black text-emerald-400">{correctCount}</div>
              <div className="text-white/50">Vérifiées OK</div>
            </div>
            <div>
              <div className="font-mono text-xs font-black text-rose-400">{incorrectCount}</div>
              <div className="text-white/50">Erreurs</div>
            </div>
          </>
        ) : (
          <div className="col-span-2 flex items-center justify-center gap-1.5 text-sky-300 font-medium">
            <EyeOff className="w-3.5 h-3.5" />
            <span>Mode Épreuve En Cours</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
        {Array.from({ length: total }).map((_, i) => {
          const selected = userAnswersMap[i] || [];
          const isAnswered = selected.length > 0;
          const isFlagged = flaggedQuestionsMap[i];
          const isRevealed = isResultsRevealed || !!validatedImmediateMap?.[i] || !!revealedSingleQcmMap?.[i];
          const q = (qcms || [])[i];

          let cls = 'bg-white/10 text-white/60 hover:bg-white/20';
          if (i === current) {
            cls = 'bg-sky-500 text-white font-black ring-2 ring-sky-300 shadow-md';
          } else if (isRevealed && isAnswered) {
            const isCorrect = q && isAnswerCorrect(selected, q.correctAnswers);
            cls = isCorrect ? 'bg-emerald-500 text-white font-bold' : 'bg-rose-500 text-white font-bold';
          } else if (isAnswered) {
            cls = 'bg-indigo-600 text-indigo-100 font-bold border border-indigo-400/40';
          }

          const isPro = q?.accessLevel === 'PRO';
          const isPremium = q?.accessLevel === 'PREMIUM';

          return (
            <button
              key={i}
              onClick={() => { onJump(i); onClose(); }}
              className={`relative w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${cls}`}
            >
              <span>{i + 1}</span>
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-[8px] text-slate-950 shadow">
                  🚩
                </span>
              )}
              {isPro && (
                <span className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-amber-400 border border-slate-900 shadow" title="Plan Pro 4500 DA" />
              )}
              {isPremium && (
                <span className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-purple-400 border border-slate-900 shadow" title="Premium" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-1 mt-3 pt-2.5 border-t border-white/10 text-[9px] text-white/60 flex-wrap">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-indigo-600 inline-block" /> Coché</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500 inline-block" /> Flag 🚩</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Pro 4500</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> Premium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-sky-500 inline-block" /> Actif</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-white/10 inline-block" /> Restant ({remainingCount})</span>
      </div>
    </div>
  );
}

// ── Completion Screen ─────────────────────────────────────────────────────────
function CompletionScreen({
  score,
  total,
  specialty,
  course,
  source,
  onRestart,
  onReviewPrevious,
  onExit,
}: {
  score: number;
  total: number;
  specialty: string;
  course: string;
  source: string;
  onRestart: () => void;
  onReviewPrevious?: () => void;
  onExit: () => void;
}) {
  const safeTotal = total > 0 ? total : 1;
  const safeScore = Math.max(0, Math.min(score || 0, safeTotal));
  const pct = Math.round((safeScore / safeTotal) * 100);
  const grade = pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien !' : pct >= 40 ? 'Passable' : 'À retravailler';
  const gradeColor = pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : pct >= 40 ? 'text-orange-400' : 'text-rose-400';
  const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : pct >= 40 ? 'bg-orange-500' : 'bg-rose-500';

  useEffect(() => {
    if (pct >= 80) {
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, colors: ['#10b981', '#3b82f6', '#8b5cf6'] });
    }
  }, [pct]);

  const handleQuitFullScreenAndExit = () => {
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    onExit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-5 text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30">
          <Award className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </div>
        <div className="space-y-1.5">
          <div className={`text-4xl sm:text-5xl font-black ${gradeColor}`}>{pct}%</div>
          <div className={`text-base sm:text-lg font-bold ${gradeColor}`}>{grade}</div>
          <div className="text-xs sm:text-sm text-white/70">
            <strong>{safeScore}</strong> bonne{safeScore > 1 ? 's' : ''} réponse{safeScore > 1 ? 's' : ''} sur <strong>{total}</strong> questions
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-1.5 text-xs text-white/70">
          {specialty && <div>Spécialité : <strong className="text-white">{specialty}</strong></div>}
          {course && <div>Cours : <strong className="text-white">{course}</strong></div>}
          {source && source !== 'TOUS' && <div>Source : <strong className="text-white">{source}</strong></div>}
        </div>

        <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`} style={{ width: `${pct}%` }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          {onReviewPrevious && (
            <button
              onClick={onReviewPrevious}
              className="w-full px-4 py-3 rounded-2xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer border border-indigo-400/30"
              title="Revenir et consulter les questions/réponses précédentes"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Revoir QCM Précédent</span>
            </button>
          )}

          <button
            onClick={onRestart}
            className="w-full px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-white/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recommencer</span>
          </button>

          <button
            onClick={handleQuitFullScreenAndExit}
            className="w-full px-4 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs transition-all shadow-lg cursor-pointer"
          >
            Quitter Plein Écran / Hub
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Session Content ──────────────────────────────────────────────────────
function SessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const specialty = searchParams.get('specialty') || '';
  const course = searchParams.get('course') || '';
  const source = searchParams.get('source') || 'TOUS';
  const faculty = searchParams.get('faculty') || 'TOUS';
  const qcmId = searchParams.get('qcmId') || '';
  const remindersOnly = searchParams.get('remindersOnly') === 'true';
  const specialtyName = searchParams.get('specialtyName') || specialty;
  const courseName = searchParams.get('courseName') || course;

  const [allQcms, setAllQcms] = useState(INITIAL_QCMS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id?: string; name?: string; role?: string; plan?: string } | null>(null);
  const [showVignetteDetails, setShowVignetteDetails] = useState(false);
  const [userReminders, setUserReminders] = useState<StudyReminder[]>([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  // Advanced Session State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswersMap, setUserAnswersMap] = useState<Record<number, number[]>>({});
  const [eliminatedOptionsMap, setEliminatedOptionsMap] = useState<Record<number, number[]>>({});
  const [flaggedQuestionsMap, setFlaggedQuestionsMap] = useState<Record<number, boolean>>({});
  const [isResultsRevealed, setIsResultsRevealed] = useState(false);
  const [sessionMode, setSessionMode] = useState<'DEFERRED' | 'IMMEDIATE'>('DEFERRED');
  const [validatedImmediateMap, setValidatedImmediateMap] = useState<Record<number, boolean>>({});
  const [revealedSingleQcmMap, setRevealedSingleQcmMap] = useState<Record<number, boolean>>({});
  const [allCourses, setAllCourses] = useState<any[]>([]);

  const [completed, setCompleted] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user) setCurrentUser(d.user);
      })
      .catch(() => {});

    fetch('/api/qcm', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (d.qcms && d.qcms.length > 0) {
          setAllQcms(d.qcms);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });

    fetch('/api/courses')
      .then(r => r.json())
      .then(d => {
        if (d.courses && Array.isArray(d.courses)) {
          setAllCourses(d.courses);
        }
      })
      .catch(() => {});

    fetch('/api/reminders')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.reminders)) {
          setUserReminders(d.reminders);
        }
      })
      .catch(() => {});
  }, []);

  const sessionQcms = useMemo(() => {
    if (qcmId) {
      const target = allQcms.filter(q => q && q.id === qcmId);
      if (target.length > 0) return target;
    }
    if (remindersOnly) {
      const targetIds = userReminders.map(r => r.targetId);
      const flagged = allQcms.filter(q => q && targetIds.includes(q.id));
      if (flagged.length > 0) return flagged;
    }
    const selectedSourcesList = source === 'TOUS' || !source
      ? []
      : source.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

    // Find course object for matching
    const crsObj = course && course !== 'TOUS' 
      ? allCourses.find(c => c.id === course || c.slug === course || c.title?.toLowerCase() === course.toLowerCase())
      : null;

    return allQcms.filter(q => {
      if (!q) return false;
      const qSpec = (q.specialtyId || '').toLowerCase();
      const qSpecName = (q.specialtyName || '').toLowerCase();
      const matchSpec = !specialty || specialty === 'TOUS' || qSpec === specialty.toLowerCase() || qSpecName === specialty.toLowerCase();
      
      let matchCourse = true;
      if (course && course !== 'TOUS') {
        const qCourse = (q.courseId || '').toLowerCase();
        const qCourseTitle = (q.courseTitle || '').toLowerCase();
        const targetCourseVal = course.toLowerCase();
        
        matchCourse = 
          qCourse === targetCourseVal ||
          qCourseTitle === targetCourseVal ||
          Boolean(crsObj && (
            qCourse === crsObj.id?.toLowerCase() ||
            qCourse === crsObj.slug?.toLowerCase() ||
            (crsObj.title && qCourseTitle === crsObj.title.toLowerCase())
          ));
      }
      
      const matchFaculty = faculty === 'TOUS' || !q.faculty || (q.faculty as string) === 'TOUS' || (q.faculty as string) === faculty;
      const matchSource = selectedSourcesList.length === 0 || selectedSourcesList.some(s => matchQcmToSource(q, s));
      return matchSpec && matchCourse && matchFaculty && matchSource;
    });
  }, [allQcms, specialty, course, faculty, source, qcmId, remindersOnly, userReminders, allCourses]);

  const totalCount = sessionQcms.length;
  const answeredCount = Object.keys(userAnswersMap).filter(k => (userAnswersMap[Number(k)] || []).length > 0).length;
  const safeCurrentIndex = totalCount > 0 ? Math.min(Math.max(0, currentIndex), totalCount - 1) : 0;
  const currentNumber = safeCurrentIndex + 1;
  const qcm = totalCount > 0 ? sessionQcms[safeCurrentIndex] : null;
  const currentQcmReminder = qcm ? userReminders.find(r => r.targetId === qcm.id && r.status === 'pending') : null;

  // Resolve target course for 100% 1-click navigation
  const targetCourse = useMemo(() => {
    if (!qcm) return null;
    if (qcm.courseId) {
      const found = allCourses.find(c => c.id === qcm.courseId || c.slug === qcm.courseId);
      if (found) return found;
    }
    if (qcm.courseTitle) {
      const found = allCourses.find(c => c.title?.toLowerCase() === qcm.courseTitle?.toLowerCase());
      if (found) return found;
    }
    if (course && course !== 'TOUS') {
      const found = allCourses.find(c => c.id === course || c.slug === course);
      if (found) return found;
    }
    return null;
  }, [qcm, allCourses, course]);

  const targetCourseSlug = targetCourse?.slug || targetCourse?.id || qcm?.courseId || course;
  const targetCourseTitle = targetCourse?.title || qcm?.courseTitle || courseName || 'Consulter le cours';

  const isLockedForUser = useMemo(() => {
    if (!qcm) return false;
    return !canUserAccessQcm(currentUser, qcm.accessLevel);
  }, [qcm, currentUser]);

  // Selected & Eliminated options for current QCM
  const currentSelectedOptions = userAnswersMap[safeCurrentIndex] || [];
  const currentEliminatedOptions = eliminatedOptionsMap[safeCurrentIndex] || [];
  const isCurrentFlagged = flaggedQuestionsMap[safeCurrentIndex] || false;
  const isCurrentValidatedImmediate = validatedImmediateMap[safeCurrentIndex] || false;
  const isThisQcmRevealed = isResultsRevealed || (sessionMode === 'IMMEDIATE' && isCurrentValidatedImmediate) || !!revealedSingleQcmMap[safeCurrentIndex];

  // Keep currentIndex synchronized if session length changes
  useEffect(() => {
    if (currentIndex >= sessionQcms.length && sessionQcms.length > 0) {
      setCurrentIndex(0);
    }
  }, [sessionQcms.length, currentIndex]);

  // Calculate global score using strict QCS / QCM rules
  const finalScore = useMemo(() => {
    let scoreAcc = 0;
    sessionQcms.forEach((q, idx) => {
      if (!q || !Array.isArray(q.correctAnswers)) return;
      const selected = userAnswersMap[idx] || [];
      if (isAnswerCorrect(selected, q.correctAnswers)) {
        scoreAcc += 1;
      }
    });
    return scoreAcc;
  }, [sessionQcms, userAnswersMap]);

  // Toggle option selection (Multi-select checkbox for ALL questions, never forcing single selection in UI)
  const toggleOption = (optIdx: number) => {
    if (isLockedForUser || isThisQcmRevealed) return;

    setUserAnswersMap(prev => {
      const currentArr = prev[safeCurrentIndex] || [];
      const updatedArr = currentArr.includes(optIdx)
        ? currentArr.filter(i => i !== optIdx)
        : [...currentArr, optIdx];
      return { ...prev, [safeCurrentIndex]: updatedArr };
    });
  };

  // Option strike-through toggle (Rayure ❌)
  const toggleEliminateOption = (e: React.MouseEvent, optIdx: number) => {
    e.stopPropagation();
    if (isLockedForUser || isThisQcmRevealed) return;

    setEliminatedOptionsMap(prev => {
      const currentArr = prev[safeCurrentIndex] || [];
      const updatedArr = currentArr.includes(optIdx)
        ? currentArr.filter(i => i !== optIdx)
        : [...currentArr, optIdx];
      return { ...prev, [safeCurrentIndex]: updatedArr };
    });
  };

  // Flag question toggle (🚩)
  const toggleFlagQuestion = () => {
    setFlaggedQuestionsMap(prev => ({
      ...prev,
      [safeCurrentIndex]: !prev[safeCurrentIndex]
    }));
  };

  // Individual Question Reveal / Hide handler ("Voir la réponse de ce QCM (Uniquement)")
  const handleToggleRevealCurrentQuestion = () => {
    if (!qcm) return;
    setRevealedSingleQcmMap(prev => {
      const nextVal = !prev[safeCurrentIndex];
      if (nextVal) {
        const isCorrect = isAnswerCorrect(currentSelectedOptions, qcm.correctAnswers);
        if (isCorrect) {
          confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });
        }
        // Save attempt asynchronously
        fetch('/api/qcm/attempt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qcmId: qcm.id,
            userAnswers: currentSelectedOptions,
            isCorrect,
            scorePercentage: isCorrect ? 100 : 0,
            timeSpentSeconds: 15
          })
        }).catch(() => {});
      }
      return { ...prev, [safeCurrentIndex]: nextVal };
    });
  };

  // Advance / Previous
  const handleNext = useCallback(() => {
    if (currentIndex < sessionQcms.length - 1) {
      setCurrentIndex(i => i + 1);
      setShowVignetteDetails(false);
    } else {
      if (!isResultsRevealed && sessionMode === 'DEFERRED') {
        setIsResultsRevealed(true);
      } else {
        setCompleted(true);
      }
    }
  }, [currentIndex, sessionQcms.length, isResultsRevealed, sessionMode]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setShowVignetteDetails(false);
    }
  }, [currentIndex]);

  // Validate answer in immediate mode
  const handleValidateImmediate = useCallback(() => {
    if (!qcm || currentSelectedOptions.length === 0 || isCurrentValidatedImmediate) return;

    setValidatedImmediateMap(prev => ({ ...prev, [safeCurrentIndex]: true }));

    const isCorrect = isAnswerCorrect(currentSelectedOptions, qcm.correctAnswers);

    if (isCorrect) {
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.7 }, ticks: 50 });
    }

    // Persist attempt to server
    fetch('/api/qcm/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qcmId: qcm.id,
        userAnswers: currentSelectedOptions,
        isCorrect,
        scorePercentage: isCorrect ? 100 : 0,
        timeSpentSeconds: 20
      })
    }).catch(() => {});
  }, [qcm, currentSelectedOptions, isCurrentValidatedImmediate, safeCurrentIndex]);

  // Reveal all deferred results
  const handleRevealAllResults = useCallback(() => {
    setIsResultsRevealed(true);
    if (finalScore / totalCount >= 0.8) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  }, [finalScore, totalCount]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'Enter') {
      if (sessionMode === 'IMMEDIATE' && !isCurrentValidatedImmediate && currentSelectedOptions.length > 0) {
        handleValidateImmediate();
      } else {
        handleNext();
      }
    }
    if (e.key === 'Escape') router.push('/qcm');
  }, [handleNext, handlePrev, sessionMode, isCurrentValidatedImmediate, currentSelectedOptions, handleValidateImmediate, router]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleJump = (i: number) => {
    setCurrentIndex(i);
    setShowVignetteDetails(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswersMap({});
    setEliminatedOptionsMap({});
    setFlaggedQuestionsMap({});
    setIsResultsRevealed(false);
    setRevealedSingleQcmMap({});
    setValidatedImmediateMap({});
    setCompleted(false);
    setShowVignetteDetails(false);
  };

  // Touch swipe handling for mobile scrolling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 60) handleNext();
    else if (diffX < -60) handlePrev();
    setTouchStartX(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-white">
          <Brain className="w-8 h-8 animate-pulse text-sky-400" />
          <span className="text-sm font-bold">Chargement des QCMs...</span>
        </div>
      </div>
    );
  }

  if (sessionQcms.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-slate-900 to-indigo-950 flex items-center justify-center text-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/10 space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mx-auto border border-amber-500/30">
            ⚠️
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Aucun QCM dans cette Source</h2>
            <p className="text-xs text-white/70 leading-relaxed">
              La source <strong className="text-amber-300">« {source === 'TOUS' ? 'Toutes les sources' : source} »</strong> ne contient pas encore de questions associées {courseName ? `au cours « ${courseName} »` : `à cette sélection`}.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => router.push('/qcm')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs transition-all shadow-md cursor-pointer"
            >
              ← Retour au Hub QCM
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <CompletionScreen
        score={finalScore} total={sessionQcms.length}
        specialty={specialtyName} course={courseName} source={source}
        onRestart={handleRestart}
        onReviewPrevious={() => {
          setCompleted(false);
          setIsResultsRevealed(true);
          setCurrentIndex(Math.max(0, sessionQcms.length - 1));
        }}
        onExit={() => router.push('/qcm')}
      />
    );
  }

  const isExplanationShown = isThisQcmRevealed;

  return (
    <div
      className="min-h-[100dvh] sm:h-[100dvh] flex flex-col bg-gradient-to-br from-navy-950 via-slate-900 to-indigo-950 overflow-y-auto sm:overflow-hidden relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── 1. TOP CONTROL & STATS BAR ── */}
      <header className="shrink-0 bg-navy-950/90 backdrop-blur-xl border-b border-white/10 px-3 pb-2 sm:px-4 sm:pb-2.5 relative z-30" style={{ paddingTop: "max(0.625rem, env(safe-area-inset-top, 0px))" }}>
        <div className="max-w-4xl mx-auto space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Exit + Title + Course Preview Link */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => router.push('/qcm')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
                title="Quitter la session"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quitter</span>
              </button>

              <div className="min-w-0 flex items-center gap-1.5 text-xs truncate">
                <span className="font-bold text-white truncate max-w-[120px] sm:max-w-[180px]">
                  {courseName || specialtyName}
                </span>

                {/* Course preview passerelle button */}
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(true)}
                  className="px-2 py-0.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 flex items-center gap-1 shrink-0 active:scale-95 cursor-pointer"
                  title="Voir le support de cours théorique"
                >
                  <BookOpen className="w-3 h-3 text-indigo-400" />
                  <span className="hidden sm:inline">📘 Voir Cours</span>
                </button>

                {targetCourseSlug && (
                  <Link
                    href={`/cours/${targetCourseSlug}`}
                    target="_blank"
                    className="hidden md:flex px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold border border-white/15 items-center gap-1 shrink-0 active:scale-95"
                    title="Ouvrir la page complète du cours dans un nouvel onglet"
                  >
                    <span>Ouvrir Cours ↗</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Right: Mode Switch & Navigator */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Mode Toggle Button */}
              <button
                type="button"
                onClick={() => setSessionMode(m => m === 'DEFERRED' ? 'IMMEDIATE' : 'DEFERRED')}
                className={`px-2 py-1 rounded-xl text-[10px] font-bold border flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                  sessionMode === 'DEFERRED'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
                title="Basculer entre Mode Examen (Grille) et Entraînement Immédiat"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span className="hidden xs:inline">{sessionMode === 'DEFERRED' ? 'Grille Différée' : 'Immédiat'}</span>
              </button>

              {/* Current QCM Badge */}
              <div className="px-2.5 py-1 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-black font-mono">
                Q {currentNumber}/{totalCount}
              </div>

              {/* Answered Count Badge */}
              <div className="px-2 py-1 rounded-xl bg-white/10 text-white text-[11px] font-bold font-mono flex items-center gap-1" title="QCMs répondus dans la grille">
                <span className="text-white/60 text-[10px]">Coché:</span>
                <span className="font-black text-white">{answeredCount}</span>
                <span className="text-white/40">/{totalCount}</span>
              </div>

              {/* Navigator button */}
              <button
                onClick={() => setShowNavigator(v => !v)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer"
                title="Ouvrir la grille complète des questions"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showNavigator ? 'rotate-180 text-sky-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Horizontal Scrollable QCM Strip for 1-Click Jump */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 scrollbar-none max-w-4xl mx-auto">
            {sessionQcms.map((q, idx) => {
              const selected = userAnswersMap[idx] || [];
              const isAnswered = selected.length > 0;
              const isFlagged = flaggedQuestionsMap[idx];
              const isRevealedForIdx = isResultsRevealed || (sessionMode === 'IMMEDIATE' && validatedImmediateMap[idx]) || !!revealedSingleQcmMap[idx];

              let pillStyle = 'bg-white/10 text-white/70 hover:bg-white/20';

              if (idx === safeCurrentIndex) {
                pillStyle = 'bg-sky-500 text-white font-black ring-2 ring-sky-300 scale-105 shadow-sm';
              } else if (isRevealedForIdx && isAnswered) {
                const isCorrect = isAnswerCorrect(selected, q.correctAnswers);
                pillStyle = isCorrect ? 'bg-emerald-500 text-white font-bold' : 'bg-rose-500 text-white font-bold';
              } else if (isAnswered) {
                pillStyle = 'bg-indigo-600 text-indigo-100 font-bold border border-indigo-400/40';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleJump(idx)}
                  className={`relative h-6 min-w-[30px] px-2 rounded-lg text-[10px] font-mono shrink-0 transition-all active:scale-95 cursor-pointer flex items-center justify-center ${pillStyle}`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && <span className="ml-0.5 text-[8px]">🚩</span>}
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <ProgressBar current={answeredCount} total={totalCount} />
        </div>

        {/* Dropdown Navigator Overlay */}
        {showNavigator && (
          <QuestionNavigator
            total={sessionQcms.length}
            current={safeCurrentIndex}
            userAnswersMap={userAnswersMap}
            flaggedQuestionsMap={flaggedQuestionsMap}
            isResultsRevealed={isResultsRevealed}
            revealedSingleQcmMap={revealedSingleQcmMap}
            validatedImmediateMap={validatedImmediateMap}
            qcms={sessionQcms}
            onJump={handleJump}
            onClose={() => setShowNavigator(false)}
          />
        )}
      </header>

      {/* ── 2. QUESTION BODY ── */}
      <main className="flex-1 overflow-y-auto overscroll-contain px-3 py-2.5 sm:px-4 sm:py-4">
        <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3">
          {/* Question Tags & Flag / Reminder Actions */}
          <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
                Question d'Épreuve
              </span>

              {/* Exact Source Badge */}
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-500/25 text-purple-200 border border-purple-500/40 shadow-xs flex items-center gap-1">
                <span>🏷️ Source :</span>
                <span className="font-bold">{typeof qcm?.source === 'string' ? qcm.source : String(qcm?.source || 'Annales Examens')}</span>
              </span>

              {/* Faculty Badge */}
              {(qcm?.faculty as string) === 'ORAN' && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">🏛️ Oran</span>
              )}
              {(qcm?.faculty as string) === 'SIDI_BEL_ABBES' && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-400/20 text-indigo-300 border border-indigo-400/30">🏛️ SBA</span>
              )}
              {(!qcm?.faculty || (qcm?.faculty as string) === 'TOUS') && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-400/20 text-slate-300 border border-white/10">🏛️ Faculté</span>
              )}

              {/* Year Badge */}
              {qcm?.year && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-400/20 text-sky-300 border border-sky-400/30">
                  📅 {qcm.year}
                </span>
              )}

              {/* Direct Course Link */}
              {targetCourseSlug && (
                <Link
                  href={`/cours/${targetCourseSlug}`}
                  target="_blank"
                  className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-indigo-500/25 hover:bg-indigo-500/45 text-indigo-200 border border-indigo-500/40 flex items-center gap-1 transition-all active:scale-95 shadow-xs"
                  title="Ouvrir la fiche de cours complète dans un nouvel onglet"
                >
                  <BookOpen className="w-3 h-3 text-indigo-300" />
                  <span className="truncate max-w-[150px] sm:max-w-[220px]">Cours : {targetCourseTitle}</span>
                  <ArrowRight className="w-2.5 h-2.5 text-indigo-300 shrink-0" />
                </Link>
              )}

              {/* Access Level Badge */}
              {qcm?.accessLevel === 'PRO' && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-sm">
                  <span>⭐</span> Plan 4500 DA
                </span>
              )}
              {qcm?.accessLevel === 'PREMIUM' && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 shadow-sm">
                  <span>👑</span> Premium
                </span>
              )}
              {(!qcm?.accessLevel || qcm?.accessLevel === 'FREE') && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span>🟢</span> Gratuit
                </span>
              )}

              {/* Flag Question Button (🚩) */}
              <button
                type="button"
                onClick={toggleFlagQuestion}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border transition-all active:scale-95 cursor-pointer ${
                  isCurrentFlagged
                    ? 'bg-amber-500/30 text-amber-200 border-amber-500/60 shadow-sm font-black'
                    : 'bg-white/10 hover:bg-white/20 text-white/70 border-white/15'
                }`}
                title="Signaler / Marquer cette question pour révision"
              >
                <span>🚩</span>
                <span>{isCurrentFlagged ? 'Marquée' : 'Marquer'}</span>
              </button>

              {/* Reminder Modal Button */}
              <button
                type="button"
                onClick={() => setIsReminderModalOpen(true)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border transition-all active:scale-95 cursor-pointer ${
                  currentQcmReminder
                    ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/15'
                }`}
                title="Programmer un rappel ou marquer ce QCM comme piège d'examen"
              >
                <Bell className={`w-3 h-3 ${currentQcmReminder ? 'text-amber-400 fill-amber-400' : 'text-amber-300'}`} />
                <span>{currentQcmReminder ? (currentQcmReminder.tagLabel || 'Rappel actif') : 'Rappel'}</span>
              </button>
            </div>

            {/* Quick Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-black shadow-sm active:scale-95 cursor-pointer"
            >
              <span>Suivante</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Vignette Clinique */}
          {(qcm?.vignetteHtml || qcm?.vignette) && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
              <div className="flex items-center justify-between text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Vignette Clinique
                </span>
                <button
                  type="button"
                  onClick={() => setShowVignetteDetails(!showVignetteDetails)}
                  className="text-white/50 hover:text-white underline cursor-pointer"
                >
                  {showVignetteDetails ? 'Réduire' : 'Agrandir'}
                </button>
              </div>
              <div className={`text-white/85 leading-relaxed italic ${showVignetteDetails ? '' : 'line-clamp-2 sm:line-clamp-3'}`}>
                {qcm.vignetteHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: typeof qcm.vignetteHtml === 'string' ? qcm.vignetteHtml : String(qcm.vignetteHtml) }} />
                ) : (
                  <p>"{typeof qcm.vignette === 'string' ? qcm.vignette : String(qcm.vignette || '')}"</p>
                )}
              </div>
            </div>
          )}

          {/* Question Text */}
          <h2 className="text-xs sm:text-base font-black text-white leading-snug">
            {typeof qcm?.question === 'string' ? qcm.question : (qcm?.question ? String(qcm.question) : 'Question QCM')}
          </h2>

          {/* Options OR Paywall Lock Card */}
          {isLockedForUser ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-navy-900/90 to-slate-900/90 border border-amber-500/40 shadow-2xl text-center space-y-4 my-3 backdrop-blur-md">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  <span>{qcm?.accessLevel === 'PREMIUM' ? '👑 Pack Premium Requis' : '⭐ Plan Pro (4500 DA) Requis'}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Question Réservée aux Abonnés {qcm?.accessLevel === 'PREMIUM' ? 'Premium' : 'Pro (4500 DA)'}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                  Ce QCM officiel et sa justification médicale sont réservés aux abonnés du {qcm?.accessLevel === 'PREMIUM' ? 'Pack Intégral Premium (7 000 DA)' : 'Forfait Pro Résidanat (4 500 DA)'}. Débloquez l'accès illimité à l'intégralité de la banque de questions, corrections détaillées et fiches flash.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href={`/checkout?plan=${qcm?.accessLevel === 'PREMIUM' ? 'PREMIUM' : 'PRO'}`}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>Débloquer avec le {qcm?.accessLevel === 'PREMIUM' ? 'Plan Premium (7000 DA)' : 'Plan Pro (4500 DA)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Passer au QCM suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {!currentUser && (
                <div className="pt-2 text-[11px] text-white/50">
                  Déjà abonné ?{' '}
                  <Link href="/login" className="text-sky-400 hover:underline font-bold">
                    Connectez-vous à votre compte
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* 5 Options with Elimination (❌ Rayure) */}
              <div className="space-y-1.5 sm:space-y-2">
                {(qcm?.options || []).map((opt, idx) => {
                  if (!opt) return null;
                  const isSelected = currentSelectedOptions.includes(idx);
                  const isEliminated = currentEliminatedOptions.includes(idx);
                  const isCorrect = Array.isArray(qcm?.correctAnswers) && qcm.correctAnswers.includes(idx);

                  let base = 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20 active:scale-[0.99] cursor-pointer';
                  let ltr = 'bg-white/10 text-white/70';

                  if (isExplanationShown) {
                    if (isCorrect) {
                      base = 'border-emerald-500/80 bg-emerald-500/15 text-emerald-100 shadow-sm';
                      ltr = 'bg-emerald-500 text-white font-black';
                    } else if (isSelected) {
                      base = 'border-rose-500/80 bg-rose-500/15 text-rose-200 line-through';
                      ltr = 'bg-rose-500 text-white font-black';
                    } else {
                      base = 'border-white/5 bg-white/3 text-white/40';
                    }
                  } else if (isSelected) {
                    base = 'border-sky-500 bg-sky-500/20 text-sky-100 ring-2 ring-sky-500/30 shadow-sm';
                    ltr = 'bg-sky-500 text-white font-black';
                  } else if (isEliminated) {
                    base = 'border-white/5 bg-white/5 text-white/30 line-through opacity-60';
                    ltr = 'bg-rose-500/30 text-rose-300 font-bold';
                  }

                  return (
                    <div
                      key={opt.id ? String(opt.id) : `opt_${idx}`}
                      onClick={() => toggleOption(idx)}
                      className={`relative group flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-150 ${base}`}
                    >
                      {/* Letter badge */}
                      <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 transition-all ${ltr}`}>
                        {typeof opt.letter === 'string' ? opt.letter : String(opt.letter || String.fromCharCode(65 + idx))}
                      </span>

                      {/* Option Text */}
                      <span className={`text-xs sm:text-sm flex-1 leading-snug font-medium ${isEliminated ? 'line-through decoration-rose-400/60' : ''}`}>
                        {typeof opt.text === 'string' ? opt.text : String(opt.text || '')}
                      </span>

                      {/* Action Right: Rayure (❌) and Status Check */}
                      <div className="shrink-0 flex items-center gap-1.5">
                        {!isExplanationShown && (
                          <button
                            type="button"
                            onClick={(e) => toggleEliminateOption(e, idx)}
                            className={`p-1 rounded-md text-[11px] font-bold transition-all hover:bg-rose-500/20 ${
                              isEliminated ? 'text-rose-400 bg-rose-500/20 opacity-100' : 'text-white/50 hover:text-white opacity-70 sm:opacity-0 sm:group-hover:opacity-100'
                            }`}
                            title="Rayer / Éliminer cette option"
                          >
                            ❌
                          </button>
                        )}

                        {isExplanationShown && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {isExplanationShown && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Individual Question Reveal Button ("Voir la réponse de ce QCM (Uniquement)") */}
              <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-2">
                {!isThisQcmRevealed ? (
                  <button
                    type="button"
                    onClick={handleToggleRevealCurrentQuestion}
                    disabled={currentSelectedOptions.length === 0}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/30"
                    title="Voir immédiatement la réponse et la justification médicale uniquement pour ce QCM"
                  >
                    <Eye className="w-4 h-4" />
                    <span>👁️ Voir la réponse de ce QCM (Uniquement)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleToggleRevealCurrentQuestion}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/15 active:scale-95"
                    title="Masquer la correction de ce QCM pour continuer à réfléchir"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-white/70" />
                    <span>🙈 Masquer la réponse de ce QCM</span>
                  </button>
                )}

                {!isThisQcmRevealed && currentSelectedOptions.length === 0 && (
                  <span className="text-[11px] text-white/50 italic">
                    💡 Cochez au moins une proposition ci-dessus pour révéler la correction de ce QCM.
                  </span>
                )}
              </div>

              {/* Immediate mode validate button */}
              {sessionMode === 'IMMEDIATE' && !isCurrentValidatedImmediate && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleValidateImmediate}
                    disabled={currentSelectedOptions.length === 0}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-35 text-white font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Valider ma réponse à ce QCM</span>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Explanation Card */}
              {isExplanationShown && (
                <div className="p-3 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Justification Médicale</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setIsCourseModalOpen(true)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/40 hover:bg-indigo-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm cursor-pointer border border-indigo-400/30"
                        title="Aperçu rapide du cours"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Fiche Synthèse</span>
                      </button>

                      {targetCourseSlug && (
                        <Link
                          href={`/cours/${targetCourseSlug}`}
                          target="_blank"
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black flex items-center gap-1.5 shadow-sm transition-all border border-indigo-400/40"
                          title="Ouvrir le cours complet dans un nouvel onglet"
                        >
                          <BookOpen className="w-3 h-3 text-indigo-200" />
                          <span>Ouvrir la Page du Cours ↗</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <span>Suivante</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-white/85 leading-relaxed">
                    {qcm?.explanationHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: typeof qcm.explanationHtml === 'string' ? qcm.explanationHtml : String(qcm.explanationHtml) }} />
                    ) : (
                      <p>{typeof qcm?.explanation === 'string' ? qcm.explanation : (qcm?.explanation ? String(qcm.explanation) : 'Pas d\'explication fournie.')}</p>
                    )}
                  </div>
                  {qcm?.reference && (
                    <div className="text-[10px] text-emerald-400/80 pt-1 border-t border-emerald-500/20 flex items-center gap-1">
                      <Flag className="w-3 h-3" />
                      <span>Réf : {typeof qcm.reference === 'string' ? qcm.reference : String(qcm.reference)}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── 3. BOTTOM ACTION BAR ── */}
      <footer className="shrink-0 bg-navy-950/95 backdrop-blur-2xl border-t border-white/10 px-3 py-2 sm:px-4 sm:py-2.5 relative z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2.5">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={safeCurrentIndex === 0}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
            title="Question précédente"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Précédente</span>
          </button>

          {/* Primary Action Button (Dévoiler les Résultats or Next) */}
          <div className="flex-1 max-w-sm flex items-center gap-2">
            {!isResultsRevealed && sessionMode === 'DEFERRED' ? (
              <button
                type="button"
                onClick={handleRevealAllResults}
                disabled={answeredCount === 0}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/30"
              >
                <span>🏁 Dévoiler les Résultats ({answeredCount}/{totalCount})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ring-2 ring-sky-400/40"
              >
                <span>{safeCurrentIndex < sessionQcms.length - 1 ? 'Question Suivante' : 'Terminer & Score Global'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
            title="Question suivante"
          >
            <span className="hidden sm:inline">Suivante</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footnote Shortcut */}
        <div className="text-center mt-1 text-[9px] text-white/30 hidden sm:block">
          Vos choix (A, B, C, D, E) et éliminations (❌) sont mémorisés automatiquement sur chaque question.
        </div>
      </footer>

      {/* Course Preview Modal (Passerelle Théorique) */}
      <CoursePreviewModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        courseId={qcm?.courseId || course}
        courseTitle={courseName || (qcm as any)?.courseName}
        specialtyName={specialtyName || (qcm as any)?.specialtyName}
        explanation={qcm?.explanation}
      />

      {/* Reminder / Trap Modal */}
      {qcm && (
        <ReminderModal
          isOpen={isReminderModalOpen}
          onClose={() => setIsReminderModalOpen(false)}
          targetType="qcm"
          targetId={qcm.id}
          targetTitle={qcm.question}
          specialtyId={qcm.specialtyId}
          specialtyName={specialtyName || qcm.specialtyName || 'Médecine'}
          existingReminder={currentQcmReminder}
          onSaved={(saved) => {
            setUserReminders(prev => [saved, ...prev.filter(r => r.id !== saved.id)]);
          }}
        />
      )}
    </div>
  );
}

export default function QcmSessionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Brain className="w-6 h-6 animate-pulse text-sky-400" />
          <span className="text-sm font-bold">Chargement de la session...</span>
        </div>
      </div>
    }>
      <SessionContent />
    </Suspense>
  );
}
