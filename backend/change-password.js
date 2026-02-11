// Change password for a specific user
import bcrypt from 'bcryptjs';
import { query } from './src/config/database.js';

const changePassword = async () => {
  try {
    const email = 'fliptexpvtltd@gmail.com';
    const newPassword = 'Prakash@123';
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    // Update the user's password
    const result = await query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [passwordHash, email]
    );
    
    if (result.rowCount === 0) {
      console.log('❌ No user found with email:', email);
      process.exit(1);
    }
    
    console.log('✅ Password changed successfully!');
    console.log('Email:', email);
    console.log('New Password:', newPassword);
    process.exit(0);
  } catch (error) {
    console.error('Error changing password:', error);
    process.exit(1);
  }
};

changePassword();
