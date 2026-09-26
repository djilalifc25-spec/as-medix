'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame, Target, Trophy, ArrowRight, CheckCircle2, RotateCcw,
  Sparkles, Clock, Zap, BookOpen, Brain, Bell, BarChart2
} from 'lucide-react';
import { useToast } from '@/components/context/ToastContext';

interface RevisionGoalTrackerProps {
  remindersReviewedToday?: number;
  totalQcmsAttempted?: number;
  totalCorrect?: number;
  totalBankQcms?: number;
}

export function RevisionGoalTracker({
  remindersReviewedToday = 0,
  totalQcmsAttempted = 0,
  totalCorrect = 0,
  totalBankQcms = 0,
}: RevisionGoalTrackerProps) {
  const { showToast } = useToast();
  const [targetQcms, setTargetQcms] = useState<number>(25);
  const [qcmDoneToday, setQcmDoneToday] = useState<number>(0);
  const [coursesDoneToday, setCoursesDoneToday] = useState<number>(1);
  const [streakDays, setStreakDays] = useState<number>(5);
  const [targetPace, setTargetPace] = useState<'moderate' | 'regular' | 'intensive'>('regular');

  const [currentUid, setCurrentUid] = useState<string>('guest');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;
    async function loadUserTracker() {
      let uid = 'guest';
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user?.id) {
          uid = data.user.id;
        }
      } catch {}

      if (!isMounted) return;
      setCurrentUid(uid);

      // Load saved settings per user
      const savedTarget = localStorage.getItem(`asmedix_${uid}_daily_target`) || localStorage.getItem('asmedix_daily_target');
      let targetVal = 25;
      if (savedTarget) {
        targetVal = parseInt(savedTarget, 10);
        setTargetQcms(targetVal);
        if (targetVal === 15) setTargetPace('moderate');
        else if (targetVal === 50) setTargetPace('intensive');
        else setTargetPace('regular');
      }

      const todayStr = new Date().toISOString().split('T')[0];
      const savedTodayQcm = localStorage.getItem(`asmedix_${uid}_qcm_today_${todayStr}`);
      if (savedTodayQcm !== null) {
        setQcmDoneToday(parseInt(savedTodayQcm, 10));
      } else {
        const initial = Math.min(totalQcmsAttempted, targetVal);
        setQcmDoneToday(initial);
        localStorage.setItem(`asmedix_${uid}_qcm_today_${todayStr}`, initial.toString());
      }

      // Streak handling per user
      const savedStreak = localStorage.getItem(`asmedix_${uid}_streak_count`);
      if (savedStreak) {
        setStreakDays(parseInt(savedStreak, 10));
      } else {
        setStreakDays(1);
        localStorage.setItem(`asmedix_${uid}_streak_count`, '1');
      }

      localStorage.setItem(`asmedix_${uid}_last_active_date`, todayStr);
    }

    loadUserTracker();
    return () => { isMounted = false; };
  }, [totalQcmsAttempted]);

  const setPace = (pace: 'moderate' | 'regular' | 'intensive') => {
    setTargetPace(pace);
    let target = 25;
    if (pace === 'moderate') target = 15;
    if (pace === 'intensive') target = 50;
    
    setTargetQcms(target);
    localStorage.setItem(`asmedix_${currentUid}_daily_target`, target.toString());
    showToast({
      type: 'info',
      title: 'Objectif actualisé ! 🎯',
      message: `Nouvel objectif quotidien fixé à ${target} QCMs / jour.`
    });
  };

  const progressPercent = Math.min(Math.round((qcmDoneToday / targetQcms) * 100), 100);
  const isGoalReached = qcmDoneToday >= targetQcms;
  const overallSuccessRate = totalQcmsAttempted > 0 ? Math.round((totalCorrect / totalQcmsAttempted) * 100) : 0;

  return (
    <div className="apple-card p-6 sm:p-7 space-y-6 border-2 border-amber-500/20 dark:border-amber-500/25 bg-gradient-to-br from-white via-amber-500/[0.02] to-brand-500/[0.03] dark:from-navy-900 dark:via-navy-900/95 dark:to-navy-950 shadow-soft-xl relative overflow-hidden">
      {/* Decorative Aura */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-100 dark:border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-soft shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-navy-950 dark:text-white">
                Objectif de Révision & Régularité
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 flex items-center gap-1 shadow-2xs">
                <span>🔥</span>
                <span>Streak : {streakDays} Jours</span>
              </span>
            </div>
            <p className="text-xs text-navy-500 dark:text-navy-400">
              La régularité quotidienne est le facteur n°1 de réussite au Résidanat.
            </p>
          </div>
        </div>

        {/* Pace switcher */}
        <div className="inline-flex p-1 rounded-xl bg-navy-100 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPace('moderate')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              targetPace === 'moderate'
                ? 'bg-white dark:bg-navy-900 text-navy-950 dark:text-white shadow-2xs'
                : 'text-navy-500 hover:text-navy-800 dark:hover:text-navy-200'
            }`}
            title="15 QCM par jour"
          >
            Modéré (15)
          </button>
          <button
            type="button"
            onClick={() => setPace('regular')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              targetPace === 'regular'
                ? 'bg-amber-500 text-navy-950 font-black shadow-2xs'
                : 'text-navy-500 hover:text-navy-800 dark:hover:text-navy-200'
            }`}
            title="25 QCM par jour (Recommandé)"
          >
            Régulier (25)
          </button>
          <button
            type="button"
            onClick={() => setPace('intensive')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              targetPace === 'intensive'
                ? 'bg-rose-600 text-white font-black shadow-2xs'
                : 'text-navy-500 hover:text-navy-800 dark:hover:text-navy-200'
            }`}
            title="50 QCM par jour"
          >
            Intensif (50)
          </button>
        </div>
      </div>

      {/* Progress Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Main QCM Completion Progress */}
        <div className="md:col-span-2 space-y-3 p-4 rounded-2xl bg-white/60 dark:bg-navy-800/40 border border-navy-100 dark:border-navy-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-bold text-navy-950 dark:text-white">
                Objectif QCM du Jour
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-navy-700 dark:text-navy-300">
              <strong className="text-brand-600 dark:text-brand-400 text-sm">{qcmDoneToday}</strong> / {targetQcms} questions ({progressPercent}%)
            </span>
          </div>

          {/* Progress Bar with glowing fill */}
          <div className="relative w-full h-3.5 rounded-full bg-navy-100 dark:bg-navy-900 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isGoalReached
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Sub milestones & Real Global Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-navy-50 dark:bg-navy-800/70 border border-navy-100 dark:border-navy-700/60 flex items-center justify-between">
              <span className="text-[11px] text-navy-500 dark:text-navy-400 flex items-center gap-1">
                <BarChart2 className="w-3.5 h-3.5 text-brand-500" />
                <span>Total traités :</span>
              </span>
              <span className="text-xs font-black text-brand-600 dark:text-brand-400 font-mono">
                {totalQcmsAttempted}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-navy-50 dark:bg-navy-800/70 border border-navy-100 dark:border-navy-700/60 flex items-center justify-between">
              <span className="text-[11px] text-navy-500 dark:text-navy-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Réussite :</span>
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {overallSuccessRate}%
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-navy-50 dark:bg-navy-800/70 border border-navy-100 dark:border-navy-700/60 flex items-center justify-between col-span-2 sm:col-span-1">
              <span className="text-[11px] text-navy-500 dark:text-navy-400 flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Rappels SRS :</span>
              </span>
              <span className="text-xs font-bold text-navy-800 dark:text-navy-200">
                {remindersReviewedToday}
              </span>
            </div>
          </div>
        </div>

        {/* Motivational Call to Action Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-950/40 dark:to-indigo-950/40 border border-brand-200/80 dark:border-brand-800/60 space-y-3 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-brand-700 dark:text-brand-300">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{isGoalReached ? 'Objectif Atteint ! 🎉' : 'Séance en cours'}</span>
            </div>
            <p className="text-[11px] text-navy-600 dark:text-navy-300 mt-1 leading-relaxed">
              {isGoalReached
                ? 'Bravo ! Objectif du jour complété. Vous avancez régulièrement vers le podium du concours.'
                : `Plus que ${Math.max(0, targetQcms - qcmDoneToday)} questions pour valider votre objectif aujourd'hui.`}
            </p>
          </div>

          <Link
            href="/qcm"
            className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-black shadow-soft flex items-center justify-center gap-2 transition-all"
          >
            <span>{isGoalReached ? 'Faire du bonus' : 'S\'entraîner aux QCM'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
