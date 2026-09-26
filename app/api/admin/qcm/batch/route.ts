import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { QCM } from '@/types';

async function syncQcmsToSupabase(qcms: QCM[]) {
  try {
    const map = new Map<string, any>();
    qcms.forEach((qcm, index) => {
      const safeId = String(qcm.id || `qcm_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`);
      map.set(safeId, {
        id: safeId,
        specialty: String(qcm.specialtyId || 'cardio'),
        specialty_id: String(qcm.specialtyId || 'cardio'),
        specialty_name: String(qcm.specialtyName || 'Cardiologie'),
        course_id: qcm.courseId ? String(qcm.courseId) : null,
        course_title: qcm.courseTitle ? String(qcm.courseTitle) : null,
        rang: qcm.rang ? String(qcm.rang) : 'Rang A',
        title: String(qcm.question || qcm.title || 'Question'),
        vignette: String(qcm.vignette || ''),
        options: Array.isArray(qcm.options) ? qcm.options : [],
        correct_answers: Array.isArray(qcm.correctAnswers) ? qcm.correctAnswers : [0],
        explanation: String(qcm.explanation || ''),
        year: qcm.year ? String(qcm.year) : null
      });
    });

    const payload = Array.from(map.values());
    if (payload.length > 0) {
      const { error } = await supabaseAdmin.from('qcms').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.error('[Supabase Batch Sync] QCM upsert error:', error);
      }
    }
  } catch (err) {
    console.error('[Supabase Batch Sync] QCM upsert exception:', err);
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
