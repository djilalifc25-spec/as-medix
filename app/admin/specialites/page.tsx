'use client';

import React, { useState, useEffect } from 'react';
import { Specialty, FacultyType, MedicalYear } from '@/types';
import {
  Sparkles, Plus, Search, Trash2, Edit3, Filter, ArrowRight,
  BookOpen, Brain, CheckCircle2, AlertCircle, RefreshCw, X,
  Layers, School, Bookmark, Eye
} from 'lucide-react';

const YEAR_LABELS: Record<MedicalYear, { name: string; cycle: string; badge: string; color: string }> = {
  1: { name: '1ère Année', cycle: 'PCEM 1 - Préclinique', badge: '1ère Année', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  2: { name: '2ème Année', cycle: 'PCEM 2 - Préclinique', badge: '2ème Année', color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' },
  3: { name: '3ème Année', cycle: 'DCEM 1 - Préclinique / Médico-Chir', badge: '3ème Année', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
  4: { name: '4ème Année', cycle: 'DCEM 2 - Pathologies I', badge: '4ème Année', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  5: { name: '5ème Année', cycle: 'DCEM 3 - Pathologies II', badge: '5ème Année', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  6: { name: '6ème Année', cycle: 'DCEM 4 - Urgences & Préparation Concours', badge: '6ème Année', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
};

const COLOR_OPTIONS = [
  '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4',
  '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#BE123C', '#64748B'
];

export default function AdminSpecialitesPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | 'ALL' | 'NONE'>('ALL');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyType | 'TOUS'>('TOUS');
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState<Specialty | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formShortName, setFormShortName] = useState('');
  const [formYear, setFormYear] = useState<MedicalYear | ''>('');
  const [formFaculty, setFormFaculty] = useState<FacultyType>('TOUS');
  const [formColor, setFormColor] = useState('#3B82F6');
  const [formDescription, setFormDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/specialties');
      const data = await res.json();
      if (data.success && Array.isArray(data.specialties)) {
        setSpecialties(data.specialties);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Erreur de chargement des spécialités' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const openCreateModal = () => {
    setEditingSpec(null);
    setFormName('');
    setFormShortName('');
    setFormYear(selectedYear !== 'ALL' && selectedYear !== 'NONE' ? (selectedYear as MedicalYear) : '');
    setFormFaculty(selectedFaculty !== 'TOUS' ? selectedFaculty : 'TOUS');
    setFormColor('#3B82F6');
    setFormDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (spec: Specialty) => {
    setEditingSpec(spec);
    setFormName(spec.name);
    setFormShortName(spec.shortName || spec.name);
    setFormYear(spec.year !== undefined ? spec.year : '');
    setFormFaculty(spec.faculty || 'TOUS');
    setFormColor(spec.color || '#3B82F6');
    setFormDescription(spec.description || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFeedback({ type: 'error', message: 'Le nom de la spécialité est obligatoire' });
      return;
    }

    setSaving(true);
    try {
      const yearPayload = formYear !== '' ? Number(formYear) : null;
      if (editingSpec) {
        // PUT
        const res = await fetch('/api/admin/specialties', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingSpec.id,
            name: formName,
            shortName: formShortName,
            year: yearPayload,
            faculty: formFaculty,
            color: formColor,
            description: formDescription,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Erreur lors de la modification');

        setSpecialties(prev => prev.map(s => s.id === editingSpec.id ? data.specialty : s));
        setFeedback({ type: 'success', message: `Spécialité "${formName}" mise à jour avec succès !` });
      } else {
        // POST
        const res = await fetch('/api/admin/specialties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            shortName: formShortName,
            year: yearPayload,
            faculty: formFaculty,
            color: formColor,
            description: formDescription,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Erreur lors de la création');

        setSpecialties(prev => [data.specialty, ...prev]);
        setFeedback({ type: 'success', message: `Nouvelle spécialité "${formName}" ajoutée avec succès ${yearPayload ? `(Année ${yearPayload})` : '(Sans année)'} !` });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/admin/specialties?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Erreur lors de la suppression');

      setSpecialties(prev => prev.filter(s => s.id !== id && s.slug !== id));
      setDeleteConfirmId(null);
      setFeedback({ type: 'success', message: `Spécialité "${name}" supprimée avec succès.` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleQuickYearChange = async (spec: Specialty, newYear: MedicalYear | 'NONE') => {
    try {
      const yearVal = newYear === 'NONE' ? null : Number(newYear);
      const res = await fetch('/api/admin/specialties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: spec.id, year: yearVal }),
      });
      const data = await res.json();
      if (data.success) {
        setSpecialties(prev => prev.map(s => s.id === spec.id ? { ...s, year: yearVal ? yearVal as MedicalYear : undefined } : s));
        setFeedback({ type: 'success', message: `"${spec.name}" mis à jour (${newYear === 'NONE' ? 'Sans année' : `${newYear}e Année`})` });
      }
    } catch {}
  };

  // Filter list
  const filteredSpecialties = specialties.filter(spec => {
    const matchesYear = selectedYear === 'ALL'
      ? true
      : selectedYear === 'NONE'
        ? !spec.year
        : spec.year === selectedYear;
    const matchesFaculty = selectedFaculty === 'TOUS' || !spec.faculty || spec.faculty === 'TOUS' || spec.faculty === selectedFaculty;
    const matchesSearch = !search ||
      spec.name.toLowerCase().includes(search.toLowerCase()) ||
      spec.shortName.toLowerCase().includes(search.toLowerCase()) ||
      spec.description.toLowerCase().includes(search.toLowerCase());
    return matchesYear && matchesFaculty && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              Cursus Médical Algérien
            </span>
            <span className="text-xs font-semibold text-navy-400">
              6 Années d Études • Oran & Sidi Bel Abbès
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
            Gestion des 6 Années & Spécialités
          </h1>
          <p className="text-xs sm:text-sm text-navy-500 max-w-2xl">
            Organisez les modules par année médicale (1ère à 6ème année), isolez par faculté (Oran / SBA), modifiez ou supprimez des spécialités en toute sécurité.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={openCreateModal}
            className="px-5 py-3 rounded-full bg-[#6e56cf] hover:bg-[#7c3aed] text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nouvelle Spécialité</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
          feedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
            : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Year Selector Tabs */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-navy-400 uppercase tracking-wider block">
          Filtrer par Année d Études :
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedYear('ALL')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              selectedYear === 'ALL'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white dark:bg-navy-900 text-navy-600 dark:text-navy-300 border border-navy-200 dark:border-navy-700 hover:border-brand-500'
            }`}
          >
            Toutes les Années ({specialties.length})
          </button>
          {([1, 2, 3, 4, 5, 6] as MedicalYear[]).map((y) => {
            const count = specialties.filter(s => s.year === y).length;
            const meta = YEAR_LABELS[y];
            return (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedYear === y
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-white dark:bg-navy-900 text-navy-600 dark:text-navy-300 border border-navy-200 dark:border-navy-700 hover:border-brand-500'
                }`}
              >
                <span>{meta.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  selectedYear === y ? 'bg-white/20 text-white' : 'bg-navy-100 dark:bg-navy-800 text-navy-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
          {/* Sans Année / Transversales */}
          <button
            onClick={() => setSelectedYear('NONE')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedYear === 'NONE'
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white dark:bg-navy-900 text-navy-600 dark:text-navy-300 border border-navy-200 dark:border-navy-700 hover:border-brand-500'
            }`}
          >
            <span>🌐 Sans Année</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              selectedYear === 'NONE' ? 'bg-white/20 text-white' : 'bg-navy-100 dark:bg-navy-800 text-navy-500'
            }`}>
              {specialties.filter(s => !s.year).length}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Faculty Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Faculty Pills */}
        <div className="inline-flex p-1 rounded-2xl bg-navy-100 dark:bg-navy-800/80 border border-navy-200 dark:border-navy-700 text-xs font-bold">
          <button
            onClick={() => setSelectedFaculty('TOUS')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedFaculty === 'TOUS' ? 'bg-white dark:bg-navy-900 text-brand-600 shadow-xs' : 'text-navy-500'
            }`}
          >
            Toutes Facultés
          </button>
          <button
            onClick={() => setSelectedFaculty('ORAN')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedFaculty === 'ORAN' ? 'bg-amber-500 text-white shadow-xs' : 'text-navy-500'
            }`}
          >
            Faculté d Oran
          </button>
          <button
            onClick={() => setSelectedFaculty('SIDI_BEL_ABBES')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedFaculty === 'SIDI_BEL_ABBES' ? 'bg-emerald-600 text-white shadow-xs' : 'text-navy-500'
            }`}
          >
            Faculté Sidi Bel Abbès
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un module, une spécialité..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* 3. Specialties Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-navy-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-500" />
          <span className="text-xs">Chargement du cursus médical...</span>
        </div>
      ) : filteredSpecialties.length === 0 ? (
        <div className="apple-card p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-navy-300 dark:text-navy-600 mx-auto" />
          <h3 className="text-sm font-bold text-navy-900 dark:text-white">Aucune spécialité trouvée</h3>
          <p className="text-xs text-navy-400">Essayez de modifier vos filtres ou ajoutez une nouvelle spécialité.</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-full bg-brand-600 text-white text-xs font-bold hover:bg-brand-700"
          >
            + Créer pour cette sélection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSpecialties.map((spec) => {
            const yearInfo = spec.year ? YEAR_LABELS[spec.year as MedicalYear] : null;
            return (
              <div
                key={spec.id}
                className="apple-card p-5 relative overflow-hidden group hover:border-brand-400 dark:hover:border-brand-600 transition-all flex flex-col justify-between"
              >
                {/* Color highlight bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: spec.color || '#3B82F6' }}
                />

                <div className="space-y-3">
                  {/* Header badges */}
                  <div className="flex items-center justify-between gap-2">
                    {yearInfo ? (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${yearInfo.color}`}>
                        {yearInfo.badge}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10">
                        🌐 Sans Année
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      {spec.faculty && spec.faculty !== 'TOUS' ? (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          spec.faculty === 'ORAN'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {spec.faculty === 'ORAN' ? 'Oran' : 'SBA'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-navy-100 dark:bg-navy-800 text-navy-500">
                          Commune
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Short Name */}
                  <div>
                    <h3 className="text-base font-bold text-navy-950 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {spec.name}
                    </h3>
                    <span className="text-xs font-semibold text-navy-400">
                      Code : {spec.shortName || spec.id}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-navy-500 line-clamp-2 leading-relaxed">
                    {spec.description || 'Aucune description saisie pour ce module.'}
                  </p>

                  {/* Stats Count */}
                  <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-navy-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      {spec.totalCourses || 0} cours
                    </span>
                    <span className="flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5 text-purple-500" />
                      {spec.totalQcms || 0} QCM
                    </span>
                  </div>
                </div>

                {/* Footer Controls: Quick Year Mover & Action Buttons */}
                <div className="mt-4 pt-3 border-t border-navy-100 dark:border-navy-800/80 flex items-center justify-between gap-2">
                  {/* Quick Year Changer */}
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold text-navy-400">Année :</span>
                    <select
                      value={spec.year || ''}
                      onChange={(e) => handleQuickYearChange(spec, e.target.value ? (parseInt(e.target.value, 10) as MedicalYear) : 'NONE')}
                      className="px-2 py-1 rounded-lg text-xs font-bold bg-navy-50 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 focus:outline-none"
                    >
                      <option value="">Sans année</option>
                      <option value={1}>1ère</option>
                      <option value={2}>2ème</option>
                      <option value={3}>3ème</option>
                      <option value={4}>4ème</option>
                      <option value={5}>5ème</option>
                      <option value={6}>6ème</option>
                    </select>
                  </div>

                  {/* Edit and Delete Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(spec)}
                      className="p-1.5 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800 text-navy-600 dark:text-navy-300 transition-colors"
                      title="Modifier cette spécialité"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {deleteConfirmId === spec.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(spec.id, spec.name)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 transition-colors shadow-xs"
                        >
                          Confirmer Suppr.
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="p-1 rounded-lg bg-navy-100 dark:bg-navy-800 text-navy-500 text-[10px]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(spec.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 hover:text-rose-600 transition-colors"
                        title="Supprimer cette spécialité"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. MODAL: Create / Edit Specialty */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="apple-card max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-navy-100 dark:border-navy-800">
              <h2 className="text-lg font-bold text-navy-950 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <span>{editingSpec ? 'Modifier la Spécialité' : 'Nouvelle Spécialité Médicale'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-800 text-navy-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-navy-700 dark:text-navy-300 uppercase mb-1">
                  Nom Complet du Module / Spécialité *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ex : Cardiologie & Vasculaire ou Anatomie I"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-navy-700 dark:text-navy-300 uppercase mb-1">
                    Nom Court (Abréviation)
                  </label>
                  <input
                    type="text"
                    value={formShortName}
                    onChange={(e) => setFormShortName(e.target.value)}
                    placeholder="ex : Cardio, Anat I"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-navy-700 dark:text-navy-300 uppercase mb-1">
                    Année d Études (Optionnel)
                  </label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value ? (parseInt(e.target.value, 10) as MedicalYear) : '')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-xs font-bold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">🌐 Sans année / Module Transversal</option>
                    <option value={1}>1ère Année (PCEM1)</option>
                    <option value={2}>2ème Année (PCEM2)</option>
                    <option value={3}>3ème Année (DCEM1)</option>
                    <option value={4}>4ème Année (DCEM2)</option>
                    <option value={5}>5ème Année (DCEM3)</option>
                    <option value={6}>6ème Année (DCEM4)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-navy-700 dark:text-navy-300 uppercase mb-1">
                  Faculté Assignée
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormFaculty('TOUS')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      formFaculty === 'TOUS'
                        ? 'bg-brand-50 dark:bg-brand-950 border-brand-500 text-brand-600'
                        : 'border-navy-200 dark:border-navy-700 text-navy-500'
                    }`}
                  >
                    Toutes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormFaculty('ORAN')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      formFaculty === 'ORAN'
                        ? 'bg-amber-50 dark:bg-amber-950 border-amber-500 text-amber-600'
                        : 'border-navy-200 dark:border-navy-700 text-navy-500'
                    }`}
                  >
                    Oran
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormFaculty('SIDI_BEL_ABBES')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      formFaculty === 'SIDI_BEL_ABBES'
                        ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-600'
                        : 'border-navy-200 dark:border-navy-700 text-navy-500'
                    }`}
                  >
                    Sidi Bel Abbès
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-navy-700 dark:text-navy-300 uppercase mb-1">
                  Couleur Thématique
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        formColor === c ? 'scale-125 ring-2 ring-brand-500 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-navy-700 dark:text-navy-300 uppercase mb-1">
                  Description du Module
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Points clés, objectifs d examen, etc."
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-100 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 text-navy-600 dark:text-navy-300 font-bold hover:bg-navy-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#6e56cf] hover:bg-[#7c3aed] text-white font-bold shadow-md shadow-brand-500/20 active:scale-95 transition-all"
                >
                  {saving ? 'Enregistrement...' : editingSpec ? 'Enregistrer les Modifications' : 'Créer la Spécialité'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
