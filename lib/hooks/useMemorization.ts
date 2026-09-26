'use client';

import { useState, useEffect } from 'react';

export interface SavedHighlight {
  id: string;
  itemSlug: string;
  itemTitle: string;
  selectedText: string;
  color: 'yellow' | 'green' | 'pink' | 'blue';
  note?: string;
  createdAt: string;
}

export interface SpacedReviewItem {
  id: string;
  type: 'cours' | 'qcm' | 'cat' | 'fiche';
  slugOrId: string;
  title: string;
  specialty: string;
  intervalDays: number; // 1, 3, 7, 30
  lastReviewedAt: string;
  nextReviewAt: string;
  confidence: 'hard' | 'medium' | 'easy' | 'perfect';
}

export interface SavedNote {
  slugOrId: string;
  title: string;
  content: string;
  updatedAt: string;
}

const HIGHLIGHTS_KEY = 'asmedix_study_highlights';
const SPACED_REVIEWS_KEY = 'asmedix_spaced_reviews';
const NOTES_KEY = 'asmedix_study_notes';

export function useMemorization() {
  const [activeUid, setActiveUid] = useState<string>('guest');
  const [highlights, setHighlights] = useState<SavedHighlight[]>([]);
  const [spacedReviews, setSpacedReviews] = useState<SpacedReviewItem[]>([]);
  const [notes, setNotes] = useState<Record<string, SavedNote>>({});

  const loadDataForUser = (uid: string) => {
    try {
      const hlKey = `asmedix_${uid}_study_highlights`;
      const srKey = `asmedix_${uid}_spaced_reviews`;
      const ntKey = `asmedix_${uid}_study_notes`;

      const storedHighlights = localStorage.getItem(hlKey) || (uid === 'guest' ? localStorage.getItem(HIGHLIGHTS_KEY) : null);
      if (storedHighlights) setHighlights(JSON.parse(storedHighlights));
      else setHighlights([]);

      const storedReviews = localStorage.getItem(srKey) || (uid === 'guest' ? localStorage.getItem(SPACED_REVIEWS_KEY) : null);
      if (storedReviews) setSpacedReviews(JSON.parse(storedReviews));
      else setSpacedReviews([]);

      const storedNotes = localStorage.getItem(ntKey) || (uid === 'guest' ? localStorage.getItem(NOTES_KEY) : null);
      if (storedNotes) setNotes(JSON.parse(storedNotes));
      else setNotes({});
    } catch (e) {
      console.error('Error loading study data:', e);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        const uid = d.authenticated && d.user?.id ? d.user.id : 'guest';
        setActiveUid(uid);
        loadDataForUser(uid);
      })
      .catch(() => {
        loadDataForUser('guest');
      });
  }, []);

  // Save Highlight
  const addHighlight = (itemSlug: string, itemTitle: string, selectedText: string, color: 'yellow' | 'green' | 'pink' | 'blue', note?: string) => {
    const newHighlight: SavedHighlight = {
      id: Date.now().toString(),
      itemSlug,
      itemTitle,
      selectedText,
      color,
      note,
      createdAt: new Date().toISOString()
    };
    const updated = [newHighlight, ...highlights];
    setHighlights(updated);
    localStorage.setItem(`asmedix_${activeUid}_study_highlights`, JSON.stringify(updated));
    return newHighlight;
  };

  // Remove Highlight
  const removeHighlight = (id: string) => {
    const updated = highlights.filter(h => h.id !== id);
    setHighlights(updated);
    localStorage.setItem(`asmedix_${activeUid}_study_highlights`, JSON.stringify(updated));
  };

  // Schedule Spaced Repetition Review (J+1, J+3, J+7, J+30)
  const scheduleReview = (
    type: 'cours' | 'qcm' | 'cat' | 'fiche',
    slugOrId: string,
    title: string,
    specialty: string,
    confidence: 'hard' | 'medium' | 'easy' | 'perfect'
  ) => {
    let days = 1;
    if (confidence === 'medium') days = 3;
    if (confidence === 'easy') days = 7;
    if (confidence === 'perfect') days = 30;

    const now = new Date();
    const nextDate = new Date();
    nextDate.setDate(now.getDate() + days);

    const existingIndex = spacedReviews.findIndex(r => r.slugOrId === slugOrId && r.type === type);
    const newItem: SpacedReviewItem = {
      id: existingIndex >= 0 ? spacedReviews[existingIndex].id : Date.now().toString(),
      type,
      slugOrId,
      title,
      specialty,
      intervalDays: days,
      lastReviewedAt: now.toISOString(),
      nextReviewAt: nextDate.toISOString(),
      confidence
    };

    let updated: SpacedReviewItem[];
    if (existingIndex >= 0) {
      updated = [...spacedReviews];
      updated[existingIndex] = newItem;
    } else {
      updated = [newItem, ...spacedReviews];
    }

    setSpacedReviews(updated);
    localStorage.setItem(`asmedix_${activeUid}_spaced_reviews`, JSON.stringify(updated));
    return newItem;
  };

  // Remove Review item
  const removeReview = (id: string) => {
    const updated = spacedReviews.filter(r => r.id !== id);
    setSpacedReviews(updated);
    localStorage.setItem(`asmedix_${activeUid}_spaced_reviews`, JSON.stringify(updated));
  };

  // Save Personal Note
  const saveNote = (slugOrId: string, title: string, content: string) => {
    const updatedNotes = {
      ...notes,
      [slugOrId]: {
        slugOrId,
        title,
        content,
        updatedAt: new Date().toISOString()
      }
    };
    setNotes(updatedNotes);
    localStorage.setItem(`asmedix_${activeUid}_study_notes`, JSON.stringify(updatedNotes));
  };

  return {
    highlights,
    spacedReviews,
    notes,
    addHighlight,
    removeHighlight,
    scheduleReview,
    removeReview,
    saveNote
  };
}
