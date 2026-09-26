'use client';

import React, { useState, useEffect } from 'react';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { CATProtocol, Course } from '@/types';
import { ShieldAlert, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminCatPage() {
  const [protocols, setProtocols] = useState<CATProtocol[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [specialtyId, setSpecialtyId] = useState('cardio');
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'Urgence Vitale' | 'Urgence Relative' | 'Prise en charge réglée'>('Urgence Vitale');
  const [summary, setSummary] = useState('');
  const [conduiteHtml, setConduiteHtml] = useState('<div class="p-4 rounded-2xl bg-rose-50 border border-rose-200"><h4 class="font-bold text-rose-800">1. Alerte Immédiate</h4><p>Arrêt immédiat du facteur déclenchant...</p></div>');
  const [activeTab, setActiveTab] = useState<'html' | 'preview'>('html');
  const [conduite1, setConduite1] = useState('');
  const [traitement1, setTraitement1] = useState('');
  const [redFlag1, setRedFlag1] = useState('');
  const [pearl1, setPearl1] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [resCat, resCourses] = await Promise.all([
      fetch('/api/admin/cat').then(r => r.json()),
      fetch('/api/admin/courses').then(r => r.json())
    ]);
    if (resCat.protocols) setProtocols(resCat.protocols);
    if (resCourses.courses) setCourses(resCourses.courses);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !summary) {
      alert('Veuillez remplir le titre et le résumé.');
      return;
    }

    const spec = ALL_SPECIALTIES.find(s => s.id === specialtyId);

    const payload = {
      title,
      specialtyId,
      specialtyName: spec ? spec.name : 'Urgences',
      urgencyLevel,
      summary,
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

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce protocole CAT ?')) return;
    await fetch(`/api/admin/cat?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const filteredCourses = courses.filter(c => c.specialtyId === specialtyId);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 dark:text-white">
            Conduites À Tenir (CAT) par Spécialité & par Cours
          </h1>
          <p className="text-xs sm:text-sm text-navy-500">
            Arbres décisionnels d'urgence, drapeaux rouges et perles cliniques.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Fermer le formulaire' : 'Ajouter un Protocole CAT'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
          <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>Nouveau Protocole CAT Urgence</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Spécialité :</label>
              <select
                value={specialtyId}
                onChange={e => setSpecialtyId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 text-xs font-bold"
              >
                {ALL_SPECIALTIES.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Cours Concerné :</label>
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

      <div className="bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-soft p-6 space-y-4">
        <div className="text-sm font-bold text-navy-900 dark:text-white">
          Protocoles CAT actifs ({protocols.length})
        </div>

        <div className="space-y-3">
          {protocols.map(p => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-navy-50/70 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-800 flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500/10 text-rose-600 border border-rose-500/20">
                    {p.urgencyLevel}
                  </span>
                  <span className="text-[10px] font-bold text-navy-500">
                    {p.specialtyName}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-navy-900 dark:text-white">{p.title}</h3>
                <p className="text-xs text-navy-500 line-clamp-1">{p.summary}</p>
              </div>

              <button
                onClick={() => handleDelete(p.id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
