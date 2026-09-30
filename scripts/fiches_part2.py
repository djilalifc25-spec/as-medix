# -*- coding: utf-8 -*-
"""
Flash Fiches Part 2: Infectiologie, Chirurgie/Gastro, Endocrinologie (fiches 20 to 34)
"""
import datetime

NOW_ISO = datetime.datetime.utcnow().isoformat() + "Z"

def make_card(title, content, color="slate"):
    color_map = {
        "rose": "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200",
        "indigo": "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200",
        "amber": "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200",
        "emerald": "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200",
        "purple": "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200",
        "blue": "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200",
        "slate": "bg-white dark:bg-navy-800 border-slate-200 dark:border-navy-700 text-navy-800 dark:text-navy-200",
    }
    c_cls = color_map.get(color, color_map["slate"])
    return f"""
    <div class="p-4 rounded-2xl border shadow-sm {c_cls}">
      <h4 class="font-black text-sm mb-1.5 flex items-center gap-1.5">{title}</h4>
      <div class="text-xs leading-relaxed space-y-1">{content}</div>
    </div>
    """

def make_alert(title, text, alert_type="danger"):
    if alert_type == "danger":
        return f"""
        <div class="p-4 my-4 rounded-2xl border border-rose-200 bg-rose-50/70 dark:border-rose-900/50 dark:bg-rose-950/30 text-xs">
          <div class="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-extrabold text-sm mb-1">
            🚨 {title}
          </div>
          <div class="text-navy-700 dark:text-slate-300 leading-relaxed">{text}</div>
        </div>
        """
    elif alert_type == "warning":
        return f"""
        <div class="p-4 my-4 rounded-2xl border border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/30 text-xs">
          <div class="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-extrabold text-sm mb-1">
            ⚠️ {title}
          </div>
          <div class="text-navy-700 dark:text-slate-300 leading-relaxed">{text}</div>
        </div>
        """
    else:
        return f"""
        <div class="p-4 my-4 rounded-2xl border border-indigo-200 bg-indigo-50/70 dark:border-indigo-900/50 dark:bg-indigo-950/30 text-xs">
          <div class="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-extrabold text-sm mb-1">
            💡 {title}
          </div>
          <div class="text-navy-700 dark:text-slate-300 leading-relaxed">{text}</div>
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

FICHES_PART2 = []

def add_fiche(fid, slug, title, spec_id, spec_name, cat, read_time, takeaways, html_body, pitfalls):
    full_html = f"""
    <div class="space-y-6">
      {html_body}
      {make_pitfalls(pitfalls)}
    </div>
    """
    FICHES_PART2.append({
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
# MODULE 4: INFECTIOLOGIE & RÉANIMATION (5 FICHES)
# ==============================================================================

# 20. Choc Septique
add_fiche(
    fid="fiche_urgence_sepsis_choc_septique",
    slug="choc-septique-sepsis-surviving-sepsis-campaign",
    title="Fiche Urgence : 20. Choc Septique & Sepsis Sévère (Surviving Sepsis)",
    spec_id="infectieux",
    spec_name="Infectiologie & Maladies Transmissibles",
    cat="Urgence Infectieuse & Réa",
    read_time="6 min",
    takeaways=[
        "Définition Choc Septique : Sepsis avec hypotension persistante nécessitant des vasopresseurs pour PAM ≥ 65 mmHg ET lactates > 2 mmol/L malgré un remplissage adéquat.",
        "Dépistage rapide au lit par le score qSOFA (≥ 2 critères) : FR ≥ 22/min, GCS < 15, PAS ≤ 100 mmHg.",
        "Hour-1 Bundle (dans la 1ère heure) : Dosages lactates, hémocultures, antibiothérapie large spectre, remplissage 30 mL/kg cristalloïdes.",
        "Vasopresseur de première intention : Noradrénaline IVSE initiée dès l'échec ou en cours de remplissage."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. The Hour-1 Bundle (SSC 2024)", "À débuter dans les 60 minutes :<br>1. Mesurer les <strong>lactates sanguins</strong> (réévaluer si > 2 mmol/L).<br>2. Réaliser les <strong>hémocultures</strong> (2 paires aéro/anaérobie) avant antibiotiques.<br>3. Administrer l'<strong>antibiothérapie IV à large spectre</strong> sans délai.<br>4. Débuter un <strong>remplissage rapide par cristalloïdes (Ringer Lactate) à 30 mL/kg</strong> si hypotension ou lactates ≥ 4 mmol/L.<br>5. Débuter la <strong>Noradrénaline</strong> si PAM < 65 mmHg.", "rose")}
      {make_card("2. Objectifs Hémodynamiques Clés", "• Pression Artérielle Moyenne (PAM) cible : ≥ 65 mmHg.<br>• Diurèse horaire : ≥ 0.5 mL/kg/h.<br>• Clairance des lactates (> 20% de baisse toutes les 2h).<br>• Temps de recoloration cutanée < 2 secondes (test digital).<br>• Corticothérapie (Hydrocortisone 200 mg/j) si choc réfractaire sous fortes doses de Noradrénaline.", "emerald")}
    </div>
    {make_alert("Règle d'Or de l'Antibiothérapie dans le Sepsis", "Chaque heure de retard dans l'administration de l'antibiothérapie adaptée lors d'un choc septique augmente la mortalité de 7.6% ! En cas de difficulté de pose de voie pour hémocultures, NE PAS RETARDER l'injection antibiotique.")}
    """,
    pitfalls=[
        "Ne jamais attendre la fin du remplissage de 30 mL/kg pour débuter la Noradrénaline si la PAM est effondrée : l'introduction précoce restaure la perfusion coronaire et rénale.",
        "Les solutés colloïdes synthétiques (HEA) et le sérum physiologique à 0.9% en quantité massive sont délétères (acidose hyperchlorémique et néphrotoxicité) : préférer les cristalloïdes balancés (Ringer Lactate).",
        "L'absence de fièvre n'élimine pas un sepsis : l'hypothermie (< 36°C) est un signe de gravité extrême associé à une surmortalité."
    ]
)

