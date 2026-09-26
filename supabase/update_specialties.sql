-- ==============================================================================
-- AS-MEDIX: MIGRATION SUPABASE - NOUVELLES SPÉCIALITÉS & 6 ANNÉES MÉDICALES
-- À coller dans : https://supabase.com/dashboard/project/mkaqspqmdspoisdjduza/sql/new
-- Puis cliquer sur "Run"
-- ==============================================================================

-- 1. CRÉATION DE LA TABLE DES SPÉCIALITÉS
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

-- 1b. CRÉATION DE LA TABLE DES FICHES FLASH SI INEXISTANTE
CREATE TABLE IF NOT EXISTS public.fiches (
    id TEXT PRIMARY KEY,
    slug TEXT,
    title TEXT NOT NULL,
    specialty_id TEXT NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    year INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1c. TABLE DES RÉINITIALISATIONS DE MOT DE PASSE (CODES DE VÉRIFICATION OTP 6 CHIFFRES)
CREATE TABLE IF NOT EXISTS public.password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MISES À JOUR SÉCURISÉES DES TABLES EXISTANTES (Ajout des colonnes year & specialty_id)
ALTER TABLE IF EXISTS public.courses ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE IF EXISTS public.courses ADD COLUMN IF NOT EXISTS specialty_id TEXT;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'specialty') THEN
    UPDATE public.courses SET specialty_id = specialty WHERE specialty_id IS NULL AND specialty IS NOT NULL;
  END IF;
END $$;

ALTER TABLE IF EXISTS public.qcms ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE IF EXISTS public.qcms ADD COLUMN IF NOT EXISTS specialty_id TEXT;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'qcms' AND column_name = 'specialty') THEN
    UPDATE public.qcms SET specialty_id = specialty WHERE specialty_id IS NULL AND specialty IS NOT NULL;
  END IF;
END $$;

ALTER TABLE IF EXISTS public.cat_protocols ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE IF EXISTS public.fiches ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS raw_password TEXT;

-- 3. INDEXES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_specialties_slug ON public.specialties(slug);
CREATE INDEX IF NOT EXISTS idx_specialties_year ON public.specialties(year);
CREATE INDEX IF NOT EXISTS idx_specialties_faculty ON public.specialties(faculty);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') THEN
    CREATE INDEX IF NOT EXISTS idx_courses_year ON public.courses(year);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'password_resets') THEN
    CREATE INDEX IF NOT EXISTS idx_password_resets_email ON public.password_resets(email);
    CREATE INDEX IF NOT EXISTS idx_password_resets_code ON public.password_resets(code);
  END IF;
END $$;

-- 4. SÉCURITÉ ROW LEVEL SECURITY (RLS)
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Specialties are viewable by everyone" ON public.specialties;
CREATE POLICY "Specialties are viewable by everyone" ON public.specialties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert specialties" ON public.specialties;
CREATE POLICY "Admins can insert specialties" ON public.specialties FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update specialties" ON public.specialties;
CREATE POLICY "Admins can update specialties" ON public.specialties FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete specialties" ON public.specialties;
CREATE POLICY "Admins can delete specialties" ON public.specialties FOR DELETE USING (true);

ALTER TABLE IF EXISTS public.fiches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Fiches are viewable by everyone" ON public.fiches;
CREATE POLICY "Fiches are viewable by everyone" ON public.fiches FOR SELECT USING (true);

ALTER TABLE IF EXISTS public.password_resets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role manages password resets" ON public.password_resets;
CREATE POLICY "Service role manages password resets" ON public.password_resets FOR ALL USING (true);

