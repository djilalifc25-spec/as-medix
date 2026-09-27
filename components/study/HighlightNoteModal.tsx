'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, Edit3, Save, Check, FileText, Palette } from 'lucide-react';
import { SavedHighlight } from '@/lib/hooks/useMemorization';

interface HighlightNoteModalProps {
  highlight: SavedHighlight | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNote: (id: string, updates: { note?: string; color?: 'yellow' | 'green' | 'pink' | 'blue' }) => void;
  onDeleteHighlight: (id: string) => void;
}

export const HighlightNoteModal: React.FC<HighlightNoteModalProps> = ({
  highlight,
  isOpen,
  onClose,
  onUpdateNote,
  onDeleteHighlight
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState<'yellow' | 'green' | 'pink' | 'blue'>('yellow');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (highlight) {
      setNoteText(highlight.note || '');
      setSelectedColor(highlight.color || 'yellow');
      setIsEditing(!highlight.note); // If no note yet, start in edit mode directly
    }
  }, [highlight]);

  if (!isOpen || !highlight || !mounted) return null;

  const colorBadgeStyle = {
    yellow: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800',
    green: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800',
    pink: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/70 dark:text-rose-200 dark:border-rose-800',
    blue: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/70 dark:text-sky-200 dark:border-sky-800'
  }[selectedColor];

  const colorDotBg = {
    yellow: 'bg-amber-400',
    green: 'bg-emerald-400',
    pink: 'bg-rose-400',
    blue: 'bg-sky-400'
  }[selectedColor];

  const handleSave = () => {
    onUpdateNote(highlight.id, {
      note: noteText.trim() || undefined,
      color: selectedColor
    });
    setIsEditing(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleDelete = () => {
    onDeleteHighlight(highlight.id);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-soft-2xl border border-navy-100 dark:border-navy-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-navy-100 dark:border-navy-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-navy-950/50">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${colorDotBg}`} />
            <h3 className="text-sm font-black text-navy-950 dark:text-white flex items-center gap-1.5">
              <span>Note sur Surlignage Personnel</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-navy-400 hover:text-navy-700 dark:hover:text-white hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Highlighted text snippet box */}
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${colorBadgeStyle}`}>
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-75 mb-1">
              💬 Passage Surligné :
            </span>
            <p className="italic font-medium">« {highlight.selectedText} »</p>
          </div>

          {/* Color palette selector in edit mode */}
          {isEditing && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-bold text-navy-500 dark:text-navy-400 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" /> Couleur :
              </span>
              <div className="flex items-center gap-1.5">
                {(['yellow', 'green', 'pink', 'blue'] as const).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      c === 'yellow' ? 'bg-amber-400' :
                      c === 'green' ? 'bg-emerald-400' :
                      c === 'pink' ? 'bg-rose-400' : 'bg-sky-400'
                    } ${selectedColor === c ? 'border-navy-900 scale-110 shadow-sm' : 'border-transparent opacity-80'}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Note View / Edit area */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-navy-700 dark:text-navy-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Votre Note Personnel :</span>
              </span>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Éditer
                </button>
              )}
            </label>

            {isEditing ? (
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Rédigez vos remarques cliniques, mnémotechniques ou pièges à retenir..."
                rows={4}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-navy-200 dark:border-navy-700 text-xs sm:text-sm text-navy-950 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                autoFocus
              />
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-navy-100 dark:border-navy-800 text-xs sm:text-sm text-navy-800 dark:text-navy-200 leading-relaxed min-h-[80px]">
                {highlight.note ? (
                  <p className="whitespace-pre-wrap">{highlight.note}</p>
                ) : (
                  <p className="text-navy-400 italic">Aucune note texte associée à ce surlignage.</p>
                )}
              </div>
            )}
          </div>

          {showSavedToast && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4" /> Note enregistrée avec succès !
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-navy-100 dark:border-navy-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-navy-950/50">
          <button
            type="button"
            onClick={handleDelete}
            className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Supprimer
          </button>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-soft flex items-center gap-1.5 transition-all"
              >
                <Save className="w-3.5 h-3.5" /> Enregistrer la Note
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 text-xs font-bold hover:bg-navy-200 dark:hover:bg-navy-700 transition-colors"
              >
                Fermer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
