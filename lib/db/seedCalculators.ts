export interface MedicalCalculator {
  id: string;
  title: string;
  specialtyId: string;
  specialtyName: string;
  category: string;
  description: string;
  badge?: string;
}

export const INITIAL_CALCULATORS: MedicalCalculator[] = [
  // --- CARDIOLOGIE ---
  {
    id: 'chads_vasc',
    title: 'Score CHA₂DS₂-VASc (Risque Thrombo-embolique FA)',
    specialtyId: 'cardio',
    specialtyName: 'Cardiologie',
    category: 'Fibrillation Atriale',
    description: 'Évaluation du risque d\'AVC et indication du traitement anticoagulant oraux (AVK ou AOD) dans la Fibrillation Atriale non valvulaire.',
    badge: 'Recommandation ESC'
  },
  {
    id: 'has_bled',
    title: 'Score HAS-BLED (Risque Hémorragique sous Anticoagulant)',
    specialtyId: 'cardio',
    specialtyName: 'Cardiologie',
    category: 'Anticoagulation',
    description: 'Dépistage des facteurs de risque hémorragiques modifiables avant instauration d\'un anticoagulant.'
  },
  {
    id: 'qt_corrected',
    title: 'Calcul du QT Corrigé (Formule de Bazett)',
    specialtyId: 'cardio',
    specialtyName: 'Cardiologie',
    category: 'Électrocardiogramme',
    description: 'Correction de l\'intervalle QT selon la fréquence cardiaque (Allongement du QTc > 450 ms H / 470 ms F = Risque de Torsade de Pointes).'
  },

  // --- PNEUMOLOGIE ---
  {
    id: 'wells_ep',
    title: 'Score de Wells pour Embolie Pulmonaire',
    specialtyId: 'pneumo',
    specialtyName: 'Pneumologie',
    category: 'Maladie Thrombo-Embolique',
    description: 'Estimation de la probabilité pré-test d\'EP (Faible, Intermédiaire, Forte) pour guider D-Dimères vs Angio-TC.',
    badge: 'Urgence Vitale'
  },
  {
    id: 'curb65',
    title: 'Score CURB-65 (Pneumonie Franche Lobaire Aiguë)',
    specialtyId: 'pneumo',
    specialtyName: 'Pneumologie',
    category: 'Infectiologie Respiratoire',
    description: 'Évaluation de la sévérité des pneumonies communautaires et décision d\'hospitalisation (Ambulatoire vs Hospitalisation vs Réanimation).'
  },

  // --- NÉPHROLOGIE ---
  {
    id: 'cockcroft',
    title: 'Clairance Créatinine (Cockcroft & Gault / CKD-EPI)',
    specialtyId: 'nephro',
    specialtyName: 'Néphrologie',
    category: 'Insuffisance Rénale',
    description: 'Calcul dynamique du Débit de Filtration Glomérulaire (DFG) et adaptation des posologies médicamenteuses.',
    badge: 'Incontournable'
  },
  {
    id: 'natremie_corrigee',
    title: 'Natrémie Corrigée en Hyperglycémie & Déficit en Eau Libre',
    specialtyId: 'nephro',
    specialtyName: 'Néphrologie',
    category: 'Troubles Électrolytiques',
    description: 'Correction du Sodium plasmatique lors des poussées hyperglycémiques (Na corrigé = Na + 0.016 * (Glycémie mg/dL - 100)).'
  },

  // --- NEUROLOGIE ---
  {
    id: 'glasgow',
    title: 'Score de Coma de Glasgow (GCS)',
    specialtyId: 'neuro',
    specialtyName: 'Neurologie',
    category: 'Urgences Neurologiques',
    description: 'Évaluation rapide de la profondeur du coma (3 à 15 points, Yeux, Verbal, Moteur). Intubation si GCS ≤ 8.',
    badge: 'Urgence Absolue'
  },
  {
    id: 'nihss',
    title: 'Score NIHSS (Sévérité de l\'AVC Ischémique Aigu)',
    specialtyId: 'neuro',
    specialtyName: 'Neurologie',
    category: 'Pathologie Vasculaire',
    description: 'Mesure du déficit neurologique à la phase aiguë d\'un AVC pour décision de Thrombolyse IV / Thrombectomie.'
  },

  // --- URGENCES & RÉANIMATION ---
  {
    id: 'pse_debit',
    title: 'Calculateur de Débit Pousse-Seringue (PSE µg/kg/min)',
    specialtyId: 'urgences',
    specialtyName: 'Urgences & Réanimation',
    category: 'Catécholamines',
    description: 'Calcul précis de la vitesse de perfusion en mL/h pour Dobutamine, Noradrénaline, Adrénaline, Isuprel.',
    badge: 'Garde SAUV'
  },
  {
    id: 'qsofa',
    title: 'Score qSOFA & SOFA (Dépistage du Sepsis)',
    specialtyId: 'urgences',
    specialtyName: 'Urgences & Réanimation',
    category: 'Infectiologie Aiguë',
    description: 'Dépistage précoce de la défaillance d\'organe chez le patient suspect de sepsis (PAS ≤ 100, FR ≥ 22, GCS < 15).'
  },

  // --- GASTRO-ENTÉROLOGIE ---
  {
    id: 'child_pugh',
    title: 'Score de Child-Pugh (Sévérité de la Cirrhose)',
    specialtyId: 'gastro',
    specialtyName: 'Gastro-entérologie',
    category: 'Hépatologie',
    description: 'Classification en stades A, B, C basée sur Bilirubine, Albumine, TP/INR, Ascite et Encéphalopathie hépatique.'
  },
  {
    id: 'blatchford',
    title: 'Score de Glasgow-Blatchford (Hémorragie Digestive Haute)',
    specialtyId: 'gastro',
    specialtyName: 'Gastro-entérologie',
    category: 'Urgences Digestives',
    description: 'Stratification du risque de récidive et besoin d\'intervention endoscopique urgente ou transfusion.'
  },

  // --- PÉDIATRIE ---
  {
    id: 'apgar',
    title: 'Score d\'Apgar (Adaptation à la Vie Extra-Utérine)',
    specialtyId: 'pediatrie',
    specialtyName: 'Pédiatrie',
    category: 'Néonatologie',
    description: 'Évaluation à 1 min, 5 min et 10 min de la naissance (Fréquence cardiaque, Respiration, Tonus, Réactivité, Coloration).'
  },
  {
    id: 'poids_posologie_ped',
    title: 'Calculateur de Doses Médicamenteuses Pédiatriques par Poids',
    specialtyId: 'pediatrie',
    specialtyName: 'Pédiatrie',
    category: 'Pharmacologie Pédiatrique',
    description: 'Calcul automatique des posologies en mg/kg/jour pour Paracétamol (60 mg/kg/j), Amoxicilline, Ibuprofène.'
  },

  // --- GYNÉCO-OBSTÉTRIQUE ---
  {
    id: 'terme_gestationnel',
    title: 'Calculateur de Terme Théorique & Âge Gestationnel (SA)',
    specialtyId: 'gyneco',
    specialtyName: 'Gynéco-Obstétrique',
    category: 'Obstétrique',
    description: 'Calcul de la Date Prévue d\'Accouchement (DPA) et semaines d\'aménorrhée (SA) à partir de la Date des Dernières Règles (DDR).'
  }
];
