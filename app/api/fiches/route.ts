import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Fiche } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    let map = new Map<string, Fiche>();

    // Always seed from local db store (asmedix_db.json + seedFiches) first
    const local = db.getFiches();
    for (const item of local) {
      map.set(item.id, item);
    }

    try {
      const { data: cloud, error } = await supabaseAdmin.from('fiches').select('*');
      if (!error && Array.isArray(cloud) && cloud.length > 0) {
        for (const row of cloud) {
          const id = String(row.id);
          const existing = map.get(id);

          const mapped: Fiche = {
            id,
            slug: row.slug || existing?.slug || id,
            title: row.title || existing?.title || 'Fiche Flash',
            specialtyId: row.specialty_id || row.specialtyId || existing?.specialtyId || 'cardio',
            specialtyName: row.specialty_name || row.specialtyName || existing?.specialtyName || 'Médecine',
            category: row.category || existing?.category || 'Synthèse Clinique',
            estimatedReadTime: row.estimated_read_time || row.estimatedReadTime || existing?.estimatedReadTime || '4 min',
            keyTakeaways: (Array.isArray(row.key_takeaways) && row.key_takeaways.length > 0)
              ? row.key_takeaways
              : (Array.isArray(row.keyTakeaways) && row.keyTakeaways.length > 0)
                ? row.keyTakeaways
                : (existing?.keyTakeaways || []),
            accessLevel: row.access_level || row.accessLevel || existing?.accessLevel || 'FREE',
            published: row.published !== undefined ? Boolean(row.published) : (existing?.published !== undefined ? existing.published : true),
            htmlContent: (row.html_content && row.html_content.length > 20)
              ? row.html_content
              : (row.htmlContent && row.htmlContent.length > 20)
                ? row.htmlContent
                : (existing?.htmlContent || '<p>Contenu de la fiche mémo</p>'),
            updatedAt: row.updated_at || row.updatedAt || existing?.updatedAt || new Date().toISOString()
          };
          map.set(mapped.id, mapped);
        }
      }
    } catch (e) {}

    const deletedFichesSpecIds = db.getDeletedFichesSpecialtyIds();
    const fiches = Array.from(map.values()).filter(f => !deletedFichesSpecIds.includes(f.specialtyId));
    return NextResponse.json({ success: true, fiches, total: fiches.length, deletedSpecialtyIds: deletedFichesSpecIds });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
