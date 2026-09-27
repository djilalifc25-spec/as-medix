const fs = require('fs');

function normalizeSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function stripAll(str) {
  if (!str) return '';
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}

function getKeywords(str) {
  if (!str) return [];
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(w => w.length >= 3);
}

function matchesCourse(c, slugOrId) {
  if (!c || !slugOrId) return false;
  
  const target = slugOrId.trim();
  const decodedTarget = decodeURIComponent(target).trim();
  
  if (c.id === target || c.slug === target || c.id === decodedTarget || c.slug === decodedTarget) {
    return true;
  }
  
  const normTarget = normalizeSlug(target);
  const normDecodedTarget = normalizeSlug(decodedTarget);
  const cSlugNorm = normalizeSlug(c.slug || '');
  const cIdNorm = normalizeSlug(c.id || '');
  const cTitleNorm = normalizeSlug(c.title || '');
  
  if (cSlugNorm && (cSlugNorm === normTarget || cSlugNorm === normDecodedTarget)) return true;
  if (cIdNorm && (cIdNorm === normTarget || cIdNorm === normDecodedTarget)) return true;
  if (cTitleNorm && (cTitleNorm === normTarget || cTitleNorm === normDecodedTarget)) return true;

  if (normTarget.length >= 5 && (cSlugNorm.includes(normTarget) || normTarget.includes(cSlugNorm) || cTitleNorm.includes(normTarget))) {
    return true;
  }

  const strippedTarget = stripAll(decodedTarget);
  const strippedCSlug = stripAll(c.slug || '');
  const strippedCTitle = stripAll(c.title || '');
  const strippedCId = stripAll(c.id || '');

  if (strippedTarget && strippedTarget.length >= 5) {
    if (strippedCSlug === strippedTarget || strippedCTitle === strippedTarget || strippedCId === strippedTarget) {
      return true;
    }
    if (strippedCSlug.includes(strippedTarget) || strippedTarget.includes(strippedCSlug) || strippedCTitle.includes(strippedTarget)) {
      return true;
    }
  }

  const targetWords = getKeywords(decodedTarget);
  if (targetWords.length > 0) {
    const courseWords = new Set([...getKeywords(c.title || ''), ...getKeywords(c.slug || '')]);
    let matchedCount = 0;
    for (const tw of targetWords) {
      if (courseWords.has(tw) || Array.from(courseWords).some(cw => cw.includes(tw) || tw.includes(cw))) {
        matchedCount++;
      }
    }
    if (targetWords.length <= 3 && matchedCount === targetWords.length) return true;
    if (targetWords.length > 3 && (matchedCount / targetWords.length >= 0.4 || matchedCount >= 3)) return true;
  }

  return false;
}

const testCourse = {
  id: "cours_pneumo_test_live_1790466775119",
  slug: "pleuresie-sero-fibrineuse-prise-en-charge-drainage-test-live",
  title: "Pleurésie séro-fibrineuse : Prise en charge & drainage (Test Live)"
};

const userSlug = "pleur-sie-s-ro-fibrineuse-prise-en-charge-drainage-test-live";

console.log("Matches course?", matchesCourse(testCourse, userSlug));
