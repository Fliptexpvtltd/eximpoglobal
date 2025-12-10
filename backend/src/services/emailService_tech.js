import SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Modern tech/startup email template helper
const createTechTemplate = (title, subtitle, greeting, message, details, buttonText, buttonUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b;">
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Eximpo</h1>
      <p style="color: #dbeafe; margin: 8px 0 0 0; font-size: 13px; font-weight: 500; letter-spacing: 0.5px;">Global Trade Platform</p>
    </div>
    
    <div style="padding: 40px 30px;">
      <div style="background: ${details.accentColor || '#22c55e'}; height: 4px; width: 60px; margin-bottom: 24px;"></div>
      
      <h2 style="color: #f1f5f9; margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">${title}</h2>
      ${subtitle ? `<p style="color: #94a3b8; margin: 0 0 24px 0; font-size: 14px;">${subtitle}</p>` : ''}
      
      ${greeting ? `<p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">${greeting}</p>` : ''}
      
      ${message ? `<p style="color: #94a3b8; font-size: 15px; line-height: 1.7; margin: 0 0 32px 0;">${message}</p>` : ''}
      
      ${details.content}
      
      ${buttonText && buttonUrl ? `
      <div style="text-align: center; margin: 32px 0;">
        <a href="${buttonUrl}" style="display: inline-block; background: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 6px;">${buttonText}</a>
      </div>
      ` : ''}
    </div>
    
    <div style="background: #0f172a; padding: 24px 30px; text-align: center; border-top: 1px solid #334155;">
      <p style="color: #64748b; font-size: 13px; margin: 0;">Eximpo · Global Trade Platform</p>
    </div>
  </div>
</body>
</html>
`;

// Email templates with modern tech/startup UI
const emailTemplates = {
  rfqCreated: (data) => ({
    subject: `RFQ Created - ${data.rfqNumber}`,
    html: createTechTemplate(
      'RFQ Created Successfully',
      'Your request is now live',
      `Hi <strong style="color: #f1f5f9;">${data.companyName}</strong>,`,
      "Your RFQ has been distributed to matching suppliers. You'll start receiving quotes soon.",
      {
        accentColor: '#22c55e',
        content: `
          <div style="background: #0f172a; border-left: 4px solid #3b82f6; padding: 24px; margin: 32px 0;">
            <h3 style="color: #f1f5f9; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">Details</h3>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">RFQ NUMBER</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.rfqNumber}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">PRODUCT</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.productName}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">QUANTITY</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.quantity} units</div>
            </div>
            <div>
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">TARGET PRICE</div>
              <div style="color: #22c55e; font-size: 18px; font-weight: 700;">${data.targetPrice}</div>
            </div>
          </div>
        `
      },
      'View My RFQs',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/buyer/rfqs`
    )
  }),

  rfqNotification: (data) => ({
    subject: `New RFQ Opportunity - ${data.category}`,
    html: createTechTemplate(
      'New Business Opportunity',
      'A buyer is looking for your products',
      `Hi <strong style="color: #f1f5f9;">${data.sellerCompany}</strong>,`,
      "A new RFQ matching your category has been posted. Submit a competitive quote to win the business.",
      {
        accentColor: '#a855f7',
        content: `
          <div style="background: #0f172a; border-left: 4px solid #a855f7; padding: 24px; margin: 32px 0;">
            <h3 style="color: #f1f5f9; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">Opportunity Details</h3>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">PRODUCT NEEDED</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.productName}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">CATEGORY</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.category}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">QUANTITY</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.quantity} units</div>
            </div>
            <div>
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">BUYER'S BUDGET</div>
              <div style="color: #22c55e; font-size: 18px; font-weight: 700;">${data.targetPrice}</div>
            </div>
          </div>
        `
      },
      'Submit Quote',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/seller/rfqs`
    )
  }),

  quoteReceived: (data) => ({
    subject: `New Quote from ${data.sellerCompany}`,
    html: createTechTemplate(
      'Quote Received',
      'Review and compare',
      `Hi <strong style="color: #f1f5f9;">${data.companyName}</strong>,`,
      `${data.sellerCompany} has submitted a quote for your RFQ. Compare with other quotes to get the best deal.`,
      {
        accentColor: '#3b82f6',
        content: `
          <div style="background: #0f172a; border-left: 4px solid #3b82f6; padding: 24px; margin: 32px 0;">
            <h3 style="color: #f1f5f9; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">Quote Summary</h3>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">SUPPLIER</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.sellerCompany}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">PRODUCT</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.productName}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">QUOTED PRICE</div>
              <div style="color: #22c55e; font-size: 18px; font-weight: 700;">${data.quotedPrice}</div>
            </div>
            <div>
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">LEAD TIME</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.leadTime}</div>
            </div>
          </div>
        `
      },
      'View Quotes',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/buyer/quotes`
    )
  }),

  quoteAccepted: (data) => ({
    subject: `Quote Accepted - ${data.productName}`,
    html: createTechTemplate(
      'Quote Accepted',
      'Order will be created shortly',
      `Hi <strong style="color: #f1f5f9;">${data.companyName}</strong>,`,
      `Great news! ${data.buyerCompany} has accepted your quote. A purchase order will be generated soon.`,
      {
        accentColor: '#22c55e',
        content: `
          <div style="background: #0f172a; border-left: 4px solid #22c55e; padding: 24px; margin: 32px 0;">
            <h3 style="color: #f1f5f9; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">Accepted Quote</h3>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">BUYER</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.buyerCompany}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">PRODUCT</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.productName}</div>
            </div>
            <div>
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">ORDER VALUE</div>
              <div style="color: #22c55e; font-size: 18px; font-weight: 700;">${data.quotedPrice}</div>
            </div>
          </div>
        `
      },
      'View Order',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/seller/orders`
    )
  }),

  orderCreated: (data) => ({
    subject: `Order Confirmed - ${data.orderNumber}`,
    html: createTechTemplate(
      'Order Confirmed',
      'Processing has started',
      `Hi <strong style="color: #f1f5f9;">${data.companyName}</strong>,`,
      `Your order has been confirmed and ${data.sellerCompany || data.buyerCompany} will process it shortly.`,
      {
        accentColor: '#22c55e',
        content: `
          <div style="background: #0f172a; border-left: 4px solid #22c55e; padding: 24px; margin: 32px 0;">
            <h3 style="color: #f1f5f9; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">Order Summary</h3>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">ORDER NUMBER</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.orderNumber}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">${data.sellerCompany ? 'SUPPLIER' : 'BUYER'}</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.sellerCompany || data.buyerCompany}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">TOTAL AMOUNT</div>
              <div style="color: #22c55e; font-size: 18px; font-weight: 700;">${data.totalAmount}</div>
            </div>
            <div>
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">DELIVERY ADDRESS</div>
              <div style="color: #94a3b8; font-size: 13px; line-height: 1.6;">${data.deliveryAddress}</div>
            </div>
          </div>
        `
      },
      'Track Order',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders`
    )
  }),

  shipmentUpdate: (data) => ({
    subject: `Shipment Update - ${data.status.toUpperCase().replace('_', ' ')}`,
    html: createTechTemplate(
      'Shipment Update',
      'Status changed',
      `Hi <strong style="color: #f1f5f9;">${data.companyName}</strong>,`,
      "Your shipment status has been updated. Track it in real-time using the link below.",
      {
        accentColor: '#0ea5e9',
        content: `
          <div style="background: #0f172a; border-left: 4px solid #0ea5e9; padding: 24px; margin: 32px 0;">
            <h3 style="color: #f1f5f9; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">Tracking Info</h3>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">ORDER NUMBER</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.orderNumber}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">TRACKING NUMBER</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.trackingNumber}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">STATUS</div>
              <div style="color: #0ea5e9; font-size: 16px; font-weight: 700; text-transform: uppercase;">${data.status.replace('_', ' ')}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">LOCATION</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.location}</div>
            </div>
            <div style="background: #064e3b; padding: 16px; border-radius: 6px; margin-top: 16px;">
              <div style="color: #6ee7b7; font-size: 13px; line-height: 1.6;">${data.description}</div>
            </div>
          </div>
        `
      },
      'Track Shipment',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/shipments`
    )
  }),

  userVerification: (data) => ({
    subject: 'Account Verified - Welcome',
    html: createTechTemplate(
      'Welcome to Eximpo',
      'Your account is now verified',
      `Hi <strong style="color: #f1f5f9;">${data.companyName}</strong>,`,
      "Your account has been approved. You now have full access to the platform. Let's get started!",
      {
        accentColor: '#22c55e',
        content: `
          <div style="background: #0f172a; border-left: 4px solid #22c55e; padding: 24px; margin: 32px 0;">
            <h3 style="color: #f1f5f9; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">What's Next</h3>
            ${data.role === 'buyer' ? `
              <div style="color: #94a3b8; font-size: 14px; line-height: 2; margin-top: 12px;">
                · Browse products from verified suppliers<br>
                · Create RFQs and receive quotes<br>
                · Place secure orders<br>
                · Track shipments in real-time
              </div>
            ` : `
              <div style="color: #94a3b8; font-size: 14px; line-height: 2; margin-top: 12px;">
                · List your products on marketplace<br>
                · Respond to buyer RFQs<br>
                · Manage orders efficiently<br>
                · Grow your business globally
              </div>
            `}
          </div>
        `
      },
      'Go to Dashboard',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`
    )
  }),

  productApproved: (data) => ({
    subject: 'Product Approved - Now Live',
    html: createTechTemplate(
      'Product Approved',
      'Now visible to buyers',
      `Hi <strong style="color: #f1f5f9;">${data.companyName}</strong>,`,
      "Your product has been approved and is now live on the marketplace. Buyers can now find and purchase it.",
      {
        accentColor: '#22c55e',
        content: `
          <div style="background: #0f172a; border-left: 4px solid #22c55e; padding: 24px; margin: 32px 0;">
            <h3 style="color: #f1f5f9; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">Product Details</h3>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">PRODUCT NAME</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.productName}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">CATEGORY</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.category}</div>
            </div>
            <div style="border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">UNIT PRICE</div>
              <div style="color: #22c55e; font-size: 18px; font-weight: 700;">$${data.price}</div>
            </div>
            <div>
              <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">MINIMUM ORDER</div>
              <div style="color: #f1f5f9; font-size: 15px; font-weight: 600;">${data.moq} units</div>
            </div>
          </div>
        `
      },
      'View Product',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/seller/products`
    )
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
