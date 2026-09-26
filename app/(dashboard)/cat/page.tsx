'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { INITIAL_CAT } from '@/lib/db/seedCat';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import {
  Siren, Search, ShieldAlert, AlertTriangle, ArrowRight, ArrowLeft,
  Activity, ChevronRight, Sparkles, Filter, CheckCircle2
} from 'lucide-react';

function CatHubContent() {
  const searchParams = useSearchParams();
  const initialSpec = searchParams.get('specialty') || '';

  const [protocols, setProtocols] = useState<any[]>(INITIAL_CAT);
  const [selectedSpecId, setSelectedSpecId] = useState<string>(initialSpec);
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Fetch dynamic protocols if updated
  useEffect(() => {
    fetch('/api/cat')
      .then(res => res.json())
      .then(data => {
        if (data.protocols && Array.isArray(data.protocols)) {
          setProtocols(data.protocols);
        }
      })
      .catch(() => {});
  }, []);

  // Update selectedSpecId if URL param changes
  useEffect(() => {
    if (initialSpec) {
      setSelectedSpecId(initialSpec);
    }
  }, [initialSpec]);

  const activeSpecialty = ALL_SPECIALTIES.find(s => s.id === selectedSpecId);

  // Filter CATs by active specialty if selected
  const specialtyCats = selectedSpecId
    ? protocols.filter(c => c.specialtyId === selectedSpecId)
    : protocols;

  // Filter by urgency and search term
  const displayCats = specialtyCats.filter(cat => {
    const matchUrgency = selectedUrgency === 'all' || cat.urgencyLevel === selectedUrgency;
    const matchSearch = !search ||
      cat.title.toLowerCase().includes(search.toLowerCase()) ||
      cat.summary.toLowerCase().includes(search.toLowerCase()) ||
      cat.specialtyName.toLowerCase().includes(search.toLowerCase());
    return matchUrgency && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* 1. Header Banner Apple Glassmorphism */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <Siren className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>Protocoles Décisionnels de Garde & Urgences Médicales</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
            {activeSpecialty ? (
              <span className="flex items-center gap-2">
                <span>{getSpecialtyEmoji(activeSpecialty.id)}</span>
                <span>Conduites à Tenir en {activeSpecialty.name}</span>
              </span>
            ) : (
              'Conduites À Tenir (CAT) par Spécialité'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 dark:text-navy-300 leading-relaxed">
            {activeSpecialty
              ? `Consultez les arbres décisionnels et protocoles réflexes d'urgence pour cette spécialité.`
              : `Choisissez une spécialité ci-dessous pour afficher ses protocoles de prise en charge d'urgence.`}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {selectedSpecId && (
            <button
              onClick={() => setSelectedSpecId('')}
              className="apple-pill px-4 py-2.5 text-xs font-bold text-navy-700 dark:text-navy-200 hover:text-brand-600 flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Toutes les spécialités</span>
            </button>
          )}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une urgence, CAT..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/60 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Top Horizontal Pills for quick specialty switching (Always in same tab) */}
      {selectedSpecId && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedSpecId('')}
            className="apple-pill px-3.5 py-1.5 rounded-full text-xs font-bold text-navy-600 dark:text-navy-300 shrink-0"
          >
            ← Vue Grille
          </button>
          {ALL_SPECIALTIES.map(s => {
            const isSelected = selectedSpecId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSpecId(s.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  isSelected
                    ? 'apple-badge-purple'
                    : 'apple-pill text-navy-600 dark:text-navy-300 hover:border-brand-300'
                }`}
              >
                <span>{getSpecialtyEmoji(s.id)}</span>
                <span>{s.shortName}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. STEP 1: If no specialty selected, display the 20 Specialties Apple Grid */}
      {!selectedSpecId ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-navy-950 dark:text-white uppercase tracking-wider text-xs">
              1. Choisissez une Spécialité Médicale :
            </h2>
            <span className="text-xs text-navy-500 font-medium">
              20 Disciplines Cliniques
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ALL_SPECIALTIES.map((spec) => {
              const count = protocols.filter(c => c.specialtyId === spec.id).length;
              const emoji = getSpecialtyEmoji(spec.id);

              return (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpecId(spec.id)}
                  className="apple-card p-5 text-left group hover:scale-102 hover:border-rose-400 transition-all flex flex-col justify-between h-36 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {emoji}
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      count > 0
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'text-navy-400'
                    }`}>
                      {count} CAT
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-navy-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
                      {spec.name}
                    </div>
                    <div className="text-[10px] text-navy-500 dark:text-navy-400 mt-0.5 flex items-center justify-between">
                      <span>{spec.shortName}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-rose-500" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* 4. STEP 2: When Specialty Selected, display CATs directly in this same tab! */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Sub-header controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-navy-100 dark:border-navy-800">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getSpecialtyEmoji(activeSpecialty?.id || '')}</span>
              <div>
                <h2 className="text-base font-black text-navy-950 dark:text-white">
                  {activeSpecialty?.name}
                </h2>
                <p className="text-xs text-navy-500">
                  {displayCats.length} protocole{displayCats.length > 1 ? 's' : ''} disponible{displayCats.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Urgency Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'Toutes les urgences' },
                { id: 'Urgence Vitale', label: '🚨 Urgence Vitale' },
                { id: 'Urgence Relative', label: '⚠️ Urgence Relative' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedUrgency(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                    selectedUrgency === tab.id
                      ? 'apple-badge-purple'
                      : 'apple-pill text-navy-600 dark:text-navy-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* CAT Protocols Grid */}
          {displayCats.length === 0 ? (
            <div className="apple-card p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-3xl">
                🛡️
              </div>
              <h3 className="text-base font-bold text-navy-950 dark:text-white">
                Aucun protocole d'urgence spécifique trouvé pour ces critères
              </h3>
              <p className="text-xs text-navy-600 dark:text-navy-300 max-w-md mx-auto">
                Les protocoles de cette spécialité sont en cours de mise en conformité avec les recommandations récentes du Collège Médical.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setSelectedUrgency('all')}
                  className="apple-pill px-4 py-2 text-xs font-bold text-navy-700 dark:text-navy-200"
                >
                  Réinitialiser les filtres
                </button>
                <button
                  onClick={() => setSelectedSpecId('urgences')}
                  className="apple-badge-purple px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Voir Urgences & Réanimation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayCats.map(cat => {
                const isVital = cat.urgencyLevel === 'Urgence Vitale';

                return (
                  <div
                    key={cat.id}
                    className="apple-card p-6 flex flex-col justify-between space-y-4 hover:border-brand-400 group transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                          <span>{getSpecialtyEmoji(cat.specialtyId)}</span>
                          <span>{cat.specialtyName}</span>
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isVital
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        }`}>
                          {cat.urgencyLevel}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-navy-950 dark:text-white group-hover:text-brand-600 transition-colors leading-snug">
                        {cat.title}
                      </h3>

                      <p className="text-xs text-navy-600 dark:text-navy-300 leading-relaxed line-clamp-2">
                        {cat.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-navy-100 dark:border-navy-800/80 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{cat.redFlags.length} Drapeaux rouges</span>
                      </span>

                      <Link
                        href={`/cat/${cat.slug}?fullscreen=true`}
                        className="apple-badge-purple px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm hover:scale-102 active:scale-95"
                      >
                        <span>Arbre décisionnel</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CatCatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-bold text-navy-400">Chargement des Conduites À Tenir...</div>}>
      <CatHubContent />
    </Suspense>
  );
}
