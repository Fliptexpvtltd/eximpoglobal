import { PublicNavigation } from './PublicNavigation';

interface CustomsClearanceProps {
  onNavigate: (view: string) => void;
}

export function CustomsClearance({ onNavigate }: CustomsClearanceProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation onNavigate={onNavigate} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customs Clearance Services</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Expert customs brokerage services to ensure smooth and compliant import/export clearance worldwide.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Import Clearance</h3>
              <p className="text-gray-600 mb-4">Complete import customs clearance for goods arriving in your country.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• HS code classification</li>
                <li>• Duty and tax calculation</li>
                <li>• Import permit processing</li>
                <li>• Customs declaration filing</li>
                <li>• Release and delivery coordination</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Export Clearance</h3>
              <p className="text-gray-600 mb-4">Efficient export customs procedures for outbound shipments.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Export license applications</li>
                <li>• Certificate of origin</li>
                <li>• Export declaration</li>
                <li>• Shipping bill preparation</li>
                <li>• Regulatory compliance</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Documentation</h3>
              <p className="text-gray-600 mb-4">Comprehensive documentation services for customs compliance.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Commercial invoice preparation</li>
                <li>• Packing list and BOL</li>
                <li>• Certificate of conformity</li>
                <li>• Import/export licenses</li>
                <li>• SONCAP, PVOC, COC certificates</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tariff Classification</h3>
              <p className="text-gray-600 mb-4">Accurate HS code determination for proper duty assessment.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• HS code research and validation</li>
                <li>• Tariff rate determination</li>
                <li>• Trade agreement utilization</li>
                <li>• Duty optimization strategies</li>
                <li>• Classification ruling support</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Duty & Tax Management</h3>
              <p className="text-gray-600 mb-4">Minimize costs with strategic duty and tax planning.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Duty calculation and payment</li>
                <li>• VAT and GST handling</li>
                <li>• Preferential tariff programs</li>
                <li>• Duty drawback claims</li>
                <li>• Bonded warehouse solutions</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compliance Consulting</h3>
              <p className="text-gray-600 mb-4">Stay compliant with ever-changing trade regulations.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Regulatory compliance review</li>
                <li>• Trade sanctions screening</li>
                <li>• Product restriction analysis</li>
                <li>• Record keeping requirements</li>
                <li>• Audit preparation support</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customs Clearance Process</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipment Notification</h3>
                <p className="text-gray-600">Notify us of your incoming or outgoing shipment with details including bill of lading, commercial invoice, and packing list.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Review</h3>
                <p className="text-gray-600">Our customs specialists review all documentation for accuracy and completeness. We identify any missing documents or discrepancies.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Classification & Valuation</h3>
                <p className="text-gray-600">We determine the correct HS code, calculate applicable duties and taxes, and identify any preferential tariff opportunities.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Declaration Filing</h3>
                <p className="text-gray-600">Submit the customs declaration electronically to customs authorities. This includes all required certifications and permits.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">5</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Duty Payment</h3>
                <p className="text-gray-600">Pay applicable customs duties, taxes, and fees on your behalf or arrange for direct payment by you.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">6</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Inspection Support</h3>
                <p className="text-gray-600">If customs requires physical inspection, we coordinate the examination and address any queries from officials.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">7</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Release & Delivery</h3>
                <p className="text-gray-600">Once cleared, arrange for cargo release and coordinate with freight forwarders for final delivery to your specified location.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Documents</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">For Import</h3>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Bill of Lading (B/L) or Airway Bill (AWB)</li>
                  <li>• Commercial Invoice</li>
                  <li>• Packing List</li>
                  <li>• Certificate of Origin</li>
                  <li>• Import License (if required)</li>
                  <li>• Insurance Certificate</li>
                  <li>• MSDS for hazardous goods</li>
                  <li>• Product certificates (CE, FDA, etc.)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">For Export</h3>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Shipping Bill</li>
                  <li>• Commercial Invoice</li>
                  <li>• Packing List</li>
                  <li>• Export License (if required)</li>
                  <li>• Certificate of Origin</li>
                  <li>• Letter of Credit or Bank Receipt</li>
                  <li>• Transport documents</li>
                  <li>• Product-specific certificates</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Challenges We Solve</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Document Errors</h3>
                  <p className="text-sm text-gray-600">Incorrect or incomplete paperwork causing delays</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Classification Issues</h3>
                  <p className="text-sm text-gray-600">Wrong HS codes leading to incorrect duties</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Regulatory Non-Compliance</h3>
                  <p className="text-sm text-gray-600">Missing permits or certificates required by law</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Valuation Disputes</h3>
                  <p className="text-sm text-gray-600">Disagreements on declared value with customs</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Clearance Delays</h3>
                  <p className="text-sm text-gray-600">Extended processing times affecting delivery schedules</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Unexpected Costs</h3>
                  <p className="text-sm text-gray-600">Surprise duties, taxes, or penalty fees</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Country-Specific Expertise</h2>
          <p className="text-gray-600 mb-6">We have in-depth knowledge of customs regulations and procedures in major trading countries:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded p-4 text-center">
              <h4 className="font-semibold text-gray-900">United States</h4>
              <p className="text-xs text-gray-600 mt-1">CBP, FDA, USDA regulations</p>
            </div>
            <div className="border border-gray-200 rounded p-4 text-center">
              <h4 className="font-semibold text-gray-900">European Union</h4>
              <p className="text-xs text-gray-600 mt-1">Union Customs Code, CE marking</p>
            </div>
            <div className="border border-gray-200 rounded p-4 text-center">
              <h4 className="font-semibold text-gray-900">China</h4>
              <p className="text-xs text-gray-600 mt-1">GACC, CCC certification</p>
            </div>
            <div className="border border-gray-200 rounded p-4 text-center">
              <h4 className="font-semibold text-gray-900">India</h4>
              <p className="text-xs text-gray-600 mt-1">DGFT, GST, IEC requirements</p>
            </div>
            <div className="border border-gray-200 rounded p-4 text-center">
              <h4 className="font-semibold text-gray-900">United Kingdom</h4>
              <p className="text-xs text-gray-600 mt-1">HMRC, UKCA marking</p>
            </div>
            <div className="border border-gray-200 rounded p-4 text-center">
              <h4 className="font-semibold text-gray-900">Middle East</h4>
              <p className="text-xs text-gray-600 mt-1">GCC customs, Halal certification</p>
            </div>
            <div className="border border-gray-200 rounded p-4 text-center">
              <h4 className="font-semibold text-gray-900">Africa</h4>
              <p className="text-xs text-gray-600 mt-1">SONCAP, PVOC, COC programs</p>
            </div>
            <div className="border border-gray-200 rounded p-4 text-center">
              <h4 className="font-semibold text-gray-900">ASEAN</h4>
              <p className="text-xs text-gray-600 mt-1">ATIGA, Form D, Form E</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Simplify Your Customs Clearance</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Let our customs experts handle the complexities while you focus on your business.
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
