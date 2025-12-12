import bcrypt from 'bcryptjs';
import { query } from './src/config/database.js';

async function updateAdmin() {
  try {
    const hash = await bcrypt.hash('Admin@123', 10);
    await query(
      `UPDATE users SET email = $1, password_hash = $2 WHERE role = $3`,
      ['admin@eximpoglobal.net', hash, 'admin']
    );
    console.log('✅ Admin email updated to admin@eximpoglobal.net');
    console.log('✅ Password set to: Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('Error updating admin:', error);
    process.exit(1);
  }
}

updateAdmin();
