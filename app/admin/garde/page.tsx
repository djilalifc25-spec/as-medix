'use client';

import React, { useState, useEffect } from 'react';
import {
  Siren, Plus, Edit3, Trash2, Code, Eye, CheckCircle2, RefreshCw, Sparkles,
  Zap, ShieldAlert, HeartPulse, FileCode, Check
} from 'lucide-react';
import { GardeProtocol } from '@/types';

export default function AdminGardePage() {
  const [protocols, setProtocols] = useState<GardeProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Urgences Vitales');
  const [badge, setBadge] = useState('H24');
  const [description, setDescription] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [saving, setSaving] = useState(false);

  const fetchProtocols = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/garde');
      const data = await res.json();
      if (data.success) {
        setProtocols(data.protocols);
      }
    } catch (err) {
      console.error('Error fetching garde protocols:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtocols();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Urgences Vitales');
    setBadge('H24');
    setDescription('');
    setHtmlContent(`<div class="p-6 rounded-3xl bg-gradient-to-br from-rose-900 via-rose-800 to-slate-900 text-white space-y-6 shadow-xl border border-rose-500/30">
  <div class="flex items-center justify-between border-b border-rose-500/30 pb-4">
    <div class="flex items-center gap-3">
      <span class="p-3 bg-rose-500/20 text-rose-300 rounded-2xl border border-rose-400/30 text-xl">🚨</span>
      <div>
        <h2 class="text-xl font-black tracking-tight text-white">Nouveau Protocole UMC H24</h2>
        <p class="text-xs text-rose-200">Recommandations & Arbre Décisionnel d'Urgence</p>
      </div>
    </div>
    <span class="px-3 py-1 bg-rose-500 text-white text-xs font-black rounded-full uppercase tracking-wider">
      Urgence
    </span>
  </div>

  <div class="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-2">
    <h3 class="font-bold text-rose-300 text-sm">⚡ 1. Prise en Charge Immédiate</h3>
    <ul class="text-xs space-y-1 text-rose-100">
      <li>• Évaluation rapide des constantes (PA, FC, SpO2)</li>
      <li>• Pose de voie veineuse périphérique de bon calibre</li>
    </ul>
  </div>
</div>`);
    setActiveTab('code');
    setShowModal(true);
  };

  const handleOpenEdit = (p: GardeProtocol) => {
    setEditingId(p.id);
    setTitle(p.title);
    setCategory(p.category);
    setBadge(p.badge || 'H24');
    setDescription(p.description);
    setHtmlContent(p.htmlContent);
    setActiveTab('code');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !htmlContent.trim()) {
      alert('Veuillez remplir le titre et le code HTML.');
      return;
    }

    setSaving(true);
    try {
      const url = '/api/admin/garde';
      const method = editingId ? 'PUT' : 'POST';
      const payload = editingId
        ? { id: editingId, title, category, badge, description, htmlContent }
        : { title, category, badge, description, htmlContent };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchProtocols();
      } else {
        alert(data.error || 'Erreur lors de l\'enregistrement.');
      }
    } catch (err) {
      console.error('Error saving garde protocol:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce protocole / cette page de garde HTML ?')) return;
    try {
      const res = await fetch(`/api/admin/garde?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProtocols();
      }
    } catch (err) {
      console.error('Error deleting protocol:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl">
              <Siren className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Gestionnaire Mode Garde H24 (Éditeur HTML)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">
            Créez, modifiez et enrichissez les pages et protocoles réflexes du Mode Garde H24 directement en code HTML sur-mesure.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={fetchProtocols}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Page HTML Mode Garde</span>
          </button>
        </div>
      </div>

      {/* Protocols List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {protocols.map(p => (
          <div
            key={p.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-rose-300 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black rounded-full uppercase">
                  {p.badge || 'H24'}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {p.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {p.title}
              </h3>

              {p.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono">
                Modifié le {new Date(p.updatedAt).toLocaleDateString('fr-FR')}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-semibold hover:bg-blue-100 transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Éditer HTML</span>
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
                  title="Supprimer la page HTML"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden space-y-6">
            {/* Modal Title */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingId ? 'Éditer le Code HTML de la Page Garde' : 'Créer une Nouvelle Page Mode Garde (HTML)'}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Fermer ✕
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Titre du Protocole / Page *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Protocole Choc Anaphylactique H24"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  >
                    <option value="Urgences Vitales">🚨 Urgences Vitales</option>
                    <option value="Cardio-Respiratoire">🫀 Cardio-Respiratoire</option>
                    <option value="Toxicologie">🧪 Toxicologie & Antidotes</option>
                    <option value="Calculs & Posologies">🧮 Calculs & Posologies</option>
                    <option value="Protocoles Sur-Mesure">✨ Protocoles Sur-Mesure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Badge d'Affichage
                  </label>
                  <input
                    type="text"
                    placeholder="ex: URGENCE, H24, NOUVEAU"
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Description Courte
                </label>
                <input
                  type="text"
                  placeholder="Bref résumé d'une ligne..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              {/* HTML Editor with Code vs Live Preview Tabber */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase text-slate-500">
                    Contenu Complet en Code HTML *
                  </label>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveTab('code')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                        activeTab === 'code'
                          ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      <Code className="w-3.5 h-3.5" /> Code HTML
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                        activeTab === 'preview'
                          ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" /> Aperçu en Direct
                    </button>
                  </div>
                </div>

                {activeTab === 'code' ? (
                  <textarea
                    rows={12}
                    required
                    value={htmlContent}
                    onChange={e => setHtmlContent(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed outline-none border border-slate-800 focus:ring-2 focus:ring-rose-500 resize-y"
                  ></textarea>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 max-h-96 overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? 'Enregistrement...' : 'Sauvegarder la Page HTML'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
