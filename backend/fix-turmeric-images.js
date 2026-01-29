import { query } from './src/config/database.js';

async function fixTurmericImages() {
  try {
    const imageUrl = 'https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/products/turmeric-fingers-1769707676324-u4v3ie.png';
    
    const result = await query(
      "UPDATE products SET images = $1 WHERE name LIKE '%Turmeric%' RETURNING id, name, images",
      [[imageUrl]]  // Wrap in array since images column expects an array
    );
    
    console.log('✅ Updated product:', JSON.stringify(result.rows, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixTurmericImages();
