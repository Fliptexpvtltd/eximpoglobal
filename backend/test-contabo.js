import AWS from 'aws-sdk';

// Test different Contabo configurations
const configs = [
  {
    name: 'Config 1: Basic bucket',
    endpoint: 'https://sin1.contabostorage.com',
    accessKeyId: '98d59d8c643a4403a2dc26a27b37b922',
    secretAccessKey: 'DFFRGjxnKy1qygDs7W5iobjqMmyq11lZ',
    bucket: 'iestorage',
    s3ForcePathStyle: true
  },
  {
    name: 'Config 2: With region',
    endpoint: 'https://sin1.contabostorage.com',
    accessKeyId: '98d59d8c643a4403a2dc26a27b37b922',
    secretAccessKey: 'DFFRGjxnKy1qygDs7W5iobjqMmyq11lZ',
    bucket: 'iestorage',
    region: 'sin1',
    s3ForcePathStyle: true
  },
  {
    name: 'Config 3: Signature v2',
    endpoint: 'https://sin1.contabostorage.com',
    accessKeyId: '98d59d8c643a4403a2dc26a27b37b922',
    secretAccessKey: 'DFFRGjxnKy1qygDs7W5iobjqMmyq11lZ',
    bucket: 'iestorage',
    s3ForcePathStyle: true,
    signatureVersion: 'v2'
  }
];

async function testConfig(config) {
  const s3 = new AWS.S3({
    endpoint: config.endpoint,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region,
    s3ForcePathStyle: config.s3ForcePathStyle,
    signatureVersion: config.signatureVersion
  });

  console.log(`\nTesting: ${config.name}`);
  console.log(`Bucket: ${config.bucket}`);
  
  try {
    const result = await s3.listObjectsV2({ 
      Bucket: config.bucket,
      MaxKeys: 1 
    }).promise();
    
    console.log('✅ SUCCESS!');
    console.log(`   Contents: ${result.Contents ? result.Contents.length : 0} items`);
    return true;
  } catch (error) {
    console.log(`❌ FAILED: ${error.code} - ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('CONTABO OBJECT STORAGE CONNECTION TEST');
  console.log('='.repeat(60));
  
  for (const config of configs) {
    await testConfig(config);
  }
  
  console.log('\n' + '='.repeat(60));
}

runTests();
