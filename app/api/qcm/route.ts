import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const specialty = url.searchParams.get('specialty') || undefined;
    const course = url.searchParams.get('course') || undefined;
    const faculty = url.searchParams.get('faculty') || undefined;
    const source = url.searchParams.get('source') || undefined;

    let qcms = db.getQcms();

    if (specialty) {
      qcms = qcms.filter(q => q.specialtyId === specialty);
    }
    if (course) {
      qcms = qcms.filter(q => q.courseId === course);
    }
    if (faculty && faculty !== 'TOUS') {
      qcms = qcms.filter(q => q.faculty === faculty || q.faculty === 'TOUS');
    }
    if (source && source !== 'TOUS') {
      qcms = qcms.filter(q => q.source && q.source.toLowerCase().includes(source.toLowerCase()));
    }

    return NextResponse.json({ success: true, qcms, total: qcms.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
