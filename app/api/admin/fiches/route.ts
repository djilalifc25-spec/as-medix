import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Fiche } from '@/types';

async function syncFicheToSupabase(fiche: Fiche) {
  try {
    const payload = {
      id: String(fiche.id),
      slug: String(fiche.slug || fiche.id),
      title: String(fiche.title),
      specialty_id: String(fiche.specialtyId || 'cardio'),
      specialty_name: String(fiche.specialtyName || 'Médecine'),
      category: String(fiche.category || 'Synthèse Clinique'),
      estimated_read_time: String(fiche.estimatedReadTime || '4 min'),
      key_takeaways: Array.isArray(fiche.keyTakeaways) ? fiche.keyTakeaways : [],
      access_level: String(fiche.accessLevel || 'FREE'),
      published: fiche.published !== undefined ? Boolean(fiche.published) : true,
      html_content: String(fiche.htmlContent || ''),
      updated_at: new Date().toISOString()
    };
    await supabaseAdmin.from('fiches').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('[Supabase Sync] Fiche upsert warning:', err);
  }
}

async function deleteFicheFromSupabase(id: string) {
  try {
    await supabaseAdmin.from('fiches').delete().eq('id', id);
  } catch (err) {
    console.warn('[Supabase Sync] Fiche delete warning:', err);
  }
}

export async function GET(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }

  const fiches = db.getFiches();
  return NextResponse.json({ success: true, fiches });
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await req.json();
    const newFiche: Fiche = {
      id: body.id || 'fiche_' + Date.now(),
      slug: body.slug || 'fiche-' + Date.now(),
      title: body.title,
      specialtyId: body.specialtyId,
      specialtyName: body.specialtyName || 'Médecine',
      category: body.category || 'Synthèse Clinique',
      estimatedReadTime: body.estimatedReadTime || '4 min',
      keyTakeaways: body.keyTakeaways || [],
      accessLevel: body.accessLevel || 'FREE',
      published: true,
      htmlContent: body.htmlContent || '<p>Contenu de la fiche mémo</p>',
      updatedAt: new Date().toISOString()
    };

    const saved = db.createFiche(newFiche);
    await syncFicheToSupabase(newFiche);

    return NextResponse.json({ success: true, fiche: saved });
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

    db.deleteFiche(id);
    await deleteFicheFromSupabase(id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
