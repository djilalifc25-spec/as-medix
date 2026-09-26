'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Sparkles, BookOpen, Check, FileText } from 'lucide-react';

interface CourseNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialNote: string;
  onSaveNote: (content: string) => void;
}

export const CourseNotesDrawer: React.FC<CourseNotesDrawerProps> = ({
  isOpen, onClose, title, initialNote, onSaveNote
}) => {
  const [content, setContent] = useState<string>(initialNote);
  const [savedToast, setSavedToast] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const openTimeRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setContent(initialNote);
  }, [initialNote]);

  // Lock scroll & hide bottom nav when drawer is open
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

  const handleSave = () => {
    onSaveNote(content);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Prevent accidental tap-through closing right after opening on mobile
    if (Date.now() - openTimeRef.current < 250) return;
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000000] flex justify-end overflow-hidden"
      onClick={handleBackdropClick}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity animate-fade-in pointer-events-none"
      />

      {/* Drawer panel */}
      <div
        className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-white/10 flex flex-col animate-in slide-in-from-right duration-300 h-full"
        onClick={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
        style={{
          paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
          touchAction: 'pan-y',
        }}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/60 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
              📝
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                Carnet de Notes & Mnémos
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-[260px]">
                {title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editor Body */}
        <div className="flex-1 p-4 sm:p-5 space-y-4 overflow-y-auto scrollbar-thin">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-300/50 dark:border-amber-700/50 text-amber-900 dark:text-amber-200 text-xs space-y-1">
            <div className="font-extrabold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Astuce d'Apprentissage Actif :</span>
            </div>
            <p className="leading-relaxed font-medium">
              Rédigez vos propres mots-clés et associations d'idées (ex: *"MNÉMO : [...]"*). Cela multiplie par 3 la rétention en mémoire à long terme.
            </p>
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Saisissez vos notes personnelles, abréviations, résumés et astuces mnémotechniques ici..."
            className="w-full h-80 sm:h-96 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5D5FEF] leading-relaxed resize-none"
          />
        </div>

        {/* Footer with touch-friendly save button */}
        <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.02] flex items-center justify-between gap-3">
          {savedToast ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Notes enregistrées !</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Sauvegarde locale</span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-xs shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer min-h-[44px]"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
