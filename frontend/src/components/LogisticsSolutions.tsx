import { PublicNavigation } from './PublicNavigation';

interface LogisticsSolutionsProps {
  onNavigate: (view: string) => void;
}

export function LogisticsSolutions({ onNavigate }: LogisticsSolutionsProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation onNavigate={onNavigate} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Logistics Solutions</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive shipping and freight forwarding services for seamless international trade.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Logistics Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Air Freight</h3>
              <p className="text-gray-600 mb-4">Fast and reliable air cargo services for time-sensitive shipments worldwide.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Express air freight (2-5 days)</li>
                <li>• Standard air freight (5-10 days)</li>
                <li>• Door-to-door delivery</li>
                <li>• Temperature-controlled cargo</li>
                <li>• Dangerous goods handling</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sea Freight</h3>
              <p className="text-gray-600 mb-4">Cost-effective ocean shipping for large volume and bulk cargo.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Full Container Load (FCL)</li>
                <li>• Less than Container Load (LCL)</li>
                <li>• Roll-on/Roll-off (RoRo)</li>
                <li>• Bulk cargo shipping</li>
                <li>• Port-to-port and door-to-door</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Land Transport</h3>
              <p className="text-gray-600 mb-4">Ground transportation for regional and cross-border shipments.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Truck freight (FTL & LTL)</li>
                <li>• Rail freight services</li>
                <li>• Cross-border trucking</li>
                <li>• Last-mile delivery</li>
                <li>• Warehousing and distribution</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customs Brokerage</h3>
              <p className="text-gray-600 mb-4">Expert customs clearance and documentation services.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Import/export documentation</li>
                <li>• Tariff classification</li>
                <li>• Duty calculation and payment</li>
                <li>• Regulatory compliance</li>
                <li>• Trade agreement utilization</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Freight Insurance</h3>
              <p className="text-gray-600 mb-4">Comprehensive cargo insurance for all shipping methods.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• All-risk coverage</li>
                <li>• Marine cargo insurance</li>
                <li>• Air cargo insurance</li>
                <li>• Door-to-door coverage</li>
                <li>• Claims assistance</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Warehousing</h3>
              <p className="text-gray-600 mb-4">Secure storage and inventory management solutions.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Short-term and long-term storage</li>
                <li>• Climate-controlled facilities</li>
                <li>• Inventory management</li>
                <li>• Pick and pack services</li>
                <li>• Cross-docking</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Process</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quote Request</h3>
                <p className="text-gray-600">Submit your shipping requirements including origin, destination, cargo details, and preferred delivery date.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rate Comparison</h3>
                <p className="text-gray-600">Receive competitive quotes from multiple carriers and freight forwarders. Compare rates, transit times, and services.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Confirmation</h3>
                <p className="text-gray-600">Select your preferred option and confirm the booking. We'll arrange pickup and provide shipping instructions.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Documentation</h3>
                <p className="text-gray-600">We handle all necessary paperwork including commercial invoice, packing list, certificates, and customs documents.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">5</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tracking & Updates</h3>
                <p className="text-gray-600">Monitor your shipment in real-time with our tracking system. Receive notifications at each milestone.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">6</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery</h3>
                <p className="text-gray-600">Your cargo is cleared through customs and delivered to the final destination. We provide proof of delivery.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Our Logistics Services?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Global Network</h3>
                  <p className="text-sm text-gray-600">Partners in over 200 countries and territories</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Competitive Rates</h3>
                  <p className="text-sm text-gray-600">Volume discounts and negotiated carrier rates</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Expert Support</h3>
                  <p className="text-sm text-gray-600">Dedicated logistics specialists for your shipments</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Real-Time Tracking</h3>
                  <p className="text-sm text-gray-600">24/7 visibility of your cargo location and status</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Customs Expertise</h3>
                  <p className="text-sm text-gray-600">Smooth clearance with experienced brokers</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Guidelines</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Packaging Requirements</h3>
                <p className="text-sm text-gray-600">Proper packaging is essential to prevent damage. Use sturdy boxes, adequate cushioning, and weatherproof materials for international shipments.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Labeling Standards</h3>
                <p className="text-sm text-gray-600">All packages must have clear shipping labels with complete address, contact information, and handling instructions.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Prohibited Items</h3>
                <p className="text-sm text-gray-600">Certain items cannot be shipped internationally. Check our prohibited items list before booking.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
                <p className="text-sm text-gray-600">Accurate commercial invoices, packing lists, and certificates of origin are required for customs clearance.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Shipping Assistance?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our logistics experts are ready to help you find the best shipping solution for your business.
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Shipping Quote
          </button>
        </div>
      </div>
    </div>
  );
}
