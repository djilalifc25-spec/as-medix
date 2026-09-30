import { autoFormatCourseHtml, extractMetadataFromHtml } from '@/lib/autoHtmlFormatter';
import { callUnifiedAI, type AIExtractedCourseData, type AIProviderConfig } from '@/lib/ai/openrouter';

const CHUNK_CHARS = 6500;

const HTML_FRAGMENT_SYSTEM = `Tu es l'éditeur visuel AS-MEDIX. Tu convertis un extrait de polycopié médical en HTML Tailwind identique au lecteur de cours AS-MEDIX (plein écran : titres navy, encadrés colorés, listes, tableaux).

RÈGLE ABSOLUE — FIDÉLITÉ 100/100 :
- Conserve CHAQUE phrase, chiffre, dose, classification, critère, exception, tableau et liste du texte source.
- Ne résume PAS. Ne fusionne PAS des paragraphes en "points clés". N'omets AUCUNE ligne utile.
- N'invente AUCUNE information médicale absente du texte.
- Tu peux seulement structurer (h2/h3/p/ul/table) et habiller avec les classes ci-dessous.

HTML AUTORISÉ (fragment uniquement, PAS de json, PAS de markdown, PAS de \`\`\`) :
- <section id="sec-N" class="mb-10"> ... </section>
- <h2 id="sec-N" class="text-2xl font-bold text-navy-900 dark:text-white mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">...</h2>
- <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-300 mt-6 mb-3">...</h3>
- <p class="text-navy-700 dark:text-navy-300 leading-relaxed mb-4">...</p>
- <ul class="list-disc pl-6 space-y-1 text-navy-700 dark:text-navy-300"> / <ol class="list-decimal pl-6 space-y-1 ...">
- Tableaux : <table class="w-full my-6 text-sm border-collapse border border-navy-200 dark:border-navy-700 rounded-2xl overflow-hidden">
- Encadrés :
  * 🎯 Objectif / concours : <div class="p-4 my-4 rounded-xl border border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/50 dark:bg-indigo-950/20">
  * 📌 Rappel : fond amber
  * ⚠️ Piège : fond orange
  * 🚨 Urgence : fond rose
  * 💊 Traitement : fond emerald
  * ⭐ À retenir : fond purple

Si le texte est une continuation, NE répète PAS le titre du cours. Continue les sections.`;

const META_SYSTEM = `Extrais uniquement les métadonnées d'un cours médical. Réponds en JSON strict :
{"title":"...","subtitle":"...","description":"...","summaryPoints":["..."]}
title = titre clinique court. subtitle = thématique. description = 2 phrases. summaryPoints = 5-7 points tirés du texte (sans inventer).
Ne mets PAS le cours entier dans ce JSON.`;

