import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { CATProtocol } from '@/types';

async function syncCatToSupabase(cat: CATProtocol) {
  try {
    await supabaseAdmin.from('cat_protocols').upsert({
      id: cat.id,
      slug: cat.slug,
      title: cat.title,
      specialty_id: cat.specialtyId,
      specialty_name: cat.specialtyName,
      category: (cat as any).category || cat.specialtyName || 'Urgences',
      urgency_level: cat.urgencyLevel,
      severity: (cat as any).severity || 'amber',
      page: (cat as any).page || '',
      synopsis: (cat as any).synopsis || cat.summary || '',
      clinique_html: (cat as any).cliniqueHtml || '',
      urgence_html: (cat as any).urgenceHtml || '',
      protocole_html: (cat as any).protocoleHtml || '',
      bilan_html: (cat as any).bilanHtml || '',
      alertes: (cat as any).alertes || (cat.redFlags ? cat.redFlags.join(' • ') : ''),
      conseils: (cat as any).conseils || '',
      ordonnance: (cat as any).ordonnance || [],
      published: true,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  } catch (err) {
    console.error('[Supabase Sync] CAT upsert error:', err);
  }
}

async function deleteCatFromSupabase(id: string) {
  try {
    await supabaseAdmin.from('cat_protocols').delete().eq('id', id);
  } catch (err) {
    console.error('[Supabase Sync] CAT delete error:', err);
  }
}

export async function GET(req: NextRequest) {
  const currentUser = await getCurrentUser();
  const cookieHeader = req.headers.get('cookie') || '';
  const hasSessionCookie = cookieHeader.includes('asmedix_session');
  if (!currentUser && !hasSessionCookie && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }

  const protocols = db.getCatProtocols();
  return NextResponse.json({ success: true, protocols });
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const cookieHeader = req.headers.get('cookie') || '';
    const hasSessionCookie = cookieHeader.includes('asmedix_session');
    if (!currentUser && !hasSessionCookie && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await req.json();
    const newCat: CATProtocol = {
      id: body.id || 'cat_' + Date.now(),
      slug: body.slug || 'cat-' + Date.now(),
      title: body.title,
      specialtyId: body.specialtyId,
      specialtyName: body.specialtyName || 'Urgences',
      urgencyLevel: body.urgencyLevel || 'Urgence Vitale',
      summary: body.summary || '',
      conduiteHtml: body.conduiteHtml || '',
      evaluationInitiale: body.evaluationInitiale || [],
      signesDeGravite: body.signesDeGravite || [],
      diagnosticCritères: body.diagnosticCritères || [],
      examensComplementaires: body.examensComplementaires || [],
      conduiteImmediate: body.conduiteImmediate || [],
      traitementSpecifique: body.traitementSpecifique || [],
      orientation: body.orientation || 'Service d\'Accueil des Urgences',
      redFlags: body.redFlags || [],
      clinicalPearls: body.clinicalPearls || [],
      accessLevel: body.accessLevel || 'FREE',
      published: true,
      updatedAt: new Date().toISOString()
    };

    const saved = db.createCatProtocol(newCat);
    await syncCatToSupabase(newCat);

    return NextResponse.json({ success: true, protocol: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const cookieHeader = req.headers.get('cookie') || '';
    const hasSessionCookie = cookieHeader.includes('asmedix_session');
    if (!currentUser && !hasSessionCookie && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });
    db.deleteCatProtocol(id);
    await deleteCatFromSupabase(id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