# 21. Purpura Fulminans
add_fiche(
    fid="fiche_urgence_purpura_fulminans",
    slug="purpura-fulminans-meningococcemie-urgence",
    title="Fiche Urgence : 21. Purpura Fulminans & Méningococcémie",
    spec_id="infectieux",
    spec_name="Infectiologie & Maladies Transmissibles",
    cat="Urgence Infectieuse & Réa",
    read_time="5 min",
    takeaways=[
        "Urgence infectieuse absolue : Syndrome fébrile + Purpura ecchymotique ou nécrotique extensif avec au moins un élément nécrotique > 3 mm.",
        "Geste salvateur immédiat : Injection d'une C3G (Ceftriaxone ou Céfotaxime) IV ou IM SANS ATTENDRE AUCUN EXAMEN NI TRANSFERT !",
        "Dose d'urgence : Ceftriaxone 2 g IV/IM chez l'adulte (50 à 100 mg/kg chez l'enfant).",
        "Mesures associées : Isolement gouttelettes, appel du SAMU/réanimation, antibioprophylaxie des sujets contacts (Rifampicine)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Reconnaissance du Purpura Fulminans", "• Éléments purpuriques pétéchiaux, ecchymotiques ou nécrotiques d'extension rapide en quelques minutes.<br>• Ne s'efface pas à la vitropression.<br>• Présence d'au moins <strong>un élément nécrotique ou ecchymotique d'au moins 3 mm</strong>.<br>• Signes de choc septique ou d'hypoperfusion périphérique.", "rose")}
      {make_card("2. Conduite Pratique Immédiate", "1. <strong>Ceftriaxone 2g IV ou IM</strong> (ou Céfotaxime 50-100 mg/kg) immédiatement au cabinet ou domicile.<br>2. Appel immédiat du SAMU (15) pour transfert médicalisé en réanimation.<br>3. Remplissage vasculaire cristalloïdes.<br>4. Isolement respiratoire gouttelettes.<br>5. Déclaration obligatoire à l'ARS/DSP et prophylaxie de l'entourage.", "indigo")}
    </div>
    {make_alert("Faute Médicale Grave : Réaliser la Ponction Lombaire d'Abord", "La ponction lombaire est STRICTEMENT CONTRE-INDIQUÉE avant l'antibiothérapie devant un purpura fulminans (risque d'instabilité hémodynamique et d'aggravation du choc) ! L'antibiothérapie doit être injectée dans les 5 minutes.")}
    """,
    pitfalls=[
        "Tout retard d'injection antibiotique pour faire un bilan ou une ponction lombaire engage directement la responsabilité pénale du médecin.",
        "Si la voie veineuse est impossible, l'injection se fait immédiatement par voie INTRAMUSCULAIRE (face antéro-latérale de cuisse).",
        "L'antibioprophylaxie des sujets contacts (entourage proche dans les 10 jours précédant) repose sur la Rifampicine per os pendant 2 jours (ou Ceftriaxone IM dose unique chez la femme enceinte)."
    ]
)

# 22. Paludisme Grave
add_fiche(
    fid="fiche_urgence_paludisme_grave",
    slug="paludisme-grave-plasmodium-falciparum-artesunate",
    title="Fiche Urgence : 22. Paludisme Grave d'Importation à Plasmodium falciparum",
    spec_id="infectieux",
    spec_name="Infectiologie & Maladies Transmissibles",
    cat="Urgence Infectieuse & Réa",
    read_time="5 min",
    takeaways=[
        "Toute fièvre au retour d'une zone d'endémie palustre est un paludisme à Plasmodium falciparum jusqu'à preuve du contraire.",
        "Critères de gravité de l'OMS : Neuropaludisme (coma, convulsions), détresse respiratoire/OAP, collapsus/choc, ictère, anémie sévère (Hb < 7 g/dL), hémoglobinurie, hyperlactatémie, parasitémie > 10%.",
        "Diagnostic d'urgence : Frottis sanguin et Goutte Épaisse (ou test de diagnostic rapide TDR).",
        "Traitement de référence universel : Artésunate intraveineux (2.4 mg/kg à H0, H12, H24 puis 1x/jour)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Critères de Gravité Majeurs (OMS)", "Présence d'au moins UN critère :<br>• <strong>Neurologique :</strong> Score de Glasgow < 11, convulsions répétées.<br>• <strong>Respiratoire :</strong> PaO2 < 60 mmHg, OAP lésionnel.<br>• <strong>Hémodynamique :</strong> PAS < 80 mmHg avec marbrures.<br>• <strong>Biologique :</strong> Acidose métabolique (pH < 7.35), créatinine > 265 mcmol/L, hypoglycémie (< 2.2 mmol/L), parasitémie > 10% (ou > 4% chez le non-immun).", "rose")}
      {make_card("2. Traitement Antiparasitaire d'Urgence", "• <strong>Artésunate IV :</strong> 2.4 mg/kg à H0, H12, H24 puis 2.4 mg/kg toutes les 24 heures (au moins 3 doses IV jusqu'à relais per os possible par ACT).<br>• Si Artésunate indisponible : Quinine IV (dose de charge 16 mg/kg sur 4h dans du G10% puis 8 mg/kg toutes les 8h) sous surveillance ECG continue (risque d'allongement du QT et hypoglycémie).", "emerald")}
    </div>
    {make_alert("Piège Vital sous Quinine : L'Hypoglycémie Réfractaire", "La quinine stimule directement la sécrétion d'insuline par les cellules bêta pancréatiques. Tout patient sous Quinine IV doit impérativement recevoir une perfusion continue de glucosé (G10%) avec surveillance de la glycémie capillaire toutes les 2 heures !")}
    """,
    pitfalls=[
        "L'Artésunate IV a supplanté la Quinine IV comme traitement de référence mondial (réduction de 35% de la mortalité et absence de risque d'hypoglycémie iatrogène).",
        "Surveillance post-artésunate : Risque d'anémie hémolytique retardée survenant 1 à 3 semaines après le traitement (surveiller NFS et réticulocytes à J7, J14 et J21).",
        "Un accès pernicieux palustre peut survenir même avec une parasitémie basse en raison de la séquestration érythrocytaire dans les capillaires cérébraux profonds."
    ]
)

