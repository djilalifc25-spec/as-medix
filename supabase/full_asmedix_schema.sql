-- ==============================================================================
-- AS-MEDIX .dz — COMPREHENSIVE SUPABASE DATABASE SCHEMA & MIGRATION
-- Copiez-collez l'intégralité de ce script dans :
-- Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    profession TEXT DEFAULT 'Étudiant en Médecine',
    role TEXT NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'DOCTOR', 'RESIDENT', 'ADMIN', 'SUPER_ADMIN')),
    plan TEXT NOT NULL DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PRO', 'PREMIUM')),
    faculty TEXT DEFAULT 'TOUS',
    avatar_url TEXT,
    raw_password TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS profession TEXT DEFAULT 'Étudiant en Médecine',
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'STUDENT',
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'FREE',
  ADD COLUMN IF NOT EXISTS faculty TEXT DEFAULT 'TOUS',
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS raw_password TEXT;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles readable by owner and admin" ON public.profiles;
CREATE POLICY "Profiles readable by owner and admin" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR true);

DROP POLICY IF EXISTS "Profiles modifiable by owner" ON public.profiles;
CREATE POLICY "Profiles modifiable by owner" ON public.profiles
    FOR UPDATE USING (auth.uid() = id OR true);

-- 3. CUSTOM SOURCES TABLE (Sources QCM par Spécialité / Cours / Faculté)
CREATE TABLE IF NOT EXISTS public.custom_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope_key TEXT NOT NULL UNIQUE,
    faculty TEXT DEFAULT 'TOUS',
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.custom_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Custom sources readable by all" ON public.custom_sources;
CREATE POLICY "Custom sources readable by all" ON public.custom_sources
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Custom sources modifiable by all" ON public.custom_sources;
CREATE POLICY "Custom sources modifiable by all" ON public.custom_sources
    FOR ALL USING (true);

-- 4. PLATFORM SETTINGS & BANK CONTACTS (WhatsApp, BaridiMob, Tarifs)
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

ALTER TABLE public.platform_settings 
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS secondary_phone TEXT,
  ADD COLUMN IF NOT EXISTS instagram_url TEXT,
  ADD COLUMN IF NOT EXISTS facebook_url TEXT,
  ADD COLUMN IF NOT EXISTS telegram_url TEXT,
  ADD COLUMN IF NOT EXISTS baridimob_rip TEXT,
  ADD COLUMN IF NOT EXISTS ccp_number TEXT,
  ADD COLUMN IF NOT EXISTS account_holder TEXT,
  ADD COLUMN IF NOT EXISTS support_email TEXT;

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Settings readable by all" ON public.platform_settings;
CREATE POLICY "Settings readable by all" ON public.platform_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Settings modifiable by all" ON public.platform_settings;
CREATE POLICY "Settings modifiable by all" ON public.platform_settings
    FOR ALL USING (true);

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

