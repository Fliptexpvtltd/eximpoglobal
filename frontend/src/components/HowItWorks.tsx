import { 
  Search, 
  FileText, 
  MessageSquare, 
  ShoppingCart, 
  CreditCard, 
  Package,
  CheckCircle,
  TrendingUp,
  Shield,
  Globe,
  Users,
  Clock
} from 'lucide-react';
import { PublicNavigation } from './PublicNavigation';
import { useAuth } from '../contexts/AuthContext';

interface HowItWorksProps {
  onNavigate?: (view: string) => void;
}

export function HowItWorks({ onNavigate }: HowItWorksProps) {
  const { requireAuth } = useAuth();

  const buyerSteps = [
    {
      icon: Search,
      title: 'Browse & Search',
      description: 'Search our catalog of verified suppliers and products. Filter by HS codes, certifications, MOQ, lead times, and more.',
      color: 'blue'
    },
    {
      icon: FileText,
      title: 'Create RFQ',
      description: 'Submit detailed Request for Quotations with your exact specifications, quantity requirements, and delivery terms.',
      color: 'purple'
    },
    {
      icon: MessageSquare,
      title: 'Receive & Compare Quotes',
      description: 'Get competitive quotes from multiple verified suppliers. Compare prices, terms, and ratings side-by-side.',
      color: 'green'
    },
    {
      icon: ShoppingCart,
      title: 'Create Purchase Order',
      description: 'Select the best quote and generate a purchase order with customized payment terms and Incoterms.',
      color: 'orange'
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: 'Pay securely through escrow or milestone payments. Your funds are protected until delivery confirmation.',
      color: 'red'
    },
    {
      icon: Package,
      title: 'Track Shipment',
      description: 'Monitor your shipment in real-time. Access all documents including invoices, certificates, and customs declarations.',
      color: 'indigo'
    }
  ];

  const sellerSteps = [
    {
      icon: Users,
      title: 'Create Seller Profile',
      description: 'Set up your company profile with certifications, product catalog, and business credentials.',
      color: 'blue'
    },
    {
      icon: Package,
      title: 'List Your Products',
      description: 'Add products with detailed specifications, HS codes, certifications, pricing, and MOQ information.',
      color: 'purple'
    },
    {
      icon: FileText,
      title: 'Receive RFQs',
      description: 'Get instant notifications when buyers submit RFQs matching your product categories.',
      color: 'green'
    },
    {
      icon: MessageSquare,
      title: 'Submit Quotes',
      description: 'Respond with competitive quotes including pricing, lead times, payment terms, and shipping options.',
      color: 'orange'
    },
    {
      icon: CheckCircle,
      title: 'Secure Orders',
      description: 'Win orders based on your competitive pricing, ratings, and verified credentials.',
      color: 'red'
    },
    {
      icon: TrendingUp,
      title: 'Fulfill & Grow',
      description: 'Process orders, arrange shipping, and build your reputation to attract more international buyers.',
      color: 'indigo'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Suppliers',
      description: 'All suppliers undergo thorough verification including business licenses, certifications, and compliance checks.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with buyers and sellers across 100+ countries with support for multiple currencies and languages.'
    },
    {
      icon: Clock,
      title: 'Real-Time Tracking',
      description: 'Track your shipments, payments, and document processing in real-time with automated notifications.'
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Escrow and milestone payment options protect both buyers and sellers throughout the transaction.'
    }
  ];

  const getColorClasses = (color: string, index: number) => {
    const colors: Record<string, { bg: string; border: string; icon: string }> = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600' },
      green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600' },
      red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600' },
      indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'text-indigo-600' }
    };
    return colors[color];
  };

  return (
    <>
      <PublicNavigation onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl">How EximpoGlobal Works</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              A comprehensive platform designed to simplify international trade for buyers and sellers worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 pb-20 lg:pb-16 space-y-16 md:space-y-24">
        
        {/* For Buyers Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl mb-4">For Buyers (Importers)</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Source products from verified suppliers worldwide with complete transparency and security
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {buyerSteps.map((step, index) => {
              const Icon = step.icon;
              const colors = getColorClasses(step.color, index);
              
              return (
                <div 
                  key={index}
                  className="relative"
                >
                  <div className={`bg-white rounded-xl border-2 ${colors.border} p-6 hover:shadow-xl transition-shadow h-full`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`${colors.bg} p-3 rounded-lg flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${colors.bg} ${colors.icon} text-sm`}>
                            {index + 1}
                          </span>
                          <h3 className="text-lg">{step.title}</h3>
                        </div>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {index < buyerSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 z-0" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => requireAuth({ type: 'browse-catalog' })}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Start Sourcing Products
              <Search className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* For Sellers Section */}
        <section className="bg-gray-50 -mx-4 px-4 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl mb-4">For Sellers (Exporters)</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Expand your business globally by connecting with verified buyers from around the world
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sellerSteps.map((step, index) => {
                const Icon = step.icon;
                const colors = getColorClasses(step.color, index);
                
                return (
                  <div 
                    key={index}
                    className="relative"
                  >
                    <div className={`bg-white rounded-xl border-2 ${colors.border} p-6 hover:shadow-xl transition-shadow h-full`}>
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`${colors.bg} p-3 rounded-lg flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${colors.bg} ${colors.icon} text-sm`}>
                              {index + 1}
                            </span>
                            <h3 className="text-lg">{step.title}</h3>
                          </div>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    {index < sellerSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 z-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => requireAuth({ type: 'browse-catalog' })}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                Start Selling Globally
                <TrendingUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl mb-4">Why Choose EximpoGlobal?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for international trade with features that protect and empower both buyers and sellers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-4xl mb-4">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already trading on EximpoGlobal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => requireAuth({ type: 'browse-catalog' })}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Create Free Account
            </button>
            <button 
              onClick={() => requireAuth({ type: 'browse-catalog' })}
              className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors border border-blue-500"
            >
              Browse Products
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
