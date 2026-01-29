import bcrypt from 'bcryptjs';

const password = 'admin123';

console.log('Generating hash for password:', password);

bcrypt.hash(password, 10).then(hash => {
  console.log('Generated hash:', hash);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
