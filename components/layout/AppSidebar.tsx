'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { INITIAL_COURSES } from '@/lib/db/seedCourses';
import { INITIAL_QCMS } from '@/lib/db/seedQcm';
import { INITIAL_CAT } from '@/lib/db/seedCat';
import { INITIAL_FICHES } from '@/lib/db/seedFiches';
import { INITIAL_CALCULATORS } from '@/lib/db/seedCalculators';
import { INITIAL_ORDONNANCES } from '@/lib/db/seedOrdonnances';
import { INITIAL_CLINICAL_CASES } from '@/lib/db/seedClinicalCases';
import { QCM, Course, CATProtocol, Specialty, StructuredSource, Fiche } from '@/types';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import { normalizeSourcesList } from '@/lib/sourceUtils';
import { useSidebar } from './SidebarContext';
import { useFaculty } from '@/components/context/FacultyContext';
import { Logo } from '@/components/brand/Logo';
import {
  ChevronRight, ChevronDown, ChevronLeft, PanelLeftClose, PanelLeftOpen, X,
  BookOpen, Zap, Brain, Siren, Calculator, FileText, Stethoscope,
  Activity, Pill, Heart, FlaskConical, Sparkles, BarChart3,
  MessageCircle, Home, Target, PlayCircle, Bell, School, Folder, Calendar
} from 'lucide-react';

