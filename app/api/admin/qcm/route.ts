import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { QCM } from '@/types';

function mapSupabaseQcmToType(row: any): QCM {
  return {
    id: row.id,
    title: row.title || row.question || 'QCM',
    specialtyId: row.specialty_id || row.specialty || 'cardio',
    specialtyName: row.specialty_name || 'Cardiologie',
    courseId: row.course_id || undefined,
    courseTitle: row.course_title || undefined,
    faculty: row.faculty || 'ORAN',
    source: row.source || 'Annales Examens',
    rang: row.rang || 'Rang A',
    difficulty: row.difficulty || 'Moyen',
    type: row.type || 'SINGLE',
    vignette: row.vignette || '',
    question: row.question || row.title || '',
    options: Array.isArray(row.options) ? row.options : [],
    correctAnswers: Array.isArray(row.correct_answers) ? row.correct_answers : [0],
    explanation: row.explanation || '',
    reference: row.reference || "Faculté de Médecine d'Alger",
    tags: Array.isArray(row.tags) ? row.tags : [],
    accessLevel: row.access_level || 'FREE',
    year: row.year ? Number(row.year) as any : undefined
  };
}

async function syncQcmToSupabase(qcm: QCM) {
  try {
    await supabaseAdmin.from('qcms').upsert({
      id: qcm.id,
      specialty: qcm.specialtyId,
      specialty_id: qcm.specialtyId,
      specialty_name: qcm.specialtyName || 'Cardiologie',
      course_id: qcm.courseId || null,
      course_title: qcm.courseTitle || null,
      faculty: qcm.faculty || 'ORAN',
      source: qcm.source || 'Annales Examens',
      title: qcm.question || qcm.title || 'Question',
      vignette: qcm.vignette || '',
      options: qcm.options || [],
      correct_answers: qcm.correctAnswers || [0],
      explanation: qcm.explanation || '',
      rang: qcm.rang || 'Rang A',
      year: qcm.year || null,
      difficulty: qcm.difficulty || 'Moyen',
      type: qcm.type || 'SINGLE',
      reference: qcm.reference || "Faculté de Médecine d'Alger"
    }, { onConflict: 'id' });
  } catch (err) {
    console.error('[Supabase Sync] QCM upsert error:', err);
  }
}

async function deleteQcmFromSupabase(id: string) {
  try {
    await supabaseAdmin.from('qcms').delete().eq('id', id);
  } catch (err) {
    console.error('[Supabase Sync] QCM delete error:', err);
  }
}

export async function GET(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }

  let qcmsMap = new Map<string, QCM>();

  const localQcms = db.getQcms();
  for (const q of localQcms) {
    qcmsMap.set(q.id, q);
  }

  try {
    const { data: cloudQcms, error } = await supabaseAdmin.from('qcms').select('*');
    if (!error && Array.isArray(cloudQcms)) {
      for (const row of cloudQcms) {
        const mapped = mapSupabaseQcmToType(row);
        qcmsMap.set(mapped.id, mapped);
      }
    }
  } catch (err) {
    console.warn('Supabase fetch qcms error:', err);
  }

  const qcms = Array.from(qcmsMap.values());
  return NextResponse.json({ success: true, qcms });
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await req.json();
    const newQcm: QCM = {
      id: body.id || 'qcm_' + Date.now(),
      title: body.title,
      specialtyId: body.specialtyId,
      specialtyName: body.specialtyName || 'Cardiologie',
      courseId: body.courseId || undefined,
      courseTitle: body.courseTitle || undefined,
      faculty: body.faculty || 'ORAN',
      source: body.source || 'Annales Résidanat',
      rang: body.rang || 'Rang A',
      difficulty: body.difficulty || 'Moyen',
      type: body.type || 'SINGLE',
      vignette: body.vignette || '',
      question: body.question,
      options: body.options || [],
      correctAnswers: body.correctAnswers || [0],
      explanation: body.explanation || '',
      reference: body.reference || 'Faculté de Médecine d\'Alger',
      tags: body.tags || [],
      accessLevel: body.accessLevel || 'FREE',
      year: body.year ? Number(body.year) as any : undefined
    };

    const saved = db.createQcm(newQcm);
    await syncQcmToSupabase(newQcm);

    return NextResponse.json({ success: true, qcm: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });
    db.deleteQcm(id);
    await deleteQcmFromSupabase(id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
