import { Fiche } from '@/types';

export const INITIAL_FICHES: Fiche[] = [
  {
    id: 'fiche_choc_types',
    slug: 'les-4-etats-de-choc',
    title: 'Fiche Synthèse : Les 4 Grands États de Choc',
    specialtyId: 'urgences',
    specialtyName: 'Urgences & Réanimation',
    category: 'Urgence Vitale',
    estimatedReadTime: '5 min',
    accessLevel: 'FREE',
    published: true,
    keyTakeaways: [
      'Choc hypovolémique : PVC basse, Index cardiaque bas, RVS élevées.',
      'Choc cardiogénique : PVC haute, PCP haute, Index cardiaque bas, RVS élevées.',
      'Choc distributif (septique/anaphylactique) : PVC normale ou basse, Index cardiaque élevé (au début), RVS effondrées.',
      'Choc obstructif (tamponnade, EP massive) : PVC très haute, Index cardiaque bas, RVS élevées.'
    ],
    htmlContent: `
      <div class="space-y-4">
        <p class="text-sm text-navy-700 dark:text-navy-300">
          Un état de choc est défini par l'inadéquation entre les apports et les besoins tissulaires en oxygène, se traduisant biologiquement par une hyperlactatémie (&gt; 2 mmol/L).
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
            <h4 class="font-bold text-sm text-indigo-900 dark:text-indigo-200">1. Choc Hypovolémique</h4>
            <p class="text-xs text-navy-600 dark:text-navy-300 mt-1">Perte de volume circulant (hémorragie, déshydratation). Traitement : Remplissage rapide + Transfusion si sang.</p>
          </div>
          <div class="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
            <h4 class="font-bold text-sm text-rose-900 dark:text-rose-200">2. Choc Cardiogénique</h4>
            <p class="text-xs text-navy-600 dark:text-navy-300 mt-1">Faillite de la pompe VG. Traitement : Inotropes (Dobutamine), revascularisation coronaire.</p>
          </div>
          <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <h4 class="font-bold text-sm text-amber-900 dark:text-amber-200">3. Choc Distributif (Septique)</h4>
            <p class="text-xs text-navy-600 dark:text-navy-300 mt-1">Vasoplégie majeure. Traitement : Noradrénaline + Remplissage 30 mL/kg + Antibiothérapie &lt; 1h.</p>
          </div>
          <div class="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
            <h4 class="font-bold text-sm text-purple-900 dark:text-purple-200">4. Choc Obstructif</h4>
            <p class="text-xs text-navy-600 dark:text-navy-300 mt-1">Obstacle au remplissage ou à l'éjection (Tamponnade, EP massive, PNO sous tension). Traitement étiologique immédiat !</p>
          </div>
        </div>
      </div>
    `,
    updatedAt: '2026-09-02T10:00:00Z'
  },
  {
    id: 'fiche_glasgow',
    slug: 'score-de-glasgow',
    title: 'Fiche Mémotechnique : Score de Coma de Glasgow (GCS)',
    specialtyId: 'neuro',
    specialtyName: 'Neurologie',
    category: 'Sémiologie & Urgences',
    estimatedReadTime: '4 min',
    accessLevel: 'FREE',
    published: true,
    keyTakeaways: [
      'Score total de 3 à 15.',
      'Coma défini par un score &le; 8 imposant la protection des voies aériennes (intubation).',
      'Yeux (Y / 4), Verbal (V / 5), Moteur (M / 6).'
    ],
    htmlContent: `
      <div class="space-y-4">
        <p class="text-sm text-navy-700 dark:text-navy-300">
          Évalue la profondeur du coma. Réponse motrice (M) = meilleur facteur pronostique.
        </p>
        <div class="p-3 rounded-xl bg-navy-50 dark:bg-navy-800/80 border border-navy-100 dark:border-navy-700 text-xs space-y-2">
          <div><strong>Ouverture des Yeux (1 à 4) :</strong> 4-Spontanée, 3-À la demande, 2-À la douleur, 1-Nulle.</div>
          <div><strong>Réponse Verbale (1 à 5) :</strong> 5-Orientée, 4-Confuse, 3-Inappropriée, 2-Incompréhensible, 1-Nulle.</div>
          <div><strong>Réponse Motrice (1 à 6) :</strong> 6-Aux ordres, 5-Orientée à la douleur, 4-Évitement non adapté, 3-Décortication (flexion), 2-Décérébration (extension), 1-Nulle.</div>
        </div>
      </div>
    `,
    updatedAt: '2026-09-03T08:00:00Z'
  },
  {
    id: 'fiche_hyperkaliemie_ecg',
    slug: 'signes-ecg-hyperkaliemie',
    title: 'Fiche Réflexe : Chronologie ECG de l\'Hyperkaliémie',
    specialtyId: 'nephro',
    specialtyName: 'Néphrologie',
    category: 'ECG & Électrolytes',
    estimatedReadTime: '4 min',
    accessLevel: 'PRO',
    published: true,
    keyTakeaways: [
      '1. Ondes T pointues, symétriques, à base étroite en tente de camping.',
      '2. Allongement du PR et élargissement du QRS.',
      '3. Disparition de l\'onde P (paralysie atriale).',
      '4. Fusion QRS-ST-T en aspect sinusoïdal pré-fibrillatoire.'
    ],
    htmlContent: `
      <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 text-xs space-y-2 text-navy-700 dark:text-navy-300">
        <div class="font-bold text-rose-800 dark:text-rose-300 text-sm mb-1">🚨 Urgence Thérapeutique Immédiate :</div>
        <p>Devant tout signe ECG d'hyperkaliémie : <strong>Gluconate de Calcium 10% (10 à 20 mL IVD sur 2-3 min)</strong> pour stabiliser la membrane cardiaque, SAUF si le patient est sous digitaliques (préférer le Chlorure de Magnésium).</p>
      </div>
    `,
    updatedAt: '2026-09-04T14:00:00Z'
  }
,
  {
  "id": "fiche_endocrino_hypo",
  "slug": "hypoglycemie-conduite-a-tenir",
  "title": "Fiche Réflexe : Prise en charge de l'Hypoglycémie Sévère",
  "specialtyId": "endocrino",
  "specialtyName": "Endocrinologie - Diabétologie",
  "category": "Urgence Métabolique",
  "estimatedReadTime": "4 min",
  "accessLevel": "FREE",
  "published": true,
  "keyTakeaways": [
    "Seuil biologique : Glycémie capillaire ou veineuse < 0,70 g/L (3,9 mmol/L) chez le diabétique traité.",
    "Patient conscient : Règle des 15g de glucides à absorption rapide (3 morceaux de sucre ou 150 mL de jus de fruit) et contrôle à 15 min.",
    "Patient comateux avec voie veineuse : 2 à 3 ampoules de Sérum Glucosé à 30% (G30) en IV direct lent.",
    "Patient comateux sans voie veineuse (diabétique de type 1) : Glucagon 1 mg en IM ou SC (ou Glucagon nasal Baqsimi)."
  ],
  "htmlContent": "\n      <div class=\"space-y-3 text-xs text-navy-700 dark:text-navy-300\">\n        <p><strong>Triade de Whipple :</strong> Signes neuroglycopéniques + Glycémie basse documentée + Disparition immédiate des symptômes après resucrage.</p>\n        <div class=\"p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800\">\n          <p class=\"font-bold text-amber-900 dark:text-amber-200\">Attention aux sulfamides hypoglycémiants (Daonil, Amarel) :</p>\n          <p class=\"mt-1\">Hypoglycémie prolongée sur plusieurs jours pouvant récidiver après un resucrage initial. Hospitalisation sous perfusion de G10% pendant 48 heures impérative !</p>\n        </div>\n      </div>\n    ",
  "updatedAt": "2026-09-04T12:00:00Z"
},
  {
  "id": "fiche_gastro_hemorragie",
  "slug": "hemorragie-digestive-haute",
  "title": "Fiche Mémotechnique : Rupture de Varices Œsophagiennes",
  "specialtyId": "gastro",
  "specialtyName": "Gastro-entérologie & Hépatologie",
  "category": "Hépatologie",
  "estimatedReadTime": "4 min",
  "accessLevel": "PRO",
  "published": true,
  "keyTakeaways": [
    "Trépied immédiat : Vaso-actif (Terlipressine ou Somatostatine) + Ligature endoscopique < 12h + Ceftriaxone IV 7 jours.",
    "Objectif transfusionnel restrictif chez le cirrhotique : Hémoglobine cible entre 7 et 8 g/dL (ne pas trop transfuser pour ne pas ré-augmenter la pression portale !).",
    "Sonde de Blakemore ou de Linton uniquement en cas d'échec de l'hémostase endoscopique ou d'inondation cataclysmique en attendant le TIPS."
  ],
  "htmlContent": "\n      <div class=\"space-y-3 text-xs text-navy-700 dark:text-navy-300\">\n        <p>Le traitement vaso-actif par Terlipressine (2 mg IV puis 1-2 mg toutes les 4h) doit être débuté <strong>dès la suspicion clinique</strong>, avant même le transfert en salle d'endoscopie digestive.</p>\n      </div>\n    ",
  "updatedAt": "2026-09-04T13:00:00Z"
},
  {
  "id": "fiche_pediatrie_apgar",
  "slug": "score-d-apgar",
  "title": "Fiche Synthèse : Le Score d'Apgar à la Naissance",
  "specialtyId": "pediatrie",
  "specialtyName": "Pédiatrie",
  "category": "Néonatalogie",
  "estimatedReadTime": "3 min",
  "accessLevel": "FREE",
  "published": true,
  "keyTakeaways": [
    "Évalué à 1, 5 et 10 minutes de vie.",
    "5 items cotés de 0 à 2 : Apparence (Coloration), Pouls (FC > 100), Grimace (Réactivité), Activité (Tonus), Respiration (Cri vigoureux).",
    "Score 8 à 10 : Normal. Score 4 à 7 : Détresse modérée. Score 0 à 3 : Mort apparente imposant une réanimation néonatale immédiate."
  ],
  "htmlContent": "\n      <div class=\"space-y-2 text-xs text-navy-700 dark:text-navy-300\">\n        <p>Mnémonique <strong>APGAR</strong> : <strong>A</strong>pparence, <strong>P</strong>ouls, <strong>G</strong>rimace, <strong>A</strong>ctivité, <strong>R</strong>espiration.</p>\n      </div>\n    ",
  "updatedAt": "2026-09-04T14:00:00Z"
},
  {
  "id": "fiche_chirurgie_brulures",
  "slug": "regle-des-9-de-wallace",
  "title": "Fiche Réflexe : Règle des 9 de Wallace (Calcul de la Surface Brûlée)",
  "specialtyId": "chirurgie",
  "specialtyName": "Chirurgie Générale & Viscérale",
  "category": "Urgences & Brûlés",
  "estimatedReadTime": "3 min",
  "accessLevel": "FREE",
  "published": true,
  "keyTakeaways": [
    "Tête et cou : 9%.",
    "Chaque membre supérieur : 9% (face ant 4,5% + face post 4,5%).",
    "Chaque membre inférieur : 18% (face ant 9% + face post 9%).",
    "Face antérieure du tronc : 18% (thorax 9% + abdomen 9%).",
    "Face postérieure du tronc : 18% (haut 9% + bas 9%).",
    "Périnée et organes génitaux : 1%."
  ],
  "htmlContent": "\n      <div class=\"text-xs text-navy-700 dark:text-navy-300\">\n        <p><strong>Formule de Parkland pour la réanimation hydrique des premières 24h :</strong></p>\n        <p class=\"font-bold text-rose-700 dark:text-rose-300 mt-1\">Volume de Ringer Lactate = 4 mL x Poids (kg) x % de Surface Brûlée.</p>\n        <p class=\"text-navy-500 mt-1\">La moitié de ce volume est perfusée sur les 8 premières heures, l'autre moitié sur les 16 heures suivantes.</p>\n      </div>\n    ",
  "updatedAt": "2026-09-04T15:00:00Z"
},
  {
  "id": "fiche_uro_ipss",
  "slug": "score-ipss-hypertrophie-prostatique",
  "title": "Fiche Synthèse : Score IPSS & Médicaments de l'HBP",
  "specialtyId": "uro",
  "specialtyName": "Urologie",
  "category": "Urologie Fonctionnelle",
  "estimatedReadTime": "4 min",
  "accessLevel": "PRO",
  "published": true,
  "keyTakeaways": [
    "Évalue la sévérité des SBAU (symptômes du bas appareil urinaire) : 0-7 léger, 8-19 modéré, 20-35 sévère.",
    "Alpha-bloquants (Tamsulosine, Alfuzosine) : Action rapide en 48-72h sur la composante obstructive dynamique (relaxation du col vésical).",
    "Inhibiteurs de la 5-alpha-réductase (Finastéride, Dutastéride) : Action retardée en 3 à 6 mois, réduction du volume prostatique et divise par 2 le taux de PSA sérique !"
  ],
  "htmlContent": "\n      <div class=\"text-xs text-navy-700 dark:text-navy-300\">\n        <p>Piège fréquent : Tout dosage de PSA sous inhibiteur de la 5-alpha-réductase doit être <strong>multiplié par 2</strong> pour être interprété correctement dans le dépistage du cancer prostatique.</p>\n      </div>\n    ",
  "updatedAt": "2026-09-04T16:00:00Z"
}
];
