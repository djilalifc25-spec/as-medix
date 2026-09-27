/**
 * Unified AI Integration Service for AS-MEDIX Platform
 * Supports both Google AI Studio (Gemini API) and OpenRouter API
 */

export type AIProviderType = 'google_ai_studio' | 'openrouter';

export interface AIProviderConfig {
  provider?: AIProviderType;
  apiKey?: string;
  model?: string;
}

export interface AIExtractedCourseData {
  title: string;
  subtitle: string;
  description: string;
  summaryPoints: string[];
  tableOfContents: { id: string; title: string; level: number }[];
  htmlContent: string;
}

const DEFAULT_OPENROUTER_MODEL = 'google/gemini-2.5-flash';
const DEFAULT_GOOGLE_MODEL = 'gemini-2.5-flash';

/**
 * Call Google AI Studio (Gemini API)
 */
export async function callGoogleAIStudio(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  config: AIProviderConfig = {},
  jsonMode: boolean = false
): Promise<string> {
  const apiKey = config.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_API_KEY || '';
  if (!apiKey) {
    throw new Error('Clé API Google AI Studio (Gemini) manquante. Veuillez saisir votre clé API Google AI Studio.');
  }

  const modelName = config.model || DEFAULT_GOOGLE_MODEL;
  const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
  const userMessages = messages.filter(m => m.role !== 'system');

  const contents = userMessages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const payload: any = {
    contents,
    generationConfig: {
      temperature: 0.2,
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  if (jsonMode) {
    payload.generationConfig.responseMimeType = 'application/json';
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errMessage = `Erreur Google AI Studio (${response.status})`;
    try {
      const errJson = JSON.parse(errorText);
      if (errJson.error?.message) errMessage = errJson.error.message;
    } catch (_) {}
    throw new Error(errMessage);
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    throw new Error('Aucune réponse générée par Google AI Studio.');
  }

  return reply;
}

/**
 * Call OpenRouter API
 */
export async function callOpenRouterAPI(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  config: AIProviderConfig = {},
  jsonMode: boolean = false
): Promise<string> {
  const apiKey = config.apiKey || process.env.OPENROUTER_API_KEY || '';
  if (!apiKey) {
    throw new Error('Clé API OpenRouter manquante. Veuillez saisir votre clé API OpenRouter.');
  }

  const model = config.model || process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;

  const payload: any = {
    model: model,
    messages: messages,
    temperature: 0.2,
  };

  if (jsonMode) {
    payload.response_format = { type: 'json_object' };
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey.trim()}`,
      'HTTP-Referer': 'https://www.asmedix.study',
      'X-Title': 'AS-MEDIX Medical Platform',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errMessage = `Erreur OpenRouter API (${response.status})`;
    try {
      const errJson = JSON.parse(errorText);
      if (errJson.error?.message) errMessage = errJson.error.message;
    } catch (_) {}
    throw new Error(errMessage);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error('Aucune réponse générée par l\'IA OpenRouter.');
  }

  return reply;
}

/**
 * Unified AI API Call (Google AI Studio OR OpenRouter)
 */
export async function callUnifiedAI(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  config: AIProviderConfig = {},
  jsonMode: boolean = false
): Promise<string> {
  const provider = config.provider || 'google_ai_studio';

  if (provider === 'google_ai_studio') {
    return callGoogleAIStudio(messages, config, jsonMode);
  } else {
    return callOpenRouterAPI(messages, config, jsonMode);
  }
}

/**
 * Intelligent AI Extractor & Formatter for Courses
 */
export async function aiAnalyzeAndFormatCourse(
  rawTextOrHtml: string,
  config: AIProviderConfig = {},
  contextInfo: { specialty?: string; year?: number } = {}
): Promise<AIExtractedCourseData> {
  const systemPrompt = `Tu es l'Intelligence Artificielle Médicale Spécialisée d'AS-MEDIX.
Ta mission est de prendre du texte brut ou du code HTML médical (cours, polycopié, annales) et d'extraire la structure exacte tout en produisant une présentation HTML médicale professionnelle 100% conforme au design AS-MEDIX.

Consignes strictes de réponse en JSON :
Renvoie EXCLUSIVEMENT un objet JSON valide avec ces clés :
1. "title": Le titre médical principal du cours (court, précis, sans numéro de chapitre).
2. "subtitle": Le sous-titre / thématique clinique (ex: "Diagnostic positif, physiopathologie et stratégie thérapeutique").
3. "description": Un résumé clinique concis de 2-3 phrases (environ 150-200 caractères) présentant le cours.
4. "summaryPoints": Un tableau de 5 à 7 points clés essentiels pour le concours de Résidanat ("À retenir pour le concours").
5. "tableOfContents": Un tableau d'objets [{"id": "sec-1", "title": "1. Titre de section", "level": 1}] pour chaque section principale.
6. "htmlContent": Le code HTML complet du cours structuré par balises <section id="sec-1">, <section id="sec-2">, etc.

Règles de mise en forme de "htmlContent" :
- Utilise des <section id="sec-X" class="mb-10"> pour chaque grande partie.
- Utilise des <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2"> pour les titres de sections.
- Insère des encadrés visuels attractifs pour mettre en valeur les éléments importants :
  • Note / Perle Clinique: <div class="note p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 my-4">💡 <strong>Perle Clinique :</strong> ...</div>
  • Rappel: <div class="rappel p-4 rounded-2xl bg-amber-50/80 border border-amber-200 dark:bg-amber-950/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200 my-4">📌 <strong>Rappel :</strong> ...</div>
  • Piège Résidanat: <div class="piege p-4 rounded-2xl bg-orange-50/80 border border-orange-200 dark:bg-orange-950/30 text-xs sm:text-sm text-orange-900 dark:text-orange-200 my-4">⚠️ <strong>Piège Concours :</strong> ...</div>
  • Urgence: <div class="urgence p-4 rounded-2xl bg-rose-50/80 border border-rose-200 dark:bg-rose-950/30 text-xs sm:text-sm text-rose-900 dark:text-rose-200 my-4">🚨 <strong>Urgence Vital :</strong> ...</div>
  • Traitement: <div class="traitement p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/30 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 my-4">💊 <strong>Prise en Charge :</strong> ...</div>
- Décore les tableaux avec : <table class="w-full my-6 text-xs border-collapse border border-navy-200 dark:border-navy-700 rounded-2xl overflow-hidden shadow-sm">
- Ne supprime AUCUNE information médicale essentielle.
- Ne réponds rien d'autre que du JSON strict.`;

  const userPrompt = `Spécialité : ${contextInfo.specialty || 'Médecine General'} ${contextInfo.year ? `• Année : ${contextInfo.year}` : ''}

Voici le document / cours médical brut à analyser et formater :
${rawTextOrHtml.substring(0, 25000)}`;

  const responseText = await callUnifiedAI(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    config,
    true
  );

  try {
    const jsonCleaned = responseText.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
    const parsed = JSON.parse(jsonCleaned);

    return {
      title: parsed.title || 'Cours Médical Extrait',
      subtitle: parsed.subtitle || 'Module de formation et annales',
      description: parsed.description || 'Présentation complète du cours médical.',
      summaryPoints: Array.isArray(parsed.summaryPoints) ? parsed.summaryPoints : [],
      tableOfContents: Array.isArray(parsed.tableOfContents) ? parsed.tableOfContents : [
        { id: 'sec-1', title: '1. Introduction & Généralités', level: 1 }
      ],
      htmlContent: parsed.htmlContent || rawTextOrHtml
    };
  } catch (parseErr) {
    console.error('[Unified AI] JSON parse error:', parseErr, responseText);
    throw new Error('Format de réponse JSON invalide reçu de l\'IA.');
  }
}
