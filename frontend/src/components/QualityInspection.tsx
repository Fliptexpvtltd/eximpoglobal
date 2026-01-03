import { PublicNavigation } from './PublicNavigation';

interface QualityInspectionProps {
  onNavigate: (view: string) => void;
}

export function QualityInspection({ onNavigate }: QualityInspectionProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation onNavigate={onNavigate} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Quality Inspection Services</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Professional third-party inspection services to ensure your products meet quality standards before shipment.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Inspection Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pre-Production Inspection</h3>
              <p className="text-gray-600 mb-4">Verify materials, components, and production setup before manufacturing begins.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Raw material verification</li>
                <li>• Component quality check</li>
                <li>• Production capacity assessment</li>
                <li>• Sample approval</li>
                <li>• Timeline confirmation</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">During Production Inspection</h3>
              <p className="text-gray-600 mb-4">Monitor production progress and quality at the manufacturing facility.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Production progress check</li>
                <li>• Quality control verification</li>
                <li>• Workmanship assessment</li>
                <li>• Identify issues early</li>
                <li>• Production timeline tracking</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pre-Shipment Inspection</h3>
              <p className="text-gray-600 mb-4">Final quality check when production is 80-100% complete and ready for shipment.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Visual inspection of finished goods</li>
                <li>• Functionality testing</li>
                <li>• Specification verification</li>
                <li>• Packaging and labeling check</li>
                <li>• Quantity confirmation</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Container Loading Inspection</h3>
              <p className="text-gray-600 mb-4">Supervise loading process to ensure proper handling and container security.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Container condition check</li>
                <li>• Loading supervision</li>
                <li>• Proper stacking and securing</li>
                <li>• Carton count verification</li>
                <li>• Seal and documentation</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Product Testing</h3>
              <p className="text-gray-600 mb-4">Specialized laboratory testing for product performance and safety compliance.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Performance testing</li>
                <li>• Safety compliance testing</li>
                <li>• Chemical analysis</li>
                <li>• Durability testing</li>
                <li>• Certification support</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Factory Audit</h3>
              <p className="text-gray-600 mb-4">Comprehensive assessment of supplier facilities, processes, and capabilities.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Production capability review</li>
                <li>• Quality management system</li>
                <li>• Social compliance audit</li>
                <li>• Safety and environment</li>
                <li>• Supplier risk assessment</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Inspection Process</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Inspection</h3>
                <p className="text-gray-600">Submit your inspection request with product details, supplier information, and inspection requirements at least 48 hours before the desired date.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Inspector Assignment</h3>
                <p className="text-gray-600">We assign a qualified inspector with relevant industry experience and certifications to your case.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">On-Site Inspection</h3>
                <p className="text-gray-600">Our inspector visits the factory and conducts a thorough examination based on your specifications and international standards.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Report</h3>
                <p className="text-gray-600">Receive a comprehensive inspection report within 24 hours, including photos, test results, and pass/fail verdict.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">5</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Decision Support</h3>
                <p className="text-gray-600">Use the report to make informed decisions about proceeding with shipment, requesting corrections, or canceling the order.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Check</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Product Quality</h3>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Appearance and finish</li>
                  <li>• Workmanship and construction</li>
                  <li>• Material quality</li>
                  <li>• Color consistency</li>
                  <li>• Size and dimensions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Functionality</h3>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Performance testing</li>
                  <li>• Safety features</li>
                  <li>• Durability assessment</li>
                  <li>• Operating instructions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Packaging</h3>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Package integrity</li>
                  <li>• Labeling accuracy</li>
                  <li>• Barcode verification</li>
                  <li>• Shipping marks</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Compliance</h3>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Specification match</li>
                  <li>• Regulatory requirements</li>
                  <li>• Certification verification</li>
                  <li>• Quantity confirmation</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quality Standards</h2>
            <p className="text-gray-600 mb-4">Our inspections follow internationally recognized standards:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <h3 className="font-semibold text-gray-900">AQL (Acceptable Quality Level)</h3>
                  <p className="text-sm text-gray-600">Statistical sampling method for defect assessment</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <h3 className="font-semibold text-gray-900">ISO Standards</h3>
                  <p className="text-sm text-gray-600">ISO 9001 quality management and ISO 2859 sampling</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Industry Specific</h3>
                  <p className="text-sm text-gray-600">ASTM, CE, FDA, FCC, and other regulatory standards</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Custom Requirements</h3>
                  <p className="text-sm text-gray-600">Your specific quality criteria and acceptance levels</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ensure Quality Before Shipment</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Avoid costly mistakes and protect your business with professional quality inspection services.
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Book Inspection
          </button>
        </div>
      </div>
    </div>
  );
}
