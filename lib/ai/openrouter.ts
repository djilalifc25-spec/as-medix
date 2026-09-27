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
  const systemPrompt = `Tu es l'Intelligence Artificielle Médicale Spécialisée et Éditeur d'Atlas Médicaux d'AS-MEDIX.
Ta mission est de prendre un cours médical (PDF, polycopié, annales) et de le transformer en une PRÉSENTATION DE TYPE LIVRE / ATLAS MÉDICAL ILLUSTRE, HAUTEMENT COLORÉE, DYNAMIQUE ET ÉLÉGANTE.

Consignes strictes de réponse en JSON :
Renvoie EXCLUSIVEMENT un objet JSON valide avec ces clés :
1. "title": Le titre médical principal du cours (court, précis, sans numéro de chapitre).
2. "subtitle": Le sous-titre / thématique clinique (ex: "Diagnostic positif, physiopathologie et stratégie thérapeutique").
3. "description": Un résumé clinique concis de 2-3 phrases (environ 150-200 caractères) présentant le cours.
4. "summaryPoints": Un tableau de 5 à 7 points clés essentiels pour le concours de Résidanat ("À retenir pour le concours").
5. "tableOfContents": Un tableau d'objets [{"id": "sec-1", "title": "1. Titre de section", "level": 1}] pour chaque section principale.
6. "htmlContent": Le code HTML complet du cours rédigé au format Livre / Atlas Médical.

EXIGENCES STYLE LIVRE & ATLAS MÉDICAL ("htmlContent") :

1. TOOLBAR DE NAVIGATION RAPIDE EN HAUT DU COURS :
Au tout début de "htmlContent", commence OBLIGATOIREMENT par ce bloc HTML de navigation rapide :
<div class="quick-nav-bar p-3.5 mb-8 rounded-2xl bg-gradient-to-r from-navy-900 via-brand-950 to-navy-900 text-white border border-navy-700 shadow-md flex items-center justify-between flex-wrap gap-2 not-prose">
  <div class="flex items-center gap-1.5 text-xs font-bold flex-wrap">
    <span class="text-amber-400 mr-1 font-black">⚡ Accès Rapide :</span>
    <button onclick="document.querySelector('.rappel')?.scrollIntoView({behavior:'smooth'})" class="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-bold transition-all cursor-pointer">📌 Rappels</button>
    <button onclick="document.querySelector('.note')?.scrollIntoView({behavior:'smooth'})" class="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 text-[11px] font-bold transition-all cursor-pointer">💡 Perles</button>
    <button onclick="document.querySelector('.piege')?.scrollIntoView({behavior:'smooth'})" class="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 border border-orange-500/40 text-[11px] font-bold transition-all cursor-pointer">⚠️ Pièges</button>
    <button onclick="document.querySelector('.urgence')?.scrollIntoView({behavior:'smooth'})" class="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-[11px] font-bold transition-all cursor-pointer">🚨 Urgences</button>
    <button onclick="document.querySelector('.traitement')?.scrollIntoView({behavior:'smooth'})" class="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-[11px] font-bold transition-all cursor-pointer">💊 Traitement</button>
  </div>
  <button onclick="if(document.fullscreenElement){document.exitFullscreen()}else{document.documentElement.requestFullscreen()}" class="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-black shadow-xs transition-all flex items-center gap-1 cursor-pointer">
    🖥️ Plein Écran
  </button>
</div>

2. TITRES COLORÉS ET STYLISÉS STYLE LIVRE MÉDICAL :
- Titres H2 colorés avec badges : <h2 class="text-2xl font-black text-brand-700 dark:text-brand-300 mt-8 mb-4 border-b-2 border-brand-500/30 pb-2 flex items-center gap-3"><span class="px-2.5 py-0.5 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 text-xs font-black uppercase tracking-wider">SECTION</span>...</h2>
- Titres H3 stylisés : <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-300 mt-6 mb-3 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-indigo-500"></span>...</h3>

3. SURLIGNAGE ET MOTS-CLÉS :
- N'ajoute PAS de balises <mark> ni de surlignage automatique de texte. L'utilisateur utilise son propre outil interactif de surlignage et de prise de notes.
- Garde une typographie épurée, élégante, ultra-lisible de style livre de médecine d'excellence.

4. ENCADRÉS VISUELS COLORÉS (CALLOUTS LIVRE MÉDICAL) :
- 📌 Rappel : <div class="rappel p-4 rounded-2xl bg-amber-50/80 border border-amber-200 dark:bg-amber-950/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200 my-4 shadow-xs">📌 <strong>Rappel Physiopathologique :</strong> ...</div>
- 💡 Perles : <div class="note p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 my-4 shadow-xs">💡 <strong>Perle Clinique / Mnémotechnique :</strong> ...</div>
- ⚠️ Pièges : <div class="piege p-4 rounded-2xl bg-orange-50/80 border border-orange-200 dark:bg-orange-950/30 text-xs sm:text-sm text-orange-900 dark:text-orange-200 my-4 shadow-xs">⚠️ <strong>Piège Concours :</strong> ...</div>
- 🚨 Urgences : <div class="urgence p-4 rounded-2xl bg-rose-50/80 border border-rose-200 dark:bg-rose-950/30 text-xs sm:text-sm text-rose-900 dark:text-rose-200 my-4 shadow-xs">🚨 <strong>Alerte Urgence :</strong> ...</div>
- 💊 Traitement : <div class="traitement p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/30 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 my-4 shadow-xs">💊 <strong>Prise en Charge Thérapeutique :</strong> ...</div>

5. CONSERVATION INTEGRALE DU CONTENU (100% DU PDF) :
- Ne supprime AUCUN paragraphe, donnée clinique, tableau ou classification du document original.
- Ne rajoute PAS de section "Dernières Recommandations" à la fin du cours. Conserve la fin naturelle du cours.
- Ne réponds rien d'autre que l'objet JSON strict.`;

  const userPrompt = `Spécialité : ${contextInfo.specialty || 'Médecine General'} ${contextInfo.year ? `• Année : ${contextInfo.year}` : ''}

Voici le document / cours médical brut à analyser et formater (100% Conservation de tout le texte) :
${rawTextOrHtml.substring(0, 90000)}`;

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
