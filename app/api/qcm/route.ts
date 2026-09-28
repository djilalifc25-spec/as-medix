import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { QCM } from '@/types';
import { matchQcmToSource } from '@/lib/sourceUtils';

export const dynamic = 'force-dynamic';

function parseOptions(raw: any): any[] {
  let arr: any[] = [];
  if (Array.isArray(raw)) {
    arr = raw;
  } else if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) arr = parsed;
    } catch (_e) {}
  }
  return arr.map((opt: any, idx: number) => {
    if (typeof opt === 'string') {
      return {
        id: `opt_${idx + 1}`,
        letter: String.fromCharCode(65 + idx),
        text: opt
      };
    }
    if (opt && typeof opt === 'object') {
      return {
        id: opt.id || `opt_${idx + 1}`,
        letter: opt.letter || String.fromCharCode(65 + idx),
        text: opt.text || ''
      };
    }
    return {
      id: `opt_${idx + 1}`,
      letter: String.fromCharCode(65 + idx),
      text: ''
    };
  });
}

function parseCorrectAnswers(raw: any, rawFallback: any): number[] {
  let arr = Array.isArray(raw) ? raw : (Array.isArray(rawFallback) ? rawFallback : null);
  if (!arr && typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) arr = parsed;
    } catch (_e) {}
  }
  if (!arr && typeof rawFallback === 'string') {
    try {
      const parsed = JSON.parse(rawFallback);
      if (Array.isArray(parsed)) arr = parsed;
    } catch (_e) {}
  }
  if (!arr || arr.length === 0) return [0];
  return arr.map((val: any) => Number(val)).filter(n => !isNaN(n));
}

function parseTags(raw: any): string[] {
  if (Array.isArray(raw)) return raw.map(t => String(t));
  if (typeof raw === 'string') return raw.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

function mapSupabaseQcmToType(row: any): QCM {
  const options = parseOptions(row.options);
  const correctAnswers = parseCorrectAnswers(row.correct_answers, row.correctAnswers);
  return {
    id: String(row.id),
    title: String(row.title || row.question || 'QCM'),
    specialtyId: String(row.specialty_id || row.specialty || 'cardio'),
    specialtyName: String(row.specialty_name || 'Cardiologie'),
    courseId: row.course_id ? String(row.course_id) : undefined,
    courseTitle: row.course_title ? String(row.course_title) : undefined,
    faculty: (row.faculty || 'ORAN') as any,
    source: String(row.source || 'Annales Examens'),
    rang: (row.rang || 'Rang A') as any,
    difficulty: (row.difficulty || 'Moyen') as any,
    type: correctAnswers.length > 1 ? 'MULTIPLE' : (row.type || 'SINGLE'),
    vignette: String(row.vignette || ''),
    question: String(row.question || row.title || ''),
    options: options.length > 0 ? options : [
      { id: 'opt_1', letter: 'A', text: 'Proposition A' },
      { id: 'opt_2', letter: 'B', text: 'Proposition B' }
    ],
    correctAnswers: correctAnswers,
    explanation: String(row.explanation || ''),
    reference: String(row.reference || "Faculté de Médecine d'Alger"),
    tags: parseTags(row.tags),
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
      const selectedSourcesList = source.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      qcms = qcms.filter(q => selectedSourcesList.some(s => matchQcmToSource(q, s)));
    }

    return NextResponse.json({ success: true, qcms, total: qcms.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
