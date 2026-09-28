'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles, Award, CheckCircle2, XCircle, ArrowRight, HelpCircle,
  Stethoscope, Lightbulb, BookOpen, AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClinicalPearl {
  id: string;
  specialtyId: string;
  specialtyName: string;
  specialtyEmoji: string;
  courseId: string;
  courseTitle: string;
  vignette: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  trap: string;
}

const CLINICAL_PEARLS: ClinicalPearl[] = [
  {
    id: 'pearl_cardio_1',
    specialtyId: 'cardio',
    specialtyName: 'Cardiologie',
    specialtyEmoji: '🫀',
    courseId: 'cours_cardio_sca',
    courseTitle: 'Syndromes Coronariens Aigus',
    vignette: "Un patient de 58 ans consulte aux urgences pour une douleur rétrosternale constrictive irradiant au bras gauche. L'ECG met en évidence un sus-décalage du segment ST en DII, DIII, aVF avec un miroir en DI, aVL. La pression artérielle est à 85/50 mmHg.",
    question: 'Quel traitement est formellement CONTRE-INDIQUÉ chez ce patient ?',
    options: [
      "L'aspirine à dose de charge",
      "L'héparine non fractionnée",
      'Les dérivés nitrés (Trinitrine)',
      'Le ticagrélor ou clopidogrel'
    ],
    correctIndex: 2,
    explanation: "En présence d'un infarctus inférieur avec hypotension, une extension au ventricule droit (VD) doit impérativement être recherchée. Les dérivés nitrés diminuent la précharge et peuvent provoquer un effondrement hémodynamique et un choc cardiogénique gravissime.",
    trap: "Ne jamais administrer de dérivés nitrés devant un IDM inférieur sans s'être assuré de l'absence d'atteinte du ventricule droit (dérivations V3R et V4R) !"
  },
  {
    id: 'pearl_pneumo_1',
    specialtyId: 'pneumo',
    specialtyName: 'Pneumologie',
    specialtyEmoji: '🫁',
    courseId: 'cours_pneumo_tb',
    courseTitle: 'Tuberculose Pulmonaire',
    vignette: 'Une patiente de 28 ans débutant un traitement antituberculeux quadrithérapique (RHZE) signale après 3 semaines une baisse de l\'acuité visuelle bilatérale avec dyschromatopsie pour le rouge et le vert.',
    question: 'Quelle molécule de la quadrithérapie est directement responsable de cette toxicité ?',
    options: [
      'Isoniazide (INH)',
      'Rifampicine (RMP)',
      'Pyrazinamide (PZA)',
      'Éthambutol (EMB)'
    ],
    correctIndex: 3,
    explanation: "L'Éthambutol induit une névrite optique rétrobulbaire dose-dépendante se manifestant d'abord par une anomalie de la vision des couleurs (rouge-vert). Un examen ophtalmologique régulier est indispensable.",
    trap: "Tout trouble visuel sous quadrithérapie impose l'arrêt immédiat de l'Éthambutol pour éviter des séquelles visuelles irréversibles."
  },
  {
    id: 'pearl_neuro_1',
    specialtyId: 'neuro',
    specialtyName: 'Neurologie',
    specialtyEmoji: '🧠',
    courseId: 'cours_neuro_avc',
    courseTitle: 'Accidents Vasculaires Cérébraux',
    vignette: "Un homme de 66 ans se réveille à 07h00 avec un déficit moteur brutal brachio-facial droit et une aphasie de Broca. Sa dernière heure d'état normal connu attestée par sa conjointe est 23h00 la veille au coucher.",
    question: "Quelle est la conduite d'imagerie et thérapeutique prioritaire ?",
    options: [
      'Thrombolyse IV immédiate sans imagerie préalable',
      'IRM cérébrale avec séquence FLAIR et diffusion (Wake-up stroke)',
      "Prescription immédiate d'anticoagulants à dose curative",
      'Ponction lombaire en urgence'
    ],
    correctIndex: 1,
    explanation: "Dans l'AVC du réveil (Wake-up stroke) dont le délai dépasse 4h30, l'IRM cérébrale (mismatch Diffusion/FLAIR) permet de dater l'ischémie et de discuter une thrombolyse IV ou une thrombectomie mécanique si le tissu cérébral est encore sauvable.",
    trap: "Le délai de prise en charge court à partir de la dernière heure où le patient a été vu asymptomatique, et non de l'heure du réveil !"
  },
  {
    id: 'pearl_pediatrie_1',
    specialtyId: 'pediatrie',
    specialtyName: 'Pédiatrie',
    specialtyEmoji: '👶',
    courseId: 'cours_pediatrie_bronchiolite',
    courseTitle: 'Bronchiolite Aiguë du Nourrisson',
    vignette: 'Nourrisson de 3 mois fébrile à 38.3°C, présentant une polypnée à 62 cpm avec tirage intercostal et sous-costal bilatéral lors de sa première crise obstructive hivernale.',
    question: 'Selon les recommandations officielles, quel est le traitement médicamenteux de premier choix ?',
    options: [
      'Aérosols de Salbutamol répétés',
      'Corticothérapie par voie orale',
      'Aucun médicament (Hydratation + Désobstruction Rhinopharyngée)',
      'Amoxicilline systématique'
    ],
    correctIndex: 2,
    explanation: "Dans la bronchiolite aiguë du premier épisode chez le nourrisson, ni les bronchodilatateurs, ni les corticoïdes, ni les antibiotiques n'ont fait la preuve de leur efficacité. Le pilier du traitement reste la désobstruction rhinopharyngée (DRP) et l'apport nutritionnel/hydrique fractionné.",
    trap: "La prescription systématique d'aérosols de Ventoline ou de corticoïdes oraux en 1ère intention dans la bronchiolite simple est l'une des erreurs les plus pénalisées aux épreuves !"
  }
];

