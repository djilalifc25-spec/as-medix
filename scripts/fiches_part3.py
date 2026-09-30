# -*- coding: utf-8 -*-
"""
Flash Fiches Part 3: Néphrologie, Urologie, Gynécologie-Obstétrique, Pédiatrie, Orthopédie (fiches 35 to 50)
"""
import datetime

NOW_ISO = datetime.datetime.utcnow().isoformat() + "Z"

def make_card(title, content, color="slate"):
    color_map = {
        "rose": "bg-rose-950/60 border-rose-800/80 text-rose-100",
        "indigo": "bg-indigo-950/60 border-indigo-800/80 text-indigo-100",
        "amber": "bg-amber-950/60 border-amber-800/80 text-amber-100",
        "emerald": "bg-emerald-950/60 border-emerald-800/80 text-emerald-100",
        "purple": "bg-purple-950/60 border-purple-800/80 text-purple-100",
        "blue": "bg-sky-950/60 border-sky-800/80 text-sky-100",
        "slate": "bg-slate-900/90 border-slate-700/80 text-slate-100",
    }
    title_colors = {
        "rose": "text-rose-300",
        "indigo": "text-indigo-300",
        "amber": "text-amber-300",
        "emerald": "text-emerald-300",
        "purple": "text-purple-300",
        "blue": "text-sky-300",
        "slate": "text-white",
    }
    c_cls = color_map.get(color, color_map["slate"])
    t_cls = title_colors.get(color, title_colors["slate"])
    return f"""
    <div class="p-4 rounded-2xl border shadow-md {c_cls}">
      <h4 class="font-black text-sm mb-1.5 flex items-center gap-1.5 {t_cls}">{title}</h4>
      <div class="text-xs leading-relaxed space-y-1 text-slate-200">{content}</div>
    </div>
    """

def make_alert(title, text, alert_type="danger"):
    if alert_type == "danger":
        return f"""
        <div class="p-4 my-4 rounded-2xl border border-rose-800/80 bg-rose-950/60 text-xs shadow-md">
          <div class="flex items-center gap-2 text-rose-300 font-black text-sm mb-1">
            🚨 {title}
          </div>
          <div class="text-slate-200 leading-relaxed">{text}</div>
        </div>
        """
    elif alert_type == "warning":
        return f"""
        <div class="p-4 my-4 rounded-2xl border border-amber-800/80 bg-amber-950/60 text-xs shadow-md">
          <div class="flex items-center gap-2 text-amber-300 font-black text-sm mb-1">
            ⚠️ {title}
          </div>
          <div class="text-slate-200 leading-relaxed">{text}</div>
        </div>
        """
    else:
        return f"""
        <div class="p-4 my-4 rounded-2xl border border-indigo-800/80 bg-indigo-950/60 text-xs shadow-md">
          <div class="flex items-center gap-2 text-indigo-300 font-black text-sm mb-1">
            💡 {title}
          </div>
          <div class="text-slate-200 leading-relaxed">{text}</div>
        </div>
        """

def make_pitfalls(points):
    li_html = "".join([f"<li class='flex items-start gap-1.5'><span class='text-amber-500 font-bold shrink-0'>▸</span><span>{p}</span></li>" for p in points])
    return f"""
    <div class="p-5 mt-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-navy-900 to-navy-900 border border-indigo-500/30 shadow-lg text-xs">
      <div class="font-extrabold text-amber-400 uppercase tracking-wider text-xs flex items-center gap-2 mb-2.5">
        ⚡ PIÈGES AU CONCOURS & RÉFLEXES DE GARDE :
      </div>
      <ul class="space-y-2 text-slate-200 leading-relaxed">
        {li_html}
      </ul>
    </div>
    """

FICHES_PART3 = []

def add_fiche(fid, slug, title, spec_id, spec_name, cat, read_time, takeaways, html_body, pitfalls):
    full_html = f"""
    <div class="space-y-6">
      {html_body}
      {make_pitfalls(pitfalls)}
    </div>
    """
    FICHES_PART3.append({
        "id": fid,
        "slug": slug,
        "title": title,
        "specialtyId": spec_id,
        "specialtyName": spec_name,
        "category": cat,
        "estimatedReadTime": read_time,
        "accessLevel": "FREE",
        "published": True,
        "keyTakeaways": takeaways,
        "htmlContent": full_html.strip(),
        "updatedAt": NOW_ISO
    })

# ==============================================================================
# MODULE 7: NÉPHROLOGIE & TROUBLES ÉLECTROLYTIQUES (4 FICHES)
# ==============================================================================

