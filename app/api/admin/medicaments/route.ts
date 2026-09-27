import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/auth';
import { Medication } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.toLowerCase().trim() || '';

    let map = new Map<string, Medication>();
    const local = db.getMedications();
    for (const item of local) map.set(item.id, item);

    try {
      const { data: cloud, error } = await supabaseAdmin.from('medications').select('*');
      if (!error && Array.isArray(cloud)) {
        for (const m of cloud) {
          const mapped: Medication = {
            id: String(m.id),
            dci: m.dci,
            commercialNames: m.commercial_names || m.commercialNames || [],
            therapeuticClass: m.therapeutic_class || m.therapeuticClass || 'Thérapeutique',
            dosageForms: m.dosage_forms || m.dosageForms || [],
            indications: m.indications || [],
            contraindications: m.contraindications || [],
            interactions: m.interactions || [],
            standardPosology: m.standard_posology || m.standardPosology || '',
            algerianCommercialStatus: m.algerian_commercial_status || m.algerianCommercialStatus || 'Disponible en pharmacie',
            notes: m.notes || ''
          };
          map.set(mapped.id, mapped);
        }
      }
    } catch (e) {}

    let medications = Array.from(map.values());
    if (q) {
      medications = medications.filter(m =>
        m.dci.toLowerCase().includes(q) ||
        (Array.isArray(m.commercialNames) && m.commercialNames.some(cn => cn.toLowerCase().includes(q))) ||
        (m.therapeuticClass && m.therapeuticClass.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, medications, total: medications.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }
    const body = await req.json();
    const newMed: Medication = {
      id: body.id || `med_${Date.now()}`,
      dci: body.dci,
      commercialNames: body.commercialNames || [],
      therapeuticClass: body.therapeuticClass || 'Thérapeutique',
      dosageForms: body.dosageForms || [],
      indications: body.indications || [],
      contraindications: body.contraindications || [],
      interactions: body.interactions || [],
      standardPosology: body.standardPosology || '',
      algerianCommercialStatus: body.algerianCommercialStatus || 'Disponible en pharmacie',
      notes: body.notes || ''
    };

    const saved = db.createMedication(newMed);

    try {
      await supabaseAdmin.from('medications').upsert({
        id: newMed.id,
        dci: newMed.dci,
        commercial_names: newMed.commercialNames,
        therapeutic_class: newMed.therapeuticClass,
        dosage_forms: newMed.dosageForms,
        indications: newMed.indications,
        contraindications: newMed.contraindications,
        interactions: newMed.interactions,
        standard_posology: newMed.standardPosology,
        algerian_commercial_status: newMed.algerianCommercialStatus,
        notes: newMed.notes,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    } catch (sErr) {
      console.warn('[Supabase Sync] Medication upsert warning:', sErr);
    }

    return NextResponse.json({ success: true, medication: saved });
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

    db.deleteMedication(id);

    try {
      await supabaseAdmin.from('medications').delete().eq('id', id);
    } catch (sErr) {
      console.warn('[Supabase Sync] Medication delete warning:', sErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
