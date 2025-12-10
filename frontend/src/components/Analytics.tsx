import { TrendingUp, TrendingDown, IndianRupee, Package, Truck, Star, Download } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { User } from '../App';

interface AnalyticsProps {
  user: User;
}

const spendByCategory = [
  { name: 'Electronics', value: 45000, orders: 12 },
  { name: 'Textiles', value: 32000, orders: 8 },
  { name: 'Machinery', value: 28000, orders: 5 },
  { name: 'Home Goods', value: 19000, orders: 6 },
];

const monthlySpend = [
  { month: 'Jun', spend: 98000, orders: 24 },
  { month: 'Jul', spend: 112000, orders: 28 },
  { month: 'Aug', spend: 95000, orders: 22 },
  { month: 'Sep', spend: 128000, orders: 31 },
  { month: 'Oct', spend: 142000, orders: 35 },
  { month: 'Nov', spend: 124000, orders: 29 },
];

const supplierPerformance = [
  { name: 'Shanghai Textile Co.', rating: 4.8, orders: 15, onTime: 96 },
  { name: 'Shenzhen Electronics', rating: 4.9, orders: 12, onTime: 98 },
  { name: 'Guangzhou Machinery', rating: 4.7, orders: 8, onTime: 94 },
  { name: 'Beijing Solar Tech', rating: 4.9, orders: 6, onTime: 100 },
  { name: 'Foshan Ceramics', rating: 4.6, orders: 5, onTime: 92 },
];

const countryDistribution = [
  { name: 'China', value: 85, color: '#3B82F6' },
  { name: 'Vietnam', value: 8, color: '#10B981' },
  { name: 'India', value: 4, color: '#F59E0B' },
  { name: 'Other', value: 3, color: '#6B7280' },
];

const deliveryMetrics = [
  { metric: 'On-Time Delivery', value: '94%', change: '+2%', trend: 'up' },
  { metric: 'Avg Lead Time', value: '28 days', change: '-3 days', trend: 'up' },
  { metric: 'Quality Issues', value: '2.1%', change: '-0.5%', trend: 'up' },
  { metric: 'Avg Order Value', value: '₹4,200', change: '+12%', trend: 'up' },
];

export function Analytics({ user }: AnalyticsProps) {
  const totalSpend = monthlySpend.reduce((sum, m) => sum + m.spend, 0);
  const avgMonthlySpend = totalSpend / monthlySpend.length;
  const currentMonth = monthlySpend[monthlySpend.length - 1].spend;
  const previousMonth = monthlySpend[monthlySpend.length - 2].spend;
  const monthChange = ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Analytics & Insights</h1>
          <p className="text-base md:text-xl text-gray-600">Track your trade performance and metrics</p>
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
            <div className={`flex items-center gap-1 text-sm ${
              parseFloat(monthChange) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {parseFloat(monthChange) >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {Math.abs(parseFloat(monthChange))}%
            </div>
          </div>
          <div className="text-3xl mb-1">₹{(currentMonth / 1000).toFixed(0)}K</div>
          <div className="text-sm text-gray-600">This Month's Spend</div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl mb-1">{monthlySpend[monthlySpend.length - 1].orders}</div>
          <div className="text-sm text-gray-600">Active Orders</div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl mb-1">94%</div>
          <div className="text-sm text-gray-600">On-Time Delivery</div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-3xl mb-1">4.8</div>
          <div className="text-sm text-gray-600">Avg Supplier Rating</div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Monthly Spend Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${value / 1000}K`} />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Spend']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Line type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Spend by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendByCategory}>
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
        
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Top Suppliers Performance</h2>
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
        </div>
      </div>
      
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
