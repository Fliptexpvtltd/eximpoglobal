import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
  endpoint: 'https://sin1.contabostorage.com',
  accessKeyId: process.env.CONTABO_ACCESS_KEY,
  secretAccessKey: process.env.CONTABO_SECRET_KEY,
  region: 'SIN',
  s3ForcePathStyle: true,
  signatureVersion: 'v4'
});

const bucketName = process.env.CONTABO_BUCKET;

console.log('Configuring bucket:', bucketName);

// CORS configuration
const corsConfiguration = {
  CORSRules: [
    {
      AllowedHeaders: ['*'],
      AllowedMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
      AllowedOrigins: ['*'],
      ExposeHeaders: ['ETag'],
      MaxAgeSeconds: 3000
    }
  ]
};

// Set CORS
s3.putBucketCors({
  Bucket: bucketName,
  CORSConfiguration: corsConfiguration
}, (err, data) => {
  if (err) {
    console.error('❌ Failed to set CORS:', err.message);
  } else {
    console.log('✅ CORS configuration applied successfully');
  }
  
  // Set bucket policy for public read
  const bucketPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`]
      }
    ]
  };
  
  s3.putBucketPolicy({
    Bucket: bucketName,
    Policy: JSON.stringify(bucketPolicy)
  }, (policyErr, policyData) => {
    if (policyErr) {
      console.error('❌ Failed to set bucket policy:', policyErr.message);
      console.log('\n⚠️  Note: You may need to configure public access manually in Contabo dashboard');
    } else {
      console.log('✅ Bucket policy applied - objects are now publicly readable');
    }
    
    console.log('\n✅ Bucket configuration complete!');
    console.log('Test URL: https://sin1.contabostorage.com/' + bucketName + '/test/test.txt');
    process.exit(0);
  });
});
