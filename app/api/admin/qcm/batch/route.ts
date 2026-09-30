import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { QCM } from '@/types';
import { parseSourceHierarchy } from '@/lib/sourceUtils';
import { matchQcmToCourse } from '@/lib/qcmCourseLinker';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const sessionCookie = req.cookies.get('asmedix_session')?.value;
    const demoOverride = req.cookies.get('asmedix_demo_override')?.value;
    if (!currentUser && !sessionCookie && demoOverride !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Accès non autorisé. Veuillez vous connecter.' }, { status: 401 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch (_jsonErr) {
      return NextResponse.json({ success: false, error: 'Format JSON invalide.' }, { status: 400 });
    }

    const { qcms, examTitle, specialtyId, specialtyName, courseId, courseTitle, faculty, year, source } = body;

    if (!Array.isArray(qcms) || qcms.length === 0) {
      return NextResponse.json({ success: false, error: 'Aucun QCM à importer dans la liste.' }, { status: 400 });
    }

    // Load available courses for matching
    const localCourses = db.getCourses();
    let coursesList = [...localCourses];
    try {
      const { data: cloudCourses } = await supabaseAdmin.from('courses').select('id, title, specialty_id');
      if (cloudCourses && Array.isArray(cloudCourses)) {
        for (const cc of cloudCourses) {
          if (!coursesList.some(c => c.id === cc.id)) {
            coursesList.push({
              id: String(cc.id),
              title: cc.title || 'Cours',
              specialtyId: cc.specialty_id || 'cardio'
            } as any);
          }
        }
      }
    } catch (_) {}

    const createdQcms: QCM[] = [];
    const supabasePayloads: any[] = [];

    const now = Date.now();

    for (let i = 0; i < qcms.length; i++) {
      const q = qcms[i];
      const qcmId = q.id || `qcm_ai_${now}_${i + 1}`;
      const finalSource = source || examTitle || q.source || 'Annales IA Extrait';

      const optionsArray = Array.isArray(q.options) ? q.options.map((opt: any, optIdx: number) => ({
        id: opt.id || `opt_${optIdx + 1}`,
        letter: opt.letter || String.fromCharCode(65 + optIdx),
        text: opt.text || ''
      })) : [];

      const correctAnswersArray = Array.isArray(q.correctAnswers) ? q.correctAnswers : [0];

      const hierarchy = parseSourceHierarchy(finalSource);
      const effectiveParent = q.parentSource || hierarchy.parent;
      const effectiveSub = q.subSource || hierarchy.sub || undefined;

      let resolvedCourseId = courseId || q.courseId || undefined;
      let resolvedCourseTitle = courseTitle || q.courseTitle || undefined;

      if (!resolvedCourseId && (resolvedCourseTitle || q.question)) {
        const matched = matchQcmToCourse({
          title: q.title,
          question: q.question,
          courseTitle: resolvedCourseTitle,
          specialtyId: specialtyId || q.specialtyId
        }, coursesList as any);

        if (matched) {
          resolvedCourseId = matched.id;
          resolvedCourseTitle = matched.title;
        }
      }

      const newQcm: QCM = {
        id: qcmId,
        title: q.title || q.question || `QCM ${i + 1}`,
        specialtyId: specialtyId || q.specialtyId || 'cardio',
        specialtyName: specialtyName || q.specialtyName || 'Cardiologie',
        courseId: resolvedCourseId,
        courseTitle: resolvedCourseTitle,
        faculty: faculty || q.faculty || 'ORAN',
        source: finalSource,
        parentSource: effectiveParent,
        subSource: effectiveSub,
        rang: q.rang || 'Rang A',
        difficulty: q.difficulty || 'Moyen',
        type: correctAnswersArray.length > 1 ? 'MULTIPLE' : 'SINGLE',
        vignette: q.vignette || '',
        question: q.question || q.title || `QCM ${i + 1}`,
        options: optionsArray,
        correctAnswers: correctAnswersArray,
        explanation: q.explanation || q.explanationHtml || '',
        reference: q.reference || `Examen : ${finalSource}`,
        tags: [finalSource, specialtyName || 'Médecine', 'Extrait IA'],
        accessLevel: (q.accessLevel || body.accessLevel || 'PRO') as any,
        year: year ? Number(year) as any : undefined
      };

      // Add to local DB store
      try {
        db.createQcm(newQcm);
      } catch (_dbErr) {
        // Ignored if duplicate id
      }
      createdQcms.push(newQcm);

      // Prepare Supabase payload
      supabasePayloads.push({
        id: newQcm.id,
        specialty: newQcm.specialtyId,
        specialty_id: newQcm.specialtyId,
        specialty_name: newQcm.specialtyName,
        course_id: newQcm.courseId || null,
        course_title: newQcm.courseTitle || null,
        question: newQcm.question,
        title: newQcm.title,
        vignette: newQcm.vignette,
        options: newQcm.options,
        correct_answers: newQcm.correctAnswers,
        explanation: newQcm.explanation,
        source: newQcm.source,
        faculty: newQcm.faculty || 'ORAN',
        rang: newQcm.rang || 'Rang A',
        difficulty: newQcm.difficulty || 'Moyen',
        type: newQcm.type || 'SINGLE',
        reference: newQcm.reference || null,
        tags: Array.isArray(newQcm.tags) ? newQcm.tags : [],
        access_level: newQcm.accessLevel || 'FREE',
        year: (newQcm.year && !isNaN(Number(newQcm.year))) ? Number(newQcm.year) : null
      });
    }

    // Sync all QCMs to Supabase in batch
    if (supabasePayloads.length > 0) {
      try {
        const { error } = await supabaseAdmin.from('qcms').upsert(supabasePayloads, { onConflict: 'id' });
        if (error) {
          console.warn('[Batch QCM Import] Full payload failed, retrying with core schema:', error.message);
          const corePayloads = supabasePayloads.map(p => ({
            id: p.id,
            specialty: p.specialty,
            specialty_id: p.specialty_id,
            specialty_name: p.specialty_name,
            course_id: p.course_id,
            course_title: p.course_title,
            question: p.question,
            title: p.title,
            vignette: p.vignette,
            options: p.options,
            correct_answers: p.correct_answers,
            explanation: p.explanation,
            source: p.source,
            faculty: p.faculty,
            rang: p.rang,
            reference: p.reference,
            access_level: p.access_level,
            year: p.year
          }));
          const { error: coreErr } = await supabaseAdmin.from('qcms').upsert(corePayloads, { onConflict: 'id' });
          if (coreErr) {
            console.error('[Batch QCM Import] Core payload error:', coreErr.message);
          } else {
            console.log('[Batch QCM Import] Core batch successfully upserted into Supabase:', corePayloads.length);
          }
        } else {
          console.log('[Batch QCM Import] Full batch successfully upserted into Supabase:', supabasePayloads.length);
        }
      } catch (sbErr) {
        console.error('[Batch QCM Import] Supabase exception:', sbErr);
      }
    }

    return NextResponse.json({
      success: true,
      importedCount: createdQcms.length,
      examTitle: examTitle || source || 'Examen QCM',
      qcms: createdQcms
    });
  } catch (err: any) {
    console.error('[batch-qcm-import] Error:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Erreur lors de l\'importation en lot des QCMs.'
    }, { status: 500 });
  }
}
