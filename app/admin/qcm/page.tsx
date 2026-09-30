'use client';

import React, { useState, useEffect } from 'react';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { QCM, Course, Specialty, MEDICAL_YEARS, StructuredSource } from '@/types';
import {
  Brain, Plus, Trash2, CheckCircle2, Star, Sparkles, Filter, Code, Eye, EyeOff, School,
  FileText, Upload, FileCode, Check, Edit3, Layers, Loader2, ChevronDown, ChevronUp, AlertCircle,
  Link as LinkIcon, Globe, X, Key, ArrowUp, ArrowDown, ArrowUpDown, PlusCircle, FolderTree, ChevronRight,
  Copy, Sliders, CornerDownRight, Folder, Calendar, Settings
} from 'lucide-react';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import { ParsedQcmItem, parseQcmDocument, parseAnswerKey } from '@/lib/qcmParser';
import { parseSourceHierarchy } from '@/lib/sourceUtils';

export default function AdminQcmPage() {
  const [qcms, setQcms] = useState<QCM[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>(ALL_SPECIALTIES);
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('all');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  const [searchQueryFilter, setSearchQueryFilter] = useState<string>('');
  const [showAllAnswersGlobal, setShowAllAnswersGlobal] = useState<boolean>(false);
  const [visibleAnswersMap, setVisibleAnswersMap] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states (Manual mode)
  const [title, setTitle] = useState('');
  const [year, setYear] = useState<number | ''>(4);
  const [specialtyId, setSpecialtyId] = useState('cardio');
  const [courseId, setCourseId] = useState('');
  const [faculty, setFaculty] = useState<'ORAN' | 'SIDI_BEL_ABBES' | 'TOUS'>('ORAN');
  const [source, setSource] = useState('');
  const [parentSource, setParentSource] = useState('Externat');
  const [subSource, setSubSource] = useState('');
  const [sourceOther, setSourceOther] = useState('');
  const [isDailyQcm, setIsDailyQcm] = useState(false);
  const [vignette, setVignette] = useState('');
  const [question, setQuestion] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [optE, setOptE] = useState('');
  const [correctA, setCorrectA] = useState(false);
  const [correctB, setCorrectB] = useState(false);
  const [correctC, setCorrectC] = useState(false);
  const [correctD, setCorrectD] = useState(false);
  const [correctE, setCorrectE] = useState(false);
  const [explanationHtml, setExplanationHtml] = useState('<div class="space-y-2"><p><strong>Justification clinique :</strong></p><p>Le diagnostic repose sur...</p></div>');
  const [reference, setReference] = useState("Faculté de Médecine d'Alger");
  const [activeTab, setActiveTab] = useState<'html' | 'preview'>('html');
  const [successMsg, setSuccessMsg] = useState('');

  // Per-scope sources & hierarchy
  const [scopeSources, setScopeSources] = useState<string[]>([]);
  const [structuredSources, setStructuredSources] = useState<StructuredSource[]>([]);
  const [newSourceInput, setNewSourceInput] = useState('');
  const [addingSource, setAddingSource] = useState(false);
  const [newCustomSourceName, setNewCustomSourceName] = useState('');
  const [newCustomSubSourceName, setNewCustomSubSourceName] = useState<Record<string, string>>({});
  const [sourceActionLoading, setSourceActionLoading] = useState(false);
  const [managingSourcesOpen, setManagingSourcesOpen] = useState(false);
  const [sourceSuccessMsg, setSourceSuccessMsg] = useState('');

  // Batch QCM Import States
  const [qcmInputMode, setQcmInputMode] = useState<'MANUAL' | 'BATCH_IMPORT'>('MANUAL');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);
  const [pastedQcmText, setPastedQcmText] = useState('');
  const [pastedAnswerKeyText, setPastedAnswerKeyText] = useState('');
  const [parsingPdf, setParsingPdf] = useState(false);
  const [parsedQcms, setParsedQcms] = useState<ParsedQcmItem[]>([]);
  const [editingQcmId, setEditingQcmId] = useState<string | null>(null);
  const [batchSaving, setBatchSaving] = useState(false);

  // AI QCM Extractor Modal States
  const [aiQcmModalOpen, setAiQcmModalOpen] = useState(false);
  const [aiProvider, setAiProvider] = useState<'google_ai_studio' | 'openrouter' | 'codecraft' | 'openai' | 'anthropic' | 'deepseek'>('google_ai_studio');
  const [googleAiKey, setGoogleAiKey] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [directApiKey, setDirectApiKey] = useState('');
  const [selectedAiModel, setSelectedAiModel] = useState('models/gemini-2.5-flash');
  const [aiInputType, setAiInputType] = useState<'drive_pdf' | 'raw_text'>('drive_pdf');
  const [aiPdfUrl, setAiPdfUrl] = useState('');
  const [aiRawInput, setAiRawInput] = useState('');
  const [examTitleInput, setExamTitleInput] = useState('');
  const [aiExtracting, setAiExtracting] = useState(false);

  // Standalone Answer Key Drawer state for parsed QCMs
  const [quickAnswerKeyText, setQuickAnswerKeyText] = useState('');
  const [showQuickAnswerKey, setShowQuickAnswerKey] = useState(false);
  const [showSourceSidebar, setShowSourceSidebar] = useState(false);
  const [swapInputs, setSwapInputs] = useState<Record<string, string>>({});
  const [reconcilingCourses, setReconcilingCourses] = useState(false);
  const [selectedQcmIds, setSelectedQcmIds] = useState<string[]>([]);
  const [batchAttachModalOpen, setBatchAttachModalOpen] = useState(false);
  const [targetBatchCourseId, setTargetBatchCourseId] = useState('');
  const [targetBatchSpecId, setTargetBatchSpecId] = useState('all');
  const [batchCourseSearchQuery, setBatchCourseSearchQuery] = useState('');
  const [batchAttaching, setBatchAttaching] = useState(false);

  // Helper to compute combined parent + sub-source name (e.g. "Externat - 2021")
  const getEffectiveSource = (): string => {
    if (parentSource && subSource.trim()) {
      return `${parentSource.trim()} - ${subSource.trim()}`;
    }
    if (source === '__other__') {
      return sourceOther.trim() || 'Annales Examens';
    }
    return source.trim() || parentSource.trim() || 'Externat';
  };

  // Auto-save a source name to current scope in database
  const ensureSourceInScope = async (sourceName: string) => {
    if (!sourceName || scopeSources.includes(sourceName)) return;
    try {
      await fetch('/api/admin/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sourceName,
          specialty: specialtyId,
          course: courseId || undefined,
          faculty: faculty !== 'TOUS' ? faculty : undefined,
        })
      });
      setScopeSources(prev => Array.from(new Set([sourceName, ...prev])));
    } catch (_err) {}
  };

  // Add a new Source to current module
  const handleAddModuleSource = async (sourceName: string) => {
    const clean = sourceName.trim();
    if (!clean) return;
    setSourceActionLoading(true);
    try {
      const res = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clean,
          specialty: specialtyId,
          course: courseId || undefined,
          faculty: faculty !== 'TOUS' ? faculty : undefined,
        })
      });
      const data = await res.json();
      if (data.structuredSources) {
        setStructuredSources(data.structuredSources);
        setScopeSources(data.sources || data.structuredSources.map((s: any) => s.name));
        setParentSource(clean);
        setNewCustomSourceName('');
        setSourceSuccessMsg(`✅ Source "${clean}" enregistrée directement dans Supabase SQL`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('asmedix-content-updated'));
        }
        setTimeout(() => setSourceSuccessMsg(''), 4000);
      }
    } catch (_err) {
      alert('Erreur lors de l\'ajout de la source');
    } finally {
      setSourceActionLoading(false);
    }
  };

  // Delete a Source from current module
  const handleDeleteModuleSource = async (sourceName: string) => {
    if (!confirm(`Supprimer la source "${sourceName}" et toutes ses sous-sources pour ce module ?`)) return;
    setSourceActionLoading(true);
    try {
      const res = await fetch('/api/admin/sources', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sourceName,
          specialty: specialtyId,
          course: courseId || undefined,
          faculty: faculty !== 'TOUS' ? faculty : undefined,
        })
      });
      const data = await res.json();
      if (data.structuredSources) {
        setStructuredSources(data.structuredSources);
        setScopeSources(data.sources || data.structuredSources.map((s: any) => s.name));
        if (parentSource === sourceName) {
          setParentSource(data.structuredSources[0]?.name || '');
        }
        setSourceSuccessMsg(`🗑️ Source "${sourceName}" supprimée de Supabase SQL`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('asmedix-content-updated'));
        }
        setTimeout(() => setSourceSuccessMsg(''), 4000);
      }
    } catch (_err) {
      alert('Erreur lors de la suppression de la source');
    } finally {
      setSourceActionLoading(false);
    }
  };

  // Add a Sub-Source to a parent Source
  const handleAddSubSource = async (parentName: string, subSourceName: string) => {
    const cleanSub = subSourceName.trim();
    if (!cleanSub) return;
    setSourceActionLoading(true);
    try {
      const res = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: parentName,
          subSource: cleanSub,
          specialty: specialtyId,
          course: courseId || undefined,
          faculty: faculty !== 'TOUS' ? faculty : undefined,
        })
      });
      const data = await res.json();
      if (data.structuredSources) {
        setStructuredSources(data.structuredSources);
        setScopeSources(data.sources || data.structuredSources.map((s: any) => s.name));
        setSubSource(cleanSub);
        setNewCustomSubSourceName(prev => ({ ...prev, [parentName]: '' }));
        setSourceSuccessMsg(`✅ Sous-source "${cleanSub}" ajoutée à "${parentName}" et sauvegardée dans Supabase SQL`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('asmedix-content-updated'));
        }
        setTimeout(() => setSourceSuccessMsg(''), 4000);
      }
    } catch (_err) {
      alert('Erreur lors de l\'ajout de la sous-source');
    } finally {
      setSourceActionLoading(false);
    }
  };

  // Delete a Sub-Source from a parent Source
  const handleDeleteSubSource = async (parentName: string, subSourceName: string) => {
    if (!confirm(`Supprimer la sous-source "${subSourceName}" de "${parentName}" ?`)) return;
    setSourceActionLoading(true);
    try {
      const res = await fetch('/api/admin/sources', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: parentName,
          subSource: subSourceName,
          specialty: specialtyId,
          course: courseId || undefined,
          faculty: faculty !== 'TOUS' ? faculty : undefined,
        })
      });
      const data = await res.json();
      if (data.structuredSources) {
        setStructuredSources(data.structuredSources);
        setScopeSources(data.sources || data.structuredSources.map((s: any) => s.name));
        if (subSource === subSourceName) {
          setSubSource('');
        }
        setSourceSuccessMsg(`🗑️ Sous-source "${subSourceName}" supprimée de Supabase SQL`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('asmedix-content-updated'));
        }
        setTimeout(() => setSourceSuccessMsg(''), 4000);
      }
    } catch (_err) {
      alert('Erreur lors de la suppression de la sous-source');
    } finally {
      setSourceActionLoading(false);
    }
  };

  // Fetch scoped sources whenever specialty, course or faculty changes
  const fetchScopeSources = async (spec: string, crs: string, fac?: string) => {
    try {
      const params = new URLSearchParams();
      if (spec) params.set('specialty', spec);
      if (crs) params.set('course', crs);
      if (fac && fac !== 'TOUS') params.set('faculty', fac);
      const res = await fetch(`/api/admin/sources?${params}`);
      const data = await res.json();
      if (data.structuredSources && Array.isArray(data.structuredSources)) {
        setStructuredSources(data.structuredSources);
        const names = data.structuredSources.map((s: StructuredSource) => s.name);
        setScopeSources(names);
        if (names.length > 0 && !names.includes(parentSource)) {
          setParentSource(names[0]);
        }
      } else if (data.sources) {
        setScopeSources(data.sources);
      }
    } catch (_err) {}
  };

  useEffect(() => {
    fetchData();
    fetchScopeSources(specialtyId, courseId, faculty);
    try {
      const gKey = localStorage.getItem('asmedix_google_ai_key') || '';
      const oKey = localStorage.getItem('asmedix_openrouter_key') || '';
      const dKey = localStorage.getItem('asmedix_direct_api_key') || '';
      if (gKey) setGoogleAiKey(gKey);
      if (oKey) setOpenRouterKey(oKey);
      if (dKey) setDirectApiKey(dKey);
    } catch (_e) {}
  }, []); // eslint-disable-line

  useEffect(() => {
    fetchScopeSources(specialtyId, courseId, faculty);
  }, [specialtyId, courseId, faculty]); // eslint-disable-line

  // Live auto-synchronize parsed QCM review cards when top target parameters change
  useEffect(() => {
    if (parsedQcms.length > 0) {
      const effSource = getEffectiveSource();
      setParsedQcms(prev => prev.map(q => ({
        ...q,
        specialtyId: specialtyId || q.specialtyId,
        faculty: faculty || q.faculty || 'ORAN',
        year: year !== '' ? Number(year) : q.year,
        courseId: courseId || (q.courseId ? q.courseId : undefined),
        source: effSource || q.source,
        parentSource: parentSource || q.parentSource,
        subSource: subSource || q.subSource
      })));
    }
  }, [specialtyId, year, faculty, courseId, parentSource, subSource, source, sourceOther]); // eslint-disable-line

  const handleRunAiQcmExtract = async () => {
    if (aiInputType === 'drive_pdf' && !aiPdfUrl.trim()) {
      alert('Veuillez entrer un lien Google Drive ou PDF d\'examen.');
      return;
    }
    if (aiInputType === 'raw_text' && !aiRawInput.trim()) {
      alert('Veuillez coller le texte de l\'examen d\'abord.');
      return;
    }

    const apiKey = aiProvider === 'google_ai_studio'
      ? googleAiKey
      : (aiProvider === 'openrouter' ? openRouterKey : directApiKey);

    try {
      if (aiProvider === 'google_ai_studio' && googleAiKey) localStorage.setItem('asmedix_google_ai_key', googleAiKey);
      if (aiProvider === 'openrouter' && openRouterKey) localStorage.setItem('asmedix_openrouter_key', openRouterKey);
      if (directApiKey) localStorage.setItem('asmedix_direct_api_key', directApiKey);
    } catch (_e) {}

    setAiExtracting(true);
    setSuccessMsg('');

    try {
      const finalSource = getEffectiveSource();
      await ensureSourceInScope(finalSource);

      const availableCoursesForAi = courses
        .filter(c => !specialtyId || c.specialtyId === specialtyId)
        .map(c => ({ id: c.id, title: c.title, slug: c.slug, specialtyId: c.specialtyId }));

      const res = await fetch('/api/admin/ai/extract-qcms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: aiProvider,
          apiKey: apiKey || undefined,
          model: selectedAiModel,
          pdfUrl: aiInputType === 'drive_pdf' ? aiPdfUrl.trim() : undefined,
          content: aiInputType === 'raw_text' ? aiRawInput.trim() : undefined,
          specialty: specialtyId,
          year: year !== '' ? Number(year) : undefined,
          source: finalSource || examTitleInput || 'Examen IA',
          availableCourses: availableCoursesForAi
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l\'extraction des QCMs par l\'IA.');
      }

      if (data.qcms && Array.isArray(data.qcms) && data.qcms.length > 0) {
        const parsedItems: ParsedQcmItem[] = data.qcms.map((q: any) => ({
          id: q.id || `qcm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          tempNum: q.qNum || 1,
          title: q.title || `QCM ${q.qNum || 1}`,
          vignetteText: q.vignette || '',
          question: q.question || '',
          options: (q.options || []).map((opt: any, optIdx: number) => ({
            letter: opt.letter || String.fromCharCode(65 + optIdx),
            text: opt.text || '',
            isCorrect: q.correctAnswers?.includes(optIdx) ?? false
          })),
          explanationHtml: q.explanation || '',
          isVerified: true,
          source: finalSource || (q.source && q.source !== 'hyperqcm' ? q.source : undefined),
          specialtyId: specialtyId,
          courseId: courseId || q.courseId || undefined,
          courseTitle: q.courseTitle || undefined,
          year: year !== '' ? Number(year) : undefined,
          faculty: faculty || 'ORAN',
          parentSource: parentSource || undefined,
          subSource: subSource || undefined
        }));

        setParsedQcms(parsedItems);
        setShowAddForm(true);
        setQcmInputMode('BATCH_IMPORT');
        setAiQcmModalOpen(false);
        setSuccessMsg(`🤖 Extraction IA Réussie ! ${parsedItems.length} QCM(s) extraits de "${data.examTitle}". Vous pouvez réviser ci-dessous et cliquer sur "Importer Tout".`);
      } else {
        alert('L\'IA n\'a extrait aucun QCM du document fourni. Vérifiez le contenu.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erreur lors de la communication avec l\'IA.');
    } finally {
      setAiExtracting(false);
    }
  };

  const handleAddScopeSource = async () => {
    const name = newSourceInput.trim();
    if (!name) return;
    setAddingSource(true);
    const body: Record<string, string> = { name };
    if (specialtyId) body.specialty = specialtyId;
    if (courseId) body.course = courseId;
    if (faculty && faculty !== 'TOUS') body.faculty = faculty;
    const res = await fetch('/api/admin/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) {
      setScopeSources(data.sources);
      setSource(name);
      setNewSourceInput('');
    }
    setAddingSource(false);
  };

  const fetchData = async () => {
    try {
      const [qcmRes, crsRes, specRes] = await Promise.all([
        fetch('/api/admin/qcm').then(r => r.json()),
        fetch('/api/admin/courses').then(r => r.json()),
        fetch('/api/specialties').then(r => r.json()).catch(() => ({ specialties: [] }))
      ]);
      if (qcmRes.qcms) setQcms(qcmRes.qcms);
      if (crsRes.courses) setCourses(crsRes.courses);
      if (specRes.specialties && specRes.specialties.length > 0) {
        setSpecialtiesList(specRes.specialties);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reconcile and auto-link all orphaned QCMs to available courses
  const handleAutoLinkCourses = async () => {
    setReconcilingCourses(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/admin/qcm/auto-link', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`⚡ Rattachement automatique terminé ! ${data.totalLinked} QCM(s) rattachés à leurs cours existants.`);
        await fetchData();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('asmedix-content-updated'));
        }
      } else {
        alert(data.error || 'Erreur lors du rattachement');
      }
    } catch (err: any) {
      alert(err.message || 'Erreur réseau');
    } finally {
      setReconcilingCourses(false);
    }
  };

  const handleToggleSelectQcm = (id: string) => {
    setSelectedQcmIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllFiltered = () => {
    if (selectedQcmIds.length === filteredQcms.length && filteredQcms.length > 0) {
      setSelectedQcmIds([]);
    } else {
      setSelectedQcmIds(filteredQcms.map(q => q.id));
    }
  };

  const handleBatchAttachToCourse = async () => {
    if (selectedQcmIds.length === 0 || !targetBatchCourseId) {
      alert('Veuillez sélectionner au moins un QCM et un cours de destination.');
      return;
    }

    const targetCourse = courses.find(c => c.id === targetBatchCourseId);
    if (!targetCourse) {
      alert('Cours introuvable.');
      return;
    }

    setBatchAttaching(true);
    try {
      const res = await fetch('/api/admin/qcm', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'batch_update_course',
          qcmIds: selectedQcmIds,
          courseId: targetCourse.id,
          courseTitle: targetCourse.title,
          specialtyId: targetCourse.specialtyId,
          specialtyName: targetCourse.specialtyName
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`🎯 ${selectedQcmIds.length} QCM(s) rattachés avec succès au cours "${targetCourse.title}" !`);
        setSelectedQcmIds([]);
        setBatchAttachModalOpen(false);
        await fetchData();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('asmedix-content-updated'));
        }
      } else {
        alert(data.error || 'Erreur lors du rattachement');
      }
    } catch (err: any) {
      alert(err.message || 'Erreur réseau');
    } finally {
      setBatchAttaching(false);
    }
  };

  const handleBatchDeleteSelectedQcms = async () => {
    if (selectedQcmIds.length === 0) return;
    if (!confirm(`Voulez-vous vraiment supprimer les ${selectedQcmIds.length} QCM(s) sélectionnés ?`)) return;

    try {
      for (const id of selectedQcmIds) {
        await fetch(`/api/admin/qcm?id=${id}`, { method: 'DELETE' });
      }
      setSuccessMsg(`🗑️ ${selectedQcmIds.length} QCM(s) supprimés avec succès de Supabase.`);
      setSelectedQcmIds([]);
      await fetchData();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('asmedix-content-updated'));
      }
    } catch (err: any) {
      alert('Erreur lors de la suppression groupée.');
    }
  };

  // Create single manual QCM
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !question) {
      alert('Veuillez renseigner au moins le titre et la question.');
      return;
    }

    const options = [
      optA ? { id: 'opt_1', letter: 'A', text: optA } : null,
      optB ? { id: 'opt_2', letter: 'B', text: optB } : null,
      optC ? { id: 'opt_3', letter: 'C', text: optC } : null,
      optD ? { id: 'opt_4', letter: 'D', text: optD } : null,
      optE ? { id: 'opt_5', letter: 'E', text: optE } : null,
    ].filter(Boolean);

    const correctAnswers: number[] = [];
    if (correctA) correctAnswers.push(0);
    if (correctB) correctAnswers.push(1);
    if (correctC) correctAnswers.push(2);
    if (correctD) correctAnswers.push(3);
    if (correctE) correctAnswers.push(4);

    if (correctAnswers.length === 0) {
      alert('Veuillez cocher au moins une réponse exacte.');
      return;
    }

    const spec = specialtiesList.find(s => s.id === specialtyId) || ALL_SPECIALTIES.find(s => s.id === specialtyId);
    const crs = courses.find(c => c.id === courseId);
    const finalSource = getEffectiveSource();
    await ensureSourceInScope(finalSource);

    const newQcmPayload = {
      title,
      year: year !== '' ? Number(year) : undefined,
      specialtyId,
      specialtyName: spec ? spec.name : 'Cardiologie',
      courseId: courseId || undefined,
      courseTitle: crs ? crs.title : undefined,
      faculty: faculty || 'ORAN',
      source: finalSource || 'Annales Examens',
      parentSource: parentSource || undefined,
      subSource: subSource || undefined,
      rang: 'Rang A',
      difficulty: 'Moyen',
      type: correctAnswers.length > 1 ? 'MULTIPLE' : 'SINGLE',
      vignette: vignette || '',
      question,
      options,
      correctAnswers,
      explanation: explanationHtml,
      reference,
      isDailyQcm,
    };

    const res = await fetch('/api/admin/qcm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQcmPayload)
    });

    const data = await res.json();
    if (data.success && data.qcm) {
      setQcms([data.qcm, ...qcms]);
      setSuccessMsg(`✅ QCM "${data.qcm.title}" ajouté et synchronisé avec Supabase !`);
      setTitle('');
      setQuestion('');
      setOptA(''); setOptB(''); setOptC(''); setOptD(''); setOptE('');
      setCorrectA(false); setCorrectB(false); setCorrectC(false); setCorrectD(false); setCorrectE(false);
      setShowAddForm(false);
    } else {
      alert(data.error || 'Erreur lors de la création');
    }
  };

  // Delete QCM
  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce QCM ?')) return;
    const res = await fetch(`/api/admin/qcm?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setQcms(qcms.filter(q => q.id !== id));
      setSuccessMsg('QCM supprimé avec succès.');
    }
  };

  // Trigger parsing of PDF or text files
  const handleParsePdfOrText = async () => {
    setParsingPdf(true);
    setSuccessMsg('');

    try {
      if (pdfFile || answerKeyFile) {
        const createSafeBlob = async (f: File, defaultExt = 'pdf') => {
          const buffer = await f.arrayBuffer();
          const type = f.type || (defaultExt === 'pdf' ? 'application/pdf' : 'text/plain');
          const safeName = (f.name || `file.${defaultExt}`)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9_.-]/g, "_");
          return { blob: new Blob([buffer], { type }), filename: safeName };
        };

        const formData = new FormData();
        if (pdfFile) {
          const { blob, filename } = await createSafeBlob(pdfFile, 'pdf');
          formData.append('pdfFile', blob, filename);
        }
        if (answerKeyFile) {
          const { blob, filename } = await createSafeBlob(answerKeyFile, 'txt');
          formData.append('answerKeyFile', blob, filename);
        }
        if (pastedAnswerKeyText) formData.append('answerKeyText', pastedAnswerKeyText);

        const res = await fetch('/api/admin/qcm/parse-pdf', {
          method: 'POST',
          body: formData,
        });

        const rawText = await res.text();
        let data: any = {};
        try {
          data = JSON.parse(rawText);
        } catch (jsonErr) {
          throw new Error('Le serveur a renvoyé une réponse HTML au lieu de JSON (ex: Fichier PDF trop volumineux pour le serveur Vercel ou erreur 500). Utilisez le script Python local `qcm_extractor.py` pour traiter les gros fichiers PDF.');
        }

        if (!res.ok || data.error) {
          throw new Error(data.error || `Erreur serveur (${res.status}) lors de l'analyse du fichier`);
        }

        const finalSource = getEffectiveSource();
        if (data.qcms && Array.isArray(data.qcms) && data.qcms.length > 0) {
          const enriched = data.qcms.map((q: any) => ({
            ...q,
            specialtyId: specialtyId,
            courseId: courseId || q.courseId || undefined,
            year: year !== '' ? Number(year) : q.year,
            faculty: faculty || 'ORAN',
            source: finalSource || (q.source && q.source !== 'hyperqcm' ? q.source : undefined),
            parentSource: parentSource || undefined,
            subSource: subSource || undefined
          }));
          setParsedQcms(enriched);
          setSuccessMsg(`🎉 ${enriched.length} QCM(s) extraits avec succès ! Previsualisez et modifiez-les ci-dessous avant validation.`);
        } else {
          alert('Aucun QCM n\'a pu être extrait. Assurez-vous que le fichier contient des numéros de QCM (ex: QCM 1, 1., Q1).');
        }
      } else if (pastedQcmText.trim()) {
        const qcms = parseQcmDocument(pastedQcmText, pastedAnswerKeyText);
        if (qcms.length > 0) {
          const finalSource = getEffectiveSource();
          const enriched = qcms.map(q => ({
            ...q,
            specialtyId: specialtyId,
            courseId: courseId || q.courseId || undefined,
            year: year !== '' ? Number(year) : q.year,
            faculty: faculty || 'ORAN',
            source: finalSource || (q.source && q.source !== 'hyperqcm' ? q.source : undefined),
            parentSource: parentSource || undefined,
            subSource: subSource || undefined
          }));
          setParsedQcms(enriched);
          setSuccessMsg(`🎉 ${enriched.length} QCM(s) extraits du texte collé !`);
        } else {
          alert('Aucun QCM détecté dans le texte. Utilisez des structures comme "QCM 1 : ... A. ... B. ...".');
        }
      } else {
        alert('Veuillez sélectionner un fichier PDF/Texte ou coller le texte d\'un examen.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Erreur lors du traitement du fichier.');
    } finally {
      setParsingPdf(false);
    }
  };

  // Single QCM import from batch review
  const handleImportSingleParsedQcm = async (qcmItem: ParsedQcmItem) => {
    const itemSpecId = qcmItem.specialtyId || specialtyId;
    const spec = specialtiesList.find(s => s.id === itemSpecId) || ALL_SPECIALTIES.find(s => s.id === itemSpecId);
    
    const itemCourseId = qcmItem.courseId || courseId;
    const crs = courses.find(c => c.id === itemCourseId);
    const itemCourseTitle = crs ? crs.title : (qcmItem.courseTitle || undefined);

    const finalGlobalSource = getEffectiveSource();
    const itemSource = qcmItem.source || finalGlobalSource || 'Annales Examens';
    const itemYear = qcmItem.year !== undefined ? qcmItem.year : (year !== '' ? Number(year) : undefined);

    const correctAnswers = qcmItem.options
      .map((opt, idx) => opt.isCorrect ? idx : -1)
      .filter(idx => idx !== -1);

    const parsedH = parseSourceHierarchy(itemSource);
    const itemParentSource = qcmItem.parentSource || parentSource || parsedH.parent;
    const itemSubSource = qcmItem.subSource || subSource || parsedH.sub || undefined;

    const payload = {
      title: qcmItem.question.length > 80 ? qcmItem.question.substring(0, 80) + '...' : qcmItem.question,
      year: itemYear,
      specialtyId: itemSpecId,
      specialtyName: spec ? spec.name : 'Cardiologie',
      courseId: itemCourseId || undefined,
      courseTitle: itemCourseTitle,
      faculty: faculty || 'ORAN',
      source: itemSource,
      parentSource: itemParentSource || undefined,
      subSource: itemSubSource || undefined,
      rang: 'Rang A',
      difficulty: 'Moyen',
      type: correctAnswers.length > 1 ? 'MULTIPLE' : 'SINGLE',
      vignette: qcmItem.vignetteText || '',
      question: qcmItem.question,
      options: qcmItem.options.map((opt, idx) => ({
        id: `opt_${idx + 1}`,
        letter: opt.letter,
        text: opt.text
      })),
      correctAnswers: correctAnswers.length > 0 ? correctAnswers : [0],
      explanation: qcmItem.explanationHtml || '<p>Explication clinique conforme.</p>',
      reference: reference || "Faculté de Médecine d'Alger",
    };

    // Auto-save new custom source to DB if it's not already in scopeSources
    await ensureSourceInScope(itemSource);

    const res = await fetch('/api/admin/qcm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success && data.qcm) {
      setQcms(prev => [data.qcm, ...prev]);
      setParsedQcms(prev => prev.filter(q => q.id !== qcmItem.id));
      setSuccessMsg(`✅ QCM #${qcmItem.tempNum} importé avec succès dans la Banque de QCM !`);
    } else {
      alert(data.error || 'Erreur lors de l\'importation du QCM.');
    }
  };

  // Batch import all parsed QCMs (Single atomic batch request)
  const handleImportAllParsedQcms = async () => {
    if (parsedQcms.length === 0) return;
    setBatchSaving(true);
    setSuccessMsg('');

    try {
      const finalGlobalSource = getEffectiveSource();
      await ensureSourceInScope(finalGlobalSource);

      const qcmsToImport = parsedQcms.map(qcmItem => {
        const itemSpecId = qcmItem.specialtyId || specialtyId;
        const spec = specialtiesList.find(s => s.id === itemSpecId) || ALL_SPECIALTIES.find(s => s.id === itemSpecId);
        const itemCourseId = qcmItem.courseId || courseId;
        const crs = courses.find(c => c.id === itemCourseId);
        const itemCourseTitle = crs ? crs.title : (qcmItem.courseTitle || undefined);
        const itemSource = qcmItem.source || finalGlobalSource || 'Annales Examens';
        const itemYear = qcmItem.year !== undefined ? qcmItem.year : (year !== '' ? Number(year) : undefined);

        const correctAnswers = qcmItem.options
          .map((opt, idx) => opt.isCorrect ? idx : -1)
          .filter(idx => idx !== -1);

        const parsedBatchH = parseSourceHierarchy(itemSource);
        const itemParentSource = qcmItem.parentSource || parentSource || parsedBatchH.parent;
        const itemSubSource = qcmItem.subSource || subSource || parsedBatchH.sub || undefined;

        return {
          id: qcmItem.id || `qcm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          title: qcmItem.question.length > 80 ? qcmItem.question.substring(0, 80) + '...' : qcmItem.question,
          year: itemYear,
          specialtyId: itemSpecId,
          specialtyName: spec ? spec.name : 'Cardiologie',
          courseId: itemCourseId || undefined,
          courseTitle: itemCourseTitle,
          faculty: faculty || 'ORAN',
          source: itemSource,
          parentSource: itemParentSource || undefined,
          subSource: itemSubSource || undefined,
          rang: 'Rang A',
          difficulty: 'Moyen',
          type: correctAnswers.length > 1 ? 'MULTIPLE' : 'SINGLE',
          vignette: qcmItem.vignetteText || '',
          question: qcmItem.question,
          options: qcmItem.options.map((opt, idx) => ({
            id: `opt_${idx + 1}`,
            letter: opt.letter,
            text: opt.text
          })),
          correctAnswers: correctAnswers.length > 0 ? correctAnswers : [0],
          explanation: qcmItem.explanationHtml || '<p>Explication clinique conforme.</p>',
          reference: reference || "Faculté de Médecine d'Alger",
        };
      });

      const res = await fetch('/api/admin/qcm/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qcms: qcmsToImport })
      });

      const data = await res.json();
      if (data.success) {
        setQcms(prev => [...(data.qcms || qcmsToImport), ...prev]);
        setParsedQcms([]);
        setSuccessMsg(`🚀 ${qcmsToImport.length} QCM(s) extraits par l'IA importés avec succès et enregistrés définitivement dans Supabase !`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('asmedix-content-updated'));
        }
        await fetchData();
      } else {
        alert(data.error || 'Erreur lors de l\'importation en lot.');
      }
    } catch (err: any) {
      alert(err.message || 'Erreur réseau lors de l\'importation.');
    } finally {
      setBatchSaving(false);
    }
  };

  // Modify option inside parsed QCM
  const updateParsedQcmOptionText = (qcmId: string, optIdx: number, text: string) => {
    setParsedQcms(prev => prev.map(q => {
      if (q.id === qcmId) {
        const nextOpts = [...q.options];
        nextOpts[optIdx] = { ...nextOpts[optIdx], text };
        return { ...q, options: nextOpts };
      }
      return q;
    }));
  };

  const toggleParsedQcmCorrect = (qcmId: string, optIdx: number) => {
    setParsedQcms(prev => prev.map(q => {
      if (q.id === qcmId) {
        const nextOpts = [...q.options];
        nextOpts[optIdx] = { ...nextOpts[optIdx], isCorrect: !nextOpts[optIdx].isCorrect };
        return { ...q, options: nextOpts };
      }
      return q;
    }));
  };

  // Move parsed QCM up or down
  const moveParsedQcm = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= parsedQcms.length) return;
    const updated = [...parsedQcms];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    const renumbered = updated.map((q, idx) => ({ ...q, tempNum: idx + 1 }));
    setParsedQcms(renumbered);
  };

  // Swap position of QCM from index `fromIndex` to `targetNum`
  const swapParsedQcmNumber = (fromIndex: number, newTargetNum: number) => {
    const targetIndex = newTargetNum - 1;
    if (targetIndex < 0 || targetIndex >= parsedQcms.length || targetIndex === fromIndex) return;
    const updated = [...parsedQcms];
    const temp = updated[fromIndex];
    updated[fromIndex] = updated[targetIndex];
    updated[targetIndex] = temp;
    const renumbered = updated.map((q, idx) => ({ ...q, tempNum: idx + 1 }));
    setParsedQcms(renumbered);
  };

  // Insert a new blank QCM item at specific index
  const insertParsedQcmAt = (index: number) => {
    const newQcm: ParsedQcmItem = {
      id: `custom_qcm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tempNum: index + 1,
      title: `Question ${index + 1}`,
      vignetteText: '',
      question: 'Nouvelle question insérée...',
      options: [
        { letter: 'A', text: 'Proposition A', isCorrect: true },
        { letter: 'B', text: 'Proposition B', isCorrect: false },
        { letter: 'C', text: 'Proposition C', isCorrect: false },
        { letter: 'D', text: 'Proposition D', isCorrect: false },
        { letter: 'E', text: 'Proposition E', isCorrect: false },
      ],
      explanationHtml: '<p>Explication clinique conforme.</p>',
      isVerified: true,
      source: source || 'Annales Examens',
      specialtyId: specialtyId,
      courseId: courseId || undefined,
      year: year !== '' ? Number(year) : undefined,
    };

    const updated = [...parsedQcms];
    updated.splice(index, 0, newQcm);
    const renumbered = updated.map((q, idx) => ({ ...q, tempNum: idx + 1 }));
    setParsedQcms(renumbered);
    setEditingQcmId(newQcm.id);
  };

  // Delete QCM item from parsed array
  const removeParsedQcmAt = (index: number) => {
    const updated = parsedQcms.filter((_, idx) => idx !== index);
    const renumbered = updated.map((q, idx) => ({ ...q, tempNum: idx + 1 }));
    setParsedQcms(renumbered);
  };

  // Add option to parsed QCM
  const addOptionToParsedQcm = (qcmId: string) => {
    setParsedQcms(prev => prev.map(q => {
      if (q.id === qcmId) {
        const nextLetter = String.fromCharCode(65 + q.options.length);
        return {
          ...q,
          options: [...q.options, { letter: nextLetter, text: `Proposition ${nextLetter}`, isCorrect: false }]
        };
      }
      return q;
    }));
  };

  // Remove option from parsed QCM
  const removeOptionFromParsedQcm = (qcmId: string, optIdx: number) => {
    setParsedQcms(prev => prev.map(q => {
      if (q.id === qcmId) {
        const nextOpts = q.options.filter((_, idx) => idx !== optIdx)
          .map((opt, idx) => ({ ...opt, letter: String.fromCharCode(65 + idx) }));
        return { ...q, options: nextOpts };
      }
      return q;
    }));
  };

  // Apply Answer Key Text / File to Parsed QCMs
  const handleApplyAnswerKeyText = (keyText: string) => {
    if (!keyText.trim()) return;
    const answerMap = parseAnswerKey(keyText);
    if (answerMap.size === 0) {
      alert('Aucune réponse valide n\'a été détectée dans le texte (ex format: "1. A, C\\n2. B").');
      return;
    }

    setParsedQcms(prev => prev.map(q => {
      const letters = answerMap.get(q.tempNum);
      if (letters && letters.length > 0) {
        const updatedOpts = q.options.map(opt => ({
          ...opt,
          isCorrect: letters.includes(opt.letter.toUpperCase())
        }));
        return { ...q, options: updatedOpts, isVerified: true };
      }
      return q;
    }));

    setSuccessMsg(`🔑 Corrigé appliqué avec succès à ${answerMap.size} QCM(s) !`);
  };

  // Group sources into parent and standalone sub-sources (e.g. Externat -> Externat - 2021, Externat - 2022)
  const sourceTree = React.useMemo(() => {
    const map = new Map<string, { total: number; subSources: Array<{ name: string; count: number }> }>();

    const allSourceNames = Array.from(new Set([
      ...scopeSources,
      ...qcms.map(q => q.source?.trim()).filter(Boolean) as string[]
    ]));

    for (const src of allSourceNames) {
      let parent = src;
      if (src.includes(' - ')) {
        parent = src.split(' - ')[0].trim();
      } else if (src.includes('/')) {
        parent = src.split('/')[0].trim();
      }

      if (!map.has(parent)) {
        map.set(parent, { total: 0, subSources: [] });
      }

      const parentGroup = map.get(parent)!;
      const count = qcms.filter(q => q.source?.trim().toLowerCase() === src.toLowerCase()).length;
      if (!parentGroup.subSources.some(s => s.name === src)) {
        parentGroup.subSources.push({ name: src, count });
      }
    }

    Array.from(map.values()).forEach(group => {
      group.total = group.subSources.reduce((sum: number, item: { name: string; count: number }) => sum + item.count, 0);
    });

    return map;
  }, [qcms, scopeSources]);

  const filteredCourses = courses.filter(c => c.specialtyId === specialtyId);
  const filteredCoursesForFilter = selectedSpecialtyFilter !== 'all'
    ? courses.filter(c => c.specialtyId === selectedSpecialtyFilter)
    : courses;

  const availableSources = Array.from(new Set([
    ...scopeSources,
    ...qcms.map(q => q.source?.trim()).filter(Boolean) as string[]
  ]));

  const filteredQcms = qcms.filter(q => {
    // 1. Determine effective year (from q.year or specialty.year)
    const specObj = specialtiesList.find(s => s.id === q.specialtyId);
    const effectiveYear = (q.year !== undefined && q.year !== null && (q.year as any) !== '')
      ? Number(q.year)
      : specObj?.year;

    let matchYear = true;
    if (selectedYearFilter !== 'all') {
      if (selectedYearFilter === 'none') {
        matchYear = !effectiveYear;
      } else {
        matchYear = Number(effectiveYear) === Number(selectedYearFilter);
      }
    }

    // 2. Specialty / Module matching
    const matchSpec = selectedSpecialtyFilter === 'all' || q.specialtyId === selectedSpecialtyFilter;

    // 3. Course matching
    const matchCourse = selectedCourseFilter === 'all' || q.courseId === selectedCourseFilter;

    // 4. Source / Sous-source matching (Handles standalone sub-sources e.g. "Externat - 2021")
    let matchSource = true;
    if (selectedSourceFilter !== 'all') {
      const filterLower = selectedSourceFilter.trim().toLowerCase();
      const qSourceLower = (q.source || '').trim().toLowerCase();
      if (selectedSourceFilter.includes(' - ')) {
        // Exact sub-source match e.g. "Externat - 2021"
        matchSource = qSourceLower === filterLower;
      } else {
        // Parent source match e.g. "Externat"
        matchSource = qSourceLower === filterLower || qSourceLower.startsWith(filterLower + ' - ');
      }
    }

    // 5. Search query matching
    const query = searchQueryFilter.trim().toLowerCase();
    const matchQuery = !query
      || (q.question && q.question.toLowerCase().includes(query))
      || (q.title && q.title.toLowerCase().includes(query))
      || (q.source && q.source.toLowerCase().includes(query))
      || (q.courseTitle && q.courseTitle.toLowerCase().includes(query));

    return matchYear && matchSpec && matchCourse && matchSource && matchQuery;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-950 dark:text-white">
              Banque QCM & Importer des Épreuves
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-500/10 text-brand-600 border border-brand-500/20">
              PDF & Annexe Scanner
            </span>
          </div>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Ajoutez des QCMs manuellement ou importez-les directement par PDF avec grille de réponses numérotées.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleAutoLinkCourses}
            disabled={reconcilingCourses}
            title="Analyser et rattacher automatiquement tous les QCMs orphelins aux cours existants"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {reconcilingCourses ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Layers className="w-3.5 h-3.5" />
            )}
            <span>⚡ Rattacher QCMs aux Cours</span>
          </button>

          <button
            onClick={() => setAiQcmModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-soft transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>🤖 Extraction IA (PDF / Drive)</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Fermer le Panneau' : 'Ajouter / Importer des QCMs'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs font-bold shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Creation & Import Container */}
      {showAddForm && (
        <div className="apple-card p-6 sm:p-8 space-y-6">
          {/* Input Mode Selector Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-navy-100 dark:border-navy-800 flex-wrap gap-3">
            <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-brand-600" />
              <span>Mode de Saisie & d'Importation QCM</span>
            </h2>

            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-navy-100 dark:bg-navy-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setQcmInputMode('MANUAL')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                  qcmInputMode === 'MANUAL'
                    ? 'bg-white dark:bg-navy-900 text-brand-600 shadow-sm'
                    : 'text-navy-500 hover:text-navy-900 dark:hover:text-white'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>✏️ Création Manuelle HTML (1 par 1)</span>
              </button>

              <button
                type="button"
                onClick={() => setQcmInputMode('BATCH_IMPORT')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                  qcmInputMode === 'BATCH_IMPORT'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-navy-500 hover:text-navy-900 dark:hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>⚡ Importer Fichier PDF / Annexe Corrigé</span>
              </button>
            </div>
          </div>

          {/* Scope selection for both modes (Faculté, Source, Année, Spécialité, Cours) */}
          <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-navy-900/50 border border-slate-200 dark:border-navy-800">
            <div className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-wider flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-2">
                <span>🎯 Attributs Cibles des QCMs Imprimés</span>
                <span className="text-[10px] text-brand-600 font-bold bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                  {courseId ? 'Rattaché au Cours' : 'Rattaché au Module'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setManagingSourcesOpen(!managingSourcesOpen)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{managingSourcesOpen ? '✕ Fermer Gestionnaire' : '⚙️ Gérer Sources & Sous-Sources du Module'}</span>
              </button>
            </div>

            {/* COLLAPSIBLE SOURCES & SUB-SOURCES MANAGER */}
            {managingSourcesOpen && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-navy-950 border border-indigo-200 dark:border-indigo-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-wide">
                      Gestionnaire des Sources & Sous-Sources — {specialtiesList.find(s => s.id === specialtyId)?.name || specialtyId}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setManagingSourcesOpen(false)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-bold"
                  >
                    ✕ Fermer
                  </button>
                </div>

                {sourceSuccessMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-in fade-in flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{sourceSuccessMsg}</span>
                  </div>
                )}

                {/* Form to add a new Source to this module */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nom de la nouvelle source (ex: SIAU, Hypercours, Annales Résidanat...)"
                    value={newCustomSourceName}
                    onChange={e => setNewCustomSourceName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddModuleSource(newCustomSourceName);
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-navy-900 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddModuleSource(newCustomSourceName)}
                    disabled={!newCustomSourceName.trim() || sourceActionLoading}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    {sourceActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>+ Ajouter Source</span>
                  </button>
                </div>

                {/* List of current structured sources */}
                <div className="space-y-2.5">
                  {structuredSources.length === 0 ? (
                    <p className="text-xs text-navy-400 italic">Aucune source enregistrée pour ce module. Ajoutez-en une ci-dessus.</p>
                  ) : (
                    structuredSources.map(s => {
                      const hasSubs = s.subSources && s.subSources.length > 0;
                      return (
                        <div key={s.name} className="p-3 rounded-xl bg-white dark:bg-navy-900 border border-indigo-100 dark:border-navy-800 shadow-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-navy-900 dark:text-white">📁 {s.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                hasSubs
                                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
                              }`}>
                                {hasSubs ? `🗂️ ${s.subSources.length} session(s)` : '⚡ Lancement direct (sans sous-source)'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteModuleSource(s.name)}
                              disabled={sourceActionLoading}
                              className="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 p-1.5 rounded-lg transition-all"
                              title="Supprimer cette source"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Sub-sources pills */}
                          <div className="pl-4 border-l-2 border-indigo-100 dark:border-indigo-900/50 space-y-2">
                            {hasSubs ? (
                              <div className="flex flex-wrap items-center gap-1.5">
                                {s.subSources.map(sub => (
                                  <span
                                    key={sub}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-navy-800 text-navy-800 dark:text-navy-200 border border-slate-200 dark:border-navy-700"
                                  >
                                    <span>📅 {sub}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSubSource(s.name, sub)}
                                      disabled={sourceActionLoading}
                                      className="hover:text-rose-500 ml-0.5 text-navy-400 font-black text-xs"
                                      title={`Supprimer la sous-source ${sub}`}
                                    >
                                      ✕
                                    </button>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-navy-400">
                                Cette source ne contient aucune sous-source. L'étudiant y accède directement d'un clic dans la barre latérale.
                              </p>
                            )}

                            {/* Quick Add Sub-Source / Session (Options fermées 2018-2023) */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[10px] font-bold text-navy-400">Ajout rapide de session :</span>
                              {['2018', '2019', '2020', '2021', '2022', '2023'].map(yr => {
                                const alreadyExists = s.subSources.includes(yr);
                                if (alreadyExists) return null;
                                return (
                                  <button
                                    key={yr}
                                    type="button"
                                    onClick={() => handleAddSubSource(s.name, yr)}
                                    disabled={sourceActionLoading}
                                    className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-navy-800 dark:text-indigo-300 border border-indigo-200 transition-all"
                                  >
                                    + {yr}
                                  </button>
                                );
                              })}
                              <div className="flex items-center gap-1 ml-auto">
                                <input
                                  type="text"
                                  placeholder="Autre session..."
                                  value={newCustomSubSourceName[s.name] || ''}
                                  onChange={e => setNewCustomSubSourceName({ ...newCustomSubSourceName, [s.name]: e.target.value })}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const val = newCustomSubSourceName[s.name];
                                      if (val?.trim()) handleAddSubSource(s.name, val.trim());
                                    }
                                  }}
                                  className="px-2 py-0.5 text-[11px] rounded border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 w-28"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const val = newCustomSubSourceName[s.name];
                                    if (val?.trim()) handleAddSubSource(s.name, val.trim());
                                  }}
                                  disabled={!newCustomSubSourceName[s.name]?.trim() || sourceActionLoading}
                                  className="px-2 py-0.5 text-[11px] font-bold rounded bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  1. Faculté :
                </label>
                <select
                  value={faculty}
                  onChange={e => setFaculty(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-amber-50 dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white"
                >
                  <option value="ORAN">🏛️ Uniquement Faculté d'Oran (Oran 1 - Chalabi)</option>
                  <option value="SIDI_BEL_ABBES">🏛️ Uniquement Faculté de Sidi Bel Abbès (SBA)</option>
                  <option value="TOUS">🌐 Tronc Commun / Visible Partout (Oran & SBA)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  2. Année d'Études :
                </label>
                <select
                  value={year}
                  onChange={e => {
                    const val = e.target.value;
                    const yr = val ? Number(val) : '';
                    setYear(yr);
                    const filtered = yr ? specialtiesList.filter(s => s.year === yr) : specialtiesList;
                    if (filtered.length > 0 && !filtered.some(s => s.id === specialtyId)) {
                      setSpecialtyId(filtered[0].id);
                      setCourseId('');
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl border border-brand-500/40 bg-brand-50/50 dark:bg-brand-950/20 text-xs font-black text-navy-900 dark:text-white"
                >
                  <option value="">🌐 Transversal / Toutes années</option>
                  {MEDICAL_YEARS.map(y => (
                    <option key={y.year} value={y.year}>🎓 {y.name} ({y.cycle})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  3. Module / Spécialité :
                </label>
                <select
                  value={specialtyId}
                  onChange={e => {
                    setSpecialtyId(e.target.value);
                    setCourseId('');
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold"
                >
                  {specialtiesList
                    .filter(s => !year || s.year === year || !s.year)
                    .map(s => (
                      <option key={s.id} value={s.id}>{getSpecialtyEmoji(s.id)} {s.name}</option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  4. Cours spécifique (Optionnel) :
                </label>
                <select
                  value={courseId}
                  onChange={e => setCourseId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold"
                >
                  <option value="">📚 Aucun (Appliquer à la totalité du module)</option>
                  {filteredCourses.map(c => (
                    <option key={c.id} value={c.id}>📖 {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300">
                    5. Source Parente & Sous-Source (Session d'Examen) :
                  </label>
                  <button
                    type="button"
                    onClick={() => setManagingSourcesOpen(!managingSourcesOpen)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 flex items-center gap-1 underline"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Gérer les sources du module</span>
                  </button>
                </div>

                {(() => {
                  const currentStructured = structuredSources.find(s => s.name === parentSource);
                  const currentSubSources = currentStructured
                    ? currentStructured.subSources
                    : (parentSource === 'Externat' ? ['2018', '2019', '2020', '2021', '2022', '2023'] : []);
                  const hasSubSources = currentSubSources.length > 0;

                  return (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Parent Source Dropdown */}
                        <div>
                          <span className="text-[10px] font-bold text-navy-400">A. Source Parente :</span>
                          <select
                            value={parentSource}
                            onChange={e => {
                              const p = e.target.value;
                              setParentSource(p);
                              const targetSourceObj = structuredSources.find(s => s.name === p);
                              if (targetSourceObj && targetSourceObj.subSources.length > 0) {
                                const nextSub = targetSourceObj.subSources.includes(subSource) ? subSource : targetSourceObj.subSources[0];
                                setSubSource(nextSub);
                                setSource(`${p} - ${nextSub}`);
                                if (!isNaN(Number(nextSub))) setYear(Number(nextSub));
                              } else {
                                setSubSource('');
                                setSource(p);
                              }
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white"
                          >
                            {structuredSources.length > 0 ? (
                              structuredSources.map(s => (
                                <option key={s.name} value={s.name}>
                                  {s.subSources.length > 0 ? '📁 ' : '⚡ '} {s.name} {s.subSources.length === 0 ? '(Directe)' : `(${s.subSources.length} sessions)`}
                                </option>
                              ))
                            ) : (
                              <>
                                <option value="Externat">📁 Externat (Sessions 2018-2023)</option>
                                <option value="SIAU">⚡ SIAU (Directe)</option>
                                <option value="Annales Résidanat">📁 Annales Résidanat</option>
                                <option value="QCM CNP">⚡ QCM CNP (Directe)</option>
                                <option value="Hypercours">⚡ Hypercours (Directe)</option>
                                {scopeSources.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </>
                            )}
                          </select>
                        </div>

                        {/* Sub-Source Closed Options OR Direct Source Badge */}
                        <div>
                          {hasSubSources ? (
                            <>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-navy-400">B. Sous-Source / Session (Options Fermées) :</span>
                                <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                                  🔒 Choix Fixe Uniquement
                                </span>
                              </div>

                              {/* Closed Select Dropdown - Cannot type anything */}
                              <select
                                value={subSource}
                                onChange={e => {
                                  const sub = e.target.value;
                                  setSubSource(sub);
                                  const full = parentSource && sub ? `${parentSource} - ${sub}` : parentSource;
                                  setSource(full);
                                  if (sub && !isNaN(Number(sub))) {
                                    setYear(Number(sub));
                                  }
                                }}
                                className="w-full px-3 py-2 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-navy-900 text-xs font-bold text-navy-900 dark:text-white cursor-pointer shadow-xs"
                              >
                                <option value="">-- Sélectionner une année fermée --</option>
                                {currentSubSources.map(yr => (
                                  <option key={yr} value={yr}>📅 Session {yr}</option>
                                ))}
                              </select>

                              {/* Closed 1-Click Interactive Badges */}
                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                {currentSubSources.map(yr => {
                                  const isSelected = subSource === yr;
                                  return (
                                    <button
                                      key={yr}
                                      type="button"
                                      onClick={() => {
                                        setSubSource(yr);
                                        const full = parentSource && yr ? `${parentSource} - ${yr}` : parentSource;
                                        setSource(full);
                                        if (!isNaN(Number(yr))) setYear(Number(yr));
                                      }}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        isSelected
                                          ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400 scale-105 font-black'
                                          : 'bg-white dark:bg-navy-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-navy-800'
                                      }`}
                                    >
                                      {isSelected ? `✓ ${yr}` : yr}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <div className="h-full flex flex-col justify-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                              <div className="flex items-center gap-1.5 text-xs font-bold">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>⚡ Source Directe</span>
                              </div>
                              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                                Aucun choix de sous-source requis pour "{parentSource}". L'étudiant accède directement à tous ses QCMs d'un seul clic.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-50/60 dark:bg-navy-950 border border-indigo-200 dark:border-indigo-800">
                        <div className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 min-w-0 truncate">
                          📌 Source Attribuée : <span className="underline font-black">{source || parentSource || 'Non définie'}</span>
                        </div>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                          {hasSubSources
                            ? (subSource ? `✓ Sous-Source : ${subSource}` : '⚠️ Veuillez sélectionner une session')
                            : '✓ Lancement Direct Sans Sous-Source'}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* MODE 2: BATCH PDF / TEXT IMPORT SYSTEM */}
          {qcmInputMode === 'BATCH_IMPORT' && (
            <div className="space-y-6 pt-2">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-brand-900/10 border border-purple-500/30 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs font-bold text-navy-950 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Besoin d'extraire automatiquement un PDF depuis Google Drive ou du Texte ?</span>
                  </p>
                  <p className="text-[11px] text-navy-500">
                    Utilisez l'Intelligence Artificielle (Google AI Studio, DeepSeek, OpenRouter) pour structurer 100% des QCMs & propositions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAiQcmModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Brain className="w-4 h-4" />
                  <span>🚀 Lancer l'Extractor IA</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Scanner de Fichiers PDF & Annexe de Réponses Numérotées</span>
                </p>
                <p>
                  Sélectionnez votre fichier d'examen PDF (ou texte) ainsi que le fichier annexe des corrigés numérotés (`1. A, C | 2. B...`). Le scanner extrait et prévisualise QCM par QCM avant enregistrement !
                </p>
              </div>

              {/* Upload Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PDF QCM Upload */}
                <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border-2 border-dashed border-brand-300 dark:border-brand-700 text-center space-y-3 hover:border-brand-500 transition-all">
                  <div className="w-10 h-10 mx-auto rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-900 dark:text-white">
                      1. Fichier principal des QCMs (PDF / `.txt`)
                    </p>
                    <p className="text-[10px] text-navy-400">Glissez-déposez le PDF de l'épreuve d'examen</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={e => setPdfFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-navy-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                  />
                  {pdfFile && (
                    <p className="text-[11px] font-bold text-emerald-600">📄 Chargé : {pdfFile.name}</p>
                  )}
                </div>

                {/* Answer Key Upload */}
                <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border-2 border-dashed border-amber-300 dark:border-amber-700 text-center space-y-3 hover:border-amber-500 transition-all">
                  <div className="w-10 h-10 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-900 dark:text-white">
                      2. Fichier Annexe des Réponses Numérotées (PDF / `.txt`)
                    </p>
                    <p className="text-[10px] text-navy-400">Contient les numéros et propositions exactes (ex: 1. A, C)</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={e => setAnswerKeyFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-navy-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                  {answerKeyFile && (
                    <p className="text-[11px] font-bold text-emerald-600">🔑 Chargé : {answerKeyFile.name}</p>
                  )}
                </div>
              </div>

              {/* Alternative Paste Text Areas */}
              <details className="text-xs bg-navy-50/60 dark:bg-navy-950 p-4 rounded-2xl border border-navy-200 dark:border-navy-800">
                <summary className="font-bold text-navy-900 dark:text-white cursor-pointer hover:underline flex items-center gap-2">
                  <Code className="w-4 h-4 text-brand-600" />
                  <span>Ou Coller directement le Texte des QCMs & Corrigés</span>
                </summary>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1">
                      Texte brut des QCMs :
                    </label>
                    <textarea
                      value={pastedQcmText}
                      onChange={e => setPastedQcmText(e.target.value)}
                      rows={6}
                      placeholder="QCM 1 : Concernant le syndrome coronaire...\nA. L'angioplastie est de 1ère intention\nB. L'ECG est normal"
                      className="w-full p-3 font-mono text-xs rounded-xl border border-navy-200 dark:border-navy-800 bg-white dark:bg-navy-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-navy-700 dark:text-navy-300 mb-1">
                      Grille de Réponses Numérotées :
                    </label>
                    <textarea
                      value={pastedAnswerKeyText}
                      onChange={e => setPastedAnswerKeyText(e.target.value)}
                      rows={6}
                      placeholder="1. A, C\n2. B\n3. A, D, E\n4. C"
                      className="w-full p-3 font-mono text-xs rounded-xl border border-navy-200 dark:border-navy-800 bg-white dark:bg-navy-900"
                    />
                  </div>
                </div>
              </details>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleParsePdfOrText}
                  disabled={parsingPdf}
                  className="px-6 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {parsingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Analyse et Extraction en Cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>⚡ Scanner et Extraire les QCMs</span>
                    </>
                  )}
                </button>
              </div>

              {/* Parsed QCMs Preview & Manipulation List */}
              {parsedQcms.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-navy-100 dark:border-navy-800">
                  <div className="flex items-center justify-between flex-wrap gap-3 pb-2">
                    <div>
                      <h3 className="text-base font-black text-navy-950 dark:text-white flex items-center gap-2">
                        <span>📋 QCMs Extraits Prêts à Valider ({parsedQcms.length})</span>
                      </h3>
                      <p className="text-xs text-navy-500">
                        Vérifiez, réordonnez, permutez ou modifiez les questions et propositions avant l'importation finale.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => insertParsedQcmAt(0)}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-navy-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all flex items-center gap-1 border border-indigo-200 dark:border-indigo-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Insérer QCM au début</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleImportAllParsedQcms}
                        disabled={batchSaving}
                        className="px-5 py-2.5 rounded-2xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {batchSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Enregistrement du Lot...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>🚀 Importer Tous les {parsedQcms.length} QCMs Validés</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Answer Key Drawer / Text & File Applicator */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="font-bold text-amber-900 dark:text-amber-200">
                          🔑 Appliquer ou Remplacer la Grille de Réponses Exactes en Masse (Texte / Fichier)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowQuickAnswerKey(!showQuickAnswerKey)}
                        className="text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
                      >
                        <span>{showQuickAnswerKey ? 'Fermer le Panneau Corrigés' : '⚡ Ouvrir le Panneau Corrigés Texte'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showQuickAnswerKey ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {showQuickAnswerKey && (
                      <div className="space-y-3 pt-1">
                        <p className="text-[11px] text-amber-800 dark:text-amber-300">
                          Collez ici le texte des réponses numérotées (ex: <code>1. A, C&#10;2. B&#10;3. A, D, E</code>). Les cases à cocher de chaque QCM seront mises à jour automatiquement !
                        </p>
                        <textarea
                          value={quickAnswerKeyText}
                          onChange={e => setQuickAnswerKeyText(e.target.value)}
                          rows={3}
                          placeholder="Collez la grille des corrigés ici... (ex: 1. A, C\n2. B\n3. D)"
                          className="w-full p-3 font-mono text-xs rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleApplyAnswerKeyText(quickAnswerKeyText)}
                            className="px-4 py-2 rounded-xl text-xs font-black bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Appliquer la Grille à tous les QCMs</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* List of Parsed QCM Cards with Manipulation & Insertion Controls */}
                  <div className="space-y-4">
                    {parsedQcms.map((qcmItem, qIdx) => {
                      const isEditing = editingQcmId === qcmItem.id;
                      const currentSwapInput = swapInputs[qcmItem.id] || '';

                      return (
                        <React.Fragment key={qcmItem.id}>
                          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-sm space-y-4 relative group">
                            {/* Card Header & Reordering Toolbar */}
                            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-navy-100 dark:border-navy-800">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-3 py-1 rounded-xl text-xs font-black bg-brand-600 text-white shadow-xs flex items-center gap-1">
                                  <span>QCM #{qcmItem.tempNum}</span>
                                  <span className="text-[10px] opacity-75">/ {parsedQcms.length}</span>
                                </span>

                                {/* Move Up / Down Buttons */}
                                <div className="flex items-center gap-1 p-0.5 rounded-xl bg-navy-100 dark:bg-navy-800">
                                  <button
                                    type="button"
                                    onClick={() => moveParsedQcm(qIdx, qIdx - 1)}
                                    disabled={qIdx === 0}
                                    title="Monter ce QCM"
                                    className="p-1 rounded-lg text-navy-600 dark:text-navy-300 hover:bg-white dark:hover:bg-navy-700 disabled:opacity-30 transition-all"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveParsedQcm(qIdx, qIdx + 1)}
                                    disabled={qIdx === parsedQcms.length - 1}
                                    title="Descendre ce QCM"
                                    className="p-1 rounded-lg text-navy-600 dark:text-navy-300 hover:bg-white dark:hover:bg-navy-700 disabled:opacity-30 transition-all"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Position Swap Input Box */}
                                <div className="flex items-center gap-1.5 text-xs bg-navy-50 dark:bg-navy-950 px-2.5 py-1 rounded-xl border border-navy-200 dark:border-navy-800">
                                  <ArrowUpDown className="w-3 h-3 text-indigo-600" />
                                  <span className="text-[10px] font-bold text-navy-500">Permuter :</span>
                                  <input
                                    type="number"
                                    min={1}
                                    max={parsedQcms.length}
                                    value={currentSwapInput}
                                    onChange={e => setSwapInputs(prev => ({ ...prev, [qcmItem.id]: e.target.value }))}
                                    placeholder={`#${qcmItem.tempNum}`}
                                    className="w-12 px-1.5 py-0.5 text-xs font-bold text-center rounded border border-navy-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const targetNum = parseInt(currentSwapInput, 10);
                                      if (targetNum > 0 && targetNum <= parsedQcms.length) {
                                        swapParsedQcmNumber(qIdx, targetNum);
                                        setSwapInputs(prev => ({ ...prev, [qcmItem.id]: '' }));
                                      }
                                    }}
                                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                                  >
                                    OK
                                  </button>
                                </div>

                                {/* Quick Swipe to Top / Bottom */}
                                <div className="flex items-center gap-1 text-[10px] text-navy-400">
                                  <button
                                    type="button"
                                    onClick={() => moveParsedQcm(qIdx, 0)}
                                    title="Placer tout au début (1er QCM)"
                                    className="px-2 py-0.5 rounded bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 text-navy-700 dark:text-navy-300 font-bold"
                                  >
                                    🔝 Début
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveParsedQcm(qIdx, parsedQcms.length - 1)}
                                    title="Placer tout à la fin (Dernier QCM)"
                                    className="px-2 py-0.5 rounded bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 text-navy-700 dark:text-navy-300 font-bold"
                                  >
                                    🔚 Fin
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingQcmId(isEditing ? null : qcmItem.id)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 hover:bg-navy-200 transition-all flex items-center gap-1"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>{isEditing ? 'Fermer Édition' : '✏️ Editer Question & Propositions'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => removeParsedQcmAt(qIdx)}
                                  className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                  title="Supprimer ce QCM du lot"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleImportSingleParsedQcm(qcmItem)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1 shadow-xs"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Importer Seul</span>
                                </button>
                              </div>
                            </div>

                            {/* Per-QCM Source, Course & Year Attribute Bar */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-navy-950 border border-indigo-200 dark:border-indigo-800 text-xs">
                              <div>
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300">📌 Source pour ce QCM :</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setParsedQcms(prev => prev.map(q => q.id === qcmItem.id ? { ...q, source: qcmItem.source === '__custom__' ? '' : '__custom__' } : q));
                                    }}
                                    className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                  >
                                    {qcmItem.source === '__custom__' ? '← Sélectionner' : '+ Saisir Autre'}
                                  </button>
                                </div>

                                {qcmItem.source === '__custom__' ? (
                                  <input
                                    type="text"
                                    placeholder="ex: Externat - 2021..."
                                    onChange={e => {
                                      const val = e.target.value;
                                      setParsedQcms(prev => prev.map(q => q.id === qcmItem.id ? { ...q, source: val } : q));
                                    }}
                                    className="w-full px-2 py-1 text-xs font-bold rounded-lg border border-indigo-400 bg-white dark:bg-navy-900"
                                  />
                                ) : (
                                  <select
                                    value={qcmItem.source !== undefined ? qcmItem.source : (source === '__other__' ? sourceOther : source)}
                                    onChange={e => {
                                      const val = e.target.value;
                                      setParsedQcms(prev => prev.map(q => q.id === qcmItem.id ? { ...q, source: val === '__custom__' ? '' : val } : q));
                                    }}
                                    className="w-full px-2.5 py-1 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-navy-900 font-bold text-navy-900 dark:text-white"
                                  >
                                    <option value="Externat">Externat</option>
                                    <option value="SIAU">SIAU</option>
                                    <option value="Annales Résidanat">Annales Résidanat</option>
                                    <option value="QCM CNP">QCM CNP</option>
                                    <option value="Hypercours">Hypercours</option>
                                    {scopeSources.filter(s => !['Externat', 'SIAU', 'Annales Résidanat', 'QCM CNP', 'Hypercours'].includes(s)).map(s => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                    {qcmItem.source && !['Externat', 'SIAU', 'Annales Résidanat', 'QCM CNP', 'Hypercours', ...scopeSources].includes(qcmItem.source) && (
                                      <option value={qcmItem.source}>{qcmItem.source}</option>
                                    )}
                                    <option value="__custom__">✨ + Autre sous-source...</option>
                                  </select>
                                )}
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300">📚 Cours du QCM :</span>
                                  {qcmItem.courseTitle && !qcmItem.courseId && (
                                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400" title="Sujet détecté par l'IA">
                                      ✨ Thème: {qcmItem.courseTitle}
                                    </span>
                                  )}
                                </div>
                                <select
                                  value={qcmItem.courseId !== undefined ? qcmItem.courseId : courseId}
                                  onChange={e => {
                                    const val = e.target.value;
                                    const crsObj = courses.find(c => c.id === val);
                                    setParsedQcms(prev => prev.map(q => q.id === qcmItem.id ? {
                                      ...q,
                                      courseId: val,
                                      courseTitle: crsObj ? crsObj.title : (val === '' ? undefined : q.courseTitle)
                                    } : q));
                                  }}
                                  className="w-full px-2.5 py-1 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-navy-900 font-bold text-navy-900 dark:text-white"
                                >
                                  <option value="">-- Aucun cours spécifique --</option>
                                  {filteredCourses.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <span className="block text-[10px] font-bold text-indigo-700 dark:text-indigo-300 mb-0.5">🎓 Année d'Études :</span>
                                <select
                                  value={qcmItem.year !== undefined ? qcmItem.year : (year !== '' ? year : '')}
                                  onChange={e => {
                                    const val = e.target.value ? Number(e.target.value) : undefined;
                                    setParsedQcms(prev => prev.map(q => q.id === qcmItem.id ? { ...q, year: val } : q));
                                  }}
                                  className="w-full px-2.5 py-1 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-navy-900 font-bold text-navy-900 dark:text-white"
                                >
                                  <option value="">Global</option>
                                  {MEDICAL_YEARS.map(y => (
                                    <option key={y.year} value={y.year}>{y.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Question & Proposition Full Editable Mode */}
                            {isEditing ? (
                              <div className="space-y-4 pt-2 bg-navy-50/70 dark:bg-navy-950/60 p-4 rounded-2xl border border-navy-200 dark:border-navy-800">
                                <div>
                                  <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                                    Énoncé de la question :
                                  </label>
                                  <textarea
                                    value={qcmItem.question}
                                    onChange={e => {
                                      const val = e.target.value;
                                      setParsedQcms(prev => prev.map(q => q.id === qcmItem.id ? { ...q, question: val } : q));
                                    }}
                                    rows={2}
                                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-navy-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                                    Vignette / Cas Clinique (Optionnel) :
                                  </label>
                                  <input
                                    type="text"
                                    value={qcmItem.vignetteText || ''}
                                    onChange={e => {
                                      const val = e.target.value;
                                      setParsedQcms(prev => prev.map(q => q.id === qcmItem.id ? { ...q, vignetteText: val } : q));
                                    }}
                                    placeholder="ex: Un patient de 54 ans consulte pour..."
                                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white"
                                  />
                                </div>

                                <div className="space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300">
                                      Propositions (Propositions A, B, C...) & Cocher les réponses exactes :
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => addOptionToParsedQcm(qcmItem.id)}
                                      className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                                    >
                                      <PlusCircle className="w-3.5 h-3.5" />
                                      <span>+ Ajouter Proposition</span>
                                    </button>
                                  </div>

                                  {qcmItem.options.map((opt, oIdx) => (
                                    <div key={oIdx} className="flex items-center gap-2">
                                      <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-xs font-bold cursor-pointer shrink-0">
                                        <input
                                          type="checkbox"
                                          checked={opt.isCorrect}
                                          onChange={() => toggleParsedQcmCorrect(qcmItem.id, oIdx)}
                                          className="w-4 h-4 text-brand-600 rounded"
                                        />
                                        <input
                                          type="text"
                                          value={opt.letter}
                                          onChange={e => {
                                            const val = e.target.value.toUpperCase();
                                            setParsedQcms(prev => prev.map(q => {
                                              if (q.id === qcmItem.id) {
                                                const nextOpts = [...q.options];
                                                nextOpts[oIdx] = { ...nextOpts[oIdx], letter: val };
                                                return { ...q, options: nextOpts };
                                              }
                                              return q;
                                            }));
                                          }}
                                          className="w-6 text-center font-bold text-xs border-b border-navy-300 dark:border-navy-600 bg-transparent text-navy-900 dark:text-white"
                                        />
                                      </label>

                                      <input
                                        type="text"
                                        value={opt.text}
                                        onChange={e => updateParsedQcmOptionText(qcmItem.id, oIdx, e.target.value)}
                                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white"
                                      />

                                      {qcmItem.options.length > 2 && (
                                        <button
                                          type="button"
                                          onClick={() => removeOptionFromParsedQcm(qcmItem.id, oIdx)}
                                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950 transition-colors"
                                          title="Supprimer cette option"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              /* Live Interactive Read-Only Preview */
                              <div className="space-y-2">
                                {qcmItem.vignetteText && (
                                  <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-950 dark:text-amber-200 italic">
                                    <strong>Vignette clinique :</strong> {qcmItem.vignetteText}
                                  </div>
                                )}

                                <p className="font-bold text-sm text-navy-950 dark:text-white">
                                  {qcmItem.question}
                                </p>

                                <div className="grid grid-cols-1 gap-1.5 text-xs">
                                  {qcmItem.options.map((opt, oIdx) => (
                                    <div
                                      key={oIdx}
                                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                                        opt.isCorrect
                                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold'
                                          : 'bg-navy-50/50 dark:bg-navy-950/30 border-navy-200/60 dark:border-navy-800 text-navy-700 dark:text-navy-300'
                                      }`}
                                    >
                                      <span><strong>{opt.letter}.</strong> {opt.text}</span>
                                      {opt.isCorrect && (
                                        <span className="text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                                          Exacte
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Manual QCM Insertion Divider Button between cards */}
                          <div className="relative py-1 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-dashed border-indigo-200 dark:border-indigo-800" />
                            </div>
                            <button
                              type="button"
                              onClick={() => insertParsedQcmAt(qIdx + 1)}
                              className="relative px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-navy-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-200 dark:border-indigo-700 shadow-2xs transition-all flex items-center gap-1 opacity-70 hover:opacity-100"
                            >
                              <Plus className="w-3 h-3" />
                              <span>➕ Insérer un QCM manuellement ici (entre #{qcmItem.tempNum} et #{qcmItem.tempNum + 1})</span>
                            </button>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 1: MANUAL HTML QCM EDITOR FORM */}
          {qcmInputMode === 'MANUAL' && (
            <form onSubmit={handleCreate} className="space-y-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                    Titre du QCM * :
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="ex: Traitement du SCA ST+"
                    className="w-full px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                    Énoncé / Question * :
                  </label>
                  <input
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Quel est le traitement de choix ?"
                    className="w-full px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Options & Correct checkboxes */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300">
                  Propositions & Cocher la/les réponse(s) exacte(s) * :
                </label>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 p-2 rounded-xl bg-navy-100 dark:bg-navy-800 font-bold cursor-pointer">
                      <input type="checkbox" checked={correctA} onChange={e => setCorrectA(e.target.checked)} className="w-4 h-4 text-brand-600 rounded" />
                      <span>Option A</span>
                    </label>
                    <input type="text" value={optA} onChange={e => setOptA(e.target.value)} placeholder="Proposition A" className="flex-1 px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800" />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 p-2 rounded-xl bg-navy-100 dark:bg-navy-800 font-bold cursor-pointer">
                      <input type="checkbox" checked={correctB} onChange={e => setCorrectB(e.target.checked)} className="w-4 h-4 text-brand-600 rounded" />
                      <span>Option B</span>
                    </label>
                    <input type="text" value={optB} onChange={e => setOptB(e.target.value)} placeholder="Proposition B" className="flex-1 px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800" />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 p-2 rounded-xl bg-navy-100 dark:bg-navy-800 font-bold cursor-pointer">
                      <input type="checkbox" checked={correctC} onChange={e => setCorrectC(e.target.checked)} className="w-4 h-4 text-brand-600 rounded" />
                      <span>Option C</span>
                    </label>
                    <input type="text" value={optC} onChange={e => setOptC(e.target.value)} placeholder="Proposition C" className="flex-1 px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800" />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 p-2 rounded-xl bg-navy-100 dark:bg-navy-800 font-bold cursor-pointer">
                      <input type="checkbox" checked={correctD} onChange={e => setCorrectD(e.target.checked)} className="w-4 h-4 text-brand-600 rounded" />
                      <span>Option D</span>
                    </label>
                    <input type="text" value={optD} onChange={e => setOptD(e.target.value)} placeholder="Proposition D" className="flex-1 px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800" />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 p-2 rounded-xl bg-navy-100 dark:bg-navy-800 font-bold cursor-pointer">
                      <input type="checkbox" checked={correctE} onChange={e => setCorrectE(e.target.checked)} className="w-4 h-4 text-brand-600 rounded" />
                      <span>Option E</span>
                    </label>
                    <input type="text" value={optE} onChange={e => setOptE(e.target.value)} placeholder="Proposition E" className="flex-1 px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800" />
                  </div>
                </div>
              </div>

              {/* HTML Explanation */}
              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  Explication Physiopathologique (Code HTML) :
                </label>
                <textarea
                  value={explanationHtml}
                  onChange={e => setExplanationHtml(e.target.value)}
                  rows={4}
                  className="w-full p-4 font-mono text-xs rounded-2xl border border-navy-200 dark:border-navy-800 bg-white dark:bg-navy-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-all"
                >
                  ➕ Enregistrer et Synchroniser le QCM
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Standalone Sources & Sessions Hierarchy Sidebar / Tree Panel */}
      <div className="apple-card p-5 space-y-3 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-navy-900 dark:to-indigo-950/20 border border-indigo-100 dark:border-indigo-900">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-navy-100 dark:border-navy-800">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-black text-navy-950 dark:text-white">
              Navigation par Sources & Sessions d'Examens :
            </span>
          </div>
          
          {selectedSourceFilter !== 'all' && (
            <button
              onClick={() => setSelectedSourceFilter('all')}
              className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-1 shadow-xs"
            >
              <span>📌 Source isolée : <u>{selectedSourceFilter}</u></span>
              <X className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1 text-xs">
          {Array.from(sourceTree.entries()).map(([parentName, group]) => {
            const isParentActive = selectedSourceFilter.toLowerCase() === parentName.toLowerCase();

            return (
              <div key={parentName} className="p-3 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200/80 dark:border-navy-800 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedSourceFilter(parentName)}
                    className={`font-black text-xs hover:underline text-left truncate flex items-center gap-1.5 ${
                      isParentActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-navy-950 dark:text-white'
                    }`}
                  >
                    <span>📁 {parentName}</span>
                  </button>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300">
                    {group.total} QCMs
                  </span>
                </div>

                {/* Sub-sources list */}
                <div className="space-y-1 pl-2 border-l-2 border-indigo-100 dark:border-indigo-900">
                  {group.subSources.map(sub => {
                    const isSubActive = selectedSourceFilter.toLowerCase() === sub.name.toLowerCase();

                    return (
                      <button
                        key={sub.name}
                        onClick={() => setSelectedSourceFilter(sub.name)}
                        className={`w-full text-left px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between gap-1 ${
                          isSubActive
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-navy-700 dark:text-navy-300 hover:bg-indigo-50 dark:hover:bg-navy-800'
                        }`}
                      >
                        <span className="truncate">📄 {sub.name.includes(' - ') ? sub.name.split(' - ')[1] : sub.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSubActive ? 'bg-indigo-700 text-white' : 'bg-navy-100 dark:bg-navy-800 text-navy-500'}`}>
                          {sub.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Bar for Existing QCM Bank */}
      <div className="apple-card p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-navy-100 dark:border-navy-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-black text-navy-950 dark:text-white">
              Filtres Multicritères Banque QCM :
            </span>
          </div>
          <span className="text-xs font-bold text-brand-600 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            {filteredQcms.length} QCM(s) trouvé(s) sur {qcms.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-bold">
          {/* 1. Year filter */}
          <div>
            <label className="block text-[10px] font-black uppercase text-navy-500 dark:text-navy-400 mb-1">
              🎓 Année d'Études :
            </label>
            <select
              value={selectedYearFilter}
              onChange={e => {
                setSelectedYearFilter(e.target.value);
                setSelectedSpecialtyFilter('all');
                setSelectedCourseFilter('all');
              }}
              className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-900 dark:text-white font-bold"
            >
              <option value="all">🌐 Toutes les Années</option>
              {MEDICAL_YEARS.map(y => (
                <option key={y.year} value={y.year}>{y.name} ({y.cycle})</option>
              ))}
              <option value="none">🌐 Transversal / Sans année</option>
            </select>
          </div>

          {/* 2. Specialty filter */}
          <div>
            <label className="block text-[10px] font-black uppercase text-navy-500 dark:text-navy-400 mb-1">
              🩺 Module / Spécialité :
            </label>
            <select
              value={selectedSpecialtyFilter}
              onChange={e => {
                setSelectedSpecialtyFilter(e.target.value);
                setSelectedCourseFilter('all');
              }}
              className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-900 dark:text-white font-bold"
            >
              <option value="all">🩺 Tous les Modules</option>
              {specialtiesList
                .filter(s => selectedYearFilter === 'all' || selectedYearFilter === 'none' || !s.year || s.year === Number(selectedYearFilter))
                .map(s => (
                  <option key={s.id} value={s.id}>{getSpecialtyEmoji(s.id)} {s.name}</option>
                ))}
            </select>
          </div>

          {/* 3. Course filter */}
          <div>
            <label className="block text-[10px] font-black uppercase text-navy-500 dark:text-navy-400 mb-1">
              📖 Cours Spécifique :
            </label>
            <select
              value={selectedCourseFilter}
              onChange={e => setSelectedCourseFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-900 dark:text-white font-bold"
            >
              <option value="all">📖 Tous les Cours</option>
              {filteredCoursesForFilter.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* 4. Source & Sous-Source filter */}
          <div>
            <label className="block text-[10px] font-black uppercase text-navy-500 dark:text-navy-400 mb-1">
              📌 Source / Sous-Source :
            </label>
            <select
              value={selectedSourceFilter}
              onChange={e => setSelectedSourceFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-900 dark:text-white font-bold"
            >
              <option value="all">📌 Toutes les Sources</option>
              {availableSources.map(src => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>

          {/* 5. Keyword Search filter */}
          <div>
            <label className="block text-[10px] font-black uppercase text-navy-500 dark:text-navy-400 mb-1">
              🔍 Recherche Mot-Clé :
            </label>
            <input
              type="text"
              value={searchQueryFilter}
              onChange={e => setSearchQueryFilter(e.target.value)}
              placeholder="ex: Behçet, 2021, Oran..."
              className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-900 dark:text-white font-bold placeholder:font-normal"
            />
          </div>
        </div>
      </div>

      {/* Global Answer Toggle & Bulk Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-800 shadow-sm mb-4">
        <div className="flex items-center gap-3 text-xs font-bold text-navy-700 dark:text-navy-300 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-navy-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-navy-700">
            <input
              type="checkbox"
              checked={selectedQcmIds.length > 0 && selectedQcmIds.length === filteredQcms.length}
              onChange={handleToggleSelectAllFiltered}
              className="w-4 h-4 text-brand-600 rounded"
            />
            <span>Tout sélectionner ({filteredQcms.length})</span>
          </label>

          <span className="px-2.5 py-1 rounded-xl bg-brand-500/10 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
            📊 {filteredQcms.length} QCM(s) affiché(s)
          </span>

          {selectedQcmIds.length > 0 && (
            <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 font-extrabold border border-purple-500/20">
              🎯 {selectedQcmIds.length} sélectionné(s)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedQcmIds.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => {
                  setTargetBatchCourseId('');
                  setBatchAttachModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>🎯 Rattacher à un Cours ({selectedQcmIds.length})</span>
              </button>

              <button
                type="button"
                onClick={handleBatchDeleteSelectedQcms}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer ({selectedQcmIds.length})</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setShowAllAnswersGlobal(true)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              showAllAnswersGlobal
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 hover:bg-emerald-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>👁️ Afficher les réponses</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAllAnswersGlobal(false);
              setVisibleAnswersMap({});
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              !showAllAnswersGlobal && Object.keys(visibleAnswersMap).length === 0
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300 border border-slate-200 dark:border-navy-700 hover:bg-slate-200'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>🙈 Masquer réponses</span>
          </button>
        </div>
      </div>

      {/* List of Existing QCMs */}
      <div className="space-y-4">
        {filteredQcms.length === 0 ? (
          <div className="apple-card p-12 text-center space-y-3 text-navy-500 dark:text-navy-400">
            <div className="text-3xl">🔍</div>
            <p className="font-bold text-sm">Aucun QCM ne correspond à vos filtres actuels.</p>
            <p className="text-xs">Essayez de réinitialiser la sélection d'Année, de Spécialité ou de Source.</p>
            <button
              onClick={() => {
                setSelectedYearFilter('all');
                setSelectedSpecialtyFilter('all');
                setSelectedCourseFilter('all');
                setSelectedSourceFilter('all');
                setSearchQueryFilter('');
              }}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              🔄 Réinitialiser Tous les Filtres
            </button>
          </div>
        ) : (
          filteredQcms.map((qcm) => {
            const specObj = specialtiesList.find(s => s.id === qcm.specialtyId) || ALL_SPECIALTIES.find(s => s.id === qcm.specialtyId);
            const specialtyDisplayName = specObj ? specObj.name : (qcm.specialtyName || qcm.specialtyId);
            const isAnswerVisible = showAllAnswersGlobal || Boolean(visibleAnswersMap[qcm.id]);
            const isSelected = selectedQcmIds.includes(qcm.id);

            const effectiveYr = (qcm.year !== undefined && qcm.year !== null && (qcm.year as any) !== '')
              ? Number(qcm.year)
              : specObj?.year;

            const yearLabel = effectiveYr
              ? MEDICAL_YEARS.find(y => y.year === effectiveYr)?.name || `${effectiveYr}e Année`
              : 'Transversal';

            return (
              <div key={qcm.id} className={`apple-card p-6 space-y-4 transition-all ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectQcm(qcm.id)}
                      className="w-5 h-5 text-indigo-600 rounded mt-1 cursor-pointer shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-brand-500/10 text-brand-600 dark:bg-brand-950 dark:text-brand-300 border border-brand-500/20 flex items-center gap-1">
                        <span>🎓</span>
                        <span>{yearLabel}</span>
                      </span>

                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/50">
                        {getSpecialtyEmoji(qcm.specialtyId)} {specialtyDisplayName}
                      </span>

                      {qcm.courseTitle && (
                        <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300">
                          📖 {qcm.courseTitle}
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200/50">
                        🏛️ {qcm.faculty === 'ORAN' ? 'Faculté Oran' : qcm.faculty === 'SIDI_BEL_ABBES' ? 'Faculté SBA' : 'Toutes Facultés'}
                      </span>

                      {qcm.source && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/50">
                          📌 {qcm.source}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-navy-950 dark:text-white">
                      {qcm.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setVisibleAnswersMap(prev => ({ ...prev, [qcm.id]: !prev[qcm.id] }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        isAnswerVisible
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white dark:bg-navy-800 text-navy-700 dark:text-navy-200 border-navy-200 dark:border-navy-700 hover:border-emerald-400 hover:text-emerald-600'
                      }`}
                    >
                      {isAnswerVisible ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Masquer réponse</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>👁️ Voir réponse</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(qcm.id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                      title="Supprimer ce QCM"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm font-semibold text-navy-800 dark:text-navy-200">
                  {qcm.question}
                </p>

                <div className="grid grid-cols-1 gap-2 text-xs">
                  {qcm.options.map((opt, idx) => {
                    const isCorrect = qcm.correctAnswers?.includes(idx);
                    const highlightCorrect = isCorrect && isAnswerVisible;
                    return (
                      <div
                        key={opt.id || idx}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          highlightCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold shadow-sm'
                            : 'bg-navy-50/50 dark:bg-navy-900/40 border-navy-200/60 dark:border-navy-800 text-navy-700 dark:text-navy-300'
                        }`}
                      >
                        <span><strong>{opt.letter || String.fromCharCode(65 + idx)}.</strong> {opt.text}</span>
                        {highlightCorrect && (
                          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                            Exacte
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {qcm.explanation && (
                  <details
                    open={isAnswerVisible}
                    className="text-xs bg-navy-50/60 dark:bg-navy-950 p-4 rounded-xl border border-navy-200 dark:border-navy-800 transition-all"
                  >
                    <summary className="font-bold text-brand-600 dark:text-brand-400 cursor-pointer hover:underline">
                      💡 Explication physiopathologique
                    </summary>
                    <div
                      className="mt-2 text-navy-700 dark:text-navy-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: qcm.explanation }}
                    />
                  </details>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* AI QCM EXTRACTION MODAL */}
      {aiQcmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-navy-900 rounded-3xl max-w-2xl w-full border border-navy-200 dark:border-navy-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-navy-100 dark:border-navy-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-navy-950 dark:text-white flex items-center gap-2">
                    <span>🚀 Extrakteur QCM par Intelligence Artificielle</span>
                  </h3>
                  <p className="text-xs text-navy-500">
                    Extrayez 100% des QCMs et propositions depuis un lien Google Drive PDF ou du texte brut.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiQcmModalOpen(false)}
                className="p-2 rounded-xl text-navy-400 hover:text-navy-900 dark:hover:text-white hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Provider Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300">
                1. Sélectionner le Fournisseur IA :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'google_ai_studio', name: 'Google AI Studio', icon: '⚡', desc: 'Gratuit / Clé Pro' },
                  { id: 'openrouter', name: 'OpenRouter', icon: '🌐', desc: '50+ Modèles' },
                  { id: 'deepseek', name: 'DeepSeek AI', icon: '🧠', desc: 'Très Économique' },
                  { id: 'codecraft', name: 'CodeCraft API', icon: '🛠️', desc: 'Serveur Pro' },
                  { id: 'openai', name: 'OpenAI (GPT-4o)', icon: '🤖', desc: 'Direct OpenAI' },
                  { id: 'anthropic', name: 'Anthropic Claude', icon: '🎭', desc: 'Claude 3.5' },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setAiProvider(p.id as any);
                      if (p.id === 'google_ai_studio') setSelectedAiModel('models/gemini-2.5-flash');
                      else if (p.id === 'openrouter') setSelectedAiModel('google/gemini-2.5-flash');
                      else if (p.id === 'deepseek') setSelectedAiModel('deepseek-chat');
                      else if (p.id === 'openai') setSelectedAiModel('gpt-4o-mini');
                      else if (p.id === 'anthropic') setSelectedAiModel('claude-3-5-sonnet-20241022');
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      aiProvider === p.id
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/20 font-bold'
                        : 'bg-white dark:bg-navy-800 border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:border-navy-300'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>{p.icon}</span>
                      <span>{p.name}</span>
                    </div>
                    <div className="text-[10px] text-navy-400 mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* API Key Box */}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-purple-600" />
                  <span>Clé API ({aiProvider === 'google_ai_studio' ? 'Google AI Studio' : aiProvider === 'openrouter' ? 'OpenRouter' : 'Clé API Directe'}) :</span>
                </span>
                <span className="text-[10px] text-purple-600 font-bold">
                  {aiProvider === 'google_ai_studio' ? (googleAiKey ? '✅ Enregistrée' : 'Optionnelle (Utilise la clé serveur par défaut)') : 'Requise'}
                </span>
              </label>

              {aiProvider === 'google_ai_studio' ? (
                <input
                  type="password"
                  value={googleAiKey}
                  onChange={e => setGoogleAiKey(e.target.value)}
                  placeholder="AIzaSy... (Laissez vide pour utiliser la clé serveur par défaut)"
                  className="w-full px-4 py-2 text-xs font-mono rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900"
                />
              ) : aiProvider === 'openrouter' ? (
                <input
                  type="password"
                  value={openRouterKey}
                  onChange={e => setOpenRouterKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full px-4 py-2 text-xs font-mono rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900"
                />
              ) : (
                <input
                  type="password"
                  value={directApiKey}
                  onChange={e => setDirectApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-2 text-xs font-mono rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900"
                />
              )}
            </div>

            {/* Model Selector & Exam Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  Modèle IA :
                </label>
                <select
                  value={selectedAiModel}
                  onChange={e => setSelectedAiModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white"
                >
                  {aiProvider === 'google_ai_studio' && (
                    <>
                      <option value="models/gemini-2.5-flash">⚡ Gemini 2.5 Flash (Ultra Rapide & Recommandé)</option>
                      <option value="models/gemini-2.5-pro">🧠 Gemini 2.5 Pro (Haute Précision Médicale & Raisonnement)</option>
                      <option value="models/gemini-2.5-flash-lite">⚡ Gemini 2.5 Flash Lite (Ultra Léger & Faible Latence)</option>
                      <option value="models/gemini-2.0-flash">🚀 Gemini 2.0 Flash (Next-Gen Multimodal Rapide)</option>
                      <option value="models/gemini-2.0-flash-lite">⚡ Gemini 2.0 Flash Lite (Léger & Haute Vitesse)</option>
                      <option value="models/gemini-2.0-flash-thinking-exp-01-21">🔬 Gemini 2.0 Flash Thinking Exp (Raisonnement Détaillé)</option>
                      <option value="models/gemini-2.0-pro-exp-02-05">🔬 Gemini 2.0 Pro Experimental</option>
                      <option value="models/gemini-1.5-flash-latest">⚡ Gemini 1.5 Flash Latest</option>
                      <option value="models/gemini-1.5-pro-latest">📚 Gemini 1.5 Pro Latest (Contexte 2M Tokens)</option>
                      <option value="models/gemini-1.5-flash">🚀 Gemini 1.5 Flash</option>
                      <option value="models/gemini-1.5-pro">📄 Gemini 1.5 Pro</option>
                      <option value="models/gemini-1.5-flash-8b">⚡ Gemini 1.5 Flash 8B (Micro Model)</option>
                    </>
                  )}
                  {aiProvider === 'openrouter' && (
                    <>
                      <option value="google/gemini-2.5-flash">⚡ Google Gemini 2.5 Flash (Recommandé)</option>
                      <option value="google/gemini-2.5-pro">🧠 Google Gemini 2.5 Pro</option>
                      <option value="google/gemini-2.5-flash-lite">⚡ Google Gemini 2.5 Flash Lite</option>
                      <option value="google/gemini-2.0-flash-001">🚀 Google Gemini 2.0 Flash</option>
                      <option value="google/gemini-2.0-flash-lite-001">⚡ Google Gemini 2.0 Flash Lite</option>
                      <option value="google/gemini-2.0-flash-thinking-exp:free">🔬 Google Gemini 2.0 Flash Thinking (Gratuit)</option>
                      <option value="google/gemini-1.5-flash">🚀 Google Gemini 1.5 Flash</option>
                      <option value="google/gemini-1.5-pro">📚 Google Gemini 1.5 Pro</option>
                      <option value="google/gemini-1.5-flash-8b">⚡ Google Gemini 1.5 Flash 8B</option>
                      <option value="deepseek/deepseek-chat">DeepSeek Chat V3</option>
                      <option value="deepseek/deepseek-r1">DeepSeek R1 Reasoner</option>
                      <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
                      <option value="openai/gpt-4o">OpenAI GPT-4o</option>
                      <option value="anthropic/claude-3.5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                    </>
                  )}
                  {aiProvider === 'deepseek' && (
                    <>
                      <option value="deepseek-chat">DeepSeek Chat (V3)</option>
                      <option value="deepseek-reasoner">DeepSeek R1 Reasoner</option>
                    </>
                  )}
                  {aiProvider === 'codecraft' && (
                    <option value="codecraft-v1">CodeCraft AI Engine</option>
                  )}
                  {aiProvider === 'openai' && (
                    <>
                      <option value="gpt-4o-mini">GPT-4o Mini</option>
                      <option value="gpt-4o">GPT-4o Standard</option>
                    </>
                  )}
                  {aiProvider === 'anthropic' && (
                    <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  Nom de l'Épreuve / Source :
                </label>
                <input
                  type="text"
                  value={examTitleInput}
                  onChange={e => setExamTitleInput(e.target.value)}
                  placeholder="ex: EMD Cardiology Oran 2023"
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-900 dark:text-white"
                />
              </div>
            </div>

            {/* Input Type Selector: PDF Link vs Raw Text */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-navy-100 dark:bg-navy-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAiInputType('drive_pdf')}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    aiInputType === 'drive_pdf'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-navy-500 hover:text-navy-900 dark:hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Lien Google Drive / URL PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAiInputType('raw_text')}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    aiInputType === 'raw_text'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-navy-500 hover:text-navy-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Coller le Texte Brut</span>
                </button>
              </div>

              {aiInputType === 'drive_pdf' ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-navy-800 dark:text-navy-200">
                    Coller le lien Google Drive ou PDF d'examen :
                  </label>
                  <input
                    type="url"
                    value={aiPdfUrl}
                    onChange={e => setAiPdfUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/17y_1uazhDFMj6Xp_2Gaf64gF-vkUiY3y/view..."
                    className="w-full px-4 py-2.5 text-xs font-mono rounded-2xl border border-purple-300 dark:border-purple-800 bg-purple-50/30 dark:bg-navy-950 focus:border-purple-600 text-navy-900 dark:text-white"
                  />
                  <p className="text-[10px] text-navy-400">
                    💡 Formats supportés : Liens de partage Google Drive (`/file/d/.../view`), Google Docs/Slides, Dropbox, ou URLs directes PDF.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-navy-800 dark:text-navy-200">
                    Coller le contenu texte de l'examen :
                  </label>
                  <textarea
                    value={aiRawInput}
                    onChange={e => setAiRawInput(e.target.value)}
                    rows={6}
                    placeholder="QCM 1: Quel est le symptôme de... A. Fièvre B. Toux..."
                    className="w-full p-3 font-mono text-xs rounded-2xl border border-navy-200 dark:border-navy-800 bg-white dark:bg-navy-950 text-navy-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-100 dark:border-navy-800">
              <button
                type="button"
                onClick={() => setAiQcmModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-navy-600 dark:text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleRunAiQcmExtract}
                disabled={aiExtracting}
                className="px-6 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {aiExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extraction IA en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>🚀 Démarrer l'Extraction par IA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BATCH COURSE ATTACHMENT MODAL */}
      {batchAttachModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="apple-card max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-navy-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-navy-900 dark:text-white">
                  Rattacher les {selectedQcmIds.length} QCM(s) Sélectionnés à un Cours
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBatchAttachModalOpen(false)}
                className="p-1 rounded-xl text-navy-400 hover:text-navy-900 dark:hover:text-white hover:bg-navy-100 dark:hover:bg-navy-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-navy-600 dark:text-navy-400">
                Sélectionnez le cours de destination pour attribuer directement ces <strong>{selectedQcmIds.length} QCM(s)</strong> dans la base de données Supabase SQL.
              </p>

              {/* Specialty Filter inside modal */}
              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  1. Filtrer par Spécialité / Module :
                </label>
                <select
                  value={targetBatchSpecId}
                  onChange={e => setTargetBatchSpecId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold"
                >
                  <option value="all">Toutes les spécialités ({specialtiesList.length})</option>
                  {specialtiesList.map(s => (
                    <option key={s.id} value={s.id}>{getSpecialtyEmoji(s.id)} {s.name}</option>
                  ))}
                </select>
              </div>

              {/* Course Search */}
              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  2. Chercher un cours par mot-clé :
                </label>
                <input
                  type="text"
                  value={batchCourseSearchQuery}
                  onChange={e => setBatchCourseSearchQuery(e.target.value)}
                  placeholder="ex: Otite, Vertiges, Retrecissement..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold"
                />
              </div>

              {/* Course Selection List */}
              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  3. Choisir le Cours de destination :
                </label>
                <select
                  value={targetBatchCourseId}
                  onChange={e => setTargetBatchCourseId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-indigo-500 bg-indigo-50/50 dark:bg-navy-800 text-xs font-bold text-navy-950 dark:text-white"
                  size={6}
                >
                  {courses
                    .filter(c => targetBatchSpecId === 'all' || c.specialtyId === targetBatchSpecId)
                    .filter(c => !batchCourseSearchQuery || c.title.toLowerCase().includes(batchCourseSearchQuery.toLowerCase()))
                    .map(c => (
                      <option key={c.id} value={c.id} className="p-2 border-b border-indigo-100 dark:border-navy-700">
                        📖 {c.title} ({c.specialtyName || c.specialtyId})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-100 dark:border-navy-800">
              <button
                type="button"
                onClick={() => setBatchAttachModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-navy-600 hover:bg-navy-100 dark:hover:bg-navy-800"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleBatchAttachToCourse}
                disabled={batchAttaching || !targetBatchCourseId}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {batchAttaching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rattachement en cours...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Confirmer le Rattachement</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
