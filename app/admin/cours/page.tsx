'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import { ALL_SPECIALTIES } from '@/lib/db/seedData';
import { getSpecialtyEmoji } from '@/lib/specialtyEmojis';
import {
  Plus, Search, Edit3, Trash2, Copy, ExternalLink, Filter,
  BookOpen, School, RefreshCw, CheckSquare, Square, AlertTriangle, X
} from 'lucide-react';

const MEDICAL_YEARS = [
  { value: 'ALL', label: 'Toutes les années' },
  { value: '1', label: '1ère Année (PCEM1)' },
  { value: '2', label: '2ème Année (PCEM2)' },
  { value: '3', label: '3ème Année (DCEM1)' },
  { value: '4', label: '4ème Année (DCEM2)' },
  { value: '5', label: '5ème Année (DCEM3)' },
  { value: '6', label: '6ème Année (DCEM4)' },
  { value: 'none', label: '🌐 Sans Année / Transversal' },
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      setCourses(data.courses || []);
      setSelectedIds(new Set());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_publish', id })
      });
      if (res.ok) {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, published: !c.published } : c));
        window.dispatchEvent(new Event('asmedix-content-updated'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate', id })
      });
      if (res.ok) {
        fetchCourses();
        window.dispatchEvent(new Event('asmedix-content-updated'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Single delete — ONE API call only (DELETE HTTP verb)
  const handleDelete = async (id: string, title?: string) => {
    if (!confirm(`Supprimer définitivement "${title || id}" ?\nIl sera effacé du panel, de la sidebar ET de la base SQL Supabase.`)) return;

    setCourses(prev => prev.filter(c => c.id !== id));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) {
        fetchCourses();
      } else {
        window.dispatchEvent(new Event('asmedix-content-updated'));
      }
    } catch (e) {
      console.error('Delete course error:', e);
      fetchCourses();
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!confirm(`Supprimer définitivement ${ids.length} cours sélectionnés ?\nIls seront supprimés du panel, de la sidebar ET de la base SQL Supabase.`)) return;

    setBulkDeleting(true);
    setCourses(prev => prev.filter(c => !selectedIds.has(c.id)));
    setSelectedIds(new Set());

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      if (!res.ok) {
        fetchCourses();
      } else {
        window.dispatchEvent(new Event('asmedix-content-updated'));
      }
    } catch (e) {
      console.error('Bulk delete error:', e);
      fetchCourses();
    } finally {
      setBulkDeleting(false);
    }
  };

  // Filter courses
  const filtered = courses.filter(c => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q ||
      c.title.toLowerCase().includes(q) ||
      c.specialtyName.toLowerCase().includes(q) ||
      (c.author && c.author.toLowerCase().includes(q));
    const matchesSpec = selectedSpecialty === 'ALL' ||
      c.specialtyId === selectedSpecialty ||
      c.specialtyName.toLowerCase() === selectedSpecialty.toLowerCase();
    let matchesYear = true;
    if (selectedYear !== 'ALL') {
      if (selectedYear === 'none') matchesYear = !c.year;
      else matchesYear = String(c.year) === selectedYear;
    }
    return matchesQuery && matchesSpec && matchesYear;
  });

  const allFilteredSelected = filtered.length > 0 && filtered.every(c => selectedIds.has(c.id));
  const someFilteredSelected = filtered.some(c => selectedIds.has(c.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(prev => { const n = new Set(prev); filtered.forEach(c => n.delete(c.id)); return n; });
    } else {
      setSelectedIds(prev => { const n = new Set(prev); filtered.forEach(c => n.add(c.id)); return n; });
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#5D5FEF]" />
            <span>Gestion des Cours Médicaux (CMS)</span>
          </h1>
          <p className="text-xs text-navy-500 mt-0.5">
            Ajoutez, éditez en HTML, prévisualisez, filtrez et supprimez les cours du curriculum
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCourses}
            title="Rafraîchir la liste"
            className="p-2.5 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-navy-600 dark:text-navy-300 hover:text-[#5D5FEF] transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/cours/nouveau"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#5D5FEF] hover:bg-iris-700 text-white shadow-soft shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Cours (Éditeur HTML)</span>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-navy-800 dark:text-navy-200">
            <Filter className="w-4 h-4 text-[#5D5FEF]" />
            <span>Filtres de recherche et classification</span>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-iris-50 text-[#5D5FEF] dark:bg-iris-950 dark:text-iris-300 border border-iris-200 dark:border-iris-800">
            {filtered.length} / {courses.length} cours
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un cours par titre..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-xs text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-[#5D5FEF]"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-navy-400 shrink-0" />
            <select
              value={selectedSpecialty}
              onChange={e => setSelectedSpecialty(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5D5FEF]"
            >
              <option value="ALL">📚 Tous les Modules / Spécialités</option>
              {ALL_SPECIALTIES.map(s => (
                <option key={s.id} value={s.id}>
                  {getSpecialtyEmoji(s.id)} {s.name} ({s.shortName})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <School className="w-4 h-4 text-navy-400 shrink-0" />
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-navy-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800 text-xs font-semibold text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5D5FEF]"
            >
              {MEDICAL_YEARS.map(yr => (
                <option key={yr.value} value={yr.value}>🎓 {yr.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Delete Floating Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-rose-600 text-white shadow-2xl border border-rose-500">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="text-sm font-bold">
            {selectedIds.size} cours sélectionné{selectedIds.size > 1 ? 's' : ''}
          </span>
          <button
            onClick={handleBulkDelete}
            disabled={bulkDeleting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white text-rose-700 text-xs font-black hover:bg-rose-50 transition-all disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{bulkDeleting ? 'Suppression...' : 'Supprimer la sélection'}</span>
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="p-1 rounded-lg hover:bg-rose-500 transition-colors"
            title="Annuler la sélection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Courses Table */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-50 dark:bg-navy-800/60 text-navy-700 dark:text-navy-300 font-bold uppercase tracking-wider border-b border-navy-100 dark:border-navy-800">
              <tr>
                <th className="p-4 w-10">
                  <button
                    onClick={toggleSelectAll}
                    className="text-navy-400 hover:text-[#5D5FEF] transition-colors"
                    title={allFilteredSelected ? 'Désélectionner tout' : 'Sélectionner tout'}
                  >
                    {allFilteredSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#5D5FEF]" />
                    ) : someFilteredSelected ? (
                      <CheckSquare className="w-4 h-4 text-navy-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4">Titre du Cours</th>
                <th className="p-4">Spécialité / Module</th>
                <th className="p-4">Année</th>
                <th className="p-4">Accès</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50 dark:divide-navy-800 text-navy-700 dark:text-navy-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs font-semibold text-navy-400">
                    Chargement des cours de la base de données...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs italic text-navy-400">
                    Aucun cours ne correspond aux critères de recherche sélectionnés.
                  </td>
                </tr>
              ) : (
                filtered.map(course => {
                  const isSelected = selectedIds.has(course.id);
                  return (
                    <tr
                      key={course.id}
                      className={`hover:bg-navy-50/50 dark:hover:bg-navy-800/40 transition-colors ${isSelected ? 'bg-iris-50/60 dark:bg-iris-950/30' : ''}`}
                    >
                      <td className="p-4">
                        <button onClick={() => toggleSelectOne(course.id)} className="text-navy-400 hover:text-[#5D5FEF] transition-colors">
                          {isSelected ? <CheckSquare className="w-4 h-4 text-[#5D5FEF]" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/cours/nouveau?id=${course.id}`} className="font-bold text-navy-900 dark:text-white text-sm hover:text-[#5D5FEF] transition-colors inline-block">
                          {course.title}
                        </Link>
                        <div className="text-[11px] text-navy-400 truncate max-w-xs">{course.subtitle || course.slug}</div>
                      </td>
                      <td className="p-4 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span>{getSpecialtyEmoji(course.specialtyId)}</span>
                          <span>{course.specialtyName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                          {course.year ? `${course.year}e Année` : '🌐 Sans Année'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${course.accessLevel === 'FREE' ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-100 text-brand-800'}`}>
                          {course.accessLevel}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleTogglePublish(course.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${course.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-navy-100 text-navy-600'}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${course.published ? 'bg-emerald-500' : 'bg-navy-400'}`} />
                          <span>{course.published ? 'Publié' : 'Brouillon'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <Link href={`/admin/cours/nouveau?id=${course.id}`} title="Éditer le cours" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#5D5FEF]/10 text-[#5D5FEF] hover:bg-[#5D5FEF]/20 border border-[#5D5FEF]/20 transition-all mr-1">
                          <Edit3 className="w-3.5 h-3.5" /><span>Éditer</span>
                        </Link>
                        <Link href={`/cours/${course.slug}`} target="_blank" title="Prévisualiser" className="p-1.5 text-navy-400 hover:text-navy-900 dark:hover:text-white inline-block">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDuplicate(course.id)} title="Dupliquer" className="p-1.5 text-navy-400 hover:text-navy-900 dark:hover:text-white">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(course.id, course.title)} title="Supprimer définitivement" className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
