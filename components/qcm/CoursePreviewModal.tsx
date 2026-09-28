'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, BookOpen, Sparkles, FileText, ExternalLink, ShieldCheck, ChevronRight, AlertTriangle, Siren, Pill, Brain } from 'lucide-react';
import { Course } from '@/types';

interface CoursePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  courseTitle?: string;
  specialtyName?: string;
  explanation?: string;
}

interface ExtractedCallout {
  type: 'rappel' | 'piege' | 'urgence' | 'traitement' | 'note' | 'point-cle';
  title: string;
  content: string;
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
  const [activeTab, setActiveTab] = useState<'EXPLANATION' | 'AI_SYNTHESIS' | 'FULL_COURSE'>('EXPLANATION');

  useEffect(() => {
    if (isOpen && courseId) {
      setLoading(true);
      fetch(`/api/cours/${courseId}`)
        .then(r => r.json())
        .then(d => {
          if (d.course) {
            setCourse(d.course);
            if (explanation) {
              setActiveTab('EXPLANATION');
            } else {
              setActiveTab('AI_SYNTHESIS');
            }
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen, courseId, explanation]);

  // Dynamic extraction of callout boxes from HTML content
  const extractedCallouts = useMemo(() => {
    if (!course || !course.htmlContent) return [];

    const callouts: ExtractedCallout[] = [];
    const html = course.htmlContent;

    // Helper regex parser for class names and raw text keywords
    const regex = /<(div|blockquote|p)\s*([^>]*)>([\s\S]*?)<\/\1>/gi;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(html)) !== null) {
      const attrs = match[2].toLowerCase();
      const rawText = match[3].replace(/<[^>]*>?/gm, '').trim();

      if (!rawText || rawText.length < 5) continue;

      if (attrs.includes('piege') || attrs.includes('warning') || rawText.includes('⚠️') || rawText.toLowerCase().includes('piège')) {
        callouts.push({ type: 'piege', title: '⚠️ Piège de Concours & Diagnostic Différentiel', content: rawText });
      } else if (attrs.includes('urgence') || attrs.includes('danger') || rawText.includes('🚨') || rawText.toLowerCase().includes('urgence')) {
        callouts.push({ type: 'urgence', title: '🚨 Urgence Médicale H24', content: rawText });
      } else if (attrs.includes('traitement') || rawText.includes('💊') || rawText.toLowerCase().includes('traitement')) {
        callouts.push({ type: 'traitement', title: '💊 Stratégie Thérapeutique', content: rawText });
      } else if (attrs.includes('rappel') || rawText.includes('📌') || rawText.toLowerCase().includes('rappel')) {
        callouts.push({ type: 'rappel', title: '📌 Rappel Anatomoclinique', content: rawText });
      } else if (attrs.includes('note') || attrs.includes('point-cle') || rawText.includes('💡') || rawText.includes('⭐') || rawText.toLowerCase().includes('perle')) {
        callouts.push({ type: 'note', title: '💡 Note de Synthèse', content: rawText });
      }
    }

    return callouts.slice(0, 8); // Top extractions
  }, [course]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-[#5D5FEF] dark:text-indigo-400 border border-indigo-500/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Passerelle Théorique Inteligente • {specialtyName || 'Spécialité'}
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                {courseTitle || course?.title || 'Support de Cours'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Tab Switcher */}
        <div className="px-4 sm:px-6 pt-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-bold">
          {explanation && (
            <button
              onClick={() => setActiveTab('EXPLANATION')}
              className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'EXPLANATION'
                  ? 'border-[#5D5FEF] text-[#5D5FEF] dark:text-indigo-400 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              💡 Explication Médicale
            </button>
          )}

          <button
            onClick={() => setActiveTab('AI_SYNTHESIS')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'AI_SYNTHESIS'
                ? 'border-[#5D5FEF] text-[#5D5FEF] dark:text-indigo-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Synthèse & Extrait Intelligents</span>
          </button>

          <button
            onClick={() => setActiveTab('FULL_COURSE')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'FULL_COURSE'
                ? 'border-[#5D5FEF] text-[#5D5FEF] dark:text-indigo-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            📘 Cours Complet
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 scrollbar-thin">
          
          {/* TAB 1: EXPLANATION */}
          {activeTab === 'EXPLANATION' && (
            <div className="space-y-3">
              {explanation ? (
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Justification Clinique & Anatomoclinique</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed space-y-2">
                    <p>{typeof explanation === 'string' ? explanation : (explanation ? String(explanation) : '')}</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  Pas d'explication spécifique renseignée pour ce QCM. Consultez la synthèse extraite du cours ci-dessus.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI SYNTHESIS & EXTRACTED CALLOUTS */}
          {activeTab === 'AI_SYNTHESIS' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/20 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                  <Brain className="w-4 h-4 text-[#5D5FEF] shrink-0" />
                  <span>
                    Extraction automatique des notions théoriques fondamentales de <strong>{courseTitle || course?.title || 'ce cours'}</strong>
                  </span>
                </div>
              </div>

              {/* Summary Points */}
              {course?.summaryPoints && course.summaryPoints.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Points Clés Indispensables pour le Concours :</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                    {course.summaryPoints.map((pt, idx) => (
                      <li key={idx} className="leading-relaxed font-medium">{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Extracted Callout Cards */}
              {extractedCallouts.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Notions & Encadrés Médicaux Dénichés dans le Cours :
                  </div>
                  {extractedCallouts.map((c, idx) => {
                    let styleClass = 'bg-indigo-50/70 text-indigo-900 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-900';
                    let icon = <BookOpen className="w-4 h-4 text-indigo-600" />;

                    if (c.type === 'piege') {
                      styleClass = 'bg-amber-50/80 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900';
                      icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
                    } else if (c.type === 'urgence') {
                      styleClass = 'bg-rose-50/80 text-rose-900 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900';
                      icon = <Siren className="w-4 h-4 text-rose-600" />;
                    } else if (c.type === 'traitement') {
                      styleClass = 'bg-emerald-50/80 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900';
                      icon = <Pill className="w-4 h-4 text-emerald-600" />;
                    }

                    return (
                      <div key={idx} className={`p-3.5 rounded-2xl border space-y-1.5 ${styleClass}`}>
                        <div className="flex items-center gap-2 font-bold text-xs">
                          {icon}
                          <span>{c.title}</span>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">{c.content}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-500">
                  {course ? (
                    <p>Consultez l'onglet <strong>Cours Complet</strong> pour lire le texte intégral.</p>
                  ) : (
                    <p>Chargement des notions du cours en cours...</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FULL COURSE */}
          {activeTab === 'FULL_COURSE' && (
            <div className="space-y-4">
              {loading ? (
                <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
                  Chargement des ressources de cours...
                </div>
              ) : course ? (
                <div className="space-y-4">
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