# 23. Fasciite Nécrosante
add_fiche(
    fid="fiche_urgence_fasciite_necrosante",
    slug="fasciite-necrosante-dhbn-urgence-chirurgicale",
    title="Fiche Urgence : 23. Dermohypodermite Bactérienne Nécrosante & Fasciite",
    spec_id="infectieux",
    spec_name="Infectiologie & Maladies Transmissibles",
    cat="Urgence Infectieuse & Réa",
    read_time="5 min",
    takeaways=[
        "Infection nécrosante aiguë des tissus mous sous-cutanés et des aponévroses musculaires (Streptococcus pyogenes, flore mixte anaérobie).",
        "Signe cardinal d'alerte : DOULEUR disproportionnée par rapport aux signes inflammatoires cutanés initiaux.",
        "Signes d'aggravation : Hypoesthésie cutanée centrale (nécrose des filets nerveux), crépitation gazeuse, phlyctènes hémorragiques, marbrures, état de choc.",
        "Traitement salvateur : Débridement chirurgical d'extrême urgence en bloc opératoire + Antibiothérapie triple IV large spectre."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Signes Distinctifs DHB vs DHBN", "• <strong>Érysipèle (DHB simple) :</strong> Bourrelet périphérique net, pas de nécrose, pas de choc, douleur modérée sensible aux antalgiques.<br>• <strong>Fasciite nécrosante (DHBN) :</strong> Pas de bourrelet, placards bleuâtres violacés froids et insensibles (anesthésie locale pathognomonique), crépitation sous-cutanée neigeuse, défaillance multiviscérale.", "rose")}
      {make_card("2. Stratégie Médico-Chirurgicale", "1. <strong>Chirurgie immédiate sans délai :</strong> Exploration, excision large et parage agressif de tous les tissus et fascias nécrosés.<br>2. <strong>Antibiothérapie triple IV :</strong> Pénicilline G (ou Amoxicilline-Clavulanique) + Clindamycine (effet anti-toxinique majeur) + Aminoside (Gentamicine).<br>3. Réanimation hydro-électrolytique lourde et oxygénothérapie hyperbare adjuvante.", "indigo")}
    </div>
    {make_alert("Contre-Indication Formelle : Les AINS !", "La prise d'Anti-Inflammatoires Non Stéroïdiens (Ibuprofène, Kétoprofène) lors d'une infection cutanée débutante est un facteur de risque majeur de bascule vers une fasciite nécrosante foudroyante par blocage de la réponse leucocytaire immunitaire locale !")}
    """,
    pitfalls=[
        "Ne jamais attendre la crépitation sous-cutanée ou la nécrose cutanée patente pour opérer : quand elles apparaissent, le pronostic vital est déjà engagé dans plus de 50% des cas !",
        "La clindamycine est indispensable car elle bloque la synthèse ribosomique des toxines pyrogènes streptococciques (effet Eagle).",
        "Au niveau périnéal et scrotal, la fasciite nécrosante constitue la gangrène de Fournier (urgence urologique et proctologique)."
    ]
)

# 24. Choc Anaphylactique
add_fiche(
    fid="fiche_urgence_choc_anaphylactique",
    slug="choc-anaphylactique-severe-adrenaline-im",
    title="Fiche Urgence : 24. Choc Anaphylactique Sévère (Grade III - IV)",
    spec_id="infectieux",
    spec_name="Infectiologie & Maladies Transmissibles",
    cat="Urgence Vitale & Allergie",
    read_time="5 min",
    takeaways=[
        "Réaction d'hypersensibilité systémique sévère d'apparition brutale engageant le pronostic vital dans les minutes suivant l'exposition à un allergène.",
        "Tableau associant signes cutanéo-muqueux (urticaire géant, œdème de Quincke) + signes respiratoires (bronchospasme, stridor) + collapsus cardiovasculaire.",
        "Seul traitement curatif d'urgence : ADRÉNALINE PAR VOIE INTRAMUSCULAIRE (face antéro-latérale de la cuisse).",
        "Dose de référence : 0.5 mg chez l'adulte (0.3 mg chez l'enfant), renouvelable toutes les 5 à 15 minutes."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Posologies de l'Adrénaline IM", "• <strong>Adulte :</strong> 0.5 mg IM (soit 0.5 mL de la solution à 1 mg/mL = 1:1000 non diluée).<br>• <strong>Enfant > 12 ans :</strong> 0.5 mg IM.<br>• <strong>Enfant 6-12 ans :</strong> 0.3 mg IM.<br>• <strong>Enfant < 6 ans :</strong> 0.15 mg IM.<br>• Injection à répéter à 5-10 min si l'état respiratoire ou tensionnel ne s'améliore pas.", "emerald")}
      {make_card("2. Mesures Réanimatoires Concomitantes", "• <strong>Position :</strong> Décubitus dorsal strict avec jambes surélevées (Trendelenburg). Jamais debout ni assis !<br>• <strong>Oxygène :</strong> Masque à haute concentration 10-15 L/min.<br>• <strong>Remplissage vasculaire rapide :</strong> Cristalloïdes 20 à 30 mL/kg en 15-20 min.<br>• Corticoïdes IV et antihistaminiques : traitements secondaires pour prévenir le rebond tardif (ne sauvent pas la vie en phase aiguë !).", "blue")}
    </div>
    {make_alert("Piège Mortel : Le Redressement Brutal du Patient !", "Relever un patient en choc anaphylactique en position assise ou debout peut provoquer un désamorçage cardiaque immédiat et fatal par chute catastrophique du retour veineux cave inférieur (Empty Heart Syndrome).")}
    """,
    pitfalls=[
        "L'adrénaline doit être administrée par voie INTRAMUSCULAIRE et non sous-cutanée (absorption erratique) ni intraveineuse directe sans dilution (risque de fibrillation ventriculaire et d'IDM).",
        "Les corticoïdes n'ont aucun effet sur le bronchospasme immédiat ni sur le collapsus (délai d'action de 4 à 6 heures) : ils ne doivent JAMAIS retarder l'adrénaline !",
        "Surveillance obligatoire en milieu hospitalier pendant au moins 12 à 24 heures en raison du risque de réaction biphasique secondaire."
    ]
)

# ==============================================================================
# MODULE 5: GASTRO-ENTÉROLOGIE & CHIRURGIE VISCÉRALE (6 FICHES)
# ==============================================================================

# 25. Pancréatite Aiguë Grave
add_fiche(
    fid="fiche_urgence_pancreatite_aigue",
    slug="pancreatite-aigue-grave-balthazar-ranson",
    title="Fiche Urgence : 25. Pancréatite Aiguë Grave (Balthazar & Ranson)",
    spec_id="chirurgie",
    spec_name="Chirurgie Générale & Viscérale",
    cat="Urgence Médico-Chirurgicale",
    read_time="6 min",
    takeaways=[
        "Douleur épigastrique transfixiante brutale en coup de poignard avec position antalgique en chien de fusil + Lipasémie > 3x la normale.",
        "Le scanner abdomino-pelvien injecté n'est indiqué qu'à 48-72h du début pour évaluer la nécrose (Score CTSI de Balthazar).",
        "Étiologies principales : Lithiase biliaire (45%) et Alcoolisme chronique (40%).",
        "Traitement médical réanimatoire prioritaire : Remplissage hydro-électrolytique précoce et analgésie multimodale."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Scores Pronostiques de Gravité", "• <strong>Score de Ranson (à H0 et H48) :</strong> Âge > 55 ans, GB > 16 000, glycémie > 11 mmol/L, LDH > 350 UI/L, ASAT > 250 UI/L.<br>• <strong>Score de Balthazar (TDM à H72) :</strong> De A (pancréas normal) à E (≥ 2 coulées liquidiennes / gaz) + % de nécrose glandulaire.<br>• <strong>Score SIRS persistant à 48h :</strong> Meilleur indicateur précoce de défaillance multiviscérale.", "purple")}
      {make_card("2. Principes Thérapeutiques Modernes", "• <strong>Remplissage vasculaire précoce :</strong> Ringer Lactate 200 à 300 mL/h les 24 premières heures (prévient la nécrose ischémique).<br>• <strong>Nutrition :</strong> Reprise entérale précoce (orale ou sonde naso-jéjunale) dès que la douleur le permet.<br>• <strong>Antibiotiques :</strong> AUCUNE antibioprophylaxie systématique n'est indiquée !<br>• Sphinctérotomie endoscopique urgente si angiocholite associée.", "emerald")}
    </div>
    {make_alert("Piège Classique du Scanner Précipité", "Réaliser le scanner abdominal dans les 12 premières heures sous-estime systématiquement la nécrose pancréatique et ne change pas la prise en charge initiale. Le scanner de référence pour le calcul du score de Balthazar doit être fait entre la 48e et la 72e heure.")}
    """,
    pitfalls=[
        "Le taux de lipasémie n'a AUCUNE corrélation avec la gravité de la pancréatite (une lipasémie à 50x la normale peut être une pancréatite bénigne, et inversement).",
        "Ne jamais mettre d'antibiotiques à titre prophylactique dans la pancréatite aiguë nécrosante : ils favorisent la sélection de germes multirésistants et fongiques.",
        "En cas de pancréatite biliaire sans angiocholite, la cholécystectomie doit être réalisée au cours de la même hospitalisation dès résolution des symptômes."
    ]
)

# 26. Occlusion Intestinale Mécanique
add_fiche(
    fid="fiche_urgence_occlusion_mecanique",
    slug="occlusion-intestinale-aigue-mecanique-strangulation",
    title="Fiche Urgence : 26. Occlusion Intestinale Aiguë Mécanique (Strangulation)",
    spec_id="chirurgie",
    spec_name="Chirurgie Générale & Viscérale",
    cat="Urgence Chirurgicale",
    read_time="6 min",
    takeaways=[
        "Syndrome occlusif complet : Douleurs abdominales, vomissements, arrêt précoce des matières et des gaz, météorisme abdominal.",
        "Distinguer impérativement Occlusion par Strangulation (urgence chirurgicale à l'heure) et Occlusion par Obstruction.",
        "Rechercher systématiquement une hernie étranglée au niveau de TOUS les orifices herniaires (aine, ombilic, cicatrice).",
        "Examen diagnostique clé : Scanner abdomino-pelvien injecté (recherche du signe du tourbillon, défaut de rehaussement pariétal, pneumatose)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Strangulation vs Obstruction", "• <strong>Strangulation (Bride, Volvulus, Hernie étranglée) :</strong> Début brutal, douleur vive continue sans répit, vomissements précoces abondants, météorisme asymétrique immobile, risque de nécrose ischémique digestive en moins de 6h.<br>• <strong>Obstruction (Tumeur colorectale, fécalome) :</strong> Début progressif, douleur paroxystique péristaltique, météorisme diffus volumineux en cadre.", "rose")}
      {make_card("2. Scanner Abdominal Injecté", "Permet d'affirmer le diagnostic et de poser l'indication chirurgicale immédiate :<br>• Zone de transition entre anses dilatées en amont et anses plates en aval.<br>• Signes de souffrance digestive : épaississement pariétal, défaut de rehaussement au temps artériel, pneumatose pariétale, aéroportie.<br>• Épanchement péritonéal libre.", "blue")}
    </div>
    {make_alert("Règle Immuable : Palper les Orifices Herniaires !", "Ne jamais diagnostiquer une gastro-entérite ou une occlusion réflexe chez une personne âgée qui vomit sans avoir minutieusement examiné et palpé les orifices inguinaux et cruraux : la hernie crurale étranglée passée inaperçue est fatale.")}
    """,
    pitfalls=[
        "L'arrêt des gaz est le signe le plus précoce et le plus fidèle de l'occlusion (l'arrêt des matières peut être retardé par la vidange du segment d'aval).",
        "Dans l'occlusion du côlon à valvule iléo-cæcale continente, le cæcum se dilate en vase clos : si le diamètre cæcal dépasse 10 cm, le risque de perforation diastatique est imminent !",
        "La sonde naso-gastrique en aspiration douce est indispensable pour soulager la distension gastrique et prévenir l'inhalation bronchique (syndrome de Mendelson)."
    ]
)

# 27. Péritonite Aiguë Généralisée
add_fiche(
    fid="fiche_urgence_peritonite_perforation",
    slug="peritonite-aigue-generalisee-perforation-ventre-de-bois",
    title="Fiche Urgence : 27. Péritonite Aiguë Généralisée (Perforation d'Ulcère)",
    spec_id="chirurgie",
    spec_name="Chirurgie Générale & Viscérale",
    cat="Urgence Chirurgicale",
    read_time="5 min",
    takeaways=[
        "Signe physique pathognomonique : Le 'Ventre de Bois' (contracture abdominale involontaire, invincible, tonique et douloureuse).",
        "Douleur abdominale diffuse exacerbée par la décompression brutale de la paroi (signe de Blumberg) et la palpation du cul-de-sac de Douglas.",
        "Disparition de la matité pré-hépatique à la percussion signant un pneumopéritoine par perforation d'organe creux.",
        "Trépied thérapeutique immédiat : Réanimation hémodynamique + Antibiothérapie triple IV + Laparotomie / Cœlioscopie d'urgence."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Formes Cliniques Trompeuses", "• <strong>Sujet âgé ou dénutri :</strong> Signes péritonéaux très atténués, pas de contracture nette mais simple défense ou ballonnement fébrile avec confusion mentale.<br>• <strong>Patient sous corticoïdes / immunodéprimé :</strong> Péritonites 'asthéniques' sans fièvre ni contracture avec état de choc septique d'emblée.<br>• La douleur au toucher rectal (cri du Douglas) reste un signe précieux.", "amber")}
      {make_card("2. Conduite Thérapeutique Immédiate", "1. <strong>Mise en condition :</strong> VVP gros calibre, sonde gastrique en aspiration, sonde urinaire.<br>2. <strong>Réanimation volémique :</strong> Remplissage cristalloïdes équilibrés.<br>3. <strong>Antibiothérapie probabiliste IV :</strong> C3G (Céfotaxime 2g x 3/j) + Métronidazole 500 mg x 3/j + Gentamicine.<br>4. <strong>Chirurgie d'urgence :</strong> Toilette péritonéale abondante + éradication de la source infectieuse.", "emerald")}
    </div>
    {make_alert("Pneumopéritoine à l'Imagerie", "La présence d'un croissant gazeux sous-diaphragmatique unilatéral ou bilatéral sur la radiographie de thorax de face debout (ou au scanner) affirme la perforation d'organe creux. Son absence n'élimine pas une péritonite (ex : appendicite perforée ou péritonite par diffusion).")}
    """,
    pitfalls=[
        "Ne jamais administrer d'antalgiques morphiniques majeurs avant l'examen par le chirurgien si le diagnostic de péritonite n'a pas encore été formellement posé.",
        "La contracture abdominale est involontaire et permanente : elle persiste même pendant le sommeil ou la distraction du patient, la différenciant de la simple défense.",
        "Dans la perforation d'ulcère gastroduodénal, la suture simple avec épiplooplastie (procédé de Graham) est le traitement de choix."
    ]
)

# 28. Angiocholite Aiguë Lithiasique
add_fiche(
    fid="fiche_urgence_angiocholite_aigue",
    slug="angiocholite-aigue-lithiasique-triade-charcot",
    title="Fiche Urgence : 28. Angiocholite Aiguë Lithiasique",
    spec_id="gastro",
    spec_name="Gastro-entérologie & Hépatologie",
    cat="Urgence Hépato-Biliaire",
    read_time="5 min",
    takeaways=[
        "Infection bactérienne suppurée de la voie biliaire principale sous pression par obstacle lithiasique (calcul enclavé dans le cholédoque).",
        "Triade sémiologique chronologique de Charcot en 24-48h : Douleur biliaire -> Fièvre avec frissons -> Ictère cutanéo-muqueux.",
        "Pentade de Reynolds (forme toxique fulminante) : Triade de Charcot + État de choc septique + Confusion mentale.",
        "Traitement curatif : Décompression biliaire urgente par CPRE (sphinctérotomie endoscopique) sous couverture antibiotique IV."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Chronologie de la Triade de Charcot", "L'apparition successive en moins de 48 heures est pathognomonique :<br>1. <strong>Douleur hépatique :</strong> Colique hépatique épigastrique ou de l'hypochondre droit irradiant vers l'épaule.<br>2. <strong>Fièvre aiguë :</strong> Élevée (39-40°C) avec frissons solennels et bactériémie à bacilles Gram négatif.<br>3. <strong>Ictère franc :</strong> Conjonctival puis cutané avec urines foncées et selles décolorées.", "blue")}
      {make_card("2. Prise en Charge d'Extrême Urgence", "• <strong>Antibiothérapie probabiliste IV immédiate :</strong> C3G (Ceftriaxone 2g/j) + Métronidazole 500 mg x 3/j (ou Pipéracilline-Tazobactam).<br>• <strong>Décompression biliaire en urgence (< 24h) :</strong> Sphinctérotomie endoscopique par CPRE pour extraire le calcul et poser un drain naso-biliaire ou une prothèse.<br>• Si échec CPRE : Drainage biliaire transhépatique percutané.", "rose")}
    </div>
    {make_alert("Urgence à l'Heure dans la Forme Grave", "L'angiocholite grave avec état de choc (angiocholite suppurée aiguë) présente une mortalité proche de 100% sans décompression biliaire en urgence : l'antibiothérapie seule est incapable de pénétrer dans une voie biliaire sous haute pression !")}
    """,
    pitfalls=[
        "La cholécystectomie en urgence au stade d'angiocholite aiguë est formellement contre-indiquée : il faut d'abord désobstruer la voie biliaire par voie endoscopique, puis réaliser la cholécystectomie à froid.",
        "L'échographie abdominale peut ne pas visualiser le calcul du bas cholédoque masqué par les gaz duodénaux ; la dilatation de la VBP (> 8 mm) suffit pour porter le diagnostic.",
        "La bili-IRM (cholangio-IRM) est l'examen non invasif le plus performant pour cartographier le calcul cholédocien avant geste endoscopique."
    ]
)

# 29. Ischémie Mésentérique Aiguë
add_fiche(
    fid="fiche_urgence_ischemie_mesenterique",
    slug="ischemie-mesenterique-aigue-infarctus-mesenterique",
    title="Fiche Urgence : 29. Ischémie Mésentérique Aiguë (Infarctus Mésentérique)",
    spec_id="chirurgie",
    spec_name="Chirurgie Générale & Viscérale",
    cat="Urgence Vasculo-Digestive",
    read_time="6 min",
    takeaways=[
        "Urgence vasculaire absolue : 'Infarctus du tube digestif', mortalité supérieure à 60-80% en cas de retard diagnostique.",
        "Discordance clinique frappante : DOULEUR abdominale atroce, brutale, intolérable, contrastant avec un ABDOMEN SOUPLE et peu sensible au début !",
        "Biomarqueur d'alerte : Hyperlactatémie artérielle (signe d'anoxie cellulaire avancée).",
        "Examen diagnostique décisif immédiat : Angio-TDM abdomino-pelvien injecté aux temps artériel et portal."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Mécanismes Étiologiques", "• <strong>Embolie de l'artère mésentérique supérieure (50%) :</strong> Sujet en fibrillation atriale ou post-IDM, douleur cataclysmique hyper-aiguë.<br>• <strong>Thrombose artérielle athéromateuse (25%) :</strong> Sujet polyvasculaire avec antécédents d'angor intestinal postprandial.<br>• <strong>Ischémie non occlusive (NOMI 20%) :</strong> Vasoconstriction réflexe lors d'un état de choc cardiogénique sous fortes doses de vasopresseurs.<br>• <strong>Thrombose veineuse mésentérique (5%) :</strong> Thrombophilie.", "purple")}
      {make_card("2. Fenêtre Thérapeutique & Prise en Charge", "• <strong>Avant nécrose :</strong> Revascularisation endovasculaire (embolectomie, thrombo-aspiration, stent) ou chirurgicale (pontage).<br>• <strong>Stade de nécrose / péritonite :</strong> Laparotomie urgente pour résection des anses grêles nécrotiques (Damage Control chirurgical avec laparostomie et Second Look systématique à 24-48h).<br>• Anticoagulation par HNF IV curative d'emblée.", "rose")}
    </div>
    {make_alert("Le Piège Redoutable de la Période de 'Calme Trompeur'", "Après la crise douloureuse initiale violente, survient parfois une accalmie sédative transitoire liée à la mort des terminaisons nerveuses de la paroi intestinale nécrosée. L'apparition secondaire d'un ballonnement avec contracture signe la perforation et la péritonite stercorale terminale.")}
    """,
    pitfalls=[
        "L'absence de défense ou de contracture abdominale au stade précoce ne doit JAMAIS faire écarter le diagnostic d'ischémie mésentérique chez un sujet à risque.",
        "Tout patient âgé ou arythmique consultant pour une douleur abdominale violente inexpliquée avec abdomen souple doit avoir un angioscanner abdominal et un dosage des lactates.",
        "Ne jamais utiliser de vasopresseurs alpha-purs (qui aggravent l'ischémie splanchnique) sauf en cas de collapsus majeur."
    ]
)

# 30. Appendicite Aiguë Compliquée
add_fiche(
    fid="fiche_urgence_appendicite_aigue",
    slug="appendicite-aigue-compliquee-abces-plastron",
    title="Fiche Urgence : 30. Appendicite Aiguë Compliquée (Abcès & Plastron)",
    spec_id="chirurgie",
    spec_name="Chirurgie Générale & Viscérale",
    cat="Urgence Chirurgicale",
    read_time="5 min",
    takeaways=[
        "Douleur débutant souvent en péri-ombilical puis se fixant en fosse iliaque droite (point de McBurney).",
        "Défense pariétale localisée, douleur à la décompression brutale de la FIG (signe de Rovsing) et à la flexion de la cuisse (signe du Psoas).",
        "Plastron appendiculaire : masse ferme mal limitée, douloureuse de la FID, englobant les anses du grêle et le grand épiploon.",
        "Échographie abdominale chez l'enfant et la femme jeune (diamètre > 6 mm non compressible) ; Scanner abdomino-pelvien injecté chez l'adulte."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Formes Topographiques Trompeuses", "• <strong>Rétro-cæcale :</strong> Douleur lombaire droite mimant une colique néphrétique ou une pyélonéphrite (psoïtis au premier plan).<br>• <strong>Pelvienne :</strong> Signes urinaires (pollakiurie, dysurie) et rectaux (ténesme, faux besoins) avec douleur exquise au toucher rectal.<br>• <strong>Sous-hépatique :</strong> Mime une cholécystite aiguë.<br>• <strong>Méso-cœliaque :</strong> Mime une occlusion fébrile du grêle.", "blue")}
      {make_card("2. Stratégie selon le Stade Évolutif", "• <strong>Appendicite aiguë simple / péritonite :</strong> Appendicectomie laparoscopique d'urgence + antibioprophylaxie.<br>• <strong>Abcès appendiculaire :</strong> Drainage percutané sous guidage échographique/scanner + antibiothérapie IV.<br>• <strong>Plastron appendiculaire constitué :</strong> Traitement médical premier (antibiothérapie IV + repos digestif) puis appendicectomie à froid différée à 2-3 mois.", "emerald")}
    </div>
    {make_alert("Éliminer la Grossesse Extra-Utérine en Urgence", "Chez TOUTE femme en âge de procréer présentant une douleur de la fosse iliaque droite, le dosage systématique des bêta-hCG plasmatiques ou urinaires est obligatoire pour éliminer une GEU rompue avant toute chirurgie !")}
    """,
    pitfalls=[
        "Le toucher rectal n'est plus systématique chez l'adulte typique, mais reste capital pour détecter une appendicite pelvienne ou une péritonite du Douglas.",
        "Chez la femme enceinte, l'appendice est refoulé vers le haut et l'extérieur par l'utérus gravide (douleur sous-hépatique et de l'hypochondre droit au 3e trimestre).",
        "Opérer en urgence un plastron appendiculaire vrai est une faute technique majeure (risque élevé de plaies iatrogènes d'anses grêles fragiles et de fistules digestives postopératoires)."
    ]
)

# ==============================================================================
# MODULE 6: ENDOCRINOLOGIE & MÉTABOLISME (4 FICHES)
# ==============================================================================

# 31. Acidocétose Diabétique
add_fiche(
    fid="fiche_urgence_acidocetose_diabetique",
    slug="acidocetose-diabetique-severe-insuline-potassium",
    title="Fiche Urgence : 31. Acidocétose Diabétique Sévère",
    spec_id="endocrino",
    spec_name="Endocrinologie - Diabétologie",
    cat="Urgence Métabolique",
    read_time="6 min",
    takeaways=[
        "Triade diagnostique : Hyperglycémie (> 2.5 g/L / 14 mmol/L) + Cétonémie (> 3 mmol/L ou cétonurie ++/+++) + Acidose métabolique (pH < 7.30, HCO3- < 15 mmol/L).",
        "Respiration ample et profonde de Kussmaul avec odeur acétonique de l'haleine (odeur de pomme reinette).",
        "1er geste thérapeutique salvateur : RÉHYDRATATION SALÉE MASSIVE (Sérum physiologique 0.9%).",
        "Insulinothérapie IV continue (0.1 UI/kg/h d'insuline rapide) DÉBUTÉE UNIQUEMENT SI LA KALIÉMIE EST > 3.3 mmol/L !"
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Protocole de Réhydratation IV", "Déficit hydrique moyen de 5 à 8 Litres :<br>• H1 : 1000 mL de NaCl 0.9% en 1 heure.<br>• H2-H4 : 500 mL/h de NaCl 0.9%.<br>• Dès que la glycémie passe sous 2.5 g/L : <strong>Ajout impératif de Sérum Glucosé à 5% ou 10%</strong> (G5% ou G10%) pour éviter l'hypoglycémie tout en poursuivant l'insuline pour éteindre la cétogenèse.", "indigo")}
      {make_card("2. Gestion Vitale du Potassium (K+)", "L'insuline fait entrer le potassium dans les cellules :<br>• <strong>K+ < 3.3 mmol/L :</strong> NE PAS DÉBUTER L'INSULINE ! Recharger d'abord en potassium (KCl 2-3 g/h IV).<br>• <strong>K+ entre 3.3 et 5.0 mmol/L :</strong> Débuter l'insuline ET apporter 1 à 2 g de KCl par litre de perfusion.<br>• <strong>K+ > 5.0 mmol/L :</strong> Débuter l'insuline sans KCl, contrôler à H2.", "rose")}
    </div>
    {make_alert("Danger Mortel : L'Arrêt Prématuré de l'Insuline", "L'insuline ne sert pas seulement à baisser la glycémie, elle est le seul frein biologique à la lipolyse et à la cétogenèse. Ne jamais arrêter l'insuline quand la glycémie se normalise : perfuser du glucosé en parallèle et maintenir l'insuline jusqu'à disparition complète de la cétonémie (bicarbonates > 18 mmol/L) !")}
    """,
    pitfalls=[
        "Débuter l'insuline chez un patient dont le potassium est < 3.3 mmol/L peut déclencher un arrêt cardiaque par hypokaliémie foudroyante !",
        "Les bicarbonates de sodium sont formellement contre-indiqués en routine (risque d'acidose paradoxale du LCR, d'hypokaliémie et d'hypoxie tissulaire) ; réservés aux pH extrêmes < 6.90.",
        "Chez l'enfant et l'adolescent, une baisse trop rapide de l'osmolarité plasmatique (> 3 mOsm/kg/h) expose au risque mortel d'œdème cérébral."
    ]
)

# 32. Syndrome d'Hyperglycémie Hyperosmolaire (HHS)
add_fiche(
    fid="fiche_urgence_syndrome_hyperosmolaire",
    slug="syndrome-hyperglycemie-hyperosmolaire-coma-hhs",
    title="Fiche Urgence : 32. Syndrome d'Hyperglycémie Hyperosmolaire (HHS)",
    spec_id="endocrino",
    spec_name="Endocrinologie - Diabétologie",
    cat="Urgence Métabolique",
    read_time="6 min",
    takeaways=[
        "Complication métabolique gravissime survenant typiquement chez le diabétique de type 2 âgé et déshydraté (mortalité 15-20%).",
        "Critères biologiques : Glycémie majeure > 6 g/L (33 mmol/L) + Osmolarité plasmatique efficace > 320 mOsm/kg + pH > 7.30 (pas d'acidose sévère) + Cétonémie minime ou absente.",
        "Déficit hydrique massif (8 à 12 Litres) avec déshydratation intracellulaire et extracellulaire globale.",
        "Réhydratation prudente et progressive au sérum salé 0.9% + Anticoagulation préventive curative (risque thrombotique majeur)."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Calcul de l'Osmolarité Efficace", "<strong>Osmolarité plasmatique calculée :</strong><br>Osm = 2 x [Na+] + Glycémie (en mmol/L).<br>• Dans le HHS, elle dépasse constamment 320 mOsm/kg.<br>• Calcul du sodium corrigé (formule de Katz) :<br>Na_corrigé = Na_mesuré + 0.3 x (Glycémie en mmol/L - 5).", "blue")}
      {make_card("2. Protocole Réanimatoire Spécifique", "• <strong>Réhydratation :</strong> Sérum salé 0.9% (1 L sur H1, puis 500 mL/h). Correction de la moitié du déficit sur les 24 premières heures.<br>• <strong>Insulinothérapie :</strong> Faible dose (0.05 UI/kg/h), débutée APRÈS expansion volémique.<br>• <strong>Anticoagulation par HBPM :</strong> Systématique dès l'admission en raison de l'hyperviscosité sanguine extrême.", "purple")}
    </div>
    {make_alert("Recherche Systématique du Facteur Déclenchant", "Le HHS n'arrive jamais par hasard : dans plus de 80% des cas, il est déclenché par une infection sévère occulte (pneumonie, infection urinaire, gangrène de pied), un AVC, un IDM ou l'arrêt des apports hydriques chez un grabataire dépendant.")}
    """,
    pitfalls=[
        "Ne jamais baisser la glycémie trop vite : la chute brutale de l'osmolarité extracellulaire entraîne un flux d'eau vers les neurones avec œdème cérébral et collapsus intravasculaire.",
        "La natrémie mesurée est faussement basse en raison de l'hyperglycémie (effet osmotique) : toujours calculer le sodium corrigé de Katz !",
        "L'insuline seule sans réhydratation préalable aggrave le collapsus hémodynamique en transférant le glucose et l'eau du secteur vasculaire vers le secteur intracellulaire."
    ]
)

# 33. Insuffisance Surrénale Aiguë
add_fiche(
    fid="fiche_urgence_insuffisance_surrenale_aigue",
    slug="insuffisance-surrenale-aigue-crise-addisonienne",
    title="Fiche Urgence : 33. Insuffisance Surrénale Aiguë (Crise Addisonienne)",
    spec_id="endocrino",
    spec_name="Endocrinologie - Diabétologie",
    cat="Urgence Endocrinienne",
    read_time="5 min",
    takeaways=[
        "Urgence vitale absolue : Décompensation aiguë d'une maladie d'Addison ou interruption brutale d'une corticothérapie au long cours.",
        "Tableau clinique : Collapsus cardiovasculaire résistant au remplissage et aux catécholamines + Douleurs abdominales aiguës mimant un abdomen chirurgical + Vomissements/Diarrhées.",
        "Anomalies biologiques caractéristiques : Hyponatrémie + Hyperkaliémie + Hypoglycémie + Hémoconcentration.",
        "Geste salvateur immédiat : Hydrocortisone 100 mg IVD SANS ATTENDRE le résultat des dosages hormonaux !"
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Schéma d'Hormonothérapie Substitutive", "• <strong>Bolus initial immédiat :</strong> Hydrocortisone 100 mg en IV direct (ou IM si pas de VVP).<br>• <strong>Perfusion continue :</strong> 100 mg toutes les 6 à 8 heures (soit 300 à 400 mg/24h) en IVSE.<br>• Décroissance progressive après stabilisation sur 4-5 jours vers la dose orale d'entretien (20-30 mg/j).<br>• L'activité minéralocorticoïde de l'hydrocortisone à forte dose est suffisante (pas besoin de Fludrocortisone au début).", "emerald")}
      {make_card("2. Réanimation Hydro-Électrolytique", "• Perfusion de <strong>Sérum Salé Isotonique (NaCl 0.9%) + Sérum Glucosé (G5% ou G10%)</strong> pour corriger à la fois l'hypovolémie, l'hyponatrémie et l'hypoglycémie.<br>• Volume : 3 à 4 Litres au cours des 24 premières heures.<br>• <strong>Contre-indication formelle :</strong> Pas de potassium dans les perfusions !", "rose")}
    </div>
    {make_alert("Prélèvement Sanguin Pré-Thérapeutique Éclair", "Réaliser si possible un tube sec pour dosage du cortisol et de l'ACTH juste avant l'injection d'hydrocortisone, MAIS NE JAMAIS RETARDER l'administration de l'hormone de plus d'une minute si le prélèvement pose problème !")}
    """,
    pitfalls=[
        "Ne jamais attendre le résultat du dosage du cortisol sérique pour injecter l'Hydrocortisone (le résultat met plusieurs heures, le patient décède en quelques minutes de choc cardiocirculatoire).",
        "Toute douleur abdominale aiguë avec défense chez un patient addisonien ou traité par corticoïdes doit faire évoquer en priorité une ISA avant d'envisager une laparotomie chirurgicale blanche !",
        "Les médicaments sédatifs et les anesthésiques peuvent précipiter un collapsus fatal chez ces patients en déplétion cortisolo-dépendante."
    ]
)

# 34. Crise Aiguë Thyréotoxique
add_fiche(
    fid="fiche_urgence_crise_thyreotoxique",
    slug="crise-aigue-thyreotoxique-orage-thyroidien",
    title="Fiche Urgence : 34. Crise Aiguë Thyréotoxique (Orage Thyroïdien)",
    spec_id="endocrino",
    spec_name="Endocrinologie - Diabétologie",
    cat="Urgence Endocrinienne",
    read_time="5 min",
    takeaways=[
        "Exacerbation extrême d'une hyperthyroïdie engageant le pronostic vital (mortalité 20-30%), quantifiée par le Score de Burch-Wartofsky (≥ 45 points).",
        "Manifestations cardinales : Hyperthermie maligne (> 39-40°C), tachycardie sinusale ou FA rapide (> 140 bpm), agitation psychomotrice extrême/delirium, ictère.",
        "Quadruple blocage thérapeutique immédiat : Bêtabloquants (Propranolol) + Antithyroïdiens de synthèse (PTU) + Corticoïdes IV + Solution d'Iode.",
        "Facteurs déclenchants fréquents : Sepsis intercurrent, chirurgie, injection de produit de contraste iodé, arrêt brutal des antithyroïdiens."
    ],
    html_body=f"""
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {make_card("1. Schéma des 4 Piliers Thérapeutiques", "1. <strong>Bêtabloquant à forte dose :</strong> Propranolol (Avlocardyl) 60-80 mg toutes les 4-6h PO ou 1-2 mg IV lente (inhibe les récepteurs bêta et bloque la conversion T4->T3).<br>2. <strong>Antithyroïdien de synthèse :</strong> Propylthiouracile (PTU) 200 mg toutes les 4h par sonde gastrique (ou Néomercazole).<br>3. <strong>Corticothérapie IV :</strong> Hydrocortisone 100 mg toutes les 8h (freine la conversion T4->T3 et prévient l'insuffisance surrénale relative).<br>4. <strong>Iode minéral (Lugol) :</strong> Administré 1 heure APRÈS l'ATS (effet Wolff-Chaikoff).", "purple")}
      {make_card("2. Mesures Réanimatoires Associées", "• Refroidissement externe actif (poches de glace, couverture réfrigérante).<br>• Antipyrétiques : Paracétamol.<br>• <strong>CONTRE-INDICATION FORMELLE :</strong> Acide acétylsalicylique (Aspirine) !<br>• Réhydratation hydro-électrolytique massive par glucosé et sérum physiologique.", "blue")}
    </div>
    {make_alert("Danger Mortel : L'Aspirine est Formellement Proscrite !", "L'aspirine déplace massivement les hormones thyroïdiennes (T4 et T3) de leurs protéines de transport plasmatiques (TBG), augmentant brutalement la fraction libre active circulante et aggravant dramatiquement la crise thyrotoxique !")}
    """,
    pitfalls=[
        "Ne jamais donner d'iode (Lugol) avant l'antithyroïdien de synthèse : administré seul, l'iode sert de substrat à la glande et majore la tempête hormonale !",
        "L'aspirine est strictement contre-indiquée pour faire baisser la fièvre dans l'orage thyroïdien (utiliser uniquement le paracétamol).",
        "Une tachyarythmie atriale inexpliquée résistante aux digitaliques et aux bêtabloquants usuels chez une femme jeune doit faire doser la TSH en urgence."
    ]
)

print(f"Part 2 ready: {len(FICHES_PART2)} fiches loaded.")
