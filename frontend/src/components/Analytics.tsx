import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { TrendingUp, TrendingDown, IndianRupee, Package, Truck, Star, Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { User } from '../App';

interface AnalyticsProps {
  user: User;
  activeMode?: 'buyer' | 'seller';
}

export function Analytics({ user, activeMode = 'buyer' }: AnalyticsProps) {
  const effectiveRole = user?.role === 'both' ? activeMode : (user?.role || 'buyer');
  const isSeller = effectiveRole === 'seller';
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [isSeller]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isSeller ? '/api/analytics/seller' : '/api/analytics/buyer';
      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('📊 Analytics API Response:', data);
      console.log('📊 Overview data:', data.data?.overview);
      
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Use real analytics data from API
  const overview = analytics?.overview || {};
  const monthlyData = analytics?.monthly_trends || [];
  const categoryData = analytics?.category_breakdown || [];
  const topSuppliers = analytics?.top_suppliers || [];
  const countryDistribution = analytics?.country_distribution || [];
  const supplierPerformance = analytics?.supplier_performance || topSuppliers || [];
  const deliveryMetrics = analytics?.delivery_metrics || [];
  
  const totalSpend = isSeller ? overview.total_revenue : overview.total_spent;
  const totalOrders = overview.total_orders || 0;
  const activeItems = isSeller ? overview.active_products : overview.active_orders;
  const conversionRate = isSeller ? overview.quote_conversion_rate : overview.rfq_acceptance_rate;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-xl text-white"
        style={{ background: `linear-gradient(to right, ${isSeller ? '#059669' : '#2563eb'}, ${isSeller ? '#047857' : '#1e40af'})` }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">{isSeller ? 'Sales Analytics' : 'Analytics & Insights'}</h1>
          <p className="text-base md:text-xl opacity-90">{isSeller ? 'Track your business performance and revenue' : 'Track your trade performance and metrics'}</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto justify-center">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl mb-1">{totalSpend ? `$${(totalSpend / 1000).toFixed(1)}K` : 'N/A'}</div>
          <div className="text-sm text-gray-600">{isSeller ? 'Total Revenue' : 'Total Spend'}</div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl mb-1">{totalOrders || 0}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl mb-1">{activeItems || 0}</div>
          <div className="text-sm text-gray-600">{isSeller ? 'Active Products' : 'Active Orders'}</div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-3xl mb-1">{conversionRate || 0}%</div>
          <div className="text-sm text-gray-600">{isSeller ? 'Quote Conversion' : 'Acceptance Rate'}</div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">{isSeller ? 'Revenue Trend' : 'Monthly Spend Trend'}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value / 1000}K`} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, isSeller ? 'Revenue' : 'Spend']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Spend by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${value / 1000}K`} />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Spend']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {countryDistribution.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl mb-6">Sourcing by Country</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={countryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {countryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {countryDistribution.map((country) => (
                <div key={country.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: country.color }}></div>
                    <span className="text-sm text-gray-700">{country.name}</span>
                  </div>
                  <span className="text-sm text-gray-900">{country.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Top Suppliers Performance</h2>
          {supplierPerformance.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No supplier data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {supplierPerformance.map((supplier, index) => (
                <div key={supplier.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">{supplier.name}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {supplier.rating}
                      </div>
                      <span>•</span>
                      <span>{supplier.orders} orders</span>
                      <span>•</span>
                      <span className={supplier.onTime >= 95 ? 'text-green-600' : 'text-yellow-600'}>
                        {supplier.onTime}% on-time
                      </span>
                    </div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${supplier.onTime >= 95 ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${supplier.onTime}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {deliveryMetrics.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Key Performance Indicators</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {deliveryMetrics.map((metric) => (
              <div key={metric.metric} className="text-center">
                <div className="text-3xl mb-2">{metric.value}</div>
                <div className="text-sm text-gray-600 mb-2">{metric.metric}</div>
                <div className={`flex items-center justify-center gap-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {metric.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-blue-900 mb-3">Insights & Recommendations</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Your spend increased by 12% this month. Consider negotiating volume discounts with top suppliers.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Electronics category has the highest spend. Review product mix to optimize costs.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Shanghai Textile Co. has 100% on-time delivery. Consider increasing orders from this supplier.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Your average lead time decreased by 3 days. Great progress on supply chain optimization!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
