-- ==============================================================================
-- AS-MEDIX — MIGRATION: store.ts -> Supabase
-- Copiez-collez ce SQL dans: Supabase -> SQL Editor -> Run
-- ==============================================================================

-- 1. RAPPELS DE REVISION (study_reminders)
CREATE TABLE IF NOT EXISTS public.study_reminders (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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
CREATE POLICY "Users manage own reminders" ON public.study_reminders
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user ON public.study_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON public.study_reminders(status);

-- 2. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system',
  read BOOLEAN DEFAULT false,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own or global notifications" ON public.notifications
  FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Anyone can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- 3. MESSAGES UTILISATEURS
CREATE TABLE IF NOT EXISTS public.user_messages (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_email TEXT,
  user_phone TEXT,
  profession TEXT,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'UNREAD' CHECK (status IN ('UNREAD', 'IN_PROGRESS', 'RESOLVED')),
  reply_note TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert messages" ON public.user_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own messages" ON public.user_messages
  FOR SELECT USING (auth.uid() = user_id);

-- 4. PROTOCOLES MODE GARDE
CREATE TABLE IF NOT EXISTS public.garde_protocols (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Siren',
  badge TEXT,
  description TEXT,
  html_content TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.garde_protocols ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Garde protocols readable by all" ON public.garde_protocols
  FOR SELECT USING (true);

-- 5. SOURCES PERSONNALISEES
CREATE TABLE IF NOT EXISTS public.custom_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_key TEXT NOT NULL UNIQUE,
  faculty TEXT DEFAULT 'TOUS',
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.custom_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Custom sources readable by all" ON public.custom_sources
  FOR SELECT USING (true);

-- 6. PARAMETRES PLATEFORME
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings readable by all" ON public.platform_settings
  FOR SELECT USING (true);
INSERT INTO public.platform_settings (id, settings)
VALUES (1, '{"platformName":"AS MEDIX .dz","proPlanPrice":4500,"premiumPlanPrice":7000,"maintenanceMode":false}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 7. ECG RECORDS
CREATE TABLE IF NOT EXISTS public.ecg_records (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  specialty_id TEXT,
  diagnosis TEXT,
  difficulty TEXT DEFAULT 'intermediate',
  image_url TEXT,
  explanation TEXT,
  is_daily_challenge BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.ecg_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ECG readable by all" ON public.ecg_records
  FOR SELECT USING (true);


