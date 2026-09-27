import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { aiAnalyzeAndFormatCourse } from '@/lib/ai/openrouter';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const sessionCookie = req.cookies.get('asmedix_session')?.value;
    if (!currentUser && !sessionCookie) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const { content, provider, apiKey, model, specialty, year } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Contenu médical brut requis pour l\'analyse IA' }, { status: 400 });
    }

    const result = await aiAnalyzeAndFormatCourse(
      content,
      { provider, apiKey, model },
      { specialty, year }
    );

    return NextResponse.json({
      success: true,
      result
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || 'Erreur lors du traitement par l\'Assistant IA'
    }, { status: 500 });
  }
}
