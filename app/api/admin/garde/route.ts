import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('garde_protocols')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const protocols = (data || []).map((p: any) => ({
      id: p.id, slug: p.slug, title: p.title, category: p.category,
      iconName: p.icon_name, badge: p.badge, description: p.description,
      htmlContent: p.html_content, published: p.published, createdAt: p.created_at, updatedAt: p.updated_at,
    }));
    return NextResponse.json({ success: true, protocols });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Acces administrateur requis' }, { status: 403 });
    }
    const body = await req.json();
    const { title, category, badge, description, htmlContent, iconName } = body;
    if (!title || !category || !htmlContent) {
      return NextResponse.json({ error: 'Titre, categorie et code HTML sont obligatoires.' }, { status: 400 });
    }

    const slug = `${title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Math.floor(Math.random() * 1000)}`;
    const id = `garde_${Date.now()}`;
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from('garde_protocols').insert({
      id, slug,
      title: title.trim(),
      category: category || 'Urgences Vitales',
      icon_name: iconName || 'Siren',
      badge: badge || 'H24',
      description: description || '',
      html_content: htmlContent,
      published: true,
    }).select().single();
    if (error) throw error;

    return NextResponse.json({ success: true, protocol: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Acces administrateur requis' }, { status: 403 });
    }
    const body = await req.json();
    const { id, title, category, badge, description, htmlContent, iconName } = body;
    if (!id || !title || !htmlContent) {
      return NextResponse.json({ error: 'ID, titre et code HTML sont obligatoires.' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from('garde_protocols').update({
      title, category, badge, description,
      html_content: htmlContent,
      icon_name: iconName || 'Siren',
      updated_at: new Date().toISOString(),
    }).eq('id', id).select().single();
    if (error) throw error;

    return NextResponse.json({ success: true, protocol: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Acces administrateur requis' }, { status: 403 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID du protocole requis' }, { status: 400 });

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('garde_protocols').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
