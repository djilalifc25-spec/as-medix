import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    let totalUsers = 0;
    let freeUsers = 0;
    let proUsers = 0;
    let premiumUsers = 0;
    let subscribersList: any[] = [];
    let isSupabaseLive = false;

    // 1. Try querying Supabase first
    try {
      const { data: profiles, error: profErr } = await supabaseAdmin
        .from('profiles')
        .select('*');

      if (!profErr && profiles && profiles.length > 0) {
        isSupabaseLive = true;
        totalUsers = profiles.length;
        freeUsers = profiles.filter(p => !p.plan || p.plan === 'FREE').length;
        proUsers = profiles.filter(p => p.plan === 'PRO').length;
        premiumUsers = profiles.filter(p => p.plan === 'PREMIUM').length;

        // Get paid subscribers
        subscribersList = profiles
          .filter(p => p.plan === 'PRO' || p.plan === 'PREMIUM')
          .map(p => ({
            id: p.id,
            email: p.email,
            name: p.full_name || p.email.split('@')[0],
            phone: p.phone || 'Non renseigné',
            profession: p.profession || 'Étudiant',
            plan: p.plan,
            role: p.role,
            createdAt: p.created_at
          }));
      }
    } catch (e) {
      // Fallback below
    }

    // 2. Fallback to local DB store if Supabase profiles not yet seeded
    if (!isSupabaseLive) {
      const localUsers = db.getUsers();
      totalUsers = localUsers.length;
      freeUsers = localUsers.filter(u => u.plan === 'FREE').length;
      proUsers = localUsers.filter(u => u.plan === 'PRO').length;
      premiumUsers = localUsers.filter(u => u.plan === 'PREMIUM').length;

      subscribersList = localUsers
        .filter(u => u.plan === 'PRO' || u.plan === 'PREMIUM')
        .map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          phone: u.phone || '0555123456',
          profession: u.profession || 'Étudiant',
          plan: u.plan,
          role: u.role,
          createdAt: u.createdAt
        }));
    }

    const monthlyRevenueDa = proUsers * 4500 + premiumUsers * 7000;
    const coursesCount = db.getCourses().length;
    const qcmsCount = db.getQcms().length;
    const catCount = db.getCatProtocols().length;
    const paymentRequests = db.getPaymentRequests ? db.getPaymentRequests() : [];
    const pendingPaymentsCount = paymentRequests.filter((p: any) => p.status === 'PENDING').length;

    // Get all registered users from Supabase sorted by newest first
    let allUsersList: any[] = [];
    try {
      const { data: allProfiles } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (allProfiles && allProfiles.length > 0) {
        allUsersList = allProfiles.map(p => ({
          id: p.id,
          email: p.email,
          name: p.full_name || p.email.split('@')[0],
          phone: p.phone || 'Non renseigné',
          profession: p.profession || 'Étudiant',
          plan: p.plan || 'FREE',
          role: p.role,
          faculty: p.faculty || 'ORAN',
          createdAt: p.created_at
        }));
      }
    } catch (_) {}

    if (allUsersList.length === 0) {
      allUsersList = db.getUsers().map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        phone: u.phone || 'Non renseigné',
        profession: u.profession || 'Étudiant',
        plan: u.plan || 'FREE',
        role: u.role,
        faculty: u.faculty || 'ORAN',
        createdAt: u.createdAt
      }));
    }

    return NextResponse.json({
      success: true,
      isSupabaseLive,
      stats: {
        totalUsers,
        freeUsers,
        proUsers,
        premiumUsers,
        totalSubscribers: proUsers + premiumUsers,
        monthlyRevenueDa,
        coursesCount,
        qcmsCount,
        catCount,
        pendingPaymentsCount
      },
      subscribers: subscribersList,
      recentUsers: allUsersList
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
