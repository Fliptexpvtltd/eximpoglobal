import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Login } from './components/Login';
import { RoleSelection } from './components/RoleSelection';
import { BuyerDashboard } from './components/BuyerDashboard';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Catalog } from './components/Catalog';
import { ProductDetail } from './components/ProductDetail';
import { SupplierProfile } from './components/SupplierProfile';
import { RFQBuilder } from './components/RFQBuilder';
import { QuoteComparison } from './components/QuoteComparison';
import { ChatInterface } from './components/ChatInterface';
import { PurchaseOrder } from './components/PurchaseOrder';
import { ShipmentTracking } from './components/ShipmentTracking';
import { Analytics } from './components/Analytics';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Profile } from './components/Profile';
import MobilePreview from './components/MobilePreview';
import { HowItWorks } from './components/HowItWorks';
import { About } from './components/About';
import { MyRFQs } from './components/MyRFQs';
import { Footer } from './components/Footer';

export type UserRole = 'buyer' | 'seller' | 'both' | 'ops' | 'finance' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyName: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  hsCode: string;
  price: number;
  currency: string;
  moq: number;
  leadTime: string;
  supplierId: string;
  supplierName: string;
  supplierRating: number;
  origin: string;
  certifications: string[];
  image: string;
  description: string;
  variants: Array<{ name: string; value: string }>;
}

export interface RFQ {
  id: string;
  buyerId: string;
  products: Array<{
    productId: string;
    quantity: number;
    specifications: string;
  }>;
  incoterm: string;
  destinationPort: string;
  targetPrice?: number;
  deadline: string;
  status: 'draft' | 'sent' | 'quoted' | 'accepted';
  createdAt: string;
}

