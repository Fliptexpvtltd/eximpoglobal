# Brevo Email Setup Guide

## Step 1: Get Brevo API Key

1. Go to https://www.brevo.com (formerly Sendinblue)
2. Sign up for a free account (300 emails/day free tier)
3. Verify your email address
4. Go to **Settings** → **SMTP & API** → **API Keys**
5. Click **Generate a new API key**
6. Name it "Eximpo Backend" and copy the key

## Step 2: Configure Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file (if it doesn't exist):
   ```bash
   # Copy from example
   cp ../.env.example .env
   ```

3. Open `.env` and add your Brevo API key:
   ```env
   BREVO_API_KEY=xkeysib-your-actual-api-key-here
   EMAIL_FROM=noreply@eximpo.com
   EMAIL_FROM_NAME=Eximpo
   FRONTEND_URL=http://localhost:3000
   ```

## Step 3: Restart Backend

### If using Docker:
```bash
docker-compose restart backend
```

### If running locally:
```bash
npm install
npm start
```

## Step 4: Verify Setup

1. Watch the backend logs:
   ```bash
   docker-compose logs -f backend
   ```

2. Look for email-related messages when actions occur

## Step 5: Test Email Flow

### Test RFQ Creation
1. Log in as a buyer
2. Create a new RFQ from a product
3. Check your email for confirmation
4. Check seller emails for RFQ notifications

### Test Quote Submission
1. Log in as a seller
2. Submit a quote for an RFQ
3. Check buyer email for quote notification

### Test Quote Acceptance
1. Log in as buyer
2. Accept a quote
3. Check seller email for acceptance notification

### Test Order Creation
1. Create an order from accepted quote
2. Both buyer and seller should receive order emails

### Test Shipment Updates
1. Log in as seller
2. Update shipment tracking
3. Check buyer email for shipment update

## Troubleshooting

### Emails not sending?

1. **Check API Key**: Make sure `BREVO_API_KEY` is set correctly in `.env`
2. **Check Logs**: Look for error messages in backend logs
3. **Development Mode**: Without API key, emails are logged to console instead
4. **Verify Domain**: Brevo may require domain verification for production use

### Check Backend Logs:
```bash
docker-compose logs backend | grep -i email
```

### Test API Key:
```bash
curl -H "api-key: YOUR_API_KEY" https://api.brevo.com/v3/account
```

## Email Templates Included

All templates are in `backend/src/services/emailService.js`:

1. **rfqCreated** - RFQ confirmation to buyer
2. **rfqNotification** - RFQ alert to sellers
3. **quoteReceived** - Quote notification to buyer
4. **quoteAccepted** - Quote acceptance to seller
5. **orderCreated** - Order confirmation to buyer & seller
6. **shipmentUpdate** - Shipment tracking to buyer
7. **userVerification** - Account verification
8. **productApproved** - Product approval to seller

## Customizing Email Templates

Edit `backend/src/services/emailService.js` to customize:
- Subject lines
- Email body HTML
- Styling and branding
- Data passed to templates

## Production Considerations

### Domain Verification
1. Add sender domain in Brevo dashboard
2. Configure SPF and DKIM records
3. Verify domain before sending production emails

### Email Limits
- **Free Tier**: 300 emails/day
- **Paid Plans**: Higher limits available
- Monitor usage in Brevo dashboard

### Best Practices
- Use transactional email plan for better deliverability
- Add unsubscribe links for marketing emails
- Monitor bounce rates and spam reports
- Keep email content professional and concise

## Support

- **Brevo Documentation**: https://developers.brevo.com/docs
- **API Reference**: https://developers.brevo.com/reference
- **Support**: https://www.brevo.com/support/

## Next Steps

After setting up emails:
1. Test all email flows
2. Verify emails arrive in inbox (not spam)
3. Customize email templates with your branding
4. Set up domain verification for production
5. Monitor email delivery rates in Brevo dashboard
