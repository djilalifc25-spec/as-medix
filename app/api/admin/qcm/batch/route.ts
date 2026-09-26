import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { QCM } from '@/types';

async function syncQcmsToSupabase(qcms: QCM[]) {
  try {
    const payload = qcms.map(qcm => ({
      id: qcm.id,
      specialty: qcm.specialtyId,
      specialty_name: qcm.specialtyName || 'Cardiologie',
      course_id: qcm.courseId || null,
      course_title: qcm.courseTitle || null,
      faculty: qcm.faculty || 'ORAN',
      title: qcm.question || qcm.title || 'Question',
      vignette: qcm.vignette || '',
      options: qcm.options || [],
      correct_answers: qcm.correctAnswers || [0],
      explanation: qcm.explanation || '',
      rang: qcm.rang || 'Rang A'
    }));
    await supabaseAdmin.from('qcms').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.error('[Supabase Batch Sync] QCM upsert error:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    // Allow if admin OR if secret admin key is provided in header
    const authHeader = req.headers.get('x-admin-key');
    const isValidKey = authHeader && (authHeader === process.env.SUPABASE_SERVICE_ROLE_KEY || authHeader === 'asmedix-secret-admin');
    
    if (!isValidKey && (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN'))) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await req.json();
    const items: any[] = Array.isArray(body) ? body : (body.qcms || []);

    if (items.length === 0) {
      return NextResponse.json({ error: 'Aucun QCM fourni dans le corps de la requête.' }, { status: 400 });
    }

    const createdList: QCM[] = [];

    for (const item of items) {
      const newQcm: QCM = {
        id: item.id || `qcm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        title: item.title || (item.question ? (item.question.length > 80 ? item.question.substring(0, 80) + '...' : item.question) : 'QCM'),
        specialtyId: item.specialtyId || 'cardio',
        specialtyName: item.specialtyName || 'Cardiologie',
        courseId: item.courseId || undefined,
        courseTitle: item.courseTitle || undefined,
        faculty: item.faculty || 'ORAN',
        source: item.source || 'Annales Examens',
        rang: item.rang || 'Rang A',
        difficulty: item.difficulty || 'Moyen',
        type: item.type || ((item.correctAnswers && item.correctAnswers.length > 1) ? 'MULTIPLE' : 'SINGLE'),
        vignette: item.vignette || item.vignetteText || '',
        question: item.question || item.title || '',
        options: item.options || [],
        correctAnswers: item.correctAnswers || [0],
        explanation: item.explanation || item.explanationHtml || '',
        reference: item.reference || "Faculté de Médecine d'Alger",
        tags: item.tags || [],
        accessLevel: item.accessLevel || 'FREE',
        year: item.year ? (Number(item.year) as any) : undefined
      };

      const saved = db.createQcm(newQcm);
      createdList.push(saved);
    }

    await syncQcmsToSupabase(createdList);

    return NextResponse.json({
      success: true,
      count: createdList.length,
      qcms: createdList
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
