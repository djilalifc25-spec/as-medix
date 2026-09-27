'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_CLINICAL_CASES } from '@/lib/db/seedClinicalCases';
import { ClinicalCase } from '@/types';
import {
  ArrowLeft, User, Stethoscope, Activity, CheckCircle2, XCircle,
  ArrowRight, Award, Check, RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ClinicalCaseRunnerPage() {
  const params = useParams();
  const id = params.id as string;

  const [clinicalCase, setClinicalCase] = useState<ClinicalCase>(() => {
    return INITIAL_CLINICAL_CASES.find(c => c.id === id) || INITIAL_CLINICAL_CASES[0];
  });

  useEffect(() => {
    fetch('/api/cas-cliniques')
      .then(r => r.json())
      .then(d => {
        if (d.cases && Array.isArray(d.cases)) {
          const found = d.cases.find((c: any) => c.id === id || c.id === decodeURIComponent(id));
          if (found) setClinicalCase(found);
        }
      })
      .catch(() => {});
  }, [id]);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [caseCompleted, setCaseCompleted] = useState(false);

  const step = clinicalCase.steps[currentStepIdx];

  const handleSelectOption = (optId: string) => {
    if (isRevealed) return;
    setSelectedOptionId(optId);
  };

  const handleValidate = () => {
    if (!selectedOptionId) return;
    setIsRevealed(true);
    const chosen = step.options.find(o => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextStep = () => {
    if (currentStepIdx < clinicalCase.steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setSelectedOptionId(null);
      setIsRevealed(false);
    } else {
      setCaseCompleted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    setCurrentStepIdx(0);
    setSelectedOptionId(null);
    setIsRevealed(false);
    setScore(0);
    setCaseCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-navy-100 dark:border-navy-800">
        <Link
          href="/cas-cliniques"
          className="inline-flex items-center gap-2 text-xs font-bold text-navy-600 dark:text-navy-300 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux cas cliniques</span>
        </Link>
        <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full">
          Étape {currentStepIdx + 1} / {clinicalCase.steps.length}
        </span>
      </div>

      {/* Patient Profile Card (Always visible) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
            Dossier d'Admission • {clinicalCase.specialtyName}
          </span>
          <span className="text-xs text-navy-400">Niveau {clinicalCase.difficulty}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-navy-950 dark:text-white">
          {clinicalCase.title}
        </h1>

        <div className="p-4 rounded-2xl bg-navy-50/70 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-700/80 text-xs sm:text-sm space-y-2 text-navy-700 dark:text-navy-300">
          <div className="flex flex-wrap gap-4 font-bold text-navy-900 dark:text-white">
            <span>Sexe : {clinicalCase.patientProfile.gender}</span>
            <span>•</span>
            <span>Âge : {clinicalCase.patientProfile.age} ans</span>
          </div>
          <div>
            <strong>Motif de consultation :</strong> {clinicalCase.patientProfile.motif}
          </div>
          <div>
            <strong>Antécédents :</strong> {clinicalCase.patientProfile.antecedents.join(', ')}
          </div>
        </div>
      </div>

      {!caseCompleted ? (
        /* Step Interactive Container */
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft space-y-6">
          <h2 className="text-lg font-black text-navy-950 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-brand-600" />
            <span>{step.title}</span>
          </h2>

          {/* New Patient Data Reveal */}
          {step.patientDataAddition && (
            <div className="space-y-3">
              {step.patientDataAddition.vitals && (
                <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/60 text-xs">
                  <div className="font-bold text-brand-900 dark:text-brand-300 mb-2">Constantes vitales relevées :</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(step.patientDataAddition.vitals).map(([k, v]) => (
                      <div key={k} className="p-2 rounded-xl bg-white dark:bg-navy-800 border border-brand-100 dark:border-navy-700 text-center">
                        <span className="text-[10px] text-navy-400 block">{k}</span>
                        <span className="font-bold text-navy-900 dark:text-white">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step.patientDataAddition.imaging && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 text-xs text-navy-800 dark:text-navy-200">
                  <strong>Résultat de l'imagerie / ECG :</strong> {step.patientDataAddition.imaging}
                </div>
              )}
            </div>
          )}

          {/* Step Question */}
          <h3 className="text-base font-bold text-navy-900 dark:text-white">
            {step.promptQuestion}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {step.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let classes = "w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-start justify-between gap-3 ";

              if (!isRevealed) {
                classes += isSelected
                  ? "border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 text-brand-950 dark:text-white shadow-sm ring-1 ring-brand-500"
                  : "border-navy-200 dark:border-navy-700 hover:border-brand-300 text-navy-700 dark:text-navy-200 bg-white dark:bg-navy-800";
              } else {
                if (opt.isCorrect) {
                  classes += "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold";
                } else if (isSelected && !opt.isCorrect) {
                  classes += "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200";
                } else {
                  classes += "border-navy-200 dark:border-navy-700 opacity-50 text-navy-400";
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isRevealed}
                  className={classes}
                >
                  <div className="space-y-1">
                    <span>{opt.text}</span>
                    {isRevealed && isSelected && (
                      <p className={`text-xs ${opt.isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                        {opt.feedback}
                      </p>
                    )}
                  </div>
                  {isRevealed && opt.isCorrect && <Check className="w-5 h-5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation reveal */}
          {isRevealed && (
            <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 border border-navy-100 dark:border-navy-700 text-xs sm:text-sm text-navy-700 dark:text-navy-200 leading-relaxed">
              <strong>Synthèse clinique :</strong> {step.explanation}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 flex items-center justify-end border-t border-navy-100 dark:border-navy-800">
            {!isRevealed ? (
              <button
                onClick={handleValidate}
                disabled={!selectedOptionId}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white shadow-soft transition-all"
              >
                Confirmer ma décision
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all"
              >
                <span>{currentStepIdx < clinicalCase.steps.length - 1 ? 'Étape suivante' : 'Bilan du cas'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Case Finished Card */
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 shadow-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white">
            Cas clinique résolu avec succès !
          </h2>
          <p className="text-sm text-navy-600 dark:text-navy-300">
            Score décisionnel : <strong>{score} sur {clinicalCase.steps.length}</strong> décisions exactes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-navy-200 dark:border-navy-700 text-navy-800 dark:text-white hover:bg-navy-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer ce cas</span>
            </button>
            <Link
              href="/cas-cliniques"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-soft"
            >
              <span>Voir d'autres cas cliniques</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
