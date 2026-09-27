import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ClinicalCase } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    let map = new Map<string, ClinicalCase>();
    const local = db.getClinicalCases();
    for (const item of local) map.set(item.id, item);

    try {
      const { data: cloud, error } = await supabaseAdmin.from('cas_cliniques').select('*');
      if (!error && Array.isArray(cloud)) {
        for (const row of cloud) {
          const mapped: ClinicalCase = {
            id: String(row.id),
            title: row.title,
            specialtyId: row.specialty_id || row.specialtyId || 'cardio',
            specialtyName: row.specialty_name || row.specialtyName || 'Cardiologie',
            difficulty: row.difficulty || 'Avancé',
            patientProfile: row.patient_profile || row.patientProfile || { age: 45, gender: 'Homme', history: '' },
            steps: Array.isArray(row.steps) ? row.steps : [],
            debrief: row.debrief || '',
            accessLevel: row.access_level || row.accessLevel || 'FREE',
            published: row.published !== undefined ? Boolean(row.published) : true
          };
          map.set(mapped.id, mapped);
        }
      }
    } catch (e) {}

    const cases = Array.from(map.values());
    return NextResponse.json({ success: true, cases, total: cases.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
