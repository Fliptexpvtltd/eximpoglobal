// Email service with BullMQ queue integration
import { queueEmail, queueBulkEmails } from '../queues/emailQueue.js';

// Send email by adding to queue (non-blocking)
export const sendEmail = async (to, templateName, data, options = {}) => {
  try {
    const result = await queueEmail(to, templateName, data, options);
    return {
      success: true,
      jobId: result.jobId,
      message: 'Email queued successfully',
    };
  } catch (error) {
    console.error('❌ Failed to queue email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Send bulk emails by adding to queue
export const sendBulkEmail = async (recipients, templateName, data) => {
  try {
    const result = await queueBulkEmails(recipients, templateName, data);
    return {
      success: true,
      count: result.count,
      jobIds: result.jobIds,
      message: `${result.count} emails queued successfully`,
    };
  } catch (error) {
    console.error('❌ Failed to queue bulk emails:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default { sendEmail, sendBulkEmail };
