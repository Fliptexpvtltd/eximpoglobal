import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Home, ShoppingBag, MessageCircle, BarChart2, User, 
  Package, FileText, Search, Star, TrendingUp, Clock,
  MapPin, IndianRupee, ArrowRight, ChevronRight, Send,
  ArrowLeft, Phone
} from 'lucide-react';

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Industrial LED Panel 600x600',
    supplier: 'Shenzhen Tech Industries',
    price: 45.50,
    moq: 500,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    rating: 4.8,
    origin: 'China',
    certifications: ['CE', 'RoHS', 'ISO9001']
  },
  {
    id: '2',
    name: 'Cotton T-Shirt Basic',
    supplier: 'Bangladesh Textiles Ltd',
    price: 3.20,
    moq: 1000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    rating: 4.5,
    origin: 'Bangladesh',
    certifications: ['GOTS', 'OEKO-TEX']
  }
];

type Screen = 'login' | 'roleSelection' | 'buyerDashboard' | 'catalog' | 'productDetail' | 'messages' | 'profile';

export default function MobilePreview() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Mobile Frame Component - Direct content display without phone frame
  const MobileFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="mx-auto w-full max-w-md bg-white shadow-lg overflow-hidden">
      {/* Content */}
      <div className="bg-gray-50 h-screen overflow-hidden relative">
        {children}
      </div>
    </div>
  );

  // Header Component
  const MobileHeader = ({ title, showBack = false, onBack }: { title: string; showBack?: boolean; onBack?: () => void }) => (
    <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
      {showBack && (
        <button onClick={onBack} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <h1 className="font-semibold text-lg">{title}</h1>
    </div>
  );

  // Bottom Navigation
  const BottomNav = () => (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      <button 
        onClick={() => setCurrentScreen('buyerDashboard')}
        className={`flex flex-col items-center gap-1 p-2 ${currentScreen === 'buyerDashboard' ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <Home className="w-5 h-5" />
        <span className="text-xs">Home</span>
      </button>
      <button 
        onClick={() => setCurrentScreen('catalog')}
        className={`flex flex-col items-center gap-1 p-2 ${currentScreen === 'catalog' ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-xs">Catalog</span>
      </button>
      <button 
        onClick={() => setCurrentScreen('messages')}
        className={`flex flex-col items-center gap-1 p-2 ${currentScreen === 'messages' ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-xs">Messages</span>
      </button>
      <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
        <BarChart2 className="w-5 h-5" />
        <span className="text-xs">Analytics</span>
      </button>
      <button 
        onClick={() => setCurrentScreen('profile')}
        className={`flex flex-col items-center gap-1 p-2 ${currentScreen === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <User className="w-5 h-5" />
        <span className="text-xs">Profile</span>
      </button>
    </div>
  );

  // Login Screen
  const LoginScreen = () => (
    <div className="p-6 flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">EximpoGlobal</h1>
          <p className="text-gray-600 text-sm">International B2B Commerce</p>
        </div>

        <div className="space-y-4">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button 
            className="w-full" 
            onClick={() => setCurrentScreen('roleSelection')}
          >
            Login
          </Button>
          <div className="text-center text-sm text-gray-500">OR</div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setCurrentScreen('roleSelection')}
          >
            Sign Up / Select Role
          </Button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 pb-4">
        Secure B2B platform for international trade
      </p>
    </div>
  );

  // Role Selection Screen
  const RoleSelectionScreen = () => (
    <div className="h-full flex flex-col">
      <MobileHeader title="Select Your Role" showBack onBack={() => setCurrentScreen('login')} />
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm">Choose how you'll use the platform</p>
        </div>

        <div className="space-y-3">
          {[
            { role: 'buyer', title: 'Buyer (Importer)', desc: 'Source products, request quotes', icon: ShoppingBag },
            { role: 'seller', title: 'Seller (Exporter)', desc: 'List products, respond to RFQs', icon: Package },
            { role: 'both', title: 'Buyer & Seller', desc: 'Access both features', icon: TrendingUp },
          ].map((option) => (
            <button
              key={option.role}
              onClick={() => setSelectedRole(option.role)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedRole === option.role 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedRole === option.role ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <option.icon className={`w-6 h-6 ${selectedRole === option.role ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{option.title}</div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedRole && (
          <div className="mt-6 space-y-4">
            <Input placeholder="Company Name" />
            <Input placeholder="Industry (Optional)" />
            <Button 
              className="w-full" 
              onClick={() => setCurrentScreen('buyerDashboard')}
            >
              Continue to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Buyer Dashboard Screen
  const BuyerDashboardScreen = () => (
    <div className="h-full flex flex-col">
      <div className="bg-white p-4 border-b">
        <p className="text-sm text-gray-600">Welcome back,</p>
        <h1 className="text-xl font-bold">EximpoGlobal</h1>
      </div>

      <div className="flex-1 pb-20 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 p-4">
          {[
            { label: 'Active RFQs', value: '3', icon: FileText, color: 'bg-blue-100 text-blue-600' },
            { label: 'Orders', value: '12', icon: Package, color: 'bg-green-100 text-green-600' },
            { label: 'In Transit', value: '5', icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
            { label: 'Suppliers', value: '8', icon: User, color: 'bg-purple-100 text-purple-600' },
          ].map((stat, i) => (
            <Card key={i} className="p-4">
              <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center mb-2`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="px-4 mb-4">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setCurrentScreen('catalog')}
              className="bg-white p-4 rounded-lg border flex flex-col items-center gap-2"
            >
              <Search className="w-6 h-6 text-blue-600" />
              <span className="text-sm">Browse Catalog</span>
            </button>
            <button className="bg-white p-4 rounded-lg border flex flex-col items-center gap-2">
              <Package className="w-6 h-6 text-green-600" />
              <span className="text-sm">View Orders</span>
            </button>
          </div>
        </div>

        {/* Active RFQs */}
        <div className="px-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Active RFQs</h3>
            <span className="text-sm text-blue-600">View All</span>
          </div>
          <Card className="p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="font-semibold">Industrial LED Panel</div>
                <div className="text-sm text-gray-600">Qty: 1000 • FOB</div>
              </div>
              <Badge>Quoted</Badge>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-gray-500">3 quotes received</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );

  // Catalog Screen
  const CatalogScreen = () => (
    <div className="h-full flex flex-col">
      <MobileHeader title="Product Catalog" />
      
      <div className="p-3 bg-white border-b">
        <Input placeholder="Search products, suppliers..." className="w-full" />
      </div>

      <div className="flex-1 pb-20 overflow-y-auto">
        <div className="p-3 space-y-3">
          {mockProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => {
                setSelectedProduct(product);
                setCurrentScreen('productDetail');
              }}
              className="w-full bg-white rounded-lg overflow-hidden shadow-sm border text-left"
            >
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
              <div className="p-3">
                <h3 className="font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.supplier}</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">🌍 {product.origin}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">₹{product.price}</div>
                    <div className="text-xs text-gray-600">MOQ: {product.moq}</div>
                  </div>
                  <div className="flex gap-1">
                    {product.certifications.slice(0, 2).map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs">{cert}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );

  // Product Detail Screen
  const ProductDetailScreen = () => {
    if (!selectedProduct) return null;
    
    return (
      <div className="h-full flex flex-col">
        <MobileHeader 
          title="Product Details" 
          showBack 
          onBack={() => setCurrentScreen('catalog')} 
        />
        
        <div className="flex-1 overflow-y-auto">
          <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover" />
          
          <div className="p-4">
            <h1 className="text-xl font-bold mb-2">{selectedProduct.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-600">{selectedProduct.supplier}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{selectedProduct.rating}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Unit Price</div>
                  <div className="text-2xl font-bold text-blue-600">₹{selectedProduct.price}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">MOQ</div>
                  <div className="text-xl font-semibold">{selectedProduct.moq} units</div>
                </div>
              </div>
            </div>

            <Card className="p-4 mb-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Origin</div>
                    <div className="font-semibold">{selectedProduct.origin}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Lead Time</div>
                    <div className="font-semibold">25-30 days</div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Certifications</h3>
              <div className="flex gap-2">
                {selectedProduct.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary">{cert}</Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2 pb-4">
              <Button className="w-full">
                Request Quote
              </Button>
              <Button variant="outline" className="w-full">
                Contact Supplier
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Messages Screen
  const MessagesScreen = () => (
    <div className="h-full flex flex-col">
      <MobileHeader title="Messages" />
      
      <div className="flex-1 pb-20 overflow-y-auto">
        {[
          { name: 'Shenzhen Tech Industries', message: 'Production is on schedule...', time: '10:30', unread: 2 },
          { name: 'Bangladesh Textiles Ltd', message: 'We can offer 5% discount...', time: 'Yesterday', unread: 0 },
        ].map((conv, i) => (
          <button key={i} className="w-full p-4 border-b flex gap-3 hover:bg-gray-50">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {conv.name.substring(0, 2)}
            </div>
            <div className="flex-1 text-left">
              <div className="flex justify-between items-start mb-1">
                <div className="font-semibold">{conv.name}</div>
                <div className="text-xs text-gray-500">{conv.time}</div>
              </div>
              <div className="text-sm text-gray-600 flex justify-between items-center">
                <span className="truncate">{conv.message}</span>
                {conv.unread > 0 && (
                  <Badge className="ml-2">{conv.unread}</Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );

  // Profile Screen
  const ProfileScreen = () => (
    <div className="h-full flex flex-col">
      <MobileHeader title="Profile" />
      
      <div className="flex-1 pb-20 overflow-y-auto">
        <div className="bg-white p-6 text-center border-b">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
            EG
          </div>
          <h2 className="text-xl font-bold">EximpoGlobal</h2>
          <p className="text-gray-600">user@eximpo.com</p>
          <Badge className="mt-2">BUYER</Badge>
        </div>

        <div className="p-4 space-y-1">
          <div className="text-sm font-semibold text-gray-500 px-3 py-2">ACCOUNT</div>
          {['Profile Information', 'Security Settings', 'Notifications'].map((item) => (
            <button key={item} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <span>{item}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}

          <div className="text-sm font-semibold text-gray-500 px-3 py-2 mt-4">BUSINESS</div>
          {['Company Details', 'Payment Methods', 'Documents'].map((item) => (
            <button key={item} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <span>{item}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}

          <div className="pt-4">
            <Button 
              variant="outline" 
              className="w-full text-red-600 border-red-600"
              onClick={() => setCurrentScreen('login')}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <MobileFrame>
        {currentScreen === 'login' && <LoginScreen />}
        {currentScreen === 'roleSelection' && <RoleSelectionScreen />}
        {currentScreen === 'buyerDashboard' && <BuyerDashboardScreen />}
        {currentScreen === 'catalog' && <CatalogScreen />}
        {currentScreen === 'productDetail' && <ProductDetailScreen />}
        {currentScreen === 'messages' && <MessagesScreen />}
        {currentScreen === 'profile' && <ProfileScreen />}
      </MobileFrame>
    </div>
  );
}
