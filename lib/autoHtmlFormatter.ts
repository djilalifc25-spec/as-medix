/**
 * Utility to format and enrich raw HTML for Courses and QCMs.
 * Guarantees ZERO loss, deletion, or modification of actual text or information.
 * Automatically decorates raw HTML elements (headings, tables, callouts, lists, QCMs) 
 * with modern AS MEDIX presentation design classes.
 */

export function autoFormatCourseHtml(rawHtml: string): string {
  if (!rawHtml || typeof rawHtml !== 'string') return rawHtml;

  let formatted = rawHtml;

  // 1. Convert plain <h1> without classes to AS MEDIX presentation style
  formatted = formatted.replace(
    /<h1(?![^>]*class=)([^>]*)>(.*?)<\/h1>/gi,
    '<h1 class="text-3xl font-black text-navy-950 dark:text-white mt-8 mb-4 pb-2 border-b border-navy-200 dark:border-navy-800" $1>$2</h1>'
  );

  // 2. Convert plain <h2> without classes
  formatted = formatted.replace(
    /<h2(?![^>]*class=)([^>]*)>(.*?)<\/h2>/gi,
    '<h2 class="text-2xl font-bold text-navy-950 dark:text-white mt-6 mb-3" $1>$2<\/h2>'
  );

  // 3. Convert plain <h3> without classes
  formatted = formatted.replace(
    /<h3(?![^>]*class=)([^>]*)>(.*?)<\/h3>/gi,
    '<h3 class="text-xl font-bold text-navy-900 dark:text-navy-100 mt-5 mb-2" $1>$2<\/h3>'
  );

  // 4. Auto-detect callout boxes based on content keywords if no callout class present
  // Note / Perle Clinique
  formatted = formatted.replace(
    /<(div|blockquote|p)(?![^>]*class=.*?(note|rappel|piege|urgence|traitement|point-cle))([^>]*)>(\s*(?:💡|Perle|Perle Clinique|Note|Remarque).*?)<\/\1>/gi,
    '<div class="note p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 my-4" $3>$4</div>'
  );

  // Rappel
  formatted = formatted.replace(
    /<(div|blockquote|p)(?![^>]*class=.*?(note|rappel|piege|urgence|traitement|point-cle))([^>]*)>(\s*(?:📌|Rappel|Prérequis).*?)<\/\1>/gi,
    '<div class="rappel p-4 rounded-2xl bg-amber-50/80 border border-amber-200 dark:bg-amber-950/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200 my-4" $3>$4</div>'
  );

  // Piège
  formatted = formatted.replace(
    /<(div|blockquote|p)(?![^>]*class=.*?(note|rappel|piege|urgence|traitement|point-cle))([^>]*)>(\s*(?:⚠️|Piège|Attention|Warning).*?)<\/\1>/gi,
    '<div class="piege p-4 rounded-2xl bg-orange-50/80 border border-orange-200 dark:bg-orange-950/30 text-xs sm:text-sm text-orange-900 dark:text-orange-200 my-4" $3>$4</div>'
  );

  // Urgence
  formatted = formatted.replace(
    /<(div|blockquote|p)(?![^>]*class=.*?(note|rappel|piege|urgence|traitement|point-cle))([^>]*)>(\s*(?:🚨|Urgence|Alerte|Danger).*?)<\/\1>/gi,
    '<div class="urgence p-4 rounded-2xl bg-rose-50/80 border border-rose-200 dark:bg-rose-950/30 text-xs sm:text-sm text-rose-900 dark:text-rose-200 my-4" $3>$4</div>'
  );

  // Traitement
  formatted = formatted.replace(
    /<(div|blockquote|p)(?![^>]*class=.*?(note|rappel|piege|urgence|traitement|point-cle))([^>]*)>(\s*(?:💊|Traitement|Prise en charge|Thérapeutique).*?)<\/\1>/gi,
    '<div class="traitement p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 dark:bg-emerald-950/30 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 my-4" $3>$4</div>'
  );

  // Point Clé
  formatted = formatted.replace(
    /<(div|blockquote|p)(?![^>]*class=.*?(note|rappel|piege|urgence|traitement|point-cle))([^>]*)>(\s*(?:⭐|Point Clé|À retenir|Synthèse).*?)<\/\1>/gi,
    '<div class="point-cle p-4 rounded-2xl bg-sky-50/70 border border-sky-200 dark:bg-sky-950/30 text-xs sm:text-sm text-sky-900 dark:text-sky-200 my-4" $3>$4</div>'
  );

  // 5. Enhance plain <table> without classes
  formatted = formatted.replace(
    /<table(?![^>]*class=)([^>]*)>/gi,
    '<table class="w-full my-6 text-xs border-collapse border border-navy-200 dark:border-navy-700 rounded-2xl overflow-hidden shadow-sm" $1>'
  );

  // Enhance plain <th>
  formatted = formatted.replace(
    /<th(?![^>]*class=)([^>]*)>/gi,
    '<th class="p-3 bg-navy-100 dark:bg-navy-800 text-navy-900 dark:text-white font-bold border border-navy-200 dark:border-navy-700 text-left" $1>'
  );

  // Enhance plain <td>
  formatted = formatted.replace(
    /<td(?![^>]*class=)([^>]*)>/gi,
    '<td class="p-3 border border-navy-200 dark:border-navy-700 text-navy-800 dark:text-navy-200" $1>'
  );

  // 6. Enhance plain <ul> / <ol>
  formatted = formatted.replace(
    /<ul(?![^>]*class=)([^>]*)>/gi,
    '<ul class="list-disc pl-6 space-y-2 text-navy-800 dark:text-navy-200 my-4" $1>'
  );
  formatted = formatted.replace(
    /<ol(?![^>]*class=)([^>]*)>/gi,
    '<ol class="list-decimal pl-6 space-y-2 text-navy-800 dark:text-navy-200 my-4" $1>'
  );

  // 7. Enhance plain <img>
  formatted = formatted.replace(
    /<img(?![^>]*class=)([^>]*)>/gi,
    '<img class="rounded-2xl max-w-full mx-auto shadow-md border border-navy-200 dark:border-navy-700 my-4" $1>'
  );

  // 8. Enhance plain <details> / <summary>
  formatted = formatted.replace(
    /<details(?![^>]*class=)([^>]*)>/gi,
    '<details class="text-xs bg-navy-50 dark:bg-navy-950 p-4 rounded-2xl border border-navy-200 dark:border-navy-800 text-navy-900 dark:text-navy-100 my-4 shadow-sm" $1>'
  );
  formatted = formatted.replace(
    /<summary(?![^>]*class=)([^>]*)>/gi,
    '<summary class="font-bold cursor-pointer hover:underline text-brand-600 dark:text-brand-400 select-none" $1>'
  );

  return formatted;
}
