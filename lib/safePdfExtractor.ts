/**
 * Universal Fail-Safe PDF Text Extractor for Node.js / Next.js
 * Powered by pdf-parse v1.1.1 (Pure Node.js parser with zero Web Worker dependencies)
 */

export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  if (!buffer || buffer.length === 0) {
    throw new Error('Le fichier PDF fourni est vide ou invalide.');
  }

  try {
    const pdfModule = require('pdf-parse');

    // Case 1: Standard pdf-parse v1 function
    if (typeof pdfModule === 'function') {
      const data = await pdfModule(buffer);
      return data?.text || '';
    }

    // Case 2: Object with default export
    if (pdfModule && typeof pdfModule.default === 'function') {
      const data = await pdfModule.default(buffer);
      return data?.text || '';
    }

    // Case 3: PDFParse class instance fallback (v2+)
    if (pdfModule && typeof pdfModule.PDFParse === 'function') {
      const parser = new pdfModule.PDFParse({ data: buffer });
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
