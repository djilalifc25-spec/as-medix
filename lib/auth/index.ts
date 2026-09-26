import { cookies } from 'next/headers';
import { User, UserRole, PlanType } from '@/types';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { syncUsersFromSupabase, updateUserInSupabaseCloud } from '@/lib/db/userSync';
import { checkAndEnforceLicenseExpiration } from '@/lib/subscription/license';

const SESSION_COOKIE = 'asmedix_session';
const DEMO_OVERRIDE_COOKIE = 'asmedix_demo_override';

export interface SessionData {
  userId: string;
  email: string;
  role: UserRole;
  plan: PlanType;
}

// In-memory sessions map backed by globalThis to survive Fast Refresh / Dev server reload
const globalForAuth = globalThis as unknown as {
  asmedixActiveSessions?: Map<string, SessionData>;
};

export const activeSessions =
  globalForAuth.asmedixActiveSessions ?? new Map<string, SessionData>();

if (process.env.NODE_ENV !== 'production') {
  globalForAuth.asmedixActiveSessions = activeSessions;
}

/**
 * Returns the strictly authenticated user from cookie.
 * Returns null if no active authenticated session exists.
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sessionId) return null;

    let userId: string | null = null;

    if (activeSessions.has(sessionId)) {
      userId = activeSessions.get(sessionId)!.userId;
    } else if (sessionId.startsWith('sess_b64_')) {
      const parts = sessionId.replace('sess_b64_', '').split('_');
      try {
        const decoded = Buffer.from(parts[0], 'base64url').toString('utf-8');
        if (decoded) userId = decoded;
      } catch {}
    } else if (sessionId.startsWith('sess_')) {
      const raw = sessionId.replace('sess_', '');
      const parts = raw.split('_');
      if (parts.length >= 3) {
        userId = parts.slice(0, parts.length - 2).join('_');
      } else {
        userId = parts[0];
      }
    }

    if (!userId) return null;

    let found = db.getUserById(userId);

    // If not found in local DB memory, re-sync users from Supabase Cloud backup
    if (!found) {
      await syncUsersFromSupabase();
      found = db.getUserById(userId);
    }

    // If still not found, check Supabase profiles
    if (!found) {
      try {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profile) {
          found = {
            id: profile.id,
            email: profile.email,
            name: profile.full_name || profile.email.split('@')[0],
            username: profile.email.split('@')[0],
            profession: (profile.profession as any) || 'Étudiant',
            faculty: (profile.faculty as any) || 'ORAN',
            role: profile.role === 'ADMIN' || profile.role === 'SUPER_ADMIN' ? 'ADMIN' : 'USER',
            plan: profile.plan || 'FREE',
            status: 'active',
            createdAt: profile.created_at || new Date().toISOString(),
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
          db.createUser(found);
        }
      } catch (err) {
        console.error('[Auth Supabase Lookup Error]:', err);
      }
    }

    if (found) {
      if (found.status === 'suspended') {
        return null;
      }

      // STRICT SINGLE DEVICE SESSION ENFORCEMENT:
      // If user has a different activeSessionId saved (from a newer login on another device),
      // invalidate current device session immediately!
      if (found.activeSessionId && found.activeSessionId !== sessionId) {
        activeSessions.delete(sessionId);
        return null;
      }

      // Automatically enforce 1-year subscription license expiration
      const licenseCheck = await checkAndEnforceLicenseExpiration(found);
      found = licenseCheck.user;

      // Re-populate activeSessions cache
      activeSessions.set(sessionId, {
        userId: found.id,
        email: found.email,
        role: found.role,
        plan: found.plan,
      });
      return found;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const demoOverride = cookieStore.get(DEMO_OVERRIDE_COOKIE)?.value as PlanType | undefined;

  // Strictly get authenticated user — NEVER fall back to 'usr_admin_master' (Pr. Karim Benali)!
  const user: User | null = await getAuthenticatedUser();

  if (user && demoOverride) {
    const overriddenUser: User = {
      ...user,
      plan: demoOverride === ('ADMIN' as any) ? 'PREMIUM' : demoOverride,
      role: demoOverride === ('ADMIN' as any) ? 'ADMIN' : (demoOverride === 'FREE' ? 'USER' : user.role)
    };
    return overriddenUser;
  }

  return user;
}

export function createSession(user: User, userAgent?: string): string {
  // Embed role in session ID so middleware can check it at the edge without DB
  const b64Id = Buffer.from(user.id).toString('base64url');
  const roleTag = `_ROLE_${user.role}`; // e.g. _ROLE_ADMIN, _ROLE_STUDENT
  const sessionId = `sess_b64_${b64Id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${roleTag}`;

  // Purge any existing active session tokens for this user from memory cache
  activeSessions.forEach((sData, sId) => {
    if (sData.userId === user.id) {
      activeSessions.delete(sId);
    }
  });

  activeSessions.set(sessionId, {
    userId: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan
  });

  const sessionUpdates = {
    activeSessionId: sessionId,
    lastActive: new Date().toISOString(),
    ...(userAgent ? { lastDevice: userAgent.slice(0, 80) } : {})
  };

  db.updateUser(user.id, sessionUpdates);
  if (user.email) {
    updateUserInSupabaseCloud(user.email, sessionUpdates).catch(() => {});
  }

  return sessionId;
}

export function destroySession(sessionId: string): void {
  activeSessions.delete(sessionId);
}

export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;
  if (requiredRole === 'ADMIN') return user.role === 'ADMIN';
  if (requiredRole === 'EDITOR') return user.role === 'EDITOR' || user.role === 'ADMIN';
  if (requiredRole === 'USER') return true;
  return false;
}
