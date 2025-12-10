import bcrypt from 'bcryptjs';
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:postgres@postgres:5432/eximpo'
});

async function createAdmin() {
  try {
    await client.connect();
    
    // Generate password hash for 'admin123'
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    // Delete existing admin if exists
    await client.query("DELETE FROM users WHERE email = 'admin@eximpo.com'");
    
    // Insert new admin
    const result = await client.query(
      `INSERT INTO users (email, password_hash, role, full_name, company_name, verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, role, full_name`,
      ['admin@eximpo.com', passwordHash, 'admin', 'System Administrator', 'Eximpo Platform', true]
    );
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', result.rows[0].email);
    console.log('Password: admin123');
    console.log('Role:', result.rows[0].role);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createAdmin();
