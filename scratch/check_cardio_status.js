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

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');

async function check() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('No Supabase credentials');
    return;
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: courses, error: cErr } = await supabase.from('courses').select('id, title, specialty, specialty_id');
  console.log('Supabase courses count:', courses ? courses.length : 0, cErr || '');
  if (courses) {
    const cardioCourses = courses.filter(c => (c.specialty_id === 'cardio' || c.specialty === 'cardio'));
    console.log('Supabase Cardio courses:', cardioCourses);
  }

  const { data: qcms, error: qErr } = await supabase.from('qcms').select('id, title, specialty, specialty_id, source');
  console.log('Supabase qcms count:', qcms ? qcms.length : 0, qErr || '');
  if (qcms) {
    const cardioQcms = qcms.filter(q => (q.specialty_id === 'cardio' || q.specialty === 'cardio'));
    console.log('Supabase Cardio qcms:', cardioQcms);
  }

  const { data: sources, error: sErr } = await supabase.from('custom_sources').select('*');
  console.log('Supabase custom_sources:', sources ? sources.length : 0, sErr || '');
  if (sources) {
    const cardioSources = sources.filter(s => s.scope_key && s.scope_key.includes('cardio'));
    console.log('Supabase Cardio custom_sources:', cardioSources);
  }

  // Local JSON check
  if (fs.existsSync('./data/asmedix_db.json')) {
    const localDb = JSON.parse(fs.readFileSync('./data/asmedix_db.json', 'utf8'));
    console.log('Local Db cardio courses:', localDb.courses ? localDb.courses.filter(c => c.specialtyId === 'cardio').map(c => ({ id: c.id, title: c.title })) : []);
    console.log('Local Db cardio qcms:', localDb.qcms ? localDb.qcms.filter(q => q.specialtyId === 'cardio').map(q => ({ id: q.id, title: q.title, source: q.source })) : []);
    console.log('Local Db customSources:', localDb.customSources);
  }
}

check();
