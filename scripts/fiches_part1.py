# -*- coding: utf-8 -*-
"""
Script to generate 50 Emergency Medicine Flash Fiches for AS-MEDIX
Organized by module with rich HTML matching the platform styling.
"""

import json
import os
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

# We will collect all 50 fiches in this array
FICHES_50 = []

def add_fiche(fid, slug, title, spec_id, spec_name, cat, read_time, takeaways, html_body, pitfalls):
    full_html = f"""
    <div class="space-y-6">
      {html_body}
      {make_pitfalls(pitfalls)}
    </div>
    """
    FICHES_50.append({
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
# MODULE 1: CARDIOLOGIE & VASCULAIRE (7 FICHES)
# ==============================================================================

# 1. SCA ST+
add_fiche(
    fid="fiche_urgence_sca_st_plus",
    slug="sca-st-plus-infarctus-myocarde-urgence",
    title="Fiche Urgence : 1. Syndrome Coronarien Aigu ST+ (Infarctus du Myocarde)",
    spec_id="cardio",
    spec_name="Cardiologie & Pathologies Vasculaires",
    cat="Urgence Cardiovasculaire",
    read_time="6 min",
    takeaways=[
        "ECG 12 dérivations réalisé et interprété en moins de 10 minutes (dérivations V7-V8-V9 et V3R-V4R systématiques).",
        "Sus-décalage de ST persistant ≥ 1 mm dans au moins 2 dérivations contiguës (≥ 2 mm en V2-V3) ou BBG récent.",
        "Angioplastie primaire (PCI) si délai premier contact médical - ballon < 120 min ; sinon Fibrinolyse IV immédiate < 10 min.",
        "Trithérapie initiale : Aspirine 250 mg IVD + Inhibiteur P2Y12 (Ticagrélor ou Prasugrel) + Anticoagulant (Héparine ou Enoxaparine)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Critères Diagnostiques ECG", "Sus-décalage du segment ST mesuré au point J, convexe vers le haut, persistant > 20 min dans ≥ 2 dérivations contiguës :<br>• V2-V3 : ≥ 2 mm (homme ≥ 40 ans), ≥ 2.5 mm (homme < 40 ans), ≥ 1.5 mm (femme).<br>• Autres dérivations : ≥ 1 mm.<br>• Miroir (sous-décalage) quasi-constant confirmant le diagnostic.", "rose")}
      {make_card("2. Stratégie de Revascularisation (ESC)", "• <strong>Délai < 120 min :</strong> Transfert direct en salle de cathétérisme pour Angioplastie Primaire.<br>• <strong>Délai > 120 min :</strong> Fibrinolyse IV immédiate (Ténectéplase ou Altéplase) dans les 10 min du diagnostic.<br>• En cas de fibrinolyse réussie : Coronarographie systématique entre H2 et H24.", "indigo")}
    </div>
    {make_alert("Traitement Médical Initial Immédiat (BASIC)", "• <strong>Charge Antiagrégante :</strong> Aspirine 150-300 mg PO/IVD + Ticagrélor 180 mg PO (ou Prasugrel 60 mg, ou Clopidogrel 600 mg).<br>• <strong>Anticoagulation :</strong> HNF bolus 70-100 UI/kg IVD ou Enoxaparine 0.5 mg/kg IVD.<br>• <strong>Analgésie :</strong> Morphine IV titrée si douleur intense.<br>• <em>Attention :</em> Pas de dérivés nitrés si IDM du ventricule droit (V3R-V4R) ou PAS < 90 mmHg !")}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("Topographie Coronaire", "• Antérieur étendu (V1 à V6, DI, aVL) : IVA.<br>• Inférieur (DII, DIII, aVF) : Artère coronaire droite (85%) ou Circonflexe.<br>• Postérieur ou Basal (V7, V8, V9) : Circonflexe ou IVP.<br>• Ventricule Droit (V3R, V4R) : Coronaire droite proximale.", "amber")}
      {make_card("Surveillance des Complications", "• Troubles du rythme ventriculaire (FV/TV) précoces.<br>• Choc cardiogénique (Killip IV).<br>• Complications mécaniques (rupture de pilier mitral, CIV post-infarctus, rupture de paroi libre).", "emerald")}
    </div>
    """,
    pitfalls=[
        "Tout sous-décalage ST en V1-V3 doit faire évoquer un infarctus postérieur : réaliser impérativement V7-V8-V9 !",
        "Devant tout IDM inférieur (DII, DIII, aVF), enregistrer immédiatement V3R et V4R pour éliminer une extension au Ventricule Droit.",
        "Dans l'infarctus du ventricule droit, les dérivés nitrés et les diurétiques sont strictement contre-indiqués (risque de collapsus sévère par baisse de précharge) ; le traitement repose sur le remplissage vasculaire au sérum salé 0.9%."
    ]
)

# 2. SCA ST-
add_fiche(
    fid="fiche_urgence_sca_st_moins",
    slug="sca-st-moins-angor-instable-urgence",
    title="Fiche Urgence : 2. Syndrome Coronarien Aigu ST- (NSTEMI & Angor Instable)",
    spec_id="cardio",
    spec_name="Cardiologie & Pathologies Vasculaires",
    cat="Urgence Cardiovasculaire",
    read_time="6 min",
    takeaways=[
        "Douleur angineuse prolongée (> 20 min au repos) sans sus-décalage persistant de ST à l'ECG.",
        "Dosage de Troponine ultra-sensible (hs-cTn) avec protocole rapide H0/H1 ou H0/H2.",
        "Stratification du risque ischémique par le score GRACE pour décider du délai de la coronarographie.",
        "Coronarographie immédiate (< 2h) si instabilité hémodynamique, choc, récidive douloureuse réfractaire ou TV."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Présentation & Anomalies ECG", "• Douleur thoracique rétrosternale constrictive de repos ou crescendo.<br>• ECG : Normal dans 30% des cas, ou sous-décalage du segment ST ≥ 0.5 mm, ou inversion profonde et symétrique des ondes T (> 1 mm).<br>• Répéter l'ECG à H1, H3 et lors de toute récidive douloureuse.", "blue")}
      {make_card("2. Stratification du Délai Coronarographique (ESC)", "• <strong>Très haut risque (< 2h) :</strong> Instabilité hémodynamique, choc, OAP, douleur réfractaire, TV soutenue.<br>• <strong>Haut risque (< 24h) :</strong> Score GRACE > 140, cinétique positive de troponine, sous-décalage dynamique de ST.<br>• <strong>Bas risque :</strong> Bilan non invasif (angio-TDM coronaire, épreuve d'effort/IRM).", "purple")}
    </div>
    {make_alert("Prise en Charge Thérapeutique Immédiate", "• <strong>Antiagrégant :</strong> Aspirine 150-300 mg PO/IVD immédiatement. Deuxième antiagrégant (Ticagrélor ou Prasugrel) discuté au moment de la coronarographie pour éviter de bloquer une éventuelle chirurgie de pontage.<br>• <strong>Anticoagulation :</strong> Fondaparinux 2.5 mg/j SC (meilleur ratio efficacité/saignement) ou Énoxaparine 1 mg/kg x 2/j SC.<br>• Bêtabloquant oral (Bisoprolol) précoce si absence d'insuffisance cardiaque aiguë.")}
    """,
    pitfalls=[
        "Un ECG strictement normal n'élimine JAMAIS un SCA ST- ! Seule la cinétique de la troponine ultra-sensible permet d'exclure le diagnostic.",
        "Dans le SCA ST-, le Fondaparinux est la molécule de choix car il réduit la mortalité et les saignements majeurs comparé à l'énoxaparine.",
        "Le Prasugrel ne doit JAMAIS être administré en prétraitement avant que l'anatomie coronaire ne soit connue à la coronarographie."
    ]
)

