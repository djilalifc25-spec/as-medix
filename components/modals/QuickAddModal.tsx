'use client';

import React, { useState } from 'react';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import { Plus, X, BookOpen, Brain, CheckCircle2 } from 'lucide-react';

export const QuickAddModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'cours' | 'qcm'>('cours');

  // Course states
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSpecialty, setCourseSpecialty] = useState('cardio');
  const [courseDuration, setCourseDuration] = useState('25 min');
  const [courseHtml, setCourseHtml] = useState('<p>Insérez ici le contenu du cours...</p>');

  // QCM states
  const [qcmTitle, setQcmTitle] = useState('');
  const [qcmSpecialty, setQcmSpecialty] = useState('cardio');
  const [qcmQuestion, setQcmQuestion] = useState('');
  const [qcmOptA, setQcmOptA] = useState('');
  const [qcmOptB, setQcmOptB] = useState('');
  const [qcmOptC, setQcmOptC] = useState('');
  const [qcmExplanationHtml, setQcmExplanationHtml] = useState('<p>Explication clinique détaillée...</p>');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle) return alert('Veuillez renseigner le titre du cours.');
    setSaving(true);

    const spec = ALL_SPECIALTIES.find(s => s.id === courseSpecialty);
    const res = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: courseTitle,
        specialtyId: courseSpecialty,
        specialtyName: spec?.name || 'Cardiologie',
        estimatedDuration: courseDuration,
        htmlContent: courseHtml,
        published: true
      })
    });
    const data = await res.json();
    setSaving(false);
    if (data.success || data.course) {
      setSuccess('Cours ajouté avec succès au catalogue !');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('asmedix-content-updated'));
      }
      setTimeout(() => {
        setSuccess('');
        onClose();
        window.location.reload();
      }, 1500);
    }
  };

  const handleCreateQcm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qcmTitle || !qcmQuestion) return alert('Veuillez renseigner le titre et la question.');
    setSaving(true);

    const spec = ALL_SPECIALTIES.find(s => s.id === qcmSpecialty);
    const options = [
      qcmOptA ? { id: 'opt_1', letter: 'A', text: qcmOptA } : null,
      qcmOptB ? { id: 'opt_2', letter: 'B', text: qcmOptB } : null,
      qcmOptC ? { id: 'opt_3', letter: 'C', text: qcmOptC } : null,
    ].filter(Boolean);

    const res = await fetch('/api/admin/qcm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: qcmTitle,
        specialtyId: qcmSpecialty,
        specialtyName: spec?.name || 'Cardiologie',
        question: qcmQuestion,
        options,
        correctAnswers: [0],
        explanationHtml: qcmExplanationHtml,
        explanation: qcmExplanationHtml.replace(/<[^>]*>?/gm, ''),
        accessLevel: 'FREE'
      })
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setSuccess('QCM ajouté avec succès à la banque !');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('asmedix-qcm-updated', { detail: data.qcm }));
      }
      setTimeout(() => {
        setSuccess('');
        onClose();
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md animate-in fade-in">
      <div className="apple-card w-full max-w-xl p-6 sm:p-8 space-y-5 bg-white dark:bg-navy-900 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-navy-100 dark:border-navy-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-navy-950 dark:text-white">
              Ajout Rapide de Contenu Médical
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-navy-400 hover:text-navy-900 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-navy-100 dark:bg-navy-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('cours')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'cours' ? 'bg-white dark:bg-navy-900 text-brand-600 shadow-sm' : 'text-navy-500'
            }`}
          >
            <span>📚</span>
            <span>Nouveau Cours</span>
          </button>
          <button
            onClick={() => setActiveTab('qcm')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'qcm' ? 'bg-white dark:bg-navy-900 text-brand-600 shadow-sm' : 'text-navy-500'
            }`}
          >
            <span>🧠</span>
            <span>Nouveau QCM</span>
          </button>
        </div>

        {success && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Course */}
        {activeTab === 'cours' ? (
          <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold uppercase text-navy-600 dark:text-navy-300 mb-1">Titre du Cours :</label>
              <input
                type="text"
                value={courseTitle}
                onChange={e => setCourseTitle(e.target.value)}
                placeholder="Ex : L'Embolie Pulmonaire Aiguë"
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase text-navy-600 dark:text-navy-300 mb-1">Spécialité :</label>
                <select
                  value={courseSpecialty}
                  onChange={e => setCourseSpecialty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 font-bold"
                >
                  {ALL_SPECIALTIES.map(s => (
                    <option key={s.id} value={s.id}>{getSpecialtyEmoji(s.id)} {s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold uppercase text-navy-600 dark:text-navy-300 mb-1">Durée :</label>
                <input
                  type="text"
                  value={courseDuration}
                  onChange={e => setCourseDuration(e.target.value)}
                  placeholder="Ex : 30 min"
                  className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase text-navy-600 dark:text-navy-300 mb-1">Contenu en Code HTML :</label>
              <textarea
                value={courseHtml}
                onChange={e => setCourseHtml(e.target.value)}
                rows={4}
                className="w-full font-mono text-xs px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft transition-all"
            >
              {saving ? 'Publication...' : 'Publier le Cours Immédiatement'}
            </button>
          </form>
        ) : (
          /* Form QCM */
          <form onSubmit={handleCreateQcm} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold uppercase text-navy-600 dark:text-navy-300 mb-1">Thème du QCM :</label>
              <input
                type="text"
                value={qcmTitle}
                onChange={e => setQcmTitle(e.target.value)}
                placeholder="Ex : Prise en charge de la fibrillation atriale"
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-navy-600 dark:text-navy-300 mb-1">Spécialité :</label>
              <select
                value={qcmSpecialty}
                onChange={e => setQcmSpecialty(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800 font-bold"
              >
                {ALL_SPECIALTIES.map(s => (
                  <option key={s.id} value={s.id}>{getSpecialtyEmoji(s.id)} {s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-navy-600 dark:text-navy-300 mb-1">Question :</label>
              <input
                type="text"
                value={qcmQuestion}
                onChange={e => setQcmQuestion(e.target.value)}
                placeholder="Ex : Quelle molécule est indiquée en première intention ?"
                className="w-full px-4 py-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800"
              />
            </div>

            <div className="space-y-1.5">
              <input
                type="text"
                value={qcmOptA}
                onChange={e => setQcmOptA(e.target.value)}
                placeholder="Proposition A (Réponse exacte)"
                className="w-full px-4 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50/50"
              />
              <input
                type="text"
                value={qcmOptB}
                onChange={e => setQcmOptB(e.target.value)}
                placeholder="Proposition B"
                className="w-full px-4 py-1.5 rounded-xl border border-navy-200 bg-navy-50 dark:bg-navy-800"
              />
              <input
                type="text"
                value={qcmOptC}
                onChange={e => setQcmOptC(e.target.value)}
                placeholder="Proposition C"
                className="w-full px-4 py-1.5 rounded-xl border border-navy-200 bg-navy-50 dark:bg-navy-800"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-navy-600 dark:text-navy-300 mb-1">Explication en Code HTML :</label>
              <textarea
                value={qcmExplanationHtml}
                onChange={e => setQcmExplanationHtml(e.target.value)}
                rows={3}
                className="w-full font-mono text-xs px-4 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-800"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft transition-all"
            >
              {saving ? 'Publication...' : 'Ajouter le QCM Immédiatement'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