export function splitCourseIntoChunks(raw: string, maxChars = CHUNK_CHARS): string[] {
  const text = (raw || '')
    .replace(/\r\n/g, '\n')
    .replace(/\f/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!text) return [];
  if (text.length <= maxChars) return [text];

  const blocks = text.split(/\n{2,}/);
  const chunks: string[] = [];
  let buf = '';

  for (const block of blocks) {
    const next = buf ? `${buf}\n\n${block}` : block;
    if (next.length > maxChars && buf) {
      chunks.push(buf.trim());
      buf = block;
    } else {
      buf = next;
    }
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks;
}

function stripFences(s: string): string {
  return s
    .replace(/^\s*```(?:html|json|HTML)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();
}

function visibleText(htmlOrText: string): string {
  return htmlOrText
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function coverageOk(source: string, html: string): boolean {
  const a = visibleText(source).length;
  const b = visibleText(html).length;
  if (a < 80) return true;
  return b >= a * 0.75;
}

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

export function formatCourseLocally(rawTextOrHtml: string): AIExtractedCourseData {
  const formatted = autoFormatCourseHtml(rawTextOrHtml);
  const meta = extractMetadataFromHtml(formatted.htmlContent);
  const tocTitles = formatted.tableOfContents.map(t => t.title).filter(Boolean).slice(0, 7);

  return {
    title: meta.title || 'Cours médical',
    subtitle: meta.subtitle || 'Présentation intégrale du polycopié',
    description: meta.description || visibleText(rawTextOrHtml).slice(0, 220),
    summaryPoints: tocTitles.length ? tocTitles : ['Contenu intégral conservé depuis le document source'],
    tableOfContents: formatted.tableOfContents,
    htmlContent: formatted.htmlContent
  };
}

async function convertChunkToHtml(
  chunk: string,
  index: number,
  total: number,
  config: AIProviderConfig,
  contextInfo: { specialty?: string; year?: number }
): Promise<string> {
  const userPrompt = `Spécialité : ${contextInfo.specialty || 'Médecine'} ${contextInfo.year ? `• Année ${contextInfo.year}` : ''}
Fragment ${index + 1} / ${total}. Convertis CE fragment en HTML AS-MEDIX. Conserve 100% du texte.

TEXTE SOURCE :
${chunk}`;

  try {
    const reply = await callUnifiedAI(
      [
        { role: 'system', content: HTML_FRAGMENT_SYSTEM },
        { role: 'user', content: userPrompt }
      ],
      config,
      false
    );
    const html = stripFences(reply);
    if (!html || !coverageOk(chunk, html)) {
      return autoFormatCourseHtml(chunk).htmlContent;
    }
    return html;
  } catch {
    return autoFormatCourseHtml(chunk).htmlContent;
  }
}

async function extractMetadata(
  raw: string,
  config: AIProviderConfig,
  contextInfo: { specialty?: string; year?: number }
): Promise<Pick<AIExtractedCourseData, 'title' | 'subtitle' | 'description' | 'summaryPoints'>> {
  const sample = raw.slice(0, 5000);
  try {
    const reply = await callUnifiedAI(
      [
        { role: 'system', content: META_SYSTEM },
        { role: 'user', content: `Spécialité : ${contextInfo.specialty || ''}\n\n${sample}` }
      ],
      config,
      true
    );
    const parsed = JSON.parse(stripFences(reply));
    return {
      title: parsed.title || 'Cours médical',
      subtitle: parsed.subtitle || 'Présentation intégrale',
      description: parsed.description || '',
      summaryPoints: Array.isArray(parsed.summaryPoints) ? parsed.summaryPoints : []
    };
  } catch {
    const local = formatCourseLocally(raw);
    return {
      title: local.title,
      subtitle: local.subtitle,
      description: local.description,
      summaryPoints: local.summaryPoints
    };
  }
}

/**
 * Convert a full PDF/text course into AS-MEDIX HTML without dropping content.
 * Uses sequential chunk conversion so long polycopiés are not truncated by one JSON call.
 */
export async function formatFullCoursePreservingContent(
  rawTextOrHtml: string,
  config: AIProviderConfig = {},
  contextInfo: { specialty?: string; year?: number } = {}
): Promise<AIExtractedCourseData> {
  const raw = (rawTextOrHtml || '').trim();
  if (!raw) {
    return formatCourseLocally('');
  }

  const hasKey = Boolean(
    config.apiKey ||
    process.env.OPENAI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_AI_STUDIO_API_KEY ||
    process.env.OPENROUTER_API_KEY
  );

  if (!hasKey && !config.provider) {
    return formatCourseLocally(raw);
  }

  const chunks = splitCourseIntoChunks(raw);
  const meta = await extractMetadata(raw, config, contextInfo);

  const htmlParts: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    htmlParts.push(await convertChunkToHtml(chunks[i], i, chunks.length, config, contextInfo));
  }

  const merged = htmlParts.join('\n');
  const polished = autoFormatCourseHtml(merged);
  const toc = polished.tableOfContents.length
    ? polished.tableOfContents
    : chunks.map((_, i) => ({ id: `sec-${i + 1}`, title: `Section ${i + 1}`, level: 1 }));

  if (!coverageOk(raw, polished.htmlContent)) {
    const fallback = autoFormatCourseHtml(raw);
    return {
      ...meta,
      title: meta.title,
      subtitle: meta.subtitle,
      description: meta.description,
      summaryPoints: meta.summaryPoints,
      tableOfContents: fallback.tableOfContents,
      htmlContent: fallback.htmlContent
    };
  }

  return {
    ...meta,
    tableOfContents: toc,
    htmlContent: polished.htmlContent,
    title: meta.title || slugifyTitle(extractMetadataFromHtml(polished.htmlContent).title || 'Cours')
  };
}
