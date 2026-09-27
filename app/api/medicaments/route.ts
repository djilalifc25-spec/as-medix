import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
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
