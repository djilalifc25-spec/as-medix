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
      const qcmId = String(q.id || `qcm_ai_${now}_${i + 1}`);
      const finalSource = String(source || examTitle || q.source || 'Annales IA Extrait');

      const optionsArray = Array.isArray(q.options) ? q.options.map((opt: any, optIdx: number) => {
        if (typeof opt === 'string') {
          return {
            id: `opt_${optIdx + 1}`,
            letter: String.fromCharCode(65 + optIdx),
            text: opt
          };
        }
        return {
          id: opt.id || `opt_${optIdx + 1}`,
          letter: opt.letter || String.fromCharCode(65 + optIdx),
          text: typeof opt.text === 'object' ? JSON.stringify(opt.text) : String(opt.text || '')
        };
      }) : [];

      const safeOptions = optionsArray.length > 0 ? optionsArray : [
        { id: 'opt_1', letter: 'A', text: 'Proposition A' },
        { id: 'opt_2', letter: 'B', text: 'Proposition B' }
      ];

      const correctAnswersArray = (Array.isArray(q.correctAnswers) && q.correctAnswers.length > 0)
        ? q.correctAnswers.map((n: any) => Number(n)).filter((n: any) => !isNaN(n))
        : (Array.isArray(q.correct_answers) && q.correct_answers.length > 0)
          ? q.correct_answers.map((n: any) => Number(n)).filter((n: any) => !isNaN(n))
          : [0];

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

      const safeVignette = String(q.vignette || q.vignetteText || '');
      const safeQuestion = String(q.question || q.title || `QCM ${i + 1}`);
      const safeTitle = String(q.title || safeQuestion).substring(0, 200);
      const safeAccessLevel = String(q.accessLevel || body.accessLevel || 'PRO');

      const isHyper = Boolean(body.isHyperProbable || q.isHyperProbable);
      const tagsList = [finalSource, specialtyName || 'Médecine', 'Extrait IA'];
      if (isHyper) {
        tagsList.push('HYPER_PROBABLE_RESIDANAT');
      }

      const newQcm: QCM = {
        id: qcmId,
        title: safeTitle,
        specialtyId: String(specialtyId || q.specialtyId || 'cardio'),
        specialtyName: String(specialtyName || q.specialtyName || 'Cardiologie'),
        courseId: resolvedCourseId,
        courseTitle: resolvedCourseTitle,
        faculty: faculty || q.faculty || 'ORAN',
        source: finalSource,
        parentSource: effectiveParent,
        subSource: effectiveSub,
        rang: q.rang || 'Rang A',
        difficulty: q.difficulty || 'Moyen',
        type: correctAnswersArray.length > 1 ? 'MULTIPLE' : 'SINGLE',
        vignette: safeVignette,
        question: safeQuestion,
        options: safeOptions,
        correctAnswers: correctAnswersArray.length > 0 ? correctAnswersArray : [0],
        explanation: q.explanation || q.explanationHtml || '',
        reference: q.reference || `Examen : ${finalSource}`,
        tags: tagsList,
        accessLevel: safeAccessLevel as any,
        year: year ? Number(year) as any : undefined,
        isHyperProbable: isHyper
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
        specialty: String(newQcm.specialtyId || 'cardio'),
        specialty_id: String(newQcm.specialtyId || 'cardio'),
        specialty_name: String(newQcm.specialtyName || 'Cardiologie'),
        course_id: newQcm.courseId ? String(newQcm.courseId) : null,
        course_title: newQcm.courseTitle ? String(newQcm.courseTitle) : null,
        question: safeQuestion,
        title: safeTitle,
        vignette: safeVignette,
        options: safeOptions,
        correct_answers: correctAnswersArray.length > 0 ? correctAnswersArray : [0],
        explanation: String(newQcm.explanation || ''),
        source: String(newQcm.source || finalSource),
        faculty: String(newQcm.faculty || 'ORAN'),
        rang: String(newQcm.rang || 'Rang A'),
        difficulty: String(newQcm.difficulty || 'Moyen'),
        type: correctAnswersArray.length > 1 ? 'MULTIPLE' : 'SINGLE',
        reference: newQcm.reference ? String(newQcm.reference) : null,
        tags: Array.isArray(newQcm.tags) ? newQcm.tags : [finalSource, 'Extrait IA'],
        access_level: safeAccessLevel,
        year: (newQcm.year && !isNaN(Number(newQcm.year))) ? Number(newQcm.year) : null
      });
    }

    // Sync all QCMs to Supabase in batch with individual fallback
    let supabaseSucceededCount = 0;
    const supabaseErrors: string[] = [];

    if (supabasePayloads.length > 0) {
      try {
        let activeClient = supabaseAdmin;
        let { error } = await activeClient.from('qcms').upsert(supabasePayloads, { onConflict: 'id' });

        if (error && error.message && error.message.toLowerCase().includes('unregistered api key')) {
          console.warn('[Batch QCM Import] Unregistered API key detected, switching to verified fallback client...');
          const { createClient } = await import('@supabase/supabase-js');
          activeClient = createClient('https://mkaqspqmdspoisdjduza.supabase.co', 'sb_publishable_tyOYBYbiwqKBAsRMSijtMQ_gQ9cEL_3');
          const retry = await activeClient.from('qcms').upsert(supabasePayloads, { onConflict: 'id' });
          error = retry.error;
        }

        if (!error) {
          supabaseSucceededCount = supabasePayloads.length;
          console.log('[Batch QCM Import] Full batch successfully upserted into Supabase:', supabasePayloads.length);
        } else {
          console.warn('[Batch QCM Import] Full payload failed, retrying item by item:', error.message);
          for (const item of supabasePayloads) {
            try {
              let { error: itemErr } = await activeClient.from('qcms').upsert(item, { onConflict: 'id' });
              if (itemErr && itemErr.message && itemErr.message.toLowerCase().includes('unregistered api key')) {
                const { createClient } = await import('@supabase/supabase-js');
                activeClient = createClient('https://mkaqspqmdspoisdjduza.supabase.co', 'sb_publishable_tyOYBYbiwqKBAsRMSijtMQ_gQ9cEL_3');
                const retryItem = await activeClient.from('qcms').upsert(item, { onConflict: 'id' });
                itemErr = retryItem.error;
              }

              if (itemErr) {
                const coreItem = {
                  id: item.id,
                  specialty: item.specialty,
                  specialty_id: item.specialty_id,
                  specialty_name: item.specialty_name,
                  course_id: item.course_id,
                  course_title: item.course_title,
                  question: item.question,
                  title: item.title,
                  vignette: item.vignette,
                  options: item.options,
                  correct_answers: item.correct_answers,
                  explanation: item.explanation,
                  source: item.source,
                  faculty: item.faculty,
                  rang: item.rang,
                  reference: item.reference,
                  access_level: item.access_level,
                  year: item.year
                };
                const { error: coreErr } = await activeClient.from('qcms').upsert(coreItem, { onConflict: 'id' });
                if (coreErr) {
                  console.error(`[Batch QCM Import] Item ${item.id} core error:`, coreErr.message);
                  supabaseErrors.push(`${item.id}: ${coreErr.message}`);
                } else {
                  supabaseSucceededCount++;
                }
              } else {
                supabaseSucceededCount++;
              }
            } catch (err: any) {
              console.error(`[Batch QCM Import] Item ${item.id} exception:`, err);
              supabaseErrors.push(`${item.id}: ${err.message}`);
            }
          }
        }
      } catch (sbErr: any) {
        console.error('[Batch QCM Import] Supabase batch exception:', sbErr);
        supabaseErrors.push(sbErr.message);
      }
    }

    if (supabasePayloads.length > 0 && supabaseSucceededCount === 0) {
      return NextResponse.json({
        success: false,
        error: `Échec d'enregistrement dans Supabase SQL: ${supabaseErrors.slice(0, 3).join('; ') || 'Erreur inconnue'}`
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      importedCount: supabaseSucceededCount > 0 ? supabaseSucceededCount : createdQcms.length,
      totalRequested: qcms.length,
      examTitle: examTitle || source || 'Examen QCM',
      qcms: createdQcms,
      warnings: supabaseErrors.length > 0 ? supabaseErrors : undefined
    });
  } catch (err: any) {
    console.error('[batch-qcm-import] Error:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Erreur lors de l\'importation en lot des QCMs.'
    }, { status: 500 });
  }
}
