import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { QCMAttempt } from '@/types';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId');

    // Strictly isolate statistics: each user gets strictly their own attempts & stats
    const effectiveUserId = (currentUser?.role === 'ADMIN' && requestedUserId)
      ? requestedUserId
      : (currentUser?.id || 'usr_demo_free');

    const stats = db.getUserQcmStats(effectiveUserId);
    const userAttempts = db.getUserAttempts(effectiveUserId);
    const specialties = db.getSpecialties();
    return NextResponse.json({
      success: true,
      ...stats,
      userAttempts,
      specialties,
      userId: effectiveUserId
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { userId, qcmId, userAnswers, isCorrect, scorePercentage, timeSpentSeconds } = body;

    // Strictly isolate attempt: prioritize the authenticated session
    const effectiveUserId = currentUser?.id || userId || 'usr_demo_free';

    const attempt: QCMAttempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: effectiveUserId,
      qcmId,
      userAnswers: userAnswers || [],
      isCorrect: Boolean(isCorrect),
      scorePercentage: scorePercentage || 0,
      timeSpentSeconds: timeSpentSeconds || 0,
      attemptedAt: new Date().toISOString()
    };

    db.recordAttempt(attempt);

    // Sync to Supabase qcm_attempts table if user exists in Supabase
    try {
      if (currentUser?.id && currentUser.id.length >= 30) {
        await supabaseAdmin.from('qcm_attempts').insert({
          user_id: currentUser.id,
          qcm_id: qcmId,
          user_answers: userAnswers || [],
          is_correct: Boolean(isCorrect),
          score_percentage: scorePercentage || 0,
          time_spent_seconds: timeSpentSeconds || 0,
          attempted_at: attempt.attemptedAt
        });
      }
    } catch (sbErr) {
      console.error('[Supabase QCM Attempt Sync Error]:', sbErr);
    }

    // Return updated user stats strictly for this user
    const stats = db.getUserQcmStats(effectiveUserId);

    return NextResponse.json({ success: true, attempt, stats });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur enregistrement tentative' }, { status: 500 });
  }
}
