const { Client } = require('pg');

async function testConnection() {
  const configs = [
    {
      name: 'Direct Connection (Port 5432)',
      host: 'db.mkaqspqmdspoisdjduza.supabase.co',
      port: 5432,
      user: 'postgres',
      password: 'Djilali2005/',
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    },
    {
      name: 'Supabase Transaction Pooler (Port 6543)',
      host: 'aws-0-eu-central-1.pooler.supabase.com', // fallback or test
      port: 6543,
      user: 'postgres.mkaqspqmdspoisdjduza',
      password: 'Djilali2005/',
      database: 'postgres',
      ssl: { rejectUnauthorized: false }
    }
  ];

  for (const cfg of configs) {
    console.log(`Testing ${cfg.name}...`);
    const client = new Client(cfg);
    try {
      await client.connect();
      const res = await client.query('SELECT current_database(), current_user, version()');
      console.log('SUCCESS! Connected to PostgreSQL:');
      console.log(res.rows[0]);
      await client.end();
      return cfg;
    } catch (err) {
      console.log(`Failed on ${cfg.name}:`, err.message);
      try { await client.end(); } catch {}
    }
  }
}

testConnection();
