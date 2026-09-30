import { StructuredSource } from '@/types';

export function normalizeSourceItem(item: any): StructuredSource {
  if (!item) return { name: '', subSources: [] };
  if (typeof item === 'string') {
    const clean = item.trim();
    if (clean.includes(' - ')) {
      const parts = clean.split(' - ');
      const p = parts[0].trim();
      const sub = parts.slice(1).join(' - ').trim();
      return { name: p, subSources: sub ? [sub] : [] };
    }
    return { name: clean, subSources: [] };
  }
  if (typeof item === 'object') {
    const name = String(item.name || '').trim();
    const rawSubs: any[] = Array.isArray(item.subSources) ? item.subSources : [];
    const subSources: string[] = Array.from(new Set(rawSubs.map((s: any) => String(s).trim()).filter(Boolean)));
    const isHyperProbable = Boolean(item.isHyperProbable);
    return { name, subSources, isHyperProbable };
  }
  return { name: String(item).trim(), subSources: [] };
}

export function normalizeSourcesList(rawList: any[]): StructuredSource[] {
  if (!Array.isArray(rawList)) return [];
  const map = new Map<string, { subs: Set<string>; isHyperProbable: boolean }>();

  rawList.forEach(item => {
    const norm = normalizeSourceItem(item);
    if (!norm.name) return;
    if (!map.has(norm.name)) {
      map.set(norm.name, { subs: new Set<string>(), isHyperProbable: false });
    }
    const current = map.get(norm.name)!;
    norm.subSources.forEach(s => current.subs.add(s));
    if (norm.isHyperProbable) current.isHyperProbable = true;
  });

  return Array.from(map.entries()).map(([name, data]) => ({
    name,
    subSources: Array.from(data.subs).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    isHyperProbable: data.isHyperProbable
  }));
}

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

  const qSrcLower = typeof q.source === 'string' ? q.source.toLowerCase().trim() : String(q.source || '').toLowerCase().trim();
  const sLower = String(s).toLowerCase().trim();

  // Fast exact match on source
  if (qSrcLower === sLower) return true;

  const tagsStr = Array.isArray(q.tags) ? q.tags.join(' ') : String(q.tags || '');
  const yearStr = q.year ? String(q.year) : '';
  const fullQcmText = `${qSrcLower} ${String(q.reference || '')} ${String(q.vignette || '')} ${String(q.question || '')} ${String(q.title || '')} ${tagsStr} ${yearStr}`.toLowerCase();

  // 1. Direct match on full text or q.source
  if (fullQcmText.includes(sLower)) return true;

  // 2. If sub-source epreuve specified (e.g. "externat - session 2021" or "externat - emd 2017")
  if (sLower.includes(' - ')) {
    const parts = sLower.split(' - ');
    const parentTerm = parts[0].trim();
    const subTerm = parts.slice(1).join(' - ').trim();

    // Check if parent matches source/text AND subTerm matches full text
    const matchParent = !parentTerm || qSrcLower === parentTerm || qSrcLower.includes(parentTerm) || fullQcmText.includes(parentTerm);
    if (matchParent && (fullQcmText.includes(subTerm) || qSrcLower.includes(subTerm))) {
      return true;
    }
    return false;
  }

  // 3. Standalone source name (e.g. "externat" or "session 2021")
  return (
    qSrcLower === sLower ||
    qSrcLower.startsWith(sLower + ' - ') ||
    qSrcLower.includes(sLower) ||
    fullQcmText.includes(sLower)
  );
}

export function extractEpreuvesForFolder(qcms: any[], folderName: string, availableSources: string[] = []): string[] {
  const epreuvesSet = new Set<string>();
  const folderLower = (folderName || '').toLowerCase().trim();

  // Closed standard session years
  const STANDARD_YEARS = ['2018', '2019', '2020', '2021', '2022', '2023'];
  if (folderLower === 'externat' || folderLower.includes('externat') || folderLower.includes('annale') || folderLower.includes('residanat') || folderLower.includes('résidanat')) {
    STANDARD_YEARS.forEach(yr => {
      epreuvesSet.add(`${folderName} - ${yr}`);
    });
  }

  // 1. From availableSources and qcms.source
  const allSourceStrings = new Set<string>([...availableSources]);
  (qcms || []).forEach(q => {
    if (q && q.source) allSourceStrings.add(q.source);
  });

  allSourceStrings.forEach(s => {
    const sLower = String(s || '').toLowerCase().trim();
    if (sLower.startsWith(folderLower + ' - ') || sLower.startsWith(folderLower + ' / ') || sLower.startsWith(folderLower + ' (')) {
      epreuvesSet.add(s);
    }
  });

  // 2. Scan QCM text fields for QCMs matching folderName
  const epreuveRegex = /\b(EMD\s*\d*\s*\d{4}|EMD\s*\d+|Session\s*\d{4}|Rattrapage\s*\d{4}|20[1-2]\d)\b/gi;

  (qcms || []).forEach(q => {
    if (!q) return;
    const qSrcLower = String(q.source || '').toLowerCase().trim();
    const tagsStr = Array.isArray(q.tags) ? q.tags.join(' ') : String(q.tags || '');
    const textToScan = `${qSrcLower} ${String(q.reference || '')} ${String(q.vignette || '')} ${String(q.question || '')} ${String(q.title || '')} ${tagsStr}`;

    if (qSrcLower === folderLower || qSrcLower.includes(folderLower) || textToScan.toLowerCase().includes(folderLower)) {
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

  const list = Array.from(epreuvesSet);
  list.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return list;
}
