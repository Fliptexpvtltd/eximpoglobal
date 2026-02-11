import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Login } from './components/Login';
import { NotificationPanel, Notification } from './components/NotificationPanel';
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
import { SEO, getOrganizationSchema, getWebSiteSchema, getBreadcrumbSchema, getFAQSchema, getServiceSchema, getProductSchema, getProductListSchema } from './components/SEO';

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
  specifications?: Record<string, string>;
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
  | 'verification'
  | 'mobile-preview'
  | 'how-it-works'
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
  | 'customs-clearance';

function AppContent() {
  const { user, isLoading, requireAuth, logout, login, signup, selectRole, googleAuth, authStep } = useAuth();
  
  // Initialize currentView from URL search params or localStorage
  const [currentView, setCurrentView] = useState<View>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const viewParam = searchParams.get('view');
    if (viewParam) {
      return viewParam as View;
    }
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
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  // Mark notification as read
  const handleMarkAsRead = (id: string) => {
    // Update local state
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
    
    // Call API to mark as read
    fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).catch(err => console.error('Error marking notification as read:', err));
  };

  // Dismiss notification
  const handleDismissNotification = (id: string) => {
    // Update local state
    setNotifications(notifications.filter((n) => n.id !== id));
    
    // Call API to dismiss
    fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).catch(err => console.error('Error dismissing notification:', err));
  };

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Listen for URL changes (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const viewParam = searchParams.get('view');
      if (viewParam) {
        setCurrentView(viewParam as View);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Close notification panel when navigating to a different page
    setNotificationPanelOpen(false);
  }, [currentView]);

  // Save currentView to localStorage whenever it changes (only for public views)
  useEffect(() => {
    const publicViews: View[] = ['catalog', 'how-it-works', 'about', 'mobile-preview', 'pricing', 'faq', 'privacy-policy', 'terms-of-service', 'cookie-policy', 'trade-assurance', 'logistics-solutions', 'quality-inspection', 'trade-financing', 'customs-clearance'];
    
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
    
    const protectedViews: View[] = ['dashboard', 'rfq-builder', 'my-rfqs', 'quote-comparison', 'chat', 'purchase-order', 'shipments', 'shipment-tracking', 'analytics', 'profile', 'settings', 'help'];
    
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

  const handleViewShipment = (po: PO) => {
    setSelectedPO(po);
    setCurrentView('shipment-tracking');
  };

  const navigate = (view: View | { view: View; productId?: string; orderId?: string }) => {
    // Handle object parameter for views that need additional data
    if (typeof view === 'object') {
      const { view: viewName, productId, orderId } = view;
      
      if (productId) {
        setSelectedProductId(productId);
      }
      
      if (orderId) {
        setSelectedOrderId(orderId);
      }
      
      const protectedViews: View[] = ['dashboard', 'rfq-builder', 'quote-comparison', 'chat', 'purchase-order', 'shipment-tracking', 'analytics', 'profile', 'edit-product', 'create-shipment', 'update-tracking'];
      
      if (protectedViews.includes(viewName) && !user) {
        requireAuth({ type: 'view-dashboard' });
        return;
      }
      
      setCurrentView(viewName);
      // Update URL with new view
      window.history.pushState(null, '', `?view=${viewName}`);
      return;
    }
    
    // Require auth for protected views
    const protectedViews: View[] = ['dashboard', 'rfq-builder', 'quote-comparison', 'chat', 'purchase-order', 'shipment-tracking', 'analytics', 'profile', 'edit-product', 'create-shipment', 'update-tracking'];
    
    if (protectedViews.includes(view) && !user) {
      requireAuth({ type: 'view-dashboard' });
      return;
    }
    
    setCurrentView(view);
    // Update URL with new view
    window.history.pushState(null, '', `?view=${view}`);
  };

  // Get SEO metadata based on current view
  const getSEOData = () => {
    const baseUrl = 'https://eximpoglobal.net';
    const canonicalUrl = `${baseUrl}?view=${currentView}`;

    switch (currentView) {
      case 'catalog':
        return {
          title: 'Browse Products - Global B2B Marketplace',
          description: 'Discover thousands of quality products from verified suppliers worldwide. Browse our extensive catalog of wholesale products for international trade.',
          keywords: 'B2B products, wholesale, suppliers, international trade, export products, import goods',
          structuredData: {
            '@context': 'https://schema.org',
            '@graph': [getOrganizationSchema(), getWebSiteSchema()],
          },
        };

      case 'product-detail':
        if (selectedProduct) {
          // Build description dynamically based on available data
          const descParts = [selectedProduct.description.substring(0, 155) + '...'];
          if (selectedProduct.moq) descParts.push(`MOQ: ${selectedProduct.moq} units`);
          if (selectedProduct.origin) descParts.push(`Origin: ${selectedProduct.origin}`);
          if (selectedProduct.price && selectedProduct.price > 0) {
            descParts.push(`Price: ${selectedProduct.currency} ${selectedProduct.price}`);
          } else {
            descParts.push(`Contact for Best Quote`);
          }
          
          return {
            title: `${selectedProduct.name} - Buy Wholesale from Verified Supplier`,
            description: descParts.join(' | '),
            keywords: `${selectedProduct.name}, ${selectedProduct.category}, wholesale ${selectedProduct.category}, ${selectedProduct.origin} supplier, buy ${selectedProduct.name}`,
            ogType: 'product' as const,
            ogImage: selectedProduct.image,
            structuredData: {
              '@context': 'https://schema.org',
              '@graph': [
                getOrganizationSchema(),
                getProductSchema({
                  name: selectedProduct.name,
                  description: selectedProduct.description,
                  image: selectedProduct.image,
                  price: selectedProduct.price,
                  currency: selectedProduct.currency,
                  availability: 'InStock',
                  category: selectedProduct.category,
                  brand: selectedProduct.supplierName,
                  sku: selectedProduct.id,
                  moq: selectedProduct.moq,
                  rating: selectedProduct.supplierRating,
                  reviewCount: 0, // You can add actual review count from your data
                  supplierName: selectedProduct.supplierName,
                  origin: selectedProduct.origin,
                  certifications: selectedProduct.certifications,
                }),
                getBreadcrumbSchema([
                  { name: 'Home', url: baseUrl },
                  { name: 'Products', url: `${baseUrl}?view=catalog` },
                  { name: selectedProduct.category, url: `${baseUrl}?view=catalog&category=${selectedProduct.category}` },
                  { name: selectedProduct.name, url: window.location.href },
                ]),
              ],
            },
          };
        }
        return {
          title: 'Product Details - EximpoGlobal',
          description: 'View detailed product information from verified B2B suppliers.',
          keywords: 'product details, B2B products, wholesale',
          structuredData: getOrganizationSchema(),
        };

      case 'supplier-profile':
        if (selectedSupplier) {
          return {
            title: `Verified Supplier Profile - Global Trade Partner`,
            description: 'Connect with verified B2B suppliers. View company profile, product range, certifications, and trade history. Safe and secure international trade partnerships.',
            keywords: 'verified supplier, B2B supplier, manufacturer, exporter, international supplier',
            structuredData: {
              '@context': 'https://schema.org',
              '@graph': [
                getOrganizationSchema(),
                getBreadcrumbSchema([
                  { name: 'Home', url: baseUrl },
                  { name: 'Suppliers', url: `${baseUrl}?view=catalog` },
                  { name: 'Supplier Profile', url: window.location.href },
                ]),
              ],
            },
          };
        }
        return {
          title: 'Supplier Profile - EximpoGlobal',
          description: 'View verified supplier profiles and company information.',
          keywords: 'supplier profile, B2B supplier, verified supplier',
          structuredData: getOrganizationSchema(),
        };

      case 'how-it-works':
        return {
          title: 'How It Works - Simple B2B Trade Process',
          description: 'Learn how EximpoGlobal simplifies international B2B trade. From browsing products to secure delivery - we handle everything for seamless global commerce.',
          keywords: 'B2B trade process, international trade guide, how to export, how to import',
          structuredData: getOrganizationSchema(),
        };

      case 'about':
        return {
          title: 'About Us - Your Trusted B2B Trade Partner',
          description: 'EximpoGlobal connects buyers and suppliers worldwide. Learn about our mission to democratize international trade with secure, efficient B2B marketplace solutions.',
          keywords: 'B2B marketplace, international trade platform, global trade network, export import company',
          structuredData: getOrganizationSchema(),
        };

      case 'pricing':
        return {
          title: 'Pricing Plans - Affordable B2B Trade Solutions',
          description: 'Transparent pricing for buyers and sellers. Choose from our flexible plans designed to grow your international trade business. No hidden fees.',
          keywords: 'B2B pricing, trade platform fees, marketplace costs, export import pricing',
          structuredData: getOrganizationSchema(),
        };

      case 'faq':
        return {
          title: 'FAQ - Frequently Asked Questions',
          description: 'Get answers to common questions about using EximpoGlobal B2B marketplace, payments, shipping, trade regulations, and more.',
          keywords: 'B2B marketplace FAQ, trade questions, import export help, platform support',
          structuredData: {
            '@context': 'https://schema.org',
            '@graph': [
              getOrganizationSchema(),
              // Add FAQ structured data when FAQ component has the questions
              getFAQSchema([
                {
                  question: 'What is EximpoGlobal?',
                  answer: 'EximpoGlobal is a B2B marketplace connecting buyers and suppliers worldwide for seamless international trade.',
                },
                {
                  question: 'How do I get started?',
                  answer: 'Sign up for free, complete your profile, and start browsing products or listing your products for sale.',
                },
                {
                  question: 'Is the platform secure?',
                  answer: 'Yes, we use industry-standard encryption and offer trade assurance for secure transactions.',
                },
              ]),
            ],
          },
        };

      case 'privacy-policy':
        return {
          title: 'Privacy Policy - Data Protection & Security',
          description: 'Learn how EximpoGlobal protects your personal data and privacy. Our commitment to secure, transparent data handling practices.',
          keywords: 'privacy policy, data protection, GDPR compliance, user privacy',
          structuredData: getOrganizationSchema(),
        };

      case 'terms-of-service':
        return {
          title: 'Terms of Service - Platform Usage Guidelines',
          description: 'Read our terms of service and user agreement. Understand your rights and responsibilities when using the EximpoGlobal B2B marketplace.',
          keywords: 'terms of service, user agreement, platform rules, legal terms',
          structuredData: getOrganizationSchema(),
        };

      case 'cookie-policy':
        return {
          title: 'Cookie Policy - How We Use Cookies',
          description: 'Learn about our cookie usage and how we use them to improve your experience on EximpoGlobal marketplace.',
          keywords: 'cookie policy, website cookies, tracking, user experience',
          structuredData: getOrganizationSchema(),
        };

      case 'trade-assurance':
        return {
          title: 'Trade Assurance - Secure Payment Protection',
          description: 'Protect your international trade transactions with our Trade Assurance program. Secure payments, quality guarantees, and on-time delivery protection.',
          keywords: 'trade assurance, payment protection, secure transactions, buyer protection',
          structuredData: getServiceSchema(
            'Trade Assurance',
            'Secure payment protection service for international B2B transactions with quality guarantees and delivery protection.'
          ),
        };

      case 'logistics-solutions':
        return {
          title: 'Logistics Solutions - Global Shipping & Freight',
          description: 'Comprehensive logistics solutions for international trade. Sea freight, air cargo, customs clearance, and door-to-door delivery services.',
          keywords: 'logistics solutions, international shipping, freight forwarding, customs clearance',
          structuredData: getServiceSchema(
            'Logistics Solutions',
            'End-to-end logistics and shipping services for international B2B trade including freight forwarding and customs clearance.'
          ),
        };

      case 'quality-inspection':
        return {
          title: 'Quality Inspection Services - Pre-Shipment Verification',
          description: 'Professional quality inspection services to verify product standards before shipment. Ensure quality compliance and reduce trade risks.',
          keywords: 'quality inspection, product verification, pre-shipment inspection, quality control',
          structuredData: getServiceSchema(
            'Quality Inspection',
            'Professional third-party quality inspection services to verify product quality and compliance before international shipment.'
          ),
        };

      case 'trade-financing':
        return {
          title: 'Trade Financing - Flexible Payment Solutions',
          description: 'Access trade financing options to grow your business. Flexible payment terms, letters of credit, and working capital solutions for importers and exporters.',
          keywords: 'trade financing, export financing, import financing, working capital, letters of credit',
          structuredData: getServiceSchema(
            'Trade Financing',
            'Flexible trade financing solutions including letters of credit, payment terms, and working capital for international B2B trade.'
          ),
        };

      case 'customs-clearance':
        return {
          title: 'Customs Clearance Services - Import/Export Documentation',
          description: 'Expert customs clearance and documentation services. Navigate import/export regulations smoothly with our compliance expertise.',
          keywords: 'customs clearance, import documentation, export compliance, trade regulations',
          structuredData: getServiceSchema(
            'Customs Clearance',
            'Professional customs clearance and documentation services to ensure smooth import/export compliance with international trade regulations.'
          ),
        };

      default:
        return {
          title: 'Global B2B Marketplace for International Trade',
          description: 'EximpoGlobal is your trusted B2B marketplace connecting buyers and suppliers worldwide. Discover quality products, verified suppliers, and seamless international trade solutions.',
          keywords: 'B2B marketplace, international trade, export, import, wholesale, suppliers, buyers, trade platform, global commerce',
          structuredData: {
            '@context': 'https://schema.org',
            '@graph': [getOrganizationSchema(), getWebSiteSchema()],
          },
        };
    }
  };

  const seoData = getSEOData();

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
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        structuredData={seoData.structuredData}
        canonical={`https://eximpoglobal.net?view=${currentView}`}
      />
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
              notifications={notifications}
              notificationPanelOpen={notificationPanelOpen}
              onToggleNotificationPanel={setNotificationPanelOpen}
              onMarkNotificationAsRead={handleMarkAsRead}
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
            onNavigate={navigate}
          />
        )}
        
        {currentView === 'catalog' && (
          <Catalog 
            user={user}
            onViewProduct={handleViewProduct}
            onViewSupplier={handleViewSupplier}
            onNavigate={navigate}
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
        
        {currentView === 'purchase-order' && user && user.role === 'buyer' && (
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
            onCancel={() => {
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
            onCancel={() => {
              setCurrentView('dashboard');
              setSelectedOrderId(null);
            }}
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
        
        {currentView === 'shipments' && user && user.role === 'buyer' && (
          <Shipments 
            user={user}
            onViewDetails={(shipmentId) => {
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
          />
        )}
        
        {currentView === 'help' && user && (
          <Help 
            user={user}
          />
        )}
        
        {currentView === 'add-product' && user && user.role === 'seller' && (
          <AddProduct 
            user={user}
            onBack={() => setCurrentView('catalog')}
            onSuccess={() => setCurrentView('catalog')}
          />
        )}
        
        {currentView === 'edit-product' && user && selectedProductId && user.role === 'seller' && (
          <EditProduct 
            productId={selectedProductId}
            user={user}
            onBack={() => setCurrentView('dashboard')}
            onSuccess={() => {
              setSelectedProductId(null);
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
          <HowItWorks onNavigate={navigate} />
        )}
        
        {currentView === 'about' && (
          <About onNavigate={navigate} />
        )}

        {currentView === 'pricing' && (
          <Pricing onNavigate={navigate} />
        )}

        {currentView === 'faq' && (
          <FAQ onNavigate={navigate} />
        )}

        {currentView === 'privacy-policy' && (
          <PrivacyPolicy onNavigate={navigate} />
        )}

        {currentView === 'terms-of-service' && (
          <TermsOfService onNavigate={navigate} />
        )}

        {currentView === 'cookie-policy' && (
          <CookiePolicy onNavigate={navigate} />
        )}

        {currentView === 'trade-assurance' && (
          <TradeAssurance onNavigate={navigate} />
        )}

        {currentView === 'logistics-solutions' && (
          <LogisticsSolutions onNavigate={navigate} />
        )}

        {currentView === 'quality-inspection' && (
          <QualityInspection onNavigate={navigate} />
        )}

        {currentView === 'trade-financing' && (
          <TradeFinancing onNavigate={navigate} />
        )}

        {currentView === 'customs-clearance' && (
          <CustomsClearance onNavigate={navigate} />
        )}
          </main>
          
          {/* Footer - show only on public pages when not logged in */}
          {!user && ['catalog', 'how-it-works', 'about', 'pricing', 'faq', 'privacy-policy', 'terms-of-service', 'cookie-policy', 'trade-assurance', 'logistics-solutions', 'quality-inspection', 'trade-financing', 'customs-clearance'].includes(currentView) && (
            <Footer onNavigate={navigate} />
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