export function DailyClinicalPearl() {
  const [pearl, setPearl] = useState<ClinicalPearl>(CLINICAL_PEARLS[0]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasValidated, setHasValidated] = useState<boolean>(false);
  const [todayKey, setTodayKey] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const selectedPearl = CLINICAL_PEARLS[dayOfYear % CLINICAL_PEARLS.length];
    setPearl(selectedPearl);

    const dateKey = `asmedix_pearl_${now.toISOString().split('T')[0]}`;
    setTodayKey(dateKey);

    const savedAnswer = localStorage.getItem(dateKey);
    if (savedAnswer !== null) {
      const parsed = parseInt(savedAnswer, 10);
      setSelectedOption(parsed);
      setHasValidated(true);
    }
  }, []);

  const handleSelect = (idx: number) => {
    if (hasValidated) return;
    setSelectedOption(idx);
  };

  const handleValidate = () => {
    if (selectedOption === null || hasValidated) return;
    setHasValidated(true);
    if (typeof window !== 'undefined' && todayKey) {
      localStorage.setItem(todayKey, selectedOption.toString());
    }

    if (selectedOption === pearl.correctIndex) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {}
    }
  };

  const isCorrect = selectedOption === pearl.correctIndex;

  return (
    <div className="apple-card p-3.5 sm:p-6 space-y-4 sm:space-y-5 border-2 border-brand-500/25 dark:border-brand-500/30 bg-gradient-to-br from-white via-brand-500/[0.03] to-indigo-500/[0.04] dark:from-navy-900 dark:via-navy-900/95 dark:to-navy-950 shadow-soft-xl relative overflow-hidden w-full min-w-0 max-w-full">
      <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-navy-100 dark:border-navy-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-soft shrink-0">
            <Stethoscope className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-navy-950 dark:text-white truncate">
                Le Cas Flash du Jour
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 shrink-0">
                1 Min Challenge
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-navy-500 dark:text-navy-400 line-clamp-1 sm:line-clamp-none">
              Chaque matin, affûtez votre réflexe clinique avec un piège du Résidanat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-navy-800 dark:text-navy-200 flex items-center gap-1.5 shadow-2xs">
            <span>{pearl.specialtyEmoji}</span>
            <span>{pearl.specialtyName}</span>
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-navy-50/80 dark:bg-navy-800/60 border border-navy-200/80 dark:border-navy-700/80 space-y-1.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 shrink-0" />
          <span>Vignette Clinique :</span>
        </span>
        <p className="text-xs sm:text-sm text-navy-800 dark:text-navy-200 leading-relaxed font-medium break-words">
          "{pearl.vignette}"
        </p>
      </div>

      <div className="space-y-1">
        <h4 className="text-xs sm:text-sm font-black text-navy-950 dark:text-white flex items-start gap-1.5">
          <HelpCircle className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
          <span className="break-words flex-1 leading-snug">{pearl.question}</span>
        </h4>
      </div>

      <div className="space-y-2">
        {pearl.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          const isThisCorrect = idx === pearl.correctIndex;

          let btnStyle = 'border-navy-200 dark:border-navy-800 bg-white dark:bg-navy-900 text-navy-800 dark:text-navy-200 hover:border-brand-400 hover:bg-brand-50/30 dark:hover:bg-navy-800/60';
          
          if (hasValidated) {
            if (isThisCorrect) {
              btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20';
            } else if (isSelected && !isThisCorrect) {
              btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 line-through';
            } else {
              btnStyle = 'opacity-60 border-navy-200 dark:border-navy-800 bg-white dark:bg-navy-900 text-navy-500';
            }
          } else if (isSelected) {
            btnStyle = 'border-brand-600 dark:border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold ring-2 ring-brand-500/20';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={hasValidated}
              onClick={() => handleSelect(idx)}
              className={`w-full p-2.5 sm:p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start sm:items-center justify-between gap-2.5 ${btnStyle} ${!hasValidated ? 'active:scale-[0.99] cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex items-start sm:items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border border-current shrink-0 mt-0.5 sm:mt-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="break-words leading-snug flex-1">{opt}</span>
              </div>
              {hasValidated && isThisCorrect && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
              )}
              {hasValidated && isSelected && !isThisCorrect && (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
              )}
            </button>
          );
        })}
      </div>

      {!hasValidated ? (
        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={handleValidate}
            disabled={selectedOption === null}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              selectedOption !== null
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-soft active:scale-95 cursor-pointer'
                : 'bg-navy-100 dark:bg-navy-800 text-navy-400 cursor-not-allowed'
            }`}
          >
            <span>Valider ma réponse</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-3 pt-2 animate-in fade-in duration-300">
          <div className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border flex items-start gap-2.5 sm:gap-3 ${
            isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
          }`}>
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-xs min-w-0 flex-1">
              <div className="font-black text-sm">
                {isCorrect ? 'Excellent réflexe clinique ! ✅' : 'Piège d\'examen classique évité ! ⚠️'}
              </div>
              <p className="leading-relaxed opacity-90 break-words">
                {pearl.explanation}
              </p>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl bg-amber-500/10 border border-amber-300/60 dark:border-amber-700/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <span className="text-base shrink-0">🎯</span>
            <div className="min-w-0 flex-1">
              <span className="font-black text-amber-800 dark:text-amber-300 block text-[11px] uppercase tracking-wider">
                Le Piège Classique de Concours :
              </span>
              <p className="mt-0.5 leading-relaxed break-words">
                {pearl.trap}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
            <span className="text-[11px] text-navy-400">
              Défi du jour complété. Revenez demain pour le prochain cas !
            </span>
            <Link
              href="/cours"
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-navy-700 hover:border-brand-400 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs self-start sm:self-auto"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Consulter le cours complet</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
