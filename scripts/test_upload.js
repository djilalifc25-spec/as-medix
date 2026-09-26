const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mkaqspqmdspoisdjduza.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  console.log('Testing upload to existing Supabase tables (courses & qcms)...');

  const dbData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'asmedix_db.json'), 'utf8'));

  // 1. Upload Courses
  const courses = dbData.courses || [];
  console.log(`Found ${courses.length} courses to upload.`);
  let courseSuccess = 0;
  for (const c of courses) {
    const payload = {
      id: c.id,
      specialty: c.specialtyId,
      specialty_name: c.specialtyName,
      title: c.title,
      subtitle: c.summary || '',
      duration: '30 min',
      difficulty: 'Incontournable',
      rang: 'Rang A',
      html_content: c.htmlContent || '<p>Contenu du cours</p>'
    };

    const { error } = await supabase.from('courses').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.log(`Error on course ${c.id}:`, error.message);
    } else {
      courseSuccess++;
    }
  }
  console.log(`Uploaded ${courseSuccess}/${courses.length} courses to Supabase!`);

  // 2. Upload QCMs
  const qcms = dbData.qcms || [];
  console.log(`Found ${qcms.length} QCMs to upload.`);
  let qcmSuccess = 0;
  for (const q of qcms) {
    const payload = {
      id: q.id,
      specialty: q.specialtyId,
      specialty_name: q.specialtyName,
      course_id: q.courseId || '',
      course_title: q.courseTitle || '',
      rang: 'Rang A',
      title: q.question.slice(0, 100),
      vignette: q.question,
      options: q.options || [],
      correct_answers: q.correctAnswers || [],
      explanation: q.explanation || ''
    };

    const { error } = await supabase.from('qcms').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.log(`Error on QCM ${q.id}:`, error.message);
    } else {
      qcmSuccess++;
    }
  }
  console.log(`Uploaded ${qcmSuccess}/${qcms.length} QCMs to Supabase!`);
}

testUpload().catch(console.error);