# 3. OAP Cardiogénique
add_fiche(
    fid="fiche_urgence_oap_cardiogenique",
    slug="oedeme-aigu-poumon-oap-cardiogenique",
    title="Fiche Urgence : 3. Œdème Aigu du Poumon Cardiogénique (OAP)",
    spec_id="cardio",
    spec_name="Cardiologie & Pathologies Vasculaires",
    cat="Urgence Cardiovasculaire",
    read_time="5 min",
    takeaways=[
        "Polypnée brutale angoissante avec orthopnée majeure, râles crépitants 'en marée montante' et grésillement laryngé.",
        "Trépied thérapeutique immédiat : Dérivés nitrés IV (Isocet) + Diurétiques de l'anse IV (Furosémide) + VNI (CPAP).",
        "Position assise jambes pendantes pour diminuer le retour veineux.",
        "Échocardiographie (ETT) en urgence pour identifier la cause (SCA, poussée hypertensive, valvulopathie aiguë)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Signes de Gravité Immédiats", "• Cyanose, sueurs profuses, SaO2 < 85%.<br>• Épuisement respiratoire : bradypnée, respiration paradoxale thoraco-abdominale.<br>• Signes d'hypoperfusion : marbrures, oligurie, confusion.<br>• Pression artérielle : collapsus (PAS < 90 mmHg = choc cardiogénique !).", "rose")}
      {make_card("2. Conduite Thérapeutique d'Urgence", "1. <strong>Position assise</strong> stricte, jambes pendantes au bord du lit.<br>2. <strong>Oxygénothérapie :</strong> Cible SpO2 92-96% (88-92% chez le BPCO).<br>3. <strong>VNI (CPAP de Boussignac / PEP) :</strong> Pression 5-10 cmH2O dès l'admission.<br>4. <strong>Furosémide :</strong> 40 à 80 mg IVD (ou 2x la dose quotidienne orale).<br>5. <strong>Dinitrate d'isosorbide (Isocet) :</strong> 1 à 3 mg/h IVSE si PAS > 110 mmHg.", "emerald")}
    </div>
    {make_alert("Divergence Thérapeutique Fondamentale", "• Si PAS > 110 mmHg (OAP hypertensif) : Les <strong>dérivés nitrés IV</strong> sont le traitement roi (vasodilatation artérielle et veineuse rapide).<br>• Si PAS < 90 mmHg (OAP avec choc cardiogénique) : Contre-indication formelle aux dérivés nitrés ! Recours immédiat aux inotropes positifs (Dobutamine 5-20 mcg/kg/min IVSE) et Noradrénaline.")}
    """,
    pitfalls=[
        "Ne jamais prescrire de dérivés nitrés si la PAS est inférieure à 100 mmHg ou en cas de prise récente d'inhibiteurs de la PDE-5 (Viagra/Cialis).",
        "La VNI précoce réduit le recours à l'intubation trachéale de plus de 50% et diminue la mortalité intrahospitalière.",
        "Toujours rechercher un facteur déclenchant : poussée d'HTA, rupture de traitement diurétique, fibrillation atriale rapide, ischémie myocardique aiguë."
    ]
)

# 4. Dissection Aortique
add_fiche(
    fid="fiche_urgence_dissection_aortique",
    slug="dissection-aortique-aigue-urgence",
    title="Fiche Urgence : 4. Dissection Aortique Aiguë",
    spec_id="cardio",
    spec_name="Cardiologie & Pathologies Vasculaires",
    cat="Urgence Cardiovasculaire",
    read_time="6 min",
    takeaways=[
        "Douleur thoracique brutale, déchirante, migratrice, irradiant dans le dos et entre les omoplates.",
        "Asymétrie tensionnelle (> 20 mmHg entre les deux bras) et abolition d'un pouls périphérique.",
        "Classification de Stanford : Type A (aorte ascendante = chirurgie immédiate) vs Type B (aorte descendante = médical).",
        "Examen diagnostique de référence : Angioscanner aortique (aorte thoraco-abdomino-pelvienne) en urgence."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Classification de Stanford", "• <strong>Stanford A (65%) :</strong> Touche l'aorte ascendante (avec ou sans l'aorte descendante). Risque mortel de rupture péricardique (tamponnade), d'insuffisance aortique aiguë et d'occlusion coronaire.<br>• <strong>Stanford B (35%) :</strong> Limité à l'aorte descendante en aval de l'artère sous-clavière gauche.", "purple")}
      {make_card("2. Prise en Charge Médicale Initiale", "Objectif hémodynamique strict :<br>• <strong>Fréquence cardiaque cible :</strong> < 60 bpm.<br>• <strong>PAS cible :</strong> 100-120 mmHg.<br>• Bêtabloquant IV d'action rapide : Esmolol (Brevibloc) ou Labétalol (Trandate) IVSE en première intention.<br>• Vasodilatateur (Nicardipine) ajouté UNIQUEMENT après blocage bêta.", "indigo")}
    </div>
    {make_alert("Piège Vital : Ne Jamais Vasodilater Seul !", "L'administration d'un vasodilatateur pur (Nicardipine) sans bêtabloquant préalable provoque une tachycardie réflexe et augmente la contrainte de cisaillement pariétal aortique (dP/dt), accélérant la propagation et la rupture de la dissection !")}
    """,
    pitfalls=[
        "Toute suspicion de dissection aortique contre-indique formellement les anticoagulants, les antiagrégants et la fibrinolyse (risque de rupture cataclysmique) !",
        "L'angioscanner aortique avec injection au temps artériel précoce est l'examen de choix ; l'ETO n'est réalisée qu'en cas d'instabilité extrême au déchocage.",
        "La présence d'un souffle diastolique d'insuffisance aortique de novo associé à une douleur thoracique rétro-dorsale signe une dissection de type A."
    ]
)

