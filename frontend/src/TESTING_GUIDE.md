# Testing Guide - International Trade E-Commerce Platform

## Overview
This guide provides comprehensive instructions for testing all features of the international trade e-commerce platform. The application includes five personas (Buyer, Seller, Ops/Logistics, Finance/Compliance, and Admin) and covers the complete trade workflow from product discovery to shipment tracking.

---

## Getting Started

### Initial Access
1. **Launch the Application**: Open the application in your browser
2. **Login Screen**: You'll see the login interface first
   - Note: Authentication is mocked for MVP testing
   - Any email/password combination will work

---

## Test Scenarios by User Role

### 🛒 **BUYER ROLE TESTING**

#### Step 1: Account Setup
1. On the login screen, click **"Sign Up"** or enter any credentials and click **"Login"**
2. Select **"Buyer (Importer)"** role
3. Enter your company name (e.g., "Global Imports Inc.")
4. Select an industry from the dropdown
5. Click **"Continue"** to access the Buyer Dashboard

#### Step 2: Buyer Dashboard Overview
You should see:
- **Active RFQs** section showing request for quotations
- **Recent Orders** displaying purchase orders
- **Quick Actions** buttons
- Navigation menu with: Dashboard, Product Catalog, Messages, Orders, Analytics

#### Step 3: Product Discovery & Catalog
1. Click **"Browse Catalog"** from Quick Actions or use the navigation menu
2. **Test Filtering Options**:
   - Search by product name (try "Electronics", "Textiles", etc.)
   - Filter by Category (dropdown)
   - Filter by HS Code
   - Filter by Certifications (CE, ISO, FDA, etc.)
   - Set MOQ range using sliders
   - Select Origin Country
   - Apply Currency filter
3. **View Results**:
   - Product cards display: name, supplier, price, MOQ, certifications
   - Note the supplier ratings and country of origin
   - Check that filters update results in real-time

#### Step 4: Product Details
1. Click on any product card to view details
2. **Verify Product Detail Page Shows**:
   - Full product description
   - Price and currency
   - MOQ (Minimum Order Quantity)
   - Lead time
   - HS Code
   - Certifications (badges)
   - Product variants (if available)
   - Supplier information panel
3. **Actions Available**:
   - **"Request Quote"** - initiates RFQ
   - **"View Supplier Profile"** - navigates to supplier details
   - **"Contact Supplier"** - opens chat

#### Step 5: Supplier Profile
1. From Product Detail, click **"View Supplier Profile"**
2. **Verify Supplier Profile Shows**:
   - Company name and rating
   - Years in business
   - Product categories
   - Certifications
   - Export markets
   - Production capacity
   - Quality control processes
   - Payment terms accepted
   - Typical lead times
   - Product catalog from this supplier

#### Step 6: Create RFQ (Request for Quote)
1. From Product Detail, click **"Request Quote"**
2. **Fill out RFQ Builder**:
   - Product is pre-selected
   - Enter **Quantity** (must meet MOQ)
   - Add **Specifications** (text area for custom requirements)
   - Select **Incoterm** (FOB, CIF, EXW, etc.)
   - Enter **Destination Port**
   - Optionally set **Target Price**
   - Select **Deadline** for quote submission
   - Add additional products if needed (click "Add Product")
3. Click **"Submit RFQ"**
4. You'll be redirected to Quote Comparison view

#### Step 7: Quote Comparison
1. After submitting RFQ, view received quotes from suppliers
2. **Compare Multiple Quotes** - Table shows:
   - Supplier name and rating
   - Unit price
   - Total cost (including freight and insurance)
   - Lead time
   - Payment terms
   - Valid until date
   - Incoterm
3. **Actions**:
   - Sort by different columns (price, lead time, etc.)
   - Click **"Message"** to chat with supplier
   - Click **"Accept Quote"** to proceed to Purchase Order
   - Click **"Reject"** to decline a quote

#### Step 8: Messaging/Chat Interface
1. Click **"Message"** on any quote or use **"Messages"** in navigation
2. **Test Chat Features**:
   - Select a conversation from the list (suppliers/contacts)
   - Send text messages
   - Upload documents/attachments (click paperclip icon)
   - View message history
   - See online/offline status indicators
   - Check timestamp on messages

