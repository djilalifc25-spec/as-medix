import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let settings = db.getSettings();

    // Attempt to enrich with Supabase settings
    try {
      const { data, error } = await supabaseAdmin
        .from('platform_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      console.log('[Settings API fetched data]:', data, 'error:', error);

      if (data?.settings && typeof data.settings === 'object') {
        const s = data.settings;
        settings = {
          ...settings,
          platformName: s.platformName || settings.platformName,
          whatsappNumber: s.whatsapp_number || s.whatsappNumber || settings.whatsappNumber,
          secondaryPhone: s.secondary_phone || s.secondaryPhone || settings.secondaryPhone,
          instagramUrl: s.instagram_url || s.instagramUrl || settings.instagramUrl,
          facebookUrl: s.facebook_url || s.facebookUrl || settings.facebookUrl,
          telegramUrl: s.telegram_url || s.telegramUrl || settings.telegramUrl,
          baridimobRip: s.baridimob_rip || s.baridimobRip || settings.baridimobRip,
          ccpNumber: s.ccp_number || s.ccpNumber || settings.ccpNumber,
          accountHolder: s.account_holder || s.accountHolder || settings.accountHolder,
          supportEmail: s.support_email || s.supportEmail || settings.supportEmail,
          pricing: {
            ...settings.pricing,
            proPriceDa: s.proPlanPrice || s.proPriceDa || settings.pricing?.proPriceDa || 4500,
            premiumPriceDa: s.premiumPlanPrice || s.premiumPriceDa || settings.pricing?.premiumPriceDa || 7000,
          }
        };
      }
    } catch (sbErr) {
      console.warn('[Settings API] Supabase fetch fallback to local:', sbErr);
    }

    const rawWhatsapp = settings.whatsappNumber || '+213 555 12 34 56';
    const whatsappDigits = rawWhatsapp.replace(/\D/g, '') || '213555123456';

    return NextResponse.json({
      settings: {
        ...settings,
        whatsappNumber: rawWhatsapp,
        whatsappDigits,
        secondaryPhone: settings.secondaryPhone || '+213 770 12 34 56',
        instagramUrl: settings.instagramUrl || 'https://instagram.com/asmedix_officiel',
        facebookUrl: settings.facebookUrl || 'https://facebook.com/asmedix_officiel',
        telegramUrl: settings.telegramUrl || 'https://t.me/asmedix_officiel',
        baridimobRip: settings.baridimobRip || '00799999002233445566',
        ccpNumber: settings.ccpNumber || '22334455 Clé 66',
        accountHolder: settings.accountHolder || 'Dr. Karim Benali',
        supportEmail: settings.supportEmail || 'contact@asmedix.dz',
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur serveur' }, { status: 500 });
  }
}
