-- Update admin password hash
UPDATE users 
SET password_hash = '$2a$10$aer36qRVuRwfzMdWO3KQ.e6wTWt3cXho89BlYSSKN2UziKiN69ccy' 
WHERE email = 'admin@eximpo.local';
