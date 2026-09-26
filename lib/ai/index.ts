export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProvider {
  chat(messages: AIMessage[]): Promise<string>;
  generateQcm(topic: string, specialty: string): Promise<any>;
  generateClinicalCase(specialty: string, difficulty: string): Promise<any>;
  summarizeCourse(htmlContent: string): Promise<string[]>;
}

export class MockMedicalAIProvider implements AIProvider {
  async chat(messages: AIMessage[]): Promise<string> {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

    if (lastMessage.includes('tuberculose') || lastMessage.includes('bk')) {
      return `🩺 **Assistant Médical AS MEDIX : Tuberculose Pulmonaire**

1. **Rappel diagnostique :**
   - La confirmation bactériologique est obligatoire (3 crachats matinaux pour bacilloscopie Ziehl-Neelsen + GeneXpert MTB/RIF + culture Löwenstein-Jensen).
   - L'intradermoréaction (IDR) ou le QuantiFERON ne permettent pas d'affirmer la tuberculose maladie active.

2. **Traitement national (Algérie) :**
   - Schéma standard **2RHZE / 4RH** en prise unique matinale à jeun.
   - Prévenir de la coloration rouge-orangée des urines sous Rifampicine.
   - Surveillance ophtalmologique régulière sous Éthambutol (névrite optique rétrobulbaire).`;
    }

    if (lastMessage.includes('avc') || lastMessage.includes('thrombolyse')) {
      return `🧠 **Prise en charge de l'AVC Ischémique Aigu en Filière d'Urgence :**

- **Délai clé :** "Time is Brain". Fenêtre de thrombolyse IV par rt-PA (Actilyse 0.9 mg/kg) jusqu'à **4h30**.
- **Thrombectomie mécanique :** Indiquée en cas d'occlusion d'un gros tronc artériel (M1, T carotidien, tronc basilaire) jusqu'à **6h** (et jusqu'à 24h selon critères de mismatch perfusion/diffusion).
- **Consigne tensionnelle :** Ne pas faire baisser la tension artérielle réflexe sauf si > 220/120 mmHg (ou > 185/110 mmHg si thrombolyse prévue).`;
    }

    if (lastMessage.includes('insuffisance cardiaque') || lastMessage.includes('fevg')) {
      return `❤️ **Les 4 Piliers Fondamentaux de l'Insuffisance Cardiaque à FEVG réduite (≤ 40%) :**

1. **ARNI** (Sacubitril / Valsartan - Entresto) ou IEC/ARA2.
2. **Bêtabloquant cardio-sélectif** (Bisoprolol, Carvédilol, Métoprolol).
3. **ARM** (Spironolactone ou Éplérénone).
4. **Inhibiteur des SGLT2** (Dapagliflozine 10 mg ou Empagliflozine 10 mg).

Ces 4 molécules diminuent de façon synergique et statistiquement significative la mortalité globale et les réhospitalisations.`;
    }

    return `Bonjour Docteur ! Je suis l'**Assistant Médical Intelligent AS MEDIX**, entraîné sur les recommandations des collèges médicaux, l'ECNi et le programme officiel du Résidanat en Algérie.

Je peux vous aider à :
- Clarifier un mécanisme physiopathologique complexe.
- Rédiger un protocole de conduite à tenir (CAT) d'urgence.
- Générer des QCM d'entraînement personnalisés sur vos points faibles.
- Résumer les notions clés d'un cours volumineux.

Quelle notion médicale souhaitez-vous réviser ou approfondir aujourd'hui ?`;
  }

  async generateQcm(topic: string, specialty: string): Promise<any> {
    return {
      title: `QCM IA : ${topic || 'Sémiologie Médicale'}`,
      specialtyName: specialty || 'Médecine',
      vignette: `Cas clinique généré par l'IA : Patient de 54 ans consultant pour une symptomatologie aiguë en rapport avec : ${topic}.`,
      question: `Parmi les propositions suivantes concernant ${topic}, laquelle est exacte ?`,
      options: [
        { letter: 'A', text: 'Le diagnostic de certitude est exclusivement clinique sans nécessité d\'imagerie' },
        { letter: 'B', text: 'Le traitement de première intention repose sur une prise en charge urgente adaptée' },
        { letter: 'C', text: 'Les bêtabloquants sont formellement indiqués à la phase de choc non contrôlé' },
        { letter: 'D', text: 'L\'antibiothérapie doit être différée de 72h systématiquement' }
      ],
      correctAnswer: 'B',
      explanation: `Explication générée par le tuteur IA : Dans la prise en charge de ${topic}, l'évaluation hémodynamique et la mise en œuvre précoce du protocole thérapeutique adapté conditionnent le pronostic vital.`
    };
  }

  async generateClinicalCase(specialty: string, difficulty: string): Promise<any> {
    return {
      title: `Cas Clinique IA : Décompensation aiguë en ${specialty}`,
      difficulty,
      patient: {
        age: 63,
        gender: 'Homme',
        motif: `Détresse d'apparition brutale relevant de la spécialité ${specialty}.`
      },
      firstStep: {
        vitals: 'PA 155/90 mmHg, FC 105 bpm, SpO2 91% en air ambiant',
        question: 'Quelle est la première mesure de réanimation à entreprendre immédiatement ?',
        expectedAction: 'Mise en condition, oxygénothérapie titrée et pose d\'une voie veineuse périphérique.'
      }
    };
  }

  async summarizeCourse(htmlContent: string): Promise<string[]> {
    return [
      'Points cardinaux : Diagnostic précoce basé sur la clinique et la biologie ciblée.',
      'Critères de gravité imposant une surveillance continue en unité de soins intensifs.',
      'Stratégie thérapeutique en 2 étapes : stabilisation d\'urgence puis traitement de fond prévenant les récidives.'
    ];
  }
}

export const aiProvider = new MockMedicalAIProvider();
