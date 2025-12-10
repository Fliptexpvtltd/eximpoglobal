import { Home, ShoppingBag, MessageCircle, BarChart2, User } from 'lucide-react';
import type { User as UserType } from '../App';

interface MobileBottomNavProps {
  user: UserType;
  currentView: string;
  onNavigate: (view: any) => void;
}

export function MobileBottomNav({ user, currentView, onNavigate }: MobileBottomNavProps) {
  const buyerLinks = [
    { id: 'catalog', label: 'Browse', icon: ShoppingBag },
    { id: 'dashboard', label: 'Orders', icon: Home },
    { id: 'chat', label: 'Messages', icon: MessageCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const sellerLinks = [
    { id: 'catalog', label: 'Products', icon: ShoppingBag },
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'chat', label: 'Messages', icon: MessageCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const links = user.role === 'seller' ? sellerLinks : buyerLinks;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] safe-area-bottom">
      <div className="grid grid-cols-5 h-16 max-w-7xl mx-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentView === link.id;
          
          return (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors active:bg-gray-50 ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[10px] ${isActive ? 'font-medium' : ''}`}>{link.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
