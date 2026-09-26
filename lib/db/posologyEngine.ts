export interface PharmacologicalProfile {
  therapeuticClass: string;
  indications: string[];
  contraindications: {
    absolute: string[];
    relative: string[];
  };
  sideEffects: {
    frequent: string[];
    severe: string[];
  };
  interactions: {
    forbidden: string[];
    precaution: string[];
  };
  pregnancySafety: {
    category: 'A' | 'B' | 'C' | 'D' | 'X';
    cratAdvice: string;
  };
  posologyRules: {
    pediatricMgPerKgPerDay?: number;
    pediatricMaxDoseMg?: number;
    adultStandardDosePerTakeMg: number;
    adultTakesPerDay: number;
    adultMaxDosePerDayMg: number;
    renalAdaptation: {
      dfg30to60: string;
      dfgLessThan30: string;
    };
    unitType: 'mg' | 'UI' | 'g' | 'µg' | 'mL';
    dosingAdvice: string;
  };
}

export const CLASS_PHARMACOLOGICAL_PROFILES: Record<string, PharmacologicalProfile> = {
  'Anti-infectieux': {
    therapeuticClass: 'Anti-infectieux / Antibiotiques',
    indications: ['Infections bactériennes communautaires et hospitalières', 'Otites, Sinusites, Pneumopathies', 'Infections urinaires et cutanées'],
    contraindications: {
      absolute: ['Allergie avérée aux bêta-lactamines ou Macrolides', 'Antécédent d\'anaphylaxie ou de syndrome de Lyell'],
      relative: ['Mononucléose infectieuse (pour les pénicillines)', 'Insuffisance rénale sévère non adaptée']
    },
    sideEffects: {
      frequent: ['Troubles digestifs (diarrhée, nausées, gastralgies)', 'Candidose buccale ou vaginite'],
      severe: ['Choc anaphylactique', 'Colite pseudo-membraneuse à Clostridioides difficile', 'Syndrome de Stevens-Johnson']
    },
    interactions: {
      forbidden: ['Méthotrexate à forte dose (surveillance hématologique)', 'Allopurinol (majoration éruption cutanée)'],
      precaution: ['Anticoagulants oraux AVK (surveillance INR)', 'Contraceptifs oraux (diminution d\'efficacité potentielle)']
    },
    pregnancySafety: {
      category: 'B',
      cratAdvice: 'Utilisation possible à tous les trimestres de la grossesse si justifiée cliniquement.'
    },
    posologyRules: {
      pediatricMgPerKgPerDay: 50,
      pediatricMaxDoseMg: 3000,
      adultStandardDosePerTakeMg: 1000,
      adultTakesPerDay: 3,
      adultMaxDosePerDayMg: 3000,
      renalAdaptation: {
        dfg30to60: 'Réduire la dose quotidienne de 25% ou espacer les prises.',
        dfgLessThan30: 'Réduire la dose de 50% et espacer les prises toutes les 12 à 24 heures.'
      },
      unitType: 'mg',
      dosingAdvice: 'Prendre de préférence en début de repas pour diminuer les troubles digestifs.'
    }
  },

  'Anti-infectieux systémiques & Vaccins': {
    therapeuticClass: 'Anti-infectieux systémiques & Vaccins',
    indications: ['Infections bactériennes ou virales systémiques', 'Sepsis, Méningites, Pyélonéphrites', 'Prophylaxie vaccinale'],
    contraindications: {
      absolute: ['Allergie connue au principe actif ou excipients', 'Fièvre aiguë évolutive (pour la vaccination)'],
      relative: ['Insuffisance rénale ou hépatique sévère']
    },
    sideEffects: {
      frequent: ['Douleur au point d\'injection', 'Syndrome pseudo-grippal (fièvre, courbatures)', 'Céphalées bénignes'],
      severe: ['Réaction anaphylactique aiguë', 'Néphrotoxicité ou ototoxicité (Aminosides)']
    },
    interactions: {
      forbidden: ['Vaccins vivants atténués chez l\'immunodéprimé', 'Solutés calciques en IV directe (avec Ceftriaxone)'],
      precaution: ['Immunosuppresseurs et corticoïdes à forte dose']
    },
    pregnancySafety: {
      category: 'B',
      cratAdvice: 'Vaccins inactivés et C3G autorisés. Éviter les vaccins vivants atténués.'
    },
    posologyRules: {
      pediatricMgPerKgPerDay: 75,
      pediatricMaxDoseMg: 4000,
      adultStandardDosePerTakeMg: 1000,
      adultTakesPerDay: 2,
      adultMaxDosePerDayMg: 4000,
      renalAdaptation: {
        dfg30to60: 'Adaptation de dose selon le DFG. Espacer à 12h-24h.',
        dfgLessThan30: 'Diminuer la posologie de 50%. Monitoring des taux résiduels (Aminosides/Glycopeptides).'
      },
      unitType: 'mg',
      dosingAdvice: 'Perfusion IV lente ou IM profonde sous surveillance médicale.'
    }
  },

  'Système cardiovasculaire': {
    therapeuticClass: 'Système cardiovasculaire',
    indications: ['Hypertension artérielle (HTA)', 'Insuffisance cardiaque congestive', 'Maladie coronarienne & Angor', 'Troubles du rythme cardiaque'],
    contraindications: {
      absolute: ['Hypotension artérielle sévère (PAS < 90 mmHg)', 'Choc cardiogénique', 'Bloc atrio-ventriculaire de 2ème ou 3ème degré non appareillé'],
      relative: ['Sténose bilatérale des artères rénales (pour IEC/ARA2)', 'Hyperkaliémie > 5.5 mmol/L']
    },
    sideEffects: {
      frequent: ['Hypotension orthostatique', 'Bradycardie sinusale', 'Toux sèche persistante (IEC)', 'Céphalées et œdèmes des membres inférieurs'],
      severe: ['Bloc atrio-ventriculaire complet', 'Hyperkaliémie menaçante', 'Angio-œdème / Œdème de Quincke (IEC/ARNI)']
    },
    interactions: {
      forbidden: ['Association IEC + ARNI (Sacubitril) : respecter arrêt de 36h !', 'Anti-arythmiques de classe I + classe III (risque torsades)'],
      precaution: ['Diurétiques épargneurs de potassium & suppléments potassiques', 'AINS (diminution de l\'effet anti-hypertenseur et risque d\'IRA)']
    },
    pregnancySafety: {
      category: 'D',
      cratAdvice: 'CONTRE-INDIQUÉ aux 2ème et 3ème trimestres (IEC/ARA2 : toxicité fœtale et néonatale). Préférer Méthyldopa ou Labétalol.'
    },
    posologyRules: {
      pediatricMgPerKgPerDay: 0.5,
      pediatricMaxDoseMg: 20,
      adultStandardDosePerTakeMg: 10,
      adultTakesPerDay: 1,
      adultMaxDosePerDayMg: 40,
      renalAdaptation: {
        dfg30to60: 'Débuter à demi-dose. Surveillance kaliémie et créatininémie à J7.',
        dfgLessThan30: 'Titration prudente. Réduire la dose de 50% et surveiller strictement la fonction rénale.'
      },
      unitType: 'mg',
      dosingAdvice: 'Prendre le matin au petit-déjeuner. Ne pas interrompre brutalement le traitement (risque d\'effet rebond).'
    }
  },

  'Métabolisme, Diabète & Nutrition': {
    therapeuticClass: 'Métabolisme, Diabète & Nutrition',
    indications: ['Diabète de type 2 et type 1', 'Dyslipidémies & Hypercholestérolémie', 'Carences nutritionnelles & Électrolytes'],
    contraindications: {
      absolute: ['Acidocétose diabétique aiguë', 'Insuffisance rénale sévère DFG < 30 mL/min (Metformine)', 'Insuffisance hépatique grave'],
      relative: ['Insuffisance rénale modérée (ajustement requis)', 'Alcoolisme aigu (risque d\'acidose lactique)']
    },
    sideEffects: {
      frequent: ['Troubles digestifs (nausées, diarrhée, ballonnements)', 'Hypoglycémie (Sulfamides, Insuline)', 'Crampes musculaires (Statines)'],
      severe: ['Acidose lactique sous metformine', 'Rhabdomyolyse (Statines + Fibrates)', 'Pancréatite aiguë (iSGLT2 / iDPP4)']
    },
    interactions: {
      forbidden: ['Produits de contraste iodés en radiologie (suspendre Metformine 48h)', 'Fibrates + Statines à forte dose (risque myopathie)'],
      precaution: ['Bêtabloquants (masquent les signes de réveil d\'hypoglycémie)', 'Corticoïdes systémiques (hyperglycémiants)']
    },
    pregnancySafety: {
      category: 'B',
      cratAdvice: 'L\'insuline reste le traitement de référence pendant la grossesse. Stopper antidiabétiques oraux sauf avis spécialisé.'
    },
    posologyRules: {
      pediatricMgPerKgPerDay: 10,
      pediatricMaxDoseMg: 1000,
      adultStandardDosePerTakeMg: 850,
      adultTakesPerDay: 2,
      adultMaxDosePerDayMg: 3000,
      renalAdaptation: {
        dfg30to60: 'Dose max Metformine : 1000 mg/jour. Surveillance DFG tous les 3-6 mois.',
        dfgLessThan30: 'CONTRE-INDICATION à la Metformine. Basculer vers l\'Insuline ou la Linagliptine.'
      },
      unitType: 'mg',
      dosingAdvice: 'Prendre la Metformine au milieu ou à la fin des repas pour optimiser la tolérance digestive.'
    }
  },

  'Appareil digestif': {
    therapeuticClass: 'Appareil digestif (Gastro-Entérologie)',
    indications: ['Reflux Gastro-Œsophagien (RGO)', 'Ulcer gastroduodénal', 'Gastrites et œsophagites', 'Spasmes et troubles du transit'],
    contraindications: {
      absolute: ['Hypersensibilité aux Inhibiteurs de la Pompe à Protons (IPP) ou Antispasmodiques', 'Obstacle mécanique intestinal'],
      relative: ['Insuffisance hépatique sévère']
    },
    sideEffects: {
      frequent: ['Céphalées', 'Constipation ou diarrhée modérée', 'Sécheresse buccale (anticholinergiques)'],
      severe: ['Nephrite interstitielle aiguë', 'Hypomagnésémie chronique', 'Colite microscopique']
    },
    interactions: {
      forbidden: ['Clopidogrel + Oméprazole (diminution d\'efficacité du Clopidogrel, préférer Pantoprazole)', 'Atazanavir / Ketoconazole (absorption diminuée)'],
      precaution: ['Topiques gastriques & Pansements (espacer la prise de 2 heures des autres médicaments)']
    },
    pregnancySafety: {
      category: 'B',
      cratAdvice: 'L\'Oméprazole et le Pantoprazole sont utilisables pendant toute la grossesse.'
    },
    posologyRules: {
      adultStandardDosePerTakeMg: 20,
      adultTakesPerDay: 1,
      adultMaxDosePerDayMg: 40,
      renalAdaptation: {
        dfg30to60: 'Pas d\'ajustement nécessaire pour les IPP.',
        dfgLessThan30: 'Pas d\'ajustement pour les IPP. Attention aux antiacides magnésiques/aluminiques.'
      },
      unitType: 'mg',
      dosingAdvice: 'Prendre les IPP le matin à jeun 30 minutes avant le petit-déjeuner pour une efficacité maximale.'
    }
  },

  'Anti-inflammatoires & Antirhumatismaux': {
    therapeuticClass: 'Anti-inflammatoires & Antirhumatismaux (AINS)',
    indications: ['Douleurs rhumatismales & Arthrose en poussée', 'Arthrites aiguës & Goutte', 'Douleurs aiguës (dysstructions, traumatologie)'],
    contraindications: {
      absolute: ['Ulcus gastroduodénal évolutif', 'Insuffisance rénale, cardiaque ou hépatique sévère', 'A partir du début du 6ème mois de grossesse (24 SA) : DANGER MORTEL FŒTAL !'],
      relative: ['Antécédent d\'asthme induit par AINS ou Aspirine', 'Hypertension artérielle non contrôlée']
    },
    sideEffects: {
      frequent: ['Gastralgies, nausées, pyrosis', 'Rétention hydrosodée & œdèmes'],
      severe: ['Hémorragie digestive supérieure ou perforation', 'Insuffisance rénale aiguë hémodynamique', 'Fermeture prématurée du canal artériel chez le fœtus']
    },
    interactions: {
      forbidden: ['Association de 2 AINS ou AINS + Aspirine à dose antalgique', 'AINS au 3ème trimestre de grossesse (Contre-indication absolue !)'],
      precaution: ['Anticoagulants oraux (AVK, AOD) : risque hémorragique élevé', 'IEC / ARA2 / Diurétiques (syndrome de la "triple whammy" rénal)']
    },
    pregnancySafety: {
      category: 'X',
      cratAdvice: 'CONTRE-INDICATION ABSOLUE à partir de 24 semaines d\'aménorrhée (6ème mois). Risque de mort fœtale in utero.'
    },
    posologyRules: {
      pediatricMgPerKgPerDay: 10,
      pediatricMaxDoseMg: 400,
      adultStandardDosePerTakeMg: 400,
      adultTakesPerDay: 3,
      adultMaxDosePerDayMg: 1200,
      renalAdaptation: {
        dfg30to60: 'Éviter les AINS si possible ou réduire la durée au strict minimum (< 5 jours).',
        dfgLessThan30: 'CONTRE-INDICATION ABSOLUE aux AINS.'
      },
      unitType: 'mg',
      dosingAdvice: 'Prescrire impérativement la dose minimale efficace pour la durée la plus courte possible. Associer un IPP si terrain à risque gastrique.'
    }
  },

  'Antalgiques & Antipyrétiques': {
    therapeuticClass: 'Antalgiques & Antipyrétiques',
    indications: ['Douleurs d\'intensité légère à modérée', 'États fébriles & Grippe', 'Douleurs post-opératoires et traumatiques'],
    contraindications: {
      absolute: ['Insuffisance hépatocellulaire sévère', 'Hypersensibilité au paracétamol ou aux opiacés (si association)'],
      relative: ['Alcoolisme chronique ou dénutrition sévère (adapter la dose à 3g/j)']
    },
    sideEffects: {
      frequent: ['Excellente tolérance aux doses thérapeutiques', 'Constipation / Somnolence (si associé à la codéine ou tramadol)'],
      severe: ['Hépatotoxicité cytolytique aiguë grave par surdosage (> 4g/j chez l\'adulte)']
    },
    interactions: {
      forbidden: ['Hépatotoxiques majeurs à forte dose', 'Agonistes-antagonistes morphiniques avec le Tramadol'],
      precaution: ['Anticoagulants oraux AVK (surveillance INR si prise de Paracétamol 4g/j > 4 jours)']
    },
    pregnancySafety: {
      category: 'A',
      cratAdvice: 'Le Paracétamol est l\'antalgique et antipyrétique de choix pendant toute la grossesse et l\'allaitement.'
    },
    posologyRules: {
      pediatricMgPerKgPerDay: 60,
      pediatricMaxDoseMg: 2000,
      adultStandardDosePerTakeMg: 1000,
      adultTakesPerDay: 3,
      adultMaxDosePerDayMg: 4000,
      renalAdaptation: {
        dfg30to60: 'Espacer les prises de 6 heures minimum.',
        dfgLessThan30: 'Espacer les prises de 8 heures minimum. Dose max : 3g/jour.'
      },
      unitType: 'mg',
      dosingAdvice: 'Respecter impérativement un intervalle minimal de 4 heures entre les prises chez l\'adulte (6 heures chez l\'enfant).'
    }
  },

  'Sang & Hématologie': {
    therapeuticClass: 'Sang & Hématologie (Anticoagulants & Antiagrégants)',
    indications: ['Thrombose veineuse profonde (TVP) & Embolie pulmonaire', 'Prévention des AVC dans la Fibrillation Atriale', 'Syndrome Coronarien Aigu & Angioplastie'],
    contraindications: {
      absolute: ['Saignement actif incontrôlé ou lésion organique hémorragique', 'Antécédent de Thrombopénie Induite par l\'Héparine (TIH)', 'Hypertension artérielle maligne non contrôlée'],
      relative: ['Insuffisance rénale sévère (pour HBPM et AOD)', 'Troubles de l\'hémostase majeurs']
    },
    sideEffects: {
      frequent: ['Hématomes au point d\'injection', 'Épistaxis, gingivorragies'],
      severe: ['Hémorragie majeure ou intracrânienne', 'Thrombopénie induite par l\'héparine (TIH de type II)', 'Nécrose cutanée aux AVK']
    },
    interactions: {
      forbidden: ['Association de 2 anticoagulants curatifs sans chevauchement contrôlé', 'Miconazole gel buccal + AVK (surdosage hémorragique majeur)'],
      precaution: ['AINS systémiques & Aspirine à dose antalgique', 'Inhibiteurs / Inducteurs puissants du CYP3A4 / P-gp']
    },
    pregnancySafety: {
      category: 'B',
      cratAdvice: 'Les HBPM (Lovenox) sont les anticoagulants de choix pendant la grossesse. AVK contre-indiqués au 1er et 3ème trimestre.'
    },
    posologyRules: {
      pediatricMgPerKgPerDay: 1.5,
      pediatricMaxDoseMg: 100,
      adultStandardDosePerTakeMg: 100,
      adultTakesPerDay: 2,
      adultMaxDosePerDayMg: 200,
      renalAdaptation: {
        dfg30to60: 'HBPM : Adapter la dose curative ou surveiller l\'activité anti-Xa.',
        dfgLessThan30: 'HBPM curatives CONTRE-INDIQUÉES si DFG < 30 mL/min. Basculer vers l\'Héparine Non Fractionnée (HNF) sous TCA.'
      },
      unitType: 'UI',
      dosingAdvice: 'Injection sous-cutanée dans la ceinture abdominale en alternant côté droit et gauche. Ne pas purger la bulle d\'air des seringues préremplies.'
    }
  },

  'Appareil respiratoire': {
    therapeuticClass: 'Appareil respiratoire (Pneumologie)',
    indications: ['Crise d\'asthme & Asthme persistant', 'Broncho-Pneumopathie Chronique Obstructive (BPCO)', 'Toux sèche ou quinteuse'],
    contraindications: {
      absolute: ['Hypersensibilité au principe actif ou au lactose (poudre sèche)', 'Tachycardie sévère ou cardiopathie décompensée (pour bêta-2 forts)'],
      relative: ['Hyperthyroïdie non contrôlée', 'Glaucome à angle fermé (pour anticholinergiques)']
    },
    sideEffects: {
      frequent: ['Tremblements fins des extrémités', 'Tachycardie et palpitations', 'Candidose oropharyngée (Corticoïdes inhalés)'],
      severe: ['Bronchospasme paradoxal', 'Hypokaliémie sévère à forte dose', 'Glaucome aigu']
    },
    interactions: {
      forbidden: ['Bêtabloquants non sélectifs (Propranolol) : risque de bronchospasme grave'],
      precaution: ['Diurétiques hypokaliémiants (majoration du risque d\'hypokaliémie)']
    },
    pregnancySafety: {
      category: 'A',
      cratAdvice: 'Le Salbutamol inhalé est le bronchodilatateur de choix chez la femme enceinte.'
    },
    posologyRules: {
      adultStandardDosePerTakeMg: 2,
      adultTakesPerDay: 4,
      adultMaxDosePerDayMg: 8,
      renalAdaptation: {
        dfg30to60: 'Pas d\'adaptation de dose nécessaire pour la voie inhalée.',
        dfgLessThan30: 'Pas d\'adaptation nécessaire pour la voie inhalée.'
      },
      unitType: 'mg',
      dosingAdvice: 'Bien rincer la bouche à l\'eau tiède après chaque inhalation de corticoïde pour prévenir les mycoses buccales.'
    }
  },

  'Antiépileptiques & Psychotropes': {
    therapeuticClass: 'Antiépileptiques & Psychotropes (Neurologie / Psychiatrie)',
    indications: ['Épilepsies partielles et généralisées', 'Troubles anxieux sévères et insomnies', 'Troubles dépressifs majeurs et bipolarité'],
    contraindications: {
      absolute: ['Grossesse (Valproate de sodium / Dépakine : RISQUE TÉRATOGÈNE MAJEUR ET TROUBLES DU DÉVELOPPEMENT !)', 'Myasthénie grave', 'Apnée du sommeil sévère'],
      relative: ['Insuffisance hépatique aiguë (pour Valproate)', 'Glaucome par fermeture de l\'angle (pour antidépresseurs tricycliques)']
    },
    sideEffects: {
      frequent: ['Somnolence, sédation, vertiges', 'Prise de poids, augmentation de l\'appétit', 'Sécheresse buccale, constipation'],
      severe: ['Syndrome de Stevens-Johnson (Lamotrigine/Carbamazépine)', 'Hépatite toxique (Valproate)', 'Idées suicidaires en début de traitement']
    },
    interactions: {
      forbidden: ['Alcool (majoration majeure de la dépression du SNC)', 'IMAO non sélectifs avec les ISRS (Syndrome sérotoninergique mortel)'],
      precaution: ['Anti-épileptiques inducteurs enzymatiques (réduisent l\'efficacité de la pilule contraceptive !)']
    },
    pregnancySafety: {
      category: 'X',
      cratAdvice: 'VALPROATE (DÉPAKINE) : CONTRE-INDICATION ABSOLUE chez la femme en âge de procréer sans contraception efficace. Risque spina bifida & QI abaissé.'
    },
    posologyRules: {
      pediatricMgPerKgPerDay: 15,
      pediatricMaxDoseMg: 1000,
      adultStandardDosePerTakeMg: 500,
      adultTakesPerDay: 2,
      adultMaxDosePerDayMg: 2000,
      renalAdaptation: {
        dfg30to60: 'Réduire la posologie de 25-50% selon la molécule (ex: Levetiracetam, Pregabaline).',
        dfgLessThan30: 'Réduire la posologie de 50-75% et adapter le rythme des prises.'
      },
      unitType: 'mg',
      dosingAdvice: 'Ne jamais arrêter brutalement un traitement antiépileptique ou psychotrope (risque d\'état de mal épileptique ou syndrome de sevrage).'
    }
  }
};

