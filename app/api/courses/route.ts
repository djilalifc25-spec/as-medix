import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Course } from '@/types';

export const dynamic = 'force-dynamic';

function normalizeSlug(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function stripAll(str: string): string {
  if (!str) return '';
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}

function getKeywords(str: string): string[] {
  if (!str) return [];
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(w => w.length >= 3);
}

function matchesCourse(c: Course | any, slugOrId: string): boolean {
  if (!c || !slugOrId) return false;
  
  const target = slugOrId.trim();
  const decodedTarget = decodeURIComponent(target).trim();
  
  if (c.id === target || c.slug === target || c.id === decodedTarget || c.slug === decodedTarget) {
    return true;
  }
  
  const normTarget = normalizeSlug(target);
  const normDecodedTarget = normalizeSlug(decodedTarget);
  const cSlugNorm = normalizeSlug(c.slug || '');
  const cIdNorm = normalizeSlug(c.id || '');
  const cTitleNorm = normalizeSlug(c.title || '');
  
  if (cSlugNorm && (cSlugNorm === normTarget || cSlugNorm === normDecodedTarget)) return true;
  if (cIdNorm && (cIdNorm === normTarget || cIdNorm === normDecodedTarget)) return true;
  if (cTitleNorm && (cTitleNorm === normTarget || cTitleNorm === normDecodedTarget)) return true;

  if (normTarget.length >= 5 && (cSlugNorm.includes(normTarget) || normTarget.includes(cSlugNorm) || cTitleNorm.includes(normTarget))) {
    return true;
  }

  const strippedTarget = stripAll(decodedTarget);
  const strippedCSlug = stripAll(c.slug || '');
  const strippedCTitle = stripAll(c.title || '');
  const strippedCId = stripAll(c.id || '');

  if (strippedTarget && strippedTarget.length >= 5) {
    if (strippedCSlug === strippedTarget || strippedCTitle === strippedTarget || strippedCId === strippedTarget) {
      return true;
    }
    if (strippedCSlug.includes(strippedTarget) || strippedTarget.includes(strippedCSlug) || strippedCTitle.includes(strippedTarget)) {
      return true;
    }
  }

  const targetWords = getKeywords(decodedTarget);
  if (targetWords.length > 0) {
    const courseWords = new Set([...getKeywords(c.title || ''), ...getKeywords(c.slug || '')]);
    let matchedCount = 0;
    for (const tw of targetWords) {
      if (courseWords.has(tw) || Array.from(courseWords).some(cw => cw.includes(tw) || tw.includes(cw))) {
        matchedCount++;
      }
    }
    if (targetWords.length <= 3 && matchedCount === targetWords.length) return true;
    if (targetWords.length > 3 && (matchedCount / targetWords.length >= 0.4 || matchedCount >= 3)) return true;
  }

  return false;
}

function mapSupabaseRowToCourse(row: any): Course {
  const title = row.title || row.name || 'Cours';
  const slug = row.slug || normalizeSlug(title) || String(row.id);
  return {
    id: String(row.id),
    slug: slug,
    title: title,
    subtitle: row.subtitle || '',
    specialtyId: row.specialty_id || row.specialty || 'cardio',
    specialtyName: row.specialty_name || 'Cardiologie',
    year: row.year ? Number(row.year) as any : undefined,
    author: row.author || 'Faculté de Médecine',
    authorTitle: row.author_title || 'Professeurs Hospitalo-Universitaires',
    description: row.description || '',
    coverImage: row.cover_image || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
    difficulty: row.difficulty || 'Incontournable',
    faculty: row.faculty || 'TOUS',
    source: row.source || 'Annales Examens',
    rang: row.rang || 'Rang A',
    estimatedDuration: row.duration || row.estimated_duration || '30 min',
    tags: Array.isArray(row.tags) ? row.tags : ['Médecine', 'Résidanat'],
    accessLevel: row.access_level || 'FREE',
    published: row.published !== undefined ? Boolean(row.published) : true,
    viewsCount: Number(row.views_count || 0),
    likesCount: Number(row.likes_count || 0),
    qcmCount: Number(row.qcm_count || 5),
    tableOfContents: Array.isArray(row.table_of_contents) ? row.table_of_contents : [
      { id: 'sec-1', title: '1. Introduction', level: 1 }
    ],
    htmlContent: row.html_content || row.content || '<p>Contenu du cours...</p>',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const specialty = url.searchParams.get('specialty') || undefined;
    const faculty = url.searchParams.get('faculty') || undefined;
    const slug = url.searchParams.get('slug') || undefined;

    let coursesMap = new Map<string, Course>();
    let cloudFetched = false;

    // Load deleted IDs FIRST — String() for type-safe comparison (Supabase IDs can be integers)
    const deletedCourseIds = db.getDeletedCourseIds().map(String);
    const deletedSpecialtyIds = db.getDeletedSpecialtyIds().map(String);
    const isDeleted = (cid: any, cslug?: any, specId?: any) =>
      deletedCourseIds.includes(String(cid)) ||
      (cslug && deletedCourseIds.includes(String(cslug))) ||
      (specId && deletedSpecialtyIds.includes(String(specId)));

    // 1. Cloud Supabase courses (Primary source of truth)
    try {
      const { data: cloudCourses, error } = await supabaseAdmin.from('courses').select('*');
      if (!error && Array.isArray(cloudCourses)) {
        cloudFetched = true;
        for (const row of cloudCourses) {
          const mapped = mapSupabaseRowToCourse(row);
          if (isDeleted(mapped.id, mapped.slug, mapped.specialtyId)) continue;
          coursesMap.set(String(mapped.id), mapped);
        }
      }
    } catch (sErr) {
      console.warn('[Courses API] Supabase fetch error:', sErr);
    }

    // 2. Fallback to Local DB courses if cloud query fails or for newly created local drafts
    const localCourses = db.getCourses();
    for (const c of localCourses) {
      if (isDeleted(c.id, c.slug, c.specialtyId)) continue;
      if (!cloudFetched) {
        coursesMap.set(String(c.id), c);
      } else if (!coursesMap.has(String(c.id)) && c.htmlContent && c.htmlContent.length > 100) {
        // Keep local draft if not present in cloud
        coursesMap.set(String(c.id), c);
      }
    }

    let courses = Array.from(coursesMap.values());


    if (slug) {
      courses = courses.filter(c => matchesCourse(c, slug));
    }
    if (specialty) {
      courses = courses.filter(c => c.specialtyId === specialty);
    }
    if (faculty && faculty !== 'TOUS') {
      courses = courses.filter(c => c.faculty === faculty || c.faculty === 'TOUS');
    }

    return NextResponse.json({ success: true, courses, total: courses.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
