import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Course } from '@/types';

async function syncCourseToSupabase(course: Course) {
  try {
    await supabaseAdmin.from('courses').upsert({
      id: course.id,
      specialty: course.specialtyId,
      specialty_name: course.specialtyName,
      title: course.title,
      subtitle: course.subtitle || '',
      faculty: course.faculty || 'ORAN',
      duration: course.estimatedDuration || '30 min',
      difficulty: course.difficulty || 'Incontournable',
      rang: course.rang || 'Rang A',
      html_content: course.htmlContent || '',
      storage_path: (course as any).storage_path || '',
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  } catch (err) {
    console.error('[Supabase Sync] Course upsert error:', err);
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
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    const course = db.getCourseById(id);
    if (!course) {
      return NextResponse.json({ error: 'Cours introuvable' }, { status: 404 });
    }
    return NextResponse.json({ course });
  }

  return NextResponse.json({ courses: db.getCourses() });
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
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
      if (!existing) {
        return NextResponse.json({ error: 'Cours introuvable' }, { status: 404 });
      }

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
        htmlContent: body.htmlContent !== undefined ? body.htmlContent : existing.htmlContent,
        tableOfContents: body.tableOfContents || existing.tableOfContents,
      });

      if (updated) {
        await syncCourseToSupabase(updated);
      }

      return NextResponse.json({ success: true, course: updated });
    }

    // CREATE NEW COURSE
    const newCourse: Course = {
      id: body.id || `cours_${Date.now()}`,
      slug: body.slug || `cours-${Date.now()}`,
      title: body.title,
      subtitle: body.subtitle || '',
      specialtyId: body.specialtyId || 'cardio',
      specialtyName: body.specialtyName || 'Cardiologie',
      year: body.year ? Number(body.year) as any : undefined,
      author: body.author || 'Pr. Karim Benali',
      authorTitle: body.authorTitle || 'Chef de Service Hospitalo-Universitaire',
      description: body.description || '',
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200',
      difficulty: body.difficulty || 'Incontournable',
      faculty: body.faculty || 'ORAN',
      source: body.source || 'Externat',
      rang: body.rang || 'Rang A',
      estimatedDuration: body.estimatedDuration || '35 min',
      tags: body.tags || ['Médecine', 'Résidanat'],
      accessLevel: body.accessLevel || 'FREE',
      published: Boolean(body.published),
      viewsCount: 0,
      likesCount: 0,
      qcmCount: 5,
      tableOfContents: body.tableOfContents || [
        { id: 'intro', title: '1. Introduction', level: 1 },
        { id: 'clinique', title: '2. Clinique', level: 1 },
        { id: 'traitement', title: '3. Traitement', level: 1 },
      ],
      htmlContent: body.htmlContent || '<p>Contenu médical en cours de rédaction...</p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = db.createCourse(newCourse);
    await syncCourseToSupabase(created);

    return NextResponse.json({ success: true, course: created });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID du cours manquant' }, { status: 400 });
    }

    const existing = db.getCourseById(body.id);
    if (!existing) {
      return NextResponse.json({ error: 'Cours introuvable' }, { status: 404 });
    }

    const updated = db.updateCourse(body.id, {
      ...body,
      updatedAt: new Date().toISOString()
    });

    if (updated) {
      await syncCourseToSupabase(updated);
    }

    return NextResponse.json({ success: true, course: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
