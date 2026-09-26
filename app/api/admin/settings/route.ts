import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    let currentSettings: any = db.getSettings();

    try {
      const { data } = await supabaseAdmin.from('platform_settings').select('*').eq('id', 1).maybeSingle();
      if (data?.settings) {
        currentSettings = {
          ...currentSettings,
          ...data.settings,
          whatsappNumber: data.settings.whatsapp_number || data.settings.whatsappNumber || currentSettings.whatsappNumber,
          secondaryPhone: data.settings.secondary_phone || data.settings.secondaryPhone || currentSettings.secondaryPhone,
          instagramUrl: data.settings.instagram_url || data.settings.instagramUrl || currentSettings.instagramUrl,
          facebookUrl: data.settings.facebook_url || data.settings.facebookUrl || currentSettings.facebookUrl,
          telegramUrl: data.settings.telegram_url || data.settings.telegramUrl || currentSettings.telegramUrl,
          baridimobRip: data.settings.baridimob_rip || data.settings.baridimobRip || currentSettings.baridimobRip,
          ccpNumber: data.settings.ccp_number || data.settings.ccpNumber || currentSettings.ccpNumber,
          accountHolder: data.settings.account_holder || data.settings.accountHolder || currentSettings.accountHolder,
          supportEmail: data.settings.support_email || data.settings.supportEmail || currentSettings.supportEmail,
        };
      }
    } catch (e) {
      console.warn('[Admin Settings GET] Supabase fallback:', e);
    }

    return NextResponse.json({ settings: currentSettings });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const updates = await req.json();

    // 1. Update in local store
    const updatedLocal = db.updateSettings(updates);

    // 2. Prepare payload for Supabase
    const supabasePayload = {
      ...updates,
      whatsapp_number: updates.whatsappNumber || updates.whatsapp_number,
      secondary_phone: updates.secondaryPhone || updates.secondary_phone,
      instagram_url: updates.instagramUrl || updates.instagram_url,
      facebook_url: updates.facebookUrl || updates.facebook_url,
      telegram_url: updates.telegramUrl || updates.telegram_url,
      baridimob_rip: updates.baridimobRip || updates.baridimob_rip,
      ccp_number: updates.ccpNumber || updates.ccp_number,
      account_holder: updates.accountHolder || updates.account_holder,
      support_email: updates.supportEmail || updates.support_email,
      platformName: updates.platformName,
      proPlanPrice: updates.pricing?.proPriceDa || updates.proPlanPrice,
      premiumPlanPrice: updates.pricing?.premiumPriceDa || updates.premiumPlanPrice,
    };

    try {
      const { data: existing } = await supabaseAdmin.from('platform_settings').select('*').eq('id', 1).maybeSingle();
      const mergedSettings = { ...(existing?.settings || {}), ...supabasePayload };

      await supabaseAdmin.from('platform_settings').upsert({
        id: 1,
        settings: mergedSettings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    } catch (sbErr) {
      console.warn('[Admin Settings POST] Supabase upsert error:', sbErr);
    }

    return NextResponse.json({ success: true, settings: updatedLocal });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur serveur' }, { status: 500 });
  }
}

