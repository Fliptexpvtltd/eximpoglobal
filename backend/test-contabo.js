import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
  endpoint: 'https://sin1.contabostorage.com',
  accessKeyId: '5d131ccc93635599625a12bf094ca08a',
  secretAccessKey: '65cdba00e2a5f3744e73233eeb35a13e',
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  region: 'SIN'
});

console.log('Testing Contabo connection...');
console.log('Endpoint:', 'https://sin1.contabostorage.com');
console.log('Bucket:', 'eximpo-bucket');
console.log('Access Key:', '5d131ccc93635599625a12bf094ca08a');

// Test 1: List objects
s3.listObjectsV2({ 
  Bucket: 'eximpo-bucket',
  MaxKeys: 1 
}, (err, data) => {
  if (err) {
    console.error('\n❌ List Objects Error:');
    console.error('Code:', err.code);
    console.error('Message:', err.message);
    console.error('Status:', err.statusCode);
    console.error('Full Error:', JSON.stringify(err, null, 2));
  } else {
    console.log('\n✅ List Objects Success!');
    console.log('Contents:', data.Contents?.length || 0, 'objects');
  }
  
  // Test 2: Upload a test file
  console.log('\nTesting upload...');
  const testContent = 'Hello from Eximpo test';
  
  s3.upload({
    Bucket: 'eximpo-bucket',
    Key: 'test/test-' + Date.now() + '.txt',
    Body: testContent,
    ContentType: 'text/plain',
    ACL: 'public-read'
  }, (uploadErr, uploadData) => {
    if (uploadErr) {
      console.error('\n❌ Upload Error:');
      console.error('Code:', uploadErr.code);
      console.error('Message:', uploadErr.message);
      console.error('Status:', uploadErr.statusCode);
    } else {
      console.log('\n✅ Upload Success!');
      console.log('Location:', uploadData.Location);
      console.log('Key:', uploadData.Key);
    }
    process.exit(0);
  });
});
