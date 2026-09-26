'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Bell, AlertTriangle, Bookmark, HelpCircle, Target,
  Calendar, Clock, Sparkles, CheckCircle2, ChevronRight, Send
} from 'lucide-react';
import { ReminderTag, StudyReminder } from '@/types';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'qcm' | 'cours' | 'cat' | 'fiche';
  targetId: string;
  targetTitle: string;
  specialtyId?: string;
  specialtyName?: string;
  existingReminder?: StudyReminder | null;
  onSaved?: (reminder: StudyReminder) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
  specialtyId = 'general',
  specialtyName = 'Médecine',
  existingReminder = null,
  onSaved
}) => {
  const [selectedTag, setSelectedTag] = useState<ReminderTag>(existingReminder?.tag || 'piege');
  const [userNote, setUserNote] = useState<string>(existingReminder?.userNote || '');
  const [timingPreset, setTimingPreset] = useState<'tonight' | 'tomorrow' | 'j3' | 'j7' | 'j30' | 'custom'>('tomorrow');
  const [customDateTime, setCustomDateTime] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unknown'>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (existingReminder) {
      setSelectedTag(existingReminder.tag);
      setUserNote(existingReminder.userNote || '');
    }
  }, [existingReminder]);

  const [mounted, setMounted] = useState(false);
  const openTimeRef = React.useRef<number>(0);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isOpen) return;
    openTimeRef.current = Date.now();
    if (typeof document !== 'undefined') {
      document.body.classList.add('modal-open');
      window.dispatchEvent(new Event('modal-state-change'));
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('modal-open');
        window.dispatchEvent(new Event('modal-state-change'));
      }
    };
  }, [isOpen]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (Date.now() - openTimeRef.current < 250) return;
    if (e.target === e.currentTarget) onClose();
  };

  const tagOptions = [
    {
      id: 'piege' as ReminderTag,
      label: "⚠️ Piège d'examen",
      desc: "Formulation trompeuse, contre-indication ou subtilité",
      color: "border-rose-300 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200",
      activeRing: "ring-2 ring-rose-500 border-rose-500 bg-rose-100/80 dark:bg-rose-900/60",
      icon: AlertTriangle,
      iconColor: "text-rose-600 dark:text-rose-400"
    },
    {
      id: 'a_revoir' as ReminderTag,
      label: "📌 À revoir absolument",
      desc: "Hésitation ou notion mal comprise à retravailler",
      color: "border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200",
      activeRing: "ring-2 ring-amber-500 border-amber-500 bg-amber-100/80 dark:bg-amber-900/60",
      icon: Bookmark,
      iconColor: "text-amber-600 dark:text-amber-400"
    },
    {
      id: 'difficile' as ReminderTag,
      label: "❓ Question difficile",
      desc: "Concept médical lourd ou physiopathologie complexe",
      color: "border-indigo-300 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200",
      activeRing: "ring-2 ring-indigo-500 border-indigo-500 bg-indigo-100/80 dark:bg-indigo-900/60",
      icon: HelpCircle,
      iconColor: "text-indigo-600 dark:text-indigo-400"
    },
    {
      id: 'priorite_concours' as ReminderTag,
      label: "🎯 Priorité Concours",
      desc: "Tombe fréquemment aux concours d'Alger / Oran / Résidanat",
      color: "border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200",
      activeRing: "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-100/80 dark:bg-emerald-900/60",
      icon: Target,
      iconColor: "text-emerald-600 dark:text-emerald-400"
    }
  ];

  const calculateTargetDate = (): { date: Date; days: number } => {
    const now = new Date();
    if (timingPreset === 'tonight') {
      const tonight = new Date();
      tonight.setHours(20, 0, 0, 0);
      if (tonight <= now) tonight.setDate(tonight.getDate() + 1);
      return { date: tonight, days: 1 };
    }
    if (timingPreset === 'tomorrow') {
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      return { date: tomorrow, days: 1 };
    }
    if (timingPreset === 'j3') {
      const j3 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      return { date: j3, days: 3 };
    }
    if (timingPreset === 'j7') {
      const j7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return { date: j7, days: 7 };
    }
    if (timingPreset === 'j30') {
      const j30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      return { date: j30, days: 30 };
    }
    if (timingPreset === 'custom' && customDateTime) {
      const custom = new Date(customDateTime);
      const diffDays = Math.max(1, Math.round((custom.getTime() - now.getTime()) / (24 * 3600 * 1000)));
      return { date: custom, days: diffDays };
    }
    return { date: new Date(now.getTime() + 24 * 60 * 60 * 1000), days: 1 };
  };

  const requestBrowserNotification = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotifPermission(perm);
      } catch (e) {}
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { date: targetDate, days } = calculateTargetDate();
      const currentTagObj = tagOptions.find(t => t.id === selectedTag);

      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType,
          targetId,
          targetTitle,
          specialtyId,
          specialtyName,
          tag: selectedTag,
          tagLabel: currentTagObj?.label || "⚠️ Piège d'examen",
          userNote,
          scheduledFor: targetDate.toISOString(),
          intervalDays: days
        })
      });

      const data = await res.json();
      if (data.success && data.reminder) {
        if (onSaved) onSaved(data.reminder);
        onClose();
      }
    } catch (e) {
      console.error('Error saving reminder:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedTagObj = tagOptions.find(t => t.id === selectedTag);
  const { date: previewDate } = calculateTargetDate();

  return createPortal(
    <div 
      className="fixed inset-0 z-[1000000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={handleBackdropClick}
      style={{ touchAction: 'pan-y' }}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-7 space-y-5 max-h-[90dvh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-slate-950 dark:text-white truncate">
                Programmer un Rappel & Marquer
              </h2>
              <p className="text-[11px] text-slate-500 truncate">
                {specialtyName} • {targetType === 'qcm' ? 'Question QCM' : 'Support de Cours'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Title Preview */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Élément à mémoriser :
          </span>
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-relaxed">
            {targetTitle}
          </p>
        </div>

        {/* Step 1: Motif & Marqueur Pédagogique */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            1. Pourquoi marquer cette notion ?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tagOptions.map(opt => {
              const Icon = opt.icon;
              const isSelected = selectedTag === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedTag(opt.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 active:scale-98 cursor-pointer ${opt.color} ${
                    isSelected ? opt.activeRing : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${opt.iconColor}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black leading-snug">{opt.label}</div>
                    <div className="text-[10px] opacity-75 line-clamp-1">{opt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Astuce Mnémotechnique ou Note Personnelle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              2. Votre astuce mnémotechnique (optionnel)
            </label>
            <span className="text-[10px] text-slate-400 font-medium">Sera affichée dans la notification</span>
          </div>
          <textarea
            value={userNote}
            onChange={e => setUserNote(e.target.value)}
            placeholder="ex: Attention au piège de l'IDR négative ! Ne jamais utiliser les bêtabloquants en cas de spasme coronaire..."
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
          />
        </div>

        {/* Step 3: Timing du Rappel */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            3. Quand voulez-vous recevoir le rappel ?
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-center">
            {[
              { id: 'tonight', label: 'Ce soir', sub: '20h00' },
              { id: 'tomorrow', label: 'Demain', sub: '+24h (J+1)' },
              { id: 'j3', label: 'J+3', sub: 'SRS Étape 1' },
              { id: 'j7', label: 'J+7', sub: 'Consolidation' },
              { id: 'j30', label: 'J+30', sub: 'Long terme' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setTimingPreset(p.id as any)}
                className={`p-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                  timingPreset === p.id
                    ? 'border-sky-500 bg-sky-500 text-white shadow-md'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{p.label}</span>
                <span className={`text-[9px] ${timingPreset === p.id ? 'text-sky-100' : 'text-slate-400'}`}>
                  {p.sub}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTimingPreset('custom')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                timingPreset === 'custom'
                  ? 'border-purple-500 bg-purple-500 text-white'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Date et Heure personnalisées</span>
            </button>

            {timingPreset === 'custom' && (
              <input
                type="datetime-local"
                value={customDateTime}
                onChange={e => setCustomDateTime(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-white"
              />
            )}
          </div>
        </div>

        {/* Live Notification Preview */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-500/30 space-y-1.5 shadow-sm">
          <div className="flex items-center justify-between text-[10px] text-indigo-300 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Aperçu de la notification
            </span>
            <span className="font-mono text-[9px] text-white/60">
              {previewDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} à {previewDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="text-xs font-black flex items-center gap-1.5 text-white">
            <span>{selectedTagObj?.label || '⚠️ Piège à réviser'} : {specialtyName}</span>
          </div>
          <p className="text-[11px] text-indigo-100 line-clamp-1 italic">
            {userNote ? `« ${userNote} » - À revoir : ${targetTitle}` : `Il est l'heure de refaire cette question : ${targetTitle}`}
          </p>
        </div>

        {/* Browser Web Push Request (if applicable) */}
        {notifPermission === 'default' && (
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 flex items-center justify-between gap-2 text-xs">
            <span>Activer les alertes sonores du navigateur ?</span>
            <button
              type="button"
              onClick={requestBrowserNotification}
              className="px-2.5 py-1 rounded-lg bg-sky-600 text-white font-bold text-[10px] hover:bg-sky-500 transition-all shrink-0 cursor-pointer"
            >
              Autoriser
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-xs shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <span>Enregistrement...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmer le Rappel</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
