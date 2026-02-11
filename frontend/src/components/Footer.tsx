import { Globe, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper function to handle link clicks - updates URL and calls navigate
  const handleLinkClick = (view: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.history.pushState(null, '', `?view=${view}`);
    onNavigate(view);
  };

  return (
    <footer className="w-full mt-12 bg-gray-100 border-t border-gray-200">
      {/* Mobile Toggle Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-3 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-gray-600" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Footer Content */}
      <div className={`max-w-7xl mx-auto px-6 py-12 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EximpoGlobal</span>
            </div>
            <p className="text-sm mb-4 leading-relaxed text-gray-600">
              Your trusted B2B marketplace connecting buyers and suppliers worldwide for seamless international trade.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/eximpoglobal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white text-gray-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://x.com/eximpoglobal" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white text-gray-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/eximpo-global" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white text-gray-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/eximpogloballlp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white text-gray-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="?view=catalog" onClick={handleLinkClick('catalog')} className="text-sm text-gray-600 hover:text-blue-600">
                  Browse Products
                </a>
              </li>
              <li>
                <a href="?view=how-it-works" onClick={handleLinkClick('how-it-works')} className="text-sm text-gray-600 hover:text-blue-600">
                  How It Works
                </a>
              </li>
              <li>
                <a href="?view=about" onClick={handleLinkClick('about')} className="text-sm text-gray-600 hover:text-blue-600">
                  About Us
                </a>
              </li>
              <li>
                <a href="?view=pricing" onClick={handleLinkClick('pricing')} className="text-sm text-gray-600 hover:text-blue-600">
                  Pricing
                </a>
              </li>
              <li>
                <a href="?view=faq" onClick={handleLinkClick('faq')} className="text-sm text-gray-600 hover:text-blue-600">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="?view=trade-assurance" onClick={handleLinkClick('trade-assurance')} className="text-sm text-gray-600 hover:text-blue-600">
                  Trade Assurance
                </a>
              </li>
              <li>
                <a href="?view=logistics-solutions" onClick={handleLinkClick('logistics-solutions')} className="text-sm text-gray-600 hover:text-blue-600">
                  Logistics Solutions
                </a>
              </li>
              <li>
                <a href="?view=quality-inspection" onClick={handleLinkClick('quality-inspection')} className="text-sm text-gray-600 hover:text-blue-600">
                  Quality Inspection
                </a>
              </li>
              <li>
                <a href="?view=trade-financing" onClick={handleLinkClick('trade-financing')} className="text-sm text-gray-600 hover:text-blue-600">
                  Trade Financing
                </a>
              </li>
              <li>
                <a href="?view=customs-clearance" onClick={handleLinkClick('customs-clearance')} className="text-sm text-gray-600 hover:text-blue-600">
                  Customs Clearance
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
                <div className="text-gray-600">
                  <div className="font-medium">Eximpo Global LLP</div>
                  <div>H No: 6-640/1/2, Vimanapuri Colony</div>
                  <div>Quthbullapur, Hyderabad</div>
                  <div>Medchal-Malkajigiri, Telangana - 500055</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <a href="mailto:contact@eximpoglobal.net" className="text-gray-600 hover:text-blue-600">
                  contact@eximpoglobal.net
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <a href="tel:+917386663696" className="text-gray-600 hover:text-blue-600">
                  +91 7386663696
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <a href="tel:+254733336633" className="text-gray-600 hover:text-blue-600">
                  +254 733336633
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-gray-600">&copy; 2025 EximpoGlobal. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="?view=privacy-policy" onClick={handleLinkClick('privacy-policy')} className="text-gray-600 hover:text-blue-600">
              Privacy Policy
            </a>
            <a href="?view=terms-of-service" onClick={handleLinkClick('terms-of-service')} className="text-gray-600 hover:text-blue-600">
              Terms of Service
            </a>
            <a href="?view=cookie-policy" onClick={handleLinkClick('cookie-policy')} className="text-gray-600 hover:text-blue-600">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
