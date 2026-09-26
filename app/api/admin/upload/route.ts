import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    // Allow receipts folder upload for all users (register/checkout payment proof), restrict others to admin
    if (folder !== 'receipts') {
      const currentUser = await getCurrentUser();
      if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
      }
    }

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .toLowerCase();
    const filePath = `${folder}/${Date.now()}_${sanitizedName}`;

    // Upload to Supabase Storage bucket 'course-files'
    const { data, error } = await supabaseAdmin.storage
      .from('course-files')
      .upload(filePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: true
      });

    if (error) {
      console.error('[Supabase Storage Upload Error]:', error);
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
      mimeType: file.type
    });
  } catch (err: any) {
    console.error('[Upload API Exception]:', err);
    return NextResponse.json({ error: err.message || 'Erreur lors du téléversement' }, { status: 500 });
  }
}
