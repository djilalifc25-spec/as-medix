import { supabaseAdmin } from '@/lib/supabase/admin';
import { db } from '@/lib/db/store';
import { Course, QCM } from '@/types';

const MEDICAL_ACRONYMS: Record<string, string> = {
  'oma': 'otite moyenne aigue',
  'omc': 'otite moyenne chronique',
  'osm': 'otite sero muqueuse',
  'irc': 'insuffisance respiratoire chronique',
  'ira': 'insuffisance respiratoire aigue',
  'ic': 'insuffisance cardiaque',
  'ica': 'insuffisance cardiaque aigue',
  'icc': 'insuffisance cardiaque chronique',
  'ra': 'retrecissement aortique',
  'rm': 'retrecissement mitral',
  'ia': 'insuffisance aortique',
  'im': 'insuffisance mitrale',
  'vads': 'cancers des vads voies aero digestives superieures',
  'sahos': 'syndrome apnees hypopnees obstructives sommeil',
  'bpco': 'broncho pneumopathie chronique obstructive',
  'hta': 'hypertension arterielle',
  'sca': 'syndrome coronarien aigu'
};

const FRENCH_STOP_WORDS = new Set([
  'le', 'la', 'les', 'l', 'de', 'du', 'des', 'd', 'et', 'ou', 'a', 'au', 'aux',
  'en', 'un', 'une', 'par', 'sur', 'dans', 'avec', 'pour', 'cours', 'item', 'qcm',
  'chez', 'son', 'sa', 'ses', 'ce', 'cet', 'cette', 'ces'
]);

/**
 * Normalizes a medical title or course name with acronym expansions and accent stripping
 */
export function normalizeMedicalTitle(str: string): string {
  if (!str) return '';
  let cleaned = str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  Object.keys(MEDICAL_ACRONYMS).forEach(ac => {
    const reg = new RegExp('\\b' + ac + '\\b', 'gi');
    cleaned = cleaned.replace(reg, MEDICAL_ACRONYMS[ac]);
  });

  return cleaned
    .split(/\s+/)
    .filter(word => !FRENCH_STOP_WORDS.has(word) && word.length >= 2)
    .join(' ');
}

/**
 * Extracts key medical tokens from a string.
 */
export function extractMedicalTokens(str: string): string[] {
  const norm = normalizeMedicalTitle(str);
  if (!norm) return [];
  return norm.split(/\s+/).filter(w => w.length >= 3);
}

/**
 * Determines whether a candidate text/title matches a given course.
 */
export function isCourseMatch(candidateTitle: string, course: Course | { title: string }): boolean {
  if (!candidateTitle || !course || !course.title) return false;

  const normCandidate = normalizeMedicalTitle(candidateTitle);
  const normCourse = normalizeMedicalTitle(course.title);

  if (!normCandidate || !normCourse) return false;

  // 1. Exact normalized match
  if (normCandidate === normCourse) return true;

  // 2. Direct containment (one title completely contains the other)
  if (normCandidate.includes(normCourse) || normCourse.includes(normCandidate)) {
    return true;
  }

  // 3. Token-based overlap
  const candidateTokens = extractMedicalTokens(candidateTitle);
  const courseTokens = extractMedicalTokens(course.title);

  if (candidateTokens.length === 0 || courseTokens.length === 0) return false;

  const candidateSet = new Set(candidateTokens);
  let common = 0;
  for (const t of courseTokens) {
    if (candidateSet.has(t)) {
      common++;
    } else {
      for (const ct of candidateTokens) {
        if (t.startsWith(ct) || ct.startsWith(t)) {
          common++;
          break;
        }
      }
    }
  }

  const courseCoverage = common / courseTokens.length;
  const candidateCoverage = common / candidateTokens.length;

  if (courseCoverage >= 0.4 || candidateCoverage >= 0.5 || (common >= 2 && courseTokens.length <= 3)) {
    return true;
  }

  return false;
}

/**
 * Finds the best matching course for a QCM from a list of courses.
 */
export function matchQcmToCourse(
  qcm: { title?: string; question?: string; courseTitle?: string; specialtyId?: string },
  availableCourses: Course[]
): Course | null {
  if (!availableCourses || availableCourses.length === 0) return null;

  const candidateCourses = qcm.specialtyId
    ? availableCourses.filter(c => !c.specialtyId || c.specialtyId.toLowerCase() === qcm.specialtyId?.toLowerCase())
    : availableCourses;

  const pool = candidateCourses.length > 0 ? candidateCourses : availableCourses;

  if (qcm.courseTitle && qcm.courseTitle.trim()) {
    for (const c of pool) {
      if (isCourseMatch(qcm.courseTitle, c)) {
        return c;
      }
    }
  }

  const questionSample = `${qcm.title || ''} ${qcm.question || ''}`.substring(0, 300);
  if (questionSample.trim()) {
    let bestMatch: Course | null = null;
    let highestScore = 0;

    for (const c of pool) {
      if (isCourseMatch(questionSample, c)) {
        const courseTokens = extractMedicalTokens(c.title);
        const normQuestion = normalizeMedicalTitle(questionSample);
        let matchCount = 0;
        for (const token of courseTokens) {
          if (normQuestion.includes(token)) matchCount++;
        }
        const score = courseTokens.length > 0 ? matchCount / courseTokens.length : 0;
        if (score > highestScore) {
          highestScore = score;
          bestMatch = c;
        }
      }
    }

    if (bestMatch) return bestMatch;
  }

  return null;
}

