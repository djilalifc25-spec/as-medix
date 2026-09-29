const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

let envText = '';
if (fs.existsSync('.env.local')) envText = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envText.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v) envVars[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function purge() {
  console.log('--- PURGING ALL CARDIO COURSES, QCMS, AND SOURCES ---');

  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Delete cardio courses from Supabase
    const { error: cErr } = await supabase.from('courses').delete().or('specialty.eq.cardio,specialty_id.eq.cardio');
    console.log('Supabase delete cardio courses result:', cErr || 'Success');

    // Also delete specifically by titles/slugs if any
    const { error: cErr2 } = await supabase.from('courses').delete().in('slug', ['yyyy', 'nononon', 'hyh', 'retrecissement-mitral', 'insuffisance-cardiaque-aigue-et-chronique', 'le-retrecissement-mitral-stenose-mitrale']);
    console.log('Supabase delete cardio courses by slug result:', cErr2 || 'Success');

    // 2. Delete cardio qcms from Supabase
    const { error: qErr } = await supabase.from('qcms').delete().or('specialty.eq.cardio,specialty_id.eq.cardio');
    console.log('Supabase delete cardio qcms result:', qErr || 'Success');

    // 3. Delete custom_sources with cardio in scope_key
    const { data: sources } = await supabase.from('custom_sources').select('scope_key');
    if (sources) {
      const cardioKeys = sources.filter(s => s.scope_key && s.scope_key.includes('cardio')).map(s => s.scope_key);
      if (cardioKeys.length > 0) {
        const { error: sErr } = await supabase.from('custom_sources').delete().in('scope_key', cardioKeys);
        console.log('Supabase delete custom_sources result:', sErr || 'Success');
      }
    }
  }

  // 4. Update data/asmedix_db.json
  if (fs.existsSync('./data/asmedix_db.json')) {
    const dbData = JSON.parse(fs.readFileSync('./data/asmedix_db.json', 'utf8'));
    if (Array.isArray(dbData.courses)) {
      const initCount = dbData.courses.length;
      dbData.courses = dbData.courses.filter(c => c.specialtyId !== 'cardio' && c.slug !== 'yyyy' && c.slug !== 'nononon' && c.slug !== 'hyh');
      console.log(`JSON courses reduced from ${initCount} to ${dbData.courses.length}`);
    }
    if (Array.isArray(dbData.qcms)) {
      const initCount = dbData.qcms.length;
      dbData.qcms = dbData.qcms.filter(q => q.specialtyId !== 'cardio');
      console.log(`JSON qcms reduced from ${initCount} to ${dbData.qcms.length}`);
    }
    if (dbData.customSources) {
      Object.keys(dbData.customSources).forEach(k => {
        if (k.includes('cardio')) delete dbData.customSources[k];
      });
    }
    if (!dbData.deletedCourseIds) dbData.deletedCourseIds = [];
    ['custom-cardio-1788574898544', 'cours_cardio_rm', 'cours_cardio_ic', 'cours_cardio_yyyy', 'cours_cardio_nononon', 'cours_cardio_hyh'].forEach(id => {
      if (!dbData.deletedCourseIds.includes(id)) dbData.deletedCourseIds.push(id);
    });
    fs.writeFileSync('./data/asmedix_db.json', JSON.stringify(dbData, null, 2), 'utf8');
    console.log('Saved data/asmedix_db.json');
  }

  // 5. Clean seedCourses.ts - remove cardio course objects
  if (fs.existsSync('./lib/db/seedCourses.ts')) {
    let content = fs.readFileSync('./lib/db/seedCourses.ts', 'utf8');
    // We can parse the exported array or clean objects with specialtyId: "cardio"
    // Let's filter out objects in TS using regex or AST
    const updatedContent = content.replace(/\{\s*"id":\s*"(?:custom-cardio-[^"]+|cours_cardio_[^"]+)"[\s\S]*?\n  \}(?:,\n)?/g, '');
    fs.writeFileSync('./lib/db/seedCourses.ts', updatedContent, 'utf8');
    console.log('Cleaned seedCourses.ts');
  }

  // 6. Clean seedQcm.ts - remove cardio QCM objects
  if (fs.existsSync('./lib/db/seedQcm.ts')) {
    let content = fs.readFileSync('./lib/db/seedQcm.ts', 'utf8');
    const updatedContent = content.replace(/\{\s*"id":\s*"(?:qcm_rm_[^"]+|qcm_cardio_[^"]+)"[\s\S]*?\n  \}(?:,\n)?/g, '');
    fs.writeFileSync('./lib/db/seedQcm.ts', updatedContent, 'utf8');
    console.log('Cleaned seedQcm.ts');
  }

  console.log('--- PURGE COMPLETE ---');
}

purge();