const MEDICAL_YEARS = [
  { year: 1, name: '1ère Année', cycle: 'PCEM 1', label: '1ère Année (PCEM1)' },
  { year: 2, name: '2ème Année', cycle: 'PCEM 2', label: '2ème Année (PCEM2)' },
  { year: 3, name: '3ème Année', cycle: 'DCEM 1', label: '3ème Année (DCEM1)' },
  { year: 4, name: '4ème Année', cycle: 'DCEM 2', label: '4ème Année (DCEM2)' },
  { year: 5, name: '5ème Année', cycle: 'DCEM 3', label: '5ème Année (DCEM3)' },
  { year: 6, name: '6ème Année', cycle: 'DCEM 4', label: '6ème Année (DCEM4)' },
];

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSpecialtyParam = searchParams.get('specialty');

  const { isCollapsed, toggleCollapsed, setCollapsed, isMobileOpen, setMobileOpen } = useSidebar();
  const { faculty, setFaculty } = useFaculty();

  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Accordion section expansion states ──
  const [coursExpanded, setCoursExpanded] = useState<boolean>(false);
  const [activeCourseYear, setActiveCourseYear] = useState<number | 'none' | null>(null);
  const [activeCourseSpec, setActiveCourseSpec] = useState<string | null>(null);

  const [qcmExpanded, setQcmExpanded] = useState<boolean>(false);
  const [activeQcmYear, setActiveQcmYear] = useState<number | 'none' | null>(null);
  const [activeQcmSpec, setActiveQcmSpec] = useState<string | null>(null);
  const [expandedQcmSource, setExpandedQcmSource] = useState<string | null>(null);

  const [fichesExpanded, setFichesExpanded] = useState<boolean>(false);
  const [activeFicheSpec, setActiveFicheSpec] = useState<string | null>(null);

  const [catExpanded, setCatExpanded] = useState<boolean>(false);
  const [activeCatSpec, setActiveCatSpec] = useState<string | null>(null);

  const [calcExpanded, setCalcExpanded] = useState<boolean>(false);
  const [activeCalcSpec, setActiveCalcSpec] = useState<string | null>(null);

  const [ordExpanded, setOrdExpanded] = useState<boolean>(false);
  const [activeOrdSpec, setActiveOrdSpec] = useState<string | null>(null);

  const [casesExpanded, setCasesExpanded] = useState<boolean>(false);
  const [activeCaseSpec, setActiveCaseSpec] = useState<string | null>(null);

  // ── Dynamic live data for exact reactive counts ──
  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>(ALL_SPECIALTIES);
  const [qcmsList, setQcmsList] = useState<QCM[]>(INITIAL_QCMS);
  const [coursesList, setCoursesList] = useState<Course[]>(INITIAL_COURSES);
  const [fichesList, setFichesList] = useState<Fiche[]>(INITIAL_FICHES);
  const [deletedFichesSpecialtyIds, setDeletedFichesSpecialtyIds] = useState<string[]>([]);
  const [catsList, setCatsList] = useState<CATProtocol[]>(INITIAL_CAT);
  const [adminSources, setAdminSources] = useState<{ specialty?: string; course?: string; faculty?: string; sources: string[]; structuredSources?: StructuredSource[] }[]>([]);

  const fetchDynamicData = useCallback(async () => {
    try {
      const [qRes, cRes, catRes, sRes, srcRes, fRes] = await Promise.all([
        fetch('/api/qcm'),
        fetch('/api/courses'),
        fetch('/api/cat'),
        fetch('/api/specialties'),
        fetch('/api/admin/sources/all').catch(() => null),
        fetch('/api/fiches').catch(() => null)
      ]);
      const qData = await qRes.json();
      if (qData.qcms && Array.isArray(qData.qcms)) {
        setQcmsList(qData.qcms);
      }
      const cData = await cRes.json();
      if (cData.courses && Array.isArray(cData.courses)) {
        setCoursesList(cData.courses);
      }
      const catData = await catRes.json();
      if (catData.protocols && Array.isArray(catData.protocols)) {
        setCatsList(catData.protocols);
      }
      const sData = await sRes.json();
      if (sData.success && Array.isArray(sData.specialties)) {
        setSpecialtiesList(sData.specialties);
      }
      if (srcRes && srcRes.ok) {
        const srcData = await srcRes.json();
        if (srcData.scopes && Array.isArray(srcData.scopes)) {
          setAdminSources(srcData.scopes);
        }
      }
      if (fRes && fRes.ok) {
        const fData = await fRes.json();
        if (fData.fiches && Array.isArray(fData.fiches)) {
          setFichesList(fData.fiches);
        }
        if (fData.deletedSpecialtyIds && Array.isArray(fData.deletedSpecialtyIds)) {
          setDeletedFichesSpecialtyIds(fData.deletedSpecialtyIds);
        }
      }
    } catch {
      // Keep initial fallbacks
    }
  }, []);

  // Helper to extract structured sources (parent + subSources) for a specialty strictly matching current faculty
  const getStructuredModuleSources = useCallback((specId: string): StructuredSource[] => {
    const specObj = specialtiesList.find(s => s.id === specId || s.slug === specId);
    const specName = specObj?.name?.toLowerCase();

    // Only include QCMs matching the selected faculty
    const specQcms = qcmsList.filter(q =>
      (q.specialtyId === specId ||
      (q.specialtyId && q.specialtyId.toLowerCase() === specId.toLowerCase()) ||
      (specName && q.specialtyName && q.specialtyName.toLowerCase() === specName)) &&
      (faculty === 'TOUS' || !q.faculty || q.faculty === 'TOUS' || q.faculty === faculty)
    );

    const accumulated: any[] = [];
    adminSources.forEach(s => {
      // Strict faculty matching:
      // If s.faculty is set to ORAN, only show it when faculty === 'ORAN' or faculty === 'TOUS'.
      // If s.faculty is set to SIDI_BEL_ABBES, only show it when faculty === 'SIDI_BEL_ABBES' or faculty === 'TOUS'.
      // An ORAN source must NEVER show in SIDI_BEL_ABBES, and an SBA source must NEVER show in ORAN.
      const sFac = s.faculty || (s as any).key?.split('::')[1] || 'TOUS';
      const matchFaculty =
        faculty === 'TOUS' ||
        sFac === 'TOUS' ||
        sFac === faculty;

      if (!matchFaculty) return;

      const matchSpec =
        s.specialty === specId ||
        (specName && s.specialty?.toLowerCase() === specName) ||
        (s as any).key === specId ||
        (s as any).key === `${specId}::${sFac}`;

      if (matchSpec && (!s.course || s.course === '')) {
        if (Array.isArray(s.structuredSources) && s.structuredSources.length > 0) {
          accumulated.push(...s.structuredSources);
        } else if (Array.isArray(s.sources)) {
          accumulated.push(...s.sources);
        }
      }
    });

    specQcms.forEach(q => {
      if (q.source) {
        q.source.split(',').forEach(src => {
          const cleaned = src.trim();
          if (cleaned) accumulated.push(cleaned);
        });
      }
    });

    const result = normalizeSourcesList(accumulated);
    return result;
  }, [adminSources, qcmsList, specialtiesList, faculty]);

  // Helper to extract module-level sources as flat strings
  const getModuleSources = useCallback((specId: string): string[] => {
    return getStructuredModuleSources(specId).map(s => s.name);
  }, [getStructuredModuleSources]);

  // Helper to extract course-level sources for a specific course strictly matching current faculty
  const getCourseSources = useCallback((specId: string, courseId: string, courseTitle?: string): string[] => {
    const set = new Set<string>();
    const specObj = specialtiesList.find(s => s.id === specId || s.slug === specId);
    const specName = specObj?.name?.toLowerCase();

    // Only include course QCMs matching the selected faculty
    const courseQcms = qcmsList.filter(q =>
      (q.specialtyId === specId || (q.specialtyId && q.specialtyId.toLowerCase() === specId.toLowerCase()) || (specName && q.specialtyName && q.specialtyName.toLowerCase() === specName)) &&
      (q.courseId === courseId || (courseTitle && (q.courseTitle === courseTitle || q.courseId === courseTitle))) &&
      (faculty === 'TOUS' || !q.faculty || q.faculty === 'TOUS' || q.faculty === faculty)
    );

    adminSources.forEach(s => {
      const sFac = s.faculty || (s as any).key?.split('::')[1] || 'TOUS';
      const matchFaculty =
        faculty === 'TOUS' ||
        sFac === 'TOUS' ||
        sFac === faculty;

      if (!matchFaculty) return;

      if ((s.specialty === specId || (specName && s.specialty?.toLowerCase() === specName)) && (s.course === courseId || (courseTitle && s.course === courseTitle))) {
        s.sources?.forEach(src => {
          if (src?.trim()) {
            const clean = src.trim();
            set.add(clean);
          }
        });
      }
    });

    courseQcms.forEach(q => {
      if (q.source) {
        q.source.split(',').forEach(src => {
          const cleaned = src.trim();
          if (cleaned) set.add(cleaned);
        });
      }
    });

    return Array.from(set);
  }, [adminSources, qcmsList, specialtiesList, faculty]);

  useEffect(() => {
    fetchDynamicData();
    const handleUpdate = () => fetchDynamicData();
    window.addEventListener('asmedix-qcm-updated', handleUpdate);
    window.addEventListener('asmedix-content-updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    const interval = setInterval(fetchDynamicData, 5000);
    return () => {
      window.removeEventListener('asmedix-qcm-updated', handleUpdate);
      window.removeEventListener('asmedix-content-updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      clearInterval(interval);
    };
  }, [fetchDynamicData]);

  // Auto-expand current active route on initial load or route change
  useEffect(() => {
    if (mounted && pathname.startsWith('/cours')) {
      setCoursExpanded(true);
      if (currentSpecialtyParam) setActiveCourseSpec(currentSpecialtyParam);
    } else if (mounted && pathname.startsWith('/qcm')) {
      setQcmExpanded(true);
      if (currentSpecialtyParam) setActiveQcmSpec(currentSpecialtyParam);
    } else if (mounted && pathname.startsWith('/fiches')) {
      setFichesExpanded(true);
      if (currentSpecialtyParam) setActiveFicheSpec(currentSpecialtyParam);
    } else if (mounted && pathname.startsWith('/cat')) {
      setCatExpanded(true);
      if (currentSpecialtyParam) setActiveCatSpec(currentSpecialtyParam);
    } else if (mounted && pathname.startsWith('/calculateurs')) {
      setCalcExpanded(true);
      if (currentSpecialtyParam) setActiveCalcSpec(currentSpecialtyParam);
    } else if (mounted && pathname.startsWith('/ordonnances')) {
      setOrdExpanded(true);
      if (currentSpecialtyParam) setActiveOrdSpec(currentSpecialtyParam);
    } else if (mounted && pathname.startsWith('/cas-cliniques')) {
      setCasesExpanded(true);
      if (currentSpecialtyParam) setActiveCaseSpec(currentSpecialtyParam);
    }
  }, [pathname, currentSpecialtyParam]);

  const handleToggleSection = (section: 'cours' | 'qcm' | 'fiches' | 'cat' | 'calc' | 'ord' | 'cases') => {
    if (section === 'cours') {
      const next = !coursExpanded;
      setCoursExpanded(next);
      if (next) { setQcmExpanded(false); setFichesExpanded(false); setCatExpanded(false); setCalcExpanded(false); setOrdExpanded(false); setCasesExpanded(false); }
    } else if (section === 'qcm') {
      const next = !qcmExpanded;
      setQcmExpanded(next);
      if (next) { setCoursExpanded(false); setFichesExpanded(false); setCatExpanded(false); setCalcExpanded(false); setOrdExpanded(false); setCasesExpanded(false); }
    } else if (section === 'fiches') {
      const next = !fichesExpanded;
      setFichesExpanded(next);
      if (next) { setCoursExpanded(false); setQcmExpanded(false); setCatExpanded(false); setCalcExpanded(false); setOrdExpanded(false); setCasesExpanded(false); }
    } else if (section === 'cat') {
      const next = !catExpanded;
      setCatExpanded(next);
      if (next) { setCoursExpanded(false); setQcmExpanded(false); setFichesExpanded(false); setCalcExpanded(false); setOrdExpanded(false); setCasesExpanded(false); }
    } else if (section === 'calc') {
      const next = !calcExpanded;
      setCalcExpanded(next);
      if (next) { setCoursExpanded(false); setQcmExpanded(false); setFichesExpanded(false); setCatExpanded(false); setOrdExpanded(false); setCasesExpanded(false); }
    } else if (section === 'ord') {
      const next = !ordExpanded;
      setOrdExpanded(next);
      if (next) { setCoursExpanded(false); setQcmExpanded(false); setFichesExpanded(false); setCatExpanded(false); setCalcExpanded(false); setCasesExpanded(false); }
    } else if (section === 'cases') {
      const next = !casesExpanded;
      setCasesExpanded(next);
      if (next) { setCoursExpanded(false); setQcmExpanded(false); setFichesExpanded(false); setCatExpanded(false); setCalcExpanded(false); setOrdExpanded(false); }
    }
  };

  const handleLinkClick = () => {
    if (isMobileOpen) {
      setMobileOpen(false);
    }
  };

  // Other flat navigation items
  const flatItems = [
    { label: 'Mode Garde H24', href: '/garde', icon: Heart, badge: 'H24', badgeColor: 'bg-red-500 text-white' },
    { label: 'Pharmnet DZ (9 560)', href: '/medicaments', icon: Pill, badge: '9.5k', badgeColor: 'bg-emerald-500 text-white' },
    { label: 'ECG du Jour', href: '/ecg', icon: Activity },
    { label: 'Lecteur FNS (IA)', href: '/fns-reader', icon: FlaskConical, badge: 'IA', badgeColor: 'bg-[#5D5FEF] text-white' },
    { label: 'Assistant IA Pro', href: '/ai', icon: Sparkles, badge: 'PRO', badgeColor: 'bg-gradient-to-r from-[#5D5FEF] to-[#7c3aed] text-white' },
    { label: 'Mes Rappels & Pièges', href: '/reminders', icon: Bell, badge: 'SRS', badgeColor: 'bg-amber-500 text-white' },
    { label: 'Progression & Stats', href: '/progression', icon: BarChart3 },
    { label: 'Support & Contact', href: '/contact', icon: MessageCircle },
  ];

  // =========================================================================
  // 1. COLLAPSED RAIL (w-20, DESKTOP)
  // =========================================================================
  if (isCollapsed) {
    return (
      <>
        <aside className="hidden lg:flex w-20 flex-col fixed top-0 left-0 bottom-0 z-30 p-2.5 transition-all duration-300">
          <div className="h-full w-full card flex flex-col items-center py-4 gap-2 overflow-hidden shadow-card">
            
            <div className="mb-1">
              <Logo size="sm" variant="minimal" />
            </div>

            <button
              onClick={toggleCollapsed}
              className="w-10 h-10 rounded-xl btn-ghost flex items-center justify-center text-slate-500 hover:text-[#5D5FEF] hover:bg-iris-50 dark:hover:bg-iris-950/30"
              title="Agrandir la barre latérale"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>

            <div className="flex-1 w-full overflow-y-auto space-y-1.5 scrollbar-none px-2 py-1 flex flex-col items-center">
              {/* Home */}
              <Link
                href="/dashboard"
                title="Tableau de bord"
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  pathname === '/dashboard' ? 'bg-[#5D5FEF] text-white shadow-iris' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-[#5D5FEF]'
                }`}
              >
                <Home className="w-4.5 h-4.5" />
              </Link>

              {/* Cours */}
              <button
                onClick={() => { toggleCollapsed(); setCoursExpanded(true); }}
                title="Cours par Spécialité (cliquer pour ouvrir)"
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  mounted && pathname.startsWith('/cours') ? 'bg-[#5D5FEF] text-white shadow-iris' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-[#5D5FEF]'
                }`}
              >
                <BookOpen className="w-4.5 h-4.5" />
              </button>

              {/* QCM */}
              <button
                onClick={() => { toggleCollapsed(); setQcmExpanded(true); }}
                title="QCM par Spécialité"
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  mounted && pathname.startsWith('/qcm') ? 'bg-[#5D5FEF] text-white shadow-iris' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-[#5D5FEF]'
                }`}
              >
                <Brain className="w-4.5 h-4.5" />
              </button>

              {/* Fiches */}
              <button
                onClick={() => { toggleCollapsed(); setFichesExpanded(true); }}
                title="Fiches Flash par Spécialité"
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  mounted && pathname.startsWith('/fiches') ? 'bg-[#5D5FEF] text-white shadow-iris' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-[#5D5FEF]'
                }`}
              >
                <Zap className="w-4.5 h-4.5" />
              </button>

              {/* CAT */}
              <button
                onClick={() => { toggleCollapsed(); setCatExpanded(true); }}
                title="CAT Urgences par Spécialité"
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  mounted && pathname.startsWith('/cat') ? 'bg-[#5D5FEF] text-white shadow-iris' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-[#5D5FEF]'
                }`}
              >
                <Siren className="w-4.5 h-4.5" />
              </button>

              {/* Calculateurs */}
              <button
                onClick={() => { toggleCollapsed(); setCalcExpanded(true); }}
                title="Calculateurs par Spécialité"
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  mounted && pathname.startsWith('/calculateurs') ? 'bg-[#5D5FEF] text-white shadow-iris' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-[#5D5FEF]'
                }`}
              >
                <Calculator className="w-4.5 h-4.5" />
              </button>

              {/* Cas Cliniques */}
              <button
                onClick={() => { toggleCollapsed(); setCasesExpanded(true); }}
                title="Cas Cliniques par Spécialité"
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  mounted && pathname.startsWith('/cas-cliniques') ? 'bg-[#5D5FEF] text-white shadow-iris' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-[#5D5FEF]'
                }`}
              >
                <Stethoscope className="w-4.5 h-4.5" />
              </button>

              {/* Ordonnances */}
              <button
                onClick={() => { toggleCollapsed(); setOrdExpanded(true); }}
                title="Ordonnances par Spécialité"
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  mounted && pathname.startsWith('/ordonnances') ? 'bg-[#5D5FEF] text-white shadow-iris' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-[#5D5FEF]'
                }`}
              >
                <FileText className="w-4.5 h-4.5" />
              </button>

              <div className="w-6 border-t border-slate-200 dark:border-white/10 my-1" />

              {/* Flat icons */}
              {flatItems.slice(0, 4).map(item => {
                const Icon = item.icon;
                const isActive = mounted && pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${
                      isActive ? 'bg-[#5D5FEF] text-white shadow-iris' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-[#5D5FEF]'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </Link>
                );
              })}
            </div>

            <div className="w-full border-t border-slate-100 dark:border-white/8 pt-2 flex justify-center">
              <button
                onClick={toggleCollapsed}
                className="w-10 h-10 rounded-xl btn-ghost flex items-center justify-center text-slate-500 hover:text-[#5D5FEF]"
                title="Développer le volet"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile drawer if triggered while collapsed */}
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-[70] flex animate-fade-in">
            <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />
            <div className="relative w-[90vw] sm:w-80 max-w-[340px] h-full p-2 sm:p-2.5 z-10 flex flex-col"
              style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}>
              {renderSidebarContent(true)}
            </div>
          </div>
        )}
      </>
    );
  }

  // =========================================================================
  // 2. EXPANDED SIDEBAR CONTENT (w-72)
  // =========================================================================
  function renderSidebarContent(isMobile: boolean = false) {
    return (
      <div className="h-full w-full card flex flex-col overflow-hidden shadow-card">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-white/8">
          <Logo size="sm" showTagline />
          {isMobile ? (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-xl btn-ghost text-slate-500 hover:text-slate-800 dark:hover:text-white"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={toggleCollapsed}
              className="p-1.5 rounded-xl btn-ghost text-slate-500 hover:text-[#5D5FEF]"
              title="Réduire le volet"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Faculty quick switch */}
        <div className="px-3 py-2 border-b border-slate-100 dark:border-white/8 bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10">
            {(['TOUS', 'ORAN', 'SIDI_BEL_ABBES'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFaculty(f)}
                className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
                  faculty === f
                    ? 'bg-white dark:bg-slate-700 text-[#5D5FEF] shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                {f === 'TOUS' ? '🇩🇿 DZ' : f === 'ORAN' ? '☀️ ORAN' : '🌿 SBA'}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Navigation Body */}
        <div suppressHydrationWarning className="flex-1 overflow-y-auto py-3 px-3 space-y-1.5 scrollbar-thin">
          
          {/* Dashboard Item */}
          <Link
            href="/dashboard"
            onClick={handleLinkClick}
            suppressHydrationWarning
            className={`sidebar-item ${mounted && mounted && pathname === '/dashboard' ? 'active' : ''}`}
          >
            <Home suppressHydrationWarning className={`sidebar-icon w-4 h-4 shrink-0 ${mounted && mounted && pathname === '/dashboard' ? 'text-[#5D5FEF]' : ''}`} />
            <span className="flex-1 truncate font-semibold">Tableau de bord</span>
          </Link>

          <div className="section-title pt-2">Modules par Spécialité</div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 1. COURS PAR SPÉCIALITÉ (ACCORDION) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="space-y-1">
            <button
              suppressHydrationWarning
              onClick={() => handleToggleSection('cours')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                coursExpanded || mounted && pathname.startsWith('/cours')
                  ? 'bg-iris-50 dark:bg-iris-950/40 text-[#5D5FEF] border border-iris-200/70 dark:border-iris-800/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate" suppressHydrationWarning>
                <BookOpen className="w-4 h-4 text-[#5D5FEF] shrink-0" />
                <span className="truncate" suppressHydrationWarning>Cours par Spécialité</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span suppressHydrationWarning className="badge badge-iris text-[10px] px-1.5 py-0 font-bold">{coursesList.length}</span>
                {coursExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </button>

            {coursExpanded && (
              <div className="ml-2.5 pl-2.5 border-l-2 border-iris-300 dark:border-iris-800/60 space-y-1.5 py-1 animate-fade-in">
                <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>6 Années Médicales</span>
                  <Link href="/cours" onClick={handleLinkClick} className="text-[#5D5FEF] font-semibold hover:underline">
                    Hub Cours →
                  </Link>
                </div>

                {/* Level 1: Medical Years */}
                {MEDICAL_YEARS.map(yr => {
                  const isYearOpen = activeCourseYear === yr.year;
                  const yearSpecialties = specialtiesList.filter(s => {
                    const matchYear = s.year === yr.year;
                    const matchFac = faculty === 'TOUS' || !s.faculty || s.faculty === 'TOUS' || s.faculty === faculty;
                    return matchYear && matchFac;
                  });

                  return (
                    <div key={`crs_yr_${yr.year}`} className="space-y-0.5">
                      <button
                        onClick={() => setActiveCourseYear(isYearOpen ? null : yr.year)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-bold text-left transition-all ${
                          isYearOpen
                            ? 'bg-brand-500/10 dark:bg-brand-500/20 text-[#5D5FEF] border border-brand-500/30'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <School className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                          <span className="truncate font-black">{yr.name}</span>
                          <span className="text-[9px] text-slate-400 font-normal">({yr.cycle})</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span suppressHydrationWarning className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 font-bold">
                            {yearSpecialties.length} spé
                          </span>
                          {isYearOpen ? <ChevronDown className="w-3 h-3 text-[#5D5FEF]" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                        </div>
                      </button>

                      {/* Level 2: Specialties in this Year */}
                      {isYearOpen && (
                        <div className="ml-2 pl-2 border-l border-brand-300 dark:border-brand-800 space-y-1 py-1 animate-fade-in">
                          {yearSpecialties.length === 0 ? (
                            <div className="px-2 py-1 text-[10px] italic text-slate-400">
                              Aucune spécialité configurée
                            </div>
                          ) : (
                            yearSpecialties.map(spec => {
                              const isSpecOpen = activeCourseSpec === spec.id;
                              const specCourses = coursesList.filter(c => {
                                const matchSpec = c.specialtyId === spec.id;
                                const matchFac = faculty === 'TOUS' || !c.faculty || c.faculty === 'TOUS' || c.faculty === faculty;
                                return matchSpec && matchFac;
                              });

                              return (
                                <div key={`crs_spec_${spec.id}`} className="space-y-0.5">
                                  <button
                                    onClick={() => setActiveCourseSpec(isSpecOpen ? null : spec.id)}
                                    className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] font-semibold text-left transition-all ${
                                      isSpecOpen
                                        ? 'bg-iris-100/70 dark:bg-iris-950 text-[#5D5FEF] font-bold'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 truncate">
                                      <span className="text-xs">{getSpecialtyEmoji(spec.id)}</span>
                                      <span className="truncate">{spec.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <span className="text-[9px] text-slate-400 font-mono">
                                        {specCourses.length}
                                      </span>
                                      {isSpecOpen ? <ChevronDown className="w-2.5 h-2.5 text-[#5D5FEF]" /> : <ChevronRight className="w-2.5 h-2.5 text-slate-400" />}
                                    </div>
                                  </button>

                                  {/* Level 3: Courses inside this Specialty */}
                                  {isSpecOpen && (
                                    <div className="ml-3 pl-2 border-l border-slate-200 dark:border-white/10 space-y-0.5 py-0.5 animate-fade-in">
                                      <Link
                                        href={`/cours?specialty=${spec.id}`}
                                        onClick={handleLinkClick}
                                        className="block px-2 py-1 rounded-md text-[10px] font-bold text-[#5D5FEF] hover:bg-iris-50 dark:hover:bg-iris-950/30 truncate"
                                      >
                                        📖 Voir les cours de {spec.shortName} →
                                      </Link>

                                      {specCourses.length === 0 ? (
                                        <div className="px-2 py-1 text-[10px] italic text-slate-400">
                                          Cours en cours de rédaction
                                        </div>
                                      ) : (
                                        specCourses.map(crs => (
                                          <Link
                                            key={crs.id}
                                            href={`/cours/${crs.slug}?fullscreen=true`}
                                            onClick={handleLinkClick}
                                            className="block px-2 py-1 rounded-md text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-[#5D5FEF] transition-colors truncate"
                                            title={crs.title}
                                          >
                                            • {crs.title}
                                          </Link>
                                        ))
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Modules Transversaux (Sans année spécifique) */}
                {mounted && specialtiesList.some(s => !s.year) && (() => {
                  const isTransversalOpen = activeCourseYear === 'none';
                  const transversalSpecialties = specialtiesList.filter(s => {
                    const matchYear = !s.year;
                    const matchFac = faculty === 'TOUS' || !s.faculty || s.faculty === 'TOUS' || s.faculty === faculty;
                    return matchYear && matchFac;
                  });

                  return (
                    <div key="crs_yr_none" className="space-y-0.5">
                      <button
                        onClick={() => setActiveCourseYear(isTransversalOpen ? null : 'none')}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-bold text-left transition-all ${
                          isTransversalOpen
                            ? 'bg-brand-500/10 dark:bg-brand-500/20 text-[#5D5FEF] border border-brand-500/30'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs">🌐</span>
                          <span className="truncate font-black">Modules Transversaux</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span suppressHydrationWarning className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 font-bold">
                            {transversalSpecialties.length} spé
                          </span>
                          {isTransversalOpen ? <ChevronDown className="w-3 h-3 text-[#5D5FEF]" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                        </div>
                      </button>

                      {isTransversalOpen && (
                        <div className="ml-2 pl-2 border-l border-brand-300 dark:border-brand-800 space-y-1 py-1 animate-fade-in">
                          {transversalSpecialties.map(spec => {
                            const isSpecOpen = activeCourseSpec === spec.id;
                            const specCourses = coursesList.filter(c => {
                              const matchSpec = c.specialtyId === spec.id;
                              const matchFac = faculty === 'TOUS' || !c.faculty || c.faculty === 'TOUS' || c.faculty === faculty;
                              return matchSpec && matchFac;
                            });

                            return (
                              <div key={`crs_spec_${spec.id}`} className="space-y-0.5">
                                <button
                                  onClick={() => setActiveCourseSpec(isSpecOpen ? null : spec.id)}
                                  className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] font-semibold text-left transition-all ${
                                    isSpecOpen
                                      ? 'bg-iris-100/70 dark:bg-iris-950 text-[#5D5FEF] font-bold'
                                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    <span className="text-xs">{getSpecialtyEmoji(spec.id)}</span>
                                    <span className="truncate">{spec.name}</span>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <span className="text-[9px] text-slate-400 font-mono">
                                      {specCourses.length}
                                    </span>
                                    {isSpecOpen ? <ChevronDown className="w-2.5 h-2.5 text-[#5D5FEF]" /> : <ChevronRight className="w-2.5 h-2.5 text-slate-400" />}
                                  </div>
                                </button>

                                {isSpecOpen && (
                                  <div className="ml-3 pl-2 border-l border-slate-200 dark:border-white/10 space-y-0.5 py-0.5 animate-fade-in">
                                    <Link
                                      href={`/cours?specialty=${spec.id}`}
                                      onClick={handleLinkClick}
                                      className="block px-2 py-1 rounded-md text-[10px] font-bold text-[#5D5FEF] hover:bg-iris-50 dark:hover:bg-iris-950/30 truncate"
                                    >
                                      📖 Voir les cours de {spec.shortName} →
                                    </Link>

                                    {specCourses.length === 0 ? (
                                      <div className="px-2 py-1 text-[10px] italic text-slate-400">
                                        Aucun cours disponible
                                      </div>
                                    ) : (
                                      specCourses.map(crs => (
                                        <Link
                                          key={crs.id}
                                          href={`/cours/${crs.slug}?fullscreen=true`}
                                          onClick={handleLinkClick}
                                          className="block px-2 py-1 rounded-md text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-iris-50 hover:text-[#5D5FEF] dark:hover:bg-white/8 transition-colors truncate"
                                          title={crs.title}
                                        >
                                          • {crs.title}
                                        </Link>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 2. BANQUE QCM (3-LEVEL ACCORDION: YEAR -> SPEC -> QCMS) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="space-y-1">
            <button
              suppressHydrationWarning
              onClick={() => handleToggleSection('qcm')}
              className={`w-full flex items-center justify-between gap-1 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                qcmExpanded || mounted && pathname.startsWith('/qcm')
                  ? 'bg-iris-50 dark:bg-iris-950/40 text-[#5D5FEF] border border-iris-200/70 dark:border-iris-800/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1" suppressHydrationWarning>
                <Brain className="w-4 h-4 text-[#5D5FEF] shrink-0" suppressHydrationWarning />
                <span className="truncate" suppressHydrationWarning>Banque QCM</span>
                <span className="hidden sm:inline text-slate-400 font-normal text-[11px] shrink-0" suppressHydrationWarning>(6 Années)</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-1" suppressHydrationWarning>
                <span suppressHydrationWarning className="badge badge-iris text-[10px] px-1.5 py-0 font-bold whitespace-nowrap">
                  {qcmsList.filter(q => faculty === 'TOUS' || !q.faculty || q.faculty === 'TOUS' || q.faculty === faculty).length} QCM
                </span>
                {qcmExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" suppressHydrationWarning /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" suppressHydrationWarning />}
              </div>
            </button>

            {qcmExpanded && (
              <div className="ml-1 sm:ml-2.5 pl-1.5 sm:pl-2.5 border-l-2 border-iris-300 dark:border-iris-800/60 space-y-1.5 py-1 animate-fade-in">
                <div className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between gap-1">
                  <span className="truncate">QCM par Année & Spé</span>
                  <Link href="/qcm" onClick={handleLinkClick} className="text-[#5D5FEF] font-semibold hover:underline shrink-0 text-[10px] whitespace-nowrap">
                    Hub QCM →
                  </Link>
                </div>

                {/* Level 1: Medical Years */}
                {MEDICAL_YEARS.map(yr => {
                  const isYearOpen = activeQcmYear === yr.year;
                  const yearSpecialties = specialtiesList.filter(s => {
                    const matchYear = s.year === yr.year;
                    const matchFac = faculty === 'TOUS' || !s.faculty || s.faculty === 'TOUS' || s.faculty === faculty;
                    return matchYear && matchFac;
                  });

                  return (
                    <div key={`qcm_yr_${yr.year}`} className="space-y-0.5">
                      <button
                        onClick={() => setActiveQcmYear(isYearOpen ? null : yr.year)}
                        className={`w-full flex items-center justify-between gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold text-left transition-all ${
                          isYearOpen
                            ? 'bg-brand-500/10 dark:bg-brand-500/20 text-[#5D5FEF] border border-brand-500/30'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <School className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                          <span className="truncate font-black">{yr.name}</span>
                          <span className="text-[9px] text-slate-400 font-normal shrink-0">({yr.cycle})</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          <span suppressHydrationWarning className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 font-bold whitespace-nowrap">
                            {yearSpecialties.length} spé
                          </span>
                          {isYearOpen ? <ChevronDown className="w-3 h-3 text-[#5D5FEF] shrink-0" /> : <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                        </div>
                      </button>

                      {/* Level 2: Specialties in this Year */}
                      {isYearOpen && (
                        <div className="ml-1 sm:ml-2 pl-1.5 sm:pl-2 border-l border-brand-300 dark:border-brand-800 space-y-1 py-1 animate-fade-in">
                          {yearSpecialties.length === 0 ? (
                            <div className="px-2 py-1 text-[10px] italic text-slate-400">
                              Aucune spécialité configurée
                            </div>
                          ) : (
                            yearSpecialties.map(spec => {
                              const isSpecOpen = activeQcmSpec === spec.id;
                              const specQcms = qcmsList.filter(q => {
                                const matchSpec = q.specialtyId === spec.id;
                                const matchFac = faculty === 'TOUS' || !q.faculty || q.faculty === 'TOUS' || q.faculty === faculty;
                                return matchSpec && matchFac;
                              });
                              const specCourses = coursesList.filter(c => {
                                const matchSpec = c.specialtyId === spec.id;
                                const matchFac = faculty === 'TOUS' || !c.faculty || c.faculty === 'TOUS' || c.faculty === faculty;
                                return matchSpec && matchFac;
                              });
                              const specCount = specQcms.length;

                              return (
                                <div key={`qcm_spec_${spec.id}`} className="space-y-0.5">
                                  <button
                                    onClick={() => setActiveQcmSpec(isSpecOpen ? null : spec.id)}
                                    className={`w-full flex items-center justify-between gap-1 px-1.5 sm:px-2 py-1 rounded-md text-[11px] font-semibold text-left transition-all ${
                                      isSpecOpen
                                        ? 'bg-iris-100/70 dark:bg-iris-950 text-[#5D5FEF] font-bold'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                      <span className="text-xs shrink-0">{getSpecialtyEmoji(spec.id)}</span>
                                      <span className="truncate">{spec.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 ml-1">
                                      <span className="text-[10px] text-slate-400 font-mono font-bold whitespace-nowrap">
                                        {specCount}
                                      </span>
                                      {isSpecOpen ? <ChevronDown className="w-2.5 h-2.5 text-[#5D5FEF] shrink-0" /> : <ChevronRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />}
                                    </div>
                                  </button>

                                  {/* Level 3: Totalité du Module vs Par Cours */}
                                  {isSpecOpen && (() => {
                                    const moduleStructuredSources = getStructuredModuleSources(spec.id);

                                    return (
                                      <div className="ml-1 sm:ml-2 pl-1.5 sm:pl-2 border-l border-slate-200 dark:border-white/10 space-y-2 py-1 animate-fade-in">
                                        {/* Totalité du Module Section */}
                                        <div className="space-y-1.5 p-1.5 sm:p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5">
                                          <Link
                                            href={`/qcm-session?specialty=${spec.id}${faculty !== 'TOUS' ? `&faculty=${faculty}` : ''}`}
                                            onClick={handleLinkClick}
                                            className="flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg text-[10.5px] sm:text-[11px] font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 shadow-xs transition-transform active:scale-[0.98]"
                                            title="Lancer la totalité du module (Toutes sources)"
                                          >
                                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                              <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                                              <span className="truncate">Totalité du Module</span>
                                              <span className="hidden sm:inline text-[9px] opacity-85 font-normal shrink-0">(Toutes sources)</span>
                                            </div>
                                            <span className="text-[9.5px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono shrink-0 whitespace-nowrap font-bold">
                                              {specCount} QCM
                                            </span>
                                          </Link>

                                          {/* Module Sources Hierarchy (Année -> Module -> Source -> Sous-Source) */}
                                          {moduleStructuredSources.length > 0 && (
                                            <div className="pt-1 space-y-1">
                                              <div className="text-[9px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 px-1 flex items-center justify-between gap-1">
                                                <span className="truncate">📚 Sources ({moduleStructuredSources.length})</span>
                                                <span className="text-[7.5px] text-slate-400 lowercase font-normal shrink-0">sessions</span>
                                              </div>
                                              <div className="space-y-1">
                                                {moduleStructuredSources.map(src => {
                                                  const hasSubs = Array.isArray(src.subSources) && src.subSources.length > 0;
                                                  const sourceKey = `${spec.id}__${src.name}`;
                                                  const isSourceOpen = expandedQcmSource === sourceKey;

                                                  if (hasSubs) {
                                                    return (
                                                      <div key={src.name} className="space-y-0.5">
                                                        <button
                                                          type="button"
                                                          onClick={() => setExpandedQcmSource(isSourceOpen ? null : sourceKey)}
                                                          className={`w-full flex items-center justify-between gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold text-left transition-all ${
                                                            isSourceOpen
                                                              ? 'bg-sky-500/15 dark:bg-sky-500/25 text-sky-700 dark:text-sky-300 border border-sky-400/40 shadow-xs'
                                                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-sky-50/60 dark:hover:bg-white/5'
                                                          }`}
                                                          title={src.name}
                                                        >
                                                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                            <Folder className={`w-3 h-3 shrink-0 ${isSourceOpen ? 'text-sky-500' : 'text-slate-400'}`} />
                                                            <span className="truncate">{src.name}</span>
                                                          </div>
                                                          <div className="flex items-center gap-1 shrink-0 ml-1">
                                                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono font-bold whitespace-nowrap">
                                                              {src.subSources.length} sess.
                                                            </span>
                                                            {isSourceOpen ? <ChevronDown className="w-2.5 h-2.5 text-sky-500 shrink-0" /> : <ChevronRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />}
                                                          </div>
                                                        </button>

                                                        {isSourceOpen && (
                                                          <div className="ml-1 sm:ml-2 pl-1.5 sm:pl-2 border-l border-sky-300 dark:border-sky-800 space-y-0.5 py-1 animate-fade-in">
                                                            <div className="text-[8px] font-bold uppercase text-slate-400 px-1 mb-0.5 flex items-center justify-between">
                                                              <span>Sessions disponibles :</span>
                                                              <span className="text-[7.5px] text-sky-600 dark:text-sky-400 font-semibold">{src.subSources.length} total</span>
                                                            </div>
                                                            {src.subSources.map(sub => (
                                                              <Link
                                                                key={sub}
                                                                href={`/qcm-session?specialty=${spec.id}&source=${encodeURIComponent(`${src.name} - ${sub}`)}${faculty !== 'TOUS' ? `&faculty=${faculty}` : ''}`}
                                                                onClick={handleLinkClick}
                                                                className="flex items-center justify-between gap-1 px-2 py-1 rounded-md text-[9.5px] font-semibold bg-white/70 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/50 transition-colors border border-slate-100 dark:border-white/5"
                                                                title={`Lancer QCM ${src.name} session ${sub}`}
                                                              >
                                                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                                  <Calendar className="w-2.5 h-2.5 text-sky-500 shrink-0" />
                                                                  <span className="truncate">{sub.startsWith('Session') ? sub : `Session ${sub}`}</span>
                                                                </div>
                                                                <span className="text-[8px] text-sky-500 font-bold shrink-0 whitespace-nowrap">Lancer →</span>
                                                              </Link>
                                                            ))}
                                                          </div>
                                                        )}
                                                      </div>
                                                    );
                                                  }

                                                  return (
                                                    <Link
                                                      key={src.name}
                                                      href={`/qcm-session?specialty=${spec.id}&source=${encodeURIComponent(src.name)}${faculty !== 'TOUS' ? `&faculty=${faculty}` : ''}`}
                                                      onClick={handleLinkClick}
                                                      className="w-full flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-indigo-50 hover:text-[#5D5FEF] dark:hover:bg-white/5 transition-all shadow-2xs"
                                                      title={`Lancer tous les QCMs de "${src.name}"`}
                                                    >
                                                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                        <PlayCircle className="w-3 h-3 text-indigo-500 shrink-0" />
                                                        <span className="truncate">{src.name}</span>
                                                      </div>
                                                      <span className="text-[8px] px-1 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold shrink-0 whitespace-nowrap">
                                                        Direct →
                                                      </span>
                                                    </Link>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {/* Par Cours Section */}
                                        <div className="space-y-1">
                                          <div className="px-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                                            <span>Par Cours ({specCourses.length}) :</span>
                                          </div>

                                          {specCourses.length === 0 ? (
                                            <div className="px-2 py-1 text-[10px] italic text-slate-400">
                                              Aucun cours disponible
                                            </div>
                                          ) : (
                                            specCourses.map(crs => {
                                              const courseSources = getCourseSources(spec.id, crs.id, crs.title);

                                              return (
                                                <div key={crs.id} className="p-1.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/5 space-y-1">
                                                  <Link
                                                    href={`/qcm-session?specialty=${spec.id}&course=${crs.id}${faculty !== 'TOUS' ? `&faculty=${faculty}` : ''}`}
                                                    onClick={handleLinkClick}
                                                    className="flex items-center justify-between gap-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:text-[#5D5FEF] transition-colors"
                                                    title={`QCM : ${crs.title}`}
                                                  >
                                                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                      <Target className="w-3 h-3 shrink-0 text-[#5D5FEF]" />
                                                      <span className="truncate">{crs.title}</span>
                                                    </div>
                                                    <span className="text-[8px] text-slate-400 hover:text-[#5D5FEF] shrink-0 font-bold whitespace-nowrap">
                                                      QCM →
                                                    </span>
                                                  </Link>

                                                  {/* Course-level Sources */}
                                                  {courseSources.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 pl-2 sm:pl-3 pt-0.5">
                                                      {courseSources.map(src => (
                                                        <Link
                                                          key={src}
                                                          href={`/qcm-session?specialty=${spec.id}&course=${crs.id}&source=${encodeURIComponent(src)}${faculty !== 'TOUS' ? `&faculty=${faculty}` : ''}`}
                                                          onClick={handleLinkClick}
                                                          className="max-w-full px-1.5 py-0.5 rounded text-[8.5px] font-medium bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-[#5D5FEF] dark:hover:bg-white/20 transition-colors flex items-center gap-1 min-w-0"
                                                          title={`QCM source "${src}" pour ${crs.title}`}
                                                        >
                                                          <span className="text-[8px] shrink-0">📌</span>
                                                          <span className="truncate">{src}</span>
                                                        </Link>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Modules Transversaux QCM (Sans année spécifique) */}
                {mounted && specialtiesList.some(s => !s.year) && (() => {
                  const isTransversalOpen = activeQcmYear === 'none';
                  const transversalSpecialties = specialtiesList.filter(s => {
                    const matchYear = !s.year;
                    const matchFac = faculty === 'TOUS' || !s.faculty || s.faculty === 'TOUS' || s.faculty === faculty;
                    return matchYear && matchFac;
                  });

                  return (
                    <div key="qcm_yr_none" className="space-y-0.5">
                      <button
                        onClick={() => setActiveQcmYear(isTransversalOpen ? null : 'none')}
                        className={`w-full flex items-center justify-between gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold text-left transition-all ${
                          isTransversalOpen
                            ? 'bg-brand-500/10 dark:bg-brand-500/20 text-[#5D5FEF] border border-brand-500/30'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span className="text-xs shrink-0">🌐</span>
                          <span className="truncate font-black">Modules Transversaux</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          <span suppressHydrationWarning className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 font-bold whitespace-nowrap">
                            {transversalSpecialties.length} spé
                          </span>
                          {isTransversalOpen ? <ChevronDown className="w-3 h-3 text-[#5D5FEF] shrink-0" /> : <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                        </div>
                      </button>

                      {isTransversalOpen && (
                        <div className="ml-1 sm:ml-2 pl-1.5 sm:pl-2 border-l border-brand-300 dark:border-brand-800 space-y-1 py-1 animate-fade-in">
                          {transversalSpecialties.map(spec => {
                            const isSpecOpen = activeQcmSpec === spec.id;
                            const specQcms = qcmsList.filter(q => q.specialtyId === spec.id);
                            const specCourses = coursesList.filter(c => c.specialtyId === spec.id);
                            const specCount = specQcms.length;

                            return (
                              <div key={`qcm_spec_${spec.id}`} className="space-y-0.5">
                                <button
                                  onClick={() => setActiveQcmSpec(isSpecOpen ? null : spec.id)}
                                  className={`w-full flex items-center justify-between gap-1 px-1.5 sm:px-2 py-1 rounded-md text-[11px] font-semibold text-left transition-all ${
                                    isSpecOpen
                                      ? 'bg-iris-100/70 dark:bg-iris-950 text-[#5D5FEF] font-bold'
                                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                    <span className="text-xs shrink-0">{getSpecialtyEmoji(spec.id)}</span>
                                    <span className="truncate">{spec.name}</span>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0 ml-1">
                                    <span className="text-[9px] text-slate-400 font-mono font-bold whitespace-nowrap">
                                      {specCount}
                                    </span>
                                    {isSpecOpen ? <ChevronDown className="w-2.5 h-2.5 text-[#5D5FEF] shrink-0" /> : <ChevronRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />}
                                  </div>
                                </button>

                                {isSpecOpen && (() => {
                                  const moduleStructuredSources = getStructuredModuleSources(spec.id);

                                  return (
                                    <div className="ml-1 sm:ml-2 pl-1.5 sm:pl-2 border-l border-slate-200 dark:border-white/10 space-y-2 py-1 animate-fade-in">
                                      {/* Totalité du Module Section */}
                                      <div className="space-y-1.5 p-1.5 sm:p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5">
                                        <Link
                                          href={`/qcm-session?specialty=${spec.id}${faculty !== 'TOUS' ? `&faculty=${faculty}` : ''}`}
                                          onClick={handleLinkClick}
                                          className="flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg text-[10.5px] sm:text-[11px] font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 shadow-xs transition-transform active:scale-[0.98]"
                                          title="Lancer la totalité du module (Toutes sources)"
                                        >
                                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                            <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate">Totalité du Module</span>
                                            <span className="hidden sm:inline text-[9px] opacity-85 font-normal shrink-0">(Toutes sources)</span>
                                          </div>
                                          <span className="text-[9.5px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono shrink-0 whitespace-nowrap font-bold">
                                            {specCount} QCM
                                          </span>
                                        </Link>

                                        {/* Module Sources Hierarchy (Année -> Module -> Source -> Sous-Source) */}
                                        {moduleStructuredSources.length > 0 && (
                                          <div className="pt-1 space-y-1">
                                            <div className="text-[9px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 px-1 flex items-center justify-between gap-1">
                                              <span className="truncate">📚 Sources ({moduleStructuredSources.length})</span>
                                              <span className="text-[7.5px] text-slate-400 lowercase font-normal shrink-0">sessions</span>
                                            </div>
                                            <div className="space-y-1">
                                              {moduleStructuredSources.map(src => {
                                                const hasSubs = Array.isArray(src.subSources) && src.subSources.length > 0;
                                                const sourceKey = `transversal_${spec.id}__${src.name}`;
                                                const isSourceOpen = expandedQcmSource === sourceKey;

                                                if (hasSubs) {
                                                  return (
                                                    <div key={src.name} className="space-y-0.5">
                                                      <button
                                                        type="button"
                                                        onClick={() => setExpandedQcmSource(isSourceOpen ? null : sourceKey)}
                                                        className={`w-full flex items-center justify-between gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold text-left transition-all ${
                                                          isSourceOpen
                                                            ? 'bg-sky-500/15 dark:bg-sky-500/25 text-sky-700 dark:text-sky-300 border border-sky-400/40 shadow-xs'
                                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-sky-50/60 dark:hover:bg-white/5'
                                                        }`}
                                                        title={src.name}
                                                      >
                                                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                          <Folder className={`w-3 h-3 shrink-0 ${isSourceOpen ? 'text-sky-500' : 'text-slate-400'}`} />
                                                          <span className="truncate">{src.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 shrink-0 ml-1">
                                                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono font-bold whitespace-nowrap">
                                                            {src.subSources.length} sess.
                                                          </span>
                                                          {isSourceOpen ? <ChevronDown className="w-2.5 h-2.5 text-sky-500 shrink-0" /> : <ChevronRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />}
                                                        </div>
                                                      </button>

                                                      {isSourceOpen && (
                                                        <div className="ml-1 sm:ml-2 pl-1.5 sm:pl-2 border-l border-sky-300 dark:border-sky-800 space-y-0.5 py-1 animate-fade-in">
                                                          <div className="text-[8px] font-bold uppercase text-slate-400 px-1 mb-0.5 flex items-center justify-between">
                                                            <span>Sessions disponibles :</span>
                                                            <span className="text-[7.5px] text-sky-600 dark:text-sky-400 font-semibold">{src.subSources.length} total</span>
                                                          </div>
                                                          {src.subSources.map(sub => (
                                                            <Link
                                                              key={sub}
                                                              href={`/qcm-session?specialty=${spec.id}&source=${encodeURIComponent(`${src.name} - ${sub}`)}${faculty !== 'TOUS' ? `&faculty=${faculty}` : ''}`}
                                                              onClick={handleLinkClick}
                                                              className="flex items-center justify-between gap-1 px-2 py-1 rounded-md text-[9.5px] font-semibold bg-white/70 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/50 transition-colors border border-slate-100 dark:border-white/5"
                                                              title={`Lancer QCM ${src.name} session ${sub}`}
                                                            >
                                                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                                <Calendar className="w-2.5 h-2.5 text-sky-500 shrink-0" />
                                                                <span className="truncate">{sub.startsWith('Session') ? sub : `Session ${sub}`}</span>
                                                              </div>
                                                              <span className="text-[8px] text-sky-500 font-bold shrink-0 whitespace-nowrap">Lancer →</span>
                                                            </Link>
                                                          ))}
                                                        </div>
                                                      )}
                                                    </div>
                                                  );
                                                }

                                                return (
                                                  <Link
                                                    key={src.name}
                                                    href={`/qcm-session?specialty=${spec.id}&source=${encodeURIComponent(src.name)}${faculty !== 'TOUS' ? `&faculty=${faculty}` : ''}`}
                                                    onClick={handleLinkClick}
                                                    className="w-full flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-indigo-50 hover:text-[#5D5FEF] dark:hover:bg-white/5 transition-all shadow-2xs"
                                                    title={`Lancer tous les QCMs de "${src.name}"`}
                                                  >
                                                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                      <PlayCircle className="w-3 h-3 text-indigo-500 shrink-0" />
                                                      <span className="truncate">{src.name}</span>
                                                    </div>
                                                    <span className="text-[8px] px-1 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold shrink-0 whitespace-nowrap">
                                                      Direct →
                                                    </span>
                                                  </Link>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Par Cours Section */}
                                      <div className="space-y-1">
                                        <div className="px-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                                          <span>Par Cours ({specCourses.length}) :</span>
                                        </div>

                                        {specCourses.length === 0 ? (
                                          <div className="px-2 py-1 text-[10px] italic text-slate-400">
                                            Aucun cours disponible
                                          </div>
                                        ) : (
                                          specCourses.map(crs => {
                                            const courseSources = getCourseSources(spec.id, crs.id, crs.title);

                                            return (
                                              <div key={crs.id} className="p-1.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/5 space-y-1">
                                                <Link
                                                  href={`/qcm-session?specialty=${spec.id}&course=${crs.id}${faculty !== 'TOUS' ? `&faculty=${faculty}` : ''}`}
                                                  onClick={handleLinkClick}
                                                  className="flex items-center justify-between gap-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:text-[#5D5FEF] transition-colors"
                                                  title={`QCM : ${crs.title}`}
                                                >
                                                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                    <Target className="w-3 h-3 shrink-0 text-[#5D5FEF]" />
                                                    <span className="truncate">{crs.title}</span>
                                                  </div>
                                                  <span className="text-[8px] text-slate-400 hover:text-[#5D5FEF] shrink-0 font-bold whitespace-nowrap">
                                                    QCM →
                                                  </span>
                                                </Link>

                                                {/* Course-level Sources */}
                                                {courseSources.length > 0 && (
                                                  <div className="flex flex-wrap gap-1 pl-2 sm:pl-3 pt-0.5">
                                                    {courseSources.map(src => (
                                                      <Link
                                                        key={src}
                                                        href={`/qcm-session?specialty=${spec.id}&course=${crs.id}&source=${encodeURIComponent(src)}${faculty !== 'TOUS' ? `&faculty=${faculty}` : ''}`}
                                                        onClick={handleLinkClick}
                                                        className="max-w-full px-1.5 py-0.5 rounded text-[8.5px] font-medium bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-[#5D5FEF] dark:hover:bg-white/20 transition-colors flex items-center gap-1 min-w-0"
                                                        title={`QCM source "${src}" pour ${crs.title}`}
                                                      >
                                                        <span className="text-[8px] shrink-0">📌</span>
                                                        <span className="truncate">{src}</span>
                                                      </Link>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })
                                        )}
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 3. FICHES FLASH (ACCORDION) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="space-y-1">
            <button
              onClick={() => handleToggleSection('fiches')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                fichesExpanded || mounted && pathname.startsWith('/fiches')
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate">Fiches Flash</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="badge badge-amber text-[10px] px-1.5 py-0">{fichesList.length} Fiches</span>
                {fichesExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </button>

            {fichesExpanded && (
              <div className="ml-2.5 pl-2.5 border-l-2 border-amber-300 dark:border-amber-800/60 space-y-1 py-1 animate-fade-in">
                <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center justify-between">
                  <span>Fiches par Spécialité</span>
                  <Link href="/fiches" onClick={handleLinkClick} className="text-amber-600 font-semibold hover:underline">
                    Hub Fiches →
                  </Link>
                </div>

                {specialtiesList
                  .filter(s => !deletedFichesSpecialtyIds.includes(s.id) && (faculty === 'TOUS' || !s.faculty || s.faculty === 'TOUS' || s.faculty === faculty))
                  .map(spec => {
                    const isFicheSpecOpen = activeFicheSpec === spec.id;
                    const specFiches = fichesList.filter(f => f.specialtyId === spec.id);

                    return (
                      <div key={spec.id} className="space-y-0.5">
                      <button
                        onClick={() => setActiveFicheSpec(isFicheSpecOpen ? null : spec.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-left transition-all ${
                          isFicheSpecOpen
                            ? 'bg-amber-100/70 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{getSpecialtyEmoji(spec.id)}</span>
                          <span className="truncate">{spec.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] font-semibold text-slate-400">{specFiches.length}</span>
                          {isFicheSpecOpen ? <ChevronDown className="w-3 h-3 text-amber-600" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                        </div>
                      </button>

                      {isFicheSpecOpen && (
                        <div className="ml-3 pl-2.5 border-l border-amber-200 dark:border-amber-900/40 space-y-0.5 py-1 animate-fade-in">
                          <Link
                            href={`/fiches?specialty=${spec.id}`}
                            onClick={handleLinkClick}
                            className="block px-2 py-1 rounded-md text-[10px] font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 truncate"
                          >
                            ⚡ Voir toutes les fiches de {spec.shortName} →
                          </Link>

                          {specFiches.length === 0 ? (
                            <div className="px-2 py-1 text-[10px] italic text-slate-400">
                              Fiches en cours de rédaction
                            </div>
                          ) : (
                            specFiches.map(fiche => (
                              <Link
                                key={fiche.id}
                                href={`/fiches?specialty=${spec.id}#${fiche.id}`}
                                onClick={handleLinkClick}
                                className="block px-2 py-1.5 rounded-md text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-white/8 transition-colors truncate"
                                title={fiche.title}
                              >
                                • {fiche.title}
                              </Link>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 4. CAT URGENCES (ACCORDION) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="space-y-1">
            <button
              onClick={() => handleToggleSection('cat')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                catExpanded || mounted && pathname.startsWith('/cat')
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Siren className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="truncate">CAT Urgences</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="badge badge-red text-[10px] px-1.5 py-0">{catsList.length} URG</span>
                {catExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </button>

            {catExpanded && (
              <div className="ml-2.5 pl-2.5 border-l-2 border-rose-300 dark:border-rose-800/60 space-y-1 py-1 animate-fade-in">
                <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center justify-between">
                  <span>Protocoles d'Urgence</span>
                  <Link href="/cat" onClick={handleLinkClick} className="text-rose-600 font-semibold hover:underline">
                    Hub CAT →
                  </Link>
                </div>

                {specialtiesList.filter(s => faculty === 'TOUS' || !s.faculty || s.faculty === 'TOUS' || s.faculty === faculty).map(spec => {
                  const isCatSpecOpen = activeCatSpec === spec.id;
                  const specCats = catsList.filter(c => c.specialtyId === spec.id);

                  return (
                    <div key={spec.id} className="space-y-0.5">
                      <button
                        onClick={() => setActiveCatSpec(isCatSpecOpen ? null : spec.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-left transition-all ${
                          isCatSpecOpen
                            ? 'bg-rose-100/70 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{getSpecialtyEmoji(spec.id)}</span>
                          <span className="truncate">{spec.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                            specCats.length > 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300' : 'text-slate-400'
                          }`}>
                            {specCats.length}
                          </span>
                          {isCatSpecOpen ? <ChevronDown className="w-3 h-3 text-rose-600" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                        </div>
                      </button>

                      {isCatSpecOpen && (
                        <div className="ml-3 pl-2.5 border-l border-rose-200 dark:border-rose-900/40 space-y-0.5 py-1 animate-fade-in">
                          <Link
                            href={`/cat?specialty=${spec.id}`}
                            onClick={handleLinkClick}
                            className="block px-2 py-1 rounded-md text-[10px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 truncate"
                          >
                            🚨 Tous les protocoles de {spec.shortName} ({specCats.length}) →
                          </Link>

                          {specCats.length === 0 ? (
                            <div className="px-2 py-1 text-[10px] italic text-slate-400">
                              Protocole en cours de rédaction
                            </div>
                          ) : (
                            specCats.map(cat => (
                              <Link
                                key={cat.id}
                                href={`/cat/${cat.slug}?fullscreen=true`}
                                onClick={handleLinkClick}
                                className="block px-2 py-1.5 rounded-md text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-white/8 transition-colors truncate"
                                title={cat.title}
                              >
                                • {cat.title}
                              </Link>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 5. CALCULATEURS CLINIQUE (ACCORDION) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="space-y-1">
            <button
              onClick={() => handleToggleSection('calc')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                calcExpanded || mounted && pathname.startsWith('/calculateurs')
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Calculator className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Calculateurs & Scores</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="badge badge-green text-[10px] px-1.5 py-0">{INITIAL_CALCULATORS.length}</span>
                {calcExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </button>

            {calcExpanded && (
              <div className="ml-2.5 pl-2.5 border-l-2 border-emerald-300 dark:border-emerald-800/60 space-y-1 py-1 animate-fade-in">
                <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <span>Scores par Spécialité</span>
                  <Link href="/calculateurs" onClick={handleLinkClick} className="text-emerald-600 font-semibold hover:underline">
                    Hub Calculateurs →
                  </Link>
                </div>

                {specialtiesList.filter(s => faculty === 'TOUS' || !s.faculty || s.faculty === 'TOUS' || s.faculty === faculty).map(spec => {
                  const isCalcSpecOpen = activeCalcSpec === spec.id;
                  const specCalcs = INITIAL_CALCULATORS.filter(c => c.specialtyId === spec.id);

                  return (
                    <div key={spec.id} className="space-y-0.5">
                      <button
                        onClick={() => setActiveCalcSpec(isCalcSpecOpen ? null : spec.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-left transition-all ${
                          isCalcSpecOpen
                            ? 'bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{getSpecialtyEmoji(spec.id)}</span>
                          <span className="truncate">{spec.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] font-semibold text-slate-400">{specCalcs.length}</span>
                          {isCalcSpecOpen ? <ChevronDown className="w-3 h-3 text-emerald-600" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                        </div>
                      </button>

                      {isCalcSpecOpen && (
                        <div className="ml-3 pl-2.5 border-l border-emerald-200 dark:border-emerald-900/40 space-y-0.5 py-1 animate-fade-in">
                          <Link
                            href={`/calculateurs?specialty=${spec.id}`}
                            onClick={handleLinkClick}
                            className="block px-2 py-1 rounded-md text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 truncate"
                          >
                            🧮 Scores et calculateurs de {spec.shortName} →
                          </Link>

                          {specCalcs.length === 0 ? (
                            <div className="px-2 py-1 text-[10px] italic text-slate-400">
                              Calculateurs disponibles sur le hub
                            </div>
                          ) : (
                            specCalcs.map(calc => (
                              <Link
                                key={calc.id}
                                href={`/calculateurs?specialty=${spec.id}&calc=${calc.id}`}
                                onClick={handleLinkClick}
                                className="block px-2 py-1.5 rounded-md text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-white/8 transition-colors truncate"
                                title={calc.title}
                              >
                                • {calc.title}
                              </Link>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 6. CAS CLINIQUES (ACCORDION) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="space-y-1">
            <button
              onClick={() => handleToggleSection('cases')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                casesExpanded || mounted && pathname.startsWith('/cas-cliniques')
                  ? 'bg-iris-50 dark:bg-iris-950/40 text-[#5D5FEF] border border-iris-200/70 dark:border-iris-800/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Stethoscope className="w-4 h-4 text-[#5D5FEF] shrink-0" />
                <span className="truncate">Cas Cliniques</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="badge badge-iris text-[10px] px-1.5 py-0">{INITIAL_CLINICAL_CASES.length}</span>
                {casesExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </button>

            {casesExpanded && (
              <div className="ml-2.5 pl-2.5 border-l-2 border-iris-300 dark:border-iris-800/60 space-y-1 py-1 animate-fade-in">
                <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Cas par Spécialité</span>
                  <Link href="/cas-cliniques" onClick={handleLinkClick} className="text-[#5D5FEF] font-semibold hover:underline">
                    Hub Cas →
                  </Link>
                </div>

                {specialtiesList.filter(s => faculty === 'TOUS' || !s.faculty || s.faculty === 'TOUS' || s.faculty === faculty).map(spec => {
                  const isCaseSpecOpen = activeCaseSpec === spec.id;
                  const specCases = INITIAL_CLINICAL_CASES.filter(c => c.specialtyId === spec.id);

                  return (
                    <div key={spec.id} className="space-y-0.5">
                      <button
                        onClick={() => setActiveCaseSpec(isCaseSpecOpen ? null : spec.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-left transition-all ${
                          isCaseSpecOpen
                            ? 'bg-iris-100/70 dark:bg-iris-950 text-[#5D5FEF]'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{getSpecialtyEmoji(spec.id)}</span>
                          <span className="truncate">{spec.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] font-semibold text-slate-400">{specCases.length}</span>
                          {isCaseSpecOpen ? <ChevronDown className="w-3 h-3 text-[#5D5FEF]" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                        </div>
                      </button>

                      {isCaseSpecOpen && (
                        <div className="ml-3 pl-2.5 border-l border-slate-200 dark:border-white/10 space-y-0.5 py-1 animate-fade-in">
                          <Link
                            href={`/cas-cliniques?specialty=${spec.id}`}
                            onClick={handleLinkClick}
                            className="block px-2 py-1 rounded-md text-[10px] font-bold text-[#5D5FEF] hover:bg-iris-50 dark:hover:bg-iris-950/30 truncate"
                          >
                            🩺 Tous les cas cliniques de {spec.shortName} →
                          </Link>

                          {specCases.length === 0 ? (
                            <div className="px-2 py-1 text-[10px] italic text-slate-400">
                              Cas clinique en cours de rédaction
                            </div>
                          ) : (
                            specCases.map(cs => (
                              <Link
                                key={cs.id}
                                href={`/cas-cliniques/${cs.id}`}
                                onClick={handleLinkClick}
                                className="block px-2 py-1.5 rounded-md text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-[#5D5FEF] transition-colors truncate"
                                title={cs.title}
                              >
                                • {cs.title}
                              </Link>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* 7. ORDONNANCES TYPES (ACCORDION) */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="space-y-1">
            <button
              onClick={() => handleToggleSection('ord')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                ordExpanded || mounted && pathname.startsWith('/ordonnances')
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200/80 dark:border-teal-900/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="truncate">Ordonnances Types</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="badge badge-slate text-[10px] px-1.5 py-0">{INITIAL_ORDONNANCES.length} RX</span>
                {ordExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </div>
            </button>

            {ordExpanded && (
              <div className="ml-2.5 pl-2.5 border-l-2 border-teal-300 dark:border-teal-800/60 space-y-1 py-1 animate-fade-in">
                <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center justify-between">
                  <span>Prescriptions par Spécialité</span>
                  <Link href="/ordonnances" onClick={handleLinkClick} className="text-teal-600 font-semibold hover:underline">
                    Hub Ordonnances →
                  </Link>
                </div>

                {specialtiesList.filter(s => faculty === 'TOUS' || !s.faculty || s.faculty === 'TOUS' || s.faculty === faculty).map(spec => {
                  const isOrdSpecOpen = activeOrdSpec === spec.id;
                  const specOrds = INITIAL_ORDONNANCES.filter(o => o.specialtyId === spec.id);

                  return (
                    <div key={spec.id} className="space-y-0.5">
                      <button
                        onClick={() => setActiveOrdSpec(isOrdSpecOpen ? null : spec.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-left transition-all ${
                          isOrdSpecOpen
                            ? 'bg-teal-100/70 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{getSpecialtyEmoji(spec.id)}</span>
                          <span className="truncate">{spec.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] font-semibold text-slate-400">{specOrds.length}</span>
                          {isOrdSpecOpen ? <ChevronDown className="w-3 h-3 text-teal-600" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                        </div>
                      </button>

                      {isOrdSpecOpen && (
                        <div className="ml-3 pl-2.5 border-l border-teal-200 dark:border-teal-900/40 space-y-0.5 py-1 animate-fade-in">
                          <Link
                            href={`/ordonnances?specialty=${spec.id}`}
                            onClick={handleLinkClick}
                            className="block px-2 py-1 rounded-md text-[10px] font-bold text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/30 truncate"
                          >
                            📋 Ordonnances types de {spec.shortName} →
                          </Link>

                          {specOrds.length === 0 ? (
                            <div className="px-2 py-1 text-[10px] italic text-slate-400">
                              Ordonnances disponibles sur le hub
                            </div>
                          ) : (
                            specOrds.map(ord => (
                              <Link
                                key={ord.id}
                                href={`/ordonnances?specialty=${spec.id}#${ord.id}`}
                                onClick={handleLinkClick}
                                className="block px-2 py-1.5 rounded-md text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-white/8 transition-colors truncate"
                                title={ord.title}
                              >
                                • {ord.title}
                              </Link>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="section-title pt-3">Outils Cliniques & Garde</div>

          {/* Flat Items */}
          {flatItems.map(item => {
            const Icon = item.icon;
            const isActive = mounted && pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <Icon className={`sidebar-icon w-4 h-4 shrink-0 ${isActive ? 'text-[#5D5FEF]' : ''}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-black ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer info card */}
        <div className="p-3 border-t border-slate-100 dark:border-white/8 bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-gradient-to-r from-iris-50 to-iris-100 dark:from-iris-950/40 dark:to-iris-900/30 border border-iris-200 dark:border-iris-800/40">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5D5FEF] to-[#4340C4] flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-800 dark:text-white truncate">AS MEDIX Pro</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Concours Résidanat 2027</div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // =========================================================================
  // 3. MAIN RETURN (DESKTOP EXPANDED + MOBILE DRAWER)
  // =========================================================================
  return (
    <>
      <aside className="hidden lg:flex w-72 flex-col fixed top-0 left-0 bottom-0 z-30 p-2.5 transition-all duration-300">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[70] flex animate-fade-in">
          <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <div
            className="relative w-[90vw] sm:w-80 max-w-[340px] h-full p-2 sm:p-2.5 z-10 flex flex-col"
            style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
          >
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
