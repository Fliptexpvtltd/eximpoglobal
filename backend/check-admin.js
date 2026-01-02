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
      "SELECT id, email, role FROM users WHERE email = 'eximpoglobalofficial@gmail.com'"
    );
    
    if (checkResult.rows.length > 0) {
      console.log('✅ Admin user already exists:', checkResult.rows[0].email);
      console.log('Role:', checkResult.rows[0].role);
      
      // Update to admin role if needed
      if (checkResult.rows[0].role !== 'admin') {
        await client.query(
          "UPDATE users SET role = 'admin', password_hash = $1, auth_provider = 'local' WHERE email = 'eximpoglobalofficial@gmail.com'",
          [await bcrypt.hash('Eximpo@123!', 10)]
        );
        console.log('✅ User updated to admin with new password');
      } else {
        // Update password
        await client.query(
          "UPDATE users SET password_hash = $1, auth_provider = 'local' WHERE email = 'eximpoglobalofficial@gmail.com'",
          [await bcrypt.hash('Eximpo@123!', 10)]
        );
        console.log('✅ Password updated for admin user');
      }
      console.log('Password: Eximpo@123!');
    } else {
      console.log('⚠️ Admin user not found, creating...');
      
      // Generate password hash for 'Eximpo@123!'
      const passwordHash = await bcrypt.hash('Eximpo@123!', 10);
      
      // Insert new admin
      const result = await client.query(
        `INSERT INTO users (email, password_hash, role, full_name, company_name, verified, auth_provider)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, email, role, full_name`,
        ['eximpoglobalofficial@gmail.com', passwordHash, 'admin', 'Eximpo Global', 'Eximpo Global', true, 'local']
      );
      
      console.log('✅ Admin user created successfully!');
      console.log('Email:', result.rows[0].email);
      console.log('Password: Eximpo@123!');
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
