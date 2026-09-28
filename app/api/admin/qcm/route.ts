import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { QCM } from '@/types';
import { parseSourceHierarchy } from '@/lib/sourceUtils';

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
    faculty: (row.faculty || 'TOUS') as any,
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

async function syncQcmToSupabase(qcm: QCM) {
  try {
    const finalSource = qcm.source || (qcm.parentSource && qcm.subSource ? `${qcm.parentSource} - ${qcm.subSource}` : qcm.parentSource) || 'Externat';
    const payload = {
      id: String(qcm.id),
      specialty: String(qcm.specialtyId || 'cardio'),
      specialty_id: String(qcm.specialtyId || 'cardio'),
      specialty_name: String(qcm.specialtyName || 'Cardiologie'),
      course_id: qcm.courseId ? String(qcm.courseId) : null,
      course_title: qcm.courseTitle ? String(qcm.courseTitle) : null,
      question: String(qcm.question || qcm.title || 'Question'),
      title: String(qcm.question || qcm.title || 'Question'),
      vignette: String(qcm.vignette || ''),
      options: Array.isArray(qcm.options) ? qcm.options : [],
      correct_answers: Array.isArray(qcm.correctAnswers) ? qcm.correctAnswers : [0],
      explanation: String(qcm.explanation || ''),
      source: finalSource,
      faculty: qcm.faculty ? String(qcm.faculty) : 'TOUS',
      rang: qcm.rang ? String(qcm.rang) : 'Rang A',
      difficulty: qcm.difficulty ? String(qcm.difficulty) : 'Moyen',
      type: qcm.type ? String(qcm.type) : 'SINGLE',
      reference: qcm.reference ? String(qcm.reference) : null,
      tags: Array.isArray(qcm.tags) ? qcm.tags : [],
      access_level: qcm.accessLevel ? String(qcm.accessLevel) : 'FREE',
      year: (qcm.year && !isNaN(Number(qcm.year))) ? Number(qcm.year) : null
    };
    let { error } = await supabaseAdmin.from('qcms').upsert(payload, { onConflict: 'id' });
    if (error && error.message && error.message.includes('Could not find the column')) {
      const corePayload = {
        id: payload.id,
        specialty: payload.specialty,
        specialty_id: payload.specialty_id,
        specialty_name: payload.specialty_name,
        course_id: payload.course_id,
        course_title: payload.course_title,
        rang: payload.rang,
        title: payload.title,
        vignette: payload.vignette,
        options: payload.options,
        correct_answers: payload.correct_answers,
        explanation: payload.explanation,
        source: payload.source,
        faculty: payload.faculty,
        reference: payload.reference,
        year: payload.year
      };
      await supabaseAdmin.from('qcms').upsert(corePayload, { onConflict: 'id' });
    }
  } catch (err) {
    console.error('[Supabase Sync] QCM upsert exception:', err);
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
  const sessionCookie = req.cookies.get('asmedix_session')?.value;
  if (!currentUser && !sessionCookie) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
  }

  let qcmsMap = new Map<string, QCM>();

  let qcms: QCM[] = [];

  try {
    const { data: cloudQcms, error } = await supabaseAdmin.from('qcms').select('*');
    if (!error && Array.isArray(cloudQcms) && cloudQcms.length > 0) {
      qcms = cloudQcms.map(mapSupabaseQcmToType);
    }
  } catch (err) {
    console.warn('Supabase fetch qcms error:', err);
  }

  if (qcms.length === 0) {
    qcms = db.getQcms();
  }

  return NextResponse.json({ success: true, qcms });
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const sessionCookie = req.cookies.get('asmedix_session')?.value;
    if (!currentUser && !sessionCookie) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const effectiveSource = body.source || (body.parentSource && body.subSource ? `${body.parentSource} - ${body.subSource}` : body.parentSource) || 'Externat';
    const newQcm: QCM = {
      id: body.id || 'qcm_' + Date.now(),
      title: body.title,
      specialtyId: body.specialtyId,
      specialtyName: body.specialtyName || 'Cardiologie',
      courseId: body.courseId || undefined,
      courseTitle: body.courseTitle || undefined,
      faculty: body.faculty || 'TOUS',
      source: effectiveSource,
      parentSource: body.parentSource || undefined,
      subSource: body.subSource || undefined,
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
    const sessionCookie = req.cookies.get('asmedix_session')?.value;
    if (!currentUser && !sessionCookie) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
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
