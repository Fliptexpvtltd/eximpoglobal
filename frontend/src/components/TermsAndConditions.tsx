import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="bg-blue-800 text-white p-8 -mx-6 -mt-6 mb-8">
        <h1 className="text-3xl font-bold">Terms and Conditions</h1>
        <p className="text-blue-100 mt-2">Eximpo Global</p>
      </div>

      <p className="text-gray-600 italic mb-6">Last Updated: March 9, 2026</p>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">1. Agreement to Terms</h2>
        <p className="text-gray-700">
          By accessing or using Eximpo Global's mobile application and website (collectively, the "Platform"), you agree to be bound
          by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our Platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">2. Description of Services</h2>
        <p className="text-gray-700 mb-3">Eximpo Global provides a B2B (Business-to-Business) marketplace platform that enables:</p>
        <ul className="list-disc ml-8 mb-4 text-gray-700 space-y-2">
          <li>Product listing and catalog management</li>
          <li>Request for Quotation (RFQ) submission and response</li>
          <li>Quote comparison and negotiation</li>
          <li>Order placement and payment processing</li>
          <li>Business communication and collaboration</li>
          <li>Shipment tracking and logistics coordination</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">3. User Accounts</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Registration</h3>
        <p className="text-gray-700 mb-3">To use our Platform, you must:</p>
        <ul className="list-disc ml-8 mb-4 text-gray-700 space-y-2">
          <li>Be at least 18 years of age</li>
          <li>Represent a legitimate business entity</li>
          <li>Provide accurate and complete registration information</li>
          <li>Maintain the security of your account credentials</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Account Types</h3>
        <ul className="list-disc ml-8 mb-4 text-gray-700 space-y-2">
          <li><strong>Buyer Account:</strong> For businesses seeking to purchase products</li>
          <li><strong>Seller Account:</strong> For businesses offering products and services</li>
          <li><strong>Admin Account:</strong> For platform administrators (by invitation only)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Account Responsibility</h3>
        <p className="text-gray-700">
          You are responsible for all activities that occur under your account. You must notify us immediately of any unauthorized
          access or security breach.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">4. User Conduct</h2>
        <p className="text-gray-700 mb-3">You agree NOT to:</p>
        <ul className="list-disc ml-8 mb-4 text-gray-700 space-y-2">
          <li>Provide false, misleading, or fraudulent information</li>
          <li>Impersonate another person or entity</li>
          <li>Engage in any illegal or unauthorized activities</li>
          <li>Upload harmful content (viruses, malware, etc.)</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Scrape or collect data without permission</li>
          <li>Interfere with the Platform's operation</li>
          <li>Violate intellectual property rights</li>
          <li>Create multiple accounts for fraudulent purposes</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">5. Product Listings and Content</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Seller Responsibilities</h3>
        <p className="text-gray-700 mb-3">Sellers must:</p>
        <ul className="list-disc ml-8 mb-4 text-gray-700 space-y-2">
          <li>Provide accurate product descriptions and specifications</li>
          <li>Use genuine product images or clearly mark stock photos</li>
          <li>Maintain accurate pricing and availability information</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Honor accepted quotes and approved orders</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Prohibited Products</h3>
        <p className="text-gray-700 mb-3">The following products are prohibited:</p>
        <ul className="list-disc ml-8 mb-4 text-gray-700 space-y-2">
          <li>Illegal goods or services</li>
          <li>Counterfeit or stolen items</li>
          <li>Hazardous materials without proper documentation</li>
          <li>Items that violate intellectual property rights</li>
          <li>Restricted items without necessary licenses</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">6. RFQ and Quoting Process</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 RFQ Submissions</h3>
        <p className="text-gray-700 mb-4">
          Buyers can submit RFQs with detailed product requirements. RFQs do not constitute binding orders.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Quotes</h3>
        <p className="text-gray-700 mb-4">
          Sellers can respond with quotes that include pricing, delivery terms, and conditions. Quotes are valid for the period
          specified by the seller.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 No Guarantee</h3>
        <p className="text-gray-700">
          We do not guarantee that any RFQ will receive quotes or that any quote will be accepted.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">7. Orders and Payments</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Order Placement</h3>
        <p className="text-gray-700 mb-4">
          Orders are placed when buyers accept a quote and complete the payment process. All sales are subject to seller confirmation.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 Payment Processing</h3>
        <p className="text-gray-700 mb-4">
          Payments are processed securely through our payment provider Razorpay. By making a payment, you agree to Razorpay's
          terms and conditions.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">7.3 Pricing and Fees</h3>
        <ul className="list-disc ml-8 mb-4 text-gray-700 space-y-2">
          <li>All prices are as stated in accepted quotes</li>
          <li>Platform fees (if any) will be clearly disclosed</li>
          <li>Shipping and taxes are additional unless otherwise stated</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">7.4 Refunds and Cancellations</h3>
        <p className="text-gray-700">
          Refund and cancellation policies are determined by individual sellers. Disputes should be resolved directly between buyers
          and sellers, with platform mediation available if needed.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">8. Shipping and Delivery</h2>
        <p className="text-gray-700">
          Shipping terms and delivery timelines are agreed upon between buyers and sellers. We facilitate but do not guarantee delivery.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">9. Intellectual Property</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 Platform Content</h3>
        <p className="text-gray-700 mb-4">
          All content on the Platform (logos, trademarks, design, code) is owned by Eximpo Global and protected by intellectual
          property laws.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 User Content</h3>
        <p className="text-gray-700 mb-4">
          You retain ownership of content you upload but grant us a license to use, display, and distribute it on the Platform.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">9.3 Copyright Infringement</h3>
        <p className="text-gray-700">
          We respect intellectual property rights. If you believe your content has been infringed, contact us at legal@eximpoglobal.net.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">10. Disclaimers and Limitations of Liability</h2>
        
        <div className="bg-yellow-50 p-4 border-l-4 border-yellow-500 mb-4">
          <p className="text-gray-700 font-semibold">
            IMPORTANT: The Platform is provided "AS IS" and "AS AVAILABLE" without warranties of any kind.
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">10.1 No Warranty</h3>
        <p className="text-gray-700 mb-3">We do not warrant that:</p>
        <ul className="list-disc ml-8 mb-4 text-gray-700 space-y-2">
          <li>The Platform will be uninterrupted or error-free</li>
          <li>Defects will be corrected</li>
          <li>The Platform is free from viruses or harmful components</li>
          <li>Results from using the Platform will meet your requirements</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">10.2 Third-Party Transactions</h3>
        <p className="text-gray-700 mb-3">We are a marketplace platform. We do not control and are not responsible for:</p>
        <ul className="list-disc ml-8 mb-4 text-gray-700 space-y-2">
          <li>The quality, safety, or legality of products listed</li>
          <li>The accuracy of product descriptions</li>
          <li>The ability of sellers to fulfill orders</li>
          <li>The ability of buyers to complete payments</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">10.3 Limitation of Liability</h3>
        <p className="text-gray-700">
          To the maximum extent permitted by law, Eximpo Global shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, including loss of profits, data, or business opportunities.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">11. Indemnification</h2>
        <p className="text-gray-700 mb-3">
          You agree to indemnify and hold harmless Eximpo Global, its officers, directors, employees, and agents from any claims,
          damages, losses, or expenses arising from:
        </p>
        <ul className="list-disc ml-8 mb-4 text-gray-700 space-y-2">
          <li>Your use of the Platform</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any rights of another party</li>
          <li>Your user-generated content</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">12. Termination</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">12.1 By You</h3>
        <p className="text-gray-700 mb-4">
          You may terminate your account at any time by contacting us or using the account deletion feature.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">12.2 By Us</h3>
        <p className="text-gray-700 mb-3">We may suspend or terminate your account if:</p>
        <ul className="list-disc ml-8 mb-4 text-gray-700 space-y-2">
          <li>You violate these Terms</li>
          <li>We suspect fraudulent or illegal activity</li>
          <li>We discontinue the Platform</li>
          <li>Required by law</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">12.3 Effect of Termination</h3>
        <p className="text-gray-700">
          Upon termination, your right to use the Platform ceases. Provisions that should survive termination will remain in effect.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">13. Dispute Resolution</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">13.1 User Disputes</h3>
        <p className="text-gray-700 mb-4">
          Disputes between users should be resolved directly. We may provide mediation services but are not obligated to do so.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">13.2 Governing Law</h3>
        <p className="text-gray-700 mb-4">
          These Terms are governed by applicable laws. Any disputes shall be resolved in the appropriate jurisdiction.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">13.3 Arbitration</h3>
        <p className="text-gray-700">
          Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration, except
          where prohibited by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">14. Privacy</h2>
        <p className="text-gray-700">
          Your use of the Platform is also governed by our Privacy Policy. Please review it at{' '}
          <a href="/privacy-policy.html" className="text-blue-800 hover:underline">Privacy Policy</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">15. Changes to Terms</h2>
        <p className="text-gray-700 mb-3">We may modify these Terms at any time. We will notify users of significant changes by:</p>
        <ul className="list-disc ml-8 mb-4 text-gray-700 space-y-2">
          <li>Posting the updated Terms on the Platform</li>
          <li>Sending email notifications to registered users</li>
          <li>Displaying in-app notifications</li>
        </ul>
        <p className="text-gray-700">
          Continued use of the Platform after changes constitutes acceptance of the modified Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">16. General Provisions</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">16.1 Entire Agreement</h3>
        <p className="text-gray-700 mb-4">
          These Terms constitute the entire agreement between you and Eximpo Global regarding the Platform.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">16.2 Severability</h3>
        <p className="text-gray-700 mb-4">
          If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in effect.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">16.3 Waiver</h3>
        <p className="text-gray-700 mb-4">
          Failure to enforce any provision does not constitute a waiver of that provision.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">16.4 Assignment</h3>
        <p className="text-gray-700">
          You may not assign these Terms without our consent. We may assign these Terms without restriction.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">17. Contact Information</h2>
        <div className="bg-blue-50 p-6 border-l-4 border-blue-800">
          <p className="text-gray-700 mb-2">For questions about these Terms, contact us:</p>
          <p className="text-gray-700"><strong>Eximpo Global</strong></p>
          <p className="text-gray-700">Email: <a href="mailto:legal@eximpoglobal.net" className="text-blue-800 hover:underline">legal@eximpoglobal.net</a></p>
          <p className="text-gray-700">Email: <a href="mailto:support@eximpoglobal.net" className="text-blue-800 hover:underline">support@eximpoglobal.net</a></p>
          <p className="text-gray-700">Website: <a href="https://eximpoglobal.net" className="text-blue-800 hover:underline">https://eximpoglobal.net</a></p>
        </div>
      </section>

      <div className="border-t border-gray-200 pt-6 mt-8">
        <p className="text-center text-gray-600 text-sm">
          © 2026 Eximpo Global. All rights reserved.<br />
          By using our Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
