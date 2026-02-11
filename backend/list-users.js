// List all users in the database
import { query } from './src/config/database.js';

const listUsers = async () => {
  try {
    const result = await query(
      'SELECT id, email, role FROM users ORDER BY email'
    );
    
    console.log('\n📋 All users in the database:\n');
    result.rows.forEach(user => {
      console.log(`Email: ${user.email} | Role: ${user.role}`);
    });
    console.log(`\nTotal users: ${result.rows.length}`);
    process.exit(0);
  } catch (error) {
    console.error('Error listing users:', error);
    process.exit(1);
  }
};

listUsers();
