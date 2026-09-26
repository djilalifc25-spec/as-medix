import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { createSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { User, MedicalProfession } from '@/types';

export async function POST(req: Request) {
  try {
    const { nom, prenom, email, username, password, profession, faculty, targetPlan } = await req.json();

    if (!email || !password || !nom || !prenom || !username) {
      return NextResponse.json({ error: 'Tous les champs obligatoires doivent être remplis' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.toLowerCase().trim();
    const chosenPlan = (targetPlan === 'PRO' || targetPlan === 'PREMIUM') ? targetPlan : 'FREE';

    // Map profession to valid profiles table role: 'STUDENT', 'DOCTOR', 'RESIDENT', 'ADMIN'
    let profileRole: 'STUDENT' | 'DOCTOR' | 'RESIDENT' | 'ADMIN' = 'STUDENT';
    if (profession === 'Médecin') profileRole = 'DOCTOR';
    else if (profession === 'Résident') profileRole = 'RESIDENT';

    // 1. Strict single-account-per-email rule
    const existingInLocal = db.getUsers().find(u => u.email.toLowerCase().trim() === cleanEmail);
    if (existingInLocal) {
      return NextResponse.json({
        error: 'Cette adresse email est déjà inscrite sur AS-MEDIX. Un seul compte est autorisé par adresse email. Veuillez vous connecter ou réinitialiser votre mot de passe.'
      }, { status: 400 });
    }

    const existingUsername = db.getUsers().find(u => u.username && u.username.toLowerCase().trim() === cleanUsername);
    if (existingUsername) {
      return NextResponse.json({
        error: 'Ce nom d\'utilisateur est déjà pris. Veuillez en choisir un autre.'
      }, { status: 400 });
    }

    // Check existing email in Supabase profiles
    try {
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id, email')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (existingProfile) {
        return NextResponse.json({
          error: 'Cette adresse email est déjà inscrite sur AS-MEDIX. Veuillez vous connecter ou réinitialiser votre mot de passe.'
        }, { status: 400 });
      }
    } catch {}

    // 2. Create user in Supabase Auth
    let supabaseUserId: string | null = null;
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: `Dr. ${prenom} ${nom}`,
          profession: profession || 'Étudiant',
          faculty: faculty || 'ORAN',
          username: cleanUsername,
          raw_password: password
        }
      });

      if (authError) {
        if (authError.message.toLowerCase().includes('already registered') || authError.message.toLowerCase().includes('already exists')) {
          return NextResponse.json({
            error: 'Cette adresse email est déjà inscrite sur AS-MEDIX. Veuillez vous connecter ou cliquer sur « Mot de passe oublié ».'
          }, { status: 400 });
        } else {
          console.error('[Supabase Auth Register Error]:', authError.message);
        }
      } else if (authData?.user) {
        supabaseUserId = authData.user.id;
      }
    } catch (e: any) {
      console.error('[Supabase Auth Exception]:', e.message);
    }

    // Fallback ID if Supabase Auth is unreachable
    const finalUserId = supabaseUserId || `usr_${Date.now()}`;

    // 3. Insert into Supabase 'profiles' table
    try {
      if (supabaseUserId) {
        const profilePayload: any = {
          id: supabaseUserId,
          email: cleanEmail,
          full_name: `Dr. ${prenom} ${nom}`,
          profession: profession || 'Étudiant',
          role: profileRole,
          plan: chosenPlan,
          faculty: faculty || 'ORAN',
          raw_password: password,
          updated_at: new Date().toISOString()
        };

        const { error: pErr } = await supabaseAdmin.from('profiles').upsert(profilePayload, { onConflict: 'id' });
        if (pErr && pErr.message.includes('raw_password')) {
          delete profilePayload.raw_password;
          await supabaseAdmin.from('profiles').upsert(profilePayload, { onConflict: 'id' });
        }

        // 4. If paid plan (PRO or PREMIUM), register in 'subscriptions' table
        if (chosenPlan === 'PRO' || chosenPlan === 'PREMIUM') {
          await supabaseAdmin.from('subscriptions').insert({
            user_id: supabaseUserId,
            plan_type: chosenPlan,
            status: 'ACTIVE',
            payment_method: 'BARIDIMOB',
            amount_da: chosenPlan === 'PREMIUM' ? 7000.00 : 4500.00,
            starts_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            notes: `Souscription initiale ${chosenPlan} lors de l'inscription`
          });
        }
      }
    } catch (dbErr: any) {
      console.error('[Supabase Profiles Insert Error]:', dbErr.message);
    }

    // 5. Update local in-memory store for instant responsiveness
    const newUser: User = {
      id: finalUserId,
      email: cleanEmail,
      name: `Dr. ${prenom} ${nom}`,
      username: cleanUsername,
      password: password, // Saved so admin can see it in users dashboard
      profession: (profession as MedicalProfession) || 'Étudiant',
      faculty: faculty || 'ORAN',
      role: 'USER',
      plan: chosenPlan,
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

    db.createUser(newUser);

    const userAgent = req.headers.get('user-agent') || undefined;
    const sessionId = createSession(newUser, userAgent);
    const isHttps = req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https:');

    const response = NextResponse.json({ success: true, user: newUser });
    response.cookies.set('asmedix_session', sessionId, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year (persistent login)
      sameSite: 'lax',
      secure: isHttps,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}