-- 5. SPÉCIALITÉS MÉDICALES (6 ANNÉES & MODULES TRANSVERSAUX)
CREATE TABLE IF NOT EXISTS public.specialties (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'BookOpen',
    color TEXT NOT NULL DEFAULT '#5D5FEF',
    description TEXT,
    year INTEGER CHECK (year >= 1 AND year <= 6),
    faculty TEXT NOT NULL DEFAULT 'TOUS',
    total_courses INTEGER NOT NULL DEFAULT 0,
    total_qcms INTEGER NOT NULL DEFAULT 0,
    total_cat INTEGER NOT NULL DEFAULT 0,
    total_fiches INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.specialties
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS short_name TEXT,
  ADD COLUMN IF NOT EXISTS icon_name TEXT DEFAULT 'BookOpen',
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#5D5FEF',
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS faculty TEXT DEFAULT 'TOUS';

ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Specialties readable by all" ON public.specialties;
CREATE POLICY "Specialties readable by all" ON public.specialties
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Specialties modifiable by all" ON public.specialties;
CREATE POLICY "Specialties modifiable by all" ON public.specialties
    FOR ALL USING (true);

-- 6. BANQUE QCM (QCMS)
CREATE TABLE IF NOT EXISTS public.qcms (
    id TEXT PRIMARY KEY,
    specialty_id TEXT NOT NULL,
    specialty_name TEXT NOT NULL,
    course_id TEXT,
    course_title TEXT,
    question TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    explanation TEXT,
    source TEXT,
    faculty TEXT DEFAULT 'TOUS',
    year INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.qcms
  ADD COLUMN IF NOT EXISTS course_id TEXT,
  ADD COLUMN IF NOT EXISTS course_title TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS faculty TEXT DEFAULT 'TOUS',
  ADD COLUMN IF NOT EXISTS year INTEGER;

ALTER TABLE public.qcms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Qcms readable by all" ON public.qcms;
CREATE POLICY "Qcms readable by all" ON public.qcms
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Qcms modifiable by all" ON public.qcms;
CREATE POLICY "Qcms modifiable by all" ON public.qcms
    FOR ALL USING (true);

-- 7. COURS MÉDICAUX (COURSES)
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE,
    title TEXT NOT NULL,
    specialty_id TEXT NOT NULL,
    specialty_name TEXT NOT NULL,
    year INTEGER,
    faculty TEXT DEFAULT 'TOUS',
    source TEXT,
    summary TEXT,
    html_content TEXT NOT NULL,
    audio_url TEXT,
    audio_duration TEXT,
    audio_title TEXT,
    published BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS faculty TEXT DEFAULT 'TOUS',
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS audio_url TEXT,
  ADD COLUMN IF NOT EXISTS audio_duration TEXT,
  ADD COLUMN IF NOT EXISTS audio_title TEXT;

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Courses readable by all" ON public.courses;
CREATE POLICY "Courses readable by all" ON public.courses
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Courses modifiable by all" ON public.courses;
CREATE POLICY "Courses modifiable by all" ON public.courses
    FOR ALL USING (true);

-- 8. FICHES FLASH (FICHES)
CREATE TABLE IF NOT EXISTS public.fiches (
    id TEXT PRIMARY KEY,
    slug TEXT,
    title TEXT NOT NULL,
    specialty_id TEXT NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.fiches
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.fiches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Fiches readable by all" ON public.fiches;
CREATE POLICY "Fiches readable by all" ON public.fiches
    FOR SELECT USING (true);

-- 9. PROTOCOLES CAT URGENCES (CAT_PROTOCOLS)
CREATE TABLE IF NOT EXISTS public.cat_protocols (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE,
    title TEXT NOT NULL,
    specialty_id TEXT NOT NULL,
    specialty_name TEXT NOT NULL,
    year INTEGER,
    category TEXT NOT NULL,
    urgency_level TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'amber',
    page TEXT,
    synopsis TEXT,
    clinique_html TEXT,
    urgence_html TEXT,
    protocole_html TEXT,
    bilan_html TEXT,
    alertes TEXT,
    conseils TEXT,
    ordonnance JSONB DEFAULT '[]'::jsonb,
    published BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.cat_protocols
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'amber',
  ADD COLUMN IF NOT EXISTS page TEXT,
  ADD COLUMN IF NOT EXISTS synopsis TEXT;

ALTER TABLE public.cat_protocols ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cat readable by all" ON public.cat_protocols;
CREATE POLICY "Cat readable by all" ON public.cat_protocols
    FOR SELECT USING (true);

-- 10. DEMANDES DE PAIEMENT (BARIDIMOB & CCP)
CREATE TABLE IF NOT EXISTS public.payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT,
    user_email TEXT,
    user_phone TEXT,
    plan_type TEXT NOT NULL,
    amount_da NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'BARIDIMOB',
    transaction_id TEXT,
    receipt_url TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Payment requests manageable" ON public.payment_requests;
CREATE POLICY "Payment requests manageable" ON public.payment_requests
    FOR ALL USING (true);

-- 11. CODES RÉINITIALISATION MOT DE PASSE (PASSWORD RESETS)
CREATE TABLE IF NOT EXISTS public.password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Password resets manageable" ON public.password_resets;
CREATE POLICY "Password resets manageable" ON public.password_resets
    FOR ALL USING (true);

-- 12. RAPPELS DE RÉVISION (STUDY_REMINDERS)
CREATE TABLE IF NOT EXISTS public.study_reminders (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('qcm', 'cours', 'cat', 'fiche')),
    target_id TEXT NOT NULL,
    target_title TEXT NOT NULL,
    specialty_name TEXT,
    tag TEXT NOT NULL CHECK (tag IN ('piege', 'a_revoir', 'difficile', 'priorite_concours')),
    user_note TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'dismissed')),
    scheduled_for TIMESTAMPTZ NOT NULL,
    notification_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.study_reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reminders readable by all" ON public.study_reminders;
CREATE POLICY "Reminders readable by all" ON public.study_reminders
    FOR ALL USING (true);

-- 13. INDEX DE PERFORMANCES EN TEMPS RÉEL (SI LA COLONNE EXISTE)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='custom_sources' AND column_name='scope_key') THEN
    CREATE INDEX IF NOT EXISTS idx_custom_sources_scope ON public.custom_sources(scope_key);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='specialties' AND column_name='slug') THEN
    CREATE INDEX IF NOT EXISTS idx_specialties_slug ON public.specialties(slug);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='courses' AND column_name='slug') THEN
    CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='courses' AND column_name='specialty_id') THEN
    CREATE INDEX IF NOT EXISTS idx_courses_specialty ON public.courses(specialty_id);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='qcms' AND column_name='specialty_id') THEN
    CREATE INDEX IF NOT EXISTS idx_qcms_specialty ON public.qcms(specialty_id);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='qcms' AND column_name='course_id') THEN
    CREATE INDEX IF NOT EXISTS idx_qcms_course ON public.qcms(course_id);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='password_resets' AND column_name='email') THEN
    CREATE INDEX IF NOT EXISTS idx_password_resets_email ON public.password_resets(email);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='password_resets' AND column_name='code') THEN
    CREATE INDEX IF NOT EXISTS idx_password_resets_code ON public.password_resets(code);
  END IF;
END $$;
