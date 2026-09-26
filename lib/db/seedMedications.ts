import { Medication } from '@/types';

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med_amox_clav',
    dci: 'Amoxicilline + Acide Clavulanique',
    commercialNames: ['Augmentin', 'Clavulin', 'Amoclan', 'Curam', 'Klavox'],
    therapeuticClass: 'Antibiotique - Bêta-lactamine / Pénicilline A associée à un inhibiteur de bêta-lactamases',
    dosageForms: ['Comprimés 1g/125mg', 'Sachet poudre suspension orale enfant', 'Flacon injectable IV 1g/200mg'],
    indications: [
      'Pneumopathies bactériennes communautaires',
      'Infections ORL sévères (sinusite aiguë maxillaire bloquée, otite moyenne aiguë récidivante)',
      'Infections cutanées et des tissus mous (érysipèle surinfecté, morsures)',
      'Infections urinaires du post-partum et bactériuries gravidiques'
    ],
    contraindications: [
      'Allergie avérée aux bêta-lactamines (pénicillines, céphalosporines)',
      'Antécédent d\'atteinte hépatique (ictère cholestatique) sous amoxicilline/acide clavulanique',
      'Mononucléose infectieuse (risque d\'exanthème maculo-papuleux majeur sous amox)'
    ],
    interactions: [
      'Méthotrexate (augmentation de la toxicité hématologique)',
      'Allopurinol (majore le risque d\'éruption cutanée)',
      'Anticoagulants oraux AVK (surveillance renforcée de l\'INR)'
    ],
    standardPosology: 'Adulte : 1 g x 3 fois par jour au cours des repas (dose max amoxicilline 3g/j). Enfant : 80 mg/kg/j en 3 prises.',
    algerianCommercialStatus: 'Disponible en pharmacie',
    notes: 'Préférer la prise en tout début de repas pour minimiser les troubles digestifs (nausées, diarrhées dues à l\'acide clavulanique).'
  },
  {
    id: 'med_furosemide',
    dci: 'Furosémide',
    commercialNames: ['Lasilix', 'Lasilix Faible', 'Lasilix Retard', 'Furosémide Générique Saidal'],
    therapeuticClass: 'Diurétique de l\'anse de Henle',
    dosageForms: ['Comprimés sécables 20 mg et 40 mg', 'Comprimés 500 mg (insuffisance rénale sévère)', 'Ampoules injectables IV 20 mg / 2 mL'],
    indications: [
      'Œdème Aigu du Poumon (OAP) cardiogénique en urgence',
      'Insuffisance cardiaque congestive globale',
      'Syndromes néphrotiques et cirrhose ascitique',
      'Poussées d\'hypertension artérielle avec surcharge volémique'
    ],
    contraindications: [
      'Hypovolémie vraie ou déshydratation globale sévère',
      'Encéphalopathie hépatique (aggravation par alcalose hypokaliémique)',
      'Obstacle mécanique complet des voies urinaires (rétention avec globe)'
    ],
    interactions: [
      'Médicaments allongeant le QT (risque de torsades de pointes favorisé par l\'hypokaliémie)',
      'Aminosides et dérivés du platine (majoration de l\'ototoxicité et néphrotoxicité)',
      'AINS (diminution de l\'efficacité diurétique et risque d\'IRA hémodynamique)'
    ],
    standardPosology: 'OAP aigu : 40 à 80 mg en bolus IV direct, répété si besoin. Entretien oral : 20 à 80 mg le matin à jeun.',
    algerianCommercialStatus: 'Disponible en pharmacie',
    notes: 'Surveiller systématiquement la kaliémie et la créatininémie. Associer un apport potassique ou un diurétique épargneur si besoin.'
  },
  {
    id: 'med_enoxaparine',
    dci: 'Énoxaparine Sodique',
    commercialNames: ['Lovenox', 'Clexane', 'Inhixa'],
    therapeuticClass: 'Antithrombotique - Héparine de Bas Poids Moléculaire (HBPM)',
    dosageForms: ['Seringues préremplies 2000 UI (0.2 mL), 4000 UI (0.4 mL), 6000 UI (0.6 mL), 8000 UI (0.8 mL), 10 000 UI (1.0 mL)'],
    indications: [
      'Prophylaxie de la maladie thromboembolique veineuse en chirurgie et en milieu médical',
      'Traitement curatif de la thrombose veineuse profonde (TVP) et de l\'embolie pulmonaire non grave',
      'Syndrome coronarien aigu (SCA ST+ et SCA non ST+)'
    ],
    contraindications: [
      'Antécédent de thrombocytopénie induite par l\'héparine (TIH de type II immune)',
      'Saignement actif majeur ou lésion organique à risque hémorragique',
      'Insuffisance rénale sévère avec Clairance créatinine < 30 mL/min à dose curative (utiliser l\'HNF)'
    ],
    interactions: [
      'Antiagrégants plaquettaires (Aspirine, Clopidogrel)',
      'Anticoagulants oraux directs (AOD) et AVK',
      'AINS systémiques'
    ],
    standardPosology: 'Prophylaxie : 4000 UI (0.4 mL) SC 1x/j. Curatif : 100 UI/kg (0.1 mL/10 kg) SC toutes les 12 heures.',
    algerianCommercialStatus: 'Disponible en pharmacie',
    notes: 'Surveillance systématique des plaquettes 2 fois par semaine pendant 3 semaines pour dépister la TIH.'
  },
  {
    id: 'med_salbutamol',
    dci: 'Salbutamol',
    commercialNames: ['Ventoline', 'Asthalin', 'Salbutamol Saidal'],
    therapeuticClass: 'Bronchodilatateur - Bêta-2 agoniste à courte durée d\'action (SABA)',
    dosageForms: ['Aérosol doseur pressurisé 100 µg/bouffée', 'Solution pour nébulisation par air comprimé/O2 5 mg/2 mL'],
    indications: [
      'Traitement symptomatique de la crise d\'asthme aiguë',
      'Prévention de l\'asthme d\'effort (inhalation 15 min avant l\'exercice)',
      'Exacerbations de broncho-pneumopathie chronique obstructive (BPCO)'
    ],
    contraindications: [
      'Hypersensibilité au principe actif',
      'Intolérance aux bêta-2 stimulants (tachycardie menaçante)'
    ],
    interactions: [
      'Bêtabloquants non cardiosélectifs (antagonisme direct)',
      'Diurétiques hypokaliémiants (risque accru d\'hypokaliémie)'
    ],
    standardPosology: 'Crise légère : 1 à 2 bouffées à répéter. Crise sévère : 5 mg en nébulisation sous 6 à 8 L d\'O2 toutes les 20 minutes.',
    algerianCommercialStatus: 'Disponible en pharmacie',
    notes: 'Rassurer le patient sur la survenue fréquente de tremblements fins des extrémités et d\'une tachycardie réactionnelle bénigne.'
  },
  {
    id: 'med_sacubitril_valsartan',
    dci: 'Sacubitril + Valsartan (ARNI)',
    commercialNames: ['Entresto', 'Uperio'],
    therapeuticClass: 'Inhibiteur du récepteur de l\'angiotensine et de la néprilysine (ARNI)',
    dosageForms: ['Comprimés pelliculés 24mg/26mg, 49mg/51mg, 97mg/103mg'],
    indications: [
      'Insuffisance cardiaque chronique symptomatique à fraction d\'éjection réduite (&le; 40%) en remplacement d\'un IEC ou ARA2'
    ],
    contraindications: [
      'Antécédent d\'angio-œdème (œdème de Quincke) sous IEC ou ARA2',
      'Association concomitante avec un IEC (respecter un arrêt strict de 36 heures entre les deux !)',
      'Grossesse et insuffisance hépatique sévère'
    ],
    interactions: [
      'Inhibiteurs de l\'enzyme de conversion (risque majeur d\'angio-œdème fatal)',
      'Épargneurs de potassium et suppléments potassiques (risque d\'hyperkaliémie)'
    ],
    standardPosology: 'Débuter à 49/51 mg x 2/j, doubler la dose toutes les 2 à 4 semaines vers la cible de 97/103 mg x 2/j selon la tolérance tensionnelle.',
    algerianCommercialStatus: 'Disponible en pharmacie',
    notes: 'Attention : le Sacubitril élève artificiellement le taux de BNP ! Utiliser impérativement le NT-proBNP pour le suivi biologique.'
  },
  {
    id: 'med_ceftriaxone',
    dci: 'Ceftriaxone',
    commercialNames: ['Rocéphine', 'Cefriax', 'Ceftriaxone Saidal', 'Triaxone'],
    therapeuticClass: 'Antibiotique - Céphalosporine de 3ème génération (C3G) injectable',
    dosageForms: ['Flacon 500 mg, 1g et 2g injectable IV / IM'],
    indications: [
      'Méningites bactériennes aiguës à pneumocoque ou méningocoque (forte posologie)',
      'Pneumopathies bactériennes sévères du sujet âgé ou comorbidités',
      'Infections urinaires hautes (pyélonéphrite aiguë grave ou compliquée)',
      'Septicémies et bactériémies',
      'Fièvre typhoïde et infections à Salmonella'
    ],
    contraindications: [
      'Allergie avérée aux céphalosporines ou choc anaphylactique à la pénicilline',
      'Nouveau-né hyperbilirubinémique ou prématuré (risque d\'ictère nucléaire par déplacement de la bilirubine)',
      'Co-administration IV chez le nouveau-né avec des solutions contenant du calcium (Ceftriaxone-Calcium précipite !)'
    ],
    interactions: [
      'Solutions de Calcium en IV (Cipralan, Ringer Lactate dans la même tubulure : risque de précipitation)'
    ],
    standardPosology: 'Infection sévère adulte : 1 à 2 g/j en 1 seule injection IVL ou IM. Méningite aiguë : 70 à 100 mg/kg/j (max 4 g/j) IV.',
    algerianCommercialStatus: 'Disponible en pharmacie',
    notes: 'Demi-vie longue permettant une administration unique quotidienne très pratique en ambulatoire ou en HAD.'
  },
  {
    id: 'med_paracetamol_iv',
    dci: 'Paracétamol Injectable',
    commercialNames: ['Perfalgan', 'Paracétamol IV Saidal', 'Infulgan'],
    therapeuticClass: 'Antalgique / Antipyrétique - Aniline',
    dosageForms: ['Flacon IV 100 mL (10 mg/mL soit 1000 mg/100 mL)', 'Flacon pédiatrique 50 mL (500 mg/50 mL)'],
    indications: [
      'Traitement de courte durée des douleurs modérées (post-opératoire immédiat)',
      'Traitement de courte durée de la fièvre quand la voie orale est impossible'
    ],
    contraindications: [
      'Insuffisance hépatocellulaire sévère',
      'Hypersensibilité au paracétamol ou au chlorhydrate de propacétamol'
    ],
    interactions: [
      'Médicaments hépatotoxiques et inducteurs enzymatiques (alcoolisme chronique, anti-épileptiques)'
    ],
    standardPosology: 'Adulte > 50 kg : 1g en perfusion IV de 15 minutes, à renouveler toutes les 6 heures (max 4g/j). Sujet fragile ou < 50 kg : 15 mg/kg par prise (max 3g/j).',
    algerianCommercialStatus: 'Usage hospitalier strict',
    notes: 'En cas de surdosage accidentel ou d\'intoxication aiguë, administrer la N-acétylcystéine (Fluimucil) en urgence !'
  },
  {
    id: 'med_amiodarone',
    dci: 'Amiodarone',
    commercialNames: ['Cordarone', 'Amiodarone Saidal', 'Amio-Ritme'],
    therapeuticClass: 'Anti-arythmique de classe III de Vaughan-Williams',
    dosageForms: ['Comprimés sécables 200 mg', 'Ampoules IV 150 mg / 3 mL'],
    indications: [
      'Troubles du rythme auriculaire (réduction et prévention des récidives de Fibrillation Atriale)',
      'Troubles du rythme ventriculaire graves (Tachycardie ventriculaire, prévention de la mort subite)',
      'Arrêt cardiorespiratoire sur TV/FV réfractaire aux chocs électriques'
    ],
    contraindications: [
      'Bradycardie sinusale sévere et bloc sino-atrial non appareillé',
      'Dysthyroïdies (hyperthyroïdie ou hypothyroïdie avérée)',
      'Allergie à l\'iode ou à l\'amiodarone',
      'Grossesse (sauf urgence vitale) et allaitement'
    ],
    interactions: [
      'Médicaments donnant des torsades de pointes (Sotalol, Érythromycine IV, Halopéridol)',
      'AVK / Sintrom (augmentation massive de l\'INR, réduire la dose d\'AVK de 50%)',
      'Digoxine (doublement des taux plasmatiques de digoxine)'
    ],
    standardPosology: 'Orale : Dose de charge 600 mg/j pendant 8-10 jours puis entretien 200 mg/j. Urgence IV : 300 mg en bolus dans 20 mL de G5%.',
    algerianCommercialStatus: 'Disponible en pharmacie',
    notes: 'Surveiller le bilan thyroïdien (TSH), la radiographie pulmonaire (risque de pneumopathie interstitielle médicamenteuse à l\'iode) et le bilan hépatique.'
  },
  {
    id: 'med_acenocoumarol',
    dci: 'Acénocoumarol',
    commercialNames: ['Sintrom 4 mg', 'Mini-Sintrom 1 mg'],
    therapeuticClass: 'Anticoagulant oral - Antivitamine K (AVK) dérivé de la coumarine',
    dosageForms: ['Comprimés quadruples sécables 4 mg', 'Comprimés 1 mg'],
    indications: [
      'Prévention des complications thromboemboliques des cardiopathies emboligènes (Fibrillation Atriale, prothèses valvulaires mécaniques)',
      'Traitement des thromboses veineuses profondes et embolies pulmonaires'
    ],
    contraindications: [
      'Syndrome hémorragique évolutif ou risque hémorragique organique élevé',
      'Grossesse (1er et 3ème trimestre : tératogénicité et risque hémorragique fœtal)',
      'Association au Miconazole (Gel buccal Daktarin : surdosage hémorragique majeur)'
    ],
    interactions: [
      'Miconazole buccal (Contre-indication absolue ! INR > 10)',
      'AINS, Aspirine à dose antalgique',
      'Antibiotiques à large spectre (modification de la flore intestinale fabricant la vitamine K)'
    ],
    standardPosology: 'Dose d\'adaptation guidée impérativement par l\'INR. Cible INR : 2.0 à 3.0 (2.5 à 3.5 si valence prothétique mécanique).',
    algerianCommercialStatus: 'Disponible en pharmacie',
    notes: 'En cas de surdosage sans saignement (INR > 5), administrer de la Vitamine K1 par voie orale selon les recommandations.'
  }
];

