'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ShieldCheck, HeartPulse, GraduationCap, ArrowUpRight } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-navy-900 border-t border-navy-100 dark:border-navy-800 transition-colors">
      {/* Medical Legal Disclaimer Banner */}
      <div className="bg-amber-500/10 dark:bg-amber-500/5 border-b border-amber-200/50 dark:border-amber-900/30 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Avertissement médical officiel :</strong> AS MEDIX est une plateforme numérique d'enseignement et de formation médicale continue. Les contenus, fiches, QCM et arbres de décision sont exclusivement destinés à l'apprentissage des étudiants en médecine et des professionnels de santé. Ils ne sauraient en aucun cas se substituer au jugement clinique du médecin traitant, aux recommandations officielles des autorités sanitaires ou aux protocoles thérapeutiques locaux des structures hospitalières.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" showTagline={true} />
            <p className="text-sm text-navy-600 dark:text-navy-400 max-w-sm leading-relaxed">
              La plateforme médicale de référence pour les étudiants en médecine, internes et praticiens en Algérie. Préparez vos examens, validez vos stages et excellez en pratique clinique.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Plateforme Active & Conforme Résidanat DZ
              </span>
            </div>
          </div>

          {/* Col 2: Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400 dark:text-navy-500 mb-4">
              Pédagogie Médicale
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/cours" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Bibliothèque des Cours
                </Link>
              </li>
              <li>
                <Link href="/fiches" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Fiches de Révision Flash
                </Link>
              </li>
              <li>
                <Link href="/qcm" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Moteur de QCM & Corrigés
                </Link>
              </li>
              <li>
                <Link href="/cat" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Conduites à Tenir (CAT)
                </Link>
              </li>
              <li>
                <Link href="/cas-cliniques" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Cas Cliniques Interactifs
                </Link>
              </li>
              <li>
                <Link href="/ecg" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  ECG du Jour & Tracés
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Specialties */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400 dark:text-navy-500 mb-4">
              Spécialités Clés
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/cours?specialty=cardio" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Cardiologie
                </Link>
              </li>
              <li>
                <Link href="/cours?specialty=pneumo" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Pneumologie
                </Link>
              </li>
              <li>
                <Link href="/cours?specialty=neuro" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Neurologie
                </Link>
              </li>
              <li>
                <Link href="/cours?specialty=nephro" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Néphrologie
                </Link>
              </li>
              <li>
                <Link href="/cours?specialty=pediatrie" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Pédiatrie
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-brand-600 dark:text-brand-400 font-medium inline-flex items-center gap-1 hover:underline">
                  Toutes les 20 spécialités <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400 dark:text-navy-500 mb-4">
              Plateforme & Légal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/pricing" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Forfaits & Tarifs
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Essayer sans compte
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Espace Membre
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-navy-600 dark:text-navy-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Portail Administration
                </Link>
              </li>
              <li>
                <span className="text-xs text-navy-400 block pt-2">
                  Conforme Algérie Poste & Paiement CIB
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-100 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between text-xs text-navy-500 dark:text-navy-400 gap-4">
          <p>© {new Date().getFullYear()} AS MEDIX Inc. Tous droits réservés. Conçu pour la médecine en Algérie.</p>
          <div className="flex items-center gap-6">
            <span>Confidentialité</span>
            <span>Conditions Générales</span>
            <span>Mentions Légales</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
