/**
 * Unified AI Integration Service for AS-MEDIX Platform
 * Supports both Google AI Studio (Gemini API) and OpenRouter API
 */

export type AIProviderType = 'google_ai_studio' | 'openrouter' | 'openai' | 'anthropic' | 'deepseek' | 'codecraft';

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

  let cleanModel = (config.model || DEFAULT_GOOGLE_MODEL).replace(/^models\//i, '').trim();

  const modelCandidates = [
    cleanModel,
    cleanModel.endsWith('-latest') ? cleanModel : `${cleanModel}-latest`,
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash-thinking-exp-01-21',
    'gemini-2.0-pro-exp-02-05',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro'
  ];

  const uniqueModels = Array.from(new Set(modelCandidates));
  let lastErr: Error | null = null;

  for (const modelToTry of uniqueModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelToTry}:generateContent?key=${apiKey.trim()}`;

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

      if (response.status === 404 || errMessage.includes('not found') || errMessage.includes('not supported')) {
        lastErr = new Error(errMessage);
        continue;
      }
      throw new Error(errMessage);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      throw new Error('Aucune réponse générée par Google AI Studio.');
    }

    return reply;
  }

  throw lastErr || new Error(`Le modèle ${cleanModel} n'est pas disponible sur Google AI Studio.`);
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
 * Call OpenAI API
 */
export async function callOpenAIAPI(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  config: AIProviderConfig = {},
  jsonMode: boolean = false
): Promise<string> {
  const apiKey = config.apiKey || process.env.OPENAI_API_KEY || '';
  if (!apiKey) {
    throw new Error('Clé API OpenAI manquante. Veuillez saisir votre clé API OpenAI.');
  }

  const model = config.model || 'gpt-4o';
  const payload: any = {
    model,
    messages,
    temperature: 0.2,
  };

  if (jsonMode) {
    payload.response_format = { type: 'json_object' };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey.trim()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errMessage = `Erreur OpenAI API (${response.status})`;
    try {
      const errJson = JSON.parse(errorText);
      if (errJson.error?.message) errMessage = errJson.error.message;
    } catch (_) {}
    throw new Error(errMessage);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error('Aucune réponse générée par l\'IA OpenAI.');
  }

  return reply;
}

/**
 * Call DeepSeek API
 */
export async function callDeepSeekAPI(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  config: AIProviderConfig = {},
  jsonMode: boolean = false
): Promise<string> {
  const apiKey = config.apiKey || process.env.DEEPSEEK_API_KEY || '';
  if (!apiKey) {
    throw new Error('Clé API DeepSeek manquante. Veuillez saisir votre clé API DeepSeek.');
  }

  const model = config.model || 'deepseek-chat';
  const payload: any = {
    model,
    messages,
    temperature: 0.2,
  };

  if (jsonMode) {
    payload.response_format = { type: 'json_object' };
  }

  const endpoints = [
    'https://api.deepseek.com/chat/completions',
    'https://api.deepseek.com/v1/chat/completions'
  ];

  let lastErr: Error | null = null;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errMessage = `Erreur DeepSeek API (${response.status})`;
        try {
          const errJson = JSON.parse(errorText);
          if (errJson.error?.message) errMessage = errJson.error.message;
        } catch (_) {}
        if (response.status === 404) {
          lastErr = new Error(errMessage);
          continue;
        }
        throw new Error(errMessage);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;

      if (!reply) {
        throw new Error('Aucune réponse générée par l\'IA DeepSeek.');
      }

      return reply;
    } catch (e: any) {
      if (!e.message?.includes('404')) throw e;
      lastErr = e;
    }
  }

  throw lastErr || new Error('Impossible de contacter l\'API DeepSeek.');
}

/**
 * Call Anthropic API
 */
export async function callAnthropicAPI(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  config: AIProviderConfig = {},
  jsonMode: boolean = false
): Promise<string> {
  const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY || '';
  if (!apiKey) {
    throw new Error('Clé API Anthropic manquante. Veuillez saisir votre clé API Anthropic.');
  }

  const model = config.model || 'claude-3-5-sonnet-20241022';
  const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
  const userMessages = messages.filter(m => m.role !== 'system').map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content
  }));

  const payload: any = {
    model,
    max_tokens: 8192,
    messages: userMessages,
    temperature: 0.2,
  };

  if (systemInstruction) {
    payload.system = systemInstruction;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey.trim(),
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errMessage = `Erreur Anthropic API (${response.status})`;
    try {
      const errJson = JSON.parse(errorText);
      if (errJson.error?.message) errMessage = errJson.error.message;
    } catch (_) {}
    throw new Error(errMessage);
  }

  const data = await response.json();
  const reply = data.content?.[0]?.text;

  if (!reply) {
    throw new Error('Aucune réponse générée par l\'IA Anthropic.');
  }

  return reply;
}

