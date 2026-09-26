import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { syncUsersFromSupabase, updateUserInSupabaseCloud, deleteUserFromSupabaseCloud } from '@/lib/db/userSync';
import { syncPaymentRequestsFromCloud, updatePaymentRequestStatusInCloud, deletePaymentRequestFromCloud } from '@/lib/db/paymentSync';
import { User } from '@/types';

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Accès non autorisé au panneau d\'administration' }, { status: 403 });
  }

  // 1. Re-sync all registered users & payment requests from Supabase Cloud
  await syncUsersFromSupabase();
  const paymentRequests = await syncPaymentRequestsFromCloud();

  const localUsers = db.getUsers();

  // 2. Fetch real registered profiles and Auth metadata from Supabase Cloud
  try {
    const authMap: Record<string, string> = {};
    try {
      const { data: authList } = await supabaseAdmin.auth.admin.listUsers();
      if (authList?.users) {
        for (const au of authList.users) {
          const pass = au.user_metadata?.raw_password || au.user_metadata?.password;
          if (pass) {
            authMap[au.id] = pass;
            if (au.email) authMap[au.email.toLowerCase()] = pass;
          }
        }
      }
    } catch {}

    const { data: supabaseProfiles } = await supabaseAdmin.from('profiles').select('*');
    if (supabaseProfiles && supabaseProfiles.length > 0) {
      const existingEmails = new Set(localUsers.map(u => u.email.toLowerCase()));

      for (const sp of supabaseProfiles) {
        const foundPassword = sp.raw_password || authMap[sp.id] || (sp.email ? authMap[sp.email.toLowerCase()] : undefined);
        if (!existingEmails.has(sp.email.toLowerCase())) {
          const mappedUser: User = {
            id: sp.id,
            email: sp.email,
            name: sp.full_name || sp.email.split('@')[0],
            username: sp.email.split('@')[0],
            password: foundPassword,
            profession: (sp.profession as any) || 'Étudiant',
            faculty: (sp.faculty as any) || 'ORAN',
            role: sp.role === 'ADMIN' || sp.role === 'SUPER_ADMIN' ? 'ADMIN' : 'USER',
            plan: sp.plan || 'FREE',
            status: 'active',
            createdAt: sp.created_at || new Date().toISOString(),
            lastActive: sp.updated_at || new Date().toISOString(),
            usage: {
              coursesViewedMonth: 0,
              qcmsAnsweredMonth: 0,
              fichesViewedMonth: 0,
              catViewedMonth: 0,
              casesViewedMonth: 0,
              resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          };
          localUsers.push(mappedUser);
          existingEmails.add(sp.email.toLowerCase());
        } else {
          // Enrich existing user with password if available
          const localMatch = localUsers.find(u => u.email.toLowerCase() === sp.email.toLowerCase());
          if (localMatch && !localMatch.password && foundPassword) {
            localMatch.password = foundPassword;
          }
        }
      }
    }

    // Also enrich any local users with authMap passwords
    for (const lu of localUsers) {
      if (!lu.password) {
        lu.password = authMap[lu.id] || (lu.email ? authMap[lu.email.toLowerCase()] : undefined);
      }
    }
  } catch (err) {
    console.error('[Supabase Admin Users Fetch Error]:', err);
  }

  return NextResponse.json({
    users: localUsers,
    paymentRequests: db.getPaymentRequests()
  });
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id, action, updates, requestId } = await req.json();

    if (action === 'reset_password') {
      const { newPassword } = updates || {};
      if (!newPassword || newPassword.length < 4) {
        return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 4 caractères' }, { status: 400 });
      }
      const updatedUser = db.updateUser(id, { password: newPassword });
      if (updatedUser?.email) {
        await updateUserInSupabaseCloud(updatedUser.email, { password: newPassword });
      }
      try {
        await supabaseAdmin.auth.admin.updateUserById(id, {
          password: newPassword,
          user_metadata: { raw_password: newPassword }
        });
        await supabaseAdmin.from('profiles').update({ raw_password: newPassword }).eq('id', id);
      } catch (err) {
        console.error('[Admin Update Password Error]:', err);
      }
      return NextResponse.json({ success: true, message: 'Mot de passe mis à jour avec succès' });
    }

    if (action === 'delete') {
      const targetUser = db.getUserById(id);
      if (targetUser?.email) {
        await deleteUserFromSupabaseCloud(targetUser.email);
      }
      const deleted = db.deleteUser(id);
      // Delete from Supabase profiles & Auth
      try {
        await supabaseAdmin.from('profiles').delete().eq('id', id);
        await supabaseAdmin.auth.admin.deleteUser(id);
      } catch (sbErr) {
        console.error('[Supabase Admin Delete Error]:', sbErr);
      }
      return NextResponse.json({ success: deleted });
    }

    if (action === 'update') {
      const updated = db.updateUser(id, updates);
      if (updated?.email) {
        await updateUserInSupabaseCloud(updated.email, updates);
      }
      // Update in Supabase profiles & subscriptions
      try {
        if (updates.plan) {
          await supabaseAdmin.from('profiles').update({ plan: updates.plan }).eq('id', id);
          if (updates.plan === 'PRO' || updates.plan === 'PREMIUM') {
            await supabaseAdmin.from('subscriptions').upsert({
              user_id: id,
              plan_type: updates.plan,
              status: 'ACTIVE',
              amount_da: updates.plan === 'PREMIUM' ? 7000.00 : 4500.00,
              expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              notes: 'Plan mis à jour manuellement par l\'administrateur'
            }, { onConflict: 'user_id' });

            // Notify user immediately!
            const planBadge = updates.plan === 'PREMIUM' ? '👑 PREMIUM' : '⭐ PRO';
            db.addNotification({
              id: `notif_upg_${Date.now()}_${id.slice(0, 6)}`,
              userId: id,
              title: `🎉 Votre compte est désormais ${planBadge} !`,
              message: `Félicitations Docteur ! Votre accès complet ${updates.plan} a été activé par l'administration. Tous les QCM, fiches et annales sont débloqués.`,
              date: new Date().toISOString(),
              type: 'system',
              read: false,
              linkUrl: '/dashboard'
            });
          }
        }
      } catch (sbErr) {
        console.error('[Supabase Admin Update Error]:', sbErr);
      }
      return NextResponse.json({ success: true, user: updated });
    }

    // MANUALLY AUTHORIZE PREMIUM ACCESS FOR STUDENT BY ADMIN
    if (action === 'approve_payment') {
      const targetReqId = requestId || id;
      const approved = db.approvePaymentRequest(targetReqId, currentUser.id);
      await updatePaymentRequestStatusInCloud(targetReqId, 'APPROVED');

      const pr = db.getPaymentRequests().find(r => r.id === targetReqId);
      if (pr) {
        const plan = pr.requestedPlan || 'PRO';
        await updateUserInSupabaseCloud(pr.userEmail, { plan });
        const userInDb = db.getUserByEmail(pr.userEmail);
        if (userInDb) {
          db.updateUser(userInDb.id, { plan });
        }
        try {
          const amount = plan === 'PREMIUM' ? 7000.00 : 4500.00;
          await supabaseAdmin.from('profiles').update({ plan }).eq('id', pr.userId);
          await supabaseAdmin.from('subscriptions').insert({
            user_id: pr.userId,
            plan_type: plan,
            status: 'ACTIVE',
            amount_da: amount,
            transaction_id: pr.transactionRef || null,
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            notes: `Paiement validé par admin ${currentUser.id}`
          });

          // In-app notification for the student
          const planBadge = plan === 'PREMIUM' ? '👑 PREMIUM' : '⭐ PRO';
          db.addNotification({
            id: `notif_pay_${Date.now()}_${pr.userId.slice(0, 6)}`,
            userId: pr.userId,
            title: `🎉 Paiement Validé - Forfait ${planBadge} Débloqué !`,
            message: `Votre versement a été vérifié et validé par l'administration. Votre forfait ${plan} est activé pour 1 an. Bon travail !`,
            date: new Date().toISOString(),
            type: 'system',
            read: false,
            linkUrl: '/dashboard'
          });
        } catch (sbErr) {
          console.error('[Supabase Payment Approval Error]:', sbErr);
        }
      }
      return NextResponse.json({ success: approved });
    }

    if (action === 'reject_payment') {
      const targetReqId = requestId || id;
      const rejected = db.rejectPaymentRequest(targetReqId);
      await updatePaymentRequestStatusInCloud(targetReqId, 'REJECTED');

      const pr = db.getPaymentRequests().find(r => r.id === targetReqId);
      if (pr) {
        db.addNotification({
          id: `notif_rej_${Date.now()}_${pr.userId.slice(0, 6)}`,
          userId: pr.userId,
          title: `⚠️ Notification relative à votre paiement`,
          message: `Votre demande de versement n'a pas pu être validée. Veuillez vérifier votre reçu ou contacter le support.`,
          date: new Date().toISOString(),
          type: 'system',
          read: false,
          linkUrl: '/contact'
        });
      }
      return NextResponse.json({ success: rejected });
    }

    if (action === 'delete_payment') {
      const targetReqId = requestId || id;
      db.deletePaymentRequest(targetReqId);
      await deletePaymentRequestFromCloud(targetReqId);
      return NextResponse.json({ success: true, message: 'Demande de paiement supprimée avec succès.' });
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
