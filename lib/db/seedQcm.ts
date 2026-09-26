import { QCM } from '@/types';

export const INITIAL_QCMS: QCM[] = [
  {
    id: 'qcm_tb_1',
    title: 'Diagnostic bactériologique de la Tuberculose Pulmonaire',
    specialtyId: 'pneumo',
    specialtyName: 'Pneumologie',
    courseId: 'cours_pneumo_tb',
    courseTitle: 'La Tuberculose Pulmonaire Commune',
    faculty: 'ORAN',
    rang: 'Rang A',
    difficulty: 'Moyen',
    type: 'SINGLE',
    vignette: 'Un patient de 34 ans consulte pour une toux productive évoluant depuis 5 semaines associée à un amaigrissement de 6 kg et des sueurs nocturnes. La radiographie pulmonaire montre une opacité excavée du sommet droit.',
    question: 'Quel est l\'examen diagnostique de certitude à réaliser en première intention pour confirmer l\'étiologie ?',
    options: [
      { id: 'opt_1', letter: 'A', text: 'Une sérologie tuberculeuse' },
      { id: 'opt_2', letter: 'B', text: 'Une intradermoréaction (IDR) à la tuberculine' },
      { id: 'opt_3', letter: 'C', text: 'Trois examens microscopiques des crachats (coloration de Ziehl-Neelsen) avec mise en culture' },
      { id: 'opt_4', letter: 'D', text: 'Un scanner thoracique avec injection de produit de contraste' },
      { id: 'opt_5', letter: 'E', text: 'Une biopsie pulmonaire transpariétale sous scanner' }
    ],
    correctAnswers: [2],
    explanation: 'La certitude diagnostique de la tuberculose pulmonaire active repose sur la mise en évidence directe de Mycobacterium tuberculosis par l\'examen microscopique (Ziehl-Neelsen ou fluorescence) répété sur 3 échantillons matinaux et la mise en culture (milieu de Löwenstein-Jensen ou milieu liquide) associée au test moléculaire rapide (GeneXpert). L\'IDR ne fait jamais la preuve de la maladie active.',
    reference: 'Programme National de Lutte Antituberculeuse (Algérie) - Guide Pratique 2023',
    tags: ['Tuberculose', 'Bactériologie', 'Ziehl-Neelsen', 'Diagnostic'],
    accessLevel: 'FREE'
  },
  {
    id: 'qcm_tb_2',
    title: 'Effets indésirables de la quadrithérapie antituberculeuse',
    specialtyId: 'pneumo',
    specialtyName: 'Pneumologie',
    courseId: 'cours_pneumo_tb',
    courseTitle: 'La Tuberculose Pulmonaire Commune',
    faculty: 'SIDI_BEL_ABBES',
    rang: 'Rang A',
    difficulty: 'Moyen',
    type: 'SINGLE',
    vignette: 'Un patient de 42 ans sous quadrithérapie antituberculeuse (Rifampicine, Isoniazide, Pyrazinamide, Éthambutol) depuis 3 semaines se plaint d\'une baisse brutale de l\'acuité visuelle et d\'une altération de la vision des couleurs (dyschromatopsie rouge-vert).',
    question: 'Quel antibiotique de ce schéma thérapeutique est le plus probablement responsable de cette toxicité ?',
    options: [
      { id: 'opt_1', letter: 'A', text: 'L\'Isoniazide' },
      { id: 'opt_2', letter: 'B', text: 'La Rifampicine' },
      { id: 'opt_3', letter: 'C', text: 'L\'Éthambutol' },
      { id: 'opt_4', letter: 'D', text: 'Le Pyrazinamide' },
      { id: 'opt_5', letter: 'E', text: 'La Streptomycine' }
    ],
    correctAnswers: [2],
    explanation: 'L\'Éthambutol expose au risque de névrite optique rétrobulbaire dose-dépendante, se traduisant par une baisse de l\'acuité visuelle et un trouble précoce de la vision des couleurs (axe rouge-vert). L\'arrêt immédiat du médicament est impératif.',
    reference: 'Pharmacologie Clinique Médicale ECNi / Résidanat',
    tags: ['Éthambutol', 'Iatrogénie', 'Névrite optique'],
    accessLevel: 'FREE'
  },
  {
    id: 'qcm_rm_1',
    title: 'Auscultation du Rétrécissement Mitral',
    specialtyId: 'cardio',
    specialtyName: 'Cardiologie',
    courseId: 'cours_cardio_rm',
    courseTitle: 'Le Rétrécissement Mitral (Sténose Mitrale)',
    rang: 'Rang A',
    difficulty: 'Facile',
    type: 'SINGLE',
    vignette: 'Une patiente de 29 ans, originaire des Hauts-Plateaux algériens, présente une dyspnée d\'effort d\'aggravation progressive. À l\'examen, vous suspectez un rétrécissement mitral d\'origine rhumatismale.',
    question: 'Quelle anomalie auscultatoire fait partie intégrante du classique "rythme de Duroziez" ?',
    options: [
      { id: 'opt_1', letter: 'A', text: 'Un souffle holosystolique râpeux au foyer aortique irradiant vers les carotides' },
      { id: 'opt_2', letter: 'B', text: 'Un roulement méso-diastolique à l\'apex avec éclat de B1 et claquement d\'ouverture mitrale' },
      { id: 'opt_3', letter: 'C', text: 'Un frottement péricardique méso-systolique variable' },
      { id: 'opt_4', letter: 'D', text: 'Un galop protodiastolique B3 au foyer tricuspide' },
      { id: 'opt_5', letter: 'E', text: 'Un souffle continu sous-clavier gauche' }
    ],
    correctAnswers: [1],
    explanation: 'Le rythme de Duroziez ausculté à la pointe en décubitus latéral gauche comporte la triade : 1) Éclat du premier bruit (B1), 2) Claquement d\'ouverture mitrale (COM) diastolique précoce, et 3) Roulement diastolique à renforcement présystolique en rythme sinusal.',
    reference: 'Collège National des Enseignants de Cardiologie',
    tags: ['Cardiologie', 'Valvulopathie', 'Auscultation', 'Duroziez'],
    accessLevel: 'FREE'
  },
  {
    id: 'qcm_rm_2',
    title: 'Complications du Rétrécissement Mitral',
    specialtyId: 'cardio',
    specialtyName: 'Cardiologie',
    courseId: 'cours_cardio_rm',
    courseTitle: 'Le Rétrécissement Mitral (Sténose Mitrale)',
    rang: 'Rang A',
    difficulty: 'Moyen',
    type: 'MULTIPLE',
    vignette: 'Une femme de 45 ans porteuse d\'un rétrécissement mitral serré (surface mitrale mesurée à 1,1 cm²) non opérée.',
    question: 'Quelles sont les complications évolutives classiquement observées dans cette affection ? (Sélectionnez les réponses exactes)',
    options: [
      { id: 'opt_1', letter: 'A', text: 'Fibrillation atriale (FA)' },
      { id: 'opt_2', letter: 'B', text: 'Accident vasculaire cérébral ischémique cardio-embolique' },
      { id: 'opt_3', letter: 'C', text: 'Œdème aigu du poumon (OAP) lors d\'une poussée tachycardique' },
      { id: 'opt_4', letter: 'D', text: 'Hypertrophie ventriculaire gauche majeure de type concentrique' },
      { id: 'opt_5', letter: 'E', text: 'Insuffisance cardiaque droite par retentissement de l\'HTAP' }
    ],
    correctAnswers: [0, 1, 2, 4],
    explanation: 'Le VG est protégé par le rétrécissement en amont, il n\'est JAMAIS hypertrophié ni dilaté dans un RM pur ! En revanche, l\'atrium gauche est très dilaté (risque de FA et d\'embolies systémiques cérébrales), la pression capillaire pulmonaire augmente (OAP) et l\'HTAP entraîne à terme une défaillance du ventricule droit.',
    reference: 'ESC Guidelines on Valvular Heart Disease',
    tags: ['RM', 'Complications', 'Cardio-embolie'],
    accessLevel: 'FREE'
  },
  {
    id: 'qcm_neuro_1',
    title: 'Prise en charge de l\'AVC ischémique aigu',
    specialtyId: 'neuro',
    specialtyName: 'Neurologie',
    courseId: 'cours_neuro_avc',
    courseTitle: 'L\'Accident Vasculaire Cérébral (AVC) Ischémique Aigu',
    rang: 'Rang A',
    difficulty: 'Difficile',
    type: 'SINGLE',
    vignette: 'Un homme de 62 ans est admis aux urgences 1 heure et 45 minutes après l\'apparition brutale d\'un déficit moteur de l\'hémicorps droit et d\'une aphasie motrice. L\'IRM cérébrale montre un hypersignal de diffusion sans hypersignal FLAIR au niveau du territoire superficiel de l\'artère cérébrale moyenne gauche, sans saignement en T2*. La PA est à 165/95 mmHg, la glycémie capillaire est à 1.10 g/L.',
    question: 'Quelle est la stratégie thérapeutique de reperfusion prioritaire à initier en urgence ?',
    options: [
      { id: 'opt_1', letter: 'A', text: 'Héparinothérapie par HBPM curative d\'emblée' },
      { id: 'opt_2', letter: 'B', text: 'Thrombolyse intraveineuse par rt-PA (Alteplase) à 0.9 mg/kg' },
      { id: 'opt_3', letter: 'C', text: 'Baisse immédiate de la PA par Nicardipine IV pour obtenir une PA < 120/80 mmHg' },
      { id: 'opt_4', letter: 'D', text: 'Antiagrégation plaquettaire par Clopidogrel 300 mg per os' },
      { id: 'opt_5', letter: 'E', text: 'Attente d\'un scanner de contrôle à 24 heures' }
    ],
    correctAnswers: [1],
    explanation: 'Le patient présente un AVC ischémique dans la fenêtre thérapeutique (< 4h30), confirmé par le mismatch Diffusion/FLAIR, sans hémorragie ni contre-indication tensionnelle (PA < 185/110 mmHg). La thrombolyse IV par rt-PA doit être débutée sans délai. Si une occlusion proximale est visible en Angio-IRM, une thrombectomie mécanique doit être associée.',
    reference: 'Société Française Neuro-Vasculaire (SFNV) & Recommandations Internationales ESO',
    tags: ['AVC', 'Thrombolyse', 'Urgence neurovasculaire'],
    accessLevel: 'PRO'
  },
  {
    id: 'qcm_cardio_ic_1',
    title: 'Thérapeutique de fond de l\'insuffisance cardiaque à FEVG réduite',
    specialtyId: 'cardio',
    specialtyName: 'Cardiologie',
    courseId: 'cours_cardio_ic',
    courseTitle: 'L\'Insuffisance Cardiaque Aiguë et Chronique',
    rang: 'Rang A',
    difficulty: 'Moyen',
    type: 'MULTIPLE',
    vignette: 'Un patient de 66 ans avec antécédent d\'infarctus ancien présente une insuffisance cardiaque stable en classe II de la NYHA. L\'échocardiographie montre une FEVG altérée à 32%.',
    question: 'Quelles classes thérapeutiques ont formellement démontré une réduction de la mortalité cardiovasculaire chez ce patient ? (Sélectionnez les réponses exactes)',
    options: [
      { id: 'opt_1', letter: 'A', text: 'Inhibiteur du récepteur de l\'angiotensine et de la néprilysine (ARNI : Sacubitril/Valsartan) ou IEC' },
      { id: 'opt_2', letter: 'B', text: 'Bêtabloquant cardio-sélectif adapté (ex: Bisoprolol)' },
      { id: 'opt_3', letter: 'C', text: 'Antagoniste des récepteurs des minéralocorticoïdes (Spironolactone)' },
      { id: 'opt_4', letter: 'D', text: 'Inhibiteur des SGLT2 (Dapagliflozine ou Empagliflozine)' },
      { id: 'opt_5', letter: 'E', text: 'Inhibiteur calcique bradycardisant (Diltiazem)' }
    ],
    correctAnswers: [0, 1, 2, 3],
    explanation: 'Ce sont les 4 piliers indispensables ("Fantastic Four") qui diminuent significativement la mortalité toute cause et les hospitalisations dans l\'insuffisance cardiaque à FEVG réduite (&le; 40%). Les inhibiteurs calciques bradycardisants type Diltiazem ou Vérapamil sont au contraire contre-indiqués en raison de leur effet inotrope négatif.',
    reference: 'ESC Heart Failure Guidelines 2021/2023',
    tags: ['Insuffisance cardiaque', 'ARNI', 'SGLT2', 'Mortalité'],
    accessLevel: 'PRO'
  },
  {
    id: 'qcm_pneumo_aag_1',
    title: 'Critères de gravité de l\'asthme aigu grave',
    specialtyId: 'pneumo',
    specialtyName: 'Pneumologie',
    courseId: 'cours_pneumo_aag',
    courseTitle: 'La Crise d\'Asthme Aiguë Grave (AAG)',
    rang: 'Rang A',
    difficulty: 'Facile',
    type: 'SINGLE',
    vignette: 'Une patiente de 22 ans est amenée par sa famille aux urgences en pleine crise d\'asthme.',
    question: 'Parmi les signes suivants, lequel témoigne d\'un épuisement respiratoire et impose l\'intervention immédiate du médecin réanimateur ?',
    options: [
      { id: 'opt_1', letter: 'A', text: 'Un sifflement auscultatoire intense et bilatéral' },
      { id: 'opt_2', letter: 'B', text: 'Un silence auscultatoire complet ("poumon muet")' },
      { id: 'opt_3', letter: 'C', text: 'Une fréquence respiratoire à 26/min' },
      { id: 'opt_4', letter: 'D', text: 'Une anxiété modérée' },
      { id: 'opt_5', letter: 'E', text: 'Un débit expiratoire de pointe (DEP) à 65% de la valeur théorique' }
    ],
    correctAnswers: [1],
    explanation: 'Le silence auscultatoire ("poumon muet") est le témoin d\'un débit aérien quasi nul par bronchospasme extrême et collapsus des voies aériennes terminales. C\'est un signe d\'arrêt respiratoire imminent.',
    reference: 'Société de Pneumologie de Langue Française (SPLF)',
    tags: ['Asthme', 'Urgence', 'Poumon muet'],
    accessLevel: 'FREE'
  },
  {
    id: 'qcm_nephro_ira_1',
    title: 'Étiologie d\'une insuffisance rénale aiguë',
    specialtyId: 'nephro',
    specialtyName: 'Néphrologie',
    courseId: 'cours_nephro_ira',
    courseTitle: 'L\'Insuffisance Rénale Aiguë (IRA)',
    rang: 'Rang A',
    difficulty: 'Moyen',
    type: 'SINGLE',
    vignette: 'Un patient de 74 ans avec hypertrophie bénigne de la prostate connue se présente avec une anurie complète depuis 18 heures et une douleur sus-pubienne. La créatininémie s\'élève à 420 µmol/L (antérieurement normale à 85 µmol/L).',
    question: 'Quel est l\'examen d\'imagerie urgent indispensable à réaliser au lit du malade ?',
    options: [
      { id: 'opt_1', letter: 'A', text: 'Un scanner rénal avec injection d\'iode' },
      { id: 'opt_2', letter: 'B', text: 'Une scintigraphie rénale au DMSA' },
      { id: 'opt_3', letter: 'C', text: 'Une échographie rénale et de l\'appareil urinaire' },
      { id: 'opt_4', letter: 'D', text: 'Une IRM avec gadolinium' },
      { id: 'opt_5', letter: 'E', text: 'Une artériographie rénale sélective' }
    ],
    correctAnswers: [2],
    explanation: 'L\'échographie rénale et vésicale est l\'examen de première intention systématique devant toute IRA pour éliminer une cause obstructive (obstacle bilatéral ou sur rein unique), visualisant la dilatation pyélocalicielle et un éventuel globe vésical nécessitant un sondage ou un cathétérisme sus-pubien immédiat.',
    reference: 'Collège Universitaire des Enseignants de Néphrologie (CUEN)',
    tags: ['Néphrologie', 'IRA obstructive', 'Échographie'],
    accessLevel: 'PREMIUM'
  },
  {
    id: 'qcm_pediatrie_1',
    title: 'Déshydratation aiguë du nourrisson',
    specialtyId: 'pediatrie',
    specialtyName: 'Pédiatrie',
    rang: 'Rang A',
    difficulty: 'Moyen',
    type: 'SINGLE',
    vignette: 'Un nourrisson de 8 mois présente des selles liquides profuses depuis 24 heures dans un contexte de gastro-entérite aiguë. À l\'examen, il présente un pli cutané persistant, des yeux cernés et une perte de poids chiffrée à 12% du poids antérieur.',
    question: 'Quel est le palier de gravité et la prise en charge immédiate adaptée ?',
    options: [
      { id: 'opt_1', letter: 'A', text: 'Déshydratation légère (&lt; 5%) : réhydratation orale exclusive à domicile' },
      { id: 'opt_2', letter: 'B', text: 'Déshydratation sévère (&gt; 10%) : hospitalisation d\'urgence avec perfusion intraveineuse' },
      { id: 'opt_3', letter: 'C', text: 'Prescription de Lopéramide en gouttes et arrêt de l\'alimentation' },
      { id: 'opt_4', letter: 'D', text: 'Antibiotiques par voie orale systématiques' },
      { id: 'opt_5', letter: 'E', text: 'Surveillance simple sans apport hydrique pour laisser reposer le tube digestif' }
    ],
    correctAnswers: [1],
    explanation: 'Une perte de poids &gt; 10% définit une déshydratation aiguë sévère du nourrisson, imposant une prise en charge hospitalière en urgence avec voie veineuse (ou sonde nasogastrique si abord impossible) pour perfusion de soluté de réhydratation (ex: sérum physiologique puis B27). Les antidiarrhéiques de type Lopéramide sont strictement contre-indiqués chez le nourrisson.',
    reference: 'Recommandations SFMU/SFP Déshydratation Nourrisson',
    tags: ['Pédiatrie', 'Déshydratation', 'Gastro-entérite'],
    accessLevel: 'FREE'
  },
  {
    id: 'qcm_infectieux_1',
    title: 'Prise en charge d\'un choc septique aux urgences',
    specialtyId: 'infectieux',
    specialtyName: 'Infectiologie',
    rang: 'Rang A',
    difficulty: 'Difficile',
    type: 'MULTIPLE',
    vignette: 'Un patient de 68 ans fébrile à 39.8°C présente un état confusionnel, une PA à 75/40 mmHg malgré 20 ml/kg de cristalloïdes, une polypnée à 32/min et des marbrures péri-rotuliennes avec un taux de lactates sanguins à 4.2 mmol/L.',
    question: 'Quelles mesures doivent être réalisées dans l\'heure suivant le diagnostic ("Hour-1 Bundle") ? (Sélectionnez les réponses exactes)',
    options: [
      { id: 'opt_1', letter: 'A', text: 'Dosage des lactates plasmatiques et contrôle de leur cinétique' },
      { id: 'opt_2', letter: 'B', text: 'Réalisation d\'hémocultures avant l\'instauration de l\'antibiothérapie' },
      { id: 'opt_3', letter: 'C', text: 'Administration d\'une antibiothérapie intraveineuse à large spectre dans l\'heure' },
      { id: 'opt_4', letter: 'D', text: 'Introduction de vasopresseurs (Noradrénaline) si la PAM reste < 65 mmHg' },
      { id: 'opt_5', letter: 'E', text: 'Attente des résultats de l\'antibiogramme à 48h avant de débuter les antibiotiques' }
    ],
    correctAnswers: [0, 1, 2, 3],
    explanation: 'Le pack de la première heure (Surviving Sepsis Campaign) exige : 1) Mesurer les lactates, 2) Hémocultures sans retarder l\'antibiothérapie, 3) Antibiotiques IV large spectre dans les 60 min, 4) Remplissage par cristalloïdes 30 ml/kg, 5) Noradrénaline pour PAM &ge; 65 mmHg.',
    reference: 'Surviving Sepsis Campaign International Guidelines 2021',
    tags: ['Sepsis', 'Choc septique', 'Noradrénaline', 'Urgence vitale'],
    accessLevel: 'PRO'
  }
,
  {
  "id": "qcm_endocrino_1",
  "title": "Complications aiguës du diabète : Acidocétose",
  "specialtyId": "endocrino",
  "specialtyName": "Endocrinologie - Diabétologie",
  "rang": "Rang A",
  "difficulty": "Moyen",
  "type": "SINGLE",
  "vignette": "Une jeune femme de 22 ans, suivie pour un diabète de type 1, est amenée aux urgences pour vomissements incoercibles et polypnée ample. La glycémie capillaire est à 24 mmol/L, la cétonémie capillaire à 4,2 mmol/L. Les gaz du sang révèlent : pH = 7,18, HCO3- = 11 mmol/L. Le ionogramme montre : K+ = 3,1 mmol/L.",
  "question": "Quelle est la mesure thérapeutique prioritaire et immédiate ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Débuter immédiatement une perfusion d'insuline rapide à 0,1 UI/kg/h."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Administrer 500 mL de Bicarbonate de sodium semi-molaire à 4,2%."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "Débuter la réhydratation par NaCl 0,9% et apporter du potassium avant toute injection d'insuline."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Injecter une ampoule de Sérum Glucosé à 30% en bolus IV direct."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Mettre en place une ventilation non invasive (VNI) en urgence."
    }
  ],
  "correctAnswers": [
    2
  ],
  "explanation": "RÈGLE DE SÉCURITÉ ABSOLUE : Devant une kaliémie < 3,3 mmol/L lors d'une acidocétose diabétique, l'insulinothérapie doit être DIFFÉRÉE jusqu'à la recharge potassique par voie veineuse continue. L'insuline provoque en effet une entrée massive de potassium dans le compartiment intracellulaire, risquant d'aggraver l'hypokaliémie et d'entraîner des arythmies ventriculaires fatales (torsades de pointes, arrêt cardiaque).",
  "reference": "Recommandations Société Francophone du Diabète (SFD) & Concours Résidanat Alger",
  "tags": [
    "Acidocétose",
    "Potassium",
    "Insuline",
    "Urgence métabolique"
  ],
  "accessLevel": "FREE"
},
  {
  "id": "qcm_gastro_1",
  "title": "Cirrhose hépatique : Infection du liquide d'ascite",
  "specialtyId": "gastro",
  "specialtyName": "Gastro-entérologie & Hépatologie",
  "rang": "Rang A",
  "difficulty": "Difficile",
  "type": "MULTIPLE",
  "vignette": "Un homme de 56 ans atteint d'une cirrhose post-hépatique virale B au stade Child-Pugh B8 consulte pour une majoration rapide du volume abdominal et une fébricule à 38,1°C depuis 48 heures.",
  "question": "Quelles propositions sont EXACTES concernant la prise en charge de ce patient ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Une ponction d'ascite exploratrice doit être réalisée en urgence avant toute antibiothérapie."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Le diagnostic d'infection bactérienne spontanée du liquide d'ascite (ILA) est retenu si le taux de PNN est > 250/mm³."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "L'antibiothérapie de référence est une céphalosporine de 3e génération injectable (Céfotaxime ou Ceftriaxone)."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Une perfusion d'albumine intraveineuse (1,5 g/kg à J1 puis 1 g/kg à J3) prévient le syndrome hépato-rénal."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Les diurétiques doivent être augmentés immédiatement pour assécher l'ascite au cours du sepsis."
    }
  ],
  "correctAnswers": [
    0,
    1,
    2,
    3
  ],
  "explanation": "A, B, C, D sont exactes. L'ILA est une infection spontanée à bacilles gram négatifs (E. coli le plus souvent). Le critère est > 250 PNN/mm³. Le traitement comprend Céfotaxime ou Ceftriaxone et une perfusion systématique d'albumine 20% à J1 et J3 pour prévenir l'insuffisance rénale fonctionnelle. La proposition E est fausse : en cas d'ILA ou de décompensation septique, les diurétiques doivent au contraire être suspendus pour éviter l'insuffisance rénale.",
  "reference": "Recommandations AFEF / EASL & Annales du Résidanat",
  "tags": [
    "Cirrhose",
    "Ascite",
    "ILA",
    "Albumine"
  ],
  "accessLevel": "PRO"
},
  {
  "id": "qcm_pediatrie_1",
  "title": "Déshydratation aiguë du nourrisson",
  "specialtyId": "pediatrie",
  "specialtyName": "Pédiatrie",
  "rang": "Rang A",
  "difficulty": "Moyen",
  "type": "SINGLE",
  "vignette": "Un nourrisson de 6 mois pesant habituellement 7,5 kg est reçu aux urgences pour diarrhée liquide profuse depuis 2 jours. Son poids actuel est de 6,9 kg. Il a les yeux cernés, un pli cutané persistant, une fontanelle déprimée, mais ses extrémités sont chaudes et son temps de recoloration cutanée est de 2 secondes.",
  "question": "Quel est le pourcentage de perte de poids et la prise en charge immédiate la plus appropriée ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Perte de 4% : Conseils diététiques simples avec poursuite du lait habituel."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Perte de 8% (déshydratation modérée) : Réhydratation orale par SRO fractionné à volonté."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "Perte de 8% : Perfusion intraveineuse immédiate de soluté glucosé pur."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Perte de 15% (déshydratation sévère) : Perfusion de Mannitol 20%."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Prescription de Lopéramide (antidiarrhéique) par voie orale."
    }
  ],
  "correctAnswers": [
    1
  ],
  "explanation": "Perte pondérale = (7,5 - 6,9) / 7,5 = 0,6 / 7,5 = 8%. Il s'agit d'une déshydratation modérée (entre 5 et 10%) sans signes de choc hémodynamique (TRC < 3 sec). Le traitement de 1ère intention recommandé par l'OMS est la réhydratation par SRO (Soluté de Réhydratation Orale) administré par petites quantités très rapprochées. Le lopéramide est formellement contre-indiqué chez le nourrisson.",
  "reference": "Société Algérienne de Pédiatrie & OMS",
  "tags": [
    "Pédiatrie",
    "Nourrisson",
    "SRO",
    "Déshydratation"
  ],
  "accessLevel": "FREE"
},
  {
  "id": "qcm_gyneco_1",
  "title": "Grossesse extra-utérine (GEU) : Critères de traitement médical",
  "specialtyId": "gyneco",
  "specialtyName": "Gynécologie - Obstétrique",
  "rang": "Rang A",
  "difficulty": "Moyen",
  "type": "MULTIPLE",
  "vignette": "Une patiente de 28 ans consulte pour des métrorragies peu abondantes avec retard de règles de 5 semaines. Le dosage de β-hCG est à 1 800 UI/L. L'échographie pelvienne endovaginale montre une vacuité utérine avec un hématosalpinx de 25 mm sans activité cardiaque embryonnaire ni épanchement dans le cul-de-sac de Douglas.",
  "question": "Quelles conditions autorisent la proposition d'un traitement médical par Méthotrexate ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Stabilité hémodynamique et absence de défense abdominale."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Taux de β-hCG plasmatiques inférieur à 5 000 UI/L."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "Absence d'activité cardiaque embryonnaire décelable à l'échographie."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Diamètre de la masse annexielle inférieur à 35 - 40 mm."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Patiente compliante acceptant le suivi ambulatoire de la cinétique des β-hCG."
    }
  ],
  "correctAnswers": [
    0,
    1,
    2,
    3,
    4
  ],
  "explanation": "Toutes les propositions (A, B, C, D, E) sont exactes ! Ce sont précisément les critères d'éligibilité au traitement médical conservateur par Méthotrexate intramusculaire (50 mg/m²). Un suivi rigoureux des β-hCG à J4 et J7 est impératif jusqu'à négativation complète.",
  "reference": "Collège National des Gynécologues et Obstétriciens (CNGOF)",
  "tags": [
    "GEU",
    "Méthotrexate",
    "β-hCG",
    "Gynécologie"
  ],
  "accessLevel": "PRO"
},
  {
  "id": "qcm_dermato_1",
  "title": "Toxidermies médicamenteuses sévères : Diagnostic différentiel",
  "specialtyId": "dermato",
  "specialtyName": "Dermatologie - Vénérologie",
  "rang": "Rang A",
  "difficulty": "Difficile",
  "type": "SINGLE",
  "vignette": "Un patient de 45 ans traité par Allopurinol depuis 5 semaines présente une éruption cutanée diffuse érythémateuse et infiltrée avec œdème facial important, adénopathies cervicales multiples et fièvre à 39°C. La biologie montre : PNN = 7 000/mm³, Éosinophiles = 2 400/mm³, ALAT = 450 UI/L (9N), créatinine = 180 µmol/L.",
  "question": "Quel est le diagnostic le plus probable ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Syndrome de Stevens-Johnson."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "DRESS syndrome (Drug Reaction with Eosinophilia and Systemic Symptoms)."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "Pustulose exanthématique aiguë généralisée (PEAG)."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Nécrolyse épidermique toxique de Lyell."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Scarlatine streptococcique de l'adulte."
    }
  ],
  "correctAnswers": [
    1
  ],
  "explanation": "L'association d'une éruption cutanée fébrile tardive (2 à 8 semaines après introduction du médicament inducteur comme l'allopurinol), d'une hyperéosinophilie sanguine franche (> 1500/mm³), d'adénopathies et d'atteintes viscérales (hépatite aiguë et insuffisance rénale) définit typiquement le DRESS syndrome.",
  "reference": "Collège des Enseignants de Dermatologie & ECNi",
  "tags": [
    "DRESS",
    "Toxidermie",
    "Allopurinol",
    "Éosinophilie"
  ],
  "accessLevel": "PRO"
},
  {
  "id": "qcm_infectieux_1",
  "title": "Paludisme grave à Plasmodium falciparum",
  "specialtyId": "infectieux",
  "specialtyName": "Infectiologie",
  "rang": "Rang A",
  "difficulty": "Moyen",
  "type": "MULTIPLE",
  "vignette": "Un homme de 34 ans est admis pour syndrome fébrile aigu avec obnubilation au retour d'un voyage en Côte d'Ivoire il y a 10 jours sans chimioprophylaxie. Le frottis sanguin confirme la présence de trophozoïtes de Plasmodium falciparum avec parasitémie à 6%.",
  "question": "Parmi les signes suivants, lesquels constituent des critères de gravité OMS du paludisme ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Troubles de conscience avec score de Glasgow < 11."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Bilirubine totale > 50 µmol/L associée à une parasitémie > 100 000/µL."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "Acidose métabolique avec lactates plasmatiques > 5 mmol/L."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Hypoglycémie veineuse < 2,2 mmol/L (0,40 g/L)."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Présence d'une fièvre isolée à 39,5°C sans défaillance d'organe."
    }
  ],
  "correctAnswers": [
    0,
    1,
    2,
    3
  ],
  "explanation": "A, B, C, D sont des critères majeurs de gravité OMS. La fièvre élevée seule (E) ne constitue pas un critère de gravité chez l'adulte. Le traitement immédiat de choix est l'Artésunate intraveineux (2,4 mg/kg à H0, H12, H24).",
  "reference": "Critères OMS du Paludisme Grave & Guide National des Maladies Transmissibles",
  "tags": [
    "Paludisme",
    "Falciparum",
    "Critères OMS",
    "Artésunate"
  ],
  "accessLevel": "FREE"
},
  {
  "id": "qcm_hemato_1",
  "title": "Démarche étiologique d'une anémie microcytaire",
  "specialtyId": "hemato",
  "specialtyName": "Hématologie Clinique",
  "rang": "Rang A",
  "difficulty": "Facile",
  "type": "SINGLE",
  "vignette": "Une femme de 42 ans présente une asthénie progressive avec pâleur cutanéo-muqueuse. L'hémogramme montre : Hb = 8,4 g/dL, VGM = 68 fL, CCMH = 29 g/dL, Réticulocytes = 35 000/mm³. La ferritine sérique est dosée à 6 µg/L (Normale 20-200 µg/L).",
  "question": "Quel est le diagnostic le plus probable ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Anémie hémolytique auto-immune."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Anémie par carence martiale (ferriprive)."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "Bêta-thalassémie hétérozygote mineure."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Anémie par carence en vitamine B12."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Aplasie médullaire acquise."
    }
  ],
  "correctAnswers": [
    1
  ],
  "explanation": "Il s'agit d'une anémie microcytaire (VGM < 80 fL), hypochrome (CCMH < 32 g/dL), arégénérative (réticulocytes < 120 000/mm³). L'effondrement de la ferritine sérique (< 15-20 µg/L) est la preuve formelle d'une déplétion des réserves en fer (anémie par carence martiale). Chez cette femme, il faudra explorer en priorité des ménométrorragies ou un saignement digestif occulte.",
  "reference": "Société Française d'Hématologie & Résidanat Médecine",
  "tags": [
    "Anémie",
    "Microcytose",
    "Ferritine",
    "Carence martiale"
  ],
  "accessLevel": "FREE"
},
  {
  "id": "qcm_rhumato_1",
  "title": "Polyarthrite rhumatoïde débutante : Diagnostic biologique",
  "specialtyId": "rhumato",
  "specialtyName": "Rhumatologie",
  "rang": "Rang A",
  "difficulty": "Facile",
  "type": "SINGLE",
  "vignette": "Une patiente de 38 ans consulte pour des douleurs articulaires bilatérales et symétriques des poignets et des articulations métacarpo-phalangiennes depuis 3 mois avec un dérouillage matinal de plus d'une heure.",
  "question": "Quel est le marqueur sérologique le plus spécifique pour le diagnostic précoce de cette affection ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Les anticorps anti-nucléaires (AAN)."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Le facteur rhumatoïde (test au latex-Waaler-Rose)."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "Les anticorps anti-peptides cycliques citrullinés (anti-CCP / ACPA)."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Les anticorps anti-ADN natif."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "L'antigène HLA-B27."
    }
  ],
  "correctAnswers": [
    2
  ],
  "explanation": "Les anticorps anti-peptides cycliques citrullinés (anti-CCP ou ACPA) possèdent une spécificité supérieure à 95% pour la polyarthrite rhumatoïde, bien plus élevée que celle du facteur rhumatoïde (qui peut être positif dans d'autres connectivites ou infections). Ils constituent l'élément clé des critères diagnostiques ACR/EULAR 2010.",
  "reference": "Critères ACR/EULAR & Collège Français des Enseignants en Rhumatologie",
  "tags": [
    "Anti-CCP",
    "Polyarthrite",
    "Rhumatologie"
  ],
  "accessLevel": "PRO"
},
  {
  "id": "qcm_psy_1",
  "title": "Troubles de l'humeur : Virage maniaque sous antidépresseur",
  "specialtyId": "psy",
  "specialtyName": "Psychiatrie",
  "rang": "Rang A",
  "difficulty": "Moyen",
  "type": "SINGLE",
  "vignette": "Un patient de 30 ans est traité par Sertraline (antidépresseur ISRS) pour un épisode dépressif caractérisé. Au bout de 12 jours de traitement, sa famille rapporte qu'il dort à peine 2 heures par nuit sans ressentir de fatigue, qu'il parle sans discontinuer (logorrhée), a des projets mégalomaniaques irréalistes et a dépensé toutes ses économies dans des achats compulsifs.",
  "question": "Quel diagnostic devez-vous poser et quelle est la mesure thérapeutique immédiate ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Résistance dépressive : Augmenter la dose de Sertraline."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Virage maniaque (révélation d'un trouble bipolaire) : Arrêt immédiat de l'antidépresseur et introduction d'un thymorégulateur."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "Syndrome sérotoninergique toxique : Débuter une perfusion de dantrolène."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Attaque de panique aiguë : Prescrire une benzodiazépine seule en ambulatoire."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Évolution schizophrénique déficitaire."
    }
  ],
  "correctAnswers": [
    1
  ],
  "explanation": "Le tableau clinique associe réduction du besoin de sommeil, logorrhée, fuite des idées, euphorie, mégalomanie et désinhibition comportementale : c'est un épisode maniaque franc (virage de l'humeur induit par l'antidépresseur), qui reclasse le patient en Trouble Bipolaire de type I. La conduite immédiate impose l'arrêt de l'antidépresseur et l'instauration d'un traitement stabilisateur de l'humeur (lithium ou antipsychotique atypique / thymorégulateur).",
  "reference": "DSM-5 & Collège National des Universitaires en Psychiatrie",
  "tags": [
    "Bipolaire",
    "Manie",
    "Antidépresseur",
    "Psychiatrie"
  ],
  "accessLevel": "FREE"
},
  {
  "id": "qcm_ophtalmo_1",
  "title": "Glaucome aigu par fermeture de l'angle (GAFA)",
  "specialtyId": "ophtalmo",
  "specialtyName": "Ophtalmologie",
  "rang": "Rang A",
  "difficulty": "Facile",
  "type": "MULTIPLE",
  "vignette": "Une femme de 65 ans hypermétrope consulte en urgence pour une violente douleur unilatérale de l'œil droit avec céphalées frontales, nausées et baisse brutale de l'acuité visuelle survenue après une séance de cinéma.",
  "question": "Quels éléments cliniques confortent le diagnostic de crise aiguë de fermeture de l'angle ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Présence d'une semi-mydriase aréactive à droite."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Hyperhémie conjonctivale avec cercle péri-kératique franc."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "Cornée trouble perdant sa transparence par œdème épithélial."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Globe oculaire très dur à la palpation bidigitale trans-palpébrale."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Myosis serré réactif à la lumière."
    }
  ],
  "correctAnswers": [
    0,
    1,
    2,
    3
  ],
  "explanation": "La triade sémiologique du GAFA associe œil rouge (cercle péri-kératique), cornée œdématiée dépolie, semi-mydriase aréactive (la pupille est dilatée et non en myosis !) et hypertonie oculaire majeure rendant le globe oculaire induré comme du bois.",
  "reference": "Collège des Ophtalmologistes Universitaires de France (COUF)",
  "tags": [
    "GAFA",
    "Hypertonie",
    "Mydriase",
    "Ophtalmologie"
  ],
  "accessLevel": "PRO"
},
  {
  "id": "qcm_orl_1",
  "title": "Épistaxis : Prise en charge d'urgence",
  "specialtyId": "orl",
  "specialtyName": "O.R.L. & Chirurgie Cervico-Faciale",
  "rang": "Rang A",
  "difficulty": "Facile",
  "type": "SINGLE",
  "vignette": "Un homme de 68 ans hypertendu consulte pour un saignement de nez abondant narinaire droit survenu spontanément après un mouchage.",
  "question": "Quel est le premier geste simple à réaliser immédiatement en consultation ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Allonger le patient à plat dos la tête en arrière."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Réaliser un tamponnement postérieur par sonde à double ballonnet."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "Faire moucher doucement, puis comprimer fermement les deux ailes du nez pendant 10 minutes, tête penchée en avant."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Poser une cautérisation chimique bilatérale au nitrate d'argent."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Administrer une perfusion d'acide tranexamique sans geste local."
    }
  ],
  "correctAnswers": [
    2
  ],
  "explanation": "Le geste initial fondamental de toute épistaxis antérieure est le mouchage des caillots suivi de la compression bidigitale directe des ailes du nez sur la cloison nasale pendant 10 minutes, patient assis et tête penchée en avant (pour éviter la déglutition réflexe du sang dans l'estomac, source de nausées et vomissements faussant l'évaluation des pertes).",
  "reference": "Société Française d'ORL (SFORL)",
  "tags": [
    "Épistaxis",
    "Hémostase",
    "ORL"
  ],
  "accessLevel": "FREE"
},
  {
  "id": "qcm_urgences_1",
  "title": "Arrêt cardio-respiratoire (ACR) : Algorithme de réanimation",
  "specialtyId": "urgences",
  "specialtyName": "Urgences & Réanimation",
  "rang": "Rang A",
  "difficulty": "Moyen",
  "type": "MULTIPLE",
  "vignette": "Vous êtes témoin de l'effondrement d'un homme de 50 ans dans le hall de l'hôpital. Il est inconscient et ne respire pas. Vous disposez d'un défibrillateur automatisé externe (DAE). Le moniteur analyse le tracé et annonce : \"Choc conseillé\".",
  "question": "Quelles sont les propositions EXACTES concernant la séquence de réanimation ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Il s'agit d'un rythme défibrillable : Fibrillation Ventriculaire (FV) ou Tachycardie Ventriculaire (TV) sans pouls."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Après la délivrance du premier choc électrique, il faut immédiatement reprendre la RCP (massage cardiaque) pendant 2 minutes sans vérifier le pouls."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "L'Adrénaline (1 mg IV) doit être injectée immédiatement avant la délivrance du premier choc."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "L'injection d'Amiodarone (300 mg IV) est indiquée après le 3e choc électrique en cas de persistance de la FV/TV."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Le rythme des compressions thoraciques doit être de 100 à 120 par minute avec une dépression de 5 à 6 cm."
    }
  ],
  "correctAnswers": [
    0,
    1,
    3,
    4
  ],
  "explanation": "A, B, D, E sont exactes. La proposition C est fausse : dans les rythmes défibrillables, l'adrénaline 1 mg IV n'est administrée qu'après le 3e choc défibrillatoire (et non avant le premier choc). Après chaque choc, la RCP est reprise immédiatement pendant 2 minutes entières avant de réévaluer le tracé ECG.",
  "reference": "Recommandations European Resuscitation Council (ERC) 2021-2025",
  "tags": [
    "ACR",
    "RCP",
    "Défibrillation",
    "Adrénaline",
    "Amiodarone"
  ],
  "accessLevel": "FREE"
},
  {
  "id": "qcm_chirurgie_1",
  "title": "Appendicite aiguë : Diagnostic clinique et pièges",
  "specialtyId": "chirurgie",
  "specialtyName": "Chirurgie Générale & Viscérale",
  "rang": "Rang A",
  "difficulty": "Facile",
  "type": "SINGLE",
  "vignette": "Un jeune homme de 19 ans consulte pour une douleur abdominale apparue il y a 24 heures d'abord péri-ombilicale puis secondairement localisée en fosse iliaque droite. À l'examen, la décompression brusque de la fosse iliaque droite entraîne une vive douleur.",
  "question": "Comment s'appelle ce signe physique sémiologique ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Le signe de Murphy."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Le signe de Blumberg."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "Le signe de Rovsing."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Le signe de Cullen."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Le signe de Grey-Turner."
    }
  ],
  "correctAnswers": [
    1
  ],
  "explanation": "Le signe de Blumberg correspond à la douleur vive provoquée par la décompression brutale de la fosse iliaque droite (témoignant d'une irritation du péritoine pariétal). Le signe de Rovsing est la douleur en FID déclenchée par la palpation de la FIG. Le signe de Murphy est le signe d'une cholécystite aiguë.",
  "reference": "Sémiologie Chirurgicale & Concours de Résidanat",
  "tags": [
    "Appendicite",
    "Blumberg",
    "Chirurgie"
  ],
  "accessLevel": "FREE"
},
  {
  "id": "qcm_uro_1",
  "title": "Colique néphrétique aiguë : Critères de gravité",
  "specialtyId": "uro",
  "specialtyName": "Urologie",
  "rang": "Rang A",
  "difficulty": "Moyen",
  "type": "MULTIPLE",
  "vignette": "Une patiente de 35 ans se présente pour une colique néphrétique aiguë gauche typique. Sa température est mesurée à 38,9°C avec des frissons.",
  "question": "Quelles propositions sont EXACTES quant à la prise en charge de cette patiente ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Il s'agit d'une colique néphrétique fébrile, urgence médico-chirurgicale absolue."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Elle doit être hospitalisée en urgence dans un service d'Urologie ou de Réanimation."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "La dérivation des urines en urgence (par sonde double J ou néphrostomie) est indispensable."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "L'échographie rénale et/ou le scanner abdominopelvien sans injection doivent être réalisés sans délai."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Le traitement peut se limiter à des antispasmodiques et un retour à domicile après sédation de la douleur."
    }
  ],
  "correctAnswers": [
    0,
    1,
    2,
    3
  ],
  "explanation": "L'association d'une colique néphrétique et d'une fièvre (ou de frissons) définit la pyélonéphrite obstructive (sepsis sur obstacle urinaire). C'est une urgence urologique absolue imposant le drainage du rein sous couverture antibiotique intraveineuse bactéricide. Un retour à domicile (E) est une faute médicale grave exposant au choc septique mortel.",
  "reference": "Association Française d'Urologie (AFU)",
  "tags": [
    "Colique néphrétique",
    "Sepsis",
    "Sonde JJ",
    "Urologie"
  ],
  "accessLevel": "PRO"
},
  {
  "id": "qcm_ortho_1",
  "title": "Fractures des membres : Le syndrome des loges",
  "specialtyId": "ortho",
  "specialtyName": "Orthopédie & Traumatologie",
  "rang": "Rang A",
  "difficulty": "Moyen",
  "type": "SINGLE",
  "vignette": "Un patient plâtré pour une fracture fermée des deux os de la jambe consulte 18 heures après la pose du plâtre pour des douleurs violentes de la jambe que la morphine n'arrive pas à calmer.",
  "question": "Quel est le signe clinique le plus précoce et le plus sensible pour suspecter un syndrome des loges ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "La disparition du pouls pédieux."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "La douleur insupportable réveillée par l'étirement passif des muscles de la loge (extension passive des orteils)."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "La pâleur et le refroidissement complet du pied."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Une anesthésie complète du territoire du nerf sciatique."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "La présence de marbrures cutanées remontant jusqu'à la cuisse."
    }
  ],
  "correctAnswers": [
    1
  ],
  "explanation": "Le signe le plus précoce et fidèle d'un syndrome des loges est l'exacerbation extrême de la douleur lors de l'étirement passif des groupes musculaires de la loge sous tension. La disparition des pouls distaux (A) est un signe très tardif signant une ischémie irréversible dépassée.",
  "reference": "Société Française de Chirurgie Orthopédique et Traumatologique (SOFCOT)",
  "tags": [
    "Syndrome des loges",
    "Orthopédie",
    "Aponévrotomie"
  ],
  "accessLevel": "PRO"
},
  {
  "id": "qcm_interne_1",
  "title": "Lupus érythémateux systémique : Dépistage de la néphropathie",
  "specialtyId": "interne",
  "specialtyName": "Médecine Interne",
  "rang": "Rang A",
  "difficulty": "Moyen",
  "type": "MULTIPLE",
  "vignette": "Une femme de 26 ans est suivie pour un lupus érythémateux systémique avec atteinte cutanéo-articulaire sous hydroxychloroquine. Lors de la consultation de contrôle annuelle, elle est asymptomatique.",
  "question": "Quels examens doivent être réalisés systématiquement pour dépister une atteinte rénale lupique débutante ?",
  "options": [
    {
      "id": "opt_1",
      "letter": "A",
      "text": "Recherche d'une protéinurie à la bandelette urinaire ou par dosage du rapport protéinurie/créatininurie."
    },
    {
      "id": "opt_2",
      "letter": "B",
      "text": "Dosage de la créatininémie avec estimation du débit de filtration glomérulaire (DFG)."
    },
    {
      "id": "opt_3",
      "letter": "C",
      "text": "Examen du culot / sédiment urinaire à la recherche d'une hématurie microscopique ou de cylindres."
    },
    {
      "id": "opt_4",
      "letter": "D",
      "text": "Biopsie rénale systématique d'emblée chez toute patiente lupique même sans anomalie urinaire."
    },
    {
      "id": "opt_5",
      "letter": "E",
      "text": "Dosage régulier des fractions du complément sérique C3, C4 et du titre des anticorps anti-ADN natif."
    }
  ],
  "correctAnswers": [
    0,
    1,
    2,
    4
  ],
  "explanation": "A, B, C, E sont les éléments essentiels du suivi. La proposition D est fausse : la ponction biopsie rénale (PBR) n'est JAMAIS systématique en l'absence d'anomalie biologique ; elle n'est indiquée qu'en cas de protéinurie avérée (> 0,5 g/24h) ou d'élévation inexpliquée de la créatininémie.",
  "reference": "Recommandations KDIGO & Société Nationale Française de Médecine Interne (SNFMI)",
  "tags": [
    "Lupus",
    "Néphropathie lupique",
    "Protéinurie",
    "Médecine Interne"
  ],
  "accessLevel": "PRO"
}
];
