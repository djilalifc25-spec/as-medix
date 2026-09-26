'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Check, X, ArrowRight, Sparkles, Award, HeartPulse, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DemoPage() {
  const [currentQcmIdx, setCurrentQcmIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const demoQuestions = [
    {
      question: "Quelle est la cause étiologique quasi-exclusive du rétrécissement mitral en Algérie ?",
      options: [
        "L'athérosclérose calcifiante dégénérative",
        "Le Rhumatisme Articulaire Aigu (RAA) post-streptococcique",
        "L'endocardite infectieuse bactérienne aiguë",
        "Une malformation congénitale isolée de la valve"
      ],
      correct: 1,
      explanation: "En Algérie et au Maghreb, le RAA contracté dans l'enfance reste responsable de plus de 95% des rétrécissements mitraux."
    },
    {
      question: "Quel bruit compose la triade auscultatoire classique du rythme de Duroziez ?",
      options: [
        "Un souffle mésosystolique éjectionnel au foyer aortique",
        "Un roulement diastolique à l'apex avec éclat de B1 et claquement d'ouverture",
        "Un frottement péricardique méso-diastolique",
        "Un clic méso-systolique suivi d'un souffle télésystolique"
      ],
      correct: 1,
      explanation: "Le rythme de Duroziez associe : Éclat de B1 + Claquement d'ouverture mitrale (COM) + Roulement diastolique apexien."
    },
    {
      question: "Quel est le comportement du ventricule gauche (VG) dans un rétrécissement mitral pur non compliqué ?",
      options: [
        "Il présente une hypertrophie concentrique majeure",
        "Il est très dilaté avec une FEVG effondrée",
        "Il n'est ni dilaté ni hypertrophié car il est protégé en aval de l'obstacle",
        "Il présente un anévrisme apical systématique"
      ],
      correct: 2,
      explanation: "Piège classique d'examen : dans le RM pur, le ventricule gauche est de taille et de fonction strictement normales car la sténose fait obstacle en amont."
    },
    {
      question: "Quelle complication thromboembolique grave doit impérativement être prévenue par anticoagulation ?",
      options: [
        "L'embolie pulmonaire massive",
        "L'accident vasculaire cérébral ischémique (AVC) cardio-embolique",
        "La thrombose veineuse profonde du membre inférieur",
        "L'infarctus mésentérique veineux"
      ],
      correct: 1,
      explanation: "La dilatation de l'atrium gauche et le passage en fibrillation atriale favorisent la formation de thrombi dans l'auricule gauche avec risque d'AVC embolique."
    },
    {
      question: "Quel est le traitement percutané de choix du rétrécissement mitral serré à valves souples non calcifiées ?",
      options: [
        "L'implantation d'une valve TAVI par voie fémorale",
        "La commissurotomie mitrale percutanée (CMP) par ballon d'Inoue",
        "La pose d'un MitraClip par voie transseptale",
        "L'ablation chirurgicale par sternotomie médiane systématique"
      ],
      correct: 1,
      explanation: "La commissurotomie mitrale percutanée (CMP) par ballonnet d'Inoue est le gold standard de première intention si le score de Wilkins est ≤ 8 et sans fuite mitrale significative."
    }
  ];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleVerifyAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === demoQuestions[currentQcmIdx].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQcmIdx < demoQuestions.length - 1) {
      setCurrentQcmIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="min-h-screen bg-navy-50/50 dark:bg-navy-950 flex flex-col">
      {/* Top Demo Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md border-b border-navy-100 dark:border-navy-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            SESSION DÉMO EN LIBRE ACCÈS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold text-navy-500 hover:text-navy-900 dark:hover:text-white"
          >
            Quitter la démo
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft"
          >
            Créer un compte complet
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-12">
        {/* Course Header */}
        <div className="rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 p-6 sm:p-10 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
              Cardiologie • Rang A
            </span>
            <span className="text-xs text-navy-400">• Temps de lecture : 15 min</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-navy-950 dark:text-white tracking-tight">
            Le Rétrécissement Mitral (Sténose Mitrale)
          </h1>
          <p className="text-base text-navy-600 dark:text-navy-300 mt-2 leading-relaxed">
            Extrait pédagogique du cours de référence : Étiologie rhumatismale, physiopathologie, triade auscultatoire de Duroziez et stratégie percutanée.
          </p>

          <div className="mt-6 pt-6 border-t border-navy-100 dark:border-navy-800 flex items-center gap-3 text-xs text-navy-500 dark:text-navy-400">
            <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-300 font-bold flex items-center justify-center">
              Dr
            </div>
            <div>
              <span className="font-bold text-navy-900 dark:text-white block">Dr. A. Zerrouki & Pr. S. Mansouri</span>
              <span>Service de Cardiologie Clinique & Valvulopathies</span>
            </div>
          </div>
        </div>

        {/* Selected Course Content Preview */}
        <article className="rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 p-6 sm:p-10 shadow-soft space-y-8 course-prose">
          <section>
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-3">1. Physiopathologie & Étiologie</h2>
            <p>
              Le rétrécissement mitral (RM) se caractérise par un obstacle permanent au flux sanguin reliant l'atrium gauche (AG) au ventricule gauche (VG) au cours de la diastole ventriculaire. En Algérie, le <strong>Rhumatisme Articulaire Aigu (RAA)</strong> post-streptococcique contracté pendant le jeune âge demeure l'étiologie prédominante.
            </p>
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/40 text-sm text-indigo-900 dark:text-indigo-200">
              💎 <strong>Règle Sémiologique :</strong> La surface normale de l'orifice mitral est de <strong>4 à 6 cm²</strong>. On parle de RM serré lorsque la surface devient <strong>inférieure à 1,5 cm²</strong> (ou &lt; 1,0 cm²/m² de surface corporelle).
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-3">2. L'Auscultation : Le Rythme de Duroziez</h2>
            <p>
              Recherchée à l'apex en décubitus latéral gauche après un léger effort, elle associe typiquement :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-navy-700 dark:text-navy-300">
              <li><strong>Un éclat du premier bruit (B1)</strong> traduisant la mise sous tension brutale de valves mitrales épaissies mais souples.</li>
              <li><strong>Un claquement d'ouverture mitrale (COM)</strong> précoce en protodiastole. Plus le COM est proche du deuxième bruit (B2), plus la sténose est serrée !</li>
              <li><strong>Un roulement méso-télédiastolique</strong> se renforçant en pré-systole si le patient est en rythme sinusal normal.</li>
            </ul>
          </section>
        </article>

        {/* 5-Question QCM Challenge */}
        <section className="rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-navy-800 p-6 sm:p-10 shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b border-navy-100 dark:border-navy-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse"></span>
              <h2 className="text-lg font-black text-navy-950 dark:text-white">
                Testez vos connaissances (QCM {currentQcmIdx + 1} / {demoQuestions.length})
              </h2>
            </div>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full">
              Score : {score} / {demoQuestions.length}
            </span>
          </div>

          {!quizFinished ? (
            <div className="space-y-6">
              <p className="text-base sm:text-lg font-bold text-navy-900 dark:text-white">
                {demoQuestions[currentQcmIdx].question}
              </p>

              <div className="space-y-3">
                {demoQuestions[currentQcmIdx].options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === demoQuestions[currentQcmIdx].correct;

                  let btnClasses = "w-full text-left p-4 rounded-2xl border text-sm font-medium transition-all flex items-start justify-between gap-3 ";
                  if (!isAnswerSubmitted) {
                    btnClasses += isSelected
                      ? "border-brand-600 bg-brand-50/50 dark:bg-brand-950/30 text-brand-900 dark:text-brand-100 shadow-sm"
                      : "border-navy-200 dark:border-navy-700 hover:border-brand-300 dark:hover:border-navy-600 text-navy-700 dark:text-navy-300 bg-white dark:bg-navy-800";
                  } else {
                    if (isCorrect) {
                      btnClasses += "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-bold";
                    } else if (isSelected && !isCorrect) {
                      btnClasses += "border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200";
                    } else {
                      btnClasses += "border-navy-200 dark:border-navy-700 opacity-60 text-navy-500";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={btnClasses}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && isCorrect && <Check className="w-5 h-5 text-emerald-600 shrink-0" />}
                      {isAnswerSubmitted && isSelected && !isCorrect && <X className="w-5 h-5 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and explanation */}
              {isAnswerSubmitted && (
                <div className="p-4 rounded-2xl bg-navy-50 dark:bg-navy-800 border border-navy-100 dark:border-navy-700 text-xs sm:text-sm text-navy-700 dark:text-navy-300 leading-relaxed">
                  <div className="font-bold text-navy-900 dark:text-white mb-1">
                    Justification ECNi / Résidanat :
                  </div>
                  {demoQuestions[currentQcmIdx].explanation}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleVerifyAnswer}
                    disabled={selectedOption === null}
                    className="px-6 py-3 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white shadow-soft transition-all"
                  >
                    Valider ma réponse
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition-all"
                  >
                    <span>{currentQcmIdx < demoQuestions.length - 1 ? 'Question suivante' : 'Voir mon bilan démo'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed Conversion Card */
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center mx-auto shadow-soft">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white">
                  Félicitations ! Vous avez terminé la session démo
                </h3>
                <p className="text-base text-navy-600 dark:text-navy-300 mt-2">
                  Votre score : <strong className="text-brand-600 dark:text-brand-400">{score} sur 5</strong> ({Math.round((score / 5) * 100)}% de réussite).
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white max-w-xl mx-auto space-y-4 shadow-soft-lg">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  Passez à la vitesse supérieure
                </div>
                <h4 className="text-xl font-black">
                  Créez votre compte gratuit immédiatement
                </h4>
                <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
                  Débloquez votre tableau de bord personnalisé, suivez votre progression par spécialité et accédez à plus de 20 disciplines médicales sans carte bancaire.
                </p>
                <div className="pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-white text-brand-700 hover:bg-brand-50 shadow-md transition-transform hover:scale-105"
                  >
                    <span>Créer mon compte gratuit (0 DA)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
