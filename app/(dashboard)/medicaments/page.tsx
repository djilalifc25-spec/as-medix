'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import PHARMNET_MEDS from '@/lib/db/pharmnet_meds.json';
import { INITIAL_MEDICATIONS } from '@/lib/db/seedMedications';
import {
  getPharmacologicalProfile,
  calculatePersonalizedDose
} from '@/lib/db/posologyEngine';
import {
  Pill, X, Search, ShieldAlert, AlertCircle, FileText, CheckCircle2,
  Building2, Globe, Tag, DollarSign, Filter, Sparkles, Check, ArrowRight,
  Barcode, Calendar, FileDown, ExternalLink, Image as ImageIcon,
  Calculator, Baby, UserCheck, Activity, AlertTriangle, HeartPulse, Stethoscope,
  Ban, ShieldCheck, Zap
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
  noticeUrl: string | null;
  rcpUrl: string | null;
  type: string;
}

function MedicationsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialId = searchParams.get('id') || '';

  const [query, setQuery] = useState(initialSearch);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (initialId) {
      setSelectedMedId(initialId);
      setIsMobileDetailOpen(true);
    }
  }, [initialId]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [originFilter, setOriginFilter] = useState<'all' | 'local' | 'imported'>('all');
  const [circuitFilter, setCircuitFilter] = useState<'all' | 'off' | 'hop'>('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 40;

  const [selectedMedId, setSelectedMedId] = useState<string>(PHARMNET_MEDS[0]?.id || '');
  const [copied, setCopied] = useState(false);

  // Posology Calculator State
  const [calcWeight, setCalcWeight] = useState<number>(70);
  const [calcAgeCat, setCalcAgeCat] = useState<'pedia' | 'adult' | 'elderly'>('adult');
  const [calcDfg, setCalcDfg] = useState<number>(90);

  // Extract unique therapeutic classes
  const therapeuticClasses = useMemo(() => {
    const classesSet = new Set<string>();
    (PHARMNET_MEDS as PharmnetMed[]).forEach(m => {
      if (m.classeTherapeutique) classesSet.add(m.classeTherapeutique);
    });
    return Array.from(classesSet).sort();
  }, []);

  // Filtered dataset
  const filteredMeds = useMemo(() => {
    const q = query.toLowerCase().trim();
    return (PHARMNET_MEDS as PharmnetMed[]).filter(m => {
      const matchQuery = !q ||
        m.nomCommercial.toLowerCase().includes(q) ||
        m.dci.toLowerCase().includes(q) ||
        m.laboratoire.toLowerCase().includes(q) ||
        m.dosage.toLowerCase().includes(q) ||
        m.codeBarre.includes(q) ||
        m.numEnregistrement.toLowerCase().includes(q);

      const matchClass = selectedClass === 'all' || m.classeTherapeutique === selectedClass;
      const matchOrigin = originFilter === 'all' || (originFilter === 'local' ? m.statutFab === 'F' : m.statutFab !== 'F');
      const matchCircuit = circuitFilter === 'all' || (circuitFilter === 'off' ? m.circuitOff : m.circuitHop);

      return matchQuery && matchClass && matchOrigin && matchCircuit;
    });
  }, [query, selectedClass, originFilter, circuitFilter]);

  // Paginated list
  const paginatedMeds = useMemo(() => {
    return filteredMeds.slice(0, page * itemsPerPage);
  }, [filteredMeds, page]);

  // Active selected med details
  const activeMed = useMemo(() => {
    return (PHARMNET_MEDS as PharmnetMed[]).find(m => m.id === selectedMedId) || (PHARMNET_MEDS as PharmnetMed[])[0];
  }, [selectedMedId]);

  // Match with clinical seed notes if available
  const clinicalSeed = useMemo(() => {
    if (!activeMed) return null;
    return INITIAL_MEDICATIONS.find(seed =>
      seed.dci.toLowerCase().includes(activeMed.dci.toLowerCase()) ||
      seed.commercialNames.some(cn => cn.toLowerCase() === activeMed.nomCommercial.toLowerCase())
    );
  }, [activeMed]);

  // Pharmacological Profile for active medication class
  const pharmaProfile = useMemo(() => {
    if (!activeMed) return getPharmacologicalProfile('');
    return getPharmacologicalProfile(activeMed.classeTherapeutique, activeMed.dci);
  }, [activeMed]);

  // Calculated Dose Result
  const calculatedDose = useMemo(() => {
    return calculatePersonalizedDose(pharmaProfile, calcWeight, calcAgeCat, calcDfg);
  }, [pharmaProfile, calcWeight, calcAgeCat, calcDfg]);

  const handleCopyDetails = () => {
    if (!activeMed) return;
    const text = [
      `PRODUIT PHARMACEUTIQUE (ALGÉRIE) : ${activeMed.nomCommercial}`,
      `DCI : ${activeMed.dci}`,
      `Forme & Dosage : ${activeMed.forme} ${activeMed.dosage}`,
      `Laboratoire : ${activeMed.laboratoire} (${activeMed.pays || 'Algérie'})`,
      `Classe Thérapeutique : ${activeMed.classeTherapeutique}`,
      `Numéro Enregistrement : ${activeMed.numEnregistrement || 'N/A'}`,
      `Code Barre : ${activeMed.codeBarre || 'N/A'}`,
      `Prix PPA : ${activeMed.prixPpa ? `${activeMed.prixPpa} DA` : 'Non renseigné'} | Tarif Ref Chifa : ${activeMed.tarifRef ? `${activeMed.tarifRef} DA` : 'N/A'}`,
      `\n--- CALCUL POSOLOGIQUE SUR-MESURE ---`,
      `Patient : ${calcWeight} kg | Profil : ${calcAgeCat} | DFG : ${calcDfg} mL/min`,
      `Dose par prise : ${calculatedDose.dosePerTakeMg} ${calculatedDose.unit}`,
      `Rythme : ${calculatedDose.takesPerDay} fois par jour (Dose totale : ${calculatedDose.dailyDoseMg} ${calculatedDose.unit}/j)`,
      `Note rénale : ${calculatedDose.renalNote}`,
      `\n--- CONTRE-INDICATIONS MAJEURES ---`,
      `Absolues : ${pharmaProfile.contraindications.absolute.join(' ; ')}`,
      `Relatives : ${pharmaProfile.contraindications.relative.join(' ; ')}`
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-cyan-800 via-teal-700 to-indigo-800 text-white shadow-soft">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20">
            <Pill className="w-3.5 h-3.5 text-cyan-300" />
            <span>Base Officielle Pharmnet Algérie • Monographies & Calculateurs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Nomenclature des Médicaments DZ (9 560 Produits)
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
            Spécialités commerciales, photos, DCI, enregistrements, prix PPA Chifa, <strong>calculateur automatique de posologie par poids et clairance rénale</strong>, contre-indications et effets secondaires.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-0.5">
            <div className="text-lg font-black">{PHARMNET_MEDS.length}</div>
            <div className="text-[10px] text-cyan-200 uppercase font-bold">Produits Repertoire</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-center space-y-0.5">
            <div className="text-lg font-black text-emerald-300">4 672</div>
            <div className="text-[10px] text-emerald-200 uppercase font-bold">Fabriqués 🇩🇿</div>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-5 h-5 text-navy-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher par Nom commercial (ex: Augmentin), DCI (ex: Amoxicilline), Code barre, N° enregistrement..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-sm text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-xs"
            />
          </div>

          {/* Therapeutic Class Dropdown */}
          <div className="relative">
            <select
              value={selectedClass}
              onChange={e => {
                setSelectedClass(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-3 rounded-2xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs font-bold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-xs"
            >
              <option value="all">Toutes les classes thérapeutiques (28)</option>
              {therapeuticClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub-filters Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Origin filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-navy-400 text-[11px] uppercase">Origine :</span>
            <button
              onClick={() => { setOriginFilter('all'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                originFilter === 'all'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => { setOriginFilter('local'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                originFilter === 'local'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300'
              }`}
            >
              <span>🇩🇿 Fabriqué en Algérie</span>
            </button>
            <button
              onClick={() => { setOriginFilter('imported'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                originFilter === 'imported'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300'
              }`}
            >
              <span>🌍 Importé</span>
            </button>
          </div>

          {/* Circuit filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-navy-400 text-[11px] uppercase">Disponibilité :</span>
            <button
              onClick={() => { setCircuitFilter('all'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                circuitFilter === 'all'
                  ? 'bg-navy-800 text-white dark:bg-navy-700'
                  : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => { setCircuitFilter('off'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                circuitFilter === 'off'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300'
              }`}
            >
              💊 Officine (Pharmacie)
            </button>
            <button
              onClick={() => { setCircuitFilter('hop'); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                circuitFilter === 'hop'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300'
              }`}
            >
              🏥 Usage Hospitalier
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Medications List (1 Col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-navy-400">
              Résultats ({filteredMeds.length} médicaments)
            </span>
            <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
              Affichage 1 - {paginatedMeds.length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[850px] overflow-y-auto pr-1 scrollbar-thin">
            {paginatedMeds.map(med => {
              const isSelected = activeMed?.id === med.id;

              return (
                <button
                  key={med.id}
                  onClick={() => {
                    setSelectedMedId(med.id);
                    setIsMobileDetailOpen(true);
                    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                      document.getElementById('medication-details-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-cyan-50/80 border-cyan-500 dark:bg-cyan-950/40 dark:border-cyan-500 shadow-soft'
                      : 'bg-white dark:bg-navy-900 border-navy-100 dark:border-navy-800 hover:border-cyan-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {med.imageUrl ? (
                        <img
                          src={med.imageUrl}
                          alt={med.nomCommercial}
                          className="w-10 h-10 object-cover rounded-xl border border-navy-200 dark:border-navy-700 bg-white"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">
                          💊
                        </div>
                      )}
                      <div>
                        <div className="font-black text-sm text-navy-950 dark:text-white leading-snug">
                          {med.nomCommercial}
                        </div>
                        <div className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 mt-0.5">
                          {med.dci}
                        </div>
                      </div>
                    </div>

                    {med.statutFab === 'F' && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                        🇩🇿 DZ
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-navy-500 pt-1 border-t border-navy-100 dark:border-navy-800">
                    <span className="font-medium truncate max-w-[180px]">
                      {med.forme} {med.dosage}
                    </span>
                    {med.prixPpa ? (
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {med.prixPpa} DA
                      </span>
                    ) : (
                      <span className="text-navy-400">Tarif: {med.tarifRef ? `${med.tarifRef} DA` : 'N/A'}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-cyan-600 dark:text-cyan-400 font-bold">
                    <span>Ouvrir la monographie</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}

            {/* Load More Button */}
            {paginatedMeds.length < filteredMeds.length && (
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-xs font-bold hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition-colors"
              >
                + Charger la suite ({filteredMeds.length - paginatedMeds.length} restants)
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Monograph + Calculator + Contraindications (2 Cols) */}
        {activeMed && (
          <div id="medication-details-anchor" className="hidden lg:block lg:col-span-2 space-y-6">
            {/* Main Product Monograph Card */}
            <div className="apple-card p-6 sm:p-8 space-y-6 border border-navy-100 dark:border-navy-800 shadow-soft">
              {/* Header section */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-4 border-b border-navy-100 dark:border-navy-800">
                <div className="flex items-start gap-4">
                  {activeMed.imageUrl ? (
                    <div className="w-24 h-24 rounded-2xl border border-navy-200 dark:border-navy-700 overflow-hidden bg-white p-1 shadow-sm shrink-0">
                      <img
                        src={activeMed.imageUrl}
                        alt={activeMed.nomCommercial}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-md shrink-0">
                      💊
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                        {activeMed.classeTherapeutique || 'Classe Générale'}
                      </span>
                      {activeMed.statutFab === 'F' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          🇩🇿 Fabriqué en Algérie
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          🌍 Produit Importé ({activeMed.pays || 'Étranger'})
                        </span>
                      )}
                      {activeMed.liste && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          {activeMed.liste}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white pt-1">
                      {activeMed.nomCommercial}
                    </h2>
                    <div className="text-sm font-bold text-cyan-700 dark:text-cyan-300">
                      DCI : {activeMed.dci} {activeMed.dciCode ? `(Code DCI: ${activeMed.dciCode})` : ''}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopyDetails}
                  className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-soft flex items-center gap-2 shrink-0 transition-all active:scale-95 self-start"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Fiche Copiée !</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Copier la Fiche</span>
                    </>
                  )}
                </button>
              </div>

              {/* Complete Specifications Grid from JSON */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-navy-50/70 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-750 space-y-1">
                  <span className="font-bold text-navy-400 text-[10px] uppercase tracking-wider block">
                    Forme & Dosage :
                  </span>
                  <div className="font-black text-navy-900 dark:text-white text-base">
                    {activeMed.forme} {activeMed.dosage}
                  </div>
                  <div className="text-xs text-navy-500">Conditionnement : {activeMed.conditionnement || 'Standard'}</div>
                </div>

                <div className="p-4 rounded-2xl bg-navy-50/70 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-750 space-y-1">
                  <span className="font-bold text-navy-400 text-[10px] uppercase tracking-wider block">
                    Laboratoire & Pays :
                  </span>
                  <div className="font-black text-navy-900 dark:text-white text-base flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-cyan-600" />
                    <span>{activeMed.laboratoire || 'Non spécifié'}</span>
                  </div>
                  <div className="text-xs text-navy-500">Pays : {activeMed.pays || 'Algérie'}</div>
                </div>

                <div className="p-4 rounded-2xl bg-navy-50/70 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-750 space-y-1">
                  <span className="font-bold text-navy-400 text-[10px] uppercase tracking-wider block">
                    Enregistrement Ministériel :
                  </span>
                  <div className="font-bold text-navy-900 dark:text-white text-xs">
                    N° Enregistrement : {activeMed.numEnregistrement || 'En cours'}
                  </div>
                  <div className="text-[11px] text-navy-500">
                    Registre : <strong>{activeMed.registre || 'N/A'}</strong> {activeMed.dateEnrFinal ? `(jusqu'à ${activeMed.dateEnrFinal})` : ''}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 text-[10px] uppercase tracking-wider block">
                    Prix PPA Officine / Tarif Chifa :
                  </span>
                  <div className="font-black text-emerald-700 dark:text-emerald-300 text-xl">
                    {activeMed.prixPpa ? `${activeMed.prixPpa} DA` : 'Prix Hospitalier'}
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    Tarif réf. Chifa : {activeMed.tarifRef ? `${activeMed.tarifRef} DA` : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Official Notices */}
              {(activeMed.noticeUrl || activeMed.rcpUrl) && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
                  <span className="font-bold text-amber-900 dark:text-amber-200 text-xs uppercase tracking-wider block">
                    📄 Documents Officiels Ministériels :
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    {activeMed.noticeUrl && (
                      <a
                        href={activeMed.noticeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold flex items-center gap-1.5 hover:bg-amber-700 transition-colors"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Télécharger Notice Officielle</span>
                      </a>
                    )}
                    {activeMed.rcpUrl && (
                      <a
                        href={activeMed.rcpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold flex items-center gap-1.5 hover:bg-indigo-700 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Consulter RCP Ministériel</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 🧮 Interactive Custom Posology Calculator Card */}
            <div className="apple-card p-6 sm:p-8 space-y-6 border border-cyan-200 dark:border-cyan-900/80 bg-gradient-to-br from-cyan-50/60 via-white to-teal-50/40 dark:from-navy-900 dark:via-navy-900 dark:to-cyan-950/30 shadow-soft">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-100 dark:border-navy-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-600 text-white shadow-xs">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-navy-950 dark:text-white">
                      Calculateur de Posologie Intégré
                    </h3>
                    <p className="text-xs text-navy-500">
                      Calcul dynamique adapté au poids ($kg$), à la catégorie d'âge et à la clairance rénale ($DFG$).
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-800">
                  Sur-Mesure
                </span>
              </div>

              {/* Calculator Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                {/* 1. Age Category */}
                <div className="space-y-2">
                  <label className="font-bold text-navy-700 dark:text-navy-300 block">
                    Tranche d'Âge :
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => { setCalcAgeCat('pedia'); if (calcWeight > 35) setCalcWeight(15); }}
                      className={`p-2 rounded-xl text-center font-bold border transition-all ${
                        calcAgeCat === 'pedia'
                          ? 'bg-cyan-600 text-white border-cyan-600'
                          : 'bg-white dark:bg-navy-900 border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300'
                      }`}
                    >
                      <Baby className="w-4 h-4 mx-auto mb-1" />
                      <span>Enfant</span>
                    </button>
                    <button
                      onClick={() => { setCalcAgeCat('adult'); if (calcWeight < 40) setCalcWeight(70); }}
                      className={`p-2 rounded-xl text-center font-bold border transition-all ${
                        calcAgeCat === 'adult'
                          ? 'bg-cyan-600 text-white border-cyan-600'
                          : 'bg-white dark:bg-navy-900 border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300'
                      }`}
                    >
                      <UserCheck className="w-4 h-4 mx-auto mb-1" />
                      <span>Adulte</span>
                    </button>
                    <button
                      onClick={() => { setCalcAgeCat('elderly'); if (calcWeight < 40) setCalcWeight(65); }}
                      className={`p-2 rounded-xl text-center font-bold border transition-all ${
                        calcAgeCat === 'elderly'
                          ? 'bg-cyan-600 text-white border-cyan-600'
                          : 'bg-white dark:bg-navy-900 border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300'
                      }`}
                    >
                      <Activity className="w-4 h-4 mx-auto mb-1" />
                      <span>Âgé (&gt;75ans)</span>
                    </button>
                  </div>
                </div>

                {/* 2. Weight Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-bold text-navy-700 dark:text-navy-300">
                    <span>Poids du Patient :</span>
                    <span className="text-cyan-700 dark:text-cyan-300 text-sm font-black">{calcWeight} kg</span>
                  </div>
                  <input
                    type="range"
                    min={calcAgeCat === 'pedia' ? 3 : 35}
                    max={calcAgeCat === 'pedia' ? 45 : 150}
                    value={calcWeight}
                    onChange={e => setCalcWeight(Number(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-navy-400 font-semibold">
                    <span>{calcAgeCat === 'pedia' ? '3 kg' : '35 kg'}</span>
                    <span>{calcAgeCat === 'pedia' ? '45 kg' : '150 kg'}</span>
                  </div>
                </div>

                {/* 3. Renal Clearance DFG */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-bold text-navy-700 dark:text-navy-300">
                    <span>Clairance / DFG :</span>
                    <span className={`text-sm font-black ${calcDfg < 30 ? 'text-rose-600' : calcDfg < 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {calcDfg} mL/min
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={120}
                    step={5}
                    value={calcDfg}
                    onChange={e => setCalcDfg(Number(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-semibold">
                    <span className="text-rose-500">&lt;30 Sévère</span>
                    <span className="text-amber-500">30-60 Modéré</span>
                    <span className="text-emerald-500">&gt;60 Normal</span>
                  </div>
                </div>
              </div>

              {/* Calculated Result Output Box */}
              <div className="p-5 rounded-2xl bg-navy-900 text-white space-y-4 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-navy-750">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">
                      Résultat du Calcul Posologique sur-mesure
                    </span>
                    <div className="text-2xl font-black text-white flex items-baseline gap-2 pt-0.5">
                      <span>{calculatedDose.dosePerTakeMg} {calculatedDose.unit}</span>
                      <span className="text-xs font-normal text-navy-300">/ prise</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">
                      Rythme d'administration
                    </span>
                    <div className="text-lg font-black text-emerald-400">
                      {calculatedDose.takesPerDay} fois par jour ({calculatedDose.dailyDoseMg} {calculatedDose.unit}/jour)
                    </div>
                  </div>
                </div>

                {/* Warnings & Notes */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-cyan-200">
                    <Stethoscope className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Conseil d'administration :</strong> {pharmaProfile.posologyRules.dosingAdvice}</span>
                  </div>

                  <div className="flex items-start gap-2 text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/40">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Adaptation rénale :</strong> {calculatedDose.renalNote}</span>
                  </div>

                  {calculatedDose.warningMessage && (
                    <div className="flex items-start gap-2 text-rose-300 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40 font-bold">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{calculatedDose.warningMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 🔴 Monographie Clinique Sécurité (Contre-indications, Effets indésirables, Interactions) */}
            <div className="apple-card p-6 sm:p-8 space-y-6 border border-navy-100 dark:border-navy-800 shadow-soft">
              <div className="flex items-center gap-3 pb-3 border-b border-navy-100 dark:border-navy-800">
                <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-xs">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-navy-950 dark:text-white">
                    Sécurité Clinique & Contre-Indications
                  </h3>
                  <p className="text-xs text-navy-500">
                    Recommandations de sécurité pour la classe {activeMed.classeTherapeutique || 'médicamenteuse'}.
                  </p>
                </div>
              </div>

              {/* 1. Contre-indications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Absolute Contraindications */}
                <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
                  <div className="flex items-center gap-2 font-black text-rose-800 dark:text-rose-300 text-xs uppercase">
                    <Ban className="w-4 h-4 text-rose-600" />
                    <span>Contre-Indications Absolues (DANGER)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-navy-800 dark:text-navy-200">
                    {pharmaProfile.contraindications.absolute.map((ci, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold shrink-0">✕</span>
                        <span>{ci}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Relative Contraindications */}
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
                  <div className="flex items-center gap-2 font-black text-amber-800 dark:text-amber-300 text-xs uppercase">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Contre-Indications Relatives & Précautions</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-navy-800 dark:text-navy-200">
                    {pharmaProfile.contraindications.relative.map((ci, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold shrink-0">⚠️</span>
                        <span>{ci}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 2. Side Effects & Interactions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Side Effects */}
                <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
                  <div className="flex items-center gap-2 font-black text-indigo-800 dark:text-indigo-300 text-xs uppercase">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <span>Effets Secondaires & Indésirables</span>
                  </div>
                  <div className="space-y-2 text-xs text-navy-800 dark:text-navy-200">
                    <div>
                      <strong className="text-indigo-900 dark:text-indigo-200">Fréquents :</strong>
                      <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                        {pharmaProfile.sideEffects.frequent.map((eff, i) => (
                          <li key={i}>{eff}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-rose-700 dark:text-rose-400">Graves / Aiguës :</strong>
                      <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-rose-800 dark:text-rose-300">
                        {pharmaProfile.sideEffects.severe.map((eff, i) => (
                          <li key={i}>{eff}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Interactions */}
                <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 space-y-2">
                  <div className="flex items-center gap-2 font-black text-teal-800 dark:text-teal-300 text-xs uppercase">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Interactions Médicamenteuses Majeures</span>
                  </div>
                  <div className="space-y-2 text-xs text-navy-800 dark:text-navy-200">
                    <div>
                      <strong className="text-rose-700 dark:text-rose-400">Associations Interdites / Déconseillées :</strong>
                      <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-rose-800 dark:text-rose-300">
                        {pharmaProfile.interactions.forbidden.map((inter, i) => (
                          <li key={i}>{inter}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-teal-900 dark:text-teal-200">Précautions d'Emploi :</strong>
                      <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                        {pharmaProfile.interactions.precaution.map((inter, i) => (
                          <li key={i}>{inter}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Pregnancy & Breastfeeding Safety */}
              <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-2 text-xs">
                <div className="flex items-center justify-between font-black text-purple-900 dark:text-purple-200 uppercase text-xs">
                  <span className="flex items-center gap-2">
                    <span>🤰 Grossesse & Allaitement (Avis CRAT / FDA)</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-md font-black text-white ${
                    pharmaProfile.pregnancySafety.category === 'A' || pharmaProfile.pregnancySafety.category === 'B'
                      ? 'bg-emerald-600'
                      : pharmaProfile.pregnancySafety.category === 'C'
                      ? 'bg-amber-600'
                      : 'bg-rose-600'
                  }`}>
                    Catégorie FDA: {pharmaProfile.pregnancySafety.category}
                  </span>
                </div>
                <p className="text-navy-800 dark:text-navy-200 leading-relaxed pt-1">
                  <strong>Recommandation du CRAT :</strong> {pharmaProfile.pregnancySafety.cratAdvice}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE FULLSCREEN / BOTTOM SHEET DETAIL MODAL ── */}
      {mounted && isMobileDetailOpen && activeMed && createPortal(
        <div className="lg:hidden fixed inset-0 z-[100] flex items-end justify-center p-0 select-none animate-in fade-in duration-200">
          {/* Backdrop with Click to Close */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            onClick={() => setIsMobileDetailOpen(false)}
          />

          {/* Slide-over Dialog Container */}
          <div
            className="relative w-full h-[92dvh] max-h-[92dvh] bg-white dark:bg-navy-950 border-t border-white/20 rounded-t-[32px] shadow-2xl flex flex-col z-10 overflow-hidden text-navy-950 dark:text-white animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-navy-100 dark:border-navy-800 flex items-center justify-between shrink-0 bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center text-xl font-bold shrink-0">
                  💊
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-navy-950 dark:text-white truncate">
                    {activeMed.nomCommercial}
                  </h3>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 font-bold truncate">
                    {activeMed.dci}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileDetailOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 text-slate-500 hover:text-slate-800 dark:text-navy-300 dark:hover:text-white transition-colors shrink-0"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Monograph Details Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Monograph specs, posology & safety */}
              <div className="apple-card p-5 space-y-5 border border-navy-100 dark:border-navy-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                    {activeMed.classeTherapeutique || 'Classe Générale'}
                  </span>
                  {activeMed.statutFab === 'F' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      🇩🇿 Fabriqué en Algérie
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      🌍 Importé ({activeMed.pays || 'Étranger'})
                    </span>
                  )}
                  {activeMed.prixPpa && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white">
                      Prix PPA: {activeMed.prixPpa} DA
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-navy-50 dark:bg-navy-800">
                    <span className="text-[10px] text-navy-400 font-bold uppercase block">Forme & Dosage</span>
                    <span className="font-bold text-navy-950 dark:text-white">{activeMed.forme} {activeMed.dosage}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-50 dark:bg-navy-800">
                    <span className="text-[10px] text-navy-400 font-bold uppercase block">Laboratoire</span>
                    <span className="font-bold text-navy-950 dark:text-white truncate block">{activeMed.laboratoire}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-50 dark:bg-navy-800">
                    <span className="text-[10px] text-navy-400 font-bold uppercase block">Tarif Chifa</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeMed.tarifRef ? `${activeMed.tarifRef} DA` : 'Non remboursable'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-50 dark:bg-navy-800">
                    <span className="text-[10px] text-navy-400 font-bold uppercase block">Disponibilité</span>
                    <span className="font-bold text-navy-950 dark:text-white">{activeMed.circuitOff ? '💊 Officine' : '🏥 Hôpital'}</span>
                  </div>
                </div>
              </div>

              {/* Posology Calculator in Mobile Modal */}
              <div className="apple-card p-5 space-y-4 border border-navy-100 dark:border-navy-800">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-cyan-600" />
                  <h4 className="font-black text-sm text-navy-950 dark:text-white">Calculateur de Posologie Rapide</h4>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 uppercase">Posologie Recommandée :</span>
                  <div className="text-base font-black text-cyan-950 dark:text-cyan-100 leading-tight">
                    {calculatedDose.dosePerTakeMg} {calculatedDose.unit} / prise ({calculatedDose.takesPerDay} fois par jour)
                  </div>
                  <div className="text-xs text-cyan-800 dark:text-cyan-300 pt-1">
                    Dose quotidienne : {calculatedDose.dailyDoseMg} {calculatedDose.unit}/j • {calculatedDose.renalNote}
                  </div>
                </div>
              </div>

              {/* Absolute Contraindications */}
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2">
                <div className="flex items-center gap-2 font-black text-rose-700 dark:text-rose-300 text-xs uppercase">
                  <Ban className="w-4 h-4 text-rose-600" />
                  <span>Contre-Indications Absolues</span>
                </div>
                <ul className="space-y-1.5 text-xs text-navy-800 dark:text-navy-200">
                  {pharmaProfile.contraindications.absolute.map((ci, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold shrink-0">✕</span>
                      <span>{ci}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Big Close Button at Bottom of Modal */}
              <button
                type="button"
                onClick={() => setIsMobileDetailOpen(false)}
                className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-navy-800 text-white font-bold text-xs shadow-md transition-all active:scale-98"
              >
                Fermer la Fiche
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default function MedicationsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-navy-400">Chargement du répertoire pharmaceutique...</div>}>
      <MedicationsContent />
    </Suspense>
  );
}
