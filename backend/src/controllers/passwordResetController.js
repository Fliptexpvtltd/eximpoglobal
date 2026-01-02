import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('🔑 Password reset request for:', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const result = await query(
      'SELECT id, email, full_name, auth_provider FROM users WHERE email = $1',
      [email]
    );

    // Always return success to prevent email enumeration
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a 6-digit OTP code shortly.'
      });
    }

    const user = result.rows[0];

    // Check if user uses Google auth
    if (user.auth_provider === 'google') {
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a 6-digit OTP code shortly.'
      });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();

    // Store OTP in database with expiry (valid for 10 minutes)
    await query(
      `INSERT INTO password_resets (user_id, token, expires_at, used) 
       VALUES ($1, $2, NOW() + INTERVAL '10 minutes', false)
       ON CONFLICT (user_id) 
       DO UPDATE SET token = $2, expires_at = NOW() + INTERVAL '10 minutes', used = false, created_at = NOW()`,
      [user.id, otp]
    );

    // Send OTP email directly using Brevo API
    console.log('📧 Preparing to send OTP email...');
    const SibApiV3Sdk = await import('sib-api-v3-sdk');
    const defaultClient = SibApiV3Sdk.default.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    console.log('🔑 BREVO_API_KEY configured:', process.env.BREVO_API_KEY ? 'Yes' : 'No');

    if (process.env.BREVO_API_KEY) {
      console.log('📤 Sending email via Brevo to:', user.email);
      const apiInstance = new SibApiV3Sdk.default.TransactionalEmailsApi();
      const sendSmtpEmail = new SibApiV3Sdk.default.SendSmtpEmail();
      
      sendSmtpEmail.subject = 'Password Reset OTP - Eximpo Global';
      sendSmtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset OTP</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                        Password Reset
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                        Hello <strong>${user.full_name}</strong>,
                      </p>
                      
                      <p style="margin: 0 0 30px; color: #6b7280; font-size: 15px; line-height: 1.6;">
                        We received a request to reset your password for your Eximpo account. Use the verification code below to complete the password reset process:
                      </p>
                      
                      <!-- OTP Box -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                              Your Verification Code
                            </p>
                            <p style="margin: 0; font-size: 42px; font-weight: bold; color: #667eea; letter-spacing: 12px; font-family: 'Courier New', monospace;">
                              ${otp}
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Important Info Box -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        <tr>
                          <td style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px;">
                            <p style="margin: 0 0 10px; color: #92400e; font-size: 14px; font-weight: 600;">
                              Important Information:
                            </p>
                            <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.8;">
                              <li>This code expires in <strong>10 minutes</strong></li>
                              <li>Do not share this code with anyone</li>
                              <li>Eximpo staff will never ask for this code</li>
                            </ul>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.
                      </p>
                      
                      <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        Best regards,<br>
                        <strong>The Eximpo Team</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="text-align: center;">
                            <p style="margin: 0 0 10px; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                              This is an automated message, please do not reply to this email.
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                              © ${new Date().getFullYear()} Eximpo Global. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
      sendSmtpEmail.sender = {
        name: process.env.EMAIL_FROM_NAME || 'Eximpo Global',
        email: process.env.EMAIL_FROM || 'noreply@eximpo.com',
      };
      sendSmtpEmail.to = [{ email: user.email }];

      try {
        console.log('🔄 Calling Brevo API...');
        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ Password reset OTP sent to:', user.email, 'MessageId:', result.messageId);
      } catch (emailError) {
        console.error('❌ Email send error:', emailError.message);
        console.error('❌ Full error:', emailError);
      }
    } else {
      console.log('⚠️ BREVO_API_KEY not configured. OTP:', otp);
    }

    res.json({
      success: true,
      message: 'If an account exists with this email, you will receive a 6-digit OTP code shortly.'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
};

// Reset password with OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find user by email
    const userResult = await query(
      'SELECT id, email, auth_provider FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or OTP'
      });
    }

    const user = userResult.rows[0];

    // Check if OTP exists in database and is valid
    const resetResult = await query(
      `SELECT user_id, token, expires_at, used 
       FROM password_resets 
       WHERE user_id = $1 AND token = $2`,
      [user.id, otp]
    );

    if (resetResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    const resetRecord = resetResult.rows[0];

    if (resetRecord.used) {
      return res.status(400).json({
        success: false,
        message: 'This OTP has already been used'
      });
    }

    if (new Date(resetRecord.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [passwordHash, user.id]
    );

    // Mark OTP as used
    await query(
      'UPDATE password_resets SET used = true WHERE user_id = $1 AND token = $2',
      [user.id, otp]
    );

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
};

// Verify OTP (check if valid before showing reset form)
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find user by email
    const userResult = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or OTP'
      });
    }

    const user = userResult.rows[0];

    // Check if OTP exists and is valid
    const resetResult = await query(
      `SELECT user_id, expires_at, used 
       FROM password_resets 
       WHERE user_id = $1 AND token = $2`,
      [user.id, otp]
    );

    if (resetResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    const resetRecord = resetResult.rows[0];

    if (resetRecord.used) {
      return res.status(400).json({
        success: false,
        message: 'This OTP has already been used'
      });
    }

    if (new Date(resetRecord.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    res.json({
      success: true,
      message: 'OTP is valid'
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
};
