import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mkaqspqmdspoisdjduza.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_g0xxCiN0pNTYCKOwVSbP5A_RSh8hmKA';

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
