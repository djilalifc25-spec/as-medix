'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, List, ChevronRight, Check, BookOpen } from 'lucide-react';
import { TocItem } from '@/lib/utils/tocExtractor';

interface TocModalProps {
  isOpen: boolean;
  onClose: () => void;
  toc: TocItem[];
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  courseTitle?: string;
}

export const TocModal: React.FC<TocModalProps> = ({
  isOpen,
  onClose,
  toc,
  activeSection,
  onSelectSection,
  courseTitle
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000000] bg-navy-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-navy-900 rounded-3xl shadow-soft-2xl border border-navy-100 dark:border-navy-800 overflow-hidden flex flex-col max-h-[85dvh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-navy-100 dark:border-navy-800 flex items-center justify-between gap-3 bg-gradient-to-r from-brand-900/10 via-indigo-900/5 to-purple-900/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md shrink-0">
              <List className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-navy-950 dark:text-white truncate flex items-center gap-2">
                <span>Sommaire du Cours</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-mono font-bold">
                  {toc.length} section{toc.length > 1 ? 's' : ''}
                </span>
              </h2>
              {courseTitle && (
                <p className="text-xs text-navy-500 dark:text-navy-400 truncate">
                  {courseTitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-navy-100 dark:bg-navy-800 text-navy-500 dark:text-navy-300 hover:text-navy-900 dark:hover:text-white transition-colors"
            title="Fermer le sommaire"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2 max-h-[65dvh]">
          {toc.length === 0 ? (
            <div className="py-8 text-center text-xs text-navy-400">
              Aucune section détectée dans ce cours.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {toc.map((item, idx) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectSection(item.id);
                      onClose();
                    }}
                    className={`p-3 sm:p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between group active:scale-98 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white border-brand-500 shadow-md ring-2 ring-brand-500/30'
                        : 'bg-slate-50 dark:bg-navy-950/60 text-navy-800 dark:text-navy-200 border-navy-150 dark:border-navy-800 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-navy-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className={`w-6 h-6 rounded-xl text-[11px] font-black font-mono flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-navy-200/60 dark:bg-navy-800 text-navy-700 dark:text-navy-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="truncate leading-snug">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {isActive && <Check className="w-4 h-4 text-white" />}
                      <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                        isActive ? 'text-white' : 'text-navy-400'
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-navy-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/50 flex items-center justify-between text-xs">
          <span className="text-navy-400 font-medium">
            Cliquez sur une partie pour y accéder directement
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 font-bold hover:bg-navy-200 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
