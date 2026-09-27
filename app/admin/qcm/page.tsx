'use client';

import React, { useState, useEffect } from 'react';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { QCM, Course, Specialty, MEDICAL_YEARS } from '@/types';
import {
  Brain, Plus, Trash2, CheckCircle2, Star, Sparkles, Filter, Code, Eye, School,
  FileText, Upload, FileCode, Check, Edit3, Layers, Loader2, ChevronDown, ChevronUp, AlertCircle,
  Link as LinkIcon, Globe, X, Key
} from 'lucide-react';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import { ParsedQcmItem, parseQcmDocument } from '@/lib/qcmParser';

export default function AdminQcmPage() {
  const [qcms, setQcms] = useState<QCM[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>(ALL_SPECIALTIES);
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('all');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  const [searchQueryFilter, setSearchQueryFilter] = useState<string>('');
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

  // Per-scope sources
  const [scopeSources, setScopeSources] = useState<string[]>([]);
  const [newSourceInput, setNewSourceInput] = useState('');
  const [addingSource, setAddingSource] = useState(false);

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

  // Fetch scoped sources whenever specialty, course or faculty changes
  const fetchScopeSources = async (spec: string, crs: string, fac?: string) => {
    const params = new URLSearchParams();
    if (spec) params.set('specialty', spec);
    if (crs) params.set('course', crs);
    if (fac && fac !== 'TOUS') params.set('faculty', fac);
    const res = await fetch(`/api/admin/sources?${params}`);
    const data = await res.json();
    if (data.sources) {
      setScopeSources(data.sources);
      setSource(prev => (prev && data.sources.includes(prev)) ? prev : (data.sources[0] || ''));
    }
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
      const finalSource = source === '__other__' ? sourceOther : source;
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
          source: finalSource || examTitleInput || 'Examen IA'
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
          source: q.source || finalSource || data.examTitle || 'Examen IA',
          specialtyId: specialtyId,
          courseId: courseId || undefined,
          year: year !== '' ? Number(year) : undefined
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
    const finalSource = source === '__other__' ? sourceOther : source;

    const newQcmPayload = {
      title,
      year: year !== '' ? Number(year) : undefined,
      specialtyId,
      specialtyName: spec ? spec.name : 'Cardiologie',
      courseId: courseId || undefined,
      courseTitle: crs ? crs.title : undefined,
      faculty: faculty || 'ORAN',
      source: finalSource || 'Annales Examens',
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

        if (data.qcms && Array.isArray(data.qcms) && data.qcms.length > 0) {
          setParsedQcms(data.qcms);
          setSuccessMsg(`🎉 ${data.qcms.length} QCM(s) extraits avec succès ! Previsualisez et modifiez-les ci-dessous avant validation.`);
        } else {
          alert('Aucun QCM n\'a pu être extrait. Assurez-vous que le fichier contient des numéros de QCM (ex: QCM 1, 1., Q1).');
        }
      } else if (pastedQcmText.trim()) {
        const qcms = parseQcmDocument(pastedQcmText, pastedAnswerKeyText);
        if (qcms.length > 0) {
          setParsedQcms(qcms);
          setSuccessMsg(`🎉 ${qcms.length} QCM(s) extraits du texte collé !`);
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

    const finalGlobalSource = source === '__other__' ? sourceOther : source;
    const itemSource = qcmItem.source || finalGlobalSource || 'Annales Examens';
    const itemYear = qcmItem.year !== undefined ? qcmItem.year : (year !== '' ? Number(year) : undefined);

    const correctAnswers = qcmItem.options
      .map((opt, idx) => opt.isCorrect ? idx : -1)
      .filter(idx => idx !== -1);

    const payload = {
      title: qcmItem.question.length > 80 ? qcmItem.question.substring(0, 80) + '...' : qcmItem.question,
      year: itemYear,
      specialtyId: itemSpecId,
      specialtyName: spec ? spec.name : 'Cardiologie',
      courseId: itemCourseId || undefined,
      courseTitle: crs ? crs.title : undefined,
      faculty: faculty || 'ORAN',
      source: itemSource,
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
    if (itemSource && !scopeSources.includes(itemSource)) {
      try {
        await fetch('/api/admin/sources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: itemSource,
            specialty: itemSpecId,
            course: itemCourseId,
            faculty: faculty !== 'TOUS' ? faculty : undefined,
          })
        });
        setScopeSources(prev => Array.from(new Set([itemSource, ...prev])));
      } catch (err) {
        console.warn('Auto save source failed:', err);
      }
    }

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
      const qcmsToImport = parsedQcms.map(qcmItem => {
        const itemSpecId = qcmItem.specialtyId || specialtyId;
        const spec = specialtiesList.find(s => s.id === itemSpecId) || ALL_SPECIALTIES.find(s => s.id === itemSpecId);
        const itemCourseId = qcmItem.courseId || courseId;
        const crs = courses.find(c => c.id === itemCourseId);
        const finalGlobalSource = source === '__other__' ? sourceOther : source;
        const itemSource = qcmItem.source || finalGlobalSource || 'Annales Examens';
        const itemYear = qcmItem.year !== undefined ? qcmItem.year : (year !== '' ? Number(year) : undefined);

        const correctAnswers = qcmItem.options
          .map((opt, idx) => opt.isCorrect ? idx : -1)
          .filter(idx => idx !== -1);

        return {
          id: qcmItem.id || `qcm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          title: qcmItem.question.length > 80 ? qcmItem.question.substring(0, 80) + '...' : qcmItem.question,
          year: itemYear,
          specialtyId: itemSpecId,
          specialtyName: spec ? spec.name : 'Cardiologie',
          courseId: itemCourseId || undefined,
          courseTitle: crs ? crs.title : undefined,
          faculty: faculty || 'ORAN',
          source: itemSource,
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
        setSuccessMsg(`🚀 ${qcmsToImport.length} QCM(s) importés avec succès et sauvegardés définitivement dans Supabase !`);
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

    // 4. Source / Sous-source matching
    const matchSource = selectedSourceFilter === 'all'
      || (q.source && q.source.toLowerCase().includes(selectedSourceFilter.toLowerCase()));

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

        <div className="flex items-center gap-2">
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
            <div className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>🎯 Attributs Cibles des QCMs Imprimés</span>
              <span className="text-[10px] text-brand-600 font-bold bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                {courseId ? 'Rattaché au Cours' : 'Rattaché au Module'}
              </span>
            </div>

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
                  <option value="ORAN">🏛️ Oran (Oran 1 - Chalabi)</option>
                  <option value="SIDI_BEL_ABBES">🏛️ Sidi Bel Abbès (Djillali Liabès)</option>
                  <option value="TOUS">🌐 Toutes Facultés / Tronc Commun</option>
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
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  5. Source Parente & Sous-Source / Année d'Examen :
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-navy-400">A. Source Parente :</span>
                    <select
                      value={parentSource}
                      onChange={e => {
                        const p = e.target.value;
                        setParentSource(p);
                        const full = p && subSource ? `${p} - ${subSource}` : p;
                        setSource(full);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white"
                    >
                      <option value="Externat">Externat</option>
                      <option value="SIAU">SIAU</option>
                      <option value="Annales Résidanat">Annales Résidanat</option>
                      <option value="QCM CNP">QCM CNP</option>
                      <option value="Hypercours">Hypercours</option>
                      {scopeSources.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-navy-400">B. Sous-Source / Session :</span>
                    <input
                      type="text"
                      value={subSource}
                      onChange={e => {
                        const sub = e.target.value;
                        setSubSource(sub);
                        const full = parentSource && sub ? `${parentSource} - ${sub}` : (parentSource || sub);
                        setSource(full);
                      }}
                      placeholder="ex: 2018/2019, Rattrapage 2021..."
                      className="w-full px-3 py-2 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-navy-900 text-xs font-bold text-navy-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-50/60 dark:bg-navy-950 border border-indigo-200 dark:border-indigo-800">
                  <div className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 min-w-0 truncate">
                    📌 Attribué : <span className="underline">{source || parentSource || 'Non définie'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddScopeSource}
                    disabled={!source.trim() || addingSource}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-[10px] font-bold shrink-0 transition-all shadow-xs"
                  >
                    {addingSource ? '...' : '+ Sauvegarder la Sous-Source dans la Base'}
                  </button>
                </div>
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

              {/* Parsed QCMs Preview List */}
              {parsedQcms.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-navy-100 dark:border-navy-800">
                  <div className="flex items-center justify-between flex-wrap gap-3 pb-2">
                    <div>
                      <h3 className="text-base font-black text-navy-950 dark:text-white flex items-center gap-2">
                        <span>📋 QCMs Extraits Prêts à Valider ({parsedQcms.length})</span>
                      </h3>
                      <p className="text-xs text-navy-500">
                        Vérifiez ou modifiez les propositions QCM par QCM avant l'importation finale.
                      </p>
                    </div>

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

                  {/* List of Parsed QCM Cards */}
                  <div className="space-y-3">
                    {parsedQcms.map((qcmItem, qIdx) => {
                      const isEditing = editingQcmId === qcmItem.id;

                      return (
                        <div key={qcmItem.id} className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-sm space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-navy-100 dark:border-navy-800">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-brand-100 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300">
                                QCM #{qcmItem.tempNum}
                              </span>

                              {qcmItem.isVerified ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Réponse détectée</span>
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-amber-600" />
                                  <span>À vérifier</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingQcmId(isEditing ? null : qcmItem.id)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300 hover:bg-navy-200 transition-all flex items-center gap-1"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>{isEditing ? 'Masquer l\'Édition' : 'Modifier'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleImportSingleParsedQcm(qcmItem)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1 shadow-xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Importer ce QCM</span>
                              </button>
                            </div>
                          </div>

                          {/* Per-QCM Source & Course Selector */}
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
                                  {qcmItem.source === '__custom__' ? '← Choisir dans la liste' : '+ Nouvelle Source'}
                                </button>
                              </div>

                              {qcmItem.source === '__custom__' ? (
                                <input
                                  type="text"
                                  placeholder="Saisissez la nouvelle source..."
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
                                  <option value="__custom__">✨ + Saisir une nouvelle source...</option>
                                </select>
                              )}
                            </div>

                            <div>
                              <span className="block text-[10px] font-bold text-indigo-700 dark:text-indigo-300 mb-0.5">📚 Cours du QCM :</span>
                              <select
                                value={qcmItem.courseId !== undefined ? qcmItem.courseId : courseId}
                                onChange={e => {
                                  const val = e.target.value;
                                  setParsedQcms(prev => prev.map(q => q.id === qcmItem.id ? { ...q, courseId: val } : q));
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

                          {/* Editable Question Text & Options */}
                          {isEditing ? (
                            <div className="space-y-3 pt-2 bg-navy-50/50 dark:bg-navy-950/40 p-4 rounded-xl border border-navy-200 dark:border-navy-800">
                              <div>
                                <label className="block text-[11px] font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                                  Énoncé de la question :
                                </label>
                                <input
                                  type="text"
                                  value={qcmItem.question}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setParsedQcms(prev => prev.map(q => q.id === qcmItem.id ? { ...q, question: val } : q));
                                  }}
                                  className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase text-navy-700 dark:text-navy-300">
                                  Propositions & Réponses Exactes :
                                </label>
                                {qcmItem.options.map((opt, oIdx) => (
                                  <div key={oIdx} className="flex items-center gap-2">
                                    <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-xs font-bold cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={opt.isCorrect}
                                        onChange={() => toggleParsedQcmCorrect(qcmItem.id, oIdx)}
                                        className="w-4 h-4 text-brand-600 rounded"
                                      />
                                      <span>{opt.letter}.</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={opt.text}
                                      onChange={e => updateParsedQcmOptionText(qcmItem.id, oIdx, e.target.value)}
                                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            /* Live Interactive Read-Only Preview */
                            <div className="space-y-2">
                              <p className="font-bold text-sm text-navy-950 dark:text-white">
                                {qcmItem.question}
                              </p>

                              <div className="grid grid-cols-1 gap-1.5 text-xs">
                                {qcmItem.options.map((opt, oIdx) => (
                                  <div
                                    key={oIdx}
                                    className={`p-2 rounded-xl border flex items-center justify-between gap-2 ${
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
            const specObj = specialtiesList.find(s => s.id === qcm.specialtyId);
            const effectiveYr = (qcm.year !== undefined && qcm.year !== null && (qcm.year as any) !== '')
              ? Number(qcm.year)
              : specObj?.year;

            const yearLabel = effectiveYr
              ? MEDICAL_YEARS.find(y => y.year === effectiveYr)?.name || `${effectiveYr}e Année`
              : 'Transversal';

            return (
              <div key={qcm.id} className="apple-card p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-brand-500/10 text-brand-600 dark:bg-brand-950 dark:text-brand-300 border border-brand-500/20 flex items-center gap-1">
                        <span>🎓</span>
                        <span>{yearLabel}</span>
                      </span>

                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/50">
                        {getSpecialtyEmoji(qcm.specialtyId)} {qcm.specialtyName || qcm.specialtyId}
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

                  <button
                    onClick={() => handleDelete(qcm.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                    title="Supprimer ce QCM"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

            <p className="text-sm font-semibold text-navy-800 dark:text-navy-200">
              {qcm.question}
            </p>

            <div className="grid grid-cols-1 gap-2 text-xs">
              {qcm.options.map((opt, idx) => {
                const isCorrect = qcm.correctAnswers?.includes(idx);
                return (
                  <div
                    key={opt.id || idx}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'bg-navy-50/50 dark:bg-navy-900/40 border-navy-200/60 dark:border-navy-800 text-navy-700 dark:text-navy-300'
                    }`}
                  >
                    <span><strong>{opt.letter || String.fromCharCode(65 + idx)}.</strong> {opt.text}</span>
                    {isCorrect && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                        Exacte
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {qcm.explanation && (
              <details className="text-xs bg-navy-50/60 dark:bg-navy-950 p-4 rounded-xl border border-navy-200 dark:border-navy-800">
                <summary className="font-bold text-brand-600 dark:text-brand-400 cursor-pointer hover:underline">
                  Voir l'explication physiopathologique
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
                      <option value="models/gemini-2.5-flash">⚡ Gemini 2.5 Flash (Super Rapide & Précis)</option>
                      <option value="models/gemini-2.5-pro">🧠 Gemini 2.5 Pro (Raisonnement Élevé)</option>
                      <option value="models/gemini-1.5-flash">Gemini 1.5 Flash</option>
                      <option value="models/gemini-1.5-pro">Gemini 1.5 Pro</option>
                    </>
                  )}
                  {aiProvider === 'openrouter' && (
                    <>
                      <option value="google/gemini-2.5-flash">Google Gemini 2.5 Flash</option>
                      <option value="google/gemini-2.5-pro">Google Gemini 2.5 Pro</option>
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
    </div>
  );
}
