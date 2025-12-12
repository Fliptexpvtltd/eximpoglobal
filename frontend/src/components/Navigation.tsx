import { useState } from 'react';
import { Globe, Home, Search, FileText, MessageSquare, Package, BarChart3, LogOut, Bell, User, Menu, X } from 'lucide-react';
import type { User } from '../App';

interface NavigationProps {
  user: User;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  activeMode?: 'buyer' | 'seller';
  onModeChange?: (mode: 'buyer' | 'seller') => void;
}

export function Navigation({ user, currentView, onNavigate, onLogout, activeMode = 'buyer', onModeChange }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const buyerLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'catalog', label: 'Browse Products', icon: Search },
    { id: 'rfq-builder', label: 'Request Quotes', icon: FileText },
    { id: 'shipment-tracking', label: 'Track Orders', icon: Package },
    { id: 'chat', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const sellerLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'catalog', label: 'My Products', icon: Package },
    { id: 'incoming-rfqs', label: 'RFQ Requests', icon: FileText },
    { id: 'chat', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Performance', icon: BarChart3 },
  ];

  // For 'both' role, use activeMode to determine which links to show
  const effectiveRole = user.role === 'both' ? activeMode : user.role;
  const links = effectiveRole === 'seller' ? sellerLinks : buyerLinks;
  
  // Debug logging
  console.log('Navigation render:', { userRole: user.role, activeMode, effectiveRole });
  
  // Theme colors based on role
  const bgColor = effectiveRole === 'seller' ? 'bg-emerald-600' : 'bg-blue-600';
  const textColor = effectiveRole === 'seller' ? 'text-emerald-600' : 'text-blue-600';
  const hoverBgColor = effectiveRole === 'seller' ? 'hover:bg-emerald-50' : 'hover:bg-blue-50';
  const activeBgColor = effectiveRole === 'seller' ? 'bg-emerald-50 text-emerald-700 border-emerald-600' : 'bg-blue-50 text-blue-700 border-blue-600';

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 md:gap-8">
              <button 
                onClick={() => onNavigate('catalog')}
                className="flex items-center gap-2 lg:hidden"
              >
                <Globe className={`w-7 h-7 md:w-8 md:h-8 ${textColor}`} />
                <span className="text-lg md:text-xl text-gray-900">EximpoGlobal</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              {/* Role Switcher for users with 'both' role */}
              {user.role === 'both' && onModeChange && (
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => onModeChange('buyer')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeMode === 'buyer'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🛒 Buyer
                  </button>
                  <button
                    onClick={() => onModeChange('seller')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeMode === 'seller'
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🏪 Seller
                  </button>
                </div>
              )}
              
              {user.kycStatus === 'pending' && (
                <div className="hidden md:block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  KYC Pending
                </div>
              )}
              {user.kycStatus === 'approved' && (
                <div className="hidden md:block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  ✓ Verified
                </div>
              )}
              
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="hidden md:flex items-center gap-3 border-l border-gray-200 pl-4">
                <div className="hidden lg:block text-right">
                  <div className="text-sm text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.companyName}</div>
                </div>
                
                <div className="relative group">
                  <button className={`w-9 h-9 ${bgColor} text-white rounded-full flex items-center justify-center`}>
                    <User className="w-5 h-5" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-2">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700">
                        Company Details
                      </button>
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700">
                        Preferences
                      </button>
                      <hr className="my-2" />
                      <button 
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 rounded-lg text-sm text-red-600 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      onNavigate(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      currentView === link.id
                        ? activeBgColor
                        : `text-gray-600 ${hoverBgColor}`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
              
              <div className="pt-3 border-t border-gray-200 mt-3">
                <div className="px-4 py-2">
                  <div className="text-sm text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.companyName}</div>
                  {user.kycStatus === 'approved' && (
                    <div className="mt-2 inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      ✓ Verified
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
