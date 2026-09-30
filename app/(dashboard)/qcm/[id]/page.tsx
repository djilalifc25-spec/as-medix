'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { INITIAL_QCMS } from '@/lib/db/seedQcm';
import {
  ArrowLeft, Check, X, ArrowRight, RotateCcw, Award, CheckCircle2,
  AlertCircle, BookOpen, Clock, Brain, Sparkles, Lock, Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';

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

export default function QcmRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const initialId = params.id as string;

  // We can run a session of all QCMs or starting from current
  const [questions, setQuestions] = useState(INITIAL_QCMS);
  const [currentUser, setCurrentUser] = useState<{ id?: string; name?: string; role?: string; plan?: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [historyAnswers, setHistoryAnswers] = useState<{ isCorrect: boolean; qcmId: string }[]>([]);

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
          setQuestions(d.qcms);
          const foundIdx = d.qcms.findIndex((q: any) => q.id === initialId);
          if (foundIdx !== -1) {
            setCurrentIndex(foundIdx);
          }
        }
      })
      .catch(() => {});
  }, [initialId]);

  const currentQ = questions[currentIndex] || questions[0];
  const isMultiple = currentQ.type === 'MULTIPLE';
  const isLockedForUser = currentQ ? !canUserAccessQcm(currentUser, currentQ.accessLevel) : false;

  const toggleOption = (idx: number) => {
    if (isSubmitted || isLockedForUser) return;
    if (isMultiple) {
      if (selectedAnswers.includes(idx)) {
        setSelectedAnswers(selectedAnswers.filter(i => i !== idx));
      } else {
        setSelectedAnswers([...selectedAnswers, idx]);
      }
    } else {
      setSelectedAnswers([idx]);
    }
  };

  const handleValidate = async () => {
    if (selectedAnswers.length === 0 || isLockedForUser) return;
    setIsSubmitted(true);

    const sortedSelected = [...selectedAnswers].sort();
    const sortedCorrect = [...currentQ.correctAnswers].sort();
    const isCorrect =
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((val, idx) => val === sortedCorrect[idx]);

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setHistoryAnswers(prev => [...prev, { isCorrect, qcmId: currentQ.id }]);

    // Persist attempt to backend
    try {
      await fetch('/api/qcm/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qcmId: currentQ.id,
          userAnswers: selectedAnswers,
          isCorrect,
          scorePercentage: isCorrect ? 100 : 0,
          timeSpentSeconds: 45
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswers([]);
      setIsSubmitted(false);
    } else {
      setQuizDone(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setIsSubmitted(false);
    setScore(0);
    setQuizDone(false);
    setHistoryAnswers([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar with Exit & Progress */}
      <div className="flex items-center justify-between pb-2 border-b border-navy-100 dark:border-navy-800">
        <Link
          href="/qcm"
          className="inline-flex items-center gap-2 text-xs font-bold text-navy-600 dark:text-navy-300 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quitter la session d'entraînement</span>
        </Link>

        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full">
          Question {currentIndex + 1} sur {questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-navy-100 dark:bg-navy-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-indigo-600 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {!quizDone ? (
        /* Active Question Card */
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-6">
          {/* Header info */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {currentQ.specialtyName}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-navy-100 dark:bg-navy-800 text-[11px] font-bold text-navy-700 dark:text-navy-300">
              {isMultiple ? 'Choix Multiple (Plusieurs réponses exactes possibles)' : 'Choix Unique (Une seule réponse)'}
            </span>
            <span className="text-navy-400">{currentQ.rang}</span>

            {/* Access Level Badge */}
            {currentQ.accessLevel === 'PRO' && (
              <span className="px-2.5 py-0.5 rounded-full font-black text-[11px] bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-xs">
                <span>⭐</span> Plan 4500 DA
              </span>
            )}
            {currentQ.accessLevel === 'PREMIUM' && (
              <span className="px-2.5 py-0.5 rounded-full font-black text-[11px] bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1 shadow-xs">
                <span>👑</span> Premium
              </span>
            )}
            {(!currentQ.accessLevel || currentQ.accessLevel === 'FREE') && (
              <span className="px-2.5 py-0.5 rounded-full font-black text-[11px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span>🟢</span> Gratuit
              </span>
            )}
          </div>

          {/* Clinical vignette */}
          {currentQ.vignette && (
            <div className="p-4 rounded-2xl bg-navy-50/70 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-750 text-xs sm:text-sm text-navy-700 dark:text-navy-200 leading-relaxed font-normal">
              <strong>Vignette Clinique :</strong> {currentQ.vignette}
            </div>
          )}

          {/* Main Question */}
          <h2 className="text-lg sm:text-xl font-black text-navy-950 dark:text-white leading-snug">
            {currentQ.question}
          </h2>

          {isLockedForUser ? (
            <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-navy-50 to-white dark:from-navy-950 dark:to-navy-900 border border-amber-500/40 shadow-soft text-center space-y-4 my-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  <span>{currentQ.accessLevel === 'PREMIUM' ? '👑 Pack Premium Requis' : '⭐ Plan Pro (4500 DA) Requis'}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-navy-950 dark:text-white">
                  Question Réservée aux Abonnés {currentQ.accessLevel === 'PREMIUM' ? 'Premium' : 'Pro (4500 DA)'}
                </h3>
                <p className="text-xs sm:text-sm text-navy-600 dark:text-white/70 max-w-md mx-auto leading-relaxed">
                  Ce QCM officiel et sa justification médicale sont réservés aux abonnés du {currentQ.accessLevel === 'PREMIUM' ? 'Pack Intégral Premium (7 000 DA)' : 'Forfait Pro Résidanat (4 500 DA)'}. Débloquez l'accès illimité à l'intégralité de la banque de questions, corrections détaillées et fiches flash.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <Link
                  href={`/checkout?plan=${currentQ.accessLevel === 'PREMIUM' ? 'PREMIUM' : 'PRO'}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>Débloquer avec le {currentQ.accessLevel === 'PREMIUM' ? 'Plan Premium (7000 DA)' : 'Plan Pro (4500 DA)'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {currentIndex < questions.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-navy-100 hover:bg-navy-200 dark:bg-white/10 dark:hover:bg-white/20 text-navy-800 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Passer au QCM suivant</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              {!currentUser && (
                <div className="pt-2 text-xs text-navy-500 dark:text-white/50">
                  Déjà abonné ?{' '}
                  <Link href="/login" className="text-brand-600 dark:text-sky-400 hover:underline font-bold">
                    Connectez-vous à votre compte
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers.includes(idx);
                  const isActuallyCorrect = currentQ.correctAnswers.includes(idx);

                  let optionClasses = "w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all flex items-start justify-between gap-3 ";
                  if (!isSubmitted) {
                    optionClasses += isSelected
                      ? "border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 text-brand-950 dark:text-white shadow-sm ring-1 ring-brand-500"
                      : "border-navy-200 dark:border-navy-700 hover:border-brand-300 dark:hover:border-navy-600 text-navy-700 dark:text-navy-200 bg-white dark:bg-navy-800";
                  } else {
                    if (isActuallyCorrect) {
                      optionClasses += "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold";
                    } else if (isSelected && !isActuallyCorrect) {
                      optionClasses += "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200";
                    } else {
                      optionClasses += "border-navy-200 dark:border-navy-700 opacity-50 text-navy-400";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleOption(idx)}
                      disabled={isSubmitted}
                      className={optionClasses}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-navy-100 dark:bg-navy-700 text-navy-800 dark:text-navy-200 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {opt.letter}
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {isSubmitted && isActuallyCorrect && (
                        <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isSubmitted && isSelected && !isActuallyCorrect && (
                        <X className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box on submit */}
              {isSubmitted && (
                <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800 space-y-2 text-xs sm:text-sm text-navy-800 dark:text-navy-200 leading-relaxed">
                  <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
                    <Brain className="w-4 h-4 text-indigo-600" />
                    <span>Explication Pédagogique Résidanat :</span>
                  </div>
                  <p>{currentQ.explanation}</p>
                  {currentQ.reference && (
                    <div className="pt-2 text-[11px] text-navy-500 dark:text-navy-400 italic">
                      Source : {currentQ.reference}
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-navy-100 dark:border-navy-800">
                <span className="text-xs text-navy-400">
                  Score actuel : {score} sur {currentIndex + (isSubmitted ? 1 : 0)}
                </span>

                {!isSubmitted ? (
                  <button
                    onClick={handleValidate}
                    disabled={selectedAnswers.length === 0}
                    className="px-6 py-3 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white shadow-soft transition-all"
                  >
                    Valider ma réponse
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Question suivante' : 'Terminer et voir le bilan'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        /* End-of-Quiz Score Summary Card */
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft-lg text-center space-y-8">
          <div className="w-20 h-20 rounded-3xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-sm">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-navy-950 dark:text-white tracking-tight">
              Session d'entraînement terminée !
            </h2>
            <p className="text-sm text-navy-600 dark:text-navy-300">
              Votre score a été enregistré dans votre profil et vos points faibles ont été actualisés.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-navy-50 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-700 max-w-sm mx-auto space-y-2">
            <div className="text-4xl font-black text-brand-600 dark:text-brand-400">
              {score} / {questions.length}
            </div>
            <div className="text-xs font-bold text-navy-500 uppercase tracking-wider">
              Taux de réussite : {Math.round((score / questions.length) * 100)}%
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-navy-200 dark:border-navy-700 text-navy-800 dark:text-white hover:bg-navy-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer cette session</span>
            </button>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-soft"
            >
              <span>Continuer mes révisions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
