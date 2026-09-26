'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Brain, Siren, Sparkles, CheckCircle2, ArrowRight,
  TrendingUp, Clock, Calendar, Star, FileText, Pill, Stethoscope,
  Activity, ShieldAlert, Award, AlertTriangle, Check, RotateCcw,
  Zap, Target, ChevronRight, HelpCircle, Eye, BarChart3, HeartPulse, RefreshCw,
  Trophy, Layers, BookmarkCheck
} from 'lucide-react';
import { INITIAL_QCMS } from '@/lib/db/seedQcm';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { StudyReminder, ReminderStats, ReminderTag } from '@/types';
import { useToast } from '@/components/context/ToastContext';
import { DailyClinicalPearl } from '@/components/dashboard/DailyClinicalPearl';
import { RevisionGoalTracker } from '@/components/dashboard/RevisionGoalTracker';
import { PinterestClinicalCockpit } from '@/components/dashboard/PinterestClinicalCockpit';

export default function DashboardPage() {
  const { showToast } = useToast();
  const [reminders, setReminders] = useState<StudyReminder[]>([]);
  const [stats, setStats] = useState<ReminderStats>({
    totalActive: 0, dueTodayCount: 0, piegesCount: 0, qcmsCount: 0, coursCount: 0,
    retentionRate: 100, byTag: { piege: 0, a_revoir: 0, difficile: 0, priorite_concours: 0 },
  });
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [userProgress, setUserProgress] = useState<{
    totalQcms: number; totalAnswered: number; totalCorrect: number;
    doneQcmIds: string[]; correctQcmIds: string[];
    statsBySpecialty: Record<string, { totalQcms: number; doneQcms: number; correctQcms: number }>;
  }>({
    totalQcms: INITIAL_QCMS.length, totalAnswered: 0, totalCorrect: 0,
    doneQcmIds: [], correctQcmIds: [], statsBySpecialty: {}
  });

  const [daysToExam, setDaysToExam] = useState<number>(21);

  useEffect(() => {
    const examDate = new Date('2027-10-15T08:00:00');
    const now = new Date();
    const diffDays = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    setDaysToExam(Math.max(0, diffDays));
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await fetch('/api/reminders');
      if (res.ok) {
        const data = await res.json();
        if (data.success) { setReminders(data.reminders || []); if (data.stats) setStats(data.stats); }
      }
    } catch {} finally { setLoadingReminders(false); }
  };

  const fetchProgress = async () => {
    setIsRefreshingStats(true);
    try {
      const res = await fetch('/api/qcm/attempt');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUserProgress({
            totalQcms: data.totalQcms || INITIAL_QCMS.length,
            totalAnswered: data.totalAnswered || data.doneQcmIds?.length || 0,
            totalCorrect: data.totalCorrect || 0,
            doneQcmIds: data.doneQcmIds || [],
            correctQcmIds: data.correctQcmIds || [],
            statsBySpecialty: data.statsBySpecialty || {}
          });
        }
      }
    } catch {} finally { setIsRefreshingStats(false); }
  };

  useEffect(() => { fetchReminders(); fetchProgress(); }, []);

  const handleManualRefresh = async () => {
    await fetchProgress(); await fetchReminders();
    showToast({ type: 'success', title: 'Statistiques à jour 🔄', message: 'Vos scores ont été synchronisés.' });
  };

  const handleMarkCompleted = async (id: string, title: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch('/api/reminders', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'complete' }),
      });
      if (res.ok) { showToast({ type: 'success', title: '✅ Maîtrisé !', message: `"${title}" marqué comme révisé.` }); await fetchReminders(); }
    } catch { showToast({ type: 'error', title: 'Erreur', message: 'Impossible de valider ce rappel.' }); }
    finally { setActionLoadingId(null); }
  };

  const handlePostpone24h = async (id: string, title: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch('/api/reminders', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'postpone', postponeHours: 24 }),
      });
      if (res.ok) { showToast({ type: 'info', title: '⏱️ Reporté 24h', message: `"${title}" reprogrammé pour demain.` }); await fetchReminders(); }
    } catch { showToast({ type: 'error', title: 'Erreur', message: 'Impossible de reporter.' }); }
    finally { setActionLoadingId(null); }
  };

  const getTagBadge = (tag: ReminderTag) => {
    const map: Record<string, { label: string; cls: string }> = {
      piege:             { label: '⚠️ Piège',         cls: 'badge-red' },
      a_revoir:          { label: '📌 À revoir',       cls: 'badge-amber' },
      difficile:         { label: '❓ Difficile',      cls: 'badge-iris' },
      priorite_concours: { label: '🎯 Concours',       cls: 'badge-green' },
    };
    const item = map[tag];
    return item ? <span className={`badge ${item.cls}`}>{item.label}</span> : null;
  };

  const dueReminders = reminders.filter(r => r.status === 'pending' && new Date(r.scheduledFor).getTime() <= Date.now());
  const pendingUpcoming = reminders.filter(r => r.status === 'pending' && new Date(r.scheduledFor).getTime() > Date.now());

  const totalTreated = userProgress.totalAnswered;
  const totalBank = Math.max(userProgress.totalQcms, INITIAL_QCMS.length);
  const percentCovered = totalBank > 0 ? Math.round((totalTreated / totalBank) * 100) : 0;
  const successRate = totalTreated > 0 ? Math.round((userProgress.totalCorrect / totalTreated) * 100) : 0;
  const questionsRemaining = Math.max(0, totalBank - totalTreated);

  const sortedSpecialties = ALL_SPECIALTIES.map(spec => {
    const specStats = userProgress.statsBySpecialty[spec.id];
    const totalInSpec = specStats?.totalQcms ?? INITIAL_QCMS.filter(q => q.specialtyId === spec.id).length;
    const doneInSpec  = specStats?.doneQcms  ?? userProgress.doneQcmIds.filter(id => INITIAL_QCMS.find(q => q.id === id)?.specialtyId === spec.id).length;
    const correctInSpec = specStats?.correctQcms ?? 0;
    const percent    = totalInSpec > 0 ? Math.round((doneInSpec / totalInSpec) * 100) : 0;
    const specSuccess = doneInSpec > 0 ? Math.round((correctInSpec / doneInSpec) * 100) : 0;
    return { ...spec, totalInSpec, doneInSpec, correctInSpec, percent, specSuccess };
  }).sort((a, b) => a.percent - b.percent);

  const weakestSpecialty = sortedSpecialties[0] || ALL_SPECIALTIES[0];

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-5 space-y-6 animate-fade-up">

        {/* ── HERO BANNER ── */}
        <div
          className="relative rounded-3xl p-6 sm:p-8 overflow-hidden text-white"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4340C4 100%)' }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-[#5D5FEF]/20 blur-2xl" />
            <div className="absolute right-1/3 top-1/2 w-32 h-32 rounded-full bg-white/3 blur-xl" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="badge" style={{ background:'rgba(255,255,255,0.15)', color:'#fff', borderColor:'rgba(255,255,255,0.2)' }}>
                  <Sparkles className="w-3 h-3" />
                  Résidanat 2027 • Algérie
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Bonjour, Docteur 🩺
              </h1>
              <p className="text-sm text-white/70 leading-relaxed">
                Continuez votre préparation avec les QCM, les 9 560 médicaments Pharmnet DZ et les protocoles d'urgence H24.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Link href="/garde" className="btn btn-primary text-xs" style={{ background:'#EF4444', boxShadow:'0 2px 8px rgba(239,68,68,0.4)' }}>
                  <Siren className="w-3.5 h-3.5 animate-pulse" />
                  Mode Garde H24
                </Link>
                <Link href="/medicaments" className="btn text-xs" style={{ background:'rgba(255,255,255,0.12)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'12px', padding:'9px 16px' }}>
                  <Pill className="w-3.5 h-3.5 text-cyan-300" />
                  Pharmnet DZ (9 560)
                </Link>
                {stats.piegesCount > 0 && (
                  <Link href="/qcm-session?remindersOnly=true" className="btn text-xs" style={{ background:'#F59E0B', color:'#1a1a1a', borderRadius:'12px', padding:'9px 16px', fontWeight:700, boxShadow:'0 2px 8px rgba(245,158,11,0.4)' }}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Session Pièges ({stats.piegesCount})
                  </Link>
                )}
              </div>
            </div>

            {/* Countdown */}
            <div className="shrink-0 flex flex-row sm:flex-col items-center gap-3 sm:gap-1 p-4 sm:p-5 rounded-2xl"
              style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.12)' }}>
              <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Résidanat
                </div>
                <div className="text-4xl sm:text-5xl font-black font-mono text-white leading-none my-1">{daysToExam}</div>
                <div className="text-[10px] text-white/60 font-medium">jours restants</div>
              </div>
              <div className="hidden sm:block w-full border-t border-white/10 my-2" />
              <div className="text-center">
                <div className="text-[10px] text-white/50">Octobre 2027</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI STATS ROW ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'QCMs Traités',
              value: totalTreated,
              icon: CheckCircle2,
              change: `${percentCovered}% de la banque`,
              changeUp: true,
              color: '#5D5FEF',
              bg: '#EEF2FF',
            },
            {
              label: 'Taux de Réussite',
              value: `${successRate}%`,
              icon: Trophy,
              change: successRate >= 70 ? 'Excellent niveau' : 'À améliorer',
              changeUp: successRate >= 70,
              color: '#10B981',
              bg: '#ECFDF5',
            },
            {
              label: 'Rappels Actifs',
              value: stats.totalActive,
              icon: BookmarkCheck,
              change: `${dueReminders.length} à réviser`,
              changeUp: dueReminders.length === 0,
              color: '#F59E0B',
              bg: '#FFFBEB',
            },
            {
              label: 'QCMs Restants',
              value: questionsRemaining,
              icon: Target,
              change: `Sur ${totalBank} au total`,
              changeUp: questionsRemaining < totalBank / 2,
              color: '#EF4444',
              bg: '#FEF2F2',
            },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="stat-card">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="stat-card-label">{kpi.label}</div>
                    <div className="stat-card-value mt-1">{kpi.value}</div>
                    <div className={`stat-card-change ${kpi.changeUp ? 'up' : 'down'}`}>
                      {kpi.changeUp ? '↑' : '↓'} {kpi.change}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: kpi.bg, color: kpi.color }}>
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: i === 0 ? `${percentCovered}%` : i === 1 ? `${successRate}%` : i === 2 ? `${Math.min(100, (stats.totalActive / 20) * 100)}%` : `${Math.min(100, 100 - percentCovered)}%`,
                      background: kpi.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CLINICAL COCKPIT (Pinterest Design) ── */}
        <PinterestClinicalCockpit />

        {/* ── MAIN GRID ── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-5">

            {/* Daily Clinical Pearl */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Perle Clinique du Jour</h3>
                    <p className="text-xs text-slate-500">QCM flash avec explication clinique complète</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <DailyClinicalPearl />
              </div>
            </div>

            {/* Quick Access Modules */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Accès Rapide</h3>
                <Link href="/cours" className="text-xs font-semibold text-[#5D5FEF] hover:underline flex items-center gap-1">
                  Tout voir <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { href: '/qcm',         icon: Brain,       label: 'QCM Résidanat',  badge: 'ANNALES',  color: '#5D5FEF', bg: '#EEF2FF' },
                  { href: '/cours',       icon: BookOpen,    label: 'Cours Médicaux', badge: '',         color: '#2563EB', bg: '#EFF6FF' },
                  { href: '/cat',         icon: Siren,       label: 'CAT Urgences',   badge: 'H24',      color: '#EF4444', bg: '#FEF2F2' },
                  { href: '/ecg',         icon: HeartPulse,  label: 'ECG du Jour',    badge: '',         color: '#EC4899', bg: '#FDF2F8' },
                  { href: '/medicaments', icon: Pill,        label: 'Pharmnet DZ',    badge: '9 560',    color: '#059669', bg: '#ECFDF5' },
                  { href: '/fiches',      icon: Zap,         label: 'Fiches Flash',   badge: '',         color: '#D97706', bg: '#FFFBEB' },
                ].map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <Link key={i} href={m.href} className="card hover-lift p-4 flex flex-col gap-3 group">
                      <div className="flex items-start justify-between">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: m.bg, color: m.color }}>
                          <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                        </div>
                        {m.badge && <span className="badge badge-iris text-[10px]">{m.badge}</span>}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-[#5D5FEF] transition-colors">
                          {m.label}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Specialty Progress */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-iris-50 dark:bg-iris-900/20 text-[#5D5FEF] flex items-center justify-center">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Progression par Spécialité</h3>
                    <p className="text-xs text-slate-500">QCMs traités vs total disponible</p>
                  </div>
                </div>
                <button onClick={handleManualRefresh} disabled={isRefreshingStats}
                  className="p-2 rounded-xl btn-ghost text-slate-400 hover:text-[#5D5FEF]" title="Actualiser">
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingStats ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto scrollbar-none">
                {sortedSpecialties.slice(0, 10).map((spec) => (
                  <Link key={spec.id} href={`/qcm?specialty=${spec.id}`}
                    className="flex items-center gap-3 group hover:bg-slate-50 dark:hover:bg-white/4 rounded-xl p-2 -m-2 transition-colors">
                    <div className="w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: spec.color }}>
                      {spec.shortName?.[0] || spec.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{spec.name}</span>
                        <span className="text-xs text-slate-400 shrink-0 ml-2">{spec.doneInSpec}/{spec.totalInSpec}</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${spec.percent}%`, background: spec.color }} />
                      </div>
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${spec.percent >= 70 ? 'text-emerald-600' : spec.percent >= 40 ? 'text-amber-600' : 'text-red-500'}`}>
                      {spec.percent}%
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">

            {/* Goal Tracker */}
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-white/8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Objectif du Jour</h3>
                    <p className="text-xs text-slate-500">Suivi de votre révision quotidienne</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <RevisionGoalTracker />
              </div>
            </div>

            {/* Due Reminders */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">À Réviser</h3>
                    <p className="text-xs text-slate-500">{dueReminders.length} rappel{dueReminders.length !== 1 ? 's' : ''} en attente</p>
                  </div>
                </div>
                {stats.piegesCount > 0 && (
                  <span className="badge badge-red">{stats.piegesCount} piège{stats.piegesCount > 1 ? 's' : ''}</span>
                )}
              </div>
              <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-72 overflow-y-auto scrollbar-none">
                {loadingReminders ? (
                  <div className="p-4 space-y-2">
                    {[1,2,3].map(i => <div key={i} className="skeleton h-12 w-full" />)}
                  </div>
                ) : dueReminders.length === 0 ? (
                  <div className="py-8 text-center">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tout est à jour !</p>
                    <p className="text-xs text-slate-500 mt-1">Aucun rappel dû pour le moment.</p>
                  </div>
                ) : (
                  dueReminders.slice(0, 5).map(reminder => (
                    <div key={reminder.id} className="p-4 hover:bg-slate-50 dark:hover:bg-white/4 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                          <HelpCircle className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">{reminder.targetTitle}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {reminder.tag && getTagBadge(reminder.tag)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleMarkCompleted(reminder.id, reminder.targetTitle)}
                          disabled={actionLoadingId === reminder.id}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl text-xs font-bold bg-[#5D5FEF] text-white hover:bg-[#4340C4] transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" /> Maîtrisé
                        </button>
                        <button
                          onClick={() => handlePostpone24h(reminder.id, reminder.targetTitle)}
                          disabled={actionLoadingId === reminder.id}
                          className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/12 transition-colors disabled:opacity-50"
                        >
                          <RotateCcw className="w-3 h-3" /> +24h
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {dueReminders.length > 5 && (
                <div className="px-4 py-3 border-t border-slate-100 dark:border-white/8">
                  <Link href="/reminders" className="text-xs font-semibold text-[#5D5FEF] hover:underline flex items-center justify-center gap-1">
                    Voir les {dueReminders.length - 5} autres <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Weakest Specialty */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Spécialité Prioritaire</h3>
                  <p className="text-xs text-slate-500">À renforcer en priorité</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: weakestSpecialty.color + '12', border: `1px solid ${weakestSpecialty.color}22` }}>
                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-lg font-black text-white"
                  style={{ background: weakestSpecialty.color }}>
                  {weakestSpecialty.shortName?.[0] || weakestSpecialty.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-800 dark:text-white truncate">{weakestSpecialty.name}</div>
                  <div className="text-xs text-slate-500">
                    {(weakestSpecialty as any).doneInSpec || 0} / {(weakestSpecialty as any).totalInSpec || weakestSpecialty.totalQcms || 0} QCMs
                  </div>
                </div>
                <span className="text-lg font-black" style={{ color: weakestSpecialty.color }}>
                  {(weakestSpecialty as any).percent || 0}%
                </span>
              </div>

              <div className="mt-3 progress-track">
                <div className="progress-fill" style={{ width: `${(weakestSpecialty as any).percent || 0}%`, background: weakestSpecialty.color }} />
              </div>

              <Link
                href={`/qcm?specialty=${weakestSpecialty.id}`}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${weakestSpecialty.color}, ${weakestSpecialty.color}cc)` }}
              >
                <Brain className="w-4 h-4" />
                Entraîner cette spécialité
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
