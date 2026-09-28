'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Thermometer, Wind, Activity, Scale, ChevronRight, Download,
  CheckCircle2, AlertCircle, Sparkles, Stethoscope, ArrowUpRight,
  Clock, Shield, HeartPulse, Pill, Check, Calendar, Info
} from 'lucide-react';
import { useSpecialtyTheme } from '@/components/context/SpecialtyThemeContext';

const CLINICAL_COCKPIT_SPECIALTIES = [
  { id: 'cardio', name: 'Cardiologie' },
  { id: 'pneumo', name: 'Pneumologie' },
  { id: 'neuro', name: 'Neurologie' },
  { id: 'nephro', name: 'Néphrologie' },
  { id: 'endocrino', name: 'Endocrinologie' },
  { id: 'gastro', name: 'Gastro-entérologie' },
  { id: 'pediatrie', name: 'Pédiatrie' },
  { id: 'gyneco', name: 'Gynécologie' },
];

interface SpecialtyDiagnosisData {
  primaryDiagnosis: string;
  primaryCode: string;
  secondaryDiagnosis: string;
  secondaryCode: string;
  organTitle: string;
  organImagePath: string;
  metrics: {
    temp: string;
    tempUnit: string;
    tempLabel: string;
    o2: string;
    o2Label: string;
    bp: string;
    bpLabel: string;
    weight: string;
    weightLabel: string;
  };
  doctor: {
    name: string;
    specialtyTitle: string;
    date: string;
    avatarUrl: string;
  };
  prescriptions: Array<{
    name: string;
    dose: string;
    schedule: string;
  }>;
  advice: string[];
}

