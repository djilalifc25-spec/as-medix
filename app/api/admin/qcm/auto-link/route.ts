import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { reconcileAllOrphanedQcms } from '@/lib/qcmCourseLinker';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const sessionCookie = req.cookies.get('asmedix_session')?.value;
    if (!currentUser && !sessionCookie) {
      return NextResponse.json({ success: false, error: 'Accès non autorisé.' }, { status: 401 });
    }

    const result = await reconcileAllOrphanedQcms();

    return NextResponse.json({
      success: true,
      totalLinked: result.totalLinked,
      details: result.details
    });
  } catch (err: any) {
    console.error('[auto-link API] Error:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Erreur lors du rattachement automatique des QCMs.'
    }, { status: 500 });
  }
}
