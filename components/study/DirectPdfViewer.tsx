'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, Moon, Sun, BookOpen,
  Brain, Bell, ExternalLink, Download, ArrowLeft, RefreshCw,
  Highlighter, Pen, StickyNote, Trash2, Eye, EyeOff, Check, X, Sparkles
} from 'lucide-react';
import { ReminderModal } from './ReminderModal';
import { CourseNotesDrawer } from './CourseNotesDrawer';
import { getEmbeddablePdfUrl, getGoogleDocsViewerFallback, isGoogleDriveUrl } from '@/lib/pdfUtils';

interface StickyNoteItem {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface DirectPdfViewerProps {
  pdfUrl: string;
  courseTitle: string;
  specialtyName?: string;
  specialtyId?: string;
  courseId?: string;
  qcmCount?: number;
  onBack?: () => void;
  onSwitchToPresentation?: () => void;
  hasPresentationFormat?: boolean;
}

export const DirectPdfViewer: React.FC<DirectPdfViewerProps> = ({
  pdfUrl,
  courseTitle,
  specialtyName = 'Médecine',
  specialtyId = 'cardio',
  courseId = 'direct_pdf',
  qcmCount = 0,
  onBack,
  onSwitchToPresentation,
  hasPresentationFormat = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [colorMode, setColorMode] = useState<'normal' | 'dark' | 'sepia'>('normal');
  const [useGoogleDocsFallback, setUseGoogleDocsFallback] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Reminder modal state
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Highlighter & Drawing Overlay States
  const [activeTool, setActiveTool] = useState<'cursor' | 'highlighter' | 'pen' | 'stickynote'>('cursor');
  const [selectedColor, setSelectedColor] = useState<'yellow' | 'green' | 'pink' | 'blue'>('yellow');
  const [stickyNotes, setStickyNotes] = useState<StickyNoteItem[]>([]);
  const [activeStickyText, setActiveStickyText] = useState('');
  const [selectedStickyId, setSelectedStickyId] = useState<string | null>(null);

  // Drawing canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const storageKeyCanvas = `asmedix_pdf_drawing_${courseId}`;
  const storageKeyNotes = `asmedix_pdf_notes_${courseId}`;
  const storageKeyDrawerNotes = `asmedix_pdf_drawer_notes_${courseId}`;
  const [drawerNotes, setDrawerNotes] = useState('');

  // Color mappings
  const colorMap = {
    yellow: { hex: 'rgba(254, 240, 138, 0.45)', pen: '#eab308', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
    green: { hex: 'rgba(187, 247, 208, 0.45)', pen: '#22c55e', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    pink: { hex: 'rgba(251, 207, 232, 0.45)', pen: '#ec4899', bg: 'bg-pink-100 text-pink-900 border-pink-300' },
    blue: { hex: 'rgba(191, 219, 254, 0.45)', pen: '#3b82f6', bg: 'bg-sky-100 text-sky-900 border-sky-300' },
  };

  // Load saved canvas drawings & notes from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedNotes = localStorage.getItem(storageKeyNotes);
      if (savedNotes) {
        setStickyNotes(JSON.parse(savedNotes));
      }
      const savedDrawerNotes = localStorage.getItem(storageKeyDrawerNotes);
      if (savedDrawerNotes) {
        setDrawerNotes(savedDrawerNotes);
      }
    } catch (_) {}
  }, [storageKeyNotes, storageKeyDrawerNotes]);

  // Restore canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const savedCanvas = localStorage.getItem(storageKeyCanvas);
      if (savedCanvas) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = savedCanvas;
      }
    } catch (_) {}
  }, [storageKeyCanvas]);

  // Resize canvas to match container
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      // Preserve existing content
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx && canvas.width > 0 && canvas.height > 0) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext('2d');
      if (ctx && tempCanvas.width > 0) {
        ctx.drawImage(tempCanvas, 0, 0);
      }
    }
  }, []);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize, isFullscreen]);

  // Lock background scroll when in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isFullscreen]);

  // Drawing event handlers
  const saveCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL();
      localStorage.setItem(storageKeyCanvas, dataUrl);
    } catch (_) {}
  }, [storageKeyCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'cursor') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'stickynote') {
      const newNote: StickyNoteItem = {
        id: `note_${Date.now()}`,
        x: Math.min(x, rect.width - 180),
        y: Math.min(y, rect.height - 120),
        text: 'Nouvelle note...',
        color: selectedColor
      };
      const updated = [...stickyNotes, newNote];
      setStickyNotes(updated);
      setSelectedStickyId(newNote.id);
      setActiveStickyText(newNote.text);
      try {
        localStorage.setItem(storageKeyNotes, JSON.stringify(updated));
      } catch (_) {}
      setActiveTool('cursor');
      return;
    }

    isDrawingRef.current = true;
    lastPointRef.current = { x, y };

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'highlighter') {
      ctx.strokeStyle = colorMap[selectedColor].hex;
      ctx.lineWidth = 22;
      ctx.globalCompositeOperation = 'source-over';
    } else if (activeTool === 'pen') {
      ctx.strokeStyle = colorMap[selectedColor].pen;
      ctx.lineWidth = 3;
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPointRef.current = { x, y };
  };

  const handleMouseUp = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      saveCanvas();
    }
  };

  const clearDrawings = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      try {
        localStorage.removeItem(storageKeyCanvas);
      } catch (_) {}
    }
    if (stickyNotes.length > 0 && confirm('Effacer aussi toutes les notes adhésives ?')) {
      setStickyNotes([]);
      try {
        localStorage.removeItem(storageKeyNotes);
      } catch (_) {}
    }
  };

  const updateStickyNote = (id: string, text: string) => {
    const updated = stickyNotes.map(n => n.id === id ? { ...n, text } : n);
    setStickyNotes(updated);
    try {
      localStorage.setItem(storageKeyNotes, JSON.stringify(updated));
    } catch (_) {}
  };

  const deleteStickyNote = (id: string) => {
    const updated = stickyNotes.filter(n => n.id !== id);
    setStickyNotes(updated);
    if (selectedStickyId === id) setSelectedStickyId(null);
    try {
      localStorage.setItem(storageKeyNotes, JSON.stringify(updated));
    } catch (_) {}
  };

  // Determine effective embed URL
  const embedUrl = useGoogleDocsFallback
    ? getGoogleDocsViewerFallback(pdfUrl)
    : getEmbeddablePdfUrl(pdfUrl);

  return (
    <div
      className={`bg-slate-900 text-white flex flex-col transition-all duration-200 select-none ${
        isFullscreen
          ? 'fixed inset-0 z-[100] w-screen h-screen'
          : 'relative w-full h-[85vh] rounded-3xl border border-slate-700 shadow-2xl overflow-hidden'
      }`}
    >
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* TOP FLOATING TOOLBAR                                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="shrink-0 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 z-30 shadow-md">
        {/* Left: Back / Title / Badge */}
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Retour aux cours"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
              📄 PDF Plein Écran
            </span>
            <h1 className="text-xs sm:text-sm font-black text-white truncate max-w-[180px] sm:max-w-xs md:max-w-md" title={courseTitle}>
              {courseTitle}
            </h1>
          </div>

          {/* Toggle format if presentation HTML exists */}
          {hasPresentationFormat && onSwitchToPresentation && (
            <button
              onClick={onSwitchToPresentation}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 cursor-pointer shrink-0"
              title="Passer en mode présentation interactive"
            >
              <BookOpen className="w-3 h-3 text-[#5D5FEF]" />
              <span>Format Web</span>
            </button>
          )}
        </div>

        {/* Center: Tools (Highlighter, Pen, Notes, Color Picker) */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
          {/* Cursor Mode */}
          <button
            type="button"
            onClick={() => setActiveTool('cursor')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              activeTool === 'cursor'
                ? 'bg-[#5D5FEF] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Mode Curseur : navigation normale & défilement du PDF"
          >
            <span>🖱️</span>
            <span className="hidden lg:inline text-[10px]">Lire</span>
          </button>

          {/* Highlighter Tool */}
          <button
            type="button"
            onClick={() => setActiveTool(activeTool === 'highlighter' ? 'cursor' : 'highlighter')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              activeTool === 'highlighter'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-300/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Surligneur : surlignez librement sur le PDF"
          >
            <Highlighter className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline text-[10px]">Surligner</span>
          </button>

          {/* Pen Tool */}
          <button
            type="button"
            onClick={() => setActiveTool(activeTool === 'pen' ? 'cursor' : 'pen')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              activeTool === 'pen'
                ? 'bg-emerald-500 text-white font-black shadow-xs ring-2 ring-emerald-300/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Crayon : dessinez, encadrez des schémas et annotez"
          >
            <Pen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline text-[10px]">Stylo</span>
          </button>

          {/* Sticky Note Tool */}
          <button
            type="button"
            onClick={() => setActiveTool(activeTool === 'stickynote' ? 'cursor' : 'stickynote')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
              activeTool === 'stickynote'
                ? 'bg-pink-500 text-white font-black shadow-xs ring-2 ring-pink-300/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Note adhésive : cliquez sur le document pour coller une note"
          >
            <StickyNote className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden lg:inline text-[10px]">Note</span>
          </button>

          {/* Color Selector (when drawing tool is active) */}
          {activeTool !== 'cursor' && (
            <div className="flex items-center gap-1 pl-1 ml-1 border-l border-slate-700 animate-in fade-in duration-150">
              {(['yellow', 'green', 'pink', 'blue'] as const).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    c === 'yellow' ? 'bg-amber-400' : c === 'green' ? 'bg-emerald-400' : c === 'pink' ? 'bg-pink-400' : 'bg-sky-400'
                  } ${selectedColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-60 hover:opacity-100'}`}
                  title={`Couleur ${c}`}
                />
              ))}
              <button
                type="button"
                onClick={clearDrawings}
                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors ml-1"
                title="Effacer les annotations de cette page"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Rappel Button, Zoom, Night Mode, QCM Link, Fullscreen Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* ⭐ LE BOUTON RAPPEL (SRS & Pièges) ⭐ */}
          <button
            type="button"
            onClick={() => setIsReminderOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-xs shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            title="Programmer un Rappel (SRS) ou Marquer comme Piège Concours"
          >
            <Bell className="w-3.5 h-3.5 text-white animate-bounce" />
            <span className="text-[11px]">Rappel & Piège</span>
          </button>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-0.5">
            <button
              onClick={() => setZoomLevel(prev => Math.max(50, prev - 15))}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Zoom arrière"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-mono text-slate-300 min-w-[38px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(200, prev + 15))}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Zoom avant"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Invert / Night Reading Filter */}
          <button
            type="button"
            onClick={() => {
              if (colorMode === 'normal') setColorMode('dark');
              else if (colorMode === 'dark') setColorMode('sepia');
              else setColorMode('normal');
            }}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              colorMode !== 'normal'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border-transparent'
            }`}
            title={`Mode de lecture : ${colorMode === 'normal' ? 'Standard' : colorMode === 'dark' ? 'Inversion Nuit (Dark)' : 'Sépia'}`}
          >
            {colorMode === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Rotate PDF */}
          <button
            type="button"
            onClick={() => setRotation(r => (r + 90) % 360)}
            className="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Pivoter de 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Link to QCM */}
          {courseId && (
            <Link
              href={`/qcm?specialty=${specialtyId}&course=${courseId}`}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
              title="Passer aux QCM associés de ce cours"
            >
              <Brain className="w-3.5 h-3.5 text-white" />
              <span className="text-[11px]">QCM</span>
            </Link>
          )}

          {/* Open original link / Download */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Télécharger / Ouvrir le fichier original dans un nouvel onglet"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(f => !f)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer shrink-0"
            title={isFullscreen ? 'Réduire la vue' : 'Mode Plein Écran'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MAIN DOCUMENT VIEWPORT                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <main className="flex-1 relative overflow-auto bg-slate-950 flex flex-col items-center">
        {/* Helper bar when annotation tool is active */}
        {activeTool !== 'cursor' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-[10px] text-slate-300 shadow-lg flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Mode {activeTool === 'highlighter' ? 'Surligneur' : activeTool === 'pen' ? 'Stylet' : 'Note'} actif · Vos annotations sont sauvegardées automatiquement</span>
          </div>
        )}

        {/* Viewport container with Zoom, Rotation & Reading filters */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform origin-top"
          style={{
            transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
            filter: colorMode === 'dark'
              ? 'invert(0.92) hue-rotate(180deg)'
              : colorMode === 'sepia'
              ? 'sepia(0.35) contrast(0.95)'
              : 'none'
          }}
        >
          {/* Fallback switch toggle banner if iframe has difficulty */}
          {!iframeLoaded && !useGoogleDocsFallback && isGoogleDriveUrl(pdfUrl) && (
            <div className="absolute top-4 right-4 z-20 bg-slate-800/90 text-[11px] p-2 rounded-xl border border-slate-700 flex items-center gap-2">
              <span className="text-slate-400">Le document ne charge pas ?</span>
              <button
                onClick={() => setUseGoogleDocsFallback(true)}
                className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px]"
              >
                Essayer Google Viewer
              </button>
            </div>
          )}

          {/* Embedded PDF iframe */}
          <iframe
            src={embedUrl}
            title={courseTitle}
            className="w-full h-full border-none bg-white rounded-none"
            allow="fullscreen; autoplay"
            onLoad={() => setIframeLoaded(true)}
          />

          {/* Annotation & Drawing Canvas Overlay (Transparent) */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`absolute inset-0 z-20 ${
              activeTool === 'cursor' ? 'pointer-events-none' : 'pointer-events-auto cursor-crosshair'
            }`}
          />

          {/* Sticky Notes on the document */}
          {stickyNotes.map(note => {
            const isEditing = selectedStickyId === note.id;
            return (
              <div
                key={note.id}
                className={`absolute z-30 p-2.5 rounded-xl shadow-xl border w-48 text-xs font-medium animate-in zoom-in-95 duration-150 ${colorMap[note.color as keyof typeof colorMap]?.bg || 'bg-amber-100 text-amber-950 border-amber-300'}`}
                style={{ left: `${note.x}px`, top: `${note.y}px` }}
              >
                <div className="flex items-center justify-between gap-1 mb-1 pb-1 border-b border-black/10">
                  <span className="text-[9px] font-black uppercase opacity-70">📌 Note d'étude</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => deleteStickyNote(note.id)}
                      className="text-black/50 hover:text-rose-600 transition-colors"
                      title="Supprimer la note"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {isEditing ? (
                  <div className="space-y-1">
                    <textarea
                      value={activeStickyText}
                      onChange={e => setActiveStickyText(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-1.5 rounded bg-white/70 text-slate-900 border border-black/20 focus:outline-none resize-none"
                      autoFocus
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          updateStickyNote(note.id, activeStickyText);
                          setSelectedStickyId(null);
                        }}
                        className="px-2 py-0.5 rounded bg-black/80 text-white text-[9px] font-bold"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  <p
                    onClick={() => {
                      setSelectedStickyId(note.id);
                      setActiveStickyText(note.text);
                    }}
                    className="cursor-pointer hover:opacity-80 break-words whitespace-pre-wrap"
                    title="Cliquez pour modifier"
                  >
                    {note.text}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* REMINDER MODAL (SRS & Trap Reminder)                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        targetType="cours"
        targetId={courseId}
        targetTitle={courseTitle}
        specialtyId={specialtyId}
        specialtyName={specialtyName}
      />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* NOTES DRAWER                                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <CourseNotesDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        title={courseTitle}
        initialNote={drawerNotes}
        onSaveNote={(text) => {
          setDrawerNotes(text);
          try {
            localStorage.setItem(storageKeyDrawerNotes, text);
          } catch (_) {}
        }}
      />
    </div>
  );
};
