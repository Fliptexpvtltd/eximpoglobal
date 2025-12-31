// Seed sample orders into the database for testing shipment management
import { query } from './src/config/database.js';

async function seedOrders() {
  try {
    console.log('🌱 Starting order seeding...');

    // Get a buyer and seller
    const buyersResult = await query(
      `SELECT id, email, company_name FROM users WHERE role = 'buyer' LIMIT 1`
    );
    
    const sellersResult = await query(
      `SELECT id, email, company_name FROM users WHERE role = 'seller' LIMIT 1`
    );

    if (buyersResult.rows.length === 0) {
      console.error('❌ No buyer users found. Please create users first.');
      return;
    }

    if (sellersResult.rows.length === 0) {
      console.error('❌ No seller users found. Please create users first.');
      return;
    }

    const buyer = buyersResult.rows[0];
    const seller = sellersResult.rows[0];

    console.log(`✅ Found buyer: ${buyer.email}`);
    console.log(`✅ Found seller: ${seller.email}`);

    // Create sample orders with different statuses
    const orders = [
      {
        orderNumber: `ORD-${Date.now()}-001`,
        status: 'confirmed',
        paymentStatus: 'pending',
        totalAmount: 15000.00,
        currency: 'USD',
        incoterms: 'FOB',
        deliveryDate: '2025-02-15',
        deliveryLocation: 'Los Angeles, USA',
        paymentTerms: 'LC at sight',
        lineItems: [
          {
            productName: 'Organic Cotton T-Shirts',
            quantity: 5000,
            unitPrice: 3.00,
            specifications: 'Cotton, 200gsm, Various colors'
          }
        ]
      },
      {
        orderNumber: `ORD-${Date.now()}-002`,
        status: 'processing',
        paymentStatus: 'paid',
        totalAmount: 25000.00,
        currency: 'USD',
        incoterms: 'CIF',
        deliveryDate: '2025-01-30',
        deliveryLocation: 'Hamburg, Germany',
        paymentTerms: 'T/T 30% advance',
        lineItems: [
          {
            productName: 'LED Display Modules',
            quantity: 1000,
            unitPrice: 25.00,
            specifications: 'CE certified, P5 or P6'
          }
        ]
      },
      {
        orderNumber: `ORD-${Date.now()}-003`,
        status: 'shipped',
        paymentStatus: 'paid',
        totalAmount: 45000.00,
        currency: 'USD',
        incoterms: 'EXW',
        deliveryDate: '2025-02-28',
        deliveryLocation: 'Rotterdam, Netherlands',
        paymentTerms: 'LC 60 days',
        lineItems: [
          {
            productName: 'Industrial Water Pumps',
            quantity: 50,
            unitPrice: 900.00,
            specifications: 'Centrifugal, 50HP'
          }
        ]
      },
      {
        orderNumber: `ORD-${Date.now()}-004`,
        status: 'confirmed',
        paymentStatus: 'paid',
        totalAmount: 8500.00,
        currency: 'USD',
        incoterms: 'FOB',
        deliveryDate: '2025-03-10',
        deliveryLocation: 'New York, USA',
        paymentTerms: 'T/T in advance',
        lineItems: [
          {
            productName: 'Ceramic Tiles',
            quantity: 2000,
            unitPrice: 4.25,
            specifications: '600x600mm, Porcelain'
          }
        ]
      }
    ];

    let created = 0;
    for (const order of orders) {
      const result = await query(
        `INSERT INTO orders (
          order_number, buyer_id, seller_id, status, payment_status,
          total_amount, items, subtotal, delivery_address, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, order_number, status`,
        [
          order.orderNumber,
          buyer.id,
          seller.id,
          order.status,
          order.paymentStatus,
          order.totalAmount,
          JSON.stringify(order.lineItems),
          order.totalAmount,
          order.deliveryLocation,
          `${order.incoterms} | ${order.paymentTerms} | Delivery: ${order.deliveryDate}`
        ]
      );

      console.log(`✅ Created order: ${result.rows[0].order_number} (Status: ${result.rows[0].status})`);
      created++;

      // Create a shipment for the 'shipped' order
      if (order.status === 'shipped') {
        const shipmentResult = await query(
          `INSERT INTO shipments (
            order_id, tracking_number, carrier, method,
            status, origin, destination, estimated_delivery
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, tracking_number`,
          [
            result.rows[0].id,
            `TRACK-${Date.now()}`,
            'Maersk',
            'sea',
            'in_transit',
            'Shanghai, China',
            order.deliveryLocation,
            order.deliveryDate
          ]
        );

        console.log(`📦 Created shipment: ${shipmentResult.rows[0].tracking_number}`);
      }
    }

    console.log(`\n🎉 Successfully seeded ${created} orders!`);
    console.log('\n📋 Order Summary:');
    console.log('  - 2 orders with status "confirmed" → Will show "Create Shipment" button');
    console.log('  - 1 order with status "processing" → Will show "Create Shipment" button');
    console.log('  - 1 order with status "shipped" → Will show "Update Tracking" button');
    console.log('\n💡 Login as seller to see the shipment management section in the dashboard!');
    
  } catch (error) {
    console.error('❌ Error seeding orders:', error.message);
    console.error(error);
  } finally {
    process.exit(0);
  }
}

seedOrders();
