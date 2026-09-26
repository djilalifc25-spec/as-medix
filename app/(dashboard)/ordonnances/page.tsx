'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { INITIAL_ORDONNANCES } from '@/lib/db/seedOrdonnances';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import {
  FileText, Search, Copy, Check, ShieldAlert, AlertTriangle,
  UserCheck, Pill, ArrowRight, Sparkles
} from 'lucide-react';

function OrdonnancesContent() {
  const searchParams = useSearchParams();
  const initialSpec = searchParams.get('specialty') || '';

  const [selectedSpec, setSelectedSpec] = useState<string>(initialSpec);
  const [patientTypeFilter, setPatientTypeFilter] = useState<string>('all');
  const [query, setQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredOrdonnances = INITIAL_ORDONNANCES.filter(ord => {
    const matchSpec = !selectedSpec || ord.specialtyId === selectedSpec;
    const matchType = patientTypeFilter === 'all' || ord.patientType === patientTypeFilter;
    const matchSearch = !query ||
      ord.title.toLowerCase().includes(query.toLowerCase()) ||
      ord.indication.toLowerCase().includes(query.toLowerCase()) ||
      ord.items.some(i => i.dci.toLowerCase().includes(query.toLowerCase()) || i.brandAlgeria.toLowerCase().includes(query.toLowerCase()));
    return matchSpec && matchType && matchSearch;
  });

  const handleCopyOrdonnance = (ord: typeof INITIAL_ORDONNANCES[0]) => {
    const lines = [
      `ORDONNANCE MÉDICALE TYPE - ${ord.title.toUpperCase()}`,
      `Indication : ${ord.indication}`,
      `----------------------------------------------------`,
      ...ord.items.map((item, idx) =>
        `${idx + 1}. ${item.brandAlgeria} (${item.dci})\n   Forme : ${item.form}\n   Posologie : ${item.posology}\n   Durée : ${item.duration}${item.notes ? `\n   Note : ${item.notes}` : ''}`
      ),
      `----------------------------------------------------`,
      `CONSEILS PATIENT :`,
      ...ord.patientAdvice.map(a => `• ${a}`),
      `----------------------------------------------------`,
      `Généré via AS MEDIX - Guide Clinique Praticien`
    ];

    navigator.clipboard.writeText(lines.join('\n\n'));
    setCopiedId(ord.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-teal-700 via-emerald-600 to-indigo-700 text-white shadow-soft">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20">
            <FileText className="w-3.5 h-3.5" />
            <span>Guide Pratique du Médecin Praticien & Généraliste</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ordonnances Types & Protocoles de Prescription
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Modèles d'ordonnances types conformes aux recommandations actuelles et spécialités commerciales disponibles en Algérie. Copie rapide en 1-clic pour vos consultations.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher ordonnance, DCI, marque..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>

        {/* Patient type filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'Adulte', label: '👨‍⚕️ Adulte' },
            { id: 'Pédiatrie', label: '👶 Pédiatrie' },
            { id: 'Femme Enceinte', label: '🤰 Grossesse' },
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setPatientTypeFilter(type.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                patientTypeFilter === type.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-navy-700 dark:text-navy-300 hover:bg-navy-50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Specialties Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedSpec('')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
            !selectedSpec
              ? 'apple-badge-purple'
              : 'apple-pill text-navy-600 dark:text-navy-300'
          }`}
        >
          Toutes les spécialités ({INITIAL_ORDONNANCES.length})
        </button>
        {ALL_SPECIALTIES.map(s => {
          const count = INITIAL_ORDONNANCES.filter(o => o.specialtyId === s.id).length;
          if (count === 0) return null;
          const isSelected = selectedSpec === s.id;

          return (
            <button
              key={s.id}
              onClick={() => setSelectedSpec(s.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                isSelected
                  ? 'apple-badge-purple'
                  : 'apple-pill text-navy-600 dark:text-navy-300'
              }`}
            >
              <span>{getSpecialtyEmoji(s.id)}</span>
              <span>{s.shortName}</span>
              <span className="opacity-70 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Ordonnances List */}
      <div className="space-y-6">
        {filteredOrdonnances.length === 0 ? (
          <div className="apple-card p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-navy-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-950 dark:text-white">
              Aucun modèle d'ordonnance trouvé
            </h3>
            <p className="text-xs text-navy-500">
              Essayez un autre mot-clé ou réinitialisez le filtre de spécialité.
            </p>
          </div>
        ) : (
          filteredOrdonnances.map(ord => (
            <div
              key={ord.id}
              className="apple-card p-6 sm:p-8 space-y-6 border border-navy-100 dark:border-navy-800 hover:border-emerald-400 transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-navy-100 dark:border-navy-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                      {ord.specialtyName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300">
                      {ord.patientType}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-navy-950 dark:text-white">
                    {ord.title}
                  </h2>
                  <p className="text-xs text-navy-600 dark:text-navy-300">
                    <strong>Indication :</strong> {ord.indication}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyOrdonnance(ord)}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft flex items-center gap-2 shrink-0 transition-all active:scale-95"
                >
                  {copiedId === ord.id ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copiée dans le presse-papier !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copier l'Ordonnance</span>
                    </>
                  )}
                </button>
              </div>

              {/* Prescribed Items Table / List */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-navy-400 block">
                  📋 Prescription Médicamenteuse :
                </span>
                <div className="grid grid-cols-1 gap-3">
                  {ord.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-navy-50/70 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-black text-navy-950 dark:text-white text-sm">
                          {idx + 1}. {item.brandAlgeria}
                        </div>
                        <div className="font-semibold text-brand-600 dark:text-brand-400">
                          DCI : {item.dci} • {item.form}
                        </div>
                        {item.notes && (
                          <div className="text-[11px] text-amber-700 dark:text-amber-300 font-medium italic">
                            💡 {item.notes}
                          </div>
                        )}
                      </div>

                      <div className="sm:text-right shrink-0 space-y-0.5 bg-white dark:bg-navy-900 p-2.5 rounded-xl border border-navy-100 dark:border-navy-700">
                        <div className="font-bold text-navy-900 dark:text-white">{item.posology}</div>
                        <div className="text-[11px] text-navy-400">Durée : {item.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Advice & Red Flags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 space-y-2">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-[11px] uppercase tracking-wider">
                    🗣️ Conseils à donner au Patient :
                  </span>
                  <ul className="space-y-1 text-navy-700 dark:text-navy-300">
                    {ord.patientAdvice.map((adv, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 space-y-2">
                  <span className="font-bold text-rose-800 dark:text-rose-300 block text-[11px] uppercase tracking-wider">
                    🚨 Red Flags (Signes d'Alerte) :
                  </span>
                  <ul className="space-y-1 text-rose-900 dark:text-rose-200">
                    {ord.redFlagsToWatch.map((rf, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{rf}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function OrdonnancesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-navy-400">Chargement du guide de prescription...</div>}>
      <OrdonnancesContent />
    </Suspense>
  );
}
