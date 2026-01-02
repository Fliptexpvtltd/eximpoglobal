// Email templates with modern UI
export const emailTemplates = {
  welcome: (data) => ({
    subject: '🎉 Welcome to Eximpo Global - Your Account is Ready!',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin: 0; padding: 20px; background: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🎊 Welcome to Eximpo Global!</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${data.fullName || data.companyName}</strong>,
            </p>
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">
              Thank you for joining Eximpo Global! 🎉 Your account has been successfully created. You can now start exploring our platform and connect with ${data.role === 'buyer' ? 'verified suppliers' : 'potential buyers'} worldwide.
            </p>
            
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #2563eb;">
              <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">📋 Account Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Company:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.companyName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Account Type:</td>
                  <td style="padding: 8px 0; color: #2563eb; font-weight: 600; font-size: 14px; text-transform: capitalize;">${data.role}</td>
                </tr>
              </table>
            </div>

            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #16a34a;">
              <h3 style="margin: 0 0 15px 0; color: #15803d; font-size: 18px;">🚀 Next Steps</h3>
              <ul style="list-style: none; padding-left: 0; margin: 10px 0;">
                ${data.role === 'buyer' ? `
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Browse our extensive product catalog</li>
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Create your first RFQ to get quotes</li>
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Connect with verified suppliers</li>
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Track your orders in real-time</li>
                ` : `
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ List your first product</li>
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Respond to buyer RFQs</li>
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Manage your inventory</li>
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Grow your business globally</li>
                `}
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">Start Exploring</a>
            </div>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>💡 Pro Tip:</strong> Complete your profile and verify your business to unlock all platform features and gain buyer/seller trust!
              </p>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 10px 0;">
              Need help? Contact our support team at <a href="mailto:support@eximpoglobal.net" style="color: #2563eb;">support@eximpoglobal.net</a>
            </p>
            <p style="color: #64748b; font-size: 14px; margin: 10px 0;">
              <strong style="color: #334155;">Eximpo Global</strong><br>
              Connecting Buyers and Suppliers Worldwide
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  rfqCreated: (data) => ({
    subject: `🎯 RFQ Created Successfully - ${data.rfqNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin: 0; padding: 20px; background: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">✅ RFQ Created Successfully!</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${data.companyName}</strong>,
            </p>
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">
              Your Request for Quotation has been created and sent to matching suppliers. You'll start receiving competitive quotes soon!
            </p>
            
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #2563eb;">
              <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">📋 RFQ Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">RFQ Number:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.rfqNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Product:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.productName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Quantity:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.quantity} units</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Target Price:</td>
                  <td style="padding: 8px 0; color: #16a34a; font-weight: 700; font-size: 14px;">${data.targetPrice}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/buyer/rfqs" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">View My RFQs</a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 10px 0;">
              <strong style="color: #334155;">Eximpo Global</strong><br>
              Connecting Buyers and Suppliers Worldwide
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  rfqNotification: (data) => ({
    subject: `🔔 New RFQ Opportunity - ${data.category}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin: 0; padding: 20px; background: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🎯 New Business Opportunity!</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${data.sellerCompany}</strong>,
            </p>
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">
              Great news! A new Request for Quotation matching your product category has been posted. This is your chance to win new business!
            </p>
            
            <div style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #8b5cf6;">
              <h3 style="margin: 0 0 15px 0; color: #6b21a8; font-size: 18px;">📦 RFQ Opportunity</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Product Needed:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.productName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Category:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.category}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Quantity:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.quantity} units</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Buyer's Budget:</td>
                  <td style="padding: 8px 0; color: #16a34a; font-weight: 700; font-size: 14px;">${data.targetPrice}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/seller/rfqs" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">Submit Your Quote Now</a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 10px 0;">
              <strong style="color: #334155;">Eximpo Global</strong><br>
              Connecting Buyers and Suppliers Worldwide
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  quoteReceived: (data) => ({
    subject: `💼 New Quote Received from ${data.sellerCompany}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin: 0; padding: 20px; background: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">📬 You Have a New Quote!</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${data.companyName}</strong>,
            </p>
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">
              Excellent news! <strong>${data.sellerCompany}</strong> has submitted a competitive quote for your RFQ.
            </p>
            
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #16a34a;">
              <h3 style="margin: 0 0 15px 0; color: #15803d; font-size: 18px;">💰 Quote Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Supplier:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.sellerCompany}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Product:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.productName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Quoted Price:</td>
                  <td style="padding: 8px 0; color: #16a34a; font-weight: 700; font-size: 16px;">${data.quotedPrice}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Lead Time:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.leadTime}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/buyer/quotes" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">View & Compare Quotes</a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 10px 0;">
              <strong style="color: #334155;">Eximpo Global</strong><br>
              Connecting Buyers and Suppliers Worldwide
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  quoteAccepted: (data) => ({
    subject: `🎉 Congratulations! Quote Accepted - ${data.productName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin: 0; padding: 20px; background: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🏆 Quote Accepted!</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${data.companyName}</strong>,
            </p>
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">
              Fantastic news! <strong>${data.buyerCompany}</strong> has accepted your quote. An order will be created shortly.
            </p>
            
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #16a34a;">
              <h3 style="margin: 0 0 15px 0; color: #15803d; font-size: 18px;">📊 Accepted Quote Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Buyer Company:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.buyerCompany}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Product:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.productName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Order Value:</td>
                  <td style="padding: 8px 0; color: #16a34a; font-weight: 700; font-size: 16px;">${data.quotedPrice}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/seller/orders" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">View Order Details</a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 10px 0;">
              <strong style="color: #334155;">Eximpo Global</strong><br>
              Connecting Buyers and Suppliers Worldwide
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderCreated: (data) => ({
    subject: `📦 Order Confirmed - ${data.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin: 0; padding: 20px; background: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">✅ Order Placed Successfully!</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${data.companyName}</strong>,
            </p>
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">
              Your order has been confirmed! ${data.sellerCompany || data.buyerCompany} will begin processing it shortly.
            </p>
            
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #16a34a;">
              <h3 style="margin: 0 0 15px 0; color: #15803d; font-size: 18px;">📋 Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Order Number:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">${data.sellerCompany ? 'Supplier' : 'Buyer'}:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.sellerCompany || data.buyerCompany}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Total Amount:</td>
                  <td style="padding: 8px 0; color: #16a34a; font-weight: 700; font-size: 16px;">${data.totalAmount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Delivery Address:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 500; font-size: 13px;">${data.deliveryAddress}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">Track Order</a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 10px 0;">
              <strong style="color: #334155;">Eximpo Global</strong><br>
              Connecting Buyers and Suppliers Worldwide
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  shipmentUpdate: (data) => ({
    subject: `🚚 Shipment Update: ${data.status.toUpperCase().replace('_', ' ')}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin: 0; padding: 20px; background: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">📍 Shipment Status Update</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${data.companyName}</strong>,
            </p>
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">
              Your shipment status has been updated. Here's the latest information:
            </p>
            
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #0ea5e9;">
              <h3 style="margin: 0 0 15px 0; color: #0369a1; font-size: 18px;">📦 Tracking Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Order Number:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Tracking Number:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.trackingNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Current Status:</td>
                  <td style="padding: 8px 0; color: #0ea5e9; font-weight: 700; font-size: 15px; text-transform: uppercase;">${data.status.replace('_', ' ')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Location:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.location}</td>
                </tr>
              </table>
            </div>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a; margin: 25px 0;">
              <p style="margin: 0; color: #15803d; font-size: 14px;">
                <strong>📝 Update:</strong> ${data.description}
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/shipments" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">Track Live Location</a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 10px 0;">
              <strong style="color: #334155;">Eximpo Global</strong><br>
              Connecting Buyers and Suppliers Worldwide
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  userVerification: (data) => ({
    subject: '🎉 Welcome to Eximpo - Account Verified!',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin: 0; padding: 20px; background: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🎊 Welcome to Eximpo!</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${data.companyName}</strong>,
            </p>
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">
              Congratulations! 🎉 Your account has been verified and approved by our team. You now have full access to all platform features!
            </p>
            
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #16a34a;">
              <h3 style="margin: 0 0 15px 0; color: #15803d; font-size: 18px;">🚀 Get Started Now</h3>
              <ul style="list-style: none; padding-left: 0; margin: 10px 0;">
                ${data.role === 'buyer' ? `
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Browse thousands of products from verified suppliers</li>
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Create RFQs and receive competitive quotes</li>
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Place orders with secure payment options</li>
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Track shipments in real-time</li>
                ` : `
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ List your products on the marketplace</li>
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Respond to buyer RFQs</li>
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Manage orders and shipments</li>
                  <li style="padding: 8px 0; color: #15803d; font-size: 14px;">✅ Grow your business globally</li>
                `}
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">Access Your Dashboard</a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 10px 0;">
              <strong style="color: #334155;">Eximpo Global</strong><br>
              Connecting Buyers and Suppliers Worldwide
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  productApproved: (data) => ({
    subject: '✅ Product Approved - Now Live on Eximpo!',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="margin: 0; padding: 20px; background: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 650px; margin: 0 auto; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🎉 Product Approved!</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${data.companyName}</strong>,
            </p>
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">
              Excellent news! Your product has been reviewed and approved. It's now live on the Eximpo marketplace and visible to thousands of buyers worldwide! 🌍
            </p>
            
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #16a34a;">
              <h3 style="margin: 0 0 15px 0; color: #15803d; font-size: 18px;">📦 Product Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Product Name:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.productName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Category:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.category}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Unit Price:</td>
                  <td style="padding: 8px 0; color: #16a34a; font-weight: 700; font-size: 16px;">$${data.price}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Minimum Order:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px;">${data.moq} units</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/seller/products" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">View My Product</a>
            </div>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 30px; line-height: 1.5; text-align: center;">
              Start receiving RFQs and grow your business! 🚀
            </p>
          </div>
          <div style="background: #f8fafc; padding: 30px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 10px 0;">
              <strong style="color: #334155;">Eximpo Global</strong><br>
              Connecting Buyers and Suppliers Worldwide
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

export default emailTemplates;
