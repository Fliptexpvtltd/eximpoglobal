import { useState } from 'react';
import { PublicNavigation } from './PublicNavigation';

interface FAQProps {
  onNavigate: (view: string) => void;
}

export function FAQ({ onNavigate }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click on 'Sign Up' in the navigation menu, choose whether you're a buyer or seller, and fill in your business details. You'll receive a verification email to activate your account."
        },
        {
          q: "What's the difference between buyer and seller accounts?",
          a: "Buyer accounts can browse products, submit RFQs, and purchase items. Seller accounts can list products, respond to RFQs, and manage orders. You can have both account types with different email addresses."
        },
        {
          q: "Is there a fee to join?",
          a: "Basic membership is free. You can browse products and submit limited RFQs at no cost. Premium features require a paid subscription."
        }
      ]
    },
    {
      category: "Buying & RFQs",
      questions: [
        {
          q: "What is an RFQ?",
          a: "RFQ stands for Request for Quotation. It's a formal way to request price quotes from multiple suppliers for the products you need. Suppliers review your requirements and submit competitive quotes."
        },
        {
          q: "How long does it take to receive quotes?",
          a: "Most suppliers respond within 24-48 hours. Complex or custom orders may take 3-5 business days. You'll receive email notifications when suppliers submit quotes."
        },
        {
          q: "Can I negotiate prices?",
          a: "Yes! Use our built-in messaging system to negotiate prices, terms, and specifications directly with suppliers."
        },
        {
          q: "What payment methods are accepted?",
          a: "Payment methods vary by supplier but typically include wire transfer, letter of credit, PayPal, and trade credit. Specific options are shown during checkout."
        }
      ]
    },
    {
      category: "Selling & Products",
      questions: [
        {
          q: "How do I list my products?",
          a: "Go to your seller dashboard, click 'Add Product', and fill in the product details including images, specifications, pricing, and MOQ. Products are reviewed within 24 hours before going live."
        },
        {
          q: "What are the listing fees?",
          a: "Basic product listings are included in your subscription plan. There are no additional listing fees or commissions on sales."
        },
        {
          q: "How do I respond to RFQs?",
          a: "You'll receive email notifications for relevant RFQs. Log in to view details and submit your quote with pricing, lead time, and terms."
        },
        {
          q: "Can I offer custom products?",
          a: "Yes! You can respond to RFQs for custom orders even if you don't have them listed in your catalog."
        }
      ]
    },
    {
      category: "Shipping & Logistics",
      questions: [
        {
          q: "Who handles shipping?",
          a: "Shipping terms are negotiated between buyer and seller. We offer logistics partners and freight forwarding services to simplify international shipping."
        },
        {
          q: "How does shipment tracking work?",
          a: "Sellers provide tracking information which appears in your dashboard. You'll receive updates as your shipment progresses through each stage."
        },
        {
          q: "What about customs and duties?",
          a: "Customs duties and import taxes are typically the buyer's responsibility unless otherwise negotiated. We provide customs clearance assistance through our partner network."
        }
      ]
    },
    {
      category: "Security & Trust",
      questions: [
        {
          q: "How do you verify suppliers?",
          a: "All suppliers undergo verification including business license checks, identity verification, and quality assessments. Verified suppliers receive a badge on their profile."
        },
        {
          q: "What is Trade Assurance?",
          a: "Trade Assurance is our protection program that safeguards your payment until you confirm satisfactory delivery. It covers product quality and on-time shipment."
        },
        {
          q: "What if there's a dispute?",
          a: "Our dispute resolution team mediates conflicts between buyers and sellers. We review evidence from both parties and work toward a fair resolution."
        },
        {
          q: "Is my payment information secure?",
          a: "Yes, we use bank-level encryption and never store complete payment details. All transactions are processed through secure, PCI-compliant payment gateways."
        }
      ]
    },
    {
      category: "Account & Billing",
      questions: [
        {
          q: "How do I upgrade my plan?",
          a: "Go to Settings > Subscription in your dashboard and select your desired plan. Changes take effect immediately and you're only charged the prorated difference."
        },
        {
          q: "Can I cancel my subscription?",
          a: "Yes, you can cancel anytime. Your plan remains active until the end of the current billing period. No refunds for partial months."
        },
        {
          q: "How do I update my business information?",
          a: "Go to Settings > Company Profile to update your business details, contact information, and verification documents."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation onNavigate={onNavigate} />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about using EximpoGlobal
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, qIndex) => {
                  const index = catIndex * 100 + qIndex;
                  const isOpen = openIndex === index;
                  return (
                    <div key={qIndex} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="w-full text-left flex justify-between items-start gap-4 py-2"
                      >
                        <span className="font-semibold text-gray-900">{faq.q}</span>
                        <span className="text-gray-400 flex-shrink-0">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <p className="text-gray-600 mt-2 leading-relaxed">{faq.a}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
