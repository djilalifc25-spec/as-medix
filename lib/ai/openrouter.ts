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

  // Strictly respect the user's chosen model first. Only include alias variants of the chosen model.
  const modelCandidates = [
    cleanModel,
    cleanModel.endsWith('-latest') ? cleanModel : `${cleanModel}-latest`
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
  const { formatFullCoursePreservingContent } = await import('@/lib/ai/fullCourseFormatter');
  return formatFullCoursePreservingContent(rawTextOrHtml, config, contextInfo);
}

// Legacy single-shot course formatter prompt has been migrated to @/lib/ai/fullCourseFormatter


export interface AIExtractedCATData {
  title: string;
  specialtyId: string;
  specialtyName: string;
  urgencyLevel: 'Urgence Vitale' | 'Urgence Relative' | 'Prise en charge réglée';
  summary: string;
  conduiteHtml: string;
  evaluationInitiale: string[];
  conduiteImmediate: string[];
  traitementSpecifique: string[];
  redFlags: string[];
  clinicalPearls: string[];
}

/**
 * Intelligent AI Extractor & Formatter for Conduites à Tenir (CAT) / Emergency Protocols
 * Supports Document PDF, Raw Text, and Disease Name (Nom de la Maladie)
 */
export async function aiAnalyzeAndFormatCAT(
  rawTextOrUrl: string,
  config: AIProviderConfig = {},
  options: { specialtyId?: string } = {}
): Promise<AIExtractedCATData> {
  const systemPrompt = `Tu es l'Intelligence Artificielle Médicale Spécialisée en Médecine d'Urgence et Réanimation d'AS-MEDIX.
Ta mission est de prendre soit un nom de maladie (ex: "Crise d'asthme aiguë grave", "Angor instable", "Embolie pulmonaire", "Sepsis grave"), soit un document/texte de Conduite à Tenir (CAT) et de générer UN PROTOCOLE D'URGENCE MÉDICALE HAUTEMENT PROFESSIONNEL, 100% EXAGT ET RÉEL, COLORÉ, DYNAMIQUE ET ERGONOMIQUE.

CONSIGNE CAPITALE ABSOLUE - 100% DE PRÉCISION MÉDICALE + ENRICHISSEMENT ET POSOLOGIES EXACTES :
1. Si l'entrée est le nom d'une maladie/pathologie, utilise 100% de la littérature médicale internationale (SFMU, SRLF, ESC, GINA) pour créer une CAT d'urgence complète et exacte.
2. Si l'entrée est un document, conserve 100% du contenu (constantes vitales, posologies, voies d'administration, pièges cliniques, examens).
3. DÉTECTION DU MODULE / SPÉCIALITÉ MÉDICALE :
   Analyse la maladie traitée et détermine le code de spécialité ("specialtyId") et le nom ("specialtyName") parmi :
   - "cardio" : Cardiologie & Pathologies Vasculaires (Angor, SCA, IDM, Embolie pulmonaire, OAP, Troubles du rythme, Choc cardiogénique)
   - "neuro" : Neurologie (AVC, Coma, Convulsions, Hémorragie méningée, HED, Méningite)
   - "pneumo" : Pneumologie (Détresse respiratoire, Asthme AAG, Pneumothorax, SDRA)
   - "gastro" : Gastro-Entérologie & Chirurgie Digestive (Douleurs abdominales, Pancréatite, Occlusion, Hémorragie digestive)
   - "urgences" : Anesthésie-Réanimation & Urgences (Choc hypovolémique, Sepsis, Coup de chaleur, Hypothermie, Noyade, Strangulation, Electrisation, Polytrauma, Envenimation)
   - "nephro" : Néphrologie (Insuffisance Rénale Aiguë, IRA, GNA, Anurie)
   - "infectieux" : Infectiologie (Fièvre aux urgences, Purpura fulminans, Sepsis grave)
   - "endocrino", "pediatrie", "gyneco", "dermato", "rhumato", "orl", "ophtalmo", "uro", "ortho", "chirurgie"

Structure JSON de réponse (RETOURNE EXCLUSIVEMENT DU JSON VALIDE) :
{
  "title": "CAT UMC : Titre Précis de la Conduite à Tenir",
  "specialtyId": "cardio",
  "specialtyName": "Cardiologie & Pathologies Vasculaires",
  "urgencyLevel": "Urgence Vitale",
  "summary": "Définition, mécanismes physiopathologiques et critères de gravité immédiate...",
  "evaluationInitiale": ["Constantes vitales (PA, FC, SpO2, FR, Glycémie)", "Signes de choc / défaillance d'organe"],
  "conduiteImmediate": ["Mise en condition VVP, position, oxygénothérapie titrée"],
  "traitementSpecifique": ["Posologie exacte médicament 1 (ex: Adrénaline 0.5mg IM)", "Traitement 2"],
  "redFlags": ["Drapeau rouge 1 (piège à éviter absolument)", "Drapeau rouge 2"],
  "clinicalPearls": ["Perle clinique 1 de réanimation"],
  "conduiteHtml": "<div class=\"space-y-6\">... HTML professionnel et coloré avec Tailwind (cartes sombres, alertes rose-950/40, tableaux de doses, étapes 1️⃣ 2️⃣ 3️⃣) ...</div>"
}`;

  const userPrompt = `${options.specialtyId && options.specialtyId !== 'auto' ? `Spécialité Cible Imposée : ${options.specialtyId}` : 'Spécialité : Détection Automatique par l\'IA'}

Voici la maladie / document / protocole d'urgence brut à analyser et formater en CAT (100% de précision médicale) :
${rawTextOrUrl.substring(0, 90000)}`;

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
      title: parsed.title || 'Conduite à Tenir UMC',
      specialtyId: (options.specialtyId && options.specialtyId !== 'auto') ? options.specialtyId : (parsed.specialtyId || 'urgences'),
      specialtyName: parsed.specialtyName || 'Urgences',
      urgencyLevel: parsed.urgencyLevel || 'Urgence Vitale',
      summary: parsed.summary || 'Protocole d\'urgence médicale.',
      conduiteHtml: parsed.conduiteHtml || `<div class="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200">${rawTextOrUrl}</div>`,
      evaluationInitiale: Array.isArray(parsed.evaluationInitiale) ? parsed.evaluationInitiale : [],
      conduiteImmediate: Array.isArray(parsed.conduiteImmediate) ? parsed.conduiteImmediate : [],
      traitementSpecifique: Array.isArray(parsed.traitementSpecifique) ? parsed.traitementSpecifique : [],
      redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
      clinicalPearls: Array.isArray(parsed.clinicalPearls) ? parsed.clinicalPearls : []
    };
  } catch (parseErr) {
    console.error('[Unified AI CAT] JSON parse error:', parseErr, responseText);
    throw new Error('Format de réponse JSON invalide reçu de l\'IA.');
  }
}

