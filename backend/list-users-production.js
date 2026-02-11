// Connect to production database and list users
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Load production environment
dotenv.config({ path: '.env.production' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const listUsersProduction = async () => {
  try {
    const result = await pool.query(
      'SELECT id, email, role FROM users ORDER BY email'
    );
    
    console.log('\n📋 Production Database - All Users:\n');
    result.rows.forEach(user => {
      console.log(`Email: ${user.email} | Role: ${user.role}`);
    });
    console.log(`\nTotal users: ${result.rows.length}`);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to production database:', error.message);
    process.exit(1);
  }
};

listUsersProduction();
