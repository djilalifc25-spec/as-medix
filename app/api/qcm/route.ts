import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { QCM } from '@/types';
import { matchQcmToSource, parseSourceHierarchy } from '@/lib/sourceUtils';

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
        id: String(opt.id || `opt_${idx + 1}`),
        letter: String(opt.letter || String.fromCharCode(65 + idx)),
        text: typeof opt.text === 'object' ? JSON.stringify(opt.text) : String(opt.text || '')
      };
    }
    return {
      id: `opt_${idx + 1}`,
      letter: String.fromCharCode(65 + idx),
      text: typeof opt === 'number' || typeof opt === 'boolean' ? String(opt) : ''
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
  if (Array.isArray(raw)) return raw.map(t => typeof t === 'object' ? JSON.stringify(t) : String(t));
  if (typeof raw === 'string') return raw.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

function mapSupabaseQcmToType(row: any): QCM {
  const options = parseOptions(row.options);
  const correctAnswers = parseCorrectAnswers(row.correct_answers, row.correctAnswers);
  const sourceVal = typeof row.source === 'object' ? JSON.stringify(row.source) : String(row.source || 'Annales Examens');
  const vignetteVal = typeof row.vignette === 'object' ? JSON.stringify(row.vignette) : String(row.vignette || '');
  const questionVal = typeof row.question === 'object' ? JSON.stringify(row.question) : String(row.question || row.title || '');
  const explanationVal = typeof row.explanation === 'object' ? JSON.stringify(row.explanation) : String(row.explanation || '');
  const refVal = typeof row.reference === 'object' ? JSON.stringify(row.reference) : String(row.reference || "Faculté de Médecine d'Alger");

  const hierarchy = parseSourceHierarchy(sourceVal);
  const parentVal = row.parent_source ? String(row.parent_source) : (hierarchy.parent || sourceVal);
  const subVal = row.sub_source ? String(row.sub_source) : (hierarchy.sub || undefined);

  return {
    id: String(row.id),
    title: questionVal || 'QCM',
    specialtyId: String(row.specialty_id || row.specialty || 'cardio'),
    specialtyName: String(row.specialty_name || 'Cardiologie'),
    courseId: row.course_id ? String(row.course_id) : undefined,
    courseTitle: row.course_title ? String(row.course_title) : undefined,
    faculty: (row.faculty || 'ORAN') as any,
    source: sourceVal,
    parentSource: parentVal,
    subSource: subVal,
    rang: (row.rang || 'Rang A') as any,
    difficulty: (row.difficulty || 'Moyen') as any,
    type: correctAnswers.length > 1 ? 'MULTIPLE' : (row.type || 'SINGLE'),
    vignette: vignetteVal,
    question: questionVal,
    options: options.length > 0 ? options : [
      { id: 'opt_1', letter: 'A', text: 'Proposition A' },
      { id: 'opt_2', letter: 'B', text: 'Proposition B' }
    ],
    correctAnswers: correctAnswers,
    explanation: explanationVal,
    reference: refVal,
    tags: parseTags(row.tags),
    accessLevel: row.access_level || 'FREE',
    year: row.year && !isNaN(Number(row.year)) ? Number(row.year) as any : undefined
  };
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const specialty = url.searchParams.get('specialty') || undefined;
    const course = url.searchParams.get('course') || undefined;
    const faculty = url.searchParams.get('faculty') || undefined;
    const source = url.searchParams.get('source') || undefined;

    let qcms: QCM[] = [];

    // 1. Prioritize Cloud Supabase qcms (Persistent storage)
    try {
      const { data: cloudQcms, error } = await supabaseAdmin.from('qcms').select('*');
      if (!error && Array.isArray(cloudQcms) && cloudQcms.length > 0) {
        qcms = cloudQcms.map(mapSupabaseQcmToType);
      }
    } catch (sErr) {
      console.warn('Supabase fetch qcms fallback:', sErr);
    }

    // 2. Fallback to local memory DB only if cloud is completely empty
    if (qcms.length === 0) {
      qcms = db.getQcms();
    }

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
