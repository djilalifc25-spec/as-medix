'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_CLINICAL_CASES } from '@/lib/db/seedClinicalCases';
import { Award, ArrowRight, User, Stethoscope, ChevronRight } from 'lucide-react';

export default function ClinicalCasesCatalogPage() {
  return (
    <div className="space-y-8">
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-600 to-purple-600 text-white shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20">
            <Award className="w-3.5 h-3.5" />
            <span>Apprentissage par Raisonnement Clinique</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Cas Cliniques Interactifs
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
            Mettez-vous dans la peau du praticien aux urgences : interrogez, examinez, prescrivez les examens clés et posez les gestes qui sauvent pas à pas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_CLINICAL_CASES.map((cc) => (
          <div
            key={cc.id}
            className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                  {cc.specialtyName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-navy-300">
                  Niveau {cc.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-black text-navy-950 dark:text-white">
                {cc.title}
              </h3>

              <div className="p-3.5 rounded-2xl bg-navy-50/70 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-750 text-xs space-y-1.5 text-navy-700 dark:text-navy-300">
                <div className="flex items-center gap-1.5 font-bold text-navy-900 dark:text-white">
                  <User className="w-3.5 h-3.5 text-navy-500" />
                  <span>Patient : {cc.patientProfile.gender}, {cc.patientProfile.age} ans</span>
                </div>
                <p className="line-clamp-2">
                  <strong>Motif :</strong> {cc.patientProfile.motif}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-navy-50 dark:border-navy-800 flex items-center justify-between">
              <span className="text-xs text-navy-400">
                {cc.steps.length} Étapes décisionnelles
              </span>

              <Link
                href={`/cas-cliniques/${cc.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 hover:bg-brand-600 hover:text-white transition-all shadow-sm"
              >
                <span>Prendre en charge</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
