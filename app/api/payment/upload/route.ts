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
    const filePath = `receipts/${Date.now()}_${sanitizedName}`;

    // Upload to Supabase Storage bucket 'course-files'
    const contentType = file.type || (sanitizedName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
    const { data, error } = await supabaseAdmin.storage
      .from('course-files')
      .upload(filePath, buffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.error('[Payment Receipt Upload Error]:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get permanent public URL
    const { data: publicData } = supabaseAdmin.storage
      .from('course-files')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      path: filePath,
      fileName: file.name,
      size: file.size,
      mimeType: contentType
    });
  } catch (err: any) {
    console.error('[Payment Upload Exception]:', err);
    return NextResponse.json({ error: err.message || 'Erreur lors du téléversement du reçu' }, { status: 500 });
  }
}
