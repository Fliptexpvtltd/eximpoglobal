import { Queue } from 'bullmq';
import Redis from 'ioredis';

// Check if Redis is available
const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false';
let redisConnection = null;
let emailQueue = null;

try {
  if (REDIS_ENABLED) {
    // Redis connection configuration
    redisConnection = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: () => null, // Don't retry if Redis is down
    });

    // Create email queue with retry and timeout configuration
    emailQueue = new Queue('email-queue', {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: {
          age: 24 * 3600,
          count: 1000,
        },
        removeOnFail: {
          age: 7 * 24 * 3600,
        },
        timeout: 30000,
      },
    });

    // Queue event listeners for monitoring
    emailQueue.on('error', (error) => {
      console.error('❌ Email queue error:', error.message);
    });

    emailQueue.on('waiting', (jobId) => {
      console.log(`⏳ Email job ${jobId} is waiting`);
    });

    emailQueue.on('active', (job) => {
      console.log(`🔄 Processing email job ${job.id}: ${job.data.templateName} to ${job.data.to}`);
    });

    emailQueue.on('completed', (job) => {
      console.log(`✅ Email sent successfully (Job ${job.id}): ${job.data.templateName} to ${job.data.to}`);
    });

    emailQueue.on('failed', (job, error) => {
      console.error(`❌ Email failed (Job ${job?.id}):`, error.message);
      if (job) {
        console.error(`   Template: ${job.data.templateName}, Recipient: ${job.data.to}`);
      }
    });

    emailQueue.on('stalled', (jobId) => {
      console.warn(`⚠️ Email job ${jobId} stalled`);
    });

    console.log('✅ Redis connection initialized for email queue');
  } else {
    console.log('⚠️  Redis disabled - emails will be logged only (not sent)');
  }
} catch (error) {
  console.error('⚠️  Redis connection failed - emails will be logged only:', error.message);
  emailQueue = null;
}

// Helper function to add email job to queue
export const queueEmail = async (to, templateName, data, options = {}) => {
  // If Redis is not available, just log the email
  if (!emailQueue) {
    console.log(`📧 Email (NO REDIS): ${templateName} to ${to}`);
    console.log(`   Data:`, JSON.stringify(data, null, 2));
    return { success: true, jobId: 'no-redis', message: 'Email logged (Redis not available)' };
  }

  try {
    const job = await emailQueue.add(
      `email-${templateName}`,
      {
        to,
        templateName,
        data,
      },
      {
        priority: options.priority || 10,
        delay: options.delay || 0,
        ...options,
      }
    );

    console.log(`📧 Email queued (Job ${job.id}): ${templateName} to ${to}`);
    return { success: true, jobId: job.id };
  } catch (error) {
    console.error('❌ Failed to queue email:', error.message);
    // Log email instead of failing
    console.log(`📧 Email (FALLBACK): ${templateName} to ${to}`);
    return { success: true, jobId: 'fallback', message: 'Email logged due to queue error' };
  }
};

// Helper function to queue bulk emails
export const queueBulkEmails = async (recipients, templateName, data) => {
  // If Redis is not available, just log
  if (!emailQueue) {
    console.log(`📧 Bulk Email (NO REDIS): ${templateName} to ${recipients.length} recipients`);
    return { success: true, count: recipients.length, jobIds: ['no-redis'] };
  }

  try {
    const jobs = recipients.map((recipient, index) => ({
      name: `bulk-email-${templateName}-${index}`,
      data: {
        to: recipient,
        templateName,
        data,
      },
      opts: {
        priority: 20, // Lower priority for bulk emails
        delay: index * 100, // Stagger by 100ms to avoid rate limits
      },
    }));

    const addedJobs = await emailQueue.addBulk(jobs);
    console.log(`📧 Bulk emails queued: ${addedJobs.length} jobs for template ${templateName}`);
    return { success: true, count: addedJobs.length, jobIds: addedJobs.map(j => j.id) };
  } catch (error) {
    console.error('❌ Failed to queue bulk emails:', error.message);
    // Log instead of failing
    console.log(`📧 Bulk Email (FALLBACK): ${templateName} to ${recipients.length} recipients`);
    return { success: true, count: recipients.length, jobIds: ['fallback'] };
  }
};

export { emailQueue };

// Get queue status
export const getQueueStatus = async () => {
  try {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      emailQueue.getWaitingCount(),
      emailQueue.getActiveCount(),
      emailQueue.getCompletedCount(),
      emailQueue.getFailedCount(),
      emailQueue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  } catch (error) {
    console.error('❌ Failed to get queue status:', error);
    throw error;
  }
};

// Graceful shutdown
export const closeQueue = async () => {
  console.log('🔌 Closing email queue...');
  await emailQueue.close();
  await redisConnection.quit();
  console.log('Email queue closed');
};

export default emailQueue;
