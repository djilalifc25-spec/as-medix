import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/notifications — returns notifications for current user
export async function GET() {
  try {
    const user = await getCurrentUser();
    const supabase = getSupabaseServerClient();

    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (user?.id) {
      query = query.or(`user_id.eq.${user.id},user_id.is.null`);
    } else {
      query = query.is('user_id', null);
    }

    const { data, error } = await query;
    if (error) throw error;

    const notifications = (data || []).map((n: any) => ({
      id: n.id, title: n.title, message: n.message,
      date: n.created_at, type: n.type, read: n.read,
      linkUrl: n.link_url, userId: n.user_id,
    }));

    const unreadCount = notifications.filter((n: any) => !n.read).length;
    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (err: any) {
    return NextResponse.json({ success: true, notifications: [], unreadCount: 0 });
  }
}

// POST /api/notifications — mark as read or mark all read
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const supabase = getSupabaseServerClient();

    if (body.action === 'read_all' || body.action === 'markAllRead') {
      const filter = user?.id
        ? supabase.from('notifications').update({ read: true }).or(`user_id.eq.${user.id},user_id.is.null`)
        : supabase.from('notifications').update({ read: true }).is('user_id', null);
      const { error } = await filter;
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (body.id) {
      const { error } = await supabase.from('notifications').update({ read: true }).eq('id', body.id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Parametre id ou action requis' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
