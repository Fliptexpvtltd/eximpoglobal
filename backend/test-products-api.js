import { query } from './src/config/database.js';

async function testProductsAPI() {
  try {
    const result = await query(`
      SELECT p.*, u.company_name as supplier_name, u.country as supplier_country
      FROM products p
      JOIN users u ON p.supplier_id = u.id
      WHERE p.available = true AND p.approval_status = 'approved'
      ORDER BY p.created_at DESC
      LIMIT 5
    `);
    
    console.log('Products API would return:', JSON.stringify(result.rows, null, 2));
    console.log('\nTotal approved products:', result.rows.length);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testProductsAPI();
