import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { QCM } from '@/types';

export const dynamic = 'force-dynamic';

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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const specialty = url.searchParams.get('specialty') || undefined;
    const course = url.searchParams.get('course') || undefined;
    const faculty = url.searchParams.get('faculty') || undefined;
    const source = url.searchParams.get('source') || undefined;

    let qcmsMap = new Map<string, QCM>();

    // 1. Load local memory DB qcms
    const localQcms = db.getQcms();
    for (const q of localQcms) {
      qcmsMap.set(q.id, q);
    }

    // 2. Load Cloud Supabase qcms (Persistent storage)
    try {
      const { data: cloudQcms, error } = await supabaseAdmin.from('qcms').select('*');
      if (!error && Array.isArray(cloudQcms)) {
        for (const row of cloudQcms) {
          const mapped = mapSupabaseQcmToType(row);
          qcmsMap.set(mapped.id, mapped);
        }
      }
    } catch (sErr) {
      console.warn('Supabase fetch qcms fallback:', sErr);
    }

    let qcms = Array.from(qcmsMap.values());

    if (specialty) {
      qcms = qcms.filter(q => q.specialtyId === specialty);
    }
    if (course) {
      qcms = qcms.filter(q => q.courseId === course);
    }
    if (faculty && faculty !== 'TOUS') {
      qcms = qcms.filter(q => q.faculty === faculty || q.faculty === 'TOUS');
    }
    if (source && source !== 'TOUS') {
      qcms = qcms.filter(q => q.source && q.source.toLowerCase().includes(source.toLowerCase()));
    }

    return NextResponse.json({ success: true, qcms, total: qcms.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
