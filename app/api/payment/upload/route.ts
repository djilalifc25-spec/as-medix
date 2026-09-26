import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier de reçu fourni' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = (file.name || 'recu.jpg')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .toLowerCase();
    const fileName = `${Date.now()}_${sanitizedName}`;
    const contentType = file.type || (sanitizedName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');

    let publicUrl = '';

    // 1. Try saving locally to public/uploads/receipts/ (Guaranteed local static file)
    try {
      const publicDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const localFilePath = path.join(publicDir, fileName);
      fs.writeFileSync(localFilePath, buffer);
      publicUrl = `/uploads/receipts/${fileName}`;
    } catch (fsErr) {
      console.warn('[Local Receipt Save Warning]:', fsErr);
    }

    // 2. Try uploading to Supabase Storage (Bypasses errors if keys are invalid)
    try {
      const filePath = `receipts/${fileName}`;
      const { data, error } = await supabaseAdmin.storage
        .from('course-files')
        .upload(filePath, buffer, {
          contentType,
          upsert: true
        });

      if (!error && data) {
        const { data: publicData } = supabaseAdmin.storage
          .from('course-files')
          .getPublicUrl(filePath);
        if (publicData?.publicUrl) {
          publicUrl = publicData.publicUrl;
        }
      } else if (error) {
        console.warn('[Supabase Storage Warning (bypassed)]:', error.message);
      }
    } catch (sbErr: any) {
      console.warn('[Supabase Storage Exception (bypassed)]:', sbErr.message);
    }

    // 3. Fallback to Base64 Data URL if neither is available so receipt image is NEVER lost
    if (!publicUrl) {
      const base64 = buffer.toString('base64');
      publicUrl = `data:${contentType};base64,${base64}`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      size: file.size,
      mimeType: contentType
    });
  } catch (err: any) {
    console.error('[Payment Upload Exception]:', err);
    return NextResponse.json({ error: err.message || 'Erreur lors du téléversement du reçu' }, { status: 500 });
  }
}
