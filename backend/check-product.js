import { query } from './src/config/database.js';

async function checkProduct() {
  try {
    const result = await query(
      "SELECT id, name, images, approval_status, available, created_at FROM products ORDER BY created_at DESC LIMIT 5"
    );
    console.log('Recent products:', JSON.stringify(result.rows, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProduct();
