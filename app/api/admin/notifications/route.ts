import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Acces non autorise' }, { status: 403 });
    }
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;

    const notifications = (data || []).map((n: any) => ({
      id: n.id, title: n.title, message: n.message,
      date: n.created_at, type: n.type, read: n.read,
      linkUrl: n.link_url, userId: n.user_id,
    }));
    return NextResponse.json({ success: true, notifications, total: notifications.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Acces non autorise' }, { status: 403 });
    }
    const body = await req.json();
    if (!body.title || !body.message) {
      return NextResponse.json({ success: false, error: 'Titre et message obligatoires' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const { data, error } = await supabase.from('notifications').insert({
      id,
      user_id: body.userId || null,  // null = broadcast to all
      title: body.title,
      message: body.message,
      type: body.type || 'system',
      read: false,
      link_url: body.linkUrl || '/dashboard',
    }).select().single();
    if (error) throw error;

    return NextResponse.json({ success: true, notification: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Acces non autorise' }, { status: 403 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
