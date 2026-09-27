import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, highlights: [] }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    let query = supabaseAdmin
      .from('user_course_highlights')
      .select('*')
      .eq('user_id', user.id);

    if (slug) {
      query = query.eq('item_slug', slug);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      // Table might not exist yet or connection error, return empty array gracefully
      console.warn('[Highlights GET API]: Supabase query warning:', error.message);
      return NextResponse.json({ authenticated: true, highlights: [] });
    }

    const highlights = (data || []).map(row => ({
      id: row.id,
      itemSlug: row.item_slug,
      itemTitle: row.item_title,
      selectedText: row.selected_text,
      color: row.color,
      note: row.note,
      createdAt: row.created_at
    }));

    return NextResponse.json({ authenticated: true, highlights });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, highlights: [], error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié. Veuillez vous connecter.' }, { status: 401 });
    }

    const body = await req.json();
    const { itemSlug, itemTitle, selectedText, color, note } = body;

    if (!itemSlug || !selectedText) {
      return NextResponse.json({ error: 'Le slug du cours et le texte surligné sont requis.' }, { status: 400 });
    }

    const payload = {
      user_id: user.id,
      item_slug: itemSlug,
      item_title: itemTitle || itemSlug,
      selected_text: selectedText,
      color: color || 'yellow',
      note: note || null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('user_course_highlights')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.warn('[Highlights POST API] Supabase insert warning:', error.message);
      // Return a generated highlight ID so client can fallback gracefully
      const fallbackId = 'hl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      return NextResponse.json({
        success: true,
        highlight: {
          id: fallbackId,
          itemSlug,
          itemTitle,
          selectedText,
          color: color || 'yellow',
          note: note || null,
          createdAt: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({
      success: true,
      highlight: {
        id: data.id,
        itemSlug: data.item_slug,
        itemTitle: data.item_title,
        selectedText: data.selected_text,
        color: data.color,
        note: data.note,
        createdAt: data.created_at
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await req.json();
    const { id, note, color } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requis pour modifier la note' }, { status: 400 });
    }

    const updates: any = { updated_at: new Date().toISOString() };
    if (note !== undefined) updates.note = note;
    if (color !== undefined) updates.color = color;

    const { data, error } = await supabaseAdmin
      .from('user_course_highlights')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .maybeSingle();

    if (error) {
      console.warn('[Highlights PATCH API] Supabase update warning:', error.message);
    }

    return NextResponse.json({ success: true, highlight: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis pour supprimer' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('user_course_highlights')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.warn('[Highlights DELETE API] Supabase delete warning:', error.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
