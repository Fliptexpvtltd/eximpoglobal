import { Queue } from 'bullmq';
import Redis from 'ioredis';

// Redis connection configuration
const redisConnection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Create email queue with retry and timeout configuration
export const emailQueue = new Queue('email-queue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // Retry up to 3 times
    backoff: {
      type: 'exponential', // Exponential backoff: 1s, 2s, 4s
      delay: 1000, // Initial delay of 1 second
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000, // Keep max 1000 completed jobs
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
    timeout: 30000, // 30 second timeout per job
  },
});

// Queue event listeners for monitoring
emailQueue.on('error', (error) => {
  console.error('❌ Email queue error:', error);
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

// Helper function to add email job to queue
export const queueEmail = async (to, templateName, data, options = {}) => {
  try {
    const job = await emailQueue.add(
      `email-${templateName}`,
      {
        to,
        templateName,
        data,
      },
      {
        priority: options.priority || 10, // Default priority
        delay: options.delay || 0, // Immediate by default
        ...options,
      }
    );

    console.log(`📧 Email queued (Job ${job.id}): ${templateName} to ${to}`);
    return { success: true, jobId: job.id };
  } catch (error) {
    console.error('❌ Failed to queue email:', error);
    throw error;
  }
};

// Helper function to queue bulk emails
export const queueBulkEmails = async (recipients, templateName, data) => {
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
    console.error('❌ Failed to queue bulk emails:', error);
    throw error;
  }
};

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
  console.log('✅ Email queue closed');
};

export default emailQueue;
