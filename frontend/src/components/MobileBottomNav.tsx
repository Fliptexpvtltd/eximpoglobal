import { Home, ShoppingBag, MessageCircle, BarChart2, User } from 'lucide-react';
import type { User as UserType } from '../App';

interface MobileBottomNavProps {
  user: UserType;
  currentView: string;
  onNavigate: (view: any) => void;
  activeMode?: 'buyer' | 'seller';
}

export function MobileBottomNav({ user, currentView, onNavigate, activeMode = 'buyer' }: MobileBottomNavProps) {
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

  // For 'both' role, use activeMode to determine which links to show
  const effectiveRole = user.role === 'both' ? activeMode : user.role;
  const links = effectiveRole === 'seller' ? sellerLinks : buyerLinks;
  
  // Theme colors based on role
  const isSeller = effectiveRole === 'seller';
  const activeColor = isSeller ? '#059669' : '#2563eb'; // emerald-600 : blue-600

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
              className="flex flex-col items-center justify-center gap-0.5 transition-colors active:bg-gray-50"
              style={{ color: isActive ? activeColor : '#6b7280' }}
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
