'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter, notFound, useParams, useSearchParams } from 'next/navigation';
import { INITIAL_COURSES } from '@/lib/db/seedCourses';
import { INITIAL_QCMS } from '@/lib/db/seedQcm';
import { QCM, Course } from '@/types';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import { processCourseToc } from '@/lib/utils/tocExtractor';
import {
  ArrowLeft, Clock, BookOpen, Brain, Sparkles, Maximize2, Minimize2,
  CheckCircle2, ChevronRight, X, List, Share2, Bookmark, Highlighter, Eye, EyeOff, Edit3, Save, Bell, AlertTriangle,
  Play, ChevronDown
} from 'lucide-react';
import { useMemorization } from '@/lib/hooks/useMemorization';
import { useFaculty } from '@/components/context/FacultyContext';
import { useToast } from '@/components/context/ToastContext';
import { useSpecialtyTheme } from '@/components/context/SpecialtyThemeContext';
import { TextHighlighter } from '@/components/study/TextHighlighter';
import { HighlightNoteModal } from '@/components/study/HighlightNoteModal';
import { TocModal } from '@/components/study/TocModal';
import { SpacedRepetitionModal } from '@/components/study/SpacedRepetitionModal';
import { ReminderModal } from '@/components/study/ReminderModal';
import { CourseNotesDrawer } from '@/components/study/CourseNotesDrawer';
import { SavedHighlight } from '@/lib/hooks/useMemorization';

