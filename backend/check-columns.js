import { query } from './src/config/database.js';

const res = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users' ORDER BY ordinal_position");
console.log('Users table columns:');
console.log(res.rows.map(r => r.column_name).join('\n'));
process.exit(0);
