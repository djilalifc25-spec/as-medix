import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { INITIAL_MEDICATIONS } from '@/lib/db/seedMedications';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.toLowerCase().trim() || '';

    const supabase = getSupabaseServerClient();

    // Try Supabase first
    let query = supabase.from('medications').select('*').order('dci', { ascending: true });
    if (q) {
      query = query.or(`dci.ilike.%${q}%,therapeutic_class.ilike.%${q}%`);
    }
    const { data, error } = await query.limit(200);

    // If Supabase has data, use it; otherwise fallback to local seed
    let medications;
    if (!error && data && data.length > 0) {
      medications = data.map((m: any) => ({
        id: m.id, dci: m.dci,
        commercialNames: m.commercial_names || [],
        therapeuticClass: m.therapeutic_class,
        dosageForms: m.dosage_forms || [],
        indications: m.indications || [],
        contraindications: m.contraindications || [],
        interactions: m.interactions || [],
        standardPosology: m.standard_posology,
        algerianCommercialStatus: m.algerian_commercial_status,
        notes: m.notes,
      }));
    } else {
      // Fallback to seed data with local search
      medications = q
        ? INITIAL_MEDICATIONS.filter(m =>
            m.dci.toLowerCase().includes(q) ||
            m.commercialNames.some(cn => cn.toLowerCase().includes(q)) ||
            m.therapeuticClass.toLowerCase().includes(q))
        : INITIAL_MEDICATIONS;
    }

    return NextResponse.json({ success: true, medications, total: medications.length });
  } catch (err: any) {
    // Always fallback to seed on error
    return NextResponse.json({ success: true, medications: INITIAL_MEDICATIONS, total: INITIAL_MEDICATIONS.length });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }
    const body = await req.json();
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase.from('medications').upsert({
      id: body.id || `med_${Date.now()}`,
      dci: body.dci,
      commercial_names: body.commercialNames || [],
      therapeutic_class: body.therapeuticClass || 'Thérapeutique',
      dosage_forms: body.dosageForms || [],
      indications: body.indications || [],
      contraindications: body.contraindications || [],
      interactions: body.interactions || [],
      standard_posology: body.standardPosology || '',
      algerian_commercial_status: body.algerianCommercialStatus || 'Disponible en pharmacie',
      notes: body.notes || '',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' }).select().single();

    if (error) throw error;
    return NextResponse.json({ success: true, medication: data });
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

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('medications').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


