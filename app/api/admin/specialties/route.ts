import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Specialty, FacultyType, MedicalYear } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès administrateur requis' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get('year');
    const facultyParam = searchParams.get('faculty');

    db.updateSpecialtyCounts();
    let specialties = db.getSpecialties();

    // Sync from Supabase if available
    try {
      const supabase = getSupabaseServerClient();
      const { data: supaSpecs } = await supabase.from('specialties').select('*');
      if (supaSpecs && Array.isArray(supaSpecs) && supaSpecs.length > 0) {
        for (const row of supaSpecs) {
          const exists = specialties.find(s => s.id === row.id);
          if (!exists) {
            const mapped: Specialty = {
              id: row.id,
              slug: row.slug || row.id,
              name: row.name,
              shortName: row.short_name || row.name,
              iconName: row.icon_name || 'BookOpen',
              color: row.color || '#3B82F6',
              description: row.description || '',
              year: row.year || undefined,
              faculty: row.faculty || 'TOUS',
              totalCourses: row.total_courses || 0,
              totalQcms: row.total_qcms || 0,
              totalCat: row.total_cat || 0,
              totalFiches: row.total_fiches || 0,
            };
            db.createSpecialty(mapped);
            specialties.push(mapped);
          }
        }
      }
    } catch (_supaErr) {}

    if (yearParam && yearParam !== 'all' && yearParam !== 'TOUS') {
      const y = parseInt(yearParam, 10);
      if (!isNaN(y)) {
        specialties = specialties.filter(s => s.year === y);
      }
    }

    if (facultyParam && facultyParam !== 'TOUS') {
      specialties = specialties.filter(s => !s.faculty || s.faculty === 'TOUS' || s.faculty === facultyParam);
    }

    return NextResponse.json({ success: true, specialties });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès administrateur requis' }, { status: 403 });
    }

    const body = await req.json();
    const { name, shortName, year, faculty = 'TOUS', color = '#3B82F6', iconName = 'BookOpen', description = '' } = body;

    if (!name) {
      return NextResponse.json({ error: 'Le nom de la spécialité est obligatoire' }, { status: 400 });
    }

    let yearNum: MedicalYear | undefined = undefined;
    if (year !== undefined && year !== '' && year !== null && year !== 'none') {
      const parsed = parseInt(year, 10) as MedicalYear;
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 6) {
        yearNum = parsed;
      }
    }

    const slug = name.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const id = slug || `spec_${Date.now()}`;

    // Check if ID already exists
    const existing = db.getSpecialties().find(s => s.id === id);
    if (existing) {
      return NextResponse.json({ error: 'Une spécialité avec ce nom existe déjà' }, { status: 400 });
    }

    const newSpecialty: Specialty = {
      id,
      slug,
      name: name.trim(),
      shortName: (shortName || name).trim(),
      iconName,
      color,
      description: description.trim(),
      year: yearNum,
      faculty: faculty as FacultyType,
      totalCourses: 0,
      totalQcms: 0,
      totalCat: 0,
      totalFiches: 0,
    };

    db.createSpecialty(newSpecialty);

    // Sync with Supabase SQL specialties table
    try {
      const supabase = getSupabaseServerClient();
      await supabase.from('specialties').upsert({
        id: newSpecialty.id,
        slug: newSpecialty.slug,
        name: newSpecialty.name,
        short_name: newSpecialty.shortName,
        icon_name: newSpecialty.iconName,
        color: newSpecialty.color,
        description: newSpecialty.description,
        year: newSpecialty.year || null,
        faculty: newSpecialty.faculty || 'TOUS',
        total_courses: 0,
        total_qcms: 0,
        total_cat: 0,
        total_fiches: 0,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    } catch (sErr) {
      console.error('Error saving specialty to Supabase:', sErr);
    }

    return NextResponse.json({ success: true, specialty: newSpecialty }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur lors de la création' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès administrateur requis' }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, shortName, year, faculty, color, iconName, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de la spécialité requis' }, { status: 400 });
    }

    const updates: Partial<Specialty> = {};
    if (name) updates.name = name.trim();
    if (shortName) updates.shortName = shortName.trim();
    if (year !== undefined) {
      if (!year || year === 'none' || year === 'null' || year === null) {
        updates.year = undefined;
      } else {
        const y = parseInt(year, 10) as MedicalYear;
        if (!isNaN(y) && y >= 1 && y <= 6) updates.year = y;
        else updates.year = undefined;
      }
    }
    if (faculty) updates.faculty = faculty as FacultyType;
    if (color) updates.color = color;
    if (iconName) updates.iconName = iconName;
    if (description !== undefined) updates.description = description.trim();

    const updated = db.updateSpecialty(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Spécialité introuvable' }, { status: 404 });
    }

    // Sync with Supabase SQL specialties table
    try {
      const supabase = getSupabaseServerClient();
      await supabase.from('specialties').upsert({
        id: updated.id,
        slug: updated.slug,
        name: updated.name,
        short_name: updated.shortName,
        icon_name: updated.iconName,
        color: updated.color,
        description: updated.description,
        year: updated.year || null,
        faculty: updated.faculty || 'TOUS',
        total_courses: updated.totalCourses || 0,
        total_qcms: updated.totalQcms || 0,
        total_cat: updated.totalCat || 0,
        total_fiches: updated.totalFiches || 0,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    } catch (sErr) {
      console.error('Error updating specialty in Supabase:', sErr);
    }

    return NextResponse.json({ success: true, specialty: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur lors de la modification' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès administrateur requis' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de la spécialité requis' }, { status: 400 });
    }

    const ok = db.deleteSpecialty(id);
    if (!ok) {
      return NextResponse.json({ error: 'Spécialité introuvable' }, { status: 404 });
    }

    // Sync deletion with Supabase SQL specialties table
    try {
      const supabase = getSupabaseServerClient();
      await supabase.from('specialties').delete().eq('id', id);
    } catch (sErr) {
      console.error('Error deleting specialty from Supabase:', sErr);
    }

    return NextResponse.json({ success: true, message: 'Spécialité supprimée avec succès' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur lors de la suppression' }, { status: 500 });
  }
}

