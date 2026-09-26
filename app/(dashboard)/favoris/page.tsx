'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bookmark, BookOpen, ChevronRight, Brain, Calendar, Highlighter, Edit3, Trash2, CheckCircle2, Clock, Sparkles, AlertCircle
} from 'lucide-react';
import { INITIAL_COURSES } from '@/lib/db/seedCourses';
import { useMemorization } from '@/lib/hooks/useMemorization';

export default function FavoritesPage() {
  const { highlights, spacedReviews, notes, removeHighlight, removeReview } = useMemorization();
  const [activeTab, setActiveTab] = useState<'spaced' | 'highlights' | 'notes' | 'bookmarks'>('spaced');

  const favoriteCourses = INITIAL_COURSES.slice(0, 3);

  // Check which reviews are due today or overdue
  const now = new Date();
  const reviewsDueToday = spacedReviews.filter(r => new Date(r.nextReviewAt) <= now);
  const upcomingReviews = spacedReviews.filter(r => new Date(r.nextReviewAt) > now);

  const getHighlightColorBadge = (color: string) => {
    switch (color) {
      case 'yellow': return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200';
      case 'green': return 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200';
      case 'pink': return 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-200';
      case 'blue': return 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-200';
      default: return 'bg-amber-100 text-amber-900';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-white via-brand-50/20 to-indigo-50/30 dark:from-navy-900 dark:via-navy-950 dark:to-navy-900">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
            <Brain className="w-4 h-4 text-brand-600" />
            <span>Centre de Révision Spacée & Mémorisation Aiguë</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
            Mes Révisions & Carnet d'Apprentissage
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 dark:text-navy-300 leading-relaxed">
            Consultez vos révisions programmées (J+1, J+3, J+7, J+30), relisez vos passages surlignés et retrouvez vos astuces mnémotechniques.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-brand-600/20 text-center">
            <div className="text-lg font-black font-mono">{reviewsDueToday.length}</div>
            <div className="text-[10px] opacity-90">Révisions du jour</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'spaced', label: `📅 Révisions Spacées (${spacedReviews.length})` },
          { id: 'highlights', label: `🖍️ Surlignages (${highlights.length})` },
          { id: 'notes', label: `📝 Carnet de Notes (${Object.keys(notes).length})` },
          { id: 'bookmarks', label: `📌 Favoris Sauvegardés (${favoriteCourses.length})` },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'apple-badge-purple shadow-sm'
                  : 'apple-card text-navy-700 dark:text-navy-300 hover:border-brand-300'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Spaced Repetition (J+1, J+3, J+7, J+30) */}
      {activeTab === 'spaced' && (
        <div className="space-y-6 animate-in fade-in">
          {reviewsDueToday.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <h2 className="text-sm font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  ⚡ À réviser aujourd'hui ({reviewsDueToday.length}) :
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviewsDueToday.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 shadow-soft flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                          {item.specialty} • Intervalle J+{item.intervalDays}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100">
                          Urgent aujourd'hui
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-navy-950 dark:text-white line-clamp-1">{item.title}</h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-rose-200/60 dark:border-rose-900/50">
                      <button
                        onClick={() => removeReview(item.id)}
                        className="text-navy-400 hover:text-rose-600 text-xs flex items-center gap-1 font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Supprimer
                      </button>
                      <Link
                        href={`/${item.type}/${item.slugOrId}`}
                        className="px-4 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-xs hover:bg-rose-700 flex items-center gap-1"
                      >
                        <span>Réviser maintenant</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-navy-700 dark:text-navy-300">
              📅 Prochaines Révisions Programmées ({upcomingReviews.length}) :
            </h2>
            {upcomingReviews.length === 0 && reviewsDueToday.length === 0 ? (
              <div className="apple-card p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-xl">
                  🧠
                </div>
                <p className="text-sm font-bold text-navy-900 dark:text-white">Aucune révision programmée pour l'instant</p>
                <p className="text-xs text-navy-500 max-w-md mx-auto">
                  En lisant un cours ou en faisant un QCM, cliquez sur <strong>"📌 Révision Spacée"</strong> pour programmer votre premier rappel automatique !
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingReviews.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800 shadow-soft flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                          {item.specialty} • Intervalle J+{item.intervalDays}
                        </span>
                        <span className="text-[10px] font-mono text-navy-400">
                          Prévu le {new Date(item.nextReviewAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-navy-950 dark:text-white line-clamp-1">{item.title}</h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-navy-100 dark:border-navy-800">
                      <button
                        onClick={() => removeReview(item.id)}
                        className="text-navy-400 hover:text-rose-600 text-xs flex items-center gap-1 font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Retirer
                      </button>
                      <Link
                        href={`/${item.type}/${item.slugOrId}`}
                        className="px-4 py-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold text-xs hover:bg-brand-600 hover:text-white transition-all flex items-center gap-1"
                      >
                        <span>Relire</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Highlights */}
      {activeTab === 'highlights' && (
        <div className="space-y-4 animate-in fade-in">
          {highlights.length === 0 ? (
            <div className="apple-card p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl">
                🖍️
              </div>
              <p className="text-sm font-bold text-navy-900 dark:text-white">Aucun surlignage enregistré</p>
              <p className="text-xs text-navy-500 max-w-md mx-auto">
                Sélectionnez du texte dans un cours avec votre souris pour afficher la barre de surlignage instantanée !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {highlights.map((h) => (
                <div
                  key={h.id}
                  className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800 shadow-soft space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-navy-950 dark:text-white truncate max-w-xs sm:max-w-md">
                      {h.itemTitle}
                    </span>
                    <button
                      onClick={() => removeHighlight(h.id)}
                      className="text-navy-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className={`p-3.5 rounded-2xl border text-xs font-medium leading-relaxed ${getHighlightColorBadge(h.color)}`}>
                    "{h.selectedText}"
                  </div>

                  {h.note && (
                    <div className="p-2.5 rounded-xl bg-navy-50 dark:bg-navy-950 text-xs text-navy-700 dark:text-navy-300 font-bold flex items-center gap-2">
                      <span>💡 <strong>Astuce Mnemo :</strong> {h.note}</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <Link
                      href={`/cours/${h.itemSlug}`}
                      className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      <span>Voir dans le cours</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Personal Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4 animate-in fade-in">
          {Object.keys(notes).length === 0 ? (
            <div className="apple-card p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl">
                📝
              </div>
              <p className="text-sm font-bold text-navy-900 dark:text-white">Carnet de Notes vide</p>
              <p className="text-xs text-navy-500 max-w-md mx-auto">
                Cliquez sur <strong>"📝 Mes Notes"</strong> dans l'en-tête de n'importe quel cours pour ajouter vos propres astuces mnémotechniques.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.values(notes).map((note) => (
                <div
                  key={note.slugOrId}
                  className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-navy-150 dark:border-navy-800 shadow-soft space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider">
                      Mis à jour le {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                    <h3 className="text-sm font-black text-navy-950 dark:text-white">{note.title}</h3>
                    <p className="text-xs text-navy-700 dark:text-navy-300 font-medium whitespace-pre-wrap bg-amber-50/50 dark:bg-navy-950 p-3 rounded-2xl border border-amber-200/50 dark:border-navy-800 leading-relaxed">
                      {note.content}
                    </p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Link
                      href={`/cours/${note.slugOrId}`}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 text-xs font-bold hover:bg-brand-600 hover:text-white transition-all"
                    >
                      Ouvrir le cours
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Saved Favorites */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3 animate-in fade-in">
          {favoriteCourses.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
                  <Bookmark className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    {c.specialtyName} • {c.rang}
                  </span>
                  <h3 className="text-sm font-bold text-navy-900 dark:text-white">{c.title}</h3>
                </div>
              </div>

              <Link
                href={`/cours/${c.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 hover:bg-brand-600 hover:text-white transition-all shadow-sm shrink-0"
              >
                <span>Relire</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

