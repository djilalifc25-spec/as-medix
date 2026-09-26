'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Highlighter, Plus, X, Bookmark, Check } from 'lucide-react';

interface TextHighlighterProps {
  itemSlug: string;
  itemTitle: string;
  onSaveHighlight: (color: 'yellow' | 'green' | 'pink' | 'blue', selectedText: string, note?: string) => void;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({ itemSlug, itemTitle, onSaveHighlight }) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>('');
  const [activeColor, setActiveColor] = useState<'yellow' | 'green' | 'pink' | 'blue'>('yellow');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setPosition(null);
        return;
      }

      const text = selection.toString().trim();
      if (text.length < 3) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectedText(text);
      setPosition({
        top: rect.top + window.scrollY - 50,
        left: rect.left + window.scrollX + rect.width / 2 - 110,
      });
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const handleApplyHighlight = (color: 'yellow' | 'green' | 'pink' | 'blue') => {
    setActiveColor(color);
    onSaveHighlight(color, selectedText, noteText || undefined);
    setPosition(null);
    setShowNoteInput(false);
    setNoteText('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000);
  };

  if (showSuccessToast) {
    return (
      <div className="fixed bottom-6 right-6 z-[99999] bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-soft-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
        <Check className="w-4 h-4" />
        <span>Surlignage enregistré dans vos Révisions !</span>
      </div>
    );
  }

  if (!position) return null;

  return (
    <div
      style={{ top: `${position.top}px`, left: `${Math.max(10, position.left)}px` }}
      className="absolute z-[99999] bg-navy-950/90 text-white backdrop-blur-md px-3 py-2 rounded-2xl shadow-soft-2xl border border-navy-700 flex flex-col gap-2 animate-in fade-in zoom-in-95"
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-navy-300 uppercase tracking-wider">Surligner :</span>

        {/* Color buttons */}
        <button
          onClick={() => handleApplyHighlight('yellow')}
          className="w-6 h-6 rounded-full bg-amber-400 border-2 border-white hover:scale-110 transition-all"
          title="Jaune - Définitions & Points Clés"
        />
        <button
          onClick={() => handleApplyHighlight('green')}
          className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-white hover:scale-110 transition-all"
          title="Vert - Traitements & Posologies"
        />
        <button
          onClick={() => handleApplyHighlight('pink')}
          className="w-6 h-6 rounded-full bg-rose-400 border-2 border-white hover:scale-110 transition-all"
          title="Rose - Urgences & Pièges"
        />
        <button
          onClick={() => handleApplyHighlight('blue')}
          className="w-6 h-6 rounded-full bg-sky-400 border-2 border-white hover:scale-110 transition-all"
          title="Bleu - Physiopathologie"
        />

        <button
          onClick={() => setShowNoteInput(!showNoteInput)}
          className="p-1 rounded-lg bg-navy-800 text-navy-300 hover:text-white transition-colors text-[10px] flex items-center gap-1 font-bold ml-1"
        >
          <Plus className="w-3 h-3" /> Note
        </button>

        <button
          onClick={() => setPosition(null)}
          className="p-1 rounded-lg text-navy-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {showNoteInput && (
        <div className="pt-1 border-t border-navy-800 space-y-1.5">
          <input
            type="text"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Astuce mnémotechnique..."
            className="w-full px-2.5 py-1.5 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white placeholder:text-navy-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>
      )}
    </div>
  );
};