-- 5. PEUPLEMENT / SYNCHRONISATION DES 47 SPÉCIALITÉS (6 ANNÉES + TRANSVERSALES)
INSERT INTO public.specialties (
    id, slug, name, short_name, icon_name, color, description, year, faculty, total_courses, total_qcms, total_cat, total_fiches
) VALUES
  ('cardio', 'cardiologie', 'Cardiologie', 'Cardio', 'HeartPulse', '#EF4444', 'Pathologies cardiovasculaires, coronaropathies, valvulopathies, insuffisance cardiaque et ECG.', 4, 'TOUS', 2, 3, 3, 0),
  ('pneumo', 'pneumologie', 'Pneumologie', 'Pneumo', 'Wind', '#06B6D4', 'Tuberculose, asthme, BPCO, pneumopathies infectieuses, embolie pulmonaire et EFR.', 4, 'TOUS', 2, 3, 3, 0),
  ('neuro', 'neurologie', 'Neurologie', 'Neuro', 'Brain', '#8B5CF6', 'Accidents vasculaires cérébraux, épilepsies, céphalées, sclérose en plaques et neuropathies.', 4, 'TOUS', 1, 1, 7, 1),
  ('nephro', 'nephrologie', 'Néphrologie', 'Néphro', 'ActivitySquare', '#3B82F6', 'Insuffisance rénale aiguë et chronique, néphropathies glomérulaires et troubles ioniques.', 4, 'TOUS', 1, 1, 0, 1),
  ('endocrino', 'endocrinologie', 'Endocrinologie - Diabétologie', 'Endocrino', 'Flame', '#F59E0B', 'Diabète de type 1 et 2, dysthyroïdies, pathologies surrénaliennes et hypophysaires.', 4, 'TOUS', 1, 1, 0, 1),
  ('gastro', 'gastro-enterologie', 'Gastro-entérologie & Hépatologie', 'Gastro', 'Utensils', '#10B981', 'Ulcères gastroduodénaux, cirrhose, hépatites virales, MICI et hémorragies digestives.', 4, 'TOUS', 1, 1, 5, 1),
  ('pediatrie', 'pediatrie', 'Pédiatrie', 'Pédiatrie', 'Baby', '#EC4899', 'Développement psychomoteur, déshydratation aiguë, bronchiolite, méningites de l''enfant.', 5, 'TOUS', 1, 1, 5, 1),
  ('gyneco', 'gynecologie-obstetrique', 'Gynécologie - Obstétrique', 'Gynéco', 'HeartHandshake', '#F43F5E', 'Grossesse extra-utérine, pré-éclampsie, hémorragie de la délivrance, cancers gynécologiques.', 5, 'TOUS', 1, 1, 0, 0),
  ('dermato', 'dermatologie', 'Dermatologie - Vénérologie', 'Dermato', 'Sparkles', '#EAB308', 'Psoriasis, eczéma, toxidermies médicamenteuses graves, mélanome et infections cutanées.', 6, 'TOUS', 1, 1, 3, 0),
  ('infectieux', 'infectiologie', 'Infectiologie', 'Infectio', 'Bug', '#14B8A6', 'Sepsis, choc septique, antibiothérapie probabiliste, paludisme, fièvres typhoïdes et méningites.', 4, 'TOUS', 1, 1, 1, 0),
  ('hemato', 'hematologie', 'Hématologie Clinique', 'Hémato', 'Droplet', '#BE123C', 'Anémies de l''adulte et de l''enfant, leucémies aiguës, lymphomes, troubles de l''hémostase.', 4, 'TOUS', 1, 1, 0, 0),
  ('rhumato', 'rhumatologie', 'Rhumatologie', 'Rhumato', 'Bone', '#84CC16', 'Polyarthrite rhumatoïde, spondyloarthrites, arthrites septiques, goutte et lombalgies.', 5, 'TOUS', 1, 1, 1, 0),
  ('psy', 'psychiatrie', 'Psychiatrie', 'Psychiatrie', 'Smile', '#6366F1', 'Troubles de l''humeur, schizophrénie, crises d''angoisse aiguës, urgences suicidaires.', 5, 'TOUS', 1, 1, 0, 0),
  ('ophtalmo', 'ophtalmologie', 'Ophtalmologie', 'Ophtalmo', 'Eye', '#0284C7', 'Glaucome aigu par fermeture de l''angle, décollement de rétine, œil rouge et douloureux.', 6, 'TOUS', 1, 1, 1, 0),
  ('orl', 'orl', 'O.R.L. & Chirurgie Cervico-Faciale', 'ORL', 'Headphones', '#A855F7', 'Épistaxis grave, dyspnée laryngée, sinusites compliquées, vertiges périphériques.', 6, 'TOUS', 1, 1, 4, 0),
  ('urgences', 'urgences-reanimation', 'Urgences & Réanimation', 'Urgences', 'Siren', '#DC2626', 'Arrêt cardiorespiratoire, états de choc, coma non traumatique, détresse respiratoire aiguë.', 6, 'TOUS', 1, 1, 0, 1),
  ('chirurgie', 'chirurgie-generale', 'Chirurgie Générale & Viscérale', 'Chirurgie', 'Scissors', '#D97706', 'Appendicite aiguë, péritonite, occlusion intestinale, traumatismes abdominaux et hernies.', 5, 'TOUS', 1, 1, 0, 1),
  ('uro', 'urologie', 'Urologie', 'Urologie', 'ShieldAlert', '#059669', 'Colique néphrétique aiguë, torsion du cordon spermatique, rétention aiguë d''urine, cancer prostate.', 5, 'TOUS', 1, 1, 2, 1),
  ('ortho', 'orthopedie-traumatologie', 'Orthopédie & Traumatologie', 'Ortho', 'Footprints', '#78716C', 'Fractures ouvertes, luxations articulaires, syndrome des loges, polytraumatisme.', 5, 'TOUS', 1, 1, 1, 0),
  ('interne', 'medecine-interne', 'Médecine Interne', 'Méd Interne', 'Compass', '#475569', 'Lupus érythémateux systémique, maladie de Horton, vascularites systémiques et amylose.', 6, 'TOUS', 1, 1, 0, 0),
  ('anat_1', 'anatomie-1', 'Anatomie I (Généralités & Membres)', 'Anatomie I', 'Bone', '#3B82F6', 'Ostéologie, arthrologie, myologie et vascularisation des membres supérieur et inférieur.', 1, 'TOUS', 0, 0, 0, 0),
  ('cyto_embryo', 'cytologie-embryologie', 'Cytologie & Embryologie', 'Cyto-Embryo', 'Sparkles', '#8B5CF6', 'Structure cellulaire, organites, gamétogenèse, fécondation et 4 premières semaines de développement.', 1, 'TOUS', 0, 0, 0, 0),
  ('histo_1', 'histologie-generale', 'Histologie Générale', 'Histologie I', 'Layers', '#06B6D4', 'Tissus fondamentaux : épithéliums, conjonctifs, musculaires, nerveux et sanguins.', 1, 'TOUS', 0, 0, 0, 0),
  ('biochim_1', 'biochimie-structurale', 'Biochimie Structurale', 'Biochimie I', 'Atom', '#10B981', 'Structure et propriétés des glucides, lipides, acides aminés, protéines et acides nucléiques.', 1, 'TOUS', 0, 0, 0, 0),
  ('biophysique', 'biophysique', 'Biophysique Médicale', 'Biophysique', 'Activity', '#F59E0B', 'Optique médicale, rayonnements ionisants, imagerie, hémodynamique et solutions.', 1, 'TOUS', 0, 0, 0, 0),
  ('physio_1', 'physiologie-generale', 'Physiologie Générale', 'Physiologie I', 'HeartPulse', '#EF4444', 'Milieu intérieur, transport membranaire, électrophysiologie cellulaire et potentiels d action.', 1, 'TOUS', 0, 0, 0, 0),
  ('chimie', 'chimie-medicale', 'Chimie Médicale & Organique', 'Chimie', 'FlaskConical', '#14B8A6', 'Chimie générale en solution, équilibres acido-basiques, oxydoréduction et fonctions organiques.', 1, 'TOUS', 0, 0, 0, 0),
  ('sante_pub_1', 'sante-publique-1', 'Santé Publique & Biostatistiques', 'Santé Publique I', 'BookOpen', '#6366F1', 'Démographie médicale, statistiques descriptives, probabilités et système de santé algérien.', 1, 'TOUS', 0, 0, 0, 0),
  ('anat_2', 'anatomie-2', 'Anatomie II (Tronc & Tête-Cou)', 'Anatomie II', 'Bone', '#2563EB', 'Anatomie du thorax, abdomen, pelvis, périnée, tête et cou, et système nerveux central.', 2, 'TOUS', 0, 0, 0, 0),
  ('physio_2', 'physiologie-grandes-fonctions', 'Physiologie des Grandes Fonctions', 'Physiologie II', 'HeartPulse', '#DC2626', 'Physiologie cardiovasculaire, respiratoire, rénale, digestive, endocrinienne et neuro-sensorielle.', 2, 'TOUS', 0, 0, 0, 0),
  ('biochim_2', 'biochimie-metabolique', 'Biochimie Métabolique', 'Biochimie II', 'Atom', '#059669', 'Métabolisme glucidique, lipidique, azoté, bioénergétique et intégration métabolique.', 2, 'TOUS', 0, 0, 0, 0),
  ('histo_2', 'histologie-speciale', 'Histologie Spéciale (Organes)', 'Histologie II', 'Layers', '#0891B2', 'Organisation microscopique des appareils circulatoire, respiratoire, digestif, urinaire et génital.', 2, 'TOUS', 0, 0, 0, 0),
  ('semiologie', 'semiologie-medicale-chirurgicale', 'Sémiologie Médicale & Chirurgicale', 'Sémiologie', 'Stethoscope', '#7C3AED', 'Examen clinique méthodique, signes physiques et fonctionnels des différents appareils.', 2, 'TOUS', 0, 0, 0, 0),
  ('immuno_1', 'immunologie-fondamentale', 'Immunologie Fondamentale', 'Immunologie I', 'ShieldAlert', '#EA580C', 'Immunité innée et adaptative, antigènes, anticorps, complexe majeur d histocompatibilité.', 2, 'TOUS', 0, 0, 0, 0),
  ('genetique', 'genetique-medicale', 'Génétique Médicale', 'Génétique', 'Dna', '#D97706', 'Hérédité mendélienne, cytogénétique, anomalies chromosomiques et conseil génétique.', 2, 'TOUS', 0, 0, 0, 0),
  ('pharmaco', 'pharmacologie-generale', 'Pharmacologie Générale & Spéciale', 'Pharmacologie', 'Pill', '#BE123C', 'Pharmacocinétique, pharmacodynamie, classes thérapeutiques, interactions et effets indésirables.', 3, 'TOUS', 0, 0, 0, 0),
  ('anapath', 'anatomie-pathologique', 'Anatomie Pathologique Générale', 'Anapath', 'Microscope', '#9333EA', 'Lésions cellulaires et tissulaires, inflammation, processus tumoraux bénins et malins.', 3, 'TOUS', 0, 0, 0, 0),
  ('microbio', 'microbiologie-bacterio-viro', 'Microbiologie (Bactériologie & Virologie)', 'Microbiologie', 'Bug', '#0D9488', 'Bactéries pathogènes, virus à ADN et ARN, diagnostic virologique et antibiogramme.', 3, 'TOUS', 0, 0, 0, 0),
  ('parasito', 'parasitologie-mycologie', 'Parasitologie & Mycologie', 'Parasitologie', 'Bug', '#65A30D', 'Protozoaires, helminthes, champignons opportunistes, diagnostic et cycles parasitaires.', 3, 'TOUS', 0, 0, 0, 0),
  ('immuno_clin', 'immunologie-clinique', 'Immunologie Clinique', 'Immuno Clinique', 'ShieldAlert', '#C026D3', 'Hypersensibilités, maladies auto-immunes, déficits immunitaires et immunopathologie.', 3, 'TOUS', 0, 0, 0, 0),
  ('physiopath', 'physiopathologie', 'Physiopathologie Générale', 'Physiopathologie', 'ActivitySquare', '#E11D48', 'Mécanismes des désordres acido-basiques, hydro-électrolytiques, ischémie et choc.', 3, 'TOUS', 0, 0, 0, 0),
  ('therapeutique', 'therapeutique-medicale', 'Thérapeutique Médicale & Urgences', 'Thérapeutique', 'Pill', '#EA580C', 'Prescription raisonnée, antibiothérapie probabiliste, antalgiques, anticoagulants et interactions.', 6, 'TOUS', 0, 0, 0, 0),
  ('med_legale', 'medecine-legale-droit', 'Médecine Légale & Droit Médical', 'Méd Légale', 'Scale', '#64748B', 'Certificats médicaux, secret médical, thanatologie, blessures et responsabilité médicale.', 6, 'TOUS', 0, 0, 0, 0),
  ('med_travail', 'medecine-du-travail', 'Médecine du Travail & Toxicologie', 'Méd Travail', 'Briefcase', '#71717A', 'Maladies professionnelles, accidents du travail, intoxications au CO, plomb et solvants.', 6, 'TOUS', 0, 0, 0, 0),
  ('epidemiologie', 'epidemiologie-clinique', 'Épidémiologie & Médecine Préventive', 'Épidémiologie', 'BarChart2', '#0284C7', 'Études épidémiologiques, enquêtes de prévalence, incidence, facteurs de risque et dépistage.', 6, 'TOUS', 0, 0, 0, 0),
  ('sante-publique-epidemiologie', 'sante-publique-epidemiologie', 'Santé Publique & Épidémiologie', 'Santé Publique', 'BookOpen', '#3B82F6', '', NULL, 'TOUS', 1, 1, 0, 0),
  ('ferfreff', 'ferfreff', 'ferfreff', 'frefr', 'BookOpen', '#EC4899', '', NULL, 'TOUS', 0, 0, 0, 0)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    short_name = EXCLUDED.short_name,
    icon_name = EXCLUDED.icon_name,
    color = EXCLUDED.color,
    description = EXCLUDED.description,
    year = EXCLUDED.year,
    faculty = EXCLUDED.faculty,
    total_courses = EXCLUDED.total_courses,
    total_qcms = EXCLUDED.total_qcms,
    total_cat = EXCLUDED.total_cat,
    total_fiches = EXCLUDED.total_fiches,
    updated_at = NOW();

