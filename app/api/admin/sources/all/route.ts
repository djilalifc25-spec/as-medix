import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from('custom_sources').select('*').order('updated_at', { ascending: false });
    if (error) throw error;

    const scopes = (data || []).map((row: any) => {
      const [base, fac] = row.scope_key.split('::');
      const faculty = fac || undefined;
      if (base === '__global__') return { key: row.scope_key, faculty, sources: row.sources };
      const parts = base.split('__');
      if (parts.length === 2) return { key: row.scope_key, specialty: parts[0], course: parts[1], faculty, sources: row.sources };
      return { key: row.scope_key, specialty: parts[0], faculty, sources: row.sources };
    });

    return NextResponse.json({ scopes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
