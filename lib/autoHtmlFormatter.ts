/**
 * Utility to format and enrich raw HTML / Text for Courses and QCMs.
 * Guarantees ZERO loss, deletion, or modification of actual text or information.
 * Automatically decorates raw HTML elements (headings, tables, callouts, lists) 
 * with modern AS-MEDIX presentation design classes and builds table of contents.
 */

export interface FormattedCourseResult {
  htmlContent: string;
  tableOfContents: { id: string; title: string; level: number }[];
}

export function autoFormatCourseHtml(rawHtml: string): FormattedCourseResult {
  if (!rawHtml || typeof rawHtml !== 'string') {
    return {
      htmlContent: rawHtml || '',
      tableOfContents: [{ id: 'intro', title: '1. Introduction', level: 1 }]
    };
  }

  let text = rawHtml.trim();

  // If text has no HTML tags at all, convert plain text lines to structured HTML
  if (!/<[a-z][\s\S]*>/i.test(text)) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let htmlBuf: string[] = [];
    let secCount = 0;

    for (const line of lines) {
      if (/^(?:[I|V|X]+\.|\d+[\.-]\s*|[A-Z][\.-]\s*|définition|physiopathologie|épidémiologie|diagnostic|clinique|paraclinique|traitement|prise en charge|complications|pronostic|conclusion|résumé|arbre décisionnel)/i.test(line) && line.length < 90) {
        secCount++;
        htmlBuf.push(`<h2 id="sec-${secCount}" class="text-2xl font-bold text-navy-900 dark:text-white mt-8 mb-4 border-b border-navy-100 dark:border-navy-800 pb-2">${line}</h2>`);
      } else if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
        const itemText = line.replace(/^[-•*]\s*/, '');
        htmlBuf.push(`<div class="pl-4 border-l-2 border-brand-400 my-2 text-navy-800 dark:text-navy-200">${itemText}</div>`);
      } else {
        htmlBuf.push(`<p class="text-navy-700 dark:text-navy-300 leading-relaxed my-3">${line}</p>`);
      }
    }
    text = htmlBuf.join('\n');
  }

  let formatted = text;
  let toc: { id: string; title: string; level: number }[] = [];
  let headerIndex = 0;

  // Add IDs and AS-MEDIX styling to headings h1, h2, h3
  formatted = formatted.replace(/<h([1-3])([^>]*)>(.*?)<\/h\1>/gi, (match, levelStr, attrs, titleText) => {
    headerIndex++;
    const level = parseInt(levelStr, 10);
    const cleanTitle = titleText.replace(/<[^>]+>/g, '').trim();
    
    let idMatch = attrs.match(/id=["']([^"']+)["']/i);
    let id = idMatch ? idMatch[1] : `sec-${headerIndex}`;

    if (!idMatch) {
      attrs += ` id="${id}"`;
    }

    if (cleanTitle) {
      toc.push({ id, title: cleanTitle, level });
    }

    const baseClass = level === 1
      ? 'text-3xl font-black text-navy-950 dark:text-white mt-8 mb-4 pb-2 border-b border-navy-200 dark:border-navy-800'
      : level === 2
      ? 'text-2xl font-bold text-navy-900 dark:text-white mt-6 mb-3 border-b border-navy-100 dark:border-navy-800 pb-2 flex items-center gap-2'
      : 'text-xl font-bold text-navy-900 dark:text-navy-100 mt-5 mb-2';

    if (!/class=/i.test(attrs)) {
      attrs += ` class="${baseClass}"`;
    }

    return `<h${level}${attrs}>${titleText}</h${level}>`;
  });

  // Auto-decorating Callouts (Note, Rappel, Piège, Urgence, Traitement, Point Clé)
  formatted = formatted.replace(
    /<(div|blockquote|p)(?![^>]*class=.*?(note|rappel|piege|urgence|traitement|point-cle))([^>]*)>(\s*(?:💡|Perle|Perle Clinique|Note|Remarque).*?)<\/\1>/gi,
    '<div class="note p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 my-4" $3>$4</div>'
  );

  formatted = formatted.replace(
    /<(div|blockquote|p)(?![^>]*class=.*?(note|rappel|piege|urgence|traitement|point-cle))([^>]*)>(\s*(?:📌|Rappel|Prérequis).*?)<\/\1>/gi,
    '<div class="rappel p-4 rounded-2xl bg-amber-50/80 border border-amber-200 dark:bg-amber-950/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200 my-4" $3>$4</div>'
  );

  formatted = formatted.replace(
    /<(div|blockquote|p)(?![^>]*class=.*?(note|rappel|piege|urgence|traitement|point-cle))([^>]*)>(\s*(?:⚠️|Piège|Attention|Warning).*?)<\/\1>/gi,
    '<div class="piege p-4 rounded-2xl bg-orange-50/80 border border-orange-200 dark:bg-orange-950/30 text-xs sm:text-sm text-orange-900 dark:text-orange-200 my-4" $3>$4</div>'
  );

  formatted = formatted.replace(
    /<(div|blockquote|p)(?![^>]*class=.*?(note|rappel|piege|urgence|traitement|point-cle))([^>]*)>(\s*(?:🚨|Urgence|Alerte|Danger).*?)<\/\1>/gi,
    '<div class="urgence p-4 rounded-2xl bg-rose-50/80 border border-rose-200 dark:bg-rose-950/30 text-xs sm:text-sm text-rose-900 dark:text-rose-200 my-4" $3>$4</div>'
  );

  formatted = formatted.replace(
    /<(div|blockquote|p)(?![^>]*class=.*?(note|rappel|piege|urgence|traitement|point-cle))([^>]*)>(\s*(?:💊|Traitement|Prise en charge|Thérapeutique).*?)<\/\1>/gi,
    '<div class="traitement p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/30 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 my-4" $3>$4</div>'
  );

  formatted = formatted.replace(
    /<(div|blockquote|p)(?![^>]*class=.*?(note|rappel|piege|urgence|traitement|point-cle))([^>]*)>(\s*(?:⭐|Point Clé|À retenir|Synthèse).*?)<\/\1>/gi,
    '<div class="point-cle p-4 rounded-2xl bg-sky-50/70 border border-sky-200 dark:bg-sky-950/30 text-xs sm:text-sm text-sky-900 dark:text-sky-200 my-4" $3>$4</div>'
  );

  // Tables, lists, images styling
  formatted = formatted.replace(
    /<table(?![^>]*class=)([^>]*)>/gi,
    '<table class="w-full my-6 text-xs border-collapse border border-navy-200 dark:border-navy-700 rounded-2xl overflow-hidden shadow-sm" $1>'
  );
  formatted = formatted.replace(
    /<th(?![^>]*class=)([^>]*)>/gi,
    '<th class="p-3 bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white font-bold border border-navy-200 dark:border-navy-700 text-left" $1>'
  );
  formatted = formatted.replace(
    /<td(?![^>]*class=)([^>]*)>/gi,
    '<td class="p-3 border border-navy-200 dark:border-navy-700 text-navy-800 dark:text-navy-200" $1>'
  );
  formatted = formatted.replace(
    /<ul(?![^>]*class=)([^>]*)>/gi,
    '<ul class="list-disc pl-6 space-y-2 text-navy-800 dark:text-navy-200 my-4" $1>'
  );
  formatted = formatted.replace(
    /<ol(?![^>]*class=)([^>]*)>/gi,
    '<ol class="list-decimal pl-6 space-y-2 text-navy-800 dark:text-navy-200 my-4" $1>'
  );
  formatted = formatted.replace(
    /<img(?![^>]*class=)([^>]*)>/gi,
    '<img class="rounded-2xl max-w-full mx-auto shadow-md border border-navy-200 dark:border-navy-700 my-4" $1>'
  );

  if (toc.length === 0) {
    toc = [
      { id: 'sec-1', title: '1. Introduction & Généralités', level: 1 },
      { id: 'sec-2', title: '2. Contenu du Cours', level: 1 }
    ];
  }

  return { htmlContent: formatted, tableOfContents: toc };
}

