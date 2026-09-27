'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, ChevronRight, FileText, ArrowRight, Sparkles } from 'lucide-react';

export interface SearchMatchResult {
  id: string;
  sectionTitle: string;
  snippetBefore: string;
  matchedText: string;
  snippetAfter: string;
  fullSnippet: string;
  elementId?: string;
  occurrenceIndex: number;
}

interface CourseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  courseTitle?: string;
  onSelectMatch: (match: SearchMatchResult) => void;
}

function normalizeStr(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export const CourseSearchModal: React.FC<CourseSearchModalProps> = ({
  isOpen,
  onClose,
  htmlContent,
  courseTitle,
  onSelectMatch
}) => {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Extract matches from htmlContent with accent-normalized searching
  const matches = useMemo<SearchMatchResult[]>(() => {
    const qRaw = query.trim();
    if (!qRaw || qRaw.length < 2 || !htmlContent) return [];

    const normQ = normalizeStr(qRaw);
    const results: SearchMatchResult[] = [];
    
    if (typeof window === 'undefined') return results;

    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${htmlContent}</div>`, 'text/html');
    const container = doc.body.firstElementChild;
    if (!container) return results;

    let currentSectionTitle = courseTitle || 'Contenu du cours';
    let matchCounter = 0;

    const blocks = container.querySelectorAll('h1, h2, h3, h4, p, li, td, th, blockquote, div');

    blocks.forEach((el) => {
      const tagName = el.tagName.toLowerCase();

      if (['h1', 'h2', 'h3', 'h4'].includes(tagName)) {
        const text = el.textContent?.trim();
        if (text) currentSectionTitle = text;
      }

      // Skip container divs that hold other block elements to prevent duplicated snippets
      if (tagName === 'div' && el.querySelector('p, li, td, th, blockquote, h1, h2, h3, h4')) {
        return;
      }

      const text = el.textContent?.trim() || '';
      if (!text || text.length < 2) return;

      const normText = normalizeStr(text);
      let pos = normText.indexOf(normQ);

      while (pos !== -1 && results.length < 100) {
        matchCounter++;
        const matchId = `asmedix-search-match-${matchCounter}`;

        const startSnippet = Math.max(0, pos - 40);
        const endSnippet = Math.min(text.length, pos + normQ.length + 50);

        const snippetBefore = (startSnippet > 0 ? '...' : '') + text.substring(startSnippet, pos);
        const matchedText = text.substring(pos, pos + normQ.length);
        const snippetAfter = text.substring(pos + normQ.length, endSnippet) + (endSnippet < text.length ? '...' : '');

        results.push({
          id: matchId,
          sectionTitle: currentSectionTitle,
          snippetBefore,
          matchedText: matchedText || qRaw,
          snippetAfter,
          fullSnippet: snippetBefore + (matchedText || qRaw) + snippetAfter,
          occurrenceIndex: matchCounter
        });

        pos = normText.indexOf(normQ, pos + normQ.length);
      }
    });

    return results;
  }, [htmlContent, query, courseTitle]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000000] bg-navy-950/75 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-16 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-navy-900 rounded-3xl shadow-soft-2xl border border-navy-100 dark:border-navy-800 overflow-hidden flex flex-col max-h-[85dvh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-navy-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-black text-navy-950 dark:text-white truncate">
                  Rechercher dans ce cours
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
              className="p-2 rounded-2xl bg-navy-100 dark:bg-navy-800 text-navy-500 dark:text-navy-300 hover:text-navy-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Fermer la recherche"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tapez un mot-clé (ex: diagnostic, thrombose, traitement)..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-navy-950 border border-navy-200 dark:border-navy-700 text-xs sm:text-sm font-bold text-navy-950 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-navy-400 hover:text-navy-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="px-5 py-2.5 bg-brand-50/60 dark:bg-brand-950/40 border-b border-navy-100 dark:border-navy-800 flex items-center justify-between text-xs font-bold text-brand-700 dark:text-brand-300">
          <span>
            {query.trim().length < 2 ? (
              'Entrez au moins 2 caractères pour rechercher'
            ) : (
              `${matches.length} occurrence${matches.length > 1 ? 's' : ''} trouvée${matches.length > 1 ? 's' : ''}`
            )}
          </span>
          {matches.length > 0 && (
            <span className="text-[10px] text-navy-400 font-medium">Cliquez sur un résultat pour y accéder</span>
          )}
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 max-h-[60dvh]">
          {query.trim().length >= 2 && matches.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <FileText className="w-8 h-8 mx-auto text-navy-300 dark:text-navy-700" />
              <p className="text-xs font-bold text-navy-600 dark:text-navy-300">
                Aucun résultat pour « {query} » dans ce cours.
              </p>
              <p className="text-[11px] text-navy-400">
                Essayez d'autres mots-clés ou vérifiez l'orthographe.
              </p>
            </div>
          ) : query.trim().length < 2 ? (
            <div className="py-10 text-center space-y-2 text-navy-400 text-xs">
              <Sparkles className="w-6 h-6 mx-auto opacity-40 text-brand-500" />
              <p>Recherche instantanée dans l'intégralité du texte du cours</p>
            </div>
          ) : (
            <div className="space-y-2">
              {matches.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onSelectMatch(m);
                    onClose();
                  }}
                  className="w-full p-3 sm:p-4 rounded-2xl bg-white dark:bg-navy-950/60 border border-navy-150 dark:border-navy-800 hover:border-brand-500 hover:bg-brand-50/40 dark:hover:bg-navy-800 text-left transition-all group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 truncate">
                      {m.sectionTitle}
                    </span>
                    <span className="text-[10px] font-mono text-navy-400 shrink-0 flex items-center gap-1 group-hover:text-brand-600">
                      <span>Occurence #{m.occurrenceIndex}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>

                  <p className="text-xs text-navy-700 dark:text-navy-300 leading-relaxed font-medium">
                    <span>{m.snippetBefore}</span>
                    <mark className="bg-amber-300 dark:bg-amber-600 text-amber-950 dark:text-white px-1 rounded font-black ring-1 ring-amber-400">
                      {m.matchedText}
                    </mark>
                    <span>{m.snippetAfter}</span>
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-navy-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/50 flex items-center justify-between text-xs">
          <span className="text-navy-400 text-[11px]">
            Touche Échap pour fermer
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