/**
 * Automatically finds and links all unlinked or matching QCMs to an existing course.
 * Updates both Supabase SQL and local DB store.
 */
export async function autoLinkQcmsToCourse(course: {
  id: string;
  title: string;
  specialtyId?: string;
  specialtyName?: string;
}): Promise<{ linkedCount: number; qcmIds: string[] }> {
  if (!course || !course.id || !course.title) {
    return { linkedCount: 0, qcmIds: [] };
  }

  const matchedIds: string[] = [];

  // 1. Check local DB store QCMs
  const allLocalQcms = db.getQcms();
  for (const q of allLocalQcms) {
    const sameSpec = !course.specialtyId || !q.specialtyId || q.specialtyId.toLowerCase() === course.specialtyId.toLowerCase();
    if (!sameSpec) continue;

    const needsLinking = !q.courseId || q.courseId === '' || q.courseId === course.id;
    if (needsLinking) {
      const candidateTitle = q.courseTitle || '';
      const courseObj = { id: course.id, title: course.title, specialtyId: course.specialtyId || '' } as Course;
      const isMatch = (candidateTitle && isCourseMatch(candidateTitle, courseObj)) ||
        matchQcmToCourse(q, [courseObj]) !== null;

      if (isMatch) {
        matchedIds.push(q.id);
        db.updateQcm(q.id, {
          courseId: course.id,
          courseTitle: course.title,
          specialtyId: course.specialtyId || q.specialtyId,
          specialtyName: course.specialtyName || q.specialtyName
        });
      }
    }
  }

  // 2. Query Supabase for matching or unlinked QCMs
  try {
    const { data: cloudQcms, error } = await supabaseAdmin.from('qcms').select('*');

    if (!error && Array.isArray(cloudQcms)) {
      const courseObj = { id: course.id, title: course.title, specialtyId: course.specialtyId || '' } as Course;

      for (const row of cloudQcms) {
        const rowSpec = row.specialty_id || row.specialty;
        const sameSpec = !course.specialtyId || !rowSpec || String(rowSpec).toLowerCase() === course.specialtyId.toLowerCase();
        if (!sameSpec) continue;

        const needsLinking = !row.course_id || row.course_id === '' || row.course_id === course.id;
        if (needsLinking) {
          const candidateTitle = row.course_title || '';
          const isMatch = (candidateTitle && isCourseMatch(candidateTitle, courseObj)) ||
            matchQcmToCourse({ title: row.title, question: row.question, courseTitle: row.course_title, specialtyId: rowSpec }, [courseObj]) !== null;

          if (isMatch && !matchedIds.includes(String(row.id))) {
            matchedIds.push(String(row.id));
          }
        }
      }
    }

    // 3. Batch update matched QCMs in Supabase
    if (matchedIds.length > 0) {
      const { error: updateErr } = await supabaseAdmin
        .from('qcms')
        .update({
          course_id: String(course.id),
          course_title: String(course.title),
          specialty_id: course.specialtyId ? String(course.specialtyId) : undefined,
          specialty_name: course.specialtyName ? String(course.specialtyName) : undefined
        })
        .in('id', matchedIds);

      if (updateErr) {
        console.error('[autoLinkQcmsToCourse] Supabase batch update error:', updateErr.message);
      } else {
        console.log(`[autoLinkQcmsToCourse] Successfully linked ${matchedIds.length} QCM(s) to course "${course.title}" (${course.id}) in Supabase`);
      }
    }
  } catch (err) {
    console.error('[autoLinkQcmsToCourse] Exception during cloud sync:', err);
  }

  // Update counts in local DB store
  try {
    db.updateCourseQcmCounts();
  } catch (_) {}

  return { linkedCount: matchedIds.length, qcmIds: matchedIds };
}

/**
 * Reconciles all unlinked QCMs across the entire database ONLY with existing courses.
 */
export async function reconcileAllOrphanedQcms(): Promise<{
  totalLinked: number;
  details: Array<{ courseId: string; courseTitle: string; linkedCount: number }>;
}> {
  const localCourses = db.getCourses();
  let allCourses = [...localCourses];

  try {
    const { data: cloudCourses } = await supabaseAdmin.from('courses').select('*');
    if (cloudCourses && Array.isArray(cloudCourses)) {
      for (const cc of cloudCourses) {
        if (!allCourses.some(c => c.id === String(cc.id))) {
          allCourses.push({
            id: String(cc.id),
            title: cc.title || cc.name || 'Cours',
            slug: cc.slug || '',
            specialtyId: cc.specialty_id || cc.specialty || 'cardio',
            specialtyName: cc.specialty_name || 'Cardiologie',
          } as Course);
        }
      }
    }
  } catch (_) {}

  let totalLinked = 0;
  const details: Array<{ courseId: string; courseTitle: string; linkedCount: number }> = [];

  for (const c of allCourses) {
    const result = await autoLinkQcmsToCourse(c);
    if (result.linkedCount > 0) {
      totalLinked += result.linkedCount;
      details.push({
        courseId: c.id,
        courseTitle: c.title,
        linkedCount: result.linkedCount
      });
    }
  }

  return { totalLinked, details };
}
