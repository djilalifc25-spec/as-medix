import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const globalForNotifs = globalThis as unknown as {
  asmedixNotificationsMemory?: Map<string, any[]>;
};

const userNotifsMap = globalForNotifs.asmedixNotificationsMemory ?? new Map<string, any[]>();
if (process.env.NODE_ENV !== 'production') {
  globalForNotifs.asmedixNotificationsMemory = userNotifsMap;
}

// GET /api/notifications — returns notifications for current user
export async function GET() {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || 'guest';
    const supabase = getSupabaseServerClient();

    let dbNotifications: any[] = [];
    try {
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
      if (!error && data) {
        dbNotifications = data;
      }
    } catch (_) {}

    const memoryNotifs = userNotifsMap.get(userId) || userNotifsMap.get('guest') || [];

    const map = new Map<string, any>();
    [...dbNotifications, ...memoryNotifs].forEach(n => {
      if (!map.has(n.id)) {
        map.set(n.id, n);
      }
    });

    const combined = Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at || b.date || Date.now()).getTime() - new Date(a.created_at || a.date || Date.now()).getTime()
    );

    const notifications = combined.map((n: any) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      date: n.created_at || n.date || new Date().toISOString(),
      type: n.type || 'info',
      read: !!n.read,
      linkUrl: n.link_url || n.linkUrl,
      userId: n.user_id || n.userId,
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
    const userId = user?.id || 'guest';
    const body = await req.json();
    const supabase = getSupabaseServerClient();

    if (body.action === 'read_all' || body.action === 'markAllRead') {
      const memoryNotifs = userNotifsMap.get(userId) || [];
      memoryNotifs.forEach(n => { n.read = true; });
      userNotifsMap.set(userId, memoryNotifs);

      try {
        const filter = user?.id
          ? supabase.from('notifications').update({ read: true }).or(`user_id.eq.${user.id},user_id.is.null`)
          : supabase.from('notifications').update({ read: true }).is('user_id', null);
        await filter;
      } catch (_) {}

      return NextResponse.json({ success: true });
    }

    if (body.id) {
      const memoryNotifs = userNotifsMap.get(userId) || [];
      const found = memoryNotifs.find(n => n.id === body.id);
      if (found) found.read = true;

      try {
        await supabase.from('notifications').update({ read: true }).eq('id', body.id);
      } catch (_) {}

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Parametre id ou action requis' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

