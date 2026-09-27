/**
 * Universal Fail-Safe PDF Text Extractor
 * Compatible with pdf-parse v1 (function) and v2+ (PDFParse class)
 * Polyfills DOMMatrix, Path2D, and ImageData for Node.js environment
 */

// ---------------------------------------------------------------------------
// Node.js DOM Polyfills required by pdfjs-dist / pdf-parse v2+
// ---------------------------------------------------------------------------
if (typeof globalThis.DOMMatrix === 'undefined') {
  class DOMMatrixShim {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    m11 = 1; m12 = 0; m13 = 0; m14 = 0;
    m21 = 0; m22 = 1; m23 = 0; m24 = 0;
    m31 = 0; m32 = 0; m33 = 1; m34 = 0;
    m41 = 0; m42 = 0; m43 = 0; m44 = 1;
    is2D = true;
    isIdentity = true;

    constructor(init?: any) {
      if (Array.isArray(init) && init.length >= 6) {
        this.a = this.m11 = init[0];
        this.b = this.m12 = init[1];
        this.c = this.m21 = init[2];
        this.d = this.m22 = init[3];
        this.e = this.m41 = init[4];
        this.f = this.m42 = init[5];
      }
    }

    multiply(_other?: any) { return this; }
    translate(_tx = 0, _ty = 0) { return this; }
    scale(_sx = 1, _sy = 1) { return this; }
    rotate(_angle = 0) { return this; }
    transformPoint(pt?: any) { return pt || { x: 0, y: 0, z: 0, w: 1 }; }
    inverse() { return this; }
    invertSelf() { return this; }
  }
  (globalThis as any).DOMMatrix = DOMMatrixShim;
}

if (typeof globalThis.Path2D === 'undefined') {
  (globalThis as any).Path2D = class Path2DShim {};
}

if (typeof globalThis.ImageData === 'undefined') {
  (globalThis as any).ImageData = class ImageDataShim {
    width: number;
    height: number;
    data: Uint8ClampedArray;
    constructor(w: number, h: number) {
      this.width = w;
      this.height = h;
      this.data = new Uint8ClampedArray(w * h * 4);
    }
  };
}

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
    if (textResult && Array.isArray(textResult.pages)) {
      return textResult.pages.map((p: any) => p.text || p.content || '').join('\n\n');
    }
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
