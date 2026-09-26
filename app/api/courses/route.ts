import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const specialty = url.searchParams.get('specialty') || undefined;
    const faculty = url.searchParams.get('faculty') || undefined;

    let courses = db.getCourses();
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
