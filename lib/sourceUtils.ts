// lib/sourceUtils.ts

export function parseSourceHierarchy(s: string): { parent: string; sub: string | null } {
  const clean = (s || '').trim();
  if (!clean) return { parent: 'Divers', sub: null };

  if (clean.includes(' - ')) {
    const parts = clean.split(' - ');
    return { parent: parts[0].trim(), sub: parts.slice(1).join(' - ').trim() };
  }
  if (clean.includes(' / ')) {
    const parts = clean.split(' / ');
    return { parent: parts[0].trim(), sub: parts.slice(1).join(' / ').trim() };
  }
  if (clean.includes('(') && clean.includes(')')) {
    const parent = clean.split('(')[0].trim();
    const sub = clean.slice(clean.indexOf('(') + 1, clean.lastIndexOf(')')).trim();
    if (parent && sub) return { parent, sub };
  }
  
  const knownParents = ['Externat', 'Résidanat', 'Residanat', 'Annales', 'FARES', 'Hypercours', 'SIAU', 'Livre Hygiene', 'CNP'];
  for (const kp of knownParents) {
    if (clean.toLowerCase().startsWith(kp.toLowerCase()) && clean.length > kp.length) {
      const rest = clean.slice(kp.length).trim();
      if (rest) {
        return { parent: kp, sub: rest };
      }
    }
  }

  return { parent: clean, sub: null };
}

export function matchQcmToSource(q: any, s: string): boolean {
  if (!q || !s) return false;
  if (s === 'TOUS' || s === 'all') return true;

  const qSrcLower = (q.source || '').toLowerCase().trim();
  const sLower = s.toLowerCase().trim();

  // If sub-source epreuve specified (e.g. "externat - emd 2017")
  if (sLower.includes(' - ')) {
    const parts = sLower.split(' - ');
    const parentTerm = parts[0].trim();
    const subTerm = parts.slice(1).join(' - ').trim();

    // 1. Exact equality on q.source
    if (qSrcLower === sLower) return true;

    // 2. Parent source matches AND subTerm matches reference/vignette/question/title/tags
    const matchParent = qSrcLower === parentTerm || qSrcLower.includes(parentTerm);
    if (matchParent) {
      const qText = `${q.source || ''} ${q.reference || ''} ${q.vignette || ''} ${q.question || ''} ${q.title || ''} ${(q.tags || []).join(' ')}`.toLowerCase();
      if (qText.includes(subTerm)) {
        return true;
      }
    }
    return false;
  }

  // Standalone source name (e.g. "externat")
  return qSrcLower === sLower || qSrcLower.startsWith(sLower + ' - ') || qSrcLower.includes(sLower);
}

export function extractEpreuvesForFolder(qcms: any[], folderName: string, availableSources: string[] = []): string[] {
  const epreuvesSet = new Set<string>();
  const folderLower = (folderName || '').toLowerCase().trim();

  // 1. From availableSources and qcms.source
  const allSourceStrings = new Set<string>([...availableSources]);
  (qcms || []).forEach(q => {
    if (q && q.source) allSourceStrings.add(q.source);
  });

  allSourceStrings.forEach(s => {
    const sLower = s.toLowerCase().trim();
    if (sLower.startsWith(folderLower + ' - ') || sLower.startsWith(folderLower + ' / ') || sLower.startsWith(folderLower + ' (')) {
      epreuvesSet.add(s);
    }
  });

  // 2. Scan QCM text fields for QCMs matching folderName
  const epreuveRegex = /\b(EMD\s*\d*\s*\d{4}|EMD\s*\d+|Session\s*\d{4}|Rattrapage\s*\d{4}|20[1-2]\d)\b/gi;

  (qcms || []).forEach(q => {
    if (!q) return;
    const qSrcLower = (q.source || '').toLowerCase().trim();
    if (qSrcLower === folderLower || qSrcLower.includes(folderLower)) {
      const textToScan = `${q.reference || ''} ${q.vignette || ''} ${q.question || ''} ${q.title || ''} ${(q.tags || []).join(' ')}`;
      const matches = textToScan.match(epreuveRegex);
      if (matches) {
        matches.forEach(m => {
          const cleanMatch = m.trim();
          if (cleanMatch.length >= 4) {
            epreuvesSet.add(`${folderName} - ${cleanMatch}`);
          }
        });
      }
    }
  });

  return Array.from(epreuvesSet);
}
