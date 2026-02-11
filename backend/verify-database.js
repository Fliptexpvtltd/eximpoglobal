import pool from './src/config/database.js';

const verifyDatabase = async () => {
  try {
    console.log('🔍 Checking database...\n');

    // List all tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('📋 Tables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Check if notifications table exists
    const notifCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'notifications'
      );
    `);

    console.log('\n📊 Notifications table status:');
    if (notifCheck.rows[0].exists) {
      console.log('✅ Notifications table EXISTS');
      
      // Show table structure
      const structureResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'notifications'
        ORDER BY ordinal_position;
      `);
      
      console.log('\n📐 Table structure:');
      structureResult.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });

      // Count records
      const countResult = await pool.query('SELECT COUNT(*) FROM notifications;');
      console.log(`\n📈 Records: ${countResult.rows[0].count}`);
    } else {
      console.log('❌ Notifications table does NOT exist');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

verifyDatabase();