export interface AIExtractedFicheData {
  title: string;
  specialtyId: string;
  specialtyName: string;
  category: string;
  estimatedReadTime: string;
  keyTakeaways: string[];
  htmlContent: string;
}

/**
 * Intelligent AI Generator for Flash Back / Fiches Flash Cards
 */
export async function aiGenerateFlashcardsFromCourse(
  input: string,
  config: AIProviderConfig = {},
  options: { specialtyId?: string } = {}
): Promise<AIExtractedFicheData[]> {
  const systemPrompt = `Tu es l'Intelligence Artificielle Médicale Spécialisée en Pédagogie Médicale et Fiches Flash (Flash Back) d'AS-MEDIX.
Ta mission est de prendre un nom de cours, une liste de cours médicaux, ou du texte de cours (ex: "Insuffisance Cardiaque, HTA Sévère, Valvulopathies") et de générer pour chaque cours/sujet une FICHE FLASH / FLASH BACK MÉDICALE HAUTEMENT SYNTHÉTIQUE, DYNAMIQUE ET COLORÉE.

Pour chaque sujet/cours fourni, génère une fiche flash structurée de manière ergonomique et visuelle.

Structure JSON de réponse (RETOURNE EXCLUSIVEMENT UN TABLEAU JSON D'OBJETS) :
[
  {
    "title": "Fiche Mémo : Titre de la Fiche Flash",
    "specialtyId": "cardio",
    "specialtyName": "Cardiologie & Pathologies Vasculaires",
    "category": "Synthèse Clinique & Sémiologie",
    "estimatedReadTime": "3 min",
    "keyTakeaways": [
      "Point clé réflexe 1 (Critère diagnostique majeur...)",
      "Point clé réflexe 2 (Traitement de 1ère intention...)",
      "Point clé réflexe 3 (Piège ou contre-indication...)"
    ],
    "htmlContent": "<div class=\"space-y-4\"><div class=\"p-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm shadow-md\">... En-tête coloré ...</div><div class=\"p-4 rounded-2xl bg-slate-900 text-slate-100 border border-slate-700 space-y-2\"><h4 class=\"text-xs font-bold uppercase text-brand-300\">1. Diagnostic & Formes Cliniques</h4><ul class=\"text-xs space-y-1 text-slate-200\">...</ul></div><div class=\"p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs\"><strong class=\"text-amber-400\">⚠️ Pièges & Urgence :</strong> ...</div></div>"
  }
]`;

  const userPrompt = `${options.specialtyId && options.specialtyId !== 'auto' ? `Spécialité Cible Imposée : ${options.specialtyId}` : 'Spécialité : Détection Automatique par l\'IA'}

Voici les cours / sujets / textes pour générer les Fiches Flash (Flash Back) :
${input.substring(0, 90000)}`;

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
    const list = Array.isArray(parsed) ? parsed : [parsed];

    return list.map(item => ({
      title: item.title || 'Fiche Flash Révision',
      specialtyId: (options.specialtyId && options.specialtyId !== 'auto') ? options.specialtyId : (item.specialtyId || 'cardio'),
      specialtyName: item.specialtyName || 'Médecine',
      category: item.category || 'Synthèse Clinique',
      estimatedReadTime: item.estimatedReadTime || '3 min',
      keyTakeaways: Array.isArray(item.keyTakeaways) ? item.keyTakeaways : ['Point mémo révision'],
      htmlContent: item.htmlContent || `<div class="p-4 rounded-2xl bg-navy-900 text-white"><h3 class="font-bold">${item.title}</h3><p>${input}</p></div>`
    }));
  } catch (parseErr) {
    console.error('[Unified AI Flashcards] JSON parse error:', parseErr, responseText);
    throw new Error('Format de réponse JSON invalide reçu de l\'IA.');
  }
}

