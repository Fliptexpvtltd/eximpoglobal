import bcrypt from 'bcryptjs';

const hash = '$2a$10$aer36qRVuRwfzMdWO3KQ.e6wTWt3cXho89BlYSSKN2UziKiN69ccy';
const password = 'admin123';

console.log('Testing password validation...');
console.log('Hash:', hash);
console.log('Password:', password);

bcrypt.compare(password, hash).then(result => {
  console.log('Result:', result);
  process.exit(result ? 0 : 1);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