#### Step 9: Create Purchase Order
1. From Quote Comparison, click **"Accept Quote"** on preferred supplier
2. **PO Creation Form**:
   - Review order items and quantities
   - Confirm unit prices and total amount
   - Select **Payment Method**:
     - **Escrow** - funds held until delivery
     - **Letter of Credit (LC)**
     - **Open Account (OA)**
     - **Documents against Payment (DP)**
   - Set **Deposit Percentage** (e.g., 30%)
   - System calculates deposit and balance amounts
   - Select **Incoterm**
   - Set **Delivery Window** (date range)
   - Add any special instructions
3. Click **"Create Purchase Order"**
4. PO status should be "Pending Payment"

#### Step 10: View Orders & Track Shipments
1. Navigate to **"Orders"** from the menu
2. View list of all Purchase Orders with statuses:
   - Draft
   - Pending Payment
   - In Production
   - Shipped
   - Delivered
3. Click on any order with "Shipped" status
4. View **Shipment Tracking** page

#### Step 11: Shipment Tracking
1. **Verify Tracking Information**:
   - Shipment mode (Air, Sea, Rail, Courier)
   - Tracking number
   - Origin and destination ports
   - Forwarder/carrier name
   - Container type (for sea freight)
   - Current status
   - Estimated arrival (ETA)
2. **Milestone Timeline**:
   - View completed milestones (green checkmarks)
   - See upcoming milestones
   - Check dates and locations for each milestone
3. **Shipping Documents**:
   - Bill of Lading
   - Commercial Invoice
   - Packing List
   - Certificate of Origin
   - Inspection Certificate
   - Click to download/view documents

#### Step 12: Analytics Dashboard
1. Click **"Analytics"** in navigation
2. **Verify Analytics Show**:
   - Total spend over time (line chart)
   - Orders by status (pie chart)
   - Top suppliers (bar chart)
   - Average order value
   - On-time delivery rate
   - Cost savings metrics
   - Filters by date range

---

### 🏭 **SELLER ROLE TESTING**

#### Step 1: Account Setup
1. Log out if currently logged in (user menu → Logout)
2. Return to login screen
3. Click **"Sign Up"** or login
4. Select **"Seller (Exporter)"** role
5. Enter company name (e.g., "Premium Manufacturing Co.")
6. Select industry
7. Click **"Continue"**

#### Step 2: Seller Dashboard Overview
You should see:
- **Incoming RFQs** section (requests from buyers)
- **Active Quotes** you've submitted
- **Recent Orders** from buyers
- **Performance Metrics**:
  - Quote response rate
  - Win rate
  - Average order value
  - Revenue trends
- Quick action buttons

#### Step 3: Respond to RFQs
1. View **Incoming RFQs** list on dashboard
2. Click on any RFQ to view details:
   - Buyer information
   - Product requested
   - Quantity needed
   - Specifications
   - Incoterm preference
   - Destination port
   - Target price (if provided)
   - Deadline
3. Click **"Submit Quote"** button
4. **Fill Quote Form**:
   - Enter unit price
   - Select currency
   - Confirm or update incoterm
   - Specify lead time
   - Add freight cost estimate
   - Add insurance cost
   - Set payment terms (e.g., "30% deposit, 70% before shipment")
   - Set validity period (quote expiration date)
   - Add any notes or terms
5. Click **"Submit Quote"**
6. Quote appears in **"Active Quotes"** section

#### Step 4: Manage Quotes
1. View **Active Quotes** section
2. Check quote statuses:
   - Pending (awaiting buyer response)
   - Accepted (buyer approved)
   - Rejected
3. For accepted quotes, click **"View Order"** to see Purchase Order

#### Step 5: Order Management
1. Navigate to **"Orders"** section
2. View orders by status:
   - New Orders (recently accepted)
   - In Production
   - Ready to Ship
   - Shipped
   - Delivered
3. Click on an order to view details:
   - PO number
   - Buyer information
   - Products and quantities
   - Payment terms and status
   - Delivery requirements
4. **Update Order Status**:
   - Move orders through production stages
   - Upload production updates
   - Arrange shipment when ready

#### Step 6: Analytics for Sellers
1. Click **"Analytics"** in navigation
2. **Verify Seller-Specific Analytics**:
   - Revenue by month/quarter
   - Quote conversion rate
   - Top products sold
   - Top buyers/markets
   - Average fulfillment time
   - Order volume trends
   - Profit margins (if configured)

---

## Advanced Testing Scenarios

