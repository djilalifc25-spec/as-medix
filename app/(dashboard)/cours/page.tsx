'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { INITIAL_COURSES } from '@/lib/db/seedCourses';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import { useFaculty } from '@/components/context/FacultyContext';
import { useSpecialtyTheme } from '@/components/context/SpecialtyThemeContext';
import { SpecialtyLogo } from '@/components/brand/SpecialtyLogo';
import { Course, MedicalYear, Specialty } from '@/types';
import {
  BookOpen, Search, Clock, ArrowRight, CheckCircle2, Lock, ChevronRight,
  Filter, Sparkles, Layers, ArrowLeft, GraduationCap
} from 'lucide-react';

const MEDICAL_YEARS: { id: MedicalYear; label: string; badge: string; desc: string }[] = [
  { id: 1, label: '1ère Année', badge: 'PCEM1', desc: 'Sciences fondamentales' },
  { id: 2, label: '2ème Année', badge: 'PCEM2', desc: 'Physiologie & Morphologie' },
  { id: 3, label: '3ème Année', badge: 'DCEM1', desc: 'Sémiologie & Pathologie' },
  { id: 4, label: '4ème Année', badge: 'DCEM2', desc: 'Pathologie Médicale I' },
  { id: 5, label: '5ème Année', badge: 'DCEM3', desc: 'Pathologie Médicale II' },
  { id: 6, label: '6ème Année', badge: 'DCEM4', desc: 'Pédiatrie, Gynéco & Stages' },
];

