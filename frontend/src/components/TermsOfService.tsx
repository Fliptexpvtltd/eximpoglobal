import { PublicNavigation } from './PublicNavigation';

interface TermsOfServiceProps {
  onNavigate: (view: string) => void;
}

export function TermsOfService({ onNavigate }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation onNavigate={onNavigate} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: January 3, 2026</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using EximpoGlobal's platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you may not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use our platform, you must:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Represent a legitimate business entity</li>
              <li>Have the authority to bind your business to these terms</li>
              <li>Provide accurate and complete registration information</li>
              <li>Not be prohibited from using our services under applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration and Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you create an account:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You must provide accurate and current business information</li>
              <li>You are responsible for maintaining account confidentiality</li>
              <li>You are responsible for all activities under your account</li>
              <li>You must notify us immediately of unauthorized access</li>
              <li>We reserve the right to suspend or terminate accounts that violate our terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Post false, misleading, or fraudulent information</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Engage in spam, harassment, or abusive behavior</li>
              <li>Attempt to circumvent platform fees or payments</li>
              <li>Use automated systems to access or scrape content</li>
              <li>Sell prohibited, illegal, or counterfeit goods</li>
              <li>Manipulate reviews, ratings, or search rankings</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Buyer Obligations</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a buyer, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide accurate specifications in RFQs</li>
              <li>Honor accepted quotes and purchase orders</li>
              <li>Make timely payments according to agreed terms</li>
              <li>Communicate clearly and professionally with suppliers</li>
              <li>Review products promptly upon receipt</li>
              <li>Report disputes within specified timeframes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Seller Obligations</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a seller, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide accurate product descriptions and images</li>
              <li>Honor quoted prices and delivery timeframes</li>
              <li>Ship products that match specifications</li>
              <li>Provide accurate tracking and shipment information</li>
              <li>Respond to buyer inquiries within 24 hours</li>
              <li>Maintain appropriate business licenses and certifications</li>
              <li>Comply with export laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Product Listings</h2>
            <p className="text-gray-700 leading-relaxed">
              Sellers retain ownership of their product listings and content. By posting content, you grant EximpoGlobal a worldwide, non-exclusive license to display, reproduce, and distribute your content on our platform. We reserve the right to remove listings that violate our policies or applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Transactions and Payments</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              EximpoGlobal facilitates connections between buyers and sellers but is not a party to transactions. Payment terms are negotiated between parties. We may offer payment processing services subject to additional terms. Platform fees, if applicable, are outlined in your subscription plan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Trade Assurance Program</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Trade Assurance program provides protection for eligible transactions. Terms and coverage limits are specified in separate Trade Assurance agreements. Not all transactions qualify for coverage. Filing deadlines and documentation requirements apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The EximpoGlobal platform, including all content, features, and functionality, is owned by Eximpo Global LLP and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of our platform without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If a dispute arises between users:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Parties should first attempt to resolve issues directly</li>
              <li>Users may request mediation through our dispute resolution team</li>
              <li>Our decisions in mediation are advisory, not binding</li>
              <li>Legal action must be filed within applicable limitation periods</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Disclaimers and Limitations</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our platform is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>The accuracy or reliability of user-generated content</li>
              <li>Uninterrupted or error-free service</li>
              <li>The quality, safety, or legality of products</li>
              <li>The truth or accuracy of supplier claims</li>
              <li>That transactions will be completed successfully</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To the fullest extent permitted by law, EximpoGlobal is not liable for indirect, incidental, consequential, or punitive damages arising from your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless EximpoGlobal, its affiliates, and their respective officers, directors, employees, and agents from any claims, losses, damages, liabilities, and expenses arising from your use of the platform, your violation of these terms, or your violation of any rights of another party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              We may suspend or terminate your account at any time for violation of these terms, fraudulent activity, or other reasons we deem appropriate. Upon termination, your right to use the platform ceases immediately. Provisions that should survive termination will remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may modify these terms at any time. We will provide notice of material changes by email or through the platform. Your continued use after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              For questions about these Terms of Service:
            </p>
            <div className="text-gray-700 space-y-1 ml-4">
              <p><strong>Email:</strong> legal@eximpoglobal.net</p>
              <p><strong>Phone:</strong> +91 7386663696</p>
              <p><strong>Address:</strong> Eximpo Global LLP, H No: 6-640/1/2, Vimanapuri Colony, Quthbullapur, Hyderabad, Telangana - 500055, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
