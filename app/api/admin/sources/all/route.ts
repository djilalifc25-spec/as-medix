import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { normalizeSourcesList } from '@/lib/sourceUtils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from('custom_sources').select('*').order('updated_at', { ascending: false });
    if (error) throw error;

    const scopes = (data || []).map((row: any) => {
      const [base, fac] = row.scope_key.split('::');
      const faculty = fac || undefined;
      const structured = normalizeSourcesList(row.sources || []);
      const flat = structured.map(s => s.name);

      if (base === '__global__') {
        return {
          key: row.scope_key,
          faculty,
          sources: flat,
          structuredSources: structured
        };
      }
      const parts = base.split('__');
      if (parts.length === 2) {
        return {
          key: row.scope_key,
          specialty: parts[0],
          course: parts[1],
          faculty,
          sources: flat,
          structuredSources: structured
        };
      }
      return {
        key: row.scope_key,
        specialty: parts[0],
        faculty,
        sources: flat,
        structuredSources: structured
      };
    });

    return NextResponse.json({ scopes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
