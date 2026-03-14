import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { RoleSelection } from './components/RoleSelection';
import { BuyerDashboard } from './components/BuyerDashboard';
import { SellerDashboard } from './components/SellerDashboard';
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
import { Shipments } from './components/Shipments';
import { Settings } from './components/Settings';
import { Help } from './components/Help';
import { AddProduct } from './components/AddProduct';
import { ProductOrderManager } from './components/ProductOrderManager';
import { ProductManagement } from './components/ProductManagement';
import { OrdersList } from './components/OrdersList';
import { OrderDetails } from './components/OrderDetails';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
import { EditProduct } from './components/EditProduct';
import { VerificationPage } from './components/VerificationPage';
import { CreateShipment } from './components/CreateShipment';
import { UpdateShipmentTracking } from './components/UpdateShipmentTracking';
import { ForgotPassword } from './components/ForgotPassword';
import { VerifyOTP } from './components/VerifyOTP';
import { ResetPassword } from './components/ResetPassword';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { CookiePolicy } from './components/CookiePolicy';
import { TradeAssurance } from './components/TradeAssurance';
import { LogisticsSolutions } from './components/LogisticsSolutions';
import { QualityInspection } from './components/QualityInspection';
import { TradeFinancing } from './components/TradeFinancing';
import { CustomsClearance } from './components/CustomsClearance';
import { SubmitQuote } from './components/SubmitQuote';
import { AllRFQs } from './components/AllRFQs';
import { Checkout } from './components/Checkout';

export type UserRole = 'buyer' | 'seller' | 'ops' | 'finance' | 'admin';

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
  | 'auth'
  | 'rfq-builder'
  | 'my-rfqs'
  | 'all-rfqs'
  | 'submit-quote'
  | 'quote-comparison'
  | 'chat'
  | 'purchase-order'
  | 'shipments'
  | 'shipment-tracking'
  | 'create-shipment'
  | 'update-tracking'
  | 'profile'
  | 'analytics'
  | 'settings'
  | 'help'
  | 'add-product'
  | 'edit-product'
  | 'manage-products'
  | 'manage-product-order'
  | 'verification'
  | 'mobile-preview'
  | 'how-it-works'
  | 'orders'
  | 'forgot-password'
  | 'verify-otp'
  | 'reset-password'
  | 'about'
  | 'pricing'
  | 'faq'
  | 'privacy-policy'
  | 'terms-of-service'
  | 'cookie-policy'
  | 'trade-assurance'
  | 'logistics-solutions'
  | 'quality-inspection'
  | 'trade-financing'
  | 'customs-clearance'
  | 'checkout'
  | 'order-details';

