'use client';

import React, { useState, useEffect } from 'react';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { CATProtocol, Course } from '@/types';
import {
  ShieldAlert, Plus, Trash2, CheckCircle2, Brain, Sparkles, Key,
  Link as LinkIcon, FileText, X, Loader2, Filter, Eye, Folder, Layers, BookOpen
} from 'lucide-react';
import { aiAnalyzeAndFormatCAT, AIProviderType } from '@/lib/ai/openrouter';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';

export default function AdminCatPage() {
  const [protocols, setProtocols] = useState<CATProtocol[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('all');
  const [searchQueryFilter, setSearchQueryFilter] = useState<string>('');

  // Form states (Manual mode)
  const [specialtyId, setSpecialtyId] = useState('cardio');
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'Urgence Vitale' | 'Urgence Relative' | 'Prise en charge réglée'>('Urgence Vitale');
  const [summary, setSummary] = useState('');
  const [conduiteHtml, setConduiteHtml] = useState('<div class="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200"><h4 class="font-bold text-rose-300">1. Alerte Immédiate UMC</h4><p>Mise en condition VVP, scope ECG, SaO2 et position demi-assise...</p></div>');
  const [activeTab, setActiveTab] = useState<'html' | 'preview'>('html');
  const [conduite1, setConduite1] = useState('');
  const [traitement1, setTraitement1] = useState('');
  const [redFlag1, setRedFlag1] = useState('');
  const [pearl1, setPearl1] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // AI Assistant Modal States
  const [aiCatModalOpen, setAiCatModalOpen] = useState(false);
  const [aiProvider, setAiProvider] = useState<AIProviderType>('google_ai_studio');
  const [googleAiKey, setGoogleAiKey] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [directApiKey, setDirectApiKey] = useState('');
  const [selectedAiModel, setSelectedAiModel] = useState('models/gemini-2.5-flash');
  const [aiInputType, setAiInputType] = useState<'disease_name' | 'drive_pdf' | 'raw_text'>('disease_name');
  const [aiDiseaseName, setAiDiseaseName] = useState('');
  const [aiPdfUrl, setAiPdfUrl] = useState('');
  const [aiRawInput, setAiRawInput] = useState('');
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
  const [specialtiesList, setSpecialtiesList] = useState(ALL_SPECIALTIES);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resCat, resCourses, resSpecs] = await Promise.all([
        fetch('/api/admin/cat').then(r => r.json()),
        fetch('/api/admin/courses').then(r => r.json()),
        fetch('/api/admin/specialties').then(r => r.json()).catch(() => null)
      ]);
      if (resCat.protocols) setProtocols(resCat.protocols);
      if (resCourses.courses) setCourses(resCourses.courses);
      if (resSpecs && resSpecs.specialties && Array.isArray(resSpecs.specialties)) {
        setSpecialtiesList(resSpecs.specialties);
      }
    } catch (e) {
      console.error('Fetch CAT error:', e);
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
    if (!confirm(`Supprimer le module "${name}" et le synchroniser sur Supabase ?`)) return;
    try {
      const res = await fetch(`/api/admin/specialties?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Module "${name}" supprimé.`);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) {
      alert('Veuillez remplir le titre et le résumé.');
      return;
    }

    const spec = specialtiesList.find(s => s.id === specialtyId);

    const payload = {
      title,
      specialtyId,
      specialtyName: spec ? spec.name : 'Urgences',
      urgencyLevel,
      summary,
      conduiteHtml,
      evaluationInitiale: ['Constantes vitales (PA, FC, SpO2, FR, Glycémie)', 'Recherche des signes de détresse d\'organe'],
      conduiteImmediate: [conduite1 || 'Position demi-assise, pose de voie veineuse de bon calibre, oxygène si besoin'],
      traitementSpecifique: [traitement1 || 'Traitement étiologique d\'urgence codifié'],
      redFlags: [redFlag1 || 'Ne jamais retarder le geste de désobstruction ou l\'avis réanimateur'],
      clinicalPearls: [pearl1 || 'Surveillance hémodynamique et gazométrique continue'],
      orientation: 'Service d\'Accueil des Urgences ou Soins Intensifs'
    };

    const res = await fetch('/api/admin/cat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      setSuccessMsg('Protocole CAT enregistré avec succès !');
      setShowAddForm(false);
      setTitle('');
      setSummary('');
      setConduite1('');
      setTraitement1('');
      setRedFlag1('');
      setPearl1('');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDelete = async (id: string, title?: string) => {
    if (!confirm(`Supprimer définitivement le protocole CAT "${title || id}" ?`)) return;
    await fetch(`/api/admin/cat?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  // AI Extractor Execution Handler
  const handleRunAiCatExtract = async () => {
    let sourceContent = '';
    if (aiInputType === 'disease_name') {
      if (!aiDiseaseName.trim()) {
        alert('Veuillez saisir le nom de la maladie / pathologie (ex: Angor instable, OAP, Embolie pulmonaire, SDRA, AVC ischémique...).');
        return;
      }
      sourceContent = `Nom de la maladie / pathologie : ${aiDiseaseName.trim()}`;
    } else if (aiInputType === 'drive_pdf') {
      if (!aiPdfUrl.trim()) {
        alert('Veuillez coller le lien Google Drive ou l\'URL du fichier PDF de la Conduite à Tenir.');
        return;
      }
      sourceContent = `Document PDF CAT d'Urgence : ${aiPdfUrl.trim()}`;
    } else {
      if (!aiRawInput.trim()) {
        alert('Veuillez coller le texte brut du protocole de Conduite à Tenir (CAT).');
        return;
      }
      sourceContent = aiRawInput.trim();
    }

    const apiKeyToUse = aiProvider === 'google_ai_studio'
      ? googleAiKey
      : aiProvider === 'openrouter'
      ? openRouterKey
      : directApiKey;

    setAiExtracting(true);
    try {
      const extracted = await aiAnalyzeAndFormatCAT(
        sourceContent,
        {
          provider: aiProvider,
          apiKey: apiKeyToUse,
          model: selectedAiModel
        },
        {
          specialtyId: aiModuleMode === 'manual' ? aiTargetSpecialty : 'auto'
        }
      );

      // Auto-fill form and create protocol
      const specObj = specialtiesList.find(s => s.id === extracted.specialtyId) || specialtiesList.find(s => s.id === 'urgences');

      const payload = {
        title: extracted.title,
        specialtyId: specObj ? specObj.id : (extracted.specialtyId || 'urgences'),
        specialtyName: specObj ? specObj.name : extracted.specialtyName || 'Urgences',
        urgencyLevel: extracted.urgencyLevel || 'Urgence Vitale',
        summary: extracted.summary,
        conduiteHtml: extracted.conduiteHtml,
        evaluationInitiale: extracted.evaluationInitiale,
        conduiteImmediate: extracted.conduiteImmediate,
        traitementSpecifique: extracted.traitementSpecifique,
        redFlags: extracted.redFlags,
        clinicalPearls: extracted.clinicalPearls,
        orientation: 'Service d\'Accueil des Urgences ou Soins Intensifs'
      };

      const res = await fetch('/api/admin/cat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(`🚀 Protocole CAT "${extracted.title}" généré avec succès 100% réel et affecté au module ${specObj ? specObj.name : 'Urgences'} !`);
        setAiCatModalOpen(false);
        setAiDiseaseName('');
        setAiPdfUrl('');
        setAiRawInput('');
        fetchData();
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    } catch (err: any) {
      alert(`Erreur lors de l'extraction IA : ${err.message || 'Erreur inconnue'}`);
    } finally {
      setAiExtracting(false);
    }
  };

  const filteredCourses = courses.filter(c => c.specialtyId === specialtyId);

  // Filter Active Protocols List
  const filteredProtocols = protocols.filter(p => {
    if (selectedSpecialtyFilter !== 'all' && p.specialtyId !== selectedSpecialtyFilter) {
      return false;
    }
    if (searchQueryFilter.trim()) {
      const q = searchQueryFilter.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSummary = (p.summary || '').toLowerCase().includes(q);
      const matchSpec = (p.specialtyName || '').toLowerCase().includes(q);
      return matchTitle || matchSummary || matchSpec;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 dark:text-white flex items-center gap-2">
            <span>🛡️ Conduites À Tenir (CAT) par Spécialité & Module</span>
          </h1>
          <p className="text-xs sm:text-sm text-navy-500">
            Arbres décisionnels d'urgence, protocoles colorés, drapeaux rouges et perles de réanimation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setAiCatModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>🤖 Assistant IA Extrakteur CAT</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white shadow-soft cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Fermer le formulaire' : 'Ajouter un Protocole CAT'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Manual Creation Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
          <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>Nouveau Protocole CAT Urgence (Saisie Manuelle)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Spécialité / Module :</label>
              <select
                value={specialtyId}
                onChange={e => setSpecialtyId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 text-xs font-bold"
              >
                {ALL_SPECIALTIES.map(s => (
                  <option key={s.id} value={s.id}>{getSpecialtyEmoji(s.id)} {s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Cours Concerné (Optionnel) :</label>
              <select
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 text-xs font-semibold"
              >
                <option value="">-- Protocole général de spécialité --</option>
                {filteredCourses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Niveau d'Urgence :</label>
              <select
                value={urgencyLevel}
                onChange={e => setUrgencyLevel(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 text-xs font-bold text-rose-600"
              >
                <option value="Urgence Vitale">Urgence Vitale (Extrême)</option>
                <option value="Urgence Relative">Urgence Relative</option>
                <option value="Prise en charge réglée">Prise en charge réglée</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Titre de la CAT :</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex : Conduite à tenir devant un Choc Anaphylactique"
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 text-xs font-bold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300">Protocole CAT Complet en HTML :</label>
              <div className="flex items-center gap-1 bg-navy-100 dark:bg-navy-800 p-1 rounded-lg text-[11px] font-bold">
                <button type="button" onClick={() => setActiveTab('html')} className={`px-2.5 py-0.5 rounded ${activeTab === 'html' ? 'bg-white text-brand-600 shadow-sm' : 'text-navy-500'}`}>Code HTML</button>
                <button type="button" onClick={() => setActiveTab('preview')} className={`px-2.5 py-0.5 rounded ${activeTab === 'preview' ? 'bg-white text-brand-600 shadow-sm' : 'text-navy-500'}`}>Aperçu</button>
              </div>
            </div>
            {activeTab === 'html' ? (
              <textarea
                value={conduiteHtml}
                onChange={e => setConduiteHtml(e.target.value)}
                rows={5}
                className="w-full font-mono text-xs px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800"
              />
            ) : (
              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 border border-navy-200 text-xs" dangerouslySetInnerHTML={{ __html: conduiteHtml }} />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Résumé & Définition de l'urgence :</label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={2}
              placeholder="Définition, mécanismes et critères de prise en charge immédiate..."
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Conduite Immédiate :</label>
              <input
                type="text"
                value={conduite1}
                onChange={e => setConduite1(e.target.value)}
                placeholder="Ex: Arrêt immédiat de l'allergène, décubitus dorsal"
                className="w-full px-4 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Traitement Spécifique :</label>
              <input
                type="text"
                value={traitement1}
                onChange={e => setTraitement1(e.target.value)}
                placeholder="Ex: Adrénaline IM 0.5 mg"
                className="w-full px-4 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-rose-700 mb-1">⚠️ Drapeau Rouge :</label>
              <input
                type="text"
                value={redFlag1}
                onChange={e => setRedFlag1(e.target.value)}
                placeholder="Ex: Ne JAMAIS donner de corticoïdes en monothérapie initiale"
                className="w-full px-4 py-2 rounded-xl border border-rose-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-brand-700 mb-1">💡 Perle Clinique :</label>
              <input
                type="text"
                value={pearl1}
                onChange={e => setPearl1(e.target.value)}
                placeholder="Ex: Surveillance au moins 24h pour le risque de rebond"
                className="w-full px-4 py-2 rounded-xl border border-brand-200 text-xs"
              />
            </div>
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
              Enregistrer le protocole
            </button>
          </div>
        </form>
      )}

      {/* Specialty Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-navy-900 dark:text-white">
            <Filter className="w-4 h-4 text-brand-500" />
            <span>Filtres par Module & Recherche :</span>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-brand-500/10 text-brand-600 dark:bg-brand-950 dark:text-brand-300 text-xs font-bold">
            📊 {filteredProtocols.length} protocole(s) CAT affiché(s)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-black uppercase text-navy-500 dark:text-navy-400 mb-1">
              📌 Sélectionner le Module / Spécialité :
            </label>
            <select
              value={selectedSpecialtyFilter}
              onChange={e => setSelectedSpecialtyFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs font-bold text-navy-900 dark:text-white"
            >
              <option value="all">🌐 Tous les Modules de Spécialités</option>
              {ALL_SPECIALTIES.map(s => (
                <option key={s.id} value={s.id}>{getSpecialtyEmoji(s.id)} {s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-navy-500 dark:text-navy-400 mb-1">
              🔍 Recherche Mot-Clé :
            </label>
            <input
              type="text"
              value={searchQueryFilter}
              onChange={e => setSearchQueryFilter(e.target.value)}
              placeholder="ex: Angor, AVC, Choc, Adrénaline..."
              className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-navy-900 dark:text-white font-bold placeholder:font-normal"
            />
          </div>
        </div>
      </div>

      {/* Protocols List by Specialty */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-soft p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-500" />
            <span>Protocoles CAT Actifs ({filteredProtocols.length})</span>
          </h2>
        </div>

        {filteredProtocols.length === 0 ? (
          <div className="p-8 text-center space-y-2 text-navy-500 text-xs font-bold">
            <div>🔍</div>
            <p>Aucun protocole CAT ne correspond à vos filtres actuels.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProtocols.map(p => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-navy-50/70 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-800 flex items-start justify-between gap-4 transition-all hover:border-brand-500/40"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500/10 text-rose-600 border border-rose-500/20">
                      {p.urgencyLevel}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/50">
                      {getSpecialtyEmoji(p.specialtyId)} {p.specialtyName || p.specialtyId}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-navy-900 dark:text-white">{p.title}</h3>
                  <p className="text-xs text-navy-500 line-clamp-2">{p.summary}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id, p.title)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Supprimer ce protocole du module"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI CAT EXTRACTOR MODAL */}
      {aiCatModalOpen && (
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
                    <span>🚀 Assistant IA : Extrakteur Conduite à Tenir (CAT)</span>
                  </h3>
                  <p className="text-xs text-navy-500">
                    Transformez 100% du PDF / lien de protocole d'urgence en une présentation HTML colorée avec enrichissement IA.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiCatModalOpen(false)}
                className="p-2 rounded-xl text-navy-400 hover:text-navy-900 dark:hover:text-white hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors cursor-pointer"
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

            {/* Model Selector & Specialty Assignment Mode */}
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
                      <option value="models/gemini-2.0-flash">🚀 Gemini 2.0 Flash (Next-Gen Multimodal Rapide)</option>
                      <option value="models/gemini-1.5-pro">📚 Gemini 1.5 Pro</option>
                    </>
                  )}
                  {aiProvider === 'openrouter' && (
                    <>
                      <option value="google/gemini-2.5-flash">⚡ Google Gemini 2.5 Flash (Recommandé)</option>
                      <option value="google/gemini-2.5-pro">🧠 Google Gemini 2.5 Pro</option>
                      <option value="deepseek/deepseek-chat">DeepSeek Chat V3</option>
                      <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
                    </>
                  )}
                  {aiProvider === 'deepseek' && (
                    <option value="deepseek-chat">DeepSeek Chat (V3)</option>
                  )}
                  {aiProvider === 'codecraft' && (
                    <option value="codecraft-v1">CodeCraft AI Engine</option>
                  )}
                  {aiProvider === 'openai' && (
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                  )}
                  {aiProvider === 'anthropic' && (
                    <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
                  Mode Affectation Module / Spécialité :
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
                    🎯 Sélection Manuelle
                  </button>
                </div>

                {aiModuleMode === 'manual' && (
                  <select
                    value={aiTargetSpecialty}
                    onChange={e => setAiTargetSpecialty(e.target.value)}
                    className="w-full mt-2 px-3 py-2 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-navy-950 text-xs font-bold text-navy-900 dark:text-white"
                  >
                    {ALL_SPECIALTIES.map(s => (
                      <option key={s.id} value={s.id}>{getSpecialtyEmoji(s.id)} {s.name}</option>
                    ))}
                  </select>
                )}
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
                  <span>Lien Google Drive / URL PDF CAT</span>
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
                  <span>Coller le Texte Brut de la CAT</span>
                </button>
              </div>

              {aiInputType === 'drive_pdf' ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-navy-800 dark:text-navy-200">
                    Coller le lien Google Drive ou PDF du protocole d'urgence :
                  </label>
                  <input
                    type="url"
                    value={aiPdfUrl}
                    onChange={e => setAiPdfUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/17y_1uazhDFMj6Xp.../view"
                    className="w-full px-4 py-2.5 text-xs font-mono rounded-2xl border border-purple-300 dark:border-purple-800 bg-purple-50/30 dark:bg-navy-950 focus:border-purple-600 text-navy-900 dark:text-white"
                  />
                  <p className="text-[10px] text-navy-400">
                    💡 L'IA extraira 100% des détails, génèrera la présentation HTML colorée et enrichira les explications cliniques.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-navy-800 dark:text-navy-200">
                    Coller le contenu texte brut du protocole de garde :
                  </label>
                  <textarea
                    value={aiRawInput}
                    onChange={e => setAiRawInput(e.target.value)}
                    rows={6}
                    placeholder="CAT devant un Angor Instable : 1. Repos, VVP, O2... 2. Aspirine 300mg, Heparine..."
                    className="w-full p-3 font-mono text-xs rounded-2xl border border-navy-200 dark:border-navy-800 bg-white dark:bg-navy-950 text-navy-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-100 dark:border-navy-800">
              <button
                type="button"
                onClick={() => setAiCatModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-navy-600 dark:text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleRunAiCatExtract}
                disabled={aiExtracting}
                className="px-6 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-700 hover:to-brand-700 text-white shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {aiExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Génération IA & Enrichissement en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>🚀 Démarrer l'Extraction IA de la CAT</span>
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
