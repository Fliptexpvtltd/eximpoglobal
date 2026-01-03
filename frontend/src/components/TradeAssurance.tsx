import { PublicNavigation } from './PublicNavigation';

interface TradeAssuranceProps {
  onNavigate: (view: string) => void;
}

export function TradeAssurance({ onNavigate }: TradeAssuranceProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation onNavigate={onNavigate} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Trade Assurance</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Shop with confidence. Our Trade Assurance program protects your orders from payment to delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">For Buyers</h2>
            <p className="text-gray-600 mb-6">
              Trade Assurance protects your payments and ensures you receive quality products on time.
            </p>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Payment Protection</h3>
                <p className="text-gray-600 text-sm">Your payment is held securely until you confirm delivery</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Quality Guarantee</h3>
                <p className="text-gray-600 text-sm">Products must match agreed specifications and quality standards</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">On-Time Delivery</h3>
                <p className="text-gray-600 text-sm">Sellers must ship within the agreed timeframe or face penalties</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Refund Coverage</h3>
                <p className="text-gray-600 text-sm">Get a full or partial refund if terms are not met</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">For Sellers</h2>
            <p className="text-gray-600 mb-6">
              Build trust with buyers and increase your sales by offering Trade Assurance protection.
            </p>
            <div className="space-y-4">
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Increased Trust</h3>
                <p className="text-gray-600 text-sm">Buyers prefer suppliers offering Trade Assurance protection</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Higher Visibility</h3>
                <p className="text-gray-600 text-sm">Trade Assurance orders appear higher in search results</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Fast Payment</h3>
                <p className="text-gray-600 text-sm">Receive payment quickly after successful delivery confirmation</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-1">Fair Protection</h3>
                <p className="text-gray-600 text-sm">Protection against fraudulent disputes and chargebacks</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Place Order</h3>
              <p className="text-sm text-gray-600">Select Trade Assurance when placing your order</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">Your payment is held securely by EximpoGlobal</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Shipment & Delivery</h3>
              <p className="text-sm text-gray-600">Supplier ships your order with tracking</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Confirm & Release</h3>
              <p className="text-sm text-gray-600">Confirm receipt and payment is released to supplier</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Coverage Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Covered</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Product quality does not match agreed specifications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Products arrive damaged during shipping</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Wrong products or quantities delivered</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Shipment delay beyond agreed timeframe</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Failure to ship after payment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Products fail inspection by third party</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Not Covered</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Changes to order specifications after agreement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Buyer refuses delivery without valid reason</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Disputes filed after coverage period expires</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Damage caused by buyer after delivery</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Natural disasters or force majeure events</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <span>Customs delays or duties (unless agreed otherwise)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Filing a Claim</h2>
          <div className="space-y-4 text-gray-700">
            <p>If you need to file a claim under Trade Assurance:</p>
            <ol className="list-decimal list-inside space-y-3 ml-4">
              <li>Contact the supplier first to resolve the issue directly</li>
              <li>If unresolved, file a dispute through your order dashboard within 15 days of delivery</li>
              <li>Provide evidence including photos, videos, inspection reports, or correspondence</li>
              <li>Our mediation team will review your claim within 3-5 business days</li>
              <li>Both parties may be asked to provide additional documentation</li>
              <li>A resolution decision will be issued within 10 business days</li>
              <li>Approved refunds are processed within 5-7 business days</li>
            </ol>
            <p className="mt-6 text-sm text-gray-600">
              Note: Filing false or fraudulent claims may result in account suspension and legal action.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Trade with Confidence?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of businesses using Trade Assurance for secure international transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('catalog')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
            <button
              onClick={() => onNavigate('auth')}
              className="px-8 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Become a Supplier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
