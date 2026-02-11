import pool from './src/config/database.js';

const migrateDatabase = async () => {
  try {
    console.log('🔄 Creating notifications table...\n');

    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('message', 'quote', 'order', 'alert', 'info')),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        related_id UUID,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Notifications table created successfully');

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
    `);
    console.log('✅ Index idx_notifications_user created');

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
    `);
    console.log('✅ Index idx_notifications_user_read created');

    console.log('\n🎉 Database migration completed successfully!');
    console.log('📝 Next step: Run "node add-sample-notifications.js" to add test data');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

migrateDatabase();