# 35. IRA Anurique & Dialyse d'Urgence
add_fiche(
    fid="fiche_urgence_ira_anurique",
    slug="insuffisance-renale-aigue-anurique-indications-dialyse",
    title="Fiche Urgence : 35. Insuffisance Rénale Aiguë & Indications de Dialyse",
    spec_id="nephro",
    spec_name="Néphrologie",
    cat="Urgence Néphrologique",
    read_time="5 min",
    takeaways=[
        "Définition KDIGO : Élévation de la créatininémie ≥ 26.5 mcmol/L en 48h, ou ≥ 1.5x la valeur basale, ou diurèse < 0.5 mL/kg/h pendant ≥ 6h.",
        "Anurie complète (< 100 mL/24h) : Urgence diagnostique imposant l'échographie rénale immédiate pour éliminer un obstacle obstructif.",
        "Indications vitales d'Épuration Extrarénale (EER) d'urgence mémorisées par l'acronyme 'AEIOU'.",
        "Éliminer impérativement une rétention aiguë d'urine sous-vésicale par palpation et sondage avant tout bilan néphrologique."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Mnémonique des Indications de Dialyse (AEIOU)", "• <strong>A (Acidose) :</strong> Acidose métabolique sévère réfractaire (pH < 7.15, HCO3- < 10 mmol/L).<br>• <strong>E (Électrolytes) :</strong> Hyperkaliémie sévère menaçante (> 6.5 mmol/L avec signes ECG) résistante au traitement médical.<br>• <strong>I (Intoxications) :</strong> Toxiques dialysables (Lithium, Méthanol, Éthylène glycol, Salicylés).<br>• <strong>O (Overload) :</strong> OAP de surcharge réfractaire aux fortes doses de furosémide.<br>• <strong>U (Urémie) :</strong> Complications urémiques viscérales (Péricardite urémique, Encéphalopathie).", "rose")}
      {make_card("2. Démarche Étiologique Express", "• <strong>1. Post-rénale (obstructive 10%) :</strong> Dilatation des cavités pyélocalicielles à l'échographie -> Dérivation urgente (sonde JJ, néphrostomie).<br>• <strong>2. Pré-rénale (fonctionnelle 60%) :</strong> Déshydratation, choc, AINS/IEC. Ratios : NaU/KU < 1, U/P urée > 10, réversible en 24-48h après réhydratation saline.<br>• <strong>3. Rénale (organique 30%) :</strong> NTA (ischémique ou toxique 80%), néphrites interstitielles aiguës, glomérulonéphrites.", "blue")}
    </div>
    {make_alert("Règle Absolue : L'Échographie Rénale à H0", "Devant toute insuffisance rénale aiguë anurique, l'échographie rénale et des voies urinaires doit être réalisée dans les premières heures pour éliminer un obstacle bilatéral (ou sur rein unique anatomique ou fonctionnel) curable chirurgicalement.")}
    """,
    pitfalls=[
        "Ne jamais injecter de produit de contraste iodé pour explorer une insuffisance rénale aiguë (risque d'aggravation irréversible de la nécrose tubulaire) ; préférer l'échographie et le scanner sans injection.",
        "Le furosémide n'améliore pas le pronostic ni la survie de l'insuffisance rénale aiguë : il ne sert qu'à traiter la surcharge hydrosodée chez un patient qui répond encore aux diurétiques.",
        "La péricardite urémique est une contre-indication à l'anticoagulation lors de l'hémodialyse (risque élevé de tamponnade hémorragique)."
    ]
)

# 36. Hyperkaliémie Menaçante
add_fiche(
    fid="fiche_urgence_hyperkaliemie_grave",
    slug="hyperkaliemie-severe-menacante-ecg-urgence",
    title="Fiche Urgence : 36. Hyperkaliémie Sévère Menaçante ([K+] > 6.5 mmol/L)",
    spec_id="nephro",
    spec_name="Néphrologie",
    cat="Urgence Électrolytique",
    read_time="6 min",
    takeaways=[
        "Urgence rythmologique absolue : Le pronostic vital dépend des ANOMALIES ECG et non du seul chiffre de la kaliémie.",
        "Chronologie des signes ECG : Ondes T pointues et symétriques en tente de camping -> Élargissement du QRS et allongement du PR -> Disparition de P -> Aspect sinusoïdal -> Fibrillation ventriculaire / Asystolie.",
        "1er geste réflexe si signes ECG : GLUCONATE DE CALCIUM 10% (10 à 20 mL IVD sur 2-3 min) pour antagoniser la toxicité membranaire cardiaque.",
        "Traitements de transfert intracellulaire : Sérum glucosé + Insuline ordinaire IVSE + Salbutamol nébulisé à forte dose (10-20 mg)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Les 3 Temps du Traitement d'Urgence", "1. <strong>Protection myocardique immédiate (délai 1-3 min) :</strong> Gluconate de calcium 10% (10 mL IVD en 3 min). Répéter après 5 min si l'ECG ne se normalise pas.<br>2. <strong>Transfert intracellulaire du K+ (délai 15-30 min) :</strong><br>• 500 mL de G10% (ou 250 mL G30%) + 10 à 15 UI d'Insuline ordinaire IV sur 30 min.<br>• Salbutamol 10 à 20 mg en nébulisation.<br>• Bicarbonate de sodium 4.2% ou 1.4% (si acidose métabolique concomitante).<br>3. <strong>Élimination du K+ (délai heures) :</strong> Résines échangeuses (Lokelma/Kayexalate), Furosémide IV, Hémodialyse en urgence.", "rose")}
      {make_card("2. Contre-Indication Majeure du Calcium", "Le calcium intraveineux est formellement contre-indiqué en cas d'<strong>intoxication digitalique</strong> (risque d'arrêt cardiaque irréversible en systole) !<br>Dans ce cas particulier :<br>• Utiliser du <strong>Chlorure de Magnésium</strong> ou du Sulfate de Magnésium IV.<br>• Administrer des anticorps anti-digitoxine spécifiques (Fab / Digifab).", "amber")}
    </div>
    {make_alert("Le Piège Fréquent de la Fausse Hyperkaliémie (Hémolyse)", "Toujours éliminer une fausse hyperkaliémie liée à une hémolyse in vitro lors du prélèvement (garrot serré trop longtemps, aiguille trop fine, agitation du tube). Cependant, EN PRÉSENCE DE MODIFICATIONS À L'ECG, TRAITER IMMÉDIATEMENT sans attendre un prélèvement de contrôle !")}
    """,
    pitfalls=[
        "Le Gluconate de calcium ne fait pas baisser la kaliémie plasmatique d'un seul dixième de mmol/L : il ne fait que stabiliser le potentiel de repos de la membrane myocardique pendant 30 à 60 minutes !",
        "L'insuline sans glucose chez un patient normoglycémique provoque un coma hypoglycémique foudroyant : toujours associer au moins 3 à 4 g de glucose pour 1 UI d'insuline.",
        "La résine échangeuse d'ions (Kayexalate) a un délai d'action d'au moins 2 à 4 heures et n'a aucune place dans le traitement immédiat de l'urgence électrique."
    ]
)

# 37. Hyponatrémie Aiguë Sévère
add_fiche(
    fid="fiche_urgence_hyponatremie_aigue",
    slug="hyponatremie-aigue-severe-oedeme-cerebral",
    title="Fiche Urgence : 37. Hyponatrémie Aiguë Sévère Symptomatique ([Na+] < 120 mmol/L)",
    spec_id="nephro",
    spec_name="Néphrologie",
    cat="Urgence Électrolytique",
    read_time="6 min",
    takeaways=[
        "Urgence neurologique : Entrée massive d'eau dans les cellules cérébrales créant un Œdème Cérébral aigu avec risque d'engagement.",
        "Symptômes de gravité extrême : Confusion, obnubilation, crises convulsives comitiales répétées, coma, dépression respiratoire.",
        "Traitement salvateur immédiat : Bolus de Sérum Salé Hypertonique à 3% (NaCl 3% : 150 mL en 20 min, renouvelable).",
        "Règle de sécurité vitale : Vitesse de correction maximale de 8 à 10 mmol/L sur les premières 24 heures pour prévenir la Myélinolyse Centropontine."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Protocole du NaCl Hypertonique à 3%", "Devant des signes neurologiques sévères :<br>1. Perfusion de <strong>150 mL de NaCl 3% sur 20 minutes</strong>.<br>2. Contrôler la natrémie à 20-30 minutes.<br>3. Si les symptômes persistent ou si la natrémie n'a pas augmenté de 5 mmol/L : Répéter un 2ème bolus de 150 mL de NaCl 3%.<br>4. Objectif : Augmenter la natrémie de <strong>4 à 6 mmol/L rapidement</strong> pour stopper l'œdème cérébral et les convulsions.", "emerald")}
      {make_card("2. Le Piège de la Démyélinisation Osmotique", "Si une hyponatrémie chronique est corrigée trop rapidement (> 10-12 mmol/L/24h) :<br>• Survenue après 2 à 6 jours d'une <strong>Myélinolyse centropontine (syndrome de démyélinisation osmotique)</strong>.<br>• Tableau irréversible de 'Locked-in syndrome', tétraparésie spastique et paralysie bulbaire.<br>• Si la correction s'emballe : Ré-abaisser la natrémie en perfusant du G5% ou de la Desmopressine (Minirin).", "rose")}
    </div>
    {make_alert("Préparation Rapide du NaCl 3% en Pratique", "Si les poches de NaCl 3% ne sont pas disponibles : mélanger <strong>40 mL de NaCl 10% dans 160 mL de NaCl 0.9%</strong> (ou 60 mL de NaCl 10% dans 140 mL d'eau PPI) pour obtenir une solution prête à l'emploi.")}
    """,
    pitfalls=[
        "Dans l'hyponatrémie sévère symptomatique avec convulsions, l'urgence absolue est de remonter la natrémie de 5 mmol/L avec du NaCl 3%, quel que soit le statut volémique du patient !",
        "Ne jamais utiliser de solutés hypotoniques (G5% pur) chez un patient hyponatrémique (aggrave immédiatement l'œdème cérébral).",
        "Toujours éliminer une fausse hyponatrémie par hyperprotidémie majeure (myélome) ou hypertriglycéridémie massive (sérum lactescent)."
    ]
)

# 38. Hypercalcémie Aiguë Majeure
add_fiche(
    fid="fiche_urgence_crise_hypercalcemique",
    slug="hypercalcemie-aigue-majeure-bisphosphonates-ecg",
    title="Fiche Urgence : 38. Hypercalcémie Aiguë Majeure ([Ca2+] > 3.5 mmol/L / 140 mg/L)",
    spec_id="nephro",
    spec_name="Néphrologie",
    cat="Urgence Électrolytique",
    read_time="5 min",
    takeaways=[
        "Urgence cardiovasculaire et rénale : Raccourcissement du segment QT à l'ECG avec risque de troubles du rythme ventriculaire mortels.",
        "Signes cliniques : Déshydratation extracellulaire globale majeure, syndrome polyuropolydipsique, douleurs abdominales, confusion/coma.",
        "Deux étiologies dominantes (90%) : Hyperparathyroïdie primitive et Métastases / Sécrétion de PTH-rp des Cancers et Hémopathies.",
        "Trépied thérapeutique d'urgence : Réhydratation saline massive (NaCl 0.9% 3 à 5 L/24h) + Bisphosphonates IV (Zolédronate) + Calcitonine."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Signes ECG Cardinaux", "• <strong>Raccourcissement de l'intervalle QTc</strong> (< 360 ms) : signe le plus précoce et le plus constant.<br>• Aplatissement ou élargissement de l'onde T.<br>• Allongement du PR, blocs auriculo-ventriculaires (BAV).<br>• Tachycardie ventriculaire, fibrillation ventriculaire et arrêt cardiaque en systole.", "rose")}
      {make_card("2. Protocole Thérapeutique d'Attaque", "1. <strong>Expansion volémique saline :</strong> NaCl 0.9% (3 à 6 Litres par 24h) pour restaurer la volémie et induire une calciurèse saline forcée.<br>2. <strong>Bisphosphonates IV :</strong> Acide zolédronique (Zometa 4 mg IV sur 15 min) : effet maximal à 48-72h.<br>3. <strong>Calcitonine SC/IV :</strong> 4 à 8 UI/kg toutes les 12h (action hypocalcémiante rapide en quelques heures, mais phénomène d'échappement à 48h).", "emerald")}
    </div>
    {make_alert("Le Rôle Discuté des Diurétiques de l'Anse", "Le Furosémide n'est plus administré systématiquement d'emblée : il est réservé EXCLUSIVEMENT aux patients présentant des signes de surcharge hydrosodée (OAP) après réhydratation saline complète, car administré chez un patient déshydraté il aggrave dramatiquement l'insuffisance rénale et l'hypercalcémie !")}
    """,
    pitfalls=[
        "Toujours calculer la calcémie corrigée en fonction de l'albuminémie : Ca_corrigé (mmol/L) = Ca_mesuré + 0.02 x (40 - Albuminémie en g/L).",
        "Ne jamais prescrire de diurétique thiazidique chez un patient hypercalcémique (les thiazidiques réduisent l'excrétion urinaire de calcium et majorent la crise).",
        "En cas d'hypercalcémie maligne réfractaire avec anurie ou insuffisance rénale sévère, l'hémodialyse sur bain pauvre en calcium ou sans calcium est indiquée en urgence."
    ]
)

# ==============================================================================
# MODULE 8: UROLOGIE (3 FICHES)
# ==============================================================================

# 39. Torsion du Cordon Spermatique
add_fiche(
    fid="fiche_urgence_torsion_cordon_spermatique",
    slug="torsion-du-cordon-spermatique-urgence-6h",
    title="Fiche Urgence : 39. Torsion du Cordon Spermatique (Urgence Chirurgicale < 6h)",
    spec_id="uro",
    spec_name="Urologie",
    cat="Urgence Urologique",
    read_time="4 min",
    takeaways=[
        "Toute douleur testiculaire aiguë unilatérale brutale chez l'enfant, l'adolescent ou l'adulte jeune est une torsion jusqu'à preuve chirurgicale !",
        "Examen clinique : Bourse douloureuse augmentée de volume, testicule rétracté ascensionné au collet, horizontalisé, abolition du réflexe crémastérien.",
        "Signe de Prehn NÉGATIF (la surélévation de la bourse ne soulage pas la douleur).",
        "RÈGLE D'OR : EXPLORATION CHIRURGICALE BILATÉRALE SANS AUCUN EXAMEN COMPLÉMENTAIRE NI ÉCHOGRAPHIE PRÉALABLE DANS LES 6 HEURES !"
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Signes Distinctifs : Torsion vs Orchi-épididymite", "• <strong>Torsion du cordon :</strong> Sujet jeune (< 25 ans), début brutal en coup de tonnerre, apyrétique, bandelette urinaire négative, réflexe crémastérien aboli, signe de Prehn négatif.<br>• <strong>Orchi-épididymite :</strong> Début progressif, fièvre, pyurie, réflexe crémastérien présent, signe de Prehn positif (soulagement au soulèvement de la bourse).<br><em>Règle absolue :</em> Au moindre doute, c'est une torsion !", "rose")}
      {make_card("2. Temps Chirurgical Obligatoire", "• <strong>Incision scrotale exploratrice :</strong> Détorsion du cordon et évaluation de la recoloration testiculaire après réchauffement au sérum tiède.<br>• <strong>Orchydopexie bilatérale :</strong> Fixation du testicule détordu ET fixation systématique du testicule controlatéral (malformation anatomique en battant de cloche bilatérale dans 80% des cas !).<br>• Orchidectomie si nécrose irréversible dépassée.", "indigo")}
    </div>
    {make_alert("Faute Professionnelle Lourde : Attendre l'Écho-Doppler", "Prescrire une échographie-doppler scrotale et attendre le radiologue devant un tableau clinique typique de torsion testiculaire est une faute grave : l'écho-doppler fait perdre un temps précieux et peut comporter des faux négatifs (flux persistant si torsion incomplète). L'indication chirurgicale est purement clinique !")}
    """,
    pitfalls=[
        "Au-delà de la 6ème heure d'ischémie testiculaire, les lésions de la spermatogenèse et la nécrose glandulaire deviennent irréversibles dans plus de 80% des cas.",
        "Toujours fixer le testicule opposé (controlatéral) au cours de la même intervention pour prévenir la torsion ultérieure du rein génital unique restant.",
        "Une douleur de la fosse iliaque droite chez un jeune garçon peut être une douleur projetée d'une torsion testiculaire méconnue : examiner systématiquement les bourses !"
    ]
)

# 40. Pyélonéphrite Aiguë Obstructive
add_fiche(
    fid="fiche_urgence_pyelonephrite_obstructive",
    slug="pyelonephrite-aigue-obstructive-drainage-urgence",
    title="Fiche Urgence : 40. Pyélonéphrite Aiguë Obstructive (PNA sur Obstacle)",
    spec_id="uro",
    spec_name="Urologie",
    cat="Urgence Urologique",
    read_time="5 min",
    takeaways=[
        "Infection parenchymateuse rénale aiguë suppurée compliquant un obstacle urétéral (lithiase, tumeur, compression extrinsèque).",
        "Urgence médico-chirurgicale : Risque foudroyant de choc septique urologique et de destruction du parenchyme rénal.",
        "Signes d'alerte : Douleur lombaire unilatérale + Fièvre élevée avec frissons solennels + Syndrome de réponse inflammatoire systémique.",
        "Trépied curatif : Réanimation hémodynamique + Antibiothérapie double bactéricide IV + DRAINAGE CHIRURGICAL DU REIN EN URGENCE ABSOLUE."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Imagerie d'Urgence", "• <strong>Uro-TDM sans injection (ou Échographie rénale) :</strong> Révèle la dilatation des cavités pyélocalicielles en amont de l'obstacle et localise le calcul urétéral.<br>• Recherche de complications : abcès rénal, pyonéphrose, infiltration péri-rénale majeure.<br>• À réaliser dans les 6 heures maximum de l'admission.", "blue")}
      {make_card("2. Modalités de Drainage du Rein", "Le drainage des urines purulentes sous pression est le seul geste qui guérit le sepsis :<br>1. <strong>Montée de sonde urétérale JJ (Double J) :</strong> Par voie endoscopique rétrograde trans-urétrale sous anesthésie.<br>2. <strong>Néphrostomie percutanée (PNC) :</strong> Pose d'un drain directement dans les cavités rénales sous guidage échographique (idéal si choc septique sévère ou urètre infranchissable).", "emerald")}
    </div>
    {make_alert("Antibiothérapie IV d'Attaque", "C3G parentérale (Céfotaxime 2g x 3/j ou Ceftriaxone 2g/j) associée systématiquement à un Aminoside (Amikacine 25-30 mg/kg/j en perfusion unique sur 30 min) pour obtenir une bactéricidie urinaire et plasmatique ultra-rapide sur les entérobactéries productrices de BLSE et Pseudomonas.")}
    """,
    pitfalls=[
        "L'antibiothérapie seule ne peut jamais guérir une pyélonéphrite obstructive : tant que le pus est sous pression dans le rein, le choc septique s'aggrave.",
        "Ne jamais tenter de lithotritie extracorporelle ni d'urétéroscopie laser en phase infectieuse aiguë : le seul objectif est le drainage d'attente.",
        "Une pyélonéphrite aiguë avec anurie ou oligurie doit faire évoquer d'emblée un rein unique fonctionnel obstrué."
    ]
)

# 41. Rétention Aiguë d'Urine (RAU)
add_fiche(
    fid="fiche_urgence_retention_aigue_urine",
    slug="retention-aigue-urine-globe-vesical-levee-obstacle",
    title="Fiche Urgence : 41. Rétention Aiguë d'Urine & Syndrome de Levée d'Obstacle",
    spec_id="uro",
    spec_name="Urologie",
    cat="Urgence Urologique",
    read_time="5 min",
    takeaways=[
        "Impossibilité totale et douloureuse d'uriner malgré des envies impérieuses fréquentes, avec angoisse et agitation.",
        "Diagnostic clinique évident : Le 'Globe Vésical' (masse hypogastrique convexe vers le haut, mate à la percussion, rénitente et sensible).",
        "Deux techniques de drainage : Sondage vésical par voie urétrale ou Cathétérisme sus-pubien.",
        "Surveillance obligatoire post-décompression : Risque majeur de SYNDROME DE LEVÉE D'OBSTACLE (polyurie massive > 1 L/h, déshydratation et hypokaliémie)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Sondage vs Cathéter Sus-Pubien", "• <strong>Sondage urétrale (1ère intention) :</strong> Sonde stérile en silicone ou latex, gel anesthésique local.<br>• <strong>Contre-indications du cathétérisme sus-pubien :</strong> Hématurie macroscopique ou suspicion de cancer de vessie, antécédent de chirurgie sous-ombilicale (risque de perforation digestive), pontage fémoral, troubles de l'hémostase.<br>• <strong>Contre-indication du sondage urétral :</strong> Suspicion de rupture traumatique de l'urètre (sang au méat).", "purple")}
      {make_card("2. Prévention du Syndrome de Levée d'Obstacle", "Après vidange d'un volumineux globe (> 800-1000 mL) :<br>• Vidange initiale fractionnée (clampage tous les 500 mL pendant 15 min) pour prévenir l'hématurie a vacuo.<br>• Mesure horaire de la diurèse.<br>• Si diurèse > 500 mL/h : Compensation hydro-électrolytique IV par soluté salé équilibré (compensant 70-80% des pertes pour éviter d'entretenir la polyurie).", "blue")}
    </div>
    {make_alert("Prostatite Aiguë et Voie de Drainage", "En cas de rétention aiguë d'urine fébrile chez l'homme (prostatite aiguë bactérienne), le cathétérisme sus-pubien était classiquement préféré pour éviter la douleur et la bactériémie du passage urétral ; le sondage urétral très doux par sonde de petit calibre reste possible sous couverture antibiotique.")}
    """,
    pitfalls=[
        "Une incontinence urinaire chez le vieillard ou le diabétique peut n'être qu'une 'fausse incontinence par regorgement' masquant un globe vésical chronique géant !",
        "L'hématurie a vacuo après vidange vésicale est bénigne : elle résulte de la rupture de veinules de la muqueuse sous-muqueuse soudainement décomprimée.",
        "Ne jamais retirer la sonde vésicale avant 48 heures de traitement par alpha-bloquant (Tamsulosine) pour maximiser les chances de succès de reprise mictionnelle."
    ]
)

# ==============================================================================
# MODULE 9: GYNÉCOLOGIE - OBSTÉTRIQUE (3 FICHES)
# ==============================================================================

# 42. Grossesse Extra-Utérine Rompue
add_fiche(
    fid="fiche_urgence_grossesse_extra_uterine",
    slug="grossesse-extra-uterine-rompue-geu-cataclysmique",
    title="Fiche Urgence : 42. Grossesse Extra-Utérine Rompue (Inondation Péritonéale)",
    spec_id="gyneco",
    spec_name="Gynécologie - Obstétrique",
    cat="Urgence Gynéco-Obstétricale",
    read_time="5 min",
    takeaways=[
        "Première cause de mortalité maternelle au 1er trimestre de la grossesse.",
        "Triade classique : Retard de règles + Douleurs pelviennes unilatérales vives + Métrorragies noirâtres sépia peu abondantes.",
        "GEU rompue avec hémopéritoine cataclysmique : Douleur syncopale brutale, défense hypogastrique, douleur exquise au cul-de-sac de Douglas, état de choc hémorragique.",
        "Confirmation diagnostique : Bêta-hCG plasmatiques positives + Vacuité utérine à l'échographie endovaginale + Épanchement péritonéal abondant."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Signes Échographiques Décisifs", "• <strong>Utérus vide</strong> avec endomètre épaissi décidualisé (vacuité utérine alors que les b-hCG sont > 1000-1500 UI/L = zone discriminante).<br>• Masse latéro-utérine hétérogène ou sac gestationnel extra-utérin avec embryon et activité cardiaque (pathognomonique).<br>• Épanchement anéchogène dans le cul-de-sac de Douglas et le récessus hépato-rénal de Morison.", "rose")}
      {make_card("2. Traitement Chirurgical d'Urgence", "En cas de GEU rompue ou d'instabilité hémodynamique :<br>• Cœlioscopie opératoire d'extrême urgence (ou laparotomie d'emblée si choc décompensé).<br>• <strong>Salpingectomie totale</strong> par voie cœlioscoique (ablation de la trompe rompue) avec évacuation de l'hémopéritoine.<br>• Transfusion sanguine selon protocole de choc hémorragique.<br>• <strong>Injection d'immunoglobulines anti-D</strong> chez toute femme Rhésus négatif !", "emerald")}
    </div>
    {make_alert("Prévention de l'Allo-Immunisation Rhésus", "L'injection d'Immunoglobulines Anti-D (Rhophylac 200 mcg) est une obligation médicolégale absolue chez TOUTE patiente Rhésus négatif présentant une GEU dans les 72 heures, pour prévenir l'immunisation foeto-maternelle des grossesses ultérieures.")}
    """,
    pitfalls=[
        "Toute douleur abdominale ou pelvienne chez une femme en âge de procréer impose un test de grossesse (bêta-hCG) d'emblée, même si la patiente est sous contraception ou prétend avoir eu ses règles récemment.",
        "Le traitement médical par Méthotrexate (MTX 50 mg/m2 IM) est STRICTEMENT CONTRE-INDIQUÉ en cas de GEU rompue, d'hémopéritoine abondant ou de doute hémodynamique.",
        "La présence d'un pseudo-sac gestationnel intra-utérin (collection liquidienne centrale sans couronne trophoblastique) ne doit pas écarter à tort le diagnostic de GEU !"
    ]
)

# 43. Pré-Éclampsie Sévère & Crise d'Éclampsie
add_fiche(
    fid="fiche_urgence_pre_eclampsie_eclampsie",
    slug="pre-eclampsie-severe-crise-eclampsie-sulfate-magnesium",
    title="Fiche Urgence : 43. Pré-Éclampsie Sévère & Crise d'Éclampsie",
    spec_id="gyneco",
    spec_name="Gynécologie - Obstétrique",
    cat="Urgence Obstétricale",
    read_time="6 min",
    takeaways=[
        "Définition Pré-éclampsie : HTA gravidique (PAS ≥ 140 et/ou PAD ≥ 90 mmHg) apparaissant après 20 SA associée à une protéinurie significative (≥ 300 mg/24h).",
        "Signes d'éclampsie imminente (signes neuro-sensoriels) : Céphalées rebelles pulsatiles, phosphènes/scotomes visuels, acouphènes, ROT polycinétiques, barre épigastrique de Chaussier.",
        "Crise d'éclampsie : Crise convulsive généralisée tonicoclonique gravidique engageant le pronostic vital foeto-maternel.",
        "Traitement anticonvulsivant de référence : SULFATE DE MAGNÉSIUM IV (dose de charge 4g puis 1g/h)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Critères de Pré-Éclampsie Sévère", "Présence d'au moins UN critère :<br>• HTA sévère : PAS ≥ 160 mmHg ou PAD ≥ 110 mmHg.<br>• Signes neuro-sensoriels persistants.<br>• OAP maternel.<br>• <strong>HELLP Syndrome :</strong> Hémolyse (schizocytes) + Élévation transaminases (ASAT/ALAT > 2N) + Thrombopénie (Plaquettes < 100 000/mm3).<br>• Insuffisance rénale (créatinine > 90 mcmol/L) ou oligurie.<br>• RCIU sévère / souffrance foetale aiguë.", "rose")}
      {make_card("2. Protocole du Sulfate de Magnésium (MgSO4)", "Traitement princeps de l'éclampsie et prévention dans les formes sévères :<br>• <strong>Dose de charge :</strong> 4 g IV dilués dans 100 mL de G5% perfusés en 15-20 min.<br>• <strong>Dose d'entretien :</strong> 1 g/h en perfusion continue IVSE pendant 24h post-partum.<br>• <strong>Surveillance de la toxicité :</strong> ROT présents, diurèse > 30 mL/h, FR > 12/min.<br>• <em>Antidote obligatoire au lit du malade :</em> Gluconate de Calcium 10% (1 g IVD).", "indigo")}
    </div>
    {make_alert("Le Seul Traitement Étiologique Définitif", "Le seul traitement curatif de la pré-éclampsie et de l'éclampsie est la DÉLIVRANCE (extraction foetale et délivrance placentaire). Dès stabilisation hémodynamique et anticonvulsivante de la mère, la césarienne d'urgence s'impose.")}
    """,
    pitfalls=[
        "Le Sulfate de Magnésium est supérieur au Diazépam et à la Phénytoïne pour stopper les convulsions d'éclampsie et réduire la récidive et la mortalité maternelle.",
        "Le contrôle tensionnel doit être progressif avec la Nicardipine (Loxen IVSE) ou le Labétalol : une chute brutale de la PA maternelle effondre la perfusion utéro-placentaire et entraîne une mort foetale in utero !",
        "L'apparition d'une barre épigastrique de Chaussier chez une femme pré-éclamptique témoigne d'une nécrose hépatocellulaire aiguë (risque d'hématome sous-capsulaire du foie rompue)."
    ]
)

# 44. Hémorragie de la Délivrance
add_fiche(
    fid="fiche_urgence_hemorragie_delivrance",
    slug="hemorragie-de-la-delivrance-atoni-uterine-sulprostone",
    title="Fiche Urgence : 44. Hémorragie du Post-Partum (Hémorragie de la Délivrance)",
    spec_id="gyneco",
    spec_name="Gynécologie - Obstétrique",
    cat="Urgence Obstétricale",
    read_time="6 min",
    takeaways=[
        "Définition : Perte sanguine ≥ 500 mL après accouchement par voie basse (ou ≥ 1000 mL après césarienne) dans les 24h suivant la naissance.",
        "Première cause évitable de mortalité maternelle en obstétrique.",
        "Cause la plus fréquente (70%) : Atonie utérine (utérus mou, non rétracté au-dessus de l'ombilic).",
        "Règle séquentielle minutée : Délivrance artificielle + Révision utérine + Massage + Ocytocine IVD -> Sulprostone IVSE < 30 min -> Ballon de Bakri / Embolisation / Chirurgie."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Les 4 'T' Étiologiques", "• <strong>Tonus (70%) :</strong> Atonie utérine (travail prolongé, surdistension par jumeaux/hydramnios, multiparité).<br>• <strong>Tissu (20%) :</strong> Rétention placentaire partielle ou totale, cotylédon aberrant.<br>• <strong>Traumatisme (10%) :</strong> Déchirure du col de l'utérus, plaie vaginale profonde, rupture utérine.<br>• <strong>Thrombine (1%) :</strong> Coagulopathie constitutionnelle ou CIVD sur HRP.", "blue")}
      {make_card("2. Escalade Thérapeutique Chronométrée", "• <strong>0 à 15 min :</strong> Massage utérin + Délivrance artificielle / Révision utérine manuelle stérile + Révision sous valves du col et du vagin.<br>• <strong>Médicaments utérotoniques :</strong><br>1. <strong>Ocytocine (Syntocinon) :</strong> 5 à 10 UI IVD lente puis perfusion 20-40 UI.<br>2. <strong>Sulprostone (Nalador) :</strong> 500 mcg IVSE sur 1 heure si saignement persistant à 15-30 min.<br>• <strong>Tamponnement intra-utérin :</strong> Ballon de Bakri.", "rose")}
    </div>
    {make_alert("Acide Tranexamique d'Emblée (Essai WOMAN)", "L'administration précoce d'Acide Tranexamique (Exacyl 1 g IV sur 10 minutes) dans les 3 heures suivant l'accouchement réduit la mortalité par hémorragie de 30% sans risque thromboembolique surajouté.")}
    """,
    pitfalls=[
        "Le volume du saignement post-partum est quasi systématiquement sous-estimé visuellement de plus de 50% : utiliser impérativement un sac de recueil gradué sous les fesses de la parturiente !",
        "Ne jamais débuter la révision utérine sans sonde vésicale posée : la vidange d'une vessie pleine permet souvent à elle seule la rétraction de l'utérus.",
        "En cas d'échec des utérotoniques et du tamponnement par ballon : embolisation des artères utérines en radiologie interventionnelle ou chirurgie hémostatique (capitonnage de B-Lynch, ligature hypogastrique, hystérectomie d'hémostase en dernier recours)."
    ]
)

# ==============================================================================
# MODULE 10: PÉDIATRIE (3 FICHES)
# ==============================================================================

# 45. Déshydratation Aiguë Sévère du Nourrisson
add_fiche(
    fid="fiche_urgence_deshydratation_nourrisson",
    slug="deshydratation-aigue-severe-nourrisson-perte-de-poids",
    title="Fiche Urgence : 45. Déshydratation Aiguë Sévère du Nourrisson (> 10%)",
    spec_id="pediatrie",
    spec_name="Pédiatrie & Puériculture",
    cat="Urgence Pédiatrique",
    read_time="5 min",
    takeaways=[
        "La sévérité est jugée par le POURCENTAGE DE PERTE DE POIDS par rapport au poids récent antérieur : Sévère dès > 10% (Choc dès > 15%).",
        "Signes de déshydratation extracellulaire : Pli cutané persistant, cernes oculaires profonds, fontanelle antérieure déprimée, yeux excavés.",
        "Signes de choc hypovolémique : Allongement du temps de recoloration cutanée (TRC > 3s), extrémités froides, marbrures, pouls filant.",
        "Traitement d'urgence du choc : Remplissage vasculaire rapide par NaCl 0.9% ou Ringer Lactate à 20 mL/kg en 15-20 min."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Classification Clinique selon la Perte de Poids", "• <strong>Légère (< 5%) :</strong> Soif, muqueuse buccale discrètement sèche. Traitement par Soluté de Réhydratation Orale (SRO) à domicile.<br>• <strong>Modérée (5 à 10%) :</strong> Pli cutané franc, cernes, soif vive, perte de poids nette. SRO par voie orale ou sonde nasogastrique.<br>• <strong>Sévère (> 10%) :</strong> Troubles de conscience (somnolence ou léthargie), hypotonie des globes oculaires, oligurie/anurie, collapsus. Hospitalisation et perfusion IV.", "rose")}
      {make_card("2. Protocole de Remplissage & Réhydratation IV", "1. <strong>Phase d'urgence (si état de choc) :</strong> Bolus de cristalloïdes isotoniques (NaCl 0.9%) à <strong>20 mL/kg en 20 minutes</strong> (renouvelable une fois si TRC reste > 3s).<br>2. <strong>Phase de réhydratation d'entretien :</strong> Calcul des besoins de base (règle d'Holliday-Segar) + compensation du déficit calculé sur 24 à 48 heures.<br>• <em>Règle de sécurité :</em> Pas de potassium tant que l'enfant n'a pas uriné !", "emerald")}
    </div>
    {make_alert("L'Erreur Fatale : Les Solutés 'Maison' Inadaptés", "Réhydrater un nourrisson avec de l'eau pure, des tisanes non sucrées ou du cola dégazé entraîne une hyponatrémie aiguë foudroyante compliquée d'œdème cérébral et de convulsions comitiales. Seuls les SRO labellisés OMS ou les perfusions médicales sont autorisés.")}
    """,
    pitfalls=[
        "La pesée nue du nourrisson est l'acte médical fondamental le plus informatif aux urgences pédiatriques : ne jamais commencer un examen sans le poids !",
        "En cas d'accès veineux périphérique impossible chez un nourrisson en état de choc déshydraté : pose immédiate d'une aiguille intra-osseuse tibiale (tubérosité tibiale antérieure).",
        "En cas de déshydratation hypernatrémique ([Na+] > 150 mmol/L), la correction doit être très lente sur 48 heures pour éviter le risque d'œdème cérébral osmotique."
    ]
)

# 46. Bronchiolite Aiguë Grave
add_fiche(
    fid="fiche_urgence_bronchiolite_grave",
    slug="bronchiolite-aigue-grave-nourrisson-optiflow",
    title="Fiche Urgence : 46. Bronchiolite Aiguë Sévère du Nourrisson (Signes de Lutte)",
    spec_id="pediatrie",
    spec_name="Pédiatrie & Puériculture",
    cat="Urgence Pédiatrique",
    read_time="5 min",
    takeaways=[
        "Premier épisode de dyspnée obstructive sifflante avec râles crépitants et sous-crépitants chez un nourrisson de moins de 12 mois (VRS).",
        "Critères d'hospitalisation d'urgence : Âge < 6 semaines, prématurité, apnées/pauses respiratoires, SpO2 < 92%, prises alimentaires < 50%.",
        "Signes d'épuisement respiratoire : Balancement thoraco-abdominal paradoxal, geignement expiratoire, respiration superficielle bradypnéique.",
        "Traitement de support moderne : Oxygénothérapie à haut débit humidifiée et réchauffée (Optiflow) et désobstruction rhinopharyngée (DRP)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Score de Détresse Respiratoire de Wang", "Évalue 4 paramètres cotés de 0 à 3 :<br>• Fréquence respiratoire selon l'âge.<br>• Wheezing / Sibilants à l'auscultation.<br>• Tirage intercostal, sous-costal et sus-sternal.<br>• État général / coloration.<br><em>Score ≥ 9 :</em> Détresse respiratoire sévère imposant une prise en charge en soins intensifs pédiatriques.", "purple")}
      {make_card("2. Recommandations HAS / Internationales", "• <strong>Mesures validées efficaces :</strong> Désobstruction rhino-pharyngée (DRP) au sérum physiologique avant les repas, fractionnement des biberons, proclive dorsal 30°, oxygénothérapie si SpO2 < 92%.<br>• <strong>Inutiles ou déconseillés en routine :</strong> Bronchodilatateurs (Salbutamol), corticoïdes systémiques ou inhalés, antibiotiques, kinésithérapie respiratoire par clapping/drainage postural.", "blue")}
    </div>
    {make_alert("Haut Débit Nasal (Optiflow) en Réanimation", "L'oxygénothérapie nasale à haut débit réchauffé et humidifié (2 L/kg/min) génère une pression expiratoire positive (PEP) douce qui déplisse les bronchioles collabées et diminue de plus de 80% le recours à l'intubation trachéale.")}
    """,
    pitfalls=[
        "Chez le nourrisson de moins de 3 mois, l'infection à VRS peut se manifester uniquement par des APNÉES centrales isolées sans toux ni râles auscultatoires initiaux.",
        "Les bronchodilatateurs (Ventoline) sont inefficaces chez le tout petit nourrisson en raison de l'immaturité des récepteurs bêta-2 bronchiques et de la prédominance de l'œdème muqueux sur le bronchospasme.",
        "Ne jamais forcer l'alimentation par voie orale chez un enfant polypnéique (FR > 60/min) : passer à l'alimentation entérale par sonde gastrique ou perfusion pour éviter l'inhalation bronchique."
    ]
)

# 47. Épiglottite Aiguë
add_fiche(
    fid="fiche_urgence_epiglottite_aigue",
    slug="epiglottite-aigue-enfant-laryngite-sus-glottique",
    title="Fiche Urgence : 47. Épiglottite Aiguë de l'Enfant (Urgence Asphyxique)",
    spec_id="pediatrie",
    spec_name="Pédiatrie & Puériculture",
    cat="Urgence Pédiatrique & ORL",
    read_time="4 min",
    takeaways=[
        "Cellulite bactérienne suraiguë de l'épiglotte et des tissus sus-glottiques (historiquement Haemophilus influenzae b, Streptococcus).",
        "Position spontanée pathognomonique en 'Tripode' : Enfant assis penché en avant, bouche ouverte, langue pendante, bavant abondamment (sialorrhée par dysphagie totale).",
        "Dyspnée laryngée inspiratoire avec stridor étouffé, voix couverte de 'patate chaude', fièvre très élevée (39-40°C), absence de toux aboyante.",
        "INTERDICTION FORMELLE : JAMAIS D'ABAISSE-LANGUE NI DE DÉCUBITUS DORSAL (RISQUE D'ARRÊT RESPIRATOIRE RÉFLEXE INSTANTANÉ) !"
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Les 4 'D' de l'Épiglottite Aiguë", "• <strong>Drooling (Bave) :</strong> Sialorrhée majeure due à l'impossibilité douloureuse d'avaler la salive.<br>• <strong>Dysphagia (Dysphagie) :</strong> Douleur pharyngée atroce bloquant toute déglutition.<br>• <strong>Dysphonia (Dysphonie) :</strong> Voix éteinte, nasonnée, étouffée.<br>• <strong>Distress (Détresse) :</strong> Polypnée, tirage sus-sternal intense, angoisse panique.", "rose")}
      {make_card("2. Protocole de Prise en Charge d'Urgence", "1. <strong>Ne pas toucher l'enfant :</strong> Le laisser assis dans les bras de ses parents.<br>2. <strong>Oxygène :</strong> Présenté à quelques centimètres du visage sans masque plaqué serré.<br>3. <strong>Appel du réanimateur et de l'anesthésiste-ORL :</strong> Transfert direct au bloc opératoire pour intubation orotrachéale sous anesthésie par inhalation.<br>4. <strong>Antibiothérapie IV :</strong> C3G (Ceftriaxone 50-100 mg/kg/j) débutée après sécurisation des voies aériennes.", "indigo")}
    </div>
    {make_alert("Le Geste Fatal à Proscrire Absolument !", "Vouloir examiner la gorge avec un abaisse-langue ou allonger l'enfant pour ausculter déclenche un laryngospasme réflexe total ou la bascule de l'épiglotte tuméfiée obstruant le larynx avec arrêt cardiaque anoxique immédiat !")}
    """,
    pitfalls=[
        "Ne jamais tenter de ponction veineuse, d'aérosol forcé ou de radiographie du cou chez un enfant suspect d'épiglottite tant que l'intubation au bloc n'a pas été réalisée.",
        "La différenciation avec la laryngite sous-glottique bénigne (faux croup) repose sur la toux aboyante et la voix rauque dans la laryngite sous-glottique, alors que la toux est ABSENTE et la voix étouffée dans l'épiglottite.",
        "Grâce à la vaccination généralisée contre Haemophilus influenzae b (Hib), la fréquence a considérablement chuté, mais des cas surviennent chez les enfants non vaccinés ou à streptocoque."
    ]
)

# ==============================================================================
# MODULE 11: ORTHOPÉDIE & TRAUMATOLOGIE (3 FICHES)
# ==============================================================================

# 48. Polytraumatisé Grave (Damage Control)
add_fiche(
    fid="fiche_urgence_polytraumatise",
    slug="polytraumatisme-grave-damage-control-abcde",
    title="Fiche Urgence : 48. Polytraumatisé Grave (Damage Control & ABCDE)",
    spec_id="ortho",
    spec_name="Orthopédie & Traumatologie",
    cat="Traumatologie Lourde",
    read_time="6 min",
    takeaways=[
        "Définition : Blessé présentant plusieurs lésions traumatiques dont au moins une met en jeu le pronostic vital à court terme.",
        "Approche séquentielle internationale ATLS standardisée : A (Airway), B (Breathing), C (Circulation), D (Disability), E (Exposure).",
        "Combat de la 'Triade Létale' : Hypothermie (< 35°C) + Acidose métabolique (pH < 7.20) + Coagulopathie traumatique précoce.",
        "Stratégie de Damage Control : Hémostase chirurgicale écourtée d'urgence + Réanimation d'hémostase (ratio transfusionnel 1:1:1 + Acide Tranexamique)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Bilan Primaire Systématisé ABCDE", "• <strong>A (Airway) :</strong> Libération des VAS avec contrôle continu de l'axe rachidien cervical (collier rigide).<br>• <strong>B (Breathing) :</strong> Détection et décompression immédiate d'un pneumothorax sous tension ou hémothorax massif.<br>• <strong>C (Circulation) :</strong> Pose de 2 VVP gros calibre, ceinture pelvienne pour fracture du bassin, garrot hémostatique de membre si saignement externe artériel.<br>• <strong>D (Disability) :</strong> Score de Glasgow, pupilles (asymétrie/mydriase).<br>• <strong>E (Exposure) :</strong> Déshabillage complet et réchauffement immédiat.", "rose")}
      {make_card("2. Principes de la Réanimation d'Hémostase", "• <strong>Acide tranexamique (Exacyl) :</strong> 1 g IV dans les 10 premières minutes puis 1 g sur 8h (à administrer < 3h après le trauma).<br>• <strong>Transfusion massive au ratio 1:1:1 :</strong> 1 Culot de Globules Rouges (CGR) pour 1 Plasma Frais Congelé (PFC) pour 1 Culot Plaquettaire.<br>• <strong>Hypotension permissive :</strong> Tolérer une PAS entre 80-90 mmHg (sauf traumatisme crânien où la PAS doit rester > 100-110 mmHg).", "emerald")}
    </div>
    {make_alert("L'Examen Clé : Body-Scanner Total (Pan-Scanner)", "Dès stabilisation hémodynamique initiale, réalisation d'un scanner corps entier injecté (crâne, rachis, thorax, abdomen, bassin) : permet un bilan lésionnel exhaustif en moins de 10 minutes.")}
    """,
    pitfalls=[
        "Tout traumatisé grave est considéré porteur d'un traumatisme instable du rachis cervical jusqu'à preuve radiologique formelle (maintien rigide de l'axe tête-cou-tronc).",
        "La perfusion intempestive de litres de sérum physiologique glacé aggrave la triade létale par hémodilution des facteurs de coagulation et hypothermie.",
        "Une fracture du bassin en 'livre ouvert' peut séquestrer plusieurs litres de sang dans l'espace rétropéritonéal : la pose immédiate d'une sangle pelvienne compressive est salvatrice."
    ]
)

# 49. Syndrome des Loges Aigu
add_fiche(
    fid="fiche_urgence_syndrome_des_loges",
    slug="syndrome-des-loges-aigu-ischemie-aponevrotomie",
    title="Fiche Urgence : 49. Syndrome des Loges Aigu des Membres (Urgence < 6h)",
    spec_id="ortho",
    spec_name="Orthopédie & Traumatologie",
    cat="Urgence Orthopédique",
    read_time="5 min",
    takeaways=[
        "Hyperpression tissulaire à l'intérieur d'une loge ostéo-aponévrotique inextensible compromettant la microcirculation capillaire et nerveuse.",
        "Signe d'alerte n°1 précoce : DOULEUR disproportionnée par rapport aux lésions osseuses, intolérable, rebelle aux antalgiques majeurs de palier 3.",
        "Signe clinique pathognomonique : Tension ligneuse douloureuse de la loge musculaire avec douleur vive majorée par l'étirement passif des muscles.",
        "SEUL TRAITEMENT EFFICACE : Aponévrotomie décompressive de décharge chirurgicale de toutes les loges du membre en urgence absolue (< 6h)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Les 5 'P' du Syndrome des Loges", "• <strong>Pain (Douleur) :</strong> Précoce, insupportable, exacerbée à l'étirement passif (signe le plus sensible).<br>• <strong>Pressure (Pression) :</strong> Loge tendue comme du bois à la palpation.<br>• <strong>Paresthesia (Paresthésies) :</strong> Engourdissement cutané dans le territoire du nerf traversant la loge (atteinte ischémique nerveuse précoce dès 2h).<br>• <strong>Pallor (Pâleur) :</strong> Tardive.<br>• <strong>Pulselessness (Disparition du pouls) :</strong> SIGNE TRÈS TARDIF de nécrose avancée !", "amber")}
      {make_card("2. Mesure de Pression & Aponévrotomie", "• <strong>Mesure invasive :</strong> Pression intracompartimentale > 30 mmHg, ou Pression différentielle (PAD - Pression de loge) < 30 mmHg.<br>• <strong>Aponévrotomie de décharge :</strong> Incision cutanée et aponévrotique large de toutes les loges du membre (4 loges à la jambe, 3 loges à l'avant-bras) laissée ouverte avec pansement stérile gras.<br>• Fermeture différée ou greffe cutanée secondaire.", "rose")}
    </div>
    {make_alert("Le Piège Redoutable du Pouls Distal Présent", "La présence d'un pouls artériel distal perçu (radial ou tibial postérieur) N'ÉLIMINE PAS un syndrome des loges ! La pression dans la loge (35-45 mmHg) suffit à écraser les capillaires et les veinules tout en laissant passer l'onde de pouls artérielle systolique (120 mmHg).")}
    """,
    pitfalls=[
        "Attendre la disparition des pouls distaux pour intervenir conduit à l'amputation ou à des séquelles fonctionnelles motrices définitives (syndrome de Volkmann au membre supérieur).",
        "Ne jamais surélever le membre au-dessus du niveau du cœur en cas de syndrome des loges (la surélévation diminue la pression de perfusion artérielle et aggrave l'ischémie tissulaire).",
        "Tout plâtre ou pansement compressif circulaire doit être fendu immédiatement jusqu'à la peau sur toute sa longueur dès l'apparition d'une douleur inhabituelle."
    ]
)

# 50. Fracture Ouverte des Membres
add_fiche(
    fid="fiche_urgence_fracture_ouverte",
    slug="fracture-ouverte-des-membres-classification-gustilo",
    title="Fiche Urgence : 50. Fracture Ouverte des Membres (Gustilo-Anderson)",
    spec_id="ortho",
    spec_name="Orthopédie & Traumatologie",
    cat="Urgence Traumatologique",
    read_time="5 min",
    takeaways=[
        "Solution de continuité cutanée mettant en communication directe le foyer de fracture osseux avec le milieu extérieur septique.",
        "Risque majeur : Infection osseuse aiguë et chronique (Ostéomyélite, pseudarthrose septique) et gangrène gazeuse.",
        "Classification de Gustilo-Anderson (Type I < 1 cm, Type II 1-10 cm, Type III > 10 cm avec délabrement périosté).",
        "Trépied thérapeutique immédiat : Prophylaxie antitétanique + Antibioprophylaxie précoce (< 3h) + Parage chirurgical et fixation au bloc opératoire."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Classification de Gustilo-Anderson", "• <strong>Type I :</strong> Plaie punctiforme < 1 cm, propre, mécanisme du dedans au dehors, comminution minime.<br>• <strong>Type II :</strong> Plaie de 1 à 10 cm sans délabrement cutané extensif ni lambeau.<br>• <strong>Type III :</strong> Plaie > 10 cm avec délabrement majeur des parties molles, contusion périostée.<br>• <em>IIIa :</em> Couverture osseuse possible.<br>• <em>IIIb :</em> Os à nu nécessitant un lambeau de couverture.<br>• <em>IIIc :</em> Lésion artérielle réparable associée.", "blue")}
      {make_card("2. Prise en Charge d'Urgence", "1. <strong>Au déchocage :</strong> Nettoyage abondant au sérum physiologique stérile, pansement stérile protecteur (ne pas explorer au doigt !).<br>2. <strong>VAT-SAT :</strong> Vérification du statut vaccinal antitétanique.<br>3. <strong>Antibioprophylaxie IV précoce :</strong> Amoxicilline-Acide clavulanique 2g IV ou Céfazoline 2g IV (+ Gentamicine si Gustilo III ou contamination tellurique).<br>4. <strong>Chirurgie :</strong> Parage et fixation par Fixateur Externe.", "emerald")}
    </div>
    {make_alert("Règle Fondamentale : Pas d'Ostéosynthèse Interne Fermée dans le Type III", "Dans les fractures ouvertes de type III ou à forte contamination tellurique, le matériel d'ostéosynthèse interne (plaque vissée ou clou) est formellement proscrit en première intention en raison du risque de colonisation bactérienne immédiate : utiliser un Fixateur Externe de pontage.")}
    """,
    pitfalls=[
        "Le délai de réalisation du parage chirurgical et de l'administration des antibiotiques conditionne directement le taux de surinfection osseuse (règle des 6 heures).",
        "Ne jamais refermer primitivement sous tension une plaie traumatique contuse : préférer la cicatrisation dirigée ou le pansement à pression négative (VAC).",
        "Toujours rechercher et consigner par écrit l'état neurologique (sensibilité distale) et vasculaire (pouls distaux, TRC, Doppler) avant et après toute manœuvre de réduction."
    ]
)

print(f"Part 3 ready: {len(FICHES_PART3)} fiches loaded.")
