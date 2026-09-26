import { Course } from '@/types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'cours_pneumo_tb',
    slug: 'tuberculose-pulmonaire',
    title: 'La Tuberculose Pulmonaire Commune',
    subtitle: 'Diagnostic bactériologique, radiologique et protocole national de traitement antituberculeux',
    specialtyId: 'pneumo',
    specialtyName: 'Pneumologie',
    author: 'Pr. K. Benali',
    authorTitle: 'Chef de Service Pneumo-Phtisiologie - CHU Mustapha Bacha',
    description: 'Guide complet pour l\'externe et le médecin généraliste : de la primo-infection à la tuberculose maladie cavitaire, prise en charge selon les recommandations du Programme National Algérien.',
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
    difficulty: 'Incontournable',
    faculty: 'ORAN',
    rang: 'Rang A',
    estimatedDuration: '45 min',
    tags: ['Mycobacterium tuberculosis', 'Bacilloscopie', 'GeneXpert', 'Quadrithérapie', 'RHZE', 'Isolement respiratoire'],
    accessLevel: 'FREE', // Accessible en gratuit pour démo
    published: true,
    viewsCount: 3420,
    likesCount: 289,
    qcmCount: 8,
    tableOfContents: [
      { id: 'intro', title: '1. Introduction & Épidémiologie', level: 1 },
      { id: 'physio', title: '2. Physiopathologie & Transmission', level: 1 },
      { id: 'clinique', title: '3. Présentation Clinique', level: 1 },
      { id: 'radio', title: '4. Imagerie Thoracique', level: 1 },
      { id: 'bacterio', title: '5. Diagnostic Bactériologique (Clé de Voûte)', level: 1 },
      { id: 'traitement', title: '6. Prise en Charge Thérapeutique (Régime 2RHZE/4RH)', level: 1 },
      { id: 'points-cles', title: '7. Points Clés & Pièges aux Examens', level: 1 },
    ],
    summaryPoints: [
      'Transmission interhumaine stricte par gouttelettes de Flügge lors de la toux.',
      'Triade classique : Toux traînante > 3 semaines + Hémoptysie + Altération de l\'état général (AEG) avec sueurs nocturnes.',
      'Cliché thoracique : Infiltrats, nodules et cavernes prédominant aux sommets pulmonaires.',
      'Confirmation impérative par l\'examen direct (coloration de Ziehl-Neelsen) ou PCR rapide (GeneXpert MTB/RIF).',
      'Traitement national codifié : 2 mois de quadrithérapie (RHZE) puis 4 mois de bithérapie (RH) en prise unique matinale à jeun.'
    ],
    htmlContent: `
      <section id="intro" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">1. Introduction & Épidémiologie</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          La tuberculose reste un problème majeur de santé publique mondial et en Algérie. Elle est causée par une mycobactérie du complexe <em>Mycobacterium tuberculosis</em> (bacille de Koch ou BK). La forme pulmonaire est de loin la plus fréquente (>70% des cas) et représente la seule forme contagieuse.
        </p>
        <div class="p-4 my-4 rounded-xl border border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <div class="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold mb-1">
            <span class="text-lg">🎯</span> Objectif Résidanat / ECNi
          </div>
          <p class="text-sm text-navy-700 dark:text-navy-300">
            Savoir suspecter la tuberculose devant toute toux inexpliquée durant plus de 3 semaines, prescrire les bons prélèvements bactériologiques et instaurer sans délai la déclaration obligatoire et la quadrithérapie standardisée.
          </p>
        </div>
      </section>

      <section id="physio" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">2. Physiopathologie & Transmission</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          La contamination se fait par voie aéroportée à partir d'un patient bacillifère. Le bacille pénètre jusqu'aux alvéoles pulmonaires où il est phagocyté par les macrophages alvéolaires. Deux issues sont possibles :
        </p>
        <ul class="list-disc pl-6 space-y-2 text-navy-700 dark:text-navy-300 mb-4">
          <li><strong>Infection Tuberculeuse Latente (ITL) :</strong> Le système immunitaire cellulaire circonscrit l'infection sous forme de granulomes épithélioïdes et giganto-cellulaires avec nécrose caséeuse. Le patient est asymptomatique et non contagieux (90% des personnes immunocompétentes).</li>
          <li><strong>Tuberculose Maladie (TM) :</strong> Rupture de l'équilibre immunitaire (dénutrition, corticothérapie, diabète, VIH) conduisant à la liquéfaction du caséum, à la formation de cavernes et à la dissémination bronchique.</li>
        </ul>
      </section>

      <section id="clinique" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">3. Présentation Clinique</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          Le début est insidieux sur plusieurs semaines ou mois. Il associe des signes généraux et des signes respiratoires :
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="p-5 rounded-2xl bg-white dark:bg-navy-800/80 border border-navy-100 dark:border-navy-700 shadow-soft">
            <h3 class="font-bold text-navy-900 dark:text-white mb-2 flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-amber-500"></span> Signes Généraux (L'Imprégnation)
            </h3>
            <ul class="space-y-2 text-sm text-navy-600 dark:text-navy-300">
              <li>• Altération de l'état général (Asthénie, Anorexie, Amaigrissement chiffré)</li>
              <li>• Fièvre vespérale ou fébricule modérée</li>
              <li>• <strong>Sueurs nocturnes profuses</strong> très évocatrices</li>
            </ul>
          </div>
          <div class="p-5 rounded-2xl bg-white dark:bg-navy-800/80 border border-navy-100 dark:border-navy-700 shadow-soft">
            <h3 class="font-bold text-navy-900 dark:text-white mb-2 flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-rose-500"></span> Signes Fonctionnels Respiratoires
            </h3>
            <ul class="space-y-2 text-sm text-navy-600 dark:text-navy-300">
              <li>• <strong>Toux chronique productive</strong> > 3 semaines</li>
              <li>• Expectorations muco-purulentes ou hémoptoïques</li>
              <li>• <strong>Hémoptysie</strong> d'abondance variable (du crachat strié à l'inondation)</li>
              <li>• Douleur thoracique en cas d'atteinte pleurale adjacente</li>
            </ul>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 my-4">
          <div class="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold mb-1">
            ⚠️ Alerte Rouge : Hémoptysie Cataclysmique
          </div>
          <p class="text-sm text-navy-700 dark:text-navy-300">
            Une hémoptysie massive (> 200 ml/24h) constitue une urgence médico-chirurgicale vitale par asphyxie. Arrêt des manœuvres invasives, décubitus latéral du côté atteint, oxygénothérapie à haut débit, vasoconstricteurs (Terlipressine) et embolisation artérielle bronchique en urgence.
          </p>
        </div>
      </section>

      <section id="radio" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">4. Imagerie Thoracique</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          La radiographie thoracique de face et de profil est l'examen morphologique de première intention. Les lésions sont polymorphes et siègent préférentiellement dans les territoires bien aérés et riches en oxygène (segments apicaux et postérieurs des lobes supérieurs, et apex des lobes inférieurs).
        </p>
        <div class="overflow-x-auto my-4">
          <table class="min-w-full text-sm border-collapse rounded-xl overflow-hidden shadow-soft">
            <thead class="bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white font-semibold">
              <tr>
                <th class="p-3 text-left">Type de Lésion</th>
                <th class="p-3 text-left">Aspect Radiologique</th>
                <th class="p-3 text-left">Signification Clinique</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-navy-100 dark:divide-navy-800 bg-white dark:bg-navy-900">
              <tr>
                <td class="p-3 font-semibold text-brand-600 dark:text-brand-400">Caverne tuberculeuse</td>
                <td class="p-3">Hyperclarté cernée d'une paroi épaisse, parfois avec niveau liquide</td>
                <td class="p-3 text-rose-600 dark:text-rose-400 font-medium">Foyer de réplication intense, hautement contagieux</td>
              </tr>
              <tr>
                <td class="p-3 font-semibold">Infiltrats et nodules</td>
                <td class="p-3">Opacités hétérogènes mal limitées des apex</td>
                <td class="p-3">Lésions actives de dissémination bronchogène</td>
              </tr>
              <tr>
                <td class="p-3 font-semibold">Miliaire pulmonaire</td>
                <td class="p-3">Micronodules punctiformes de 1 à 2 mm disséminés en "grains de mil"</td>
                <td class="p-3 text-amber-600 dark:text-amber-400">Dissémination hématogène, urgence diagnostique</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="bacterio" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">5. Diagnostic Bactériologique (Clé de Voûte)</h2>
        <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40 mb-4">
          <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold mb-1">
            💡 Règle d'or : La certitude diagnostique est BACTÉRIOLOGIQUE
          </div>
          <p class="text-sm text-navy-700 dark:text-navy-300">
            Ne jamais débuter d'antibacillaires sur une simple impression radiologique sans avoir isolé le germe, sauf détresse vitale immédiate (miliaire asphyxiante).
          </p>
        </div>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-3">
          <strong>Modalités de prélèvement :</strong>
        </p>
        <ul class="list-disc pl-6 space-y-2 text-navy-700 dark:text-navy-300 mb-4">
          <li><strong>Expectorations induites ou spontanées (ECBC) :</strong> 3 jours consécutifs le matin au réveil après rinçage bucco-dentaire.</li>
          <li><strong>Tubage gastrique au réveil :</strong> Chez le patient qui n'expectore pas ou chez l'enfant, avant tout lever et avant tout repas (le BK dégluti durant la nuit stagne dans l'estomac).</li>
          <li><strong>Fibroscopie bronchique avec lavage broncho-alvéolaire (LBA) :</strong> Si les expectorations restent négatives malgré une forte suspicion clinique et radiologique.</li>
        </ul>
      </section>

      <section id="traitement" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">6. Prise en Charge Thérapeutique (Régime 2RHZE/4RH)</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          Le traitement repose sur le protocole standardisé du Programme National de Lutte Antituberculeuse en Algérie. Il comporte deux phases distinctes :
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
            <span class="inline-block px-3 py-1 text-xs font-bold uppercase rounded-full bg-indigo-600 text-white mb-2">Phase Initiale d'Attaque (2 Mois)</span>
            <h4 class="text-lg font-bold text-navy-900 dark:text-white mb-1">Quadrithérapie RHZE</h4>
            <p class="text-sm text-navy-600 dark:text-navy-300 mb-3">Rifampicine + Isoniazide + Pyrazinamide + Éthambutol.</p>
            <p class="text-xs text-navy-500 dark:text-navy-400">Objectif : Destruction rapide de la population bacillaire extracellulaire et prévention de l'émergence de souches résistantes.</p>
          </div>
          <div class="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <span class="inline-block px-3 py-1 text-xs font-bold uppercase rounded-full bg-emerald-600 text-white mb-2">Phase d'Entretien (4 Mois)</span>
            <h4 class="text-lg font-bold text-navy-900 dark:text-white mb-1">Bithérapie RH</h4>
            <p class="text-sm text-navy-600 dark:text-navy-300 mb-3">Rifampicine + Isoniazide.</p>
            <p class="text-xs text-navy-500 dark:text-navy-400">Objectif : Éradication des bacilles intracellulaires à multiplication lente et prévention des rechutes à long terme.</p>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 mb-4">
          <div class="font-bold text-amber-900 dark:text-amber-300 mb-2">💊 Règle de Prise & Surveillance Thérapeutique :</div>
          <ul class="text-sm space-y-1 text-navy-700 dark:text-navy-300">
            <li>• Prise quotidienne <strong>unique le matin à jeun</strong> (au moins 30 minutes avant le petit déjeuner).</li>
            <li>• Prévenir le patient de la coloration rouge-orangée bénigne des sécrétions (larmes, urines) sous Rifampicine.</li>
            <li>• Surveillance du bilan hépatique (Transaminases ASAT/ALAT) bimensuelle le premier mois.</li>
            <li>• Surveillance ophtalmologique (champ visuel, vision des couleurs) sous Éthambutol pour dépister la névrite optique rétrobulbaire.</li>
          </ul>
        </div>
      </section>

      <section id="points-cles" class="mb-6">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">7. Points Clés & Pièges aux Examens</h2>
        <div class="space-y-3">
          <div class="flex items-start gap-3 p-3 rounded-xl bg-navy-50 dark:bg-navy-800/50">
            <span class="text-brand-600 dark:text-brand-400 font-bold">1.</span>
            <span class="text-sm text-navy-700 dark:text-navy-300">L'intradermoréaction à la tuberculine (IDR) ou le test IGRA (QuantiFERON) ne permettent <strong>JAMAIS</strong> à eux seuls d'affirmer une tuberculose pulmonaire maladie active.</span>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-navy-50 dark:bg-navy-800/50">
            <span class="text-brand-600 dark:text-brand-400 font-bold">2.</span>
            <span class="text-sm text-navy-700 dark:text-navy-300">La déclaration à la Direction de la Santé et de la Population (DSP) est <strong>obligatoire</strong> dès confirmation.</span>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-navy-50 dark:bg-navy-800/50">
            <span class="text-brand-600 dark:text-brand-400 font-bold">3.</span>
            <span class="text-sm text-navy-700 dark:text-navy-300">Le dépistage des sujets contacts intrafamiliaux est indissociable du traitement du cas index.</span>
          </div>
        </div>
      </section>
    `,
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-09-01T14:30:00Z'
  },
  {
    id: 'cours_cardio_rm',
    slug: 'retrecissement-mitral',
    title: 'Le Rétrécissement Mitral (Sténose Mitrale)',
    subtitle: 'Étiologie rhumatismale, retentissement hémodynamique, diagnostic échocardiographique et traitement percutané',
    specialtyId: 'cardio',
    specialtyName: 'Cardiologie',
    author: 'Dr. A. Zerrouki & Pr. S. Mansouri',
    authorTitle: 'Service de Cardiologie - EHS Draa Ben Khedda',
    description: 'La valvulopathie classique par excellence en Afrique du Nord : complications rythmiques et thromboemboliques, échographie Doppler clé et indications de la commissurotomie mitrale percutanée.',
    coverImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1200',
    difficulty: 'Incontournable',
    faculty: 'SIDI_BEL_ABBES',
    rang: 'Rang A',
    estimatedDuration: '40 min',
    tags: ['Valvulopathie', 'RAA', 'Fibrillation Atriale', 'Roulement diastolique', 'Duroziez', 'Commissurotomie'],
    accessLevel: 'FREE', // Accessible en gratuit
    published: true,
    viewsCount: 2840,
    likesCount: 245,
    qcmCount: 6,
    tableOfContents: [
      { id: 'intro', title: '1. Définition & Étiologie (Le RAA)', level: 1 },
      { id: 'physio', title: '2. Physiopathologie & Conséquences d\'Amont', level: 1 },
      { id: 'auscultation', title: '3. Signes Physiques (Le Rythme de Duroziez)', level: 1 },
      { id: 'echo', title: '4. Échocardiographie Doppler (Gold Standard)', level: 1 },
      { id: 'complications', title: '5. Complications Évolutives', level: 1 },
      { id: 'traitement', title: '6. Prise en Charge & Commissurotomie', level: 1 }
    ],
    summaryPoints: [
      'Cause quasi-exclusive en Algérie : le Rhumatisme Articulaire Aigu (RAA) post-streptococcique.',
      'Surface mitrale normale : 4 à 6 cm². RM serré : surface < 1,5 cm².',
      'Auscultation typique (Rythme de Duroziez) : Éclat de B1, Claquement d\'ouverture mitrale (COM) et Roulement diastolique.',
      'Le ventricule gauche n\'est PAS dilaté ni hypertrophié (il est protégé par la sténose en amont).',
      'Complications majeures : Fibrillation Atriale (FA), AVC embolique et Œdème Aigu du Poumon (OAP).',
      'Traitement de choix de la forme souple non calcifiée : Commissurotomie Mitrale Percutanée (CMP) par ballon d\'Inoue.'
    ],
    htmlContent: `
      <section id="intro" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">1. Définition & Étiologie (Le RAA)</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          Le rétrécissement mitral (RM) est la diminution permanente de la surface de l'orifice mitral faisant obstacle au remplissage du ventricule gauche lors de la diastole.
        </p>
        <div class="p-4 rounded-xl bg-purple-50 border border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/40 mb-4">
          <div class="font-bold text-purple-900 dark:text-purple-300 mb-1">
            📍 Spécificité Épidémiologique Maghrébine
          </div>
          <p class="text-sm text-navy-700 dark:text-navy-300">
            Alors que le RM a quasiment disparu d'Europe occidentale, il demeure fréquent en Algérie en raison des séquelles de cardite rhumatismale (RAA) contractée durant l'enfance ou l'adolescence. Il touche avec prédilection la femme jeune (sex-ratio 3F/1H).
          </p>
        </div>
      </section>

      <section id="physio" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">2. Physiopathologie & Conséquences d'Amont</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          L'obstacle mécanique valvulaire crée un gradient de pression diastolique entre l'atrium gauche (AG) et le ventricule gauche (VG). Les répercussions se propagent en cascade vers l'amont :
        </p>
        <ol class="list-decimal pl-6 space-y-2 text-navy-700 dark:text-navy-300 mb-4">
          <li><strong>Hyperpression et dilatation de l'atrium gauche :</strong> Risque d'arythmie atriale (fibrillation auriculaire) et de stase sanguine avec formation de thrombus dans l'auricule gauche.</li>
          <li><strong>Hypertension veineuse puis capillaire pulmonaire :</strong> Transsudation alvéolaire lorsque la pression dépasse 25 mmHg, responsable d'œdème aigu pulmonaire (OAP).</li>
          <li><strong>Hypertension artérielle pulmonaire (HTAP) :</strong> D'abord post-capillaire passive, puis pré-capillaire fixée par remodelage artériolaire.</li>
          <li><strong>Retentissement sur les cavités droites :</strong> Dilatation du ventricule droit, insuffisance tricuspide fonctionnelle et insuffisance cardiaque droite globale.</li>
        </ol>
      </section>

      <section id="auscultation" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">3. Signes Physiques (Le Rythme de Duroziez)</h2>
        <div class="p-5 rounded-2xl bg-white dark:bg-navy-800/90 border border-navy-100 dark:border-navy-700 shadow-soft mb-6">
          <h3 class="text-lg font-bold text-brand-600 dark:text-brand-400 mb-3">La Triade Auscultatoire Classique à l'Apex en Décubitus Latéral Gauche :</h3>
          <ul class="space-y-3 text-sm text-navy-700 dark:text-navy-300">
            <li class="flex items-start gap-2">
              <span class="font-bold text-navy-900 dark:text-white min-w-[32px]">1.</span>
              <span><strong>Éclat du 1er bruit (B1) :</strong> Fermeture brutale de valves mitrales scléreuses mais encore mobiles.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-bold text-navy-900 dark:text-white min-w-[32px]">2.</span>
              <span><strong>Claquement d'ouverture mitrale (COM) :</strong> Survient au tout début de la diastole, juste après le B2. Plus le COM est précoce et proche du B2, plus le RM est serré !</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="font-bold text-navy-900 dark:text-white min-w-[32px]">3.</span>
              <span><strong>Roulement méso-télédiastolique :</strong> Bruit sourd, grave, irradiant peu, se terminant en rythme sinusal par un renforcement pré-systolique (disparaît en cas de fibrillation atriale).</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="echo" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">4. Échocardiographie Doppler (Gold Standard)</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          L'échocardiographie transthoracique (ETT) permet le diagnostic positif, l'évaluation de la sévérité et la recherche de contre-indications au traitement percutané :
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="p-4 rounded-xl bg-navy-50 dark:bg-navy-800 border border-navy-100 dark:border-navy-700">
            <span class="text-xs font-bold text-navy-500 uppercase">RM Minime</span>
            <div class="text-lg font-bold text-navy-900 dark:text-white mt-1">Surface > 1.5 cm²</div>
            <p class="text-xs text-navy-500 mt-1">Gradient moyen &lt; 5 mmHg</p>
          </div>
          <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <span class="text-xs font-bold text-amber-600 uppercase">RM Serré</span>
            <div class="text-lg font-bold text-amber-900 dark:text-amber-200 mt-1">Surface 1.0 - 1.5 cm²</div>
            <p class="text-xs text-amber-700 dark:text-amber-300 mt-1">Gradient moyen 5 - 10 mmHg</p>
          </div>
          <div class="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
            <span class="text-xs font-bold text-rose-600 uppercase">RM Très Serré</span>
            <div class="text-lg font-bold text-rose-900 dark:text-rose-200 mt-1">Surface &lt; 1.0 cm²</div>
            <p class="text-xs text-rose-700 dark:text-rose-300 mt-1">Gradient moyen > 10 mmHg</p>
          </div>
        </div>
      </section>

      <section id="traitement" class="mb-6">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">6. Prise en Charge & Commissurotomie</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          En cas de RM serré symptomatique (ou asymptomatique avec HTAP sévère au repos ou à l'effort) :
        </p>
        <ul class="list-disc pl-6 space-y-2 text-navy-700 dark:text-navy-300">
          <li><strong>Commissurotomie Mitrale Percutanée (CMP) :</strong> Traitement de première intention si l'anatomie valvulaire est favorable (score de Wilkins ≤ 8, absence de calcification commissurale, absence de fuite mitrale > grade 2 et absence de thrombus dans l'OG/auricule vérifiée par Échographie Transœsophagienne préalable).</li>
          <li><strong>Remplacement Valvulaire Mitral (RVM) chirurgical :</strong> Par prothèse mécanique ou biologique en cas de contre-indication à la CMP (valves très remaniées ou calcifiées, fuite mitrale associée).</li>
        </ul>
      </section>
    `,
    createdAt: '2026-08-18T11:00:00Z',
    updatedAt: '2026-09-02T10:00:00Z'
  },
  {
    id: 'cours_neuro_avc',
    slug: 'avc-ischemique',
    title: 'L\'Accident Vasculaire Cérébral (AVC) Ischémique Aigu',
    subtitle: 'Reconnaissance d\'urgence, imagerie multimodale, thrombolyse intraveineuse et thrombectomie mécanique',
    specialtyId: 'neuro',
    specialtyName: 'Neurologie',
    author: 'Dr. F. Khellaf',
    authorTitle: 'Service des Urgences Cérébro-Vasculaires',
    description: '"Le temps, c\'est du cerveau !" Guide opérationnel pour la gestion de l\'AVC en phase aiguë : critères d\'éligibilité à la thrombolyse (rt-PA) et à la thrombectomie mécanique jusqu\'à 24h.',
    coverImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1200',
    difficulty: 'Incontournable',
    rang: 'Rang A',
    estimatedDuration: '45 min',
    tags: ['AVC', 'Thrombolyse', 'Thrombectomie', 'IRM cérébrale', 'NIHSS', 'Fibrillation Atriale', 'Aspirine'],
    accessLevel: 'PRO', // Contenu réservé PRO
    published: true,
    viewsCount: 4120,
    likesCount: 380,
    qcmCount: 7,
    tableOfContents: [
      { id: 'definition', title: '1. Définition & Score NIHSS', level: 1 },
      { id: 'imagerie', title: '2. Imagerie en Urgence : IRM vs Scanner', level: 1 },
      { id: 'recanalisation', title: '3. Traitements de Recanalisation en Phase Aiguë', level: 1 },
      { id: 'mesures-generales', title: '4. Soins Intensifs & Contrôle des Constantes', level: 1 }
    ],
    summaryPoints: [
      'Tout déficit neurologique focal d\'apparition brutale est un AVC jusqu\'à preuve du contraire.',
      'IRM cérébrale en première intention : séquence Diffusion (anomalie immédiate), FLAIR (datation), T2* (élimine l\'hémorragie) et 3D-TOF.',
      'Thrombolyse IV par Actilyse (rt-PA) : fenêtre de 4h30 après le début des symptômes.',
      'Thrombectomie mécanique : jusqu\'à 6h (et jusqu\'à 24h selon critères d\'imagerie perfusion DAWN/DEFUSE-3) en cas d\'occlusion d\'un gros tronc artériel.',
      'Respecter l\'hypertension artérielle réflexe en phase aiguë : ne pas baisser la PA sauf si > 220/120 mmHg (ou > 185/110 mmHg si thrombolyse envisagée).'
    ],
    htmlContent: `
      <section id="definition" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">1. Définition & Alerte Immédiate</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          L'AVC ischémique représente 80 à 85% de l'ensemble des AVC. Il résulte de l'interruption du flux sanguin artériel cérébral par un thrombus ou une embole, entraînant une nécrose neuronale progressive.
        </p>
        <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40">
          <div class="font-bold text-rose-700 dark:text-rose-300 mb-1">⏱️ Chaque minute perdue = 2 millions de neurones détruits</div>
          <p class="text-sm text-navy-700 dark:text-navy-300">L'appel au SAMU / Urgences doit déclencher la filière neurovasculaire d'emblée sans passer par le médecin traitant.</p>
        </div>
      </section>

      <section id="imagerie" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">2. Imagerie en Urgence : IRM vs Scanner</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          L'IRM cérébrale est l'examen de choix. Le protocole d'urgence comprend :
        </p>
        <ul class="list-disc pl-6 space-y-2 text-navy-700 dark:text-navy-300">
          <li><strong>Diffusion (DWI) :</strong> Hyperintensité visible dès les premières minutes, confirmant l'ischémie cytotoxique.</li>
          <li><strong>FLAIR :</strong> Si le parenchyme est encore normal en FLAIR alors qu'il est brillant en Diffusion, l'AVC date de moins de 4h30 (mismatch Diffusion/FLAIR) !</li>
          <li><strong>T2* ou SWI :</strong> Élimine formellement tout saignement intracrânien.</li>
          <li><strong>Angio-IRM (TOF) :</strong> Visualise le thrombus occlusif dans les gros vaisseaux cérébraux (artère cérébrale moyenne M1/M2, carotide interne terminale, tronc basilaire).</li>
        </ul>
      </section>

      <section id="recanalisation" class="mb-6">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">3. Traitements de Recanalisation en Phase Aiguë</h2>
        <div class="space-y-4">
          <div class="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
            <h4 class="font-bold text-indigo-900 dark:text-indigo-200 mb-1">1. Thrombolyse intraveineuse par rt-PA (Alteplase)</h4>
            <p class="text-sm text-navy-700 dark:text-navy-300">Dose : 0.9 mg/kg (max 90 mg) avec 10% en bolus sur 1 min, puis le reste sur 1h. Fenêtre d'éligibilité : strictly &lt; 4h30.</p>
          </div>
          <div class="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
            <h4 class="font-bold text-purple-900 dark:text-purple-200 mb-1">2. Thrombectomie mécanique par voie endovasculaire</h4>
            <p class="text-sm text-navy-700 dark:text-navy-300">Extraction directe du caillot par stent-retriever ou thrombo-aspiration en cas d'occlusion proximale. Efficace jusqu'à 6h, et jusqu'à 24h si tissu sauvable documenté en imagerie de perfusion.</p>
          </div>
        </div>
      </section>
    `,
    createdAt: '2026-08-22T14:00:00Z',
    updatedAt: '2026-09-03T11:00:00Z'
  },
  {
    id: 'cours_cardio_ic',
    slug: 'insuffisance-cardiaque',
    title: 'L\'Insuffisance Cardiaque Aiguë et Chronique',
    subtitle: 'Classification selon la FEVG, biomarqueurs (BNP/NT-proBNP) et les 4 piliers pharmacologiques fantastiques',
    specialtyId: 'cardio',
    specialtyName: 'Cardiologie',
    author: 'Pr. S. Mansouri',
    authorTitle: 'Professeur de Cardiologie',
    description: 'De la décompensation aiguë (OAP) au traitement de fond moderne de l\'insuffisance cardiaque à fraction d\'éjection réduite (HFrEF) : les inhibiteurs SGLT2, ARNI, bêtabloquants et ARM.',
    coverImage: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=1200',
    difficulty: 'Incontournable',
    rang: 'Rang A',
    estimatedDuration: '45 min',
    tags: ['HFrEF', 'HFpEF', 'Entresto', 'Dapagliflozine', 'OAP', 'Furosémide', 'BNP'],
    accessLevel: 'PRO',
    published: true,
    viewsCount: 3900,
    likesCount: 310,
    qcmCount: 8,
    tableOfContents: [
      { id: 'definition', title: '1. Définition & Classifications (FEVG)', level: 1 },
      { id: 'biomarqueurs', title: '2. Diagnostic Biologique & Échographique', level: 1 },
      { id: 'oap', title: '3. Prise en Charge de la Poussée Aiguë (OAP)', level: 1 },
      { id: 'piliers', title: '4. Les 4 Piliers Thérapeutiques Modernes', level: 1 }
    ],
    summaryPoints: [
      'Distinction fondamentale selon la fraction d\'éjection du VG : FEr ≤ 40%, FEm 41-49%, FEp ≥ 50%.',
      'Le dosage du BNP ou NT-proBNP a une excellente valeur prédictive négative en cas de dyspnée aiguë.',
      'Poussée aiguë congestive : diurétiques de l\'anse IV (Furosémide) + dérivés nitrés si PAS > 110 mmHg + VNI si acidose/détresse.',
      'Les 4 piliers de l\'insuffisance cardiaque à FEVG réduite qui réduisent la mortalité : 1) ARNI (Sacubitril/Valsartan) ou IEC, 2) Bêtabloquant cardio-sélectif, 3) ARM (Spironolactone/Éplérénone), 4) Inhibiteur SGLT2 (Dapagliflozine/Empagliflozine).'
    ],
    htmlContent: `
      <section id="definition" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">1. Définition & Classifications</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          L'insuffisance cardiaque est un syndrome clinique caractérisé par des symptômes cardinaux (dyspnée d'effort ou de repos, orthopnée, fatigue, œdèmes des membres inférieurs) résultant d'une anomalie structurelle ou fonctionnelle du myocarde.
        </p>
      </section>
      <section id="piliers" class="mb-6">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">4. Les 4 Piliers Thérapeutiques Fondamentaux</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          Tout patient ayant une insuffisance cardiaque à FEVG réduite (&le; 40%) doit recevoir, sauf contre-indication, la combinaison des 4 classes suivantes dès que possible :
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700">
            <span class="font-bold text-brand-600 dark:text-brand-400">1. ARNI ou IEC</span>
            <p class="text-sm text-navy-600 dark:text-navy-300 mt-1">Sacubitril/Valsartan (Entresto) en première intention, ou Périndopril/Ramipril.</p>
          </div>
          <div class="p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700">
            <span class="font-bold text-brand-600 dark:text-brand-400">2. Bêtabloquant cardio-sélectif</span>
            <p class="text-sm text-navy-600 dark:text-navy-300 mt-1">Bisoprolol, Carvédilol, Métoprolol succinate ou Nébivolol (initiation à dose minimale à distance d'une poussée décompensée).</p>
          </div>
          <div class="p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700">
            <span class="font-bold text-brand-600 dark:text-brand-400">3. Antagoniste des récepteurs minéralocorticoïdes (ARM)</span>
            <p class="text-sm text-navy-600 dark:text-navy-300 mt-1">Spironolactone ou Éplérénone (surveillance étroite de la créatininémie et de la kaliémie).</p>
          </div>
          <div class="p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700">
            <span class="font-bold text-brand-600 dark:text-brand-400">4. Inhibiteur des SGLT2 (Gliflozines)</span>
            <p class="text-sm text-navy-600 dark:text-navy-300 mt-1">Dapagliflozine ou Empagliflozine 10 mg/j (même chez le non diabétique !).</p>
          </div>
        </div>
      </section>
    `,
    createdAt: '2026-08-25T16:00:00Z',
    updatedAt: '2026-09-03T18:00:00Z'
  },
  {
    id: 'cours_pneumo_aag',
    slug: 'asthme-aigu-grave',
    title: 'La Crise d\'Asthme Aiguë Grave (AAG)',
    subtitle: 'Signes de menace vitale, débitmètre de pointe (DEP), nébulisations et corticothérapie systémique',
    specialtyId: 'pneumo',
    specialtyName: 'Pneumologie',
    author: 'Dr. M. Chérif',
    authorTitle: 'Pneumologue Praticien Spécialiste',
    description: 'Protocole d\'urgence pour la gestion d\'une crise d\'asthme réfractaire : critères d\'admission en réanimation, utilisation des bronchodilatateurs en nébulisation continue et indication du sulfate de magnésium.',
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200',
    difficulty: 'Incontournable',
    rang: 'Rang A',
    estimatedDuration: '35 min',
    tags: ['Asthme', 'Urgence respiratoire', 'DEP', 'Salbutamol', 'Ipratropium', 'Corticothérapie'],
    accessLevel: 'FREE',
    published: true,
    viewsCount: 3100,
    likesCount: 290,
    qcmCount: 6,
    tableOfContents: [
      { id: 'criteres', title: '1. Critères de Gravité Immédiate', level: 1 },
      { id: 'menace', title: '2. Signes d\'Épuisement et de Menace Vitale', level: 1 },
      { id: 'traitement', title: '3. Conduite Thérapeutique Immédiate', level: 1 }
    ],
    summaryPoints: [
      'Incapacité à prononcer une phrase complète sans reprendre son souffle = signe cardinal.',
      'Fréquence respiratoire > 30/min, pouls > 120/min, DEP < 50% de la valeur théorique.',
      'Signes d\'extrême gravité imposant l\'appel du réanimateur : silence auscultatoire ("poumon muet"), respiration paradoxale, sueurs, cyanose, bradycardie et troubles de la conscience.',
      'Trépied thérapeutique immédiat : Oxygénothérapie (SpO2 93-95%) + Bêta-2 mimétiques inhalés forte dose (Salbutamol 5 mg en nébulisation avec O2) + Corticothérapie IV précoce (Méthylprednisolone).'
    ],
    htmlContent: `
      <section id="criteres" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">1. Critères de Gravité Immédiate</h2>
        <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 mb-4">
          <h3 class="font-bold text-amber-900 dark:text-amber-300 mb-2">Signes Cliniques de Gravité :</h3>
          <ul class="text-sm space-y-1 text-navy-700 dark:text-navy-300">
            <li>• Impossibilité de parler ou de s'allonger (position assise penchée en avant)</li>
            <li>• FR > 30 cycles/min avec tirage des muscles sterno-cléido-mastoïdiens</li>
            <li>• Pouls > 120 battements/min, pouls paradoxal</li>
            <li>• DEP &lt; 50% de la valeur théorique ou &lt; 150 L/min</li>
          </ul>
        </div>
      </section>
      <section id="menace" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">2. Signes de Menace Vitale (Transfert Réa Immédiat)</h2>
        <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40">
          <ul class="text-sm space-y-2 text-rose-800 dark:text-rose-300 font-semibold">
            <li>🚨 <strong>Silence auscultatoire ("poumon muet") :</strong> Absence totale de sifflements par collapsus alvéolaire.</li>
            <li>🚨 Respiration abdominale paradoxale (faillite diaphragmatique).</li>
            <li>🚨 Bradycardie, collapsus hémodynamique, troubles de la vigilance (coma hypercapnique).</li>
          </ul>
        </div>
      </section>
    `,
    createdAt: '2026-08-28T10:00:00Z',
    updatedAt: '2026-09-04T09:00:00Z'
  },
  {
    id: 'cours_nephro_ira',
    slug: 'insuffisance-renale-aigue',
    title: 'L\'Insuffisance Rénale Aiguë (IRA)',
    subtitle: 'Diagnostic étiologique (pré-rénale, parenchymateuse, obstructive) et indications d\'épuration extrarénale en urgence',
    specialtyId: 'nephro',
    specialtyName: 'Néphrologie',
    author: 'Pr. H. Belkacem',
    authorTitle: 'Service de Néphrologie & Hémodialyse',
    description: 'Arbre diagnostique systématique de l\'oligo-anurie : éliminer l\'obstacle par l\'échographie rénale en urgence, différencier l\'IRA fonctionnelle de la nécrose tubulaire aiguë, et gérer l\'hyperkaliémie menaçante.',
    coverImage: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=1200',
    difficulty: 'Incontournable',
    rang: 'Rang A',
    estimatedDuration: '40 min',
    tags: ['Créatininémie', 'KDIGO', 'Échographie rénale', 'Hyperkaliémie', 'Dialyse', 'Fraction d\'excrétion sodée'],
    accessLevel: 'PREMIUM',
    published: true,
    viewsCount: 2750,
    likesCount: 220,
    qcmCount: 7,
    tableOfContents: [
      { id: 'criteres', title: '1. Critères KDIGO & Définition', level: 1 },
      { id: 'demarche', title: '2. Démarche Diagnostique Étape par Étape', level: 1 },
      { id: 'dialyse', title: '3. Indications Formelles de Dialyse en Urgence', level: 1 }
    ],
    summaryPoints: [
      'Augmentation de la créatininémie d\'au moins 26,5 µmol/L en 48h ou de 50% en 7 jours.',
      'Première étape réflexe absolue : Éliminer une cause obstructive par une échographie rénale et des voies urinaires (dilatation des cavités pyélocalicielles ?).',
      'Deuxième étape : Différencier IRA fonctionnelle (pré-rénale réversible avec Na/K urinaire < 1) vs IRA organique parenchymateuse (NTA).',
      'Indications impératives de dialyse en urgence : 1) Hyperkaliémie menaçante réfractaire, 2) Acidose métabolique sévère (pH < 7.15), 3) OAP anurique réfractaire aux diurétiques, 4) Signes d\'urémie péricardique/encéphalique.'
    ],
    htmlContent: `
      <section id="criteres" class="mb-10">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">1. Critères KDIGO</h2>
        <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">
          L'IRA est définie selon la classification internationale KDIGO par la présence d'au moins un des critères suivants :
        </p>
        <ul class="list-disc pl-6 space-y-1 text-navy-700 dark:text-navy-300">
          <li>Élévation de la créatininémie d'au moins 26,5 µmol/L (0.3 mg/dL) en 48 heures.</li>
          <li>Élévation de la créatininémie d'au moins 1.5 fois la valeur basale connue ou présumée dans les 7 jours précédents.</li>
          <li>Diurèse inférieure à 0.5 mL/kg/h pendant 6 heures consécutives.</li>
        </ul>
      </section>
      <section id="dialyse" class="mb-6">
        <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">3. Indications Formelles de Dialyse en Urgence</h2>
        <div class="p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40">
          <div class="font-bold text-rose-800 dark:text-rose-300 mb-2">Moyen mnémotechnique classique : "AEIOU"</div>
          <ul class="text-sm space-y-1 text-navy-700 dark:text-navy-300">
            <li>• <strong>A</strong>cidose métabolique sévère (pH &lt; 7.15 réfractaire)</li>
            <li>• <strong>E</strong>lectrolytes : Hyperkaliémie menaçante (&gt; 6.5 mmol/L ou signes ECG) réfractaire</li>
            <li>• <strong>I</strong>ntoxication : Toxiques dialysables (lithium, méthanol, éthylène glycol, salicylés)</li>
            <li>• <strong>O</strong>verload : Surcharge hydrosodée majeure / OAP réfractaire aux diurétiques</li>
            <li>• <strong>U</strong>rémie symptomatique : Péricardite urémique, encéphalopathie urémique</li>
          </ul>
        </div>
      </section>
    `,
    createdAt: '2026-08-30T14:00:00Z',
    updatedAt: '2026-09-04T15:00:00Z'
  }
