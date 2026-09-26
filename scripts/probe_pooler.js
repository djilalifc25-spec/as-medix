const { Client } = require('pg');

const regions = [
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-eu-west-3.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
  'aws-0-ca-central-1.pooler.supabase.com',
  'aws-0-me-central-1.pooler.supabase.com'
];

async function findPooler() {
  for (const host of regions) {
    console.log(`Checking ${host}...`);
    const client = new Client({
      host: host,
      port: 6543,
      user: 'postgres.mkaqspqmdspoisdjduza',
      password: 'Djilali2005/',
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });

    try {
      await client.connect();
      console.log(`🎉 CONNECTED SUCCESSFULLY TO ${host}!`);
      const res = await client.query('SELECT current_database(), current_user');
      console.log('Result:', res.rows[0]);
      await client.end();
      return host;
    } catch (e) {
      console.log(`Failed on ${host}:`, e.message);
      try { await client.end(); } catch {}
    }
  }
}

findPooler();
