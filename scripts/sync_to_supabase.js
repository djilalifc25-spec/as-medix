const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mkaqspqmdspoisdjduza.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('Please set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncAll() {
  console.log('--- SYNCING AS-MEDIX TO SUPABASE ---');

  // 1. Sync CAT Protocols
  const dbData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'asmedix_db.json'), 'utf8'));
  const catProtocols = dbData.catProtocols || [];
  console.log(`Uploading ${catProtocols.length} CAT emergency protocols...`);

  for (const cat of catProtocols) {
    const payload = {
      id: cat.id,
      slug: cat.slug,
      title: cat.title,
      specialty_id: cat.specialtyId,
      specialty_name: cat.specialtyName,
      category: cat.category || cat.specialtyName,
      urgency_level: cat.urgencyLevel,
      severity: cat.severity || 'amber',
      page: cat.page || '',
      synopsis: cat.synopsis || cat.summary || '',
      clinique_html: cat.cliniqueHtml || '',
      urgence_html: cat.urgenceHtml || '',
      protocole_html: cat.protocoleHtml || '',
      bilan_html: cat.bilanHtml || '',
      alertes: cat.alertes || (cat.redFlags ? cat.redFlags.join(' • ') : ''),
      conseils: cat.conseils || '',
      ordonnance: cat.ordonnance || [],
      published: true
    };

    const { error } = await supabase
      .from('cat_protocols')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error(`Failed to upsert CAT ${cat.id}:`, error.message);
    } else {
      console.log(`✓ CAT: ${cat.title}`);
    }
  }

  // 2. Sync Courses
  const courses = dbData.courses || [];
  console.log(`Uploading ${courses.length} courses...`);
  for (const crs of courses) {
    const payload = {
      id: crs.id,
      slug: crs.slug,
      title: crs.title,
      specialty_id: crs.specialtyId,
      specialty_name: crs.specialtyName,
      faculty: crs.faculty || 'TOUS',
      source: crs.source || '',
      summary: crs.summary || '',
      html_content: crs.htmlContent || '',
      audio_url: crs.audioUrl || null,
      audio_duration: crs.audioDuration || null,
      audio_title: crs.audioTitle || null,
      published: crs.published !== false
    };

    const { error } = await supabase
      .from('courses')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error(`Failed to upsert course ${crs.id}:`, error.message);
    } else {
      console.log(`✓ Course: ${crs.title}`);
    }
  }

  // 3. Sync QCMs
  const qcms = dbData.qcms || [];
  console.log(`Uploading ${qcms.length} QCMs...`);
  for (const q of qcms) {
    const payload = {
      id: q.id,
      specialty_id: q.specialtyId,
      specialty_name: q.specialtyName,
      course_id: q.courseId || null,
      course_title: q.courseTitle || null,
      question: q.question,
      options: q.options || [],
      correct_answers: q.correctAnswers || [],
      explanation: q.explanation || '',
      source: q.source || null,
      faculty: q.faculty || 'TOUS',
      year: q.year || null
    };

    const { error } = await supabase
      .from('qcms')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error(`Failed to upsert QCM ${q.id}:`, error.message);
    }
  }
  console.log(`✓ Finished uploading QCMs.`);

  console.log('--- ALL DATA SYNCED SUCCESSFULLY TO SUPABASE! ---');
}

syncAll().catch(console.error);