function AppContent() {
  const { user, isLoading, requireAuth, logout, login, signup, selectRole, googleAuth, authStep } = useAuth();
  const [currentView, setCurrentView] = useState<View>(() => {
    const saved = localStorage.getItem('currentView');
    return (saved as View) || 'catalog';
  });
  const [resetEmail, setResetEmail] = useState('');
  const [resetOTP, setResetOTP] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedPO, setSelectedPO] = useState<PO | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // Save currentView to localStorage whenever it changes (only for public views)
  useEffect(() => {
    const publicViews: View[] = ['catalog', 'how-it-works', 'about', 'mobile-preview'];
    
    if (publicViews.includes(currentView)) {
      localStorage.setItem('currentView', currentView);
    } else if (user) {
      // Only save protected views if user is authenticated
      localStorage.setItem('currentView', currentView);
    }
  }, [currentView, user]);

  // Redirect from auth page to dashboard after successful login
  useEffect(() => {
    if (currentView === 'auth' && user && !isLoading) {
      console.log('✅ User logged in, redirecting to dashboard');
      setCurrentView('dashboard');
    }
  }, [user, currentView, isLoading]);

  // Check if user is on a protected view without authentication (after loading completes)
  useEffect(() => {
    if (isLoading) return; // Don't redirect while still loading
    
    const protectedViews: View[] = ['dashboard', 'rfq-builder', 'my-rfqs', 'quote-comparison', 'chat', 'purchase-order', 'shipments', 'shipment-tracking', 'analytics', 'profile', 'settings', 'help', 'orders'];
    
    // If on protected view and no user (and done loading), redirect to catalog
    if (protectedViews.includes(currentView) && !user) {
      console.log('🔒 Protected view without auth, redirecting to catalog');
      setCurrentView('catalog');
    }
  }, [user, currentView, isLoading]);

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

  // Listen for navigate to auth event
  useEffect(() => {
    const handleNavigateToAuth = () => {
      setCurrentView('auth');
    };

    window.addEventListener('navigate-to-auth', handleNavigateToAuth);
    return () => window.removeEventListener('navigate-to-auth', handleNavigateToAuth);
  }, []);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  const handleViewSupplier = (supplierId: string) => {
    setSelectedSupplier(supplierId);
    setCurrentView('supplier-profile');
  };

  const handleContactSupplier = (supplierId: string) => {
    setSelectedSupplier(supplierId);
    setCurrentView('chat');
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

  const navigate = (view: View | { view: View; productId?: string; orderId?: string; rfqId?: string }) => {
    // Handle object parameter for views that need additional data
    if (typeof view === 'object') {
      const { view: viewName, productId, orderId, rfqId } = view;
      
      if (productId) {
        setSelectedProductId(productId);
      }
      
      if (orderId) {
        setSelectedOrderId(orderId);
      }
      
      if (rfqId) {
        setSelectedRfqId(rfqId);
      }
      
      const protectedViews: View[] = ['dashboard', 'rfq-builder', 'quote-comparison', 'chat', 'purchase-order', 'shipment-tracking', 'analytics', 'profile', 'edit-product', 'create-shipment', 'update-tracking', 'submit-quote', 'all-rfqs', 'manage-products', 'orders'];
      
      if (protectedViews.includes(viewName) && !user) {
        requireAuth({ type: 'view-dashboard' });
        return;
      }
      
      setCurrentView(viewName);
      return;
    }
    
    // Require auth for protected views
    const protectedViews: View[] = ['dashboard', 'rfq-builder', 'quote-comparison', 'chat', 'purchase-order', 'shipment-tracking', 'analytics', 'profile', 'edit-product', 'create-shipment', 'update-tracking', 'submit-quote', 'all-rfqs', 'manage-products', 'orders'];
    
    if (protectedViews.includes(view) && !user) {
      requireAuth({ type: 'view-dashboard' });
      return;
    }
    
    setCurrentView(view);
  };

  // Notification handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Mobile Preview can be accessed without login
  if (currentView === 'mobile-preview') {
    return <MobilePreview />;
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentView === 'forgot-password' && (
        <ForgotPassword 
          onBack={() => setCurrentView('auth')} 
          onSuccess={(email) => {
            setResetEmail(email);
            setCurrentView('verify-otp');
          }}
        />
      )}

      {currentView === 'verify-otp' && (
        <VerifyOTP
          email={resetEmail}
          onSuccess={(otp) => {
            setResetOTP(otp);
            setCurrentView('reset-password');
          }}
          onBack={() => {
            setResetEmail('');
            setCurrentView('forgot-password');
          }}
          onResend={async () => {
            try {
              await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail }),
              });
            } catch (error) {
              console.error('Failed to resend OTP');
            }
          }}
        />
      )}

      {currentView === 'reset-password' && (
        <ResetPassword 
          email={resetEmail}
          otp={resetOTP}
          onSuccess={() => {
            setResetEmail('');
            setResetOTP('');
            setCurrentView('auth');
          }}
          onBack={() => setCurrentView('verify-otp')}
        />
      )}

      {currentView === 'auth' && (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-full max-w-full sm:max-w-[600px] sm:bg-white sm:rounded-2xl sm:shadow-xl px-6 py-8 sm:p-8 relative">
            <button
              onClick={() => navigate('catalog')}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {authStep === 'login' ? (
              <Login 
                onLogin={login}
                onSignup={signup}
                onGoogleAuth={googleAuth}
                onForgotPassword={() => setCurrentView('forgot-password')}
                isModal={false}
              />
            ) : (
              <RoleSelection 
                onSelectRole={selectRole}
                onBack={() => {}}
                isModal={false}
              />
            )}
          </div>
        </div>
      )}
      
      {currentView !== 'auth' && (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar - only show when logged in */}
        {user && (
          <Sidebar 
            user={user} 
            currentView={currentView} 
            onNavigate={(view: any) => navigate(view as View)}
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
              onNavigate={(view: any) => navigate(view as View)}
              onLogout={() => {
                logout();
                setCurrentView('catalog');
              }}
              notifications={notifications}
              notificationPanelOpen={notificationPanelOpen}
              onToggleNotificationPanel={setNotificationPanelOpen}
              onMarkNotificationAsRead={handleMarkNotificationAsRead}
              onDismissNotification={handleDismissNotification}
            />
          )}
          
          {/* Main Content */}
          <main className={user ? "flex-1 max-w-7xl mx-auto w-full px-4 py-6 pb-24 lg:pb-6" : "flex-1"}>
          {currentView === 'dashboard' && user && user.role === 'buyer' && (
          <BuyerDashboard 
            user={user} 
            onNavigate={navigate}
            onViewProduct={handleViewProduct}
            onViewQuotes={handleViewQuotes}
          />
        )}
        
        {currentView === 'dashboard' && user && user.role === 'seller' && (
          <SellerDashboard 
            user={user} 
            onNavigate={(view: any) => navigate(view as View)}
          />
        )}
        
        {currentView === 'catalog' && (
          <Catalog 
            user={user}
            onViewProduct={handleViewProduct}
            onViewSupplier={handleViewSupplier}
            onNavigate={(view: any) => navigate(view as View)}
          />
        )}
        
        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            user={user}
            onCreateRFQ={handleCreateRFQ}
            onOrderSample={handleOrderSample}
            onViewSupplier={handleViewSupplier}
            onContactSupplier={handleContactSupplier}
            onNavigateToCheckout={() => setCurrentView('checkout')}
            onBack={() => setCurrentView('catalog')}
          />
        )}        {currentView === 'supplier-profile' && selectedSupplier && (
          <SupplierProfile 
            supplierId={selectedSupplier}
            user={user}
            onBack={() => setCurrentView('catalog')}
          />
        )}
        
        {currentView === 'rfq-builder' && user && user.role === 'buyer' && (
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
        
        {currentView === 'my-rfqs' && user && user.role === 'buyer' && (
          <MyRFQs
            onBack={() => setCurrentView('dashboard')}
            onViewQuotes={handleViewQuotes}
          />
        )}
        
        {currentView === 'quote-comparison' && selectedRFQ && user && user.role === 'buyer' && (
          <QuoteComparison 
            rfq={selectedRFQ}
            user={user}
            onAcceptQuote={handleCreatePO}
            onChat={() => setCurrentView('chat')}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'chat' && user && (
          <ChatInterface 
            user={user}
            partnerId={selectedSupplier || undefined}
            onBack={() => {
              setSelectedSupplier(null);
              setCurrentView('catalog');
            }}
          />
        )}
        
        {currentView === 'checkout' && selectedProduct && user && (
          <Checkout
            product={selectedProduct}
            user={user}
            onBack={() => setCurrentView('product-detail')}
            onSuccess={(order) => {
              setSelectedOrderId(order.id);
              setCurrentView('orders');
            }}
          />
        )}

        {currentView === 'purchase-order' && user && (user.role === 'buyer' || user.role === 'seller') && (
          <PurchaseOrder 
            user={user}
            orderId={selectedOrderId || undefined}
            quote={selectedQuote || undefined}
            onSubmit={(po) => {
              setSelectedPO(po);
              setCurrentView('dashboard');
            }}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'shipment-tracking' && selectedPO && user && user.role === 'buyer' && (
          <ShipmentTracking 
            po={selectedPO}
            user={user}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'create-shipment' && selectedOrderId && user && user.role === 'seller' && (
          <CreateShipment 
            orderId={selectedOrderId}
            orderNumber={`ORD-${selectedOrderId}`}
            onSuccess={() => {
              setCurrentView('dashboard');
              setSelectedOrderId(null);
            }}
            onBack={() => {
              setCurrentView('dashboard');
              setSelectedOrderId(null);
            }}
          />
        )}
        
        {currentView === 'update-tracking' && selectedOrderId && user && user.role === 'seller' && (
          <UpdateShipmentTracking 
            shipmentId={selectedOrderId}
            orderNumber={`ORD-${selectedOrderId}`}
            currentStatus="in_transit"
            onSuccess={() => {
              setCurrentView('dashboard');
              setSelectedOrderId(null);
            }}
            onBack={() => {
              setCurrentView('dashboard');
              setSelectedOrderId(null);
            }}
          />
        )}
        
        {currentView === 'order-details' && selectedOrderId && user && (
          <OrderDetails
            orderId={selectedOrderId}
            onBack={() => setCurrentView('orders')}
          />
        )}

        {currentView === 'analytics' && user && (
          <Analytics 
            user={user}
          />
        )}
        
        {currentView === 'orders' && user && (
          <OrdersList 
            onViewOrder={(orderId) => {
              setSelectedOrderId(orderId);
              setCurrentView('order-details');
            }}
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
        
        {currentView === 'shipments' && user && user.role === 'buyer' && (
          <Shipments 
            user={user}
            activeMode={user.role}
            onViewDetails={() => {
              // TODO: Fetch PO by shipment ID
              // For now, use selectedPO if available
              if (selectedPO) {
                setCurrentView('shipment-tracking');
              }
            }}
          />
        )}
        
        {currentView === 'settings' && user && (
          <Settings 
            user={user}
            activeMode={user.role === 'seller' ? 'seller' : 'buyer'}
          />
        )}
        
        {currentView === 'help' && user && (
          <Help 
            user={user}
            activeMode={user.role === 'seller' ? 'seller' : 'buyer'}
          />
        )}
        
        {currentView === 'add-product' && user && user.role === 'seller' && (
          <AddProduct 
            user={user}
            activeMode={user.role}
            onBack={() => setCurrentView('catalog')}
            onSuccess={() => setCurrentView('catalog')}
          />
        )}
        
        {currentView === 'edit-product' && user && selectedProductId && user.role === 'seller' && (
          <EditProduct 
            productId={selectedProductId}
            user={user}
            activeMode={user.role}
            onBack={() => setCurrentView('dashboard')}
            onSuccess={() => {
              setSelectedProductId(null);
              setCurrentView('dashboard');
            }}
          />
        )}
        
        {currentView === 'manage-product-order' && user && user.role === 'seller' && (
          <ProductOrderManager 
            user={user}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'manage-products' && user && user.role === 'seller' && (
          <ProductManagement 
            user={user}
            onNavigate={(view: any, data?: any) => {
              if (data?.productId) {
                setSelectedProductId(data.productId);
              }
              setCurrentView(view as View);
            }}
          />
        )}
        
        {currentView === 'all-rfqs' && user && user.role === 'seller' && (
          <AllRFQs 
            user={user}
            onNavigate={(view: any) => navigate(view as View)}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'submit-quote' && user && selectedRfqId && user.role === 'seller' && (
          <SubmitQuote 
            user={user}
            rfqId={selectedRfqId}
            onBack={() => {
              setSelectedRfqId(null);
              setCurrentView('dashboard');
            }}
            onSuccess={() => {
              setSelectedRfqId(null);
              setCurrentView('dashboard');
            }}
          />
        )}
        
        {currentView === 'verification' && user && (
          <VerificationPage 
            user={user}
            onBack={() => setCurrentView('dashboard')}
            onComplete={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'how-it-works' && (
          <HowItWorks onNavigate={(view: any) => navigate(view as View)} />
        )}
        
        {currentView === 'about' && (
          <About onNavigate={(view: any) => navigate(view as View)} />
        )}

        {currentView === 'pricing' && (
          <Pricing onNavigate={(view: any) => navigate(view as View)} />
        )}

        {currentView === 'faq' && (
          <FAQ onNavigate={(view: any) => navigate(view as View)} />
        )}

        {currentView === 'privacy-policy' && (
          <PrivacyPolicy onNavigate={(view: any) => navigate(view as View)} />
        )}

        {currentView === 'terms-of-service' && (
          <TermsOfService onNavigate={(view: any) => navigate(view as View)} />
        )}

        {currentView === 'cookie-policy' && (
          <CookiePolicy onNavigate={(view: any) => navigate(view as View)} />
        )}

        {currentView === 'trade-assurance' && (
          <TradeAssurance onNavigate={(view: any) => navigate(view as View)} />
        )}

        {currentView === 'logistics-solutions' && (
          <LogisticsSolutions onNavigate={(view: any) => navigate(view as View)} />
        )}

        {currentView === 'quality-inspection' && (
          <QualityInspection onNavigate={(view: any) => navigate(view as View)} />
        )}

        {currentView === 'trade-financing' && (
          <TradeFinancing onNavigate={(view: any) => navigate(view as View)} />
        )}

        {currentView === 'customs-clearance' && (
          <CustomsClearance onNavigate={(view: any) => navigate(view as View)} />
        )}
          </main>
          
          {/* Footer - show only on public pages when not logged in */}
          {!user && ['catalog', 'how-it-works', 'about', 'pricing', 'faq', 'privacy-policy', 'terms-of-service', 'cookie-policy', 'trade-assurance', 'logistics-solutions', 'quality-inspection', 'trade-financing', 'customs-clearance'].includes(currentView) && (
            <Footer onNavigate={(view: any) => navigate(view as View)} />
          )}
          
          <MobileBottomNav 
            user={user}
            currentView={currentView}
            onNavigate={navigate}
          />
        </div>
      </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <AppContent />
    </AuthProvider>
  );
}
