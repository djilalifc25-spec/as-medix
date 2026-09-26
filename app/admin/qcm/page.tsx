'use client';

import React, { useState, useEffect } from 'react';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { QCM, Course, Specialty, MEDICAL_YEARS } from '@/types';
import {
  Brain, Plus, Trash2, CheckCircle2, Star, Sparkles, Filter, Code, Eye, School,
  FileText, Upload, FileCode, Check, Edit3, Layers, Loader2, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import { ParsedQcmItem, parseQcmDocument } from '@/lib/qcmParser';

export default function AdminQcmPage() {
  const [qcms, setQcms] = useState<QCM[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>(ALL_SPECIALTIES);
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('all');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');
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
  }, []); // eslint-disable-line

  useEffect(() => {
    fetchScopeSources(specialtyId, courseId, faculty);
  }, [specialtyId, courseId, faculty]); // eslint-disable-line

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
        const formData = new FormData();
        if (pdfFile) formData.append('pdfFile', pdfFile);
        if (answerKeyFile) formData.append('answerKeyFile', answerKeyFile);
        if (pastedAnswerKeyText) formData.append('answerKeyText', pastedAnswerKeyText);

        const res = await fetch('/api/admin/qcm/parse-pdf', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Erreur lors de l\'analyse du fichier');
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
    const spec = specialtiesList.find(s => s.id === specialtyId) || ALL_SPECIALTIES.find(s => s.id === specialtyId);
    const crs = courses.find(c => c.id === courseId);
    const finalSource = source === '__other__' ? sourceOther : source;

    const correctAnswers = qcmItem.options
      .map((opt, idx) => opt.isCorrect ? idx : -1)
      .filter(idx => idx !== -1);

    const payload = {
      title: qcmItem.question.length > 80 ? qcmItem.question.substring(0, 80) + '...' : qcmItem.question,
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

  // Batch import all parsed QCMs
  const handleImportAllParsedQcms = async () => {
    if (parsedQcms.length === 0) return;
    setBatchSaving(true);
    let count = 0;

    for (const item of [...parsedQcms]) {
      try {
        await handleImportSingleParsedQcm(item);
        count++;
      } catch (_) {}
    }

    setBatchSaving(false);
    setSuccessMsg(`🚀 ${count} QCM(s) importés avec succès dans la Banque QCM et synchronisés avec Supabase !`);
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
  const filteredQcms = qcms.filter(q => {
    const matchYear = selectedYearFilter === 'all'
      ? true
      : selectedYearFilter === 'none'
        ? !q.year
        : q.year === Number(selectedYearFilter);
    const matchSpec = selectedSpecialtyFilter === 'all' || q.specialtyId === selectedSpecialtyFilter;
    return matchYear && matchSpec;
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

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Fermer le Panneau' : 'Ajouter / Importer des QCMs'}</span>
        </button>
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
      <div className="apple-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap text-xs font-bold">
          <span className="flex items-center gap-1.5 text-navy-700 dark:text-navy-300">
            <Filter className="w-4 h-4 text-brand-600" />
            Filtres Banque :
          </span>

          <select
            value={selectedYearFilter}
            onChange={e => setSelectedYearFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-900 dark:text-white"
          >
            <option value="all">Toutes les années</option>
            {MEDICAL_YEARS.map(y => (
              <option key={y.year} value={y.year}>{y.name}</option>
            ))}
          </select>

          <select
            value={selectedSpecialtyFilter}
            onChange={e => setSelectedSpecialtyFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-900 dark:text-white"
          >
            <option value="all">Toutes les spécialités</option>
            {specialtiesList.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="text-xs font-bold text-navy-500">
          {filteredQcms.length} QCM(s) en Banque
        </div>
      </div>

      {/* List of Existing QCMs */}
      <div className="space-y-4">
        {filteredQcms.map((qcm) => (
          <div key={qcm.id} className="apple-card p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
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
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      📖 {qcm.source}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-navy-950 dark:text-white">
                  {qcm.title}
                </h3>
              </div>

              <button
                onClick={() => handleDelete(qcm.id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
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
        ))}
      </div>
    </div>
  );
}
