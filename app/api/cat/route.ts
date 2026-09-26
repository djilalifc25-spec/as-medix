import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { CATProtocol } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const specialty = url.searchParams.get('specialty') || undefined;
    const urgency = url.searchParams.get('urgency') || undefined;
    const search = url.searchParams.get('search') || undefined;

    let protocols: CATProtocol[] = [];

    // 1. Try Supabase first
    try {
      let query = supabaseAdmin
        .from('cat_protocols')
        .select('*')
        .eq('published', true);

      if (specialty) {
        query = query.eq('specialty_id', specialty);
      }
      if (urgency && urgency !== 'all') {
        query = query.eq('urgency_level', urgency);
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,synopsis.ilike.%${search}%,specialty_name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        protocols = data.map((d: any) => ({
          id: d.id,
          slug: d.slug,
          title: d.title,
          specialtyId: d.specialty_id,
          specialtyName: d.specialty_name,
          category: d.category,
          urgencyLevel: d.urgency_level,
          severity: d.severity,
          page: d.page,
          summary: d.synopsis,
          synopsis: d.synopsis,
          cliniqueHtml: d.clinique_html,
          urgenceHtml: d.urgence_html,
          protocoleHtml: d.protocole_html,
          bilanHtml: d.bilan_html,
          alertes: d.alertes,
          conseils: d.conseils,
          ordonnance: d.ordonnance || [],
          evaluationInitiale: [],
          signesDeGravite: d.alertes ? [d.alertes] : [],
          diagnosticCritères: [],
          examensComplementaires: d.bilan_html ? [d.bilan_html] : [],
          conduiteImmediate: [],
          traitementSpecifique: [],
          orientation: d.alertes || '',
          redFlags: d.alertes ? [d.alertes] : [],
          clinicalPearls: d.conseils ? [d.conseils] : [],
          accessLevel: 'FREE',
          published: true,
          updatedAt: d.updated_at
        }));
      }
    } catch (e) {
      // Fallback
    }

    // 2. Fallback to local store if Supabase unavailable
    if (protocols.length === 0) {
      protocols = db.getCatProtocols();

      if (specialty) {
        protocols = protocols.filter(p => p.specialtyId === specialty);
      }
      if (urgency && urgency !== 'all') {
        protocols = protocols.filter(p => p.urgencyLevel === urgency);
      }
      if (search) {
        const q = search.toLowerCase();
        protocols = protocols.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.specialtyName.toLowerCase().includes(q)
        );
      }
    }

    return NextResponse.json({
      success: true,
      protocols,
      total: protocols.length
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