export interface Quote {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  currency: string;
  incoterm: string;
  leadTime: string;
  validUntil: string;
  paymentTerms: string;
  freightCost?: number;
  insurance?: number;
  totalCost: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface PO {
  id: string;
  buyerId: string;
  supplierId: string;
  quoteId: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  totalAmount: number;
  currency: string;
  depositPercent: number;
  depositAmount: number;
  balanceAmount: number;
  incoterm: string;
  deliveryWindow: string;
  paymentMethod: 'escrow' | 'lc' | 'oa' | 'dp';
  status: 'draft' | 'pending_payment' | 'in_production' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface Shipment {
  id: string;
  poId: string;
  mode: 'air' | 'sea' | 'rail' | 'courier';
  originPort: string;
  destinationPort: string;
  forwarder: string;
  containerType?: string;
  trackingNumber: string;
  status: 'booked' | 'in_transit' | 'customs' | 'delivered';
  milestones: Array<{
    name: string;
    date: string;
    location: string;
    completed: boolean;
  }>;
  eta: string;
  documents: Array<{
    name: string;
    type: string;
    url: string;
  }>;
}

type View = 
  | 'catalog' 
  | 'product-detail' 
  | 'supplier-profile'
  | 'dashboard' 
  | 'rfq-builder'
  | 'my-rfqs'
  | 'quote-comparison'
  | 'chat'
  | 'purchase-order'
  | 'shipment-tracking'
  | 'profile'
  | 'analytics'
  | 'mobile-preview'
  | 'how-it-works'
  | 'about';

function AppContent() {
  const { user, requireAuth, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedPO, setSelectedPO] = useState<PO | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMode, setActiveMode] = useState<'buyer' | 'seller'>('buyer');

  const handleModeChange = (mode: 'buyer' | 'seller') => {
    console.log('Mode changing to:', mode);
    setActiveMode(mode);
  };

  // Listen for pending action execution
  useEffect(() => {
    const handlePendingAction = (event: any) => {
      const action = event.detail;
      if (!action) return;

      switch (action.type) {
        case 'create-rfq':
          if (action.data?.product) {
            setSelectedProduct(action.data.product);
          }
          setCurrentView('rfq-builder');
          break;
        case 'order-sample':
          if (action.data?.product) {
            setSelectedProduct(action.data.product);
          }
          // Navigate to RFQ builder with sample order flag
          setCurrentView('rfq-builder');
          break;
        case 'view-quotes':
          if (action.data?.rfq) {
            setSelectedRFQ(action.data.rfq);
          }
          setCurrentView('quote-comparison');
          break;
        case 'view-dashboard':
          setCurrentView('dashboard');
          break;
        case 'browse-catalog':
          setCurrentView('catalog');
          break;
        case 'my-rfqs':
          setCurrentView('my-rfqs');
          break;
        case 'chat':
          setCurrentView('chat');
          break;
        case 'create-po':
          setCurrentView('purchase-order');
          break;
      }
    };

    window.addEventListener('execute-pending-action', handlePendingAction);
    return () => window.removeEventListener('execute-pending-action', handlePendingAction);
  }, []);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  const handleViewSupplier = (supplierId: string) => {
    setSelectedSupplier(supplierId);
    setCurrentView('supplier-profile');
  };

  const handleCreateRFQ = (product: Product) => {
    // Require authentication before creating RFQ
    requireAuth({
      type: 'create-rfq',
      data: { product }
    });
  };

  const handleOrderSample = (product: Product) => {
    // Require authentication before ordering sample
    requireAuth({
      type: 'order-sample',
      data: { product }
    });
  };

  const handleViewQuotes = (rfq: RFQ) => {
    // Require authentication before viewing quotes
    requireAuth({
      type: 'view-quotes',
      data: { rfq }
    });
  };

  const handleCreatePO = (quote: Quote) => {
    setSelectedQuote(quote);
    setCurrentView('purchase-order');
  };

  const handleViewShipment = (po: PO) => {
    setSelectedPO(po);
    setCurrentView('shipment-tracking');
  };

  const navigate = (view: View) => {
    // Require auth for protected views
    const protectedViews: View[] = ['dashboard', 'rfq-builder', 'quote-comparison', 'chat', 'purchase-order', 'shipment-tracking', 'analytics', 'profile'];
    
    if (protectedViews.includes(view) && !user) {
      requireAuth({ type: 'view-dashboard' });
      return;
    }
    
    setCurrentView(view);
  };

  // Mobile Preview can be accessed without login
  if (currentView === 'mobile-preview') {
    return <MobilePreview />;
  }

  return (
    <>
      <AuthModal />
      
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar - only show when logged in */}
        {user && (
          <Sidebar 
            user={user} 
            currentView={currentView} 
            onNavigate={navigate}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        )}
        
        {/* Main wrapper - flex-1 takes remaining space after sidebar */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation - only show when logged in */}
          {user && (
            <Navigation 
              user={user} 
              currentView={currentView} 
              onNavigate={navigate}
              onLogout={() => {
                logout();
                setCurrentView('catalog');
              }}
              activeMode={activeMode}
              onModeChange={handleModeChange}
            />
          )}
          
          {/* Main Content */}
          <main className={user ? "flex-1 max-w-7xl mx-auto w-full px-4 py-6 pb-24 lg:pb-6" : "flex-1"}>
          {currentView === 'dashboard' && user && (user.role === 'buyer' || (user.role === 'both' && activeMode === 'buyer')) && (
          <BuyerDashboard 
            user={user} 
            onNavigate={navigate}
            onViewProduct={handleViewProduct}
            onViewQuotes={handleViewQuotes}
          />
        )}
        
        {currentView === 'dashboard' && user && (user.role === 'seller' || (user.role === 'both' && activeMode === 'seller')) && (
          <SellerDashboard 
            user={user} 
            onNavigate={navigate}
          />
        )}
        
        {currentView === 'dashboard' && user && user.role === 'admin' && (
          <AdminDashboard 
            user={user} 
            onNavigate={navigate}
          />
        )}
        
        {currentView === 'catalog' && (
          <Catalog 
            onViewProduct={handleViewProduct}
            onViewSupplier={handleViewSupplier}
            onNavigate={navigate}
          />
        )}
        
        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onCreateRFQ={handleCreateRFQ}
            onOrderSample={handleOrderSample}
            onViewSupplier={handleViewSupplier}
            onBack={() => setCurrentView('catalog')}
          />
        )}        {currentView === 'supplier-profile' && selectedSupplier && (
          <SupplierProfile 
            supplierId={selectedSupplier}
            onBack={() => setCurrentView('catalog')}
          />
        )}
        
        {currentView === 'rfq-builder' && (
          <RFQBuilder 
            initialProduct={selectedProduct}
            user={user}
            onSubmit={(rfq) => {
              setSelectedRFQ(rfq);
              setCurrentView('quote-comparison');
            }}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'my-rfqs' && (
          <MyRFQs
            onBack={() => setCurrentView('dashboard')}
            onViewQuotes={handleViewQuotes}
          />
        )}
        
        {currentView === 'quote-comparison' && selectedRFQ && (
          <QuoteComparison 
            rfq={selectedRFQ}
            onAcceptQuote={handleCreatePO}
            onChat={() => setCurrentView('chat')}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'chat' && (
          <ChatInterface 
            user={user}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'purchase-order' && (
          <PurchaseOrder 
            user={user}
            quote={selectedQuote || undefined}
            onSubmit={(po) => {
              setSelectedPO(po);
              setCurrentView('dashboard');
            }}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'shipment-tracking' && selectedPO && (
          <ShipmentTracking 
            po={selectedPO}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'analytics' && user && (
          <Analytics 
            user={user}
          />
        )}
        
        {currentView === 'profile' && user && (
          <Profile 
            user={user}
            onLogout={() => {
              logout();
              setCurrentView('catalog');
            }}
          />
        )}
        
        {currentView === 'how-it-works' && (
          <HowItWorks onNavigate={navigate} />
        )}
        
        {currentView === 'about' && (
          <About onNavigate={navigate} />
        )}
          </main>
          
          {/* Footer - show only on public pages when not logged in */}
          {!user && ['catalog', 'how-it-works', 'about'].includes(currentView) && (
            <Footer onNavigate={navigate} />
          )}
          
          {user && (
            <MobileBottomNav 
              user={user}
              currentView={currentView}
              onNavigate={navigate}
              activeMode={activeMode}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
