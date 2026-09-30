import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mkaqspqmdspoisdjduza.supabase.co';
// Use service role key directly — no format filtering (service keys can start with any prefix)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_tyOYBYbiwqKBAsRMSijtMQ_gQ9cEL_3';

// Server-side admin client that bypasses RLS for administrative stats & data operations
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
  }
});

