'use client';

import React, { useState, useEffect } from 'react';
import { ECGRecord } from '@/types';
import { Activity, Plus, Trash2, CheckCircle2, Code, Eye, Star } from 'lucide-react';

export default function AdminEcgPage() {
  const [records, setRecords] = useState<ECGRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Trouble du rythme' | 'Ischémie' | 'Conduction' | 'Urgence'>('Trouble du rythme');
  const [clinicalContext, setClinicalContext] = useState('');
  const [difficulty, setDifficulty] = useState<'Débutant' | 'Intermédiaire' | 'Expert'>('Débutant');
  const [isDailyChallenge, setIsDailyChallenge] = useState(true);
  const [svgHtml, setSvgHtml] = useState(`<svg viewBox="0 0 800 200" class="w-full h-40 bg-navy-950 rounded-xl">
  <!-- Grille ECG millimétrée standard -->
  <defs>
    <pattern id="ecgGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="none" stroke="#1e293b" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#ecgGrid)" />
  <!-- Tracé ECG interactif -->
  <path d="M 0 100 L 50 100 L 60 85 L 70 100 L 90 100 L 95 110 L 105 30 L 115 130 L 125 100 L 140 100 L 155 75 L 175 100 L 250 100" fill="none" stroke="#10b981" stroke-width="2.5" />
</svg>`);
  const [interpretation, setInterpretation] = useState('');
  const [diagnosticDetails, setDiagnosticDetails] = useState('');
  const [activeTab, setActiveTab] = useState<'html' | 'preview'>('html');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const res = await fetch('/api/admin/ecg').then(r => r.json());
    if (res.records) setRecords(res.records);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Veuillez renseigner le titre du tracé.');
      return;
    }

    const payload = {
      title,
      category,
      clinicalContext,
      difficulty,
      isDailyChallenge,
      svgHtml,
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
      keyFindings: ['Analyse morphologique précise', 'Intervalles PR et QT'],
      interpretation: interpretation || 'Tracé pathologique',
      diagnosticDetails: diagnosticDetails || 'Détails de prise en charge',
      accessLevel: 'FREE'
    };

    const res = await fetch('/api/admin/ecg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      setSuccessMsg('Tracé ECG du Jour ajouté avec succès !');
      setShowAddForm(false);
      setTitle('');
      setClinicalContext('');
      setInterpretation('');
      setDiagnosticDetails('');
      fetchRecords();
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce tracé ECG ?')) return;
    await fetch(`/api/admin/ecg?id=${id}`, { method: 'DELETE' });
    fetchRecords();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-navy-950 dark:text-white">
              Gestion de l'ECG du Jour & Bibliothèque Tracés
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/20">
              HTML / SVG Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Intégrez les tracés électrocardiographiques directement en code HTML ou balises SVG haute fidélité.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Fermer' : 'Ajouter un ECG (Code HTML/SVG)'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleCreate} className="apple-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-navy-100 dark:border-navy-800">
            <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500" />
              <span>Nouveau Tracé ECG (Code HTML & SVG)</span>
            </h2>
            <div className="flex items-center gap-2 bg-navy-100 dark:bg-navy-800 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('html')}
                className={`px-3 py-1 rounded-lg ${activeTab === 'html' ? 'bg-white dark:bg-navy-900 text-brand-600 shadow-sm' : 'text-navy-500'}`}
              >
                Code HTML / SVG
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Catégorie :</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs font-bold"
              >
                <option value="Trouble du rythme">Trouble du rythme</option>
                <option value="Ischémie">Ischémie / STEMI</option>
                <option value="Conduction">Blocs de conduction</option>
                <option value="Urgence">Urgence vitale</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Difficulté :</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs font-bold"
              >
                <option value="Débutant">Débutant (Externe)</option>
                <option value="Intermédiaire">Intermédiaire (Interne)</option>
                <option value="Expert">Expert (Résidanat)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isDaily"
                checked={isDailyChallenge}
                onChange={e => setIsDailyChallenge(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600"
              />
              <label htmlFor="isDaily" className="text-xs font-bold text-navy-900 dark:text-white cursor-pointer flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Définir comme l'ECG du Jour</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Titre du tracé :</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex : Tachycardie Ventriculaire Monomorphe Soutenue"
              className="w-full px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Contexte clinique :</label>
            <textarea
              value={clinicalContext}
              onChange={e => setClinicalContext(e.target.value)}
              rows={2}
              placeholder="Âge, constantes, symptômes du patient..."
              className="w-full px-4 py-2 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs"
            />
          </div>

          {/* HTML / SVG Code Editor */}
          <div>
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">
              Code HTML / SVG du tracé ECG :
            </label>
            {activeTab === 'html' ? (
              <textarea
                value={svgHtml}
                onChange={e => setSvgHtml(e.target.value)}
                rows={5}
                className="w-full font-mono text-xs px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800"
              />
            ) : (
              <div
                className="p-4 rounded-2xl bg-navy-950 border border-navy-800 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: svgHtml }}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Interprétation cardiologique :</label>
              <input
                type="text"
                value={interpretation}
                onChange={e => setInterpretation(e.target.value)}
                placeholder="Ex : Tachycardie à QRS larges avec dissociation AV"
                className="w-full px-4 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Détails diagnostiques & Conduite :</label>
              <input
                type="text"
                value={diagnosticDetails}
                onChange={e => setDiagnosticDetails(e.target.value)}
                placeholder="Ex : Choc électrique externe si mal toléré..."
                className="w-full px-4 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800 text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-navy-600 hover:bg-navy-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft"
            >
              Publier l'ECG
            </button>
          </div>
        </form>
      )}

      {/* Existing ECG list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map(rec => (
          <div key={rec.id} className="apple-card p-5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                  {rec.category}
                </span>
                {rec.isDailyChallenge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    <span>ECG du jour</span>
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-navy-900 dark:text-white">{rec.title}</h3>
              <p className="text-xs text-navy-500 line-clamp-1">{rec.clinicalContext}</p>

              {rec.svgHtml ? (
                <div className="mt-3 rounded-xl overflow-hidden bg-navy-950 p-2" dangerouslySetInnerHTML={{ __html: rec.svgHtml }} />
              ) : (
                <img src={rec.imageUrl} alt={rec.title} className="w-full h-28 object-cover rounded-xl mt-3" />
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-navy-100 dark:border-navy-800">
              <span className="text-[11px] text-navy-400">Niveau : {rec.difficulty}</span>
              <button
                onClick={() => handleDelete(rec.id)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
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
