-- ==============================================================================
-- AS-MEDIX MEDICAL PLATFORM - SUPABASE PRODUCTION SCHEMA
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

-- 3. SUBSCRIPTIONS TABLE (Real Subscribers / Abonnés)
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

-- 4. SPÉCIALITÉS MÉDICALES (6 ANNÉES & MODULES TRANSVERSAUX)
CREATE TABLE IF NOT EXISTS public.specialties (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
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

-- 5. CONDUITES À TENIR (CAT URGENCES DR ABU IMAD)
CREATE TABLE IF NOT EXISTS public.cat_protocols (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
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

-- 5. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
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

-- 6. QCM QUESTION BANK TABLE
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

-- 7. QCM ATTEMPTS TABLE (Per-User History)
CREATE TABLE IF NOT EXISTS public.qcm_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    qcm_id TEXT NOT NULL,
    user_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_correct BOOLEAN NOT NULL,
    score_percentage NUMERIC(5, 2) NOT NULL,
    time_spent_seconds INTEGER DEFAULT 0,
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FICHES FLASH
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

-- 9. PAYMENT REQUESTS (BaridiMob & CCP Uploads)
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

-- 9b. PASSWORD RESETS (CODES OTP À 6 CHIFFRES)
CREATE TABLE IF NOT EXISTS public.password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_password_resets_email ON public.password_resets(email);
CREATE INDEX IF NOT EXISTS idx_password_resets_code ON public.password_resets(code);

-- 10. REAL-TIME INDEXES FOR HIGH PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_specialties_slug ON public.specialties(slug);
CREATE INDEX IF NOT EXISTS idx_specialties_year ON public.specialties(year);
CREATE INDEX IF NOT EXISTS idx_specialties_faculty ON public.specialties(faculty);
CREATE INDEX IF NOT EXISTS idx_cat_protocols_slug ON public.cat_protocols(slug);
CREATE INDEX IF NOT EXISTS idx_cat_protocols_specialty ON public.cat_protocols(specialty_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_specialty ON public.courses(specialty_id);
CREATE INDEX IF NOT EXISTS idx_qcms_specialty ON public.qcms(specialty_id);
CREATE INDEX IF NOT EXISTS idx_qcms_course ON public.qcms(course_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_qcm_attempts_user ON public.qcm_attempts(user_id);

-- 11. AUTOMATIC PROFILE CREATION TRIGGER (When a user signs up via Supabase Auth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, plan)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'STUDENT'),
    COALESCE(new.raw_user_meta_data->>'plan', 'FREE')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qcm_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cat_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qcms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view, users can update own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Subscriptions: User can view their own, service role / admin can manage
CREATE POLICY "Users view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Medical Content: Readable by all authenticated / public users
CREATE POLICY "Specialties are public" ON public.specialties FOR SELECT USING (true);
CREATE POLICY "CAT Protocols are public" ON public.cat_protocols FOR SELECT USING (true);
CREATE POLICY "Courses are public" ON public.courses FOR SELECT USING (true);
CREATE POLICY "QCMs are public" ON public.qcms FOR SELECT USING (true);
CREATE POLICY "Fiches are public" ON public.fiches FOR SELECT USING (true);

-- User Progress: Strictly isolated to each individual user
CREATE POLICY "Users view own QCM attempts" ON public.qcm_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own QCM attempts" ON public.qcm_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payment Requests
CREATE POLICY "Users view own payment requests" ON public.payment_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own payment requests" ON public.payment_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