/**
 * Call CodeCraft API (https://codecraftapi.com/v1)
 */
export async function callCodeCraftAPI(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  config: AIProviderConfig = {},
  jsonMode: boolean = false
): Promise<string> {
  const apiKey = config.apiKey || process.env.CODECRAFT_API_KEY || '';
  if (!apiKey) {
    throw new Error('Clé API CodeCraft manquante. Veuillez saisir votre clé API CodeCraft.');
  }

  const model = config.model || 'codecraft-pro';
  const payload: any = {
    model,
    messages,
    temperature: 0.2,
  };

  if (jsonMode) {
    payload.response_format = { type: 'json_object' };
  }

  const endpoints = [
    'https://codecraftapi.com/v1/chat/completions',
    'https://codecraftapi.com/api/v1/chat/completions',
    'https://codecraftapi.com/chat/completions'
  ];

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${apiKey.trim()}`,
    'x-api-key': apiKey.trim(),
    'api-key': apiKey.trim(),
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  let lastError: Error | null = null;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        const isHtmlError = errorText.toLowerCase().includes('<!doctype') || errorText.toLowerCase().includes('just a moment') || errorText.toLowerCase().includes('cloudflare');
        let errDetail = isHtmlError ? '[CLOUDFLARE_403_BOT_BLOCK] Protection Cloudflare Challenge active sur CodeCraft API.' : errorText;

        try {
          if (!isHtmlError) {
            const errJson = JSON.parse(errorText);
            if (errJson.error?.message) errDetail = errJson.error.message;
            else if (errJson.message) errDetail = errJson.message;
            else if (errJson.error) errDetail = typeof errJson.error === 'string' ? errJson.error : JSON.stringify(errJson.error);
          }
        } catch (_) {}

        let errMessage = `Erreur CodeCraft API (${response.status})`;
        if (response.status === 403 || isHtmlError) {
          errMessage = `⚠️ Le domaine CodeCraft (codecraftapi.com) est actuellement sous protection anti-robot Cloudflare (HTTP 403 Challenge). Le pare-feu de CodeCraft bloque les requêtes automatiques API. Veuillez utiliser votre clé gratuite Google AI Studio (Gemini) ou OpenRouter pour générer le cours sans aucune restriction.`;
        } else if (response.status === 401) {
          errMessage = `Clé API CodeCraft non valide (HTTP 401). Veuillez vérifier votre clé sur codecraftapi.com. ${errDetail ? `Détails: ${errDetail}` : ''}`;
        } else if (errDetail) {
          errMessage = `Erreur CodeCraft API (${response.status}): ${errDetail}`;
        }

        if (response.status === 404) {
          lastError = new Error(errMessage);
          continue;
        }
        throw new Error(errMessage);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        throw new Error('Aucune réponse générée par l\'IA CodeCraft.');
      }

      return reply;
    } catch (err: any) {
      if (err.message && !err.message.includes('404')) {
        throw err;
      }
      lastError = err;
    }
  }

  throw lastError || new Error('Impossible d\'atteindre l\'API CodeCraft sur https://codecraftapi.com/v1');
}

/**
 * Unified AI API Call
 */
export async function callUnifiedAI(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  config: AIProviderConfig = {},
  jsonMode: boolean = false
): Promise<string> {
  const provider = config.provider || 'google_ai_studio';

  if (provider === 'google_ai_studio') {
    return callGoogleAIStudio(messages, config, jsonMode);
  } else if (provider === 'openrouter') {
    return callOpenRouterAPI(messages, config, jsonMode);
  } else if (provider === 'openai') {
    return callOpenAIAPI(messages, config, jsonMode);
  } else if (provider === 'deepseek') {
    return callDeepSeekAPI(messages, config, jsonMode);
  } else if (provider === 'anthropic') {
    return callAnthropicAPI(messages, config, jsonMode);
  } else if (provider === 'codecraft') {
    return callCodeCraftAPI(messages, config, jsonMode);
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
Ta mission est de prendre un cours médical (PDF, polycopié, annales) et de le transformer en une PRÉSENTATION DE TYPE ATLAS MÉDICAL ILLUSTRE, HAUTEMENT COLORÉE, DYNAMIQUE, ERGONOMIQUE ET ULTRA-PROFESSIONNELLE.

CONSIGNE CAPITALE ABSOLUE - CONSERVATION 100/100 DES DÉTAILS :
- Tu dois conserver 100% DE L'INTEGRALITÉ DU CONTENU DU DOCUMENT SOURCE. Ne résume AUCUN paragraphe, ne supprime AUCUNE classification, donnée chiffrée, dose, signe clinique, nuance ou tableau. Chaque information présente dans le document original DOIT figurer dans le résultat HTML final.

Consignes strictes de réponse en JSON :
Renvoie EXCLUSIVEMENT un objet JSON valide avec ces clés :
1. "title": Le titre médical principal du cours (court, précis, sans numéro de chapitre).
2. "subtitle": Le sous-titre / thématique clinique (ex: "Diagnostic positif, physiopathologie et stratégie thérapeutique").
3. "description": Un résumé clinique concis de 2-3 phrases (environ 150-200 caractères) présentant le cours.
4. "summaryPoints": Un tableau de 5 à 7 points clés essentiels pour le concours de Résidanat ("À retenir pour le concours").
5. "tableOfContents": Un tableau d'objets [{"id": "sec-1", "title": "1. Titre de section", "level": 1}] pour chaque section principale.
6. "htmlContent": Le code HTML complet du cours rédigé au format Livre / Atlas Médical.

EXIGENCES STYLE LIVRE & ATLAS MÉDICAL ("htmlContent") :

1. TITRES COLORÉS ET STYLISÉS STYLE LIVRE MÉDICAL :
- Titres H2 colorés avec ancres ID obligatoires : <h2 id="sec-1" class="text-2xl font-black text-brand-700 dark:text-brand-300 mt-8 mb-4 border-b-2 border-brand-500/30 pb-2 flex items-center gap-3"><span class="px-2.5 py-0.5 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300 text-xs font-black uppercase tracking-wider">SECTION 1</span>...</h2>
- Assure-toi que chaque section principale H2 a un identifiant unique (id="sec-1", id="sec-2", id="sec-3", etc.) correspondant au tableau "tableOfContents" pour permettre la navigation fluide au clic.
- Titres H3 stylisés : <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-300 mt-6 mb-3 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-indigo-500"></span>...</h3>

2. SCHÉMAS VISUELS, DIAGRAMMES & PRÉSENTATIONS ANATOMIQUES :
- Quand le cours aborde l'Anatomie ou la Histologie : Génère des encadrés de présentation anatomique modernes avec schémas SVG propres et repères visuels (ex: vascularisation, rapports anatomiques, couches tissulaires). Ex: <div class="my-6 p-5 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-lg"><div class="flex items-center gap-2 text-sky-400 font-bold text-sm uppercase mb-3">🫀 Repères Anatomiques et Histologiques</div>...</div>
- Quand le cours contient une Physiopathologie ou Cascade d'événements : Génère des schémas / flowcharts visuels en HTML/SVG ou en étapes numérotées flex/grid (ex: Étiologie ➔ Mécanisme ➔ Manifestation clinique).
- Pour les Arbres Décisionnels Diagnostiques & Thérapeutiques : Formate des organigrammes visuels clairs avec des connecteurs et des badges colorés.

3. ENCADRÉS VISUELS COLORÉS (CALLOUTS LIVRE MÉDICAL) :
- 📌 Rappel Anatomique / Physiopathologique : <div class="rappel p-4 rounded-2xl bg-amber-50/80 border border-amber-200 dark:bg-amber-950/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200 my-4 shadow-xs">📌 <strong>Rappel Physiopathologique :</strong> ...</div>
- 💡 Perles Cliniques & Mnémotechniques : <div class="note p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 my-4 shadow-xs">💡 <strong>Perle Clinique / Mnémotechnique :</strong> ...</div>
- ⚠️ Pièges Concours & Diagnostic : <div class="piege p-4 rounded-2xl bg-orange-50/80 border border-orange-200 dark:bg-orange-950/30 text-xs sm:text-sm text-orange-900 dark:text-orange-200 my-4 shadow-xs">⚠️ <strong>Piège Concours :</strong> ...</div>
- 🚨 Urgences & Red Flags : <div class="urgence p-4 rounded-2xl bg-rose-50/80 border border-rose-200 dark:bg-rose-950/30 text-xs sm:text-sm text-rose-900 dark:text-rose-200 my-4 shadow-xs">🚨 <strong>Alerte Urgence :</strong> ...</div>
- 💊 Prise en Charge Thérapeutique : <div class="traitement p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/30 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 my-4 shadow-xs">💊 <strong>Prise en Charge Thérapeutique :</strong> ...</div>
- ⭐ Points Clés & Résumé : <div class="point-cle p-4 rounded-2xl bg-purple-50/70 border border-purple-200 dark:bg-purple-950/30 text-xs sm:text-sm text-purple-900 dark:text-purple-200 my-4 shadow-xs">⭐ <strong>Point Clé Concours :</strong> ...</div>

4. TABLEAUX ET COMPARATIFS ÉLÉGANTS :
- Formate les tableaux originaux avec un style moderne (en-têtes foncés ou pastel, bordures arrondies, badges de couleurs dans les cellules).

5. CONSERVATION INTEGRALE DU CONTENU (100% DU DOCUMENT SOURCE) :
- Ne supprime AUCUN paragraphe, donnée clinique, tableau ou classification du document original.
- Ne rajoute PAS de section "Dernières Recommandations" à la fin du cours si elle ne figure pas dans le document. Conserve la fin naturelle du cours.
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
