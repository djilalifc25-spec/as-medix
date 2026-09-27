/**
 * Universal Fail-Safe PDF Text Extractor
 * Compatible with pdf-parse v1 (function) and v2+ (PDFParse class)
 */

export async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  if (!buffer || buffer.length === 0) {
    throw new Error('Buffer PDF vide ou invalide.');
  }

  const pdfModule = require('pdf-parse');

  // Case 1: Standard pdf-parse v1 (function)
  if (typeof pdfModule === 'function') {
    const data = await pdfModule(buffer);
    return data?.text || '';
  }

  // Case 2: pdf-parse v2+ (PDFParse class instance)
  if (pdfModule && typeof pdfModule.PDFParse === 'function') {
    const parser = new pdfModule.PDFParse({ data: buffer });
    const textResult = await parser.getText();
    if (typeof textResult === 'string') return textResult;
    if (textResult && typeof textResult.text === 'string') return textResult.text;
    return String(textResult || '');
  }

  // Case 3: Object with default export function
  if (pdfModule && typeof pdfModule.default === 'function') {
    const data = await pdfModule.default(buffer);
    return data?.text || '';
  }

  // Case 4: Object with parse method
  if (pdfModule && typeof pdfModule.parse === 'function') {
    const data = await pdfModule.parse(buffer);
    return data?.text || String(data || '');
  }

  throw new Error("Module pdf-parse incompatible ou méthode d'extraction non trouvée.");
}
