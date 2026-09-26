'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Course } from '@/types';
import {
  Plus, Search, Edit3, Trash2, Copy, Eye, CheckCircle2, XCircle, Globe, Lock, ExternalLink
} from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleTogglePublish = async (id: string) => {
    await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_publish', id })
    });
    fetchCourses();
  };

  const handleDuplicate = async (id: string) => {
    await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'duplicate', id })
    });
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;
    await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });
    fetchCourses();
  };

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.specialtyName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-950 dark:text-white">
            Gestion des Cours Médicaux (CMS)
          </h1>
          <p className="text-xs text-navy-500 mt-0.5">
            Ajoutez, éditez en HTML, prévisualisez et publiez les cours du curriculum
          </p>
        </div>

        <Link
          href="/admin/cours/nouveau"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Cours (Éditeur HTML)</span>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher par titre ou spécialité..."
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs text-navy-900 dark:text-white"
        />
      </div>

      {/* Courses Table */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-navy-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-50 dark:bg-navy-800/60 text-navy-700 dark:text-navy-300 font-bold uppercase tracking-wider border-b border-navy-100 dark:border-navy-800">
              <tr>
                <th className="p-4">Titre du Cours</th>
                <th className="p-4">Spécialité</th>
                <th className="p-4">Accès</th>
                <th className="p-4">Difficulté</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-50 dark:divide-navy-800 text-navy-700 dark:text-navy-300">
              {filtered.map(course => (
                <tr key={course.id} className="hover:bg-navy-50/50 dark:hover:bg-navy-800/40">
                  <td className="p-4">
                    <Link 
                      href={`/admin/cours/nouveau?id=${course.id}`}
                      className="font-bold text-navy-900 dark:text-white text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-block"
                    >
                      {course.title}
                    </Link>
                    <div className="text-[11px] text-navy-400 truncate max-w-xs">{course.subtitle}</div>
                  </td>
                  <td className="p-4 font-semibold">
                    <div>{course.specialtyName}</div>
                    <div className="text-[10px] text-navy-400 font-normal">
                      {course.year ? `${course.year}e Année` : '🌐 Sans Année'}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      course.accessLevel === 'FREE' ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-100 text-brand-800'
                    }`}>
                      {course.accessLevel}
                    </span>
                  </td>
                  <td className="p-4">{course.difficulty}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleTogglePublish(course.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        course.published
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-navy-100 text-navy-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${course.published ? 'bg-emerald-500' : 'bg-navy-400'}`} />
                      <span>{course.published ? 'Publié' : 'Brouillon'}</span>
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    <Link
                      href={`/admin/cours/nouveau?id=${course.id}`}
                      title="Éditer le cours"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all mr-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Éditer</span>
                    </Link>
                    <Link
                      href={`/cours/${course.slug}`}
                      target="_blank"
                      title="Prévisualiser côté étudiant"
                      className="p-1.5 text-navy-400 hover:text-navy-900 dark:hover:text-white inline-block"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDuplicate(course.id)}
                      title="Dupliquer"
                      className="p-1.5 text-navy-400 hover:text-navy-900 dark:hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      title="Supprimer"
                      className="p-1.5 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
