import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { createSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabase } from '@/lib/supabase/client';
import { syncUsersFromSupabase, saveUserToSupabaseCloud } from '@/lib/db/userSync';
import { User, MedicalProfession } from '@/types';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { nom, prenom, email, username, password, profession, faculty, targetPlan } = await req.json();

    if (!email || !password || !nom || !prenom) {
      return NextResponse.json({ error: 'Tous les champs obligatoires (Nom, Prénom, Email, Mot de passe) doivent être remplis' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = (username || email.split('@')[0]).toLowerCase().trim().replace(/\s+/g, '');
    const chosenPlan = (targetPlan === 'PRO' || targetPlan === 'PREMIUM') ? targetPlan : 'FREE';

    // 0. Ensure local store is synced with Supabase Cloud
    await syncUsersFromSupabase();

    // Role mapping
    let profileRole: 'STUDENT' | 'DOCTOR' | 'RESIDENT' | 'ADMIN' = 'STUDENT';
    if (profession === 'Médecin') profileRole = 'DOCTOR';
    else if (profession === 'Résident') profileRole = 'RESIDENT';

    // 1. Single account check in local database & cloud
    const existingInLocal = db.getUsers().find(u => u.email.toLowerCase().trim() === cleanEmail);
    if (existingInLocal) {
      return NextResponse.json({
        error: 'Cette adresse email est déjà inscrite sur AS-MEDIX. Veuillez vous connecter ou réinitialiser votre mot de passe.'
      }, { status: 400 });
    }

    const existingUsername = db.getUsers().find(u => u.username && u.username.toLowerCase().trim() === cleanUsername);
    if (existingUsername) {
      return NextResponse.json({
        error: 'Ce nom d\'utilisateur est déjà pris. Veuillez en choisir un autre.'
      }, { status: 400 });
    }

    // 2. Try creating user in Supabase Auth (via admin or client)
    let supabaseUserId: string | null = null;
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: `Dr. ${prenom.trim()} ${nom.trim()}`,
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
        }
      } else if (authData?.user) {
        supabaseUserId = authData.user.id;
      }
    } catch (e: any) {}

    // Fallback attempt via standard Supabase Auth client if admin failed
    if (!supabaseUserId) {
      try {
        const { data: clientAuthData } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: `Dr. ${prenom.trim()} ${nom.trim()}`,
              profession: profession || 'Étudiant',
              faculty: faculty || 'ORAN',
              username: cleanUsername,
              raw_password: password
            }
          }
        });
        if (clientAuthData?.user) {
          supabaseUserId = clientAuthData.user.id;
        }
      } catch (clientAuthErr) {}
    }

    // Guaranteed valid UUID fallback
    const finalUserId = (supabaseUserId && supabaseUserId.includes('-')) ? supabaseUserId : crypto.randomUUID();

    // 3. Build new user object
    const newUser: User = {
      id: finalUserId,
      email: cleanEmail,
      name: `Dr. ${prenom.trim()} ${nom.trim()}`,
      username: cleanUsername,
      password: password,
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

    // 4. Save to local store
    db.createUser(newUser);

    // 5. GUARANTEED PERSISTENCE IN SUPABASE CLOUD (password_resets table backup)
    await saveUserToSupabaseCloud(newUser);

    // 6. Best-effort insertion into Supabase 'profiles' table
    try {
      const profilePayload: any = {
        id: finalUserId,
        email: cleanEmail,
        full_name: `Dr. ${prenom.trim()} ${nom.trim()}`,
        profession: profession || 'Étudiant',
        role: profileRole,
        plan: chosenPlan,
        faculty: faculty || 'ORAN',
        raw_password: password,
        updated_at: new Date().toISOString()
      };

      await supabaseAdmin.from('profiles').upsert(profilePayload, { onConflict: 'id' });
    } catch (dbErr: any) {}

    // Notify admins of new registration
    try {
      db.addNotification({
        id: `notif_newuser_${Date.now()}`,
        userId: 'usr_admin',
        title: '👤 Nouveau membre inscrit !',
        message: `${newUser.name} (${cleanEmail}) vient de créer un compte sur la plateforme.`,
        date: new Date().toISOString(),
        type: 'system',
        read: false,
        linkUrl: '/admin/utilisateurs'
      });
    } catch {}

    const userAgent = req.headers.get('user-agent') || undefined;
    const sessionId = createSession(newUser, userAgent);
    const isHttps = req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https:');

    const response = NextResponse.json({ success: true, user: newUser });
    response.cookies.set('asmedix_session', sessionId, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year persistent session
      sameSite: 'lax',
      secure: isHttps,
    });

    return response;
  } catch (err: any) {
    console.error('[Register API Fatal Error]:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur lors de l\'inscription' }, { status: 500 });
  }
}
