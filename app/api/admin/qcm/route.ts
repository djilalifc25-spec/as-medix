import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { QCM } from '@/types';

async function syncQcmToSupabase(qcm: QCM) {
  try {
    await supabaseAdmin.from('qcms').upsert({
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

  const qcms = db.getQcms();
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
