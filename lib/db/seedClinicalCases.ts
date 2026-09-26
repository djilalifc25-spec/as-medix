import { ClinicalCase } from '@/types';

export const INITIAL_CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'case_cardio_stemi',
    title: 'Douleur thoracique aiguë constrictive chez un patient tabagique',
    specialtyId: 'cardio',
    specialtyName: 'Cardiologie',
    difficulty: 'Externe',
    patientProfile: {
      age: 56,
      gender: 'Homme',
      motif: 'Douleur rétrosternale violente irradiant vers la mâchoire et le bras gauche depuis 2 heures',
      antecedents: ['Tabagisme actif 35 PA', 'Dyslipidémie traitée par Atorvastatine', 'Sédentarité']
    },
    accessLevel: 'FREE',
    published: true,
    steps: [
      {
        id: 'step_1',
        stepNumber: 1,
        title: 'Étape 1 : Examen initial & constantes',
        patientDataAddition: {
          vitals: {
            'PA': '145/88 mmHg',
            'FC': '88 bpm',
            'SpO2': '97% air ambiant',
            'FR': '18 /min',
            'Glycémie': '1.08 g/L'
          },
          history: 'La douleur a débuté au repos après le déjeuner. Elle est décrite comme un étau broyant la poitrine, insensible à la trinitrine sublinguale apportée par un proche.'
        },
        promptQuestion: 'Quelle est la première action diagnostique indispensable à réaliser dans les 10 minutes suivant l\'admission ?',
        options: [
          { id: 'o1', text: 'Dosage de la troponine hypersensible au laboratoire en urgence', feedback: 'Non ! Ne jamais attendre les résultats biologiques pour porter le diagnostic d\'un syndrome coronarien avec sus-décalage de ST.', isCorrect: false },
          { id: 'o2', text: 'Réalisation immédiate d\'un électrocardiogramme (ECG) 12 dérivations (+ dérivations postérieures et droites)', feedback: 'Exactement ! L\'ECG 12 dérivations + V7-V8-V9 et V3R-V4R doit être fait et interprété dans les 10 minutes.', isCorrect: true },
          { id: 'o3', text: 'Scanner thoracique avec injection pour éliminer une dissection aortique', feedback: 'Inadapté en première intention sans orientation spécifique et ferait perdre un temps précieux.', isCorrect: false },
          { id: 'o4', text: 'Radiographie pulmonaire de face', feedback: 'Non prioritaire.', isCorrect: false }
        ],
        explanation: 'Dans tout syndrome coronarien aigu suspecté, l\'ECG 12 dérivations complété des dérivations postérieures et droites est la pierre angulaire à réaliser dans les 10 minutes.'
      },
      {
        id: 'step_2',
        stepNumber: 2,
        title: 'Étape 2 : Interprétation de l\'ECG',
        patientDataAddition: {
          imaging: 'L\'ECG montre un sus-décalage persistant du segment ST concave vers le bas de 4 mm de V1 à V4 avec ondes T positives géantes et miroir en inférieur (DII, DIII, aVF).'
        },
        promptQuestion: 'Quel est votre diagnostic électrocardiographique précis ?',
        options: [
          { id: 'o1', text: 'Infarctus du myocarde antérieur étendu (STEMI) en phase aiguë', feedback: 'Parfait ! L\'onde de Pardee de V1 à V4 avec miroir inférieur signe l\'occlusion aiguë de l\'artère interventriculaire antérieure (IVA).', isCorrect: true },
          { id: 'o2', text: 'Péricardite aiguë idiopathique au stade 1', feedback: 'Faux : la péricardite a un sus-décalage diffus sans miroir et sans onde d\'ischémie sous-endocardique.', isCorrect: false },
          { id: 'o3', text: 'Syndrome de Brugada de type 1', feedback: 'Incorrect.', isCorrect: false },
          { id: 'o4', text: 'Infarctus inférieur avec image en miroir antérieure', feedback: 'Le sus-décalage siège en antérieur (territoire ischémique principal).', isCorrect: false }
        ],
        explanation: 'L\'élévation du segment ST dans les dérivations antéro-septales (V1 à V4) avec onde de Pardee caractérise l\'infarctus antérieur aigu par occlusion de l\'IVA.'
      },
      {
        id: 'step_3',
        stepNumber: 3,
        title: 'Étape 3 : Stratégie thérapeutique immédiate',
        patientDataAddition: {
          history: 'Le patient est à 2h30 du début des symptômes. Le centre hospitalier dispose d\'une salle de coronarographie interventionnelle H24 accessible sur place en 25 minutes.'
        },
        promptQuestion: 'Quelle est la conduite thérapeutique de reperfusion optimale à déclencher ?',
        options: [
          { id: 'o1', text: 'Fibrinolyse intraveineuse immédiate par Ténectéplase', feedback: 'Non nécessaire car le délai entre le diagnostic et le passage de guide en angioplastie est très inférieur à 120 minutes.', isCorrect: false },
          { id: 'o2', text: 'Coronarographie en urgence pour angioplastie primaire avec pose de stent actif', feedback: 'Excellent ! C\'est le gold standard quand le délai premier contact médical - ballon est < 120 minutes.', isCorrect: true },
          { id: 'o3', text: 'Héparinothérapie seule et surveillance en chambre simple', feedback: 'Faute grave : le myocarde va se nécroser sans reperfusion mécanique.', isCorrect: false },
          { id: 'o4', text: 'Pontage aorto-coronarien programmé le lendemain', feedback: 'Inadapté en extrême urgence.', isCorrect: false }
        ],
        explanation: 'L\'angioplastie primaire est le traitement de choix du STEMI vu dans les 12 premières heures si elle peut être réalisée dans un délai inférieur à 120 minutes.'
      }
    ]
  },
  {
    id: 'case_pneumo_tb',
    title: 'Fièvre au long cours et toux chez un jeune adulte',
    specialtyId: 'pneumo',
    specialtyName: 'Pneumologie',
    difficulty: 'Externe',
    patientProfile: {
      age: 27,
      gender: 'Homme',
      motif: 'Toux sèche puis expectorante évoluant depuis 6 semaines avec sueurs nocturnes',
      antecedents: ['Aucun antécédent médical notable', 'Vit en cité universitaire', 'Non fumeur']
    },
    accessLevel: 'PRO',
    published: true,
    steps: [
      {
        id: 'step_1',
        stepNumber: 1,
        title: 'Étape 1 : Bilan paraclinique initial',
        patientDataAddition: {
          vitals: {
            'Température': '38.2°C le soir',
            'Poids': '58 kg (-5 kg en 1 mois)',
            'PA': '115/75 mmHg'
          },
          imaging: 'La radiographie thoracique objective une opacité nodulaire sous-claviculaire gauche avec une zone de clarification centrale (caverne de 2 cm).'
        },
        promptQuestion: 'Quelle mesure d\'hygiène hospitalière devez-vous prescrire dès cet instant ?',
        options: [
          { id: 'o1', text: 'Isolement respiratoire strict en chambre individuelle avec port d\'un masque FFP2 pour les soignants', feedback: 'Bravo ! Toute lésion excavée est hautement contagieuse jusqu\'à négativation bactériologique.', isCorrect: true },
          { id: 'o2', text: 'Simple désinfection des mains après contact', feedback: 'Insuffisant : la transmission est aéroportée stricte.', isCorrect: false },
          { id: 'o3', text: 'Isolement de contact uniquement', feedback: 'Incorrect pour Mycobacterium tuberculosis.', isCorrect: false }
        ],
        explanation: 'L\'isolement respiratoire (chambre individuelle à pression négative si disponible, masque FFP2 pour les soignants, masque chirurgical pour le patient lors des déplacements) est obligatoire d\'emblée.'
      }
    ]
  },
  {
    id: 'case_neuro_avc',
    title: 'Hémiplégie droite brutale avec déviation du regard',
    specialtyId: 'neuro',
    specialtyName: 'Neurologie',
    difficulty: 'Interne',
    patientProfile: {
      age: 69,
      gender: 'Femme',
      motif: 'Lourdeur brutale du bras droit et incapacité totale à parler survenue il y a 50 minutes',
      antecedents: ['Hypertension artérielle sous IEC', 'Fibrillation atriale sous anticoagulants mal observés']
    },
    accessLevel: 'PREMIUM',
    published: true,
    steps: [
      {
        id: 'step_1',
        stepNumber: 1,
        title: 'Étape 1 : Évaluation neurologique chiffrée',
        patientDataAddition: {
          vitals: { 'PA': '170/95 mmHg', 'FC': '112 bpm irrégulière', 'Glycémie': '1.25 g/L' },
          history: 'Score NIHSS évalué à 16 : paralysie faciale droite, hémiplégie droite complète, aphasie globale motrice et sensorielle.'
        },
        promptQuestion: 'Quel examen d\'imagerie neurovasculaire en urgence demandez-vous en première intention ?',
        options: [
          { id: 'o1', text: 'IRM cérébrale protocole urgence AVC (Diffusion, FLAIR, T2*, Angio-3D TOF)', feedback: 'Parfait ! L\'IRM permet de dater l\'ischémie et de rechercher une occlusion de gros tronc artériel.', isCorrect: true },
          { id: 'o2', text: 'Scanner cérébral sans injection uniquement', feedback: 'Peut être réalisé si l\'IRM n\'est pas immédiatement disponible, mais l\'IRM reste l\'examen de choix.', isCorrect: false },
          { id: 'o3', text: 'Échodoppler des troncs supra-aortiques au lit', feedback: 'Non urgent à la minute près comparé à l\'imagerie parenchymateuse.', isCorrect: false }
        ],
        explanation: 'L\'IRM multimodale en urgence permet de confirmer le diagnostic précoce, de vérifier l\'absence d\'hémorragie et de visualiser le site de l\'occlusion artérielle.'
      }
    ]
  }
];
