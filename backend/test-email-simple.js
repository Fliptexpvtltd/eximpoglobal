import { queueEmail } from './src/queues/emailQueue.js';

const testEmail = async () => {
  try {
    console.log('📧 Queueing test email...');
    
    const result = await queueEmail('eximpoglobalofficial@gmail.com', 'welcome', {
      email: 'eximpoglobalofficial@gmail.com',
      fullName: 'Eximpo Official Test',
      companyName: 'Eximpo Global',
      role: 'buyer'
    });
    
    console.log('✅ Email queued successfully:', result);
    console.log('📊 Check Bull Dashboard: https://app.eximpoglobal.net/api/admin/queues');
    
    // Wait a bit for processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ Check your email inbox at eximpoglobalofficial@gmail.com');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testEmail();