function normalizeSlug(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function stripAll(str: string): string {
  if (!str) return '';
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}

function getKeywords(str: string): string[] {
  if (!str) return [];
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(w => w.length >= 3);
}

function matchesCourse(c: Course | any, slugOrId: string): boolean {
  if (!c || !slugOrId) return false;
  
  const target = slugOrId.trim();
  const decodedTarget = decodeURIComponent(target).trim();
  
  if (c.id === target || c.slug === target || c.id === decodedTarget || c.slug === decodedTarget) {
    return true;
  }
  
  const normTarget = normalizeSlug(target);
  const normDecodedTarget = normalizeSlug(decodedTarget);
  const cSlugNorm = normalizeSlug(c.slug || '');
  const cIdNorm = normalizeSlug(c.id || '');
  const cTitleNorm = normalizeSlug(c.title || '');
  
  if (cSlugNorm && (cSlugNorm === normTarget || cSlugNorm === normDecodedTarget)) return true;
  if (cIdNorm && (cIdNorm === normTarget || cIdNorm === normDecodedTarget)) return true;
  if (cTitleNorm && (cTitleNorm === normTarget || cTitleNorm === normDecodedTarget)) return true;

  if (normTarget.length >= 5 && (cSlugNorm.includes(normTarget) || normTarget.includes(cSlugNorm) || cTitleNorm.includes(normTarget))) {
    return true;
  }

  const strippedTarget = stripAll(decodedTarget);
  const strippedCSlug = stripAll(c.slug || '');
  const strippedCTitle = stripAll(c.title || '');
  const strippedCId = stripAll(c.id || '');

  if (strippedTarget && strippedTarget.length >= 5) {
    if (strippedCSlug === strippedTarget || strippedCTitle === strippedTarget || strippedCId === strippedTarget) {
      return true;
    }
    if (strippedCSlug.includes(strippedTarget) || strippedTarget.includes(strippedCSlug) || strippedCTitle.includes(strippedTarget)) {
      return true;
    }
  }

  const targetWords = getKeywords(decodedTarget);
  if (targetWords.length > 0) {
    const courseWords = new Set([...getKeywords(c.title || ''), ...getKeywords(c.slug || '')]);
    let matchedCount = 0;
    for (const tw of targetWords) {
      if (courseWords.has(tw) || Array.from(courseWords).some(cw => cw.includes(tw) || tw.includes(cw))) {
        matchedCount++;
      }
    }
    if (targetWords.length <= 3 && matchedCount === targetWords.length) return true;
    if (targetWords.length > 3 && (matchedCount / targetWords.length >= 0.4 || matchedCount >= 3)) return true;
  }

  return false;
}

function applyUserHighlightsToHtml(html: string, courseHighlights: SavedHighlight[]): string {
  if (!html) return '';
  let cleaned = html.replace(/<mark[^>]*>(.*?)<\/mark>/gi, '$1');
  if (!courseHighlights || courseHighlights.length === 0) return cleaned;

  const sorted = [...courseHighlights].sort((a, b) => b.selectedText.length - a.selectedText.length);

  sorted.forEach(h => {
    if (!h.selectedText || h.selectedText.trim().length < 2) return;
    const escaped = h.selectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const colorClass = {
      yellow: 'bg-amber-200/90 text-amber-950 dark:bg-amber-950/90 dark:text-amber-100 border border-amber-300 dark:border-amber-700',
      green: 'bg-emerald-200/90 text-emerald-950 dark:bg-emerald-950/90 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700',
      pink: 'bg-rose-200/90 text-rose-950 dark:bg-rose-950/90 dark:text-rose-100 border border-rose-300 dark:border-rose-700',
      blue: 'bg-sky-200/90 text-sky-950 dark:bg-sky-950/90 dark:text-sky-100 border border-sky-300 dark:border-sky-700'
    }[h.color || 'yellow'];

    const noteIndicator = h.note ? ' 📝' : '';
    const replacement = `<mark data-highlight-id="${h.id}" class="asmedix-user-hl ${colorClass} cursor-pointer rounded px-1.5 py-0.5 font-bold transition-all shadow-xs" title="${h.note ? 'Note: ' + h.note.replace(/"/g, '&quot;') : 'Surlignage personnel (Cliquer pour voir note)'}">$&${noteIndicator}</mark>`;

    try {
      const regex = new RegExp(`(?<!<[^>]*)${escaped}(?![^<]*>)`, 'gi');
      cleaned = cleaned.replace(regex, replacement);
    } catch (_) {
      cleaned = cleaned.replace(h.selectedText, replacement);
    }
  });

  return cleaned;
}

function CourseDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [course, setCourse] = useState<Course | null>(() => {
    return INITIAL_COURSES.find(c => matchesCourse(c, slug)) || null;
  });
  const [loading, setLoading] = useState(!course);

  useEffect(() => {
    const initialFallback = INITIAL_COURSES.find(c => matchesCourse(c, slug));

    if (initialFallback) {
      setCourse(initialFallback);
    } else {
      setLoading(true);
    }

    fetch(`/api/courses?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(d => {
        if (d.courses && Array.isArray(d.courses) && d.courses.length > 0) {
          const found = d.courses.find((c: any) => matchesCourse(c, slug)) || d.courses[0];
          if (found) {
            setCourse(found);
          }
        } else {
          // Retry fetching all courses if slug filter didn't match directly
          fetch('/api/courses')
            .then(r => r.json())
            .then(allD => {
              if (allD.courses && Array.isArray(allD.courses)) {
                const foundFallback = allD.courses.find((c: any) => matchesCourse(c, slug));
                if (foundFallback) setCourse(foundFallback);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { setActiveSpecialtyId } = useSpecialtyTheme();

  useEffect(() => {
    if (course?.specialtyId) {
      setActiveSpecialtyId(course.specialtyId);
    }
  }, [course?.specialtyId, setActiveSpecialtyId]);

  const { highlights, addHighlight, updateHighlight, removeHighlight, scheduleReview, notes, saveNote } = useMemorization(course?.slug);

  const [selectedHighlight, setSelectedHighlight] = useState<SavedHighlight | null>(null);
  const [isHighlightModalOpen, setIsHighlightModalOpen] = useState<boolean>(false);

  const handleCourseContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const hlEl = target.closest('[data-highlight-id]') as HTMLElement | null;
    if (hlEl) {
      const id = hlEl.getAttribute('data-highlight-id');
      const found = highlights.find(h => h.id === id);
      if (found) {
        setSelectedHighlight(found);
        setIsHighlightModalOpen(true);
      }
    }
  };

  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [activeSection, setActiveSection] = useState<string>('');

  const tocData = useMemo(() => {
    if (!course?.htmlContent) return { processedHtml: '', toc: [] };
    return processCourseToc(course.htmlContent, course.tableOfContents);
  }, [course?.htmlContent, course?.tableOfContents]);

  const activeToc = useMemo(() => {
    return tocData.toc.length > 0 ? tocData.toc : (course?.tableOfContents || []);
  }, [tocData.toc, course?.tableOfContents]);

  const scrollToSection = (sectionId: string) => {
    setShowTocMobile(false);
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (activeToc?.[0]?.id) {
      setActiveSection(activeToc[0].id);
    }
  }, [activeToc]);

  const [isFullscreen, setIsFullscreen] = useState(true);
  const [showTocMobile, setShowTocMobile] = useState(false);
  const [isTocModalOpen, setIsTocModalOpen] = useState(false);

  // Memorization states
  const [activeRecall, setActiveRecall] = useState<boolean>(false);
  const [isSpacedModalOpen, setIsSpacedModalOpen] = useState<boolean>(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false);
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState<boolean>(false);

  // Course QCM states
  const [courseQcms, setCourseQcms] = useState<QCM[]>(() =>
    INITIAL_QCMS.filter(q => q.courseId === (course?.id || slug))
  );
  const [courseSources, setCourseSources] = useState<string[]>([]);
  const [showQcmPreview, setShowQcmPreview] = useState<boolean>(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [userSelectedOpts, setUserSelectedOpts] = useState<Record<string, number[]>>({});

  const { faculty } = useFaculty();
  const { showToast, showEmptySourceToast } = useToast();

  const handleLaunchSourceSession = (e: React.MouseEvent, src: string, count: number) => {
    if (count === 0 && course) {
      e.preventDefault();
      showEmptySourceToast(src === 'TOUS' ? 'Toutes les sources' : src, course.title);
    }
  };

  useEffect(() => {
    if (!course) return;
    const facParam = (faculty && faculty !== 'TOUS') ? `&faculty=${faculty}` : '';
    fetch(`/api/qcm?course=${course.id}${facParam}`)
      .then(r => r.json())
      .then(d => {
        if (d.qcms && Array.isArray(d.qcms)) {
          setCourseQcms(d.qcms);
        }
      })
      .catch(() => {});

    fetch(`/api/admin/sources?specialty=${course.specialtyId}&course=${course.id}${facParam}`)
      .then(r => r.json())
      .then(d => {
        if (d.sources && Array.isArray(d.sources)) {
          setCourseSources(d.sources);
        }
      })
      .catch(() => {});
  }, [course?.id, course?.specialtyId, faculty]);

  const toggleQcmOpt = (qcmId: string, optIdx: number, type: 'SINGLE' | 'MULTIPLE' | 'TRUE_FALSE') => {
    if (revealedAnswers[qcmId]) return;
    setUserSelectedOpts(prev => {
      const current = prev[qcmId] || [];
      if (type === 'SINGLE' || type === 'TRUE_FALSE') {
        return { ...prev, [qcmId]: [optIdx] };
      } else {
        const next = current.includes(optIdx)
          ? current.filter(i => i !== optIdx)
          : [...current, optIdx];
        return { ...prev, [qcmId]: next };
      }
    });
  };

  const toggleRevealAnswer = (qcmId: string) => {
    setRevealedAnswers(prev => ({ ...prev, [qcmId]: !prev[qcmId] }));
  };

  // Synchronize body scroll locking and bottom nav hiding when fullscreen is active
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('fullscreen-mode', 'modal-open');
      window.dispatchEvent(new Event('modal-state-change'));
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('fullscreen-mode', 'modal-open');
      window.dispatchEvent(new Event('modal-state-change'));
    }

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('fullscreen-mode', 'modal-open');
      window.dispatchEvent(new Event('modal-state-change'));
    };
  }, [isFullscreen]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Scroll listener to highlight active TOC section
  useEffect(() => {
    if (!course?.tableOfContents) return;
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const item of course.tableOfContents) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [course]);

  const enterFullscreen = () => {
    setIsFullscreen(true);
    // Graceful native attempt for desktop browsers
    try {
      if (document.documentElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (e) {
      // Ignored for mobile Safari
    }
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    setShowTocMobile(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {
      // Ignored
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  // Auto enter fullscreen directly when course is selected (unless explicitly set to ?fullscreen=false)
  useEffect(() => {
    if (searchParams?.get('fullscreen') !== 'false') {
      setIsFullscreen(true);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('fullscreen-mode', 'modal-open');
      window.dispatchEvent(new Event('modal-state-change'));
    }
  }, [slug, searchParams]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-8 bg-[#f8f9ff] dark:bg-navy-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#5D5FEF] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    notFound();
  }

  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose'
  }[fontSize];

  return (
    <>
      {/* ========================================================================= */}
      {/* IMMERSIVE FULLSCREEN MODE (WORKS FLAWLESSLY ON MOBILE SAFARI/CHROME & DESKTOP) */}
      {/* ========================================================================= */}
      {isFullscreen && mounted && createPortal(
        <div 
          id="asmedix-fullscreen-cours"
          className="fixed inset-0 z-[999999] w-screen h-[100dvh] bg-[#f8f9ff] dark:bg-navy-950 overflow-y-auto overscroll-contain flex flex-col animate-in fade-in zoom-in-95 duration-200 selection:bg-brand-500/20"
          style={{
            minHeight: '100dvh',
            height: '100dvh',
          }}
        >
          {/* Sticky Fullscreen Top Navigation Bar */}
          <div 
            className="sticky top-0 z-50 px-3 sm:px-8 py-2.5 sm:py-3 bg-white/95 dark:bg-navy-900/95 backdrop-blur-2xl border-b border-navy-100 dark:border-navy-800 shadow-sm flex items-center justify-between gap-2 sm:gap-3"
            style={{
              paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))',
              paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
              paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
            }}
          >
            {/* Left info */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-lg sm:text-xl shrink-0">{getSpecialtyEmoji(course.specialtyId)}</span>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] sm:text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block truncate">
                  {course.specialtyName}
                </span>
                <h2 className="text-xs sm:text-sm font-black text-navy-950 dark:text-white truncate">
                  {course.title}
                </h2>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Sommaire Modal Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTocModalOpen(true);
                }}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-700 hover:to-brand-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                title="Ouvrir le Sommaire Interactif du Cours"
              >
                <List className="w-3.5 h-3.5" />
                <span>Sommaire</span>
                {activeToc.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">{activeToc.length}</span>
                )}
              </button>

              {/* Spaced Repetition / Epingler button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSpacedModalOpen(true);
                }}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-300 dark:border-brand-700/50 text-xs font-bold flex items-center gap-1 transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Épingler ce cours pour révision espacée"
              >
                <Bookmark className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span className="hidden sm:inline text-[11px]">Épingler</span>
              </button>

              {/* Personal Notes Drawer button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotesDrawerOpen(true);
                }}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700/50 text-xs font-bold flex items-center gap-1 transition-all shadow-xs active:scale-95 cursor-pointer relative"
                title="Carnet de notes personnel"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline text-[11px]">Notes</span>
                {notes[course.slug]?.content && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-0.5 border border-white dark:border-navy-900 animate-pulse" />
                )}
              </button>

              {/* Study Reminder & Trap button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsReminderModalOpen(true);
                }}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-700/50 text-xs font-bold flex items-center gap-1 transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Programmer un rappel ou marquer comme piège d'examen"
              >
                <Bell className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span className="hidden sm:inline text-[11px]">Rappel</span>
              </button>

              {/* Mobile TOC button */}
              <button
                type="button"
                onClick={() => setShowTocMobile(!showTocMobile)}
                className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-navy-50 dark:bg-navy-800 text-navy-700 dark:text-navy-300 hover:text-brand-600 active:scale-95 transition-all"
                title="Sommaire"
                aria-label="Sommaire du cours"
              >
                <List className="w-4 h-4" />
              </button>

              {/* Font Size Selector */}
              <div className="hidden md:flex items-center border border-navy-200 dark:border-navy-700 rounded-xl overflow-hidden bg-white dark:bg-navy-900 shadow-xs">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-2 sm:px-2.5 py-1 text-xs font-bold transition-all ${
                    fontSize === 'sm' ? 'bg-brand-600 text-white' : 'text-navy-600 dark:text-navy-300 hover:bg-navy-50'
                  }`}
                  title="Police compacte"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('base')}
                  className={`px-2 sm:px-2.5 py-1 text-xs font-bold transition-all ${
                    fontSize === 'base' ? 'bg-brand-600 text-white' : 'text-navy-600 dark:text-navy-300 hover:bg-navy-50'
                  }`}
                  title="Police standard"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-2 sm:px-2.5 py-1 text-xs font-bold transition-all ${
                    fontSize === 'lg' ? 'bg-brand-600 text-white' : 'text-navy-600 dark:text-navy-300 hover:bg-navy-50'
                  }`}
                  title="Grande police"
                >
                  A+
                </button>
              </div>

              {/* Prominent Exit Fullscreen Button */}
              <button
                onClick={exitFullscreen}
                className="apple-badge-purple px-2.5 sm:px-3.5 py-1.5 text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all shrink-0"
                title="Quitter le mode plein écran"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quitter plein écran</span>
                <span className="sm:hidden">Fermer</span>
              </button>
            </div>
          </div>

          {/* Mobile TOC Drawer in Fullscreen */}
          {showTocMobile && (
            <div 
              className="lg:hidden fixed inset-x-0 z-40 bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl border-b border-navy-200 dark:border-navy-800 p-4 shadow-xl space-y-2 max-h-[60vh] overflow-y-auto animate-in slide-in-from-top-2 duration-150"
              style={{
                top: 'calc(3.25rem + max(0.75rem, env(safe-area-inset-top, 0px)))'
              }}
            >
              <div className="flex items-center justify-between pb-1 border-b border-navy-100 dark:border-navy-800">
                <span className="text-[11px] font-black uppercase text-navy-400">Sections du cours :</span>
                <button
                  onClick={() => setShowTocMobile(false)}
                  className="p-1 text-navy-400 hover:text-navy-700 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {activeToc.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeSection === item.id
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-navy-800 dark:text-navy-200 hover:bg-brand-50 dark:hover:bg-navy-800'
                  }`}
                >
                  <span className="truncate flex-1">
                    <span className="opacity-75 mr-1.5">{idx + 1}.</span>
                    <span>{item.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Fullscreen Reading Body */}
          <div 
            className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-8 lg:px-12 py-4 sm:py-8 space-y-6 sm:space-y-8"
            style={{
              paddingBottom: 'max(4.5rem, env(safe-area-inset-bottom, 0px))',
            }}
          >
            {/* Header info */}
            <div className="space-y-3 pb-6 border-b border-navy-100 dark:border-navy-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  {course.specialtyName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-100 dark:bg-navy-800 text-navy-800 dark:text-navy-200">
                  {course.rang}
                </span>
                <span className="text-xs text-navy-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{course.estimatedDuration}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-navy-950 dark:text-white tracking-tight">
                {course.title}
              </h1>
              <p className="text-sm sm:text-base text-navy-600 dark:text-navy-300">
                {course.subtitle}
              </p>
            </div>

            {/* Summary points */}
            {course.summaryPoints && (
              <div className="p-4 sm:p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2 shadow-soft">
                <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Points Clés Concours & Résidanat :</span>
                </h3>
                <ul className="text-xs sm:text-sm space-y-2 text-navy-700 dark:text-navy-300">
                  {course.summaryPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}



            {/* Interactive Sommaire / TOC Quick Jump Box */}
            {activeToc.length > 0 && (
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-navy-900 border border-brand-200 dark:border-brand-900/60 shadow-soft space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xs uppercase tracking-wider text-brand-700 dark:text-brand-300 flex items-center gap-2">
                    <List className="w-4 h-4 text-brand-600" />
                    <span>Sommaire Interactif du Cours ({activeToc.length} sections) :</span>
                  </h3>
                  <span className="text-[10px] text-navy-400 font-medium">Accès direct au clic</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeToc.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`p-2.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between group active:scale-95 cursor-pointer ${
                        activeSection === item.id
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-navy-950/60 text-navy-800 dark:text-navy-200 border-navy-150 dark:border-navy-800 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-navy-800'
                      }`}
                    >
                      <span className="truncate flex-1 mr-2">
                        <span className="opacity-70 mr-1.5">{idx + 1}.</span>
                        <span>{item.title}</span>
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                        activeSection === item.id ? 'text-white' : 'text-navy-400'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* HTML Content */}
            <div className="apple-card p-4 sm:p-10 shadow-soft relative overflow-x-hidden" onClick={handleCourseContentClick}>
              <div
                className={`prose dark:prose-invert max-w-none break-words ${fontSizeClass} ${activeRecall ? 'select-none blur-[0.6px]' : ''} [&_img]:max-w-full [&_img]:h-auto [&_table]:block [&_table]:overflow-x-auto [&_table]:w-full [&_pre]:overflow-x-auto`}
                dangerouslySetInnerHTML={{ __html: applyUserHighlightsToHtml(tocData.processedHtml || course.htmlContent, highlights.filter(h => h.itemSlug === course.slug)) }}
              />
            </div>

            {/* End action */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-center sm:text-left">Session de lecture terminée !</h3>
                <p className="text-xs text-brand-100 text-center sm:text-left">Testez votre mémorisation avec les QCM ciblés.</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={exitFullscreen}
                  className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex-1 sm:flex-none text-center"
                >
                  Quitter plein écran
                </button>
                <Link
                  href={`/qcm?specialty=${course.specialtyId}&course=${course.id}`}
                  className="px-5 py-2.5 rounded-xl bg-white text-brand-700 text-xs font-bold shadow-soft hover:bg-brand-50 shrink-0 flex items-center justify-center gap-2 flex-1 sm:flex-none"
                >
                  <Brain className="w-4 h-4" />
                  <span>Passer aux QCM</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Floating Exit Button for mobile thumbs at bottom-right */}
          <button
            onClick={exitFullscreen}
            className="sm:hidden fixed right-4 z-50 w-11 h-11 rounded-full bg-brand-600 text-white shadow-soft-lg flex items-center justify-center active:scale-90 transition-transform"
            style={{
              bottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))',
            }}
            title="Quitter le plein écran"
            aria-label="Quitter le plein écran"
          >
            <X className="w-5 h-5" />
          </button>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* STANDARD IN-DASHBOARD COURSE VIEW */}
      {/* ========================================================================= */}
      <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto w-full">


        {/* Top bar controls - Sticky & zero-overflow */}
        <div className="sticky top-2 sm:top-4 z-30 bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl py-2 px-3 sm:px-4 rounded-2xl border border-navy-200/80 dark:border-navy-700/80 shadow-md flex items-center justify-between gap-2 w-full mb-3">
          <Link
            href="/cours"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-600 dark:text-navy-300 hover:text-brand-600 transition-colors shrink-0"
            title="Retourner aux cours"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour aux cours</span>
            <span className="sm:hidden">Retour</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Sommaire Modal Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsTocModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-700 hover:to-brand-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
              title="Ouvrir le Sommaire Interactif du Cours"
            >
              <List className="w-3.5 h-3.5" />
              <span>Sommaire</span>
              {activeToc.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">{activeToc.length}</span>
              )}
            </button>

            {/* Fullscreen Mode Button - PROMINENT, STICKY & ALWAYS VISIBLE ON MOBILE WITHOUT SCROLLING */}
            <button
              type="button"
              onClick={enterFullscreen}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
              title="Activer le Mode Plein Écran Immersif"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Plein Écran</span>
            </button>

            {/* Font Controls - hidden on mobile, visible from md */}
            <div className="hidden md:flex items-center border border-navy-200/80 dark:border-navy-700/80 rounded-xl overflow-hidden bg-white/80 dark:bg-navy-900/80 shadow-xs">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 text-xs font-bold transition-all ${
                  fontSize === 'sm' ? 'bg-brand-600 text-white' : 'text-navy-600 dark:text-navy-300 hover:bg-navy-50 dark:hover:bg-navy-800'
                }`}
                title="Police compacte"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 text-xs font-bold transition-all ${
                  fontSize === 'base' ? 'bg-brand-600 text-white' : 'text-navy-600 dark:text-navy-300 hover:bg-navy-50 dark:hover:bg-navy-800'
                }`}
                title="Police standard"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 text-xs font-bold transition-all ${
                  fontSize === 'lg' ? 'bg-brand-600 text-white' : 'text-navy-600 dark:text-navy-300 hover:bg-navy-50 dark:hover:bg-navy-800'
                }`}
                title="Grande police"
              >
                A+
              </button>
            </div>

            {/* Spaced Repetition / Epingler Button - hidden on mobile (floating button available), visible from sm */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSpacedModalOpen(true);
              }}
              className="hidden sm:flex px-2.5 sm:px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-bold items-center gap-1.5 hover:bg-brand-100 transition-all shadow-xs active:scale-95 cursor-pointer"
              title="Épingler ce cours pour révision espacée"
            >
              <Bookmark className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Épingler</span>
            </button>

            {/* Personal Notes Button - hidden on mobile (floating button available), visible from sm */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsNotesDrawerOpen(true);
              }}
              className="hidden sm:flex px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold items-center gap-1.5 hover:bg-amber-100 transition-all shadow-xs active:scale-95 cursor-pointer relative"
              title="Ouvrir mon carnet de notes personnel"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Notes</span>
              {notes[course.slug]?.content && (
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-0.5 border border-white dark:border-navy-900 animate-pulse" />
              )}
            </button>

            {/* Reminder Button - hidden on mobile, visible from sm */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsReminderModalOpen(true);
              }}
              className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold items-center gap-1 hover:bg-rose-100 transition-all shadow-xs active:scale-95 cursor-pointer"
              title="Programmer un rappel de révision ou marquer comme piège"
            >
              <Bell className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Rappel</span>
            </button>
          </div>
        </div>

        {/* Header Info */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {course.specialtyName}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-navy-100 dark:bg-navy-800 text-navy-800 dark:text-navy-200">
              {course.rang}
            </span>
            <span className="text-[11px] text-navy-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.estimatedDuration}</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-navy-950 dark:text-white tracking-tight leading-tight">
            {course.title}
          </h1>
          <p className="text-xs sm:text-base text-navy-600 dark:text-navy-300 leading-relaxed">
            {course.subtitle}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* TOP SECTION: QCM & ÉPREUVES DU COURS (PAR COURS & PAR SOURCE) */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand-900/10 via-indigo-900/5 to-purple-900/10 border-2 border-brand-500/30 dark:border-brand-500/20 shadow-soft space-y-3 sm:space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="p-2 rounded-xl bg-brand-600 text-white text-sm flex items-center justify-center shadow-sm">
                  🎯
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Section QCM & Entraînement de ce Cours
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30">
                  {courseQcms.length} QCM{courseQcms.length !== 1 ? 's' : ''} disponible{courseQcms.length !== 1 ? 's' : ''}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-navy-950 dark:text-white">
                Questions d'Épreuves & Annales sur « {course.title} »
              </h2>
              <p className="text-xs text-navy-600 dark:text-navy-300 max-w-2xl leading-relaxed">
                Toutes les questions réelles issues des sources médicales (Externat, Annales Résidanat, Hypercours...) rattachées à ce cours. Testez-vous en session plein écran ou consultez les explications.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href={`/qcm-session?specialty=${course.specialtyId}&course=${course.id}&source=TOUS&specialtyName=${encodeURIComponent(course.specialtyName)}&courseName=${encodeURIComponent(course.title)}`}
                className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-black shadow-soft flex items-center gap-2 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Session Plein Écran</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowQcmPreview(!showQcmPreview)}
                className="px-4 py-2.5 rounded-2xl bg-white dark:bg-navy-800 hover:bg-navy-50 dark:hover:bg-navy-750 text-navy-800 dark:text-navy-200 border border-navy-200 dark:border-navy-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Eye className="w-3.5 h-3.5 text-brand-600" />
                <span>{showQcmPreview ? 'Masquer' : `Voir les ${courseQcms.length} QCMs`}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showQcmPreview ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Sources breakdown pills */}
          <div className="pt-2 border-t border-brand-200/40 dark:border-brand-800/30 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-navy-500 dark:text-navy-400 flex items-center gap-1 mr-1">
              <span>📚 Sources du cours :</span>
            </span>

            <Link
              href={`/qcm-session?specialty=${course.specialtyId}&course=${course.id}&source=TOUS&specialtyName=${encodeURIComponent(course.specialtyName)}&courseName=${encodeURIComponent(course.title)}`}
              onClick={(e) => handleLaunchSourceSession(e, 'TOUS', courseQcms.length)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-navy-100 dark:bg-navy-800 hover:bg-brand-600 hover:text-white text-navy-700 dark:text-navy-300 border border-navy-200 dark:border-navy-700 transition-all flex items-center gap-1.5"
            >
              <span>📋</span>
              <span>Toutes les sources</span>
              <span className="text-[10px] font-mono opacity-80">({courseQcms.length})</span>
            </Link>

            {Array.from(new Set([
              ...courseSources,
              ...courseQcms.map(q => q.source).filter(Boolean) as string[]
            ])).map(src => {
              const count = courseQcms.filter(q => q.source && q.source.toLowerCase().includes(src.toLowerCase())).length;
              return (
                <Link
                  key={src}
                  href={`/qcm-session?specialty=${course.specialtyId}&course=${course.id}&source=${encodeURIComponent(src)}&specialtyName=${encodeURIComponent(course.specialtyName)}&courseName=${encodeURIComponent(course.title)}`}
                  onClick={(e) => handleLaunchSourceSession(e, src, count)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 group shadow-xs ${
                    count === 0
                      ? 'bg-slate-50 dark:bg-navy-900/60 border border-dashed border-slate-300 dark:border-navy-700 text-slate-500 hover:border-amber-400 hover:text-amber-600'
                      : 'bg-white dark:bg-navy-900 hover:bg-indigo-600 hover:text-white text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  <span>📖</span>
                  <span>{src}</span>
                  {count > 0 ? (
                    <span className="text-[10px] font-mono opacity-80">({count})</span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold">0</span>
                  )}
                  <span className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
                </Link>
              );
            })}
          </div>

          {/* Expandable in-page QCM preview */}
          {showQcmPreview && (
            <div className="pt-4 border-t border-brand-200/40 dark:border-brand-800/30 space-y-4">
              {courseQcms.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/70 dark:bg-navy-900 border border-navy-100 dark:border-navy-800 text-center space-y-2">
                  <p className="text-xs font-bold text-navy-600 dark:text-navy-300">
                    Aucun QCM spécifique n'a encore été ajouté pour ce cours.
                  </p>
                  <p className="text-[11px] text-navy-400">
                    Vous pouvez ajouter des questions depuis le <Link href="/admin/qcm" className="text-brand-600 font-bold hover:underline">Panel Admin → QCM</Link> en sélectionnant ce cours.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courseQcms.map((q, qIdx) => {
                    const isRevealed = revealedAnswers[q.id];
                    const selected = userSelectedOpts[q.id] || [];
                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-800 shadow-sm space-y-3"
                      >
                        {/* QCM Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-100 dark:border-navy-800 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-brand-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                              {qIdx + 1}
                            </span>
                            <span className="text-xs font-bold text-navy-900 dark:text-white">
                              {q.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {q.source && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                📖 {q.source}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-400">
                              {q.type === 'SINGLE' ? 'Choix Simple' : 'Choix Multiple'}
                            </span>
                          </div>
                        </div>

                        {/* Vignette Clinique */}
                        {q.vignette && (
                          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-navy-800 dark:text-navy-200 leading-relaxed">
                            <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">📋 Énoncé clinique :</span>
                            <p>{q.vignette}</p>
                          </div>
                        )}

                        {/* Question */}
                        <div className="text-xs font-black text-navy-950 dark:text-white">
                          {q.question}
                        </div>

                        {/* Options */}
                        <div className="space-y-1.5 pt-1">
                          {q.options.map((opt, optIdx) => {
                            const isChosen = selected.includes(optIdx);
                            const isCorrect = q.correctAnswers.includes(optIdx);
                            let style = 'bg-navy-50/60 dark:bg-navy-800 border-navy-200 dark:border-navy-700 text-navy-800 dark:text-navy-200';
                            if (isRevealed) {
                              if (isCorrect) {
                                style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                              } else if (isChosen && !isCorrect) {
                                style = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 line-through';
                              }
                            } else if (isChosen) {
                              style = 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 text-brand-800 dark:text-brand-200 font-bold';
                            }
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => toggleQcmOpt(q.id, optIdx, q.type)}
                                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${style}`}
                              >
                                <span className={`w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center shrink-0 ${
                                  isRevealed && isCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : isRevealed && isChosen && !isCorrect
                                    ? 'bg-rose-600 text-white'
                                    : isChosen
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-navy-200 dark:bg-navy-700 text-navy-700 dark:text-navy-300'
                                }`}>
                                  {opt.letter}
                                </span>
                                <span className="flex-1">{opt.text}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Action: Reveal Explanation */}
                        <div className="pt-2 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => toggleRevealAnswer(q.id)}
                            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                          >
                            <span>{isRevealed ? 'Masquer la justification' : 'Afficher la réponse & explication'}</span>
                          </button>
                        </div>

                        {/* Explanation card */}
                        {isRevealed && (
                          <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-1.5 text-xs text-navy-800 dark:text-navy-200 animate-in fade-in duration-200">
                            <div className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Bonne(s) réponse(s) : {q.correctAnswers.map(idx => q.options[idx]?.letter).filter(Boolean).join(', ')}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-navy-700 dark:text-navy-300">{q.explanation}</p>
                            {q.reference && (
                              <div className="text-[10px] font-semibold text-navy-400 pt-1">
                                📌 Référence : {q.reference}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Grid: TOC + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of contents sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 p-5 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-navy-400">
                Sommaire interactif
              </span>
                {activeToc.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between group active:scale-95 cursor-pointer ${
                      activeSection === item.id
                        ? 'bg-brand-600 text-white shadow-xs font-bold'
                        : 'text-navy-600 dark:text-navy-400 hover:bg-navy-50 dark:hover:bg-navy-800'
                    }`}
                  >
                    <span className="truncate flex-1 mr-1">
                      <span className="opacity-70 mr-1.5">{idx + 1}.</span>
                      <span>{item.title}</span>
                    </span>
                    <ChevronRight className={`w-3 h-3 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                      activeSection === item.id ? 'text-white' : 'text-navy-400'
                    }`} />
                  </button>
                ))}

              <div className="pt-3 border-t border-navy-100 dark:border-navy-800">
                <Link
                  href={`/qcm?specialty=${course.specialtyId}&course=${course.id}`}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-soft transition-all"
                >
                  <Brain className="w-4 h-4" />
                  <span>Tester mes acquis en QCM</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Rich HTML Content */}
          <div className="lg:col-span-3 p-4 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft">
            {/* Summary points */}
            {course.summaryPoints && (
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 mb-6 sm:mb-8 space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Points Clés Résidanat :</span>
                </h3>
                <ul className="text-xs sm:text-sm space-y-1.5 text-navy-700 dark:text-navy-300">
                  {course.summaryPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* HTML Render */}
            <div
              className={`prose dark:prose-invert max-w-none ${fontSizeClass}`}
              onClick={handleCourseContentClick}
              dangerouslySetInnerHTML={{ __html: applyUserHighlightsToHtml(tocData.processedHtml || course.htmlContent, highlights.filter(h => h.itemSlug === course.slug)) }}
            />

            {/* Bottom QCM Challenge CTA */}
            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold">Félicitations pour la lecture !</h3>
                <p className="text-xs text-brand-100">Validez immédiatement ce cours en répondant aux QCMs dédiés.</p>
              </div>
              <Link
                href={`/qcm?specialty=${course.specialtyId}&course=${course.id}`}
                className="px-5 py-2.5 rounded-xl bg-white text-brand-700 text-xs font-bold shadow-soft hover:bg-brand-50 shrink-0 flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                <span>Passer l'épreuve QCM</span>
              </Link>
            </div>
          </div>
        </div>
      </div>



      {/* Floating Highlighting Selection Toolbar */}
      <TextHighlighter
        itemSlug={course.slug}
        itemTitle={course.title}
        onSaveHighlight={(color, selectedText, note) => {
          addHighlight(course.slug, course.title, selectedText, color, note);
        }}
      />

      {/* Interactive Study Reminder & Traps Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        targetType="cours"
        targetId={course.slug}
        targetTitle={course.title}
        specialtyId={course.specialtyId}
        specialtyName={course.specialtyName}
        onSaved={() => {
          showToast({
            title: 'Rappel enregistré ⏰',
            message: 'Une notification vous sera envoyée pour relire ce cours.',
            type: 'success'
          });
        }}
      />

      {/* Spaced Repetition Modal */}
      <SpacedRepetitionModal
        isOpen={isSpacedModalOpen}
        onClose={() => setIsSpacedModalOpen(false)}
        title={course.title}
        specialty={course.specialtyName}
        type="cours"
        slugOrId={course.slug}
        onSchedule={(confidence) => {
          scheduleReview('cours', course.slug, course.title, course.specialtyName, confidence);
        }}
      />

      {/* Personal Notes Drawer */}
      <CourseNotesDrawer
        isOpen={isNotesDrawerOpen}
        onClose={() => setIsNotesDrawerOpen(false)}
        title={course.title}
        initialNote={notes[course.slug]?.content || ''}
        onSaveNote={(content) => saveNote(course.slug, course.title, content)}
      />

      {/* Interactive Click-to-Read Highlight Note Modal */}
      <HighlightNoteModal
        highlight={selectedHighlight}
        isOpen={isHighlightModalOpen}
        onClose={() => setIsHighlightModalOpen(false)}
        onUpdateNote={(id, updates) => updateHighlight(id, updates)}
        onDeleteHighlight={(id) => removeHighlight(id)}
      />

      {/* Interactive Sommaire Modal Popup */}
      <TocModal
        isOpen={isTocModalOpen}
        onClose={() => setIsTocModalOpen(false)}
        toc={activeToc}
        activeSection={activeSection}
        onSelectSection={(id) => scrollToSection(id)}
        courseTitle={course.title}
      />
    </>
  );
}

export default function CourseDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50 dark:bg-navy-950">
        <div className="w-10 h-10 border-4 border-[#5D5FEF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CourseDetailContent />
    </Suspense>
  );
}