const SPECIALTY_DIAGNOSIS_MAP: Record<string, SpecialtyDiagnosisData> = {
  cardio: {
    primaryDiagnosis: 'Coronary Artery Disease (CAD)',
    primaryCode: 'SCA ST+ / Angor d\'effort',
    secondaryDiagnosis: 'Hypertension and Hyperlipidemia',
    secondaryCode: 'Grade II / Score SCORE > 10%',
    organTitle: 'Cœur & Appareil Cardiovasculaire',
    organImagePath: '/organs/cardio.jpg',
    metrics: {
      temp: '98.6',
      tempUnit: '°F',
      tempLabel: 'Body Tempers',
      o2: '98%',
      o2Label: 'Oxygen Saturation',
      bp: '125/80',
      bpLabel: 'Blood Pressure',
      weight: '84 kg',
      weightLabel: 'Weight'
    },
    doctor: {
      name: 'Dr. Livia Calzoni',
      specialtyTitle: 'Cardiology Specialist',
      date: '18 June 2026',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
    },
    prescriptions: [
      { name: 'Aspirin 75mg', dose: '75mg', schedule: 'Once Daily Noon' },
      { name: 'Atorvastatin 20mg', dose: '20mg', schedule: 'Once Daily Night' },
      { name: 'Bisoprolol 2.5mg', dose: '2.5mg', schedule: 'Once Daily Morning' }
    ],
    advice: [
      'Reduce Salt intake (< 5g/jour)',
      'Maintain Regular Exercise (30 min marche)',
      'Monitor blood pressure daily (matin/soir)',
      'Follow-up after 30 days (Contrôle ECG)'
    ]
  },
  pneumo: {
    primaryDiagnosis: 'Tuberculose Pulmonaire Commune (TPC)',
    primaryCode: 'Bactériologie BK(+) crachats',
    secondaryDiagnosis: 'Asthme Persistant Modéré & BPCO',
    secondaryCode: 'VEMS/CVF < 70% post-BD',
    organTitle: 'Poumons & Voies Aériennes',
    organImagePath: '/organs/pneumo.jpg',
    metrics: {
      temp: '99.1',
      tempUnit: '°F',
      tempLabel: 'Body Tempers',
      o2: '96%',
      o2Label: 'Oxygen Saturation',
      bp: '120/75',
      bpLabel: 'Blood Pressure',
      weight: '68 kg',
      weightLabel: 'Weight'
    },
    doctor: {
      name: 'Dr. Sarah Menasria',
      specialtyTitle: 'Pneumology Specialist',
      date: '20 June 2026',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200'
    },
    prescriptions: [
      { name: 'RHZE (Rifampicine + INH)', dose: 'Comprimé combiné', schedule: 'À jeun le matin' },
      { name: 'Salbutamol Inhalateur', dose: '100 µg', schedule: '2 bouffées si dyspnée' },
      { name: 'Budésonide 400µg', dose: '400 µg', schedule: '2 fois par jour' }
    ],
    advice: [
      'Isolement respiratoire initial strict',
      'Arrêt complet de l\'exposition tabagique',
      'Surveillance fonctionnelle respiratoire (EFR)',
      'Contrôle des crachats BK à J15 et M2'
    ]
  },
  neuro: {
    primaryDiagnosis: 'Accident Vasculaire Cérébral (AVC) Ischémique',
    primaryCode: 'Territoire ACM Gauche / NIHSS = 6',
    secondaryDiagnosis: 'Fibrillation Atriale Paroxystique',
    secondaryCode: 'Score CHA2DS2-VASc = 3',
    organTitle: 'Système Nerveux Central & Cerveau',
    organImagePath: '/organs/neuro.jpg',
    metrics: {
      temp: '98.4',
      tempUnit: '°F',
      tempLabel: 'Body Tempers',
      o2: '99%',
      o2Label: 'Oxygen Saturation',
      bp: '135/85',
      bpLabel: 'Blood Pressure',
      weight: '76 kg',
      weightLabel: 'Weight'
    },
    doctor: {
      name: 'Dr. Yacine Khelifi',
      specialtyTitle: 'Neurology Specialist',
      date: '22 June 2026',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
    },
    prescriptions: [
      { name: 'Clopidogrel 75mg', dose: '75mg', schedule: 'Once Daily Midi' },
      { name: 'Apixaban 5mg', dose: '5mg', schedule: 'Matin et Soir' },
      { name: 'Atorvastatine 40mg', dose: '40mg', schedule: 'Le soir au coucher' }
    ],
    advice: [
      'Surveillance neurologique du score NIHSS',
      'Kinésithérapie motrice dès stabilisation',
      'Échographie des troncs supra-aortiques',
      'Contrôle Holter ECG des 24 heures'
    ]
  },
  nephro: {
    primaryDiagnosis: 'Insuffisance Rénale Aiguë Fonctionnelle',
    primaryCode: 'Clairance DFG = 38 mL/min',
    secondaryDiagnosis: 'Syndrome Néphrotique Impur',
    secondaryCode: 'Protéinurie > 3g/24h / HTA associée',
    organTitle: 'Reins & Équilibre Hydro-Électrolytique',
    organImagePath: '/organs/nephro.jpg',
    metrics: {
      temp: '98.5',
      tempUnit: '°F',
      tempLabel: 'Body Tempers',
      o2: '98%',
      o2Label: 'Oxygen Saturation',
      bp: '140/90',
      bpLabel: 'Blood Pressure',
      weight: '79 kg',
      weightLabel: 'Weight'
    },
    doctor: {
      name: 'Dr. Amina Touati',
      specialtyTitle: 'Nephrology Specialist',
      date: '25 June 2026',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
    },
    prescriptions: [
      { name: 'Furosémide 40mg', dose: '40mg', schedule: 'Le matin à jeun' },
      { name: 'Ramipril 2.5mg', dose: '2.5mg', schedule: 'Une prise le matin' },
      { name: 'Kayexalate', dose: '15g', schedule: 'Si Kaliémie > 5.2' }
    ],
    advice: [
      'Surveillance stricte de la diurèse horaire',
      'Contrôle Ionogramme & Créatinine à J7',
      'Restriction sodée stricte (< 4g/j)',
      'Arrêt formel de tout traitement AINS'
    ]
  },
  endocrino: {
    primaryDiagnosis: 'Diabète de Type 2 Décompensé',
    primaryCode: 'HbA1c = 9.4% / Glycémie 2.8 g/L',
    secondaryDiagnosis: 'Neuropathie Périphérique & Rétinopathie',
    secondaryCode: 'Stade Non Proliférant Débutant',
    organTitle: 'Pancréas & Métabolisme Endocrinien',
    organImagePath: '/organs/endocrino.jpg',
    metrics: {
      temp: '98.6',
      tempUnit: '°F',
      tempLabel: 'Body Tempers',
      o2: '98%',
      o2Label: 'Oxygen Saturation',
      bp: '130/80',
      bpLabel: 'Blood Pressure',
      weight: '88 kg',
      weightLabel: 'Weight'
    },
    doctor: {
      name: 'Dr. Malek Benkhedda',
      specialtyTitle: 'Endocrinology Specialist',
      date: '28 June 2026',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200'
    },
    prescriptions: [
      { name: 'Metformine 1000mg', dose: '1000mg', schedule: 'Midi et Soir au repas' },
      { name: 'Empagliflozine 10mg', dose: '10mg', schedule: 'Une prise le matin' },
      { name: 'Insuline Glargine 16 UI', dose: '16 UI', schedule: 'Le soir à 21h' }
    ],
    advice: [
      'Autosurveillance glycémique 3 fois par jour',
      'Consultation ophtalmologique (Fond d\'œil)',
      'Examen rigoureux des pieds quotidien',
      'Contrôle HbA1c tous les 3 mois'
    ]
  }
};

