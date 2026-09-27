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
  const systemPrompt = `Tu es l'Intelligence Artificielle Médicale Spécialisée d'AS-MEDIX, experte en pédagogie médicale universitaire et préparation au concours de Résidanat.
Ta mission est de prendre un cours médical brut (polycopié, annales, texte ou HTML) et de produire une PRÉSENTATION MÉDICALE PROFESSIONNELLE HAUT DE GAMME 100% conforme aux standards AS-MEDIX.

Consignes strictes de réponse en JSON :
Renvoie EXCLUSIVEMENT un objet JSON valide avec ces clés :
1. "title": Le titre médical principal du cours (court, précis, sans numéro de chapitre).
2. "subtitle": Le sous-titre / thématique clinique (ex: "Diagnostic positif, physiopathologie et stratégie thérapeutique").
3. "description": Un résumé clinique concis de 2-3 phrases (environ 150-200 caractères) présentant le cours.
4. "summaryPoints": Un tableau de 5 à 7 points clés essentiels pour le concours de Résidanat ("À retenir pour le concours").
5. "tableOfContents": Un tableau d'objets [{"id": "sec-1", "title": "1. Titre de section", "level": 1}] pour chaque section principale.
6. "htmlContent": Le code HTML complet du cours structuré et enrichi.

RÈGLES DE MISE EN FORME UNIQUE ET PROFESSIONNELLE POUR "htmlContent" :

1. TOOLBAR DE NAVIGATION RAPIDE EN HAUT DU COURS :
Au tout début de "htmlContent", commence OBLIGATOIREMENT par ce bloc HTML de navigation rapide :
<div class="quick-nav-bar p-3.5 mb-8 rounded-2xl bg-gradient-to-r from-navy-900 via-brand-950 to-navy-900 text-white border border-navy-700 shadow-md flex items-center justify-between flex-wrap gap-2 not-prose">
  <div class="flex items-center gap-1.5 text-xs font-bold flex-wrap">
    <span class="text-amber-400 mr-1 font-black">⚡ Accès Rapide :</span>
    <button onclick="document.querySelector('.rappel')?.scrollIntoView({behavior:'smooth'})" class="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-bold transition-all">📌 Rappels</button>
    <button onclick="document.querySelector('.note')?.scrollIntoView({behavior:'smooth'})" class="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 text-[11px] font-bold transition-all">💡 Perles</button>
    <button onclick="document.querySelector('.piege')?.scrollIntoView({behavior:'smooth'})" class="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 border border-orange-500/40 text-[11px] font-bold transition-all">⚠️ Pièges</button>
    <button onclick="document.querySelector('.urgence')?.scrollIntoView({behavior:'smooth'})" class="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-[11px] font-bold transition-all">🚨 Urgences</button>
    <button onclick="document.querySelector('.traitement')?.scrollIntoView({behavior:'smooth'})" class="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-[11px] font-bold transition-all">💊 Traitement</button>
  </div>
  <button onclick="if(document.fullscreenElement){document.exitFullscreen()}else{document.documentElement.requestFullscreen()}" class="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-black shadow-xs transition-all flex items-center gap-1 cursor-pointer">
    🖥️ Plein Écran
  </button>
</div>

2. STRUCTURE PAR SECTIONS ET TITRES :
- Découpe le cours en <section id="sec-1" class="mb-10">, <section id="sec-2" class="mb-10">, etc.
- Titres principaux H2 : <h2 class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2 flex items-center gap-2">...</h2>
- Titres secondaires H3 : <h3 class="text-lg font-bold text-navy-800 dark:text-navy-100 mt-5 mb-2">...</h3>

3. ENCADRÉS VISUELS COULORÉS (CALLOUTS MÉDICAUX) :
Insère généreusement des encadrés colorés pour faire ressortir la valeur médicale :
- 📌 Rappel Prérequis : <div class="rappel p-4 rounded-2xl bg-amber-50/80 border border-amber-200 dark:bg-amber-950/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200 my-4">📌 <strong>Rappel Physiopathologique :</strong> ...</div>
- 💡 Perles Cliniques : <div class="note p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 my-4">💡 <strong>Perle Clinique / Mnémotechnique :</strong> ...</div>
- ⚠️ Pièges Concours / QCM : <div class="piege p-4 rounded-2xl bg-orange-50/80 border border-orange-200 dark:bg-orange-950/30 text-xs sm:text-sm text-orange-900 dark:text-orange-200 my-4">⚠️ <strong>Piège Concours Résidanat :</strong> ...</div>
- 🚨 Urgences / Gravité : <div class="urgence p-4 rounded-2xl bg-rose-50/80 border border-rose-200 dark:bg-rose-950/30 text-xs sm:text-sm text-rose-900 dark:text-rose-200 my-4">🚨 <strong>Alerte Vital / Conduite à Tenir :</strong> ...</div>
- 💊 Traitement & Posologies : <div class="traitement p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/30 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 my-4">💊 <strong>Prise en Charge Thérapeutique :</strong> ...</div>
- ⭐ Points Clés : <div class="point-cle p-4 rounded-2xl bg-sky-50/70 border border-sky-200 dark:bg-sky-950/30 text-xs sm:text-sm text-sky-900 dark:text-sky-200 my-4">⭐ <strong>Point Clé Synthèse :</strong> ...</div>

4. TABLEAUX ET LISTES SOIGNÉS :
- Tableaux : <table class="w-full my-6 text-xs border-collapse border border-navy-200 dark:border-navy-700 rounded-2xl overflow-hidden shadow-sm"> avec en-têtes <th class="p-3 bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white font-bold border border-navy-200 dark:border-navy-700 text-left">.
- Puces claires avec balises <strong> pour les termes clés.

5. EXACTITUDE MÉDICALE :
- Ne supprime AUCUNE donnée médicale essentielle. Preserve l'intégralité du texte tout en le sublimant visuellement.
- Ne réponds rien d'autre que l'objet JSON strict.`;

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
