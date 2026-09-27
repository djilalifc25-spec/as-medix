-- ==============================================================================
-- AS-MEDIX MEDICAL PLATFORM - MIGRATION FOR USER COURSE HIGHLIGHTS & NOTES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.user_course_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_slug TEXT NOT NULL,
    item_title TEXT,
    selected_text TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT 'yellow' CHECK (color IN ('yellow', 'green', 'pink', 'blue')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_user_course_highlights_user ON public.user_course_highlights(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_highlights_slug ON public.user_course_highlights(item_slug);
CREATE INDEX IF NOT EXISTS idx_user_course_highlights_user_slug ON public.user_course_highlights(user_id, item_slug);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.user_course_highlights ENABLE ROW LEVEL SECURITY;

-- POLICIES: Users can view, insert, update, and delete only their own highlights
CREATE POLICY "Users view own highlights" ON public.user_course_highlights 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own highlights" ON public.user_course_highlights 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own highlights" ON public.user_course_highlights 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own highlights" ON public.user_course_highlights 
    FOR DELETE USING (auth.uid() = user_id);
