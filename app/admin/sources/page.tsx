"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, CheckCircle2, Globe, Layers, ChevronDown, ChevronRight, Search, Sparkles } from "lucide-react";
import { ALL_SPECIALTIES } from "@/lib/db/seedData";
import { INITIAL_COURSES } from "@/lib/db/seedCourses";
import { getSpecialtyEmoji } from "@/lib/specialtyEmojis";
import { FacultyType } from "@/types";

type Scope = "global" | "specialty" | "course";

interface SourceItem {
  name: string;
  faculty?: "ORAN" | "SIDI_BEL_ABBES" | "TOUS";
  subSources?: string[];
}

interface ScopeGroup {
  key: string;
  label: string;
  sublabel?: string;
  emoji?: string;
  scope: Scope;
  specialty?: string;
  course?: string;
  sources: SourceItem[];
}

export default function AdminSourcesPage() {
  const [groups, setGroups] = useState<ScopeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Faculty filter view: TOUS | ORAN | SIDI_BEL_ABBES
  const [facultyFilter, setFacultyFilter] = useState<FacultyType>("TOUS");

  // Active panel: which scope we are adding to
  const [activeScope, setActiveScope] = useState<{ specialty?: string; course?: string } | null>(null);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceFaculty, setNewSourceFaculty] = useState<FacultyType>("TOUS");
  const [saving, setSaving] = useState(false);

  // Sub-source inline addition state
  const [addingSubSourceFor, setAddingSubSourceFor] = useState<{
    parentName: string;
    specialty?: string;
    course?: string;
    faculty?: string;
  } | null>(null);
  const [newSubSourceName, setNewSubSourceName] = useState<string>("");

  // Quick 3-step wizard state
  const [wizardFac, setWizardFac] = useState<FacultyType>("ORAN");
  const [wizardSpec, setWizardSpec] = useState<string>("cardio");
  const [wizardCourse, setWizardCourse] = useState<string>("");
  const [wizardName, setWizardName] = useState<string>("");

  // Batch Exam Years Generator
  const [startYearGen, setStartYearGen] = useState<number>(2017);
  const [endYearGen, setEndYearGen] = useState<number>(2025);
  const [isBatchYearMode, setIsBatchYearMode] = useState<boolean>(false);

  const handleBatchGenerateYears = async (e: React.FormEvent) => {
    e.preventDefault();
    const parentName = wizardName.trim() || 'Externat';
    setSaving(true);
    let addedCount = 0;

    try {
      for (let yr = startYearGen; yr < endYearGen; yr++) {
        const subName = `${yr}/${yr + 1}`;
        const body: Record<string, string> = { parentName, subSource: subName };
        if (wizardSpec) body.specialty = wizardSpec;
        if (wizardCourse) body.course = wizardCourse;
        if (wizardFac !== "TOUS") body.faculty = wizardFac;

        const res = await fetch("/api/admin/sources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success) addedCount++;
      }

      showMsg(`🎉 ${addedCount} sessions générées avec succès pour "${parentName}" (${startYearGen} à ${endYearGen}) !`);
      setWizardName("");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("asmedix-content-updated"));
      }
      load();
    } finally {
      setSaving(false);
    }
  };

  // Expand state per specialty
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ cardio: true });

  // Load all scope groups
  const load = async () => {
    setLoading(true);
    try {
      const allRes = await fetch("/api/admin/sources/all");
      const allData = await allRes.json();
      const allScopes: {
        key: string;
        specialty?: string;
        course?: string;
        faculty?: string;
        sources: string[];
        structuredSources?: { name: string; subSources: string[] }[];
      }[] = allData.scopes || [];

      const getSourcesFor = (spec?: string, crs?: string): SourceItem[] => {
        const list: SourceItem[] = [];
        for (const entry of allScopes) {
          const matchSpec = (entry.specialty || undefined) === (spec || undefined);
          const matchCrs = (entry.course || undefined) === (crs || undefined);
          if (matchSpec && matchCrs) {
            const fac = (entry.faculty as "ORAN" | "SIDI_BEL_ABBES" | undefined) || "TOUS";
            if (Array.isArray(entry.structuredSources) && entry.structuredSources.length > 0) {
              for (const s of entry.structuredSources) {
                list.push({ name: s.name, faculty: fac, subSources: s.subSources || [] });
              }
            } else if (Array.isArray(entry.sources)) {
              for (const s of entry.sources) {
                list.push({ name: s, faculty: fac, subSources: [] });
              }
            }
          }
        }
        return list;
      };

      const built: ScopeGroup[] = [];

      // Global
      built.push({
        key: "__global__",
        label: "Sources Globales",
        sublabel: "Disponibles dans toutes les spécialités",
        emoji: "🌐",
        scope: "global",
        sources: getSourcesFor(undefined, undefined),
      });

      // Per specialty + per course
      for (const spec of ALL_SPECIALTIES) {
        built.push({
          key: spec.id,
          label: spec.name,
          sublabel: `Sources propres à ${spec.name}`,
          emoji: getSpecialtyEmoji(spec.id),
          scope: "specialty",
          specialty: spec.id,
          sources: getSourcesFor(spec.id, undefined),
        });

        const specCourses = INITIAL_COURSES.filter((c) => c.specialtyId === spec.id);
        for (const crs of specCourses) {
          built.push({
            key: `${spec.id}__${crs.id}`,
            label: crs.title,
            sublabel: spec.name,
            emoji: "📖",
            scope: "course",
            specialty: spec.id,
            course: crs.id,
            sources: getSourcesFor(spec.id, crs.id),
          });
        }
      }

      setGroups(built);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const showMsg = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleAdd = async () => {
    const name = newSourceName.trim();
    if (!name || !activeScope) return;
    setSaving(true);
    const body: Record<string, string> = { name };
    if (activeScope.specialty) body.specialty = activeScope.specialty;
    if (activeScope.course) body.course = activeScope.course;
    if (newSourceFaculty !== "TOUS") body.faculty = newSourceFaculty;

    try {
      const res = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setNewSourceName("");
        setActiveScope(null);
        showMsg(`Source ajoutée avec succès${newSourceFaculty !== "TOUS" ? ` pour ${newSourceFaculty}` : ""} !`);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("asmedix-content-updated"));
        }
        load();
      }
    } finally {
      setSaving(false);
    }
  };

  // Quick 3-Step Wizard Addition
  const handleWizardAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = wizardName.trim();
    if (!name) return;
    setSaving(true);

    const body: Record<string, string> = { name };
    if (wizardSpec) body.specialty = wizardSpec;
    if (wizardCourse) body.course = wizardCourse;
    if (wizardFac !== "TOUS") body.faculty = wizardFac;

    try {
      const res = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setWizardName("");
        if (wizardSpec) setExpanded((p) => ({ ...p, [wizardSpec]: true }));
        showMsg(`Source "${name}" ajoutée instantanément pour ${wizardFac === "TOUS" ? "Toutes Facultés" : wizardFac} !`);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("asmedix-content-updated"));
        }
        load();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubSourceDirect = async (parentName: string, subSourceName: string, specialty?: string, course?: string, faculty?: string) => {
    const cleanSub = subSourceName.trim();
    if (!cleanSub) return;
    setSaving(true);
    const body: Record<string, string> = { parentName, subSource: cleanSub };
    if (specialty) body.specialty = specialty;
    if (course) body.course = course;
    if (faculty && faculty !== "TOUS") body.faculty = faculty;

    try {
      const res = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setAddingSubSourceFor(null);
        setNewSubSourceName("");
        showMsg(`Sous-source "${cleanSub}" ajoutée à "${parentName}" !`);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("asmedix-content-updated"));
        }
        load();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubSource = async (parentName: string, subSource: string, specialty?: string, course?: string, faculty?: string) => {
    if (!confirm(`Supprimer la sous-source "${subSource}" de "${parentName}" ?`)) return;
    const body: Record<string, string> = { parentName, subSource };
    if (specialty) body.specialty = specialty;
    if (course) body.course = course;
    if (faculty && faculty !== "TOUS") body.faculty = faculty;

    await fetch("/api/admin/sources", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    showMsg(`Sous-source "${subSource}" supprimée.`);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("asmedix-content-updated"));
    }
    load();
  };

  const handleDelete = async (name: string, specialty?: string, course?: string, faculty?: string) => {
    const facLabel = faculty && faculty !== "TOUS" ? ` (${faculty})` : "";
    if (!confirm(`Supprimer "${name}"${facLabel} et toutes ses sous-sources ?`)) return;
    const body: Record<string, string> = { name };
    if (specialty) body.specialty = specialty;
    if (course) body.course = course;
    if (faculty && faculty !== "TOUS") body.faculty = faculty;

    await fetch("/api/admin/sources", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    showMsg("Source supprimée.");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("asmedix-content-updated"));
    }
    load();
  };

  const filterSourcesList = (sources: SourceItem[]) => {
    let list = sources;
    if (facultyFilter !== "TOUS") {
      list = list.filter((s) => !s.faculty || s.faculty === "TOUS" || s.faculty === facultyFilter);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(term) || s.subSources?.some((sub) => sub.toLowerCase().includes(term)));
    }
    return list;
  };

  const renderSourceCard = (src: SourceItem, specialty?: string, course?: string) => {
    const isOran = src.faculty === "ORAN";
    const isSba = src.faculty === "SIDI_BEL_ABBES";
    const isAddingSub =
      addingSubSourceFor?.parentName === src.name &&
      addingSubSourceFor?.specialty === specialty &&
      addingSubSourceFor?.course === course &&
      addingSubSourceFor?.faculty === src.faculty;

    return (
      <div
        key={`${src.name}-${src.faculty || "TOUS"}`}
        className="p-3 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700/80 shadow-2xs space-y-2 transition-all hover:border-slate-300 dark:hover:border-navy-600"
      >
        {/* Header: Name + Faculty Badge + Quick Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-white truncate">
              📖 {src.name}
            </span>
            {isOran && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-amber-500 text-white font-black shrink-0">
                🏛️ Oran
              </span>
            )}
            {isSba && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-indigo-600 text-white font-black shrink-0">
                🏛️ SBA
              </span>
            )}
            {!isOran && !isSba && (
              <span className="px-1.5 py-0.5 rounded-md text-[9px] bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 font-bold shrink-0">
                🌐 Commun
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (isAddingSub) {
                  setAddingSubSourceFor(null);
                  setNewSubSourceName("");
                } else {
                  setAddingSubSourceFor({
                    parentName: src.name,
                    specialty,
                    course,
                    faculty: src.faculty,
                  });
                  setNewSubSourceName("");
                }
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 text-[10px] font-bold border border-sky-200 dark:border-sky-800 cursor-pointer transition-colors"
              title="Ajouter une sous-source (session, EMD, année)"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>+ Session</span>
            </button>
            <button
              type="button"
              onClick={() => handleDelete(src.name, specialty, course, src.faculty)}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Supprimer cette source et toutes ses sous-sources"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sub-sources list badges */}
        {src.subSources && src.subSources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {src.subSources.map((sub) => (
              <div
                key={sub}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-slate-200/80 dark:border-navy-700"
              >
                <span>📅 {sub.startsWith("Session") || sub.startsWith("EMD") ? sub : `Session ${sub}`}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteSubSource(src.name, sub, specialty, course, src.faculty)}
                  className="text-slate-400 hover:text-rose-600 ml-0.5 text-xs font-bold leading-none cursor-pointer"
                  title={`Supprimer la sous-source "${sub}"`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Inline add sub-source form */}
        {isAddingSub && (
          <div className="p-2 rounded-xl bg-sky-50/70 dark:bg-navy-800/80 border border-sky-200/80 dark:border-sky-800 flex items-center gap-1.5 animate-fade-in mt-1">
            <input
              autoFocus
              type="text"
              value={newSubSourceName}
              onChange={(e) => setNewSubSourceName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddSubSourceDirect(src.name, newSubSourceName, specialty, course, src.faculty);
                }
              }}
              placeholder="Nom de session (ex: EMD 1, 2024, Session Rattrapage...)"
              className="flex-1 px-2.5 py-1 rounded-lg border border-sky-300 dark:border-sky-700 bg-white dark:bg-navy-900 text-xs text-slate-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => handleAddSubSourceDirect(src.name, newSubSourceName, specialty, course, src.faculty)}
              disabled={saving || !newSubSourceName.trim()}
              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              {saving ? "..." : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAddingSubSourceFor(null);
                setNewSubSourceName("");
              }}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-navy-700 text-slate-500 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  };

  const globalGroup = groups.find((g) => g.key === "__global__");
  const specGroups = groups.filter((g) => g.scope === "specialty");
  const wizardCourses = INITIAL_COURSES.filter((c) => c.specialtyId === wizardSpec);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Gestion des Sources & Ouvrages Médicaux
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ajoutez des sources au niveau Global, par Spécialité ou par Cours, avec distinction de faculté (Oran vs Sidi Bel Abbès).
          </p>
        </div>

        {/* Faculty View Switcher */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-xs shrink-0">
          <button
            onClick={() => setFacultyFilter("TOUS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              facultyFilter === "TOUS"
                ? "bg-white dark:bg-navy-800 text-blue-700 dark:text-blue-300 shadow-sm font-black"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <span>🌐</span>
            <span>Toutes Facultés</span>
          </button>
          <button
            onClick={() => setFacultyFilter("ORAN")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              facultyFilter === "ORAN"
                ? "bg-amber-500 text-white shadow-sm font-black"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <span>🏛️</span>
            <span>Oran</span>
          </button>
          <button
            onClick={() => setFacultyFilter("SIDI_BEL_ABBES")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              facultyFilter === "SIDI_BEL_ABBES"
                ? "bg-indigo-600 text-white shadow-sm font-black"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <span>🏛️</span>
            <span>SBA</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {msg}
        </div>
      )}

      {/* ── 3-STEP QUICK ADD WIZARD (Faculté ➔ Module ➔ Cours) ── */}
      <form onSubmit={handleWizardAdd} className="p-5 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-black text-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ajout Rapide de Sources & Sessions d'Examens (Faculté ➔ Module ➔ Cours) :</span>
          </div>

          <div className="flex items-center gap-1 bg-white/20 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setIsBatchYearMode(false)}
              className={`px-3 py-1 rounded-lg transition-all ${!isBatchYearMode ? 'bg-white text-slate-900 font-black' : 'text-white/80 hover:text-white'}`}
            >
              Source Unique
            </button>
            <button
              type="button"
              onClick={() => setIsBatchYearMode(true)}
              className={`px-3 py-1 rounded-lg transition-all ${isBatchYearMode ? 'bg-amber-400 text-slate-950 font-black' : 'text-white/80 hover:text-white'}`}
            >
              ⚡ Générateur d'Années (2017-2025)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Step 1: Faculté */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-white/80 mb-1">1. Faculté :</label>
            <select
              value={wizardFac}
              onChange={(e) => setWizardFac(e.target.value as FacultyType)}
              className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/30 text-white font-bold text-xs"
            >
              <option value="ORAN" className="text-slate-900">🏛️ Oran</option>
              <option value="SIDI_BEL_ABBES" className="text-slate-900">🏛️ Sidi Bel Abbès</option>
              <option value="TOUS" className="text-slate-900">🌐 Commun (Toutes)</option>
            </select>
          </div>

          {/* Step 2: Module */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-white/80 mb-1">2. Module / Spécialité :</label>
            <select
              value={wizardSpec}
              onChange={(e) => {
                setWizardSpec(e.target.value);
                setWizardCourse("");
              }}
              className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/30 text-white font-bold text-xs"
            >
              {ALL_SPECIALTIES.map((s) => (
                <option key={s.id} value={s.id} className="text-slate-900">
                  {getSpecialtyEmoji(s.id)} {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Cours */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-white/80 mb-1">3. Mode / Cours :</label>
            <select
              value={wizardCourse}
              onChange={(e) => setWizardCourse(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/20 border border-white/30 text-white font-bold text-xs"
            >
              <option value="" className="text-slate-900">🌐 Tout le module</option>
              {wizardCourses.map((c) => (
                <option key={c.id} value={c.id} className="text-slate-900">
                  📖 {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Source Name Input or Batch Range */}
          {!isBatchYearMode ? (
            <div>
              <label className="block text-[10px] font-bold uppercase text-white/80 mb-1">Nom de la source * :</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={wizardName}
                  onChange={(e) => setWizardName(e.target.value)}
                  placeholder="Ex: Externat, SIAU..."
                  className="w-full px-3 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={saving || !wizardName.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 disabled:opacity-40 cursor-pointer"
                >
                  {saving ? "..." : "+ Ajouter"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[10px] font-bold uppercase text-white/80 mb-1">Source Parente & Années :</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={wizardName}
                  onChange={(e) => setWizardName(e.target.value)}
                  placeholder="Externat"
                  className="w-1/2 px-2.5 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs placeholder:text-slate-400"
                />
                <select
                  value={startYearGen}
                  onChange={e => setStartYearGen(Number(e.target.value))}
                  className="w-1/4 px-1.5 py-2 rounded-xl bg-white/20 text-white font-bold text-[11px]"
                >
                  {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022].map(y => (
                    <option key={y} value={y} className="text-slate-900">{y}</option>
                  ))}
                </select>
                <span className="text-xs font-bold">à</span>
                <select
                  value={endYearGen}
                  onChange={e => setEndYearGen(Number(e.target.value))}
                  className="w-1/4 px-1.5 py-2 rounded-xl bg-white/20 text-white font-bold text-[11px]"
                >
                  {[2021, 2022, 2023, 2024, 2025, 2026].map(y => (
                    <option key={y} value={y} className="text-slate-900">{y}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleBatchGenerateYears}
                  disabled={saving}
                  className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 disabled:opacity-40 cursor-pointer"
                >
                  {saving ? "..." : "⚡ Générer"}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* ── INSTANT SEARCH FILTER BAR ── */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une source par nom (ex: 2024, Oran, SBA, Annales, Résidanat...)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-xs font-medium text-slate-900 dark:text-white"
        />
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Chargement des sources...</div>
      ) : (
        <div className="space-y-4">

          {/* ── GLOBAL SOURCES ─────────────────────────────────────────────── */}
          {globalGroup && (
            <div className="apple-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">Sources Globales</div>
                    <div className="text-[10px] text-slate-400">
                      Disponibles partout — toutes spécialités, tous cours
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveScope(
                      activeScope?.specialty === undefined && activeScope?.course === undefined ? null : {}
                    );
                    setNewSourceFaculty(facultyFilter);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter
                </button>
              </div>

              {/* Add form */}
              {activeScope && activeScope.specialty === undefined && activeScope.course === undefined && (
                <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-navy-800/60 border border-blue-200/80 dark:border-navy-700 space-y-2.5 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300">
                      Ajouter une source globale :
                    </span>
                    <div className="flex items-center gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setNewSourceFaculty("TOUS")}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                          newSourceFaculty === "TOUS"
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-navy-900 text-slate-600 border"
                        }`}
                      >
                        🌐 Commun
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewSourceFaculty("ORAN")}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                          newSourceFaculty === "ORAN"
                            ? "bg-amber-500 text-white"
                            : "bg-white dark:bg-navy-900 text-slate-600 border"
                        }`}
                      >
                        🏛️ Oran
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewSourceFaculty("SIDI_BEL_ABBES")}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                          newSourceFaculty === "SIDI_BEL_ABBES"
                            ? "bg-indigo-600 text-white"
                            : "bg-white dark:bg-navy-900 text-slate-600 border"
                        }`}
                      >
                        🏛️ SBA
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      autoFocus
                      type="text"
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAdd();
                      }}
                      placeholder="Nom de la source (ex: Externat Oran, Annales Résidanat...)"
                      className="flex-1 px-3 py-2 rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-navy-900 text-xs"
                    />
                    <button
                      onClick={handleAdd}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40"
                    >
                      {saving ? "..." : "Enregistrer"}
                    </button>
                    <button
                      onClick={() => setActiveScope(null)}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Sources cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {filterSourcesList(globalGroup.sources).length === 0 && (
                  <span className="text-xs text-slate-400 italic col-span-2">Aucune source pour ce filtre.</span>
                )}
                {filterSourcesList(globalGroup.sources).map((src) => renderSourceCard(src, undefined, undefined))}
              </div>
            </div>
          )}

          {/* ── PER SPECIALTY & PER COURSE ───────────────────────────────────── */}
          {specGroups.map((specGroup) => {
            const specId = specGroup.specialty!;
            const isOpen = expanded[specId];
            const courseGroupsForSpec = groups.filter(
              (g) => g.scope === "course" && g.specialty === specId
            );
            const specFilteredSources = filterSourcesList(specGroup.sources);
            const totalSources =
              specFilteredSources.length +
              courseGroupsForSpec.reduce((a, c) => a + filterSourcesList(c.sources).length, 0);

            return (
              <div key={specId} className="apple-card overflow-hidden">
                {/* Specialty Accordion Header */}
                <button
                  onClick={() => setExpanded((p) => ({ ...p, [specId]: !p[specId] }))}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-navy-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{specGroup.emoji}</span>
                    <div className="text-left">
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        {specGroup.label}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {specFilteredSources.length} source{specFilteredSources.length !== 1 ? "s" : ""}{" "}
                        spécialité · {courseGroupsForSpec.length} cours
                        {totalSources > 0 && (
                          <span className="text-blue-600 font-semibold"> · {totalSources} au total</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-navy-800 pt-4">

                    {/* Specialty-Level Sources */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Layers className="w-3 h-3" /> Sources pour tout le module {specGroup.label} :
                        </span>
                        <button
                          onClick={() => {
                            setActiveScope(
                              activeScope?.specialty === specId && !activeScope?.course
                                ? null
                                : { specialty: specId }
                            );
                            setNewSourceFaculty(facultyFilter);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shadow-xs transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Ajouter
                        </button>
                      </div>

                      {/* Add specialty source form */}
                      {activeScope?.specialty === specId && !activeScope?.course && (
                        <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-navy-800/60 border border-blue-200/70 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-blue-900 dark:text-blue-300">
                              Faculté cible :
                            </span>
                            <div className="flex items-center gap-1 text-[10px]">
                              <button
                                type="button"
                                onClick={() => setNewSourceFaculty("TOUS")}
                                className={`px-2 py-0.5 rounded-md font-bold ${
                                  newSourceFaculty === "TOUS" ? "bg-blue-600 text-white" : "bg-white border"
                                }`}
                              >
                                🌐 Commun
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewSourceFaculty("ORAN")}
                                className={`px-2 py-0.5 rounded-md font-bold ${
                                  newSourceFaculty === "ORAN" ? "bg-amber-500 text-white" : "bg-white border"
                                }`}
                              >
                                🏛️ Oran
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewSourceFaculty("SIDI_BEL_ABBES")}
                                className={`px-2 py-0.5 rounded-md font-bold ${
                                  newSourceFaculty === "SIDI_BEL_ABBES" ? "bg-indigo-600 text-white" : "bg-white border"
                                }`}
                              >
                                🏛️ SBA
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <input
                              autoFocus
                              type="text"
                              value={newSourceName}
                              onChange={(e) => setNewSourceName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAdd();
                              }}
                              placeholder={`Source pour ${specGroup.label}...`}
                              className="flex-1 px-3 py-1.5 rounded-xl border border-blue-300 bg-white dark:bg-navy-900 text-xs"
                            />
                            <button
                              onClick={handleAdd}
                              disabled={saving}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40"
                            >
                              {saving ? "..." : "✓"}
                            </button>
                            <button
                              onClick={() => setActiveScope(null)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Specialty sources list */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {specFilteredSources.length === 0 && (
                          <span className="text-[10px] text-slate-400 italic col-span-2">
                            Aucune source spécifique à cette spécialité.
                          </span>
                        )}
                        {specFilteredSources.map((src) => renderSourceCard(src, specId, undefined))}
                      </div>
                    </div>

                    {/* Per-Course Sources */}
                    {courseGroupsForSpec.length > 0 && (
                      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-navy-800">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          Sources par Cours Spécifique :
                        </div>

                        {courseGroupsForSpec.map((crsGroup) => {
                          const crsFilteredSources = filterSourcesList(crsGroup.sources);
                          const isAddingToThisCourse =
                            activeScope?.specialty === specId && activeScope?.course === crsGroup.course;

                          return (
                            <div
                              key={crsGroup.key}
                              className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-800/50 border border-slate-200/80 dark:border-navy-800 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-[11px] font-bold text-slate-900 dark:text-navy-200 flex items-center gap-1.5">
                                  <span>📖</span>
                                  <span className="truncate">{crsGroup.label}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setActiveScope(
                                      isAddingToThisCourse
                                        ? null
                                        : { specialty: specId, course: crsGroup.course }
                                    );
                                    setNewSourceFaculty(facultyFilter);
                                  }}
                                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold shrink-0 shadow-xs cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" /> Ajouter
                                </button>
                              </div>

                              {/* Inline form for this course */}
                              {isAddingToThisCourse && (
                                <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-navy-800 border border-indigo-200/70 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-indigo-900 dark:text-indigo-300">
                                      Faculté :
                                    </span>
                                    <div className="flex items-center gap-1 text-[9px]">
                                      <button
                                        type="button"
                                        onClick={() => setNewSourceFaculty("TOUS")}
                                        className={`px-2 py-0.5 rounded font-bold ${
                                          newSourceFaculty === "TOUS" ? "bg-indigo-600 text-white" : "bg-white border"
                                        }`}
                                      >
                                        🌐 Commun
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setNewSourceFaculty("ORAN")}
                                        className={`px-2 py-0.5 rounded font-bold ${
                                          newSourceFaculty === "ORAN" ? "bg-amber-500 text-white" : "bg-white border"
                                        }`}
                                      >
                                        🏛️ Oran
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setNewSourceFaculty("SIDI_BEL_ABBES")}
                                        className={`px-2 py-0.5 rounded font-bold ${
                                          newSourceFaculty === "SIDI_BEL_ABBES" ? "bg-indigo-600 text-white" : "bg-white border"
                                        }`}
                                      >
                                        🏛️ SBA
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <input
                                      autoFocus
                                      type="text"
                                      value={newSourceName}
                                      onChange={(e) => setNewSourceName(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") handleAdd();
                                      }}
                                      placeholder={`Source pour "${crsGroup.label}"...`}
                                      className="flex-1 px-3 py-1.5 rounded-xl border border-indigo-300 bg-white dark:bg-navy-900 text-xs"
                                    />
                                    <button
                                      onClick={handleAdd}
                                      disabled={saving}
                                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
                                    >
                                      {saving ? "..." : "✓"}
                                    </button>
                                    <button
                                      onClick={() => setActiveScope(null)}
                                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Course sources list */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {crsFilteredSources.length === 0 && (
                                  <span className="text-[10px] text-slate-400 italic col-span-2">
                                    Aucune source pour ce cours.
                                  </span>
                                )}
                                {crsFilteredSources.map((src) => renderSourceCard(src, specId, crsGroup.course))}
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
          })}
        </div>
      )}
    </div>
  );
}
