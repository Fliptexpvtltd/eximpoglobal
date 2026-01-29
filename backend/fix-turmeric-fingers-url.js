import { query } from './src/config/database.js';

async function fixTurmericFingersImage() {
  try {
    const oldUrl = 'https://sin1.contabostorage.com/eximpo-bucket/products/Turmeric-Finger-1769712010531-bpullx.webp';
    const newUrl = 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/products/Turmeric-Finger-1769712010531-bpullx.webp';
    
    const result = await query(
      "UPDATE products SET images = $1 WHERE name = 'Turmeric Fingers' RETURNING id, name, images",
      [[newUrl]]
    );
    
    console.log('✅ Updated Turmeric Fingers product:', JSON.stringify(result.rows, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixTurmericFingersImage();