export const DEFAULT_PHARMACOLOGICAL_PROFILE: PharmacologicalProfile = {
  therapeuticClass: 'Spécialité Pharmacologique',
  indications: ['Traitement symptomatique ou étio-pathogénique selon l\'AMM', 'Recommandé selon la monographie officielle du produit'],
  contraindications: {
    absolute: ['Hypersensibilité connue au principe actif ou à l\'un des excipients', 'Contre-indication générale spécifiée sur la notice ministérielle'],
    relative: ['Insuffisance hépatique ou rénale sévère nécessitant une adaptation posologique']
  },
  sideEffects: {
    frequent: ['Troubles digestifs bénins (nausées, gêne épigastrique)', 'Céphalées modérées ou vertiges transitoires'],
    severe: ['Réactions d\'hypersensibilité cutanée', 'Anaphylaxie ou troubles hématologiques graves']
  },
  interactions: {
    forbidden: ['Associations déconseillées mentionnées sur le RCP ministériel'],
    precaution: ['Surveillance clinique et biologique renforcée en cas de polymédication']
  },
  pregnancySafety: {
    category: 'C',
    cratAdvice: 'Évaluer le bénéfice thérapeutique pour la mère par rapport au risque potentiel pour le fœtus. Consulter le site du CRAT.'
  },
  posologyRules: {
    pediatricMgPerKgPerDay: 10,
    pediatricMaxDoseMg: 500,
    adultStandardDosePerTakeMg: 500,
    adultTakesPerDay: 3,
    adultMaxDosePerDayMg: 1500,
    renalAdaptation: {
      dfg30to60: 'Ajustement posologique recommandé si élimination rénale prédominante.',
      dfgLessThan30: 'Réduire la dose de 50% ou espacer les intervalles de prise.'
    },
    unitType: 'mg',
    dosingAdvice: 'Respecter la posologie prescrite par le médecin praticien et les recommandations du résumé des caractéristiques du produit (RCP).'
  }
};

