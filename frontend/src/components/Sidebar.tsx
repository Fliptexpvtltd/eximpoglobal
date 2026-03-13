import { Home, Search, FileText, MessageSquare, Package, BarChart3, User, Settings, HelpCircle, Globe, X, Menu, ChevronRight, ShoppingCart, Edit2 } from 'lucide-react';
import type { User as UserType } from '../App';

interface SidebarProps {
  user: UserType | null;
  currentView: string;
  onNavigate: (view: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Sidebar({ user, currentView, onNavigate, sidebarOpen, onToggleSidebar }: SidebarProps) {
  if (!user) return null;

  const buyerLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'catalog', label: 'Browse Products', icon: Search },
    { id: 'rfq-builder', label: 'Create RFQ', icon: FileText },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'chat', label: 'Messages', icon: MessageSquare },
    { id: 'shipments', label: 'Shipments', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const sellerLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'catalog', label: 'My Products', icon: Package },
    { id: 'manage-products', label: 'Manage Products', icon: Edit2 },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'chat', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const commonLinks = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const isSeller = user.role === 'seller';
  const links = isSeller ? sellerLinks : buyerLinks;

  return (
    <aside className={`
      ${sidebarOpen ? 'w-64' : 'w-16'}
      bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen
      hidden lg:flex flex-shrink-0 sticky top-0
    `}>
      {/* User Profile at Top */}
      <div className="border-b border-gray-200 p-4">
        {sidebarOpen ? (
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.companyName}</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-semibold text-sm">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentView === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`
                w-full flex items-center gap-3 py-3 transition group relative
                ${sidebarOpen ? 'px-4' : 'justify-center'}
                ${isActive 
                  ? (isSeller ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600' : 'bg-blue-50 text-blue-600 border-r-4 border-blue-600')
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? (isSeller ? 'text-emerald-600' : 'text-blue-600') : 'text-gray-500'}`} />
              {sidebarOpen && (
                <>
                  <span className="font-medium">{link.label}</span>
                  {link.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </>
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Common Links */}
        {commonLinks.map((link) => {
          const Icon = link.icon;
          const isActive = currentView === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`
                w-full flex items-center gap-3 py-3 transition group relative
                ${sidebarOpen ? 'px-4' : 'justify-center'}
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              {sidebarOpen && (
                <>
                  <span className="font-medium">{link.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Toggle Button at Bottom */}
      <div className="border-t border-gray-200 p-4 flex justify-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
