const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mkaqspqmdspoisdjduza.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadCatProtocols() {
  console.log('Uploading 36 CAT Protocols to Supabase...');
  const dbData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'asmedix_db.json'), 'utf8'));
  const cats = dbData.catProtocols || [];

  let count = 0;
  for (const cat of cats) {
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

    const { error } = await supabase.from('cat_protocols').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.log(`Failed for ${cat.id}:`, error.message);
      return false;
    } else {
      count++;
    }
  }

  console.log(`🎉 SUCCESS: Uploaded all ${count}/36 CAT protocols to Supabase!`);
  return true;
}

uploadCatProtocols().catch(console.error);
