import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

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

    // 1. Convert to Base64 Data URL (Guaranteed to render in browser without 404 on Vercel cold restarts)
    const base64 = buffer.toString('base64');
    let publicUrl = `data:${contentType};base64,${base64}`;

    // 2. Best-effort upload to Supabase Storage
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
      }
    } catch (sbErr: any) {}

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
