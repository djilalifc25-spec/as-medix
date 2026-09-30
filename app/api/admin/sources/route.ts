import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { normalizeSourcesList, normalizeSourceItem } from '@/lib/sourceUtils';
import { StructuredSource } from '@/types';
import { db } from '@/lib/db/store';

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

    // Merged: course-level + specialty-level + year-level + global with strict faculty isolation
    const keysToFetch: string[] = [];
    if (specialty && course) {
      if (faculty && faculty !== 'TOUS') {
        keysToFetch.push(`${specialty}__${course}::${faculty}`);
        keysToFetch.push(`${specialty}__${course}`);
      } else {
        keysToFetch.push(`${specialty}__${course}`);
        keysToFetch.push(`${specialty}__${course}::ORAN`);
        keysToFetch.push(`${specialty}__${course}::SIDI_BEL_ABBES`);
      }
    }
    if (specialty) {
      if (faculty && faculty !== 'TOUS') {
        keysToFetch.push(`${specialty}::${faculty}`);
        keysToFetch.push(specialty);
      } else {
        keysToFetch.push(specialty);
        keysToFetch.push(`${specialty}::ORAN`);
        keysToFetch.push(`${specialty}::SIDI_BEL_ABBES`);
      }
    }
    if (year) {
      if (faculty && faculty !== 'TOUS') {
        keysToFetch.push(`annee_${year}::${faculty}`);
        keysToFetch.push(`annee_${year}`);
      } else {
        keysToFetch.push(`annee_${year}`);
        keysToFetch.push(`annee_${year}::ORAN`);
        keysToFetch.push(`annee_${year}::SIDI_BEL_ABBES`);
      }
    }
    if (faculty && faculty !== 'TOUS') {
      keysToFetch.push(`__global__::${faculty}`);
      keysToFetch.push('__global__');
    } else {
      keysToFetch.push('__global__');
      keysToFetch.push('__global__::ORAN');
      keysToFetch.push('__global__::SIDI_BEL_ABBES');
    }

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

    // Case 0: Toggle hyper probable status on a source
    if (body.action === 'toggle_hyper_probable' && body.name) {
      const cleanName = String(body.name).trim();
      let found = structured.find(s => s.name.toLowerCase() === cleanName.toLowerCase());
      if (found) {
        found.isHyperProbable = Boolean(body.isHyperProbable);
      } else {
        structured.push({
          name: cleanName,
          subSources: [],
          isHyperProbable: Boolean(body.isHyperProbable)
        });
      }
    }
    // Case 1: Add a sub-source to a parent source
    else if (parentName && subSource) {
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
          subSources: initialSubs,
          isHyperProbable: Boolean(body.isHyperProbable)
        });
      } else {
        if (body.isHyperProbable !== undefined) {
          found.isHyperProbable = Boolean(body.isHyperProbable);
        }
        if (initialSubs.length > 0) {
          initialSubs.forEach(s => {
            if (!found!.subSources.includes(s)) found!.subSources.push(s);
          });
          found.subSources.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        }
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
    const supabase = getSupabaseServerClient();

    if (!name && !(parentName && subSource)) {
      return NextResponse.json({ error: 'Paramètre de suppression manquant' }, { status: 400 });
    }

    // 1. Fetch ALL rows in custom_sources table to ensure full deletion across all scopes
    const { data: allRows, error: fetchErr } = await supabase.from('custom_sources').select('*');
    if (fetchErr) throw fetchErr;

    const rowsToProcess = allRows || [];

    for (const row of rowsToProcess) {
      let structured: StructuredSource[] = normalizeSourcesList(row.sources || []);
      let modified = false;

      // Case 1: Delete a specific sub-source
      if (parentName && subSource) {
        const cleanParent = String(parentName).trim().toLowerCase();
        const cleanSub = String(subSource).trim().toLowerCase();
        const found = structured.find(s => s.name.toLowerCase() === cleanParent);
        if (found) {
          const initialLen = found.subSources.length;
          found.subSources = found.subSources.filter(s => String(s).trim().toLowerCase() !== cleanSub);
          if (found.subSources.length !== initialLen) {
            modified = true;
          }
        }
      } 
      // Case 2: Delete an entire source
      else if (name) {
        const cleanName = String(name).trim().toLowerCase();
        const initialLen = structured.length;
        structured = structured.filter(s => s.name.toLowerCase() !== cleanName);
        if (structured.length !== initialLen) {
          modified = true;
        }
      }

      if (modified) {
        await supabase.from('custom_sources').upsert(
          {
            id: row.id,
            scope_key: row.scope_key,
            faculty: row.faculty || 'TOUS',
            sources: structured,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'scope_key' }
        );
      }
    }

    // 2. Delete matching QCMs from Supabase `qcms` table and local DB store
    const cleanParent = parentName ? String(parentName).trim().toLowerCase() : '';
    const cleanSub = subSource ? String(subSource).trim().toLowerCase() : '';
    const cleanName = name ? String(name).trim().toLowerCase() : '';

    try {
      let qcmQuery = supabase.from('qcms').delete();
      if (specialty && specialty !== 'TOUS') {
        qcmQuery = qcmQuery.eq('specialty_id', specialty);
      }

      if (cleanParent && cleanSub) {
        qcmQuery = qcmQuery.or(`and(parent_source.ilike.${cleanParent},sub_source.ilike.${cleanSub}),source.ilike.%${cleanParent}%${cleanSub}%`);
      } else if (cleanName) {
        qcmQuery = qcmQuery.or(`parent_source.ilike.${cleanName},source.ilike.%${cleanName}%`);
      }
      await qcmQuery;
    } catch (qErr) {
      console.error('Error deleting QCMs from Supabase:', qErr);
    }

    try {
      const allLocalQcms = db.getQcms();
      const qcmsToDelete = allLocalQcms.filter(q => {
        const matchSpec = !specialty || specialty === 'TOUS' || q.specialtyId === specialty || q.specialtyId?.toLowerCase() === specialty.toLowerCase();
        if (!matchSpec) return false;

        const qParent = q.parentSource?.trim().toLowerCase() || '';
        const qSub = q.subSource?.trim().toLowerCase() || '';
        const qSrc = q.source?.trim().toLowerCase() || '';

        if (cleanParent && cleanSub) {
          if (qParent === cleanParent && qSub === cleanSub) return true;
          if (qSrc.includes(cleanParent) && qSrc.includes(cleanSub)) return true;
          return false;
        } else if (cleanName) {
          if (qParent === cleanName) return true;
          if (qSrc.includes(cleanName)) return true;
          return false;
        }
        return false;
      });

      qcmsToDelete.forEach(q => db.deleteQcm(q.id));
    } catch (dbErr) {
      console.error('Error deleting QCMs from local DB:', dbErr);
    }

    // 3. Re-query remaining sources for the target scope key
    const targetKey = buildScopeKey(specialty, course, faculty, year);
    const { data: updatedTarget } = await supabase.from('custom_sources').select('sources').eq('scope_key', targetKey).single();
    const finalStructured = normalizeSourcesList(updatedTarget?.sources || []);

    return NextResponse.json({
      success: true,
      structuredSources: finalStructured,
      sources: finalStructured.map(s => s.name)
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

