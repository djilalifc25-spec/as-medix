import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mkaqspqmdspoisdjduza.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_tyOYBYbiwqKBAsRMSijtMQ_gQ9cEL_3';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
