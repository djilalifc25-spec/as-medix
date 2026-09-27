import { supabaseAdmin } from '@/lib/supabase/admin';

export interface AppNotification {
  id: string;
  userId?: string | null;
  title: string;
  message: string;
  type?: string;
  read: boolean;
  linkUrl?: string;
  date: string;
}

const globalForNotifs = globalThis as unknown as {
  asmedixNotificationsMemory?: Map<string, AppNotification[]>;
};

if (!globalForNotifs.asmedixNotificationsMemory) {
  globalForNotifs.asmedixNotificationsMemory = new Map<string, AppNotification[]>();
}

export const notificationsMemory = globalForNotifs.asmedixNotificationsMemory;

export async function addNotification(notif: {
  id: string;
  userId?: string | null;
  title: string;
  message: string;
  type?: string;
  linkUrl?: string;
}): Promise<AppNotification> {
  const newNotif: AppNotification = {
    id: notif.id,
    userId: notif.userId || null,
    title: notif.title,
    message: notif.message,
    type: notif.type || 'reminder',
    read: false,
    linkUrl: notif.linkUrl || '',
    date: new Date().toISOString()
  };

  const key = notif.userId || 'guest';
  const existing = notificationsMemory.get(key) || [];
  notificationsMemory.set(key, [newNotif, ...existing.filter(n => n.id !== notif.id)]);

  // Also push to 'guest' key so session fallbacks see it
  if (key !== 'guest') {
    const guestExisting = notificationsMemory.get('guest') || [];
    notificationsMemory.set('guest', [newNotif, ...guestExisting.filter(n => n.id !== notif.id)]);
  }

  // Persist to Supabase DB if available
  try {
    await supabaseAdmin.from('notifications').insert({
      id: notif.id,
      user_id: notif.userId !== 'guest' ? notif.userId : null,
      title: notif.title,
      message: notif.message,
      type: notif.type || 'reminder',
      read: false,
      link_url: notif.linkUrl || '',
      created_at: newNotif.date
    });
  } catch (_) {}

  return newNotif;
}

export async function getNotifications(userId?: string | null): Promise<{ notifications: AppNotification[]; unreadCount: number }> {
  const targetId = userId || 'guest';
  
  let dbNotifs: AppNotification[] = [];
  try {
    let query = supabaseAdmin
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (userId && userId !== 'guest') {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    } else {
      query = query.is('user_id', null);
    }

    const { data, error } = await query;
    if (!error && data) {
      dbNotifs = data.map(n => ({
        id: n.id,
        userId: n.user_id,
        title: n.title,
        message: n.message,
        type: n.type || 'info',
        read: !!n.read,
        linkUrl: n.link_url,
        date: n.created_at || new Date().toISOString()
      }));
    }
  } catch (_) {}

  const memUser = notificationsMemory.get(targetId) || [];
  const memGuest = notificationsMemory.get('guest') || [];

  const combinedMap = new Map<string, AppNotification>();
  [...dbNotifs, ...memUser, ...memGuest].forEach(n => {
    if (!combinedMap.has(n.id)) {
      combinedMap.set(n.id, n);
    }
  });

  const list = Array.from(combinedMap.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const unreadCount = list.filter(n => !n.read).length;
  return { notifications: list, unreadCount };
}

export async function markNotificationsRead(userId?: string | null, notifId?: string) {
  const targetId = userId || 'guest';
  
  const updateList = (list: AppNotification[]) => {
    return list.map(n => {
      if (!notifId || n.id === notifId) {
        return { ...n, read: true };
      }
      return n;
    });
  };

  if (notificationsMemory.has(targetId)) {
    notificationsMemory.set(targetId, updateList(notificationsMemory.get(targetId) || []));
  }
  if (notificationsMemory.has('guest')) {
    notificationsMemory.set('guest', updateList(notificationsMemory.get('guest') || []));
  }

  try {
    if (notifId) {
      await supabaseAdmin.from('notifications').update({ read: true }).eq('id', notifId);
    } else {
      const query = userId && userId !== 'guest'
        ? supabaseAdmin.from('notifications').update({ read: true }).or(`user_id.eq.${userId},user_id.is.null`)
        : supabaseAdmin.from('notifications').update({ read: true }).is('user_id', null);
      await query;
    }
  } catch (_) {}
}
