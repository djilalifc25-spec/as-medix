'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell, Send, Trash2, CheckCircle2, Sparkles, AlertCircle,
  BookOpen, Brain, Flame, ExternalLink, RefreshCw, Check
} from 'lucide-react';
import { NotificationItem } from '@/types';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'system' | 'qcm' | 'course' | 'streak'>('system');
  const [linkUrl, setLinkUrl] = useState('/qcm');

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setErrorMsg('Veuillez renseigner le titre et le message.');
      return;
    }

    setIsSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          type,
          linkUrl: linkUrl.trim() || '/dashboard'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Notification flash diffusée avec succès à tous les étudiants !');
        setTitle('');
        setMessage('');
        fetchNotifications();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.error || 'Erreur lors de la diffusion');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Erreur réseau');
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette notification ?')) return;
    try {
      const res = await fetch(`/api/admin/notifications?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const setPreset = (presetTitle: string, presetMsg: string, presetType: 'system' | 'qcm' | 'course' | 'streak', presetLink: string) => {
    setTitle(presetTitle);
    setMessage(presetMsg);
    setType(presetType);
    setLinkUrl(presetLink);
  };

  const getTypeIcon = (t: string) => {
    switch (t) {
      case 'qcm':
        return <Brain className="w-4 h-4 text-purple-500" />;
      case 'course':
        return <BookOpen className="w-4 h-4 text-sky-500" />;
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getTypeBadge = (t: string) => {
    switch (t) {
      case 'qcm':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'course':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800';
      case 'streak':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-700 via-brand-700 to-purple-800 text-white shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white">
            <Bell className="w-3.5 h-3.5" />
            <span>Centre de Communication Étudiants</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Notifications Flash & Alertes
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl leading-relaxed">
            Diffusez des notifications instantanées visibles en temps réel dans la barre de navigation et sur mobile pour tous les étudiants.
          </p>
        </div>

        <button
          onClick={fetchNotifications}
          className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-center cursor-pointer border border-white/15"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-navy-400">
          ⚡ Modèles d'annonces en 1 clic :
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPreset(
              '🎯 Nouveaux QCMs Résidanat ajoutés !',
              'Une nouvelle série de QCMs officiels vient d\'être intégrée à la banque de questions.',
              'qcm',
              '/qcm'
            )}
            className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>🧠 Nouveaux QCMs</span>
          </button>

          <button
            type="button"
            onClick={() => setPreset(
              '📖 Nouveau cours disponible',
              'Un nouveau cours complet conforme au programme officiel est maintenant disponible.',
              'course',
              '/cours'
            )}
            className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>📚 Nouveau Cours</span>
          </button>

          <button
            type="button"
            onClick={() => setPreset(
              '🔥 Maintenez votre série de révision !',
              'Entraînez-vous aujourd\'hui pour ne pas perdre votre streak d\'apprentissage.',
              'streak',
              '/dashboard'
            )}
            className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>🔥 Rappel Série</span>
          </button>

          <button
            type="button"
            onClick={() => setPreset(
              '📢 Mise à jour de la plateforme AS-MEDIX',
              'De nouvelles fonctionnalités d\'entraînement et de statistiques sont désormais actives.',
              'system',
              '/dashboard'
            )}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>📢 Annonce Plateforme</span>
          </button>
        </div>
      </div>

      {/* Broadcast Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-soft space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-navy-800">
          <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Rédiger & Diffuser une Notification Flash
            </h2>
            <p className="text-xs text-slate-500 dark:text-navy-400">
              Cette alerte apparaîtra instantanément avec une pastille rouge sur la cloche des étudiants.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-navy-300">
                Titre de l'alerte <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex: 🎯 Nouveau Pack QCM Cardiologie disponible !"
                required
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-semibold"
              />
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-navy-300">
                Type de notification
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-semibold"
              >
                <option value="system">📢 Système / Annonce Flash</option>
                <option value="qcm">🧠 Nouveau QCM / Épreuve</option>
                <option value="course">📖 Nouveau Cours / Support</option>
                <option value="streak">🔥 Défi Révision / Streak</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-navy-300">
              Contenu du message <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="ex: 15 nouvelles questions du Résidanat 2024 viennent d'être ajoutées dans la banque de questions avec explications complètes."
              rows={3}
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium leading-relaxed resize-none"
            />
          </div>

          {/* Target link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-navy-300">
              Lien de redirection (au clic sur la notification)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="ex: /qcm?specialty=cardio ou /cours ou /dashboard"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setLinkUrl('/qcm')}
                className="px-3 py-2 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-navy-300 transition-colors"
              >
                /qcm
              </button>
              <button
                type="button"
                onClick={() => setLinkUrl('/cours')}
                className="px-3 py-2 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-navy-300 transition-colors"
              >
                /cours
              </button>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSending}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 active:scale-95 text-white font-black text-xs shadow-soft flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 fill-white" />
              <span>{isSending ? 'Diffusion en cours...' : 'Diffuser la Notification à tous les Étudiants'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Sent Notifications List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-navy-300 font-bold text-xs flex items-center justify-center">
              {notifications.length}
            </span>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Historique des Notifications Diffusées
            </h2>
          </div>
          <span className="text-xs text-slate-400">Triées par date décroissante</span>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Aucune notification n'a encore été diffusée.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-navy-800">
            {notifications.map((notif) => (
              <div key={notif.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-navy-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getTypeIcon(notif.type)}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTypeBadge(notif.type)}`}>
                        {notif.type}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(notif.date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {notif.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-navy-300 leading-relaxed max-w-2xl">
                      {notif.message}
                    </p>
                    {notif.linkUrl && (
                      <div className="flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 font-mono">
                        <ExternalLink className="w-3 h-3" />
                        <span>Lien : {notif.linkUrl}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer active:scale-95"
                    title="Supprimer cette notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
