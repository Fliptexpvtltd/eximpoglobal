// Seed sample RFQs into the database
import { query } from './src/config/database.js';

const sampleRFQs = [
  {
    title: 'Organic Cotton T-Shirts - Bulk Order',
    description: 'Looking for premium organic cotton t-shirts in multiple colors',
    category: 'Textiles & Apparel',
    lineItems: [
      { productName: 'Organic Cotton T-Shirts', quantity: 5000, specifications: 'Cotton, 200gsm, Various colors' }
    ],
    deliveryDate: '2025-02-15',
    deliveryLocation: 'Los Angeles, USA',
    incoterms: 'FOB',
    paymentTerms: 'LC at sight',
    expiresAt: '2025-12-20',
  },
  {
    title: 'LED Display Modules for Outdoor Advertising',
    description: 'Need CE certified LED modules for outdoor displays',
    category: 'Electronics & Technology',
    lineItems: [
      { productName: 'LED Display Modules', quantity: 1000, specifications: 'CE certified, P5 or P6' }
    ],
    deliveryDate: '2025-01-30',
    deliveryLocation: 'Hamburg, Germany',
    incoterms: 'CIF',
    paymentTerms: 'T/T 30% advance',
    expiresAt: '2025-12-15',
  },
  {
    title: 'Industrial Water Pumps',
    description: 'Heavy-duty centrifugal pumps for manufacturing facility',
    category: 'Machinery & Equipment',
    lineItems: [
      { productName: 'Industrial Water Pumps', quantity: 50, specifications: 'Centrifugal, 50HP' }
    ],
    deliveryDate: '2025-02-28',
    deliveryLocation: 'Rotterdam, Netherlands',
    incoterms: 'EXW',
    paymentTerms: 'LC 60 days',
    expiresAt: '2025-12-25',
  },
];

async function seedRFQs() {
  try {
    // Get a buyer user
    const buyersResult = await query(
      `SELECT id FROM users WHERE role = 'buyer' LIMIT 1`
    );
    
    let buyerId;
    if (buyersResult.rows.length === 0) {
      // Create a sample buyer
      const newBuyer = await query(
        `INSERT INTO users (email, password_hash, role, full_name, company_name, country, verified) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        ['buyer@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', 'buyer', 'Sample Buyer', 'Global Imports Inc', 'USA', true]
      );
      buyerId = newBuyer.rows[0].id;
    } else {
      buyerId = buyersResult.rows[0].id;
    }

    // Insert sample RFQs
    for (const rfq of sampleRFQs) {
      await query(
        `INSERT INTO rfqs (
          buyer_id, title, description, category, line_items, 
          delivery_date, delivery_location, incoterms, payment_terms, expires_at, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT DO NOTHING`,
        [
          buyerId,
          rfq.title,
          rfq.description,
          rfq.category,
          JSON.stringify(rfq.lineItems),
          rfq.deliveryDate,
          rfq.deliveryLocation,
          rfq.incoterms,
          rfq.paymentTerms,
          rfq.expiresAt,
          'open'
        ]
      );
    }

    console.log('✅ Sample RFQs seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding RFQs:', error);
    process.exit(1);
  }
}

seedRFQs();
