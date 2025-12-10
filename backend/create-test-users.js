// Create test buyer and seller users with known passwords
import bcrypt from 'bcryptjs';
import { query } from './src/config/database.js';
import { v4 as uuidv4 } from 'uuid';

const createTestUsers = async () => {
  try {
    const password = 'Test@123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const users = [
      {
        id: uuidv4(),
        email: 'buyer@test.com',
        fullName: 'Test Buyer',
        role: 'buyer',
        companyName: 'Test Buyer Company',
        country: '1',
        phone: '+1234567890'
      },
      {
        id: uuidv4(),
        email: 'seller@test.com',
        fullName: 'Test Seller',
        role: 'seller',
        companyName: 'Test Seller Company',
        country: '1',
        phone: '+1987654321'
      }
    ];
    
    for (const user of users) {
      // Check if user already exists
      const existing = await query('SELECT id FROM users WHERE email = $1', [user.email]);
      
      if (existing.rows.length > 0) {
        // Update password
        await query('UPDATE users SET password_hash = $1 WHERE email = $2', [passwordHash, user.email]);
        console.log(`✅ Updated password for ${user.email}`);
      } else {
        // Insert new user
        await query(
          `INSERT INTO users (id, email, password_hash, full_name, role, company_name, country, phone, verified, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())`,
          [user.id, user.email, passwordHash, user.fullName, user.role, user.companyName, user.country, user.phone]
        );
        console.log(`✅ Created user: ${user.email}`);
      }
    }
    
    console.log('\n📋 Test Users Created:');
    console.log('========================');
    console.log('Buyer Account:');
    console.log('  Email: buyer@test.com');
    console.log('  Password: Test@123');
    console.log('');
    console.log('Seller Account:');
    console.log('  Email: seller@test.com');
    console.log('  Password: Test@123');
    console.log('');
    console.log('Admin Account:');
    console.log('  Email: admin@eximpo.com');
    console.log('  Password: Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
};

createTestUsers();