# 5. Tamponnade Péricardique
add_fiche(
    fid="fiche_urgence_tamponnade",
    slug="tamponnade-pericardique-aigue-urgence",
    title="Fiche Urgence : 5. Tamponnade Péricardique Aiguë",
    spec_id="cardio",
    spec_name="Cardiologie & Pathologies Vasculaires",
    cat="Urgence Cardiovasculaire",
    read_time="5 min",
    takeaways=[
        "Choc obstructif par compression des cavités droites par un épanchement péricardique abondant ou d'installation rapide.",
        "Triade classique de Beck : Hypotension artérielle + Turgescence des veines jugulaires + Assourdissement des bruits du cœur.",
        "Pouls paradoxal de Kussmaul (baisse de la PAS > 10 mmHg à l'inspiration spontanée).",
        "Traitement salvateur : Ponction péricardique sous-xiphoïdienne d'évacuation (ou drainage chirurgical)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Signes Cliniques & ECG", "• <strong>Triade de Beck :</strong> Hypotension, turgescence jugulaire majeure (avec reflux hépato-jugulaire), bruits du cœur lointains.<br>• <strong>ECG :</strong> Microvoltage diffus (< 5 mm dans les dérivations frontales) et alternance électrique du QRS (variations de l'axe battement après battement).<br>• Tachycardie sinusale compensatrice constante.", "rose")}
      {make_card("2. Échocardiographie (ETT) Immédiate", "Examen clé au lit du malade :<br>• Épanchement circonférentiel abondant.<br>• Collapsus télé-diastolique de l'oreillette droite puis du ventricule droit.<br>• Dilatation majeure de la veine cave inférieure (sans collapsus inspiratoire).<br>• Variations respiratoires excessives des flux transmitral (> 25%) et transtricuspide (> 40%).", "blue")}
    </div>
    {make_alert("Mesures Réanimatoires Vitales", "• <strong>Remplissage vasculaire massif</strong> par cristalloïdes (NaCl 0.9%) pour maintenir la précharge ventriculaire droite.<br>• <strong>Contre-indication absolue :</strong> Diurétiques et vasodilatateurs (effondrent le retour veineux et entraînent l'arrêt cardiaque immédiat) !<br>• Éviter la ventilation mécanique en pression positive si possible (aggrave la chute du retour veineux).")}
    """,
    pitfalls=[
        "Ne jamais donner de diurétique à un patient suspect de tamponnade péricardique !",
        "La ponction péricardique d'urgence se fait par voie sous-xiphoïdienne (aiguille orientée vers l'épaule gauche à 45° sous contrôle échographique continu).",
        "L'alternance électrique à l'ECG est quasi pathognomonique du cœur oscillant (swinging heart) dans la cavité péricardique inondée."
    ]
)

# 6. Fibrillation Atriale Rapide
add_fiche(
    fid="fiche_urgence_fa_rapide",
    slug="fibrillation-atriale-rapide-mal-toleree",
    title="Fiche Urgence : 6. Fibrillation Atriale Rapide Mal Tolérée",
    spec_id="cardio",
    spec_name="Cardiologie & Pathologies Vasculaires",
    cat="Urgence Cardiovasculaire",
    read_time="5 min",
    takeaways=[
        "Tachyarythmie supraventriculaire désorganisée avec rythme ventriculaire irrégulièrement irrégulier > 130-150 bpm.",
        "Si instabilité hémodynamique (choc, OAP, angor) : Cardioversion électrique synchronisée immédiate (100-200 Joules).",
        "Si stabilité : Ralentissement de la fréquence ventriculaire (Bêtabloquant IV ou Amiodarone IV).",
        "Anticoagulation précoce indispensable selon le score CHA2DS2-VASc."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Évaluation de la Tolérance", "• <strong>Critères d'instabilité :</strong> Hypotension (PAS < 90 mmHg), OAP floride, angor réfractaire, altération de la conscience.<br>• Si instable = Urgence vitale : <strong>Choc Électrique Externe (CEE) synchronisé</strong> sous sédation courte + bolus d'Héparine IV.<br>• Si stable = Stratégie de contrôle de la fréquence cardiaque (Rate control).", "amber")}
      {make_card("2. Médicaments Ralentisseurs", "• <strong>Fonction VG préservée :</strong> Bêtabloquant IV (Métoprolol 2.5-5 mg IVD) ou Vérapamil/Diltiazem.<br>• <strong>Altération FEVG / Insuffisance cardiaque :</strong> Amiodarone 300 mg IV sur 30 min puis 900 mg/24h, ou Digoxine IV lente.<br>• Objectif initial : FC < 110 bpm au repos.", "emerald")}
    </div>
    {make_alert("Règle des 48 Heures pour la Cardioversion d'un Patient Stable", "Si la FA évolue depuis plus de 48 heures (ou durée indéterminée), la cardioversion immédiate est contre-indiquée en dehors de l'urgence vitale en raison du risque d'embolie systémique. Deux options : anticoagulation efficace pendant 3 semaines avant CEE, ou Échocardiographie Transœsophagienne (ETO) pour éliminer formellement un thrombus de l'auricule gauche.")}
    """,
    pitfalls=[
        "Toujours synchroniser le défibrillateur sur l'onde R pour la cardioversion de la FA afin d'éviter de déclencher une fibrillation ventriculaire (phénomène R-sur-T).",
        "Ne jamais administrer d'inhibiteur calcique bradycardisant (Vérapamil/Diltiazem) si la FEVG est altérée ou chez un patient en OAP.",
        "En cas de FA pré-excitée sur syndrome de Wolff-Parkinson-White, l'amiodarone, la digoxine et les inhibiteurs calciques sont contre-indiqués (favorisent la conduction par la voie accessoire avec risque de FV) ; le traitement est le CEE ou l'Ibutilide."
    ]
)

