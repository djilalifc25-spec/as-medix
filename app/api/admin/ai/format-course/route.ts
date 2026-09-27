import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { aiAnalyzeAndFormatCourse } from '@/lib/ai/openrouter';

const pdfParse = require('pdf-parse');

export const dynamic = 'force-dynamic';

function transformPdfUrl(url: string): string {
  let clean = url.trim();

  // Handle Google Drive share links: drive.google.com/file/d/FILE_ID/view... -> drive.google.com/uc?export=download&id=FILE_ID
  const driveFileMatch = clean.match(/drive\.google\.com\/file\/d\/([^\/]+)/i);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/uc?export=download&confirm=no_antivirus&id=${driveFileMatch[1]}`;
  }

  const driveIdMatch = clean.match(/drive\.google\.com\/open\?id=([^&]+)/i);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://drive.google.com/uc?export=download&confirm=no_antivirus&id=${driveIdMatch[1]}`;
  }

  // Handle Dropbox links: dl=0 -> dl=1
  if (clean.includes('dropbox.com') && clean.includes('dl=0')) {
    return clean.replace('dl=0', 'dl=1');
  }

  return clean;
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const sessionCookie = req.cookies.get('asmedix_session')?.value;
    if (!currentUser && !sessionCookie) {
      return NextResponse.json({ success: false, error: 'Accès non autorisé. Veuillez vous connecter.' }, { status: 401 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch (_jsonErr) {
      return NextResponse.json({ success: false, error: 'Format de requête JSON invalide.' }, { status: 400 });
    }

    let { content, pdfUrl, provider, apiKey, model, specialty, year } = body;

    // Fetch and extract PDF from URL if pdfUrl is provided
    if (pdfUrl && typeof pdfUrl === 'string' && pdfUrl.trim().length > 0) {
      const targetUrl = transformPdfUrl(pdfUrl);
      try {
        const fetchRes = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/pdf,application/octet-stream,*/*'
          }
        });

        if (!fetchRes.ok) {
          return NextResponse.json({
            success: false,
            error: `Impossible de télécharger le fichier PDF depuis le lien fourni (Code HTTP ${fetchRes.status}). Vérifiez le lien.`
          }, { status: 400 });
        }

        const arrayBuf = await fetchRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);

        // Check if response is actually HTML instead of a binary PDF
        const snippet = buffer.toString('utf-8', 0, 300).toLowerCase();
        if (snippet.includes('<!doctype') || snippet.includes('<html')) {
          return NextResponse.json({
            success: false,
            error: 'Le lien fourni pointe vers une page Web HTML (ex: aperçu Google Drive ou site Web) et non directement vers le fichier PDF brut. Veuillez utiliser un lien de téléchargement direct ou copier-coller le texte brut du cours.'
          }, { status: 400 });
        }

        let parsedPdf: any;
        try {
          parsedPdf = await pdfParse(buffer);
        } catch (parsePdfErr: any) {
          return NextResponse.json({
            success: false,
            error: `Échec de l'extraction du texte PDF : ${parsePdfErr.message || 'Fichier PDF corrompu ou protégé par mot de passe'}.`
          }, { status: 400 });
        }

        if (!parsedPdf.text || parsedPdf.text.trim().length === 0) {
          return NextResponse.json({
            success: false,
            error: 'Le fichier PDF téléchargé depuis le lien ne contient aucun texte extractible (ex: PDF scanné sous forme d\'images).'
          }, { status: 400 });
        }

        content = parsedPdf.text;
      } catch (pdfErr: any) {
        return NextResponse.json({
          success: false,
          error: `Erreur d'accès au lien PDF : ${pdfErr.message}`
        }, { status: 400 });
      }
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Veuillez coller le texte du cours, le code HTML ou fournir un lien PDF direct valide.'
      }, { status: 400 });
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
    console.error('[format-course] Error:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Erreur lors du traitement par l\'Assistant IA'
    }, { status: 500 });
  }
}
