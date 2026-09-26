-- ==============================================================================
-- AS-MEDIX: TABLES MANQUANTES POUR SUPABASE
-- À coller dans https://supabase.com/dashboard/project/mkaqspqmdspoisdjduza/sql/new
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE DES 36 CONDUITES À TENIR (CAT URGENCES DR ABU IMAD)
CREATE TABLE IF NOT EXISTS public.cat_protocols (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    specialty_id TEXT NOT NULL,
    specialty_name TEXT NOT NULL,
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

-- 3. TABLE DES PROFILS UTILISATEURS ÉTANCHES
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE DES ABONNÉS RÉELS (SUBSCRIPTIONS)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('PRO', 'PREMIUM')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'PENDING', 'CANCELLED')),
    payment_method TEXT DEFAULT 'BARIDIMOB' CHECK (payment_method IN ('BARIDIMOB', 'CCP', 'CARD', 'ADMIN_MANUAL')),
    transaction_id TEXT,
    amount_da NUMERIC(10, 2) NOT NULL DEFAULT 4500.00,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DEMANDES DE PAIEMENT BARIDIMOB / CCP
CREATE TABLE IF NOT EXISTS public.payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

-- 6. INDEX DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_cat_protocols_slug ON public.cat_protocols(slug);
CREATE INDEX IF NOT EXISTS idx_cat_protocols_specialty ON public.cat_protocols(specialty_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- 7. SÉCURITÉ ROW LEVEL SECURITY (RLS)
ALTER TABLE public.cat_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CAT Protocols are public" ON public.cat_protocols FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own payment requests" ON public.payment_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own payment requests" ON public.payment_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
