import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ClinicalCase } from '@/types';

async function syncCaseToSupabase(clinicalCase: ClinicalCase) {
  try {
    const payload = {
      id: String(clinicalCase.id),
      title: String(clinicalCase.title),
      specialty_id: String(clinicalCase.specialtyId || 'cardio'),
      specialty_name: String(clinicalCase.specialtyName || 'Médecine'),
      difficulty: String(clinicalCase.difficulty || 'Interne'),
      patient_profile: clinicalCase.patientProfile || {},
      steps: Array.isArray(clinicalCase.steps) ? clinicalCase.steps : [],
      debrief: String(clinicalCase.debrief || ''),
      access_level: String(clinicalCase.accessLevel || 'FREE'),
      published: clinicalCase.published !== undefined ? Boolean(clinicalCase.published) : true,
      updated_at: new Date().toISOString()
    };
    await supabaseAdmin.from('cas_cliniques').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('[Supabase Sync] ClinicalCase upsert warning:', err);
  }
}

async function deleteCaseFromSupabase(id: string) {
  try {
    await supabaseAdmin.from('cas_cliniques').delete().eq('id', id);
  } catch (err) {
    console.warn('[Supabase Sync] ClinicalCase delete warning:', err);
  }
}

export async function GET(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }

  const cases = db.getClinicalCases();
  return NextResponse.json({ success: true, cases });
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await req.json();
    const newCase: ClinicalCase = {
      id: body.id || 'case_' + Date.now(),
      title: body.title,
      specialtyId: body.specialtyId,
      specialtyName: body.specialtyName || 'Médecine',
      difficulty: body.difficulty || 'Interne',
      patientProfile: body.patientProfile || {
        age: 45,
        gender: 'Homme',
        motif: body.patientPresentation || 'Consultation',
        antecedents: []
      },
      steps: body.steps || [],
      accessLevel: body.accessLevel || 'FREE',
      published: true
    };

    const saved = db.createClinicalCase(newCase);
    await syncCaseToSupabase(newCase);

    return NextResponse.json({ success: true, case: saved });
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

    db.deleteClinicalCase(id);
    await deleteCaseFromSupabase(id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
