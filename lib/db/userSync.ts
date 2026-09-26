import { supabase } from '@/lib/supabase/client';
import { db } from '@/lib/db/store';
import { User } from '@/types';

export async function syncUsersFromSupabase(): Promise<User[]> {
  try {
    // 1. Fetch cloud persistent user backups from password_resets
    const { data: cloudBackups } = await supabase
      .from('password_resets')
      .select('*')
      .eq('code', 'USER_REGISTER_SYNC_V1')
      .eq('used', false);

    if (cloudBackups && cloudBackups.length > 0) {
      for (const row of cloudBackups) {
        try {
          const uPayload: User = JSON.parse(row.token);
          if (uPayload && uPayload.email) {
            const existing = db.getUserByEmail(uPayload.email);
            if (!existing) {
              db.createUser(uPayload);
            } else {
              // Refresh user properties if cloud has updated data
              const updates: Partial<User> = {};
              if (uPayload.plan && uPayload.plan !== existing.plan) updates.plan = uPayload.plan;
              if (uPayload.password && !existing.password) updates.password = uPayload.password;
              if (uPayload.role && uPayload.role !== existing.role) updates.role = uPayload.role;
              if (Object.keys(updates).length > 0) {
                db.updateUser(existing.id, updates);
              }
            }
          }
        } catch (parseErr) {
          console.error('[userSync Parse Error]:', parseErr);
        }
      }
    }

    // 2. Fetch profiles table (fail-safe)
    const { data: cloudProfiles } = await supabase.from('profiles').select('*');
    if (cloudProfiles && cloudProfiles.length > 0) {
      for (const sp of cloudProfiles) {
        if (!sp.email) continue;
        const existing = db.getUserByEmail(sp.email);
        if (!existing) {
          const mapped: User = {
            id: sp.id,
            email: sp.email,
            name: sp.full_name || sp.email.split('@')[0],
            username: sp.email.split('@')[0],
            password: sp.raw_password || undefined,
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
          db.createUser(mapped);
        } else {
          if (sp.plan && sp.plan !== existing.plan) {
            db.updateUser(existing.id, { plan: sp.plan });
          }
        }
      }
    }
  } catch (err: any) {
    console.error('[syncUsersFromSupabase Cloud Sync Warning]:', err?.message || err);
  }

  return db.getUsers();
}

export async function saveUserToSupabaseCloud(user: User): Promise<void> {
  try {
    // Insert/update cloud persistent backup in password_resets
    await supabase.from('password_resets').insert({
      email: user.email.toLowerCase().trim(),
      code: 'USER_REGISTER_SYNC_V1',
      token: JSON.stringify(user),
      expires_at: '2099-12-31T23:59:59Z',
      used: false
    });
  } catch (err: any) {
    console.error('[saveUserToSupabaseCloud Error]:', err?.message || err);
  }
}

export async function updateUserInSupabaseCloud(email: string, updates: Partial<User>): Promise<void> {
  try {
    const targetEmail = email.toLowerCase().trim();
    const { data: existingRows } = await supabase
      .from('password_resets')
      .select('*')
      .eq('email', targetEmail)
      .eq('code', 'USER_REGISTER_SYNC_V1')
      .eq('used', false);

    if (existingRows && existingRows.length > 0) {
      for (const row of existingRows) {
        try {
          const current: User = JSON.parse(row.token);
          const updated: User = { ...current, ...updates };
          await supabase
            .from('password_resets')
            .update({ token: JSON.stringify(updated) })
            .eq('id', row.id);
        } catch {}
      }
    }
  } catch (err: any) {
    console.error('[updateUserInSupabaseCloud Error]:', err?.message || err);
  }
}

export async function deleteUserFromSupabaseCloud(email: string): Promise<void> {
  try {
    const targetEmail = email.toLowerCase().trim();
    await supabase
      .from('password_resets')
      .update({ used: true })
      .eq('email', targetEmail)
      .eq('code', 'USER_REGISTER_SYNC_V1');
  } catch (err: any) {
    console.error('[deleteUserFromSupabaseCloud Error]:', err?.message || err);
  }
}
