import { sendEmail } from './src/services/emailService.js';

const testEmail = 'eximpoglobalofficial@gmail.com';

console.log('🧪 Testing all email templates...\n');

// Test 1: RFQ Created
console.log('1. Testing RFQ Created email...');
sendEmail(testEmail, 'rfqCreated', {
  companyName: 'Test Buyer Company',
  rfqNumber: 'RFQ-TEST-001',
  productName: 'Industrial Pumps',
  quantity: 100,
  targetPrice: '$50,000'
})
  .then(() => console.log('✅ RFQ Created email sent'))
  .catch(err => console.error('❌ RFQ Created email failed:', err.message));

// Test 2: RFQ Notification
setTimeout(() => {
  console.log('\n2. Testing RFQ Notification email...');
  sendEmail(testEmail, 'rfqNotification', {
    sellerCompany: 'Test Seller Company',
    productName: 'Industrial Pumps',
    quantity: 100,
    targetPrice: '$50,000',
    category: 'Machinery'
  })
    .then(() => console.log('✅ RFQ Notification email sent'))
    .catch(err => console.error('❌ RFQ Notification email failed:', err.message));
}, 1000);

// Test 3: Quote Received
setTimeout(() => {
  console.log('\n3. Testing Quote Received email...');
  sendEmail(testEmail, 'quoteReceived', {
    companyName: 'Test Buyer Company',
    productName: 'Industrial Pumps',
    sellerCompany: 'ABC Suppliers Ltd',
    quotedPrice: '$48,000',
    leadTime: '30 days'
  })
    .then(() => console.log('✅ Quote Received email sent'))
    .catch(err => console.error('❌ Quote Received email failed:', err.message));
}, 2000);

// Test 4: Quote Accepted
setTimeout(() => {
  console.log('\n4. Testing Quote Accepted email...');
  sendEmail(testEmail, 'quoteAccepted', {
    companyName: 'Test Seller Company',
    productName: 'Industrial Pumps',
    buyerCompany: 'XYZ Trading Corp',
    quotedPrice: '$48,000'
  })
    .then(() => console.log('✅ Quote Accepted email sent'))
    .catch(err => console.error('❌ Quote Accepted email failed:', err.message));
}, 3000);

// Test 5: Order Created (Buyer)
setTimeout(() => {
  console.log('\n5. Testing Order Created email (Buyer)...');
  sendEmail(testEmail, 'orderCreated', {
    companyName: 'Test Buyer Company',
    orderNumber: 'ORD-TEST-12345',
    totalAmount: '$48,000',
    deliveryAddress: '123 Business St, Industrial Park, NY 10001',
    sellerCompany: 'ABC Suppliers Ltd'
  })
    .then(() => console.log('✅ Order Created (Buyer) email sent'))
    .catch(err => console.error('❌ Order Created (Buyer) email failed:', err.message));
}, 4000);

// Test 6: Order Created (Seller)
setTimeout(() => {
  console.log('\n6. Testing Order Created email (Seller)...');
  sendEmail(testEmail, 'orderCreated', {
    companyName: 'Test Seller Company',
    orderNumber: 'ORD-TEST-12345',
    totalAmount: '$48,000',
    deliveryAddress: '123 Business St, Industrial Park, NY 10001',
    buyerCompany: 'XYZ Trading Corp'
  })
    .then(() => console.log('✅ Order Created (Seller) email sent'))
    .catch(err => console.error('❌ Order Created (Seller) email failed:', err.message));
}, 5000);

// Test 7: Shipment Update
setTimeout(() => {
  console.log('\n7. Testing Shipment Update email...');
  sendEmail(testEmail, 'shipmentUpdate', {
    companyName: 'Test Buyer Company',
    orderNumber: 'ORD-TEST-12345',
    trackingNumber: 'TRK-987654321',
    status: 'in_transit',
    location: 'Mumbai Port, India',
    description: 'Package cleared customs and is in transit to destination'
  })
    .then(() => console.log('✅ Shipment Update email sent'))
    .catch(err => console.error('❌ Shipment Update email failed:', err.message));
}, 6000);

// Test 8: User Verification
setTimeout(() => {
  console.log('\n8. Testing User Verification email...');
  sendEmail(testEmail, 'userVerification', {
    companyName: 'Test Company Ltd',
    role: 'buyer'
  })
    .then(() => console.log('✅ User Verification email sent'))
    .catch(err => console.error('❌ User Verification email failed:', err.message));
}, 7000);

// Test 9: Product Approved
setTimeout(() => {
  console.log('\n9. Testing Product Approved email...');
  sendEmail(testEmail, 'productApproved', {
    companyName: 'Test Seller Company',
    productName: 'Industrial Pumps Model XYZ-500',
    category: 'Machinery',
    price: '$480',
    moq: 100
  })
    .then(() => console.log('✅ Product Approved email sent'))
    .catch(err => console.error('❌ Product Approved email failed:', err.message));
}, 8000);

setTimeout(() => {
  console.log('\n\n✨ All email tests completed!');
  console.log('📧 Check your inbox at: eximpoglobalofficial@gmail.com');
  console.log('📝 Note: Emails may take 1-2 minutes to arrive');
  process.exit(0);
}, 10000);
