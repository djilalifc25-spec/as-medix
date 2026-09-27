import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { StudyReminder, ReminderStats, ReminderTag } from '@/types';
import { addNotification } from '@/lib/notificationsStore';

// In-memory fallback map for reminders when DB is syncing
const globalForReminders = globalThis as unknown as {
  asmedixRemindersMemory?: Map<string, StudyReminder[]>;
};

const userRemindersMap = globalForReminders.asmedixRemindersMemory ?? new Map<string, StudyReminder[]>();
if (process.env.NODE_ENV !== 'production') {
  globalForReminders.asmedixRemindersMemory = userRemindersMap;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const userId = user ? user.id : 'guest';

    // Try Supabase first if available
    let reminders: StudyReminder[] = [];
    try {
      const { data, error } = await supabaseAdmin
        .from('user_reminders')
        .select('*')
        .eq('user_id', userId)
        .order('scheduled_for', { ascending: true });

      if (!error && data) {
        reminders = data.map(r => ({
          id: r.id,
          userId: r.user_id || userId,
          targetType: r.target_type,
          targetId: r.target_id,
          targetTitle: r.target_title,
          specialtyId: r.specialty_id,
          specialtyName: r.specialty_name,
          tag: r.tag,
          tagLabel: r.tag_label || '⚠️ Piège d\'examen',
          userNote: r.user_note,
          scheduledFor: r.scheduled_for,
          intervalDays: r.interval_days,
          status: r.status || 'pending',
          createdAt: r.created_at
        }));
      }
    } catch (_) {}

    // Fallback to memory store if Supabase returned nothing or table absent
    if (reminders.length === 0 && userRemindersMap.has(userId)) {
      reminders = userRemindersMap.get(userId) || [];
    }

    const activeReminders = reminders.filter(r => r.status === 'pending');
    const now = new Date().toISOString();
    const dueTodayCount = activeReminders.filter(r => r.scheduledFor <= now).length;
    const piegesCount = activeReminders.filter(r => r.tag === 'piege').length;
    const qcmsCount = activeReminders.filter(r => r.targetType === 'qcm').length;
    const coursCount = activeReminders.filter(r => r.targetType === 'cours').length;

    const byTag: Record<ReminderTag, number> = {
      piege: activeReminders.filter(r => r.tag === 'piege').length,
      a_revoir: activeReminders.filter(r => r.tag === 'a_revoir').length,
      difficile: activeReminders.filter(r => r.tag === 'difficile').length,
      priorite_concours: activeReminders.filter(r => r.tag === 'priorite_concours').length,
    };

    const stats: ReminderStats = {
      totalActive: activeReminders.length,
      dueTodayCount,
      piegesCount,
      qcmsCount,
      coursCount,
      retentionRate: 95,
      byTag
    };

    return NextResponse.json({
      success: true,
      stats,
      reminders: activeReminders
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const userId = user ? user.id : 'guest';
    const body = await req.json();

    const {
      targetType,
      targetId,
      targetTitle,
      specialtyId,
      specialtyName,
      tag,
      tagLabel,
      userNote,
      scheduledFor,
      intervalDays
    } = body;

    const reminderId = 'rem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newReminder: StudyReminder = {
      id: reminderId,
      userId,
      targetType: targetType || 'cours',
      targetId: targetId || 'cours-main',
      targetTitle: targetTitle || 'Cours Médical',
      specialtyId: specialtyId || 'general',
      specialtyName: specialtyName || 'Médecine',
      tag: tag || 'piege',
      tagLabel: tagLabel || '⚠️ Piège d\'examen',
      userNote: userNote || '',
      scheduledFor: scheduledFor || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      intervalDays: intervalDays || 1,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save to memory cache
    const current = userRemindersMap.get(userId) || [];
    const updated = [newReminder, ...current.filter(r => r.id !== reminderId)];
    userRemindersMap.set(userId, updated);

    // Persist to Supabase if table available
    try {
      await supabaseAdmin.from('user_reminders').insert({
        id: reminderId,
        user_id: userId,
        target_type: newReminder.targetType,
        target_id: newReminder.targetId,
        target_title: newReminder.targetTitle,
        specialty_id: newReminder.specialtyId,
        specialty_name: newReminder.specialtyName,
        tag: newReminder.tag,
        tag_label: newReminder.tagLabel,
        user_note: newReminder.userNote,
        scheduled_for: newReminder.scheduledFor,
        interval_days: newReminder.intervalDays,
        status: 'pending'
      });
    } catch (_) {}

    // Create notification entry for top nav bell icon
    await addNotification({
      id: 'notif_' + reminderId,
      userId,
      title: `⏰ ${newReminder.tagLabel || 'Rappel programmé'}`,
      message: `Rappel pour « ${newReminder.targetTitle} »${newReminder.userNote ? ` : ${newReminder.userNote}` : ''}`,
      type: 'reminder',
      linkUrl: newReminder.targetType === 'cours' ? `/cours/${newReminder.targetId}` : `/qcm/${newReminder.targetId}`
    });

    return NextResponse.json({
      success: true,
      reminder: newReminder
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const userId = user ? user.id : 'guest';
    const body = await req.json();
    const { id, action, postponeHours } = body;

    const current = userRemindersMap.get(userId) || [];
    const updated = current.map(r => {
      if (r.id === id) {
        if (action === 'complete') {
          return { ...r, status: 'completed' as const, completedAt: new Date().toISOString() };
        }
        if (action === 'postpone') {
          const postponeMs = (postponeHours || 24) * 3600 * 1000;
          return { ...r, scheduledFor: new Date(Date.now() + postponeMs).toISOString() };
        }
      }
      return r;
    });

    userRemindersMap.set(userId, updated);

    try {
      if (action === 'complete') {
        await supabaseAdmin.from('user_reminders').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', id);
      } else if (action === 'postpone') {
        const postponeMs = (postponeHours || 24) * 3600 * 1000;
        await supabaseAdmin.from('user_reminders').update({ scheduled_for: new Date(Date.now() + postponeMs).toISOString() }).eq('id', id);
      }
    } catch (_) {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