### Multi-Role Testing
To test the complete workflow from both perspectives:

1. **As Buyer**:
   - Create an RFQ for a specific product
   - Note the RFQ ID or details

2. **Logout and Login as Seller**:
   - Check that RFQ appears in incoming requests
   - Submit a quote

3. **Logout and Login as Buyer**:
   - View the quote in Quote Comparison
   - Accept the quote
   - Create Purchase Order

4. **Logout and Login as Seller**:
   - View the new Purchase Order
   - Update status to "In Production"
   - Update to "Shipped"

5. **Logout and Login as Buyer**:
   - Track the shipment
   - View documents
   - Check analytics for updated metrics

### Edge Cases to Test

#### RFQ Builder:
- [ ] Create RFQ without optional fields (target price)
- [ ] Add multiple products to single RFQ
- [ ] Test with quantities below MOQ (should show warning)
- [ ] Try all Incoterm options

#### Quote Comparison:
- [ ] Compare quotes with different currencies
- [ ] Sort by each column
- [ ] Filter quotes by supplier rating
- [ ] Accept/reject multiple quotes

#### Purchase Orders:
- [ ] Test each payment method option
- [ ] Try different deposit percentages (0%, 30%, 50%, 100%)
- [ ] Verify calculations update correctly

#### Filters & Search:
- [ ] Combine multiple filters simultaneously
- [ ] Clear filters individually
- [ ] Test with no results (invalid combinations)
- [ ] Search with special characters

#### Chat/Messaging:
- [ ] Send long messages
- [ ] Switch between conversations
- [ ] Test with multiple message threads

---

## Features Checklist

### ✅ Authentication & Roles
- [ ] Login with any credentials
- [ ] Sign up flow
- [ ] Role selection (Buyer, Seller, Ops, Finance, Admin)
- [ ] Logout functionality
- [ ] Role-specific dashboards load correctly

### ✅ Product Catalog
- [ ] Product grid displays correctly
- [ ] All filter options work
- [ ] Search functionality
- [ ] Product images load
- [ ] Supplier information visible
- [ ] Certifications display as badges

### ✅ Product Details
- [ ] Complete product information shown
- [ ] Variants display correctly
- [ ] Supplier panel with key info
- [ ] Action buttons functional
- [ ] Back navigation works

### ✅ Supplier Profiles
- [ ] Company details complete
- [ ] Certifications and capabilities listed
- [ ] Product catalog from supplier
- [ ] Contact options available

### ✅ RFQ Management
- [ ] Create new RFQ
- [ ] Add multiple products
- [ ] All form fields work
- [ ] Validation on required fields
- [ ] Submit successfully
- [ ] View RFQ list (buyer)
- [ ] Receive RFQs (seller)

### ✅ Quotes
- [ ] Submit quotes (seller)
- [ ] View quotes (buyer)
- [ ] Comparison table functional
- [ ] Accept/reject quotes
- [ ] All quote details visible

### ✅ Chat/Messaging
- [ ] Message list loads
- [ ] Send messages
- [ ] Receive messages
- [ ] Attachment icons visible
- [ ] Timestamps correct
- [ ] User status indicators

### ✅ Purchase Orders
- [ ] Create PO from accepted quote
- [ ] All payment methods selectable
- [ ] Deposit calculations correct
- [ ] View PO details
- [ ] PO status updates
- [ ] Order list displays

### ✅ Shipment Tracking
- [ ] Tracking information complete
- [ ] Milestone timeline displays
- [ ] Completed vs pending milestones
- [ ] Document list shows
- [ ] Download/view documents
- [ ] ETA visible

### ✅ Analytics
- [ ] Charts render correctly
- [ ] Data displays for role
- [ ] Filters work (date range)
- [ ] Metrics calculate correctly
- [ ] Visual representation clear

### ✅ Navigation
- [ ] Top navigation bar present
- [ ] All menu items functional
- [ ] User menu works
- [ ] Breadcrumbs (where applicable)
- [ ] Back buttons navigate correctly

---

## Data to Test With

### Mock Credentials
- **Any email/password combination works** for testing
- Example: `buyer@test.com` / `password123`
- Example: `seller@test.com` / `password123`

### Sample Company Names
- **Buyers**: Global Imports Inc, WorldTrade Corp, International Buyers Ltd
- **Sellers**: Premium Manufacturing Co, Export Excellence Ltd, Quality Goods Inc

