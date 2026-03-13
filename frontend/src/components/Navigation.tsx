import { useState } from 'react';
import { Globe, Home, Search, FileText, MessageSquare, Package, BarChart3, LogOut, Bell, User, Menu, X, Edit2 } from 'lucide-react';
import type { User } from '../App';
import { NotificationPanel, Notification } from './NotificationPanel';

interface NavigationProps {
  user: User;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  notifications: Notification[];
  notificationPanelOpen: boolean;
  onToggleNotificationPanel: (open: boolean) => void;
  onMarkNotificationAsRead: (id: string) => void;
  onDismissNotification: (id: string) => void;
}

export function Navigation({ user, currentView, onNavigate, onLogout, notifications, notificationPanelOpen, onToggleNotificationPanel, onMarkNotificationAsRead, onDismissNotification }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;
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
    { id: 'manage-products', label: 'Manage Products', icon: Edit2 },
    { id: 'incoming-rfqs', label: 'RFQ Requests', icon: FileText },
    { id: 'chat', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Performance', icon: BarChart3 },
  ];

  const isSeller = user.role === 'seller';
  const links = user.role === 'seller' ? sellerLinks : buyerLinks;
  
  // Theme colors based on role - using full class names for Tailwind
  const bgColor = isSeller ? 'bg-emerald-600' : 'bg-blue-600';
  const textColor = isSeller ? 'text-emerald-600' : 'text-blue-600';
  const activeBg = isSeller ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700';
  const hoverBg = isSeller ? 'hover:bg-emerald-50' : 'hover:bg-blue-50';

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-16 gap-4 relative">
            {/* Logo - centered on all screen sizes */}
            <div className="flex items-center gap-2">
              <img src="https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/brand/eximpo-global-llp-logo.svg" alt="Eximpo Logo" className="h-12 w-auto" />
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 absolute right-0">
              
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
              
              <div className="relative">
                <button 
                  onClick={() => onToggleNotificationPanel(!notificationPanelOpen)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                {notificationPanelOpen && (
                  <NotificationPanel
                    notifications={notifications}
                    onClose={() => onToggleNotificationPanel(false)}
                    onMarkAsRead={onMarkNotificationAsRead}
                    onDismiss={onDismissNotification}
                  />
                )}
              </div>
              
              <div className="hidden md:flex items-center gap-3 border-l border-gray-200 pl-4">
                <div className="hidden lg:block text-right">
                  <div className="text-sm text-gray-900">{user.name}</div>
                  <div className="text-xs" style={{ color: isSeller ? '#059669' : '#2563eb' }}>
                    {isSeller ? 'Seller' : 'Buyer'} • {user.companyName}
                  </div>
                </div>
                
                <div className="relative group">
                  <button 
                    className="w-9 h-9 text-white rounded-full flex items-center justify-center"
                    style={{ backgroundColor: isSeller ? '#059669' : '#2563eb' }}
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-2">
                      <button 
                        onClick={() => onNavigate('profile')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700">
                        Profile Settings
                      </button>
                      <button 
                        onClick={() => onNavigate('profile')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700">
                        Company Details
                      </button>
                      <button 
                        onClick={() => onNavigate('profile')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700">
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

              {/* Mobile menu button - Hidden since we have bottom nav */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu - Hidden since we have bottom nav */}
        {mobileMenuOpen && (
          <div className="hidden border-t border-gray-200 bg-white">
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
                        ? (isSeller ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700')
                        : 'text-gray-600 hover:bg-gray-50'
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
                  <div className="text-xs flex items-center gap-2 mt-1">
                    <span style={{ color: isSeller ? '#059669' : '#2563eb', fontWeight: 600 }}>
                      {isSeller ? '🏪 Seller' : '🛒 Buyer'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{user.companyName}</span>
                  </div>
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
