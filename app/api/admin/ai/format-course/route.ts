import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { aiAnalyzeAndFormatCourse } from '@/lib/ai/openrouter';

const pdfParse = require('pdf-parse');

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const sessionCookie = req.cookies.get('asmedix_session')?.value;
    if (!currentUser && !sessionCookie) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    let { content, pdfUrl, provider, apiKey, model, specialty, year } = body;

    // Fetch and extract PDF from URL if pdfUrl is provided
    if (pdfUrl && typeof pdfUrl === 'string' && pdfUrl.trim().length > 0) {
      const cleanUrl = pdfUrl.trim();
      try {
        const fetchRes = await fetch(cleanUrl);
        if (!fetchRes.ok) {
          throw new Error(`Impossible de télécharger le PDF depuis l'URL (Statut ${fetchRes.status})`);
        }
        const arrayBuf = await fetchRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);
        const parsedPdf = await pdfParse(buffer);

        if (!parsedPdf.text || parsedPdf.text.trim().length === 0) {
          throw new Error('Le fichier PDF téléchargé depuis le lien ne contient aucun texte extractible.');
        }

        content = parsedPdf.text;
      } catch (pdfErr: any) {
        return NextResponse.json({
          error: `Erreur d'extraction du lien PDF : ${pdfErr.message}`
        }, { status: 400 });
      }
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Veuillez fournir du texte brut, du code HTML ou un lien URL PDF valide.' }, { status: 400 });
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
