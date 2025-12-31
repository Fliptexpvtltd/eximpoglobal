import { useState } from 'react';
import { Search, HelpCircle, MessageCircle, Mail, Phone, FileText, Video, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface HelpProps {
  user: any;
  activeMode: 'buyer' | 'seller';
}

export function Help({ user, activeMode }: HelpProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: HelpCircle },
    { id: 'rfq-quotes', label: 'RFQs & Quotes', icon: FileText },
    { id: 'orders-payments', label: 'Orders & Payments', icon: FileText },
    { id: 'shipping', label: 'Shipping & Tracking', icon: FileText },
    { id: 'account', label: 'Account Management', icon: FileText }
  ];

  const faqs = {
    'getting-started': [
      {
        question: 'How do I create an account?',
        answer: 'Click on "Sign Up" in the top right corner. Choose your role (Buyer or Seller), fill in your details, and verify your email address. Once verified, you can start using the platform immediately.'
      },
      {
        question: 'What are the different user roles?',
        answer: 'There are three main roles: Buyers (companies looking to source products), Sellers (suppliers offering products), and Both (users who both buy and sell). Each role has access to different features tailored to their needs.'
      },
      {
        question: 'How do I verify my account?',
        answer: 'After registration, check your email for a verification link. Click the link to verify your email address. For full verification, you may need to provide business documents which our team will review within 24-48 hours.'
      },
      {
        question: 'Is there a mobile app available?',
        answer: 'Yes! We have mobile apps available for both iOS and Android. Download from the App Store or Google Play Store. You can also access our mobile-optimized web version from any mobile browser.'
      }
    ],
    'rfq-quotes': [
      {
        question: 'How do I create an RFQ (Request for Quote)?',
        answer: 'Navigate to "RFQ Builder" from the sidebar. Fill in product details, quantity, delivery requirements, and any special specifications. Submit the RFQ and relevant suppliers will receive notifications to provide quotes.'
      },
      {
        question: 'How long does it take to receive quotes?',
        answer: 'Most suppliers respond within 24-48 hours. You will receive notifications as quotes come in. You can view all quotes in the "Quote Comparison" section where you can compare them side-by-side.'
      },
      {
        question: 'Can I negotiate prices with suppliers?',
        answer: 'Yes! Once you receive a quote, you can start a chat with the supplier to discuss pricing, payment terms, delivery schedules, or any other requirements. Use our built-in messaging system for all communications.'
      },
      {
        question: 'How do I compare multiple quotes?',
        answer: 'Go to "Quote Comparison" to see all quotes for your RFQ in a side-by-side format. Compare prices, delivery times, payment terms, and supplier ratings to make an informed decision.'
      }
    ],
    'orders-payments': [
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept credit cards (Visa, Mastercard, Amex), wire transfers, and ACH payments. For international transactions, we support multiple currencies and local payment methods depending on your region.'
      },
      {
        question: 'How do I create a purchase order?',
        answer: 'After accepting a quote, click "Create Purchase Order". Review the order details, add any special instructions, and submit. Both you and the supplier will receive a copy of the PO.'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Absolutely. We use bank-level encryption (256-bit SSL) to protect all payment information. We are PCI DSS compliant and never store your full credit card details on our servers.'
      },
      {
        question: 'Can I get an invoice for my purchase?',
        answer: 'Yes! Invoices are automatically generated for all purchases and can be downloaded from your dashboard. You can also access them in the "Billing History" section under Settings.'
      }
    ],
    'shipping': [
      {
        question: 'How do I track my shipment?',
        answer: 'Go to "Shipments" from the sidebar to see all your shipments. Click "View Details" on any shipment to see real-time tracking information including current location, customs status, and estimated delivery.'
      },
      {
        question: 'What shipping methods are available?',
        answer: 'We support Sea Freight, Air Freight, Rail Freight, and Express Courier services. The available options depend on the supplier, destination, and product type. Each method has different transit times and costs.'
      },
      {
        question: 'How are customs and duties handled?',
        answer: 'Customs duties and taxes are calculated at checkout based on your location and product type. We provide all necessary documentation and can assist with customs clearance through our logistics partners.'
      },
      {
        question: 'What if my shipment is delayed?',
        answer: 'If a shipment is delayed, you will receive automatic notifications. You can also contact the supplier directly through our messaging system or reach out to our support team for assistance.'
      }
    ],
    'account': [
      {
        question: 'How do I update my profile information?',
        answer: 'Go to "Settings" from the sidebar and select "Profile". Update your information and click "Save Changes". For company information updates, go to the "Company" tab in Settings.'
      },
      {
        question: 'How do I change my password?',
        answer: 'Navigate to Settings > Security. Enter your current password, then your new password twice to confirm. For security, we recommend using a strong password with at least 8 characters.'
      },
      {
        question: 'Can I manage notification preferences?',
        answer: 'Yes! Go to Settings > Notifications to customize what notifications you receive. You can enable/disable email, SMS, and in-app notifications for different types of activities.'
      },
      {
        question: 'How do I delete my account?',
        answer: 'Contact our support team to request account deletion. Note that this action is permanent and will remove all your data including RFQs, orders, and messages after a 30-day grace period.'
      }
    ]
  };

  const resources = [
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      icon: Video,
      link: '#'
    },
    {
      title: 'User Documentation',
      description: 'Comprehensive written guides',
      icon: FileText,
      link: '#'
    },
    {
      title: 'API Documentation',
      description: 'For developers integrating with our platform',
      icon: FileText,
      link: '#'
    }
  ];

  const currentFaqs = faqs[activeCategory as keyof typeof faqs] || [];
  const filteredFaqs = searchQuery
    ? currentFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentFaqs;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
        <p className="text-gray-600">Find answers to common questions or contact our support team</p>
      </div>

      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Contact Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-4">Get instant help from our support team</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-4">We typically respond within 24 hours</p>
            <a
              href="mailto:support@eximpo.com"
              className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              Send Email
            </a>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-4">Mon-Fri, 9 AM - 6 PM EST</p>
            <a
              href="tel:+1-800-123-4567"
              className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              Call Now
            </a>
          </div>
        </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Navigation */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      activeCategory === category.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{category.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
              <div className="space-y-3">
                {resources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <a
                      key={index}
                      href={resource.link}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 mb-1">
                          {resource.title}
                        </p>
                        <p className="text-xs text-gray-500">{resource.description}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>

            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No questions found matching your search</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-4 pb-4 text-gray-600 border-t border-gray-100 pt-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Still Need Help */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">Still need help?</h3>
            <p className="text-blue-700 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
