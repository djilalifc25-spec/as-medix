import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const userIdFilter = searchParams.get('userId');
    const supabase = getSupabaseServerClient();

    let query = supabase.from('user_messages').select('*').order('created_at', { ascending: false });

    if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
      // Admin sees all, optionally filtered
      if (userIdFilter) query = query.eq('user_id', userIdFilter);
    } else if (user?.id) {
      query = query.eq('user_id', user.id);
    } else {
      return NextResponse.json({ success: true, messages: [] });
    }

    const { data, error } = await query;
    if (error) throw error;

    const messages = (data || []).map((m: any) => ({
      id: m.id, userId: m.user_id, userName: m.user_name, userEmail: m.user_email,
      userPhone: m.user_phone, profession: m.profession, subject: m.subject,
      category: m.category, message: m.message, status: m.status,
      replyNote: m.reply_note, resolvedAt: m.resolved_at, createdAt: m.created_at,
    }));

    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userName, userEmail, userPhone, profession, subject, category, message, userId } = body;

    if (!userName || !userEmail || !subject || !category || !message) {
      return NextResponse.json({ error: 'Tous les champs obligatoires sont requis.' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const { data, error } = await supabase.from('user_messages').insert({
      id,
      user_id: userId && userId !== 'usr_guest' ? userId : null,
      user_name: userName.trim(),
      user_email: userEmail.trim().toLowerCase(),
      user_phone: userPhone?.trim() || null,
      profession: profession || 'Etudiant',
      subject: subject.trim(),
      category: category || 'Autre',
      message: message.trim(),
      status: 'UNREAD',
    }).select().single();

    if (error) throw error;

    // Create admin notification
    await supabase.from('notifications').insert({
      id: `notif_admin_msg_${Date.now()}`,
      user_id: null,
      title: `Nouveau message de ${userName.trim()}`,
      message: `${category}: ${subject.trim()}`,
      type: 'system',
      read: false,
      link_url: '/admin/messages',
    });

    return NextResponse.json({ success: true, message: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur lors de l envoi' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, replyNote } = body;
    if (!id || !status) return NextResponse.json({ error: 'ID et statut requis' }, { status: 400 });

    const supabase = getSupabaseServerClient();
    const updates: Record<string, any> = { status };
    if (replyNote !== undefined) updates.reply_note = replyNote;
    if (status === 'RESOLVED') updates.resolved_at = new Date().toISOString();

    const { error } = await supabase.from('user_messages').update(updates).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('user_messages').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
