import { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
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
import { productService } from './services/productService';

export type UserRole = 'buyer' | 'seller' | 'both' | 'ops' | 'finance' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyName: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  phone?: string;
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
  images?: string[];
  description: string;
  variants: Array<{ name: string; value: string }>;
  specifications?: Record<string, any>;
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

// --- URL <-> View helpers ---

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function pathToView(pathname: string): View {
  if (pathname === '/' || pathname === '/catalog') return 'catalog';
  if (pathname === '/products/new') return 'add-product';
  if (pathname === '/products/manage') return 'manage-products';
  if (pathname === '/products/order') return 'manage-product-order';
  if (/^\/products\/[^/]+\/[^/]+\/edit$/.test(pathname)) return 'edit-product';
  if (/^\/products\/[^/]+\/[^/]+$/.test(pathname)) return 'product-detail';
  if (/^\/suppliers\/[^/]+$/.test(pathname)) return 'supplier-profile';
  if (pathname === '/dashboard') return 'dashboard';
  if (pathname === '/login') return 'auth';
  if (pathname === '/forgot-password') return 'forgot-password';
  if (pathname === '/verify-otp') return 'verify-otp';
  if (pathname === '/reset-password') return 'reset-password';
  if (pathname === '/rfq/new') return 'rfq-builder';
  if (pathname === '/rfqs') return 'my-rfqs';
  if (pathname === '/rfqs/all') return 'all-rfqs';
  if (/^\/rfqs\/[^/]+\/quote$/.test(pathname)) return 'submit-quote';
  if (/^\/rfqs\/[^/]+\/quotes$/.test(pathname)) return 'quote-comparison';
  if (pathname === '/chat') return 'chat';
  if (pathname === '/checkout') return 'checkout';
  if (pathname === '/purchase-order') return 'purchase-order';
  if (pathname === '/orders') return 'orders';
  if (/^\/orders\/[^/]+\/purchase$/.test(pathname)) return 'purchase-order';
  if (/^\/orders\/[^/]+$/.test(pathname)) return 'order-details';
  if (pathname === '/shipments') return 'shipments';
  if (/^\/shipments\/create\/[^/]+$/.test(pathname)) return 'create-shipment';
  if (/^\/shipments\/[^/]+\/tracking$/.test(pathname)) return 'update-tracking';
  if (/^\/shipments\/[^/]+$/.test(pathname)) return 'shipment-tracking';
  if (pathname === '/analytics') return 'analytics';
  if (pathname === '/profile') return 'profile';
  if (pathname === '/settings') return 'settings';
  if (pathname === '/help') return 'help';
  if (pathname === '/verification') return 'verification';
  if (pathname === '/mobile-preview') return 'mobile-preview';
  if (pathname === '/how-it-works') return 'how-it-works';
  if (pathname === '/about') return 'about';
  if (pathname === '/pricing') return 'pricing';
  if (pathname === '/faq') return 'faq';
  if (pathname === '/privacy-policy') return 'privacy-policy';
  if (pathname === '/terms-of-service') return 'terms-of-service';
  if (pathname === '/cookie-policy') return 'cookie-policy';
  if (pathname === '/trade-assurance') return 'trade-assurance';
  if (pathname === '/logistics-solutions') return 'logistics-solutions';
  if (pathname === '/quality-inspection') return 'quality-inspection';
  if (pathname === '/trade-financing') return 'trade-financing';
  if (pathname === '/customs-clearance') return 'customs-clearance';
  return 'catalog';
}

function getPathParams(pathname: string) {
  const productEditMatch = pathname.match(/^\/products\/[^/]+\/([^/]+)\/edit$/);
  const productMatch = pathname.match(/^\/products\/[^/]+\/([^/]+)$/);
  const supplierMatch = pathname.match(/^\/suppliers\/([^/]+)$/);
  const orderPurchaseMatch = pathname.match(/^\/orders\/([^/]+)\/purchase$/);
  const orderMatch = pathname.match(/^\/orders\/([^/]+)$/);
  const rfqMatch = pathname.match(/^\/rfqs\/([^/]+)\//);
  const shipmentCreateMatch = pathname.match(/^\/shipments\/create\/([^/]+)$/);
  const shipmentTrackingMatch = pathname.match(/^\/shipments\/([^/]+)\/tracking$/);
  const shipmentMatch = pathname.match(/^\/shipments\/([^/]+)$/);
  return {
    productId: productEditMatch?.[1] || productMatch?.[1] || null,
    supplierId: supplierMatch?.[1] || null,
    orderId: orderPurchaseMatch?.[1] || orderMatch?.[1] || shipmentCreateMatch?.[1] || shipmentTrackingMatch?.[1] || shipmentMatch?.[1] || null,
    rfqId: rfqMatch?.[1] || null,
  };
}

const VIEW_PATHS: Record<View, string> = {
  'catalog': '/',
  'dashboard': '/dashboard',
  'auth': '/login',
  'forgot-password': '/forgot-password',
  'verify-otp': '/verify-otp',
  'reset-password': '/reset-password',
  'rfq-builder': '/rfq/new',
  'my-rfqs': '/rfqs',
  'all-rfqs': '/rfqs/all',
  'chat': '/chat',
  'checkout': '/checkout',
  'purchase-order': '/purchase-order',
  'orders': '/orders',
  'shipments': '/shipments',
  'analytics': '/analytics',
  'profile': '/profile',
  'settings': '/settings',
  'help': '/help',
  'add-product': '/products/new',
  'manage-products': '/products/manage',
  'manage-product-order': '/products/order',
  'verification': '/verification',
  'mobile-preview': '/mobile-preview',
  'how-it-works': '/how-it-works',
  'about': '/about',
  'pricing': '/pricing',
  'faq': '/faq',
  'privacy-policy': '/privacy-policy',
  'terms-of-service': '/terms-of-service',
  'cookie-policy': '/cookie-policy',
  'trade-assurance': '/trade-assurance',
  'logistics-solutions': '/logistics-solutions',
  'quality-inspection': '/quality-inspection',
  'trade-financing': '/trade-financing',
  'customs-clearance': '/customs-clearance',
  // ID-based routes — resolved at call site
  'product-detail': '/products',
  'supplier-profile': '/suppliers',
  'order-details': '/orders',
  'edit-product': '/products',
  'submit-quote': '/rfqs',
  'quote-comparison': '/rfqs',
  'shipment-tracking': '/shipments',
  'create-shipment': '/shipments',
  'update-tracking': '/shipments',
};

type NavigateArg =
  | View
  | { view: View; productId?: string; productName?: string; orderId?: string; rfqId?: string; supplierId?: string };

function buildPath(arg: NavigateArg): string {
  if (typeof arg === 'string') return VIEW_PATHS[arg] || '/';
  const { view: v, productId, productName, orderId, rfqId, supplierId } = arg;
  const slug = productName ? toSlug(productName) : 'product';
  switch (v) {
    case 'product-detail': return `/products/${slug}/${productId}`;
    case 'supplier-profile': return `/suppliers/${supplierId}`;
    case 'order-details': return `/orders/${orderId}`;
    case 'edit-product': return `/products/${slug}/${productId}/edit`;
    case 'submit-quote': return `/rfqs/${rfqId}/quote`;
    case 'quote-comparison': return `/rfqs/${rfqId}/quotes`;
    case 'create-shipment': return `/shipments/create/${orderId}`;
    case 'update-tracking': return `/shipments/${orderId}/tracking`;
    case 'shipment-tracking': return `/shipments/${orderId}`;
    default: return VIEW_PATHS[v] || '/';
  }
}

function AppContent() {
  const { user, isLoading, requireAuth, logout, login, signup, selectRole, googleAuth, authStep } = useAuth();
  const rnNavigate = useNavigate();
  const location = useLocation();

  // Derive currentView from URL
  const currentView = pathToView(location.pathname);
  const pathParams = getPathParams(location.pathname);

  // Extract rich objects passed via router state (set during internal navigation)
  const selectedProduct: Product | null = location.state?.product ?? null;
  const selectedProductId: string | null = location.state?.productId ?? pathParams.productId;

  // Fetch product from API when arriving via deep link (no state)
  const [fetchedProduct, setFetchedProduct] = useState<Product | null>(null);
  useEffect(() => {
    if (currentView === 'product-detail' && !selectedProduct && selectedProductId) {
      setFetchedProduct(null);
      productService.getProductById(selectedProductId).then(res => {
        if (res.success && res.data) setFetchedProduct(res.data);
      }).catch(() => {});
    } else {
      setFetchedProduct(null);
    }
  }, [currentView, selectedProductId, selectedProduct]);
  const selectedSupplier: string | null = location.state?.supplierId ?? pathParams.supplierId;
  const selectedRFQ: RFQ | null = location.state?.rfq ?? null;
  const selectedQuote: Quote | null = location.state?.quote ?? null;
  const selectedPO: PO | null = location.state?.po ?? null;
  const selectedOrderId: string | null = location.state?.orderId ?? pathParams.orderId;
  const selectedRfqId: string | null = location.state?.rfqId ?? pathParams.rfqId;

  // Transient state not tied to URL
  const [resetEmail, setResetEmail] = useState('');
  const [resetOTP, setResetOTP] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Redirect from /login to /dashboard after successful login
  useEffect(() => {
    if (currentView === 'auth' && user && !isLoading) {
      console.log('✅ User logged in, redirecting to dashboard');
      rnNavigate('/dashboard', { replace: true });
    }
  }, [user, currentView, isLoading]);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (isLoading) return;
    const protectedViews: View[] = ['dashboard', 'rfq-builder', 'my-rfqs', 'quote-comparison', 'chat', 'purchase-order', 'shipments', 'shipment-tracking', 'analytics', 'profile', 'settings', 'help', 'orders'];
    if (protectedViews.includes(currentView) && !user) {
      console.log('🔒 Protected view without auth, redirecting to catalog');
      rnNavigate('/', { replace: true });
    }
  }, [user, currentView, isLoading]);

  // Listen for pending action execution
  useEffect(() => {
    const handlePendingAction = (event: any) => {
      const action = event.detail;
      if (!action) return;

      switch (action.type) {
        case 'create-rfq':
          rnNavigate('/rfq/new', { state: { product: action.data?.product } });
          break;
        case 'order-sample':
          rnNavigate('/rfq/new', { state: { product: action.data?.product } });
          break;
        case 'request-information':
          if (action.data?.product) {
            rnNavigate(`/products/${action.data.product.id}`, { state: { product: action.data.product } });
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('open-inquiry-form'));
            }, 100);
          }
          break;
        case 'view-quotes':
          if (action.data?.rfq) {
            rnNavigate(`/rfqs/${action.data.rfq.id}/quotes`, { state: { rfq: action.data.rfq } });
          }
          break;
        case 'view-dashboard':
          rnNavigate('/dashboard');
          break;
        case 'browse-catalog':
          rnNavigate('/');
          break;
        case 'my-rfqs':
          rnNavigate('/rfqs');
          break;
        case 'chat':
          rnNavigate('/chat');
          break;
        case 'create-po':
          rnNavigate('/purchase-order');
          break;
      }
    };

    window.addEventListener('execute-pending-action', handlePendingAction);
    return () => window.removeEventListener('execute-pending-action', handlePendingAction);
  }, [rnNavigate]);

  // Listen for navigate to auth event
  useEffect(() => {
    const handleNavigateToAuth = () => {
      rnNavigate('/login');
    };

    window.addEventListener('navigate-to-auth', handleNavigateToAuth);
    return () => window.removeEventListener('navigate-to-auth', handleNavigateToAuth);
  }, [rnNavigate]);

  const handleViewProduct = (product: Product) => {
    rnNavigate(`/products/${toSlug(product.name)}/${product.id}`, { state: { product } });
  };

  const handleViewSupplier = (supplierId: string) => {
    rnNavigate(`/suppliers/${supplierId}`, { state: { supplierId } });
  };

  const handleContactSupplier = (supplierId: string) => {
    rnNavigate('/chat', { state: { supplierId } });
  };

  const handleCreateRFQ = (product: Product) => {
    requireAuth({ type: 'create-rfq', data: { product } });
  };

  const handleOrderSample = (product: Product) => {
    requireAuth({ type: 'order-sample', data: { product } });
  };

  const handleViewQuotes = (rfq: RFQ) => {
    requireAuth({ type: 'view-quotes', data: { rfq } });
  };

  const handleCreatePO = (quote: Quote) => {
    rnNavigate('/purchase-order', { state: { quote } });
  };

  const navigate = (arg: NavigateArg | { view: View; productId?: string; orderId?: string; rfqId?: string; supplierId?: string }, data?: any) => {
    // Handle 2-argument form: navigate('edit-product', { productId })
    if (typeof arg === 'string' && data) {
      const path = buildPath({ view: arg as View, ...data });
      const protectedViews: View[] = ['dashboard', 'rfq-builder', 'quote-comparison', 'chat', 'purchase-order', 'shipment-tracking', 'analytics', 'profile', 'edit-product', 'create-shipment', 'update-tracking', 'submit-quote', 'all-rfqs', 'manage-products', 'orders'];
      if (protectedViews.includes(arg as View) && !user) { requireAuth({ type: 'view-dashboard' }); return; }
      rnNavigate(path, { state: data });
      return;
    }

    const viewName = typeof arg === 'string' ? arg : (arg as any).view;
    const protectedViews: View[] = ['dashboard', 'rfq-builder', 'quote-comparison', 'chat', 'purchase-order', 'shipment-tracking', 'analytics', 'profile', 'edit-product', 'create-shipment', 'update-tracking', 'submit-quote', 'all-rfqs', 'manage-products', 'orders'];

    if (protectedViews.includes(viewName) && !user) {
      requireAuth({ type: 'view-dashboard' });
      return;
    }

    const path = buildPath(arg as NavigateArg);
    const state = typeof arg === 'object' ? arg : undefined;
    rnNavigate(path, state ? { state } : undefined);
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
          onBack={() => rnNavigate('/login')} 
          onSuccess={(email) => {
            setResetEmail(email);
            rnNavigate('/verify-otp');
          }}
        />
      )}

      {currentView === 'verify-otp' && (
        <VerifyOTP
          email={resetEmail}
          onSuccess={(otp) => {
            setResetOTP(otp);
            rnNavigate('/reset-password');
          }}
          onBack={() => {
            setResetEmail('');
            rnNavigate('/forgot-password');
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
            rnNavigate('/login');
          }}
          onBack={() => rnNavigate('/verify-otp')}
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
                onForgotPassword={() => rnNavigate('/forgot-password')}
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
                rnNavigate('/');
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
        
        {currentView === 'dashboard' && user && (user.role === 'seller' || user.role === 'both') && (
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
        
        {currentView === 'product-detail' && (selectedProduct || fetchedProduct) && (
          <ProductDetail
            product={(selectedProduct || fetchedProduct)!}
            user={user}
            onCreateRFQ={handleCreateRFQ}
            onOrderSample={handleOrderSample}
            onRequestInformation={(product) => requireAuth({ type: 'request-information', data: { product } })}
            onViewSupplier={handleViewSupplier}
            onContactSupplier={handleContactSupplier}
            onNavigateToCheckout={() => rnNavigate('/checkout', { state: { product: selectedProduct || fetchedProduct } })}
            onBack={() => rnNavigate('/')}
          />
        )}

        {currentView === 'supplier-profile' && selectedSupplier && (
          <SupplierProfile 
            supplierId={selectedSupplier}
            user={user}
            onBack={() => rnNavigate('/')}
          />
        )}
        
        {currentView === 'rfq-builder' && user && (user.role === 'buyer' || user.role === 'both') && (
          <RFQBuilder 
            initialProduct={selectedProduct}
            user={user}
            onSubmit={(rfq) => {
              rnNavigate(`/rfqs/${rfq.id}/quotes`, { state: { rfq } });
            }}
            onCancel={() => rnNavigate('/dashboard')}
          />
        )}
        
        {currentView === 'my-rfqs' && user && (user.role === 'buyer' || user.role === 'both') && (
          <MyRFQs
            onBack={() => rnNavigate('/dashboard')}
            onViewQuotes={handleViewQuotes}
          />
        )}
        
        {currentView === 'quote-comparison' && selectedRFQ && user && (user.role === 'buyer' || user.role === 'both') && (
          <QuoteComparison 
            rfq={selectedRFQ}
            user={user}
            onAcceptQuote={handleCreatePO}
            onChat={() => rnNavigate('/chat')}
            onBack={() => rnNavigate('/dashboard')}
          />
        )}
        
        {currentView === 'chat' && user && (
          <ChatInterface 
            user={user}
            partnerId={selectedSupplier || undefined}
            onBack={() => {
              rnNavigate('/');
            }}
          />
        )}
        
        {currentView === 'checkout' && selectedProduct && user && (
          <Checkout
            product={selectedProduct}
            user={user}
            onBack={() => rnNavigate(`/products/${toSlug(selectedProduct.name)}/${selectedProduct.id}`, { state: { product: selectedProduct } })}
            onSuccess={(order) => {
              rnNavigate('/orders', { state: { orderId: order.id } });
            }}
          />
        )}

        {currentView === 'purchase-order' && user && (user.role === 'buyer' || user.role === 'seller' || user.role === 'both') && (
          <PurchaseOrder 
            user={user}
            orderId={selectedOrderId || undefined}
            quote={selectedQuote || undefined}
            onSubmit={(po) => {
              rnNavigate('/dashboard', { state: { po } });
            }}
            onCancel={() => rnNavigate('/dashboard')}
          />
        )}
        
        {currentView === 'shipment-tracking' && selectedPO && user && (user.role === 'buyer' || user.role === 'both') && (
          <ShipmentTracking 
            po={selectedPO}
            user={user}
            onBack={() => rnNavigate('/dashboard')}
          />
        )}
        
        {currentView === 'create-shipment' && selectedOrderId && user && (user.role === 'seller' || user.role === 'both') && (
          <CreateShipment 
            orderId={selectedOrderId}
            orderNumber={`ORD-${selectedOrderId}`}
            onSuccess={() => rnNavigate('/dashboard')}
            onBack={() => rnNavigate('/dashboard')}
          />
        )}
        
        {currentView === 'update-tracking' && selectedOrderId && user && (user.role === 'seller' || user.role === 'both') && (
          <UpdateShipmentTracking 
            shipmentId={selectedOrderId}
            orderNumber={`ORD-${selectedOrderId}`}
            currentStatus="in_transit"
            onSuccess={() => rnNavigate('/dashboard')}
            onBack={() => rnNavigate('/dashboard')}
          />
        )}
        
        {currentView === 'order-details' && selectedOrderId && user && (
          <OrderDetails
            orderId={selectedOrderId}
            onBack={() => rnNavigate('/orders')}
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
              rnNavigate(`/orders/${orderId}`, { state: { orderId } });
            }}
          />
        )}
        
        {currentView === 'profile' && user && (
          <Profile 
            user={user}
            onLogout={() => {
              logout();
              rnNavigate('/');
            }}
          />
        )}
        
        {currentView === 'shipments' && user && (user.role === 'buyer' || user.role === 'both') && (
          <Shipments 
            user={user}
            activeMode={(user.role === 'buyer' || user.role === 'both') ? 'buyer' : 'buyer'}
            onViewDetails={() => {
              if (selectedPO) {
                rnNavigate(`/shipments/${selectedPO.id}`, { state: { po: selectedPO } });
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
        
        {currentView === 'add-product' && user && (user.role === 'seller' || user.role === 'both') && (
          <AddProduct 
            user={user}
            activeMode={(user.role === 'seller' || user.role === 'both') ? 'seller' : 'buyer'}
            onBack={() => rnNavigate('/')}
            onSuccess={() => rnNavigate('/')}
          />
        )}
        
        {currentView === 'edit-product' && user && selectedProductId && (user.role === 'seller' || user.role === 'both') && (
          <EditProduct 
            productId={selectedProductId}
            user={user}
            activeMode={(user.role === 'seller' || user.role === 'both') ? 'seller' : 'buyer'}
            onBack={() => rnNavigate('/dashboard')}
            onSuccess={() => rnNavigate('/dashboard')}
          />
        )}
        
        {currentView === 'manage-product-order' && user && (user.role === 'seller' || user.role === 'both') && (
          <ProductOrderManager 
            user={user}
            onBack={() => rnNavigate('/dashboard')}
          />
        )}
        
        {currentView === 'manage-products' && user && (user.role === 'seller' || user.role === 'both') && (
          <ProductManagement 
            user={user}
            onNavigate={(view: any, data?: any) => {
              navigate(view as View, data);
            }}
          />
        )}
        
        {currentView === 'all-rfqs' && user && (user.role === 'seller' || user.role === 'both') && (
          <AllRFQs 
            user={user}
            onNavigate={(view: any) => navigate(view as View)}
            onBack={() => rnNavigate('/dashboard')}
          />
        )}
        
        {currentView === 'submit-quote' && user && selectedRfqId && (user.role === 'seller' || user.role === 'both') && (
          <SubmitQuote 
            user={user}
            rfqId={selectedRfqId}
            onBack={() => rnNavigate('/dashboard')}
            onSuccess={() => rnNavigate('/dashboard')}
          />
        )}
        
        {currentView === 'verification' && user && (
          <VerificationPage 
            user={user}
            onBack={() => rnNavigate('/dashboard')}
            onComplete={() => rnNavigate('/dashboard')}
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
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
