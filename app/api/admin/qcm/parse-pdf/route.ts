import { NextRequest, NextResponse } from 'next/server';
import { parseQcmDocument } from '@/lib/qcmParser';
import { extractTextFromPdfBuffer } from '@/lib/safePdfExtractor';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pdfFile = formData.get('pdfFile') as File | null;
    const answerKeyFile = formData.get('answerKeyFile') as File | null;
    const answerKeyTextRaw = (formData.get('answerKeyText') as string) || '';

    let extractedPdfText = '';
    let extractedAnswerKeyText = answerKeyTextRaw;

    if (pdfFile) {
      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      const isPdf = pdfFile.type.includes('pdf') || pdfFile.name.toLowerCase().endsWith('.pdf');
      if (isPdf) {
        extractedPdfText = await extractTextFromPdfBuffer(buffer);
      } else {
        // Plain text or UTF-8 document
        extractedPdfText = buffer.toString('utf-8');
      }
    }

    if (answerKeyFile) {
      const answerBuffer = Buffer.from(await answerKeyFile.arrayBuffer());
      const isAnswerPdf = answerKeyFile.type.includes('pdf') || answerKeyFile.name.toLowerCase().endsWith('.pdf');
      if (isAnswerPdf) {
        const textKey = await extractTextFromPdfBuffer(answerBuffer);
        extractedAnswerKeyText += '\n' + textKey;
      } else {
        extractedAnswerKeyText += '\n' + answerBuffer.toString('utf-8');
      }
    }

    if (!extractedPdfText && !extractedAnswerKeyText) {
      return NextResponse.json({ error: 'Aucun fichier ni texte fourni.' }, { status: 400 });
    }

    const qcms = parseQcmDocument(extractedPdfText, extractedAnswerKeyText);

    return NextResponse.json({
      success: true,
      qcmsCount: qcms.length,
      extractedTextLength: extractedPdfText.length,
      qcms,
    });
  } catch (error: any) {
    console.error('PDF Parse Error:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors de la lecture du fichier PDF/Texte.' }, { status: 500 });
  }
}
