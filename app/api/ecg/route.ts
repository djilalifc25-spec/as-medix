import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ECGRecord } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    let map = new Map<string, ECGRecord>();
    const local = db.getEcgRecords();
    for (const item of local) map.set(item.id, item);

    try {
      const { data: cloud, error } = await supabaseAdmin.from('ecg_records').select('*');
      if (!error && Array.isArray(cloud)) {
        for (const row of cloud) {
          const mapped: ECGRecord = {
            id: String(row.id),
            title: row.title,
            category: row.category || 'Trouble du rythme',
            imageUrl: row.image_url || row.imageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
            clinicalContext: row.clinical_context || row.clinicalContext || '',
            difficulty: row.difficulty || 'Débutant',
            isDailyChallenge: Boolean(row.is_daily_challenge || row.isDailyChallenge),
            keyFindings: Array.isArray(row.key_findings) ? row.key_findings : Array.isArray(row.keyFindings) ? row.keyFindings : [],
            interpretation: row.interpretation || '',
            diagnosticDetails: row.diagnostic_details || row.diagnosticDetails || '',
            accessLevel: row.access_level || row.accessLevel || 'FREE',
            svgHtml: row.svg_html || row.svgHtml || ''
          };
          map.set(mapped.id, mapped);
        }
      }
    } catch (e) {}

    const records = Array.from(map.values());
    return NextResponse.json({ success: true, records, total: records.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
