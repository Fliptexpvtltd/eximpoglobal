import { useState, useEffect } from 'react';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
import { IndianRupee, Package, Eye, MessageSquare, TrendingUp, Star, Plus, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { User } from '../App';

interface SellerDashboardProps {
  user: User;
  onNavigate: (view: any) => void;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  moq: number;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export function SellerDashboard({ user, onNavigate }: SellerDashboardProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  
  const handleEditProduct = (productId: string) => {
    // Navigate to edit product page
    onNavigate({ view: 'edit-product', productId });
  };

  useEffect(() => {
    fetchSellerAnalytics();
    fetchMyProducts();
    fetchSellerRFQs();
    fetchMyQuotes();
    fetchSellerOrders();
  }, []);

  const fetchSellerAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/analytics/seller`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching seller analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/products/my/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMyProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching my products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchSellerRFQs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/rfqs?limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRfqs(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching RFQs:', error);
    }
  };

  const fetchMyQuotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/quotes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setQuotes(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const fetchSellerOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const productStats = {
    approved: myProducts.filter(p => p.approval_status === 'approved').length,
    pending: myProducts.filter(p => p.approval_status === 'pending').length,
    rejected: myProducts.filter(p => p.approval_status === 'rejected').length,
    total: myProducts.length
  };

  const stats = analytics ? [
    { 
      label: 'Total Revenue', 
      value: `$${(analytics.overview.total_revenue / 1000).toFixed(1)}K`, 
      change: `${analytics.overview.total_orders} orders`, 
      icon: IndianRupee, 
      color: 'green' 
    },
    { 
      label: 'Active Products', 
      value: productStats.approved.toString(), 
      change: `${productStats.pending} pending, ${productStats.rejected} rejected`, 
      icon: Package, 
      color: 'blue' 
    },
    { 
      label: 'Quote Conversion', 
      value: `${analytics.overview.quote_conversion_rate}%`, 
      change: `${analytics.overview.accepted_quotes}/${analytics.overview.total_quotes} accepted`, 
      icon: TrendingUp, 
      color: 'purple' 
    },
    { 
      label: 'Active Orders', 
      value: analytics.overview.active_orders.toString(), 
      change: 'In progress', 
      icon: Star, 
      color: 'yellow' 
    },
  ] : [
    { label: 'Total Revenue', value: '$0', change: 'Loading...', icon: IndianRupee, color: 'green' },
    { label: 'Active Products', value: productStats.approved.toString(), change: `${productStats.pending} pending`, icon: Package, color: 'blue' },
    { label: 'Quote Conversion', value: '0%', change: 'Loading...', icon: TrendingUp, color: 'purple' },
    { label: 'Active Orders', value: '0', change: 'Loading...', icon: Star, color: 'yellow' },
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

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    else if (hour < 18) return 'Good Afternoon';
    else return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-900 mb-2 font-bold">{greeting()}, {user.name}</h1>
          <p className="text-base md:text-xl text-gray-600">Grow your business and reach global buyers</p>
        </div>
        <button 
          onClick={() => onNavigate('add-product')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorMap: { [key: string]: { bg: string; text: string } } = {
            green: { bg: '#d1fae5', text: '#059669' },
            blue: { bg: '#dbeafe', text: '#2563eb' },
            purple: { bg: '#e9d5ff', text: '#9333ea' },
            yellow: { bg: '#fef3c7', text: '#f59e0b' },
          };
          const colors = colorMap[stat.color] || colorMap.green;
          
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: colors.bg }}
                >
                  <Icon className="w-6 h-6" style={{ color: colors.text }} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.change}</div>
            </div>
          );
        })}
      </div>
      
      {/* My Products Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">My Products</h2>
          <button 
            onClick={() => onNavigate('add-product')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {productsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : myProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first product to reach global buyers</p>
            <button 
              onClick={() => onNavigate('add-product')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">MOQ</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {myProducts.slice(0, 5).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-900">
                      ${product.price ? parseFloat(product.price).toFixed(2) : 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {product.moq || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      {product.approval_status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Approved
                        </span>
                      )}
                      {product.approval_status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                          Pending
                        </span>
                      )}
                      {product.approval_status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-right">
                      {(product.approval_status === 'pending' || product.approval_status === 'rejected') && (
                        <button
                          onClick={() => handleEditProduct(product.id)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {myProducts.length > 5 && (
              <div className="mt-4 text-center">
                <button 
                  onClick={() => onNavigate('catalog')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All {myProducts.length} Products →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Incoming RFQs</h2>
            {rfqs.length > 0 && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                {rfqs.length} Total
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            {rfqs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No RFQs available</p>
              </div>
            ) : (
              rfqs.slice(0, 5).map((rfq) => (
                <div key={rfq.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{rfq.title || 'RFQ Request'}</div>
                      <div className="text-sm text-gray-600">{rfq.buyer_company || 'Unknown Buyer'}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      rfq.status === 'open' ? 'bg-blue-100 text-blue-800' :
                      rfq.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {rfq.status || 'pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    {rfq.line_items && rfq.line_items[0] && (
                      <span>Qty: {rfq.line_items[0].quantity}</span>
                    )}
                    <span>•</span>
                    <span>{rfq.incoterms || 'FOB'}</span>
                    <span>•</span>
                    <span>{rfq.delivery_location || 'Contact buyer'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Due: {rfq.delivery_date ? new Date(rfq.delivery_date).toLocaleDateString() : 'Not specified'}
                    </span>
                    <button 
                      onClick={() => onNavigate({ view: 'submit-quote', rfqId: rfq.id })}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Submit Quote →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {rfqs.length > 0 && (
            <div className="mt-4 text-center">
              <button 
                onClick={() => onNavigate('all-rfqs')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All RFQs →
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Top Products</h2>
            <button 
              onClick={() => onNavigate('catalog')}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              View All
            </button>
          </div>
          
          {myProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No products yet. Add your first product to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">{product.name}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="capitalize">{product.category}</span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        product.approval_status === 'approved' ? 'bg-green-100 text-green-700' :
                        product.approval_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {product.approval_status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Shipment Management Section */}
      {orders.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Shipments</h2>
          
          <div className="space-y-4">
            {orders
              .filter(order => ['confirmed', 'processing'].includes(order.status))
              .map(order => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order.order_number}</h3>
                      <p className="text-sm text-gray-600">{order.buyer_company || 'N/A'}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Total: </span>
                      ${Number(order.total_amount || 0).toLocaleString()}
                    </div>
                    <button
                      onClick={() => onNavigate('create-shipment', order.id)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Create Shipment
                    </button>
                  </div>
                </div>
              ))}
            
            {orders
              .filter(order => order.status === 'shipped')
              .map(order => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 bg-emerald-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order.order_number}</h3>
                      <p className="text-sm text-gray-600">{order.buyer_company || 'N/A'}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Shipment in transit
                    </div>
                    <button
                      onClick={() => onNavigate('update-tracking', order.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Update Tracking
                    </button>
                  </div>
                </div>
              ))}
          </div>
          
          {orders.filter(o => ['confirmed', 'processing', 'shipped'].includes(o.status)).length === 0 && (
            <p className="text-center text-gray-500 py-8">No orders requiring shipment action at this time</p>
          )}
        </div>
      )}
      
      <div className="grid lg:grid-cols-4 gap-6">
        <div 
          className="border-2 rounded-xl p-6"
          style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            borderColor: '#a7f3d0'
          }}
        >
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#059669' }}>
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Add New Product</h3>
          <p className="text-gray-600 mb-4">List a new product to reach more buyers</p>
          <button 
            onClick={() => onNavigate('add-product')}
            className="w-full px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#059669' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}
          >
            Get Started
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {analytics?.messages?.unread_count || 0} Unread Messages
          </h3>
          <p className="text-gray-600 mb-4">Respond to buyer inquiries quickly to improve your rating</p>
          <button 
            onClick={() => onNavigate('chat')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Messages
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {analytics?.overview?.active_orders || 0} Orders in Progress
          </h3>
          <p className="text-gray-600 mb-4">Update milestones to keep buyers informed</p>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            Update Status
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Insights</h3>
          <p className="text-gray-600 mb-4">View detailed analytics and optimize your listings</p>
          <button 
            onClick={() => onNavigate('analytics')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

