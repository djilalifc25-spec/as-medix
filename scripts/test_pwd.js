const { Client } = require('pg');

const passwords = [
  'Djilali2005',
  'Djilali2005/',
  'djilali2005',
  'djilali2005/'
];

async function testPasswords() {
  for (const pwd of passwords) {
    console.log(`Testing password '${pwd}' on aws-0-eu-central-1.pooler.supabase.com...`);
    const client = new Client({
      host: 'aws-0-eu-central-1.pooler.supabase.com',
      port: 6543,
      user: 'postgres.mkaqspqmdspoisdjduza',
      password: pwd,
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(`🎉 SUCCESS! Connected with password: ${pwd}`);
      const res = await client.query('SELECT current_database(), current_user, version()');
      console.log(res.rows[0]);
      await client.end();
      return pwd;
    } catch (e) {
      console.log(`Failed with '${pwd}':`, e.message);
      try { await client.end(); } catch {}
    }
  }
}

testPasswords();
