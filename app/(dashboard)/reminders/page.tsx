'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell, AlertTriangle, CheckCircle2, RotateCcw, Clock, Target,
  Brain, BookOpen, ChevronRight, Check, Sparkles, Filter, RefreshCw
} from 'lucide-react';
import { StudyReminder, ReminderStats, ReminderTag } from '@/types';
import { useToast } from '@/components/context/ToastContext';

export default function RemindersPage() {
  const { showToast } = useToast();
  const [reminders, setReminders] = useState<StudyReminder[]>([]);
  const [stats, setStats] = useState<ReminderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterTag, setFilterTag] = useState<string>('all');
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchReminders = async () => {
    try {
      const res = await fetch('/api/reminders');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReminders(data.reminders || []);
          if (data.stats) setStats(data.stats);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleMarkCompleted = async (id: string, title: string) => {
    setActionId(id);
    try {
      const res = await fetch('/api/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'complete' }),
      });
      if (res.ok) {
        showToast({
          type: 'success',
          title: 'Rappel maîtrisé ! ✅',
          message: `"${title}" est validé avec succès.`
        });
        await fetchReminders();
      }
    } catch {
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de valider ce rappel.' });
    } finally {
      setActionId(null);
    }
  };

  const handlePostpone24h = async (id: string, title: string) => {
    setActionId(id);
    try {
      const res = await fetch('/api/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'postpone', postponeHours: 24 }),
      });
      if (res.ok) {
        showToast({
          type: 'info',
          title: 'Reporté de 24h ⏱️',
          message: `"${title}" reprogrammé pour demain.`
        });
        await fetchReminders();
      }
    } catch {
      showToast({ type: 'error', title: 'Erreur', message: 'Impossible de reporter ce rappel.' });
    } finally {
      setActionId(null);
    }
  };

  const getTagBadge = (tag: ReminderTag) => {
    const map: Record<string, { label: string; cls: string }> = {
      piege:             { label: '⚠️ Piège d\'Examen',  cls: 'badge-red' },
      a_revoir:          { label: '📌 À revoir',         cls: 'badge-amber' },
      difficile:         { label: '❓ Difficile',        cls: 'badge-iris' },
      priorite_concours: { label: '🎯 Concours',         cls: 'badge-green' },
    };
    const item = map[tag];
    return item ? <span className={`badge ${item.cls}`}>{item.label}</span> : null;
  };

  const filteredReminders = reminders.filter(r => {
    if (filterTag === 'all') return true;
    return r.tag === filterTag;
  });

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-3 sm:px-5 py-5 space-y-6 animate-fade-up">
        
        {/* Header Banner */}
        <div className="card p-6 sm:p-8 bg-gradient-to-br from-iris-950 via-slate-900 to-indigo-950 text-white rounded-3xl border border-iris-500/20 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
                <Bell className="w-3 h-3 text-amber-300" />
                Répétition Spacée & Pièges
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Mes Rappels & Pièges d'Examen
            </h1>
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
              Retrouvez ici tous les QCMs et cours marqués pour révision. Répondez aux questions dues pour maximiser votre taux de rétention jusqu'au concours.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <Link
                href="/qcm-session?remindersOnly=true"
                className="btn btn-primary text-xs"
                style={{ background: '#5D5FEF' }}
              >
                <Brain className="w-3.5 h-3.5" />
                Lancer Session Pièges ({stats?.piegesCount || 0})
              </Link>
              <button
                type="button"
                onClick={fetchReminders}
                className="btn btn-outline text-xs text-white border-white/20 hover:bg-white/10"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="stat-card">
            <div className="stat-card-label">Rappels Actifs</div>
            <div className="stat-card-value text-[#5D5FEF]">{stats?.totalActive || 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">À réviser</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Dûs Aujourd'hui</div>
            <div className="stat-card-value text-red-500">{stats?.dueTodayCount || 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">Priorité 24h</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Pièges Marqués</div>
            <div className="stat-card-value text-amber-500">{stats?.piegesCount || 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">Points critiques</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Taux de Rétention</div>
            <div className="stat-card-value text-emerald-500">{stats?.retentionRate || 100}%</div>
            <div className="text-[11px] text-slate-500 mt-1">SRS Efficacité</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'piege', label: '⚠️ Pièges d\'Examen' },
            { id: 'a_revoir', label: '📌 À revoir' },
            { id: 'difficile', label: '❓ Difficiles' },
            { id: 'priorite_concours', label: '🎯 Priorité Concours' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterTag(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterTag === f.id
                  ? 'bg-[#5D5FEF] text-white shadow-iris'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-[#5D5FEF]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reminders List */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                Liste des questions & notions ({filteredReminders.length})
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {loading ? (
              <div className="p-6 text-center text-sm text-slate-400">
                Chargement de vos rappels...
              </div>
            ) : filteredReminders.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Aucun rappel dans cette catégorie
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Lors de vos séances de QCM ou de lecture de cours, cliquez sur le bouton <strong>"🔔 Rappel"</strong> pour programmer une révision automatique.
                </p>
              </div>
            ) : (
              filteredReminders.map(reminder => (
                <div key={reminder.id} className="p-4 sm:p-5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {reminder.tag && getTagBadge(reminder.tag)}
                        {reminder.specialtyName && (
                          <span className="badge badge-slate text-[10px]">{reminder.specialtyName}</span>
                        )}
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          Prévu : {new Date(reminder.scheduledFor).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                        {reminder.targetTitle}
                      </p>
                      {reminder.userNote && (
                        <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                          💬 {reminder.userNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions on Mobile & Desktop */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      disabled={actionId === reminder.id}
                      onClick={() => handleMarkCompleted(reminder.id, reminder.targetTitle)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-bold bg-[#5D5FEF] text-white hover:bg-[#4340C4] active:scale-95 transition-all disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Maîtrisé</span>
                    </button>
                    <button
                      type="button"
                      disabled={actionId === reminder.id}
                      onClick={() => handlePostpone24h(reminder.id, reminder.targetTitle)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/8 text-slate-700 dark:text-slate-300 hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>+24h</span>
                    </button>
                    {reminder.targetType === 'qcm' && (
                      <Link
                        href={`/qcm-session?qcmId=${reminder.targetId}`}
                        className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 active:scale-95 transition-all"
                      >
                        <Brain className="w-3.5 h-3.5" />
                        <span>S'entraîner</span>
                      </Link>
                    )}
                    {reminder.targetType === 'cours' && (
                      <Link
                        href={`/cours/${reminder.targetId}`}
                        className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 active:scale-95 transition-all"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Lire le cours</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