,
  {
  "id": "cours_endocrino_acidocetose",
  "slug": "acidocetose-diabetique",
  "title": "L'Acidocétose Diabétique & Complications Aiguës",
  "subtitle": "Diagnostic métabolique, calcul du trou anionique, réhydratation hydro-électrolytique et insulinothérapie IV",
  "specialtyId": "endocrino",
  "specialtyName": "Endocrinologie - Diabétologie",
  "author": "Pr. M. Semrouni",
  "authorTitle": "Service de Diabétologie & Maladies Métaboliques - CHU Mustapha",
  "description": "Complication métabolique aiguë potentiellement mortelle du diabète de type 1 et 2 insulino-requérant. Protocole pas à pas : solutés, compensation de la kaliémie avant l'insuline et surveillance rapprochée.",
  "coverImage": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "45 min",
  "tags": [
    "Diabète",
    "Acidocétose",
    "Cétonémie",
    "Trou anionique",
    "Insuline IVSE",
    "Hypokaliémie"
  ],
  "accessLevel": "FREE",
  "published": true,
  "viewsCount": 3820,
  "likesCount": 310,
  "qcmCount": 8,
  "tableOfContents": [
    {
      "id": "definition",
      "title": "1. Définition & Triade Biologique",
      "level": 1
    },
    {
      "id": "facteurs",
      "title": "2. Facteurs Déclenchants Majeurs",
      "level": 1
    },
    {
      "id": "clinique",
      "title": "3. Tableau Clinique & Respiration de Kussmaul",
      "level": 1
    },
    {
      "id": "biologie",
      "title": "4. Bilan Biologique & Trou Anionique",
      "level": 1
    },
    {
      "id": "traitement",
      "title": "5. Prise en Charge Thérapeutique Codifiée",
      "level": 1
    },
    {
      "id": "pieges",
      "title": "6. Pièges & Complications Iatrogènes",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Triade biologique : Hyperglycémie (> 14 mmol/L soit > 2.5 g/L) + Cétonémie > 3 mmol/L (ou acétonurie ++) + Acidose métabolique (pH < 7.30, HCO3- < 15 mmol/L) à trou anionique élevé.",
    "Facteurs déclenchants fréquents : Arrêt ou omission d'insuline, infection intercurrente (pulmonaire, urinaire), IDM silencieux, AVC.",
    "Signes cliniques : Syndrome cardinal (polyuro-polydipsie), douleurs abdominales pseudo-chirurgicales, odeur acétonique de l'haleine (\"pomme reinette\"), dyspnée de Kussmaul.",
    "Règle d'or du traitement : NE JAMAIS DÉBUTER L'INSULINE si le potassium sanguin est < 3.3 mmol/L (risque d'arrêt cardiaque par hypokaliémie foudroyante).",
    "Hydratation première : Sérum physiologique 0.9% (1L la 1ère heure), puis adjonction de glucose 5% dès que la glycémie atteint 14 mmol/L (2.5 g/L)."
  ],
  "htmlContent": "\n      <section id=\"definition\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Définition & Triade Biologique</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          L'acidocétose diabétique est une urgence métabolique absolue résultant d'une carence absolue ou relative en insuline associée à une élévation des hormones de contre-régulation (glucagon, catécholamines, cortisol, GH).\n        </p>\n        <div class=\"p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800\">\n          <h3 class=\"font-bold text-emerald-900 dark:text-emerald-200 mb-2\">Les 3 critères diagnostiques simultanés :</h3>\n          <ul class=\"text-sm space-y-1 text-navy-700 dark:text-navy-300\">\n            <li>1. <strong>Hyperglycémie :</strong> Glycémie plasmatique &gt; 14 mmol/L (2,50 g/L).</li>\n            <li>2. <strong>Cétose franche :</strong> Cétonémie &gt; 3,0 mmol/L ou acétonurie &ge; (++) sur bandelette urinaire.</li>\n            <li>3. <strong>Acidose métabolique :</strong> Bicarbonates sériques &lt; 15 mmol/L et/ou pH veineux &lt; 7,30 avec trou anionique &gt; 12.</li>\n          </ul>\n        </div>\n      </section>\n\n      <section id=\"facteurs\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Facteurs Déclenchants Majeurs</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Dans 20 à 30% des cas, l'acidocétose est révélatrice d'un diabète de type 1 inaugural chez l'enfant ou l'adulte jeune. Chez le diabétique connu, rechercher systématiquement les \"5 I\" :\n        </p>\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n          <div class=\"p-4 rounded-xl bg-navy-50 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-semibold text-navy-900 dark:text-white mb-1\">Causes fréquentes</h4>\n            <ul class=\"text-sm text-navy-600 dark:text-navy-300 space-y-1\">\n              <li>• Infection aiguë sévère (40-50% des cas : pneumonie, pyélonéphrite)</li>\n              <li>• Inobservance / rupture d'insuline (panne de pompe à insuline)</li>\n              <li>• Ischémie myocardique (IDM indolore chez le diabétique)</li>\n            </ul>\n          </div>\n          <div class=\"p-4 rounded-xl bg-navy-50 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-semibold text-navy-900 dark:text-white mb-1\">Causes médicamenteuses & stress</h4>\n            <ul class=\"text-sm text-navy-600 dark:text-navy-300 space-y-1\">\n              <li>• Corticothérapie à forte dose</li>\n              <li>• Inhibiteurs de SGLT2 (acidocétose euglycémique !)</li>\n              <li>• Accident vasculaire cérébral, pancréatite aiguë</li>\n            </ul>\n          </div>\n        </div>\n      </section>\n\n      <section id=\"clinique\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Tableau Clinique & Respiration de Kussmaul</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          L'installation se fait en plusieurs phases : phase de cétose simple puis phase d'acidocétose décompensée.\n        </p>\n        <ul class=\"list-disc pl-6 space-y-2 text-navy-700 dark:text-navy-300 mb-4\">\n          <li><strong>Signes de déshydratation globale :</strong> Pli cutané (extracellulaire), hypotension, tachycardie, sécheresse des muqueuses, soif intense (intracellulaire).</li>\n          <li><strong>Troubles digestifs précoces :</strong> Nausées, vomissements incoercibles, douleurs abdominales diffuses pouvant simuler une urgence chirurgicale (fausse appendicite).</li>\n          <li><strong>Signes respiratoires cardinaux :</strong> Odeur acétonique de l'haleine (fruité / solvant) et dyspnée de Kussmaul (ventilation ample, profonde, rapide et bruyante) d'origine compensatoire respiratoire.</li>\n        </ul>\n      </section>\n\n      <section id=\"traitement\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">5. Prise en Charge Thérapeutique Codifiée</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 mb-6\">\n          <div class=\"font-bold text-rose-800 dark:text-rose-300 text-base mb-2\">⚠️ RÈGLE DE SÉCURITÉ ABSOLUE : Vérifier la Kaliémie !</div>\n          <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n            L'insuline fait rentrer le potassium dans les cellules. Administrer de l'insuline sur une hypokaliémie (&lt; 3,3 mmol/L) provoque une baisse catastrophique du potassium circulant et déclenche des torsades de pointes / arrêt cardiaque. Corriger le K+ AVANT l'insuline !\n          </p>\n        </div>\n        <div class=\"space-y-3\">\n          <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-bold text-navy-900 dark:text-white\">Étape 1 : Réhydratation IV hydro-électrolytique</h4>\n            <p class=\"text-sm text-navy-600 dark:text-navy-300 mt-1\">1 L de NaCl 0,9% la 1ère heure, puis 1 L sur 2h, puis 1 L sur 4h. Dès que la glycémie &le; 14 mmol/L (2,5 g/L), passer au Sérum Glucosé 5% + NaCl 0,9% pour éviter l'hypoglycémie et l'œdème cérébral.</p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-bold text-navy-900 dark:text-white\">Étape 2 : Insulinothérapie IVSE à débit continu</h4>\n            <p class=\"text-sm text-navy-600 dark:text-navy-300 mt-1\">Insuline rapide à 0,1 UI/kg/h au pousse-seringue électrique. L'objectif est une baisse de la glycémie de 3 à 4 mmol/L par heure (environ 0,5 à 0,7 g/L/h) et la négativation de la cétonémie.</p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-bold text-navy-900 dark:text-white\">Étape 3 : Supplémentation potassique systématique</h4>\n            <p class=\"text-sm text-navy-600 dark:text-navy-300 mt-1\">Si K+ entre 3,5 et 5,5 mmol/L : apporter 2 à 4 g de KCl par litre de perfusion dès que le débit urinaire est assuré.</p>\n          </div>\n        </div>\n      </section>\n    ",
  "createdAt": "2026-08-25T10:00:00Z",
  "updatedAt": "2026-09-04T12:00:00Z"
},
  {
  "id": "cours_gastro_cirrhose",
  "slug": "cirrhose-hepatique-et-hypertension-portale",
  "title": "La Cirrhose Hépatique & Décompensation Ascitique",
  "subtitle": "Diagnostic histologique/non-invasif, classification Child-Pugh, rupture de varices œsophagiennes et encéphalopathie",
  "specialtyId": "gastro",
  "specialtyName": "Gastro-entérologie & Hépatologie",
  "author": "Pr. A. Bouzid",
  "authorTitle": "Service d'Hépato-Gastro-entérologie - CHU Bab El Oued",
  "description": "Stade terminal des hépatopathies chroniques (alcool, virus B, C, stéato-hépatite métabolique MASH). Prise en charge des complications majeures : ascite, infection du liquide d'ascite (ILA), hémorragie digestive par hypertension portale.",
  "coverImage": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "50 min",
  "tags": [
    "Cirrhose",
    "Hypertension portale",
    "Ascite",
    "Varices œsophagiennes",
    "Child-Pugh",
    "Infection du liquide d'ascite"
  ],
  "accessLevel": "PRO",
  "published": true,
  "viewsCount": 3150,
  "likesCount": 260,
  "qcmCount": 8,
  "tableOfContents": [
    {
      "id": "definition",
      "title": "1. Définition & Étiologies en Algérie",
      "level": 1
    },
    {
      "id": "scores",
      "title": "2. Évaluation Pronostique : Child-Pugh & MELD",
      "level": 1
    },
    {
      "id": "ascite",
      "title": "3. Prise en Charge de l'Ascite & Diagnostic de l'ILA",
      "level": 1
    },
    {
      "id": "varices",
      "title": "4. Hémorragie Digestive par Rupture de VO",
      "level": 1
    },
    {
      "id": "chc",
      "title": "5. Dépistage du Carcinome Hépatocellulaire (CHC)",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Définition histologique : Fibrose mutilante diffuse délimitant des nodules de régénération avec désorganisation de l'architecture lobulaire.",
    "Score de Child-Pugh (A, B, C) basé sur 5 critères : Bilirubine, Albumine, TP/INR, Ascite et Encéphalopathie hépatique.",
    "Ponction d'ascite exploratrice SYSTÉMATIQUE devant toute décompensation, altération de l'état général, fièvre ou douleur abdominale.",
    "Infection du liquide d'ascite (ILA) définie par > 250 PNN/mm³ dans le liquide d'ascite : urgence vitale imposant Céfotaxime IV + perfusion d'albumine 20% à J1 et J3.",
    "Hémorragie par rupture de VO : Trépied immédiat = Vaso-actif IV (Terlipressine ou Octréotide) + Ligature endoscopique de varices sous 12h + Antibiothérapie prophylactique (Ceftriaxone 7 jours)."
  ],
  "htmlContent": "\n      <section id=\"definition\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Définition & Étiologies en Algérie</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          La cirrhose est le stade ultime de fibrose hépatique. En Algérie et au Maghreb, les étiologies virales (Hépatite B et C) et métaboliques (MASH / stéatohépatite non alcoolique liée au diabète et à l'obésité) occupent la première place, suivies de l'alcoolisme chronique et des causes auto-immunes (cirrhose biliaire primitive, hépatite auto-immune).\n        </p>\n      </section>\n\n      <section id=\"scores\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Évaluation Pronostique : Score de Child-Pugh</h2>\n        <div class=\"p-4 rounded-xl bg-navy-50 dark:bg-navy-800/80 border border-navy-100 dark:border-navy-700 mb-4\">\n          <p class=\"text-sm font-semibold text-navy-900 dark:text-white mb-2\">Moyen mnémotechnique : \"TABAC\"</p>\n          <ul class=\"text-sm space-y-1 text-navy-600 dark:text-navy-300\">\n            <li>• <strong>T</strong>P / INR</li>\n            <li>• <strong>A</strong>lbuminémie</li>\n            <li>• <strong>B</strong>ilirubine totale</li>\n            <li>• <strong>A</strong>scite (absente, minime, réfractaire)</li>\n            <li>• <strong>C</strong>erveau (Encéphalopathie hépatique stades I à IV)</li>\n          </ul>\n        </div>\n      </section>\n\n      <section id=\"ascite\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Décompensation Ascitique & Infection du Liquide (ILA)</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Toute première poussée d'ascite ou toute aggravation brutale chez un cirrhotique nécessite une ponction d'ascite exploratrice avant toute antibiothérapie.\n        </p>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40\">\n          <div class=\"font-bold text-rose-800 dark:text-rose-300 mb-1\">Diagnostic et Urgence de l'ILA :</div>\n          <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n            Présence de <strong>&gt; 250 Polynucléaires Neutrophiles (PNN) par mm³</strong> dans le liquide de ponction. Traitement : Céfotaxime 2g x 3/j IV pendant 5 à 7 jours + Perfusion d'Albumine humaine à 20% (1,5 g/kg à J1 puis 1 g/kg à J3) pour prévenir le syndrome hépato-rénal mortel.\n          </p>\n        </div>\n      </section>\n    ",
  "createdAt": "2026-08-26T11:00:00Z",
  "updatedAt": "2026-09-04T10:00:00Z"
},
  {
  "id": "cours_pediatrie_deshydratation",
  "slug": "deshydratation-aigue-du-nourrisson",
  "title": "La Déshydratation Aiguë du Nourrisson & Gastro-entérite",
  "subtitle": "Évaluation clinique de la perte de poids, solutés de réhydratation orale (SRO) et perfusion de réanimation hydro-électrolytique",
  "specialtyId": "pediatrie",
  "specialtyName": "Pédiatrie",
  "author": "Pr. F. Z. Dahmani",
  "authorTitle": "Chef de Service Pédiatrie Générale & Urgences - CHU Beni Messous",
  "description": "Première cause d'urgence pédiatrique en période estivale. Apprendre à évaluer précisément la perte pondérale en pourcentage, reconnaître les signes de choc hypovolémique et appliquer les protocoles OMS de réhydratation orale et intraveineuse.",
  "coverImage": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "40 min",
  "tags": [
    "Nourrisson",
    "Déshydratation",
    "SRO",
    "Gastro-entérite",
    "Rotavirus",
    "Perte de poids"
  ],
  "accessLevel": "FREE",
  "published": true,
  "viewsCount": 4210,
  "likesCount": 395,
  "qcmCount": 8,
  "tableOfContents": [
    {
      "id": "gravite",
      "title": "1. Classification de la Gravité (% de perte de poids)",
      "level": 1
    },
    {
      "id": "clinique",
      "title": "2. Signes Extracellulaires vs Intracellulaires",
      "level": 1
    },
    {
      "id": "sro",
      "title": "3. Réhydratation Orale (Protocole SRO OMS)",
      "level": 1
    },
    {
      "id": "iv",
      "title": "4. Réhydratation IV en Urgence (Choc pédiatrique)",
      "level": 1
    },
    {
      "id": "nutrition",
      "title": "5. Renutrition Précoce & Réintroduction du Lait",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Gravité définie par le pourcentage de perte de poids récent : Légère (< 5%), Modérée (5-10%), Sévère (> 10% ou tout état de choc).",
    "Signes de déshydratation extracellulaire : Pli cutané persistant, dépression de la fontanelle antérieure, cernes oculaires, yeux enfoncés, hypotension.",
    "Signes de déshydratation intracellulaire : Sécheresse des muqueuses, soif intense, hyperthermie inexpliquée, troubles de conscience.",
    "Traitement de 1ère intention (< 10% de perte pondérale sans choc ni vomissements incoercibles) : SRO (Soluté de Réhydratation Orale) à volonté par petites gorgées rapprochées.",
    "En cas de perte > 10% ou signes de choc : Remplissage vasculaire immédiat en urgence par NaCl 0,9% à 20 mL/kg en 20 minutes."
  ],
  "htmlContent": "\n      <section id=\"gravite\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Classification de la Gravité</h2>\n        <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\">\n          <div class=\"p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800\">\n            <h4 class=\"font-bold text-emerald-900 dark:text-emerald-200\">Perte &lt; 5%</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Déshydratation légère. Traitement ambulatoire par SRO. Pas de retentissement hémodynamique.</p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800\">\n            <h4 class=\"font-bold text-amber-900 dark:text-amber-200\">Perte 5 à 10%</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Déshydratation modérée. Yeux creusés, pli cutané, soif vive. SRO sous surveillance ou hospitalisation de jour.</p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800\">\n            <h4 class=\"font-bold text-rose-900 dark:text-rose-200\">Perte &gt; 10% ou Choc</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Urgence vitale hospitalière immédiate. Voie veineuse ou intra-osseuse. Remplissage NaCl 0,9% 20 mL/kg.</p>\n          </div>\n        </div>\n      </section>\n\n      <section id=\"sro\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Protocole SRO OMS</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Le SRO exploite le co-transport actif intestinal Sodium-Glucose (SGLT1) qui reste fonctionnel même lors des diarrhées à rotavirus ou bactériennes. Reconstituer 1 sachet dans exactement 200 mL d'eau pure (ni trop dilué, ni trop concentré). Donner à la cuillère ou à la seringue toutes les 2-3 minutes.\n        </p>\n      </section>\n    ",
  "createdAt": "2026-08-24T14:00:00Z",
  "updatedAt": "2026-09-04T08:00:00Z"
},
  {
  "id": "cours_gyneco_geu",
  "slug": "grossesse-extra-uterine",
  "title": "La Grossesse Extra-Utérine (GEU) & Urgences du 1er Trimestre",
  "subtitle": "Nidation ectopique, cinétique des β-hCG plasmatiques, échographie endovaginale et prise en charge médicale par Méthotrexate vs coelioscopie",
  "specialtyId": "gyneco",
  "specialtyName": "Gynécologie - Obstétrique",
  "author": "Pr. L. Chérifi",
  "authorTitle": "Clinique de Gynécologie-Obstétrique & Maternité Universitaire",
  "description": "Première cause de mortalité maternelle au 1er trimestre de la grossesse. Maîtriser le diagnostic précoce avant rupture de la trompe de Fallope, l'interprétation de la zone discriminatoire d'hCG et les critères de traitement conservateur.",
  "coverImage": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "45 min",
  "tags": [
    "GEU",
    "β-hCG",
    "Échographie pelvienne",
    "Méthotrexate",
    "Coelioscopie",
    "Hémopéritoine"
  ],
  "accessLevel": "PRO",
  "published": true,
  "viewsCount": 3640,
  "likesCount": 290,
  "qcmCount": 7,
  "tableOfContents": [
    {
      "id": "triade",
      "title": "1. Triade Clinique & Facteurs de Risque",
      "level": 1
    },
    {
      "id": "examens",
      "title": "2. Couple Échographie & Cinétique des β-hCG",
      "level": 1
    },
    {
      "id": "rupture",
      "title": "3. Tableau d'Inondation Péritonéale (Rupture Cataclysmique)",
      "level": 1
    },
    {
      "id": "options",
      "title": "4. Indications Thérapeutiques : Médical vs Chirurgical",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Localisation la plus fréquente : Ampullaire tubaire (> 80%). Facteurs de risque : Antécédent de GEU, Salpingite / IST (Chlamydia), tabagisme, stérilet, FIV.",
    "Triade classique : Retard de règles (aménorrhée) + Métrorragies noirâtres peu abondantes (\"sépia\") + Douleurs pelviennes unilatérales.",
    "Couple diagnostique d'or : Échographie pelvienne par voie endovaginale + dosage quantitatif des β-hCG plasmatiques.",
    "Vacuité utérine à l'écho avec β-hCG > 1 500 - 2 000 UI/L (seuil de visibilité du sac intra-utérin) = GEU jusqu'à preuve du contraire.",
    "Critères de Méthotrexate IM (dose unique 1 mg/kg ou 50 mg/m²) : Patiente asymptomatique, hémodynamique stable, β-hCG < 5000 UI/L, hématosalpinx < 35 mm, absence d'activité cardiaque embryonnaire."
  ],
  "htmlContent": "\n      <section id=\"triade\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Triade Clinique & Facteurs de Risque</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Toute femme en âge de procréer consultant pour des métrorragies et/ou des douleurs pelviennes a une GEU jusqu'à preuve du contraire, quel que soit son mode de contraception.\n        </p>\n      </section>\n\n      <section id=\"rupture\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Rupture Tubaire Cataclysmique</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40\">\n          <div class=\"font-bold text-rose-800 dark:text-rose-300 text-sm mb-1\">🚨 Choc Hémorragique & Inondation Péritonéale :</div>\n          <p class=\"text-xs text-navy-700 dark:text-navy-300\">\n            Douleur syncopale en coup de poignard dans le bas-ventre avec irradiation scapulaire (signe de Laffont par irritation phrénique), pâleur cireuse, pouls filant et défense abdominale. Indication opératoire d'extrême urgence : coelioscopie ou laparotomie immédiate avec salpingectomie d'hémostase.\n          </p>\n        </div>\n      </section>\n    ",
  "createdAt": "2026-08-27T09:00:00Z",
  "updatedAt": "2026-09-04T15:30:00Z"
},
  {
  "id": "cours_dermato_toxidermies",
  "slug": "toxidermies-medicamenteuses-graves",
  "title": "Les Toxidermies Médicamenteuses Graves : DRESS & Lyell",
  "subtitle": "Signes cutanés et muqueux d'alerte, score SCORTEN, syndrome de Stevens-Johnson et prise en charge en réanimation",
  "specialtyId": "dermato",
  "specialtyName": "Dermatologie - Vénérologie",
  "author": "Dr. S. Mansouri",
  "authorTitle": "Service de Dermatologie Clinique & Vénérologie",
  "description": "Reconnaître les urgences dermatologiques vitales d'origine iatrogène. Distinguer le DRESS syndrome (viscéral et éosinophilique) de la nécrolyse épidermique toxique (syndrome de Lyell avec décollement épidermique type grand brûlé).",
  "coverImage": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "40 min",
  "tags": [
    "Toxidermie",
    "DRESS",
    "Lyell",
    "Stevens-Johnson",
    "SCORTEN",
    "Signe de Nikolsky"
  ],
  "accessLevel": "PREMIUM",
  "published": true,
  "viewsCount": 2240,
  "likesCount": 185,
  "qcmCount": 6,
  "tableOfContents": [
    {
      "id": "signes",
      "title": "1. Signes d'Alerte d'une Toxidermie Grave",
      "level": 1
    },
    {
      "id": "dress",
      "title": "2. DRESS Syndrome (Atteinte Systémique)",
      "level": 1
    },
    {
      "id": "lyell",
      "title": "3. Stevens-Johnson & Syndrome de Lyell",
      "level": 1
    },
    {
      "id": "traitement",
      "title": "4. Prise en Charge Immédiate & Éviction",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Signes cutanés d'alerte imposant l'arrêt du médicament : Signe de Nikolsky (décollement épidermique sous pression tangentielle), lésions purpuriques, atteinte muqueuse érosive, œdème facial majeur.",
    "DRESS syndrome : Survenue tardive (2 à 8 semaines après introduction du médicament), hyperéosinophilie sanguine, polyadénopathies et atteintes viscérales graves (foie, rein, cœur).",
    "Spectre SJS / Lyell : Décollement < 10% (SJS), 10 à 30% (forme intermédiaire), > 30% de la surface corporelle (Lyell). Risque infectieux et hydro-électrolytique identique à un grand brûlé.",
    "Score SCORTEN : Calculé à J1 et J3 pour prédire la mortalité hospitalière.",
    "Prise en charge d'urgence : Arrêt immédiat de TOUT médicament suspect, transfert en unité de soins intensifs dermatologiques ou centre des brûlés."
  ],
  "htmlContent": "\n      <section id=\"signes\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Signes d'Alerte d'une Toxidermie Grave</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Devant toute éruption fébrile médicamenteuse, rechercher les critères de gravité imposant l'arrêt immédiat des traitements imputables :\n        </p>\n        <ul class=\"list-disc pl-6 space-y-1 text-navy-700 dark:text-navy-300\">\n          <li>Érosions muqueuses douloureuses (buccales, conjonctivales, génitales).</li>\n          <li>Signe de Nikolsky positif (l'épiderme glisse sous le doigt laissant un derme suintant).</li>\n          <li>Infiltration faciale majeure en \"tête de lion\".</li>\n          <li>Adénopathies diffuses et fièvre élevée &gt; 38,5°C persistante.</li>\n        </ul>\n      </section>\n    ",
  "createdAt": "2026-08-28T16:00:00Z",
  "updatedAt": "2026-09-04T16:00:00Z"
},
  {
  "id": "cours_infectieux_paludisme",
  "slug": "paludisme-grave-d-importation",
  "title": "Le Paludisme Grave d'Importation & Sepsis",
  "subtitle": "Diagnostic parasitologique en urgence, critères de gravité OMS et traitement salvateur par Artésunate intraveineux",
  "specialtyId": "infectieux",
  "specialtyName": "Infectiologie",
  "author": "Pr. T. Guernane",
  "authorTitle": "Service des Maladies Infectieuses & Tropicales - CHU El Hadi Flici (El Kettar)",
  "description": "Toute fièvre au retour d'une zone d'endémie palustre (Afrique subsaharienne, Sud algérien) est un paludisme à Plasmodium falciparum jusqu'à preuve bactériologique du contraire. Connaître les 13 critères de gravité OMS et l'antipaludique de référence.",
  "coverImage": "https://images.unsplash.com/photo-1583912267670-6575ad4736f8?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "45 min",
  "tags": [
    "Paludisme",
    "Plasmodium falciparum",
    "Artésunate IV",
    "Goutte épaisse",
    "Accès pernicieux",
    "Sepsis"
  ],
  "accessLevel": "FREE",
  "published": true,
  "viewsCount": 3910,
  "likesCount": 330,
  "qcmCount": 8,
  "tableOfContents": [
    {
      "id": "urgence",
      "title": "1. Urgence Diagnostique au Retour d'un Voyage",
      "level": 1
    },
    {
      "id": "oms",
      "title": "2. Les Critères de Gravité OMS (Accès Pernicieux)",
      "level": 1
    },
    {
      "id": "frottis",
      "title": "3. Frottis Sanguin, Goutte Épaisse & TDR",
      "level": 1
    },
    {
      "id": "artesunate",
      "title": "4. Traitement d'Urgence : Artésunate IV vs Quinine",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Règle d'or absolue : Toute fièvre au retour d'un séjour en pays d'endémie est un paludisme à Plasmodium falciparum à éliminer en extrême urgence (< 2h).",
    "Confirmation biologique sans délai : Frottis mince + Goutte épaisse (pour parasitémie) ou Test de Diagnostic Rapide (TDR antigénique HRP-2).",
    "Critères de gravité OMS majeurs : Coma / convulsions (Neuropaludisme), détresse respiratoire / œdème pulmonaire, collapsus hémodynamique, ictère clinique + parasitémie, hémoglobinurie, acidose métabolique (pH < 7.35, lactates > 5 mmol/L), hypoglycémie (< 2.2 mmol/L), anémie sévère (Hb < 7 g/dL).",
    "Traitement de référence du paludisme grave : Artésunate intraveineux (2.4 mg/kg à H0, H12, H24 puis 1x/jour) supérieur à la Quinine IV (moins de décès et pas d'hypoglycémie induite)."
  ],
  "htmlContent": "\n      <section id=\"urgence\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Urgence Diagnostique au Retour de Voyage</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Le paludisme d'importation à <em>Plasmodium falciparum</em> peut basculer en accès pernicieux mortel en quelques heures. Aucun délai n'est tolérable pour la réalisation et le rendu du frottis-goutte épaisse.\n        </p>\n      </section>\n      <section id=\"artesunate\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Traitement Salvateur : Artésunate IV</h2>\n        <div class=\"p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800\">\n          <p class=\"text-sm font-semibold text-emerald-900 dark:text-emerald-200 mb-2\">Protocole International & Recommandations OMS :</p>\n          <p class=\"text-xs text-navy-700 dark:text-navy-300\">\n            Artésunate IV 2,4 mg/kg à H0, H12, H24 puis une fois par jour jusqu'à relais oral par une combinaison thérapeutique à base d'artémisinine (CTA) complète de 3 jours. Monitorer l'hémolyse retardée post-artésunate à S2-S4.\n          </p>\n        </div>\n      </section>\n    ",
  "createdAt": "2026-08-29T10:00:00Z",
  "updatedAt": "2026-09-04T11:00:00Z"
},
  {
  "id": "cours_hemato_anemies",
  "slug": "diagnostic-d-une-anemie",
  "title": "Démarche Diagnostique devant une Anémie de l'Adulte",
  "subtitle": "Analyse du VGM et des réticulocytes, carence martiale, anémie inflammatoire et hémolyses aiguës",
  "specialtyId": "hemato",
  "specialtyName": "Hématologie Clinique",
  "author": "Pr. N. Merabet",
  "authorTitle": "Service d'Hématologie Clinique - CHU Mustapha",
  "description": "Arbre décisionnel rigoureux face à une anémie : définir le seuil selon l'OMS, classer selon le volume globulaire moyen (VGM) et le taux de réticulocytes pour distinguer le mécanisme central de la régénération périphérique.",
  "coverImage": "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Fondamental",
  "rang": "Rang A",
  "estimatedDuration": "40 min",
  "tags": [
    "Anémie",
    "VGM",
    "Réticulocytes",
    "Ferritine",
    "Carence martiale",
    "Hémolyse"
  ],
  "accessLevel": "PRO",
  "published": true,
  "viewsCount": 3100,
  "likesCount": 270,
  "qcmCount": 7,
  "tableOfContents": [
    {
      "id": "definition",
      "title": "1. Définition selon les Seuils OMS",
      "level": 1
    },
    {
      "id": "arbre",
      "title": "2. Arbre Décisionnel : VGM & Réticulocytes",
      "level": 1
    },
    {
      "id": "martiale",
      "title": "3. Anémie par Carence Martiale vs Inflammatoire",
      "level": 1
    },
    {
      "id": "hemolyse",
      "title": "4. Triade de l'Anémie Hémolytique",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Seuils OMS d'anémie : Hb < 13 g/dL chez l'homme, < 12 g/dL chez la femme, < 10,5 ou 11 g/dL chez la femme enceinte.",
    "Deuxième étape incontournable : Taux de réticulocytes (valeur absolue). Si > 120 000 / mm³ = régénérative (hémorragie aiguë ou hémolyse). Si < 120 000 / mm³ = arégénérative (centrale ou carentielle).",
    "Anémie microcytaire (VGM < 80 fL) : Doser la ferritine sérique. Ferritine basse = carence martiale (rechercher un saignement digestif ou gynécologique). Ferritine normale ou élevée = anémie inflammatoire ou thalassémie.",
    "Triade biologique de l'anémie hémolytique : Hyperbilirubinémie libre (non conjuguée) + Haptoglobine effondrée + LDH élevées."
  ],
  "htmlContent": "\n      <section id=\"definition\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Définition selon les Seuils OMS</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          L'anémie est définie par une diminution de la masse d'hémoglobine circulante totale par rapport aux valeurs physiologiques de référence pour l'âge et le sexe.\n        </p>\n      </section>\n      <section id=\"hemolyse\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Triade Biologique de l'Hémolyse</h2>\n        <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800\">\n          <ul class=\"text-sm space-y-1 text-navy-700 dark:text-navy-300\">\n            <li>• <strong>Haptoglobine effondrée</strong> ou indosable (marqueur le plus sensible).</li>\n            <li>• <strong>Bilirubine libre (non conjuguée)</strong> augmentée (ictère à urines claires).</li>\n            <li>• <strong>LDH sériques</strong> très élevées (reflétant la lyse cellulaire).</li>\n          </ul>\n        </div>\n      </section>\n    ",
  "createdAt": "2026-08-30T09:00:00Z",
  "updatedAt": "2026-09-04T13:00:00Z"
},
  {
  "id": "cours_rhumato_pr",
  "slug": "polyarthrite-rhumatoide",
  "title": "La Polyarthrite Rhumatoïde (PR) : Du Diagnostic au Traitement",
  "subtitle": "Critères diagnostiques ACR/EULAR 2010, auto-anticorps anti-CCP, radiographies ostéo-articulaires et biothérapies ciblées",
  "specialtyId": "rhumato",
  "specialtyName": "Rhumatologie",
  "author": "Pr. R. Slimani",
  "authorTitle": "Service de Rhumatologie - CHU Bab El Oued",
  "description": "Le rhumatisme inflammatoire chronique le plus fréquent. Détecter la synovite précoce pour préserver le capital articulaire : fenêtre d'opportunité thérapeutique et instauration du Méthotrexate.",
  "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "45 min",
  "tags": [
    "Polyarthrite rhumatoïde",
    "Anti-CCP",
    "Facteur rhumatoïde",
    "Méthotrexate",
    "Synovite",
    "Érosions osseuses"
  ],
  "accessLevel": "PRO",
  "published": true,
  "viewsCount": 2890,
  "likesCount": 240,
  "qcmCount": 7,
  "tableOfContents": [
    {
      "id": "clinique",
      "title": "1. Présentation Clinique & Dérouillage Matinal",
      "level": 1
    },
    {
      "id": "criteres",
      "title": "2. Critères de Classification ACR/EULAR 2010",
      "level": 1
    },
    {
      "id": "radio",
      "title": "3. Imagerie : Radiographies des Mains et Pieds",
      "level": 1
    },
    {
      "id": "traitement",
      "title": "4. Stratégie Thérapeutique (Treat to Target)",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Topographie évocatrice : Polyarthrite bilatérale, symétrique, distale, touchant les mains et les poignets (IPP, MCP) avec respect caractéristique des interphalangiennes distales (IPD).",
    "Signe clé : Horaire inflammatoire des douleurs avec réveils nocturnes et dérouillage matinal > 30 à 45 minutes.",
    "Auto-anticorps clés : Anticorps anti-peptides citrullinés (anti-CCP / ACPA) très spécifiques (> 95%) et plus précoces que le Facteur Rhumatoïde (FR).",
    "Traitement de fond de 1ère intention (csDMARD) : Méthotrexate per os ou sous-cutané (15 à 25 mg/semaine) en prise unique hebdomadaire associée à l'acide folique à 48h."
  ],
  "htmlContent": "\n      <section id=\"clinique\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Présentation Clinique & Dérouillage Matinal</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          La PR débute classiquement chez la femme d'âge moyen par une oligo ou polyarthrite bilatérale et symétrique prédominant aux mains et poignets. Le \"squeeze test\" (compression transversale des MCP et MTP) déclenche une douleur exquise caractéristique.\n        </p>\n      </section>\n    ",
  "createdAt": "2026-08-31T08:00:00Z",
  "updatedAt": "2026-09-04T14:00:00Z"
},
  {
  "id": "cours_psy_troubles_humeur",
  "slug": "troubles-de-l-humeur-et-risque-suicidaire",
  "title": "Les Épisodes Dépressifs Majeurs & La Crise Suicidaire",
  "subtitle": "Critères DSM-5, évaluation du potentiel suicidaire (modèle RUD), antidépresseurs ISRS et cadre médicolégal des soins sans consentement",
  "specialtyId": "psy",
  "specialtyName": "Psychiatrie",
  "author": "Pr. S. Tedjini",
  "authorTitle": "Service de Psychiatrie Universitaire - CHU Frantz Fanon",
  "description": "Identifier l'épisode dépressif caractérisé, dépister le virage maniaque (trouble bipolaire) et évaluer immédiatement le potentiel suicidaire selon les axes Risque / Urgence / Dangerosité.",
  "coverImage": "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "45 min",
  "tags": [
    "Dépression",
    "DSM-5",
    "Suicide",
    "ISRS",
    "Trouble bipolaire",
    "Hospitalisation sous contrainte"
  ],
  "accessLevel": "FREE",
  "published": true,
  "viewsCount": 3500,
  "likesCount": 310,
  "qcmCount": 8,
  "tableOfContents": [
    {
      "id": "dsm5",
      "title": "1. Critères Diagnostiques DSM-5 de l'EDM",
      "level": 1
    },
    {
      "id": "rud",
      "title": "2. Évaluation du Risque Suicidaire (Méthode RUD)",
      "level": 1
    },
    {
      "id": "therapeutique",
      "title": "3. Prise en Charge Thérapeutique & Antidépresseurs",
      "level": 1
    },
    {
      "id": "legal",
      "title": "4. Modalités Légales d'Hospitalisation",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Diagnostic positif d'EDM : Au moins 5 symptômes parmi 9 pendant au moins 2 semaines, dont obligatoirement soit l'humeur dépressive, soit l'anhédonie (perte d'intérêt/plaisir).",
    "Évaluation systématique du RUD : Risque (facteurs de vulnérabilité), Urgence (scénario précis dans les 24-48h, intentionnalité ferme), Dangerosité (létalité et accessibilité du moyen).",
    "Délai d'action des antidépresseurs (ISRS) : 2 à 4 semaines. Attention à la levée de l'inhibition psychomotrice avant l'amélioration de l'humeur (majoration transitoire du risque de passage à l'acte).",
    "Règle absolue : Éliminer un trouble bipolaire avant de prescrire un antidépresseur en monothérapie (risque d'induire un virage maniaque)."
  ],
  "htmlContent": "\n      <section id=\"rud\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Évaluation du Risque Suicidaire (RUD)</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 mb-4\">\n          <p class=\"text-sm font-semibold text-rose-900 dark:text-rose-200 mb-2\">Aborder directement les idées suicidaires ne donne JAMAIS l'idée du suicide au patient !</p>\n          <ul class=\"text-xs space-y-1 text-navy-700 dark:text-navy-300\">\n            <li>• <strong>R (Risque) :</strong> ATCD personnels de TS, isolement, précarité, maladie chronique.</li>\n            <li>• <strong>U (Urgence) :</strong> Degré de planification : scénario prêt, date fixée, adieux faits = URGENCE ÉLEVÉE.</li>\n            <li>• <strong>D (Dangerosité) :</strong> Arme à feu, médicaments stockés, accès à un pont/voie ferrée.</li>\n          </ul>\n        </div>\n      </section>\n    ",
  "createdAt": "2026-08-31T14:00:00Z",
  "updatedAt": "2026-09-04T12:00:00Z"
},
  {
  "id": "cours_ophtalmo_gafa",
  "slug": "glaucome-aigu-par-fermeture-de-l-angle",
  "title": "Le Glaucome Aigu par Fermeture de l'Angle (GAFA)",
  "subtitle": "Mécanisme de blocage pupillaire, œil rouge et douloureux, hypertonie majeure et acétazolamide IV",
  "specialtyId": "ophtalmo",
  "specialtyName": "Ophtalmologie",
  "author": "Dr. Y. Oulhadj",
  "authorTitle": "Service d'Ophtalmologie Médico-Chirurgicale",
  "description": "L'urgence ophtalmologique douloureuse par excellence. Blocage mécanique de l'évacuation de l'humeur aqueuse provoquant une montée fulgurante de la pression intra-oculaire avec risque de cécité irréversible en quelques heures.",
  "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "35 min",
  "tags": [
    "GAFA",
    "Hypertonie oculaire",
    "Mydriase aréactive",
    "Diamox",
    "Iridotomie laser",
    "Œil rouge"
  ],
  "accessLevel": "PRO",
  "published": true,
  "viewsCount": 2680,
  "likesCount": 215,
  "qcmCount": 6,
  "tableOfContents": [
    {
      "id": "mecanisme",
      "title": "1. Facteurs Favorisants & Blocage Pupillaire",
      "level": 1
    },
    {
      "id": "clinique",
      "title": "2. Tableau Clinique & Signes Physiques",
      "level": 1
    },
    {
      "id": "urgence",
      "title": "3. Traitement Médical Hypotonisant d'Urgence",
      "level": 1
    },
    {
      "id": "laser",
      "title": "4. Iridotomie Périphérique au Laser YAG Bilatérale",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Terrain type : Femme âgée hypermétrope (œil court à chambre antérieure étroite). Facteur déclenchant : passage à l'obscurité, stress ou collyre/médicament mydriatique parasympatholytique.",
    "Tableau clinique : Douleur oculaire violente péri-orbitaire, baisse brutale de l'acuité visuelle, halos colorés, céphalées avec nausées/vomissements.",
    "Examen ophtalmologique : Œil rouge à prédominance péri-kératique, œdème cornéen (perte de transparence), semi-mydriase aréactive, chambre antérieure plate et globe oculaire \"dur comme une bille de bois\" au toucher.",
    "Traitement médical immédiat : Acétazolamide (Diamox) IV 500 mg + réhydratation potassique + Mannitol 20% IV en perfusion rapide + collyres hypotonisants.",
    "Geste curatif et préventif indispensable : Iridotomie périphérique au laser YAG de l'œil atteint ET DE L'ŒIL CONTRALATÉRAL de façon bilatérale systématique."
  ],
  "htmlContent": "\n      <section id=\"clinique\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Tableau Clinique & Signes Physiques</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40\">\n          <p class=\"text-sm font-semibold text-rose-900 dark:text-rose-200 mb-2\">Signes physiques cardinaux à retenir pour le concours :</p>\n          <ul class=\"text-xs space-y-1 text-navy-700 dark:text-navy-300\">\n            <li>• <strong>Semi-mydriase aréactive</strong> unilatérale.</li>\n            <li>• <strong>Cercle péri-kératique</strong> violacé.</li>\n            <li>• <strong>Cornée trouble</strong> dépolie par œdème épithélial.</li>\n            <li>• Pression intra-oculaire &gt; 40 à 60 mmHg (Normale &le; 21 mmHg).</li>\n          </ul>\n        </div>\n      </section>\n    ",
  "createdAt": "2026-09-01T08:00:00Z",
  "updatedAt": "2026-09-04T15:00:00Z"
},
  {
  "id": "cours_orl_epistaxis",
  "slug": "epistaxis-grave-et-urgences-rhinologiques",
  "title": "L'Épistaxis Grave & Dyspnées Laryngées Aiguës",
  "subtitle": "Anatomie de la tache vasculaire de Kiesselbach, hémostase locale (tamponnement antérieur et postérieur) et surveillance hémodynamique",
  "specialtyId": "orl",
  "specialtyName": "O.R.L. & Chirurgie Cervico-Faciale",
  "author": "Pr. M. Khelifa",
  "authorTitle": "Service d'Oto-Rhino-Laryngologie - CHU Mustapha Bacha",
  "description": "Saignement d'origine endonasale très fréquent mais pouvant engager le pronostic vital par spoliation sanguine aiguë. Maîtriser les étapes graduées de l'hémostase : compression bidigitale, méchage antérieur, sonde à double ballonnet et embolisation.",
  "coverImage": "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "35 min",
  "tags": [
    "Épistaxis",
    "Méchage antérieur",
    "Kiesselbach",
    "Tamponnement postérieur",
    "Choc hémorragique",
    "ORL"
  ],
  "accessLevel": "FREE",
  "published": true,
  "viewsCount": 2950,
  "likesCount": 250,
  "qcmCount": 6,
  "tableOfContents": [
    {
      "id": "anatomie",
      "title": "1. Rappels Anatomiques (Tache Vasculaire)",
      "level": 1
    },
    {
      "id": "gravite",
      "title": "2. Critères de Gravité Immédiate",
      "level": 1
    },
    {
      "id": "hemostase",
      "title": "3. Gestes d'Hémostase Gradués",
      "level": 1
    },
    {
      "id": "etiologies",
      "title": "4. Étiologies : Poussée Hypertensive & Tumeurs",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Origine de 90% des épistaxis : Tache vasculaire de Kiesselbach (anastomose entre carotide interne et externe à la partie antéro-inférieure du septum nasal).",
    "Premier geste réflexe simple : Mouchage doux pour évacuer les caillots + compression bidigitale ferme des ailes du nez pendant 10 minutes, tête penchée en avant.",
    "En cas d'échec : Méchage antérieur bilatéral par mèches hémostatiques résorbables ou non résorbables (Merocel, Surgicel).",
    "Épistaxis postérieure réfractaire : Tamponnement postérieur par sonde à double ballonnet ou embolisation artérielle hypersélective des branches maxillaires internes.",
    "Rechercher impérativement une poussée hypertensive, un surdosage en anticoagulants (AVK/AOD) ou un cancer du cavum chez l'adulte."
  ],
  "htmlContent": "\n      <section id=\"hemostase\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Gestes d'Hémostase Gradués</h2>\n        <div class=\"space-y-3\">\n          <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-bold text-navy-900 dark:text-white\">Palier 1 : Compression bidigitale</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Patient assis, tête penchée en avant (NE PAS pencher la tête en arrière pour ne pas déglutir le sang), mouchage préalable, compression 10 minutes montre en main.</p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-bold text-navy-900 dark:text-white\">Palier 2 : Tamponnement antérieur</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Mèches imbibées de xylocaïne naphtazolinée ou mèches de Merocel lubrifiées, laissées en place 48 heures sous couverture antibiotique.</p>\n          </div>\n        </div>\n      </section>\n    ",
  "createdAt": "2026-09-01T11:00:00Z",
  "updatedAt": "2026-09-04T16:00:00Z"
},
  {
  "id": "cours_urgences_acr",
  "slug": "arret-cardio-respiratoire-et-reanimation",
  "title": "L'Arrêt Cardio-Respiratoire (ACR) & Réanimation Cardio-Pulmonaire",
  "subtitle": "Reconnaissance immédiate, chaîne de survie, rythme défibrillable vs non-défibrillable et algorithme ERC/AHA 2024",
  "specialtyId": "urgences",
  "specialtyName": "Urgences & Réanimation",
  "author": "Dr. K. Hamadache",
  "authorTitle": "Service d'Accueil des Urgences & SMUR",
  "description": "L'extrême urgence médicale. Chaque minute perdue diminue la survie de 10%. Algorithme universel : compressions thoraciques continues de haute qualité, analyse du rythme et recherche des causes réversibles 4H / 4T.",
  "coverImage": "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "45 min",
  "tags": [
    "ACR",
    "RCP",
    "Défibrillation",
    "Adrénaline",
    "Amiodarone",
    "4H 4T"
  ],
  "accessLevel": "FREE",
  "published": true,
  "viewsCount": 4500,
  "likesCount": 420,
  "qcmCount": 8,
  "tableOfContents": [
    {
      "id": "chaine",
      "title": "1. La Chaîne de Survie & Diagnostic de l'ACR",
      "level": 1
    },
    {
      "id": "rcp",
      "title": "2. Réanimation Cardio-Pulmonaire de Haute Qualité",
      "level": 1
    },
    {
      "id": "rythmes",
      "title": "3. Rythmes Défibrillables (FV/TV) vs Non-défibrillables (Asystolie/AESP)",
      "level": 1
    },
    {
      "id": "causes",
      "title": "4. Causes Réversibles : La Règle des 4H / 4T",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Diagnostic instantané : Patient inconscient ne répondant pas + absence de respiration normale (respiration absente ou gasps agoniques) = DÉBUTER LA RCP SANS PERDRE DE TEMPS À CHERCHER LE POULS.",
    "Massage cardiaque de haute qualité : Fréquence 100 à 120/min, profondeur 5 à 6 cm, décompression thoracique complète, interruption minimale (< 5 secondes). Ratio 30:2.",
    "Rythmes défibrillables (FV et TV sans pouls) : Choc électrique externe précoce (150-200 J biphasique) suivi immédiatement de 2 minutes de RCP avant toute réévaluation. Adrénaline 1 mg après le 3e choc + Amiodarone 300 mg.",
    "Rythmes non défibrillables (Asystolie et Dissociation Électromécanique / AESP) : Adrénaline 1 mg IV le plus tôt possible, PAS DE CHOC, chercher et traiter les causes 4H / 4T."
  ],
  "htmlContent": "\n      <section id=\"causes\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Causes Réversibles : 4H / 4T</h2>\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n          <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800\">\n            <h4 class=\"font-bold text-indigo-900 dark:text-indigo-200 mb-2\">Les 4 \"H\"</h4>\n            <ul class=\"text-xs space-y-1 text-navy-700 dark:text-navy-300\">\n              <li>• <strong>H</strong>ypoxie</li>\n              <li>• <strong>H</strong>ypovolémie</li>\n              <li>• <strong>H</strong>ypo / Hyperkaliémie & troubles métaboliques</li>\n              <li>• <strong>H</strong>ypothermie</li>\n            </ul>\n          </div>\n          <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800\">\n            <h4 class=\"font-bold text-rose-900 dark:text-rose-200 mb-2\">Les 4 \"T\"</h4>\n            <ul class=\"text-xs space-y-1 text-navy-700 dark:text-navy-300\">\n              <li>• Pneumothorax sous <strong>T</strong>ension</li>\n              <li>• <strong>T</strong>amponnade cardiaque</li>\n              <li>• <strong>T</strong>oxiques (surdosage médicamenteux)</li>\n              <li>• <strong>T</strong>hrombose (coronaire ou embolie pulmonaire massive)</li>\n            </ul>\n          </div>\n        </div>\n      </section>\n    ",
  "createdAt": "2026-09-02T08:00:00Z",
  "updatedAt": "2026-09-04T17:00:00Z"
},
  {
  "id": "cours_chirurgie_appendicite",
  "slug": "appendicite-aigue-et-peritonite-generalisee",
  "title": "L'Appendicite Aiguë & Les Péritonites Aiguës Généralisées",
  "subtitle": "Signes physiques péritonéaux (Blumberg, Rovsing), score d'Alvarado, imagerie (écho/TDM) et antibioprophylaxie peropératoire",
  "specialtyId": "chirurgie",
  "specialtyName": "Chirurgie Générale & Viscérale",
  "author": "Pr. H. Bendib",
  "authorTitle": "Clinique Chirurgicale Centrale - CHU Mustapha",
  "description": "Urgence chirurgicale abdominale la plus fréquente. Diagnostic clinique guidé par les signes d'irritation péritonéale, confirmation radiologique par échographie chez l'enfant et scanner abdomino-pelvien injecté chez l'adulte.",
  "coverImage": "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "40 min",
  "tags": [
    "Appendicite",
    "Péritonite",
    "Défense abdominale",
    "McBurney",
    "Laparoscopie",
    "Chirurgie"
  ],
  "accessLevel": "FREE",
  "published": true,
  "viewsCount": 3870,
  "likesCount": 340,
  "qcmCount": 8,
  "tableOfContents": [
    {
      "id": "semiologie",
      "title": "1. Sémiologie Clinique (Point de McBurney)",
      "level": 1
    },
    {
      "id": "formes",
      "title": "2. Formes Topographiques Trompeuses",
      "level": 1
    },
    {
      "id": "peritonite",
      "title": "3. Péritonite Aiguë Généralisée (Le Ventre de Bois)",
      "level": 1
    },
    {
      "id": "chirurgie",
      "title": "4. Prise en Charge Chirurgicale & Cœlioscopie",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Triade classique de Dieulafoy : Douleur spontanée de la FID + Défense musculaire localisée de la FID + Hyperesthésie cutanée.",
    "Signes physiques caractéristiques : Signe de Blumberg (décompression douloureuse de la FID), signe de Rovsing (pression en FIG déclenchant la douleur en FID).",
    "Formes topographiques à connaître absolument : Rétro-cæcale (douleur lombaire avec psoïtis), pelvienne (signes urinaires ou rectaux avec douleur au toucher rectal), sous-hépatique (simulant une cholécystite).",
    "Péritonite généralisée : Contracture abdominale invincible, permanente, douloureuse (\"ventre de bois\") + disparition de la matité pré-hépatique si perforation d'organe creux (pneumopéritoine au scanner).",
    "Traitement : Appendicectomie par cœlioscopie avec prélèvement bactériologique systématique et antibioprophylaxie ciblée."
  ],
  "htmlContent": "\n      <section id=\"peritonite\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Péritonite Aiguë Généralisée</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40\">\n          <p class=\"text-sm font-semibold text-rose-900 dark:text-rose-200 mb-2\">Signe cardinal : La Contracture Abdominale</p>\n          <p class=\"text-xs text-navy-700 dark:text-navy-300 leading-relaxed\">\n            Rigidité pariétale réflexe, involontaire, invincible, permanente et douloureuse (\"ventre de bois\"). Urgence chirurgicale absolue : réanimation hémodynamique, antibiothérapie probabiliste anti-BGN et anaérobies (Ceftriaxone + Métronidazole) et laparotomie / cœlioscopie de toilette péritonéale sans délai.\n          </p>\n        </div>\n      </section>\n    ",
  "createdAt": "2026-09-02T12:00:00Z",
  "updatedAt": "2026-09-04T18:00:00Z"
},
  {
  "id": "cours_uro_colique_nephretique",
  "slug": "colique-nephretique-aigue",
  "title": "La Colique Néphrétique Aiguë (CNA) & Torsion Testiculaire",
  "subtitle": "Mécanismes d'hyperpression pyélique, calcul urinaire, critères de gravité (fièvre, anurie) et urgence de la torsion du cordon spermatique",
  "specialtyId": "uro",
  "specialtyName": "Urologie",
  "author": "Pr. A. Djellouli",
  "authorTitle": "Service d'Urologie & Transplantation Rénale",
  "description": "Douleur lombo-abdominale aiguë brutale par mise en tension brutale de la voie excétrice supérieure. Savoir dépister immédiatement la colique néphrétique compliquée (pyélonéphrite obstructive) et ne jamais passer à côté d'une torsion du testicule.",
  "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "40 min",
  "tags": [
    "Colique néphrétique",
    "Calcul rénal",
    "AINS",
    "Sonde JJ",
    "Torsion testiculaire",
    "Urgence urologique"
  ],
  "accessLevel": "PRO",
  "published": true,
  "viewsCount": 3120,
  "likesCount": 275,
  "qcmCount": 7,
  "tableOfContents": [
    {
      "id": "clinique",
      "title": "1. Clinique de la Colique Néphrétique Simple",
      "level": 1
    },
    {
      "id": "gravite",
      "title": "2. Les 3 Formes Compliquées Imposant l'Hospitalisation",
      "level": 1
    },
    {
      "id": "traitement",
      "title": "3. Prise en Charge Antalgique (Rôle Pivot des AINS)",
      "level": 1
    },
    {
      "id": "torsion",
      "title": "4. Torsion du Cordon Spermatique (La Règle des 6 Heures)",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Douleur unilatérale lombaire brutale irradiant vers les organes génitaux externes, sans position antalgique (\"colique frénétique\").",
    "Les 3 formes compliquées justifiant une dérivation urgente des urines (sonde JJ ou néphrostomie) : 1) CNA fébrile (pyélonéphrite obstructive = choc septique), 2) CNA anurique (rein unique fonctionnel), 3) CNA hyperalgique rebelle aux morphiniques.",
    "Traitement médical de la crise simple : AINS IV (Kétoprofène 100 mg) en 1ère intention (diminue le tonus du muscle lisse urétéral et l'œdème local) + restriction hydrique transitoire pendant la crise.",
    "Torsion testiculaire : Grosse bourse douloureuse aiguë chez l'adolescent avec testicule ascensionné horizontalisé. EXPLORATION CHIRURGICALE EN URGENCE AVANT LA 6e HEURE SANS AUCUN EXAMEN RADIOLOGIQUE PRÉALABLE."
  ],
  "htmlContent": "\n      <section id=\"gravite\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Les 3 Formes Compliquées d'Urgence</h2>\n        <div class=\"space-y-3\">\n          <div class=\"p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800\">\n            <h4 class=\"font-bold text-sm text-rose-900 dark:text-rose-200\">1. CNA Fébrile (Urgence Médico-Chirurgicale Absolue)</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Obstruction sur rein infecté. Dérivation urinaire en urgence par sonde double J sous anesthésie + hémocultures + antibiothérapie IV bactéricide.</p>\n          </div>\n          <div class=\"p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800\">\n            <h4 class=\"font-bold text-sm text-amber-900 dark:text-amber-200\">2. CNA Anurique</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Obstruction sur rein unique anatomique ou fonctionnel, ou calculs bilatéraux simultanés. Risque d'insuffisance rénale anurique irréversible.</p>\n          </div>\n          <div class=\"p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800\">\n            <h4 class=\"font-bold text-sm text-purple-900 dark:text-purple-200\">3. CNA Hyperalgique</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Douleur intolérable résistant au traitement morphinique IV bien conduit. Indication de décompression.</p>\n          </div>\n        </div>\n      </section>\n    ",
  "createdAt": "2026-09-02T15:00:00Z",
  "updatedAt": "2026-09-04T18:30:00Z"
},
  {
  "id": "cours_ortho_fracture_ouverte",
  "slug": "fractures-ouvertes-et-syndrome-des-loges",
  "title": "Les Fractures Ouvertes de Jambe & Le Syndrome des Loges",
  "subtitle": "Classification de Gustilo et Cauchoix-Duparc, antibioprophylaxie, parage chirurgical et urgence de l'aponévrotomie de décharge",
  "specialtyId": "ortho",
  "specialtyName": "Orthopédie & Traumatologie",
  "author": "Pr. M. Yahiaoui",
  "authorTitle": "Service de Traumatologie-Orthopédie - CHU Bab El Oued",
  "description": "Traumatisme squelettique majeur avec communication directe entre le foyer de fracture et l'extérieur. Prévention du risque d'ostéite chronique et détection précoce du syndrome des loges ischémique.",
  "coverImage": "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "45 min",
  "tags": [
    "Fracture ouverte",
    "Cauchoix-Duparc",
    "Syndrome des loges",
    "Fixateur externe",
    "Aponévrotomie",
    "Orthopédie"
  ],
  "accessLevel": "PRO",
  "published": true,
  "viewsCount": 2780,
  "likesCount": 230,
  "qcmCount": 6,
  "tableOfContents": [
    {
      "id": "classification",
      "title": "1. Classification de Cauchoix-Duparc & Gustilo",
      "level": 1
    },
    {
      "id": "urgence",
      "title": "2. Prise en Charge Immédiate aux Urgences",
      "level": 1
    },
    {
      "id": "loges",
      "title": "3. Le Syndrome des Loges (Urgence Fonctionnelle Absolue)",
      "level": 1
    },
    {
      "id": "chirurgie",
      "title": "4. Principes de la Stabilisation Osseuse",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Classification de Cauchoix-Duparc : Type I (plaie punctiforme sans décollement suturable sans tension), Type II (délabrement cutané avec risque de nécrose secondaire), Type III (perte de substance cutanée non recouvrable d'emblée).",
    "Aux urgences immédiates : Vérification vaccination antitétanique + antibioprophylaxie précoce (Céphalosporine 1G/2G ou Amoxicilline-Acide clavulanique) + pansement stérile protecteur (ne jamais réintroduire un fragment d'os extériorisé).",
    "Syndrome des loges : Douleur disproportionnée insupportable résistant aux antalgiques majeurs, tension musculaire ligneuse à la palpation, douleur violente à l'étirement passif des orteils. Pouls distaux conservés au début !",
    "Traitement du syndrome des loges : Aponévrotomie de décharge en extrême urgence de toutes les loges musculaires de la jambe pour éviter la nécrose musculaire et la néphropathie myoglobinurique (rhabdomyolyse)."
  ],
  "htmlContent": "\n      <section id=\"loges\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Le Syndrome des Loges</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40\">\n          <div class=\"font-bold text-rose-800 dark:text-rose-300 mb-1\">🚨 PIÈGE MAJEUR AUX EXAMENS : La Présence des Pouls Distaux</div>\n          <p class=\"text-xs text-navy-700 dark:text-navy-300 leading-relaxed\">\n            La présence des pouls pédieux ou tibiaux postérieurs <strong>n'élimine absolument pas</strong> un syndrome des loges ! La pression intramusculaire dépasse la pression de perfusion capillaire bien avant d'occlure les gros troncs artériels. Le signe d'alerte le plus précoce et le plus sensible est la <strong>douleur exquise à l'étirement passif des muscles de la loge atteinte</strong>. Traitement sans délai : Aponévrotomie de décharge cutanéo-aponévrotique large.\n          </p>\n        </div>\n      </section>\n    ",
  "createdAt": "2026-09-03T09:00:00Z",
  "updatedAt": "2026-09-04T19:00:00Z"
},
  {
  "id": "cours_interne_lupus",
  "slug": "lupus-erythemateux-systemique",
  "title": "Le Lupus Érythémateux Systémique (LES) & Maladie de Horton",
  "subtitle": "Critères ACR/EULAR 2019, dépistage de la néphropathie lupique, anticorps anti-ADN natif et hydroxychloroquine au long cours",
  "specialtyId": "interne",
  "specialtyName": "Médecine Interne",
  "author": "Pr. Z. Aït Kaci",
  "authorTitle": "Service de Médecine Interne & Immunologie Clinique - CHU Mustapha",
  "description": "Archétype de la maladie auto-immune non spécifique d'organe touchant principalement la femme jeune. Savoir rechercher les atteintes viscérales engageant le pronostic vital (atteinte rénale, cardiaque et cérébrale) et prescrire la surveillance biologique.",
  "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
  "difficulty": "Incontournable",
  "rang": "Rang A",
  "estimatedDuration": "45 min",
  "tags": [
    "Lupus",
    "AAN",
    "Anti-ADN natif",
    "Néphropathie lupique",
    "Plaquenil",
    "Médecine interne"
  ],
  "accessLevel": "PREMIUM",
  "published": true,
  "viewsCount": 2950,
  "likesCount": 260,
  "qcmCount": 8,
  "tableOfContents": [
    {
      "id": "criteres",
      "title": "1. Critères de Classification EULAR/ACR 2019",
      "level": 1
    },
    {
      "id": "clinique",
      "title": "2. Manifestations Cutanées & Viscérales",
      "level": 1
    },
    {
      "id": "nephropathie",
      "title": "3. La Néphropathie Lupique (La Biopsie Rénale)",
      "level": 1
    },
    {
      "id": "traitement",
      "title": "4. Traitement de Fond : Rôle Pivot de l'Hydroxychloroquine",
      "level": 1
    }
  ],
  "summaryPoints": [
    "Porte d'entrée obligatoire des critères EULAR/ACR 2019 : Présence d'Anticorps Anti-Nucléaires (AAN) à un titre &ge; 1/80 sur cellules HEp-2.",
    "Auto-anticorps hautement spécifiques : Anticorps anti-ADN natif double brin (corrélés à l'activité de la maladie et au risque rénal) et anti-Sm.",
    "Érythème en aile de papillon (vespertilio) du visage respectant les sillons naso-géniens, photosensibilité et alopécie diffuse.",
    "Dépistage rénal systématique à chaque consultation : Recherche d'une protéinurie (bandelette et rapport P/C) et examen du sédiment urinaire (hématurie, cylindres). La ponction biopsie rénale (PBR) est indispensable en cas de protéinurie > 0.5 g/j.",
    "Traitement fondamental de tout patient lupique sans exception : Hydroxychloroquine (Plaquenil) &le; 5 mg/kg/j (réduit les poussées, la mortalité et le risque thrombotique) avec surveillance ophtalmologique régulière."
  ],
  "htmlContent": "\n      <section id=\"criteres\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Critères EULAR/ACR 2019</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Le diagnostic repose sur le critère d'entrée positif (AAN &ge; 1/80) associé à un score &ge; 10 points réparti entre les domaines cliniques (constitutionnel, hématologique, neuropsychiatrique, cutanéo-muqueux, séreux, musculo-squelettique, rénal) et immunologiques (anticorps anti-phospholipides, fractions du complément C3/C4 consommées, anti-ADN natif ou anti-Sm).\n        </p>\n      </section>\n      <section id=\"traitement\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. L'Hydroxychloroquine : Traitement de Base Indispensable</h2>\n        <div class=\"p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800\">\n          <p class=\"text-sm font-semibold text-emerald-900 dark:text-emerald-200 mb-2\">Recommandation Internationale de Niveau A :</p>\n          <p class=\"text-xs text-navy-700 dark:text-navy-300\">\n            Tout patient atteint de LES doit recevoir de l'hydroxychloroquine (sauf contre-indication ophtalmologique absolue). Elle prévient les rechutes viscérales, diminue les complications cardiovasculaires et prolonge la survie globale.\n          </p>\n        </div>\n      </section>\n    ",
  "createdAt": "2026-09-03T14:00:00Z",
  "updatedAt": "2026-09-04T19:30:00Z"
}
];
