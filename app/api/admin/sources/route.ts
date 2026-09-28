import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { normalizeSourcesList, normalizeSourceItem } from '@/lib/sourceUtils';
import { StructuredSource } from '@/types';

export const dynamic = 'force-dynamic';

const STANDARD_SUB_SOURCES = ['2018', '2019', '2020', '2021', '2022', '2023'];

const DEFAULT_STRUCTURED_SOURCES: StructuredSource[] = [
  { name: 'Externat', subSources: [...STANDARD_SUB_SOURCES] },
  { name: 'Annales Résidanat', subSources: [...STANDARD_SUB_SOURCES] },
  { name: 'Hypercours', subSources: [] },
  { name: 'QCM CNP', subSources: [] },
  { name: 'SIAU', subSources: [] },
  { name: 'Livre Hygiene', subSources: [] }
];

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
      const structured = normalizeSourcesList(data?.sources || []);
      const flat = structured.map(s => s.name);
      return NextResponse.json({
        sources: flat,
        structuredSources: structured,
        specialty,
        course,
        faculty,
        year
      });
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
    const map: Record<string, any[]> = {};
    for (const row of (data || [])) map[row.scope_key] = row.sources;

    const accumulated: any[] = [];
    for (const key of keysToFetch) {
      const arr = map[key] || [];
      for (const item of arr) accumulated.push(item);
    }

    const structured = normalizeSourcesList(accumulated);
    const flat = Array.from(new Set(structured.map(s => s.name)));

    return NextResponse.json({
      sources: flat,
      structuredSources: structured,
      specialty,
      course,
      faculty,
      year
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/admin/sources
// Body options:
// 1. Add source: { name, specialty?, course?, faculty?, year?, subSources? }
// 2. Add sub-source: { parentName, subSource, specialty?, course?, faculty?, year? }
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const cookieHeader = req.headers.get('cookie') || '';
    const hasSessionCookie = cookieHeader.includes('asmedix_session');
    if (!user && !hasSessionCookie && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Acces non autorise' }, { status: 403 });
    }

    const body = await req.json();
    const { name, parentName, subSource, specialty, course, faculty, year, subSources } = body;

    const key = buildScopeKey(specialty, course, faculty, year);
    const supabase = getSupabaseServerClient();

    const { data: existing } = await supabase.from('custom_sources').select('sources').eq('scope_key', key).single();
    let structured: StructuredSource[] = normalizeSourcesList(existing?.sources && Array.isArray(existing.sources) ? existing.sources : []);

    // Case 1: Add a sub-source to a parent source
    if (parentName && subSource) {
      const cleanParent = String(parentName).trim();
      const cleanSub = String(subSource).trim();
      let found = structured.find(s => s.name.toLowerCase() === cleanParent.toLowerCase());
      if (found) {
        if (!found.subSources.includes(cleanSub)) {
          found.subSources.push(cleanSub);
          found.subSources.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        }
      } else {
        structured.push({
          name: cleanParent,
          subSources: [cleanSub]
        });
      }
    } 
    // Case 2: Add or update a whole source
    else if (name) {
      const cleanName = String(name).trim();
      let found = structured.find(s => s.name.toLowerCase() === cleanName.toLowerCase());
      const initialSubs = Array.isArray(subSources) ? subSources.map(String).map(s => s.trim()).filter(Boolean) : [];

      if (!found) {
        structured.push({
          name: cleanName,
          subSources: initialSubs
        });
      } else if (initialSubs.length > 0) {
        initialSubs.forEach(s => {
          if (!found!.subSources.includes(s)) found!.subSources.push(s);
        });
        found.subSources.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      }
    } else {
      return NextResponse.json({ error: 'Nom de source ou parentName requis' }, { status: 400 });
    }

    await supabase.from('custom_sources').upsert(
      { scope_key: key, faculty: faculty || 'TOUS', sources: structured, updated_at: new Date().toISOString() },
      { onConflict: 'scope_key' }
    );

    return NextResponse.json({
      success: true,
      structuredSources: structured,
      sources: structured.map(s => s.name),
      specialty,
      course,
      faculty,
      year
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/sources
// Body options:
// 1. Delete an entire source: { name, specialty?, course?, faculty?, year? }
// 2. Delete a single sub-source: { parentName, subSource, specialty?, course?, faculty?, year? }
export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    const cookieHeader = req.headers.get('cookie') || '';
    const hasSessionCookie = cookieHeader.includes('asmedix_session');
    if (!user && !hasSessionCookie && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Acces non autorise' }, { status: 403 });
    }

    const body = await req.json();
    const { name, parentName, subSource, specialty, course, faculty, year } = body;
    const key = buildScopeKey(specialty, course, faculty, year);
    const supabase = getSupabaseServerClient();

    const { data: existing } = await supabase.from('custom_sources').select('sources').eq('scope_key', key).single();
    let structured: StructuredSource[] = normalizeSourcesList(existing?.sources && Array.isArray(existing.sources) ? existing.sources : []);

    // Case 1: Delete a specific sub-source
    if (parentName && subSource) {
      const cleanParent = String(parentName).trim().toLowerCase();
      const cleanSub = String(subSource).trim();
      const found = structured.find(s => s.name.toLowerCase() === cleanParent);
      if (found) {
        found.subSources = found.subSources.filter(s => s !== cleanSub);
      }
    } 
    // Case 2: Delete the entire source
    else if (name) {
      const cleanName = String(name).trim().toLowerCase();
      structured = structured.filter(s => s.name.toLowerCase() !== cleanName);
    } else {
      return NextResponse.json({ error: 'Paramètre de suppression manquant' }, { status: 400 });
    }

    await supabase.from('custom_sources').upsert(
      { scope_key: key, faculty: faculty || 'TOUS', sources: structured, updated_at: new Date().toISOString() },
      { onConflict: 'scope_key' }
    );

    return NextResponse.json({
      success: true,
      structuredSources: structured,
      sources: structured.map(s => s.name)
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
