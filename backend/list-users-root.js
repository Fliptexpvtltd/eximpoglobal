// Connect to production database with postgres root user
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  password: 'prakash',
  host: 'localhost',
  port: 5432,
  database: 'eximpo',
});

const listUsersProduction = async () => {
  try {
    console.log('🔗 Attempting to connect with postgres root user...');
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
