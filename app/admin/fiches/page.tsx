'use client';

import React, { useState, useEffect } from 'react';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { Fiche } from '@/types';
import { FileText, Plus, Trash2, CheckCircle2, FolderCheck } from 'lucide-react';

export default function AdminFichesPage() {
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [selectedSpec, setSelectedSpec] = useState<string>('cardio');
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Diagnostic & Sémiologie');
  const [takeaway1, setTakeaway1] = useState('');
  const [takeaway2, setTakeaway2] = useState('');
  const [takeaway3, setTakeaway3] = useState('');
  const [htmlContent, setHtmlContent] = useState('<div class="space-y-3"><h3 class="font-bold text-navy-900">Points Clés</h3><ul><li>Critère diagnostique majeur...</li></ul></div>');
  const [htmlEditorTab, setHtmlEditorTab] = useState<'html' | 'preview'>('html');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchFiches();
  }, []);

  const fetchFiches = async () => {
    const res = await fetch('/api/admin/fiches').then(r => r.json());
    if (res.fiches) setFiches(res.fiches);
  };

  const handleCreateFiche = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !takeaway1) {
      alert('Veuillez remplir au moins le titre et le premier point clé.');
      return;
    }

    const spec = ALL_SPECIALTIES.find(s => s.id === selectedSpec);
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
      setSuccessMsg('Fiche flash ajoutée avec succès sous la spécialité !');
      setShowAddForm(false);
      setTitle('');
      setTakeaway1('');
      setTakeaway2('');
      setTakeaway3('');
      setHtmlContent('');
      fetchFiches();
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette fiche ?')) return;
    await fetch(`/api/admin/fiches?id=${id}`, { method: 'DELETE' });
    fetchFiches();
  };

  const specFiches = fiches.filter(f => f.specialtyId === selectedSpec);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 dark:text-white">
            Gestion des Fiches de Révision Flash
          </h1>
          <p className="text-xs sm:text-sm text-navy-500">
            Structure ordonnée par spécialité médicale pour éviter toute anarchie.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Fermer le formulaire' : 'Ajouter une Fiche Flash'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleCreateFiche} className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
          <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            <span>Créer une Fiche Mémo sous la spécialité active</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Spécialité :</label>
              <select
                value={selectedSpec}
                onChange={e => setSelectedSpec(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 text-xs font-bold"
              >
                {ALL_SPECIALTIES.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
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
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 text-xs"
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
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 text-xs font-semibold"
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
                className="w-full font-mono text-xs px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800"
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
              className="w-full px-4 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs"
            />
            <input
              type="text"
              value={takeaway2}
              onChange={e => setTakeaway2(e.target.value)}
              placeholder="Point clé 2 (ex: Traitement par furosémide IV + dérivés nitrés...)"
              className="w-full px-4 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs"
            />
            <input
              type="text"
              value={takeaway3}
              onChange={e => setTakeaway3(e.target.value)}
              placeholder="Point clé 3 (ex: Contre-indication formelle aux bêtabloquants...)"
              className="w-full px-4 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Contenu HTML d'approfondissement (Optionnel) :</label>
            <textarea
              value={htmlContent}
              onChange={e => setHtmlContent(e.target.value)}
              rows={3}
              placeholder="<p>Tableaux récapitulatifs, algorithmes...</p>"
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 text-xs font-mono"
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
              Enregistrer la fiche
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ALL_SPECIALTIES.map(s => {
          const count = fiches.filter(f => f.specialtyId === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSpec(s.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedSpec === s.id
                  ? 'bg-brand-600 text-white shadow-soft'
                  : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:bg-navy-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></span>
              <span>{s.name}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-200">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-soft p-6 space-y-4">
        <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <FolderCheck className="w-4 h-4 text-brand-600" />
          <span>Fiches de la spécialité sélectionnée ({specFiches.length})</span>
        </h2>

        {specFiches.length === 0 ? (
          <div className="p-8 text-center text-xs text-navy-400">
            Aucune fiche flash pour le moment dans cette spécialité. Cliquez sur "Ajouter une Fiche Flash" pour l'enrichir.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specFiches.map(f => (
              <div
                key={f.id}
                className="p-5 rounded-2xl bg-navy-50/70 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-800 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      {f.category}
                    </span>
                    <span className="text-[11px] text-navy-400">{f.estimatedReadTime}</span>
                  </div>
                  <h3 className="font-bold text-sm text-navy-900 dark:text-white">{f.title}</h3>
                  <ul className="text-xs space-y-1 text-navy-600 dark:text-navy-300">
                    {f.keyTakeaways.map((t, idx) => (
                      <li key={idx}>• {t}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-navy-100 dark:border-navy-700 flex justify-end">
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
