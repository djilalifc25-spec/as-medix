import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { createSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { User } from '@/types';

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Identifiant et mot de passe requis' }, { status: 400 });
    }

    const cleanId = identifier.toLowerCase().trim();
    const cleanIdNoSpaces = cleanId.replace(/\s+/g, '');

    let user = db.getUsers().find(
      u => u.email.toLowerCase().trim() === cleanId ||
           (u.username && u.username.toLowerCase().trim() === cleanId) ||
           (u.username && u.username.toLowerCase().replace(/\s+/g, '') === cleanIdNoSpaces)
    );

    // If not found in local DB, check Supabase profiles and auth
    if (!user) {
      try {
        let profileMatch: any = null;

        // 1. Check Supabase profiles by email
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .ilike('email', cleanId)
          .maybeSingle();

        profileMatch = profile;

        // 2. If not found by email, search Supabase Auth user list
        if (!profileMatch) {
          const { data: authList } = await supabaseAdmin.auth.admin.listUsers();
          const foundAuth = authList?.users?.find(
            u => u.email?.toLowerCase() === cleanId ||
                 (u.user_metadata?.username && String(u.user_metadata.username).toLowerCase().replace(/\s+/g, '') === cleanIdNoSpaces) ||
                 (u.user_metadata?.full_name && String(u.user_metadata.full_name).toLowerCase().includes(cleanId))
          );

          if (foundAuth && foundAuth.email) {
            const { data: p } = await supabaseAdmin
              .from('profiles')
              .select('*')
              .eq('id', foundAuth.id)
              .maybeSingle();

            profileMatch = p || {
              id: foundAuth.id,
              email: foundAuth.email,
              full_name: foundAuth.user_metadata?.full_name,
              profession: foundAuth.user_metadata?.profession,
              faculty: foundAuth.user_metadata?.faculty,
              role: 'STUDENT',
              plan: 'FREE'
            };
          }
        }

        if (profileMatch) {
          user = {
            id: profileMatch.id,
            email: profileMatch.email,
            name: profileMatch.full_name || profileMatch.email.split('@')[0],
            username: cleanId.includes('@') ? profileMatch.email.split('@')[0] : cleanId,
            profession: (profileMatch.profession as any) || 'Étudiant',
            faculty: (profileMatch.faculty as any) || 'ORAN',
            role: profileMatch.role === 'ADMIN' || profileMatch.role === 'SUPER_ADMIN' ? 'ADMIN' : 'USER',
            plan: profileMatch.plan || 'FREE',
            status: 'active',
            createdAt: profileMatch.created_at || new Date().toISOString(),
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
        console.error('[Supabase Login Lookup Error]:', err);
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Identifiants invalides (aucun compte trouvé)' }, { status: 401 });
    }

    // Password validation (demo/admin accounts or standard password length >= 4)
    const isValid =
      (user.email === 'demo@asmedix.com' && (password === 'Demo123!' || password === 'demo' || password.length >= 4)) ||
      (user.email === 'admin@asmedix.com' && (password === 'Admin123!' || password === 'admin' || password.length >= 4)) ||
      password.length >= 4;

    if (!isValid) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
    }

    const userAgent = req.headers.get('user-agent') || undefined;
    const sessionId = createSession(user, userAgent);
    const isHttps = req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https:');

    const response = NextResponse.json({ success: true, user });
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
