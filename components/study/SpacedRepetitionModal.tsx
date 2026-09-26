'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Check, Sparkles, Brain, Clock, Bookmark } from 'lucide-react';

interface SpacedRepetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  specialty: string;
  type: 'cours' | 'qcm' | 'cat' | 'fiche';
  slugOrId: string;
  onSchedule: (confidence: 'hard' | 'medium' | 'easy' | 'perfect') => void;
}

export const SpacedRepetitionModal: React.FC<SpacedRepetitionModalProps> = ({
  isOpen, onClose, title, specialty, type, slugOrId, onSchedule
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const openTimeRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll & hide bottom nav when modal is open
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
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const options = [
    {
      confidence: 'hard' as const,
      label: '🔴 Difficile',
      days: 'J+1 (Demain)',
      desc: 'Révision prioritaire à revoir dès demain.',
      color: 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-200'
    },
    {
      confidence: 'medium' as const,
      label: '🟡 Moyen',
      days: 'J+3 (Dans 3 jours)',
      desc: 'Compréhension globale avec quelques hésitations.',
      color: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200'
    },
    {
      confidence: 'easy' as const,
      label: '🟢 Facile',
      days: 'J+7 (Dans 1 semaine)',
      desc: 'Bonne maîtrise des points clés et mnémotechniques.',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-200'
    },
    {
      confidence: 'perfect' as const,
      label: '💎 Parfait',
      days: 'J+30 (Dans 1 mois)',
      desc: 'Ancrage parfait en mémoire à long terme.',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-200'
    }
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[1000000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={handleBackdropClick}
      style={{ touchAction: 'pan-y' }}
    >
      <div
        className="card w-full max-w-lg rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-5 sm:p-6 space-y-5 my-auto max-h-[90dvh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5D5FEF] to-[#7c3aed] text-white flex items-center justify-center text-xl shadow-md shrink-0">
              📌
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                Épingler pour Révision Spacée
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Courbe de l'Oubli de Ebbinghaus (J+1, J+3, J+7, J+30)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Title */}
        <div className="space-y-1 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Document épinglé :</span>
          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{title}</p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
            Évaluez votre niveau de maîtrise actuel :
          </label>
          <div className="space-y-2">
            {options.map((opt) => (
              <button
                key={opt.confidence}
                type="button"
                onClick={() => {
                  onSchedule(opt.confidence);
                  onClose();
                }}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all active:scale-[0.98] flex items-center justify-between gap-3 cursor-pointer min-h-[52px] ${opt.color}`}
              >
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="font-black text-xs sm:text-sm">{opt.label}</div>
                  <p className="text-[11px] opacity-80 leading-tight">{opt.desc}</p>
                </div>
                <span className="text-xs font-mono font-black px-2.5 py-1 rounded-xl bg-white/70 dark:bg-black/30 border border-current shrink-0">
                  {opt.days}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cancel Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
