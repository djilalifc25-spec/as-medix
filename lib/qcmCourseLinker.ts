import { supabaseAdmin } from '@/lib/supabase/admin';
import { db } from '@/lib/db/store';
import { Course, QCM } from '@/types';

const FRENCH_STOP_WORDS = new Set([
  'le', 'la', 'les', 'l', 'de', 'du', 'des', 'd', 'et', 'ou', 'a', 'au', 'aux',
  'en', 'un', 'une', 'par', 'sur', 'dans', 'avec', 'pour', 'cours', 'item', 'qcm',
  'chez', 'son', 'sa', 'ses', 'ce', 'cet', 'cette', 'ces'
]);

/**
 * Normalizes a medical title or course name:
 * - strips accents
 * - lowercase
 * - removes non-alphanumeric characters
 * - filters out common stop words
 */
export function normalizeMedicalTitle(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
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
export function isCourseMatch(candidateTitle: string, course: Course): boolean {
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
  const courseSet = new Set(courseTokens);

  let common = 0;
  for (let i = 0; i < courseTokens.length; i++) {
    const t = courseTokens[i];
    if (candidateSet.has(t)) {
      common++;
    } else {
      // Check prefix matching (e.g. "pericardit" vs "pericardite")
      for (let j = 0; j < candidateTokens.length; j++) {
        const ct = candidateTokens[j];
        if (t.startsWith(ct) || ct.startsWith(t)) {
          common++;
          break;
        }
      }
    }
  }

  // If most course keywords are present in candidate
  const courseCoverage = common / courseTokens.length;
  if (courseCoverage >= 0.6) return true;

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

  // Filter courses by specialty if present
  const candidateCourses = qcm.specialtyId
    ? availableCourses.filter(c => c.specialtyId === qcm.specialtyId)
    : availableCourses;

  const pool = candidateCourses.length > 0 ? candidateCourses : availableCourses;

  // 1. Check direct courseTitle match if the QCM has a courseTitle
  if (qcm.courseTitle && qcm.courseTitle.trim()) {
    for (const c of pool) {
      if (isCourseMatch(qcm.courseTitle, c)) {
        return c;
      }
    }
  }

  // 2. Check question text / title against course title
  const questionSample = `${qcm.title || ''} ${qcm.question || ''}`.substring(0, 300);
  if (questionSample.trim()) {
    let bestMatch: Course | null = null;
    let highestScore = 0;

    for (const c of pool) {
      const courseTokens = extractMedicalTokens(c.title);
      if (courseTokens.length === 0) continue;

      const normQuestion = normalizeMedicalTitle(questionSample);
      let matchCount = 0;
      for (const token of courseTokens) {
        if (normQuestion.includes(token)) {
          matchCount++;
        }
      }

      const score = matchCount / courseTokens.length;
      // High confidence threshold for automatic matching based purely on question content
      if (score >= 0.75 && matchCount >= 2 && score > highestScore) {
        highestScore = score;
        bestMatch = c;
      }
    }

    if (bestMatch) return bestMatch;
  }

  return null;
}

/**
 * Automatically finds and links all unlinked or matching QCMs to a newly created/updated course.
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
    // Only target QCMs in same specialty (if defined) and without course_id or with matching courseTitle
    const sameSpec = !course.specialtyId || !q.specialtyId || q.specialtyId === course.specialtyId;
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

  // 2. Query Supabase for matching or unlinked QCMs in this specialty
  try {
    let query = supabaseAdmin.from('qcms').select('id, question, title, course_id, course_title, specialty_id');
    if (course.specialtyId) {
      query = query.eq('specialty_id', course.specialtyId);
    }

    const { data: cloudQcms, error } = await query;

    if (!error && Array.isArray(cloudQcms)) {
      const courseObj = { id: course.id, title: course.title, specialtyId: course.specialtyId || '' } as Course;

      for (const row of cloudQcms) {
        if (!row.course_id || row.course_id === '' || row.course_id === course.id) {
          const candidateTitle = row.course_title || '';
          const isMatch = (candidateTitle && isCourseMatch(candidateTitle, courseObj)) ||
            matchQcmToCourse({ title: row.title, question: row.question, courseTitle: row.course_title, specialtyId: row.specialty_id }, [courseObj]) !== null;

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
          course_title: String(course.title)
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
 * Reconciles all unlinked QCMs across the entire database with all existing courses.
 */
export async function reconcileAllOrphanedQcms(): Promise<{ totalLinked: number; details: Array<{ courseId: string; courseTitle: string; linkedCount: number }> }> {
  const localCourses = db.getCourses();
  let allCourses = [...localCourses];

  try {
    const { data: cloudCourses } = await supabaseAdmin.from('courses').select('*');
    if (cloudCourses && Array.isArray(cloudCourses)) {
      for (const cc of cloudCourses) {
        if (!allCourses.some(c => c.id === cc.id)) {
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
