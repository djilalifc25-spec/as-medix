import { User, PlanType } from '@/types';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { updateUserInSupabaseCloud } from '@/lib/db/userSync';

/**
 * Generate a unique 16-character AS-MEDIX License Key.
 * Format: ASMEDIX-PRO-2026-X89B-492A
 */
export function generateLicenseKey(plan: PlanType, userId: string): string {
  const year = new Date().getFullYear();
  const rawHash = (userId + Date.now().toString(36) + Math.random().toString(36)).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const segment1 = rawHash.substring(0, 4).padEnd(4, '7');
  const segment2 = rawHash.substring(4, 8).padEnd(4, '9');
  return `ASMEDIX-${plan.toUpperCase()}-${year}-${segment1}-${segment2}`;
}

/**
 * Calculate 1-Year (365 Days) subscription start & expiration dates.
 */
export function calculateSubscriptionPeriod(startedAtIso?: string): { startedAt: string; expiresAt: string } {
  const startedAtDate = startedAtIso ? new Date(startedAtIso) : new Date();
  // Exactly 365 days from activation date
  const expiresAtDate = new Date(startedAtDate.getTime() + 365 * 24 * 60 * 60 * 1000);
  
  return {
    startedAt: startedAtDate.toISOString(),
    expiresAt: expiresAtDate.toISOString()
  };
}

/**
 * Calculate remaining days before subscription expires.
 */
export function getDaysRemaining(expiresAtIso?: string): number {
  if (!expiresAtIso) return 0;
  const now = new Date().getTime();
  const expires = new Date(expiresAtIso).getTime();
  const diffTime = expires - now;
  if (diffTime <= 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if the user's 1-year subscription has expired.
 * If expired, automatically downgrades plan to FREE, notifies user, and syncs to DB & Supabase Cloud.
 */
export async function checkAndEnforceLicenseExpiration(user: User): Promise<{ expired: boolean; user: User }> {
  if (!user || user.plan === 'FREE' || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    return { expired: false, user };
  }

  if (!user.subscriptionExpiresAt) {
    // If no expiration date exists for PRO/PREMIUM, initialize it starting from user creation or now
    const period = calculateSubscriptionPeriod(user.createdAt);
    const licenseKey = user.licenseKey || generateLicenseKey(user.plan, user.id);
    const updated = db.updateUser(user.id, {
      licenseKey,
      subscriptionStartedAt: period.startedAt,
      subscriptionExpiresAt: period.expiresAt
    });
    return { expired: false, user: updated || user };
  }

  const now = Date.now();
  const expiresTime = new Date(user.subscriptionExpiresAt).getTime();

  if (now > expiresTime) {
    console.log(`[License Expiry Enforced] User ${user.email} subscription expired on ${user.subscriptionExpiresAt}. Downgrading to FREE.`);

    const oldPlan = user.plan;
    // 1. Downgrade local DB store
    const updatedUser = db.updateUser(user.id, {
      plan: 'FREE',
      licenseKey: undefined
    }) || { ...user, plan: 'FREE' as PlanType, licenseKey: undefined };

    // 2. Add in-app notification to the user
    db.addNotification({
      id: `notif_exp_${Date.now()}_${user.id.slice(0, 6)}`,
      userId: user.id,
      title: '⌛ Votre abonnement de 1 An a expiré',
      message: `Votre licence de 1 an (${oldPlan}) est arrivée à terme. Votre compte est repassé au forfait Gratuit. Vous pouvez renouveler votre accès à tout moment.`,
      date: new Date().toISOString(),
      type: 'system',
      read: false,
      linkUrl: '/pricing'
    });

    // 3. Sync downgrade to Supabase Cloud
    try {
      if (user.email) {
        await updateUserInSupabaseCloud(user.email, { plan: 'FREE' });
      }
      if (user.id) {
        await supabaseAdmin.from('profiles').update({ plan: 'FREE' }).eq('id', user.id);
        await supabaseAdmin.from('subscriptions').update({ status: 'EXPIRED' }).eq('user_id', user.id);
      }
    } catch (err) {
      console.error('[Supabase License Downgrade Sync Error]:', err);
    }

    return { expired: true, user: updatedUser };
  }

  return { expired: false, user };
}
