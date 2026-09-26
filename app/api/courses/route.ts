import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Course } from '@/types';

export const dynamic = 'force-dynamic';

function mapSupabaseRowToCourse(row: any): Course {
  const title = row.title || row.name || 'Cours';
  const slug = row.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    id: String(row.id),
    slug: row.slug || slug,
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
    faculty: row.faculty || 'ORAN',
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

    // 1. Local DB courses
    const localCourses = db.getCourses();
    for (const c of localCourses) {
      coursesMap.set(c.id, c);
    }

    // 2. Cloud Supabase courses
    try {
      const { data: cloudCourses, error } = await supabaseAdmin.from('courses').select('*');
      if (!error && Array.isArray(cloudCourses)) {
        for (const row of cloudCourses) {
          const mapped = mapSupabaseRowToCourse(row);
          const existing = coursesMap.get(mapped.id);
          if (!existing || (mapped.htmlContent && mapped.htmlContent.length > (existing.htmlContent?.length || 0))) {
            coursesMap.set(mapped.id, mapped);
          }
        }
      }
    } catch (sErr) {
      console.warn('[Courses API] Supabase fetch error:', sErr);
    }

    let courses = Array.from(coursesMap.values());

    if (slug) {
      courses = courses.filter(c => c.slug === slug || c.id === slug);
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
