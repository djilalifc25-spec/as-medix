import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { email, token, code, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({ error: 'Le nouveau mot de passe doit comporter au moins 4 caractères.' }, { status: 400 });
    }

    if (!email && !token && !code) {
      return NextResponse.json({ error: 'Identifiant ou code de réinitialisation manquant.' }, { status: 400 });
    }

    let targetEmail = (email || '').toLowerCase().trim();
    let targetUserId: string | null = null;
    let verified = false;

    // 1. Verify 6-digit OTP code if provided
    if (code && targetEmail) {
      const codeRes = db.verifyResetCode(targetEmail, code);
      if (codeRes.valid) {
        verified = true;
        targetUserId = codeRes.userId || null;
        db.consumePasswordReset(targetEmail);
      } else {
        // Fallback: check Supabase password_resets table
        try {
          const { data: prData } = await supabaseAdmin
            .from('password_resets')
            .select('*')
            .ilike('email', targetEmail)
            .eq('code', code.replace(/\s+/g, ''))
            .eq('used', false)
            .gte('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (prData) {
            verified = true;
            await supabaseAdmin.from('password_resets').update({ used: true }).eq('id', prData.id);
          }
        } catch {}
      }

      if (!verified && !token) {
        return NextResponse.json({ error: 'Code de confirmation à 6 chiffres incorrect ou expiré. Veuillez vérifier votre boîte mail.' }, { status: 400 });
      }
    }

    // 2. Verify token if provided
    if (token && !verified) {
      const verifyRes = db.verifyPasswordResetToken(token);
      if (verifyRes.valid) {
        verified = true;
        targetEmail = verifyRes.email || targetEmail;
        targetUserId = verifyRes.userId || null;
        db.consumePasswordReset(token);
      }
    }

    if (!verified) {
      return NextResponse.json({ error: 'Le lien ou code de réinitialisation est invalide ou a expiré.' }, { status: 400 });
    }

    // 3. Find local user
    let user = db.getUsers().find(u => u.email.toLowerCase().trim() === targetEmail);
    if (user) {
      targetUserId = targetUserId || user.id;
      db.updateUser(user.id, { password: newPassword });
    }

    // 3. Update in Supabase Auth & profiles
    try {
      if (!targetUserId) {
        const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
        const found = usersList?.users?.find(u => u.email?.toLowerCase() === targetEmail);
        if (found) targetUserId = found.id;
      }

      if (targetUserId) {
        await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
          password: newPassword,
          user_metadata: { raw_password: newPassword }
        });

        await supabaseAdmin.from('profiles').update({
          raw_password: newPassword,
          updated_at: new Date().toISOString()
        }).eq('id', targetUserId);
      }
    } catch (sbErr: any) {
      console.warn('[Supabase Reset Password Error]:', sbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Votre mot de passe a été mis à jour avec succès ! Vous pouvez maintenant vous connecter.'
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur lors de la réinitialisation' }, { status: 500 });
  }
}
