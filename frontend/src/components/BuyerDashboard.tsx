import { useState, useEffect } from 'react';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, Clock, IndianRupee, Package, TrendingUp, MessageSquare, FileText, ShieldCheck } from 'lucide-react';
import type { User, Product, RFQ } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { productService, rfqService, analyticsService } from '../services';
import { useApi } from '../hooks/useApi';
import type { Product as ApiProduct, RFQ as ApiRFQ, BuyerAnalytics } from '../services';

interface BuyerDashboardProps {
  user: User;
  onNavigate: (view: any) => void;
  onViewProduct: (product: Product) => void;
  onViewQuotes: (rfq: RFQ) => void;
}

export function BuyerDashboard({ user, onNavigate, onViewProduct, onViewQuotes }: BuyerDashboardProps) {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    fetchDashboardData();
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch buyer analytics
      const analyticsResponse = await fetch(`${API_BASE_URL}/analytics/buyer`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const analyticsData = await analyticsResponse.json();
      if (analyticsData.success) {
        setAnalytics(analyticsData.data);
      }
      
      // Fetch buyer's RFQs
      const rfqResponse = await fetch(`${API_BASE_URL}/rfqs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const rfqData = await rfqResponse.json();
      
      // Fetch trending products
      const productsResponse = await fetch(`${API_BASE_URL}/products?limit=4&approval_status=approved`);
      const productsData = await productsResponse.json();

      if (rfqData.success && rfqData.data) {
        const mappedRfqs: RFQ[] = rfqData.data.slice(0, 5).map((r: any) => ({
          id: r.id,
          buyerId: r.buyer_id,
          products: (r.line_items || []).map((item: any) => ({
            productId: item.product_id || item.productId || '',
            quantity: item.quantity,
            specifications: item.specifications || '',
          })),
          incoterm: r.incoterms || r.incoterm || 'FOB',
          destinationPort: r.delivery_location || r.destinationPort || '',
          deadline: r.delivery_date?.split('T')[0] || r.deadline || '',
          status: r.status,
          createdAt: r.created_at?.split('T')[0] || '',
          targetPrice: r.target_price
        }));
        setRfqs(mappedRfqs);
      }

      if (productsData.success && productsData.data) {
        const mappedProducts: Product[] = productsData.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          hsCode: p.specifications?.hsCode || '',
          price: parseFloat(p.price),
          currency: 'INR',
          moq: p.moq,
          leadTime: p.specifications?.leadTime || 'Contact Supplier',
          supplierId: p.supplier_id,
          supplierName: p.supplier_name || 'Unknown Supplier',
          supplierRating: 4.5,
          origin: p.specifications?.originCountry || p.supplier_country || 'Unknown',
          certifications: p.certifications || [],
          image: p.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770',
          description: p.description,
          variants: [],
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const stats = analytics ? [
    { 
      label: 'Active RFQs', 
      value: analytics.overview.open_rfqs.toString(), 
      change: `${analytics.overview.total_rfqs} total`, 
      icon: FileText, 
      color: 'blue' 
    },
    { 
      label: 'Pending Quotes', 
      value: analytics.overview.pending_quotes.toString(), 
      change: 'Awaiting review', 
      icon: Clock, 
      color: 'orange' 
    },
    { 
      label: 'Active Orders', 
      value: analytics.overview.active_orders.toString(), 
      change: `${analytics.overview.total_orders} total`, 
      icon: Package, 
      color: 'green' 
    },
    { 
      label: 'Total Spend', 
      value: `$${(analytics.overview.total_spent / 1000).toFixed(1)}K`, 
      change: 'All time', 
      icon: IndianRupee, 
      color: 'purple' 
    },
  ] : [
    { label: 'Active RFQs', value: '0', change: 'Loading...', icon: FileText, color: 'blue' },
    { label: 'Pending Quotes', value: '0', change: 'Loading...', icon: Clock, color: 'orange' },
    { label: 'Active Orders', value: '0', change: 'Loading...', icon: Package, color: 'green' },
    { label: 'Total Spend', value: '$0', change: 'Loading...', icon: IndianRupee, color: 'purple' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl text-gray-900 mb-2 font-bold">{greeting}, {user.name}</h1>
        <p className="text-base md:text-xl text-gray-600">Find the best suppliers and manage your orders</p>
      </div>
      
      {user.kycStatus === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <div className="text-yellow-900 font-semibold mb-1">Complete your KYC verification</div>
              <p className="text-sm text-yellow-800 mb-3">
                To start placing orders and requesting quotes, please complete your business verification. This helps us ensure a secure trading environment.
              </p>
              <button 
                onClick={() => onNavigate('verification')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm transition-colors"
              >
                Complete Verification Now
              </button>
            </div>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="text-3xl mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.change}</div>
            </div>
          );
        })}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Recent RFQs</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => onNavigate('my-rfqs')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
              <span className="text-gray-300">|</span>
              <button 
                onClick={() => onNavigate('rfq-builder')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Create New
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {rfqs.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No RFQs yet</p>
                <button 
                  onClick={() => onNavigate('rfq-builder')}
                  className="mt-3 text-blue-600 hover:text-blue-700"
                >
                  Create your first RFQ
                </button>
              </div>
            )}
            {rfqs.map((rfq) => (
              <div key={rfq.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="mb-1">RFQ #{rfq.id}</div>
                    <div className="text-sm text-gray-600">
                      {rfq.incoterm} to {rfq.destinationPort}
                    </div>
                  </div>
                  {rfq.status === 'quoted' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      5 Quotes
                    </span>
                  )}
                  {rfq.status === 'sent' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Sent
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">Due: {rfq.deadline}</span>
                  {rfq.status === 'quoted' && (
                    <button 
                      onClick={() => onViewQuotes(rfq)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      View Quotes →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            <button 
              onClick={() => onNavigate('catalog')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Package className="w-6 h-6 text-blue-600 mb-2" />
              <div className="text-sm">Browse Products</div>
            </button>
            
            <button 
              onClick={() => onNavigate('rfq-builder')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <FileText className="w-6 h-6 text-green-600 mb-2" />
              <div className="text-sm">Create RFQ</div>
            </button>
            
            <button 
              onClick={() => onNavigate('my-rfqs')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Clock className="w-6 h-6 text-blue-600 mb-2" />
              <div className="text-sm">My RFQs</div>
            </button>
            
            <button 
              onClick={() => onNavigate('chat')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <MessageSquare className="w-6 h-6 text-purple-600 mb-2" />
              <div className="text-sm">Messages</div>
              <span className="inline-block mt-1 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">3</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl">Trending Products</h2>
          <button 
            onClick={() => onNavigate('catalog')}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {products.length === 0 && !loading && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No products available</p>
            </div>
          )}
          {products.map((product) => (
            <div 
              key={product.id}
              onClick={() => onViewProduct(product)}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.supplierName}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{product.supplierRating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {product.certifications.slice(0, 2).map((cert) => (
                    <span key={cert} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {cert}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">From</div>
                    <div className="text-xl">₹{product.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">MOQ</div>
                    <div>{product.moq} units</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

