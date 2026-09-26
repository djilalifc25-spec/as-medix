-- ==============================================================================
-- AS-MEDIX: MISE À JOUR DE LA TABLE PLATFORM_SETTINGS & COORDONNÉES BANCAIRES
-- ==============================================================================

-- 1. Assurer la création de la table platform_settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  whatsapp_number TEXT,
  secondary_phone TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  telegram_url TEXT,
  baridimob_rip TEXT,
  ccp_number TEXT,
  account_holder TEXT,
  support_email TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ajouter les colonnes explicites si la table existait déjà
ALTER TABLE IF EXISTS public.platform_settings 
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS secondary_phone TEXT,
  ADD COLUMN IF NOT EXISTS instagram_url TEXT,
  ADD COLUMN IF NOT EXISTS facebook_url TEXT,
  ADD COLUMN IF NOT EXISTS telegram_url TEXT,
  ADD COLUMN IF NOT EXISTS baridimob_rip TEXT,
  ADD COLUMN IF NOT EXISTS ccp_number TEXT,
  ADD COLUMN IF NOT EXISTS account_holder TEXT,
  ADD COLUMN IF NOT EXISTS support_email TEXT;

-- 3. Activer RLS et autoriser la lecture publique
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Settings readable by all" ON public.platform_settings;
CREATE POLICY "Settings readable by all" ON public.platform_settings 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Settings modifiable by admin" ON public.platform_settings;
CREATE POLICY "Settings modifiable by admin" ON public.platform_settings 
  FOR ALL USING (true);

-- 4. Initialiser la ligne par défaut id=1 si absente
INSERT INTO public.platform_settings (
  id,
  whatsapp_number,
  secondary_phone,
  instagram_url,
  facebook_url,
  telegram_url,
  baridimob_rip,
  ccp_number,
  account_holder,
  support_email,
  settings
)
VALUES (
  1,
  '+213 555 12 34 56',
  '+213 770 12 34 56',
  'https://instagram.com/asmedix_officiel',
  'https://facebook.com/asmedix_officiel',
  'https://t.me/asmedix_officiel',
  '00799999002233445566',
  '22334455 Clé 66',
  'Dr. Karim Benali',
  'contact@asmedix.dz',
  '{
    "platformName": "AS MEDIX .dz",
    "whatsapp_number": "+213 555 12 34 56",
    "secondary_phone": "+213 770 12 34 56",
    "instagram_url": "https://instagram.com/asmedix_officiel",
    "facebook_url": "https://facebook.com/asmedix_officiel",
    "telegram_url": "https://t.me/asmedix_officiel",
    "baridimob_rip": "00799999002233445566",
    "ccp_number": "22334455 Clé 66",
    "account_holder": "Dr. Karim Benali",
    "support_email": "contact@asmedix.dz",
    "proPlanPrice": 4500,
    "premiumPlanPrice": 7000
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW();
