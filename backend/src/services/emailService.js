import SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Email templates matching the provided design
const emailTemplates = {
  rfqCreated: (data) => ({
    subject: `RFQ Created Successfully - ${data.rfqNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <!-- Logo -->
                <tr>
                  <td style="padding: 40px 40px 30px 40px;">
                    <img src="https://via.placeholder.com/120x40/0078d4/ffffff?text=Eximpo" alt="Eximpo" style="height: 40px;">
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 600; color: #1a1a1a;">Welcome, ${data.companyName}!</h1>
                    
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                      Thanks for creating an RFQ with <strong>Eximpo</strong>. Your request has been sent to matching suppliers. Below are the details.
                    </p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #0078d4; padding: 16px 20px; margin: 25px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0078d4;">
                        Your RFQ is ready — use the details below and you'll start receiving quotes from suppliers soon.
                      </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">RFQ Number:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.rfqNumber}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Product:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.productName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Quantity:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.quantity} units</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Target Price:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.targetPrice}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <div style="text-align: center; margin: 35px 0 25px 0;">
                      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/buyer/rfqs" style="display: inline-block; background-color: #0078d4; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-size: 15px; font-weight: 600;">View My RFQs</a>
                    </div>
                    
                    <p style="margin: 25px 0 0 0; font-size: 13px; line-height: 1.6; color: #8b5e3c;">
                      If you didn't create this RFQ, please contact our support team at <a href="mailto:support@eximpo.com" style="color: #0078d4; text-decoration: none;">support@eximpo.com</a>.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 12px; color: #6a6a6a;">
                          © <strong>Eximpo</strong> · All rights reserved
                        </td>
                        <td align="right">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe" style="font-size: 12px; color: #0078d4; text-decoration: none;">Unsubscribe</a>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 15px;">
                          <p style="margin: 0; font-size: 12px; color: #6a6a6a;">
                            Need help? <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support" style="color: #0078d4; text-decoration: none;">Contact Support</a>
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
    `
  }),

  rfqNotification: (data) => ({
    subject: `New RFQ Opportunity - ${data.category}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 40px 40px 30px 40px;">
                    <img src="https://via.placeholder.com/120x40/0078d4/ffffff?text=Eximpo" alt="Eximpo" style="height: 40px;">
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 600; color: #1a1a1a;">New Business Opportunity, ${data.sellerCompany}!</h1>
                    
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                      A buyer is looking for products in <strong>${data.category}</strong>. This is a great opportunity to grow your business.
                    </p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #0078d4; padding: 16px 20px; margin: 25px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0078d4;">
                        A new RFQ matching your category is ready — submit a competitive quote to win the business.
                      </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Product Needed:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.productName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Category:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.category}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Quantity:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.quantity} units</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Buyer's Budget:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.targetPrice}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <div style="text-align: center; margin: 35px 0 25px 0;">
                      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/seller/rfqs" style="display: inline-block; background-color: #0078d4; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-size: 15px; font-weight: 600;">Submit Your Quote</a>
                    </div>
                    
                    <p style="margin: 25px 0 0 0; font-size: 13px; line-height: 1.6; color: #8b5e3c;">
                      If you didn't sign up for RFQ notifications, please contact our support team at <a href="mailto:support@eximpo.com" style="color: #0078d4; text-decoration: none;">support@eximpo.com</a>.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 12px; color: #6a6a6a;">
                          © <strong>Eximpo</strong> · All rights reserved
                        </td>
                        <td align="right">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe" style="font-size: 12px; color: #0078d4; text-decoration: none;">Unsubscribe</a>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 15px;">
                          <p style="margin: 0; font-size: 12px; color: #6a6a6a;">
                            Need help? <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support" style="color: #0078d4; text-decoration: none;">Contact Support</a>
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
    `
  }),

  quoteReceived: (data) => ({
    subject: `New Quote Received from ${data.sellerCompany}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 40px 40px 30px 40px;">
                    <img src="https://via.placeholder.com/120x40/0078d4/ffffff?text=Eximpo" alt="Eximpo" style="height: 40px;">
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 600; color: #1a1a1a;">New Quote Received, ${data.companyName}!</h1>
                    
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                      Great news! <strong>${data.sellerCompany}</strong> has submitted a quote for your RFQ. Review the details below.
                    </p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #0078d4; padding: 16px 20px; margin: 25px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0078d4;">
                        Your quote is ready — use the button below to review and compare with other quotes.
                      </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Supplier:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.sellerCompany}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Product:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.productName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Quoted Price:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.quotedPrice}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Lead Time:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.leadTime}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <div style="text-align: center; margin: 35px 0 25px 0;">
                      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/buyer/quotes" style="display: inline-block; background-color: #0078d4; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-size: 15px; font-weight: 600;">View Quotes</a>
                    </div>
                    
                    <p style="margin: 25px 0 0 0; font-size: 13px; line-height: 1.6; color: #8b5e3c;">
                      If you didn't request this quote, please contact our support team at <a href="mailto:support@eximpo.com" style="color: #0078d4; text-decoration: none;">support@eximpo.com</a>.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 12px; color: #6a6a6a;">
                          © <strong>Eximpo</strong> · All rights reserved
                        </td>
                        <td align="right">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe" style="font-size: 12px; color: #0078d4; text-decoration: none;">Unsubscribe</a>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 15px;">
                          <p style="margin: 0; font-size: 12px; color: #6a6a6a;">
                            Need help? <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support" style="color: #0078d4; text-decoration: none;">Contact Support</a>
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
    `
  }),

  quoteAccepted: (data) => ({
    subject: `Quote Accepted - ${data.productName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 40px 40px 30px 40px;">
                    <img src="https://via.placeholder.com/120x40/0078d4/ffffff?text=Eximpo" alt="Eximpo" style="height: 40px;">
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 600; color: #1a1a1a;">Congratulations, ${data.companyName}!</h1>
                    
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                      Excellent news! <strong>${data.buyerCompany}</strong> has accepted your quote. A purchase order will be created shortly.
                    </p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #0078d4; padding: 16px 20px; margin: 25px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0078d4;">
                        Your quote was accepted — prepare for order processing and fulfillment.
                      </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Buyer:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.buyerCompany}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Product:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.productName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Order Value:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.quotedPrice}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <div style="text-align: center; margin: 35px 0 25px 0;">
                      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/seller/orders" style="display: inline-block; background-color: #0078d4; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-size: 15px; font-weight: 600;">View Orders</a>
                    </div>
                    
                    <p style="margin: 25px 0 0 0; font-size: 13px; line-height: 1.6; color: #8b5e3c;">
                      If you have questions, please contact our support team at <a href="mailto:support@eximpo.com" style="color: #0078d4; text-decoration: none;">support@eximpo.com</a>.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 12px; color: #6a6a6a;">
                          © <strong>Eximpo</strong> · All rights reserved
                        </td>
                        <td align="right">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe" style="font-size: 12px; color: #0078d4; text-decoration: none;">Unsubscribe</a>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 15px;">
                          <p style="margin: 0; font-size: 12px; color: #6a6a6a;">
                            Need help? <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support" style="color: #0078d4; text-decoration: none;">Contact Support</a>
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
    `
  }),

  orderCreated: (data) => ({
    subject: `Order Confirmed - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 40px 40px 30px 40px;">
                    <img src="https://via.placeholder.com/120x40/0078d4/ffffff?text=Eximpo" alt="Eximpo" style="height: 40px;">
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 600; color: #1a1a1a;">Order Confirmed, ${data.companyName}!</h1>
                    
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                      Your order has been confirmed. <strong>${data.sellerCompany || data.buyerCompany}</strong> will begin processing it shortly.
                    </p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #0078d4; padding: 16px 20px; margin: 25px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0078d4;">
                        Your order is confirmed — track the status and shipment details using the button below.
                      </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Order Number:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.orderNumber}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">${data.sellerCompany ? 'Supplier' : 'Buyer'}:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.sellerCompany || data.buyerCompany}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Total Amount:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.totalAmount}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a; vertical-align: top;">Delivery Address:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.deliveryAddress}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <div style="text-align: center; margin: 35px 0 25px 0;">
                      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders" style="display: inline-block; background-color: #0078d4; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-size: 15px; font-weight: 600;">Track Order</a>
                    </div>
                    
                    <p style="margin: 25px 0 0 0; font-size: 13px; line-height: 1.6; color: #8b5e3c;">
                      If you didn't place this order, please contact our support team at <a href="mailto:support@eximpo.com" style="color: #0078d4; text-decoration: none;">support@eximpo.com</a>.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 12px; color: #6a6a6a;">
                          © <strong>Eximpo</strong> · All rights reserved
                        </td>
                        <td align="right">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe" style="font-size: 12px; color: #0078d4; text-decoration: none;">Unsubscribe</a>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 15px;">
                          <p style="margin: 0; font-size: 12px; color: #6a6a6a;">
                            Need help? <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support" style="color: #0078d4; text-decoration: none;">Contact Support</a>
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
    `
  }),

  shipmentUpdate: (data) => ({
    subject: `Shipment Update - ${data.status.toUpperCase().replace('_', ' ')}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 40px 40px 30px 40px;">
                    <img src="https://via.placeholder.com/120x40/0078d4/ffffff?text=Eximpo" alt="Eximpo" style="height: 40px;">
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 600; color: #1a1a1a;">Shipment Update, ${data.companyName}!</h1>
                    
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                      Your shipment status has been updated to <strong>${data.status.replace('_', ' ')}</strong>. Track the latest location below.
                    </p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #0078d4; padding: 16px 20px; margin: 25px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0078d4;">
                        Update: ${data.description}
                      </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Order Number:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.orderNumber}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Tracking Number:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.trackingNumber}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Status:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600; text-transform: uppercase;">${data.status.replace('_', ' ')}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Current Location:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.location}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <div style="text-align: center; margin: 35px 0 25px 0;">
                      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/shipments" style="display: inline-block; background-color: #0078d4; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-size: 15px; font-weight: 600;">Track Shipment</a>
                    </div>
                    
                    <p style="margin: 25px 0 0 0; font-size: 13px; line-height: 1.6; color: #8b5e3c;">
                      If you have questions about this shipment, please contact our support team at <a href="mailto:support@eximpo.com" style="color: #0078d4; text-decoration: none;">support@eximpo.com</a>.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 12px; color: #6a6a6a;">
                          © <strong>Eximpo</strong> · All rights reserved
                        </td>
                        <td align="right">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe" style="font-size: 12px; color: #0078d4; text-decoration: none;">Unsubscribe</a>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 15px;">
                          <p style="margin: 0; font-size: 12px; color: #6a6a6a;">
                            Need help? <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support" style="color: #0078d4; text-decoration: none;">Contact Support</a>
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
    `
  }),

  userVerification: (data) => ({
    subject: 'Welcome to Eximpo - Account Verified',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 40px 40px 30px 40px;">
                    <img src="https://via.placeholder.com/120x40/0078d4/ffffff?text=Eximpo" alt="Eximpo" style="height: 40px;">
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 600; color: #1a1a1a;">Welcome, ${data.companyName}!</h1>
                    
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                      Thanks for joining <strong>Eximpo</strong>. We're excited to have you onboard. Your account is now verified and ready to use.
                    </p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #0078d4; padding: 16px 20px; margin: 25px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0078d4;">
                        Your account is ready — use the button below to access your dashboard and start ${data.role === 'buyer' ? 'sourcing products' : 'growing your business'}.
                      </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                      <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">Get started with:</p>
                      ${data.role === 'buyer' ? `
                        <ul style="margin: 0; padding-left: 20px; color: #4a4a4a; font-size: 14px; line-height: 1.8;">
                          <li>Browse products from verified suppliers</li>
                          <li>Create RFQs and receive competitive quotes</li>
                          <li>Place orders with secure payments</li>
                          <li>Track shipments in real-time</li>
                        </ul>
                      ` : `
                        <ul style="margin: 0; padding-left: 20px; color: #4a4a4a; font-size: 14px; line-height: 1.8;">
                          <li>List your products on the marketplace</li>
                          <li>Respond to buyer RFQs</li>
                          <li>Manage orders and fulfillment</li>
                          <li>Expand your business globally</li>
                        </ul>
                      `}
                    </div>
                    
                    <div style="text-align: center; margin: 35px 0 25px 0;">
                      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background-color: #0078d4; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-size: 15px; font-weight: 600;">Go to Dashboard</a>
                    </div>
                    
                    <p style="margin: 25px 0 0 0; font-size: 13px; line-height: 1.6; color: #8b5e3c;">
                      If you didn't sign up for an account, please contact our support team at <a href="mailto:support@eximpo.com" style="color: #0078d4; text-decoration: none;">support@eximpo.com</a>.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 12px; color: #6a6a6a;">
                          © <strong>Eximpo</strong> · All rights reserved
                        </td>
                        <td align="right">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe" style="font-size: 12px; color: #0078d4; text-decoration: none;">Unsubscribe</a>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 15px;">
                          <p style="margin: 0; font-size: 12px; color: #6a6a6a;">
                            Need help? <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support" style="color: #0078d4; text-decoration: none;">Contact Support</a>
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
    `
  }),

  productApproved: (data) => ({
    subject: 'Product Approved - Now Live on Eximpo',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 40px 40px 30px 40px;">
                    <img src="https://via.placeholder.com/120x40/0078d4/ffffff?text=Eximpo" alt="Eximpo" style="height: 40px;">
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 600; color: #1a1a1a;">Product Approved, ${data.companyName}!</h1>
                    
                    <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #4a4a4a;">
                      Great news! Your product has been approved and is now live on the <strong>Eximpo</strong> marketplace. Buyers can now find and purchase it.
                    </p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #0078d4; padding: 16px 20px; margin: 25px 0; border-radius: 4px;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #0078d4;">
                        Your product is live — start receiving inquiries and orders from buyers worldwide.
                      </p>
                    </div>
                    
                    <div style="margin: 30px 0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Product Name:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.productName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Category:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.category}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Unit Price:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">$${data.price}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">Minimum Order:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.moq} units</td>
                        </tr>
                      </table>
                    </div>
                    
                    <div style="text-align: center; margin: 35px 0 25px 0;">
                      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/seller/products" style="display: inline-block; background-color: #0078d4; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-size: 15px; font-weight: 600;">View My Products</a>
                    </div>
                    
                    <p style="margin: 25px 0 0 0; font-size: 13px; line-height: 1.6; color: #8b5e3c;">
                      If you have questions, please contact our support team at <a href="mailto:support@eximpo.com" style="color: #0078d4; text-decoration: none;">support@eximpo.com</a>.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid #e5e5e5;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 12px; color: #6a6a6a;">
                          © <strong>Eximpo</strong> · All rights reserved
                        </td>
                        <td align="right">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/unsubscribe" style="font-size: 12px; color: #0078d4; text-decoration: none;">Unsubscribe</a>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 15px;">
                          <p style="margin: 0; font-size: 12px; color: #6a6a6a;">
                            Need help? <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support" style="color: #0078d4; text-decoration: none;">Contact Support</a>
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
    `
  })
};

// Send email function
export const sendEmail = async (to, templateName, data) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.log('⚠️ BREVO_API_KEY not configured. Email would be sent to:', to);
      console.log('Template:', templateName);
      console.log('Data:', data);
      return { success: true, message: 'Email logging (no API key)' };
    }

    const template = emailTemplates[templateName](data);

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = template.subject;
    sendSmtpEmail.htmlContent = template.html;
    sendSmtpEmail.sender = {
      name: process.env.EMAIL_FROM_NAME || 'Eximpo',
      email: process.env.EMAIL_FROM || 'noreply@eximpo.com',
    };
    sendSmtpEmail.to = [{ email: to }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent:', {
      to,
      subject: template.subject,
      messageId: result.messageId
    });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

// Send bulk email function
export const sendBulkEmail = async (recipients, templateName, data) => {
  try {
    const results = { successful: [], failed: [] };

    for (const recipient of recipients) {
      const result = await sendEmail(recipient, templateName, data);
      if (result.success) {
        results.successful.push(recipient);
      } else {
        results.failed.push({ email: recipient, error: result.error });
      }
    }

    return { success: true, sent: results.successful.length, failed: results.failed.length, details: results };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default { sendEmail, sendBulkEmail };
