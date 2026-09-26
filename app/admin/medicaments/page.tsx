'use client';

import React, { useState, useMemo } from 'react';
import PHARMNET_MEDS from '@/lib/db/pharmnet_meds.json';
import {
  Pill, Search, Filter, Plus, Trash2, CheckCircle2, Building2, Globe, Tag,
  DollarSign, Barcode, Calendar, ChevronLeft, ChevronRight, Eye, ShieldCheck,
  AlertCircle, Sparkles, RefreshCw, X
} from 'lucide-react';

interface PharmnetMed {
  id: string;
  nomCommercial: string;
  dci: string;
  dciCode: string;
  classeTherapeutique: string;
  laboratoire: string;
  pays: string;
  forme: string;
  dosage: string;
  conditionnement: string;
  liste: string;
  prixPpa: number | null;
  tarifRef: number;
  circuitHop: boolean;
  circuitOff: boolean;
  statutFab: string;
  enRupture: boolean;
  numEnregistrement: string;
  dateEnrInitial: string;
  dateEnrFinal: string;
  registre: string;
  codeBarre: string;
  imageUrl: string | null;
  type: string;
}

export default function AdminMedicamentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [originFilter, setOriginFilter] = useState<'all' | 'local' | 'imported'>('all');
  const [circuitFilter, setCircuitFilter] = useState<'all' | 'off' | 'hop'>('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 30;

  const [selectedMed, setSelectedMed] = useState<PharmnetMed | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [customMeds, setCustomMeds] = useState<PharmnetMed[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  // Form state
  const [newNom, setNewNom] = useState('');
  const [newDci, setNewDci] = useState('');
  const [newClass, setNewClass] = useState('Antibiotique');
  const [newLab, setNewLab] = useState('Saidal');
  const [newForme, setNewForme] = useState('Comprimé');
  const [newDosage, setNewDosage] = useState('');
  const [newPpa, setNewPpa] = useState('');
  const [newTarif, setNewTarif] = useState('');

  // Combine static JSON (9560 meds) + custom added meds
  const allMeds: PharmnetMed[] = useMemo(() => {
    return [...customMeds, ...(PHARMNET_MEDS as PharmnetMed[])];
  }, [customMeds]);

  // Unique therapeutic classes for filtering
  const therapeuticClasses = useMemo(() => {
    const classes = new Set<string>();
    allMeds.forEach(m => {
      if (m.classeTherapeutique) classes.add(m.classeTherapeutique);
    });
    return Array.from(classes).sort();
  }, [allMeds]);

  // Filtered dataset
  const filteredMeds = useMemo(() => {
    return allMeds.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.nomCommercial.toLowerCase().includes(q) ||
        m.dci.toLowerCase().includes(q) ||
        (m.laboratoire && m.laboratoire.toLowerCase().includes(q)) ||
        (m.codeBarre && m.codeBarre.includes(q)) ||
        (m.numEnregistrement && m.numEnregistrement.toLowerCase().includes(q));

      const matchesClass = selectedClass === 'all' || m.classeTherapeutique === selectedClass;

      const isLocal = m.statutFab && m.statutFab.toLowerCase().includes('fabriqué');
      const matchesOrigin =
        originFilter === 'all' ||
        (originFilter === 'local' && isLocal) ||
        (originFilter === 'imported' && !isLocal);

      const matchesCircuit =
        circuitFilter === 'all' ||
        (circuitFilter === 'off' && m.circuitOff) ||
        (circuitFilter === 'hop' && m.circuitHop);

      return matchesSearch && matchesClass && matchesOrigin && matchesCircuit;
    });
  }, [allMeds, searchQuery, selectedClass, originFilter, circuitFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredMeds.length / itemsPerPage);
  const paginatedMeds = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredMeds.slice(start, start + itemsPerPage);
  }, [filteredMeds, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNom.trim() || !newDci.trim()) {
      alert('Veuillez remplir le nom commercial et la DCI.');
      return;
    }

    const created: PharmnetMed = {
      id: `custom_${Date.now()}`,
      nomCommercial: newNom.trim(),
      dci: newDci.trim(),
      dciCode: 'DZ-CUSTOM',
      classeTherapeutique: newClass,
      laboratoire: newLab.trim() || 'Saidal',
      pays: 'Algérie',
      forme: newForme.trim() || 'Comprimé',
      dosage: newDosage.trim() || 'Selon prescription',
      conditionnement: 'Boîte de 30',
      liste: 'Liste I',
      prixPpa: parseFloat(newPpa) || 350,
      tarifRef: parseFloat(newTarif) || 280,
      circuitHop: false,
      circuitOff: true,
      statutFab: 'Fabriqué en Algérie 🇩🇿',
      enRupture: false,
      numEnregistrement: `DZ-${Date.now()}`,
      dateEnrInitial: '2026-01-01',
      dateEnrFinal: '2031-01-01',
      registre: 'National',
      codeBarre: `613000${Math.floor(1000000 + Math.random() * 9000000)}`,
      imageUrl: null,
      type: 'Médicament'
    };

    setCustomMeds([created, ...customMeds]);
    setShowAddForm(false);
    setNewNom('');
    setNewDci('');
    setNewDosage('');
    setNewPpa('');
    setNewTarif('');
    setSuccessMsg('Nouveau médicament ajouté à la Pharmacopée Algérienne avec succès !');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Metrics
  const totalLocalCount = useMemo(() => allMeds.filter(m => m.statutFab && m.statutFab.toLowerCase().includes('fabriqué')).length, [allMeds]);
  const totalChifaCount = useMemo(() => allMeds.filter(m => m.tarifRef && m.tarifRef > 0).length, [allMeds]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Pill className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Pharmacopée DZ (Base Officielle 9 560 Produits)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">
            Registre complet des médicaments enregistrés au Ministère de la Santé (Algérie), PPA, Tarifs Chifa, DCI et codes-barres.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Fermer le formulaire' : 'Ajouter un Produit Monographie'}</span>
        </button>
      </div>

      {/* Counter KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Produits Enregistrés</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {allMeds.length.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">100% Indexés Pharmnet DZ</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fabrication Nationale 🇩🇿</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {totalLocalCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Saidal, Hikma, Biopharm, etc.</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Remboursables CHIFA 💳</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {totalChifaCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Avec Tarif de Référence</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Classes Thérapeutiques</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {therapeuticClasses.length}
          </div>
          <span className="text-[10px] text-slate-400">Catégories indexées</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add Product Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-600" />
            <span>Ajouter une Monographie au Registre Pharmnet DZ</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nom Commercial *</label>
              <input
                type="text"
                required
                placeholder="Ex: Augmentin 1g"
                value={newNom}
                onChange={e => setNewNom(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">DCI *</label>
              <input
                type="text"
                required
                placeholder="Ex: Amoxicilline + Acide Clavulanique"
                value={newDci}
                onChange={e => setNewDci(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Laboratoire</label>
              <input
                type="text"
                placeholder="Ex: Saidal, Hikma"
                value={newLab}
                onChange={e => setNewLab(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Forme & Dosage</label>
              <input
                type="text"
                placeholder="Ex: Comprimé pelliculé 1g"
                value={newForme}
                onChange={e => setNewForme(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Prix PPA (DA)</label>
              <input
                type="number"
                placeholder="Ex: 450"
                value={newPpa}
                onChange={e => setNewPpa(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tarif Chifa (DA)</label>
              <input
                type="number"
                placeholder="Ex: 380"
                value={newTarif}
                onChange={e => setNewTarif(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
            >
              Enregistrer dans la Base Officielle
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Live Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par DCI, Marque, Labo, Code-barres..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Therapeutic Class Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedClass}
              onChange={e => { setSelectedClass(e.target.value); setPage(1); }}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs outline-none"
            >
              <option value="all">Toutes les classes ({therapeuticClasses.length})</option>
              {therapeuticClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Origin Filter */}
          <div className="md:col-span-2">
            <select
              value={originFilter}
              onChange={e => { setOriginFilter(e.target.value as any); setPage(1); }}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs outline-none"
            >
              <option value="all">Toute Origine</option>
              <option value="local">🇩🇿 Fabriqué en Algérie</option>
              <option value="imported">✈️ Importé</option>
            </select>
          </div>

          {/* Circuit Filter */}
          <div className="md:col-span-2">
            <select
              value={circuitFilter}
              onChange={e => { setCircuitFilter(e.target.value as any); setPage(1); }}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs outline-none"
            >
              <option value="all">Tous Circuits</option>
              <option value="off">🏥 Officine / Pharmacie</option>
              <option value="hop">🏨 Hospitalier Strict</option>
            </select>
          </div>
        </div>

        {/* Counter Results info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>Affichage de <strong className="text-slate-900 dark:text-white">{filteredMeds.length.toLocaleString()}</strong> résultat(s) sur {allMeds.length.toLocaleString()}</span>
          <span>Page {page} sur {totalPages || 1}</span>
        </div>
      </div>

      {/* Medications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedMeds.map(med => {
          const isLocal = med.statutFab && med.statutFab.toLowerCase().includes('fabriqué');

          return (
            <div
              key={med.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    isLocal
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                      : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200'
                  }`}>
                    {isLocal ? '🇩🇿 Produit National' : '✈️ Importé'}
                  </span>

                  {med.prixPpa && (
                    <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      PPA: {med.prixPpa} DA
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {med.nomCommercial}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                    DCI : <span className="text-slate-900 dark:text-white">{med.dci}</span>
                  </p>
                </div>

                <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <p className="truncate">🏢 Labo : <strong className="text-slate-700 dark:text-slate-300">{med.laboratoire || 'Non spécifié'}</strong> ({med.pays || 'DZ'})</p>
                  <p className="truncate">💊 Forme : {med.forme || med.dosage}</p>
                  {med.classeTherapeutique && (
                    <p className="truncate text-purple-600 dark:text-purple-400 font-medium">🏷️ {med.classeTherapeutique}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400">
                  {med.codeBarre ? `EAN: ${med.codeBarre}` : `Réf: ${med.numEnregistrement || med.id}`}
                </span>

                <button
                  onClick={() => setSelectedMed(med)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Monographie</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Page {page} / {totalPages}</span>
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-40 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <span>Suivant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Detailed Monographie Modal */}
      {selectedMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black rounded-full uppercase">
                  Fiche Monographie Officielle Pharmnet DZ
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedMed.nomCommercial}
                </h2>
              </div>

              <button
                onClick={() => setSelectedMed(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Dénomination Commune Internationale (DCI) :</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedMed.dci}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Classe Thérapeutique :</span>
                  <p className="font-semibold text-purple-600 dark:text-purple-400">{selectedMed.classeTherapeutique || 'Non spécifiée'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Laboratoire & Origine :</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedMed.laboratoire || 'N/A'}</p>
                  <p className="text-slate-500">{selectedMed.statutFab || selectedMed.pays}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Tarification & Remboursement :</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">PPA: {selectedMed.prixPpa ? `${selectedMed.prixPpa} DA` : 'N/A'}</p>
                  <p className="font-bold text-blue-600 dark:text-blue-400">Tarif Chifa: {selectedMed.tarifRef ? `${selectedMed.tarifRef} DA` : 'Non remboursable'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Forme & Conditioning :</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedMed.forme} • {selectedMed.conditionnement || selectedMed.dosage}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">N° Enregistrement & Code Barre :</span>
                  <p className="font-mono text-slate-700 dark:text-slate-300">N° {selectedMed.numEnregistrement || 'N/A'} • Barcode: {selectedMed.codeBarre || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedMed(null)}
                className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl"
              >
                Fermer la Monographie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
