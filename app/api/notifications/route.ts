import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getNotifications, markNotificationsRead } from '@/lib/notificationsStore';

export const dynamic = 'force-dynamic';

// GET /api/notifications — returns notifications for current user
export async function GET() {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || 'guest';
    const { notifications, unreadCount } = await getNotifications(userId);
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

    if (body.action === 'read_all' || body.action === 'markAllRead') {
      await markNotificationsRead(userId);
      return NextResponse.json({ success: true });
    }

    if (body.id) {
      await markNotificationsRead(userId, body.id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Parametre id ou action requis' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