# 7. ACR & Rythmes Chocables (TV/FV)
add_fiche(
    fid="fiche_urgence_acr_tv_fv",
    slug="arret-cardio-respiratoire-acr-tv-fv",
    title="Fiche Urgence : 7. Arrêt Cardio-Respiratoire (ACR) : Rythmes Chocables",
    spec_id="cardio",
    spec_name="Cardiologie & Pathologies Vasculaires",
    cat="Urgence Cardiovasculaire",
    read_time="6 min",
    takeaways=[
        "Reconnaissance immédiate : Inconscience + Absence de respiration normale (gasps) + Absence de pouls carotidien (< 10s).",
        "Rythmes chocables : Fibrillation Ventriculaire (FV) et Tachycardie Ventriculaire sans pouls (TV).",
        "Compressions thoraciques continues de haute qualité : 100-120/min, profondeur 5-6 cm, ratio 30:2.",
        "Défibrillation précoce : 1er choc à 150-200 Joules biphasiques, reprise immédiate du MCE sans interruption."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Algorithme des Rythmes Chocables", "• <strong>Choc 1 :</strong> 150-200 J biphasique -> MCE 2 minutes.<br>• <strong>Choc 2 :</strong> 200 J -> MCE 2 minutes.<br>• <strong>Choc 3 :</strong> 200 J -> <strong>Adrénaline 1 mg IVD</strong> + <strong>Amiodarone 300 mg IVD</strong> (diluée dans du G5%).<br>• <strong>Choc 5 :</strong> Répéter Adrénaline 1 mg + 2ème dose Amiodarone 150 mg IVD.<br>• Adrénaline répétée ensuite toutes les 3 à 5 minutes (un cycle sur deux).", "rose")}
      {make_card("2. Qualité des Compressions (ERC 2025)", "• Fréquence : 100 à 120 compressions par minute.<br>• Profondeur : 5 à 6 cm chez l'adulte.<br>• Relâchement thoracique complet entre chaque compression.<br>• Minimiser au maximum les interruptions de massage (< 5 secondes lors des chocs).<br>• Relais des masseurs toutes les 2 minutes pour éviter l'épuisement.", "indigo")}
    </div>
    {make_alert("Recherche Systématique des Causes Réversibles (Les 4H et 4T)", "• <strong>4 H :</strong> Hypoxie, Hypovolémie, Hypo/Hyperkaliémie & désordres métaboliques, Hypothermie.<br>• <strong>4 T :</strong> Thrombose coronaire (SCA) ou pulmonaire (EP), Tamponnade péricardique, Tension (Pneumothorax suffocant), Toxiques.")}
    """,
    pitfalls=[
        "Ne jamais vérifier le pouls ou analyser le rythme immédiatement après la délivrance du choc électrique : reprendre immédiatement le MCE pour 2 minutes entières !",
        "Dans les rythmes chocables (FV/TV), l'adrénaline n'est injectée qu'APRÈS le 3ème choc (et non au début comme dans l'asystolie).",
        "En cas d'asystolie ou de dissociation électromécanique (rythmes NON chocables) : Adrénaline 1 mg IVD immédiatement dès la pose de la voie veineuse."
    ]
)

# ==============================================================================
# MODULE 2: PNEUMOLOGIE (6 FICHES)
# ==============================================================================

# 8. Embolie Pulmonaire Grave
add_fiche(
    fid="fiche_urgence_embolie_pulmonaire_grave",
    slug="embolie-pulmonaire-grave-choc-urgence",
    title="Fiche Urgence : 8. Embolie Pulmonaire à Haut Risque (Choc & Gravité)",
    spec_id="pneumo",
    spec_name="Pneumologie",
    cat="Urgence Respiratoire",
    read_time="6 min",
    takeaways=[
        "Définition de l'EP à haut risque : Présence d'un état de choc cardiogénique ou d'une hypotension persistante (PAS < 90 mmHg).",
        "Échocardiographie au lit du malade : Dilatation du VD, septum paradoxal, rapport VD/VG > 1, signe de McConnell.",
        "Traitement de première intention : Fibrinolyse systémique immédiate (rtPA / Altéplase 100 mg sur 2h).",
        "Anticoagulation par Héparine Non Fractionnée (HNF) IV débutée dès la suspicion diagnostique."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Stratification Pronostique ESC", "• <strong>Haut risque :</strong> Choc / Hypotension persistante (mortalité > 15-30%).<br>• <strong>Risque intermédiaire-élevé :</strong> Normotendu mais dysfonction VD à l'ETT/scanner ET Troponine élevée.<br>• <strong>Risque intermédiaire-faible :</strong> Un seul des deux marqueurs positif.<br>• <strong>Bas risque :</strong> Score sPESI = 0, pas de dysfonction VD ni biomarqueurs.", "rose")}
      {make_card("2. Protocole de Fibrinolyse Systémique", "• <strong>Altéplase (rtPA) :</strong> 100 mg IV perfusé sur 2 heures (ou 0.6 mg/kg sur 15 min en cas d'ACR imminent).<br>• <strong>HNF concomitante :</strong> Bolus 80 UI/kg puis perfusion continue 18 UI/kg/h ciblée sur TCA 2 à 2.5.<br>• Si contre-indication absolue à la thrombolyse : Embolectomie chirurgicale ou thrombectomie percutanée.", "blue")}
    </div>
    {make_alert("Remplissage Vasculaire Restrictif", "Dans l'EP massive, le ventricule droit est en faillite aiguë. Un remplissage excessif aggrave la dilatation ventriculaire droite et majore la compression du VG (septum paradoxal). Limiter le remplissage à 500 mL de sérum salé 0.9% sur 15-30 min ; introduire précocement la Noradrénaline pour restaurer la pression de perfusion coronaire droite.")}
    """,
    pitfalls=[
        "Ne jamais attendre le résultat de l'angioscanner thoracique pour débuter l'héparine chez un patient suspect d'EP en détresse !",
        "Chez le patient en arrêt cardiorespiratoire sur suspicion d'EP massive, la fibrinolyse IV en bolus est indiquée et la réanimation cardio-pulmonaire doit être poursuivie pendant au moins 60 à 90 minutes.",
        "Le dosage des D-Dimères n'a AUCUNE indication chez un patient avec probabilité clinique forte ou en état de choc (inutile et retarde la prise en charge)."
    ]
)

# 9. Asthme Aigu Grave (AAG)
add_fiche(
    fid="fiche_urgence_asthme_aigu_grave",
    slug="asthme-aigu-grave-aag-reanimation",
    title="Fiche Urgence : 9. Asthme Aigu Grave (AAG / Exacerbation Sévère)",
    spec_id="pneumo",
    spec_name="Pneumologie",
    cat="Urgence Respiratoire",
    read_time="6 min",
    takeaways=[
        "Signes d'extrême gravité : Silence auscultatoire, parole impossible, bradypnée, cyanose, sueurs, pouls paradoxal.",
        "DEP (Débit Expiratoire de Pointe) < 30-50% de la valeur théorique ou du meilleur score personnel.",
        "Nébulisations répétées en continu de Bêta-2 mimétiques (Salbutamol 5 mg) + Anticholinergique (Ipratropium 0.5 mg) sous O2.",
        "Corticothérapie systémique précoce (Méthylprednisolone 1 mg/kg IV) + Sulfate de Magnésium IV."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Signes de Faillite Respiratoire", "• <strong>Cliniques :</strong> Thorax bloqué distendu, silence auscultatoire complet (danger de mort imminente !), sueurs, agitation puis somnolence.<br>• <strong>Hémodynamiques :</strong> Tachycardie > 120 bpm, pouls paradoxal > 20 mmHg, collapsus.<br>• <strong>Gazométrie :</strong> Une PaCO2 normale ou élevée (> 40 mmHg) traduit un épuisement diaphragmatique sévère.", "rose")}
      {make_card("2. Schéma Thérapeutique Progressif", "1. <strong>Oxygène :</strong> Débit 6-8 L/min pour SpO2 93-95%.<br>2. <strong>Nébulisation sous 6-8 L/min O2 :</strong> Salbutamol 5 mg + Ipratropium 0.5 mg toutes les 20 min pendant 1h.<br>3. <strong>Corticothérapie IV :</strong> Méthylprednisolone 1 mg/kg IVD d'emblée.<br>4. <strong>Sulfate de Magnésium :</strong> 2 g IV sur 20 minutes.<br>5. <strong>Adrénaline SC/IV titrée :</strong> Si collapsus ou bronchospasme asphyxique rebelle.", "emerald")}
    </div>
    {make_alert("Gazométrie : Le Piège de la Normocapnie", "Au début de la crise d'asthme, l'hyperventilation entraîne une hypocapnie profonde (PaCO2 < 35 mmHg). Une PaCO2 qui 'se normalise' ou augmente chez un asthmatique en crise traduit l'épuisement musculaire respiratoire et annonce l'arrêt respiratoire imminent !")}
    """,
    pitfalls=[
        "Ne jamais administrer de sédatifs ou d'anxiolytiques chez un patient en crise d'asthme aigu (facteur majeur de décès par arrêt respiratoire) !",
        "L'intubation orotrachéale dans l'AAG est grevée d'une lourde morbi-mortalité (barotraumatisme, collapsus de reventilation) ; elle est réservée à l'arrêt respiratoire avéré ou au coma.",
        "Le silence auscultatoire chez un dyspnéique n'est pas un signe d'amélioration, mais le témoin d'une obstruction bronchique quasi totale."
    ]
)

# 10. Décompensation BPCO
add_fiche(
    fid="fiche_urgence_decompensation_bpco",
    slug="decompensation-aigue-bpco-acidose-respiratoire",
    title="Fiche Urgence : 10. Décompensation Aiguë de BPCO & Acidose Respiratoire",
    spec_id="pneumo",
    spec_name="Pneumologie",
    cat="Urgence Respiratoire",
    read_time="5 min",
    takeaways=[
        "Aggravation aiguë de la dyspnée, de la toux et du volume/purulence de l'expectoration (critères d'Anthonisen).",
        "Gazométrie artérielle en air ambiant indispensable : Acidose respiratoire hypercapnique (pH < 7.35, PaCO2 > 45 mmHg).",
        "Ventilation Non Invasive (VNI mode BiPAP) : Traitement de référence en cas d'acidose respiratoire décompensée.",
        "Objectif d'oxygénothérapie très strict : SpO2 88-92% (risque d'hypoventilation alvéolaire majeure sous fort débit)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Indications de la VNI (BiPAP)", "La VNI est indiquée en urgence si :<br>• Acidose respiratoire avec <strong>pH < 7.35</strong> et <strong>PaCO2 > 45 mmHg</strong> persistant malgré le traitement médical initial bien conduit.<br>• Réduit la mortalité, le recours à l'intubation et les infections nosocomiales.<br>• Évaluation du gaz du sang à H1-H2 de VNI.", "purple")}
      {make_card("2. Conduite Médicale Systématique", "• <strong>Oxygénothérapie contrôlée :</strong> Lunettes à débit adapté (1-2 L/min) pour SpO2 cible 88-92%.<br>• <strong>Bronchodilatateurs nébulisés :</strong> Bêta-2 mimétiques + Ipratropium.<br>• <strong>Corticothérapie :</strong> Prednisone 40 mg/j PO pendant 5 jours.<br>• <strong>Antibiotiques :</strong> Indiqués si crachats verdâtres (Anthonisen I) : Augmentin ou Macrolide ou C3G.", "blue")}
    </div>
    {make_alert("Danger Mortel : L'Oxygène à Fort Débit", "L'administration intempestive d'oxygène à fort débit chez le patient BPCO supprime le stimulus hypoxique de la commande ventilatoire centrale, augmente l'effet espace mort et conduit au coma hypercapnique d'inondation.")}
    """,
    pitfalls=[
        "Ne jamais viser une SpO2 à 98-100% chez un insuffisant respiratoire chronique hypercapnique (SpO2 cible = 88 à 92%).",
        "Contre-indications de la VNI : Coma profond (GCS < 8), arrêt cardiorespiratoire, instabilité hémodynamique sévère, vomissements incoercibles, vomiques.",
        "Toujours réaliser une radiographie pulmonaire au lit du malade pour éliminer un pneumothorax ou une atélectasie par encombrement."
    ]
)

# 11. Pneumothorax Compressif Sous Tension
add_fiche(
    fid="fiche_urgence_pneumothorax_compressif",
    slug="pneumothorax-compressif-sous-tension-urgence",
    title="Fiche Urgence : 11. Pneumothorax Compressif Sous Tension",
    spec_id="pneumo",
    spec_name="Pneumologie",
    cat="Urgence Thoracique",
    read_time="4 min",
    takeaways=[
        "Mécanisme à soupape créant une hyperpression intra-thoracique avec déviation médiastinale et collapsus des veines caves.",
        "Diagnostic 100% CLINIQUE en détresse vitale : Tympanisme unilatéral + Abolition du MV + Turgescence jugulaire + Hypotension.",
        "INTERDICTION ABSOLUE d'attendre la radiographie pulmonaire !",
        "Geste salvateur immédiat : Décompression à l'aiguille (angiocathéter 14G ou 16G) puis drainage thoracique."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Triade Clinique d'Urgence", "• <strong>Syndrome d'épanchement gazeux :</strong> Asymétrie thoracique, tympanisme percuté, abolition du murmure vésiculaire et des vibrations vocales.<br>• <strong>Retentissement hémodynamique :</strong> Choc obstructif, turgescence jugulaire bilatérale, tachycardie, déviation trachéale controlatérale.<br>• Emphysème sous-cutané cervical fréquent.", "rose")}
      {make_card("2. Technique de Décompression Immédiate", "• <strong>Sites recommandés (ATLS) :</strong><br>1. 2ème Espace Intercostal sur la ligne médio-claviculaire au bord supérieur de la côte inférieure.<br>2. Ou 4ème/5ème Espace Intercostal sur la ligne axillaire antérieure.<br>• Insertion d'un cathéter de gros calibre (14-16G) : biseautage avec issue immédiate d'un souffle d'air sous pression confirmant la réussite.<br>• Pose d'un drain thoracique au bocal ensuite.", "emerald")}
    </div>
    {make_alert("Erreur Fatale au Concours & en Garde", "Demander une radiographie pulmonaire ou un scanner chez un patient présentant un pneumothorax suffocant en état de choc est une faute médicale lourde. Le patient fera un arrêt cardiaque en salle de radiologie !")}
    """,
    pitfalls=[
        "Le diagnostic de pneumothorax compressif sous tension est exclusivement clinique : la décompression à l'aiguille prime sur tout examen d'imagerie.",
        "Toujours piquer au bord supérieur de la côte inférieure pour éviter de léser le paquet vasculo-nerveux intercostal sous-costal.",
        "Chez un patient ventilé au respirateur sous pression positive, l'apparition d'une hypotension brutale avec hausse des pressions d'insufflation doit faire évoquer un pneumothorax sous tension bilatéral."
    ]
)

# 12. Hémoptysie Massive
add_fiche(
    fid="fiche_urgence_hemoptysie_massive",
    slug="hemoptysie-massive-urgence-asphyxique",
    title="Fiche Urgence : 12. Hémoptysie Massive (> 100-200 mL / 24h)",
    spec_id="pneumo",
    spec_name="Pneumologie",
    cat="Urgence Respiratoire",
    read_time="5 min",
    takeaways=[
        "Rejet par la bouche de sang rouge vif aéré lors d'un effort de toux : le risque principal est l'ASPHYXIE par inondation bronchique.",
        "Décubitus latéral strict du CÔTÉ DU SAIGNEMENT (pour préserver le poumon sain sous-jacent).",
        "Perfusion d'agents vasoconstricteurs (Terlipressine) et acide tranexamique IV.",
        "Angio-TDM thoracique pour repérer les artères bronchiques hypertrophiées, suivi d'Embolisation artérielle bronchique."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Mesures de Réanimation Immédiates", "• <strong>Positionnement :</strong> Demi-assis ou décubitus latéral du côté supposé saignant.<br>• <strong>Libération des voies aériennes :</strong> Oxygène à fort débit, aspiration au lit du malade.<br>• <strong>Fibroscopie bronchique souple :</strong> Au lit du malade, permet d'aspirer les caillots, localiser l'origine et instiller du sérum glacé adrénaliné.<br>• Arrêt immédiat de tout traitement anticoagulant ou antiagrégant.", "indigo")}
      {make_card("2. Traitements Hémostatiques & Vasculaires", "• <strong>Acide tranexamique (Exacyl) :</strong> 1 g IV sur 15 min puis 1 g toutes les 8h.<br>• <strong>Terlipressine (Glypressine) :</strong> 1 à 2 mg IVL si absence de coronaropathie.<br>• <strong>Embolisation artérielle bronchique :</strong> Traitement de référence en radiologie interventionnelle en cas de persistance du saignement.<br>• Chirurgie d'hémostase (résection) en dernier recours si échec.", "purple")}
    </div>
    {make_alert("Gravité de l'Hémoptysie : Volume vs Terrains", "L'hémoptysie est dite grave dès 100 à 200 mL en un seul jet, ou dès le moindre saignement chez un patient respiratoire précaire (BPCO, séquelles de tuberculose, DDB) par risque d'inondation de l'arbre respiratoire.")}
    """,
    pitfalls=[
        "Le patient qui décède d'une hémoptysie meurt asphyxié et noyé dans son propre sang, et non de spoliation sanguine hémodynamique !",
        "En cas d'intubation trachéale d'extrême urgence, utiliser une sonde sélective de Carlens ou réaliser une intubation sélective du poumon sain.",
        "La principale étiologie en Algérie et au Maghreb reste la séquelle de tuberculose pulmonaire (aspergillome sur cavité résiduelle et bronchectasies)."
    ]
)

# 13. Pneumonie Franche Lobaire Aiguë Grave
add_fiche(
    fid="fiche_urgence_pneumonie_grave",
    slug="pneumonie-aigue-communautaire-grave-crb65",
    title="Fiche Urgence : 13. Pneumonie Aiguë Communautaire Grave (PFLA / Sepsis)",
    spec_id="pneumo",
    spec_name="Pneumologie",
    cat="Urgence Respiratoire",
    read_time="5 min",
    takeaways=[
        "Triade début brutal : Frisson solennel unique + Fièvre > 39-40°C + Point de côté thoracique et expectorations rouillées (Pneumocoque).",
        "Évaluation de la gravité au premier regard : Scores CRB-65 (en ambulatoire) et CURB-65 / Pneumonia Severity Index (PSI).",
        "Signes d'hospitalisation en réanimation : Choc septique nécessitant vasopresseurs ou nécessité de ventilation mécanique.",
        "Antibiothérapie probabiliste d'urgence dans les 4h : C3G IV (Ceftriaxone 2g) + Macrolide IV (Spiramycine ou Clarithromycine)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Score CRB-65 (1 point par item)", "• <strong>C :</strong> Confusion mentale.<br>• <strong>R :</strong> Fréquence respiratoire ≥ 30/min.<br>• <strong>B :</strong> Pression artérielle basse (PAS < 90 ou PAD ≤ 60 mmHg).<br>• <strong>65 :</strong> Âge ≥ 65 ans.<br><em>Score 0 :</em> Traitement à domicile.<br><em>Score ≥ 1 :</em> Hospitalisation requise.<br><em>Score ≥ 2 :</em> Hospitalisation impérative, envisager soins intensifs.", "blue")}
      {make_card("2. Schémas Antibiotiques Recommandés", "• <strong>En hospitalisation conventionnelle :</strong> Amoxicilline-Acide clavulanique 1g x 3/j IV ou Céfotaxime 1g x 3/j (ou Ceftriaxone 1g/j) +/- Macrolide.<br>• <strong>En Réanimation / USI :</strong> Céfotaxime 2g x 3/j IV (ou Ceftriaxone 2g/j) + Lévofloxacine 500 mg x 2/j IV ou Clarithromycine 500 mg x 2/j IV (couverture Légionelle + Pneumocoque de sensibilité diminuée).", "emerald")}
    </div>
    {make_alert("Antigénuries Solubles en Urgence", "Chez tout patient hospitalisé pour PAC grave, réaliser immédiatement l'antigénurie Légionelle sérogroupe 1 et l'antigénurie Pneumocoque dans les urines avant ou en parallèle de la première injection d'antibiotique.")}
    """,
    pitfalls=[
        "Le délai de la première dose d'antibiothérapie doit être inférieur à 4 heures (inférieur à 1h en cas de sepsis ou choc septique).",
        "Une radiographie thoracique normale au début de la maladie ne récuse pas le diagnostic si la déshydratation est majeure (foyer apparaissant après réhydratation).",
        "L'amoxicilline seule ne couvre pas les bactéries intracellulaires (Legionella pneumophila, Mycoplasma pneumoniae) : association indispensable dans les formes graves."
    ]
)

# ==============================================================================
# MODULE 3: NEUROLOGIE (6 FICHES)
# ==============================================================================

# 14. AVC Ischémique Aigu
add_fiche(
    fid="fiche_urgence_avc_ischemique",
    slug="avc-ischemique-aigu-thrombolyse-thrombectomie",
    title="Fiche Urgence : 14. Accident Vasculaire Cérébral Ischémique Aigu",
    spec_id="neuro",
    spec_name="Neurologie",
    cat="Neuro-Urgence",
    read_time="6 min",
    takeaways=[
        "Déficit neurologique focal d'installation brutale : FAST (Face, Arm, Speech, Time).",
        "Imagerie cérébrale immédiate : IRM cérébrale (Diffusion/FLAIR/T2*/3D TOF) en 1ère intention ou TDM sans injection.",
        "Fibrinolyse intraveineuse par rtPA (Altéplase 0.9 mg/kg) éligible jusqu'à 4h30 après le début des symptômes.",
        "Thrombectomie mécanique par voie endovasculaire jusqu'à 6h (et jusqu'à 24h selon critères de mismatch perfusion)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Chronologie & Fenêtres Thérapeutiques", "• <strong>< 4h30 :</strong> Thrombolyse IV par rtPA (Altéplase 0.9 mg/kg, max 90 mg : 10% en bolus puis 90% sur 1h).<br>• <strong>< 6h (voire 24h) :</strong> Thrombectomie mécanique par stent retriever si occlusion proximale d'un gros tronc (carotide interne, tronc de l'artère cérébrale moyenne M1).<br>• Respecter l'heure de début exacte (ou dernière fois vu normal).", "purple")}
      {make_card("2. Gestion Rigoureuse de la Pression Artérielle", "• <strong>Avant thrombolyse :</strong> La PA doit être < 185/110 mmHg. Utiliser Nicardipine (Loxen) ou Labétalol IV.<br>• <strong>Pendant et après thrombolyse :</strong> Maintenir PA < 180/105 mmHg pendant 24h.<br>• <strong>Sans thrombolyse :</strong> Tolérer l'HTA jusqu'à 220/120 mmHg pour préserver la pénombre ischémique !", "rose")}
    </div>
    {make_alert("Contre-Indications Absolues à la Thrombolyse", "• Hémorragie intracrânienne à l'imagerie.<br>• AVC ischémique sévère ou traumatisme crânien < 3 mois.<br>• Chirurgie majeure < 14 jours, hémorragie gastro-intestinale < 21 jours.<br>• Plaquettes < 100 000/mm3, TP < 50%, INR > 1.7 ou traitement curatif par AOD < 48h.<br>• Glycémie < 0.5 g/L (corriger impérativement avant toute décision : piège de l'hypoglycémie !).")}
    """,
    pitfalls=[
        "Toujours vérifier la glycémie capillaire au lit du malade : l'hypoglycémie est le stroke-mimic n°1 simulant un AVC sylvien total !",
        "Ne jamais baisser brutalement la pression artérielle chez un patient présentant un AVC ischémique non candidat à la thrombolyse (risque d'effondrement de la perfusion dans la zone de pénombre).",
        "Ne pas administrer d'aspirine ni d'anticoagulant dans les 24 heures suivant la réalisation d'une thrombolyse intraveineuse."
    ]
)

# 15. Hémorragie Méningée
add_fiche(
    fid="fiche_urgence_hemorragie_meningee",
    slug="hemorragie-meningee-sous-arachnoidienne-urgence",
    title="Fiche Urgence : 15. Hémorragie Sous-Arachnoïdienne Non Traumatique",
    spec_id="neuro",
    spec_name="Neurologie",
    cat="Neuro-Urgence",
    read_time="6 min",
    takeaways=[
        "Céphalée brutale, explosive, d'emblée maximale en 'coup de tonnerre' (< 1 minute), apyrétique.",
        "Syndrome méningé au premier plan (raideur de nuque, signe de Kernig et Brudzinski, vomissements en jet, photophobie).",
        "Scanner cérébral sans injection à réaliser en extrême urgence : hyperdensité spontanée dans les citernes de la base.",
        "Prévention précoce du vasospasme par Nimodipine IV/PO + Traitement interventionnel de l'anévrisme < 24-48h."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Démarche Diagnostique Graduée", "1. <strong>TDM cérébral sans injection immédiat :</strong> Sensibilité > 95% dans les 6 premières heures.<br>2. <strong>Ponction Lombaire (PL) :</strong> INDISPENSABLE si le scanner est normal au-delà de la 6e heure !<br>• Liquide surnageant xanthochromique (après centrifugation).<br>• Pression d'ouverture élevée.<br>• Nombre d'érythrocytes stable sur les 3 tubes (élimine la piqûre vasculaire).", "blue")}
      {make_card("2. Prise en Charge Thérapeutique Spécifique", "• Repos au lit strict, pénombre, antalgiques adaptés (éviter AINS et aspirine).<br>• <strong>Nimodipine (Nimotop) :</strong> 60 mg toutes les 4h PO (ou IVSE) pendant 21 jours pour prévenir l'ischémie par vasospasme.<br>• Contrôle de la PAS < 140 mmHg avant exclusion de l'anévrisme.<br>• <strong>Traitement étiologique :</strong> Embolisation endovasculaire par coils (ou clippage neurochirurgical).", "emerald")}
    </div>
    {make_alert("Complications Mortelles Précoces", "• <strong>Récidive hémorragique précoce :</strong> Risque maximal dans les 24 premières heures (mortelle dans 50% des cas).<br>• <strong>Hydrocéphalie aiguë obstructive :</strong> Dilatation des ventricules au scanner nécessitant une dérivation ventriculaire externe (DVE) en urgence.<br>• <strong>Vasospasme artériel cérébral :</strong> Survient typiquement entre J4 et J14.")}
    """,
    pitfalls=[
        "Un scanner cérébral normal n'élimine JAMAIS une hémorragie méningée : la ponction lombaire reste obligatoire si la clinique est évocatrice !",
        "Toute céphalée brutale en coup de tonnerre est une rupture d'anévrisme intracrânien jusqu'à preuve du contraire.",
        "La Nimodipine prévient les séquelles ischémiques du vasospasme, mais ne réduit pas le vasospasme angiographique lui-même."
    ]
)

# 16. État de Mal Épileptique
add_fiche(
    fid="fiche_urgence_etat_de_mal_epileptique",
    slug="etat-de-mal-epileptique-convulsif-generalise",
    title="Fiche Urgence : 16. État de Mal Épileptique Convulsif Généralisé",
    spec_id="neuro",
    spec_name="Neurologie",
    cat="Neuro-Urgence",
    read_time="6 min",
    takeaways=[
        "Définition opérationnelle (ILAE) : Crise convulsive continue > 5 minutes, ou ≥ 2 crises sans reprise de conscience intermédiaire.",
        "T1 (5 min) : Urgence thérapeutique immédiate pour bloquer la crise et prévenir les lésions neuronales.",
        "T2 (30 min) : Risque majeur de pharmacorésistance et de séquelles cérébrales irréversibles.",
        "1ère ligne : Benzodiazépine IV (Clonazépam 1 mg IVD ou Diazépam 10 mg) répétée une seule fois à 5 minutes."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Chronologie Thérapeutique des Urgences", "• <strong>0 à 5 min :</strong> Maintien des VAS, O2, PLS, glycémie capillaire, voie veineuse.<br>• <strong>5 min (1ère ligne) :</strong> Clonazépam 1 mg IVD lente (ou Midazolam 10 mg IM si pas de VVP). Répéter à 5 min si échec.<br>• <strong>15 à 30 min (2ème ligne) :</strong> Antiépileptique d'action prolongée IV : Lévétiracétam (Keppra) 60 mg/kg (max 4.5g) ou Valproate de sodium 40 mg/kg ou Phénytoïne.<br>• <strong>> 30-40 min (3ème ligne / Réa) :</strong> Intubation + Anesthésie générale par Propofol ou Midazolam.", "rose")}
      {make_card("2. Mesures Réanimatoires Associées", "• Dépistage étiologique immédiat : Ionogramme (hyponatrémie, hypocalcémie), toxiques sanguins, alcoolisme aigu / sevrage.<br>• Si éthylique chronique suspect : Vitamine B1 (Thiamine) 500 mg IV AVANT tout soluté glucosé (prévention du Gayet-Wernicke).<br>• Surveillance thermique (hyperthermie maligne) et rhabdomyolyse (CPK, myoglobinurie).", "indigo")}
    </div>
    {make_alert("Arrêt Respiratoire sous Benzodiazépines", "La répétition intempestive des bolus de benzodiazépines au-delà de 2 doses expose à l'arrêt respiratoire et à l'effondrement hémodynamique sans efficacité antiépileptique supplémentaire. Si 2 doses échouent, passer impérativement à la 2ème ligne !")}
    """,
    pitfalls=[
        "Tout coma post-critique persistant sans amélioration après 30-60 minutes doit faire rechercher un état de mal épileptique NON convulsif par un EEG en urgence.",
        "Ne jamais mettre d'objet dur entre les dents du patient pendant les convulsions (risque de fracture dentaire et d'inhalation bronchique).",
        "En l'absence de voie veineuse périphérique disponible d'emblée, le Midazolam 10 mg par voie intramusculaire est aussi rapide et efficace que le diazépam intraveineux."
    ]
)

# 17. HTIC & Menace d'Engagement
add_fiche(
    fid="fiche_urgence_htic_engagement",
    slug="hypertension-intracranienne-htic-engagement-cerebral",
    title="Fiche Urgence : 17. Hypertension Intra-Crânienne & Menace d'Engagement",
    spec_id="neuro",
    spec_name="Neurologie",
    cat="Neuro-Urgence",
    read_time="5 min",
    takeaways=[
        "Céphalées matinales en casque, vomissements en jet faciles sans nausée, œdème papillaire au fond d'œil.",
        "Triade de Cushing (signe tardif d'engagement imminent) : HTA sévère + Bradycardie + Bradypnée irrégulière.",
        "Engagement temporal (hernie unilatérale) : Mydriase unilatérale aréactive ipsilatérale + Hémiplégie controlatérale.",
        "Urgence osmotique : Mannitol 20% (0.5 à 1 g/kg) ou Sérum Salé Hypertonique 7.5% en bolus sur 20 min."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Les 3 Types d'Engagements Majeurs", "• <strong>Sous-falcoriel :</strong> Hernie du gyrus cingulaire sous la faux du cerveau.<br>• <strong>Temporal / Uncal :</strong> Compression du III (mydriase aréactive homolatérale) et du tronc cérébral.<br>• <strong>Amydalien (foramen magnum) :</strong> Hernie des amygdales cérébelleuses comprimant le bulbe rachidien -> Arrêt cardiorespiratoire brutal sans signe focal !", "purple")}
      {make_card("2. Mesures d'Urgence Immédiates", "• Surélévation de la tête du lit à 30° dans l'axe (favorise le drainage veineux jugulaire).<br>• Éviter les compressions jugulaires (colliers cervicaux trop serrés).<br>• <strong>Osmothérapie :</strong> Mannitol 20% (100 à 200 mL) ou NaCl 7.5% (bolus de 100 mL).<br>• Sédation profonde et intubation précoce avec normocapnie cible (PaCO2 35-38 mmHg).", "rose")}
    </div>
    {make_alert("Contre-Indication Formelle de la Ponction Lombaire", "Toute suspicion clinique d'HTIC ou signe de focalisation neurologique CONTRE-INDIQUE formellement la ponction lombaire avant réalisation d'un scanner cérébral sans injection (risque de décompression sous-tentorielle brutale et d'engagement amygdalien fatal instantané !).")}
    """,
    pitfalls=[
        "La ponction lombaire sans scanner cérébral préalable devant une suspicion d'HTIC est une faute médicolégale majeure.",
        "La triade de Cushing est un signe d'alerte ultime d'engagement du tronc cérébral : l'arrêt respiratoire peut survenir dans les minutes qui suivent.",
        "L'hyperventilation profonde (PaCO2 < 30 mmHg) doit être évitée en routine car elle induit une vasoconstriction cérébrale majeure avec ischémie tissulaire secondaire."
    ]
)

# 18. Syndrome de Guillain-Barré
add_fiche(
    fid="fiche_urgence_guillain_barre",
    slug="syndrome-de-guillain-barre-ascendant-urgence",
    title="Fiche Urgence : 18. Syndrome de Guillain-Barré en Phase Ascendante",
    spec_id="neuro",
    spec_name="Neurologie",
    cat="Neuro-Urgence",
    read_time="5 min",
    takeaways=[
        "Polyradiculonévrite aiguë démyélinisante post-infectieuse (Campylobacter jejuni, CMV, EBV).",
        "Déficit moteur bilatéral, symétrique, d'aggravation ascendante rapide avec abolition précoce des réflexes ostéotendineux (ROT).",
        "Risque vital : Atteinte des muscles respiratoires (diaphragme) et fausses routes par atteinte des paires crâniennes (IX, X).",
        "Traitement étiologique en réanimation : Immunoglobulines intraveineuses (IgIV 0.4 g/kg/j pendant 5 jours) ou Échanges Plasmatiques."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Surveillance de la Défaillance Respiratoire", "Critères d'admission en Réanimation / USI :<br>• Évolution rapide du déficit en moins de 48 heures.<br>• Atteinte des muscles respiratoires : Capacité Vitale (CV) < 20 mL/kg, toux inefficace, respiration paradoxale.<br>• Dysautonomie : Variations brutales de la PA et de la FC (risque d'asystolie réflexe).<br>• Troubles de déglutition majeurs.", "rose")}
      {make_card("2. Examens Complémentaires Clés", "• <strong>Ponction lombaire :</strong> Dissociation albumino-cytologique (hyperprotéinorachie > 0.5 g/L avec moins de 10 éléments cellulaires/mm3). Attention : peut être normale les 7 premiers jours !<br>• <strong>Électroneuromyogramme (ENMG) :</strong> Allongement des latences distales, ralentissement des vitesses de conduction, bloc de conduction.", "blue")}
    </div>
    {make_alert("Contre-Indication Majeure : Les Corticoïdes !", "Les corticoïdes par voie générale (oraux ou IV) sont INÉFFICACES et déconseillés dans le syndrome de Guillain-Barré aigu, car ils n'apportent aucun bénéfice et peuvent ralentir la récupération motrice ultérieure.")}
    """,
    pitfalls=[
        "Ne jamais administrer de corticoïdes dans le Guillain-Barré : le traitement de choix repose exclusivement sur les IgIV ou les échanges plasmatiques débutés précocement.",
        "La normalité de la protéinorachie à la ponction lombaire lors de la première semaine n'élimine absolument pas le diagnostic.",
        "Le risque d'arythmie cardiaque sévère par dysautonomie impose le scope cardiaque continu en soins intensifs."
    ]
)

# 19. Compression Médullaire Aiguë
add_fiche(
    fid="fiche_urgence_compression_medullaire",
    slug="compression-medullaire-aigue-non-traumatique",
    title="Fiche Urgence : 19. Compression Médullaire Aiguë Non Traumatique",
    spec_id="neuro",
    spec_name="Neurologie",
    cat="Neuro-Urgence",
    read_time="5 min",
    takeaways=[
        "Urgence neurochirurgicale absolue : toute heure perdue compromet la récupération motrice et sphinctérienne définitive.",
        "Association d'un syndrome lésionnel (radiculalgie fixe en ceinture), sous-lésionnel (paraparésie, niveau sensitif) et sphinctérien.",
        "Signes d'alerte : Troubles mictionnels (rétention urinaire aiguë) et hypoesthésie périnéale en selle.",
        "Examen diagnostique immédiat : IRM médullaire complète en urgence absolue."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Sémiologie en 3 Niveaux", "• <strong>1. Syndrome lésionnel :</strong> Douleur radiculaire constante, impulsive à la toux, fixant la hauteur de la lésion.<br>• <strong>2. Syndrome sous-lésionnel :</strong> Déficit moteur spastique sous la lésion (signe de Babinski bilatéral), niveau sensitif net en dessous duquel toutes les sensibilités sont abolies.<br>• <strong>3. Syndrome rachidien :</strong> Douleur vertébrale localisée, raideur segmentaire.", "indigo")}
      {make_card("2. Conduite Thérapeutique d'Urgence", "1. <strong>Imagerie :</strong> IRM du rachis entier en urgence.<br>2. <strong>Corticothérapie forte dose :</strong> Méthylprednisolone IV bolus (10 mg/kg puis perfusion) pour réduire l'œdème péri-lésionnel tumoral.<br>3. <strong>Sondage vésical :</strong> Évacuation de la rétention aiguë d'urine.<br>4. <strong>Laminectomie décompressive chirurgicale :</strong> À réaliser impérativement dans les 12 à 24 premières heures !", "purple")}
    </div>
    {make_alert("Piège de la Phase Flasque Initiale", "Au stade très aigu d'une compression médullaire rapide (choc spinal), le syndrome pyramidal est FLASQUE avec hypotonie et abolition des réflexes ostéotendineux, mimant une atteinte périphérique ! Seule la présence d'un niveau sensitif net et du signe de Babinski redresse le diagnostic.")}
    """,
    pitfalls=[
        "La présence d'un niveau sensitif cutané impose une IRM médullaire et jamais cérébrale !",
        "Le délai chirurgical de décompression avant survenue d'un déficit moteur complet définitif est de moins de 24 à 48 heures.",
        "Toujours sonder la vessie : la rétention aiguë d'urine est souvent indolore chez ces patients en raison de l'anesthésie sous-lésionnelle."
    ]
)

print("Modules 1, 2, 3 generated (19 fiches).")
