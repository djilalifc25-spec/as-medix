import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mkaqspqmdspoisdjduza.supabase.co';
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const validServiceKey = (rawKey && !rawKey.startsWith('sb_secret_')) ? rawKey : null;
const supabaseServiceKey = validServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_tyOYBYbiwqKBAsRMSijtMQ_gQ9cEL_3';

export const getSupabaseServerClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false
    }
  });
};
