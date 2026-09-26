'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          Tarifs Transparents en Dinars Algériens
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-950 dark:text-white tracking-tight">
          Formules adaptées aux étudiants et praticiens
        </h1>
        <p className="text-sm text-navy-600 dark:text-navy-300">
          Paiement disponible par Carte Edahabia, CIB, BaridiMob et carte bancaire.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* FREE */}
        <div className="p-8 rounded-3xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-800 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-navy-950 dark:text-white">GRATUIT</h3>
            <p className="text-xs text-navy-500 mt-1">Pour découvrir AS MEDIX</p>
            <div className="my-6">
              <span className="text-4xl font-black text-navy-950 dark:text-white">0 DA</span>
              <span className="text-xs text-navy-400 ml-1">/ pour toujours</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-navy-700 dark:text-navy-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>2 cours complets en libre accès</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>3 fiches synthétiques de révision</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>20 QCM mensuels avec explications</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>2 protocoles CAT d'urgence</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <span className="block w-full py-3 text-center text-xs font-bold rounded-xl bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-400">
              Forfait de base actif
            </span>
          </div>
        </div>

        {/* PRO */}
        <div className="relative p-8 rounded-3xl bg-white dark:bg-navy-900 border-2 border-brand-600 shadow-soft-lg flex flex-col justify-between">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-brand-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
            Le Plus Populaire
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy-950 dark:text-white">PRO</h3>
            <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-1">Pour une révision médicale complète</p>
            <div className="my-6">
              <span className="text-4xl font-black text-navy-950 dark:text-white">4 500 DA</span>
              <span className="text-xs text-navy-400 ml-1">/ an (Accès 365j)</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-navy-700 dark:text-navy-300">
              <li className="flex items-center gap-2 font-semibold text-navy-900 dark:text-white">
                <Check className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Tous les cours (20 spécialités)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Toutes les fiches de révision flash</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Banque complète de QCM en illimité</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Tous les protocoles CAT & Cas cliniques</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Bibliothèque ECG & Médicaments Algérie</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Historique complet et favoris</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link
              href="/checkout?plan=PRO"
              className="block w-full py-3.5 text-center text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all"
            >
              Passer à PRO (4 500 DA)
            </Link>
          </div>
        </div>

        {/* PREMIUM */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-navy-900 via-navy-900 to-navy-950 text-white border border-navy-700 shadow-soft flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded-full mb-2">
              <Sparkles className="w-3 h-3" /> IA Médicale
            </div>
            <h3 className="text-xl font-bold">PREMIUM</h3>
            <p className="text-xs text-navy-400 mt-1">Pour une révision intelligente avec l'IA</p>
            <div className="my-6">
              <span className="text-4xl font-black">7 000 DA</span>
              <span className="text-xs text-navy-400 ml-1">/ an (Accès 365j)</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-navy-200">
              <li className="flex items-center gap-2 text-white font-semibold">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Tout ce qui est inclus dans le forfait PRO</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Assistant Médical IA disponible 24/7</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Génération illimitée de QCMs IA</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Génération de cas cliniques progressifs IA</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Détection automatique des points faibles</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Link
              href="/checkout?plan=PREMIUM"
              className="block w-full py-3.5 text-center text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-navy-950 shadow-soft transition-all"
            >
              Passer à PREMIUM (7 000 DA)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
