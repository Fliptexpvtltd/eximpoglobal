import { useState, useEffect } from 'react';
import { TrendingUp, Users, Package, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Analytics {
  overview: {
    total_users: number;
    total_buyers: number;
    total_sellers: number;
    total_products: number;
    total_rfqs: number;
    total_orders: number;
    total_revenue: number;
  };
  recent_activity: {
    new_users_today: number;
    new_products_today: number;
    new_rfqs_today: number;
    new_orders_today: number;
  };
}

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">No Analytics Data</h2>
        <p className="text-gray-600 mt-2">Unable to load analytics</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: analytics.overview.total_users,
      change: `+${analytics.recent_activity.new_users_today} today`,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Products',
      value: analytics.overview.total_products,
      change: `+${analytics.recent_activity.new_products_today} today`,
      icon: Package,
      color: 'green'
    },
    {
      title: 'Total RFQs',
      value: analytics.overview.total_rfqs,
      change: `+${analytics.recent_activity.new_rfqs_today} today`,
      icon: Activity,
      color: 'purple'
    },
    {
      title: 'Total Orders',
      value: analytics.overview.total_orders,
      change: `+${analytics.recent_activity.new_orders_today} today`,
      icon: ShoppingCart,
      color: 'orange'
    },
    {
      title: 'Total Revenue',
      value: `$${(analytics.overview.total_revenue / 1000).toFixed(1)}K`,
      change: 'All time',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'Growth Rate',
      value: '12.5%',
      change: 'vs last month',
      icon: TrendingUp,
      color: 'indigo'
    }
  ];

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    indigo: 'text-indigo-600 bg-indigo-50'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-600 mt-2">Track platform performance and growth metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClass = colorClasses[stat.color as keyof typeof colorClasses];
          
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Breakdown</CardTitle>
            <CardDescription>Distribution of users by role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Buyers</span>
              <span className="text-sm text-gray-600">{analytics.overview.total_buyers}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(analytics.overview.total_buyers / analytics.overview.total_users) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sellers</span>
              <span className="text-sm text-gray-600">{analytics.overview.total_sellers}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(analytics.overview.total_sellers / analytics.overview.total_users) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="text-sm font-medium">Total Users</span>
              <span className="text-lg font-bold">{analytics.overview.total_users}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>Today's activity summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm">New Users</span>
              </div>
              <span className="text-lg font-bold">{analytics.recent_activity.new_users_today}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm">New Products</span>
              </div>
              <span className="text-lg font-bold">{analytics.recent_activity.new_products_today}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Activity className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm">New RFQs</span>
              </div>
              <span className="text-lg font-bold">{analytics.recent_activity.new_rfqs_today}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <ShoppingCart className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm">New Orders</span>
              </div>
              <span className="text-lg font-bold">{analytics.recent_activity.new_orders_today}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Overview</CardTitle>
          <CardDescription>Comprehensive platform statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{analytics.overview.total_users}</div>
              <div className="text-sm text-gray-600 mt-1">Total Users</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{analytics.overview.total_products}</div>
              <div className="text-sm text-gray-600 mt-1">Total Products</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{analytics.overview.total_rfqs}</div>
              <div className="text-sm text-gray-600 mt-1">Total RFQs</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{analytics.overview.total_orders}</div>
              <div className="text-sm text-gray-600 mt-1">Total Orders</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
