-- ==============================================================================
-- AS-MEDIX .dz — UPDATE QCMS TABLE SCHEMA IN SUPABASE
-- Run this script in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.qcms (
    id TEXT PRIMARY KEY,
    specialty_id TEXT NOT NULL DEFAULT 'cardio',
    specialty_name TEXT NOT NULL DEFAULT 'Cardiologie',
    question TEXT NOT NULL DEFAULT 'Question',
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_answers JSONB NOT NULL DEFAULT '[0]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist
ALTER TABLE public.qcms
  ADD COLUMN IF NOT EXISTS specialty TEXT DEFAULT 'cardio',
  ADD COLUMN IF NOT EXISTS specialty_id TEXT DEFAULT 'cardio',
  ADD COLUMN IF NOT EXISTS specialty_name TEXT DEFAULT 'Cardiologie',
  ADD COLUMN IF NOT EXISTS course_id TEXT,
  ADD COLUMN IF NOT EXISTS course_title TEXT,
  ADD COLUMN IF NOT EXISTS question TEXT,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS vignette TEXT,
  ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS correct_answers JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS explanation TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS faculty TEXT DEFAULT 'TOUS',
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS rang TEXT DEFAULT 'Rang A',
  ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'Moyen',
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'SINGLE',
  ADD COLUMN IF NOT EXISTS reference TEXT,
  ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'FREE';

-- Disable strict RLS blocking for public QCM bank
ALTER TABLE public.qcms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Qcms readable by all" ON public.qcms;
CREATE POLICY "Qcms readable by all" ON public.qcms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Qcms modifiable by all" ON public.qcms;
CREATE POLICY "Qcms modifiable by all" ON public.qcms FOR ALL USING (true);

-- Ensure custom_sources table exists
CREATE TABLE IF NOT EXISTS public.custom_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope_key TEXT NOT NULL UNIQUE,
    faculty TEXT DEFAULT 'TOUS',
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.custom_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Custom sources readable by all" ON public.custom_sources;
CREATE POLICY "Custom sources readable by all" ON public.custom_sources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Custom sources modifiable by all" ON public.custom_sources;
CREATE POLICY "Custom sources modifiable by all" ON public.custom_sources FOR ALL USING (true);

-- Indexes for real-time fast lookups by specialty and course
CREATE INDEX IF NOT EXISTS idx_qcms_specialty ON public.qcms(specialty_id);
CREATE INDEX IF NOT EXISTS idx_qcms_course ON public.qcms(course_id);
CREATE INDEX IF NOT EXISTS idx_qcms_source ON public.qcms(source);