-- 6. PROPAGATION AUTOMATIQUE DE L'ANNÉE AUX COURS ET QCMS EXISTANTS (Sécurisée)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') THEN
    EXECUTE 'UPDATE public.courses c SET year = s.year FROM public.specialties s WHERE (c.specialty = s.id OR c.specialty_id = s.id) AND (c.year IS NULL OR c.year != s.year) AND s.year IS NOT NULL';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'qcms') THEN
    EXECUTE 'UPDATE public.qcms q SET year = s.year FROM public.specialties s WHERE (q.specialty = s.id OR q.specialty_id = s.id) AND (q.year IS NULL OR q.year != s.year) AND s.year IS NOT NULL';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cat_protocols') THEN
    EXECUTE 'UPDATE public.cat_protocols cat SET year = s.year FROM public.specialties s WHERE cat.specialty_id = s.id AND (cat.year IS NULL OR cat.year != s.year) AND s.year IS NOT NULL';
  END IF;
END $$;

-- 7. REQUÊTE DE CONTRÔLE RAPIDE
SELECT 
  COALESCE(year::text, 'Transversal (Sans année)') AS annee,
  COUNT(*) AS total_specialites,
  SUM(total_courses) AS total_cours,
  SUM(total_qcms) AS total_qcms
FROM public.specialties
GROUP BY year
ORDER BY year NULLS LAST;
