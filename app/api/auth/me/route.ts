import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { db } from '@/lib/db/store';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    // Check if Supabase profile has been upgraded by admin in real-time
    let currentPlan = user.plan;
    try {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('plan, role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile && profile.plan && profile.plan !== user.plan) {
        currentPlan = profile.plan;
        db.updateUser(user.id, { plan: profile.plan });
        user.plan = profile.plan;
      }
    } catch (_) {}

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: currentPlan,
        faculty: user.faculty,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, user: null, error: err.message }, { status: 500 });
  }
}
