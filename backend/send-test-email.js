// Send a test welcome email directly
import { sendEmail } from './src/services/emailService.js';

const testEmail = async () => {
  try {
    console.log('📧 Sending test welcome email...\n');
    
    const result = await sendEmail(
      'eximpoglobalofficial@gmail.com',
      'welcome',
      {
        email: 'eximpoglobalofficial@gmail.com',
        fullName: 'Eximpo Official',
        companyName: 'Eximpo Global',
        role: 'buyer'
      }
    );

    console.log('✅ Email queued successfully!');
    console.log('Job ID:', result.jobId);
    console.log('\n📊 Check Bull Dashboard: https://app.eximpoglobal.net/api/admin/queues');
    console.log('📧 Check inbox: eximpoglobalofficial@gmail.com\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    process.exit(1);
  }
};

testEmail();
