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
,
{
  "id": "fiche_orl_obstruction_nasale_et_epistaxis",
  "slug": "orl-obstruction-nasale-et-epistaxis",
  "title": "Fiche Flash : 1. Obstruction Nasale & Épistaxis Grave",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 1. Obstruction Nasale & Épistaxis Grave",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Rappels Anatomiques & Vascularisation Nasale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La muqueuse nasale présente une vascularisation extrêmement riche issue du système <strong>Carotide Externe</strong> (artère sphénopalatine) et du système <strong>Carotide Interne</strong> (artères éthmoïdales antérieure et postérieure).\n  </p>\n  <div class=\"p-4 my-4 rounded-2xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20\">\n    <div class=\"flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold mb-1\">\n      🩸 Zone Cardinale : La Tache Vasculaire de Kiesselbach\n    </div>\n    <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n      Située à la partie antéro-inférieure du septum nasal, la <strong>tache vasculaire (plexus de Kiesselbach)</strong> est le siège de plus de 90% des épistaxis bénignes de l'enfant et du sujet jeune.\n    </p>\n  </div>\n</section>\n\n<section id=\"epistaxis\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Conduite à Tenir d'Urgence devant une Épistaxis Grave</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'épistaxis est une urgence médico-chirurgicale fréquente. L'appréciation du retentissement hémodynamique (pouls, tension artérielle, choc) prime sur l'examen otorhinolaryngologique.\n  </p>\n\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6\">\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 dark:text-brand-400 mb-2\">1. Tamponnement Antérieur</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Mèche grasse ou éponge résorbable (Merocel) introduite d'avant en arrière parallèlement au plancher des fosses nasales pendant 48 heures.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-amber-600 dark:text-amber-400 mb-2\">2. Tamponnement Postérieur / Ballonnets</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Indiqué si l'épistaxis persiste malgré le tamponnement antérieur. Réalisé sous couverture antibiotique.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-rose-600 dark:text-rose-400 mb-2\">3. Embolisation & Ligature</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">En cas d'échec : embolisation de l'artère maxillaire interne sous angiographie ou ligature sous endoscopie de l'artère sphénopalatine.</p>\n    </div>\n  </div>\n</section>\n\n<section id=\"obstruction\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Étiologies de l'Obstruction Nasale</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Nourrisson :</strong> Atrésie choanale (urgence vitale si bilatérale), corps étranger nasal méconnu (rhinorrhée unilatérale fétide).\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Jeune Homme :</strong> <em>Angiofibrome nasopharyngien juvénile</em> (fibrome nasopharyngien) se révélant par une obstruction nasale avec épistaxis récidivantes massives.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez l'Adulte :</strong> Déviation septale, hypertrophie des cornets, polypose naso-sinusienne, cancers du nasopharynx (UCN).\n    </div>\n  </div>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés & Pièges Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/50 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 À RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5 leading-relaxed\">\n      <li>• Épistaxis + rhinorrhée fétide purulente unilatérale chez l'enfant = Corps étranger nasal méconnu jusqu'à preuve du contraire.</li>\n      <li>• Épistaxis à répétition chez un adolescent masculin = Évoquer impérativement le fibrome nasopharyngien (contre-indication absolue à la biopsie !).</li>\n      <li>• La tache vasculaire est située dans la partie antéro-inférieure du septum nasal.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_cancers_des_voies_aero_digestives_superieures_vads",
  "slug": "orl-cancers-des-voies-aero-digestives-superieures-vads",
  "title": "Fiche Flash : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épidémiologie & Facteurs de Risque</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Plus de 90% des cancers des VADS sont des <strong>carcinomes épidermoïdes</strong>. La synergie alcoolo-tabagique constitue le facteur de risque majeur pour la cavité buccale, l'oropharynx, le hypopharynx et le larynx.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200\">\n      <strong>HPV (Human Papillomavirus 16) :</strong> Responsable d'une incidence croissante des cancers de l'oropharynx (amygdales, base de langue) chez des sujets plus jeunes et non-fumeurs.\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>EBV (Virus d'Epstein-Barr) :</strong> Associé de façon constante aux Carcinomes Nasopharyngés (UCN / Undifferentiated Carcinoma of Nasopharyngeal Type) endémiques au Maghreb.\n    </div>\n  </div>\n</section>\n\n<section id=\"clinique\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Examen Clinique & Panendoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Devant toute <strong>adénopathie cervicale chronique de l'adulte (> 3 semaines)</strong>, dure, indolore et fixe, un cancer des VADS doit être recherché systématiquement par l'examen ORL complet et la nasofibroscopie.\n  </p>\n  <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 mb-4\">\n    <strong>Panendoscopie des VADS sous AG :</strong> Indispensable pour la biopsie de la lésion primitive, la recherche d'une seconde localisation synchrone (10 à 15% des cas) et le bilan d'extension.\n  </div>\n</section>\n\n<section id=\"ucn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Carcinome du Nasopharynx (UCN)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Le cancer du cavum (UCN) se caractérise par sa triade évocatrice : <strong>Otite séro-muqueuse unilatérale</strong> de l'adulte, adénopathie cervicale haute sous-digastrique et atteinte des nerfs crâniens (diplopie par atteinte du VI, névralgie du V).\n  </p>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5\">\n      <li>• Otite séro-muqueuse unilatérale chez l'adulte = Examen impératif du cavum (nasopharynx).</li>\n      <li>• L'UCN est très radiosensible et chimiosensible (traitement basé sur la radio-chimiothérapie).</li>\n      <li>• La panendoscopie des VADS est obligatoire avant toute décision thérapeutique.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_traumatismes_du_cou_et_de_la_face",
  "slug": "orl-traumatismes-du-cou-et-de-la-face",
  "title": "Fiche Flash : 3. Traumatismes de la Face et du Cou",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 3. Traumatismes de la Face et du Cou",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"opn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Fractures des Os Propres du Nez (OPN) & Hématome de Cloison</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La fracture des OPN est la plus fréquente des fractures de la face. L'examen otorhinolaryngologique précoce doit systématiquement rechercher une urgence chirurgicale : <strong>l'hématome de cloison nasal</strong>.\n  </p>\n  <div class=\"p-4 my-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n    <strong>⚠️ Urgence Médicale : Hématome de Cloison</strong><br>\n    Se manifeste par une obstruction nasale bilatérale avec tuméfaction violacée, lisse et fluctuante de la cloison nasale. <em>Risque évolutif :</em> Nécrose du cartilage septal avec ensellement nasal définitif et médiastinite. Drainage chirurgical en urgence sous couverture antibiotique.\n  </div>\n</section>\n\n<section id=\"lefort\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Fractures de Le Fort (Massif Facial Middle-Face)</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort I (Disjonction basilaire) :</strong> Trait horizontal au-dessus de l'arcade dentaire supérieure détachant l'arcade alvéolo-dentaire du reste du massif maxillaire.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort II (Disjonction pyramido-naso-maxillaire) :</strong> Trait pyramidal passant par la racine du nez, la paroi médiale de l'orbite et le rebord orbitaire inférieur.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort III (Disjonction cranio-faciale totale) :</strong> Trait haut séparant l'ensemble du massif facial de la base du crâne.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_tumefactions_cervicales",
  "slug": "orl-diagnostic-des-tumefactions-cervicales",
  "title": "Fiche Flash : 4. Diagnostic des Tuméfactions Cervicales",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 4. Diagnostic des Tuméfactions Cervicales",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"orientations\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Démarche Diagnostique devant une Masse Cervicale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'âge et la topographie (médiane ou latérale) constituent les deux facteurs majeurs d'orientation étiologique.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200\">\n      <strong>Chez l'Enfant / Sujet Jeune (< 30 ans) :</strong> Origine infectieuse (adénite, adénophlegmon) ou malformation congénitale (kyste du tractus thyréoglosse, kyste amygdaloïde).\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>Chez l'Adulte (> 40 ans) :</strong> Origine tumorale ganglionnaire secondaire (métastase d'un carcinome des VADS) jusqu'à preuve du contraire !\n    </div>\n  </div>\n</section>\n\n<section id=\"congenitales\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Tuméfactions Congénitales Médianes & Latérales</h2>\n  <div class=\"space-y-4\">\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste du Tractus Thyréoglosse (KTT)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction médiane, sous-hyoïdienne, <strong>mobile à la déglutition et à la protraction de la langue</strong> (trajet résiduel du tractus thyréoglosse).\n      </p>\n    </div>\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste Amygdaloïde (Fente Branchiale)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction latéro-cervicale haute, le long du bord antérieur du muscle sternocléidomastoïdien.\n      </p>\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_pathologies_de_l_oreille_externe",
  "slug": "orl-pathologies-de-l-oreille-externe",
  "title": "Fiche Flash : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "30 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"otite-externe\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Externe Aiguë Diffuse</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection dermo-épidermique du conduit auditif externe (CAE), favorisée par les baignades et le nettoyage micro-traumatique par coton-tige. Germe prédominant : <strong>Pseudomonas aeruginosa</strong> (Bacille Pyocyanique).\n  </p>\n  <div class=\"p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-navy-900/60 mb-4\">\n    <strong>Clinique :</strong> Otalgie violente, vivement exacerbée par la <em>pression sur le tragus</em> et la <em>traction du pavillon</em>. Tympan normal mais difficile à visualiser en raison de l'œdème sténosant du conduit.\n  </div>\n</section>\n\n<section id=\"oem\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Otite Externe Nécrosante Maligne (OEM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Osteomyélite du rocher d'origine pseudomonadique survenant chez le <strong>diabétique âgé ou l'immunodéprimé</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Signes d'Alerte et Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otalgie insomniante rebelle aux antalgiques avec otorrhée purulente et bourgeon de granulation au plancher du conduit.</li>\n      <li>• Complications neurologiques : Atteinte du nerf facial (VII) à la partie postérieure du conduit, puis des nerfs crâniens inférieurs (IX, X, XI au trou déchiré postérieur).</li>\n      <li>• Traitement : Antibiothérapie antipyocyanique prolongée IV (Ceftazidime + Ciprofloxacine) et équilibre du diabète.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otite_moyenne_aigue_oma",
  "slug": "orl-otite-moyenne-aigue-oma",
  "title": "Fiche Flash : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"germes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Étiopathogénie & Bactériologie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'OMA fait suite à une rhinopharyngite aiguë par dysfonctionnement de la trompe d'Eustache. Principaux germes : <strong>Haemophilus influenzae</strong> (syndrome otite-conjonctivite) et <strong>Streptococcus pneumoniae</strong> (Pneumocoque, le plus fébrile et algique).\n  </p>\n</section>\n\n<section id=\"stades\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Stades Otoscopiques</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200\">\n      <strong>1. OMA Congestive :</strong> Tympan rosé ou érythémateux avec conservation des reliefs osseux. Traitement antalgique/antipyrique sans antibiotique d'emblée.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>2. OMA Collectée :</strong> Tympan bombé, dépoli, comblant les reliefs osseux. Indication à l'antibiothérapie par Amoxicilline (ou Augmentin si otite-conjonctivite).\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>3. OMA Perforée :</strong> Otorrhée purulente pulsatile spontanée soulageant l'otalgie.\n    </div>\n  </div>\n</section>\n\n<section id=\"complications\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Complications : La Mastoïdite Aiguë</h2>\n  <div class=\"p-4 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <strong>Mastoïdite Aiguë de l'Enfant :</strong> Décollement du pavillon de l'oreille avec comblement et œdème rétro-auriculaire douloureux. Hospitalisation, scanner du rocher et paracentèse / antibiothérapie IV ± mastoïdatesctomie.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinosinusites_aigues_et_chroniques",
  "slug": "orl-rhinosinusites-aigues-et-chroniques",
  "title": "Fiche Flash : 7. Les Rhinosinusites Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 7. Les Rhinosinusites Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"maxillaire\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Sinusite Maxillaire Aiguë de l'Adulte</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection aiguë du sinus maxillaire. Critères diagnostiques d'une surinfection bactérienne (nécessitant Amoxicilline) : au moins 2 critères majeurs (douleur sous-orbitaire unilatérale throbbing, mouchage purulente, fièvre > 38.5°C).\n  </p>\n</section>\n\n<section id=\"ethmoidite\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Éthmoïdite Aiguë de l'Enfant (Urgence Vitale)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Éthmoïdite Aiguë du Nourrisson</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Seul sinus développé dès la naissance. Clinique : <strong>Œdème palpebral unilatéral douloureux</strong> à prédominance médiale avec fièvre élevée.<br>\n      <em>Stade collecté (Abcès sous-périosté orbitaire) :</em> Exophtalmie, mydriase, immobilité oculaire. Scanner orbito-encéphalique en urgence et drainage.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_corps_etrangers_en_orl",
  "slug": "orl-corps-etrangers-en-orl",
  "title": "Fiche Flash : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"penetration\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Le Syndrome de Pénétration (Élément Pathognomonique)</h2>\n  <div class=\"p-5 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30\">\n    <strong>Clinique Cardinal :</strong> Accès de suffocation brutal, tirage, cyanose, toux quinteuse expulsative expiratoire survenant lors du jeu ou d'un repas chez un enfant de 6 mois à 3 ans (cacahuète, petit objet). L'interrogatoire retrouve systématiquement cet épisode inaugural.\n  </div>\n</section>\n\n<section id=\"localisation\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Prise en Charge & Bronchoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Toute suspicion de corps étranger des voies aériennes impose la réalisation d'une <strong>endoscopie au tube rigide sous AG</strong> pour extraction au tube optique.\n  </p>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otites_moyennes_chroniques_et_cholesteatome",
  "slug": "orl-otites-moyennes-chroniques-et-cholesteatome",
  "title": "Fiche Flash : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"osm\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Séro-Muqueuse (OSM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Épanchement rétro-tympanique chronique (> 3 mois) à tympan fermé sans signe d'inflammation aiguë. Première cause de surdité de transmission chez l'enfant.\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20 mb-4\">\n    <strong>Otoscopie :</strong> Tympan dépoli, rétracté, ambré/jaunâtre avec bulles ou niveau liquide. <em>Traitement :</em> Aérateurs transtympaniques (yoyos) ± adénoïdectomie.\n  </div>\n</section>\n\n<section id=\"cholesteatome\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Cholestéatome (OMC Dangereuse)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Présence d'épithélium pavimenteux stratifié kératinisé dans les cavités de l'oreille moyenne. Caractérisé par son pouvoir <strong>ostéolytique destructeur</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🔍 Otoscopie & Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otoscopie : Perforation atticale ou marginale comblée par des squames blanchâtres fétides.</li>\n      <li>• Complications : Fistule labyrinthique (vertige déclenché par la pression du conduit = Signe de la fistule), paralysie faciale périphérique (VII), méningite et abcès du cerveau.</li>\n      <li>• Traitement : Toujours chirurgical (tympanoplastie d'éradication).</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_surdites",
  "slug": "orl-diagnostic-des-surdites",
  "title": "Fiche Flash : 10. Diagnostic des Surdités (Transmission vs Perception)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 10. Diagnostic des Surdités (Transmission vs Perception)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"diapason\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épreuves au Diapason (Weber & Rinne)</h2>\n  <div class=\"overflow-x-auto mb-6\">\n    <table class=\"w-full text-left border-collapse border border-slate-200 dark:border-navy-700 rounded-xl overflow-hidden text-xs\">\n      <thead class=\"bg-slate-100 dark:bg-navy-800 font-bold uppercase text-navy-700 dark:text-navy-200\">\n        <tr>\n          <th class=\"p-3 border\">Type de Surdité</th>\n          <th class=\"p-3 border text-center\">Test de Weber (Vortex)</th>\n          <th class=\"p-3 border text-center\">Test de Rinne (CO vs CA)</th>\n        </tr>\n      </thead>\n      <tbody class=\"divide-y divide-slate-100 dark:divide-navy-800\">\n        <tr>\n          <td class=\"p-3 font-bold text-brand-600\">Surdité de Transmission</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté malade</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Négatif</strong> (CO > CA)</td>\n        </tr>\n        <tr>\n          <td class=\"p-3 font-bold text-purple-600\">Surdité de Perception</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté sain</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Positif</strong> (CA > CO mais abaissés)</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</section>\n\n<section id=\"audiometrie\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Audiométrie & Impédancemétrie</h2>\n  <ul class=\"space-y-3 text-sm text-navy-700 dark:text-navy-300\">\n    <li>• <strong>Surdité de Transmission :</strong> Conduction osseuse (CO) normale, courbe de conduction aérienne (CA) abaissée (existence d'un Rink / rinne audiométrique). Tympanogramme plat (épanchement OSM) ou réflexe stapedien absent (otospongiose).</li>\n    <li>• <strong>Surdité de Perception :</strong> Courbes CO et CA superposées et abaissées. Otospongiose (surdité de transmission à tympan normal avec coche de Carhart à 2000 Hz). Neurinome de l'acoustique (surdité de perception rétro-cochléaire unilatérale progressive).</li>\n  </ul>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_vertiges",
  "slug": "orl-diagnostic-des-vertiges",
  "title": "Fiche Flash : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"syndromes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Syndrome Vestibulaire Périphérique vs Central</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20\">\n      <h3 class=\"font-bold text-teal-900 mb-2\">Syndrome Périphérique (Harmonieux)</h3>\n      • Vertige rotatoire intense avec signes neuro-végétatifs (vomissements).<br>\n      • <strong>Nystagmus horizontal ou horizono-rotatoire</strong> battant du côté opposé à la lésion (phase rapide vers le côté sain).<br>\n      • Déviations toniques (Romberg, Fukuda) du <em>côté lésé</em>.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n      <h3 class=\"font-bold text-rose-950 mb-2\">Syndrome Central (Dysharmonieux)</h3>\n      • Vertige souvent flou ou sensation d'instabilité.<br>\n      • Nystagmus pur (vertical, rotatoire pur ou multidirectionnel).<br>\n      • Déviations toniques non concordantes (évoquer un AVC du tronc cérébral / cérébelleux).\n    </div>\n  </div>\n</section>\n\n<section id=\"vppb\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Vertige Positionnel Paroxystique Bénin (VPPB)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Dû à une lithiase des canaux semi-circulaires (canal postérieur +++). Vertige très bref (< 1 minute), violent, déclenché par les changements de position de la tête.\n  </p>\n  <div class=\"p-4 rounded-xl bg-indigo-50 border border-indigo-200 mb-4\">\n    <strong>Diagnostic :</strong> Manœuvre de Dix-Hallpike (déclenche le vertige et le nystagmus épuisable avec latence). <em>Traitement :</em> Manœuvre libératoire de Semont ou Epley.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_dyspnees_laryngees_aigues_et_chroniques",
  "slug": "orl-dyspnees-laryngees-aigues-et-chroniques",
  "title": "Fiche Flash : 12. Dyspnées Laryngées Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 12. Dyspnées Laryngées Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"triade\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Triade Clinique de la Dyspnée Laryngée</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Triade Pathognomonique</h3>\n    <ol class=\"list-decimal pl-5 text-sm text-rose-900 dark:text-rose-200 space-y-1\">\n      <li><strong>Bradypnée Inspiratoire :</strong> Ralentissement de la fréquence respiratoire avec allongement de l'inspiration.</li>\n      <li><strong>Tirage Inspiratoire :</strong> Dépression des parties meubles (sus-sternale, sus-claviculaire et intercostale).</li>\n      <li><strong>Bruit Inspiratoire :</strong> Stridor (aigu, laryngé haut) ou Cornage (grave, sous-glottique).</li>\n    </ol>\n  </div>\n</section>\n\n<section id=\"etiologies\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Laryngites Aiguës Pédiatriques</h2>\n  <div class=\"space-y-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Laryngite Aiguë Sous-Glottique (Virale) :</strong> La plus fréquente (6 mois - 3 ans). Toux rauque, voix modifiée, bradypnée inspiratoire nocturne. Traitement : Corticothérapie orale (Dexaméthasone ou Solupred) ± nébulisation d'Adrénaline.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-100 border border-rose-300\">\n      <strong>Épiglottite Aiguë (Haemophilus influenzae b) :</strong> Urgence extrême ! Dysphagie majeure avec bavage d'interdiction, position assise penchée en avant obligatoire, voix étouffée (\"patate chaude\"). <em>Contre-indication absolue à l'abaisse-langue !</em> Intubation en milieu chirurgical.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinopharyngites_et_angines",
  "slug": "orl-rhinopharyngites-et-angines",
  "title": "Fiche Flash : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"tdr\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Classification des Angines & Test TDR</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Les angines sont érythémateuses (rouges) ou érythémato-pultacées (blanches) dans 80% des cas. La majorité est d'origine virale. Seul le <strong>Streptocoque Bêta-Hémolytique du Groupe A (SGA)</strong> justifie une antibiothérapie (Amoxicilline 6 jours) pour prévenir le Rhumatisme Articulaire Aigu (RAA).\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 mb-4\">\n    <strong>Test Rapide d'Orientation Diagnostique (TDR) :</strong> Réalisé au cabinet par frottis amygdalien. Si positif = Antibiothérapie Amoxicilline. Si négatif = Traitement symptomatique uniquement.\n  </div>\n</section>\n\n<section id=\"formes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Angines Particulières</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-purple-50 border border-purple-200\">\n      <strong>Angines Vésiculeuses (Virales) :</strong> Herpangine (Virus Coxsackie A) avec petites vésicules pharyngées, syndrome pied-main-bouche.\n    </div>\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Angine de Vincent (Ulcéro-nécrotique unilatérale) :</strong> Association fuso-spirillaire chez un sujet à mauvaise hygiène bucco-dentaire. Haleine fétide.\n    </div>\n  </div>\n</section>\n\n<section id=\"phlegmon\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Phlegmon Péri-Amygdalien (Complication Suppurée)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Clinique & Ponction</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Suppuration entre la capsule amygdalienne et le muscle constricteur du pharynx.<br>\n      • Triade : <strong>Trismus serré</strong>, otalgie réflexe, odynophagie majeure unilatérale avec voix étouffée.<br>\n      • Examen : Amygdale refoulée vers le bas et le dedans, pilier antérieur bombé, luette œdématiée déviée du côté opposé.<br>\n      • Traitement : Ponction évacuatrice au point de bombement maximum (ou incision) + Augmentin IV.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
}
,
{
  "id": "fiche_orl_obstruction_nasale_et_epistaxis",
  "slug": "orl-obstruction-nasale-et-epistaxis",
  "title": "Fiche Flash : 1. Obstruction Nasale & Épistaxis Grave",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 1. Obstruction Nasale & Épistaxis Grave",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Rappels Anatomiques & Vascularisation Nasale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La muqueuse nasale présente une vascularisation extrêmement riche issue du système <strong>Carotide Externe</strong> (artère sphénopalatine) et du système <strong>Carotide Interne</strong> (artères éthmoïdales antérieure et postérieure).\n  </p>\n  <div class=\"p-4 my-4 rounded-2xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20\">\n    <div class=\"flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold mb-1\">\n      🩸 Zone Cardinale : La Tache Vasculaire de Kiesselbach\n    </div>\n    <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n      Située à la partie antéro-inférieure du septum nasal, la <strong>tache vasculaire (plexus de Kiesselbach)</strong> est le siège de plus de 90% des épistaxis bénignes de l'enfant et du sujet jeune.\n    </p>\n  </div>\n</section>\n\n<section id=\"epistaxis\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Conduite à Tenir d'Urgence devant une Épistaxis Grave</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'épistaxis est une urgence médico-chirurgicale fréquente. L'appréciation du retentissement hémodynamique (pouls, tension artérielle, choc) prime sur l'examen otorhinolaryngologique.\n  </p>\n\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6\">\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 dark:text-brand-400 mb-2\">1. Tamponnement Antérieur</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Mèche grasse ou éponge résorbable (Merocel) introduite d'avant en arrière parallèlement au plancher des fosses nasales pendant 48 heures.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-amber-600 dark:text-amber-400 mb-2\">2. Tamponnement Postérieur / Ballonnets</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Indiqué si l'épistaxis persiste malgré le tamponnement antérieur. Réalisé sous couverture antibiotique.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-rose-600 dark:text-rose-400 mb-2\">3. Embolisation & Ligature</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">En cas d'échec : embolisation de l'artère maxillaire interne sous angiographie ou ligature sous endoscopie de l'artère sphénopalatine.</p>\n    </div>\n  </div>\n</section>\n\n<section id=\"obstruction\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Étiologies de l'Obstruction Nasale</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Nourrisson :</strong> Atrésie choanale (urgence vitale si bilatérale), corps étranger nasal méconnu (rhinorrhée unilatérale fétide).\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Jeune Homme :</strong> <em>Angiofibrome nasopharyngien juvénile</em> (fibrome nasopharyngien) se révélant par une obstruction nasale avec épistaxis récidivantes massives.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez l'Adulte :</strong> Déviation septale, hypertrophie des cornets, polypose naso-sinusienne, cancers du nasopharynx (UCN).\n    </div>\n  </div>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés & Pièges Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/50 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 À RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5 leading-relaxed\">\n      <li>• Épistaxis + rhinorrhée fétide purulente unilatérale chez l'enfant = Corps étranger nasal méconnu jusqu'à preuve du contraire.</li>\n      <li>• Épistaxis à répétition chez un adolescent masculin = Évoquer impérativement le fibrome nasopharyngien (contre-indication absolue à la biopsie !).</li>\n      <li>• La tache vasculaire est située dans la partie antéro-inférieure du septum nasal.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_cancers_des_voies_aero_digestives_superieures_vads",
  "slug": "orl-cancers-des-voies-aero-digestives-superieures-vads",
  "title": "Fiche Flash : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épidémiologie & Facteurs de Risque</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Plus de 90% des cancers des VADS sont des <strong>carcinomes épidermoïdes</strong>. La synergie alcoolo-tabagique constitue le facteur de risque majeur pour la cavité buccale, l'oropharynx, le hypopharynx et le larynx.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200\">\n      <strong>HPV (Human Papillomavirus 16) :</strong> Responsable d'une incidence croissante des cancers de l'oropharynx (amygdales, base de langue) chez des sujets plus jeunes et non-fumeurs.\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>EBV (Virus d'Epstein-Barr) :</strong> Associé de façon constante aux Carcinomes Nasopharyngés (UCN / Undifferentiated Carcinoma of Nasopharyngeal Type) endémiques au Maghreb.\n    </div>\n  </div>\n</section>\n\n<section id=\"clinique\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Examen Clinique & Panendoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Devant toute <strong>adénopathie cervicale chronique de l'adulte (> 3 semaines)</strong>, dure, indolore et fixe, un cancer des VADS doit être recherché systématiquement par l'examen ORL complet et la nasofibroscopie.\n  </p>\n  <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 mb-4\">\n    <strong>Panendoscopie des VADS sous AG :</strong> Indispensable pour la biopsie de la lésion primitive, la recherche d'une seconde localisation synchrone (10 à 15% des cas) et le bilan d'extension.\n  </div>\n</section>\n\n<section id=\"ucn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Carcinome du Nasopharynx (UCN)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Le cancer du cavum (UCN) se caractérise par sa triade évocatrice : <strong>Otite séro-muqueuse unilatérale</strong> de l'adulte, adénopathie cervicale haute sous-digastrique et atteinte des nerfs crâniens (diplopie par atteinte du VI, névralgie du V).\n  </p>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5\">\n      <li>• Otite séro-muqueuse unilatérale chez l'adulte = Examen impératif du cavum (nasopharynx).</li>\n      <li>• L'UCN est très radiosensible et chimiosensible (traitement basé sur la radio-chimiothérapie).</li>\n      <li>• La panendoscopie des VADS est obligatoire avant toute décision thérapeutique.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_traumatismes_du_cou_et_de_la_face",
  "slug": "orl-traumatismes-du-cou-et-de-la-face",
  "title": "Fiche Flash : 3. Traumatismes de la Face et du Cou",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 3. Traumatismes de la Face et du Cou",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"opn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Fractures des Os Propres du Nez (OPN) & Hématome de Cloison</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La fracture des OPN est la plus fréquente des fractures de la face. L'examen otorhinolaryngologique précoce doit systématiquement rechercher une urgence chirurgicale : <strong>l'hématome de cloison nasal</strong>.\n  </p>\n  <div class=\"p-4 my-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n    <strong>⚠️ Urgence Médicale : Hématome de Cloison</strong><br>\n    Se manifeste par une obstruction nasale bilatérale avec tuméfaction violacée, lisse et fluctuante de la cloison nasale. <em>Risque évolutif :</em> Nécrose du cartilage septal avec ensellement nasal définitif et médiastinite. Drainage chirurgical en urgence sous couverture antibiotique.\n  </div>\n</section>\n\n<section id=\"lefort\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Fractures de Le Fort (Massif Facial Middle-Face)</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort I (Disjonction basilaire) :</strong> Trait horizontal au-dessus de l'arcade dentaire supérieure détachant l'arcade alvéolo-dentaire du reste du massif maxillaire.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort II (Disjonction pyramido-naso-maxillaire) :</strong> Trait pyramidal passant par la racine du nez, la paroi médiale de l'orbite et le rebord orbitaire inférieur.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort III (Disjonction cranio-faciale totale) :</strong> Trait haut séparant l'ensemble du massif facial de la base du crâne.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_tumefactions_cervicales",
  "slug": "orl-diagnostic-des-tumefactions-cervicales",
  "title": "Fiche Flash : 4. Diagnostic des Tuméfactions Cervicales",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 4. Diagnostic des Tuméfactions Cervicales",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"orientations\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Démarche Diagnostique devant une Masse Cervicale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'âge et la topographie (médiane ou latérale) constituent les deux facteurs majeurs d'orientation étiologique.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200\">\n      <strong>Chez l'Enfant / Sujet Jeune (< 30 ans) :</strong> Origine infectieuse (adénite, adénophlegmon) ou malformation congénitale (kyste du tractus thyréoglosse, kyste amygdaloïde).\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>Chez l'Adulte (> 40 ans) :</strong> Origine tumorale ganglionnaire secondaire (métastase d'un carcinome des VADS) jusqu'à preuve du contraire !\n    </div>\n  </div>\n</section>\n\n<section id=\"congenitales\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Tuméfactions Congénitales Médianes & Latérales</h2>\n  <div class=\"space-y-4\">\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste du Tractus Thyréoglosse (KTT)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction médiane, sous-hyoïdienne, <strong>mobile à la déglutition et à la protraction de la langue</strong> (trajet résiduel du tractus thyréoglosse).\n      </p>\n    </div>\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste Amygdaloïde (Fente Branchiale)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction latéro-cervicale haute, le long du bord antérieur du muscle sternocléidomastoïdien.\n      </p>\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_pathologies_de_l_oreille_externe",
  "slug": "orl-pathologies-de-l-oreille-externe",
  "title": "Fiche Flash : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "30 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"otite-externe\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Externe Aiguë Diffuse</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection dermo-épidermique du conduit auditif externe (CAE), favorisée par les baignades et le nettoyage micro-traumatique par coton-tige. Germe prédominant : <strong>Pseudomonas aeruginosa</strong> (Bacille Pyocyanique).\n  </p>\n  <div class=\"p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-navy-900/60 mb-4\">\n    <strong>Clinique :</strong> Otalgie violente, vivement exacerbée par la <em>pression sur le tragus</em> et la <em>traction du pavillon</em>. Tympan normal mais difficile à visualiser en raison de l'œdème sténosant du conduit.\n  </div>\n</section>\n\n<section id=\"oem\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Otite Externe Nécrosante Maligne (OEM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Osteomyélite du rocher d'origine pseudomonadique survenant chez le <strong>diabétique âgé ou l'immunodéprimé</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Signes d'Alerte et Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otalgie insomniante rebelle aux antalgiques avec otorrhée purulente et bourgeon de granulation au plancher du conduit.</li>\n      <li>• Complications neurologiques : Atteinte du nerf facial (VII) à la partie postérieure du conduit, puis des nerfs crâniens inférieurs (IX, X, XI au trou déchiré postérieur).</li>\n      <li>• Traitement : Antibiothérapie antipyocyanique prolongée IV (Ceftazidime + Ciprofloxacine) et équilibre du diabète.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otite_moyenne_aigue_oma",
  "slug": "orl-otite-moyenne-aigue-oma",
  "title": "Fiche Flash : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"germes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Étiopathogénie & Bactériologie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'OMA fait suite à une rhinopharyngite aiguë par dysfonctionnement de la trompe d'Eustache. Principaux germes : <strong>Haemophilus influenzae</strong> (syndrome otite-conjonctivite) et <strong>Streptococcus pneumoniae</strong> (Pneumocoque, le plus fébrile et algique).\n  </p>\n</section>\n\n<section id=\"stades\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Stades Otoscopiques</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200\">\n      <strong>1. OMA Congestive :</strong> Tympan rosé ou érythémateux avec conservation des reliefs osseux. Traitement antalgique/antipyrique sans antibiotique d'emblée.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>2. OMA Collectée :</strong> Tympan bombé, dépoli, comblant les reliefs osseux. Indication à l'antibiothérapie par Amoxicilline (ou Augmentin si otite-conjonctivite).\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>3. OMA Perforée :</strong> Otorrhée purulente pulsatile spontanée soulageant l'otalgie.\n    </div>\n  </div>\n</section>\n\n<section id=\"complications\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Complications : La Mastoïdite Aiguë</h2>\n  <div class=\"p-4 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <strong>Mastoïdite Aiguë de l'Enfant :</strong> Décollement du pavillon de l'oreille avec comblement et œdème rétro-auriculaire douloureux. Hospitalisation, scanner du rocher et paracentèse / antibiothérapie IV ± mastoïdatesctomie.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinosinusites_aigues_et_chroniques",
  "slug": "orl-rhinosinusites-aigues-et-chroniques",
  "title": "Fiche Flash : 7. Les Rhinosinusites Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 7. Les Rhinosinusites Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"maxillaire\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Sinusite Maxillaire Aiguë de l'Adulte</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection aiguë du sinus maxillaire. Critères diagnostiques d'une surinfection bactérienne (nécessitant Amoxicilline) : au moins 2 critères majeurs (douleur sous-orbitaire unilatérale throbbing, mouchage purulente, fièvre > 38.5°C).\n  </p>\n</section>\n\n<section id=\"ethmoidite\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Éthmoïdite Aiguë de l'Enfant (Urgence Vitale)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Éthmoïdite Aiguë du Nourrisson</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Seul sinus développé dès la naissance. Clinique : <strong>Œdème palpebral unilatéral douloureux</strong> à prédominance médiale avec fièvre élevée.<br>\n      <em>Stade collecté (Abcès sous-périosté orbitaire) :</em> Exophtalmie, mydriase, immobilité oculaire. Scanner orbito-encéphalique en urgence et drainage.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_corps_etrangers_en_orl",
  "slug": "orl-corps-etrangers-en-orl",
  "title": "Fiche Flash : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"penetration\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Le Syndrome de Pénétration (Élément Pathognomonique)</h2>\n  <div class=\"p-5 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30\">\n    <strong>Clinique Cardinal :</strong> Accès de suffocation brutal, tirage, cyanose, toux quinteuse expulsative expiratoire survenant lors du jeu ou d'un repas chez un enfant de 6 mois à 3 ans (cacahuète, petit objet). L'interrogatoire retrouve systématiquement cet épisode inaugural.\n  </div>\n</section>\n\n<section id=\"localisation\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Prise en Charge & Bronchoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Toute suspicion de corps étranger des voies aériennes impose la réalisation d'une <strong>endoscopie au tube rigide sous AG</strong> pour extraction au tube optique.\n  </p>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otites_moyennes_chroniques_et_cholesteatome",
  "slug": "orl-otites-moyennes-chroniques-et-cholesteatome",
  "title": "Fiche Flash : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"osm\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Séro-Muqueuse (OSM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Épanchement rétro-tympanique chronique (> 3 mois) à tympan fermé sans signe d'inflammation aiguë. Première cause de surdité de transmission chez l'enfant.\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20 mb-4\">\n    <strong>Otoscopie :</strong> Tympan dépoli, rétracté, ambré/jaunâtre avec bulles ou niveau liquide. <em>Traitement :</em> Aérateurs transtympaniques (yoyos) ± adénoïdectomie.\n  </div>\n</section>\n\n<section id=\"cholesteatome\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Cholestéatome (OMC Dangereuse)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Présence d'épithélium pavimenteux stratifié kératinisé dans les cavités de l'oreille moyenne. Caractérisé par son pouvoir <strong>ostéolytique destructeur</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🔍 Otoscopie & Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otoscopie : Perforation atticale ou marginale comblée par des squames blanchâtres fétides.</li>\n      <li>• Complications : Fistule labyrinthique (vertige déclenché par la pression du conduit = Signe de la fistule), paralysie faciale périphérique (VII), méningite et abcès du cerveau.</li>\n      <li>• Traitement : Toujours chirurgical (tympanoplastie d'éradication).</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_surdites",
  "slug": "orl-diagnostic-des-surdites",
  "title": "Fiche Flash : 10. Diagnostic des Surdités (Transmission vs Perception)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 10. Diagnostic des Surdités (Transmission vs Perception)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"diapason\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épreuves au Diapason (Weber & Rinne)</h2>\n  <div class=\"overflow-x-auto mb-6\">\n    <table class=\"w-full text-left border-collapse border border-slate-200 dark:border-navy-700 rounded-xl overflow-hidden text-xs\">\n      <thead class=\"bg-slate-100 dark:bg-navy-800 font-bold uppercase text-navy-700 dark:text-navy-200\">\n        <tr>\n          <th class=\"p-3 border\">Type de Surdité</th>\n          <th class=\"p-3 border text-center\">Test de Weber (Vortex)</th>\n          <th class=\"p-3 border text-center\">Test de Rinne (CO vs CA)</th>\n        </tr>\n      </thead>\n      <tbody class=\"divide-y divide-slate-100 dark:divide-navy-800\">\n        <tr>\n          <td class=\"p-3 font-bold text-brand-600\">Surdité de Transmission</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté malade</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Négatif</strong> (CO > CA)</td>\n        </tr>\n        <tr>\n          <td class=\"p-3 font-bold text-purple-600\">Surdité de Perception</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté sain</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Positif</strong> (CA > CO mais abaissés)</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</section>\n\n<section id=\"audiometrie\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Audiométrie & Impédancemétrie</h2>\n  <ul class=\"space-y-3 text-sm text-navy-700 dark:text-navy-300\">\n    <li>• <strong>Surdité de Transmission :</strong> Conduction osseuse (CO) normale, courbe de conduction aérienne (CA) abaissée (existence d'un Rink / rinne audiométrique). Tympanogramme plat (épanchement OSM) ou réflexe stapedien absent (otospongiose).</li>\n    <li>• <strong>Surdité de Perception :</strong> Courbes CO et CA superposées et abaissées. Otospongiose (surdité de transmission à tympan normal avec coche de Carhart à 2000 Hz). Neurinome de l'acoustique (surdité de perception rétro-cochléaire unilatérale progressive).</li>\n  </ul>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_vertiges",
  "slug": "orl-diagnostic-des-vertiges",
  "title": "Fiche Flash : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"syndromes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Syndrome Vestibulaire Périphérique vs Central</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20\">\n      <h3 class=\"font-bold text-teal-900 mb-2\">Syndrome Périphérique (Harmonieux)</h3>\n      • Vertige rotatoire intense avec signes neuro-végétatifs (vomissements).<br>\n      • <strong>Nystagmus horizontal ou horizono-rotatoire</strong> battant du côté opposé à la lésion (phase rapide vers le côté sain).<br>\n      • Déviations toniques (Romberg, Fukuda) du <em>côté lésé</em>.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n      <h3 class=\"font-bold text-rose-950 mb-2\">Syndrome Central (Dysharmonieux)</h3>\n      • Vertige souvent flou ou sensation d'instabilité.<br>\n      • Nystagmus pur (vertical, rotatoire pur ou multidirectionnel).<br>\n      • Déviations toniques non concordantes (évoquer un AVC du tronc cérébral / cérébelleux).\n    </div>\n  </div>\n</section>\n\n<section id=\"vppb\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Vertige Positionnel Paroxystique Bénin (VPPB)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Dû à une lithiase des canaux semi-circulaires (canal postérieur +++). Vertige très bref (< 1 minute), violent, déclenché par les changements de position de la tête.\n  </p>\n  <div class=\"p-4 rounded-xl bg-indigo-50 border border-indigo-200 mb-4\">\n    <strong>Diagnostic :</strong> Manœuvre de Dix-Hallpike (déclenche le vertige et le nystagmus épuisable avec latence). <em>Traitement :</em> Manœuvre libératoire de Semont ou Epley.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_dyspnees_laryngees_aigues_et_chroniques",
  "slug": "orl-dyspnees-laryngees-aigues-et-chroniques",
  "title": "Fiche Flash : 12. Dyspnées Laryngées Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 12. Dyspnées Laryngées Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"triade\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Triade Clinique de la Dyspnée Laryngée</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Triade Pathognomonique</h3>\n    <ol class=\"list-decimal pl-5 text-sm text-rose-900 dark:text-rose-200 space-y-1\">\n      <li><strong>Bradypnée Inspiratoire :</strong> Ralentissement de la fréquence respiratoire avec allongement de l'inspiration.</li>\n      <li><strong>Tirage Inspiratoire :</strong> Dépression des parties meubles (sus-sternale, sus-claviculaire et intercostale).</li>\n      <li><strong>Bruit Inspiratoire :</strong> Stridor (aigu, laryngé haut) ou Cornage (grave, sous-glottique).</li>\n    </ol>\n  </div>\n</section>\n\n<section id=\"etiologies\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Laryngites Aiguës Pédiatriques</h2>\n  <div class=\"space-y-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Laryngite Aiguë Sous-Glottique (Virale) :</strong> La plus fréquente (6 mois - 3 ans). Toux rauque, voix modifiée, bradypnée inspiratoire nocturne. Traitement : Corticothérapie orale (Dexaméthasone ou Solupred) ± nébulisation d'Adrénaline.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-100 border border-rose-300\">\n      <strong>Épiglottite Aiguë (Haemophilus influenzae b) :</strong> Urgence extrême ! Dysphagie majeure avec bavage d'interdiction, position assise penchée en avant obligatoire, voix étouffée (\"patate chaude\"). <em>Contre-indication absolue à l'abaisse-langue !</em> Intubation en milieu chirurgical.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinopharyngites_et_angines",
  "slug": "orl-rhinopharyngites-et-angines",
  "title": "Fiche Flash : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"tdr\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Classification des Angines & Test TDR</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Les angines sont érythémateuses (rouges) ou érythémato-pultacées (blanches) dans 80% des cas. La majorité est d'origine virale. Seul le <strong>Streptocoque Bêta-Hémolytique du Groupe A (SGA)</strong> justifie une antibiothérapie (Amoxicilline 6 jours) pour prévenir le Rhumatisme Articulaire Aigu (RAA).\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 mb-4\">\n    <strong>Test Rapide d'Orientation Diagnostique (TDR) :</strong> Réalisé au cabinet par frottis amygdalien. Si positif = Antibiothérapie Amoxicilline. Si négatif = Traitement symptomatique uniquement.\n  </div>\n</section>\n\n<section id=\"formes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Angines Particulières</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-purple-50 border border-purple-200\">\n      <strong>Angines Vésiculeuses (Virales) :</strong> Herpangine (Virus Coxsackie A) avec petites vésicules pharyngées, syndrome pied-main-bouche.\n    </div>\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Angine de Vincent (Ulcéro-nécrotique unilatérale) :</strong> Association fuso-spirillaire chez un sujet à mauvaise hygiène bucco-dentaire. Haleine fétide.\n    </div>\n  </div>\n</section>\n\n<section id=\"phlegmon\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Phlegmon Péri-Amygdalien (Complication Suppurée)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Clinique & Ponction</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Suppuration entre la capsule amygdalienne et le muscle constricteur du pharynx.<br>\n      • Triade : <strong>Trismus serré</strong>, otalgie réflexe, odynophagie majeure unilatérale avec voix étouffée.<br>\n      • Examen : Amygdale refoulée vers le bas et le dedans, pilier antérieur bombé, luette œdématiée déviée du côté opposé.<br>\n      • Traitement : Ponction évacuatrice au point de bombement maximum (ou incision) + Augmentin IV.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
}
,
{
  "id": "fiche_orl_obstruction_nasale_et_epistaxis",
  "slug": "orl-obstruction-nasale-et-epistaxis",
  "title": "Fiche Flash : 1. Obstruction Nasale & Épistaxis Grave",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 1. Obstruction Nasale & Épistaxis Grave",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Rappels Anatomiques & Vascularisation Nasale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La muqueuse nasale présente une vascularisation extrêmement riche issue du système <strong>Carotide Externe</strong> (artère sphénopalatine) et du système <strong>Carotide Interne</strong> (artères éthmoïdales antérieure et postérieure).\n  </p>\n  <div class=\"p-4 my-4 rounded-2xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20\">\n    <div class=\"flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold mb-1\">\n      🩸 Zone Cardinale : La Tache Vasculaire de Kiesselbach\n    </div>\n    <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n      Située à la partie antéro-inférieure du septum nasal, la <strong>tache vasculaire (plexus de Kiesselbach)</strong> est le siège de plus de 90% des épistaxis bénignes de l'enfant et du sujet jeune.\n    </p>\n  </div>\n</section>\n\n<section id=\"epistaxis\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Conduite à Tenir d'Urgence devant une Épistaxis Grave</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'épistaxis est une urgence médico-chirurgicale fréquente. L'appréciation du retentissement hémodynamique (pouls, tension artérielle, choc) prime sur l'examen otorhinolaryngologique.\n  </p>\n\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6\">\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 dark:text-brand-400 mb-2\">1. Tamponnement Antérieur</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Mèche grasse ou éponge résorbable (Merocel) introduite d'avant en arrière parallèlement au plancher des fosses nasales pendant 48 heures.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-amber-600 dark:text-amber-400 mb-2\">2. Tamponnement Postérieur / Ballonnets</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Indiqué si l'épistaxis persiste malgré le tamponnement antérieur. Réalisé sous couverture antibiotique.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-rose-600 dark:text-rose-400 mb-2\">3. Embolisation & Ligature</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">En cas d'échec : embolisation de l'artère maxillaire interne sous angiographie ou ligature sous endoscopie de l'artère sphénopalatine.</p>\n    </div>\n  </div>\n</section>\n\n<section id=\"obstruction\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Étiologies de l'Obstruction Nasale</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Nourrisson :</strong> Atrésie choanale (urgence vitale si bilatérale), corps étranger nasal méconnu (rhinorrhée unilatérale fétide).\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Jeune Homme :</strong> <em>Angiofibrome nasopharyngien juvénile</em> (fibrome nasopharyngien) se révélant par une obstruction nasale avec épistaxis récidivantes massives.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez l'Adulte :</strong> Déviation septale, hypertrophie des cornets, polypose naso-sinusienne, cancers du nasopharynx (UCN).\n    </div>\n  </div>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés & Pièges Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/50 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 À RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5 leading-relaxed\">\n      <li>• Épistaxis + rhinorrhée fétide purulente unilatérale chez l'enfant = Corps étranger nasal méconnu jusqu'à preuve du contraire.</li>\n      <li>• Épistaxis à répétition chez un adolescent masculin = Évoquer impérativement le fibrome nasopharyngien (contre-indication absolue à la biopsie !).</li>\n      <li>• La tache vasculaire est située dans la partie antéro-inférieure du septum nasal.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_cancers_des_voies_aero_digestives_superieures_vads",
  "slug": "orl-cancers-des-voies-aero-digestives-superieures-vads",
  "title": "Fiche Flash : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épidémiologie & Facteurs de Risque</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Plus de 90% des cancers des VADS sont des <strong>carcinomes épidermoïdes</strong>. La synergie alcoolo-tabagique constitue le facteur de risque majeur pour la cavité buccale, l'oropharynx, le hypopharynx et le larynx.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200\">\n      <strong>HPV (Human Papillomavirus 16) :</strong> Responsable d'une incidence croissante des cancers de l'oropharynx (amygdales, base de langue) chez des sujets plus jeunes et non-fumeurs.\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>EBV (Virus d'Epstein-Barr) :</strong> Associé de façon constante aux Carcinomes Nasopharyngés (UCN / Undifferentiated Carcinoma of Nasopharyngeal Type) endémiques au Maghreb.\n    </div>\n  </div>\n</section>\n\n<section id=\"clinique\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Examen Clinique & Panendoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Devant toute <strong>adénopathie cervicale chronique de l'adulte (> 3 semaines)</strong>, dure, indolore et fixe, un cancer des VADS doit être recherché systématiquement par l'examen ORL complet et la nasofibroscopie.\n  </p>\n  <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 mb-4\">\n    <strong>Panendoscopie des VADS sous AG :</strong> Indispensable pour la biopsie de la lésion primitive, la recherche d'une seconde localisation synchrone (10 à 15% des cas) et le bilan d'extension.\n  </div>\n</section>\n\n<section id=\"ucn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Carcinome du Nasopharynx (UCN)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Le cancer du cavum (UCN) se caractérise par sa triade évocatrice : <strong>Otite séro-muqueuse unilatérale</strong> de l'adulte, adénopathie cervicale haute sous-digastrique et atteinte des nerfs crâniens (diplopie par atteinte du VI, névralgie du V).\n  </p>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5\">\n      <li>• Otite séro-muqueuse unilatérale chez l'adulte = Examen impératif du cavum (nasopharynx).</li>\n      <li>• L'UCN est très radiosensible et chimiosensible (traitement basé sur la radio-chimiothérapie).</li>\n      <li>• La panendoscopie des VADS est obligatoire avant toute décision thérapeutique.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_traumatismes_du_cou_et_de_la_face",
  "slug": "orl-traumatismes-du-cou-et-de-la-face",
  "title": "Fiche Flash : 3. Traumatismes de la Face et du Cou",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 3. Traumatismes de la Face et du Cou",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"opn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Fractures des Os Propres du Nez (OPN) & Hématome de Cloison</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La fracture des OPN est la plus fréquente des fractures de la face. L'examen otorhinolaryngologique précoce doit systématiquement rechercher une urgence chirurgicale : <strong>l'hématome de cloison nasal</strong>.\n  </p>\n  <div class=\"p-4 my-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n    <strong>⚠️ Urgence Médicale : Hématome de Cloison</strong><br>\n    Se manifeste par une obstruction nasale bilatérale avec tuméfaction violacée, lisse et fluctuante de la cloison nasale. <em>Risque évolutif :</em> Nécrose du cartilage septal avec ensellement nasal définitif et médiastinite. Drainage chirurgical en urgence sous couverture antibiotique.\n  </div>\n</section>\n\n<section id=\"lefort\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Fractures de Le Fort (Massif Facial Middle-Face)</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort I (Disjonction basilaire) :</strong> Trait horizontal au-dessus de l'arcade dentaire supérieure détachant l'arcade alvéolo-dentaire du reste du massif maxillaire.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort II (Disjonction pyramido-naso-maxillaire) :</strong> Trait pyramidal passant par la racine du nez, la paroi médiale de l'orbite et le rebord orbitaire inférieur.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort III (Disjonction cranio-faciale totale) :</strong> Trait haut séparant l'ensemble du massif facial de la base du crâne.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_tumefactions_cervicales",
  "slug": "orl-diagnostic-des-tumefactions-cervicales",
  "title": "Fiche Flash : 4. Diagnostic des Tuméfactions Cervicales",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 4. Diagnostic des Tuméfactions Cervicales",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"orientations\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Démarche Diagnostique devant une Masse Cervicale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'âge et la topographie (médiane ou latérale) constituent les deux facteurs majeurs d'orientation étiologique.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200\">\n      <strong>Chez l'Enfant / Sujet Jeune (< 30 ans) :</strong> Origine infectieuse (adénite, adénophlegmon) ou malformation congénitale (kyste du tractus thyréoglosse, kyste amygdaloïde).\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>Chez l'Adulte (> 40 ans) :</strong> Origine tumorale ganglionnaire secondaire (métastase d'un carcinome des VADS) jusqu'à preuve du contraire !\n    </div>\n  </div>\n</section>\n\n<section id=\"congenitales\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Tuméfactions Congénitales Médianes & Latérales</h2>\n  <div class=\"space-y-4\">\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste du Tractus Thyréoglosse (KTT)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction médiane, sous-hyoïdienne, <strong>mobile à la déglutition et à la protraction de la langue</strong> (trajet résiduel du tractus thyréoglosse).\n      </p>\n    </div>\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste Amygdaloïde (Fente Branchiale)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction latéro-cervicale haute, le long du bord antérieur du muscle sternocléidomastoïdien.\n      </p>\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_pathologies_de_l_oreille_externe",
  "slug": "orl-pathologies-de-l-oreille-externe",
  "title": "Fiche Flash : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "30 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"otite-externe\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Externe Aiguë Diffuse</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection dermo-épidermique du conduit auditif externe (CAE), favorisée par les baignades et le nettoyage micro-traumatique par coton-tige. Germe prédominant : <strong>Pseudomonas aeruginosa</strong> (Bacille Pyocyanique).\n  </p>\n  <div class=\"p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-navy-900/60 mb-4\">\n    <strong>Clinique :</strong> Otalgie violente, vivement exacerbée par la <em>pression sur le tragus</em> et la <em>traction du pavillon</em>. Tympan normal mais difficile à visualiser en raison de l'œdème sténosant du conduit.\n  </div>\n</section>\n\n<section id=\"oem\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Otite Externe Nécrosante Maligne (OEM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Osteomyélite du rocher d'origine pseudomonadique survenant chez le <strong>diabétique âgé ou l'immunodéprimé</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Signes d'Alerte et Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otalgie insomniante rebelle aux antalgiques avec otorrhée purulente et bourgeon de granulation au plancher du conduit.</li>\n      <li>• Complications neurologiques : Atteinte du nerf facial (VII) à la partie postérieure du conduit, puis des nerfs crâniens inférieurs (IX, X, XI au trou déchiré postérieur).</li>\n      <li>• Traitement : Antibiothérapie antipyocyanique prolongée IV (Ceftazidime + Ciprofloxacine) et équilibre du diabète.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otite_moyenne_aigue_oma",
  "slug": "orl-otite-moyenne-aigue-oma",
  "title": "Fiche Flash : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"germes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Étiopathogénie & Bactériologie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'OMA fait suite à une rhinopharyngite aiguë par dysfonctionnement de la trompe d'Eustache. Principaux germes : <strong>Haemophilus influenzae</strong> (syndrome otite-conjonctivite) et <strong>Streptococcus pneumoniae</strong> (Pneumocoque, le plus fébrile et algique).\n  </p>\n</section>\n\n<section id=\"stades\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Stades Otoscopiques</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200\">\n      <strong>1. OMA Congestive :</strong> Tympan rosé ou érythémateux avec conservation des reliefs osseux. Traitement antalgique/antipyrique sans antibiotique d'emblée.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>2. OMA Collectée :</strong> Tympan bombé, dépoli, comblant les reliefs osseux. Indication à l'antibiothérapie par Amoxicilline (ou Augmentin si otite-conjonctivite).\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>3. OMA Perforée :</strong> Otorrhée purulente pulsatile spontanée soulageant l'otalgie.\n    </div>\n  </div>\n</section>\n\n<section id=\"complications\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Complications : La Mastoïdite Aiguë</h2>\n  <div class=\"p-4 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <strong>Mastoïdite Aiguë de l'Enfant :</strong> Décollement du pavillon de l'oreille avec comblement et œdème rétro-auriculaire douloureux. Hospitalisation, scanner du rocher et paracentèse / antibiothérapie IV ± mastoïdatesctomie.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinosinusites_aigues_et_chroniques",
  "slug": "orl-rhinosinusites-aigues-et-chroniques",
  "title": "Fiche Flash : 7. Les Rhinosinusites Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 7. Les Rhinosinusites Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"maxillaire\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Sinusite Maxillaire Aiguë de l'Adulte</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection aiguë du sinus maxillaire. Critères diagnostiques d'une surinfection bactérienne (nécessitant Amoxicilline) : au moins 2 critères majeurs (douleur sous-orbitaire unilatérale throbbing, mouchage purulente, fièvre > 38.5°C).\n  </p>\n</section>\n\n<section id=\"ethmoidite\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Éthmoïdite Aiguë de l'Enfant (Urgence Vitale)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Éthmoïdite Aiguë du Nourrisson</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Seul sinus développé dès la naissance. Clinique : <strong>Œdème palpebral unilatéral douloureux</strong> à prédominance médiale avec fièvre élevée.<br>\n      <em>Stade collecté (Abcès sous-périosté orbitaire) :</em> Exophtalmie, mydriase, immobilité oculaire. Scanner orbito-encéphalique en urgence et drainage.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_corps_etrangers_en_orl",
  "slug": "orl-corps-etrangers-en-orl",
  "title": "Fiche Flash : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"penetration\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Le Syndrome de Pénétration (Élément Pathognomonique)</h2>\n  <div class=\"p-5 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30\">\n    <strong>Clinique Cardinal :</strong> Accès de suffocation brutal, tirage, cyanose, toux quinteuse expulsative expiratoire survenant lors du jeu ou d'un repas chez un enfant de 6 mois à 3 ans (cacahuète, petit objet). L'interrogatoire retrouve systématiquement cet épisode inaugural.\n  </div>\n</section>\n\n<section id=\"localisation\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Prise en Charge & Bronchoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Toute suspicion de corps étranger des voies aériennes impose la réalisation d'une <strong>endoscopie au tube rigide sous AG</strong> pour extraction au tube optique.\n  </p>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otites_moyennes_chroniques_et_cholesteatome",
  "slug": "orl-otites-moyennes-chroniques-et-cholesteatome",
  "title": "Fiche Flash : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"osm\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Séro-Muqueuse (OSM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Épanchement rétro-tympanique chronique (> 3 mois) à tympan fermé sans signe d'inflammation aiguë. Première cause de surdité de transmission chez l'enfant.\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20 mb-4\">\n    <strong>Otoscopie :</strong> Tympan dépoli, rétracté, ambré/jaunâtre avec bulles ou niveau liquide. <em>Traitement :</em> Aérateurs transtympaniques (yoyos) ± adénoïdectomie.\n  </div>\n</section>\n\n<section id=\"cholesteatome\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Cholestéatome (OMC Dangereuse)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Présence d'épithélium pavimenteux stratifié kératinisé dans les cavités de l'oreille moyenne. Caractérisé par son pouvoir <strong>ostéolytique destructeur</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🔍 Otoscopie & Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otoscopie : Perforation atticale ou marginale comblée par des squames blanchâtres fétides.</li>\n      <li>• Complications : Fistule labyrinthique (vertige déclenché par la pression du conduit = Signe de la fistule), paralysie faciale périphérique (VII), méningite et abcès du cerveau.</li>\n      <li>• Traitement : Toujours chirurgical (tympanoplastie d'éradication).</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_surdites",
  "slug": "orl-diagnostic-des-surdites",
  "title": "Fiche Flash : 10. Diagnostic des Surdités (Transmission vs Perception)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 10. Diagnostic des Surdités (Transmission vs Perception)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"diapason\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épreuves au Diapason (Weber & Rinne)</h2>\n  <div class=\"overflow-x-auto mb-6\">\n    <table class=\"w-full text-left border-collapse border border-slate-200 dark:border-navy-700 rounded-xl overflow-hidden text-xs\">\n      <thead class=\"bg-slate-100 dark:bg-navy-800 font-bold uppercase text-navy-700 dark:text-navy-200\">\n        <tr>\n          <th class=\"p-3 border\">Type de Surdité</th>\n          <th class=\"p-3 border text-center\">Test de Weber (Vortex)</th>\n          <th class=\"p-3 border text-center\">Test de Rinne (CO vs CA)</th>\n        </tr>\n      </thead>\n      <tbody class=\"divide-y divide-slate-100 dark:divide-navy-800\">\n        <tr>\n          <td class=\"p-3 font-bold text-brand-600\">Surdité de Transmission</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté malade</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Négatif</strong> (CO > CA)</td>\n        </tr>\n        <tr>\n          <td class=\"p-3 font-bold text-purple-600\">Surdité de Perception</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté sain</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Positif</strong> (CA > CO mais abaissés)</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</section>\n\n<section id=\"audiometrie\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Audiométrie & Impédancemétrie</h2>\n  <ul class=\"space-y-3 text-sm text-navy-700 dark:text-navy-300\">\n    <li>• <strong>Surdité de Transmission :</strong> Conduction osseuse (CO) normale, courbe de conduction aérienne (CA) abaissée (existence d'un Rink / rinne audiométrique). Tympanogramme plat (épanchement OSM) ou réflexe stapedien absent (otospongiose).</li>\n    <li>• <strong>Surdité de Perception :</strong> Courbes CO et CA superposées et abaissées. Otospongiose (surdité de transmission à tympan normal avec coche de Carhart à 2000 Hz). Neurinome de l'acoustique (surdité de perception rétro-cochléaire unilatérale progressive).</li>\n  </ul>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_vertiges",
  "slug": "orl-diagnostic-des-vertiges",
  "title": "Fiche Flash : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"syndromes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Syndrome Vestibulaire Périphérique vs Central</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20\">\n      <h3 class=\"font-bold text-teal-900 mb-2\">Syndrome Périphérique (Harmonieux)</h3>\n      • Vertige rotatoire intense avec signes neuro-végétatifs (vomissements).<br>\n      • <strong>Nystagmus horizontal ou horizono-rotatoire</strong> battant du côté opposé à la lésion (phase rapide vers le côté sain).<br>\n      • Déviations toniques (Romberg, Fukuda) du <em>côté lésé</em>.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n      <h3 class=\"font-bold text-rose-950 mb-2\">Syndrome Central (Dysharmonieux)</h3>\n      • Vertige souvent flou ou sensation d'instabilité.<br>\n      • Nystagmus pur (vertical, rotatoire pur ou multidirectionnel).<br>\n      • Déviations toniques non concordantes (évoquer un AVC du tronc cérébral / cérébelleux).\n    </div>\n  </div>\n</section>\n\n<section id=\"vppb\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Vertige Positionnel Paroxystique Bénin (VPPB)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Dû à une lithiase des canaux semi-circulaires (canal postérieur +++). Vertige très bref (< 1 minute), violent, déclenché par les changements de position de la tête.\n  </p>\n  <div class=\"p-4 rounded-xl bg-indigo-50 border border-indigo-200 mb-4\">\n    <strong>Diagnostic :</strong> Manœuvre de Dix-Hallpike (déclenche le vertige et le nystagmus épuisable avec latence). <em>Traitement :</em> Manœuvre libératoire de Semont ou Epley.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_dyspnees_laryngees_aigues_et_chroniques",
  "slug": "orl-dyspnees-laryngees-aigues-et-chroniques",
  "title": "Fiche Flash : 12. Dyspnées Laryngées Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 12. Dyspnées Laryngées Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"triade\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Triade Clinique de la Dyspnée Laryngée</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Triade Pathognomonique</h3>\n    <ol class=\"list-decimal pl-5 text-sm text-rose-900 dark:text-rose-200 space-y-1\">\n      <li><strong>Bradypnée Inspiratoire :</strong> Ralentissement de la fréquence respiratoire avec allongement de l'inspiration.</li>\n      <li><strong>Tirage Inspiratoire :</strong> Dépression des parties meubles (sus-sternale, sus-claviculaire et intercostale).</li>\n      <li><strong>Bruit Inspiratoire :</strong> Stridor (aigu, laryngé haut) ou Cornage (grave, sous-glottique).</li>\n    </ol>\n  </div>\n</section>\n\n<section id=\"etiologies\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Laryngites Aiguës Pédiatriques</h2>\n  <div class=\"space-y-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Laryngite Aiguë Sous-Glottique (Virale) :</strong> La plus fréquente (6 mois - 3 ans). Toux rauque, voix modifiée, bradypnée inspiratoire nocturne. Traitement : Corticothérapie orale (Dexaméthasone ou Solupred) ± nébulisation d'Adrénaline.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-100 border border-rose-300\">\n      <strong>Épiglottite Aiguë (Haemophilus influenzae b) :</strong> Urgence extrême ! Dysphagie majeure avec bavage d'interdiction, position assise penchée en avant obligatoire, voix étouffée (\"patate chaude\"). <em>Contre-indication absolue à l'abaisse-langue !</em> Intubation en milieu chirurgical.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinopharyngites_et_angines",
  "slug": "orl-rhinopharyngites-et-angines",
  "title": "Fiche Flash : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"tdr\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Classification des Angines & Test TDR</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Les angines sont érythémateuses (rouges) ou érythémato-pultacées (blanches) dans 80% des cas. La majorité est d'origine virale. Seul le <strong>Streptocoque Bêta-Hémolytique du Groupe A (SGA)</strong> justifie une antibiothérapie (Amoxicilline 6 jours) pour prévenir le Rhumatisme Articulaire Aigu (RAA).\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 mb-4\">\n    <strong>Test Rapide d'Orientation Diagnostique (TDR) :</strong> Réalisé au cabinet par frottis amygdalien. Si positif = Antibiothérapie Amoxicilline. Si négatif = Traitement symptomatique uniquement.\n  </div>\n</section>\n\n<section id=\"formes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Angines Particulières</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-purple-50 border border-purple-200\">\n      <strong>Angines Vésiculeuses (Virales) :</strong> Herpangine (Virus Coxsackie A) avec petites vésicules pharyngées, syndrome pied-main-bouche.\n    </div>\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Angine de Vincent (Ulcéro-nécrotique unilatérale) :</strong> Association fuso-spirillaire chez un sujet à mauvaise hygiène bucco-dentaire. Haleine fétide.\n    </div>\n  </div>\n</section>\n\n<section id=\"phlegmon\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Phlegmon Péri-Amygdalien (Complication Suppurée)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Clinique & Ponction</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Suppuration entre la capsule amygdalienne et le muscle constricteur du pharynx.<br>\n      • Triade : <strong>Trismus serré</strong>, otalgie réflexe, odynophagie majeure unilatérale avec voix étouffée.<br>\n      • Examen : Amygdale refoulée vers le bas et le dedans, pilier antérieur bombé, luette œdématiée déviée du côté opposé.<br>\n      • Traitement : Ponction évacuatrice au point de bombement maximum (ou incision) + Augmentin IV.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
}
,
{
  "id": "fiche_orl_obstruction_nasale_et_epistaxis",
  "slug": "orl-obstruction-nasale-et-epistaxis",
  "title": "Fiche Flash : 1. Obstruction Nasale & Épistaxis Grave",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 1. Obstruction Nasale & Épistaxis Grave",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Rappels Anatomiques & Vascularisation Nasale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La muqueuse nasale présente une vascularisation extrêmement riche issue du système <strong>Carotide Externe</strong> (artère sphénopalatine) et du système <strong>Carotide Interne</strong> (artères éthmoïdales antérieure et postérieure).\n  </p>\n  <div class=\"p-4 my-4 rounded-2xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20\">\n    <div class=\"flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold mb-1\">\n      🩸 Zone Cardinale : La Tache Vasculaire de Kiesselbach\n    </div>\n    <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n      Située à la partie antéro-inférieure du septum nasal, la <strong>tache vasculaire (plexus de Kiesselbach)</strong> est le siège de plus de 90% des épistaxis bénignes de l'enfant et du sujet jeune.\n    </p>\n  </div>\n</section>\n\n<section id=\"epistaxis\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Conduite à Tenir d'Urgence devant une Épistaxis Grave</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'épistaxis est une urgence médico-chirurgicale fréquente. L'appréciation du retentissement hémodynamique (pouls, tension artérielle, choc) prime sur l'examen otorhinolaryngologique.\n  </p>\n\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6\">\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 dark:text-brand-400 mb-2\">1. Tamponnement Antérieur</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Mèche grasse ou éponge résorbable (Merocel) introduite d'avant en arrière parallèlement au plancher des fosses nasales pendant 48 heures.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-amber-600 dark:text-amber-400 mb-2\">2. Tamponnement Postérieur / Ballonnets</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Indiqué si l'épistaxis persiste malgré le tamponnement antérieur. Réalisé sous couverture antibiotique.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-rose-600 dark:text-rose-400 mb-2\">3. Embolisation & Ligature</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">En cas d'échec : embolisation de l'artère maxillaire interne sous angiographie ou ligature sous endoscopie de l'artère sphénopalatine.</p>\n    </div>\n  </div>\n</section>\n\n<section id=\"obstruction\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Étiologies de l'Obstruction Nasale</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Nourrisson :</strong> Atrésie choanale (urgence vitale si bilatérale), corps étranger nasal méconnu (rhinorrhée unilatérale fétide).\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Jeune Homme :</strong> <em>Angiofibrome nasopharyngien juvénile</em> (fibrome nasopharyngien) se révélant par une obstruction nasale avec épistaxis récidivantes massives.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez l'Adulte :</strong> Déviation septale, hypertrophie des cornets, polypose naso-sinusienne, cancers du nasopharynx (UCN).\n    </div>\n  </div>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés & Pièges Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/50 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 À RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5 leading-relaxed\">\n      <li>• Épistaxis + rhinorrhée fétide purulente unilatérale chez l'enfant = Corps étranger nasal méconnu jusqu'à preuve du contraire.</li>\n      <li>• Épistaxis à répétition chez un adolescent masculin = Évoquer impérativement le fibrome nasopharyngien (contre-indication absolue à la biopsie !).</li>\n      <li>• La tache vasculaire est située dans la partie antéro-inférieure du septum nasal.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_cancers_des_voies_aero_digestives_superieures_vads",
  "slug": "orl-cancers-des-voies-aero-digestives-superieures-vads",
  "title": "Fiche Flash : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épidémiologie & Facteurs de Risque</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Plus de 90% des cancers des VADS sont des <strong>carcinomes épidermoïdes</strong>. La synergie alcoolo-tabagique constitue le facteur de risque majeur pour la cavité buccale, l'oropharynx, le hypopharynx et le larynx.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200\">\n      <strong>HPV (Human Papillomavirus 16) :</strong> Responsable d'une incidence croissante des cancers de l'oropharynx (amygdales, base de langue) chez des sujets plus jeunes et non-fumeurs.\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>EBV (Virus d'Epstein-Barr) :</strong> Associé de façon constante aux Carcinomes Nasopharyngés (UCN / Undifferentiated Carcinoma of Nasopharyngeal Type) endémiques au Maghreb.\n    </div>\n  </div>\n</section>\n\n<section id=\"clinique\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Examen Clinique & Panendoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Devant toute <strong>adénopathie cervicale chronique de l'adulte (> 3 semaines)</strong>, dure, indolore et fixe, un cancer des VADS doit être recherché systématiquement par l'examen ORL complet et la nasofibroscopie.\n  </p>\n  <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 mb-4\">\n    <strong>Panendoscopie des VADS sous AG :</strong> Indispensable pour la biopsie de la lésion primitive, la recherche d'une seconde localisation synchrone (10 à 15% des cas) et le bilan d'extension.\n  </div>\n</section>\n\n<section id=\"ucn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Carcinome du Nasopharynx (UCN)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Le cancer du cavum (UCN) se caractérise par sa triade évocatrice : <strong>Otite séro-muqueuse unilatérale</strong> de l'adulte, adénopathie cervicale haute sous-digastrique et atteinte des nerfs crâniens (diplopie par atteinte du VI, névralgie du V).\n  </p>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5\">\n      <li>• Otite séro-muqueuse unilatérale chez l'adulte = Examen impératif du cavum (nasopharynx).</li>\n      <li>• L'UCN est très radiosensible et chimiosensible (traitement basé sur la radio-chimiothérapie).</li>\n      <li>• La panendoscopie des VADS est obligatoire avant toute décision thérapeutique.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_traumatismes_du_cou_et_de_la_face",
  "slug": "orl-traumatismes-du-cou-et-de-la-face",
  "title": "Fiche Flash : 3. Traumatismes de la Face et du Cou",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 3. Traumatismes de la Face et du Cou",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"opn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Fractures des Os Propres du Nez (OPN) & Hématome de Cloison</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La fracture des OPN est la plus fréquente des fractures de la face. L'examen otorhinolaryngologique précoce doit systématiquement rechercher une urgence chirurgicale : <strong>l'hématome de cloison nasal</strong>.\n  </p>\n  <div class=\"p-4 my-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n    <strong>⚠️ Urgence Médicale : Hématome de Cloison</strong><br>\n    Se manifeste par une obstruction nasale bilatérale avec tuméfaction violacée, lisse et fluctuante de la cloison nasale. <em>Risque évolutif :</em> Nécrose du cartilage septal avec ensellement nasal définitif et médiastinite. Drainage chirurgical en urgence sous couverture antibiotique.\n  </div>\n</section>\n\n<section id=\"lefort\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Fractures de Le Fort (Massif Facial Middle-Face)</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort I (Disjonction basilaire) :</strong> Trait horizontal au-dessus de l'arcade dentaire supérieure détachant l'arcade alvéolo-dentaire du reste du massif maxillaire.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort II (Disjonction pyramido-naso-maxillaire) :</strong> Trait pyramidal passant par la racine du nez, la paroi médiale de l'orbite et le rebord orbitaire inférieur.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort III (Disjonction cranio-faciale totale) :</strong> Trait haut séparant l'ensemble du massif facial de la base du crâne.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_tumefactions_cervicales",
  "slug": "orl-diagnostic-des-tumefactions-cervicales",
  "title": "Fiche Flash : 4. Diagnostic des Tuméfactions Cervicales",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 4. Diagnostic des Tuméfactions Cervicales",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"orientations\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Démarche Diagnostique devant une Masse Cervicale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'âge et la topographie (médiane ou latérale) constituent les deux facteurs majeurs d'orientation étiologique.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200\">\n      <strong>Chez l'Enfant / Sujet Jeune (< 30 ans) :</strong> Origine infectieuse (adénite, adénophlegmon) ou malformation congénitale (kyste du tractus thyréoglosse, kyste amygdaloïde).\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>Chez l'Adulte (> 40 ans) :</strong> Origine tumorale ganglionnaire secondaire (métastase d'un carcinome des VADS) jusqu'à preuve du contraire !\n    </div>\n  </div>\n</section>\n\n<section id=\"congenitales\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Tuméfactions Congénitales Médianes & Latérales</h2>\n  <div class=\"space-y-4\">\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste du Tractus Thyréoglosse (KTT)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction médiane, sous-hyoïdienne, <strong>mobile à la déglutition et à la protraction de la langue</strong> (trajet résiduel du tractus thyréoglosse).\n      </p>\n    </div>\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste Amygdaloïde (Fente Branchiale)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction latéro-cervicale haute, le long du bord antérieur du muscle sternocléidomastoïdien.\n      </p>\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_pathologies_de_l_oreille_externe",
  "slug": "orl-pathologies-de-l-oreille-externe",
  "title": "Fiche Flash : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "30 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"otite-externe\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Externe Aiguë Diffuse</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection dermo-épidermique du conduit auditif externe (CAE), favorisée par les baignades et le nettoyage micro-traumatique par coton-tige. Germe prédominant : <strong>Pseudomonas aeruginosa</strong> (Bacille Pyocyanique).\n  </p>\n  <div class=\"p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-navy-900/60 mb-4\">\n    <strong>Clinique :</strong> Otalgie violente, vivement exacerbée par la <em>pression sur le tragus</em> et la <em>traction du pavillon</em>. Tympan normal mais difficile à visualiser en raison de l'œdème sténosant du conduit.\n  </div>\n</section>\n\n<section id=\"oem\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Otite Externe Nécrosante Maligne (OEM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Osteomyélite du rocher d'origine pseudomonadique survenant chez le <strong>diabétique âgé ou l'immunodéprimé</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Signes d'Alerte et Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otalgie insomniante rebelle aux antalgiques avec otorrhée purulente et bourgeon de granulation au plancher du conduit.</li>\n      <li>• Complications neurologiques : Atteinte du nerf facial (VII) à la partie postérieure du conduit, puis des nerfs crâniens inférieurs (IX, X, XI au trou déchiré postérieur).</li>\n      <li>• Traitement : Antibiothérapie antipyocyanique prolongée IV (Ceftazidime + Ciprofloxacine) et équilibre du diabète.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otite_moyenne_aigue_oma",
  "slug": "orl-otite-moyenne-aigue-oma",
  "title": "Fiche Flash : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"germes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Étiopathogénie & Bactériologie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'OMA fait suite à une rhinopharyngite aiguë par dysfonctionnement de la trompe d'Eustache. Principaux germes : <strong>Haemophilus influenzae</strong> (syndrome otite-conjonctivite) et <strong>Streptococcus pneumoniae</strong> (Pneumocoque, le plus fébrile et algique).\n  </p>\n</section>\n\n<section id=\"stades\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Stades Otoscopiques</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200\">\n      <strong>1. OMA Congestive :</strong> Tympan rosé ou érythémateux avec conservation des reliefs osseux. Traitement antalgique/antipyrique sans antibiotique d'emblée.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>2. OMA Collectée :</strong> Tympan bombé, dépoli, comblant les reliefs osseux. Indication à l'antibiothérapie par Amoxicilline (ou Augmentin si otite-conjonctivite).\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>3. OMA Perforée :</strong> Otorrhée purulente pulsatile spontanée soulageant l'otalgie.\n    </div>\n  </div>\n</section>\n\n<section id=\"complications\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Complications : La Mastoïdite Aiguë</h2>\n  <div class=\"p-4 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <strong>Mastoïdite Aiguë de l'Enfant :</strong> Décollement du pavillon de l'oreille avec comblement et œdème rétro-auriculaire douloureux. Hospitalisation, scanner du rocher et paracentèse / antibiothérapie IV ± mastoïdatesctomie.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinosinusites_aigues_et_chroniques",
  "slug": "orl-rhinosinusites-aigues-et-chroniques",
  "title": "Fiche Flash : 7. Les Rhinosinusites Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 7. Les Rhinosinusites Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"maxillaire\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Sinusite Maxillaire Aiguë de l'Adulte</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection aiguë du sinus maxillaire. Critères diagnostiques d'une surinfection bactérienne (nécessitant Amoxicilline) : au moins 2 critères majeurs (douleur sous-orbitaire unilatérale throbbing, mouchage purulente, fièvre > 38.5°C).\n  </p>\n</section>\n\n<section id=\"ethmoidite\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Éthmoïdite Aiguë de l'Enfant (Urgence Vitale)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Éthmoïdite Aiguë du Nourrisson</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Seul sinus développé dès la naissance. Clinique : <strong>Œdème palpebral unilatéral douloureux</strong> à prédominance médiale avec fièvre élevée.<br>\n      <em>Stade collecté (Abcès sous-périosté orbitaire) :</em> Exophtalmie, mydriase, immobilité oculaire. Scanner orbito-encéphalique en urgence et drainage.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_corps_etrangers_en_orl",
  "slug": "orl-corps-etrangers-en-orl",
  "title": "Fiche Flash : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"penetration\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Le Syndrome de Pénétration (Élément Pathognomonique)</h2>\n  <div class=\"p-5 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30\">\n    <strong>Clinique Cardinal :</strong> Accès de suffocation brutal, tirage, cyanose, toux quinteuse expulsative expiratoire survenant lors du jeu ou d'un repas chez un enfant de 6 mois à 3 ans (cacahuète, petit objet). L'interrogatoire retrouve systématiquement cet épisode inaugural.\n  </div>\n</section>\n\n<section id=\"localisation\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Prise en Charge & Bronchoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Toute suspicion de corps étranger des voies aériennes impose la réalisation d'une <strong>endoscopie au tube rigide sous AG</strong> pour extraction au tube optique.\n  </p>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otites_moyennes_chroniques_et_cholesteatome",
  "slug": "orl-otites-moyennes-chroniques-et-cholesteatome",
  "title": "Fiche Flash : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"osm\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Séro-Muqueuse (OSM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Épanchement rétro-tympanique chronique (> 3 mois) à tympan fermé sans signe d'inflammation aiguë. Première cause de surdité de transmission chez l'enfant.\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20 mb-4\">\n    <strong>Otoscopie :</strong> Tympan dépoli, rétracté, ambré/jaunâtre avec bulles ou niveau liquide. <em>Traitement :</em> Aérateurs transtympaniques (yoyos) ± adénoïdectomie.\n  </div>\n</section>\n\n<section id=\"cholesteatome\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Cholestéatome (OMC Dangereuse)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Présence d'épithélium pavimenteux stratifié kératinisé dans les cavités de l'oreille moyenne. Caractérisé par son pouvoir <strong>ostéolytique destructeur</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🔍 Otoscopie & Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otoscopie : Perforation atticale ou marginale comblée par des squames blanchâtres fétides.</li>\n      <li>• Complications : Fistule labyrinthique (vertige déclenché par la pression du conduit = Signe de la fistule), paralysie faciale périphérique (VII), méningite et abcès du cerveau.</li>\n      <li>• Traitement : Toujours chirurgical (tympanoplastie d'éradication).</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_surdites",
  "slug": "orl-diagnostic-des-surdites",
  "title": "Fiche Flash : 10. Diagnostic des Surdités (Transmission vs Perception)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 10. Diagnostic des Surdités (Transmission vs Perception)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"diapason\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épreuves au Diapason (Weber & Rinne)</h2>\n  <div class=\"overflow-x-auto mb-6\">\n    <table class=\"w-full text-left border-collapse border border-slate-200 dark:border-navy-700 rounded-xl overflow-hidden text-xs\">\n      <thead class=\"bg-slate-100 dark:bg-navy-800 font-bold uppercase text-navy-700 dark:text-navy-200\">\n        <tr>\n          <th class=\"p-3 border\">Type de Surdité</th>\n          <th class=\"p-3 border text-center\">Test de Weber (Vortex)</th>\n          <th class=\"p-3 border text-center\">Test de Rinne (CO vs CA)</th>\n        </tr>\n      </thead>\n      <tbody class=\"divide-y divide-slate-100 dark:divide-navy-800\">\n        <tr>\n          <td class=\"p-3 font-bold text-brand-600\">Surdité de Transmission</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté malade</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Négatif</strong> (CO > CA)</td>\n        </tr>\n        <tr>\n          <td class=\"p-3 font-bold text-purple-600\">Surdité de Perception</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté sain</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Positif</strong> (CA > CO mais abaissés)</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</section>\n\n<section id=\"audiometrie\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Audiométrie & Impédancemétrie</h2>\n  <ul class=\"space-y-3 text-sm text-navy-700 dark:text-navy-300\">\n    <li>• <strong>Surdité de Transmission :</strong> Conduction osseuse (CO) normale, courbe de conduction aérienne (CA) abaissée (existence d'un Rink / rinne audiométrique). Tympanogramme plat (épanchement OSM) ou réflexe stapedien absent (otospongiose).</li>\n    <li>• <strong>Surdité de Perception :</strong> Courbes CO et CA superposées et abaissées. Otospongiose (surdité de transmission à tympan normal avec coche de Carhart à 2000 Hz). Neurinome de l'acoustique (surdité de perception rétro-cochléaire unilatérale progressive).</li>\n  </ul>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_vertiges",
  "slug": "orl-diagnostic-des-vertiges",
  "title": "Fiche Flash : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"syndromes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Syndrome Vestibulaire Périphérique vs Central</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20\">\n      <h3 class=\"font-bold text-teal-900 mb-2\">Syndrome Périphérique (Harmonieux)</h3>\n      • Vertige rotatoire intense avec signes neuro-végétatifs (vomissements).<br>\n      • <strong>Nystagmus horizontal ou horizono-rotatoire</strong> battant du côté opposé à la lésion (phase rapide vers le côté sain).<br>\n      • Déviations toniques (Romberg, Fukuda) du <em>côté lésé</em>.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n      <h3 class=\"font-bold text-rose-950 mb-2\">Syndrome Central (Dysharmonieux)</h3>\n      • Vertige souvent flou ou sensation d'instabilité.<br>\n      • Nystagmus pur (vertical, rotatoire pur ou multidirectionnel).<br>\n      • Déviations toniques non concordantes (évoquer un AVC du tronc cérébral / cérébelleux).\n    </div>\n  </div>\n</section>\n\n<section id=\"vppb\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Vertige Positionnel Paroxystique Bénin (VPPB)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Dû à une lithiase des canaux semi-circulaires (canal postérieur +++). Vertige très bref (< 1 minute), violent, déclenché par les changements de position de la tête.\n  </p>\n  <div class=\"p-4 rounded-xl bg-indigo-50 border border-indigo-200 mb-4\">\n    <strong>Diagnostic :</strong> Manœuvre de Dix-Hallpike (déclenche le vertige et le nystagmus épuisable avec latence). <em>Traitement :</em> Manœuvre libératoire de Semont ou Epley.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_dyspnees_laryngees_aigues_et_chroniques",
  "slug": "orl-dyspnees-laryngees-aigues-et-chroniques",
  "title": "Fiche Flash : 12. Dyspnées Laryngées Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 12. Dyspnées Laryngées Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"triade\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Triade Clinique de la Dyspnée Laryngée</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Triade Pathognomonique</h3>\n    <ol class=\"list-decimal pl-5 text-sm text-rose-900 dark:text-rose-200 space-y-1\">\n      <li><strong>Bradypnée Inspiratoire :</strong> Ralentissement de la fréquence respiratoire avec allongement de l'inspiration.</li>\n      <li><strong>Tirage Inspiratoire :</strong> Dépression des parties meubles (sus-sternale, sus-claviculaire et intercostale).</li>\n      <li><strong>Bruit Inspiratoire :</strong> Stridor (aigu, laryngé haut) ou Cornage (grave, sous-glottique).</li>\n    </ol>\n  </div>\n</section>\n\n<section id=\"etiologies\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Laryngites Aiguës Pédiatriques</h2>\n  <div class=\"space-y-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Laryngite Aiguë Sous-Glottique (Virale) :</strong> La plus fréquente (6 mois - 3 ans). Toux rauque, voix modifiée, bradypnée inspiratoire nocturne. Traitement : Corticothérapie orale (Dexaméthasone ou Solupred) ± nébulisation d'Adrénaline.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-100 border border-rose-300\">\n      <strong>Épiglottite Aiguë (Haemophilus influenzae b) :</strong> Urgence extrême ! Dysphagie majeure avec bavage d'interdiction, position assise penchée en avant obligatoire, voix étouffée (\"patate chaude\"). <em>Contre-indication absolue à l'abaisse-langue !</em> Intubation en milieu chirurgical.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinopharyngites_et_angines",
  "slug": "orl-rhinopharyngites-et-angines",
  "title": "Fiche Flash : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"tdr\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Classification des Angines & Test TDR</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Les angines sont érythémateuses (rouges) ou érythémato-pultacées (blanches) dans 80% des cas. La majorité est d'origine virale. Seul le <strong>Streptocoque Bêta-Hémolytique du Groupe A (SGA)</strong> justifie une antibiothérapie (Amoxicilline 6 jours) pour prévenir le Rhumatisme Articulaire Aigu (RAA).\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 mb-4\">\n    <strong>Test Rapide d'Orientation Diagnostique (TDR) :</strong> Réalisé au cabinet par frottis amygdalien. Si positif = Antibiothérapie Amoxicilline. Si négatif = Traitement symptomatique uniquement.\n  </div>\n</section>\n\n<section id=\"formes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Angines Particulières</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-purple-50 border border-purple-200\">\n      <strong>Angines Vésiculeuses (Virales) :</strong> Herpangine (Virus Coxsackie A) avec petites vésicules pharyngées, syndrome pied-main-bouche.\n    </div>\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Angine de Vincent (Ulcéro-nécrotique unilatérale) :</strong> Association fuso-spirillaire chez un sujet à mauvaise hygiène bucco-dentaire. Haleine fétide.\n    </div>\n  </div>\n</section>\n\n<section id=\"phlegmon\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Phlegmon Péri-Amygdalien (Complication Suppurée)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Clinique & Ponction</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Suppuration entre la capsule amygdalienne et le muscle constricteur du pharynx.<br>\n      • Triade : <strong>Trismus serré</strong>, otalgie réflexe, odynophagie majeure unilatérale avec voix étouffée.<br>\n      • Examen : Amygdale refoulée vers le bas et le dedans, pilier antérieur bombé, luette œdématiée déviée du côté opposé.<br>\n      • Traitement : Ponction évacuatrice au point de bombement maximum (ou incision) + Augmentin IV.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
}
,
{
  "id": "fiche_orl_obstruction_nasale_et_epistaxis",
  "slug": "orl-obstruction-nasale-et-epistaxis",
  "title": "Fiche Flash : 1. Obstruction Nasale & Épistaxis Grave",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 1. Obstruction Nasale & Épistaxis Grave",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Rappels Anatomiques & Vascularisation Nasale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La muqueuse nasale présente une vascularisation extrêmement riche issue du système <strong>Carotide Externe</strong> (artère sphénopalatine) et du système <strong>Carotide Interne</strong> (artères éthmoïdales antérieure et postérieure).\n  </p>\n  <div class=\"p-4 my-4 rounded-2xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20\">\n    <div class=\"flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold mb-1\">\n      🩸 Zone Cardinale : La Tache Vasculaire de Kiesselbach\n    </div>\n    <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n      Située à la partie antéro-inférieure du septum nasal, la <strong>tache vasculaire (plexus de Kiesselbach)</strong> est le siège de plus de 90% des épistaxis bénignes de l'enfant et du sujet jeune.\n    </p>\n  </div>\n</section>\n\n<section id=\"epistaxis\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Conduite à Tenir d'Urgence devant une Épistaxis Grave</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'épistaxis est une urgence médico-chirurgicale fréquente. L'appréciation du retentissement hémodynamique (pouls, tension artérielle, choc) prime sur l'examen otorhinolaryngologique.\n  </p>\n\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6\">\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 dark:text-brand-400 mb-2\">1. Tamponnement Antérieur</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Mèche grasse ou éponge résorbable (Merocel) introduite d'avant en arrière parallèlement au plancher des fosses nasales pendant 48 heures.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-amber-600 dark:text-amber-400 mb-2\">2. Tamponnement Postérieur / Ballonnets</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Indiqué si l'épistaxis persiste malgré le tamponnement antérieur. Réalisé sous couverture antibiotique.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-rose-600 dark:text-rose-400 mb-2\">3. Embolisation & Ligature</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">En cas d'échec : embolisation de l'artère maxillaire interne sous angiographie ou ligature sous endoscopie de l'artère sphénopalatine.</p>\n    </div>\n  </div>\n</section>\n\n<section id=\"obstruction\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Étiologies de l'Obstruction Nasale</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Nourrisson :</strong> Atrésie choanale (urgence vitale si bilatérale), corps étranger nasal méconnu (rhinorrhée unilatérale fétide).\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Jeune Homme :</strong> <em>Angiofibrome nasopharyngien juvénile</em> (fibrome nasopharyngien) se révélant par une obstruction nasale avec épistaxis récidivantes massives.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez l'Adulte :</strong> Déviation septale, hypertrophie des cornets, polypose naso-sinusienne, cancers du nasopharynx (UCN).\n    </div>\n  </div>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés & Pièges Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/50 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 À RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5 leading-relaxed\">\n      <li>• Épistaxis + rhinorrhée fétide purulente unilatérale chez l'enfant = Corps étranger nasal méconnu jusqu'à preuve du contraire.</li>\n      <li>• Épistaxis à répétition chez un adolescent masculin = Évoquer impérativement le fibrome nasopharyngien (contre-indication absolue à la biopsie !).</li>\n      <li>• La tache vasculaire est située dans la partie antéro-inférieure du septum nasal.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_cancers_des_voies_aero_digestives_superieures_vads",
  "slug": "orl-cancers-des-voies-aero-digestives-superieures-vads",
  "title": "Fiche Flash : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épidémiologie & Facteurs de Risque</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Plus de 90% des cancers des VADS sont des <strong>carcinomes épidermoïdes</strong>. La synergie alcoolo-tabagique constitue le facteur de risque majeur pour la cavité buccale, l'oropharynx, le hypopharynx et le larynx.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200\">\n      <strong>HPV (Human Papillomavirus 16) :</strong> Responsable d'une incidence croissante des cancers de l'oropharynx (amygdales, base de langue) chez des sujets plus jeunes et non-fumeurs.\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>EBV (Virus d'Epstein-Barr) :</strong> Associé de façon constante aux Carcinomes Nasopharyngés (UCN / Undifferentiated Carcinoma of Nasopharyngeal Type) endémiques au Maghreb.\n    </div>\n  </div>\n</section>\n\n<section id=\"clinique\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Examen Clinique & Panendoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Devant toute <strong>adénopathie cervicale chronique de l'adulte (> 3 semaines)</strong>, dure, indolore et fixe, un cancer des VADS doit être recherché systématiquement par l'examen ORL complet et la nasofibroscopie.\n  </p>\n  <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 mb-4\">\n    <strong>Panendoscopie des VADS sous AG :</strong> Indispensable pour la biopsie de la lésion primitive, la recherche d'une seconde localisation synchrone (10 à 15% des cas) et le bilan d'extension.\n  </div>\n</section>\n\n<section id=\"ucn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Carcinome du Nasopharynx (UCN)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Le cancer du cavum (UCN) se caractérise par sa triade évocatrice : <strong>Otite séro-muqueuse unilatérale</strong> de l'adulte, adénopathie cervicale haute sous-digastrique et atteinte des nerfs crâniens (diplopie par atteinte du VI, névralgie du V).\n  </p>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5\">\n      <li>• Otite séro-muqueuse unilatérale chez l'adulte = Examen impératif du cavum (nasopharynx).</li>\n      <li>• L'UCN est très radiosensible et chimiosensible (traitement basé sur la radio-chimiothérapie).</li>\n      <li>• La panendoscopie des VADS est obligatoire avant toute décision thérapeutique.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_traumatismes_du_cou_et_de_la_face",
  "slug": "orl-traumatismes-du-cou-et-de-la-face",
  "title": "Fiche Flash : 3. Traumatismes de la Face et du Cou",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 3. Traumatismes de la Face et du Cou",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"opn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Fractures des Os Propres du Nez (OPN) & Hématome de Cloison</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La fracture des OPN est la plus fréquente des fractures de la face. L'examen otorhinolaryngologique précoce doit systématiquement rechercher une urgence chirurgicale : <strong>l'hématome de cloison nasal</strong>.\n  </p>\n  <div class=\"p-4 my-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n    <strong>⚠️ Urgence Médicale : Hématome de Cloison</strong><br>\n    Se manifeste par une obstruction nasale bilatérale avec tuméfaction violacée, lisse et fluctuante de la cloison nasale. <em>Risque évolutif :</em> Nécrose du cartilage septal avec ensellement nasal définitif et médiastinite. Drainage chirurgical en urgence sous couverture antibiotique.\n  </div>\n</section>\n\n<section id=\"lefort\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Fractures de Le Fort (Massif Facial Middle-Face)</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort I (Disjonction basilaire) :</strong> Trait horizontal au-dessus de l'arcade dentaire supérieure détachant l'arcade alvéolo-dentaire du reste du massif maxillaire.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort II (Disjonction pyramido-naso-maxillaire) :</strong> Trait pyramidal passant par la racine du nez, la paroi médiale de l'orbite et le rebord orbitaire inférieur.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort III (Disjonction cranio-faciale totale) :</strong> Trait haut séparant l'ensemble du massif facial de la base du crâne.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_tumefactions_cervicales",
  "slug": "orl-diagnostic-des-tumefactions-cervicales",
  "title": "Fiche Flash : 4. Diagnostic des Tuméfactions Cervicales",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 4. Diagnostic des Tuméfactions Cervicales",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"orientations\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Démarche Diagnostique devant une Masse Cervicale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'âge et la topographie (médiane ou latérale) constituent les deux facteurs majeurs d'orientation étiologique.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200\">\n      <strong>Chez l'Enfant / Sujet Jeune (< 30 ans) :</strong> Origine infectieuse (adénite, adénophlegmon) ou malformation congénitale (kyste du tractus thyréoglosse, kyste amygdaloïde).\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>Chez l'Adulte (> 40 ans) :</strong> Origine tumorale ganglionnaire secondaire (métastase d'un carcinome des VADS) jusqu'à preuve du contraire !\n    </div>\n  </div>\n</section>\n\n<section id=\"congenitales\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Tuméfactions Congénitales Médianes & Latérales</h2>\n  <div class=\"space-y-4\">\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste du Tractus Thyréoglosse (KTT)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction médiane, sous-hyoïdienne, <strong>mobile à la déglutition et à la protraction de la langue</strong> (trajet résiduel du tractus thyréoglosse).\n      </p>\n    </div>\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste Amygdaloïde (Fente Branchiale)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction latéro-cervicale haute, le long du bord antérieur du muscle sternocléidomastoïdien.\n      </p>\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_pathologies_de_l_oreille_externe",
  "slug": "orl-pathologies-de-l-oreille-externe",
  "title": "Fiche Flash : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "30 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"otite-externe\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Externe Aiguë Diffuse</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection dermo-épidermique du conduit auditif externe (CAE), favorisée par les baignades et le nettoyage micro-traumatique par coton-tige. Germe prédominant : <strong>Pseudomonas aeruginosa</strong> (Bacille Pyocyanique).\n  </p>\n  <div class=\"p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-navy-900/60 mb-4\">\n    <strong>Clinique :</strong> Otalgie violente, vivement exacerbée par la <em>pression sur le tragus</em> et la <em>traction du pavillon</em>. Tympan normal mais difficile à visualiser en raison de l'œdème sténosant du conduit.\n  </div>\n</section>\n\n<section id=\"oem\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Otite Externe Nécrosante Maligne (OEM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Osteomyélite du rocher d'origine pseudomonadique survenant chez le <strong>diabétique âgé ou l'immunodéprimé</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Signes d'Alerte et Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otalgie insomniante rebelle aux antalgiques avec otorrhée purulente et bourgeon de granulation au plancher du conduit.</li>\n      <li>• Complications neurologiques : Atteinte du nerf facial (VII) à la partie postérieure du conduit, puis des nerfs crâniens inférieurs (IX, X, XI au trou déchiré postérieur).</li>\n      <li>• Traitement : Antibiothérapie antipyocyanique prolongée IV (Ceftazidime + Ciprofloxacine) et équilibre du diabète.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otite_moyenne_aigue_oma",
  "slug": "orl-otite-moyenne-aigue-oma",
  "title": "Fiche Flash : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"germes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Étiopathogénie & Bactériologie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'OMA fait suite à une rhinopharyngite aiguë par dysfonctionnement de la trompe d'Eustache. Principaux germes : <strong>Haemophilus influenzae</strong> (syndrome otite-conjonctivite) et <strong>Streptococcus pneumoniae</strong> (Pneumocoque, le plus fébrile et algique).\n  </p>\n</section>\n\n<section id=\"stades\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Stades Otoscopiques</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200\">\n      <strong>1. OMA Congestive :</strong> Tympan rosé ou érythémateux avec conservation des reliefs osseux. Traitement antalgique/antipyrique sans antibiotique d'emblée.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>2. OMA Collectée :</strong> Tympan bombé, dépoli, comblant les reliefs osseux. Indication à l'antibiothérapie par Amoxicilline (ou Augmentin si otite-conjonctivite).\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>3. OMA Perforée :</strong> Otorrhée purulente pulsatile spontanée soulageant l'otalgie.\n    </div>\n  </div>\n</section>\n\n<section id=\"complications\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Complications : La Mastoïdite Aiguë</h2>\n  <div class=\"p-4 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <strong>Mastoïdite Aiguë de l'Enfant :</strong> Décollement du pavillon de l'oreille avec comblement et œdème rétro-auriculaire douloureux. Hospitalisation, scanner du rocher et paracentèse / antibiothérapie IV ± mastoïdatesctomie.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinosinusites_aigues_et_chroniques",
  "slug": "orl-rhinosinusites-aigues-et-chroniques",
  "title": "Fiche Flash : 7. Les Rhinosinusites Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 7. Les Rhinosinusites Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"maxillaire\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Sinusite Maxillaire Aiguë de l'Adulte</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection aiguë du sinus maxillaire. Critères diagnostiques d'une surinfection bactérienne (nécessitant Amoxicilline) : au moins 2 critères majeurs (douleur sous-orbitaire unilatérale throbbing, mouchage purulente, fièvre > 38.5°C).\n  </p>\n</section>\n\n<section id=\"ethmoidite\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Éthmoïdite Aiguë de l'Enfant (Urgence Vitale)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Éthmoïdite Aiguë du Nourrisson</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Seul sinus développé dès la naissance. Clinique : <strong>Œdème palpebral unilatéral douloureux</strong> à prédominance médiale avec fièvre élevée.<br>\n      <em>Stade collecté (Abcès sous-périosté orbitaire) :</em> Exophtalmie, mydriase, immobilité oculaire. Scanner orbito-encéphalique en urgence et drainage.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_corps_etrangers_en_orl",
  "slug": "orl-corps-etrangers-en-orl",
  "title": "Fiche Flash : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"penetration\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Le Syndrome de Pénétration (Élément Pathognomonique)</h2>\n  <div class=\"p-5 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30\">\n    <strong>Clinique Cardinal :</strong> Accès de suffocation brutal, tirage, cyanose, toux quinteuse expulsative expiratoire survenant lors du jeu ou d'un repas chez un enfant de 6 mois à 3 ans (cacahuète, petit objet). L'interrogatoire retrouve systématiquement cet épisode inaugural.\n  </div>\n</section>\n\n<section id=\"localisation\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Prise en Charge & Bronchoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Toute suspicion de corps étranger des voies aériennes impose la réalisation d'une <strong>endoscopie au tube rigide sous AG</strong> pour extraction au tube optique.\n  </p>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otites_moyennes_chroniques_et_cholesteatome",
  "slug": "orl-otites-moyennes-chroniques-et-cholesteatome",
  "title": "Fiche Flash : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"osm\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Séro-Muqueuse (OSM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Épanchement rétro-tympanique chronique (> 3 mois) à tympan fermé sans signe d'inflammation aiguë. Première cause de surdité de transmission chez l'enfant.\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20 mb-4\">\n    <strong>Otoscopie :</strong> Tympan dépoli, rétracté, ambré/jaunâtre avec bulles ou niveau liquide. <em>Traitement :</em> Aérateurs transtympaniques (yoyos) ± adénoïdectomie.\n  </div>\n</section>\n\n<section id=\"cholesteatome\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Cholestéatome (OMC Dangereuse)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Présence d'épithélium pavimenteux stratifié kératinisé dans les cavités de l'oreille moyenne. Caractérisé par son pouvoir <strong>ostéolytique destructeur</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🔍 Otoscopie & Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otoscopie : Perforation atticale ou marginale comblée par des squames blanchâtres fétides.</li>\n      <li>• Complications : Fistule labyrinthique (vertige déclenché par la pression du conduit = Signe de la fistule), paralysie faciale périphérique (VII), méningite et abcès du cerveau.</li>\n      <li>• Traitement : Toujours chirurgical (tympanoplastie d'éradication).</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_surdites",
  "slug": "orl-diagnostic-des-surdites",
  "title": "Fiche Flash : 10. Diagnostic des Surdités (Transmission vs Perception)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 10. Diagnostic des Surdités (Transmission vs Perception)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"diapason\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épreuves au Diapason (Weber & Rinne)</h2>\n  <div class=\"overflow-x-auto mb-6\">\n    <table class=\"w-full text-left border-collapse border border-slate-200 dark:border-navy-700 rounded-xl overflow-hidden text-xs\">\n      <thead class=\"bg-slate-100 dark:bg-navy-800 font-bold uppercase text-navy-700 dark:text-navy-200\">\n        <tr>\n          <th class=\"p-3 border\">Type de Surdité</th>\n          <th class=\"p-3 border text-center\">Test de Weber (Vortex)</th>\n          <th class=\"p-3 border text-center\">Test de Rinne (CO vs CA)</th>\n        </tr>\n      </thead>\n      <tbody class=\"divide-y divide-slate-100 dark:divide-navy-800\">\n        <tr>\n          <td class=\"p-3 font-bold text-brand-600\">Surdité de Transmission</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté malade</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Négatif</strong> (CO > CA)</td>\n        </tr>\n        <tr>\n          <td class=\"p-3 font-bold text-purple-600\">Surdité de Perception</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté sain</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Positif</strong> (CA > CO mais abaissés)</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</section>\n\n<section id=\"audiometrie\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Audiométrie & Impédancemétrie</h2>\n  <ul class=\"space-y-3 text-sm text-navy-700 dark:text-navy-300\">\n    <li>• <strong>Surdité de Transmission :</strong> Conduction osseuse (CO) normale, courbe de conduction aérienne (CA) abaissée (existence d'un Rink / rinne audiométrique). Tympanogramme plat (épanchement OSM) ou réflexe stapedien absent (otospongiose).</li>\n    <li>• <strong>Surdité de Perception :</strong> Courbes CO et CA superposées et abaissées. Otospongiose (surdité de transmission à tympan normal avec coche de Carhart à 2000 Hz). Neurinome de l'acoustique (surdité de perception rétro-cochléaire unilatérale progressive).</li>\n  </ul>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_vertiges",
  "slug": "orl-diagnostic-des-vertiges",
  "title": "Fiche Flash : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"syndromes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Syndrome Vestibulaire Périphérique vs Central</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20\">\n      <h3 class=\"font-bold text-teal-900 mb-2\">Syndrome Périphérique (Harmonieux)</h3>\n      • Vertige rotatoire intense avec signes neuro-végétatifs (vomissements).<br>\n      • <strong>Nystagmus horizontal ou horizono-rotatoire</strong> battant du côté opposé à la lésion (phase rapide vers le côté sain).<br>\n      • Déviations toniques (Romberg, Fukuda) du <em>côté lésé</em>.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n      <h3 class=\"font-bold text-rose-950 mb-2\">Syndrome Central (Dysharmonieux)</h3>\n      • Vertige souvent flou ou sensation d'instabilité.<br>\n      • Nystagmus pur (vertical, rotatoire pur ou multidirectionnel).<br>\n      • Déviations toniques non concordantes (évoquer un AVC du tronc cérébral / cérébelleux).\n    </div>\n  </div>\n</section>\n\n<section id=\"vppb\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Vertige Positionnel Paroxystique Bénin (VPPB)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Dû à une lithiase des canaux semi-circulaires (canal postérieur +++). Vertige très bref (< 1 minute), violent, déclenché par les changements de position de la tête.\n  </p>\n  <div class=\"p-4 rounded-xl bg-indigo-50 border border-indigo-200 mb-4\">\n    <strong>Diagnostic :</strong> Manœuvre de Dix-Hallpike (déclenche le vertige et le nystagmus épuisable avec latence). <em>Traitement :</em> Manœuvre libératoire de Semont ou Epley.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_dyspnees_laryngees_aigues_et_chroniques",
  "slug": "orl-dyspnees-laryngees-aigues-et-chroniques",
  "title": "Fiche Flash : 12. Dyspnées Laryngées Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 12. Dyspnées Laryngées Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"triade\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Triade Clinique de la Dyspnée Laryngée</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Triade Pathognomonique</h3>\n    <ol class=\"list-decimal pl-5 text-sm text-rose-900 dark:text-rose-200 space-y-1\">\n      <li><strong>Bradypnée Inspiratoire :</strong> Ralentissement de la fréquence respiratoire avec allongement de l'inspiration.</li>\n      <li><strong>Tirage Inspiratoire :</strong> Dépression des parties meubles (sus-sternale, sus-claviculaire et intercostale).</li>\n      <li><strong>Bruit Inspiratoire :</strong> Stridor (aigu, laryngé haut) ou Cornage (grave, sous-glottique).</li>\n    </ol>\n  </div>\n</section>\n\n<section id=\"etiologies\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Laryngites Aiguës Pédiatriques</h2>\n  <div class=\"space-y-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Laryngite Aiguë Sous-Glottique (Virale) :</strong> La plus fréquente (6 mois - 3 ans). Toux rauque, voix modifiée, bradypnée inspiratoire nocturne. Traitement : Corticothérapie orale (Dexaméthasone ou Solupred) ± nébulisation d'Adrénaline.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-100 border border-rose-300\">\n      <strong>Épiglottite Aiguë (Haemophilus influenzae b) :</strong> Urgence extrême ! Dysphagie majeure avec bavage d'interdiction, position assise penchée en avant obligatoire, voix étouffée (\"patate chaude\"). <em>Contre-indication absolue à l'abaisse-langue !</em> Intubation en milieu chirurgical.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinopharyngites_et_angines",
  "slug": "orl-rhinopharyngites-et-angines",
  "title": "Fiche Flash : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"tdr\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Classification des Angines & Test TDR</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Les angines sont érythémateuses (rouges) ou érythémato-pultacées (blanches) dans 80% des cas. La majorité est d'origine virale. Seul le <strong>Streptocoque Bêta-Hémolytique du Groupe A (SGA)</strong> justifie une antibiothérapie (Amoxicilline 6 jours) pour prévenir le Rhumatisme Articulaire Aigu (RAA).\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 mb-4\">\n    <strong>Test Rapide d'Orientation Diagnostique (TDR) :</strong> Réalisé au cabinet par frottis amygdalien. Si positif = Antibiothérapie Amoxicilline. Si négatif = Traitement symptomatique uniquement.\n  </div>\n</section>\n\n<section id=\"formes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Angines Particulières</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-purple-50 border border-purple-200\">\n      <strong>Angines Vésiculeuses (Virales) :</strong> Herpangine (Virus Coxsackie A) avec petites vésicules pharyngées, syndrome pied-main-bouche.\n    </div>\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Angine de Vincent (Ulcéro-nécrotique unilatérale) :</strong> Association fuso-spirillaire chez un sujet à mauvaise hygiène bucco-dentaire. Haleine fétide.\n    </div>\n  </div>\n</section>\n\n<section id=\"phlegmon\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Phlegmon Péri-Amygdalien (Complication Suppurée)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Clinique & Ponction</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Suppuration entre la capsule amygdalienne et le muscle constricteur du pharynx.<br>\n      • Triade : <strong>Trismus serré</strong>, otalgie réflexe, odynophagie majeure unilatérale avec voix étouffée.<br>\n      • Examen : Amygdale refoulée vers le bas et le dedans, pilier antérieur bombé, luette œdématiée déviée du côté opposé.<br>\n      • Traitement : Ponction évacuatrice au point de bombement maximum (ou incision) + Augmentin IV.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
}
,
{
  "id": "fiche_orl_obstruction_nasale_et_epistaxis",
  "slug": "orl-obstruction-nasale-et-epistaxis",
  "title": "Fiche Flash : 1. Obstruction Nasale & Épistaxis Grave",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 1. Obstruction Nasale & Épistaxis Grave",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Rappels Anatomiques & Vascularisation Nasale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La muqueuse nasale présente une vascularisation extrêmement riche issue du système <strong>Carotide Externe</strong> (artère sphénopalatine) et du système <strong>Carotide Interne</strong> (artères éthmoïdales antérieure et postérieure).\n  </p>\n  <div class=\"p-4 my-4 rounded-2xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20\">\n    <div class=\"flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold mb-1\">\n      🩸 Zone Cardinale : La Tache Vasculaire de Kiesselbach\n    </div>\n    <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n      Située à la partie antéro-inférieure du septum nasal, la <strong>tache vasculaire (plexus de Kiesselbach)</strong> est le siège de plus de 90% des épistaxis bénignes de l'enfant et du sujet jeune.\n    </p>\n  </div>\n</section>\n\n<section id=\"epistaxis\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Conduite à Tenir d'Urgence devant une Épistaxis Grave</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'épistaxis est une urgence médico-chirurgicale fréquente. L'appréciation du retentissement hémodynamique (pouls, tension artérielle, choc) prime sur l'examen otorhinolaryngologique.\n  </p>\n\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6\">\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 dark:text-brand-400 mb-2\">1. Tamponnement Antérieur</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Mèche grasse ou éponge résorbable (Merocel) introduite d'avant en arrière parallèlement au plancher des fosses nasales pendant 48 heures.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-amber-600 dark:text-amber-400 mb-2\">2. Tamponnement Postérieur / Ballonnets</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Indiqué si l'épistaxis persiste malgré le tamponnement antérieur. Réalisé sous couverture antibiotique.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-rose-600 dark:text-rose-400 mb-2\">3. Embolisation & Ligature</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">En cas d'échec : embolisation de l'artère maxillaire interne sous angiographie ou ligature sous endoscopie de l'artère sphénopalatine.</p>\n    </div>\n  </div>\n</section>\n\n<section id=\"obstruction\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Étiologies de l'Obstruction Nasale</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Nourrisson :</strong> Atrésie choanale (urgence vitale si bilatérale), corps étranger nasal méconnu (rhinorrhée unilatérale fétide).\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Jeune Homme :</strong> <em>Angiofibrome nasopharyngien juvénile</em> (fibrome nasopharyngien) se révélant par une obstruction nasale avec épistaxis récidivantes massives.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez l'Adulte :</strong> Déviation septale, hypertrophie des cornets, polypose naso-sinusienne, cancers du nasopharynx (UCN).\n    </div>\n  </div>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés & Pièges Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/50 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 À RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5 leading-relaxed\">\n      <li>• Épistaxis + rhinorrhée fétide purulente unilatérale chez l'enfant = Corps étranger nasal méconnu jusqu'à preuve du contraire.</li>\n      <li>• Épistaxis à répétition chez un adolescent masculin = Évoquer impérativement le fibrome nasopharyngien (contre-indication absolue à la biopsie !).</li>\n      <li>• La tache vasculaire est située dans la partie antéro-inférieure du septum nasal.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_cancers_des_voies_aero_digestives_superieures_vads",
  "slug": "orl-cancers-des-voies-aero-digestives-superieures-vads",
  "title": "Fiche Flash : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épidémiologie & Facteurs de Risque</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Plus de 90% des cancers des VADS sont des <strong>carcinomes épidermoïdes</strong>. La synergie alcoolo-tabagique constitue le facteur de risque majeur pour la cavité buccale, l'oropharynx, le hypopharynx et le larynx.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200\">\n      <strong>HPV (Human Papillomavirus 16) :</strong> Responsable d'une incidence croissante des cancers de l'oropharynx (amygdales, base de langue) chez des sujets plus jeunes et non-fumeurs.\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>EBV (Virus d'Epstein-Barr) :</strong> Associé de façon constante aux Carcinomes Nasopharyngés (UCN / Undifferentiated Carcinoma of Nasopharyngeal Type) endémiques au Maghreb.\n    </div>\n  </div>\n</section>\n\n<section id=\"clinique\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Examen Clinique & Panendoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Devant toute <strong>adénopathie cervicale chronique de l'adulte (> 3 semaines)</strong>, dure, indolore et fixe, un cancer des VADS doit être recherché systématiquement par l'examen ORL complet et la nasofibroscopie.\n  </p>\n  <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 mb-4\">\n    <strong>Panendoscopie des VADS sous AG :</strong> Indispensable pour la biopsie de la lésion primitive, la recherche d'une seconde localisation synchrone (10 à 15% des cas) et le bilan d'extension.\n  </div>\n</section>\n\n<section id=\"ucn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Carcinome du Nasopharynx (UCN)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Le cancer du cavum (UCN) se caractérise par sa triade évocatrice : <strong>Otite séro-muqueuse unilatérale</strong> de l'adulte, adénopathie cervicale haute sous-digastrique et atteinte des nerfs crâniens (diplopie par atteinte du VI, névralgie du V).\n  </p>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5\">\n      <li>• Otite séro-muqueuse unilatérale chez l'adulte = Examen impératif du cavum (nasopharynx).</li>\n      <li>• L'UCN est très radiosensible et chimiosensible (traitement basé sur la radio-chimiothérapie).</li>\n      <li>• La panendoscopie des VADS est obligatoire avant toute décision thérapeutique.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_traumatismes_du_cou_et_de_la_face",
  "slug": "orl-traumatismes-du-cou-et-de-la-face",
  "title": "Fiche Flash : 3. Traumatismes de la Face et du Cou",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 3. Traumatismes de la Face et du Cou",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"opn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Fractures des Os Propres du Nez (OPN) & Hématome de Cloison</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La fracture des OPN est la plus fréquente des fractures de la face. L'examen otorhinolaryngologique précoce doit systématiquement rechercher une urgence chirurgicale : <strong>l'hématome de cloison nasal</strong>.\n  </p>\n  <div class=\"p-4 my-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n    <strong>⚠️ Urgence Médicale : Hématome de Cloison</strong><br>\n    Se manifeste par une obstruction nasale bilatérale avec tuméfaction violacée, lisse et fluctuante de la cloison nasale. <em>Risque évolutif :</em> Nécrose du cartilage septal avec ensellement nasal définitif et médiastinite. Drainage chirurgical en urgence sous couverture antibiotique.\n  </div>\n</section>\n\n<section id=\"lefort\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Fractures de Le Fort (Massif Facial Middle-Face)</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort I (Disjonction basilaire) :</strong> Trait horizontal au-dessus de l'arcade dentaire supérieure détachant l'arcade alvéolo-dentaire du reste du massif maxillaire.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort II (Disjonction pyramido-naso-maxillaire) :</strong> Trait pyramidal passant par la racine du nez, la paroi médiale de l'orbite et le rebord orbitaire inférieur.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort III (Disjonction cranio-faciale totale) :</strong> Trait haut séparant l'ensemble du massif facial de la base du crâne.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_tumefactions_cervicales",
  "slug": "orl-diagnostic-des-tumefactions-cervicales",
  "title": "Fiche Flash : 4. Diagnostic des Tuméfactions Cervicales",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 4. Diagnostic des Tuméfactions Cervicales",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"orientations\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Démarche Diagnostique devant une Masse Cervicale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'âge et la topographie (médiane ou latérale) constituent les deux facteurs majeurs d'orientation étiologique.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200\">\n      <strong>Chez l'Enfant / Sujet Jeune (< 30 ans) :</strong> Origine infectieuse (adénite, adénophlegmon) ou malformation congénitale (kyste du tractus thyréoglosse, kyste amygdaloïde).\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>Chez l'Adulte (> 40 ans) :</strong> Origine tumorale ganglionnaire secondaire (métastase d'un carcinome des VADS) jusqu'à preuve du contraire !\n    </div>\n  </div>\n</section>\n\n<section id=\"congenitales\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Tuméfactions Congénitales Médianes & Latérales</h2>\n  <div class=\"space-y-4\">\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste du Tractus Thyréoglosse (KTT)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction médiane, sous-hyoïdienne, <strong>mobile à la déglutition et à la protraction de la langue</strong> (trajet résiduel du tractus thyréoglosse).\n      </p>\n    </div>\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste Amygdaloïde (Fente Branchiale)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction latéro-cervicale haute, le long du bord antérieur du muscle sternocléidomastoïdien.\n      </p>\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_pathologies_de_l_oreille_externe",
  "slug": "orl-pathologies-de-l-oreille-externe",
  "title": "Fiche Flash : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "30 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"otite-externe\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Externe Aiguë Diffuse</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection dermo-épidermique du conduit auditif externe (CAE), favorisée par les baignades et le nettoyage micro-traumatique par coton-tige. Germe prédominant : <strong>Pseudomonas aeruginosa</strong> (Bacille Pyocyanique).\n  </p>\n  <div class=\"p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-navy-900/60 mb-4\">\n    <strong>Clinique :</strong> Otalgie violente, vivement exacerbée par la <em>pression sur le tragus</em> et la <em>traction du pavillon</em>. Tympan normal mais difficile à visualiser en raison de l'œdème sténosant du conduit.\n  </div>\n</section>\n\n<section id=\"oem\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Otite Externe Nécrosante Maligne (OEM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Osteomyélite du rocher d'origine pseudomonadique survenant chez le <strong>diabétique âgé ou l'immunodéprimé</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Signes d'Alerte et Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otalgie insomniante rebelle aux antalgiques avec otorrhée purulente et bourgeon de granulation au plancher du conduit.</li>\n      <li>• Complications neurologiques : Atteinte du nerf facial (VII) à la partie postérieure du conduit, puis des nerfs crâniens inférieurs (IX, X, XI au trou déchiré postérieur).</li>\n      <li>• Traitement : Antibiothérapie antipyocyanique prolongée IV (Ceftazidime + Ciprofloxacine) et équilibre du diabète.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otite_moyenne_aigue_oma",
  "slug": "orl-otite-moyenne-aigue-oma",
  "title": "Fiche Flash : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"germes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Étiopathogénie & Bactériologie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'OMA fait suite à une rhinopharyngite aiguë par dysfonctionnement de la trompe d'Eustache. Principaux germes : <strong>Haemophilus influenzae</strong> (syndrome otite-conjonctivite) et <strong>Streptococcus pneumoniae</strong> (Pneumocoque, le plus fébrile et algique).\n  </p>\n</section>\n\n<section id=\"stades\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Stades Otoscopiques</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200\">\n      <strong>1. OMA Congestive :</strong> Tympan rosé ou érythémateux avec conservation des reliefs osseux. Traitement antalgique/antipyrique sans antibiotique d'emblée.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>2. OMA Collectée :</strong> Tympan bombé, dépoli, comblant les reliefs osseux. Indication à l'antibiothérapie par Amoxicilline (ou Augmentin si otite-conjonctivite).\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>3. OMA Perforée :</strong> Otorrhée purulente pulsatile spontanée soulageant l'otalgie.\n    </div>\n  </div>\n</section>\n\n<section id=\"complications\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Complications : La Mastoïdite Aiguë</h2>\n  <div class=\"p-4 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <strong>Mastoïdite Aiguë de l'Enfant :</strong> Décollement du pavillon de l'oreille avec comblement et œdème rétro-auriculaire douloureux. Hospitalisation, scanner du rocher et paracentèse / antibiothérapie IV ± mastoïdatesctomie.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinosinusites_aigues_et_chroniques",
  "slug": "orl-rhinosinusites-aigues-et-chroniques",
  "title": "Fiche Flash : 7. Les Rhinosinusites Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 7. Les Rhinosinusites Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"maxillaire\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Sinusite Maxillaire Aiguë de l'Adulte</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection aiguë du sinus maxillaire. Critères diagnostiques d'une surinfection bactérienne (nécessitant Amoxicilline) : au moins 2 critères majeurs (douleur sous-orbitaire unilatérale throbbing, mouchage purulente, fièvre > 38.5°C).\n  </p>\n</section>\n\n<section id=\"ethmoidite\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Éthmoïdite Aiguë de l'Enfant (Urgence Vitale)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Éthmoïdite Aiguë du Nourrisson</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Seul sinus développé dès la naissance. Clinique : <strong>Œdème palpebral unilatéral douloureux</strong> à prédominance médiale avec fièvre élevée.<br>\n      <em>Stade collecté (Abcès sous-périosté orbitaire) :</em> Exophtalmie, mydriase, immobilité oculaire. Scanner orbito-encéphalique en urgence et drainage.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_corps_etrangers_en_orl",
  "slug": "orl-corps-etrangers-en-orl",
  "title": "Fiche Flash : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"penetration\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Le Syndrome de Pénétration (Élément Pathognomonique)</h2>\n  <div class=\"p-5 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30\">\n    <strong>Clinique Cardinal :</strong> Accès de suffocation brutal, tirage, cyanose, toux quinteuse expulsative expiratoire survenant lors du jeu ou d'un repas chez un enfant de 6 mois à 3 ans (cacahuète, petit objet). L'interrogatoire retrouve systématiquement cet épisode inaugural.\n  </div>\n</section>\n\n<section id=\"localisation\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Prise en Charge & Bronchoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Toute suspicion de corps étranger des voies aériennes impose la réalisation d'une <strong>endoscopie au tube rigide sous AG</strong> pour extraction au tube optique.\n  </p>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otites_moyennes_chroniques_et_cholesteatome",
  "slug": "orl-otites-moyennes-chroniques-et-cholesteatome",
  "title": "Fiche Flash : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"osm\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Séro-Muqueuse (OSM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Épanchement rétro-tympanique chronique (> 3 mois) à tympan fermé sans signe d'inflammation aiguë. Première cause de surdité de transmission chez l'enfant.\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20 mb-4\">\n    <strong>Otoscopie :</strong> Tympan dépoli, rétracté, ambré/jaunâtre avec bulles ou niveau liquide. <em>Traitement :</em> Aérateurs transtympaniques (yoyos) ± adénoïdectomie.\n  </div>\n</section>\n\n<section id=\"cholesteatome\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Cholestéatome (OMC Dangereuse)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Présence d'épithélium pavimenteux stratifié kératinisé dans les cavités de l'oreille moyenne. Caractérisé par son pouvoir <strong>ostéolytique destructeur</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🔍 Otoscopie & Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otoscopie : Perforation atticale ou marginale comblée par des squames blanchâtres fétides.</li>\n      <li>• Complications : Fistule labyrinthique (vertige déclenché par la pression du conduit = Signe de la fistule), paralysie faciale périphérique (VII), méningite et abcès du cerveau.</li>\n      <li>• Traitement : Toujours chirurgical (tympanoplastie d'éradication).</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_surdites",
  "slug": "orl-diagnostic-des-surdites",
  "title": "Fiche Flash : 10. Diagnostic des Surdités (Transmission vs Perception)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 10. Diagnostic des Surdités (Transmission vs Perception)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"diapason\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épreuves au Diapason (Weber & Rinne)</h2>\n  <div class=\"overflow-x-auto mb-6\">\n    <table class=\"w-full text-left border-collapse border border-slate-200 dark:border-navy-700 rounded-xl overflow-hidden text-xs\">\n      <thead class=\"bg-slate-100 dark:bg-navy-800 font-bold uppercase text-navy-700 dark:text-navy-200\">\n        <tr>\n          <th class=\"p-3 border\">Type de Surdité</th>\n          <th class=\"p-3 border text-center\">Test de Weber (Vortex)</th>\n          <th class=\"p-3 border text-center\">Test de Rinne (CO vs CA)</th>\n        </tr>\n      </thead>\n      <tbody class=\"divide-y divide-slate-100 dark:divide-navy-800\">\n        <tr>\n          <td class=\"p-3 font-bold text-brand-600\">Surdité de Transmission</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté malade</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Négatif</strong> (CO > CA)</td>\n        </tr>\n        <tr>\n          <td class=\"p-3 font-bold text-purple-600\">Surdité de Perception</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté sain</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Positif</strong> (CA > CO mais abaissés)</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</section>\n\n<section id=\"audiometrie\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Audiométrie & Impédancemétrie</h2>\n  <ul class=\"space-y-3 text-sm text-navy-700 dark:text-navy-300\">\n    <li>• <strong>Surdité de Transmission :</strong> Conduction osseuse (CO) normale, courbe de conduction aérienne (CA) abaissée (existence d'un Rink / rinne audiométrique). Tympanogramme plat (épanchement OSM) ou réflexe stapedien absent (otospongiose).</li>\n    <li>• <strong>Surdité de Perception :</strong> Courbes CO et CA superposées et abaissées. Otospongiose (surdité de transmission à tympan normal avec coche de Carhart à 2000 Hz). Neurinome de l'acoustique (surdité de perception rétro-cochléaire unilatérale progressive).</li>\n  </ul>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_vertiges",
  "slug": "orl-diagnostic-des-vertiges",
  "title": "Fiche Flash : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"syndromes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Syndrome Vestibulaire Périphérique vs Central</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20\">\n      <h3 class=\"font-bold text-teal-900 mb-2\">Syndrome Périphérique (Harmonieux)</h3>\n      • Vertige rotatoire intense avec signes neuro-végétatifs (vomissements).<br>\n      • <strong>Nystagmus horizontal ou horizono-rotatoire</strong> battant du côté opposé à la lésion (phase rapide vers le côté sain).<br>\n      • Déviations toniques (Romberg, Fukuda) du <em>côté lésé</em>.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n      <h3 class=\"font-bold text-rose-950 mb-2\">Syndrome Central (Dysharmonieux)</h3>\n      • Vertige souvent flou ou sensation d'instabilité.<br>\n      • Nystagmus pur (vertical, rotatoire pur ou multidirectionnel).<br>\n      • Déviations toniques non concordantes (évoquer un AVC du tronc cérébral / cérébelleux).\n    </div>\n  </div>\n</section>\n\n<section id=\"vppb\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Vertige Positionnel Paroxystique Bénin (VPPB)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Dû à une lithiase des canaux semi-circulaires (canal postérieur +++). Vertige très bref (< 1 minute), violent, déclenché par les changements de position de la tête.\n  </p>\n  <div class=\"p-4 rounded-xl bg-indigo-50 border border-indigo-200 mb-4\">\n    <strong>Diagnostic :</strong> Manœuvre de Dix-Hallpike (déclenche le vertige et le nystagmus épuisable avec latence). <em>Traitement :</em> Manœuvre libératoire de Semont ou Epley.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_dyspnees_laryngees_aigues_et_chroniques",
  "slug": "orl-dyspnees-laryngees-aigues-et-chroniques",
  "title": "Fiche Flash : 12. Dyspnées Laryngées Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 12. Dyspnées Laryngées Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"triade\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Triade Clinique de la Dyspnée Laryngée</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Triade Pathognomonique</h3>\n    <ol class=\"list-decimal pl-5 text-sm text-rose-900 dark:text-rose-200 space-y-1\">\n      <li><strong>Bradypnée Inspiratoire :</strong> Ralentissement de la fréquence respiratoire avec allongement de l'inspiration.</li>\n      <li><strong>Tirage Inspiratoire :</strong> Dépression des parties meubles (sus-sternale, sus-claviculaire et intercostale).</li>\n      <li><strong>Bruit Inspiratoire :</strong> Stridor (aigu, laryngé haut) ou Cornage (grave, sous-glottique).</li>\n    </ol>\n  </div>\n</section>\n\n<section id=\"etiologies\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Laryngites Aiguës Pédiatriques</h2>\n  <div class=\"space-y-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Laryngite Aiguë Sous-Glottique (Virale) :</strong> La plus fréquente (6 mois - 3 ans). Toux rauque, voix modifiée, bradypnée inspiratoire nocturne. Traitement : Corticothérapie orale (Dexaméthasone ou Solupred) ± nébulisation d'Adrénaline.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-100 border border-rose-300\">\n      <strong>Épiglottite Aiguë (Haemophilus influenzae b) :</strong> Urgence extrême ! Dysphagie majeure avec bavage d'interdiction, position assise penchée en avant obligatoire, voix étouffée (\"patate chaude\"). <em>Contre-indication absolue à l'abaisse-langue !</em> Intubation en milieu chirurgical.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinopharyngites_et_angines",
  "slug": "orl-rhinopharyngites-et-angines",
  "title": "Fiche Flash : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"tdr\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Classification des Angines & Test TDR</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Les angines sont érythémateuses (rouges) ou érythémato-pultacées (blanches) dans 80% des cas. La majorité est d'origine virale. Seul le <strong>Streptocoque Bêta-Hémolytique du Groupe A (SGA)</strong> justifie une antibiothérapie (Amoxicilline 6 jours) pour prévenir le Rhumatisme Articulaire Aigu (RAA).\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 mb-4\">\n    <strong>Test Rapide d'Orientation Diagnostique (TDR) :</strong> Réalisé au cabinet par frottis amygdalien. Si positif = Antibiothérapie Amoxicilline. Si négatif = Traitement symptomatique uniquement.\n  </div>\n</section>\n\n<section id=\"formes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Angines Particulières</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-purple-50 border border-purple-200\">\n      <strong>Angines Vésiculeuses (Virales) :</strong> Herpangine (Virus Coxsackie A) avec petites vésicules pharyngées, syndrome pied-main-bouche.\n    </div>\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Angine de Vincent (Ulcéro-nécrotique unilatérale) :</strong> Association fuso-spirillaire chez un sujet à mauvaise hygiène bucco-dentaire. Haleine fétide.\n    </div>\n  </div>\n</section>\n\n<section id=\"phlegmon\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Phlegmon Péri-Amygdalien (Complication Suppurée)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Clinique & Ponction</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Suppuration entre la capsule amygdalienne et le muscle constricteur du pharynx.<br>\n      • Triade : <strong>Trismus serré</strong>, otalgie réflexe, odynophagie majeure unilatérale avec voix étouffée.<br>\n      • Examen : Amygdale refoulée vers le bas et le dedans, pilier antérieur bombé, luette œdématiée déviée du côté opposé.<br>\n      • Traitement : Ponction évacuatrice au point de bombement maximum (ou incision) + Augmentin IV.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
}
,
{
  "id": "fiche_orl_obstruction_nasale_et_epistaxis",
  "slug": "orl-obstruction-nasale-et-epistaxis",
  "title": "Fiche Flash : 1. Obstruction Nasale & Épistaxis Grave",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 1. Obstruction Nasale & Épistaxis Grave",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Rappels Anatomiques & Vascularisation Nasale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La muqueuse nasale présente une vascularisation extrêmement riche issue du système <strong>Carotide Externe</strong> (artère sphénopalatine) et du système <strong>Carotide Interne</strong> (artères éthmoïdales antérieure et postérieure).\n  </p>\n  <div class=\"p-4 my-4 rounded-2xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20\">\n    <div class=\"flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold mb-1\">\n      🩸 Zone Cardinale : La Tache Vasculaire de Kiesselbach\n    </div>\n    <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n      Située à la partie antéro-inférieure du septum nasal, la <strong>tache vasculaire (plexus de Kiesselbach)</strong> est le siège de plus de 90% des épistaxis bénignes de l'enfant et du sujet jeune.\n    </p>\n  </div>\n</section>\n\n<section id=\"epistaxis\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Conduite à Tenir d'Urgence devant une Épistaxis Grave</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'épistaxis est une urgence médico-chirurgicale fréquente. L'appréciation du retentissement hémodynamique (pouls, tension artérielle, choc) prime sur l'examen otorhinolaryngologique.\n  </p>\n\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6\">\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 dark:text-brand-400 mb-2\">1. Tamponnement Antérieur</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Mèche grasse ou éponge résorbable (Merocel) introduite d'avant en arrière parallèlement au plancher des fosses nasales pendant 48 heures.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-amber-600 dark:text-amber-400 mb-2\">2. Tamponnement Postérieur / Ballonnets</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Indiqué si l'épistaxis persiste malgré le tamponnement antérieur. Réalisé sous couverture antibiotique.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-rose-600 dark:text-rose-400 mb-2\">3. Embolisation & Ligature</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">En cas d'échec : embolisation de l'artère maxillaire interne sous angiographie ou ligature sous endoscopie de l'artère sphénopalatine.</p>\n    </div>\n  </div>\n</section>\n\n<section id=\"obstruction\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Étiologies de l'Obstruction Nasale</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Nourrisson :</strong> Atrésie choanale (urgence vitale si bilatérale), corps étranger nasal méconnu (rhinorrhée unilatérale fétide).\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Jeune Homme :</strong> <em>Angiofibrome nasopharyngien juvénile</em> (fibrome nasopharyngien) se révélant par une obstruction nasale avec épistaxis récidivantes massives.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez l'Adulte :</strong> Déviation septale, hypertrophie des cornets, polypose naso-sinusienne, cancers du nasopharynx (UCN).\n    </div>\n  </div>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés & Pièges Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/50 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 À RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5 leading-relaxed\">\n      <li>• Épistaxis + rhinorrhée fétide purulente unilatérale chez l'enfant = Corps étranger nasal méconnu jusqu'à preuve du contraire.</li>\n      <li>• Épistaxis à répétition chez un adolescent masculin = Évoquer impérativement le fibrome nasopharyngien (contre-indication absolue à la biopsie !).</li>\n      <li>• La tache vasculaire est située dans la partie antéro-inférieure du septum nasal.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_cancers_des_voies_aero_digestives_superieures_vads",
  "slug": "orl-cancers-des-voies-aero-digestives-superieures-vads",
  "title": "Fiche Flash : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épidémiologie & Facteurs de Risque</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Plus de 90% des cancers des VADS sont des <strong>carcinomes épidermoïdes</strong>. La synergie alcoolo-tabagique constitue le facteur de risque majeur pour la cavité buccale, l'oropharynx, le hypopharynx et le larynx.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200\">\n      <strong>HPV (Human Papillomavirus 16) :</strong> Responsable d'une incidence croissante des cancers de l'oropharynx (amygdales, base de langue) chez des sujets plus jeunes et non-fumeurs.\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>EBV (Virus d'Epstein-Barr) :</strong> Associé de façon constante aux Carcinomes Nasopharyngés (UCN / Undifferentiated Carcinoma of Nasopharyngeal Type) endémiques au Maghreb.\n    </div>\n  </div>\n</section>\n\n<section id=\"clinique\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Examen Clinique & Panendoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Devant toute <strong>adénopathie cervicale chronique de l'adulte (> 3 semaines)</strong>, dure, indolore et fixe, un cancer des VADS doit être recherché systématiquement par l'examen ORL complet et la nasofibroscopie.\n  </p>\n  <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 mb-4\">\n    <strong>Panendoscopie des VADS sous AG :</strong> Indispensable pour la biopsie de la lésion primitive, la recherche d'une seconde localisation synchrone (10 à 15% des cas) et le bilan d'extension.\n  </div>\n</section>\n\n<section id=\"ucn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Carcinome du Nasopharynx (UCN)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Le cancer du cavum (UCN) se caractérise par sa triade évocatrice : <strong>Otite séro-muqueuse unilatérale</strong> de l'adulte, adénopathie cervicale haute sous-digastrique et atteinte des nerfs crâniens (diplopie par atteinte du VI, névralgie du V).\n  </p>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5\">\n      <li>• Otite séro-muqueuse unilatérale chez l'adulte = Examen impératif du cavum (nasopharynx).</li>\n      <li>• L'UCN est très radiosensible et chimiosensible (traitement basé sur la radio-chimiothérapie).</li>\n      <li>• La panendoscopie des VADS est obligatoire avant toute décision thérapeutique.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_traumatismes_du_cou_et_de_la_face",
  "slug": "orl-traumatismes-du-cou-et-de-la-face",
  "title": "Fiche Flash : 3. Traumatismes de la Face et du Cou",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 3. Traumatismes de la Face et du Cou",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"opn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Fractures des Os Propres du Nez (OPN) & Hématome de Cloison</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La fracture des OPN est la plus fréquente des fractures de la face. L'examen otorhinolaryngologique précoce doit systématiquement rechercher une urgence chirurgicale : <strong>l'hématome de cloison nasal</strong>.\n  </p>\n  <div class=\"p-4 my-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n    <strong>⚠️ Urgence Médicale : Hématome de Cloison</strong><br>\n    Se manifeste par une obstruction nasale bilatérale avec tuméfaction violacée, lisse et fluctuante de la cloison nasale. <em>Risque évolutif :</em> Nécrose du cartilage septal avec ensellement nasal définitif et médiastinite. Drainage chirurgical en urgence sous couverture antibiotique.\n  </div>\n</section>\n\n<section id=\"lefort\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Fractures de Le Fort (Massif Facial Middle-Face)</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort I (Disjonction basilaire) :</strong> Trait horizontal au-dessus de l'arcade dentaire supérieure détachant l'arcade alvéolo-dentaire du reste du massif maxillaire.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort II (Disjonction pyramido-naso-maxillaire) :</strong> Trait pyramidal passant par la racine du nez, la paroi médiale de l'orbite et le rebord orbitaire inférieur.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort III (Disjonction cranio-faciale totale) :</strong> Trait haut séparant l'ensemble du massif facial de la base du crâne.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_tumefactions_cervicales",
  "slug": "orl-diagnostic-des-tumefactions-cervicales",
  "title": "Fiche Flash : 4. Diagnostic des Tuméfactions Cervicales",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 4. Diagnostic des Tuméfactions Cervicales",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"orientations\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Démarche Diagnostique devant une Masse Cervicale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'âge et la topographie (médiane ou latérale) constituent les deux facteurs majeurs d'orientation étiologique.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200\">\n      <strong>Chez l'Enfant / Sujet Jeune (< 30 ans) :</strong> Origine infectieuse (adénite, adénophlegmon) ou malformation congénitale (kyste du tractus thyréoglosse, kyste amygdaloïde).\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>Chez l'Adulte (> 40 ans) :</strong> Origine tumorale ganglionnaire secondaire (métastase d'un carcinome des VADS) jusqu'à preuve du contraire !\n    </div>\n  </div>\n</section>\n\n<section id=\"congenitales\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Tuméfactions Congénitales Médianes & Latérales</h2>\n  <div class=\"space-y-4\">\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste du Tractus Thyréoglosse (KTT)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction médiane, sous-hyoïdienne, <strong>mobile à la déglutition et à la protraction de la langue</strong> (trajet résiduel du tractus thyréoglosse).\n      </p>\n    </div>\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste Amygdaloïde (Fente Branchiale)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction latéro-cervicale haute, le long du bord antérieur du muscle sternocléidomastoïdien.\n      </p>\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_pathologies_de_l_oreille_externe",
  "slug": "orl-pathologies-de-l-oreille-externe",
  "title": "Fiche Flash : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "30 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"otite-externe\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Externe Aiguë Diffuse</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection dermo-épidermique du conduit auditif externe (CAE), favorisée par les baignades et le nettoyage micro-traumatique par coton-tige. Germe prédominant : <strong>Pseudomonas aeruginosa</strong> (Bacille Pyocyanique).\n  </p>\n  <div class=\"p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-navy-900/60 mb-4\">\n    <strong>Clinique :</strong> Otalgie violente, vivement exacerbée par la <em>pression sur le tragus</em> et la <em>traction du pavillon</em>. Tympan normal mais difficile à visualiser en raison de l'œdème sténosant du conduit.\n  </div>\n</section>\n\n<section id=\"oem\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Otite Externe Nécrosante Maligne (OEM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Osteomyélite du rocher d'origine pseudomonadique survenant chez le <strong>diabétique âgé ou l'immunodéprimé</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Signes d'Alerte et Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otalgie insomniante rebelle aux antalgiques avec otorrhée purulente et bourgeon de granulation au plancher du conduit.</li>\n      <li>• Complications neurologiques : Atteinte du nerf facial (VII) à la partie postérieure du conduit, puis des nerfs crâniens inférieurs (IX, X, XI au trou déchiré postérieur).</li>\n      <li>• Traitement : Antibiothérapie antipyocyanique prolongée IV (Ceftazidime + Ciprofloxacine) et équilibre du diabète.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otite_moyenne_aigue_oma",
  "slug": "orl-otite-moyenne-aigue-oma",
  "title": "Fiche Flash : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"germes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Étiopathogénie & Bactériologie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'OMA fait suite à une rhinopharyngite aiguë par dysfonctionnement de la trompe d'Eustache. Principaux germes : <strong>Haemophilus influenzae</strong> (syndrome otite-conjonctivite) et <strong>Streptococcus pneumoniae</strong> (Pneumocoque, le plus fébrile et algique).\n  </p>\n</section>\n\n<section id=\"stades\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Stades Otoscopiques</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200\">\n      <strong>1. OMA Congestive :</strong> Tympan rosé ou érythémateux avec conservation des reliefs osseux. Traitement antalgique/antipyrique sans antibiotique d'emblée.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>2. OMA Collectée :</strong> Tympan bombé, dépoli, comblant les reliefs osseux. Indication à l'antibiothérapie par Amoxicilline (ou Augmentin si otite-conjonctivite).\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>3. OMA Perforée :</strong> Otorrhée purulente pulsatile spontanée soulageant l'otalgie.\n    </div>\n  </div>\n</section>\n\n<section id=\"complications\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Complications : La Mastoïdite Aiguë</h2>\n  <div class=\"p-4 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <strong>Mastoïdite Aiguë de l'Enfant :</strong> Décollement du pavillon de l'oreille avec comblement et œdème rétro-auriculaire douloureux. Hospitalisation, scanner du rocher et paracentèse / antibiothérapie IV ± mastoïdatesctomie.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinosinusites_aigues_et_chroniques",
  "slug": "orl-rhinosinusites-aigues-et-chroniques",
  "title": "Fiche Flash : 7. Les Rhinosinusites Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 7. Les Rhinosinusites Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"maxillaire\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Sinusite Maxillaire Aiguë de l'Adulte</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection aiguë du sinus maxillaire. Critères diagnostiques d'une surinfection bactérienne (nécessitant Amoxicilline) : au moins 2 critères majeurs (douleur sous-orbitaire unilatérale throbbing, mouchage purulente, fièvre > 38.5°C).\n  </p>\n</section>\n\n<section id=\"ethmoidite\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Éthmoïdite Aiguë de l'Enfant (Urgence Vitale)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Éthmoïdite Aiguë du Nourrisson</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Seul sinus développé dès la naissance. Clinique : <strong>Œdème palpebral unilatéral douloureux</strong> à prédominance médiale avec fièvre élevée.<br>\n      <em>Stade collecté (Abcès sous-périosté orbitaire) :</em> Exophtalmie, mydriase, immobilité oculaire. Scanner orbito-encéphalique en urgence et drainage.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_corps_etrangers_en_orl",
  "slug": "orl-corps-etrangers-en-orl",
  "title": "Fiche Flash : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"penetration\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Le Syndrome de Pénétration (Élément Pathognomonique)</h2>\n  <div class=\"p-5 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30\">\n    <strong>Clinique Cardinal :</strong> Accès de suffocation brutal, tirage, cyanose, toux quinteuse expulsative expiratoire survenant lors du jeu ou d'un repas chez un enfant de 6 mois à 3 ans (cacahuète, petit objet). L'interrogatoire retrouve systématiquement cet épisode inaugural.\n  </div>\n</section>\n\n<section id=\"localisation\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Prise en Charge & Bronchoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Toute suspicion de corps étranger des voies aériennes impose la réalisation d'une <strong>endoscopie au tube rigide sous AG</strong> pour extraction au tube optique.\n  </p>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otites_moyennes_chroniques_et_cholesteatome",
  "slug": "orl-otites-moyennes-chroniques-et-cholesteatome",
  "title": "Fiche Flash : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"osm\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Séro-Muqueuse (OSM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Épanchement rétro-tympanique chronique (> 3 mois) à tympan fermé sans signe d'inflammation aiguë. Première cause de surdité de transmission chez l'enfant.\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20 mb-4\">\n    <strong>Otoscopie :</strong> Tympan dépoli, rétracté, ambré/jaunâtre avec bulles ou niveau liquide. <em>Traitement :</em> Aérateurs transtympaniques (yoyos) ± adénoïdectomie.\n  </div>\n</section>\n\n<section id=\"cholesteatome\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Cholestéatome (OMC Dangereuse)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Présence d'épithélium pavimenteux stratifié kératinisé dans les cavités de l'oreille moyenne. Caractérisé par son pouvoir <strong>ostéolytique destructeur</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🔍 Otoscopie & Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otoscopie : Perforation atticale ou marginale comblée par des squames blanchâtres fétides.</li>\n      <li>• Complications : Fistule labyrinthique (vertige déclenché par la pression du conduit = Signe de la fistule), paralysie faciale périphérique (VII), méningite et abcès du cerveau.</li>\n      <li>• Traitement : Toujours chirurgical (tympanoplastie d'éradication).</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_surdites",
  "slug": "orl-diagnostic-des-surdites",
  "title": "Fiche Flash : 10. Diagnostic des Surdités (Transmission vs Perception)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 10. Diagnostic des Surdités (Transmission vs Perception)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"diapason\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épreuves au Diapason (Weber & Rinne)</h2>\n  <div class=\"overflow-x-auto mb-6\">\n    <table class=\"w-full text-left border-collapse border border-slate-200 dark:border-navy-700 rounded-xl overflow-hidden text-xs\">\n      <thead class=\"bg-slate-100 dark:bg-navy-800 font-bold uppercase text-navy-700 dark:text-navy-200\">\n        <tr>\n          <th class=\"p-3 border\">Type de Surdité</th>\n          <th class=\"p-3 border text-center\">Test de Weber (Vortex)</th>\n          <th class=\"p-3 border text-center\">Test de Rinne (CO vs CA)</th>\n        </tr>\n      </thead>\n      <tbody class=\"divide-y divide-slate-100 dark:divide-navy-800\">\n        <tr>\n          <td class=\"p-3 font-bold text-brand-600\">Surdité de Transmission</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté malade</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Négatif</strong> (CO > CA)</td>\n        </tr>\n        <tr>\n          <td class=\"p-3 font-bold text-purple-600\">Surdité de Perception</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté sain</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Positif</strong> (CA > CO mais abaissés)</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</section>\n\n<section id=\"audiometrie\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Audiométrie & Impédancemétrie</h2>\n  <ul class=\"space-y-3 text-sm text-navy-700 dark:text-navy-300\">\n    <li>• <strong>Surdité de Transmission :</strong> Conduction osseuse (CO) normale, courbe de conduction aérienne (CA) abaissée (existence d'un Rink / rinne audiométrique). Tympanogramme plat (épanchement OSM) ou réflexe stapedien absent (otospongiose).</li>\n    <li>• <strong>Surdité de Perception :</strong> Courbes CO et CA superposées et abaissées. Otospongiose (surdité de transmission à tympan normal avec coche de Carhart à 2000 Hz). Neurinome de l'acoustique (surdité de perception rétro-cochléaire unilatérale progressive).</li>\n  </ul>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_vertiges",
  "slug": "orl-diagnostic-des-vertiges",
  "title": "Fiche Flash : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"syndromes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Syndrome Vestibulaire Périphérique vs Central</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20\">\n      <h3 class=\"font-bold text-teal-900 mb-2\">Syndrome Périphérique (Harmonieux)</h3>\n      • Vertige rotatoire intense avec signes neuro-végétatifs (vomissements).<br>\n      • <strong>Nystagmus horizontal ou horizono-rotatoire</strong> battant du côté opposé à la lésion (phase rapide vers le côté sain).<br>\n      • Déviations toniques (Romberg, Fukuda) du <em>côté lésé</em>.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n      <h3 class=\"font-bold text-rose-950 mb-2\">Syndrome Central (Dysharmonieux)</h3>\n      • Vertige souvent flou ou sensation d'instabilité.<br>\n      • Nystagmus pur (vertical, rotatoire pur ou multidirectionnel).<br>\n      • Déviations toniques non concordantes (évoquer un AVC du tronc cérébral / cérébelleux).\n    </div>\n  </div>\n</section>\n\n<section id=\"vppb\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Vertige Positionnel Paroxystique Bénin (VPPB)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Dû à une lithiase des canaux semi-circulaires (canal postérieur +++). Vertige très bref (< 1 minute), violent, déclenché par les changements de position de la tête.\n  </p>\n  <div class=\"p-4 rounded-xl bg-indigo-50 border border-indigo-200 mb-4\">\n    <strong>Diagnostic :</strong> Manœuvre de Dix-Hallpike (déclenche le vertige et le nystagmus épuisable avec latence). <em>Traitement :</em> Manœuvre libératoire de Semont ou Epley.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_dyspnees_laryngees_aigues_et_chroniques",
  "slug": "orl-dyspnees-laryngees-aigues-et-chroniques",
  "title": "Fiche Flash : 12. Dyspnées Laryngées Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 12. Dyspnées Laryngées Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"triade\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Triade Clinique de la Dyspnée Laryngée</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Triade Pathognomonique</h3>\n    <ol class=\"list-decimal pl-5 text-sm text-rose-900 dark:text-rose-200 space-y-1\">\n      <li><strong>Bradypnée Inspiratoire :</strong> Ralentissement de la fréquence respiratoire avec allongement de l'inspiration.</li>\n      <li><strong>Tirage Inspiratoire :</strong> Dépression des parties meubles (sus-sternale, sus-claviculaire et intercostale).</li>\n      <li><strong>Bruit Inspiratoire :</strong> Stridor (aigu, laryngé haut) ou Cornage (grave, sous-glottique).</li>\n    </ol>\n  </div>\n</section>\n\n<section id=\"etiologies\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Laryngites Aiguës Pédiatriques</h2>\n  <div class=\"space-y-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Laryngite Aiguë Sous-Glottique (Virale) :</strong> La plus fréquente (6 mois - 3 ans). Toux rauque, voix modifiée, bradypnée inspiratoire nocturne. Traitement : Corticothérapie orale (Dexaméthasone ou Solupred) ± nébulisation d'Adrénaline.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-100 border border-rose-300\">\n      <strong>Épiglottite Aiguë (Haemophilus influenzae b) :</strong> Urgence extrême ! Dysphagie majeure avec bavage d'interdiction, position assise penchée en avant obligatoire, voix étouffée (\"patate chaude\"). <em>Contre-indication absolue à l'abaisse-langue !</em> Intubation en milieu chirurgical.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinopharyngites_et_angines",
  "slug": "orl-rhinopharyngites-et-angines",
  "title": "Fiche Flash : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"tdr\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Classification des Angines & Test TDR</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Les angines sont érythémateuses (rouges) ou érythémato-pultacées (blanches) dans 80% des cas. La majorité est d'origine virale. Seul le <strong>Streptocoque Bêta-Hémolytique du Groupe A (SGA)</strong> justifie une antibiothérapie (Amoxicilline 6 jours) pour prévenir le Rhumatisme Articulaire Aigu (RAA).\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 mb-4\">\n    <strong>Test Rapide d'Orientation Diagnostique (TDR) :</strong> Réalisé au cabinet par frottis amygdalien. Si positif = Antibiothérapie Amoxicilline. Si négatif = Traitement symptomatique uniquement.\n  </div>\n</section>\n\n<section id=\"formes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Angines Particulières</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-purple-50 border border-purple-200\">\n      <strong>Angines Vésiculeuses (Virales) :</strong> Herpangine (Virus Coxsackie A) avec petites vésicules pharyngées, syndrome pied-main-bouche.\n    </div>\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Angine de Vincent (Ulcéro-nécrotique unilatérale) :</strong> Association fuso-spirillaire chez un sujet à mauvaise hygiène bucco-dentaire. Haleine fétide.\n    </div>\n  </div>\n</section>\n\n<section id=\"phlegmon\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Phlegmon Péri-Amygdalien (Complication Suppurée)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Clinique & Ponction</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Suppuration entre la capsule amygdalienne et le muscle constricteur du pharynx.<br>\n      • Triade : <strong>Trismus serré</strong>, otalgie réflexe, odynophagie majeure unilatérale avec voix étouffée.<br>\n      • Examen : Amygdale refoulée vers le bas et le dedans, pilier antérieur bombé, luette œdématiée déviée du côté opposé.<br>\n      • Traitement : Ponction évacuatrice au point de bombement maximum (ou incision) + Augmentin IV.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
}
,
{
  "id": "fiche_orl_obstruction_nasale_et_epistaxis",
  "slug": "orl-obstruction-nasale-et-epistaxis",
  "title": "Fiche Flash : 1. Obstruction Nasale & Épistaxis Grave",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 1. Obstruction Nasale & Épistaxis Grave",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Rappels Anatomiques & Vascularisation Nasale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La muqueuse nasale présente une vascularisation extrêmement riche issue du système <strong>Carotide Externe</strong> (artère sphénopalatine) et du système <strong>Carotide Interne</strong> (artères éthmoïdales antérieure et postérieure).\n  </p>\n  <div class=\"p-4 my-4 rounded-2xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/50 dark:bg-rose-950/20\">\n    <div class=\"flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold mb-1\">\n      🩸 Zone Cardinale : La Tache Vasculaire de Kiesselbach\n    </div>\n    <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n      Située à la partie antéro-inférieure du septum nasal, la <strong>tache vasculaire (plexus de Kiesselbach)</strong> est le siège de plus de 90% des épistaxis bénignes de l'enfant et du sujet jeune.\n    </p>\n  </div>\n</section>\n\n<section id=\"epistaxis\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Conduite à Tenir d'Urgence devant une Épistaxis Grave</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'épistaxis est une urgence médico-chirurgicale fréquente. L'appréciation du retentissement hémodynamique (pouls, tension artérielle, choc) prime sur l'examen otorhinolaryngologique.\n  </p>\n\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6\">\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 dark:text-brand-400 mb-2\">1. Tamponnement Antérieur</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Mèche grasse ou éponge résorbable (Merocel) introduite d'avant en arrière parallèlement au plancher des fosses nasales pendant 48 heures.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-amber-600 dark:text-amber-400 mb-2\">2. Tamponnement Postérieur / Ballonnets</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">Indiqué si l'épistaxis persiste malgré le tamponnement antérieur. Réalisé sous couverture antibiotique.</p>\n    </div>\n    <div class=\"p-4 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n      <h3 class=\"font-bold text-rose-600 dark:text-rose-400 mb-2\">3. Embolisation & Ligature</h3>\n      <p class=\"text-xs text-navy-600 dark:text-navy-300\">En cas d'échec : embolisation de l'artère maxillaire interne sous angiographie ou ligature sous endoscopie de l'artère sphénopalatine.</p>\n    </div>\n  </div>\n</section>\n\n<section id=\"obstruction\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Étiologies de l'Obstruction Nasale</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Nourrisson :</strong> Atrésie choanale (urgence vitale si bilatérale), corps étranger nasal méconnu (rhinorrhée unilatérale fétide).\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez le Jeune Homme :</strong> <em>Angiofibrome nasopharyngien juvénile</em> (fibrome nasopharyngien) se révélant par une obstruction nasale avec épistaxis récidivantes massives.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800\">\n      <strong>Chez l'Adulte :</strong> Déviation septale, hypertrophie des cornets, polypose naso-sinusienne, cancers du nasopharynx (UCN).\n    </div>\n  </div>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés & Pièges Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/50 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 À RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5 leading-relaxed\">\n      <li>• Épistaxis + rhinorrhée fétide purulente unilatérale chez l'enfant = Corps étranger nasal méconnu jusqu'à preuve du contraire.</li>\n      <li>• Épistaxis à répétition chez un adolescent masculin = Évoquer impérativement le fibrome nasopharyngien (contre-indication absolue à la biopsie !).</li>\n      <li>• La tache vasculaire est située dans la partie antéro-inférieure du septum nasal.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_cancers_des_voies_aero_digestives_superieures_vads",
  "slug": "orl-cancers-des-voies-aero-digestives-superieures-vads",
  "title": "Fiche Flash : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 2. Cancers des Voies Aéro-Digestives Supérieures (VADS)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"intro\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épidémiologie & Facteurs de Risque</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Plus de 90% des cancers des VADS sont des <strong>carcinomes épidermoïdes</strong>. La synergie alcoolo-tabagique constitue le facteur de risque majeur pour la cavité buccale, l'oropharynx, le hypopharynx et le larynx.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200\">\n      <strong>HPV (Human Papillomavirus 16) :</strong> Responsable d'une incidence croissante des cancers de l'oropharynx (amygdales, base de langue) chez des sujets plus jeunes et non-fumeurs.\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>EBV (Virus d'Epstein-Barr) :</strong> Associé de façon constante aux Carcinomes Nasopharyngés (UCN / Undifferentiated Carcinoma of Nasopharyngeal Type) endémiques au Maghreb.\n    </div>\n  </div>\n</section>\n\n<section id=\"clinique\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Examen Clinique & Panendoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Devant toute <strong>adénopathie cervicale chronique de l'adulte (> 3 semaines)</strong>, dure, indolore et fixe, un cancer des VADS doit être recherché systématiquement par l'examen ORL complet et la nasofibroscopie.\n  </p>\n  <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 mb-4\">\n    <strong>Panendoscopie des VADS sous AG :</strong> Indispensable pour la biopsie de la lésion primitive, la recherche d'une seconde localisation synchrone (10 à 15% des cas) et le bilan d'extension.\n  </div>\n</section>\n\n<section id=\"ucn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Carcinome du Nasopharynx (UCN)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Le cancer du cavum (UCN) se caractérise par sa triade évocatrice : <strong>Otite séro-muqueuse unilatérale</strong> de l'adulte, adénopathie cervicale haute sous-digastrique et atteinte des nerfs crâniens (diplopie par atteinte du VI, névralgie du V).\n  </p>\n</section>\n\n<section id=\"points-cles\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Points Clés Concours</h2>\n  <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 space-y-2\">\n    <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-sm\">📌 RETENIR ABSOLUMENT :</div>\n    <ul class=\"text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5\">\n      <li>• Otite séro-muqueuse unilatérale chez l'adulte = Examen impératif du cavum (nasopharynx).</li>\n      <li>• L'UCN est très radiosensible et chimiosensible (traitement basé sur la radio-chimiothérapie).</li>\n      <li>• La panendoscopie des VADS est obligatoire avant toute décision thérapeutique.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_traumatismes_du_cou_et_de_la_face",
  "slug": "orl-traumatismes-du-cou-et-de-la-face",
  "title": "Fiche Flash : 3. Traumatismes de la Face et du Cou",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 3. Traumatismes de la Face et du Cou",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"opn\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Fractures des Os Propres du Nez (OPN) & Hématome de Cloison</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    La fracture des OPN est la plus fréquente des fractures de la face. L'examen otorhinolaryngologique précoce doit systématiquement rechercher une urgence chirurgicale : <strong>l'hématome de cloison nasal</strong>.\n  </p>\n  <div class=\"p-4 my-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n    <strong>⚠️ Urgence Médicale : Hématome de Cloison</strong><br>\n    Se manifeste par une obstruction nasale bilatérale avec tuméfaction violacée, lisse et fluctuante de la cloison nasale. <em>Risque évolutif :</em> Nécrose du cartilage septal avec ensellement nasal définitif et médiastinite. Drainage chirurgical en urgence sous couverture antibiotique.\n  </div>\n</section>\n\n<section id=\"lefort\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Fractures de Le Fort (Massif Facial Middle-Face)</h2>\n  <div class=\"space-y-3\">\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort I (Disjonction basilaire) :</strong> Trait horizontal au-dessus de l'arcade dentaire supérieure détachant l'arcade alvéolo-dentaire du reste du massif maxillaire.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort II (Disjonction pyramido-naso-maxillaire) :</strong> Trait pyramidal passant par la racine du nez, la paroi médiale de l'orbite et le rebord orbitaire inférieur.\n    </div>\n    <div class=\"p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200\">\n      <strong>Le Fort III (Disjonction cranio-faciale totale) :</strong> Trait haut séparant l'ensemble du massif facial de la base du crâne.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_tumefactions_cervicales",
  "slug": "orl-diagnostic-des-tumefactions-cervicales",
  "title": "Fiche Flash : 4. Diagnostic des Tuméfactions Cervicales",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 4. Diagnostic des Tuméfactions Cervicales",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"orientations\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Démarche Diagnostique devant une Masse Cervicale</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'âge et la topographie (médiane ou latérale) constituent les deux facteurs majeurs d'orientation étiologique.\n  </p>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200\">\n      <strong>Chez l'Enfant / Sujet Jeune (< 30 ans) :</strong> Origine infectieuse (adénite, adénophlegmon) ou malformation congénitale (kyste du tractus thyréoglosse, kyste amygdaloïde).\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>Chez l'Adulte (> 40 ans) :</strong> Origine tumorale ganglionnaire secondaire (métastase d'un carcinome des VADS) jusqu'à preuve du contraire !\n    </div>\n  </div>\n</section>\n\n<section id=\"congenitales\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Tuméfactions Congénitales Médianes & Latérales</h2>\n  <div class=\"space-y-4\">\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste du Tractus Thyréoglosse (KTT)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction médiane, sous-hyoïdienne, <strong>mobile à la déglutition et à la protraction de la langue</strong> (trajet résiduel du tractus thyréoglosse).\n      </p>\n    </div>\n    <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 shadow-sm\">\n      <h3 class=\"font-bold text-brand-600 mb-1\">🎯 Kyste Amygdaloïde (Fente Branchiale)</h3>\n      <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n        Tuméfaction latéro-cervicale haute, le long du bord antérieur du muscle sternocléidomastoïdien.\n      </p>\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_pathologies_de_l_oreille_externe",
  "slug": "orl-pathologies-de-l-oreille-externe",
  "title": "Fiche Flash : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "30 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 5. Pathologies de l'Oreille Externe & Otite Externe Maligne",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"otite-externe\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Externe Aiguë Diffuse</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection dermo-épidermique du conduit auditif externe (CAE), favorisée par les baignades et le nettoyage micro-traumatique par coton-tige. Germe prédominant : <strong>Pseudomonas aeruginosa</strong> (Bacille Pyocyanique).\n  </p>\n  <div class=\"p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-navy-900/60 mb-4\">\n    <strong>Clinique :</strong> Otalgie violente, vivement exacerbée par la <em>pression sur le tragus</em> et la <em>traction du pavillon</em>. Tympan normal mais difficile à visualiser en raison de l'œdème sténosant du conduit.\n  </div>\n</section>\n\n<section id=\"oem\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Otite Externe Nécrosante Maligne (OEM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Osteomyélite du rocher d'origine pseudomonadique survenant chez le <strong>diabétique âgé ou l'immunodéprimé</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Signes d'Alerte et Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otalgie insomniante rebelle aux antalgiques avec otorrhée purulente et bourgeon de granulation au plancher du conduit.</li>\n      <li>• Complications neurologiques : Atteinte du nerf facial (VII) à la partie postérieure du conduit, puis des nerfs crâniens inférieurs (IX, X, XI au trou déchiré postérieur).</li>\n      <li>• Traitement : Antibiothérapie antipyocyanique prolongée IV (Ceftazidime + Ciprofloxacine) et équilibre du diabète.</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otite_moyenne_aigue_oma",
  "slug": "orl-otite-moyenne-aigue-oma",
  "title": "Fiche Flash : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 6. L'Otite Moyenne Aiguë (OMA) & Complications",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"germes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Étiopathogénie & Bactériologie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    L'OMA fait suite à une rhinopharyngite aiguë par dysfonctionnement de la trompe d'Eustache. Principaux germes : <strong>Haemophilus influenzae</strong> (syndrome otite-conjonctivite) et <strong>Streptococcus pneumoniae</strong> (Pneumocoque, le plus fébrile et algique).\n  </p>\n</section>\n\n<section id=\"stades\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Stades Otoscopiques</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\">\n    <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200\">\n      <strong>1. OMA Congestive :</strong> Tympan rosé ou érythémateux avec conservation des reliefs osseux. Traitement antalgique/antipyrique sans antibiotique d'emblée.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200\">\n      <strong>2. OMA Collectée :</strong> Tympan bombé, dépoli, comblant les reliefs osseux. Indication à l'antibiothérapie par Amoxicilline (ou Augmentin si otite-conjonctivite).\n    </div>\n    <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200\">\n      <strong>3. OMA Perforée :</strong> Otorrhée purulente pulsatile spontanée soulageant l'otalgie.\n    </div>\n  </div>\n</section>\n\n<section id=\"complications\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Complications : La Mastoïdite Aiguë</h2>\n  <div class=\"p-4 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <strong>Mastoïdite Aiguë de l'Enfant :</strong> Décollement du pavillon de l'oreille avec comblement et œdème rétro-auriculaire douloureux. Hospitalisation, scanner du rocher et paracentèse / antibiothérapie IV ± mastoïdatesctomie.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinosinusites_aigues_et_chroniques",
  "slug": "orl-rhinosinusites-aigues-et-chroniques",
  "title": "Fiche Flash : 7. Les Rhinosinusites Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 7. Les Rhinosinusites Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"maxillaire\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Sinusite Maxillaire Aiguë de l'Adulte</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Infection aiguë du sinus maxillaire. Critères diagnostiques d'une surinfection bactérienne (nécessitant Amoxicilline) : au moins 2 critères majeurs (douleur sous-orbitaire unilatérale throbbing, mouchage purulente, fièvre > 38.5°C).\n  </p>\n</section>\n\n<section id=\"ethmoidite\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Éthmoïdite Aiguë de l'Enfant (Urgence Vitale)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Éthmoïdite Aiguë du Nourrisson</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Seul sinus développé dès la naissance. Clinique : <strong>Œdème palpebral unilatéral douloureux</strong> à prédominance médiale avec fièvre élevée.<br>\n      <em>Stade collecté (Abcès sous-périosté orbitaire) :</em> Exophtalmie, mydriase, immobilité oculaire. Scanner orbito-encéphalique en urgence et drainage.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_corps_etrangers_en_orl",
  "slug": "orl-corps-etrangers-en-orl",
  "title": "Fiche Flash : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "35 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 8. Corps Étrangers en ORL & Syndrome de Pénétration",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"penetration\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Le Syndrome de Pénétration (Élément Pathognomonique)</h2>\n  <div class=\"p-5 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30\">\n    <strong>Clinique Cardinal :</strong> Accès de suffocation brutal, tirage, cyanose, toux quinteuse expulsative expiratoire survenant lors du jeu ou d'un repas chez un enfant de 6 mois à 3 ans (cacahuète, petit objet). L'interrogatoire retrouve systématiquement cet épisode inaugural.\n  </div>\n</section>\n\n<section id=\"localisation\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Prise en Charge & Bronchoscopie</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Toute suspicion de corps étranger des voies aériennes impose la réalisation d'une <strong>endoscopie au tube rigide sous AG</strong> pour extraction au tube optique.\n  </p>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_otites_moyennes_chroniques_et_cholesteatome",
  "slug": "orl-otites-moyennes-chroniques-et-cholesteatome",
  "title": "Fiche Flash : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 9. Les Otites Moyennes Chroniques (OMC) & Cholestéatome",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"osm\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Otite Séro-Muqueuse (OSM)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Épanchement rétro-tympanique chronique (> 3 mois) à tympan fermé sans signe d'inflammation aiguë. Première cause de surdité de transmission chez l'enfant.\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20 mb-4\">\n    <strong>Otoscopie :</strong> Tympan dépoli, rétracté, ambré/jaunâtre avec bulles ou niveau liquide. <em>Traitement :</em> Aérateurs transtympaniques (yoyos) ± adénoïdectomie.\n  </div>\n</section>\n\n<section id=\"cholesteatome\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Cholestéatome (OMC Dangereuse)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Présence d'épithélium pavimenteux stratifié kératinisé dans les cavités de l'oreille moyenne. Caractérisé par son pouvoir <strong>ostéolytique destructeur</strong>.\n  </p>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🔍 Otoscopie & Complications</h3>\n    <ul class=\"text-xs text-rose-900 dark:text-rose-200 space-y-1.5\">\n      <li>• Otoscopie : Perforation atticale ou marginale comblée par des squames blanchâtres fétides.</li>\n      <li>• Complications : Fistule labyrinthique (vertige déclenché par la pression du conduit = Signe de la fistule), paralysie faciale périphérique (VII), méningite et abcès du cerveau.</li>\n      <li>• Traitement : Toujours chirurgical (tympanoplastie d'éradication).</li>\n    </ul>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_surdites",
  "slug": "orl-diagnostic-des-surdites",
  "title": "Fiche Flash : 10. Diagnostic des Surdités (Transmission vs Perception)",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 10. Diagnostic des Surdités (Transmission vs Perception)",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"diapason\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Épreuves au Diapason (Weber & Rinne)</h2>\n  <div class=\"overflow-x-auto mb-6\">\n    <table class=\"w-full text-left border-collapse border border-slate-200 dark:border-navy-700 rounded-xl overflow-hidden text-xs\">\n      <thead class=\"bg-slate-100 dark:bg-navy-800 font-bold uppercase text-navy-700 dark:text-navy-200\">\n        <tr>\n          <th class=\"p-3 border\">Type de Surdité</th>\n          <th class=\"p-3 border text-center\">Test de Weber (Vortex)</th>\n          <th class=\"p-3 border text-center\">Test de Rinne (CO vs CA)</th>\n        </tr>\n      </thead>\n      <tbody class=\"divide-y divide-slate-100 dark:divide-navy-800\">\n        <tr>\n          <td class=\"p-3 font-bold text-brand-600\">Surdité de Transmission</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté malade</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Négatif</strong> (CO > CA)</td>\n        </tr>\n        <tr>\n          <td class=\"p-3 font-bold text-purple-600\">Surdité de Perception</td>\n          <td class=\"p-3 text-center\">Latéralisé du <strong>côté sain</strong></td>\n          <td class=\"p-3 text-center\"><strong>Rinne Positif</strong> (CA > CO mais abaissés)</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</section>\n\n<section id=\"audiometrie\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Audiométrie & Impédancemétrie</h2>\n  <ul class=\"space-y-3 text-sm text-navy-700 dark:text-navy-300\">\n    <li>• <strong>Surdité de Transmission :</strong> Conduction osseuse (CO) normale, courbe de conduction aérienne (CA) abaissée (existence d'un Rink / rinne audiométrique). Tympanogramme plat (épanchement OSM) ou réflexe stapedien absent (otospongiose).</li>\n    <li>• <strong>Surdité de Perception :</strong> Courbes CO et CA superposées et abaissées. Otospongiose (surdité de transmission à tympan normal avec coche de Carhart à 2000 Hz). Neurinome de l'acoustique (surdité de perception rétro-cochléaire unilatérale progressive).</li>\n  </ul>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_diagnostic_des_vertiges",
  "slug": "orl-diagnostic-des-vertiges",
  "title": "Fiche Flash : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 11. Diagnostic des Vertiges & Syndromes Vestibulaires",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"syndromes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Syndrome Vestibulaire Périphérique vs Central</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 dark:bg-teal-950/20\">\n      <h3 class=\"font-bold text-teal-900 mb-2\">Syndrome Périphérique (Harmonieux)</h3>\n      • Vertige rotatoire intense avec signes neuro-végétatifs (vomissements).<br>\n      • <strong>Nystagmus horizontal ou horizono-rotatoire</strong> battant du côté opposé à la lésion (phase rapide vers le côté sain).<br>\n      • Déviations toniques (Romberg, Fukuda) du <em>côté lésé</em>.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20\">\n      <h3 class=\"font-bold text-rose-950 mb-2\">Syndrome Central (Dysharmonieux)</h3>\n      • Vertige souvent flou ou sensation d'instabilité.<br>\n      • Nystagmus pur (vertical, rotatoire pur ou multidirectionnel).<br>\n      • Déviations toniques non concordantes (évoquer un AVC du tronc cérébral / cérébelleux).\n    </div>\n  </div>\n</section>\n\n<section id=\"vppb\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Vertige Positionnel Paroxystique Bénin (VPPB)</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Dû à une lithiase des canaux semi-circulaires (canal postérieur +++). Vertige très bref (< 1 minute), violent, déclenché par les changements de position de la tête.\n  </p>\n  <div class=\"p-4 rounded-xl bg-indigo-50 border border-indigo-200 mb-4\">\n    <strong>Diagnostic :</strong> Manœuvre de Dix-Hallpike (déclenche le vertige et le nystagmus épuisable avec latence). <em>Traitement :</em> Manœuvre libératoire de Semont ou Epley.\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_dyspnees_laryngees_aigues_et_chroniques",
  "slug": "orl-dyspnees-laryngees-aigues-et-chroniques",
  "title": "Fiche Flash : 12. Dyspnées Laryngées Aiguës et Chroniques",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "40 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 12. Dyspnées Laryngées Aiguës et Chroniques",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"triade\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Triade Clinique de la Dyspnée Laryngée</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30 mb-4\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Triade Pathognomonique</h3>\n    <ol class=\"list-decimal pl-5 text-sm text-rose-900 dark:text-rose-200 space-y-1\">\n      <li><strong>Bradypnée Inspiratoire :</strong> Ralentissement de la fréquence respiratoire avec allongement de l'inspiration.</li>\n      <li><strong>Tirage Inspiratoire :</strong> Dépression des parties meubles (sus-sternale, sus-claviculaire et intercostale).</li>\n      <li><strong>Bruit Inspiratoire :</strong> Stridor (aigu, laryngé haut) ou Cornage (grave, sous-glottique).</li>\n    </ol>\n  </div>\n</section>\n\n<section id=\"etiologies\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Laryngites Aiguës Pédiatriques</h2>\n  <div class=\"space-y-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Laryngite Aiguë Sous-Glottique (Virale) :</strong> La plus fréquente (6 mois - 3 ans). Toux rauque, voix modifiée, bradypnée inspiratoire nocturne. Traitement : Corticothérapie orale (Dexaméthasone ou Solupred) ± nébulisation d'Adrénaline.\n    </div>\n    <div class=\"p-4 rounded-xl bg-rose-100 border border-rose-300\">\n      <strong>Épiglottite Aiguë (Haemophilus influenzae b) :</strong> Urgence extrême ! Dysphagie majeure avec bavage d'interdiction, position assise penchée en avant obligatoire, voix étouffée (\"patate chaude\"). <em>Contre-indication absolue à l'abaisse-langue !</em> Intubation en milieu chirurgical.\n    </div>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
},
{
  "id": "fiche_orl_rhinopharyngites_et_angines",
  "slug": "orl-rhinopharyngites-et-angines",
  "title": "Fiche Flash : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
  "specialtyId": "orl",
  "specialtyName": "Oto-Rhino-Laryngologie (ORL)",
  "category": "Fiche Flash & Synthèse",
  "estimatedReadTime": "45 min",
  "keyTakeaways": [
    "Fiche Flash Mémo : 13. Rhinopharyngites et Angines de l'Adulte et de l'Enfant",
    "Diagnostics, pièges au concours et conduite à tenir.",
    "Spécialité : Oto-Rhino-Laryngologie (ORL)"
  ],
  "accessLevel": "FREE",
  "published": true,
  "htmlContent": "\n<section id=\"tdr\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Classification des Angines & Test TDR</h2>\n  <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n    Les angines sont érythémateuses (rouges) ou érythémato-pultacées (blanches) dans 80% des cas. La majorité est d'origine virale. Seul le <strong>Streptocoque Bêta-Hémolytique du Groupe A (SGA)</strong> justifie une antibiothérapie (Amoxicilline 6 jours) pour prévenir le Rhumatisme Articulaire Aigu (RAA).\n  </p>\n  <div class=\"p-4 rounded-xl bg-teal-50 border border-teal-200 mb-4\">\n    <strong>Test Rapide d'Orientation Diagnostique (TDR) :</strong> Réalisé au cabinet par frottis amygdalien. Si positif = Antibiothérapie Amoxicilline. Si négatif = Traitement symptomatique uniquement.\n  </div>\n</section>\n\n<section id=\"formes\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Angines Particulières</h2>\n  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs\">\n    <div class=\"p-4 rounded-xl bg-purple-50 border border-purple-200\">\n      <strong>Angines Vésiculeuses (Virales) :</strong> Herpangine (Virus Coxsackie A) avec petites vésicules pharyngées, syndrome pied-main-bouche.\n    </div>\n    <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200\">\n      <strong>Angine de Vincent (Ulcéro-nécrotique unilatérale) :</strong> Association fuso-spirillaire chez un sujet à mauvaise hygiène bucco-dentaire. Haleine fétide.\n    </div>\n  </div>\n</section>\n\n<section id=\"phlegmon\" class=\"mb-10\">\n  <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Phlegmon Péri-Amygdalien (Complication Suppurée)</h2>\n  <div class=\"p-5 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-950/30\">\n    <h3 class=\"font-bold text-rose-950 dark:text-rose-100 mb-2\">🚨 Clinique & Ponction</h3>\n    <p class=\"text-xs text-rose-900 dark:text-rose-200 leading-relaxed\">\n      Suppuration entre la capsule amygdalienne et le muscle constricteur du pharynx.<br>\n      • Triade : <strong>Trismus serré</strong>, otalgie réflexe, odynophagie majeure unilatérale avec voix étouffée.<br>\n      • Examen : Amygdale refoulée vers le bas et le dedans, pilier antérieur bombé, luette œdématiée déviée du côté opposé.<br>\n      • Traitement : Ponction évacuatrice au point de bombement maximum (ou incision) + Augmentin IV.\n    </p>\n  </div>\n</section>\n",
  "updatedAt": "2026-09-30T00:00:00.000Z"
}
];