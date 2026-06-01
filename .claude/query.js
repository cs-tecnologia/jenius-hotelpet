const { Client } = require('pg');
const client = new Client({
  host: '37.27.24.82', port: 5432,
  user: 'postgres', password: '1a0b0c2f23c07dac', database: 'JENIUS-HOTELPET'
});

async function run() {
  await client.connect();

  const tables = ['hotcheckout001', 'hotconsumo001', 'hotprop001', 'hotprop002'];
  for (const t of tables) {
    const r = await client.query(
      `SELECT column_name, data_type FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1 ORDER BY ordinal_position`, [t]
    );
    console.log(`\n=== ${t} ===`);
    r.rows.forEach(row => console.log(`  ${row.column_name.padEnd(35)} ${row.data_type}`));
  }

  await client.end();
}
run().catch(e => { console.error('ERRO:', e.message); process.exit(1); });
