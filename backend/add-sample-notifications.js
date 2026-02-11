import pool from './src/config/database.js';

// Get first user from database
const addSampleNotifications = async () => {
  try {
    console.log('🔍 Fetching first user...');
    
    // Get first user
    const userResult = await pool.query(
      'SELECT id, email, company_name FROM users LIMIT 1'
    );

    if (userResult.rows.length === 0) {
      console.error('❌ No users found in database');
      process.exit(1);
    }

    const user = userResult.rows[0];
    console.log(`✅ Found user: ${user.email} (${user.company_name})`);
    console.log(`📝 Adding sample notifications for user: ${user.id}\n`);

    // Sample notifications
    const notifications = [
      {
        user_id: user.id,
        type: 'message',
        title: 'New Message from Supplier',
        description: 'Samsung Electronics replied to your RFQ request with a quote.',
        related_id: null
      },
      {
        user_id: user.id,
        type: 'quote',
        title: 'Quote Received',
        description: 'Supplier has sent you a new quote for your RFQ. Amount: $5,000',
        related_id: null
      },
      {
        user_id: user.id,
        type: 'order',
        title: 'Order Confirmed',
        description: 'Your purchase order PO-2024-001 has been confirmed by supplier.',
        related_id: null
      },
      {
        user_id: user.id,
        type: 'order',
        title: 'Order Shipped',
        description: 'Your order PO-2024-001 has been shipped. Track your delivery.',
        related_id: null
      },
      {
        user_id: user.id,
        type: 'alert',
        title: 'Action Required',
        description: 'Please complete your KYC verification to continue trading.',
        related_id: null
      },
      {
        user_id: user.id,
        type: 'info',
        title: 'New Feature Available',
        description: 'Check out our new quality inspection service for your orders.',
        related_id: null
      }
    ];

    // Insert each notification
    for (const notif of notifications) {
      const result = await pool.query(
        `INSERT INTO notifications (user_id, type, title, description, related_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, type, title`,
        [notif.user_id, notif.type, notif.title, notif.description, notif.related_id]
      );

      console.log(`✅ Added: [${result.rows[0].type.toUpperCase()}] ${result.rows[0].title}`);
    }

    console.log(`\n✨ Successfully added ${notifications.length} sample notifications!`);
    console.log(`🔔 Log in as ${user.email} to see notifications in the panel\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding notifications:', error);
    process.exit(1);
  }
};

addSampleNotifications();
