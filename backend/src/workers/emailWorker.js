import { Worker } from 'bullmq';
import Redis from 'ioredis';
import SibApiV3Sdk from 'sib-api-v3-sdk';

// Import email templates
import { emailTemplates } from '../services/emailTemplates.js';

// Check if Redis is enabled
const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false';

// Redis connection configuration (only if enabled)
let redisConnection = null;
let emailWorker = null;

if (REDIS_ENABLED) {
  try {
    redisConnection = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    console.log('📧 Email worker: Redis connection initialized');
  } catch (error) {
    console.warn('⚠️ Email worker: Redis connection failed, worker disabled:', error.message);
  }
}

// Configure Brevo API
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Email worker processor
const processEmailJob = async (job) => {
  const { to, templateName, data } = job.data;

  try {
    // Check if Brevo API key is configured
    if (!process.env.BREVO_API_KEY) {
      console.log('BREVO_API_KEY not configured. Email would be sent to:', to);
      console.log('Template:', templateName);
      console.log('Data:', data);
      return { success: true, message: 'Email logging (no API key)' };
    }

    // Get email template
    const template = emailTemplates[templateName](data);
    if (!template) {
      throw new Error(`Email template "${templateName}" not found`);
    }

    // Prepare email
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = template.subject;
    sendSmtpEmail.htmlContent = template.html;
    sendSmtpEmail.sender = {
      name: process.env.EMAIL_FROM_NAME || 'Eximpo Global',
      email: process.env.EMAIL_FROM || 'noreply@eximpoglobal.net',
    };
    sendSmtpEmail.to = [{ email: to }];

    // Send email via Brevo
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    // Update job progress
    await job.updateProgress(100);

    console.log(`✅ Email sent successfully:`, {
      to,
      subject: template.subject,
      messageId: result.messageId,
    });

    return {
      success: true,
      to,
      subject: template.subject,
      messageId: result.messageId,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`❌ Email sending failed for job ${job.id}:`, error.message);

    // Throw error to trigger retry
    throw new Error(`Failed to send email to ${to}: ${error.message}`);
  }
};

// Create email worker only if Redis is enabled
if (REDIS_ENABLED && redisConnection) {
  emailWorker = new Worker('email-queue', processEmailJob, {
    connection: redisConnection,
    concurrency: 5, // Process up to 5 emails concurrently
    limiter: {
      max: 50, // Max 50 jobs
      duration: 60000, // per 60 seconds (to respect Brevo rate limits)
    },
  });

  // Worker event listeners
  emailWorker.on('ready', () => {
    console.log('✅ Email worker is ready and listening for jobs');
  });

  emailWorker.on('active', (job) => {
    console.log(`🔄 Worker processing job ${job.id}: ${job.data.templateName}`);
  });

  emailWorker.on('completed', (job, result) => {
    console.log(`✅ Worker completed job ${job.id}:`, result.subject);
  });

  emailWorker.on('failed', (job, error) => {
    console.error(`❌ Worker failed job ${job?.id}:`, error.message);
    if (job) {
      console.error(`   Attempt ${job.attemptsMade}/${job.opts.attempts}`);
      console.error(`   Template: ${job.data.templateName}, Recipient: ${job.data.to}`);
    }
  });

  emailWorker.on('error', (error) => {
    console.error('❌ Email worker error:', error);
  });

  emailWorker.on('stalled', (jobId) => {
    console.warn(`⚠️ Job ${jobId} stalled and will be reprocessed`);
  });
} else {
  console.log('📧 Email worker disabled (Redis not available)');
}

// Graceful shutdown
export const closeWorker = async () => {
  if (!emailWorker) {
    console.log('📧 No email worker to close (Redis disabled)');
    return;
  }
  
  console.log('🔌 Closing email worker...');
  await emailWorker.close();
  if (redisConnection) {
    await redisConnection.quit();
  }
  console.log('✅ Email worker closed');
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 SIGINT received, closing email worker...');
  await closeWorker();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM received, closing email worker...');
  await closeWorker();
  process.exit(0);
});

export { emailWorker };
export default emailWorker;
