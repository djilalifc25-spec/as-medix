'use client';

import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { INITIAL_QCMS } from '@/lib/db/seedQcm';
import {
  ChevronLeft, ChevronRight, X, CheckCircle2, XCircle,
  RotateCcw, Award, BookOpen, Brain, Zap,
  HelpCircle, Flag, ChevronDown, Check, ArrowRight, Bell
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReminderModal } from '@/components/study/ReminderModal';
import { StudyReminder } from '@/types';

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

// ── Question Navigator Overlay ────────────────────────────────────────────────
function QuestionNavigator({
  total,
  current,
  answers,
  onJump,
  onClose,
}: {
  total: number;
  current: number;
  answers: Record<number, { validated: boolean; correct: boolean }>;
  onJump: (i: number) => void;
  onClose: () => void;
}) {
  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter(a => a.correct).length;
  const incorrectCount = answeredCount - correctCount;
  const remainingCount = total - answeredCount;

  return (
    <div className="absolute top-14 right-2 sm:right-4 z-50 bg-slate-900/98 dark:bg-navy-950/98 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-4 w-72 sm:w-80 animate-in fade-in zoom-in-95 duration-150 text-white">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black uppercase tracking-wider text-white">
          Grille des Questions
        </span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Exact Stats Breakdown */}
      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-center mb-3 text-[10px]">
        <div>
          <div className="font-mono text-xs font-black text-white">{answeredCount}/{total}</div>
          <div className="text-white/50">Répondues</div>
        </div>
        <div>
          <div className="font-mono text-xs font-black text-emerald-400">{correctCount}</div>
          <div className="text-white/50">Correctes</div>
        </div>
        <div>
          <div className="font-mono text-xs font-black text-rose-400">{incorrectCount}</div>
          <div className="text-white/50">Erreurs</div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
        {Array.from({ length: total }).map((_, i) => {
          const ans = answers[i];
          let cls = 'bg-white/10 text-white/60 hover:bg-white/20';
          if (i === current) cls = 'bg-sky-500 text-white font-black ring-2 ring-sky-300 shadow-md';
          else if (ans?.validated && ans.correct) cls = 'bg-emerald-500 text-white font-bold';
          else if (ans?.validated && !ans.correct) cls = 'bg-rose-500 text-white font-bold';
          return (
            <button
              key={i}
              onClick={() => { onJump(i); onClose(); }}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${cls}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-1 mt-3 pt-2.5 border-t border-white/10 text-[9px] text-white/60">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> Vrai</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-rose-500 inline-block" /> Faux</span>
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
  onExit,
}: {
  score: number;
  total: number;
  specialty: string;
  course: string;
  source: string;
  onRestart: () => void;
  onExit: () => void;
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const grade = pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien !' : pct >= 40 ? 'Passable' : 'À retravailler';
  const gradeColor = pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : pct >= 40 ? 'text-orange-400' : 'text-rose-400';
  const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : pct >= 40 ? 'bg-orange-500' : 'bg-rose-500';

  useEffect(() => {
    if (pct >= 80) {
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, colors: ['#10b981', '#3b82f6', '#8b5cf6'] });
    }
  }, [pct]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-5 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30">
          <Award className="w-12 h-12 text-white" />
        </div>
        <div className="space-y-1.5">
          <div className={`text-5xl font-black ${gradeColor}`}>{pct}%</div>
          <div className={`text-lg font-bold ${gradeColor}`}>{grade}</div>
          <div className="text-xs sm:text-sm text-white/70">
            <strong>{score}</strong> bonne{score > 1 ? 's' : ''} réponse{score > 1 ? 's' : ''} sur <strong>{total}</strong> questions
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recommencer l'épreuve</span>
          </button>
          <button
            onClick={onExit}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs transition-all shadow-lg cursor-pointer"
          >
            Retour au Hub QCM
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
  const [showVignetteDetails, setShowVignetteDetails] = useState(false);
  const [userReminders, setUserReminders] = useState<StudyReminder[]>([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/qcm')
      .then(r => r.json())
      .then(d => {
        if (d.qcms && d.qcms.length > 0) {
          setAllQcms(d.qcms);
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
      const target = allQcms.filter(q => q.id === qcmId);
      if (target.length > 0) return target;
    }
    if (remindersOnly) {
      const targetIds = userReminders.map(r => r.targetId);
      const flagged = allQcms.filter(q => targetIds.includes(q.id));
      if (flagged.length > 0) return flagged;
    }
    const selectedSourcesList = source === 'TOUS' || !source
      ? []
      : source.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

    return allQcms.filter(q => {
      const matchSpec = !specialty || q.specialtyId === specialty;
      const matchCourse = !course || q.courseId === course;
      const matchFaculty = faculty === 'TOUS' || !q.faculty || (q.faculty as string) === 'TOUS' || (q.faculty as string) === faculty;
      const matchSource = selectedSourcesList.length === 0 || !q.source || selectedSourcesList.some(s => (q.source as string).toLowerCase().includes(s));
      return matchSpec && matchCourse && matchFaculty && matchSource;
    });
  }, [allQcms, specialty, course, faculty, source, qcmId, remindersOnly, userReminders]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [answersMap, setAnswersMap] = useState<Record<number, { validated: boolean; correct: boolean }>>({});

  const totalCount = sessionQcms.length;
  const answeredCount = Object.keys(answersMap).length;
  const correctCount = Object.values(answersMap).filter(a => a.correct).length;
  const incorrectCount = answeredCount - correctCount;
  const remainingCount = Math.max(0, totalCount - answeredCount);
  const currentNumber = currentIndex + 1;

  const qcm = sessionQcms[currentIndex];
  const currentQcmReminder = qcm ? userReminders.find(r => r.targetId === qcm.id && r.status === 'pending') : null;

  // Advance to Next QCM
  const handleNext = useCallback(() => {
    if (currentIndex < sessionQcms.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswers([]);
      setHasValidated(false);
      setShowVignetteDetails(false);
    } else {
      setCompleted(true);
    }
  }, [currentIndex, sessionQcms.length]);

  // Validate answer
  const handleValidate = useCallback(() => {
    if (!qcm || selectedAnswers.length === 0 || hasValidated) return;
    setHasValidated(true);
    const isCorrect =
      selectedAnswers.length === qcm.correctAnswers.length &&
      selectedAnswers.every(a => qcm.correctAnswers.includes(a));
    if (isCorrect) {
      setScore(s => s + 1);
      confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 }, ticks: 60 });
    }
    setAnswersMap(prev => ({ ...prev, [currentIndex]: { validated: true, correct: isCorrect } }));

    // Persist attempt to server in real-time
    fetch('/api/qcm/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        qcmId: qcm.id,
        userAnswers: selectedAnswers,
        isCorrect,
        scorePercentage: isCorrect ? 100 : 0,
        timeSpentSeconds: 25
      })
    }).catch(() => {});
  }, [qcm, selectedAnswers, hasValidated, currentIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      if (hasValidated) handleNext();
    }
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setSelectedAnswers([]);
      setHasValidated(false);
    }
    if (e.key === 'Enter') {
      if (!hasValidated && selectedAnswers.length > 0) handleValidate();
      else if (hasValidated) handleNext();
    }
    if (e.key === 'Escape') router.push('/qcm');
  }, [hasValidated, handleNext, handleValidate, currentIndex, selectedAnswers, router]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleOption = (idx: number) => {
    if (hasValidated || !qcm) return;
    if (qcm.type === 'SINGLE') {
      setSelectedAnswers([idx]);
    } else {
      setSelectedAnswers(prev =>
        prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
      );
    }
  };

  const handleJump = (i: number) => {
    setCurrentIndex(i);
    setSelectedAnswers([]);
    setHasValidated(false);
    setShowVignetteDetails(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setHasValidated(false);
    setScore(0);
    setCompleted(false);
    setAnswersMap({});
    setShowVignetteDetails(false);
  };

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
        score={score} total={sessionQcms.length}
        specialty={specialtyName} course={courseName} source={source}
        onRestart={handleRestart} onExit={() => router.push('/qcm')}
      />
    );
  }

  // Touch swipe handling for mobile scrolling
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 60) {
      if (hasValidated) handleNext();
    } else if (diffX < -60 && currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setSelectedAnswers([]);
      setHasValidated(false);
      setShowVignetteDetails(false);
    }
    setTouchStartX(null);
  };

  return (
    <div 
      className="min-h-[100dvh] h-[100dvh] flex flex-col bg-gradient-to-br from-navy-950 via-slate-900 to-indigo-950 overflow-hidden relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* ── 1. COMPACT TOP STATS BAR ── */}
      <header className="shrink-0 bg-navy-950/90 backdrop-blur-xl border-b border-white/10 px-3 pb-2 sm:px-4 sm:pb-2.5 relative z-30" style={{ paddingTop: "max(0.625rem, env(safe-area-inset-top, 0px))" }}>
        <div className="max-w-4xl mx-auto space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Exit + Specialty/Course Badge */}
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
                {source && source !== 'TOUS' && (
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30 shrink-0">
                    {source}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Exact Real-Time Stats (Always Visible on Mobile & Desktop) */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Stat 1: Current Question / Total */}
              <div className="px-2.5 py-1 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-black font-mono">
                Q {currentNumber}/{totalCount}
              </div>

              {/* Stat 2: Answered / Done Count */}
              <div className="px-2 py-1 rounded-xl bg-white/10 text-white text-[11px] font-bold font-mono flex items-center gap-1" title="QCMs déjà faits">
                <span className="text-white/60 text-[10px]">Fait:</span>
                <span className="font-black text-white">{answeredCount}</span>
                <span className="text-white/40">/{totalCount}</span>
              </div>

              {/* Stat 3: Correct vs Incorrect (Compact) */}
              {answeredCount > 0 && (
                <div className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-xl bg-white/10 text-[11px] font-mono">
                  <span className="text-emerald-400 font-bold">✓ {correctCount}</span>
                  <span className="text-white/30">·</span>
                  <span className="text-rose-400 font-bold">✗ {incorrectCount}</span>
                </div>
              )}

              {/* Navigator button */}
              <button
                onClick={() => setShowNavigator(v => !v)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer"
                title="Ouvrir la grille des questions"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showNavigator ? 'rotate-180 text-sky-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Horizontal Scrollable QCM Strip for Instant Jump */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 scrollbar-none max-w-4xl mx-auto">
            {sessionQcms.map((_, idx) => {
              const isAns = answersMap[idx];
              let pillStyle = 'bg-white/10 text-white/70 hover:bg-white/20';
              if (idx === currentIndex) pillStyle = 'bg-sky-500 text-white font-black ring-2 ring-sky-300 scale-105 shadow-sm';
              else if (isAns?.validated && isAns.correct) pillStyle = 'bg-emerald-500 text-white font-bold';
              else if (isAns?.validated && !isAns.correct) pillStyle = 'bg-rose-500 text-white font-bold';

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleJump(idx)}
                  className={`h-6 min-w-[28px] px-2 rounded-lg text-[10px] font-mono shrink-0 transition-all active:scale-95 cursor-pointer ${pillStyle}`}
                >
                  Q{idx + 1}
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <ProgressBar current={answeredCount} total={totalCount} />
        </div>

        {/* Dropdown Navigator */}
        {showNavigator && (
          <QuestionNavigator
            total={sessionQcms.length}
            current={currentIndex}
            answers={answersMap}
            onJump={handleJump}
            onClose={() => setShowNavigator(false)}
          />
        )}
      </header>

      {/* ── 2. COMPACT QUESTION BODY (FITS IN VIEWPORT WITHOUT SCROLLING) ── */}
      <main className="flex-1 overflow-y-auto overscroll-contain px-3 py-2.5 sm:px-4 sm:py-4">
        <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3">

          {/* Question Metadata Tags & Reminder Action */}
          <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
                {qcm.type === 'MULTIPLE' ? 'Choix Multiple' : 'Choix Simple'}
              </span>
              {(qcm.faculty as string) === 'ORAN' && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">Oran</span>
              )}
              {(qcm.faculty as string) === 'SIDI_BEL_ABBES' && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-400/20 text-indigo-300 border border-indigo-400/30">SBA</span>
              )}
              {qcm.source && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-400/20 text-purple-300 border border-purple-400/30 truncate max-w-[140px]">
                  {qcm.source as string}
                </span>
              )}

              {/* Reminder / Trap Marker Button */}
              <button
                type="button"
                onClick={() => setIsReminderModalOpen(true)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold border transition-all active:scale-95 cursor-pointer ${
                  currentQcmReminder
                    ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/15'
                }`}
                title="Programmer un rappel ou marquer ce QCM comme piège d'examen"
              >
                <Bell className={`w-3 h-3 ${currentQcmReminder ? 'text-amber-400 fill-amber-400' : 'text-amber-300'}`} />
                <span>{currentQcmReminder ? (currentQcmReminder.tagLabel || 'Rappel actif') : 'Rappel / Piège'}</span>
              </button>
            </div>

            {/* Quick Next Button on top right if already validated */}
            {hasValidated && (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[11px] font-black shadow-sm active:scale-95 cursor-pointer animate-pulse"
              >
                <span>Suivante</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Compact Clinical Vignette (Collapsible / Readable) */}
          {(qcm.vignetteHtml || qcm.vignette) && (
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
                  <div dangerouslySetInnerHTML={{ __html: qcm.vignetteHtml as string }} />
                ) : (
                  <p>"{qcm.vignette}"</p>
                )}
              </div>
            </div>
          )}

          {/* Question Title */}
          <h2 className="text-xs sm:text-base font-black text-white leading-snug">
            {qcm.question}
          </h2>

          {/* 5 Options - Compact & Touch Friendly (Fits directly in viewport) */}
          <div className="space-y-1.5 sm:space-y-2">
            {qcm.options.map((opt, idx) => {
              const isSelected = selectedAnswers.includes(idx);
              const isCorrect = qcm.correctAnswers.includes(idx);
              let base = 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20 active:scale-[0.99] cursor-pointer';
              let ltr = 'bg-white/10 text-white/70';

              if (hasValidated) {
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
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => toggleOption(idx)}
                  className={`flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-150 ${base}`}
                >
                  <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 transition-all ${ltr}`}>
                    {opt.letter}
                  </span>
                  <span className="text-xs sm:text-sm flex-1 leading-snug font-medium">
                    {opt.text}
                  </span>
                  <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                    {hasValidated && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {hasValidated && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation Card (Appears after validation) */}
          {hasValidated && (
            <div className="p-3 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Justification Médicale</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReminderModalOpen(true)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 active:scale-95 transition-all cursor-pointer ${
                      currentQcmReminder
                        ? 'bg-amber-500/30 text-amber-200 border-amber-400/50 shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-emerald-200 border-emerald-500/30'
                    }`}
                    title="Programmer un rappel ou marquer ce QCM"
                  >
                    <Bell className={`w-3 h-3 ${currentQcmReminder ? 'text-amber-300 fill-amber-300' : ''}`} />
                    <span>{currentQcmReminder ? (currentQcmReminder.tagLabel || 'Rappel programmé') : '🔔 Me rappeler'}</span>
                  </button>
                  {/* Easy Next Button inside explanation */}
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
                {qcm.explanationHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: qcm.explanationHtml as string }} />
                ) : (
                  <p>{qcm.explanation}</p>
                )}
              </div>
              {qcm.reference && (
                <div className="text-[10px] text-emerald-400/80 pt-1 border-t border-emerald-500/20 flex items-center gap-1">
                  <Flag className="w-3 h-3" />
                  <span>Réf : {qcm.reference as string}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── 3. BOTTOM ACTION BAR (EASY ONE-TAP NAVIGATION) ── */}
      <footer className="shrink-0 bg-navy-950/95 backdrop-blur-2xl border-t border-white/10 px-3 py-2 sm:px-4 sm:py-2.5 relative z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2.5">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(i => i - 1);
                setSelectedAnswers([]);
                setHasValidated(false);
                setShowVignetteDetails(false);
              }
            }}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
            title="Question précédente"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Précédente</span>
          </button>

          {/* Primary Action Button (Valider / Question Suivante) */}
          <div className="flex-1 max-w-sm">
            {!hasValidated ? (
              <button
                type="button"
                onClick={handleValidate}
                disabled={selectedAnswers.length === 0}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Valider ma réponse</span>
                {selectedAnswers.length > 0 && <Check className="w-4 h-4" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ring-2 ring-emerald-400/40 animate-in fade-in"
              >
                <span>{currentIndex < sessionQcms.length - 1 ? 'Question Suivante' : 'Terminer & Voir mon Score'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!hasValidated && currentIndex === sessionQcms.length - 1}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
            title="Question suivante"
          >
            <span className="hidden sm:inline">Suivante</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footnote Shortcut */}
        <div className="text-center mt-1 text-[9px] text-white/30 hidden sm:block">
          Entrée pour valider · Flèches pour naviguer · Échap pour quitter
        </div>
      </footer>

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
