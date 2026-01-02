import { queueEmail } from './src/queues/emailQueue.js';

const retryEmail = async () => {
  try {
    console.log('📧 Resending welcome email to itipracticehub@gmail.com...');
    
    const result = await queueEmail('itipracticehub@gmail.com', 'welcome', {
      email: 'itipracticehub@gmail.com',
      fullName: 'ITI Practice Hub',
      companyName: 'Test Buyer',
      role: 'buyer'
    });
    
    console.log('✅ Email queued successfully:', result);
    console.log('⏳ Waiting for processing...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('✅ Check your email inbox at itipracticehub@gmail.com');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

retryEmail();
