// Seed sample products into the database
import { query } from './src/config/database.js';

const sampleProducts = [
  {
    name: 'Organic Cotton T-Shirts',
    description: 'Premium organic cotton t-shirts in multiple colors and sizes',
    category: 'Textiles & Apparel',
    subcategory: 'Clothing',
    price: '375.00',
    moq: 500,
    unit: 'pieces',
    incoterms: ['FOB', 'CIF'],
    certifications: ['GOTS', 'OEKO-TEX', 'ISO 9001'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'],
    specifications: { hsCode: '6109.10', leadTime: '25-30 days', originCountry: 'China' },
  },
  {
    name: 'LED Display Modules',
    description: 'High-brightness LED modules for outdoor displays',
    category: 'Electronics & Technology',
    subcategory: 'Displays',
    price: '2340.00',
    moq: 100,
    unit: 'units',
    incoterms: ['FOB', 'EXW'],
    certifications: ['CE', 'RoHS', 'FCC', 'ISO 9001'],
    images: ['https://images.unsplash.com/photo-1555664424-778a1e5e1b48'],
    specifications: { hsCode: '8531.20', leadTime: '15-20 days', originCountry: 'China' },
  },
  {
    name: 'Industrial Water Pumps',
    description: 'Heavy-duty centrifugal pumps for industrial applications',
    category: 'Machinery & Equipment',
    subcategory: 'Pumps',
    price: '20450.00',
    moq: 10,
    unit: 'units',
    incoterms: ['FOB', 'CIF'],
    certifications: ['CE', 'ISO 9001'],
    images: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837'],
    specifications: { hsCode: '8413.70', leadTime: '30-35 days', originCountry: 'China' },
  },
  {
    name: 'Ceramic Floor Tiles',
    description: 'Polished porcelain tiles in various designs',
    category: 'Home & Garden',
    subcategory: 'Flooring',
    price: '710.00',
    moq: 1000,
    unit: 'square meters',
    incoterms: ['FOB', 'CFR'],
    certifications: ['ISO 9001', 'ISO 14001'],
    images: ['https://images.unsplash.com/photo-1523350165414-082d792c4bcc'],
    specifications: { hsCode: '6908.10', leadTime: '20-25 days', originCountry: 'China' },
  },
  {
    name: 'Solar Panel Modules',
    description: 'High-efficiency monocrystalline solar panels',
    category: 'Electronics & Technology',
    subcategory: 'Solar Energy',
    price: '10430.00',
    moq: 50,
    unit: 'units',
    incoterms: ['FOB', 'CIF'],
    certifications: ['CE', 'TUV', 'ISO 9001'],
    images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276'],
    specifications: { hsCode: '8541.40', leadTime: '25-30 days', originCountry: 'China' },
  },
  {
    name: 'Wooden Dining Tables',
    description: 'Solid wood dining tables with modern designs',
    category: 'Home & Garden',
    subcategory: 'Furniture',
    price: '15770.00',
    moq: 20,
    unit: 'units',
    incoterms: ['FOB', 'EXW'],
    certifications: ['FSC', 'ISO 9001'],
    images: ['https://images.unsplash.com/photo-1487015307662-6ce6210680f1'],
    specifications: { hsCode: '9403.60', leadTime: '35-40 days', originCountry: 'Vietnam' },
  },
];

async function seedProducts() {
  try {
    // First, get a seller user
    const sellersResult = await query(
      `SELECT id FROM users WHERE role = 'seller' LIMIT 1`
    );
    
    let supplierId;
    if (sellersResult.rows.length === 0) {
      // Create a sample seller
      const newSeller = await query(
        `INSERT INTO users (email, password_hash, role, full_name, company_name, country, verified) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        ['seller@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'seller', 'Sample Seller', 'Global Exports Ltd', 'China', true]
      );
      supplierId = newSeller.rows[0].id;
    } else {
      supplierId = sellersResult.rows[0].id;
    }

    // Insert sample products
    for (const product of sampleProducts) {
      await query(
        `INSERT INTO products (
          name, description, category, subcategory, price, moq, unit,
          incoterms, certifications, images, specifications, supplier_id, available
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT DO NOTHING`,
        [
          product.name,
          product.description,
          product.category,
          product.subcategory,
          product.price,
          product.moq,
          product.unit,
          product.incoterms,
          product.certifications,
          product.images,
          product.specifications,
          supplierId,
          true
        ]
      );
    }

    console.log('✅ Sample products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
