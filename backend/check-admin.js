import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function checkAndCreateAdmin() {
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Check if admin exists
    const checkResult = await client.query(
      "SELECT id, email, role FROM users WHERE email = 'admin@eximpo.com'"
    );
    
    if (checkResult.rows.length > 0) {
      console.log('✅ Admin user already exists:', checkResult.rows[0].email);
      console.log('Role:', checkResult.rows[0].role);
      console.log('Password should be: admin123');
    } else {
      console.log('⚠️ Admin user not found, creating...');
      
      // Generate password hash for 'admin123'
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      // Insert new admin
      const result = await client.query(
        `INSERT INTO users (email, password_hash, role, full_name, company_name, verified, auth_provider)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, email, role, full_name`,
        ['admin@eximpo.com', passwordHash, 'admin', 'System Administrator', 'Eximpo Platform', true, 'local']
      );
      
      console.log('✅ Admin user created successfully!');
      console.log('Email:', result.rows[0].email);
      console.log('Password: admin123');
      console.log('Role:', result.rows[0].role);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
}

checkAndCreateAdmin();
