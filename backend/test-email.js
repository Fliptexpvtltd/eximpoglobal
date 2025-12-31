import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';

dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendTestEmail() {
  try {
    console.log('🔑 Using API Key:', process.env.BREVO_API_KEY ? 'Present' : 'Missing');
    
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = 'Test Email from Eximpo - Brevo Integration';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">🎉 Brevo Email Integration Test</h2>
        <p>Hello!</p>
        <p>This is a test email to verify that the Brevo email integration is working correctly.</p>
        <div style="background-color: #f0f9ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af;">
            <strong>✅ Success!</strong> If you're reading this, the email service is working perfectly.
          </p>
        </div>
        <p style="color: #666; font-size: 14px;">
          Timestamp: ${new Date().toLocaleString()}<br>
          API: Brevo (Sendinblue)<br>
          Application: Eximpo Platform
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          © 2025 Eximpo. All rights reserved.
        </p>
      </div>
    `;
    sendSmtpEmail.sender = {
      name: process.env.EMAIL_FROM_NAME || 'Eximpo',
      email: process.env.EMAIL_FROM || 'noreply@eximpoglobal.net',
    };
    sendSmtpEmail.to = [{ email: 'prakashchary319@gmail.com' }];

    console.log('📧 Sending test email to: prakashchary319@gmail.com');
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('\n📬 Please check the inbox of prakashchary319@gmail.com');
    
  } catch (error) {
    console.error('❌ Failed to send email:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.text);
    }
  }
}

sendTestEmail();
