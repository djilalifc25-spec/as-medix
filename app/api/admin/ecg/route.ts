import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ECGRecord } from '@/types';

async function syncEcgToSupabase(record: ECGRecord) {
  try {
    const payload = {
      id: String(record.id),
      title: String(record.title),
      category: String(record.category || 'Trouble du rythme'),
      image_url: String(record.imageUrl || ''),
      clinical_context: String(record.clinicalContext || ''),
      difficulty: String(record.difficulty || 'Débutant'),
      is_daily_challenge: Boolean(record.isDailyChallenge),
      key_findings: Array.isArray(record.keyFindings) ? record.keyFindings : [],
      interpretation: String(record.interpretation || ''),
      diagnostic_details: String(record.diagnosticDetails || ''),
      access_level: String(record.accessLevel || 'FREE'),
      svg_html: String(record.svgHtml || ''),
      updated_at: new Date().toISOString()
    };
    await supabaseAdmin.from('ecg_records').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('[Supabase Sync] ECG upsert warning:', err);
  }
}

async function deleteEcgFromSupabase(id: string) {
  try {
    await supabaseAdmin.from('ecg_records').delete().eq('id', id);
  } catch (err) {
    console.warn('[Supabase Sync] ECG delete warning:', err);
  }
}

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }

  const records = db.getEcgRecords();
  return NextResponse.json({ success: true, records });
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const body = await req.json();
    const newRecord: ECGRecord = {
      id: body.id || 'ecg_' + Date.now(),
      title: body.title,
      category: body.category || 'Trouble du rythme',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200',
      clinicalContext: body.clinicalContext || '',
      difficulty: body.difficulty || 'Débutant',
      isDailyChallenge: Boolean(body.isDailyChallenge),
      keyFindings: body.keyFindings || [],
      interpretation: body.interpretation || '',
      diagnosticDetails: body.diagnosticDetails || '',
      accessLevel: body.accessLevel || 'FREE',
      svgHtml: body.svgHtml || ''
    };

    const saved = db.createEcgRecord(newRecord);
    await syncEcgToSupabase(newRecord);

    return NextResponse.json({ success: true, record: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });
    
    db.deleteEcgRecord(id);
    await deleteEcgFromSupabase(id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
