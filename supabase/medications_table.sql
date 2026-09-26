-- Pharmnet DZ medications table (run in Supabase SQL Editor)
CREATE TABLE IF NOT EXISTS public.medications (
  id TEXT PRIMARY KEY,
  dci TEXT NOT NULL,
  commercial_names JSONB NOT NULL DEFAULT '[]'::jsonb,
  therapeutic_class TEXT NOT NULL,
  dosage_forms JSONB NOT NULL DEFAULT '[]'::jsonb,
  indications JSONB NOT NULL DEFAULT '[]'::jsonb,
  contraindications JSONB NOT NULL DEFAULT '[]'::jsonb,
  interactions JSONB NOT NULL DEFAULT '[]'::jsonb,
  standard_posology TEXT,
  algerian_commercial_status TEXT DEFAULT 'Disponible en pharmacie',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Medications readable by authenticated" ON public.medications
  FOR SELECT USING (true);
CREATE INDEX IF NOT EXISTS idx_medications_dci ON public.medications(dci);
CREATE INDEX IF NOT EXISTS idx_medications_class ON public.medications(therapeutic_class);
