import { Course } from '@/types';

export const INITIAL_COURSES: Course[] = [
  {
    "id": "cours_neuro_behcet",
    "slug": "la-maladie-de-behcet-neuro-behcet",
    "title": "La Maladie de Behçet & Neuro-Behçet",
    "subtitle": "Diagnostic positif (ICBD 2014), Neuro-Behçet parenchymateux vs vasculaire (TVC), génétique (HLA-B51) et stratégie thérapeutique",
    "specialtyId": "neuro",
    "specialtyName": "Neurologie",
    "author": "Pr. A. Benmansour",
    "authorTitle": "Chef de Service de Neurologie & Pathologies Auto-immunes - CHU Oran / CHU Sidi Bel Abbès",
    "description": "Guide clinique complet conforme aux programmes officiels du Résidanat des facultés de Médecine d'Oran et de Sidi Bel Abbès (SBA) : vasculite systémique non ANCA-associée, aphtose bipolarisée, uvéite rétinienne, méningo-encéphalite du tronc cérébral, thromboses veineuses cérébrales, test de pathergie et protocoles de biothérapie (anti-TNF alpha).",
    "coverImage": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "rang": "Rang A",
    "estimatedDuration": "45 min",
    "createdAt": "2026-01-01",
    "updatedAt": "2026-01-01",
    "tags": [
      "Maladie de Behçet",
      "Neuro-Behçet",
      "Aphtose Bipolarisée",
      "HLA-B51",
      "Test de Pathergie",
      "Thrombose Veineuse Cérébrale",
      "Colchicine",
      "Infliximab",
      "Oran",
      "SBA"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 3120,
    "likesCount": 385,
    "qcmCount": 3,
    "tableOfContents": [
      {
        "id": "intro",
        "title": "1. Introduction, Épidémiologie & Génétique (HLA-B51)",
        "level": 1
      },
      {
        "id": "clinique",
        "title": "2. Triade Clinique : Mucosite Bipolarisée & Lésions Oculaires",
        "level": 1
      },
      {
        "id": "neuro-behcet",
        "title": "3. Neuro-Behçet : Forme Parenchymateuse vs Vasculaire (TVC)",
        "level": 1
      },
      {
        "id": "vascularite",
        "title": "4. Vascularite Systémique & Anévrysmes Pulmonaires",
        "level": 1
      },
      {
        "id": "diagnostic",
        "title": "5. Diagnostic Positif, Test de Pathergie & Critères ICBD",
        "level": 1
      },
      {
        "id": "traitement",
        "title": "6. Prise en Charge Thérapeutique & Protocoles EULAR",
        "level": 1
      },
      {
        "id": "points-cles",
        "title": "7. Points Clés Concours & Annales (Oran & Sidi Bel Abbès)",
        "level": 1
      }
    ],
    "summaryPoints": [
      "Aphtose buccale récidivante (au moins 3 poussées en 12 mois) : Élément inaugural cardinal présent dans plus de 98% des cas.",
      "Neuro-Behçet Parenchymateux (80%) : Méningo-encéphalite touchant préférentiellement le tronc cérébral (jonction bulbopontique) et les noyaux gris centraux (Hyperintensité T2/FLAIR à l'IRM).",
      "Neuro-Behçet Vasculaire (20%) : Thrombose Veineuse Cérébrale (TVC des sinus duraux) se révélant par un syndrome d'hypertension intracrânienne (HTIC).",
      "Biologie & Génétique : Négativité stricte des auto-anticorps (AAN négatifs, ANCA négatifs). Forte association avec le marqueur HLA-B51 (HLA-B5101).",
      "Test de Pathergie : Papulo-pustule stérile apparaissant 24 à 48h après une piqûre intradermique à l'avant-bras (très spécifique de la maladie de Behçet).",
      "Traitement de référence : Colchicine (1 à 2 mg/j) pour l'aphtose ; Bolus de Solumedrol (1g/j x 3-5j) + Cyclophosphamide ou Anti-TNF alpha (Infliximab/Adalimumab) pour les formes graves neurologiques et oculaires."
    ],
    "htmlContent": "\n      <section id=\"intro\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Introduction, Épidémiologie & Génétique (HLA-B51)</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          La <strong>Maladie de Behçet</strong> est une vasculite systémique chronique d'évolutivité par poussées-rémissions. Elle se caractérise anatomopathologiquement par une <strong>angéite péricapillaire et veineuse</strong> atteignant les vaisseaux de tous calibres (petits, moyens et gros vaisseaux artériels et veineux), sans nécrose ni ANCA.\n        </p>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Elle prédomine le long de la mythique <em>Route de la Soie</em> (du Bassin Méditerranéen jusqu'à l'Asie de l'Est). En Algérie (notamment dans les régions de l'Ouest : <strong>Oran, Sidi Bel Abbès, Tlemcen</strong>), sa prévalence est élevée, touchant avec prédilection l'adulte jeune (20 à 40 ans) avec un sex-ratio prédominant chez l'homme pour les formes neurologiques graves.\n        </p>\n\n        <div class=\"p-4 my-5 rounded-2xl border border-indigo-100 bg-indigo-50/60 dark:border-indigo-900/50 dark:bg-indigo-950/20\">\n          <div class=\"flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold mb-1\">\n            <span class=\"text-lg\">🧬</span> Marqueur Génétique Prépondérant : HLA-B51\n          </div>\n          <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n            L'allèle <strong>HLA-B51 (sous-type B*5101)</strong> est présent chez 50 à 80% des patients d'Afrique du Nord. Il constitue le facteur de susceptibilité génétique le plus puissant, bien qu'il ne soit pas indispensable au diagnostic positif. <strong>Biologie habituelle :</strong> Absence d'auto-anticorps (AAN -, ANCA -, FR -).\n          </p>\n        </div>\n      </section>\n\n      <section id=\"clinique\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Triade Clinique : Mucosite Bipolarisée & Lésions Oculaires</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Le diagnostic repose essentiellement sur l'examen clinique minutieux à la recherche de la triade d'Hulusi Behçet :\n        </p>\n\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-6\">\n          <div class=\"p-5 rounded-2xl bg-white dark:bg-navy-800/80 border border-navy-100 dark:border-navy-700 shadow-soft\">\n            <h3 class=\"font-bold text-navy-900 dark:text-white mb-2 flex items-center gap-2\">\n              <span class=\"w-3 h-3 rounded-full bg-rose-500\"></span> 1. Aphtose Bipolarisée (Obligatoire)\n            </h3>\n            <ul class=\"space-y-2 text-sm text-navy-600 dark:text-navy-300\">\n              <li>• <strong>Aphtose buccale :</strong> Présente chez 98-100% des malades. Ulcérations douloureuses, à fond beurre frais, à bords emportés à la pièce, guérissant sans cicatrice en 10-14 jours. Au moins 3 poussées/an.</li>\n              <li>• <strong>Aphtose génitale :</strong> Très spécifique (95%). Ulcérations du scrotum/testicules chez l'homme, des grandes lèvres/vulve chez la femme. Laissent des <em>cicatrices atrophiques blanchâtres pathognomoniques</em>.</li>\n            </ul>\n          </div>\n          <div class=\"p-5 rounded-2xl bg-white dark:bg-navy-800/80 border border-navy-100 dark:border-navy-700 shadow-soft\">\n            <h3 class=\"font-bold text-navy-900 dark:text-white mb-2 flex items-center gap-2\">\n              <span class=\"w-3 h-3 rounded-full bg-amber-500\"></span> 2. Atteinte Oculaire (Pronostic visuel)\n            </h3>\n            <ul class=\"space-y-2 text-sm text-navy-600 dark:text-navy-300\">\n              <li>• Touchant 50 à 70% des patients, bilatérale et menaçante.</li>\n              <li>• <strong>Uvéite antérieure aiguë à hypopyon</strong> (niveau de pus stérile dans la chambre antérieure).</li>\n              <li>• <strong>Uvéite postérieure & Vasculite rétinienne :</strong> Engaineur veineux, hyalite, œdème maculaire (risque de cécité irréversible).</li>\n            </ul>\n          </div>\n        </div>\n\n        <div class=\"p-5 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-700 mb-6\">\n          <h3 class=\"font-bold text-navy-900 dark:text-white mb-2\">3. Manifestations Cutanées</h3>\n          <p class=\"text-sm text-navy-700 dark:text-navy-300 leading-relaxed\">\n            • <strong>Érythème noueux :</strong> Nouures dermothermiques douloureuses des membres inférieurs.<br>\n            • <strong>Pseudofolliculite superficielle / Pustules stériles :</strong> Pustules non centré par un poil sur le tronc et les membres.\n          </p>\n        </div>\n      </section>\n\n      <section id=\"neuro-behcet\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Neuro-Behçet : Forme Parenchymateuse vs Vasculaire (TVC)</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          L'atteinte du système nerveux central (<strong>Neuro-Behçet</strong>) survient dans 10 à 20% des cas, habituellement 3 à 5 ans après les aphtes. Elle conditionne le pronostic vital et fonctionnel. On distingue formellement deux phénotypes majeurs :\n        </p>\n\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-5 mb-6\">\n          <!-- Forme Parenchymateuse -->\n          <div class=\"p-6 rounded-2xl bg-rose-50/70 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50 space-y-3\">\n            <div class=\"flex items-center justify-between\">\n              <span class=\"px-3 py-1 bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 font-black text-xs rounded-full uppercase\">Forme Parenchymateuse (~80%)</span>\n              <span class=\"text-xl\">🧠</span>\n            </div>\n            <h3 class=\"text-lg font-bold text-rose-950 dark:text-rose-100\">Méningo-Encéphalite du Tronc Cérébral</h3>\n            <ul class=\"text-sm text-rose-900 dark:text-rose-200 space-y-2 leading-relaxed\">\n              <li>• <strong>Siège préférentiel :</strong> Tronc cérébral (pédoncules cérébraux, protubérance), noyaux gris centraux et capsule interne.</li>\n              <li>• <strong>Tableau clinique :</strong> Syndrome pyramidal (hémiparésie), syndrome cérébelleux, ophtalmoplégie internucléaire, paralysie des nerfs crâniens (diplopie), troubles de l'humeur et détérioration cognitive.</li>\n              <li>• <strong>IRM Cérébrale (Clé) :</strong> Hyperintensités en T2 et FLAIR périventriculaires et sous-corticales avec aspect d'œdème inflammatoire (\"en tache de bougie\").</li>\n              <li>• <strong>Ponction Lumbal :</strong> Pléiocytose modérée (panachée PNN / Lymphocytes), hyperprotéinorachie.</li>\n            </ul>\n          </div>\n\n          <!-- Forme Vasculaire -->\n          <div class=\"p-6 rounded-2xl bg-amber-50/70 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50 space-y-3\">\n            <div class=\"flex items-center justify-between\">\n              <span class=\"px-3 py-1 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-black text-xs rounded-full uppercase\">Forme Vasculaire / TVC (~20%)</span>\n              <span class=\"text-xl\">🩸</span>\n            </div>\n            <h3 class=\"text-lg font-bold text-amber-950 dark:text-amber-100\">Thrombose Veineuse Cérébrale (TVC)</h3>\n            <ul class=\"text-sm text-amber-900 dark:text-amber-200 space-y-2 leading-relaxed\">\n              <li>• <strong>Mécanisme :</strong> Thrombo-phlébite des sinus veineux duraux (sinus sagittal supérieur, sinus transverse, sinus latéral).</li>\n              <li>• <strong>Tableau clinique :</strong> Syndrome d'<strong>Hypertension Intracrânienne (HTIC)</strong> avec céphalées intenses progressives, œdème papillaire au fond d'œil, vomissements et diplopie par atteinte du VI.</li>\n              <li>• <strong>Angio-IRM Cérébrale (MRV) :</strong> Absence de flux (défaut de rehaussement) dans le sinus dural thrombosé (Signe du delta).</li>\n              <li>• <strong>Pronostic :</strong> Meilleur que la forme parenchymateuse sous anticoagulation et corticothérapie.</li>\n            </ul>\n          </div>\n        </div>\n\n        <div class=\"p-4 rounded-xl bg-purple-50 border border-purple-200 dark:bg-purple-950/20 dark:border-purple-900/40 my-4\">\n          <div class=\"flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold mb-1\">\n            ⚠️ Piège Résidanat Oran / SBA : Forme Mixte\n          </div>\n          <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n            Les formes parenchymateuses et non-parenchymateuses (TVC) s'excluent mutuellement chez un même patient dans plus de 90% des cas ! La survenue d'une TVC impose de rechercher d'autres thromboses périphériques (TVP des membres inférieurs).\n          </p>\n        </div>\n      </section>\n\n      <section id=\"vascularite\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Vascularite Systémique & Anévrysmes Pulmonaires</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          La maladie de Behçet est la seule vasculite capable de toucher les artères et les veines de toutes tailles :\n        </p>\n        <ul class=\"list-disc pl-6 space-y-3 text-navy-700 dark:text-navy-300 mb-4\">\n          <li><strong>Angio-Behçet Veineux (30%) :</strong> Thromboses veineuses profondes (TVP) récidivantes des membres inférieurs, phlébite de la veine cave inférieure (Syndrome de Budd-Chiari).</li>\n          <li><strong>Angio-Behçet Artériel (5%) :</strong> <strong>Anévrysmes de l'artère pulmonaire (AAP)</strong>. C'est la complication artérielle la plus redoutable ! Elle se manifeste par des <em>hémoptysies foudrayantes</em> par rupture anévrysmale.</li>\n          <li><strong>Atteinte Articulaire (50%) :</strong> Mono ou oligopléomorphe non érosive et non déformante (genoux, chevilles).</li>\n        </ul>\n      </section>\n\n      <section id=\"diagnostic\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">5. Diagnostic Positif, Test de Pathergie & Critères ICBD</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Le test de pathergie évalue l'hyperréactivité cutanée non spécifique induite par micro-traumatisme.\n        </p>\n\n        <div class=\"p-4 my-4 rounded-xl border border-teal-200 bg-teal-50/50 dark:border-teal-900/50 dark:bg-teal-950/20\">\n          <div class=\"font-bold text-teal-800 dark:text-teal-300 mb-1\">📌 Protocole du Test de Pathergie (Pathergy Test)</div>\n          <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n            Inoculation d'une aiguille stérile de 20G en intradermique au niveau de la face antérieure de l'avant-bras. <strong>Lecture à 24-48 heures :</strong> Positif si apparition d'une papule ou pustule stérile d'au moins 2 mm de diamètre entourée d'un érythème.\n          </p>\n        </div>\n\n        <h3 class=\"text-lg font-bold text-navy-900 dark:text-white mb-3\">Critères Diagnostiques Internationaux (ICBD 2014) :</h3>\n        <div class=\"overflow-x-auto mb-6\">\n          <table class=\"w-full text-left border-collapse border border-slate-200 dark:border-navy-700 rounded-xl overflow-hidden\">\n            <thead class=\"bg-slate-100 dark:bg-navy-800 text-xs font-bold uppercase text-navy-700 dark:text-navy-200\">\n              <tr>\n                <th class=\"p-3 border border-slate-200 dark:border-navy-700\">Critère Clinique ICBD</th>\n                <th class=\"p-3 border border-slate-200 dark:border-navy-700 text-center\">Score de Points</th>\n              </tr>\n            </thead>\n            <tbody class=\"text-sm text-navy-700 dark:text-navy-300 divide-y divide-slate-100 dark:divide-navy-800\">\n              <tr>\n                <td class=\"p-3 font-semibold\">Lésions Oculaires (Uvéite, vasculite rétinienne)</td>\n                <td class=\"p-3 font-bold text-center text-teal-600 dark:text-teal-400\">+ 2 Points</td>\n              </tr>\n              <tr>\n                <td class=\"p-3 font-semibold\">Aphtose Génitale (Cicatrices scrotales/vulvaires)</td>\n                <td class=\"p-3 font-bold text-center text-teal-600 dark:text-teal-400\">+ 2 Points</td>\n              </tr>\n              <tr>\n                <td class=\"p-3 font-semibold\">Aphtose Buccale Récidivante</td>\n                <td class=\"p-3 font-bold text-center text-teal-600 dark:text-teal-400\">+ 2 Points</td>\n              </tr>\n              <tr>\n                <td class=\"p-3\">Manifestations Neurologiques (Neuro-Behçet)</td>\n                <td class=\"p-3 font-bold text-center text-brand-600 dark:text-brand-400\">+ 1 Point</td>\n              </tr>\n              <tr>\n                <td class=\"p-3\">Manifestations Cutanées (Pseudofolliculite, Érythème noueux)</td>\n                <td class=\"p-3 font-bold text-center text-brand-600 dark:text-brand-400\">+ 1 Point</td>\n              </tr>\n              <tr>\n                <td class=\"p-3\">Manifestations Vasculaires (TVP, Anévrysmes, TVC)</td>\n                <td class=\"p-3 font-bold text-center text-brand-600 dark:text-brand-400\">+ 1 Point</td>\n              </tr>\n              <tr>\n                <td class=\"p-3\">Test de Pathergie Positif (Optionnel)</td>\n                <td class=\"p-3 font-bold text-center text-brand-600 dark:text-brand-400\">+ 1 Point</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <p class=\"text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 p-3 rounded-xl border border-teal-200\">\n          🎯 Règle de Validation : Un score total &ge; 4 Points confirme le diagnostic positif de la maladie de Behçet !\n        </p>\n      </section>\n\n      <section id=\"traitement\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">6. Prise en Charge Thérapeutique & Protocoles EULAR</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Le traitement est adapté à l'organe le plus sévèrement atteint :\n        </p>\n\n        <div class=\"space-y-4\">\n          <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n            <h4 class=\"font-bold text-navy-900 dark:text-white mb-1\">💊 1. Atteinte Mucocutanée (Aphtose)</h4>\n            <p class=\"text-sm text-navy-600 dark:text-navy-300\">\n              • <strong>Colchicine :</strong> 1 à 2 mg/jour per os en première intention.<br>\n              • Bains de bouche corticoïdes / Dermo-corticoïdes locaux.\n            </p>\n          </div>\n\n          <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n            <h4 class=\"font-bold text-navy-900 dark:text-white mb-1\">🧠 2. Traitement du Neuro-Behçet Parenchymateux</h4>\n            <p class=\"text-sm text-navy-600 dark:text-navy-300\">\n              • <strong>Bolus de Méthylprednisolone (Solumedrol) :</strong> 1g/jour en IVD sur 3 à 5 jours consécutifs.<br>\n              • Relais par <strong>Prednisolone per os :</strong> 1 mg/kg/jour avec dégression lente sur plusieurs mois.<br>\n              • <strong>Immunosuppresseur de fond :</strong> Azathioprine (Imurel 2.5 mg/kg/j) ou Cyclophosphamide (Endoxan bolus mensuel).<br>\n              • <strong>Formes réfractaires / sévères :</strong> Biothérapie par <strong>Anti-TNF alpha</strong> (Infliximab 5 mg/kg ou Adalimumab).\n            </p>\n          </div>\n\n          <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm\">\n            <h4 class=\"font-bold text-navy-900 dark:text-white mb-1\">🩸 3. Traitement de la Thrombose Veineuse Cérébrale (TVC)</h4>\n            <p class=\"text-sm text-navy-600 dark:text-navy-300\">\n              • Corticothérapie à forte dose + <strong>Anticoagulation curative</strong> par Héparine puis AOD/AVK.\n            </p>\n          </div>\n        </div>\n      </section>\n\n      <section id=\"points-cles\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">7. Points Clés & Pièges aux Examens (Annales Oran & SBA)</h2>\n        <div class=\"p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/50 space-y-3\">\n          <div class=\"font-bold text-indigo-900 dark:text-indigo-200 text-base\">📌 TOUJOURS RETENIR POUR LE CONCOURS :</div>\n          <ul class=\"text-sm text-indigo-950 dark:text-indigo-200 space-y-2 leading-relaxed\">\n            <li>✅ L'aphtose buccale est le signe inaugural obligatoire présent chez > 98% des sujets.</li>\n            <li>✅ L'atteinte du tronc cérébral à l'IRM (hyperintensité T2) définit la forme parenchymateuse classique du Neuro-Behçet.</li>\n            <li>✅ Le test de Pathergie se lit à 24-48 heures.</li>\n            <li>✅ Il n'y a pas d'auto-anticorps spécifiques (AAN et ANCA sont négatifs).</li>\n            <li>✅ L'anévrysme de l'artère pulmonaire est la cause la plus fréquente de décès par hémoptysie cataclysmique.</li>\n          </ul>\n        </div>\n      </section>\n  "
  },
  {
    "id": "cours_1790371084562",
    "slug": "introduction-aux-politiques-de-sante-publique",
    "title": "Introduction aux Politiques de Santé Publique",
    "subtitle": "Notions fondamentales de santé communautaire",
    "specialtyId": "sante-publique-epidemiologie",
    "specialtyName": "Santé Publique & Épidémiologie",
    "author": "Pr. Karim Benali",
    "authorTitle": "Chef de Service Hospitalo-Universitaire",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "TOUS",
    "source": "Externat",
    "rang": "Rang A",
    "estimatedDuration": "35 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 0,
    "tableOfContents": [
      {
        "id": "intro",
        "title": "1. Introduction",
        "level": 1
      },
      {
        "id": "clinique",
        "title": "2. Clinique",
        "level": 1
      },
      {
        "id": "traitement",
        "title": "3. Traitement",
        "level": 1
      }
    ],
    "htmlContent": "<p>Contenu médical en cours de rédaction...</p>",
    "createdAt": "2026-09-25T21:18:04.562Z",
    "updatedAt": "2026-09-25T21:18:04.563Z"
  },
  {
    "id": "cours_pneumo_tb",
    "slug": "la-tuberculose-pulmonaire-commune",
    "title": "La Tuberculose Pulmonaire Commune",
    "subtitle": "",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "year": 4,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"intro\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Introduction & Épidémiologie</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          La tuberculose reste un problème majeur de santé publique mondial et en Algérie. Elle est causée par une mycobactérie du complexe <em>Mycobacterium tuberculosis</em> (bacille de Koch ou BK). La forme pulmonaire est de loin la plus fréquente (>70% des cas) et représente la seule forme contagieuse.\n        </p>\n        <div class=\"p-4 my-4 rounded-xl border border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/50 dark:bg-indigo-950/20\">\n          <div class=\"flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold mb-1\">\n            <span class=\"text-lg\">🎯</span> Objectif Résidanat / ECNi\n          </div>\n          <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n            Savoir suspecter la tuberculose devant toute toux inexpliquée durant plus de 3 semaines, prescrire les bons prélèvements bactériologiques et instaurer sans délai la déclaration obligatoire et la quadrithérapie standardisée.\n          </p>\n        </div>\n      </section>\n\n      <section id=\"physio\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Physiopathologie & Transmission</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          La contamination se fait par voie aéroportée à partir d'un patient bacillifère. Le bacille pénètre jusqu'aux alvéoles pulmonaires où il est phagocyté par les macrophages alvéolaires. Deux issues sont possibles :\n        </p>\n        <ul class=\"list-disc pl-6 space-y-2 text-navy-700 dark:text-navy-300 mb-4\">\n          <li><strong>Infection Tuberculeuse Latente (ITL) :</strong> Le système immunitaire cellulaire circonscrit l'infection sous forme de granulomes épithélioïdes et giganto-cellulaires avec nécrose caséeuse. Le patient est asymptomatique et non contagieux (90% des personnes immunocompétentes).</li>\n          <li><strong>Tuberculose Maladie (TM) :</strong> Rupture de l'équilibre immunitaire (dénutrition, corticothérapie, diabète, VIH) conduisant à la liquéfaction du caséum, à la formation de cavernes et à la dissémination bronchique.</li>\n        </ul>\n      </section>\n\n      <section id=\"clinique\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Présentation Clinique</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Le début est insidieux sur plusieurs semaines ou mois. Il associe des signes généraux et des signes respiratoires :\n        </p>\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-6\">\n          <div class=\"p-5 rounded-2xl bg-white dark:bg-navy-800/80 border border-navy-100 dark:border-navy-700 shadow-soft\">\n            <h3 class=\"font-bold text-navy-900 dark:text-white mb-2 flex items-center gap-2\">\n              <span class=\"w-3 h-3 rounded-full bg-amber-500\"></span> Signes Généraux (L'Imprégnation)\n            </h3>\n            <ul class=\"space-y-2 text-sm text-navy-600 dark:text-navy-300\">\n              <li>• Altération de l'état général (Asthénie, Anorexie, Amaigrissement chiffré)</li>\n              <li>• Fièvre vespérale ou fébricule modérée</li>\n              <li>• <strong>Sueurs nocturnes profuses</strong> très évocatrices</li>\n            </ul>\n          </div>\n          <div class=\"p-5 rounded-2xl bg-white dark:bg-navy-800/80 border border-navy-100 dark:border-navy-700 shadow-soft\">\n            <h3 class=\"font-bold text-navy-900 dark:text-white mb-2 flex items-center gap-2\">\n              <span class=\"w-3 h-3 rounded-full bg-rose-500\"></span> Signes Fonctionnels Respiratoires\n            </h3>\n            <ul class=\"space-y-2 text-sm text-navy-600 dark:text-navy-300\">\n              <li>• <strong>Toux chronique productive</strong> > 3 semaines</li>\n              <li>• Expectorations muco-purulentes ou hémoptoïques</li>\n              <li>• <strong>Hémoptysie</strong> d'abondance variable (du crachat strié à l'inondation)</li>\n              <li>• Douleur thoracique en cas d'atteinte pleurale adjacente</li>\n            </ul>\n          </div>\n        </div>\n\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 my-4\">\n          <div class=\"flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold mb-1\">\n            ⚠️ Alerte Rouge : Hémoptysie Cataclysmique\n          </div>\n          <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n            Une hémoptysie massive (> 200 ml/24h) constitue une urgence médico-chirurgicale vitale par asphyxie. Arrêt des manœuvres invasives, décubitus latéral du côté atteint, oxygénothérapie à haut débit, vasoconstricteurs (Terlipressine) et embolisation artérielle bronchique en urgence.\n          </p>\n        </div>\n      </section>\n\n      <section id=\"radio\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Imagerie Thoracique</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          La radiographie thoracique de face et de profil est l'examen morphologique de première intention. Les lésions sont polymorphes et siègent préférentiellement dans les territoires bien aérés et riches en oxygène (segments apicaux et postérieurs des lobes supérieurs, et apex des lobes inférieurs).\n        </p>\n        <div class=\"overflow-x-auto my-4\">\n          <table class=\"min-w-full text-sm border-collapse rounded-xl overflow-hidden shadow-soft\">\n            <thead class=\"bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white font-semibold\">\n              <tr>\n                <th class=\"p-3 text-left\">Type de Lésion</th>\n                <th class=\"p-3 text-left\">Aspect Radiologique</th>\n                <th class=\"p-3 text-left\">Signification Clinique</th>\n              </tr>\n            </thead>\n            <tbody class=\"divide-y divide-navy-100 dark:divide-navy-800 bg-white dark:bg-navy-900\">\n              <tr>\n                <td class=\"p-3 font-semibold text-brand-600 dark:text-brand-400\">Caverne tuberculeuse</td>\n                <td class=\"p-3\">Hyperclarté cernée d'une paroi épaisse, parfois avec niveau liquide</td>\n                <td class=\"p-3 text-rose-600 dark:text-rose-400 font-medium\">Foyer de réplication intense, hautement contagieux</td>\n              </tr>\n              <tr>\n                <td class=\"p-3 font-semibold\">Infiltrats et nodules</td>\n                <td class=\"p-3\">Opacités hétérogènes mal limitées des apex</td>\n                <td class=\"p-3\">Lésions actives de dissémination bronchogène</td>\n              </tr>\n              <tr>\n                <td class=\"p-3 font-semibold\">Miliaire pulmonaire</td>\n                <td class=\"p-3\">Micronodules punctiformes de 1 à 2 mm disséminés en \"grains de mil\"</td>\n                <td class=\"p-3 text-amber-600 dark:text-amber-400\">Dissémination hématogène, urgence diagnostique</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </section>\n\n      <section id=\"bacterio\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">5. Diagnostic Bactériologique (Clé de Voûte)</h2>\n        <div class=\"p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40 mb-4\">\n          <div class=\"flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold mb-1\">\n            💡 Règle d'or : La certitude diagnostique est BACTÉRIOLOGIQUE\n          </div>\n          <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n            Ne jamais débuter d'antibacillaires sur une simple impression radiologique sans avoir isolé le germe, sauf détresse vitale immédiate (miliaire asphyxiante).\n          </p>\n        </div>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-3\">\n          <strong>Modalités de prélèvement :</strong>\n        </p>\n        <ul class=\"list-disc pl-6 space-y-2 text-navy-700 dark:text-navy-300 mb-4\">\n          <li><strong>Expectorations induites ou spontanées (ECBC) :</strong> 3 jours consécutifs le matin au réveil après rinçage bucco-dentaire.</li>\n          <li><strong>Tubage gastrique au réveil :</strong> Chez le patient qui n'expectore pas ou chez l'enfant, avant tout lever et avant tout repas (le BK dégluti durant la nuit stagne dans l'estomac).</li>\n          <li><strong>Fibroscopie bronchique avec lavage broncho-alvéolaire (LBA) :</strong> Si les expectorations restent négatives malgré une forte suspicion clinique et radiologique.</li>\n        </ul>\n      </section>\n\n      <section id=\"traitement\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">6. Prise en Charge Thérapeutique (Régime 2RHZE/4RH)</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Le traitement repose sur le protocole standardisé du Programme National de Lutte Antituberculeuse en Algérie. Il comporte deux phases distinctes :\n        </p>\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-6\">\n          <div class=\"p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800\">\n            <span class=\"inline-block px-3 py-1 text-xs font-bold uppercase rounded-full bg-indigo-600 text-white mb-2\">Phase Initiale d'Attaque (2 Mois)</span>\n            <h4 class=\"text-lg font-bold text-navy-900 dark:text-white mb-1\">Quadrithérapie RHZE</h4>\n            <p class=\"text-sm text-navy-600 dark:text-navy-300 mb-3\">Rifampicine + Isoniazide + Pyrazinamide + Éthambutol.</p>\n            <p class=\"text-xs text-navy-500 dark:text-navy-400\">Objectif : Destruction rapide de la population bacillaire extracellulaire et prévention de l'émergence de souches résistantes.</p>\n          </div>\n          <div class=\"p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800\">\n            <span class=\"inline-block px-3 py-1 text-xs font-bold uppercase rounded-full bg-emerald-600 text-white mb-2\">Phase d'Entretien (4 Mois)</span>\n            <h4 class=\"text-lg font-bold text-navy-900 dark:text-white mb-1\">Bithérapie RH</h4>\n            <p class=\"text-sm text-navy-600 dark:text-navy-300 mb-3\">Rifampicine + Isoniazide.</p>\n            <p class=\"text-xs text-navy-500 dark:text-navy-400\">Objectif : Éradication des bacilles intracellulaires à multiplication lente et prévention des rechutes à long terme.</p>\n          </div>\n        </div>\n\n        <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 mb-4\">\n          <div class=\"font-bold text-amber-900 dark:text-amber-300 mb-2\">💊 Règle de Prise & Surveillance Thérapeutique :</div>\n          <ul class=\"text-sm space-y-1 text-navy-700 dark:text-navy-300\">\n            <li>• Prise quotidienne <strong>unique le matin à jeun</strong> (au moins 30 minutes avant le petit déjeuner).</li>\n            <li>• Prévenir le patient de la coloration rouge-orangée bénigne des sécrétions (larmes, urines) sous Rifampicine.</li>\n            <li>• Surveillance du bilan hépatique (Transaminases ASAT/ALAT) bimensuelle le premier mois.</li>\n            <li>• Surveillance ophtalmologique (champ visuel, vision des couleurs) sous Éthambutol pour dépister la névrite optique rétrobulbaire.</li>\n          </ul>\n        </div>\n      </section>\n\n      <section id=\"points-cles\" class=\"mb-6\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">7. Points Clés & Pièges aux Examens</h2>\n        <div class=\"space-y-3\">\n          <div class=\"flex items-start gap-3 p-3 rounded-xl bg-navy-50 dark:bg-navy-800/50\">\n            <span class=\"text-brand-600 dark:text-brand-400 font-bold\">1.</span>\n            <span class=\"text-sm text-navy-700 dark:text-navy-300\">L'intradermoréaction à la tuberculine (IDR) ou le test IGRA (QuantiFERON) ne permettent <strong>JAMAIS</strong> à eux seuls d'affirmer une tuberculose pulmonaire maladie active.</span>\n          </div>\n          <div class=\"flex items-start gap-3 p-3 rounded-xl bg-navy-50 dark:bg-navy-800/50\">\n            <span class=\"text-brand-600 dark:text-brand-400 font-bold\">2.</span>\n            <span class=\"text-sm text-navy-700 dark:text-navy-300\">La déclaration à la Direction de la Santé et de la Population (DSP) est <strong>obligatoire</strong> dès confirmation.</span>\n          </div>\n          <div class=\"flex items-start gap-3 p-3 rounded-xl bg-navy-50 dark:bg-navy-800/50\">\n            <span class=\"text-brand-600 dark:text-brand-400 font-bold\">3.</span>\n            <span class=\"text-sm text-navy-700 dark:text-navy-300\">Le dépistage des sujets contacts intrafamiliaux est indissociable du traitement du cas index.</span>\n          </div>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:35.605803+00:00",
    "updatedAt": "2026-09-25T16:03:35.605803+00:00"
  },
  {
    "id": "cours_neuro_avc",
    "slug": "l-accident-vasculaire-cerebral-avc-ischemique-aigu",
    "title": "L'Accident Vasculaire Cérébral (AVC) Ischémique Aigu",
    "subtitle": "",
    "specialtyId": "neuro",
    "specialtyName": "Neurologie",
    "year": 5,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"definition\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Définition & Alerte Immédiate</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          L'AVC ischémique représente 80 à 85% de l'ensemble des AVC. Il résulte de l'interruption du flux sanguin artériel cérébral par un thrombus ou une embole, entraînant une nécrose neuronale progressive.\n        </p>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40\">\n          <div class=\"font-bold text-rose-700 dark:text-rose-300 mb-1\">⏱️ Chaque minute perdue = 2 millions de neurones détruits</div>\n          <p class=\"text-sm text-navy-700 dark:text-navy-300\">L'appel au SAMU / Urgences doit déclencher la filière neurovasculaire d'emblée sans passer par le médecin traitant.</p>\n        </div>\n      </section>\n\n      <section id=\"imagerie\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Imagerie en Urgence : IRM vs Scanner</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          L'IRM cérébrale est l'examen de choix. Le protocole d'urgence comprend :\n        </p>\n        <ul class=\"list-disc pl-6 space-y-2 text-navy-700 dark:text-navy-300\">\n          <li><strong>Diffusion (DWI) :</strong> Hyperintensité visible dès les premières minutes, confirmant l'ischémie cytotoxique.</li>\n          <li><strong>FLAIR :</strong> Si le parenchyme est encore normal en FLAIR alors qu'il est brillant en Diffusion, l'AVC date de moins de 4h30 (mismatch Diffusion/FLAIR) !</li>\n          <li><strong>T2* ou SWI :</strong> Élimine formellement tout saignement intracrânien.</li>\n          <li><strong>Angio-IRM (TOF) :</strong> Visualise le thrombus occlusif dans les gros vaisseaux cérébraux (artère cérébrale moyenne M1/M2, carotide interne terminale, tronc basilaire).</li>\n        </ul>\n      </section>\n\n      <section id=\"recanalisation\" class=\"mb-6\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Traitements de Recanalisation en Phase Aiguë</h2>\n        <div class=\"space-y-4\">\n          <div class=\"p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800\">\n            <h4 class=\"font-bold text-indigo-900 dark:text-indigo-200 mb-1\">1. Thrombolyse intraveineuse par rt-PA (Alteplase)</h4>\n            <p class=\"text-sm text-navy-700 dark:text-navy-300\">Dose : 0.9 mg/kg (max 90 mg) avec 10% en bolus sur 1 min, puis le reste sur 1h. Fenêtre d'éligibilité : strictly &lt; 4h30.</p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800\">\n            <h4 class=\"font-bold text-purple-900 dark:text-purple-200 mb-1\">2. Thrombectomie mécanique par voie endovasculaire</h4>\n            <p class=\"text-sm text-navy-700 dark:text-navy-300\">Extraction directe du caillot par stent-retriever ou thrombo-aspiration en cas d'occlusion proximale. Efficace jusqu'à 6h, et jusqu'à 24h si tissu sauvable documenté en imagerie de perfusion.</p>\n          </div>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:36.304172+00:00",
    "updatedAt": "2026-09-25T16:03:36.304172+00:00"
  },
  {
    "id": "cours_pneumo_aag",
    "slug": "la-crise-d-asthme-aigue-grave-aag",
    "title": "La Crise d'Asthme Aiguë Grave (AAG)",
    "subtitle": "",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "year": 4,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"criteres\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Critères de Gravité Immédiate</h2>\n        <div class=\"p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 mb-4\">\n          <h3 class=\"font-bold text-amber-900 dark:text-amber-300 mb-2\">Signes Cliniques de Gravité :</h3>\n          <ul class=\"text-sm space-y-1 text-navy-700 dark:text-navy-300\">\n            <li>• Impossibilité de parler ou de s'allonger (position assise penchée en avant)</li>\n            <li>• FR > 30 cycles/min avec tirage des muscles sterno-cléido-mastoïdiens</li>\n            <li>• Pouls > 120 battements/min, pouls paradoxal</li>\n            <li>• DEP &lt; 50% de la valeur théorique ou &lt; 150 L/min</li>\n          </ul>\n        </div>\n      </section>\n      <section id=\"menace\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Signes de Menace Vitale (Transfert Réa Immédiat)</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40\">\n          <ul class=\"text-sm space-y-2 text-rose-800 dark:text-rose-300 font-semibold\">\n            <li>🚨 <strong>Silence auscultatoire (\"poumon muet\") :</strong> Absence totale de sifflements par collapsus alvéolaire.</li>\n            <li>🚨 Respiration abdominale paradoxale (faillite diaphragmatique).</li>\n            <li>🚨 Bradycardie, collapsus hémodynamique, troubles de la vigilance (coma hypercapnique).</li>\n          </ul>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:36.553081+00:00",
    "updatedAt": "2026-09-25T16:03:36.553081+00:00"
  },
  {
    "id": "cours_nephro_ira",
    "slug": "l-insuffisance-renale-aigue-ira",
    "title": "L'Insuffisance Rénale Aiguë (IRA)",
    "subtitle": "",
    "specialtyId": "nephro",
    "specialtyName": "Néphrologie",
    "year": 4,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"criteres\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Critères KDIGO</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          L'IRA est définie selon la classification internationale KDIGO par la présence d'au moins un des critères suivants :\n        </p>\n        <ul class=\"list-disc pl-6 space-y-1 text-navy-700 dark:text-navy-300\">\n          <li>Élévation de la créatininémie d'au moins 26,5 µmol/L (0.3 mg/dL) en 48 heures.</li>\n          <li>Élévation de la créatininémie d'au moins 1.5 fois la valeur basale connue ou présumée dans les 7 jours précédents.</li>\n          <li>Diurèse inférieure à 0.5 mL/kg/h pendant 6 heures consécutives.</li>\n        </ul>\n      </section>\n      <section id=\"dialyse\" class=\"mb-6\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Indications Formelles de Dialyse en Urgence</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40\">\n          <div class=\"font-bold text-rose-800 dark:text-rose-300 mb-2\">Moyen mnémotechnique classique : \"AEIOU\"</div>\n          <ul class=\"text-sm space-y-1 text-navy-700 dark:text-navy-300\">\n            <li>• <strong>A</strong>cidose métabolique sévère (pH &lt; 7.15 réfractaire)</li>\n            <li>• <strong>E</strong>lectrolytes : Hyperkaliémie menaçante (&gt; 6.5 mmol/L ou signes ECG) réfractaire</li>\n            <li>• <strong>I</strong>ntoxication : Toxiques dialysables (lithium, méthanol, éthylène glycol, salicylés)</li>\n            <li>• <strong>O</strong>verload : Surcharge hydrosodée majeure / OAP réfractaire aux diurétiques</li>\n            <li>• <strong>U</strong>rémie symptomatique : Péricardite urémique, encéphalopathie urémique</li>\n          </ul>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:36.679386+00:00",
    "updatedAt": "2026-09-25T16:03:36.679386+00:00"
  },
  {
    "id": "cours_endocrino_acidocetose",
    "slug": "l-acidocetose-diabetique-complications-aigues",
    "title": "L'Acidocétose Diabétique & Complications Aiguës",
    "subtitle": "",
    "specialtyId": "endocrino",
    "specialtyName": "Endocrinologie - Diabétologie",
    "year": 4,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"definition\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Définition & Triade Biologique</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          L'acidocétose diabétique est une urgence métabolique absolue résultant d'une carence absolue ou relative en insuline associée à une élévation des hormones de contre-régulation (glucagon, catécholamines, cortisol, GH).\n        </p>\n        <div class=\"p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800\">\n          <h3 class=\"font-bold text-emerald-900 dark:text-emerald-200 mb-2\">Les 3 critères diagnostiques simultanés :</h3>\n          <ul class=\"text-sm space-y-1 text-navy-700 dark:text-navy-300\">\n            <li>1. <strong>Hyperglycémie :</strong> Glycémie plasmatique &gt; 14 mmol/L (2,50 g/L).</li>\n            <li>2. <strong>Cétose franche :</strong> Cétonémie &gt; 3,0 mmol/L ou acétonurie &ge; (++) sur bandelette urinaire.</li>\n            <li>3. <strong>Acidose métabolique :</strong> Bicarbonates sériques &lt; 15 mmol/L et/ou pH veineux &lt; 7,30 avec trou anionique &gt; 12.</li>\n          </ul>\n        </div>\n      </section>\n\n      <section id=\"facteurs\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Facteurs Déclenchants Majeurs</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Dans 20 à 30% des cas, l'acidocétose est révélatrice d'un diabète de type 1 inaugural chez l'enfant ou l'adulte jeune. Chez le diabétique connu, rechercher systématiquement les \"5 I\" :\n        </p>\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4\">\n          <div class=\"p-4 rounded-xl bg-navy-50 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-semibold text-navy-900 dark:text-white mb-1\">Causes fréquentes</h4>\n            <ul class=\"text-sm text-navy-600 dark:text-navy-300 space-y-1\">\n              <li>• Infection aiguë sévère (40-50% des cas : pneumonie, pyélonéphrite)</li>\n              <li>• Inobservance / rupture d'insuline (panne de pompe à insuline)</li>\n              <li>• Ischémie myocardique (IDM indolore chez le diabétique)</li>\n            </ul>\n          </div>\n          <div class=\"p-4 rounded-xl bg-navy-50 dark:bg-navy-800/60 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-semibold text-navy-900 dark:text-white mb-1\">Causes médicamenteuses & stress</h4>\n            <ul class=\"text-sm text-navy-600 dark:text-navy-300 space-y-1\">\n              <li>• Corticothérapie à forte dose</li>\n              <li>• Inhibiteurs de SGLT2 (acidocétose euglycémique !)</li>\n              <li>• Accident vasculaire cérébral, pancréatite aiguë</li>\n            </ul>\n          </div>\n        </div>\n      </section>\n\n      <section id=\"clinique\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Tableau Clinique & Respiration de Kussmaul</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          L'installation se fait en plusieurs phases : phase de cétose simple puis phase d'acidocétose décompensée.\n        </p>\n        <ul class=\"list-disc pl-6 space-y-2 text-navy-700 dark:text-navy-300 mb-4\">\n          <li><strong>Signes de déshydratation globale :</strong> Pli cutané (extracellulaire), hypotension, tachycardie, sécheresse des muqueuses, soif intense (intracellulaire).</li>\n          <li><strong>Troubles digestifs précoces :</strong> Nausées, vomissements incoercibles, douleurs abdominales diffuses pouvant simuler une urgence chirurgicale (fausse appendicite).</li>\n          <li><strong>Signes respiratoires cardinaux :</strong> Odeur acétonique de l'haleine (fruité / solvant) et dyspnée de Kussmaul (ventilation ample, profonde, rapide et bruyante) d'origine compensatoire respiratoire.</li>\n        </ul>\n      </section>\n\n      <section id=\"traitement\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">5. Prise en Charge Thérapeutique Codifiée</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 mb-6\">\n          <div class=\"font-bold text-rose-800 dark:text-rose-300 text-base mb-2\">⚠️ RÈGLE DE SÉCURITÉ ABSOLUE : Vérifier la Kaliémie !</div>\n          <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n            L'insuline fait rentrer le potassium dans les cellules. Administrer de l'insuline sur une hypokaliémie (&lt; 3,3 mmol/L) provoque une baisse catastrophique du potassium circulant et déclenche des torsades de pointes / arrêt cardiaque. Corriger le K+ AVANT l'insuline !\n          </p>\n        </div>\n        <div class=\"space-y-3\">\n          <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-bold text-navy-900 dark:text-white\">Étape 1 : Réhydratation IV hydro-électrolytique</h4>\n            <p class=\"text-sm text-navy-600 dark:text-navy-300 mt-1\">1 L de NaCl 0,9% la 1ère heure, puis 1 L sur 2h, puis 1 L sur 4h. Dès que la glycémie &le; 14 mmol/L (2,5 g/L), passer au Sérum Glucosé 5% + NaCl 0,9% pour éviter l'hypoglycémie et l'œdème cérébral.</p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-bold text-navy-900 dark:text-white\">Étape 2 : Insulinothérapie IVSE à débit continu</h4>\n            <p class=\"text-sm text-navy-600 dark:text-navy-300 mt-1\">Insuline rapide à 0,1 UI/kg/h au pousse-seringue électrique. L'objectif est une baisse de la glycémie de 3 à 4 mmol/L par heure (environ 0,5 à 0,7 g/L/h) et la négativation de la cétonémie.</p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-bold text-navy-900 dark:text-white\">Étape 3 : Supplémentation potassique systématique</h4>\n            <p class=\"text-sm text-navy-600 dark:text-navy-300 mt-1\">Si K+ entre 3,5 et 5,5 mmol/L : apporter 2 à 4 g de KCl par litre de perfusion dès que le débit urinaire est assuré.</p>\n          </div>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:36.808168+00:00",
    "updatedAt": "2026-09-25T16:03:36.808168+00:00"
  },
  {
    "id": "cours_gastro_cirrhose",
    "slug": "la-cirrhose-hepatique-decompensation-ascitique",
    "title": "La Cirrhose Hépatique & Décompensation Ascitique",
    "subtitle": "",
    "specialtyId": "gastro",
    "specialtyName": "Gastro-entérologie & Hépatologie",
    "year": 4,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"definition\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Définition & Étiologies en Algérie</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          La cirrhose est le stade ultime de fibrose hépatique. En Algérie et au Maghreb, les étiologies virales (Hépatite B et C) et métaboliques (MASH / stéatohépatite non alcoolique liée au diabète et à l'obésité) occupent la première place, suivies de l'alcoolisme chronique et des causes auto-immunes (cirrhose biliaire primitive, hépatite auto-immune).\n        </p>\n      </section>\n\n      <section id=\"scores\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Évaluation Pronostique : Score de Child-Pugh</h2>\n        <div class=\"p-4 rounded-xl bg-navy-50 dark:bg-navy-800/80 border border-navy-100 dark:border-navy-700 mb-4\">\n          <p class=\"text-sm font-semibold text-navy-900 dark:text-white mb-2\">Moyen mnémotechnique : \"TABAC\"</p>\n          <ul class=\"text-sm space-y-1 text-navy-600 dark:text-navy-300\">\n            <li>• <strong>T</strong>P / INR</li>\n            <li>• <strong>A</strong>lbuminémie</li>\n            <li>• <strong>B</strong>ilirubine totale</li>\n            <li>• <strong>A</strong>scite (absente, minime, réfractaire)</li>\n            <li>• <strong>C</strong>erveau (Encéphalopathie hépatique stades I à IV)</li>\n          </ul>\n        </div>\n      </section>\n\n      <section id=\"ascite\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Décompensation Ascitique & Infection du Liquide (ILA)</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Toute première poussée d'ascite ou toute aggravation brutale chez un cirrhotique nécessite une ponction d'ascite exploratrice avant toute antibiothérapie.\n        </p>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40\">\n          <div class=\"font-bold text-rose-800 dark:text-rose-300 mb-1\">Diagnostic et Urgence de l'ILA :</div>\n          <p class=\"text-sm text-navy-700 dark:text-navy-300\">\n            Présence de <strong>&gt; 250 Polynucléaires Neutrophiles (PNN) par mm³</strong> dans le liquide de ponction. Traitement : Céfotaxime 2g x 3/j IV pendant 5 à 7 jours + Perfusion d'Albumine humaine à 20% (1,5 g/kg à J1 puis 1 g/kg à J3) pour prévenir le syndrome hépato-rénal mortel.\n          </p>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:36.927207+00:00",
    "updatedAt": "2026-09-25T16:03:36.927207+00:00"
  },
  {
    "id": "cours_pediatrie_deshydratation",
    "slug": "la-deshydratation-aigue-du-nourrisson-gastro-enterite",
    "title": "La Déshydratation Aiguë du Nourrisson & Gastro-entérite",
    "subtitle": "",
    "specialtyId": "pediatrie",
    "specialtyName": "Pédiatrie",
    "year": 5,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"gravite\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Classification de la Gravité</h2>\n        <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\">\n          <div class=\"p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800\">\n            <h4 class=\"font-bold text-emerald-900 dark:text-emerald-200\">Perte &lt; 5%</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Déshydratation légère. Traitement ambulatoire par SRO. Pas de retentissement hémodynamique.</p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800\">\n            <h4 class=\"font-bold text-amber-900 dark:text-amber-200\">Perte 5 à 10%</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Déshydratation modérée. Yeux creusés, pli cutané, soif vive. SRO sous surveillance ou hospitalisation de jour.</p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800\">\n            <h4 class=\"font-bold text-rose-900 dark:text-rose-200\">Perte &gt; 10% ou Choc</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Urgence vitale hospitalière immédiate. Voie veineuse ou intra-osseuse. Remplissage NaCl 0,9% 20 mL/kg.</p>\n          </div>\n        </div>\n      </section>\n\n      <section id=\"sro\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Protocole SRO OMS</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Le SRO exploite le co-transport actif intestinal Sodium-Glucose (SGLT1) qui reste fonctionnel même lors des diarrhées à rotavirus ou bactériennes. Reconstituer 1 sachet dans exactement 200 mL d'eau pure (ni trop dilué, ni trop concentré). Donner à la cuillère ou à la seringue toutes les 2-3 minutes.\n        </p>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:37.048036+00:00",
    "updatedAt": "2026-09-25T16:03:37.048036+00:00"
  },
  {
    "id": "cours_gyneco_geu",
    "slug": "la-grossesse-extra-uterine-geu-urgences-du-1er-trimestre",
    "title": "La Grossesse Extra-Utérine (GEU) & Urgences du 1er Trimestre",
    "subtitle": "",
    "specialtyId": "gyneco",
    "specialtyName": "Gynécologie - Obstétrique",
    "year": 5,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"triade\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Triade Clinique & Facteurs de Risque</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Toute femme en âge de procréer consultant pour des métrorragies et/ou des douleurs pelviennes a une GEU jusqu'à preuve du contraire, quel que soit son mode de contraception.\n        </p>\n      </section>\n\n      <section id=\"rupture\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Rupture Tubaire Cataclysmique</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40\">\n          <div class=\"font-bold text-rose-800 dark:text-rose-300 text-sm mb-1\">🚨 Choc Hémorragique & Inondation Péritonéale :</div>\n          <p class=\"text-xs text-navy-700 dark:text-navy-300\">\n            Douleur syncopale en coup de poignard dans le bas-ventre avec irradiation scapulaire (signe de Laffont par irritation phrénique), pâleur cireuse, pouls filant et défense abdominale. Indication opératoire d'extrême urgence : coelioscopie ou laparotomie immédiate avec salpingectomie d'hémostase.\n          </p>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:37.163648+00:00",
    "updatedAt": "2026-09-25T16:03:37.163648+00:00"
  },
  {
    "id": "cours_dermato_toxidermies",
    "slug": "les-toxidermies-medicamenteuses-graves-dress-lyell",
    "title": "Les Toxidermies Médicamenteuses Graves : DRESS & Lyell",
    "subtitle": "",
    "specialtyId": "dermato",
    "specialtyName": "Dermatologie - Vénérologie",
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"signes\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Signes d'Alerte d'une Toxidermie Grave</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Devant toute éruption fébrile médicamenteuse, rechercher les critères de gravité imposant l'arrêt immédiat des traitements imputables :\n        </p>\n        <ul class=\"list-disc pl-6 space-y-1 text-navy-700 dark:text-navy-300\">\n          <li>Érosions muqueuses douloureuses (buccales, conjonctivales, génitales).</li>\n          <li>Signe de Nikolsky positif (l'épiderme glisse sous le doigt laissant un derme suintant).</li>\n          <li>Infiltration faciale majeure en \"tête de lion\".</li>\n          <li>Adénopathies diffuses et fièvre élevée &gt; 38,5°C persistante.</li>\n        </ul>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:37.278395+00:00",
    "updatedAt": "2026-09-25T16:03:37.278395+00:00"
  },
  {
    "id": "cours_infectieux_paludisme",
    "slug": "le-paludisme-grave-d-importation-sepsis",
    "title": "Le Paludisme Grave d'Importation & Sepsis",
    "subtitle": "",
    "specialtyId": "infectieux",
    "specialtyName": "Infectiologie",
    "year": 4,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"urgence\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Urgence Diagnostique au Retour de Voyage</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Le paludisme d'importation à <em>Plasmodium falciparum</em> peut basculer en accès pernicieux mortel en quelques heures. Aucun délai n'est tolérable pour la réalisation et le rendu du frottis-goutte épaisse.\n        </p>\n      </section>\n      <section id=\"artesunate\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Traitement Salvateur : Artésunate IV</h2>\n        <div class=\"p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800\">\n          <p class=\"text-sm font-semibold text-emerald-900 dark:text-emerald-200 mb-2\">Protocole International & Recommandations OMS :</p>\n          <p class=\"text-xs text-navy-700 dark:text-navy-300\">\n            Artésunate IV 2,4 mg/kg à H0, H12, H24 puis une fois par jour jusqu'à relais oral par une combinaison thérapeutique à base d'artémisinine (CTA) complète de 3 jours. Monitorer l'hémolyse retardée post-artésunate à S2-S4.\n          </p>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:37.398214+00:00",
    "updatedAt": "2026-09-25T16:03:37.398214+00:00"
  },
  {
    "id": "cours_hemato_anemies",
    "slug": "demarche-diagnostique-devant-une-anemie-de-l-adulte",
    "title": "Démarche Diagnostique devant une Anémie de l'Adulte",
    "subtitle": "",
    "specialtyId": "hemato",
    "specialtyName": "Hématologie Clinique",
    "year": 4,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"definition\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Définition selon les Seuils OMS</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          L'anémie est définie par une diminution de la masse d'hémoglobine circulante totale par rapport aux valeurs physiologiques de référence pour l'âge et le sexe.\n        </p>\n      </section>\n      <section id=\"hemolyse\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Triade Biologique de l'Hémolyse</h2>\n        <div class=\"p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800\">\n          <ul class=\"text-sm space-y-1 text-navy-700 dark:text-navy-300\">\n            <li>• <strong>Haptoglobine effondrée</strong> ou indosable (marqueur le plus sensible).</li>\n            <li>• <strong>Bilirubine libre (non conjuguée)</strong> augmentée (ictère à urines claires).</li>\n            <li>• <strong>LDH sériques</strong> très élevées (reflétant la lyse cellulaire).</li>\n          </ul>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:37.531379+00:00",
    "updatedAt": "2026-09-25T16:03:37.531379+00:00"
  },
  {
    "id": "cours_rhumato_pr",
    "slug": "la-polyarthrite-rhumatoide-pr-du-diagnostic-au-traitement",
    "title": "La Polyarthrite Rhumatoïde (PR) : Du Diagnostic au Traitement",
    "subtitle": "",
    "specialtyId": "rhumato",
    "specialtyName": "Rhumatologie",
    "year": 5,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"clinique\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Présentation Clinique & Dérouillage Matinal</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          La PR débute classiquement chez la femme d'âge moyen par une oligo ou polyarthrite bilatérale et symétrique prédominant aux mains et poignets. Le \"squeeze test\" (compression transversale des MCP et MTP) déclenche une douleur exquise caractéristique.\n        </p>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:37.639077+00:00",
    "updatedAt": "2026-09-25T16:03:37.639077+00:00"
  },
  {
    "id": "cours_psy_troubles_humeur",
    "slug": "les-episodes-depressifs-majeurs-la-crise-suicidaire",
    "title": "Les Épisodes Dépressifs Majeurs & La Crise Suicidaire",
    "subtitle": "",
    "specialtyId": "psy",
    "specialtyName": "Psychiatrie",
    "year": 5,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"rud\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Évaluation du Risque Suicidaire (RUD)</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 mb-4\">\n          <p class=\"text-sm font-semibold text-rose-900 dark:text-rose-200 mb-2\">Aborder directement les idées suicidaires ne donne JAMAIS l'idée du suicide au patient !</p>\n          <ul class=\"text-xs space-y-1 text-navy-700 dark:text-navy-300\">\n            <li>• <strong>R (Risque) :</strong> ATCD personnels de TS, isolement, précarité, maladie chronique.</li>\n            <li>• <strong>U (Urgence) :</strong> Degré de planification : scénario prêt, date fixée, adieux faits = URGENCE ÉLEVÉE.</li>\n            <li>• <strong>D (Dangerosité) :</strong> Arme à feu, médicaments stockés, accès à un pont/voie ferrée.</li>\n          </ul>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:37.74439+00:00",
    "updatedAt": "2026-09-25T16:03:37.74439+00:00"
  },
  {
    "id": "cours_ophtalmo_gafa",
    "slug": "le-glaucome-aigu-par-fermeture-de-l-angle-gafa",
    "title": "Le Glaucome Aigu par Fermeture de l'Angle (GAFA)",
    "subtitle": "",
    "specialtyId": "ophtalmo",
    "specialtyName": "Ophtalmologie",
    "year": 5,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"clinique\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Tableau Clinique & Signes Physiques</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40\">\n          <p class=\"text-sm font-semibold text-rose-900 dark:text-rose-200 mb-2\">Signes physiques cardinaux à retenir pour le concours :</p>\n          <ul class=\"text-xs space-y-1 text-navy-700 dark:text-navy-300\">\n            <li>• <strong>Semi-mydriase aréactive</strong> unilatérale.</li>\n            <li>• <strong>Cercle péri-kératique</strong> violacé.</li>\n            <li>• <strong>Cornée trouble</strong> dépolie par œdème épithélial.</li>\n            <li>• Pression intra-oculaire &gt; 40 à 60 mmHg (Normale &le; 21 mmHg).</li>\n          </ul>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:37.855202+00:00",
    "updatedAt": "2026-09-25T16:03:37.855202+00:00"
  },
  {
    "id": "cours_orl_epistaxis",
    "slug": "l-epistaxis-grave-dyspnees-laryngees-aigues",
    "title": "L'Épistaxis Grave & Dyspnées Laryngées Aiguës",
    "subtitle": "",
    "specialtyId": "orl",
    "specialtyName": "O.R.L. & Chirurgie Cervico-Faciale",
    "year": 5,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"hemostase\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Gestes d'Hémostase Gradués</h2>\n        <div class=\"space-y-3\">\n          <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-bold text-navy-900 dark:text-white\">Palier 1 : Compression bidigitale</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Patient assis, tête penchée en avant (NE PAS pencher la tête en arrière pour ne pas déglutir le sang), mouchage préalable, compression 10 minutes montre en main.</p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700\">\n            <h4 class=\"font-bold text-navy-900 dark:text-white\">Palier 2 : Tamponnement antérieur</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Mèches imbibées de xylocaïne naphtazolinée ou mèches de Merocel lubrifiées, laissées en place 48 heures sous couverture antibiotique.</p>\n          </div>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:37.990087+00:00",
    "updatedAt": "2026-09-25T16:03:37.990087+00:00"
  },
  {
    "id": "cours_urgences_acr",
    "slug": "l-arret-cardio-respiratoire-acr-reanimation-cardio-pulmonaire",
    "title": "L'Arrêt Cardio-Respiratoire (ACR) & Réanimation Cardio-Pulmonaire",
    "subtitle": "",
    "specialtyId": "urgences",
    "specialtyName": "Urgences & Réanimation",
    "year": 6,
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"causes\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. Causes Réversibles : 4H / 4T</h2>\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n          <div class=\"p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800\">\n            <h4 class=\"font-bold text-indigo-900 dark:text-indigo-200 mb-2\">Les 4 \"H\"</h4>\n            <ul class=\"text-xs space-y-1 text-navy-700 dark:text-navy-300\">\n              <li>• <strong>H</strong>ypoxie</li>\n              <li>• <strong>H</strong>ypovolémie</li>\n              <li>• <strong>H</strong>ypo / Hyperkaliémie & troubles métaboliques</li>\n              <li>• <strong>H</strong>ypothermie</li>\n            </ul>\n          </div>\n          <div class=\"p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800\">\n            <h4 class=\"font-bold text-rose-900 dark:text-rose-200 mb-2\">Les 4 \"T\"</h4>\n            <ul class=\"text-xs space-y-1 text-navy-700 dark:text-navy-300\">\n              <li>• Pneumothorax sous <strong>T</strong>ension</li>\n              <li>• <strong>T</strong>amponnade cardiaque</li>\n              <li>• <strong>T</strong>oxiques (surdosage médicamenteux)</li>\n              <li>• <strong>T</strong>hrombose (coronaire ou embolie pulmonaire massive)</li>\n            </ul>\n          </div>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:38.096679+00:00",
    "updatedAt": "2026-09-25T16:03:38.096679+00:00"
  },
  {
    "id": "cours_chirurgie_appendicite",
    "slug": "l-appendicite-aigue-les-peritonites-aigues-generalisees",
    "title": "L'Appendicite Aiguë & Les Péritonites Aiguës Généralisées",
    "subtitle": "",
    "specialtyId": "chirurgie",
    "specialtyName": "Chirurgie Générale & Viscérale",
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"peritonite\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Péritonite Aiguë Généralisée</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40\">\n          <p class=\"text-sm font-semibold text-rose-900 dark:text-rose-200 mb-2\">Signe cardinal : La Contracture Abdominale</p>\n          <p class=\"text-xs text-navy-700 dark:text-navy-300 leading-relaxed\">\n            Rigidité pariétale réflexe, involontaire, invincible, permanente et douloureuse (\"ventre de bois\"). Urgence chirurgicale absolue : réanimation hémodynamique, antibiothérapie probabiliste anti-BGN et anaérobies (Ceftriaxone + Métronidazole) et laparotomie / cœlioscopie de toilette péritonéale sans délai.\n          </p>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:38.21095+00:00",
    "updatedAt": "2026-09-25T16:03:38.21095+00:00"
  },
  {
    "id": "cours_uro_colique_nephretique",
    "slug": "la-colique-nephretique-aigue-cna-torsion-testiculaire",
    "title": "La Colique Néphrétique Aiguë (CNA) & Torsion Testiculaire",
    "subtitle": "",
    "specialtyId": "uro",
    "specialtyName": "Urologie",
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"gravite\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">2. Les 3 Formes Compliquées d'Urgence</h2>\n        <div class=\"space-y-3\">\n          <div class=\"p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800\">\n            <h4 class=\"font-bold text-sm text-rose-900 dark:text-rose-200\">1. CNA Fébrile (Urgence Médico-Chirurgicale Absolue)</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Obstruction sur rein infecté. Dérivation urinaire en urgence par sonde double J sous anesthésie + hémocultures + antibiothérapie IV bactéricide.</p>\n          </div>\n          <div class=\"p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800\">\n            <h4 class=\"font-bold text-sm text-amber-900 dark:text-amber-200\">2. CNA Anurique</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Obstruction sur rein unique anatomique ou fonctionnel, ou calculs bilatéraux simultanés. Risque d'insuffisance rénale anurique irréversible.</p>\n          </div>\n          <div class=\"p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800\">\n            <h4 class=\"font-bold text-sm text-purple-900 dark:text-purple-200\">3. CNA Hyperalgique</h4>\n            <p class=\"text-xs text-navy-600 dark:text-navy-300 mt-1\">Douleur intolérable résistant au traitement morphinique IV bien conduit. Indication de décompression.</p>\n          </div>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:38.355576+00:00",
    "updatedAt": "2026-09-25T16:03:38.355576+00:00"
  },
  {
    "id": "cours_ortho_fracture_ouverte",
    "slug": "les-fractures-ouvertes-de-jambe-le-syndrome-des-loges",
    "title": "Les Fractures Ouvertes de Jambe & Le Syndrome des Loges",
    "subtitle": "",
    "specialtyId": "ortho",
    "specialtyName": "Orthopédie & Traumatologie",
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"loges\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">3. Le Syndrome des Loges</h2>\n        <div class=\"p-4 rounded-xl bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40\">\n          <div class=\"font-bold text-rose-800 dark:text-rose-300 mb-1\">🚨 PIÈGE MAJEUR AUX EXAMENS : La Présence des Pouls Distaux</div>\n          <p class=\"text-xs text-navy-700 dark:text-navy-300 leading-relaxed\">\n            La présence des pouls pédieux ou tibiaux postérieurs <strong>n'élimine absolument pas</strong> un syndrome des loges ! La pression intramusculaire dépasse la pression de perfusion capillaire bien avant d'occlure les gros troncs artériels. Le signe d'alerte le plus précoce et le plus sensible est la <strong>douleur exquise à l'étirement passif des muscles de la loge atteinte</strong>. Traitement sans délai : Aponévrotomie de décharge cutanéo-aponévrotique large.\n          </p>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:38.506409+00:00",
    "updatedAt": "2026-09-25T16:03:38.506409+00:00"
  },
  {
    "id": "cours_interne_lupus",
    "slug": "le-lupus-erythemateux-systemique-les-maladie-de-horton",
    "title": "Le Lupus Érythémateux Systémique (LES) & Maladie de Horton",
    "subtitle": "",
    "specialtyId": "interne",
    "specialtyName": "Médecine Interne",
    "author": "Faculté de Médecine",
    "authorTitle": "Professeurs Hospitalo-Universitaires",
    "description": "",
    "coverImage": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
    "difficulty": "Incontournable",
    "faculty": "ORAN",
    "source": "Annales Examens",
    "rang": "Rang A",
    "estimatedDuration": "30 min",
    "tags": [
      "Médecine",
      "Résidanat"
    ],
    "accessLevel": "FREE",
    "published": true,
    "viewsCount": 0,
    "likesCount": 0,
    "qcmCount": 5,
    "tableOfContents": [
      {
        "id": "sec-1",
        "title": "1. Introduction",
        "level": 1
      }
    ],
    "htmlContent": "\n      <section id=\"criteres\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">1. Critères EULAR/ACR 2019</h2>\n        <p class=\"text-navy-700 dark:text-navy-300 leading-relaxed mb-4\">\n          Le diagnostic repose sur le critère d'entrée positif (AAN &ge; 1/80) associé à un score &ge; 10 points réparti entre les domaines cliniques (constitutionnel, hématologique, neuropsychiatrique, cutanéo-muqueux, séreux, musculo-squelettique, rénal) et immunologiques (anticorps anti-phospholipides, fractions du complément C3/C4 consommées, anti-ADN natif ou anti-Sm).\n        </p>\n      </section>\n      <section id=\"traitement\" class=\"mb-10\">\n        <h2 class=\"text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2\">4. L'Hydroxychloroquine : Traitement de Base Indispensable</h2>\n        <div class=\"p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800\">\n          <p class=\"text-sm font-semibold text-emerald-900 dark:text-emerald-200 mb-2\">Recommandation Internationale de Niveau A :</p>\n          <p class=\"text-xs text-navy-700 dark:text-navy-300\">\n            Tout patient atteint de LES doit recevoir de l'hydroxychloroquine (sauf contre-indication ophtalmologique absolue). Elle prévient les rechutes viscérales, diminue les complications cardiovasculaires et prolonge la survie globale.\n          </p>\n        </div>\n      </section>\n    ",
    "createdAt": "2026-09-25T16:03:38.637574+00:00",
    "updatedAt": "2026-09-25T16:03:38.637574+00:00"
  }
];
