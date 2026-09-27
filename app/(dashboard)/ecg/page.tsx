'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_ECG_RECORDS } from '@/lib/db/seedEcg';
import { ECGRecord } from '@/types';
import { Activity, Check, Eye, EyeOff, AlertTriangle, Sparkles, Filter, ChevronRight } from 'lucide-react';

export default function EcgLibraryPage() {
  const [records, setRecords] = useState<ECGRecord[]>(INITIAL_ECG_RECORDS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeEcgId, setActiveEcgId] = useState<string>(INITIAL_ECG_RECORDS[0]?.id);
  const [showInterpretation, setShowInterpretation] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/ecg')
      .then(r => r.json())
      .then(d => {
        if (d.records && Array.isArray(d.records) && d.records.length > 0) {
          setRecords(d.records);
          if (!d.records.some((r: any) => r.id === activeEcgId)) {
            setActiveEcgId(d.records[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  const activeEcg = records.find(e => e.id === activeEcgId) || records[0] || INITIAL_ECG_RECORDS[0];

  const categories = [
    { id: 'all', label: 'Tous les tracés' },
    { id: 'Trouble du rythme', label: 'Troubles du rythme' },
    { id: 'Ischémie', label: 'Ischémie & Coronaires' },
    { id: 'Conduction', label: 'Blocs & Conduction' },
    { id: 'Troubles électrolytiques', label: 'Troubles électrolytiques' },
    { id: 'Urgence', label: 'Urgences vitales' },
  ];

  const filtered = records.filter(e =>
    selectedCategory === 'all' || e.category === selectedCategory
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-700 via-brand-700 to-indigo-700 text-white shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>ECG du Jour & Bibliothèque Électrocardiographique</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Maîtrise de l'Électrocardiogramme
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
            Entraînez votre œil clinique sur des tracés haute fidélité annotés par des cardiologues hospitaliers.
          </p>
        </div>
      </div>

      {/* Main Interactive Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols : Active ECG Viewer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  {activeEcg.category}
                </span>
                {activeEcg.isDailyChallenge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-600 text-white">
                    ECG du jour
                  </span>
                )}
              </div>
              <span className="text-xs text-navy-400">Niveau {activeEcg.difficulty}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-navy-950 dark:text-white">
              {activeEcg.title}
            </h2>

            {/* Clinical Context */}
            <div className="p-4 rounded-2xl bg-navy-50/70 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-750 text-xs sm:text-sm text-navy-700 dark:text-navy-300">
              <strong>Contexte clinique :</strong> {activeEcg.clinicalContext}
            </div>

            {/* ECG Image or SVG Code */}
            <div className="rounded-2xl border border-navy-200 dark:border-navy-700 overflow-hidden bg-navy-950 shadow-inner p-2">
              {activeEcg.svgHtml ? (
                <div dangerouslySetInnerHTML={{ __html: activeEcg.svgHtml }} />
              ) : (
                <img
                  src={activeEcg.imageUrl}
                  alt={activeEcg.title}
                  className="w-full h-64 sm:h-80 object-cover opacity-90 hover:opacity-100 transition-opacity cursor-zoom-in rounded-xl"
                />
              )}
            </div>

            {/* Reveal Interpretation Toggle */}
            <div className="pt-2">
              <button
                onClick={() => setShowInterpretation(!showInterpretation)}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all flex items-center justify-center gap-2"
              >
                {showInterpretation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showInterpretation ? 'Masquer l\'interprétation' : 'Révéler l\'interprétation cardiologique'}</span>
              </button>
            </div>

            {/* Detailed Interpretation Card */}
            {showInterpretation && (
              <div className="p-6 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 space-y-4 text-xs sm:text-sm leading-relaxed animate-in fade-in">
                <div>
                  <h4 className="font-bold text-indigo-950 dark:text-indigo-200 text-base mb-1">
                    Diagnostic : {activeEcg.interpretation}
                  </h4>
                  <p className="text-navy-700 dark:text-navy-300 text-xs">{activeEcg.diagnosticDetails}</p>
                </div>

                <div>
                  <div className="font-bold text-navy-900 dark:text-white text-xs uppercase tracking-wider mb-2">
                    Anomalies électrocardiographiques clés :
                  </div>
                  <ul className="space-y-1.5 text-navy-700 dark:text-navy-300">
                    {activeEcg.keyFindings.map((kf, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{kf}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col : ECG Library Browser */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-3">
            <h3 className="text-sm font-bold text-navy-950 dark:text-white">
              Filtrer par Catégorie
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === c.id
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-navy-50 dark:bg-navy-800 text-navy-700 dark:text-navy-300 hover:bg-navy-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Traces List */}
          <div className="space-y-2">
            {filtered.map(ecg => (
              <button
                key={ecg.id}
                onClick={() => { setActiveEcgId(ecg.id); setShowInterpretation(false); }}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  activeEcgId === ecg.id
                    ? 'bg-brand-50/70 border-brand-500 dark:bg-brand-950/40 dark:border-brand-600 shadow-sm'
                    : 'bg-white dark:bg-navy-900 border-navy-100 dark:border-navy-800 hover:border-brand-200'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block">
                    {ecg.category}
                  </span>
                  <div className="text-xs font-bold text-navy-900 dark:text-white line-clamp-1">
                    {ecg.title}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-navy-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
