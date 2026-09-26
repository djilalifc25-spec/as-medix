import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Veuillez saisir votre adresse email' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Look up user in local DB or Supabase
    let user = db.getUsers().find(u => u.email.toLowerCase().trim() === cleanEmail);
    let supabaseUserId: string | null = user?.id || null;

    if (!user) {
      try {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id, email, full_name')
          .ilike('email', cleanEmail)
          .maybeSingle();

        if (profile) {
          supabaseUserId = profile.id;
          user = {
            id: profile.id,
            email: profile.email,
            name: profile.full_name || 'Dr. Étudiant',
            username: profile.email.split('@')[0],
            profession: 'Étudiant',
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
          db.createUser(user);
        }
      } catch (err) {
        console.error('[Supabase Forgot Password Profile Lookup]:', err);
      }
    }

    if (!user) {
      return NextResponse.json({
        error: 'Aucun compte associé à cette adresse email. Veuillez vérifier votre saisie ou créer un compte.'
      }, { status: 404 });
    }

    // 2. Generate local reset token & 6-digit OTP code
    const { token: resetToken, code: resetCode } = db.createPasswordResetToken(cleanEmail, user.id);

    // 3. Determine site origin
    const host = req.headers.get('host') || 'localhost:3000';
    const proto = req.headers.get('x-forwarded-proto') || (req.url.startsWith('https') ? 'https' : 'http');
    const origin = `${proto}://${host}`;
    const directResetUrl = `${origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(cleanEmail)}`;

    // 4. Save into Supabase password_resets table
    try {
      await supabaseAdmin.from('password_resets').insert({
        email: cleanEmail,
        code: resetCode,
        token: resetToken,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        used: false
      });
    } catch (e: any) {
      // Table may not exist yet, local memory token is already preserved
    }

    // 5. Send recovery email via Supabase Auth
    let supabaseActionLink: string | null = null;
    let emailStatus = 'sent';
    try {
      const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: cleanEmail,
        options: {
          redirectTo: `${origin}/reset-password`
        }
      });
      if (linkData?.properties?.action_link) {
        supabaseActionLink = linkData.properties.action_link;
      }
      if (linkErr) {
        console.warn('[Supabase GenerateLink Warning]:', linkErr.message);
      }

      const { error: resetErr } = await supabaseAdmin.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: directResetUrl
      });
      if (resetErr) {
        console.warn('[Supabase ResetPassword Error]:', resetErr.message);
        emailStatus = `Supabase Mailer: ${resetErr.message}`;
      }
    } catch (sbErr: any) {
      console.warn('[Supabase Auth Recovery Exception]:', sbErr.message);
      emailStatus = `Exception: ${sbErr.message}`;
    }

    return NextResponse.json({
      success: true,
      message: 'Un code de confirmation secret a été généré pour votre compte.',
      code: resetCode, // Always provided as fallback/instant recovery
      resetUrl: directResetUrl,
      supabaseLink: supabaseActionLink,
      emailStatus,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur serveur' }, { status: 500 });
  }
}
