import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { callUnifiedAI } from '@/lib/ai/openrouter';
import { extractTextFromPdfBuffer } from '@/lib/safePdfExtractor';
import { matchQcmToCourse } from '@/lib/qcmCourseLinker';
import { db } from '@/lib/db/store';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Course } from '@/types';

export const dynamic = 'force-dynamic';

function transformPdfUrl(url: string): string {
  let clean = url.trim();

  // Google Presentation: docs.google.com/presentation/d/ID/edit... -> export/pdf
  const presentationMatch = clean.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/i);
  if (presentationMatch && presentationMatch[1]) {
    return `https://docs.google.com/presentation/d/${presentationMatch[1]}/export/pdf`;
  }

  // Google Docs: docs.google.com/document/d/ID/edit... -> export?format=pdf
  const docMatch = clean.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/i);
  if (docMatch && docMatch[1]) {
    return `https://docs.google.com/document/d/${docMatch[1]}/export?format=pdf`;
  }

  // Google Drive File Share Link: drive.google.com/file/d/FILE_ID/view... -> drive.google.com/uc?export=download&id=FILE_ID
  const driveFileMatch = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/uc?export=download&confirm=no_antivirus&id=${driveFileMatch[1]}`;
  }

  const driveIdMatch = clean.match(/drive\.google\.com\/open\?id=([^&]+)/i);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://drive.google.com/uc?export=download&confirm=no_antivirus&id=${driveIdMatch[1]}`;
  }

  // Dropbox links: dl=0 -> dl=1
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

    let { content, pdfUrl, provider, apiKey, model, specialty, year, source, availableCourses } = body;

    // Fetch available courses for this specialty if not explicitly passed
    let coursesList: Course[] = Array.isArray(availableCourses) ? availableCourses : [];
    if (coursesList.length === 0) {
      try {
        let query = supabaseAdmin.from('courses').select('id, title, slug, specialty_id, specialty_name');
        if (specialty) {
          query = query.eq('specialty_id', specialty);
        }
        const { data: cloudCourses } = await query;
        if (cloudCourses && Array.isArray(cloudCourses) && cloudCourses.length > 0) {
          coursesList = cloudCourses.map((c: any) => ({
            id: String(c.id),
            title: c.title || c.name || 'Cours',
            slug: c.slug || '',
            specialtyId: c.specialty_id || specialty || 'cardio',
            specialtyName: c.specialty_name || 'Spécialité'
          } as Course));
        }
      } catch (_) {}

      if (coursesList.length === 0) {
        const localCourses = db.getCourses();
        coursesList = specialty ? localCourses.filter(c => c.specialtyId === specialty) : localCourses;
      }
    }

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

        const snippet = buffer.toString('utf-8', 0, 300).toLowerCase();
        if (snippet.includes('<!doctype') || snippet.includes('<html')) {
          return NextResponse.json({
            success: false,
            error: 'Le lien fourni pointe vers une page Web HTML (ex: aperçu Google Drive) et non directement vers le fichier PDF brut. Veuillez utiliser un lien de téléchargement direct ou coller le texte brut.'
          }, { status: 400 });
        }

        let extractedText = '';
        try {
          extractedText = await extractTextFromPdfBuffer(buffer);
        } catch (parsePdfErr: any) {
          return NextResponse.json({
            success: false,
            error: `Échec de l'extraction du texte PDF : ${parsePdfErr.message || 'Fichier PDF corrompu ou protégé par mot de passe'}.`
          }, { status: 400 });
        }

        if (!extractedText || extractedText.trim().length === 0) {
          return NextResponse.json({
            success: false,
            error: 'Le fichier PDF téléchargé ne contient aucun texte extractible.'
          }, { status: 400 });
        }

        content = extractedText;
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
        error: 'Veuillez fournir le texte brut des QCMs ou un lien PDF direct valide.'
      }, { status: 400 });
    }

    const coursesPromptContext = coursesList.length > 0
      ? `LISTE DES COURS EXISTANTS DANS CE MODULE (AS-MEDIX) :
${coursesList.map(c => `- ID: "${c.id}" | Titre: "${c.title}"`).join('\n')}

INSTRUCTIONS DE RATTACHEMENT AU COURS :
Pour chaque QCM extrait, détermine précisément à quel cours il correspond.
- Si le sujet de la question correspond à l'un des cours ci-dessus : renvoie son "courseId" exact et son "courseTitle" exact.
- Si aucun cours de la liste ci-dessus ne correspond (le cours n'a pas encore été créé sur la plateforme) : renvoie "courseId": null et renvoie dans "courseTitle" le titre médical standard et précis du cours correspondant (ex: "Rétrécissement Aortique", "Péricardite Aiguë", "Asthme de l'adulte", "Syndrome Néphrotique").`
      : `INSTRUCTIONS DE RATTACHEMENT AU COURS :
Pour chaque QCM extrait, identifie et indique dans "courseTitle" le nom exact du cours médical correspondant (ex: "Infarctus du Myocarde", "Péricardite Aiguë", "Insuffisance Cardiaque"), et "courseId": null.`;

    const systemPrompt = `Tu es l'Intelligence Artificielle Médicale Spécialisée et Extrakteur de QCMs d'Examens d'AS-MEDIX.
Ta mission est d'analyser le document ou l'examen médical fourni, et d'en extraire 100% DES QCMs (Questions à Choix Multiples) avec CHAQUE PROPOSITION (A, B, C, D, E), la vignette clinique si présente, les réponses correctes, LA JUSTIFICATION CLINIQUE DÉTAILLÉE et le RATTACHEMENT AU COURS CORRESPONDANT.

${coursesPromptContext}

Règles de réponse JSON strictes :
Renvoie EXCLUSIVEMENT un objet JSON valide avec cette structure exacte :
{
  "examTitle": "Titre du sujet ou de l'examen extrait du document",
  "totalQcms": 20,
  "qcms": [
    {
      "qNum": 1,
      "title": "Question 1",
      "courseId": "ID du cours correspondant si présent dans la liste, sinon null",
      "courseTitle": "Titre exact du cours médical correspondant",
      "vignette": "Texte du cas clinique / vignette clinique si présent (sinon vide)",
      "question": "Énoncé exact et complet de la question...",
      "options": [
        { "letter": "A", "text": "Intitulé complet de la proposition A", "isCorrect": true },
        { "letter": "B", "text": "Intitulé complet de la proposition B", "isCorrect": false },
        { "letter": "C", "text": "Intitulé complet de la proposition C", "isCorrect": true },
        { "letter": "D", "text": "Intitulé complet de la proposition D", "isCorrect": false },
        { "letter": "E", "text": "Intitulé complet de la proposition E", "isCorrect": false }
      ],
      "explanation": "JUSTIFICATION MÉDICALE APPROFONDIE OBLIGATOIRE : Explique d'abord pourquoi la ou les réponses exactes sont cliniquement et physiopathologiquement vraies (critères diagnostiques, signes de certitude, reco internationales/algériennes). Puis justifie pourquoi les autres propositions sont fausses (pièges classiques, contre-indications, distracteurs). Ne laisse JAMAIS ce champ vide.",
      "rang": "Rang A",
      "difficulty": "Moyen"
    }
  ]
}

Consignes impératives :
1. Extraction exhaustive : Ne saute AUCUNE question du document. Extrais 100% des QCMs.
2. Pour chaque option A, B, C, D, E : Indique si elle est correcte (isCorrect: true/false). Si la grille de réponses est fournie ou évidente cliniquement, marque les propositions exactes.
3. JUSTIFICATION MÉDICALE OBLIGATOIRE : Rédige une vraie explication médicale pour chaque question. C'est essentiel pour la révision du concours de résidanat.
4. RATTACHEMENT AU COURS : Assigne systématiquement chaque QCM au cours correspondant ("courseId" et "courseTitle").
5. Si une vignette clinique s'applique à plusieurs questions, reproduis-la dans la clé "vignette".
6. Ne réponds rien d'autre que l'objet JSON strict.`;

    const userPrompt = `Spécialité : ${specialty || 'Médecine Générale'} ${year ? `• Année : ${year}` : ''} ${source ? `• Source / Examen : ${source}` : ''}

Voici le document d'examen / annales médicales brut à analyser et extraire :
${content.substring(0, 90000)}`;

    const responseText = await callUnifiedAI(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      { provider, apiKey, model },
      true
    );

    let parsedResult: any = {};
    try {
      const jsonCleaned = responseText.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
      parsedResult = JSON.parse(jsonCleaned);
    } catch (parseErr) {
      console.error('[AI Extract QCMs] JSON parse error:', parseErr, responseText);
      return NextResponse.json({
        success: false,
        error: 'Format de réponse JSON invalide reçu de l\'IA lors de l\'extraction des QCMs.'
      }, { status: 500 });
    }

    const qcmsList = Array.isArray(parsedResult.qcms) ? parsedResult.qcms : [];

    // Format QCMs into AS-MEDIX structure with automatic course resolution
    const formattedQcms = qcmsList.map((q: any, idx: number) => {
      const rawOptions = Array.isArray(q.options) ? q.options : [];
      const optionsArray = rawOptions.map((opt: any, optIdx: number) => ({
        id: `opt_${optIdx + 1}`,
        letter: opt.letter || String.fromCharCode(65 + optIdx),
        text: opt.text || ''
      }));

      const correctAnswers: number[] = [];
      rawOptions.forEach((opt: any, optIdx: number) => {
        if (opt.isCorrect === true) {
          correctAnswers.push(optIdx);
        }
      });

      if (correctAnswers.length === 0 && optionsArray.length > 0) {
        correctAnswers.push(0); // Fallback if AI didn't mark any option
      }

      // Resolve corresponding course
      let resolvedCourseId = q.courseId && typeof q.courseId === 'string' && q.courseId.trim() && q.courseId.trim() !== 'null' ? q.courseId.trim() : undefined;
      let resolvedCourseTitle = q.courseTitle && typeof q.courseTitle === 'string' && q.courseTitle.trim() && q.courseTitle.trim() !== 'null' ? q.courseTitle.trim() : undefined;

      // Smart matching against existing courses if courseId is missing or needs validation
      const matchedCourse = matchQcmToCourse(
        { title: q.title, question: q.question, courseTitle: resolvedCourseTitle, specialtyId: specialty },
        coursesList
      );

      if (matchedCourse) {
        resolvedCourseId = matchedCourse.id;
        resolvedCourseTitle = matchedCourse.title;
      }

      const cleanExplanation = (q.explanation && typeof q.explanation === 'string' && q.explanation.trim())
        ? q.explanation.trim()
        : '<p><strong>Justification clinique :</strong> Analyse clinique conforme aux recommandations médicales.</p>';

      return {
        id: `ai_qcm_${Date.now()}_${idx + 1}`,
        qNum: q.qNum || idx + 1,
        title: q.title || `QCM ${idx + 1}`,
        question: q.question || q.title || `QCM ${idx + 1}`,
        vignette: q.vignette || '',
        options: optionsArray,
        correctAnswers: correctAnswers,
        explanation: cleanExplanation,
        courseId: resolvedCourseId,
        courseTitle: resolvedCourseTitle,
        rang: q.rang || 'Rang A',
        difficulty: q.difficulty || 'Moyen',
        type: correctAnswers.length > 1 ? 'MULTIPLE' : 'SINGLE',
        source: source || parsedResult.examTitle || 'Examen IA'
      };
    });

    return NextResponse.json({
      success: true,
      examTitle: parsedResult.examTitle || source || 'Examen Médical Extrait',
      totalExtracted: formattedQcms.length,
      qcms: formattedQcms
    });

  } catch (err: any) {
    console.error('[extract-qcms] Error:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Erreur lors de l\'extraction des QCMs par l\'IA'
    }, { status: 500 });
  }
}
