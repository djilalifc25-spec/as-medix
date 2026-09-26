"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, CheckCircle2, Globe, Layers, ChevronDown, ChevronRight, School } from "lucide-react";
import { ALL_SPECIALTIES } from "@/lib/db/seedData";
import { INITIAL_COURSES } from "@/lib/db/seedCourses";
import { getSpecialtyEmoji } from "@/lib/specialtyEmojis";
import { FacultyType } from "@/types";

type Scope = "global" | "specialty" | "course";

interface SourceItem {
  name: string;
  faculty?: "ORAN" | "SIDI_BEL_ABBES" | "TOUS";
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

  // Faculty filter view: TOUS | ORAN | SIDI_BEL_ABBES
  const [facultyFilter, setFacultyFilter] = useState<FacultyType>("TOUS");

  // Active panel: which scope we are adding to
  const [activeScope, setActiveScope] = useState<{ specialty?: string; course?: string } | null>(null);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceFaculty, setNewSourceFaculty] = useState<FacultyType>("TOUS");
  const [saving, setSaving] = useState(false);

  // Expand state per specialty
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Load all scope groups
  const load = async () => {
    setLoading(true);
    try {
      // 1. Fetch all scopes overview
      const allRes = await fetch("/api/admin/sources/all");
      const allData = await allRes.json();
      const allScopes: { key: string; specialty?: string; course?: string; faculty?: string; sources: string[] }[] = allData.scopes || [];

      // Helper to collect sources for a specific scope
      const getSourcesFor = (spec?: string, crs?: string): SourceItem[] => {
        const list: SourceItem[] = [];
        for (const entry of allScopes) {
          const matchSpec = (entry.specialty || undefined) === (spec || undefined);
          const matchCrs = (entry.course || undefined) === (crs || undefined);
          if (matchSpec && matchCrs) {
            const fac = (entry.faculty as "ORAN" | "SIDI_BEL_ABBES" | undefined) || "TOUS";
            for (const s of entry.sources) {
              list.push({ name: s, faculty: fac });
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
        load();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (name: string, specialty?: string, course?: string, faculty?: string) => {
    const facLabel = faculty && faculty !== "TOUS" ? ` (${faculty})` : "";
    if (!confirm(`Supprimer "${name}"${facLabel} de ce scope ?`)) return;
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
    load();
  };

  // Filter sources according to selected faculty
  const filterSourcesList = (sources: SourceItem[]) => {
    if (facultyFilter === "TOUS") return sources;
    return sources.filter((s) => !s.faculty || s.faculty === "TOUS" || s.faculty === facultyFilter);
  };

  const globalGroup = groups.find((g) => g.key === "__global__");
  const specGroups = groups.filter((g) => g.scope === "specialty");

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
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-xs">
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
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
                    {/* Faculty Target Pill */}
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

              {/* Sources pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {filterSourcesList(globalGroup.sources).length === 0 && (
                  <span className="text-xs text-slate-400 italic">Aucune source pour ce filtre.</span>
                )}
                {filterSourcesList(globalGroup.sources).map((src) => {
                  const isOran = src.faculty === "ORAN";
                  const isSba = src.faculty === "SIDI_BEL_ABBES";
                  return (
                    <div
                      key={`${src.name}-${src.faculty}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-900 dark:text-blue-300"
                    >
                      <span>📖 {src.name}</span>
                      {isOran && (
                        <span className="px-1.5 py-0.2 rounded-md text-[9px] bg-amber-500 text-white font-black">
                          Oran
                        </span>
                      )}
                      {isSba && (
                        <span className="px-1.5 py-0.2 rounded-md text-[9px] bg-indigo-600 text-white font-black">
                          SBA
                        </span>
                      )}
                      {!isOran && !isSba && (
                        <span className="px-1.5 py-0.2 rounded-md text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                          Commun
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(src.name, undefined, undefined, src.faculty)}
                        className="text-blue-400 hover:text-rose-600 ml-1"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
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
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-navy-800/50 transition-colors"
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
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shadow-xs transition-all"
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
                      <div className="flex flex-wrap gap-2">
                        {specFilteredSources.length === 0 && (
                          <span className="text-[10px] text-slate-400 italic">
                            Aucune source spécifique à cette spécialité.
                          </span>
                        )}
                        {specFilteredSources.map((src) => (
                          <div
                            key={`${src.name}-${src.faculty}`}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-blue-900 dark:text-blue-300"
                          >
                            <span>📖 {src.name}</span>
                            {src.faculty === "ORAN" && (
                              <span className="px-1.5 py-0.2 rounded-md text-[9px] bg-amber-500 text-white font-black">
                                Oran
                              </span>
                            )}
                            {src.faculty === "SIDI_BEL_ABBES" && (
                              <span className="px-1.5 py-0.2 rounded-md text-[9px] bg-indigo-600 text-white font-black">
                                SBA
                              </span>
                            )}
                            <button
                              onClick={() => handleDelete(src.name, specId, undefined, src.faculty)}
                              className="text-blue-400 hover:text-rose-600 ml-0.5"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
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
                                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold shrink-0 shadow-xs"
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
                                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold disabled:opacity-40"
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

                              {/* Course sources list */}
                              <div className="flex flex-wrap gap-1.5">
                                {crsFilteredSources.length === 0 && (
                                  <span className="text-[10px] text-slate-400 italic">
                                    Aucune source pour ce cours.
                                  </span>
                                )}
                                {crsFilteredSources.map((src) => (
                                  <div
                                    key={`${src.name}-${src.faculty}`}
                                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-navy-900 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold text-indigo-900 dark:text-indigo-300 shadow-2xs"
                                  >
                                    <span>📖 {src.name}</span>
                                    {src.faculty === "ORAN" && (
                                      <span className="px-1.5 py-0.1 rounded text-[8px] bg-amber-500 text-white font-black">
                                        Oran
                                      </span>
                                    )}
                                    {src.faculty === "SIDI_BEL_ABBES" && (
                                      <span className="px-1.5 py-0.1 rounded text-[8px] bg-indigo-600 text-white font-black">
                                        SBA
                                      </span>
                                    )}
                                    <button
                                      onClick={() => handleDelete(src.name, specId, crsGroup.course, src.faculty)}
                                      className="text-indigo-400 hover:text-rose-600 ml-0.5"
                                    >
                                      <Trash2 className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                ))}
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
