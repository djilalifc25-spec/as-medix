'use client';

import React, { useState, useEffect } from 'react';
import { X, BookOpen, Sparkles, FileText, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { Course } from '@/types';

interface CoursePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  courseTitle?: string;
  specialtyName?: string;
  explanation?: string;
}

export function CoursePreviewModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  specialtyName,
  explanation
}: CoursePreviewModalProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'EXPLANATION' | 'COURSE'>('EXPLANATION');

  useEffect(() => {
    if (isOpen && courseId) {
      setLoading(true);
      fetch(`/api/cours/${courseId}`)
        .then(r => r.json())
        .then(d => {
          if (d.course) {
            setCourse(d.course);
            setActiveTab('COURSE');
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen, courseId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-[#5D5FEF] dark:text-indigo-400 border border-indigo-500/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Passerelle Théorique • {specialtyName || 'Spécialité'}
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                {courseTitle || course?.title || 'Support de Cours'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-bold">
          {explanation && (
            <button
              onClick={() => setActiveTab('EXPLANATION')}
              className={`pb-3 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'EXPLANATION'
                  ? 'border-[#5D5FEF] text-[#5D5FEF] dark:text-indigo-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              💡 Rappel Médical du QCM
            </button>
          )}

          <button
            onClick={() => setActiveTab('COURSE')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'COURSE'
                ? 'border-[#5D5FEF] text-[#5D5FEF] dark:text-indigo-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            📘 Cours Complet & Fiche Synthese
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 scrollbar-thin">
          {activeTab === 'EXPLANATION' && explanation && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Explication Clinique & Pièges Fréquents</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed space-y-2">
                  <p>{explanation}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'COURSE' && (
            <div className="space-y-4">
              {loading ? (
                <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
                  Chargement des ressources de cours...
                </div>
              ) : course ? (
                <div className="space-y-4">
                  {/* Summary Points if available */}
                  {course.summaryPoints && course.summaryPoints.length > 0 && (
                    <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Points Clés du Cours à Retenir pour le Concours :</span>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                        {course.summaryPoints.map((pt, idx) => (
                          <li key={idx} className="leading-relaxed">{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* HTML Content */}
                  {course.htmlContent ? (
                    <div
                      className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: course.htmlContent }}
                    />
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center">
                      Le contenu intégral de ce cours est accessible dans la section dédiée Cours.
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Vous révisez les QCM de <strong className="text-indigo-600 dark:text-indigo-400">{courseTitle || specialtyName}</strong>.
                  </p>
                  {explanation && (
                    <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 text-left text-xs text-slate-700 dark:text-slate-300">
                      <strong>Note de synthèse :</strong> {explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Votre session QCM reste active en arrière-plan</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#5D5FEF] hover:bg-[#4340C4] text-white font-bold transition-all shadow-sm cursor-pointer"
          >
            Reprendre mon Épreuve QCM
          </button>
        </div>
      </div>
    </div>
  );
}
