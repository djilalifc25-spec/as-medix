import { User, PlanType } from '@/types';
import { db } from '@/lib/db/store';

export interface AccessCheckResult {
  allowed: boolean;
  reason?: 'PLAN_REQUIRED' | 'LIMIT_EXCEEDED';
  currentUsage?: number;
  maxLimit?: number;
  upgradeTarget?: PlanType;
}

export function canAccessContent(
  user: User | null,
  contentAccessLevel: PlanType,
  contentType: 'course' | 'fiche' | 'qcm' | 'cat' | 'case' | 'ecg'
): AccessCheckResult {
  // If user is ADMIN or SUPER_ADMIN, always allowed
  if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
    return { allowed: true };
  }

  const userPlan: PlanType = user?.plan || 'FREE';
  const settings = db.getSettings();

  // 1. Check Plan Level
  if (contentAccessLevel === 'PREMIUM' && userPlan !== 'PREMIUM') {
    return {
      allowed: false,
      reason: 'PLAN_REQUIRED',
      upgradeTarget: 'PREMIUM'
    };
  }

  if (contentAccessLevel === 'PRO' && userPlan === 'FREE') {
    return {
      allowed: false,
      reason: 'PLAN_REQUIRED',
      upgradeTarget: 'PRO'
    };
  }

  // 2. If content is FREE but user is on FREE tier, check monthly quota limits
  if (userPlan === 'FREE' && user) {
    if (contentType === 'course') {
      const limit = settings.freeLimits.maxCourses;
      if (user.usage.coursesViewedMonth >= limit) {
        return {
          allowed: false,
          reason: 'LIMIT_EXCEEDED',
          currentUsage: user.usage.coursesViewedMonth,
          maxLimit: limit,
          upgradeTarget: 'PRO'
        };
      }
    } else if (contentType === 'qcm') {
      const limit = settings.freeLimits.maxQcmPerMonth;
      if (user.usage.qcmsAnsweredMonth >= limit) {
        return {
          allowed: false,
          reason: 'LIMIT_EXCEEDED',
          currentUsage: user.usage.qcmsAnsweredMonth,
          maxLimit: limit,
          upgradeTarget: 'PRO'
        };
      }
    } else if (contentType === 'cat') {
      const limit = settings.freeLimits.maxCat;
      if (user.usage.catViewedMonth >= limit) {
        return {
          allowed: false,
          reason: 'LIMIT_EXCEEDED',
          currentUsage: user.usage.catViewedMonth,
          maxLimit: limit,
          upgradeTarget: 'PRO'
        };
      }
    } else if (contentType === 'case') {
      const limit = settings.freeLimits.maxCases;
      if (user.usage.casesViewedMonth >= limit) {
        return {
          allowed: false,
          reason: 'LIMIT_EXCEEDED',
          currentUsage: user.usage.casesViewedMonth,
          maxLimit: limit,
          upgradeTarget: 'PRO'
        };
      }
    }
  }

  return { allowed: true };
}

export function hasPremiumAccess(user: User | null): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return true;
  return (user.plan === 'PRO' || user.plan === 'PREMIUM') && user.status === 'active';
}

