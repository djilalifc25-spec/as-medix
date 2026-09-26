import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { ClinicalCase } from '@/types';

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
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
