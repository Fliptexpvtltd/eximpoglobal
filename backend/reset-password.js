// Reset user password to a known value
import bcrypt from 'bcryptjs';
import { query } from './src/config/database.js';

const resetPassword = async () => {
  try {
    const email = 'admin@eximpo.com';
    const newPassword = 'Admin@123';
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    // Update the user's password
    await query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [passwordHash, email]
    );
    
    console.log('✅ Password reset successfully!');
    console.log('Email:', email);
    console.log('New Password:', newPassword);
    process.exit(0);
  } catch (error) {
    console.error('Error resetting password:', error);
    process.exit(1);
  }
};

resetPassword();
