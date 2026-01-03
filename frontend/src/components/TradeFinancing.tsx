import { PublicNavigation } from './PublicNavigation';

interface TradeFinancingProps {
  onNavigate: (view: string) => void;
}

export function TradeFinancing({ onNavigate }: TradeFinancingProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation onNavigate={onNavigate} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Trade Financing Solutions</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Flexible financing options to help you grow your international trade business with confidence.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Financing Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Letters of Credit (LC)</h3>
              <p className="text-gray-600 mb-4">Secure payment method guaranteed by banks for international transactions.</p>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li>• Payment security for both parties</li>
                <li>• Confirmed and unconfirmed LC</li>
                <li>• Sight and usance LC options</li>
                <li>• Transferable LC available</li>
                <li>• Compliance with UCP 600 rules</li>
              </ul>
              <p className="text-sm text-gray-600">Best for: Large transactions, new trading relationships, high-value goods</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trade Credit Insurance</h3>
              <p className="text-gray-600 mb-4">Protection against buyer default and non-payment risks.</p>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li>• Protection against buyer insolvency</li>
                <li>• Political risk coverage</li>
                <li>• Country risk protection</li>
                <li>• Pre-shipment and post-shipment</li>
                <li>• Credit limit management</li>
              </ul>
              <p className="text-sm text-gray-600">Best for: Businesses selling on open account terms, emerging markets</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Purchase Order Financing</h3>
              <p className="text-gray-600 mb-4">Fund your inventory purchases based on confirmed buyer orders.</p>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li>• Up to 100% advance funding</li>
                <li>• Fast approval process</li>
                <li>• No collateral required</li>
                <li>• Flexible repayment terms</li>
                <li>• Supports order fulfillment</li>
              </ul>
              <p className="text-sm text-gray-600">Best for: Businesses with confirmed orders but limited working capital</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Invoice Financing</h3>
              <p className="text-gray-600 mb-4">Get immediate cash flow by financing your outstanding invoices.</p>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li>• Advance up to 90% of invoice value</li>
                <li>• Quick funding within 24-48 hours</li>
                <li>• Improve cash flow</li>
                <li>• Retain customer relationships</li>
                <li>• Confidential factoring available</li>
              </ul>
              <p className="text-sm text-gray-600">Best for: B2B companies with payment terms of 30-90 days</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Supply Chain Financing</h3>
              <p className="text-gray-600 mb-4">Optimize working capital across your entire supply chain.</p>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li>• Early payment for suppliers</li>
                <li>• Extended payment terms for buyers</li>
                <li>• Lower financing costs</li>
                <li>• Strengthen supplier relationships</li>
                <li>• Electronic approval process</li>
              </ul>
              <p className="text-sm text-gray-600">Best for: Large buyers with multiple suppliers, established supply chains</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Export Working Capital Loans</h3>
              <p className="text-gray-600 mb-4">Short-term loans to finance export production and inventory.</p>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li>• Competitive interest rates</li>
                <li>• Flexible loan amounts</li>
                <li>• 6-12 month terms typical</li>
                <li>• Support multiple orders</li>
                <li>• Government-backed options</li>
              </ul>
              <p className="text-sm text-gray-600">Best for: Exporters needing funds for production and inventory</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How Trade Financing Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Application</h3>
                <p className="text-gray-600">Submit your financing application with business details, trade documents, and financing requirements. Most applications are reviewed within 24-48 hours.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Credit Assessment</h3>
                <p className="text-gray-600">Our finance team evaluates your creditworthiness, trade history, buyer/supplier relationships, and transaction details.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Approval & Terms</h3>
                <p className="text-gray-600">Receive financing approval with clear terms including rates, fees, repayment schedule, and any collateral requirements.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Funding</h3>
                <p className="text-gray-600">Once you accept the terms, funds are disbursed quickly—often within 1-3 business days depending on the financing type.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">5</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Repayment</h3>
                <p className="text-gray-600">Repay according to the agreed schedule. For invoice financing, payment is made when your customer pays. For loans, follow the installment plan.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Trade Financing</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Improved Cash Flow</h3>
                  <p className="text-sm text-gray-600">Access working capital without waiting for customer payments</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Business Growth</h3>
                  <p className="text-sm text-gray-600">Accept larger orders and enter new markets with confidence</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Risk Mitigation</h3>
                  <p className="text-sm text-gray-600">Protection against payment defaults and market risks</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Competitive Terms</h3>
                  <p className="text-sm text-gray-600">Offer better payment terms to customers and suppliers</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Fast Processing</h3>
                  <p className="text-sm text-gray-600">Quick approval and funding to seize time-sensitive opportunities</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Eligibility Requirements</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">For Buyers</h3>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Registered business entity</li>
                  <li>• Minimum 6 months trading history</li>
                  <li>• Good credit rating</li>
                  <li>• Valid purchase orders or contracts</li>
                  <li>• Creditworthy suppliers</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">For Sellers</h3>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Active business operations</li>
                  <li>• Verifiable customer base</li>
                  <li>• Quality invoices or purchase orders</li>
                  <li>• No bankruptcy proceedings</li>
                  <li>• Acceptable credit history</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Required Documents</h3>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Business registration documents</li>
                  <li>• Financial statements (past 2 years)</li>
                  <li>• Trade documents (invoices, POs, contracts)</li>
                  <li>• Bank statements (past 6 months)</li>
                  <li>• Tax returns and identification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Financing for Your Trade?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Speak with our trade finance specialists to find the best solution for your business.
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Apply for Financing
          </button>
        </div>
      </div>
    </div>
  );
}
