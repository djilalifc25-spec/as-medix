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

export function useMemorization(targetSlug?: string) {
  const [activeUid, setActiveUid] = useState<string>('guest');
  const [highlights, setHighlights] = useState<SavedHighlight[]>([]);
  const [spacedReviews, setSpacedReviews] = useState<SpacedReviewItem[]>([]);
  const [notes, setNotes] = useState<Record<string, SavedNote>>({});

  const loadLocalDataForUser = (uid: string) => {
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
      console.error('Error loading local study data:', e);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        const uid = d.authenticated && d.user?.id ? d.user.id : 'guest';
        setActiveUid(uid);
        loadLocalDataForUser(uid);

        // Fetch Supabase persisted highlights for logged in user
        if (d.authenticated) {
          const querySlug = targetSlug ? `?slug=${encodeURIComponent(targetSlug)}` : '';
          fetch(`/api/user/course-highlights${querySlug}`)
            .then(res => res.json())
            .then(hData => {
              if (hData.authenticated && Array.isArray(hData.highlights)) {
                setHighlights(prev => {
                  const map = new Map<string, SavedHighlight>();
                  // Prefer server data, fallback to local additions
                  prev.forEach(h => map.set(h.id, h));
                  hData.highlights.forEach((h: SavedHighlight) => map.set(h.id, h));
                  const merged = Array.from(map.values());
                  try {
                    localStorage.setItem(`asmedix_${uid}_study_highlights`, JSON.stringify(merged));
                  } catch (_) {}
                  return merged;
                });
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        loadLocalDataForUser('guest');
      });
  }, [targetSlug]);

  // Save Highlight & Note (Saves locally + Syncs to Supabase)
  const addHighlight = async (
    itemSlug: string,
    itemTitle: string,
    selectedText: string,
    color: 'yellow' | 'green' | 'pink' | 'blue',
    note?: string
  ) => {
    const tempId = 'hl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newHighlight: SavedHighlight = {
      id: tempId,
      itemSlug,
      itemTitle,
      selectedText,
      color,
      note: note || undefined,
      createdAt: new Date().toISOString()
    };

    setHighlights(prev => {
      const updated = [newHighlight, ...prev];
      try {
        localStorage.setItem(`asmedix_${activeUid}_study_highlights`, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    // Sync to Supabase
    try {
      const res = await fetch('/api/user/course-highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemSlug, itemTitle, selectedText, color, note })
      });
      const data = await res.json();
      if (data.success && data.highlight?.id) {
        setHighlights(prev => {
          const updated = prev.map(h => (h.id === tempId ? { ...h, id: data.highlight.id } : h));
          try {
            localStorage.setItem(`asmedix_${activeUid}_study_highlights`, JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });
        return data.highlight;
      }
    } catch (e) {
      console.warn('Failed to sync highlight to Supabase, saved locally:', e);
    }

    return newHighlight;
  };

  // Update Highlight Note or Color
  const updateHighlight = async (id: string, updates: { note?: string; color?: 'yellow' | 'green' | 'pink' | 'blue' }) => {
    setHighlights(prev => {
      const updated = prev.map(h => (h.id === id ? { ...h, ...updates } : h));
      try {
        localStorage.setItem(`asmedix_${activeUid}_study_highlights`, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    try {
      await fetch('/api/user/course-highlights', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
    } catch (e) {
      console.warn('Failed to sync highlight update to Supabase:', e);
    }
  };

  // Remove Highlight
  const removeHighlight = async (id: string) => {
    setHighlights(prev => {
      const updated = prev.filter(h => h.id !== id);
      try {
        localStorage.setItem(`asmedix_${activeUid}_study_highlights`, JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    try {
      await fetch(`/api/user/course-highlights?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Failed to sync highlight deletion to Supabase:', e);
    }
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
    try {
      localStorage.setItem(`asmedix_${activeUid}_spaced_reviews`, JSON.stringify(updated));
    } catch (_) {}
    return newItem;
  };

  // Remove Review item
  const removeReview = (id: string) => {
    const updated = spacedReviews.filter(r => r.id !== id);
    setSpacedReviews(updated);
    try {
      localStorage.setItem(`asmedix_${activeUid}_spaced_reviews`, JSON.stringify(updated));
    } catch (_) {}
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
    try {
      localStorage.setItem(`asmedix_${activeUid}_study_notes`, JSON.stringify(updatedNotes));
    } catch (_) {}
  };

  return {
    highlights,
    spacedReviews,
    notes,
    addHighlight,
    updateHighlight,
    removeHighlight,
    scheduleReview,
    removeReview,
    saveNote
  };
}
