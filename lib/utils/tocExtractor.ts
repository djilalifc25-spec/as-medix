export interface TocItem {
  id: string;
  title: string;
  level: number;
}

/**
 * Automatically extracts a clean Table of Contents from HTML content,
 * ensuring all H2/H3 headings have valid unique ID anchors for smooth navigation.
 */
export function processCourseToc(
  htmlContent: string,
  rawToc?: { id: string; title: string; level?: number }[]
): { processedHtml: string; toc: TocItem[] } {
  if (!htmlContent) {
    return { processedHtml: '', toc: rawToc ? rawToc.map((t, idx) => ({ id: t.id || `sec-${idx + 1}`, title: t.title, level: t.level || 1 })) : [] };
  }

  // Strip legacy quick-nav-bar, outils boxes, and fast-access toolbars
  let cleanedInput = htmlContent
    .replace(/<div[^>]*class="[^"]*quick-nav-bar[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*quick-nav-bar[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*(?:outils|quick-nav|floating-tools|tools-bar)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*>(?:\s*<[^>]+>)*\s*🧠\s*OUTILS\s*:[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*>(?:\s*<[^>]+>)*\s*⚡\s*Accès Rapide\s*:[\s\S]*?<\/div>/gi, '');

  const generatedToc: TocItem[] = [];
  let secIndex = 0;

  // Pattern matches <h2> and <h3> tags
  const headingRegex = /<h([23])([^>]*)>(.*?)<\/h\1>/gi;

  const processedHtml = cleanedInput.replace(headingRegex, (match, levelStr, attrs, innerText) => {
    secIndex++;
    const level = parseInt(levelStr, 10);
    
    // Extract existing id if present
    const idMatch = attrs.match(/id=["']([^"']+)["']/i);
    let id = idMatch ? idMatch[1] : `sec-${secIndex}`;

    // Clean inner text to get plain title (strip nested tags like spans, badges, etc.)
    const cleanTitle = innerText.replace(/<[^>]*>/g, '').trim();

    if (cleanTitle && cleanTitle.length > 1) {
      generatedToc.push({
        id,
        title: cleanTitle,
        level
      });
    }

    // Ensure the id attribute is present on the heading
    if (!idMatch) {
      return `<h${level}${attrs} id="${id}">${innerText}</h${level}>`;
    }

    return match;
  });

  // Fallback to rawToc if regex found no headings
  let finalToc: TocItem[] = generatedToc;
  if (finalToc.length === 0 && rawToc && rawToc.length > 0) {
    finalToc = rawToc.map((t, idx) => ({
      id: t.id || `sec-${idx + 1}`,
      title: t.title,
      level: t.level || 1
    }));
  }

  return {
    processedHtml,
    toc: finalToc
  };
}
