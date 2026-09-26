'use client';

import React, { useState, useEffect } from 'react';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { QCM, Course, Specialty, MEDICAL_YEARS } from '@/types';
import { Brain, Plus, Trash2, CheckCircle2, Star, Sparkles, Filter, Code, Eye, School } from 'lucide-react';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';

export default function AdminQcmPage() {
  const [qcms, setQcms] = useState<QCM[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>(ALL_SPECIALTIES);
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('all');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [year, setYear] = useState<number | ''>(4);
  const [specialtyId, setSpecialtyId] = useState('cardio');
  const [courseId, setCourseId] = useState('');
  const [faculty, setFaculty] = useState<'ORAN' | 'SIDI_BEL_ABBES' | 'TOUS'>('ORAN');
  const [source, setSource] = useState('');
  const [sourceOther, setSourceOther] = useState('');
  const [isDailyQcm, setIsDailyQcm] = useState(false);
  const [vignette, setVignette] = useState('');
  const [vignetteHtml, setVignetteHtml] = useState('<p class="font-medium text-navy-800 dark:text-navy-200">Patient de 58 ans consultant pour...</p>');
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
      // Auto-select first if nothing selected
      setSource(prev => (prev && data.sources.includes(prev)) ? prev : (data.sources[0] || ''));
    }
  };

  useEffect(() => {
    fetchData();
    fetchScopeSources(specialtyId, courseId, faculty);
  }, []); // eslint-disable-line

  // Reload sources when specialty, course or faculty changes
  useEffect(() => {
    fetchScopeSources(specialtyId, courseId, faculty);
  }, [specialtyId, courseId, faculty]); // eslint-disable-line

  // Inline add source for current scope
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
      faculty,
      source: finalSource,
      rang: 'Rang A',
      difficulty: 'Moyen',
      type: correctAnswers.length > 1 ? 'MULTIPLE' : 'SINGLE',
      vignette: vignette || 'Vignette clinique',
      vignetteHtml,
      question,
      options,
      correctAnswers,
      explanation: explanationHtml.replace(/<[^>]*>?/gm, ''),
      explanationHtml,
      reference,
      tags: [spec?.shortName || 'QCM'],
      accessLevel: 'FREE'
    };

    const res = await fetch('/api/admin/qcm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQcmPayload)
    });
    const data = await res.json();

    if (data.success) {
      setSuccessMsg('QCM en code HTML ajouté avec succès !');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('asmedix-qcm-updated'));
      }
      setShowAddForm(false);
      setTitle('');
      setQuestion('');
      setOptA(''); setOptB(''); setOptC(''); setOptD(''); setOptE('');
      setCorrectA(false); setCorrectB(false); setCorrectC(false); setCorrectD(false); setCorrectE(false);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement ce QCM ?')) return;
    await fetch(`/api/admin/qcm?id=${id}`, { method: 'DELETE' });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('asmedix-qcm-updated'));
    }
    fetchData();
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
              Banque QCM & QCM du Jour
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-500/10 text-brand-600 border border-brand-500/20">
              HTML Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Ajoutez des QCMs rédigés directement en HTML avec explications physiopathologiques.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Fermer' : 'Ajouter un QCM en HTML'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add QCM in HTML Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="apple-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-navy-100 dark:border-navy-800">
            <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-brand-600" />
              <span>Nouveau QCM Médical (Éditeur HTML)</span>
            </h2>
            <div className="flex items-center gap-2 bg-navy-100 dark:bg-navy-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('html')}
                className={`px-3 py-1 rounded-lg ${activeTab === 'html' ? 'bg-white dark:bg-navy-900 text-brand-600 shadow-sm' : 'text-navy-500'}`}
              >
                Code HTML
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg ${activeTab === 'preview' ? 'bg-white dark:bg-navy-900 text-brand-600 shadow-sm' : 'text-navy-500'}`}
              >
                Aperçu Direct
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                Faculté Cible * :
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
                Source de l'épreuve / Livre * :
              </label>
              {/* Scope badge shows which level sources come from */}
              <div className="flex items-center gap-1.5 mb-2 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex-wrap">
                <span>📌 Sources pour :</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
                  {courseId
                    ? `${ALL_SPECIALTIES.find(s => s.id === specialtyId)?.shortName || specialtyId} › Cours spécifique`
                    : ALL_SPECIALTIES.find(s => s.id === specialtyId)?.name || specialtyId}
                </span>
                {faculty && faculty !== 'TOUS' && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide border ${
                    faculty === 'ORAN'
                      ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300'
                  }`}>
                    {faculty === 'ORAN' ? 'ORAN' : 'SBA'}
                  </span>
                )}
              </div>
              <select
                value={source}
                onChange={e => setSource(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white"
              >
                <option value="">-- Choisir la source --</option>
                {scopeSources.map(s => (
                  <option key={s} value={s}>📖 {s}</option>
                ))}
              </select>
              {/* Inline add new source for this scope */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={newSourceInput}
                  onChange={e => setNewSourceInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddScopeSource(); } }}
                  placeholder={`Ajouter une source pour ${courseId ? 'ce cours' : 'cette spécialité'}...`}
                  className="flex-1 px-3 py-2 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 bg-white dark:bg-navy-900 text-xs placeholder-navy-400"
                />
                <button
                  type="button"
                  onClick={handleAddScopeSource}
                  disabled={!newSourceInput.trim() || addingSource}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold"
                >
                  {addingSource ? '...' : '+ Ajouter'}
                </button>
              </div>
              <p className="text-[10px] text-navy-400 mt-1">
                La source sera enregistrée pour cette spécialité/cours et disponible dans la sidebar.
              </p>
            </div>
          </div>

          {/* 3-Step Selection: Année -> Spécialité / Module -> Mode (Totalité du Module vs Par Cours) */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/50 border border-slate-200 dark:border-navy-800">
            <div className="text-xs font-black text-navy-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>Rattachement du QCM (Totalité du Module ou Par Cours)</span>
              <span className="text-[10px] text-brand-600 font-bold bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                {courseId ? 'Rattaché à un cours' : 'Rattaché à la totalité du module'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
                    <School className="w-3.5 h-3.5" />
                    1. Année d'Études :
                  </span>
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
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-brand-500/40 bg-brand-50/50 dark:bg-brand-950/20 text-xs font-black text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">🌐 Sans année spécifique / Transversal</option>
                  {MEDICAL_YEARS.map(y => (
                    <option key={y.year} value={y.year}>🎓 {y.name} ({y.cycle})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  2. Module / Spécialité * :
                </label>
                <select
                  value={specialtyId}
                  onChange={e => {
                    setSpecialtyId(e.target.value);
                    setCourseId('');
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold"
                >
                  {specialtiesList.filter(s => !year || s.year === year || !s.year).length === 0 ? (
                    <option value="" disabled>Aucun module disponible</option>
                  ) : (
                    specialtiesList
                      .filter(s => !year || s.year === year || !s.year)
                      .map(s => (
                        <option key={s.id} value={s.id}>{getSpecialtyEmoji(s.id)} {s.name} {s.year ? `(${s.year}A)` : '(Transversal)'}</option>
                      ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  3. Mode de Rattachement :
                </label>
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700">
                  <button
                    type="button"
                    onClick={() => setCourseId('')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      !courseId
                        ? 'bg-brand-600 text-white shadow-xs font-black'
                        : 'text-navy-600 dark:text-navy-400 hover:text-navy-900'
                    }`}
                  >
                    🌐 Totalité Module
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!courseId && filteredCourses[0]) {
                        setCourseId(filteredCourses[0].id);
                      }
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      courseId
                        ? 'bg-indigo-600 text-white shadow-xs font-black'
                        : 'text-navy-600 dark:text-navy-400 hover:text-navy-900'
                    }`}
                  >
                    📖 Par Cours
                  </button>
                </div>

                {courseId ? (
                  <select
                    value={courseId}
                    onChange={e => setCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-navy-800 text-xs font-semibold mt-2"
                  >
                    {filteredCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-2">
                    ✓ Ce QCM sera disponible dans la totalité du module ({ALL_SPECIALTIES.find(s => s.id === specialtyId)?.name})
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
              Titre / Thème du QCM :
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex : Stratégie thérapeutique du Choc Cardiogénique"
              className="w-full px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs font-bold"
            />
          </div>

          {/* Vignette HTML */}
          <div>
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
              Vignette Clinique (Code HTML autorisé) :
            </label>
            {activeTab === 'html' ? (
              <textarea
                value={vignetteHtml}
                onChange={e => setVignetteHtml(e.target.value)}
                rows={3}
                placeholder="<p>Énoncé clinique avec balises <strong>, <em>, etc...</p>"
                className="w-full font-mono text-xs px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800"
              />
            ) : (
              <div
                className="p-4 rounded-2xl bg-navy-50/80 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: vignetteHtml }}
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
              Question formulée :
            </label>
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ex : Quelle mesure doit être mise en œuvre en extrême urgence ?"
              className="w-full px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs font-bold"
            />
          </div>

          {/* Options A - E */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase text-navy-700 dark:text-navy-300">
              Propositions & Réponses Exactes :
            </span>
            {[
              { letter: 'A', val: optA, setVal: setOptA, corr: correctA, setCorr: setCorrectA },
              { letter: 'B', val: optB, setVal: setOptB, corr: correctB, setCorr: setCorrectB },
              { letter: 'C', val: optC, setVal: setOptC, corr: correctC, setCorr: setCorrectC },
              { letter: 'D', val: optD, setVal: setOptD, corr: correctD, setCorr: setCorrectD },
              { letter: 'E', val: optE, setVal: setOptE, corr: correctE, setCorr: setCorrectE }
            ].map(item => (
              <div key={item.letter} className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={item.corr}
                    onChange={e => item.setCorr(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                    item.corr ? 'bg-emerald-600 text-white' : 'bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300'
                  }`}>
                    {item.letter}
                  </span>
                </label>
                <input
                  type="text"
                  value={item.val}
                  onChange={e => item.setVal(e.target.value)}
                  placeholder={`Texte de la proposition ${item.letter}`}
                  className="flex-1 px-4 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs"
                />
              </div>
            ))}
          </div>

          {/* Explanation HTML */}
          <div>
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
              Justification Médicale & Physiopathologique (Code HTML complet) :
            </label>
            {activeTab === 'html' ? (
              <textarea
                value={explanationHtml}
                onChange={e => setExplanationHtml(e.target.value)}
                rows={4}
                className="w-full font-mono text-xs px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800"
              />
            ) : (
              <div
                className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: explanationHtml }}
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
              Référence Universitaire :
            </label>
            <input
              type="text"
              value={reference}
              onChange={e => setReference(e.target.value)}
              placeholder="Ex : Faculté de Médecine d'Alger - Résidanat 2024"
              className="w-full px-4 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-navy-600 hover:bg-navy-100 dark:text-navy-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft"
            >
              Enregistrer le QCM HTML
            </button>
          </div>
        </form>
      )}

      {/* Year Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedYearFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            selectedYearFilter === 'all'
              ? 'bg-[#5D5FEF] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          Toutes les Années ({qcms.length})
        </button>
        {MEDICAL_YEARS.map(y => {
          const yrCount = qcms.filter(q => q.year === y.year).length;
          return (
            <button
              key={y.year}
              onClick={() => {
                setSelectedYearFilter(selectedYearFilter === String(y.year) ? 'all' : String(y.year));
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedYearFilter === String(y.year)
                  ? 'bg-[#5D5FEF] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <School className="w-3 h-3" />
              <span>{y.name}</span>
              {yrCount > 0 && <span className="text-[10px] opacity-75 font-mono">({yrCount})</span>}
            </button>
          );
        })}
        {/* Sans Année */}
        <button
          onClick={() => setSelectedYearFilter(selectedYearFilter === 'none' ? 'all' : 'none')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            selectedYearFilter === 'none'
              ? 'bg-[#5D5FEF] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          <span>🌐 Sans Année</span>
          {qcms.filter(q => !q.year).length > 0 && (
            <span className="text-[10px] opacity-75 font-mono">({qcms.filter(q => !q.year).length})</span>
          )}
        </button>
      </div>

      {/* Specialty Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedSpecialtyFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
            selectedSpecialtyFilter === 'all'
              ? 'apple-badge-purple'
              : 'apple-pill text-navy-600 dark:text-navy-300'
          }`}
        >
          Tous les modules
        </button>
        {(selectedYearFilter === 'all'
          ? specialtiesList
          : selectedYearFilter === 'none'
            ? specialtiesList.filter(s => !s.year)
            : specialtiesList.filter(s => s.year === Number(selectedYearFilter))
        ).map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSpecialtyFilter(selectedSpecialtyFilter === s.id ? 'all' : s.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              selectedSpecialtyFilter === s.id
                ? 'apple-badge-purple'
                : 'apple-pill text-navy-600 dark:text-navy-300'
            }`}
          >
            <span>{getSpecialtyEmoji(s.id)}</span>
            <span>{s.shortName}</span>
          </button>
        ))}
      </div>

      {/* QCM List */}
      <div className="space-y-3">
        {filteredQcms.map(q => (
          <div key={q.id} className="apple-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base">{getSpecialtyEmoji(q.specialtyId)}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                  {q.specialtyName}
                </span>
                {q.courseTitle && (
                  <span className="text-xs text-navy-400 truncate max-w-xs">
                    • {q.courseTitle}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-navy-900 dark:text-white">{q.title}</h3>
              <p className="text-xs text-navy-500 line-clamp-1">{q.question}</p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => handleDelete(q.id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
