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
    const slug = url.searchParams.get('slug') || undefined;

    let map = new Map<string, CATProtocol>();

    // 1. Local store protocols
    const local = db.getCatProtocols();
    for (const item of local) {
      map.set(item.id, item);
      if (item.slug) map.set(item.slug, item);
    }

    // 2. Cloud Supabase protocols
    try {
      let query = supabaseAdmin
        .from('cat_protocols')
        .select('*')
        .eq('published', true);

      const { data, error } = await query;
      if (!error && data && Array.isArray(data)) {
        for (const d of data) {
          const mapped: CATProtocol = {
            id: d.id,
            slug: d.slug || d.id,
            title: d.title,
            specialtyId: d.specialty_id || d.specialtyId || 'cardio',
            specialtyName: d.specialty_name || d.specialtyName || 'Urgences',
            category: d.category || 'Urgences',
            urgencyLevel: d.urgency_level || d.urgencyLevel || 'Urgence Vitale',
            severity: d.severity || 'amber',
            page: d.page || '',
            summary: d.synopsis || d.summary || '',
            synopsis: d.synopsis || d.summary || '',
            cliniqueHtml: d.clinique_html || d.cliniqueHtml || '',
            urgenceHtml: d.urgence_html || d.urgenceHtml || '',
            protocoleHtml: d.protocole_html || d.protocoleHtml || '',
            bilanHtml: d.bilan_html || d.bilanHtml || '',
            alertes: d.alertes || '',
            conseils: d.conseils || '',
            ordonnance: Array.isArray(d.ordonnance) ? d.ordonnance : [],
            evaluationInitiale: Array.isArray(d.evaluation_initiale) ? d.evaluation_initiale : [],
            signesDeGravite: d.alertes ? [d.alertes] : [],
            diagnosticCritères: [],
            examensComplementaires: d.bilan_html ? [d.bilan_html] : [],
            conduiteImmediate: [],
            traitementSpecifique: [],
            orientation: d.alertes || 'SAU',
            redFlags: d.alertes ? [d.alertes] : [],
            clinicalPearls: d.conseils ? [d.conseils] : [],
            accessLevel: 'FREE',
            published: true,
            updatedAt: d.updated_at || new Date().toISOString()
          };
          map.set(mapped.id, mapped);
          if (mapped.slug) map.set(mapped.slug, mapped);
        }
      }
    } catch (e) {}

    // Deduplicate Map by ID
    let protocols = Array.from(new Set(Array.from(map.values())));

    if (slug) {
      const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();
      protocols = protocols.filter(p => 
        p.id === slug || 
        p.slug === slug || 
        (p.slug && p.slug.toLowerCase() === decodedSlug) ||
        (p.id && p.id.toLowerCase() === decodedSlug)
      );
    }
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
        (p.summary && p.summary.toLowerCase().includes(q)) ||
        p.specialtyName.toLowerCase().includes(q)
      );
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
