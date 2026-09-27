'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Highlighter, Plus, X, Check, MessageSquare } from 'lucide-react';

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
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        // Delay closing slightly if user is typing inside our popover input
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'INPUT') return;
        setPosition(null);
        return;
      }

      const text = selection.toString().trim();
      if (text.length < 2) return;

      // Ensure selection is inside course text container
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const element = container.nodeType === 1 ? (container as HTMLElement) : container.parentElement;

      if (element && !element.closest('.not-prose') && !element.closest('button')) {
        const rect = range.getBoundingClientRect();
        setSelectedText(text);

        // Calculate viewport position
        const top = Math.max(10, rect.top + window.scrollY - 55);
        const left = Math.max(10, Math.min(window.innerWidth - 280, rect.left + window.scrollX + rect.width / 2 - 120));

        setPosition({ top, left });
      }
    };

    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('touchend', handleSelectionChange);
    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('touchend', handleSelectionChange);
    };
  }, []);

  const handleApplyHighlight = (color: 'yellow' | 'green' | 'pink' | 'blue') => {
    setActiveColor(color);
    onSaveHighlight(color, selectedText, noteText || undefined);
    setPosition(null);
    setShowNoteInput(false);
    setNoteText('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2200);

    // Clear window selection
    if (window.getSelection()) {
      window.getSelection()?.removeAllRanges();
    }
  };

  if (!mounted) return null;

  if (showSuccessToast) {
    return createPortal(
      <div className="fixed bottom-6 right-6 z-[999999] bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-soft-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
        <Check className="w-4 h-4" />
        <span>Surlignage & Note enregistrés dans votre espace !</span>
      </div>,
      document.body
    );
  }

  if (!position) return null;

  return createPortal(
    <div
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="fixed z-[999999] bg-navy-950/95 text-white backdrop-blur-md px-3 py-2 rounded-2xl shadow-soft-2xl border border-navy-700 flex flex-col gap-2 animate-in fade-in zoom-in-95 max-w-sm"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-navy-300 uppercase tracking-wider flex items-center gap-1">
          <Highlighter className="w-3 h-3 text-amber-400" /> Surligner :
        </span>

        {/* Color Palette */}
        <button
          onClick={() => handleApplyHighlight('yellow')}
          className="w-6 h-6 rounded-full bg-amber-400 border-2 border-white hover:scale-110 transition-all cursor-pointer"
          title="Jaune - Définitions & Points Clés"
        />
        <button
          onClick={() => handleApplyHighlight('green')}
          className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-white hover:scale-110 transition-all cursor-pointer"
          title="Vert - Traitements & Posologies"
        />
        <button
          onClick={() => handleApplyHighlight('pink')}
          className="w-6 h-6 rounded-full bg-rose-400 border-2 border-white hover:scale-110 transition-all cursor-pointer"
          title="Rose - Urgences & Pièges"
        />
        <button
          onClick={() => handleApplyHighlight('blue')}
          className="w-6 h-6 rounded-full bg-sky-400 border-2 border-white hover:scale-110 transition-all cursor-pointer"
          title="Bleu - Physiopathologie"
        />

        <button
          type="button"
          onClick={() => setShowNoteInput(!showNoteInput)}
          className={`p-1 px-2 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
            showNoteInput ? 'bg-amber-500 text-navy-950' : 'bg-navy-800 text-navy-200 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3 h-3" /> Note
        </button>

        <button
          type="button"
          onClick={() => setPosition(null)}
          className="p-1 rounded-lg text-navy-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {showNoteInput && (
        <div className="pt-1.5 border-t border-navy-800 flex items-center gap-1.5">
          <input
            type="text"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleApplyHighlight(activeColor);
              }
            }}
            placeholder="Ajouter une note clinique..."
            className="flex-1 px-2.5 py-1.5 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white placeholder:text-navy-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            autoFocus
          />
          <button
            type="button"
            onClick={() => handleApplyHighlight(activeColor)}
            className="px-2.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shrink-0"
          >
            OK
          </button>
        </div>
      )}
    </div>,
    document.body
  );
};