function CoursHubContent() {
  const searchParams = useSearchParams();
  const initialSpec = searchParams.get('specialty') || '';
  const initialYearParam = searchParams.get('year');
  const initialYear = initialYearParam ? (parseInt(initialYearParam, 10) as MedicalYear) : null;

  const { faculty: selectedFaculty, setFaculty: setSelectedFaculty } = useFaculty();
  const { activeSpecialty: themeSpecialty, setActiveSpecialtyId } = useSpecialtyTheme();
  const [selectedSpecId, setSelectedSpecId] = useState<string>(initialSpec);
  const [selectedYear, setSelectedYear] = useState<MedicalYear | 'TOUS'>(
    initialYear && initialYear >= 1 && initialYear <= 6 ? initialYear : 'TOUS'
  );
  const [search, setSearch] = useState('');

  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>(ALL_SPECIALTIES);
  const [coursesList, setCoursesList] = useState<Course[]>(INITIAL_COURSES);

  React.useEffect(() => {
    if (initialSpec) {
      setSelectedSpecId(initialSpec);
      setActiveSpecialtyId(initialSpec);
    }
  }, [initialSpec, setActiveSpecialtyId]);

  // Fetch updated specialties from API
  React.useEffect(() => {
    fetch('/api/specialties')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.specialties) && d.specialties.length > 0) {
          setSpecialtiesList(d.specialties);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.courses) && d.courses.length > 0) {
          setCoursesList(d.courses);
        }
      })
      .catch(() => {});
  }, []);

  const activeSpecialty = specialtiesList.find(s => s.id === selectedSpecId) || ALL_SPECIALTIES.find(s => s.id === selectedSpecId);

  // Filtered specialties by Year and Faculty
  const filteredSpecialties = specialtiesList.filter(s => {
    const matchesYear = selectedYear === 'TOUS' || s.year === selectedYear;
    const matchesFac = selectedFaculty === 'TOUS' || !s.faculty || s.faculty === 'TOUS' || s.faculty === selectedFaculty;
    return matchesYear && matchesFac;
  });

  // Courses filtered by active specialty & faculty
  const specialtyCourses = selectedSpecId
    ? coursesList.filter(c => c.specialtyId === selectedSpecId)
    : coursesList;

  const displayCourses = specialtyCourses.filter(c => {
    const matchesSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));

    // Strict faculty separation:
    const matchesFaculty = selectedFaculty === 'TOUS'
      ? true
      : (c.faculty === selectedFaculty || c.faculty === 'TOUS');

    return matchesSearch && matchesFaculty;
  });

  return (
    <div className="space-y-8">
      {/* 1. Header Banner Apple Blur */}
      <div className="apple-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <BookOpen className="w-3.5 h-3.5 text-brand-600" />
              <span>Concours Résidanat Ouest</span>
            </div>
            
            {/* Faculty Switcher Pill */}
            <div className="inline-flex items-center p-1 rounded-full bg-navy-100 dark:bg-navy-800 border border-navy-200 dark:border-navy-700">
              <button
                onClick={() => setSelectedFaculty('TOUS')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedFaculty === 'TOUS'
                    ? 'bg-white dark:bg-navy-900 text-brand-600 shadow-sm'
                    : 'text-navy-600 dark:text-navy-300 hover:text-navy-950'
                }`}
              >
                Toutes Facultés
              </button>
              <button
                onClick={() => setSelectedFaculty('ORAN')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedFaculty === 'ORAN'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-navy-600 dark:text-navy-300 hover:text-navy-950'
                }`}
              >
                <span>🏛️ Oran</span>
              </button>
              <button
                onClick={() => setSelectedFaculty('SIDI_BEL_ABBES')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedFaculty === 'SIDI_BEL_ABBES'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-navy-600 dark:text-navy-300 hover:text-navy-950'
                }`}
              >
                <span>🏛️ Sidi Bel Abbès</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white tracking-tight">
            {activeSpecialty ? (
              <span className="flex items-center gap-2">
                <span>{getSpecialtyEmoji(activeSpecialty.id)}</span>
                <span>Cours en {activeSpecialty.name}</span>
                {activeSpecialty.year && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {activeSpecialty.year === 1 ? '1ère Année' : `${activeSpecialty.year}ème Année`}
                  </span>
                )}
              </span>
            ) : (
              'Bibliothèque Médicale (6 Années)'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-navy-600 dark:text-navy-300 leading-relaxed">
            {activeSpecialty
              ? `Sélectionnez le cours concerné ci-dessous pour l'ouvrir directement en lecture.`
              : `Parcourez les spécialités réparties par année d'études médicales en Algérie et filtrez par faculté.`}
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
              placeholder="Rechercher un cours..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/60 dark:bg-navy-900/60 border border-navy-200 dark:border-navy-700 text-xs text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Medical Years Filter Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-navy-600 dark:text-navy-300 px-1">
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-brand-600" />
            <span>Sélectionnez votre Année d&apos;Études :</span>
          </span>
          <span suppressHydrationWarning className="text-[11px] text-navy-400 font-mono">
            {filteredSpecialties.length} modules disponibles
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedYear('TOUS')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedYear === 'TOUS'
                ? 'bg-brand-600 text-white shadow-sm font-black'
                : 'apple-pill text-navy-600 dark:text-navy-300 hover:border-brand-300'
            }`}
          >
            <span suppressHydrationWarning>🎓 Toutes ({specialtiesList.length})</span>
          </button>
          {MEDICAL_YEARS.map(y => {
            const isSelected = selectedYear === y.id;
            const count = specialtiesList.filter(s => s.year === y.id).length;
            return (
              <button
                key={y.id}
                onClick={() => setSelectedYear(y.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm font-black'
                    : 'apple-pill text-navy-600 dark:text-navy-300 hover:border-brand-300'
                }`}
              >
                <span>{y.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-navy-100 dark:bg-navy-800 text-navy-500'
                }`}>
                  {y.badge} ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Top Horizontal Pills for quick specialty switching (Always in same tab) */}
      {selectedSpecId && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedSpecId('')}
            className="apple-pill px-3.5 py-1.5 rounded-full text-xs font-bold text-navy-600 dark:text-navy-300 shrink-0"
          >
            ← Vue Grille
          </button>
          {filteredSpecialties.map(s => {
            const isSelected = selectedSpecId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSpecId(s.id);
                  setActiveSpecialtyId(s.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  isSelected
                    ? 'apple-badge-purple shadow-sm'
                    : 'apple-pill text-navy-600 dark:text-navy-300 hover:border-brand-300'
                }`}
              >
                <SpecialtyLogo specialtyId={s.id} size="xs" withGlow={isSelected} />
                <span>{s.shortName}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 4. STEP 1: If no specialty selected, display the Specialties Apple Grid */}
      {!selectedSpecId ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-navy-950 dark:text-white uppercase tracking-wider text-xs">
              1. Choisissez une Spécialité :
            </h2>
            <span className="text-xs text-navy-500 font-medium">
              {filteredSpecialties.length} Modules affichés
            </span>
          </div>

          {filteredSpecialties.length === 0 ? (
            <div className="apple-card p-10 text-center space-y-2">
              <span className="text-3xl block">📚</span>
              <p className="text-xs font-bold text-navy-700 dark:text-navy-200">
                Aucun module trouvé pour les filtres sélectionnés.
              </p>
              <button
                onClick={() => {
                  setSelectedYear('TOUS');
                  setSelectedFaculty('TOUS');
                }}
                className="text-xs text-brand-600 font-bold hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredSpecialties.map((spec) => {
                const count = coursesList.filter(c => {
                  const matchSpec = c.specialtyId === spec.id;
                  const matchFac = selectedFaculty === 'TOUS' || !c.faculty || c.faculty === 'TOUS' || c.faculty === selectedFaculty;
                  return matchSpec && matchFac;
                }).length;
                const emoji = getSpecialtyEmoji(spec.id);

                return (
                  <button
                    key={spec.id}
                    onClick={() => {
                      setSelectedSpecId(spec.id);
                      setActiveSpecialtyId(spec.id);
                    }}
                    className="apple-card p-5 text-left group hover:scale-102 hover:border-brand-400 transition-all flex flex-col justify-between h-40 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <SpecialtyLogo specialtyId={spec.id} size="md" withGlow={true} />
                        <span className="text-xl group-hover:scale-110 transition-transform">
                          {emoji}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[11px] font-bold text-navy-400">
                          {count} cours
                        </span>
                        {spec.year && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800">
                            {spec.year}A
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-navy-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                        {spec.name}
                      </div>
                      <div className="text-[10px] text-navy-400 mt-1 flex items-center justify-between">
                        <span className="truncate">
                          {spec.faculty === 'ORAN' ? '🏛️ Oran' : spec.faculty === 'SIDI_BEL_ABBES' ? '🌿 SBA' : '🇩🇿 Tronc Commun'}
                        </span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform shrink-0" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* 4. STEP 2: Show the Courses for the selected specialty in this SAME TAB (No photos, pure emoji badges) */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-navy-950 dark:text-white flex items-center gap-2">
              <span className="text-xl">{getSpecialtyEmoji(activeSpecialty?.id)}</span>
              <span>Cours disponibles en {activeSpecialty?.name}</span>
            </h2>
            <span className="text-xs text-navy-500">
              {displayCourses.length} cours répertoriés
            </span>
          </div>

          {displayCourses.length === 0 ? (
            <div className="apple-card p-12 text-center">
              <span className="text-3xl mb-2 block">{getSpecialtyEmoji(activeSpecialty?.id)}</span>
              <p className="text-xs text-navy-500">Aucun cours trouvé pour cette recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayCourses.map((crs) => {
                const emoji = getSpecialtyEmoji(crs.specialtyId);

                return (
                  <Link
                    key={crs.id}
                    href={`/cours/${crs.slug}?fullscreen=true`}
                    className="apple-card p-6 group hover:border-brand-400 hover:scale-101 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Top Header with Emoji Badge instead of photos */}
                      <div className="flex items-start justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-950/50 dark:to-indigo-950/30 border border-brand-100 dark:border-brand-900 flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition-transform">
                          {emoji}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {crs.faculty === 'ORAN' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              🏛️ Oran
                            </span>
                          )}
                          {crs.faculty === 'SIDI_BEL_ABBES' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              🌿 Sidi Bel Abbès
                            </span>
                          )}
                          {(!crs.faculty || crs.faculty === 'TOUS') && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              🌐 National
                            </span>
                          )}
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-navy-100 dark:bg-navy-800 text-navy-800 dark:text-navy-200">
                            {crs.rang}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                            {crs.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Course Title & Details */}
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-navy-400 mb-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{crs.estimatedDuration}</span>
                          <span>•</span>
                          <span>{crs.tableOfContents?.length || 3} chapitres</span>
                        </div>
                        <h3 className="font-bold text-base text-navy-950 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                          {crs.title}
                        </h3>
                        <p className="text-xs text-navy-500 mt-1 line-clamp-2">
                          {crs.subtitle || crs.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="pt-4 mt-4 border-t border-navy-100 dark:border-navy-800 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
                      <span>Consulter le cours</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CoursPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-navy-400">Chargement de la bibliothèque...</div>}>
      <CoursHubContent />
    </Suspense>
  );
}
