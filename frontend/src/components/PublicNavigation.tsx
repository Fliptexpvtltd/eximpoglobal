import { useState } from 'react';
import { Globe, LogIn, Menu, X } from 'lucide-react';

interface PublicNavigationProps {
  onNavigate?: (view: string) => void;
}

export function PublicNavigation({ onNavigate }: PublicNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('catalog')}
            className="flex items-center gap-3"
          >
            <Globe className="w-8 h-8 text-blue-600" />
            <span className="text-xl text-gray-900">EximpoGlobal</span>
          </button>

          {/* Right - Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavigation('auth')}
              className="text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={() => handleNavigation('auth')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button - Hidden since we have bottom nav */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Hidden since we have bottom nav */}
        {mobileMenuOpen && (
          <div className="hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleNavigation('catalog')}
                className="text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Browse Products
              </button>
              <button 
                onClick={() => handleNavigation('how-it-works')}
                className="text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => handleNavigation('about')}
                className="text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                About
              </button>
              <div className="border-t border-gray-200 mt-2 pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleNavigation('auth')}
                  className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigation('auth')}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
