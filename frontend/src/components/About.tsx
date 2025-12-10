import { 
  Globe, 
  Shield, 
  Users, 
  TrendingUp,
  Award,
  CheckCircle,
  MapPin,
  Mail,
  Phone,
  Building2,
  Target,
  Eye,
  Heart,
  Zap,
  Lock
} from 'lucide-react';
import { PublicNavigation } from './PublicNavigation';
import { useAuth } from '../contexts/AuthContext';

interface AboutProps {
  onNavigate?: (view: string) => void;
}

export function About({ onNavigate }: AboutProps) {
  const { requireAuth } = useAuth();

  const stats = [
    { label: 'Active Suppliers', value: '5,000+', icon: Users },
    { label: 'Countries Covered', value: '100+', icon: Globe },
    { label: 'Products Listed', value: '50,000+', icon: Award },
    { label: 'Trade Volume (Monthly)', value: '₹500Cr+', icon: TrendingUp }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Every supplier is thoroughly verified. All transactions are secured with escrow protection and compliance checks.'
    },
    {
      icon: Globe,
      title: 'Global Connectivity',
      description: 'Connect buyers and sellers across borders with support for multiple currencies, languages, and international trade regulations.'
    },
    {
      icon: Zap,
      title: 'Efficiency',
      description: 'Streamline the entire trade workflow from product discovery to final delivery with automated processes and real-time tracking.'
    },
    {
      icon: Heart,
      title: 'Customer Success',
      description: 'Dedicated support team to help you navigate international trade complexities and grow your business globally.'
    }
  ];

  const features = [
    {
      title: 'Verified Supplier Network',
      description: 'All suppliers undergo rigorous verification including business licenses, certifications, and compliance documentation.',
      icon: CheckCircle
    },
    {
      title: 'Secure Payment Options',
      description: 'Escrow and milestone payments protect both buyers and sellers. Funds are released only upon delivery confirmation.',
      icon: Lock
    },
    {
      title: 'Document Management',
      description: 'Complete digital documentation including commercial invoices, certificates of origin, packing lists, and customs declarations.',
      icon: Award
    },
    {
      title: 'Real-Time Tracking',
      description: 'Track shipments, payments, and documentation in real-time with automated notifications at every milestone.',
      icon: Target
    },
    {
      title: 'Compliance Support',
      description: 'Built-in support for HS codes, Incoterms, and international trade regulations to ensure compliant transactions.',
      icon: Shield
    },
    {
      title: 'Multi-Currency Support',
      description: 'Trade in your preferred currency with real-time exchange rates and transparent pricing.',
      icon: Globe
    }
  ];

  return (
    <>
      <PublicNavigation onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl">About EximpoGlobal</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              Transforming international trade by connecting verified buyers and sellers on a secure, transparent platform
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-16 md:space-y-24">
        
        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To democratize international trade by providing a secure, transparent, and efficient platform that empowers businesses of all sizes to connect, trade, and grow globally.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
            <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl mb-4">Our Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To become the world's most trusted B2B trade platform, breaking down barriers in international commerce and creating opportunities for businesses worldwide to thrive in the global marketplace.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl mb-4">EximpoGlobal by the Numbers</h2>
            <p className="text-lg text-blue-100">
              Trusted by thousands of businesses worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-700 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl mb-2">{stat.value}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Core Values */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at EximpoGlobal
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-2">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Platform Features */}
        <section className="bg-gray-50 -mx-4 px-4 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl mb-4">Platform Features</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to trade internationally with confidence
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl mb-6">What We Do</h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  EximpoGlobal is a comprehensive B2B e-commerce platform designed specifically for international trade. We connect importers and exporters worldwide, providing them with the tools, security, and transparency needed to conduct cross-border transactions with confidence.
                </p>
                <p>
                  Our platform handles the complete trade workflow—from product discovery and RFQ management to quote comparison, purchase orders, secure payments, shipment tracking, and compliance documentation.
                </p>
                <p>
                  We understand the complexities of international trade, including customs regulations, multiple currencies, Incoterms, and documentation requirements. That's why we've built a platform that simplifies these processes while maintaining the highest standards of security and compliance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <Building2 className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="mb-2">For Businesses</h4>
                <p className="text-sm text-gray-600">
                  Enterprise-grade tools for managing international trade operations
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <Globe className="w-8 h-8 text-purple-600 mb-3" />
                <h4 className="mb-2">Global Network</h4>
                <p className="text-sm text-gray-600">
                  Access to verified buyers and sellers in 100+ countries
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <Shield className="w-8 h-8 text-green-600 mb-3" />
                <h4 className="mb-2">Secure Transactions</h4>
                <p className="text-sm text-gray-600">
                  Escrow protection and verified payment processing
                </p>
              </div>
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                <Award className="w-8 h-8 text-orange-600 mb-3" />
                <h4 className="mb-2">Quality Assured</h4>
                <p className="text-sm text-gray-600">
                  All suppliers verified with certifications and licenses
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600">
              Have questions? Our team is here to help you succeed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="mb-2">Email</h4>
              <a href="mailto:contact@eximpoglobal.net" className="text-blue-600 hover:underline">
                contact@eximpoglobal.net
              </a>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="mb-2">Phone</h4>
              <div className="text-gray-700">
                <a href="tel:+917386663696" className="text-blue-600 hover:underline block">
                  +91 7386663696
                </a>
                <a href="tel:+254733336633" className="text-blue-600 hover:underline block mt-1">
                  +254 733336633
                </a>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="mb-2">Address</h4>
              <p className="text-gray-600">
                Eximpo Global LLP<br />
                H No: 6-640/1/2, Vimanapuri Colony<br />
                Quthbullapur, Hyderabad<br />
                Medchal-Malkajigiri<br />
                Telangana - 500055
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-4xl mb-4">Ready to Start Trading?</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join EximpoGlobal today and connect with verified buyers and sellers worldwide
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
              Explore Platform
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
