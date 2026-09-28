import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const DEFAULT_SOURCES = ['Externat', 'Annales Residanat', 'Hypercours', 'QCM CNP', 'SIAU', 'Livre Hygiene'];

function buildScopeKey(specialty?: string, course?: string, faculty?: string, year?: string): string {
  let base = '__global__';
  if (specialty && course) base = `${specialty}__${course}`;
  else if (specialty) base = specialty;
  else if (year) base = `annee_${year}`;
  if (faculty && faculty !== 'TOUS') return `${base}::${faculty}`;
  return base;
}

// GET /api/admin/sources?specialty=cardio&course=cours_1&faculty=ORAN&year=4
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const specialty = url.searchParams.get('specialty') || undefined;
    const course = url.searchParams.get('course') || undefined;
    const faculty = url.searchParams.get('faculty') || undefined;
    const year = url.searchParams.get('year') || undefined;
    const exact = url.searchParams.get('exact') === 'true';

    const supabase = getSupabaseServerClient();

    if (exact) {
      const key = buildScopeKey(specialty, course, faculty, year);
      const { data } = await supabase.from('custom_sources').select('sources').eq('scope_key', key).single();
      return NextResponse.json({ sources: data?.sources || [], specialty, course, faculty, year });
    }

    // Merged: course-level + specialty-level + year-level + global
    const keysToFetch: string[] = [];
    if (specialty && course) {
      keysToFetch.push(`${specialty}__${course}`);
      if (faculty && faculty !== 'TOUS') keysToFetch.push(`${specialty}__${course}::${faculty}`);
    }
    if (specialty) {
      keysToFetch.push(specialty);
      if (faculty && faculty !== 'TOUS') keysToFetch.push(`${specialty}::${faculty}`);
    }
    if (year) {
      keysToFetch.push(`annee_${year}`);
      if (faculty && faculty !== 'TOUS') keysToFetch.push(`annee_${year}::${faculty}`);
    }
    keysToFetch.push('__global__');
    if (faculty && faculty !== 'TOUS') keysToFetch.push(`__global__::${faculty}`);

    const { data } = await supabase.from('custom_sources').select('scope_key,sources').in('scope_key', keysToFetch);
    const map: Record<string, string[]> = {};
    for (const row of (data || [])) map[row.scope_key] = row.sources;

    const result: string[] = [...DEFAULT_SOURCES];
    for (const key of keysToFetch) {
      const arr = map[key] || [];
      for (const s of arr) if (!result.includes(s)) result.push(s);
    }

    return NextResponse.json({ sources: Array.from(new Set(result)), specialty, course, faculty, year });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/sources  body: { name, specialty?, course?, faculty?, year? }
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const cookieHeader = req.headers.get('cookie') || '';
    const hasSessionCookie = cookieHeader.includes('asmedix_session');
    if (!user && !hasSessionCookie && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Acces non autorise' }, { status: 403 });
    }
    const { name, specialty, course, faculty, year } = await req.json();
    if (!name) return NextResponse.json({ error: 'Nom de la source requis' }, { status: 400 });

    const key = buildScopeKey(specialty, course, faculty, year);
    const supabase = getSupabaseServerClient();

    // Upsert: get existing, add new name, save back
    const { data: existing } = await supabase.from('custom_sources').select('sources').eq('scope_key', key).single();
    const current: string[] = existing?.sources || [];
    const clean = name.trim();
    if (!current.includes(clean)) current.push(clean);

    await supabase.from('custom_sources').upsert({ scope_key: key, faculty: faculty || 'TOUS', sources: current, updated_at: new Date().toISOString() }, { onConflict: 'scope_key' });
    return NextResponse.json({ success: true, sources: current, specialty, course, faculty, year });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/sources  body: { name, specialty?, course?, faculty?, year? }
export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    const cookieHeader = req.headers.get('cookie') || '';
    const hasSessionCookie = cookieHeader.includes('asmedix_session');
    if (!user && !hasSessionCookie && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Acces non autorise' }, { status: 403 });
    }
    const { name, specialty, course, faculty, year } = await req.json();
    const key = buildScopeKey(specialty, course, faculty, year);
    const supabase = getSupabaseServerClient();

    const { data: existing } = await supabase.from('custom_sources').select('sources').eq('scope_key', key).single();
    const current: string[] = (existing?.sources || []).filter((s: string) => s !== name);
    await supabase.from('custom_sources').upsert({ scope_key: key, faculty: faculty || 'TOUS', sources: current, updated_at: new Date().toISOString() }, { onConflict: 'scope_key' });
    return NextResponse.json({ success: true, sources: current });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
