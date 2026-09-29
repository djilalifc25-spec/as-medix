import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Course } from '@/types';
import { autoFormatCourseHtml } from '@/lib/autoHtmlFormatter';
import { autoLinkQcmsToCourse } from '@/lib/qcmCourseLinker';

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

async function syncCourseToSupabase(course: Course) {
  try {
    const basePayload: Record<string, any> = {
      id: String(course.id),
      specialty: String(course.specialtyId || 'cardio'),
      specialty_id: String(course.specialtyId || 'cardio'),
      specialty_name: String(course.specialtyName || 'Cardiologie'),
      title: String(course.title || 'Cours'),
      subtitle: String(course.subtitle || ''),
      duration: String(course.estimatedDuration || '30 min'),
      difficulty: String(course.difficulty || 'Incontournable'),
      rang: String(course.rang || 'Rang A'),
      html_content: String(course.htmlContent || ''),
      year: course.year ? String(course.year) : null,
      updated_at: new Date().toISOString()
    };

    const fullPayload = {
      ...basePayload,
      slug: String(course.slug || course.id),
      faculty: String(course.faculty || 'TOUS'),
      author: String(course.author || ''),
      author_title: String(course.authorTitle || ''),
      description: String(course.description || ''),
      cover_image: String(course.coverImage || ''),
      source: String(course.source || ''),
      access_level: String(course.accessLevel || 'FREE'),
      published: Boolean(course.published),
      views_count: Number(course.viewsCount || 0),
      likes_count: Number(course.likesCount || 0),
      qcm_count: Number(course.qcmCount || 5),
      table_of_contents: course.tableOfContents || []
    };

    const { error: fullError } = await supabaseAdmin.from('courses').upsert(fullPayload, { onConflict: 'id' });
    if (fullError) {
      console.warn('[Supabase Sync] Course upsert with extra columns failed, retrying with base schema:', fullError.message);
      const { error: baseError } = await supabaseAdmin.from('courses').upsert(basePayload, { onConflict: 'id' });
      if (baseError) {
        console.error('[Supabase Sync] Course base upsert error:', baseError.message);
      } else {
        console.log('[Supabase Sync] Course successfully upserted into Supabase (base schema):', course.id);
      }
    } else {
      console.log('[Supabase Sync] Course successfully upserted into Supabase (full schema):', course.id);
    }
  } catch (err) {
    console.error('[Supabase Sync] Course upsert exception:', err);
  }
}

async function deleteCourseFromSupabase(id: string) {
  try {
    await supabaseAdmin.from('courses').delete().eq('id', id);
  } catch (err) {
    console.error('[Supabase Sync] Course delete error:', err);
  }
}