export function getPharmacologicalProfile(therapeuticClass: string, dci?: string): PharmacologicalProfile {
  if (!therapeuticClass) return DEFAULT_PHARMACOLOGICAL_PROFILE;
  for (const key of Object.keys(CLASS_PHARMACOLOGICAL_PROFILES)) {
    if (therapeuticClass.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(therapeuticClass.toLowerCase())) {
      return CLASS_PHARMACOLOGICAL_PROFILES[key];
    }
  }
  return DEFAULT_PHARMACOLOGICAL_PROFILE;
}

export function calculatePersonalizedDose(
  profile: PharmacologicalProfile,
  weightKg: number,
  ageCategory: 'pedia' | 'adult' | 'elderly',
  dfgMlMin: number
) {
  let dailyDoseMg = 0;
  let takesPerDay = profile.posologyRules.adultTakesPerDay || 3;
  let dosePerTakeMg = 0;
  let warningMessage = '';

  if (ageCategory === 'pedia') {
    const mgKgPerDay = profile.posologyRules.pediatricMgPerKgPerDay || 20;
    dailyDoseMg = Math.round(weightKg * mgKgPerDay);
    if (profile.posologyRules.pediatricMaxDoseMg && dailyDoseMg > profile.posologyRules.pediatricMaxDoseMg) {
      dailyDoseMg = profile.posologyRules.pediatricMaxDoseMg;
      warningMessage = `⚠️ Dose plafonnée à la dose maximale pédiatrique (${dailyDoseMg} mg/j).`;
    }
  } else {
    dailyDoseMg = profile.posologyRules.adultStandardDosePerTakeMg * takesPerDay;
    if (ageCategory === 'elderly') {
      dailyDoseMg = Math.round(dailyDoseMg * 0.75);
      warningMessage = '💡 Dose adaptée au sujet âgé (-25% par prudence).';
    }
  }

  let renalNote = 'Fonction rénale normale (DFG > 60 mL/min)';
  if (dfgMlMin >= 30 && dfgMlMin < 60) {
    dailyDoseMg = Math.round(dailyDoseMg * 0.75);
    renalNote = profile.posologyRules.renalAdaptation.dfg30to60;
  } else if (dfgMlMin < 30) {
    dailyDoseMg = Math.round(dailyDoseMg * 0.50);
    renalNote = profile.posologyRules.renalAdaptation.dfgLessThan30;
  }

  dosePerTakeMg = Math.round(dailyDoseMg / (takesPerDay || 1));

  return {
    dailyDoseMg,
    dosePerTakeMg,
    takesPerDay,
    renalNote,
    warningMessage,
    unit: profile.posologyRules.unitType
  };
}