export interface ExtractedCourseMetadata {
  title?: string;
  subtitle?: string;
  description?: string;
}

export function extractMetadataFromHtml(rawHtml: string): ExtractedCourseMetadata {
  if (!rawHtml || typeof rawHtml !== 'string') return {};

  const cleanText = (str: string) => str.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

  let title: string | undefined;
  let subtitle: string | undefined;
  let description: string | undefined;

  // 1. Extract Title
  const h1Match = rawHtml.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    title = cleanText(h1Match[1]);
  } else {
    const h2Match = rawHtml.match(/<h2[^>]*>(.*?)<\/h2>/i);
    if (h2Match && h2Match[1]) {
      title = cleanText(h2Match[1]);
    }
  }

  if (title) {
    title = title.replace(/^(?:chapitre|cours|module|\d+[\.-])\s*/i, '').trim();
  }

  // 2. Extract Subtitle
  const subMatch = rawHtml.match(/<(?:p|h2|h3|div)[^>]*class=["'][^"']*(?:subtitle|sous-titre|lead|chapeau)[^"']*["'][^>]*>(.*?)<\/(?:p|h2|h3|div)>/i);
  if (subMatch && subMatch[1]) {
    subtitle = cleanText(subMatch[1]);
  } else if (h1Match) {
    const h2AfterH1 = rawHtml.match(/<h1[^>]*>[\s\S]*?<\/h1>\s*<h2[^>]*>(.*?)<\/h2>/i);
    if (h2AfterH1 && h2AfterH1[1]) {
      subtitle = cleanText(h2AfterH1[1]);
    }
  }

  // 3. Extract Description
  const pMatches: string[] = [];
  const pRegex = /<p[^>]*>(.*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = pRegex.exec(rawHtml)) !== null) {
    const text = cleanText(match[1]);
    if (text.length >= 25 && !text.startsWith('💡') && !text.startsWith('📌') && !text.startsWith('⚠️') && !text.startsWith('🚨')) {
      pMatches.push(text);
    }
  }

  if (pMatches.length > 0) {
    description = pMatches[0];
    if (description.length > 220) {
      description = description.substring(0, 217).trim() + '...';
    }
  }

  return { title, subtitle, description };
}

