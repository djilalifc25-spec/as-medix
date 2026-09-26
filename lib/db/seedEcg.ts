import { ECGRecord } from '@/types';

export const INITIAL_ECG_RECORDS: ECGRecord[] = [
  {
    id: 'ecg_fa_rapide',
    title: 'Fibrillation Atriale (FA) Rapide non contrôlée',
    category: 'Trouble du rythme',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
    clinicalContext: 'Patient de 71 ans se présentant aux urgences pour des palpitations rapides débutées il y a 4 heures, sans douleur thoracique ni syncope. PA : 125/80 mmHg, FC moyenne : 142 bpm.',
    difficulty: 'Débutant',
    isDailyChallenge: true,
    keyFindings: [
      'Absence totale d\'ondes P sinusales organisées.',
      'Activité atriale anarchique visible sous forme d\'oscillations rapides et irrégulières de la ligne de base (ondes f).',
      'Intervalles R-R totalement irréguliers ("anarchie ventriculaire").',
      'Complexes QRS fins (< 120 ms) en l\'absence de bloc de branche préexistant.'
    ],
    interpretation: 'Fibrillation atriale rapide à conduction ventriculaire anarchique.',
    diagnosticDetails: 'Le risque thromboembolique doit être stratifié par le score CHA2DS2-VASc pour décider de l\'anticoagulation curative. Le contrôle de la fréquence cardiaque (bêtabloquant ou digitalique) est la première étape.',
    accessLevel: 'FREE'
  },
  {
    id: 'ecg_stemi_ant',
    title: 'STEMI Antérieur Étendu (Onde de Pardee V1-V6)',
    category: 'Ischémie',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200',
    clinicalContext: 'Homme de 52 ans, douleur thoracique rétrosternale constrictive irradiant au bras gauche depuis 90 minutes. PA : 110/70 mmHg, sueurs profuses.',
    difficulty: 'Intermédiaire',
    isDailyChallenge: false,
    keyFindings: [
      'Sus-décalage du segment ST convexe vers le haut englobant l\'onde T (Onde de Pardee) de V1 à V6, DI et aVL.',
      'Sous-décalage en miroir très net en inférieur (DII, DIII, aVF).',
      'Disparition précoce de l\'onde R de V1 à V3.'
    ],
    interpretation: 'Syndrome coronarien aigu avec sus-décalage du segment ST dans le territoire antérieur étendu (occlusion proximale de l\'IVA).',
    diagnosticDetails: 'Urgence vitale absolue. Indication formelle d\'angioplastie coronaire transluminale percutanée primaire en salle de coronarographie immédiate.',
    accessLevel: 'FREE'
  },
  {
    id: 'ecg_bav_3',
    title: 'Bloc Atrio-Ventriculaire Complet du 3ème Degré (BAV 3)',
    category: 'Conduction',
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1200',
    clinicalContext: 'Patiente de 82 ans admise pour malaises à répétition et une syncope brève à l\'emporte-pièce (syncope d\'Adams-Stokes). FC au scope : 34 bpm.',
    difficulty: 'Intermédiaire',
    isDailyChallenge: false,
    keyFindings: [
      'Dissociation auriculo-ventriculaire complète : les ondes P sont régulières entre elles (fréquence ~ 75/min) mais totalement indépendantes des complexes QRS.',
      'Rythme d\'échappement ventriculaire lent et régulier à 32 bpm à QRS larges (> 140 ms).',
      'Certaines ondes P tombent dans le segment ST ou l\'onde T.'
    ],
    interpretation: 'Bloc auriculo-ventriculaire du 3e degré complet avec rythme d\'échappement sous-jonctionnel lent.',
    diagnosticDetails: 'Nécessite la pose en urgence d\'une sonde d\'entraînement électrosystolique temporaire par voie veineuse jugulaire ou fémorale, puis l\'implantation d\'un stimulateur cardiaque définitif (Pacemaker double chambre DDD).',
    accessLevel: 'PRO'
  },
  {
    id: 'ecg_hyperkaliemie',
    title: 'Hyperkaliémie Sévère Menaçante (K+ = 7.4 mmol/L)',
    category: 'Troubles électrolytiques',
    imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=1200',
    clinicalContext: 'Patient insuffisant rénal chronique hémodialysé ayant manqué deux séances consécutives, se présentant très asthénique avec paresthésies des membres.',
    difficulty: 'Expert',
    isDailyChallenge: false,
    keyFindings: [
      'Ondes T amples, pointues, symétriques, à base étroite ("en tente de camping") diffuses.',
      'Aplatissement et disparition de l\'onde P (paralysie atriale).',
      'Élargissement majeur des complexes QRS prenant un aspect sinusoïdal pré-fibrillatoire.'
    ],
    interpretation: 'Signes électrocardiographiques d\'hyperkaliémie sévère au stade pré-mortem.',
    diagnosticDetails: 'Urgence réanimatoire extrême ! Administration immédiate de Gluconate ou Chlorure de Calcium IV direct pour stabiliser la membrane myocardique, suivie d\'insuline-glucose IV, d\'aérosols de salbutamol et hémodialyse en urgence.',
    accessLevel: 'PRO'
  },
  {
    id: 'ecg_tv',
    title: 'Tachycardie Ventriculaire Monomorphe Soutenue',
    category: 'Urgence',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
    clinicalContext: 'Patient de 64 ans avec séquelle d\'infarctus antérieur, pris d\'un malaise lipothymique avec sueurs froides et sensation de cœur qui s\'emballe. PA : 85/50 mmHg.',
    difficulty: 'Intermédiaire',
    isDailyChallenge: false,
    keyFindings: [
      'Tachycardie régulière à complexes QRS très larges (> 160 ms) avec FC à 175 bpm.',
      'Concordance positive ou négative dans les précordiales.',
      'Capture ou fusion ventriculaire occasionnelle (preuve pathognomonique de l\'origine ventriculaire).'
    ],
    interpretation: 'Tachycardie ventriculaire monomorphe soutenue mal tolérée.',
    diagnosticDetails: 'Si mauvaise tolérance hémodynamique (hypotension, sueurs, altération de la conscience) : Cardioversion électrique externe (choc électrique externe synchronisé 100-200 Joules) sous sédation immédiate.',
    accessLevel: 'PREMIUM'
  }
];
