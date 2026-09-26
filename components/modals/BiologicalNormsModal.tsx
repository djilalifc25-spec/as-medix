'use client';

import React, { useState } from 'react';
import { X, Search, Activity, Droplets, Heart, FileText, CheckCircle2, ShieldAlert, Thermometer, Brain, Sparkles } from 'lucide-react';

interface BiologicalNormsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BiologicalNormsModal: React.FC<BiologicalNormsModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  if (!isOpen) return null;

  const normsCategories = [
    {
      id: 'nfs',
      category: '🩸 Hématologie & NFS (Numération Formule Sanguine)',
      items: [
        { name: 'Hémoglobine (Homme)', range: '13.0 - 17.0 g/dL', notes: 'Anémie si < 13 g/dL. Transfusion si < 7 g/dL (ou < 8-9 si coronarien)' },
        { name: 'Hémoglobine (Femme)', range: '12.0 - 15.5 g/dL', notes: 'Anémie si < 12 g/dL. En enceinte < 10.5 g/dL' },
        { name: 'Hématocrite (Homme)', range: '40 - 52 %', notes: 'Polyglobulie si > 54%' },
        { name: 'Hématocrite (Femme)', range: '37 - 47 %', notes: 'Hémoconcentration si élevée, hémodilution si basse' },
        { name: 'VGM (Volume Globulaire Moyen)', range: '80 - 100 fL', notes: 'Microcytose < 80 fL (Carence Martiale, Thalassémie) | Macrocytose > 100 fL (B12, B9, Alcool)' },
        { name: 'CCMH / TCMH', range: '32 - 36 g/dL / 27 - 33 pg', notes: 'Hypochromie si CCMH < 32 ou TCMH < 27' },
        { name: 'Leucocytes (GB Total)', range: '4 000 - 10 000 /mm³', notes: 'Leucopénie < 4000 | Hyperleucocytose > 10 000 | Urgence si > 50 000 (Sepsis/Hémopathie)' },
        { name: 'Polynucléaires Neutrophiles (PNN)', range: '1 500 - 7 000 /mm³ (45-70%)', notes: 'Agranulocytose si < 500 /mm³ (Isoler en chambre stérile en urgence)' },
        { name: 'Lymphocytes', range: '1 000 - 4 000 /mm³ (20-40%)', notes: 'Lymphopénie < 1000 (VIH, Corticoïdes) | Lymphocytose > 4000 (Syndrome mononucléosique, LLC)' },
        { name: 'Polynucléaires Éosinophiles', range: '50 - 500 /mm³ (1-5%)', notes: 'Hyperéosinophilie > 500 /mm³ (Parasitose, Allergie, Médicamenteux)' },
        { name: 'Polynucléaires Basophiles', range: '< 100 /mm³ (< 1%)', notes: 'Augmentés dans les Syndromes Myéloprolifératifs (LMC)' },
        { name: 'Monocytes', range: '200 - 1 000 /mm³ (2-10%)', notes: 'Monocytose > 1000 (Infections chroniques, Tuberculose, CMML)' },
        { name: 'Plaquettes (Thrombocytes)', range: '150 000 - 400 000 /mm³', notes: 'Thrombopénie < 150k (Risque hémorragique sévère < 20k) | Hyperplaquettose > 450k' },
        { name: 'Réticulocytes', range: '20 000 - 100 000 /mm³', notes: 'Anémie Régénérative si > 120 000 /mm³ (Hémolyse, Hémorragie aigu) | Arégénérative si < 50 000' },
      ]
    },
    {
      id: 'ionogramme',
      category: '🧪 Ionogramme Sanguin & Électrolytes',
      items: [
        { name: 'Sodium (Na+)', range: '135 - 145 mmol/L', notes: 'Hyponatrémie < 135 (Neurologique/Coma si < 120) | Hypernatrémie > 145' },
        { name: 'Potassium (K+)', range: '3.5 - 5.0 mmol/L', notes: 'Hyperkaliémie > 5.0 (Ondes T pointues sur ECG, Urgence si > 6.5) | Hypokaliémie < 3.5 (Onde U, Torsades)' },
        { name: 'Chlore (Cl-)', range: '95 - 105 mmol/L', notes: 'Utile pour le calcul du trou anionique plasmatique' },
        { name: 'Bicarbonates (HCO3-)', range: '22 - 26 mmol/L', notes: 'Acidose métabolique si < 22 mmol/L | Alcalose si > 28 mmol/L' },
        { name: 'Calcium Total (Ca2+)', range: '2.20 - 2.60 mmol/L (88 - 104 mg/L)', notes: 'Hypocalcémie < 2.20 (Chvostek, Trousseau) | Hypercalcémie > 2.60 (QT court, Urgence si > 3.0)' },
        { name: 'Calcium Ionisé', range: '1.15 - 1.32 mmol/L', notes: 'Forme biologiquement active (Non dépendante de l\'albumine)' },
        { name: 'Phosphate (PO4 3-)', range: '0.80 - 1.45 mmol/L (25 - 45 mg/L)', notes: 'Hypophosphatémie dans le syndrome de rennutrition inaptée' },
        { name: 'Magnésium (Mg2+)', range: '0.75 - 1.00 mmol/L (18 - 24 mg/L)', notes: 'Hypomagnésémie favorise les Torsades de Pointes' },
        { name: 'Trou Anionique Plasmatique', range: '12 ± 4 mmol/L', notes: 'Calcul: [Na+] - ([Cl-] + [HCO3-]). Élevé dans acidose lactique, cétoacidose, toxiques' },
      ]
    },
    {
      id: 'renale',
      category: '💧 Bilan Régal, Urologique & Acido-Basique',
      items: [
        { name: 'Créatininémie (Homme)', range: '60 - 115 µmol/L (7 - 13 mg/L)', notes: 'Indice de filtration glomérulaire (DFG normal > 90 mL/min)' },
        { name: 'Créatininémie (Femme)', range: '45 - 95 µmol/L (5 - 11 mg/L)', notes: 'Variations selon masse musculaire' },
        { name: 'Urée Sanguine', range: '2.5 - 7.5 mmol/L (0.15 - 0.45 g/L)', notes: 'Rapport Urée/Créat > 100 évoque une Insuffisance Rénale Fonctionnelle' },
        { name: 'Acide Urique (Uricémie)', range: '180 - 420 µmol/L (30 - 70 mg/L)', notes: 'Hyperuricémie > 420 µmol/L (Goutte, Lithiase, Syndrome de Lyse Tumorale)' },
        { name: 'Clairance Créatinine DFG', range: '> 90 mL/min / 1.73m²', notes: 'IRC si DFG < 60 mL/min pendant > 3 mois | Dialyse si DFG < 15' },
      ]
    },
    {
      id: 'cardiaque',
      category: '🫀 Marqueurs Cardiaques & Enz. Musculaires',
      items: [
        { name: 'Troponine I hs (High Sensitivity)', range: '< 14 ng/L (pg/mL)', notes: 'Symptômes de SCA + cinétique ascensionnelle H0/H1 = Infarctus (SCA ST+ / ST-)' },
        { name: 'Troponine T hs', range: '< 14 ng/L (pg/mL)', notes: 'Élévation précoce à 2-4h post-ischémie myocardique' },
        { name: 'NT-proBNP', range: '< 125 pg/mL (Si < 75 ans)', notes: 'Diagnostic d\'Insuffisance Cardiaque Aiguë éliminé si NT-proBNP < 300 pg/mL' },
        { name: 'BNP', range: '< 100 pg/mL', notes: 'Insuffisance Cardiaque Aiguë très probable si BNP > 400 pg/mL' },
        { name: 'CPK (Créatine Phosphokinase)', range: '30 - 200 UI/L', notes: 'Rhabdomyolyse si CPK > 1 000 UI/L (Risque IRA sur myoglobinurie)' },
        { name: 'CPK-MB', range: '< 5 % de la CPK Totale', notes: 'Isoenzyme spécifique du tissu myocardique' },
        { name: 'Myoglobine', range: '< 70 µg/L', notes: 'Marqueur précoce non spécifique de nécrose musculaire' },
      ]
    },
    {
      id: 'hepatique',
      category: '🧪 Bilan Hépatique, Biliaire & Pancréatique',
      items: [
        { name: 'ALAT (SGPT)', range: '< 45 UI/L (Homme) | < 34 UI/L (Femme)', notes: 'Cytolyse hépatique majeure si ALAT > 10 x N (Hépatite aiguë virale/toxique)' },
        { name: 'ASAT (SGOT)', range: '< 35 UI/L', notes: 'Rapport ASAT/ALAT > 2 évoque une Hépatopathie Alcoolique' },
        { name: 'Phosphatases Alcalines (PAL)', range: '40 - 130 UI/L', notes: 'Cholestase si PAL et GGT élevées | Atteinte osseuse si PAL isolée' },
        { name: 'Gamma-GT (GGT)', range: '< 55 UI/L (Homme) | < 38 UI/L (Femme)', notes: 'Inducteur enzymatique (Alcool, Médicaments, Stéatose NASH)' },
        { name: 'Bilirubine Totale', range: '5 - 21 µmol/L (3 - 12 mg/L)', notes: 'Ictère clinique visible à partir de > 40 µmol/L' },
        { name: 'Bilirubine Conjuguée (Directe)', range: '< 5 µmol/L', notes: 'Ictère à bilirubine directe = Obstacle Biliaire / Cholestase' },
        { name: 'Bilirubine Non Conjuguée (Libre)', range: '5 - 17 µmol/L', notes: 'Ictère libre = Hémolyse ou Maladie de Gilbert' },
        { name: 'Lipase Pancréatique', range: '< 60 UI/L', notes: 'Pancléatite aiguë affirmée si Lipasémie > 3 x la normale (N > 180 UI/L)' },
        { name: 'Albumine Sanguine', range: '35 - 50 g/L', notes: 'Hypoalbuminémie < 30 g/L (Syndrome Néphrotique, Denutrition, Cirrhose)' },
      ]
    },
    {
      id: 'gazometrie',
      category: '🫁 Gazométrie Artérielle (Air Ambiant, FiO2 21%)',
      items: [
        { name: 'pH Artériel', range: '7.38 - 7.42', notes: 'Acidémie < 7.35 (Urgence vitale < 7.10) | Alcalémie > 7.45' },
        { name: 'PaO2 (Pression Artérielle O2)', range: '80 - 100 mmHg (Décroît avec âge)', notes: 'Hypoxémie si < 80 mmHg. Insuffisance respiratoire aiguë si < 60 mmHg' },
        { name: 'PaCO2 (Pression Artérielle CO2)', range: '35 - 45 mmHg', notes: 'Hypercapnie > 45 mmHg (Hypoventilation) | Hypocapnie < 35 (Hyperventilation)' },
        { name: 'HCO3- (Bicarbonates Gaz)', range: '22 - 26 mmol/L', notes: 'Composante métabolique de l\'équilibre acido-basique' },
        { name: 'SaO2 (Saturation Artérielle O2)', range: '95 - 99 %', notes: 'Hypoxie si SaO2 < 90%' },
        { name: 'Lactates Artériels', range: '0.5 - 2.0 mmol/L', notes: 'Hyperlactatémie / Choc Septique ou Cardiogénique si > 2.0 mmol/L (Sévère > 4.0)' },
        { name: 'Rapport PaO2 / FiO2 (Kirby)', range: '> 400 mmHg', notes: 'SDRA Légère 200-300 | SDRA Modérée 100-200 | SDRA Sévère < 100 mmHg' },
      ]
    },
    {
      id: 'hemostase',
      category: '⏱️ Hémostase, Bilan de Coagulation & Fibrinolyse',
      items: [
        { name: 'Taux de Prothrombine (TP)', range: '70 - 100 %', notes: 'Insuffisance Hépatocellulaire ou Carence en Vitamine K si < 70%' },
        { name: 'INR (Sujet Sain)', range: '0.8 - 1.2', notes: 'Cible thérapeutique sous AVK : 2.0 - 3.0 (3.5 pour Valves Prothétiques Mécaniques)' },
        { name: 'TCA (Temps Céphaline Activée)', range: '28 - 38 sec (Ratio 0.8 - 1.2)', notes: 'Cible thérapeutique sous HNF (Héparine) : Ratio 1.5 à 2.5' },
        { name: 'Fibrinogène', range: '2.0 - 4.0 g/L', notes: 'Hypofibrinogénémie < 1.5 g/L (CIVD, Hémorragie grave de la délivrance)' },
        { name: 'D-Dimères', range: '< 500 µg/L (ou Âge x 10 si > 50 ans)', notes: 'Excellente Valeur Prédictive Négative pour éliminer Maladie Thromboembolique (TVP/EP)' },
        { name: 'Activité Anti-Xa (HBPM)', range: '0.5 - 1.0 UI/mL', notes: 'Mesurée 4h post-injection pour les HBPM à dose curative (Lovenox, Innohep)' },
      ]
    },
    {
      id: 'lipides_metabolisme',
      category: '🧬 Bilan Lipidique, Glucidique & Métabolique',
      items: [
        { name: 'Glycémie à jeun', range: '0.70 - 1.10 g/L (3.9 - 6.1 mmol/L)', notes: 'Diabète Avéré si Glycémie ≥ 1.26 g/L (7.0 mmol/L) vérifiée à 2 reprises' },
        { name: 'HbA1c (Hémoglobine Glyquée)', range: '4.0 - 5.6 % (20 - 38 mmol/mol)', notes: 'Objectif Diabétique : < 7.0 % | Diabète si HbA1c ≥ 6.5%' },
        { name: 'Cholestérol Total', range: '< 2.00 g/L (5.2 mmol/L)', notes: 'Objectif modulé selon le score de risque cardiovasculaire SCORE2' },
        { name: 'HDL Cholestérol (Bon)', range: '> 0.40 g/L (Homme) | > 0.50 g/L (Femme)', notes: 'Facteur protecteur si > 0.60 g/L' },
        { name: 'LDL Cholestérol (Mauvais)', range: '< 1.16 g/L (Risque Modéré)', notes: 'Cible chez le Coronarien (Très Haut Risque) : < 0.55 g/L (1.4 mmol/L)' },
        { name: 'Triglycérides', range: '< 1.50 g/L (1.7 mmol/L)', notes: 'Hypertriglycéridémie majeure > 5.0 g/L (Risque de Pancréatite Aiguë)' },
      ]
    },
    {
      id: 'inflammation',
      category: '⚡ Bilan Inflammatoire & Infectiologie',
      items: [
        { name: 'CRP (Protéine C-Réactive)', range: '< 5.0 mg/L', notes: 'Syndrome Inflammatoire si CRP > 10 mg/L | Infection bactérienne souvent > 50-100 mg/L' },
        { name: 'VS (Vitesse de Sédimentation)', range: '< 15 mm (H) | < 20 mm (F)', notes: 'VS 1ère heure = (Âge / 2) chez l\'homme' },
        { name: 'Procalcitonine (PCT)', range: '< 0.10 µg/L', notes: 'PCT > 0.50 µg/L en faveur d\'un Sepsis Bactérien Aigu (Guide l\'antibiothérapie)' },
        { name: 'Ferritinémie', range: '30 - 300 µg/L (H) | 15 - 200 µg/L (F)', notes: 'Carence Martiale si < 30 µg/L | Hyperferritinémie dans le syndrome métabolique et la maladie de Still' },
        { name: 'Protéines Totales Plasmatiques', range: '65 - 80 g/L', notes: 'Hyperprotidémie si Ig monoclonale (Myélome) | Hypoprotidémie si fuite néphrotique' },
      ]
    },
    {
      id: 'endocrino',
      category: '🦋 Endocrinologie, Hormonologie & Vitamines',
      items: [
        { name: 'TSH ultra-sensible', range: '0.4 - 4.0 mIU/L', notes: 'Hypothyroïdie si TSH > 4.0 | Hyperthyroïdie si TSH < 0.1 mIU/L' },
        { name: 'T4 Libre (FT4)', range: '12 - 22 pmol/L (9 - 17 ng/L)', notes: 'Forme périphérique active d\'hormone thyroïdienne' },
        { name: 'T3 Libre (FT3)', range: '3.1 - 6.8 pmol/L', notes: 'Utile dans les thyréotoxicoses à T3 isolée' },
        { name: 'Cortisolémie à 8h', range: '200 - 550 nmol/L (7 - 25 µg/dL)', notes: 'Insuffisance Surrénalienne si < 100 nmol/L | Dépistage Cushing par freinage minute' },
        { name: 'PTH (Parathormone)', range: '15 - 65 pg/mL', notes: 'Hyperparathyroïdie si PTH élevée avec Hypercalcémie' },
        { name: 'Vitamine 25-OH D3 (Calcifédiol)', range: '30 - 60 ng/mL (75 - 150 nmol/L)', notes: 'Carence si < 10 ng/mL | Insuffisance si 10-30 ng/mL' },
        { name: 'Vitamine B12 (Cobalamine)', range: '200 - 900 pg/mL', notes: 'Carence entraîne une anémie macrocytaire et une sclérose combinée de la moelle' },
        { name: 'Folates Sanguins (Vitamine B9)', range: '5 - 15 ng/mL', notes: 'Foliculation requise en début de grossesse' },
      ]
    },
    {
      id: 'urinaire_lcr',
      category: '🧪 Chimies Urinaire & Liquide Céphalo-Rachidien (LCR)',
      items: [
        { name: 'Protéinurie des 24h', range: '< 0.15 g/24h', notes: 'Protéinurie Pathologique > 0.30 g/24h | Syndrome Néphrotique si > 3.0 g/24h + Hypoalbumine < 30 g/L' },
        { name: 'Rapport Protéinurie / Créatininurie', range: '< 15 mg/mmol (< 0.15 g/g)', notes: 'Évaluation rapide sur échantillon d\'urine du matin' },
        { name: 'Glycorachie (LCR)', range: '2.5 - 4.5 mmol/L (Rapport LCR/Sang > 60%)', notes: 'Hypoglycorachie < 40% de la glycémie sanguine = Méningite Bactérienne ou Tuberculeuse' },
        { name: 'Protéinorachie (LCR)', range: '0.15 - 0.45 g/L', notes: 'Hyperprotéinorachie > 1.0 g/L dans méningites et polyradiculonévrites (Guillain-Barré)' },
        { name: 'Cytologie du LCR', range: '< 5 éléments / mm³', notes: 'Méningite Purulente si > 1 000 PNN/mm³ | Méningite Virale si > 10-500 Lymphocytes/mm³' },
      ]
    }
  ];

  const filteredCategories = normsCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.notes.toLowerCase().includes(query.toLowerCase()) ||
      cat.category.toLowerCase().includes(query.toLowerCase())
    )
  })).filter(cat => (selectedCat === 'all' || cat.id === selectedCat) && cat.items.length > 0);

  return (
    <div className="fixed inset-0 z-[99999] bg-navy-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-navy-900 w-full max-w-4xl rounded-3xl border border-navy-100 dark:border-navy-800 shadow-soft-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-navy-100 dark:border-navy-800 flex items-center justify-between bg-gradient-to-r from-rose-50/50 to-brand-50/30 dark:from-navy-950 dark:to-navy-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl shadow-md shadow-rose-500/20 shrink-0">
              🩸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-navy-950 dark:text-white tracking-tight">
                  Dictionnaire Intégral des Normes Biologiques
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  100+ Constantes
                </span>
              </div>
              <p className="text-xs text-navy-500 dark:text-navy-400">
                Valeurs usuelles de laboratoire, unités internationales et seuils d'alerte thérapeutique de garde
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl text-navy-400 hover:text-navy-900 dark:hover:text-white hover:bg-navy-100 dark:hover:bg-navy-800 transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 border-b border-navy-100 dark:border-navy-800 bg-navy-50/60 dark:bg-navy-950/40 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-navy-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher une constante biologique (ex: Troponine, Kaliémie, D-Dimères, PaO2, Clairance, TSH...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-navy-700 text-xs font-medium text-navy-900 dark:text-white placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-xs"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCat === 'all'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white dark:bg-navy-800 text-navy-700 dark:text-navy-300 border border-navy-200 dark:border-navy-700 hover:border-rose-400'
              }`}
            >
              🌐 Toutes les catégories ({normsCategories.flatMap(c => c.items).length})
            </button>
            {normsCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCat === cat.id
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white dark:bg-navy-800 text-navy-700 dark:text-navy-300 border border-navy-200 dark:border-navy-700 hover:border-rose-400'
                }`}
              >
                {cat.category.split(' ')[0]} {cat.category.split(' ')[1]} ({cat.items.length})
              </button>
            ))}
          </div>
        </div>

        {/* Norms Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto text-xl">
                🔍
              </div>
              <p className="text-sm font-bold text-navy-700 dark:text-navy-300">
                Aucune constante trouvée pour "{query}"
              </p>
              <p className="text-xs text-navy-400">
                Essayez de rechercher par mot-clé général comme "Potassium", "CRP" ou "Plaquettes".
              </p>
            </div>
          ) : (
            filteredCategories.map((cat, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-navy-100 dark:border-navy-800">
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <span>{cat.category}</span>
                  </h3>
                  <span className="text-[11px] font-bold text-navy-400 bg-navy-100 dark:bg-navy-800 px-2 py-0.5 rounded-md">
                    {cat.items.length} valeurs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {cat.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="p-4 rounded-2xl bg-white dark:bg-navy-800/80 border border-navy-150 dark:border-navy-750 space-y-2 hover:border-rose-300 dark:hover:border-rose-900 transition-all shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs sm:text-sm font-bold text-navy-950 dark:text-white leading-tight">
                          {item.name}
                        </span>
                        <span className="text-xs font-mono font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900/50 shrink-0">
                          {item.range}
                        </span>
                      </div>
                      <p className="text-[11px] text-navy-600 dark:text-navy-300 leading-relaxed font-medium bg-navy-50/70 dark:bg-navy-900/60 p-2 rounded-xl">
                        💡 <strong>Interprétation :</strong> {item.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-navy-100 dark:border-navy-800 bg-navy-50/50 dark:bg-navy-950/50 flex items-center justify-between text-xs text-navy-500 dark:text-navy-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Basé sur les référentiels de la Haute Autorité de Santé (HAS) & recommandations européennes</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-navy-900 text-white dark:bg-white dark:text-navy-950 font-bold hover:opacity-90 transition-opacity"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

