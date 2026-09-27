/**
 * Universal Fail-Safe PDF Text Extractor for Node.js / Next.js
 * Requires pdf-parse/lib/pdf-parse.js directly to avoid test data file ENOENT errors
 */

export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  if (!buffer || buffer.length === 0) {
    throw new Error('Le fichier PDF fourni est vide ou invalide.');
  }

  try {
    let pdfParse: any;
    try {
      pdfParse = require('pdf-parse/lib/pdf-parse.js');
    } catch (_libErr) {
      pdfParse = require('pdf-parse');
    }

    // Case 1: Function export (standard pdf-parse 1.1.1)
    if (typeof pdfParse === 'function') {
      const data = await pdfParse(buffer);
      return data?.text || '';
    }

    // Case 2: Object default export
    if (pdfParse && typeof pdfParse.default === 'function') {
      const data = await pdfParse.default(buffer);
      return data?.text || '';
    }

    // Case 3: PDFParse class instance fallback
    if (pdfParse && typeof pdfParse.PDFParse === 'function') {
      const parser = new pdfParse.PDFParse({ data: buffer });
      const textResult = await parser.getText();
      if (typeof textResult === 'string') return textResult;
      if (textResult && typeof textResult.text === 'string') return textResult.text;
      return String(textResult || '');
    }

    throw new Error("Impossible de trouver une méthode d'extraction PDF valide.");
  } catch (err: any) {
    throw new Error(`Erreur de lecture du PDF : ${err.message || 'Fichier PDF corrompu ou illisible'}`);
  }
}