export async function GET(req: Request) {
  const currentUser = await getCurrentUser();
  const sessionCookie = (req as any).cookies?.get?.('asmedix_session')?.value;
  if (!currentUser && !sessionCookie) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  let coursesMap = new Map<string, Course>();
  let cloudFetched = false;

  try {
    const { data: cloudCourses, error } = await supabaseAdmin.from('courses').select('*');
    if (!error && Array.isArray(cloudCourses)) {
      cloudFetched = true;
      for (const row of cloudCourses) {
        const mapped = mapSupabaseRowToCourse(row);
        coursesMap.set(mapped.id, mapped);
      }
    }
  } catch (sErr) {
    console.warn('[Admin Courses GET] Supabase fetch error:', sErr);
  }

  const localCourses = db.getCourses();
  for (const c of localCourses) {
    if (!cloudFetched) {
      coursesMap.set(c.id, c);
    } else if (!coursesMap.has(c.id) && c.htmlContent && c.htmlContent.length > 100) {
      coursesMap.set(c.id, c);
    }
  }

  const allCourses = Array.from(coursesMap.values());

  if (id) {
    const course = allCourses.find(c => c.id === id);
    if (!course) {
      return NextResponse.json({ error: 'Cours introuvable' }, { status: 404 });
    }
    return NextResponse.json({ course });
  }

  return NextResponse.json({ courses: allCourses });
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const sessionCookie = (req as any).cookies?.get?.('asmedix_session')?.value;
    if (!currentUser && !sessionCookie) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const action = body.action;

    if (action === 'duplicate') {
      const duplicated = db.duplicateCourse(body.id);
      if (duplicated) {
        await syncCourseToSupabase(duplicated);
      }
      return NextResponse.json({ success: true, course: duplicated });
    }

    if (action === 'toggle_publish') {
      const course = db.getCourseById(body.id);
      if (!course) return NextResponse.json({ error: 'Cours introuvable' }, { status: 404 });
      const updated = db.updateCourse(body.id, { published: !course.published });
      if (updated) {
        await syncCourseToSupabase(updated);
      }
      return NextResponse.json({ success: true, course: updated });
    }

    if (action === 'delete') {
      const deleted = db.deleteCourse(body.id);
      await deleteCourseFromSupabase(body.id);
      return NextResponse.json({ success: deleted });
    }

    // UPDATE EXISTING COURSE
    if (action === 'update' || (body.id && db.getCourseById(body.id))) {
      const targetId = body.id;
      const existing = db.getCourseById(targetId);
      if (existing) {
        const updated = db.updateCourse(targetId, {
          title: body.title !== undefined ? body.title : existing.title,
          subtitle: body.subtitle !== undefined ? body.subtitle : existing.subtitle,
          slug: body.slug || existing.slug,
          specialtyId: body.specialtyId || existing.specialtyId,
          specialtyName: body.specialtyName || existing.specialtyName,
          author: body.author || existing.author,
          authorTitle: body.authorTitle || existing.authorTitle,
          description: body.description !== undefined ? body.description : existing.description,
          coverImage: body.coverImage || existing.coverImage,
          difficulty: body.difficulty || existing.difficulty,
          faculty: body.faculty || existing.faculty,
          source: body.source || existing.source,
          rang: body.rang || existing.rang,
          estimatedDuration: body.estimatedDuration || existing.estimatedDuration,
          tags: body.tags || existing.tags,
          accessLevel: body.accessLevel || existing.accessLevel,
          published: body.published !== undefined ? Boolean(body.published) : existing.published,
          year: body.year !== undefined ? (body.year ? Number(body.year) as any : undefined) : existing.year,
          htmlContent: body.htmlContent !== undefined ? autoFormatCourseHtml(body.htmlContent).htmlContent : existing.htmlContent,
          tableOfContents: (body.tableOfContents && body.tableOfContents.length > 0) ? body.tableOfContents : (body.htmlContent ? autoFormatCourseHtml(body.htmlContent).tableOfContents : existing.tableOfContents),
        });

        if (updated) {
          await syncCourseToSupabase(updated);
          const linkRes = await autoLinkQcmsToCourse(updated);
          return NextResponse.json({ success: true, course: updated, linkedQcmsCount: linkRes.linkedCount });
        }

        return NextResponse.json({ success: true, course: updated });
      }
    }

    // CREATE NEW COURSE (OR UPSERT)
    const formattedResult = autoFormatCourseHtml(body.htmlContent || '<p>Contenu médical en cours de rédaction...</p>');
    const newCourse: Course = {
      id: body.id || `cours_${Date.now()}`,
      slug: body.slug || `cours-${Date.now()}`,
      title: body.title || 'Nouveau Cours',
      subtitle: body.subtitle || '',
      specialtyId: body.specialtyId || 'cardio',
      specialtyName: body.specialtyName || 'Cardiologie',
      year: body.year ? Number(body.year) as any : undefined,
      author: body.author || 'Pr. Karim Benali',
      authorTitle: body.authorTitle || 'Chef de Service Hospitalo-Universitaire',
      description: body.description || '',
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
      difficulty: body.difficulty || 'Incontournable',
      faculty: body.faculty || 'TOUS',
      source: body.source || 'Externat',
      rang: body.rang || 'Rang A',
      estimatedDuration: body.estimatedDuration || '35 min',
      tags: body.tags || ['Médecine', 'Résidanat'],
      accessLevel: body.accessLevel || 'FREE',
      published: body.published !== undefined ? Boolean(body.published) : true,
      viewsCount: 0,
      likesCount: 0,
      qcmCount: 5,
      tableOfContents: (body.tableOfContents && body.tableOfContents.length > 0) ? body.tableOfContents : formattedResult.tableOfContents,
      htmlContent: formattedResult.htmlContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = db.getCourseById(newCourse.id) 
      ? db.updateCourse(newCourse.id, newCourse)
      : db.createCourse(newCourse);

    const finalCourse = saved || newCourse;
    await syncCourseToSupabase(finalCourse);
    const linkRes = await autoLinkQcmsToCourse(finalCourse);

    return NextResponse.json({ success: true, course: finalCourse, linkedQcmsCount: linkRes.linkedCount });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const sessionCookie = (req as any).cookies?.get?.('asmedix_session')?.value;
    if (!currentUser && !sessionCookie) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID du cours manquant' }, { status: 400 });
    }

    const existing = db.getCourseById(body.id);
    const updated = existing
      ? db.updateCourse(body.id, { ...body, updatedAt: new Date().toISOString() })
      : db.createCourse({
          id: body.id,
          slug: body.slug || body.id,
          title: body.title || 'Cours',
          subtitle: body.subtitle || '',
          specialtyId: body.specialtyId || 'cardio',
          specialtyName: body.specialtyName || 'Cardiologie',
          year: body.year ? Number(body.year) as any : undefined,
          author: body.author || 'Faculté de Médecine',
          authorTitle: body.authorTitle || 'Professeurs Hospitalo-Universitaires',
          description: body.description || '',
          coverImage: body.coverImage || '',
          difficulty: body.difficulty || 'Incontournable',
          faculty: body.faculty || 'ORAN',
          source: body.source || 'Annales',
          rang: body.rang || 'Rang A',
          estimatedDuration: body.estimatedDuration || '30 min',
          tags: body.tags || ['Médecine'],
          accessLevel: body.accessLevel || 'FREE',
          published: Boolean(body.published),
          viewsCount: 0,
          likesCount: 0,
          qcmCount: 5,
          tableOfContents: body.tableOfContents || [],
          htmlContent: body.htmlContent || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

    if (updated) {
      await syncCourseToSupabase(updated);
      const linkRes = await autoLinkQcmsToCourse(updated);
      return NextResponse.json({ success: true, course: updated, linkedQcmsCount: linkRes.linkedCount });
    }

    return NextResponse.json({ success: true, course: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
