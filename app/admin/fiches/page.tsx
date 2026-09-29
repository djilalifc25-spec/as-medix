'use client';

import React, { useState, useEffect } from 'react';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { Fiche } from '@/types';
import { FileText, Plus, Trash2, CheckCircle2, FolderCheck, Sparkles, Brain, Key, X, Loader2, Folder } from 'lucide-react';
import { aiGenerateFlashcardsFromCourse, AIProviderType } from '@/lib/ai/openrouter';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';

export default function AdminFichesPage() {
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<string>('cardio');
  const [showAddForm, setShowAddForm] = useState(false);
  const [specialtiesList, setSpecialtiesList] = useState(ALL_SPECIALTIES);

  // Manual Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Diagnostic & Sémiologie');
  const [takeaway1, setTakeaway1] = useState('');
  const [takeaway2, setTakeaway2] = useState('');
  const [takeaway3, setTakeaway3] = useState('');
  const [htmlContent, setHtmlContent] = useState('<div class="space-y-3"><h3 class="font-bold text-navy-900 dark:text-white">Points Clés</h3><ul><li>Critère diagnostique majeur...</li></ul></div>');
  const [htmlEditorTab, setHtmlEditorTab] = useState<'html' | 'preview'>('html');
  const [successMsg, setSuccessMsg] = useState('');

  // AI Assistant Modal States
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiProvider, setAiProvider] = useState<AIProviderType>('google_ai_studio');
  const [googleAiKey, setGoogleAiKey] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [directApiKey, setDirectApiKey] = useState('');
  const [selectedAiModel, setSelectedAiModel] = useState('models/gemini-2.5-flash');
  const [aiCourseInput, setAiCourseInput] = useState('');
  const [aiModuleMode, setAiModuleMode] = useState<'auto' | 'manual'>('auto');
  const [aiTargetSpecialty, setAiTargetSpecialty] = useState('cardio');
  const [aiExtracting, setAiExtracting] = useState(false);

  // Module / Specialty Management Modal State
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleShort, setNewModuleShort] = useState('');
  const [newModuleYear, setNewModuleYear] = useState<string>('4');
  const [newModuleFaculty, setNewModuleFaculty] = useState<string>('TOUS');
  const [savingModule, setSavingModule] = useState(false);
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resFiches, resSpecs] = await Promise.all([
        fetch('/api/admin/fiches').then(r => r.json()),
        fetch('/api/admin/specialties').then(r => r.json()).catch(() => null)
      ]);
      if (resFiches.fiches) setFiches(resFiches.fiches);
      if (resSpecs && resSpecs.specialties && Array.isArray(resSpecs.specialties)) {
        const deletedFichesSpecs = resFiches.deletedSpecialtyIds || [];
        const filteredSpecs = resSpecs.specialties.filter((s: any) => !deletedFichesSpecs.includes(s.id));
        setSpecialtiesList(filteredSpecs);
      }
    } catch (e) {
      console.error('Fetch Fiches error:', e);
    }
  };

  const toggleSelectModule = (id: string) => {
    setSelectedModuleIds(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const toggleSelectAllModules = () => {
    if (selectedModuleIds.length === specialtiesList.length) {
      setSelectedModuleIds([]);
    } else {
      setSelectedModuleIds(specialtiesList.map(s => s.id));
    }
  };

  const handleDeleteSelectedModules = async () => {
    if (selectedModuleIds.length === 0) return;
    if (!confirm(`Supprimer définitivement les fiches des ${selectedModuleIds.length} module(s) pour Fiches Flash (sans toucher aux Cours ou QCM) et synchroniser sur Supabase ?`)) return;

    try {
      const res = await fetch('/api/admin/fiches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_module', specialtyIds: selectedModuleIds })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`🎉 ${selectedModuleIds.length} module(s) supprimé(s) de Fiches Flash avec succès !`);
        setSelectedModuleIds([]);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('asmedix-content-updated'));
        }
        fetchData();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.error || 'Erreur lors de la suppression des modules');
      }
    } catch (err: any) {
      alert(err.message || 'Erreur réseau');
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleName.trim()) return;
    setSavingModule(true);
    try {
      const res = await fetch('/api/admin/specialties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newModuleName.trim(),
          shortName: newModuleShort.trim() || newModuleName.trim(),
          year: newModuleYear,
          faculty: newModuleFaculty
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`🎉 Module "${newModuleName}" créé et synchronisé dans Supabase !`);
        setNewModuleName('');
        setNewModuleShort('');
        setModuleModalOpen(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('asmedix-content-updated'));
        }
        fetchData();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.error || 'Erreur lors de la création du module');
      }
    } finally {
      setSavingModule(false);
    }
  };

  const handleDeleteModule = async (id: string, name: string) => {
    if (!confirm(`Supprimer le module "${name}" pour Fiches Flash (sans toucher aux Cours ou QCM) et synchroniser sur Supabase ?`)) return;
    try {
      const res = await fetch('/api/admin/fiches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_module', specialtyIds: [id] })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Module "${name}" supprimé pour Fiches Flash.`);
        setSelectedModuleIds(prev => prev.filter(m => m !== id));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('asmedix-content-updated'));
        }
        fetchData();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleCreateFiche = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !takeaway1) {
      alert('Veuillez remplir au moins le titre et le premier point clé.');
      return;
    }

    const spec = specialtiesList.find(s => s.id === selectedSpec);
    const keyTakeaways = [takeaway1, takeaway2, takeaway3].filter(Boolean);

    const payload = {
      title,
      specialtyId: selectedSpec,
      specialtyName: spec ? spec.name : 'Cardiologie',
      category,
      estimatedReadTime: '4 min',
      keyTakeaways,
      accessLevel: 'FREE',
      htmlContent: htmlContent || '<p>Fiche de synthèse clinique pour révision rapide.</p>'
    };

    const res = await fetch('/api/admin/fiches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      setSuccessMsg('Fiche Flash créée et synchronisée directement dans Supabase !');
      setShowAddForm(false);
      setTitle('');
      setTakeaway1('');
      setTakeaway2('');
      setTakeaway3('');
      setHtmlContent('');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette fiche flash de Supabase et du serveur ?')) return;
    await fetch(`/api/admin/fiches?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  // AI Generator for Flash Back (Fiches Flash)
  const handleRunAiFlashGenerator = async () => {
    if (!aiCourseInput.trim()) {
      alert('Veuillez entrer le nom d\'un cours ou une liste de cours (ex: Insuffisance Cardiaque, HTA, Valvulopathies...).');
      return;
    }

    const apiKeyToUse = aiProvider === 'google_ai_studio'
      ? googleAiKey
      : aiProvider === 'openrouter'
      ? openRouterKey
      : directApiKey;

    setAiExtracting(true);
    try {
      const generatedCards = await aiGenerateFlashcardsFromCourse(
        aiCourseInput.trim(),
        {
          provider: aiProvider,
          apiKey: apiKeyToUse,
          model: selectedAiModel
        },
        {
          specialtyId: aiModuleMode === 'manual' ? aiTargetSpecialty : 'auto'
        }
      );

      let savedCount = 0;
      for (const card of generatedCards) {
        const specObj = specialtiesList.find(s => s.id === card.specialtyId) || specialtiesList.find(s => s.id === 'cardio');

        const payload = {
          title: card.title,
          specialtyId: specObj ? specObj.id : (card.specialtyId || 'cardio'),
          specialtyName: specObj ? specObj.name : card.specialtyName || 'Médecine',
          category: card.category || 'Synthèse Clinique',
          estimatedReadTime: card.estimatedReadTime || '3 min',
          keyTakeaways: card.keyTakeaways,
          accessLevel: 'FREE',
          htmlContent: card.htmlContent
        };

        const res = await fetch('/api/admin/fiches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) savedCount++;
      }

      setSuccessMsg(`🚀 ${savedCount} Fiche(s) Flash générée(s) par l'IA et synchronisée(s) instantanément dans Supabase SQL !`);
      setAiModalOpen(false);
      setAiCourseInput('');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      alert(`Erreur lors de la génération IA des Fiches Flash : ${err.message || 'Erreur inconnue'}`);
    } finally {
      setAiExtracting(false);
    }
  };

  const specFiches = fiches.filter(f => f.specialtyId === selectedSpec);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 dark:text-white flex items-center gap-2">
            <span>⚡ Fiches Flash (Flash Back) & Synthèses par Spécialité</span>
          </h1>
          <p className="text-xs sm:text-sm text-navy-500">
            Cartes de révision ultra-rapides synchronisées en temps réel sur Supabase SQL.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setModuleModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer"
          >
            <Folder className="w-4 h-4" />
            <span>➕ Gérer les Modules</span>
          </button>

          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>🤖 Assistant IA Flash Back</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Fermer le formulaire' : 'Ajouter une Fiche Flash'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Manual Add Form */}
      {showAddForm && (
        <form onSubmit={handleCreateFiche} className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
          <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            <span>Créer une Fiche Mémo sous la spécialité active</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Spécialité / Module :</label>
              <select
                value={selectedSpec}
                onChange={e => setSelectedSpec(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white"
              >
                {specialtiesList.map(s => (
                  <option key={s.id} value={s.id}>{getSpecialtyEmoji(s.id)} {s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Catégorie :</label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="Ex : Urgences, Sémiologie, Thérapeutique"
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Titre de la fiche :</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex : Fiche Réflexe : Diagnostic de l'OAP Cardiogénique"
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 text-xs font-semibold text-navy-900 dark:text-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300">Corps de la Fiche Flash en Code HTML :</label>
              <div className="flex items-center gap-1 bg-navy-100 dark:bg-navy-800 p-1 rounded-lg text-[11px] font-bold">
                <button type="button" onClick={() => setHtmlEditorTab('html')} className={`px-2.5 py-0.5 rounded ${htmlEditorTab === 'html' ? 'bg-white text-brand-600 shadow-sm' : 'text-navy-500'}`}>Code HTML</button>
                <button type="button" onClick={() => setHtmlEditorTab('preview')} className={`px-2.5 py-0.5 rounded ${htmlEditorTab === 'preview' ? 'bg-white text-brand-600 shadow-sm' : 'text-navy-500'}`}>Aperçu</button>
              </div>
            </div>
            {htmlEditorTab === 'html' ? (
              <textarea
                value={htmlContent}
                onChange={e => setHtmlContent(e.target.value)}
                rows={5}
                className="w-full font-mono text-xs px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-navy-900 dark:text-white"
              />
            ) : (
              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 border border-navy-200 text-xs" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300">Points clés à retenir (Bullet points) :</label>
            <input
              type="text"
              value={takeaway1}
              onChange={e => setTakeaway1(e.target.value)}
              placeholder="Point clé 1 (ex: Triade clinique auscultatoire...)"
              className="w-full px-4 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
            />
            <input
              type="text"
              value={takeaway2}
              onChange={e => setTakeaway2(e.target.value)}
              placeholder="Point clé 2 (ex: Traitement par furosémide IV + dérivés nitrés...)"
              className="w-full px-4 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
            />
            <input
              type="text"
              value={takeaway3}
              onChange={e => setTakeaway3(e.target.value)}
              placeholder="Point clé 3 (ex: Contre-indication formelle aux bêtabloquants...)"
              className="w-full px-4 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-navy-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white"
            >
              Enregistrer la fiche dans Supabase
            </button>
          </div>
        </form>
      )}

      {/* Specialty Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {specialtiesList.map(s => {
          const count = fiches.filter(f => f.specialtyId === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSpec(s.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedSpec === s.id
                  ? 'bg-brand-600 text-white shadow-soft'
                  : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:bg-navy-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
              <span>{getSpecialtyEmoji(s.id)} {s.name}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-200 font-black">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Fiches Cards List */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-soft p-6 space-y-4">
        <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <FolderCheck className="w-4 h-4 text-brand-600" />
          <span>Fiches Flash du Module Sélectionné ({specFiches.length})</span>
        </h2>

        {specFiches.length === 0 ? (
          <p className="text-xs text-navy-500 italic text-center py-6">
            Aucune fiche flash enregistrée pour ce module. Utilisez l'assistant IA ou le formulaire ci-dessus pour en ajouter.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specFiches.map(f => (
              <div key={f.id} className="p-4 rounded-2xl border border-navy-100 dark:border-navy-800 bg-navy-50/50 dark:bg-navy-800/40 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-md">
                      {f.category}
                    </span>
                    <h3 className="font-bold text-navy-900 dark:text-white text-xs mt-1">{f.title}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Supprimer la fiche"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {f.keyTakeaways && f.keyTakeaways.length > 0 && (
                  <ul className="text-[11px] text-navy-600 dark:text-navy-300 space-y-1 bg-white dark:bg-navy-900 p-3 rounded-xl border border-navy-100 dark:border-navy-800">
                    {f.keyTakeaways.map((k, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-brand-500 font-bold">•</span>
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODULE MANAGEMENT MODAL */}
      {moduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-navy-900 rounded-3xl max-w-xl w-full border border-navy-200 dark:border-navy-800 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-navy-100 dark:border-navy-800">
              <h3 className="text-base font-bold text-navy-950 dark:text-white flex items-center gap-2">
                <Folder className="w-5 h-5 text-emerald-500" />
                <span>Gestion des Modules & Spécialités</span>
              </h3>
              <button onClick={() => setModuleModalOpen(false)} className="p-1.5 rounded-xl text-navy-400 hover:text-navy-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddModule} className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-3">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">➕ Créer un Nouveau Module</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Nom complet :</label>
                  <input
                    type="text"
                    value={newModuleName}
                    onChange={e => setNewModuleName(e.target.value)}
                    placeholder="ex: Addictologie & Dépendances"
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Nom court :</label>
                  <input
                    type="text"
                    value={newModuleShort}
                    onChange={e => setNewModuleShort(e.target.value)}
                    placeholder="ex: Addicto"
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Année d'étude :</label>
                  <select
                    value={newModuleYear}
                    onChange={e => setNewModuleYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs font-bold"
                  >
                    <option value="1">1ère Année</option>
                    <option value="2">2ème Année</option>
                    <option value="3">3ème Année</option>
                    <option value="4">4ème Année</option>
                    <option value="5">5ème Année</option>
                    <option value="6">6ème Année</option>
                    <option value="none">Transversal (Sans année)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Faculté :</label>
                  <select
                    value={newModuleFaculty}
                    onChange={e => setNewModuleFaculty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs font-bold"
                  >
                    <option value="TOUS">Toutes Facultés (TOUS)</option>
                    <option value="ORAN">Faculté d'Oran</option>
                    <option value="SIDI_BEL_ABBES">Faculté de Sidi Bel Abbès</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={savingModule}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md disabled:opacity-50"
                >
                  {savingModule ? 'Enregistrement...' : 'Créer & Synchroniser Supabase'}
                </button>
              </div>
            </form>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              <div className="flex items-center justify-between pb-2 border-b border-navy-100 dark:border-navy-800">
                <label className="flex items-center gap-2 text-xs font-bold text-navy-800 dark:text-navy-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={specialtiesList.length > 0 && selectedModuleIds.length === specialtiesList.length}
                    onChange={toggleSelectAllModules}
                    className="w-4 h-4 rounded border-navy-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                  <span>Tout Sélectionner ({specialtiesList.length} modules)</span>
                </label>

                {selectedModuleIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteSelectedModules}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer animate-in fade-in"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer ({selectedModuleIds.length})</span>
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {specialtiesList.map(s => (
                  <div key={s.id} className="p-2.5 rounded-xl bg-navy-50 dark:bg-navy-800 flex items-center justify-between gap-2 text-xs">
                    <label className="flex items-center gap-2.5 font-bold text-navy-900 dark:text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedModuleIds.includes(s.id)}
                        onChange={() => toggleSelectModule(s.id)}
                        className="w-4 h-4 rounded border-navy-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                      <span>{getSpecialtyEmoji(s.id)}</span>
                      <span>{s.name}</span>
                      <span className="text-[10px] text-navy-400">({s.year ? `${s.year}e Année` : 'Transversal'})</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDeleteModule(s.id, s.name)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/40 cursor-pointer"
                      title="Supprimer ce module"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI FLASHBACK GENERATOR MODAL */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-navy-900 rounded-3xl max-w-2xl w-full border border-navy-200 dark:border-navy-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-navy-100 dark:border-navy-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-navy-950 dark:text-white flex items-center gap-2">
                    <span>🚀 Assistant IA : Générateur de Fiches Flash (Flash Back)</span>
                  </h3>
                  <p className="text-xs text-navy-500">
                    Entrez un cours ou une liste de cours pour générer des Fiches Flash et les téléverser dans Supabase.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiModalOpen(false)}
                className="p-2 rounded-xl text-navy-400 hover:text-navy-900 dark:hover:text-white hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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

            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-purple-600" />
                  <span>Clé API ({aiProvider === 'google_ai_studio' ? 'Google AI Studio' : aiProvider === 'openrouter' ? 'OpenRouter' : 'Clé API Directe'}) :</span>
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
                  <option value="models/gemini-2.5-flash">⚡ Gemini 2.5 Flash</option>
                  <option value="models/gemini-2.5-pro">🧠 Gemini 2.5 Pro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  Module / Spécialité Cible :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAiModuleMode('auto')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      aiModuleMode === 'auto'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300'
                    }`}
                  >
                    🤖 Auto-Détection
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiModuleMode('manual')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      aiModuleMode === 'manual'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300'
                    }`}
                  >
                    🎯 Manuel
                  </button>
                </div>

                {aiModuleMode === 'manual' && (
                  <select
                    value={aiTargetSpecialty}
                    onChange={e => setAiTargetSpecialty(e.target.value)}
                    className="w-full mt-2 px-3 py-2 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-navy-950 text-xs font-bold text-navy-900 dark:text-white"
                  >
                    {specialtiesList.map(s => (
                      <option key={s.id} value={s.id}>{getSpecialtyEmoji(s.id)} {s.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-navy-800 dark:text-navy-200">
                Saisissez le nom du cours ou une liste de cours (séparés par des virgules ou lignes) :
              </label>
              <textarea
                value={aiCourseInput}
                onChange={e => setAiCourseInput(e.target.value)}
                rows={5}
                placeholder="ex: Insuffisance Cardiaque, HTA Sévère, Valvulopathies Aortique et Mitrale, Embolie Pulmonaire..."
                className="w-full p-3 font-semibold text-xs rounded-2xl border border-purple-300 dark:border-purple-800 bg-purple-50/30 dark:bg-navy-950 text-navy-900 dark:text-white"
              />
              <p className="text-[10px] text-navy-400">
                💡 L'IA générera les Fiches Flash correspondantes et les enregistrera automatiquement dans Supabase.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-100 dark:border-navy-800">
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-navy-600 dark:text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleRunAiFlashGenerator}
                disabled={aiExtracting}
                className="px-6 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {aiExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Génération & Téléversement Supabase en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>🚀 Générer & Téléverser sur Supabase</span>
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

