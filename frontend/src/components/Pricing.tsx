import { PublicNavigation } from './PublicNavigation';

interface PricingProps {
  onNavigate: (view: string) => void;
}

export function Pricing({ onNavigate }: PricingProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation onNavigate={onNavigate} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Contact us for customized pricing based on your business needs.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Custom Pricing</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We offer flexible pricing plans tailored to your business size and requirements. 
            Contact our sales team for a personalized quote.
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Contact Sales
          </button>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, bank transfers, and PayPal for international transactions.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h3>
              <p className="text-gray-600">No, there are no setup fees. You only pay for your chosen plan.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 30-day money-back guarantee for all paid plans if you're not satisfied.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