### Sample Products
The catalog includes products in categories like:
- Electronics (HS Code: 8517.*)
- Textiles & Apparel (HS Code: 6109.*)
- Industrial Machinery
- Consumer Goods
- Raw Materials

### Test Scenarios Data
- **MOQ Range**: Typically 100-1000 units
- **Prices**: $10-$5000 per unit
- **Lead Times**: 15-60 days
- **Common Incoterms**: FOB, CIF, EXW, DDP
- **Payment Terms**: 30% deposit, 50% deposit, full prepayment

---

## Troubleshooting

### If Dashboard Doesn't Load:
- Verify you completed role selection
- Check that a role was properly selected
- Try logging out and back in

### If Navigation Doesn't Work:
- Check that you're logged in
- Verify the navigation bar is visible at top
- Click the logo to return to dashboard

### If Data Doesn't Display:
- The app uses mock data - some features show sample/placeholder data
- Refresh the page if content doesn't load
- Check browser console for any errors

### If Filters Don't Work:
- Clear all filters and try again
- Try one filter at a time
- Ensure filter values are valid (e.g., MOQ range is logical)

---

## Expected Behavior

### Navigation Flow:
```
Login → Role Selection → Dashboard → Feature Pages → Back to Dashboard
```

### Buyer Workflow:
```
Catalog → Product Detail → RFQ Builder → Quote Comparison → 
Purchase Order → Shipment Tracking
```

### Seller Workflow:
```
Dashboard → View RFQ → Submit Quote → View Orders → 
Update Status → Analytics
```

---

## Testing Tips

1. **Test Both Roles**: The full experience requires testing as both Buyer and Seller
2. **Follow Natural Workflow**: Go through the complete trade cycle from discovery to delivery
3. **Try Edge Cases**: Test with unusual inputs, empty states, maximum values
4. **Check Responsiveness**: If testing on desktop, try resizing browser window
5. **Verify Calculations**: Ensure prices, totals, deposits calculate correctly
6. **Test All Navigation Paths**: Use both buttons and menu items to navigate
7. **Check Data Persistence**: Note that data is mock and will reset on page refresh

---

## Known Limitations (MVP)

- 🔄 **Data Persistence**: All data is mock and resets on refresh
- 🌐 **No Backend**: No actual API calls or database
- 💳 **No Payment Processing**: Payment flows are simulated
- 📧 **No Email Notifications**: Email triggers are not functional
- 🔐 **No Real Authentication**: Any credentials work
- 📱 **Document Uploads**: File upload is UI only, files aren't stored
- 🌍 **No Real Tracking**: Shipment tracking uses mock data

---

## Next Steps After Testing

Based on your testing, consider:

1. **Backend Integration**: Connect to real APIs and database
2. **Supabase Setup**: For authentication, data persistence, and real-time features
3. **Payment Gateway**: Integrate Stripe, PayPal, or escrow service
4. **Document Storage**: Implement S3 or similar for file uploads
5. **Email Service**: Add SendGrid or similar for notifications
6. **Real Tracking APIs**: Integrate with shipping carriers
7. **Compliance Checking**: Add automated verification for trade regulations
8. **Mobile App**: Consider React Native version
9. **Advanced Analytics**: Add more business intelligence features
10. **Multi-language**: Support for international users

---

## Feedback & Issues

When testing, document:
- ✅ What works well
- ❌ What doesn't work as expected
- 💡 Suggestions for improvements
- 🐛 Bugs encountered
- 🎨 UI/UX feedback

---

## Quick Start Test Path (5 Minutes)

For a rapid overview of the platform:

1. **Login** with any credentials
2. **Select "Buyer"** role and enter a company name
3. **Click "Browse Catalog"** from dashboard
4. **Click on any product** to view details
5. **Click "Request Quote"** and fill the RFQ form
6. **Submit RFQ** to see quote comparison
7. **Accept a quote** to create purchase order
8. **Navigate to "Analytics"** to see dashboards
9. **Logout** and login again
10. **Select "Seller"** role
11. **View incoming RFQs** on seller dashboard
12. **Click "Submit Quote"** on any RFQ
13. **Check "Active Quotes"** and "Orders" sections

This will give you a complete overview of the buyer-seller interaction flow!

---

**Happy Testing! 🚀**

For questions or issues during testing, refer to the component source code in the `/components` directory.
