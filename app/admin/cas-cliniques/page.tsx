'use client';

import React, { useState, useEffect } from 'react';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { ClinicalCase } from '@/types';
import { Activity, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminCasesPage() {
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [specialtyId, setSpecialtyId] = useState('cardio');
  const [title, setTitle] = useState('');
  const [patientPresentation, setPatientPresentation] = useState('');
  const [caseHtml, setCaseHtml] = useState('<div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-200"><h4 class="font-bold text-indigo-900">Observation Clinique Complète</h4><p>Données de l\'interrogatoire et examens...</p></div>');
  const [activeTab, setActiveTab] = useState<'html' | 'preview'>('html');
  const [step1Question, setStep1Question] = useState('');
  const [step1OptA, setStep1OptA] = useState('');
  const [step1OptB, setStep1OptB] = useState('');
  const [step1Explanation, setStep1Explanation] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    const res = await fetch('/api/admin/cas-cliniques').then(r => r.json());
    if (res.cases) setCases(res.cases);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !patientPresentation) {
      alert('Veuillez remplir le titre et la présentation.');
      return;
    }

    const spec = ALL_SPECIALTIES.find(s => s.id === specialtyId);

    const payload = {
      title,
      specialtyId,
      specialtyName: spec ? spec.name : 'Cardiologie',
      difficulty: 'Intermédiaire',
      estimatedDuration: '25 min',
      patientPresentation,
      vignetteHtml: `<div class="space-y-2"><p>${patientPresentation}</p></div>`,
      steps: [
        {
          stepNumber: 1,
          title: 'Étape 1 : Diagnostic initial',
          clinicalUpdate: 'Admission en salle de déchoquage avec constantes vitales.',
          question: step1Question || 'Quelle est votre hypothèse diagnostique principale ?',
          options: [
            { id: '1', text: step1OptA || 'Infarctus du myocarde avec sus-décalage de ST (STEMI)' },
            { id: '2', text: step1OptB || 'Embolie pulmonaire massive' }
          ],
          correctOptionIndex: 0,
          explanation: step1Explanation || 'L\'ECG confirme le diagnostic formel.'
        }
      ],
      tags: [spec?.shortName || 'Cas Clinique']
    };

    const res = await fetch('/api/admin/cas-cliniques', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      setSuccessMsg('Cas clinique enregistré avec succès !');
      setShowAddForm(false);
      setTitle('');
      setPatientPresentation('');
      fetchCases();
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce cas clinique ?')) return;
    await fetch(`/api/admin/cas-cliniques?id=${id}`, { method: 'DELETE' });
    fetchCases();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 dark:text-white">
            Gestion des Cas Cliniques Progressifs
          </h1>
          <p className="text-xs sm:text-sm text-navy-500">
            Dossiers d'admission et prises de décisions pas à pas par spécialité.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Fermer le formulaire' : 'Ajouter un Cas Clinique'}</span>
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
            <Activity className="w-5 h-5 text-indigo-600" />
            <span>Nouveau Dossier Patient Progressif</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Titre du Cas :</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex : Douleur thoracique aiguë constrictive chez un diabétique de 58 ans"
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300">Dossier Clinique & Données en HTML :</label>
              <div className="flex items-center gap-1 bg-navy-100 dark:bg-navy-800 p-1 rounded-lg text-[11px] font-bold">
                <button type="button" onClick={() => setActiveTab('html')} className={`px-2.5 py-0.5 rounded ${activeTab === 'html' ? 'bg-white text-brand-600 shadow-sm' : 'text-navy-500'}`}>Code HTML</button>
                <button type="button" onClick={() => setActiveTab('preview')} className={`px-2.5 py-0.5 rounded ${activeTab === 'preview' ? 'bg-white text-brand-600 shadow-sm' : 'text-navy-500'}`}>Aperçu</button>
              </div>
            </div>
            {activeTab === 'html' ? (
              <textarea
                value={caseHtml}
                onChange={e => setCaseHtml(e.target.value)}
                rows={5}
                className="w-full font-mono text-xs px-4 py-2.5 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white/70 dark:bg-navy-800"
              />
            ) : (
              <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 border border-navy-200 text-xs" dangerouslySetInnerHTML={{ __html: caseHtml }} />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-navy-700 dark:text-navy-300 mb-1">Présentation initiale du patient :</label>
            <textarea
              value={patientPresentation}
              onChange={e => setPatientPresentation(e.target.value)}
              rows={3}
              placeholder="Antécédents, mode d'arrivée, motif de consultation, constantes..."
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 text-xs"
            />
          </div>

          <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-700 space-y-3">
            <span className="text-xs font-bold uppercase text-brand-600">Question de Décision Étape 1 :</span>
            <input
              type="text"
              value={step1Question}
              onChange={e => setStep1Question(e.target.value)}
              placeholder="Quel examen complémentaire demandez-vous en extrême urgence ?"
              className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={step1OptA}
                onChange={e => setStep1OptA(e.target.value)}
                placeholder="Option A (Bonne réponse)"
                className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-xs"
              />
              <input
                type="text"
                value={step1OptB}
                onChange={e => setStep1OptB(e.target.value)}
                placeholder="Option B (Distracteur)"
                className="w-full px-3 py-2 rounded-xl border border-navy-200 text-xs"
              />
            </div>
            <input
              type="text"
              value={step1Explanation}
              onChange={e => setStep1Explanation(e.target.value)}
              placeholder="Justification médicale et critères de validation"
              className="w-full px-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 text-xs"
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
              Enregistrer le Cas Clinique
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-soft p-6 space-y-4">
        <div className="text-sm font-bold text-navy-900 dark:text-white">
          Cas cliniques actifs ({cases.length})
        </div>

        <div className="space-y-3">
          {cases.map(c => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-navy-50/70 dark:bg-navy-800/50 border border-navy-100 dark:border-navy-800 flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                    {c.specialtyName}
                  </span>
                  <span className="text-[10px] text-navy-500 font-medium">{c.difficulty}</span>
                </div>
                <h3 className="text-sm font-bold text-navy-900 dark:text-white">{c.title}</h3>
                <p className="text-xs text-navy-500 line-clamp-1">{c.patientProfile?.motif || 'Dossier clinique progressif'}</p>
              </div>

              <button
                onClick={() => handleDelete(c.id)}
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
