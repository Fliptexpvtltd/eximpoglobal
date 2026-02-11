import { query } from './src/config/database.js';

try {
  const res = await query('SELECT DISTINCT role FROM users LIMIT 10');
  console.log('User roles:');
  console.log(res.rows.map(r => r.role).join(', '));
  
  // Count suppliers
  const suppliers = await query('SELECT COUNT(*) as count FROM users WHERE role = $1 OR role = $2', ['supplier', 'seller']);
  console.log('Suppliers count:', suppliers.rows[0].count);
  
  process.exit(0);
} catch(e) {
  console.error('Error:', e.message);
  process.exit(1);
}
