import { OrdonnanceTemplate } from '@/types';

export const INITIAL_ORDONNANCES: OrdonnanceTemplate[] = [
  {
    "id": "ord_cardio_1",
    "title": "Hypertension Artérielle Essentielle (Initiation Bithérapie)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "HTA grade 1 ou 2 non compliquée du sujet adulte après échec des hygiéno-diététiques",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Périndopril + Amlodipine",
        "brandAlgeria": "Coveram 5mg/5mg / Perindopril+Amlodipine Saidal",
        "form": "Comprimés 5mg/5mg",
        "posology": "1 comprimé le matin",
        "duration": "30 jours"
      }
    ],
    "patientAdvice": [
      "Prise matinale régulière",
      "Automesure tensionnelle au repos",
      "Régime hyposodé (< 6g/j de sel)"
    ],
    "redFlagsToWatch": [
      "Toux sèche sous IEC",
      "Œdèmes des membres inférieurs",
      "Céphalées persistantes"
    ]
  },
  {
    "id": "ord_cardio_2",
    "title": "Insuffisance Cardiaque Chronique à Fraction d'Éjection Réduite (FE ≤ 40%)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Traitement de fond quadritérapie de l'insuffisance cardiaque globale",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Sacubitril + Valsartan",
        "brandAlgeria": "Entresto 49mg/51mg",
        "form": "Comprimés pelliculés",
        "posology": "1 comprimé x 2/jour",
        "duration": "30 jours"
      },
      {
        "dci": "Bisoprolol",
        "brandAlgeria": "Detensiel 5mg / Bisoprolol Saidal",
        "form": "Comprimés 5mg",
        "posology": "1 comprimé le matin",
        "duration": "30 jours"
      },
      {
        "dci": "Dapagliflozine",
        "brandAlgeria": "Forxiga 10mg",
        "form": "Comprimés 10mg",
        "posology": "1 comprimé le matin",
        "duration": "30 jours"
      },
      {
        "dci": "Spironolactone",
        "brandAlgeria": "Aldactone 25mg",
        "form": "Comprimés 25mg",
        "posology": "1 comprimé le matin",
        "duration": "30 jours"
      },
      {
        "dci": "Furosémide",
        "brandAlgeria": "Lasilix 40mg",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin à jeun",
        "duration": "30 jours"
      }
    ],
    "patientAdvice": [
      "Pesée quotidienne au réveil",
      "Consulter si prise de poids > 2 kg en 3 jours",
      "Régime désodé strict"
    ],
    "redFlagsToWatch": [
      "Prise de poids rapide (surcharge hydrosodée)",
      "Dyspnée de décubitus",
      "Hypotension orthostatique"
    ]
  },
  {
    "id": "ord_cardio_3",
    "title": "Fibrillation Atriale Non Valvulaire (Anticoagulation par AOD)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Prévention des AVC emboîts chez le patient en FA avec score CHA2DS2-VASc ≥ 2",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Rivaroxaban",
        "brandAlgeria": "Xarelto 20mg / Rivaroxaban Saidal",
        "form": "Comprimés 20mg",
        "posology": "1 comprimé le soir au cours du repas",
        "duration": "30 jours"
      }
    ],
    "patientAdvice": [
      "Prise au cours du repas du soir impérativement",
      "Ne jamais sauter de dose",
      "Carte personnelle d'anticoagulé"
    ],
    "redFlagsToWatch": [
      "Saignements gingivaux spontanés",
      "Épistaxis prolongé",
      "Hématurie ou méléna"
    ]
  },
  {
    "id": "ord_cardio_4",
    "title": "Fibrillation Atriale avec Prothèse Valvulaire Mécanique (AVK Sintrom)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Anticoagulation orale chronique sous contrôle de l'INR (Cible 2.5 - 3.5)",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Acénocoumarol",
        "brandAlgeria": "Sintrom 4mg",
        "form": "Comprimés quadruples sécables 4mg",
        "posology": "Selon le résultat de l'INR (ex: 1/2 comprimé à 18h)",
        "duration": "30 jours"
      }
    ],
    "patientAdvice": [
      "INR tous les 15 à 30 jours",
      "Éviter aliments très riches en vitamine K (choux, épinards) à forte dose",
      "Signaler tout nouveau médicament au pharmacien"
    ],
    "redFlagsToWatch": [
      "INR > 5 (risque hémorragique élevé)",
      "Hématomes spontanés",
      "Céphalees brutales (hémorragie méningée)"
    ]
  },
  {
    "id": "ord_cardio_5",
    "title": "Syndrome Coronarien Aigu / Post-Stenting (Bithérapie Antiagrégante)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Prévention secondaire après infarctus du myocarde et stent actif (BASIC)",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Aspirine (Acide Acétylsalicylique)",
        "brandAlgeria": "Kardegic 75mg",
        "form": "Sachets 75mg",
        "posology": "1 sachet le midi au repas",
        "duration": "Au long cours"
      },
      {
        "dci": "Ticagrélor",
        "brandAlgeria": "Brilique 90mg",
        "form": "Comprimés 90mg",
        "posology": "1 comprimé x 2/jour",
        "duration": "12 mois"
      },
      {
        "dci": "Bisoprolol",
        "brandAlgeria": "Detensiel 5mg",
        "form": "Comprimés 5mg",
        "posology": "1 comprimé le matin",
        "duration": "Au long cours"
      },
      {
        "dci": "Atorvastatine",
        "brandAlgeria": "Tahor 40mg / Atorvastatine Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le soir",
        "duration": "Au long cours"
      },
      {
        "dci": "Ramipril",
        "brandAlgeria": "Triatec 5mg",
        "form": "Comprimés 5mg",
        "posology": "1 comprimé le matin",
        "duration": "Au long cours"
      }
    ],
    "patientAdvice": [
      "Ne jamais interrompre le Brilique ni le Kardegic sans avis cardiologique (risque de thrombose de stent !)",
      "Bilan lipidique à 3 mois (Cible LDL < 0.55 g/L)"
    ],
    "redFlagsToWatch": [
      "Douleur thoracique récidivante",
      "Hémorragie digestive",
      "Dyspnée sous Ticagrélor"
    ]
  },
  {
    "id": "ord_cardio_6",
    "title": "Péricardite Aiguë Idiopathique Bénigne",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Inflammation du péricarde sans signe de tamponnade ni épanchement abondant",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Ibuprofène",
        "brandAlgeria": "Profenid 600mg / Ibuprofène Saidal",
        "form": "Comprimés 600mg",
        "posology": "1 comprimé x 3/jour au milieu des repas",
        "duration": "14 jours puis décroissance"
      },
      {
        "dci": "Colchicine",
        "brandAlgeria": "Colchicine 1mg",
        "form": "Comprimés 1mg",
        "posology": "0.5mg x 2/jour (ou 0.5mg/j si < 70 kg)",
        "duration": "3 mois"
      },
      {
        "dci": "Oméprazole",
        "brandAlgeria": "Omepral 20mg",
        "form": "Gélules 20mg",
        "posology": "1 gélule le matin",
        "duration": "21 jours"
      }
    ],
    "patientAdvice": [
      "Repos strict au lit pendant la phase aiguë",
      "Pas d'effort physique intense pendant 3 mois",
      "Décroissance progressive de l'AINS"
    ],
    "redFlagsToWatch": [
      "Réapparition de la douleur à la baisse des doses",
      "Récidive de fièvre",
      "Dyspnée s'aggarvant"
    ]
  },
  {
    "id": "ord_pneumo_1",
    "title": "Asthme Bronchique Aigu (Traitement de Crise & Fond)",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "indication": "Asthme persistant modéré avec crises fréquentes",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fluticasone + Salmétérol",
        "brandAlgeria": "Seretide Diskus 250/50 / Salmétérol+Fluticasone Saidal",
        "form": "Inhalateur 250/50µg",
        "posology": "1 inhalation x 2/jour matin et soir",
        "duration": "En continu"
      },
      {
        "dci": "Salbutamol",
        "brandAlgeria": "Ventoline 100µg",
        "form": "Aérosol doseur 100µg",
        "posology": "1 à 2 bouffées à la demande en cas de crise siffllante",
        "duration": "Flacon de secours"
      }
    ],
    "patientAdvice": [
      "Rincer la bouche à l'eau claire après chaque inhalation de sérétide",
      "Vérifier la technique d'inhalation",
      "Éviter les allergènes déclenchants"
    ],
    "redFlagsToWatch": [
      "Crise ne céderant pas après 6 bouffées de Ventoline",
      "Tirage intercostal",
      "Difficulté à parler"
    ]
  },
  {
    "id": "ord_pneumo_2",
    "title": "Exacerbation Aiguë de BPCO (Broncho-Pneumopathie Chronique Obstructive)",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "indication": "Poussée d'exacerbation infectieuse chez le patient BPCO connu",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Amoxicilline + Acide Clavulanique",
        "brandAlgeria": "Augmentin 1g / Amoxicilline-Clavulanate Saidal",
        "form": "Comprimés 1g",
        "posology": "1g x 3/jour au cours des repas",
        "duration": "7 jours"
      },
      {
        "dci": "Prednisolone",
        "brandAlgeria": "Solupred 20mg",
        "form": "Comprimés dispersibles 20mg",
        "posology": "40mg (2 comprimés) le matin",
        "duration": "5 jours"
      },
      {
        "dci": "Ipratropium + Salbutamol",
        "brandAlgeria": "Combivent / Bronchodual Nébulisation",
        "form": "Solution pour aérosol nébulisé",
        "posology": "1 dose en nébulisation sous O2 x 3/j",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Arrêt total et définitif du tabac",
      "Hydratation suffisante pour fluidifier les crachats",
      "Kinésithérapie respiratoire de drainage"
    ],
    "redFlagsToWatch": [
      "Cyanose ou encéphalopathie hypercapnique (somnolence, astérixis)",
      "Fièvre > 39°C",
      "Fréquence respiratoire > 30/min"
    ]
  },
  {
    "id": "ord_pedia_1",
    "title": "Gastro-Entérite Aiguë de l'Enfant & Réhydratation Orale",
    "specialtyId": "pediatrie",
    "specialtyName": "Pédiatrie",
    "indication": "Diarrhée aiguë et vomissements du nourrisson / enfant sans déshydratation sévère",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Soluté de Réhydratation Orale (SRO)",
        "brandAlgeria": "Adiaril / SRO Saidal Sachets",
        "form": "Sachets poudre pour solution 200mL",
        "posology": "1 sachet dans 200mL d'eau minérale. Proposer à volonté par petites gorgées fréquemment",
        "duration": "5 jours"
      },
      {
        "dci": "Racécadotril",
        "brandAlgeria": "Tiorfan 10mg / 30mg Sachets",
        "form": "Sachets pédiatriques",
        "posology": "1 sachet (selon poids 1.5mg/kg) x 3/jour mélangé à la boisson",
        "duration": "5 jours max"
      },
      {
        "dci": "Zinc Sulfate",
        "brandAlgeria": "Zinc Pediatrique Saidal 10mg",
        "form": "Comprimés dispersibles 10mg",
        "posology": "10mg/j (< 6 mois) ou 20mg/j (> 6 mois)",
        "duration": "10 à 14 jours"
      }
    ],
    "patientAdvice": [
      "SRO à volonté d'emblée dès la première selle liquide !",
      "Poursuivre l'allaitement maternel ou le lait habituel sans interruption",
      "Ne pas donner d'antidiarrhéiques ralentisseurs du transit (Imodium contre-indiqué !)"
    ],
    "redFlagsToWatch": [
      "Perte de poids > 8-10%",
      "Enfant hypotonique, somnolent",
      "Vomissements incoercibles empêchant la prise du SRO"
    ]
  },
  {
    "id": "ord_cardio_gen_101",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Cardiologie)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Prescription type adaptée aux consultations de Cardiologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_cardio_gen_102",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Cardiologie)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Prescription type adaptée aux consultations de Cardiologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_cardio_gen_103",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Cardiologie)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Prescription type adaptée aux consultations de Cardiologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_cardio_gen_104",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Cardiologie)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Prescription type adaptée aux consultations de Cardiologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_cardio_gen_105",
    "title": "Insomnie transitoire de stress - Protocole 5 (Cardiologie)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Prescription type adaptée aux consultations de Cardiologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_cardio_gen_106",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Cardiologie)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Prescription type adaptée aux consultations de Cardiologie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_cardio_gen_107",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Cardiologie)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Prescription type adaptée aux consultations de Cardiologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_cardio_gen_108",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Cardiologie)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Prescription type adaptée aux consultations de Cardiologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_cardio_gen_109",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Cardiologie)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Prescription type adaptée aux consultations de Cardiologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_cardio_gen_110",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Cardiologie)",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie",
    "indication": "Prescription type adaptée aux consultations de Cardiologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pneumo_gen_111",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Pneumologie)",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "indication": "Prescription type adaptée aux consultations de Pneumologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pneumo_gen_112",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Pneumologie)",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "indication": "Prescription type adaptée aux consultations de Pneumologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pneumo_gen_113",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Pneumologie)",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "indication": "Prescription type adaptée aux consultations de Pneumologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pneumo_gen_114",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Pneumologie)",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "indication": "Prescription type adaptée aux consultations de Pneumologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pneumo_gen_115",
    "title": "Insomnie transitoire de stress - Protocole 5 (Pneumologie)",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "indication": "Prescription type adaptée aux consultations de Pneumologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pneumo_gen_116",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Pneumologie)",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "indication": "Prescription type adaptée aux consultations de Pneumologie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pneumo_gen_117",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Pneumologie)",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "indication": "Prescription type adaptée aux consultations de Pneumologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pneumo_gen_118",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Pneumologie)",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "indication": "Prescription type adaptée aux consultations de Pneumologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pneumo_gen_119",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Pneumologie)",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "indication": "Prescription type adaptée aux consultations de Pneumologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pneumo_gen_120",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Pneumologie)",
    "specialtyId": "pneumo",
    "specialtyName": "Pneumologie",
    "indication": "Prescription type adaptée aux consultations de Pneumologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gastro_gen_121",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Gastro-Entérologie)",
    "specialtyId": "gastro",
    "specialtyName": "Gastro-Entérologie",
    "indication": "Prescription type adaptée aux consultations de Gastro-Entérologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gastro_gen_122",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Gastro-Entérologie)",
    "specialtyId": "gastro",
    "specialtyName": "Gastro-Entérologie",
    "indication": "Prescription type adaptée aux consultations de Gastro-Entérologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gastro_gen_123",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Gastro-Entérologie)",
    "specialtyId": "gastro",
    "specialtyName": "Gastro-Entérologie",
    "indication": "Prescription type adaptée aux consultations de Gastro-Entérologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gastro_gen_124",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Gastro-Entérologie)",
    "specialtyId": "gastro",
    "specialtyName": "Gastro-Entérologie",
    "indication": "Prescription type adaptée aux consultations de Gastro-Entérologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gastro_gen_125",
    "title": "Insomnie transitoire de stress - Protocole 5 (Gastro-Entérologie)",
    "specialtyId": "gastro",
    "specialtyName": "Gastro-Entérologie",
    "indication": "Prescription type adaptée aux consultations de Gastro-Entérologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gastro_gen_126",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Gastro-Entérologie)",
    "specialtyId": "gastro",
    "specialtyName": "Gastro-Entérologie",
    "indication": "Prescription type adaptée aux consultations de Gastro-Entérologie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gastro_gen_127",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Gastro-Entérologie)",
    "specialtyId": "gastro",
    "specialtyName": "Gastro-Entérologie",
    "indication": "Prescription type adaptée aux consultations de Gastro-Entérologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gastro_gen_128",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Gastro-Entérologie)",
    "specialtyId": "gastro",
    "specialtyName": "Gastro-Entérologie",
    "indication": "Prescription type adaptée aux consultations de Gastro-Entérologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gastro_gen_129",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Gastro-Entérologie)",
    "specialtyId": "gastro",
    "specialtyName": "Gastro-Entérologie",
    "indication": "Prescription type adaptée aux consultations de Gastro-Entérologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gastro_gen_130",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Gastro-Entérologie)",
    "specialtyId": "gastro",
    "specialtyName": "Gastro-Entérologie",
    "indication": "Prescription type adaptée aux consultations de Gastro-Entérologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_neuro_gen_131",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Neurologie)",
    "specialtyId": "neuro",
    "specialtyName": "Neurologie",
    "indication": "Prescription type adaptée aux consultations de Neurologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_neuro_gen_132",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Neurologie)",
    "specialtyId": "neuro",
    "specialtyName": "Neurologie",
    "indication": "Prescription type adaptée aux consultations de Neurologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_neuro_gen_133",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Neurologie)",
    "specialtyId": "neuro",
    "specialtyName": "Neurologie",
    "indication": "Prescription type adaptée aux consultations de Neurologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_neuro_gen_134",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Neurologie)",
    "specialtyId": "neuro",
    "specialtyName": "Neurologie",
    "indication": "Prescription type adaptée aux consultations de Neurologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_neuro_gen_135",
    "title": "Insomnie transitoire de stress - Protocole 5 (Neurologie)",
    "specialtyId": "neuro",
    "specialtyName": "Neurologie",
    "indication": "Prescription type adaptée aux consultations de Neurologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_neuro_gen_136",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Neurologie)",
    "specialtyId": "neuro",
    "specialtyName": "Neurologie",
    "indication": "Prescription type adaptée aux consultations de Neurologie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_neuro_gen_137",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Neurologie)",
    "specialtyId": "neuro",
    "specialtyName": "Neurologie",
    "indication": "Prescription type adaptée aux consultations de Neurologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_neuro_gen_138",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Neurologie)",
    "specialtyId": "neuro",
    "specialtyName": "Neurologie",
    "indication": "Prescription type adaptée aux consultations de Neurologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_neuro_gen_139",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Neurologie)",
    "specialtyId": "neuro",
    "specialtyName": "Neurologie",
    "indication": "Prescription type adaptée aux consultations de Neurologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_neuro_gen_140",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Neurologie)",
    "specialtyId": "neuro",
    "specialtyName": "Neurologie",
    "indication": "Prescription type adaptée aux consultations de Neurologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_nephro_gen_141",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Néphrologie / Urologie)",
    "specialtyId": "nephro",
    "specialtyName": "Néphrologie / Urologie",
    "indication": "Prescription type adaptée aux consultations de Néphrologie / Urologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_nephro_gen_142",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Néphrologie / Urologie)",
    "specialtyId": "nephro",
    "specialtyName": "Néphrologie / Urologie",
    "indication": "Prescription type adaptée aux consultations de Néphrologie / Urologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_nephro_gen_143",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Néphrologie / Urologie)",
    "specialtyId": "nephro",
    "specialtyName": "Néphrologie / Urologie",
    "indication": "Prescription type adaptée aux consultations de Néphrologie / Urologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_nephro_gen_144",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Néphrologie / Urologie)",
    "specialtyId": "nephro",
    "specialtyName": "Néphrologie / Urologie",
    "indication": "Prescription type adaptée aux consultations de Néphrologie / Urologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_nephro_gen_145",
    "title": "Insomnie transitoire de stress - Protocole 5 (Néphrologie / Urologie)",
    "specialtyId": "nephro",
    "specialtyName": "Néphrologie / Urologie",
    "indication": "Prescription type adaptée aux consultations de Néphrologie / Urologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_nephro_gen_146",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Néphrologie / Urologie)",
    "specialtyId": "nephro",
    "specialtyName": "Néphrologie / Urologie",
    "indication": "Prescription type adaptée aux consultations de Néphrologie / Urologie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_nephro_gen_147",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Néphrologie / Urologie)",
    "specialtyId": "nephro",
    "specialtyName": "Néphrologie / Urologie",
    "indication": "Prescription type adaptée aux consultations de Néphrologie / Urologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_nephro_gen_148",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Néphrologie / Urologie)",
    "specialtyId": "nephro",
    "specialtyName": "Néphrologie / Urologie",
    "indication": "Prescription type adaptée aux consultations de Néphrologie / Urologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_nephro_gen_149",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Néphrologie / Urologie)",
    "specialtyId": "nephro",
    "specialtyName": "Néphrologie / Urologie",
    "indication": "Prescription type adaptée aux consultations de Néphrologie / Urologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_nephro_gen_150",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Néphrologie / Urologie)",
    "specialtyId": "nephro",
    "specialtyName": "Néphrologie / Urologie",
    "indication": "Prescription type adaptée aux consultations de Néphrologie / Urologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_endocrino_gen_151",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Endocrinologie / Diabétologie)",
    "specialtyId": "endocrino",
    "specialtyName": "Endocrinologie / Diabétologie",
    "indication": "Prescription type adaptée aux consultations de Endocrinologie / Diabétologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_endocrino_gen_152",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Endocrinologie / Diabétologie)",
    "specialtyId": "endocrino",
    "specialtyName": "Endocrinologie / Diabétologie",
    "indication": "Prescription type adaptée aux consultations de Endocrinologie / Diabétologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_endocrino_gen_153",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Endocrinologie / Diabétologie)",
    "specialtyId": "endocrino",
    "specialtyName": "Endocrinologie / Diabétologie",
    "indication": "Prescription type adaptée aux consultations de Endocrinologie / Diabétologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_endocrino_gen_154",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Endocrinologie / Diabétologie)",
    "specialtyId": "endocrino",
    "specialtyName": "Endocrinologie / Diabétologie",
    "indication": "Prescription type adaptée aux consultations de Endocrinologie / Diabétologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_endocrino_gen_155",
    "title": "Insomnie transitoire de stress - Protocole 5 (Endocrinologie / Diabétologie)",
    "specialtyId": "endocrino",
    "specialtyName": "Endocrinologie / Diabétologie",
    "indication": "Prescription type adaptée aux consultations de Endocrinologie / Diabétologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_endocrino_gen_156",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Endocrinologie / Diabétologie)",
    "specialtyId": "endocrino",
    "specialtyName": "Endocrinologie / Diabétologie",
    "indication": "Prescription type adaptée aux consultations de Endocrinologie / Diabétologie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_endocrino_gen_157",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Endocrinologie / Diabétologie)",
    "specialtyId": "endocrino",
    "specialtyName": "Endocrinologie / Diabétologie",
    "indication": "Prescription type adaptée aux consultations de Endocrinologie / Diabétologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_endocrino_gen_158",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Endocrinologie / Diabétologie)",
    "specialtyId": "endocrino",
    "specialtyName": "Endocrinologie / Diabétologie",
    "indication": "Prescription type adaptée aux consultations de Endocrinologie / Diabétologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_endocrino_gen_159",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Endocrinologie / Diabétologie)",
    "specialtyId": "endocrino",
    "specialtyName": "Endocrinologie / Diabétologie",
    "indication": "Prescription type adaptée aux consultations de Endocrinologie / Diabétologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_endocrino_gen_160",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Endocrinologie / Diabétologie)",
    "specialtyId": "endocrino",
    "specialtyName": "Endocrinologie / Diabétologie",
    "indication": "Prescription type adaptée aux consultations de Endocrinologie / Diabétologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_rhumato_gen_161",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Rhumatologie)",
    "specialtyId": "rhumato",
    "specialtyName": "Rhumatologie",
    "indication": "Prescription type adaptée aux consultations de Rhumatologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_rhumato_gen_162",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Rhumatologie)",
    "specialtyId": "rhumato",
    "specialtyName": "Rhumatologie",
    "indication": "Prescription type adaptée aux consultations de Rhumatologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_rhumato_gen_163",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Rhumatologie)",
    "specialtyId": "rhumato",
    "specialtyName": "Rhumatologie",
    "indication": "Prescription type adaptée aux consultations de Rhumatologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_rhumato_gen_164",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Rhumatologie)",
    "specialtyId": "rhumato",
    "specialtyName": "Rhumatologie",
    "indication": "Prescription type adaptée aux consultations de Rhumatologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_rhumato_gen_165",
    "title": "Insomnie transitoire de stress - Protocole 5 (Rhumatologie)",
    "specialtyId": "rhumato",
    "specialtyName": "Rhumatologie",
    "indication": "Prescription type adaptée aux consultations de Rhumatologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_rhumato_gen_166",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Rhumatologie)",
    "specialtyId": "rhumato",
    "specialtyName": "Rhumatologie",
    "indication": "Prescription type adaptée aux consultations de Rhumatologie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_rhumato_gen_167",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Rhumatologie)",
    "specialtyId": "rhumato",
    "specialtyName": "Rhumatologie",
    "indication": "Prescription type adaptée aux consultations de Rhumatologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_rhumato_gen_168",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Rhumatologie)",
    "specialtyId": "rhumato",
    "specialtyName": "Rhumatologie",
    "indication": "Prescription type adaptée aux consultations de Rhumatologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_rhumato_gen_169",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Rhumatologie)",
    "specialtyId": "rhumato",
    "specialtyName": "Rhumatologie",
    "indication": "Prescription type adaptée aux consultations de Rhumatologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_rhumato_gen_170",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Rhumatologie)",
    "specialtyId": "rhumato",
    "specialtyName": "Rhumatologie",
    "indication": "Prescription type adaptée aux consultations de Rhumatologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pediatrie_gen_171",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Pédiatrie)",
    "specialtyId": "pediatrie",
    "specialtyName": "Pédiatrie",
    "indication": "Prescription type adaptée aux consultations de Pédiatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pediatrie_gen_172",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Pédiatrie)",
    "specialtyId": "pediatrie",
    "specialtyName": "Pédiatrie",
    "indication": "Prescription type adaptée aux consultations de Pédiatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pediatrie_gen_173",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Pédiatrie)",
    "specialtyId": "pediatrie",
    "specialtyName": "Pédiatrie",
    "indication": "Prescription type adaptée aux consultations de Pédiatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pediatrie_gen_174",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Pédiatrie)",
    "specialtyId": "pediatrie",
    "specialtyName": "Pédiatrie",
    "indication": "Prescription type adaptée aux consultations de Pédiatrie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pediatrie_gen_175",
    "title": "Insomnie transitoire de stress - Protocole 5 (Pédiatrie)",
    "specialtyId": "pediatrie",
    "specialtyName": "Pédiatrie",
    "indication": "Prescription type adaptée aux consultations de Pédiatrie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pediatrie_gen_176",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Pédiatrie)",
    "specialtyId": "pediatrie",
    "specialtyName": "Pédiatrie",
    "indication": "Prescription type adaptée aux consultations de Pédiatrie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pediatrie_gen_177",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Pédiatrie)",
    "specialtyId": "pediatrie",
    "specialtyName": "Pédiatrie",
    "indication": "Prescription type adaptée aux consultations de Pédiatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pediatrie_gen_178",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Pédiatrie)",
    "specialtyId": "pediatrie",
    "specialtyName": "Pédiatrie",
    "indication": "Prescription type adaptée aux consultations de Pédiatrie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pediatrie_gen_179",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Pédiatrie)",
    "specialtyId": "pediatrie",
    "specialtyName": "Pédiatrie",
    "indication": "Prescription type adaptée aux consultations de Pédiatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_pediatrie_gen_180",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Pédiatrie)",
    "specialtyId": "pediatrie",
    "specialtyName": "Pédiatrie",
    "indication": "Prescription type adaptée aux consultations de Pédiatrie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gyno_gen_181",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Gynécologie / Obstétrique)",
    "specialtyId": "gyno",
    "specialtyName": "Gynécologie / Obstétrique",
    "indication": "Prescription type adaptée aux consultations de Gynécologie / Obstétrique en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gyno_gen_182",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Gynécologie / Obstétrique)",
    "specialtyId": "gyno",
    "specialtyName": "Gynécologie / Obstétrique",
    "indication": "Prescription type adaptée aux consultations de Gynécologie / Obstétrique en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gyno_gen_183",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Gynécologie / Obstétrique)",
    "specialtyId": "gyno",
    "specialtyName": "Gynécologie / Obstétrique",
    "indication": "Prescription type adaptée aux consultations de Gynécologie / Obstétrique en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gyno_gen_184",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Gynécologie / Obstétrique)",
    "specialtyId": "gyno",
    "specialtyName": "Gynécologie / Obstétrique",
    "indication": "Prescription type adaptée aux consultations de Gynécologie / Obstétrique en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gyno_gen_185",
    "title": "Insomnie transitoire de stress - Protocole 5 (Gynécologie / Obstétrique)",
    "specialtyId": "gyno",
    "specialtyName": "Gynécologie / Obstétrique",
    "indication": "Prescription type adaptée aux consultations de Gynécologie / Obstétrique en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gyno_gen_186",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Gynécologie / Obstétrique)",
    "specialtyId": "gyno",
    "specialtyName": "Gynécologie / Obstétrique",
    "indication": "Prescription type adaptée aux consultations de Gynécologie / Obstétrique en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gyno_gen_187",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Gynécologie / Obstétrique)",
    "specialtyId": "gyno",
    "specialtyName": "Gynécologie / Obstétrique",
    "indication": "Prescription type adaptée aux consultations de Gynécologie / Obstétrique en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gyno_gen_188",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Gynécologie / Obstétrique)",
    "specialtyId": "gyno",
    "specialtyName": "Gynécologie / Obstétrique",
    "indication": "Prescription type adaptée aux consultations de Gynécologie / Obstétrique en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gyno_gen_189",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Gynécologie / Obstétrique)",
    "specialtyId": "gyno",
    "specialtyName": "Gynécologie / Obstétrique",
    "indication": "Prescription type adaptée aux consultations de Gynécologie / Obstétrique en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_gyno_gen_190",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Gynécologie / Obstétrique)",
    "specialtyId": "gyno",
    "specialtyName": "Gynécologie / Obstétrique",
    "indication": "Prescription type adaptée aux consultations de Gynécologie / Obstétrique en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_dermato_gen_191",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Dermatologie)",
    "specialtyId": "dermato",
    "specialtyName": "Dermatologie",
    "indication": "Prescription type adaptée aux consultations de Dermatologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_dermato_gen_192",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Dermatologie)",
    "specialtyId": "dermato",
    "specialtyName": "Dermatologie",
    "indication": "Prescription type adaptée aux consultations de Dermatologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_dermato_gen_193",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Dermatologie)",
    "specialtyId": "dermato",
    "specialtyName": "Dermatologie",
    "indication": "Prescription type adaptée aux consultations de Dermatologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_dermato_gen_194",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Dermatologie)",
    "specialtyId": "dermato",
    "specialtyName": "Dermatologie",
    "indication": "Prescription type adaptée aux consultations de Dermatologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_dermato_gen_195",
    "title": "Insomnie transitoire de stress - Protocole 5 (Dermatologie)",
    "specialtyId": "dermato",
    "specialtyName": "Dermatologie",
    "indication": "Prescription type adaptée aux consultations de Dermatologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_dermato_gen_196",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Dermatologie)",
    "specialtyId": "dermato",
    "specialtyName": "Dermatologie",
    "indication": "Prescription type adaptée aux consultations de Dermatologie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_dermato_gen_197",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Dermatologie)",
    "specialtyId": "dermato",
    "specialtyName": "Dermatologie",
    "indication": "Prescription type adaptée aux consultations de Dermatologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_dermato_gen_198",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Dermatologie)",
    "specialtyId": "dermato",
    "specialtyName": "Dermatologie",
    "indication": "Prescription type adaptée aux consultations de Dermatologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_dermato_gen_199",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Dermatologie)",
    "specialtyId": "dermato",
    "specialtyName": "Dermatologie",
    "indication": "Prescription type adaptée aux consultations de Dermatologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_dermato_gen_200",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Dermatologie)",
    "specialtyId": "dermato",
    "specialtyName": "Dermatologie",
    "indication": "Prescription type adaptée aux consultations de Dermatologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_infectio_gen_201",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Infectiologie)",
    "specialtyId": "infectio",
    "specialtyName": "Infectiologie",
    "indication": "Prescription type adaptée aux consultations de Infectiologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_infectio_gen_202",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Infectiologie)",
    "specialtyId": "infectio",
    "specialtyName": "Infectiologie",
    "indication": "Prescription type adaptée aux consultations de Infectiologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_infectio_gen_203",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Infectiologie)",
    "specialtyId": "infectio",
    "specialtyName": "Infectiologie",
    "indication": "Prescription type adaptée aux consultations de Infectiologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_infectio_gen_204",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Infectiologie)",
    "specialtyId": "infectio",
    "specialtyName": "Infectiologie",
    "indication": "Prescription type adaptée aux consultations de Infectiologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_infectio_gen_205",
    "title": "Insomnie transitoire de stress - Protocole 5 (Infectiologie)",
    "specialtyId": "infectio",
    "specialtyName": "Infectiologie",
    "indication": "Prescription type adaptée aux consultations de Infectiologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_infectio_gen_206",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Infectiologie)",
    "specialtyId": "infectio",
    "specialtyName": "Infectiologie",
    "indication": "Prescription type adaptée aux consultations de Infectiologie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_infectio_gen_207",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Infectiologie)",
    "specialtyId": "infectio",
    "specialtyName": "Infectiologie",
    "indication": "Prescription type adaptée aux consultations de Infectiologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_infectio_gen_208",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Infectiologie)",
    "specialtyId": "infectio",
    "specialtyName": "Infectiologie",
    "indication": "Prescription type adaptée aux consultations de Infectiologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_infectio_gen_209",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Infectiologie)",
    "specialtyId": "infectio",
    "specialtyName": "Infectiologie",
    "indication": "Prescription type adaptée aux consultations de Infectiologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_infectio_gen_210",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Infectiologie)",
    "specialtyId": "infectio",
    "specialtyName": "Infectiologie",
    "indication": "Prescription type adaptée aux consultations de Infectiologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_orl_gen_211",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (ORL)",
    "specialtyId": "orl",
    "specialtyName": "ORL",
    "indication": "Prescription type adaptée aux consultations de ORL en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_orl_gen_212",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (ORL)",
    "specialtyId": "orl",
    "specialtyName": "ORL",
    "indication": "Prescription type adaptée aux consultations de ORL en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_orl_gen_213",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (ORL)",
    "specialtyId": "orl",
    "specialtyName": "ORL",
    "indication": "Prescription type adaptée aux consultations de ORL en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_orl_gen_214",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (ORL)",
    "specialtyId": "orl",
    "specialtyName": "ORL",
    "indication": "Prescription type adaptée aux consultations de ORL en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_orl_gen_215",
    "title": "Insomnie transitoire de stress - Protocole 5 (ORL)",
    "specialtyId": "orl",
    "specialtyName": "ORL",
    "indication": "Prescription type adaptée aux consultations de ORL en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_orl_gen_216",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (ORL)",
    "specialtyId": "orl",
    "specialtyName": "ORL",
    "indication": "Prescription type adaptée aux consultations de ORL en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_orl_gen_217",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (ORL)",
    "specialtyId": "orl",
    "specialtyName": "ORL",
    "indication": "Prescription type adaptée aux consultations de ORL en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_orl_gen_218",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (ORL)",
    "specialtyId": "orl",
    "specialtyName": "ORL",
    "indication": "Prescription type adaptée aux consultations de ORL en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_orl_gen_219",
    "title": "Allergie oculaire saisonnière - Protocole 9 (ORL)",
    "specialtyId": "orl",
    "specialtyName": "ORL",
    "indication": "Prescription type adaptée aux consultations de ORL en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_orl_gen_220",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (ORL)",
    "specialtyId": "orl",
    "specialtyName": "ORL",
    "indication": "Prescription type adaptée aux consultations de ORL en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_ophtalmo_gen_221",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Ophtalmologie)",
    "specialtyId": "ophtalmo",
    "specialtyName": "Ophtalmologie",
    "indication": "Prescription type adaptée aux consultations de Ophtalmologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_ophtalmo_gen_222",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Ophtalmologie)",
    "specialtyId": "ophtalmo",
    "specialtyName": "Ophtalmologie",
    "indication": "Prescription type adaptée aux consultations de Ophtalmologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_ophtalmo_gen_223",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Ophtalmologie)",
    "specialtyId": "ophtalmo",
    "specialtyName": "Ophtalmologie",
    "indication": "Prescription type adaptée aux consultations de Ophtalmologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_ophtalmo_gen_224",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Ophtalmologie)",
    "specialtyId": "ophtalmo",
    "specialtyName": "Ophtalmologie",
    "indication": "Prescription type adaptée aux consultations de Ophtalmologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_ophtalmo_gen_225",
    "title": "Insomnie transitoire de stress - Protocole 5 (Ophtalmologie)",
    "specialtyId": "ophtalmo",
    "specialtyName": "Ophtalmologie",
    "indication": "Prescription type adaptée aux consultations de Ophtalmologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_ophtalmo_gen_226",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Ophtalmologie)",
    "specialtyId": "ophtalmo",
    "specialtyName": "Ophtalmologie",
    "indication": "Prescription type adaptée aux consultations de Ophtalmologie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_ophtalmo_gen_227",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Ophtalmologie)",
    "specialtyId": "ophtalmo",
    "specialtyName": "Ophtalmologie",
    "indication": "Prescription type adaptée aux consultations de Ophtalmologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_ophtalmo_gen_228",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Ophtalmologie)",
    "specialtyId": "ophtalmo",
    "specialtyName": "Ophtalmologie",
    "indication": "Prescription type adaptée aux consultations de Ophtalmologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_ophtalmo_gen_229",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Ophtalmologie)",
    "specialtyId": "ophtalmo",
    "specialtyName": "Ophtalmologie",
    "indication": "Prescription type adaptée aux consultations de Ophtalmologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_ophtalmo_gen_230",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Ophtalmologie)",
    "specialtyId": "ophtalmo",
    "specialtyName": "Ophtalmologie",
    "indication": "Prescription type adaptée aux consultations de Ophtalmologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_psychiatrie_gen_231",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Psychiatrie)",
    "specialtyId": "psychiatrie",
    "specialtyName": "Psychiatrie",
    "indication": "Prescription type adaptée aux consultations de Psychiatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_psychiatrie_gen_232",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Psychiatrie)",
    "specialtyId": "psychiatrie",
    "specialtyName": "Psychiatrie",
    "indication": "Prescription type adaptée aux consultations de Psychiatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_psychiatrie_gen_233",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Psychiatrie)",
    "specialtyId": "psychiatrie",
    "specialtyName": "Psychiatrie",
    "indication": "Prescription type adaptée aux consultations de Psychiatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_psychiatrie_gen_234",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Psychiatrie)",
    "specialtyId": "psychiatrie",
    "specialtyName": "Psychiatrie",
    "indication": "Prescription type adaptée aux consultations de Psychiatrie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_psychiatrie_gen_235",
    "title": "Insomnie transitoire de stress - Protocole 5 (Psychiatrie)",
    "specialtyId": "psychiatrie",
    "specialtyName": "Psychiatrie",
    "indication": "Prescription type adaptée aux consultations de Psychiatrie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_psychiatrie_gen_236",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Psychiatrie)",
    "specialtyId": "psychiatrie",
    "specialtyName": "Psychiatrie",
    "indication": "Prescription type adaptée aux consultations de Psychiatrie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_psychiatrie_gen_237",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Psychiatrie)",
    "specialtyId": "psychiatrie",
    "specialtyName": "Psychiatrie",
    "indication": "Prescription type adaptée aux consultations de Psychiatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_psychiatrie_gen_238",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Psychiatrie)",
    "specialtyId": "psychiatrie",
    "specialtyName": "Psychiatrie",
    "indication": "Prescription type adaptée aux consultations de Psychiatrie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_psychiatrie_gen_239",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Psychiatrie)",
    "specialtyId": "psychiatrie",
    "specialtyName": "Psychiatrie",
    "indication": "Prescription type adaptée aux consultations de Psychiatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_psychiatrie_gen_240",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Psychiatrie)",
    "specialtyId": "psychiatrie",
    "specialtyName": "Psychiatrie",
    "indication": "Prescription type adaptée aux consultations de Psychiatrie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_hemato_gen_241",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Hématologie)",
    "specialtyId": "hemato",
    "specialtyName": "Hématologie",
    "indication": "Prescription type adaptée aux consultations de Hématologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_hemato_gen_242",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Hématologie)",
    "specialtyId": "hemato",
    "specialtyName": "Hématologie",
    "indication": "Prescription type adaptée aux consultations de Hématologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_hemato_gen_243",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Hématologie)",
    "specialtyId": "hemato",
    "specialtyName": "Hématologie",
    "indication": "Prescription type adaptée aux consultations de Hématologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_hemato_gen_244",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Hématologie)",
    "specialtyId": "hemato",
    "specialtyName": "Hématologie",
    "indication": "Prescription type adaptée aux consultations de Hématologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_hemato_gen_245",
    "title": "Insomnie transitoire de stress - Protocole 5 (Hématologie)",
    "specialtyId": "hemato",
    "specialtyName": "Hématologie",
    "indication": "Prescription type adaptée aux consultations de Hématologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_hemato_gen_246",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Hématologie)",
    "specialtyId": "hemato",
    "specialtyName": "Hématologie",
    "indication": "Prescription type adaptée aux consultations de Hématologie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_hemato_gen_247",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Hématologie)",
    "specialtyId": "hemato",
    "specialtyName": "Hématologie",
    "indication": "Prescription type adaptée aux consultations de Hématologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_hemato_gen_248",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Hématologie)",
    "specialtyId": "hemato",
    "specialtyName": "Hématologie",
    "indication": "Prescription type adaptée aux consultations de Hématologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_hemato_gen_249",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Hématologie)",
    "specialtyId": "hemato",
    "specialtyName": "Hématologie",
    "indication": "Prescription type adaptée aux consultations de Hématologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_hemato_gen_250",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Hématologie)",
    "specialtyId": "hemato",
    "specialtyName": "Hématologie",
    "indication": "Prescription type adaptée aux consultations de Hématologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_urgences_gen_251",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Urgences & Réanimation)",
    "specialtyId": "urgences",
    "specialtyName": "Urgences & Réanimation",
    "indication": "Prescription type adaptée aux consultations de Urgences & Réanimation en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_urgences_gen_252",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Urgences & Réanimation)",
    "specialtyId": "urgences",
    "specialtyName": "Urgences & Réanimation",
    "indication": "Prescription type adaptée aux consultations de Urgences & Réanimation en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_urgences_gen_253",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Urgences & Réanimation)",
    "specialtyId": "urgences",
    "specialtyName": "Urgences & Réanimation",
    "indication": "Prescription type adaptée aux consultations de Urgences & Réanimation en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_urgences_gen_254",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Urgences & Réanimation)",
    "specialtyId": "urgences",
    "specialtyName": "Urgences & Réanimation",
    "indication": "Prescription type adaptée aux consultations de Urgences & Réanimation en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_urgences_gen_255",
    "title": "Insomnie transitoire de stress - Protocole 5 (Urgences & Réanimation)",
    "specialtyId": "urgences",
    "specialtyName": "Urgences & Réanimation",
    "indication": "Prescription type adaptée aux consultations de Urgences & Réanimation en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_urgences_gen_256",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Urgences & Réanimation)",
    "specialtyId": "urgences",
    "specialtyName": "Urgences & Réanimation",
    "indication": "Prescription type adaptée aux consultations de Urgences & Réanimation en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_urgences_gen_257",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Urgences & Réanimation)",
    "specialtyId": "urgences",
    "specialtyName": "Urgences & Réanimation",
    "indication": "Prescription type adaptée aux consultations de Urgences & Réanimation en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_urgences_gen_258",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Urgences & Réanimation)",
    "specialtyId": "urgences",
    "specialtyName": "Urgences & Réanimation",
    "indication": "Prescription type adaptée aux consultations de Urgences & Réanimation en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_urgences_gen_259",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Urgences & Réanimation)",
    "specialtyId": "urgences",
    "specialtyName": "Urgences & Réanimation",
    "indication": "Prescription type adaptée aux consultations de Urgences & Réanimation en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_urgences_gen_260",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Urgences & Réanimation)",
    "specialtyId": "urgences",
    "specialtyName": "Urgences & Réanimation",
    "indication": "Prescription type adaptée aux consultations de Urgences & Réanimation en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_chirurgie_gen_261",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Chirurgie Générale)",
    "specialtyId": "chirurgie",
    "specialtyName": "Chirurgie Générale",
    "indication": "Prescription type adaptée aux consultations de Chirurgie Générale en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_chirurgie_gen_262",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Chirurgie Générale)",
    "specialtyId": "chirurgie",
    "specialtyName": "Chirurgie Générale",
    "indication": "Prescription type adaptée aux consultations de Chirurgie Générale en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_chirurgie_gen_263",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Chirurgie Générale)",
    "specialtyId": "chirurgie",
    "specialtyName": "Chirurgie Générale",
    "indication": "Prescription type adaptée aux consultations de Chirurgie Générale en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_chirurgie_gen_264",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Chirurgie Générale)",
    "specialtyId": "chirurgie",
    "specialtyName": "Chirurgie Générale",
    "indication": "Prescription type adaptée aux consultations de Chirurgie Générale en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_chirurgie_gen_265",
    "title": "Insomnie transitoire de stress - Protocole 5 (Chirurgie Générale)",
    "specialtyId": "chirurgie",
    "specialtyName": "Chirurgie Générale",
    "indication": "Prescription type adaptée aux consultations de Chirurgie Générale en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_chirurgie_gen_266",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Chirurgie Générale)",
    "specialtyId": "chirurgie",
    "specialtyName": "Chirurgie Générale",
    "indication": "Prescription type adaptée aux consultations de Chirurgie Générale en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_chirurgie_gen_267",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Chirurgie Générale)",
    "specialtyId": "chirurgie",
    "specialtyName": "Chirurgie Générale",
    "indication": "Prescription type adaptée aux consultations de Chirurgie Générale en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_chirurgie_gen_268",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Chirurgie Générale)",
    "specialtyId": "chirurgie",
    "specialtyName": "Chirurgie Générale",
    "indication": "Prescription type adaptée aux consultations de Chirurgie Générale en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_chirurgie_gen_269",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Chirurgie Générale)",
    "specialtyId": "chirurgie",
    "specialtyName": "Chirurgie Générale",
    "indication": "Prescription type adaptée aux consultations de Chirurgie Générale en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_chirurgie_gen_270",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Chirurgie Générale)",
    "specialtyId": "chirurgie",
    "specialtyName": "Chirurgie Générale",
    "indication": "Prescription type adaptée aux consultations de Chirurgie Générale en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_toxico_gen_271",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Addictologie & Toxicologie)",
    "specialtyId": "toxico",
    "specialtyName": "Addictologie & Toxicologie",
    "indication": "Prescription type adaptée aux consultations de Addictologie & Toxicologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_toxico_gen_272",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Addictologie & Toxicologie)",
    "specialtyId": "toxico",
    "specialtyName": "Addictologie & Toxicologie",
    "indication": "Prescription type adaptée aux consultations de Addictologie & Toxicologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_toxico_gen_273",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Addictologie & Toxicologie)",
    "specialtyId": "toxico",
    "specialtyName": "Addictologie & Toxicologie",
    "indication": "Prescription type adaptée aux consultations de Addictologie & Toxicologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_toxico_gen_274",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Addictologie & Toxicologie)",
    "specialtyId": "toxico",
    "specialtyName": "Addictologie & Toxicologie",
    "indication": "Prescription type adaptée aux consultations de Addictologie & Toxicologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_toxico_gen_275",
    "title": "Insomnie transitoire de stress - Protocole 5 (Addictologie & Toxicologie)",
    "specialtyId": "toxico",
    "specialtyName": "Addictologie & Toxicologie",
    "indication": "Prescription type adaptée aux consultations de Addictologie & Toxicologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_toxico_gen_276",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Addictologie & Toxicologie)",
    "specialtyId": "toxico",
    "specialtyName": "Addictologie & Toxicologie",
    "indication": "Prescription type adaptée aux consultations de Addictologie & Toxicologie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_toxico_gen_277",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Addictologie & Toxicologie)",
    "specialtyId": "toxico",
    "specialtyName": "Addictologie & Toxicologie",
    "indication": "Prescription type adaptée aux consultations de Addictologie & Toxicologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_toxico_gen_278",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Addictologie & Toxicologie)",
    "specialtyId": "toxico",
    "specialtyName": "Addictologie & Toxicologie",
    "indication": "Prescription type adaptée aux consultations de Addictologie & Toxicologie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_toxico_gen_279",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Addictologie & Toxicologie)",
    "specialtyId": "toxico",
    "specialtyName": "Addictologie & Toxicologie",
    "indication": "Prescription type adaptée aux consultations de Addictologie & Toxicologie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_toxico_gen_280",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Addictologie & Toxicologie)",
    "specialtyId": "toxico",
    "specialtyName": "Addictologie & Toxicologie",
    "indication": "Prescription type adaptée aux consultations de Addictologie & Toxicologie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_geriatrie_gen_281",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Gériatrie)",
    "specialtyId": "geriatrie",
    "specialtyName": "Gériatrie",
    "indication": "Prescription type adaptée aux consultations de Gériatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_geriatrie_gen_282",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Gériatrie)",
    "specialtyId": "geriatrie",
    "specialtyName": "Gériatrie",
    "indication": "Prescription type adaptée aux consultations de Gériatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_geriatrie_gen_283",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Gériatrie)",
    "specialtyId": "geriatrie",
    "specialtyName": "Gériatrie",
    "indication": "Prescription type adaptée aux consultations de Gériatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_geriatrie_gen_284",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Gériatrie)",
    "specialtyId": "geriatrie",
    "specialtyName": "Gériatrie",
    "indication": "Prescription type adaptée aux consultations de Gériatrie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_geriatrie_gen_285",
    "title": "Insomnie transitoire de stress - Protocole 5 (Gériatrie)",
    "specialtyId": "geriatrie",
    "specialtyName": "Gériatrie",
    "indication": "Prescription type adaptée aux consultations de Gériatrie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_geriatrie_gen_286",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Gériatrie)",
    "specialtyId": "geriatrie",
    "specialtyName": "Gériatrie",
    "indication": "Prescription type adaptée aux consultations de Gériatrie en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_geriatrie_gen_287",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Gériatrie)",
    "specialtyId": "geriatrie",
    "specialtyName": "Gériatrie",
    "indication": "Prescription type adaptée aux consultations de Gériatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_geriatrie_gen_288",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Gériatrie)",
    "specialtyId": "geriatrie",
    "specialtyName": "Gériatrie",
    "indication": "Prescription type adaptée aux consultations de Gériatrie en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_geriatrie_gen_289",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Gériatrie)",
    "specialtyId": "geriatrie",
    "specialtyName": "Gériatrie",
    "indication": "Prescription type adaptée aux consultations de Gériatrie en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_geriatrie_gen_290",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Gériatrie)",
    "specialtyId": "geriatrie",
    "specialtyName": "Gériatrie",
    "indication": "Prescription type adaptée aux consultations de Gériatrie en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_med_travail_gen_291",
    "title": "Prise en charge de la douleur modérée à sévère - Protocole 1 (Médecine du Travail)",
    "specialtyId": "med_travail",
    "specialtyName": "Médecine du Travail",
    "indication": "Prescription type adaptée aux consultations de Médecine du Travail en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol Codeiné",
        "brandAlgeria": "Dafalgan Codeine / Paracétamol Codeiné Saidal",
        "form": "Comprimés 500mg/30mg",
        "posology": "1 comprimé x 3/jour",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_med_travail_gen_292",
    "title": "Surinfection bactérienne ORL / Respi - Protocole 2 (Médecine du Travail)",
    "specialtyId": "med_travail",
    "specialtyName": "Médecine du Travail",
    "indication": "Prescription type adaptée aux consultations de Médecine du Travail en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Cefuroxime Axétil",
        "brandAlgeria": "Zinnat 500mg / Cefuroxime Axétil Saidal",
        "form": "Comprimés 500mg",
        "posology": "1 comprimé x 2/jour au repas",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_med_travail_gen_293",
    "title": "Syndrome fébrile et grippal intense - Protocole 3 (Médecine du Travail)",
    "specialtyId": "med_travail",
    "specialtyName": "Médecine du Travail",
    "indication": "Prescription type adaptée aux consultations de Médecine du Travail en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Paracétamol + Vitamine C",
        "brandAlgeria": "Fervex Sachets / Doliprane / Paracétamol + Vitamine C Saidal",
        "form": "Sachets poudre",
        "posology": "1 sachet dans l'eau chaude x 3/j",
        "duration": "5 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_med_travail_gen_294",
    "title": "Brûlures gastriques & Hyperacidité - Protocole 4 (Médecine du Travail)",
    "specialtyId": "med_travail",
    "specialtyName": "Médecine du Travail",
    "indication": "Prescription type adaptée aux consultations de Médecine du Travail en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Pantoprazole",
        "brandAlgeria": "Inipomp 40mg / Pantoprazole Saidal / Pantoprazole Saidal",
        "form": "Comprimés 40mg",
        "posology": "1 comprimé le matin",
        "duration": "14 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_med_travail_gen_295",
    "title": "Insomnie transitoire de stress - Protocole 5 (Médecine du Travail)",
    "specialtyId": "med_travail",
    "specialtyName": "Médecine du Travail",
    "indication": "Prescription type adaptée aux consultations de Médecine du Travail en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Zolpidem",
        "brandAlgeria": "Stilnox 10mg / Zolpidem Saidal / Zolpidem Saidal",
        "form": "Comprimés sécables 10mg",
        "posology": "1 comprimé au coucher",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_med_travail_gen_296",
    "title": "Anxiété aiguë situationnelle - Protocole 6 (Médecine du Travail)",
    "specialtyId": "med_travail",
    "specialtyName": "Médecine du Travail",
    "indication": "Prescription type adaptée aux consultations de Médecine du Travail en Algérie",
    "patientType": "Sujet Âgé",
    "items": [
      {
        "dci": "Bromazépam",
        "brandAlgeria": "Lexomil 6mg / Bromazépam Saidal",
        "form": "Bâtonnets sécables 6mg",
        "posology": "1/4 de baguette matin, midi et 1/2 le soir",
        "duration": "14 jours max",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_med_travail_gen_297",
    "title": "Infection urinaire basse non compliquée - Protocole 7 (Médecine du Travail)",
    "specialtyId": "med_travail",
    "specialtyName": "Médecine du Travail",
    "indication": "Prescription type adaptée aux consultations de Médecine du Travail en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Fosfomycine Trométamol",
        "brandAlgeria": "Monuril 3g / Fosfomycine Saidal / Fosfomycine Trométamol Saidal",
        "form": "Sachet dose unique 3g",
        "posology": "1 sachet en prise unique le soir à jeun au coucher",
        "duration": "1 jour",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_med_travail_gen_298",
    "title": "Dermatose inflammatoire surinfectée - Protocole 8 (Médecine du Travail)",
    "specialtyId": "med_travail",
    "specialtyName": "Médecine du Travail",
    "indication": "Prescription type adaptée aux consultations de Médecine du Travail en Algérie",
    "patientType": "Pédiatrie",
    "items": [
      {
        "dci": "Fusidate de Sodium",
        "brandAlgeria": "Fucidine 2% Crème / Fusidate de Sodium Saidal",
        "form": "Tube crème 15g",
        "posology": "2 applications par jour après nettoyage",
        "duration": "7 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_med_travail_gen_299",
    "title": "Allergie oculaire saisonnière - Protocole 9 (Médecine du Travail)",
    "specialtyId": "med_travail",
    "specialtyName": "Médecine du Travail",
    "indication": "Prescription type adaptée aux consultations de Médecine du Travail en Algérie",
    "patientType": "Adulte",
    "items": [
      {
        "dci": "Azélastine",
        "brandAlgeria": "Allergodil Collyre / Azélastine Saidal",
        "form": "Flacon collyre 6mL",
        "posology": "1 goutte x 2/jour dans chaque œil",
        "duration": "15 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  },
  {
    "id": "ord_med_travail_gen_300",
    "title": "Vertiges d'origine labyrinthique - Protocole 10 (Médecine du Travail)",
    "specialtyId": "med_travail",
    "specialtyName": "Médecine du Travail",
    "indication": "Prescription type adaptée aux consultations de Médecine du Travail en Algérie",
    "patientType": "Femme Enceinte",
    "items": [
      {
        "dci": "Acetyl-Leucine",
        "brandAlgeria": "Tanganil 500mg / Acetyl-Leucine Saidal / Acetyl-Leucine Saidal",
        "form": "Comprimés 500mg",
        "posology": "2 comprimés le matin et 2 comprimés le soir au repas",
        "duration": "10 jours",
        "notes": "Posologie usuelle adaptée à l'adulte et disponible en officine en Algérie."
      },
      {
        "dci": "Paracétamol",
        "brandAlgeria": "Doliprane 1g / Paracétamol Saidal",
        "form": "Comprimés 1g",
        "posology": "1 comprimé toutes les 6h si douleur/fièvre",
        "duration": "5 jours"
      }
    ],
    "patientAdvice": [
      "Prise régulière selon l'horaire prescrit.",
      "En cas de doute, contacter votre médecin ou votre pharmacien.",
      "Conserver à l'abri de la chaleur et de l'humidité."
    ],
    "redFlagsToWatch": [
      "Apparition d'une réaction allergique (éruption, gonflement)",
      "Aggravation des symptômes initiaux après 48h"
    ]
  }
];
