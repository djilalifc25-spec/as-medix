import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { syncPaymentRequestsFromCloud, savePaymentRequestToCloud, updatePaymentRequestStatusInCloud, deletePaymentRequestFromCloud } from '@/lib/db/paymentSync';

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Sync payment requests from Supabase Cloud
    const requests = await syncPaymentRequestsFromCloud();
    return NextResponse.json({ success: true, requests });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let currentUser = await getCurrentUser();
    const { paymentMethod, transactionRef, requestedPlan, notes, receiptUrl, userPhone, userId, userEmail, userName } = await req.json();

    if (!currentUser && (userId || userEmail)) {
      currentUser = db.getUsers().find(
        u => (userId && u.id === userId) || 
             (userEmail && u.email.toLowerCase() === userEmail.toLowerCase())
      ) || null;
      if (!currentUser && (userId || userEmail)) {
        currentUser = {
          id: userId || `usr_${Date.now()}`,
          name: userName || 'Dr. Candidat',
          email: userEmail || 'etudiant@medix.dz',
          username: userEmail?.split('@')[0] || 'etudiant',
          profession: 'Étudiant',
          faculty: 'ORAN',
          role: 'USER',
          plan: 'FREE',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          usage: {
            coursesViewedMonth: 0,
            qcmsAnsweredMonth: 0,
            fichesViewedMonth: 0,
            catViewedMonth: 0,
            casesViewedMonth: 0,
            resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        };
      }
    }

    if (!currentUser) {
      return NextResponse.json({ error: 'Veuillez vous connecter pour soumettre un paiement.' }, { status: 401 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: 'La méthode de paiement est obligatoire.' }, { status: 400 });
    }

    const effectiveRef = transactionRef?.trim() || `VER-${Date.now().toString().slice(-6)}`;

    const chosenPlan = requestedPlan === 'PREMIUM' ? 'PREMIUM' : 'PRO';
    const amount = chosenPlan === 'PREMIUM' ? 7000.00 : 4500.00;

    // 1. Save to local DB store
    const newRequest = db.addPaymentRequest({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      requestedPlan: chosenPlan,
      paymentMethod: paymentMethod,
      transactionRef: effectiveRef,
      receiptImageUrl: receiptUrl || undefined,
      notes: notes || ''
    });

    // 2. GUARANTEED PERSISTENCE IN SUPABASE CLOUD (password_resets table backup)
    await savePaymentRequestToCloud(newRequest);

    // 3. Best-effort save into Supabase payment_requests table
    try {
      await supabaseAdmin.from('payment_requests').insert({
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_email: currentUser.email,
        user_phone: userPhone || null,
        plan_type: chosenPlan,
        amount_da: amount,
        payment_method: paymentMethod.toUpperCase(),
        transaction_id: effectiveRef,
        receipt_url: receiptUrl || null,
        status: 'PENDING',
        admin_notes: notes || null
      });
    } catch (sbErr) {
      console.error('[Supabase payment_requests Insert Error]:', sbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Demande enregistrée ! Votre accès sera activé dès validation du versement.',
      paymentRequest: newRequest
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { requestId, action } = await req.json();
    if (!requestId || !action) {
      return NextResponse.json({ error: 'ID de demande et action requis' }, { status: 400 });
    }

    if (action === 'approve') {
      const ok = db.approvePaymentRequest(requestId, currentUser.id);
      if (!ok) return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 });

      await updatePaymentRequestStatusInCloud(requestId, 'APPROVED');

      const pr = db.getPaymentRequests().find(r => r.id === requestId);
      if (pr) {
        const plan = pr.requestedPlan || 'PRO';
        const amount = plan === 'PREMIUM' ? 7000.00 : 4500.00;

        // Upgrade in Supabase Profiles & Subscriptions in real time!
        try {
          await supabaseAdmin.from('profiles').update({ plan }).eq('id', pr.userId);
          await supabaseAdmin.from('subscriptions').insert({
            user_id: pr.userId,
            plan_type: plan,
            status: 'ACTIVE',
            payment_method: pr.paymentMethod?.toUpperCase() || 'BARIDIMOB',
            transaction_id: pr.transactionRef || null,
            amount_da: amount,
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            notes: `Validé par admin ${currentUser.name}`
          });
          await supabaseAdmin.from('payment_requests').update({ status: 'APPROVED' }).eq('transaction_id', pr.transactionRef);
        } catch (sbErr) {
          console.error('[Supabase Payment Approval Error]:', sbErr);
        }

        // Send in-app notification to the user
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
      }

      return NextResponse.json({ success: true, message: 'Versement approuvé et abonnement débloqué !' });
    } else if (action === 'reject') {
      const ok = db.rejectPaymentRequest(requestId);
      if (!ok) return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 });

      await updatePaymentRequestStatusInCloud(requestId, 'REJECTED');

      const pr = db.getPaymentRequests().find(r => r.id === requestId);
      if (pr) {
        try {
          await supabaseAdmin.from('payment_requests').update({ status: 'REJECTED' }).eq('transaction_id', pr.transactionRef);
        } catch (_) {}

        db.addNotification({
          id: `notif_rej_${Date.now()}_${pr.userId.slice(0, 6)}`,
          userId: pr.userId,
          title: `⚠️ Notification relative à votre paiement`,
          message: `Votre demande de versement n'a pas pu être validée. Veuillez vérifier votre reçu ou contacter le support via WhatsApp / Instagram.`,
          date: new Date().toISOString(),
          type: 'system',
          read: false,
          linkUrl: '/contact'
        });
      }

      return NextResponse.json({ success: true, message: 'Demande rejetée.' });
    } else if (action === 'delete') {
      const pr = db.getPaymentRequests().find(r => r.id === requestId);
      db.deletePaymentRequest(requestId);
      await deletePaymentRequestFromCloud(requestId);
      if (pr?.transactionRef) {
        try {
          await supabaseAdmin.from('payment_requests').delete().eq('transaction_id', pr.transactionRef);
        } catch (_) {}
      }
      return NextResponse.json({ success: true, message: 'Demande supprimée avec succès.' });
    }

    return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