export const PinterestClinicalCockpit: React.FC = () => {
  const { activeSpecialty, setActiveSpecialtyId } = useSpecialtyTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'prescription' | 'reports' | 'appointment'>('overview');

  const activeSpecialtyKey = SPECIALTY_DIAGNOSIS_MAP[activeSpecialty.id] ? activeSpecialty.id : 'cardio';
  const data = SPECIALTY_DIAGNOSIS_MAP[activeSpecialtyKey] || SPECIALTY_DIAGNOSIS_MAP.cardio;

  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden bg-[#F4F5F8] dark:bg-[#0C0F17] rounded-[24px] sm:rounded-[40px] p-3.5 sm:p-7 md:p-9 font-sans border border-slate-200/80 dark:border-white/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.06)] transition-all duration-300">
      
      {/* 1. TOP HEADER & PILL NAVIGATION (Exact Pinterest Style) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/70 dark:border-white/10">
        
        {/* Brand Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-white/10 shadow-sm border border-slate-200/60 dark:border-white/10 flex items-center justify-center">
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-800 dark:border-white" />
              <span className="w-4 h-2.5 rounded-full border-2 border-slate-800 dark:border-white" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800 dark:bg-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Cockpit Clinique & Révision
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Plateforme Médicale • Résidanat & Pratique Médicale DZ
            </p>
          </div>
        </div>

        {/* Pill Navigation Bar */}
        <div className="inline-flex items-center bg-[#EAEDF2] dark:bg-white/5 p-1 sm:p-1.5 rounded-full border border-slate-200/60 dark:border-white/10 shadow-inner max-w-full overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-300 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#5D5FEF] to-[#4848DE] text-white shadow-md shadow-[#5D5FEF]/30 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('prescription')}
            className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-300 shrink-0 ${
              activeTab === 'prescription'
                ? 'bg-gradient-to-r from-[#5D5FEF] to-[#4848DE] text-white shadow-md shadow-[#5D5FEF]/30 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Prescription
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-300 shrink-0 ${
              activeTab === 'reports'
                ? 'bg-gradient-to-r from-[#5D5FEF] to-[#4848DE] text-white shadow-md shadow-[#5D5FEF]/30 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Lab Reports
          </button>
          <button
            onClick={() => setActiveTab('appointment')}
            className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-300 shrink-0 ${
              activeTab === 'appointment'
                ? 'bg-gradient-to-r from-[#5D5FEF] to-[#4848DE] text-white shadow-md shadow-[#5D5FEF]/30 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Appointment
          </button>
        </div>
      </div>

      {/* Specialty Switcher Ribbon */}
      <div className="pt-4 pb-2 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none w-full max-w-full min-w-0">
        <div className="flex items-center gap-1.5 min-w-max">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Spécialité :</span>
          {CLINICAL_COCKPIT_SPECIALTIES.map((spec) => {
            const isSelected = spec.id === activeSpecialty.id;
            return (
              <button
                key={spec.id}
                suppressHydrationWarning
                onClick={() => setActiveSpecialtyId(spec.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-[#5D5FEF] text-white shadow-sm shadow-[#5D5FEF]/30 scale-105'
                    : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-white/10 hover:border-[#5D5FEF]'
                }`}
              >
                {spec.name}
              </button>
            );
          })}
        </div>
        <Link
          href={`/cours?specialty=${activeSpecialty.id}`}
          className="text-xs font-bold text-[#5D5FEF] dark:text-[#818cf8] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Programme complet</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. MAIN GRID LAYOUT (Left Metrics + Center Diagnosis) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 mt-4 items-start">
        
        {/* LEFT COLUMN: LIVE BODY METRICS */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="text-[11px] font-bold tracking-wider text-slate-900 dark:text-white uppercase mb-2">
            LIVE BODY METRICS
          </div>

          {/* Metric 1: Body Tempers */}
          <div className="bg-white dark:bg-[#151926] rounded-[22px] p-4 sm:p-5 border border-slate-200/60 dark:border-white/5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-[#EEF2FF] dark:bg-[#5D5FEF]/15 text-[#5D5FEF] flex items-center justify-center shrink-0">
              <Thermometer className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">
                {data.metrics.tempLabel}
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {data.metrics.temp} <span className="text-base font-semibold text-slate-500">{data.metrics.tempUnit}</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Oxygen Saturation */}
          <div className="bg-white dark:bg-[#151926] rounded-[22px] p-4 sm:p-5 border border-slate-200/60 dark:border-white/5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-[#E0F2FE] dark:bg-sky-500/15 text-sky-600 flex items-center justify-center shrink-0">
              <Wind className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">
                {data.metrics.o2Label}
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {data.metrics.o2}
              </div>
            </div>
          </div>

          {/* Metric 3: Blood Pressure */}
          <div className="bg-white dark:bg-[#151926] rounded-[22px] p-4 sm:p-5 border border-slate-200/60 dark:border-white/5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-[#EDE9FE] dark:bg-purple-500/15 text-purple-600 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">
                {data.metrics.bpLabel}
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {data.metrics.bp}
              </div>
            </div>
          </div>

          {/* Metric 4: Weight */}
          <div className="bg-white dark:bg-[#151926] rounded-[22px] p-4 sm:p-5 border border-slate-200/60 dark:border-white/5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-[#F0FDF4] dark:bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">
                {data.metrics.weightLabel}
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {data.metrics.weight}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER / RIGHT COLUMN: DIAGNOSIS (Organ 3D Render + Floating Badges) */}
        <div className="lg:col-span-8 space-y-2">
          <div className="text-[11px] font-bold tracking-wider text-slate-900 dark:text-white uppercase mb-2">
            DIAGNOSIS
          </div>

          <div className="relative bg-[#FFFFFF] dark:bg-[#151926] rounded-[32px] p-4 sm:p-8 border border-slate-200/60 dark:border-white/5 shadow-[0_4px_25px_-2px_rgba(0,0,0,0.03)] min-h-[360px] sm:min-h-[420px] flex flex-col lg:flex-row items-center justify-center gap-4 overflow-hidden">
            
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/60 via-transparent to-[#5D5FEF]/5 pointer-events-none" />

            {/* Central Organ Image */}
            <div className="relative z-10 w-48 h-48 sm:w-80 sm:h-80 max-w-full my-2 sm:my-4 flex items-center justify-center shrink-0">
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/50 dark:border-white/10 group">
                <Image
                  src={data.organImagePath}
                  alt={data.organTitle}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md border border-white/20 font-bold">
                    {data.organTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary Diagnosis Badge (Mobile Stacked / Desktop Floating Top Right) */}
            <div className="w-full lg:w-auto lg:absolute lg:top-6 lg:right-8 z-20 max-w-full lg:max-w-[260px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/70 dark:border-white/15 p-3.5 sm:p-4 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Secondary Diagnosis
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug">
                {data.secondaryDiagnosis}
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                {data.secondaryCode}
              </p>
            </div>

            {/* Primary Diagnosis Badge (Mobile Stacked / Desktop Floating Bottom Right) */}
            <div className="w-full lg:w-auto lg:absolute lg:bottom-6 lg:right-8 z-20 max-w-full lg:max-w-[280px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/70 dark:border-white/15 p-3.5 sm:p-4 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#5D5FEF] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5D5FEF] dark:text-[#818cf8]">
                  Primary Diagnosis
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug">
                {data.primaryDiagnosis}
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">
                {data.primaryCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: 3 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-7 mt-7">
        
        {/* CARD A: APPOINTMENT */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-900 dark:text-white uppercase">
              APPOINTMENT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#5D5FEF] border border-[#5D5FEF]/20">
              Follow-up
            </span>
          </div>

          <div className="bg-white dark:bg-[#151926] rounded-[24px] p-4 sm:p-5 border border-slate-200/60 dark:border-white/5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 dark:border-white/10 shrink-0">
                <Image
                  src={data.doctor.avatarUrl}
                  alt={data.doctor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                  {data.doctor.name}
                </h4>
                <p className="text-xs text-slate-500 truncate font-medium">
                  {data.doctor.specialtyTitle}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{data.doctor.date}</span>
              </div>
              <span className="font-bold text-[#5D5FEF] text-[11px]">En Ligne</span>
            </div>
          </div>
        </div>

        {/* CARD B: PRESCRIPTION */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-900 dark:text-white uppercase">
              PRESCRIPTION
            </span>
            <button className="text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>Download</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#151926] rounded-[24px] p-4 sm:p-5 border border-slate-200/60 dark:border-white/5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-2.5 relative">
            {data.prescriptions.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#5D5FEF]/15 text-[#5D5FEF] flex items-center justify-center shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {item.schedule}
                  </div>
                </div>
              </div>
            ))}

            {/* View All Purple Pill Button */}
            <div className="pt-2 flex justify-center">
              <Link
                href="/ordonnances"
                className="px-5 py-1.5 rounded-full text-xs font-bold bg-[#5D5FEF] hover:bg-[#4848DE] text-white shadow-md shadow-[#5D5FEF]/30 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-1.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* CARD C: DR. ADVICE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-900 dark:text-white uppercase">
              DR. ADVICE
            </span>
          </div>

          <div className="bg-white dark:bg-[#151926] rounded-[24px] p-4 sm:p-5 border border-slate-200/60 dark:border-white/5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-2.5">
            {data.advice.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-2.5 h-2.5 text-slate-400" />
                </div>
                <span className="font-medium leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
