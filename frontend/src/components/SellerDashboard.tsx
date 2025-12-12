import { useState, useEffect } from 'react';
import { IndianRupee, Package, Eye, MessageSquare, TrendingUp, Star, Plus } from 'lucide-react';
import type { User } from '../App';

interface SellerDashboardProps {
  user: User;
  onNavigate: (view: any) => void;
}

const recentRFQs = [
  {
    id: 'rfq-1',
    product: 'LED Display Modules',
    buyer: 'TechCorp GmbH',
    quantity: 1000,
    incoterm: 'CIF',
    destination: 'Hamburg',
    deadline: '2025-11-10',
    status: 'new',
  },
  {
    id: 'rfq-2',
    product: 'Organic Cotton T-Shirts',
    buyer: 'Fashion Retail Inc.',
    quantity: 5000,
    incoterm: 'FOB',
    destination: 'Los Angeles',
    deadline: '2025-11-15',
    status: 'quoted',
  },
  {
    id: 'rfq-3',
    product: 'Industrial Pumps',
    buyer: 'Manufacturing Co.',
    quantity: 50,
    incoterm: 'EXW',
    destination: 'Rotterdam',
    deadline: '2025-11-12',
    status: 'new',
  },
];

const topProducts = [
  { name: 'LED Display Modules', views: 342, quotes: 18, orders: 8 },
  { name: 'Organic Cotton T-Shirts', views: 298, quotes: 15, orders: 12 },
  { name: 'Industrial Pumps', views: 187, quotes: 9, orders: 5 },
  { name: 'Ceramic Tiles', views: 156, quotes: 7, orders: 4 },
];

export function SellerDashboard({ user, onNavigate }: SellerDashboardProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerAnalytics();
  }, []);

  const fetchSellerAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/analytics/seller', {
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
      value: analytics.overview.active_products.toString(), 
      change: `${analytics.overview.total_products} total`, 
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
    { label: 'Active Products', value: '0', change: 'Loading...', icon: Package, color: 'blue' },
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
      {/* Header with Green Theme */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 -mx-4 -mt-6 px-4 pt-6 pb-8 mb-6 rounded-b-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl text-white mb-2">{greeting()}, {user.name}! 🏪</h1>
            <p className="text-base md:text-xl text-emerald-100">Grow your business and reach global buyers</p>
          </div>
          <button 
            onClick={() => onNavigate('add-product')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 font-medium shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>
      
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
            <h2 className="text-xl">Incoming RFQs</h2>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              2 New
            </span>
          </div>
          
          <div className="space-y-4">
            {recentRFQs.map((rfq) => (
              <div key={rfq.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="mb-1">{rfq.product}</div>
                    <div className="text-sm text-gray-600">{rfq.buyer}</div>
                  </div>
                  {rfq.status === 'new' && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      New
                    </span>
                  )}
                  {rfq.status === 'quoted' && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Quoted
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>Qty: {rfq.quantity}</span>
                  <span>•</span>
                  <span>{rfq.incoterm}</span>
                  <span>•</span>
                  <span>{rfq.destination}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Due: {rfq.deadline}</span>
                  {rfq.status === 'new' ? (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Send Quote
                    </button>
                  ) : (
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      View Quote
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Top Products</h2>
            <button 
              onClick={() => onNavigate('catalog')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="mb-1">{product.name}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{product.views} views</span>
                    <span>•</span>
                    <span>{product.quotes} quotes</span>
                    <span>•</span>
                    <span>{product.orders} orders</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <MessageSquare className="w-12 h-12 mb-4 opacity-80" />
          <h3 className="text-xl mb-2">5 Unread Messages</h3>
          <p className="text-blue-100 mb-4">Respond to buyer inquiries quickly to improve your rating</p>
          <button 
            onClick={() => onNavigate('chat')}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50"
          >
            View Messages
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <Package className="w-12 h-12 mb-4 opacity-80" />
          <h3 className="text-xl mb-2">12 Orders in Production</h3>
          <p className="text-green-100 mb-4">Update milestones to keep buyers informed</p>
          <button className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50">
            Update Status
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <TrendingUp className="w-12 h-12 mb-4 opacity-80" />
          <h3 className="text-xl mb-2">Performance Insights</h3>
          <p className="text-purple-100 mb-4">View detailed analytics and optimize your listings</p>
          <button 
            onClick={() => onNavigate('analytics')}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50"
          >
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
