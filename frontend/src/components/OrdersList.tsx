import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface OrdersListProps {
  onViewOrder: (orderId: string) => void;
}

interface Order {
  id: string;
  order_number: string;
  product_name: string;
  product_images: string[] | string;
  quantity: number;
  unit_price: string;
  total_amount: string;
  status: string;
  payment_status: string;
  buyer_name?: string;
  seller_company?: string;
  seller_name?: string;
  created_at: string;
  paid_at?: string;
  shipped_at?: string;
  delivered_at?: string;
}

export function OrdersList({ onViewOrder }: OrdersListProps) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<'buyer' | 'seller'>(user?.role === 'seller' ? 'seller' : 'buyer');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchOrders();
  }, [currentRole, statusFilter, pagination.page]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const params = new URLSearchParams({
        role: currentRole,
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await fetch(`${API_BASE_URL}/payments/orders?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);
        setPagination({
          ...pagination,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages
        });
      } else {
        toast.error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'paid':
      case 'processing':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
      case 'payment_failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return 'bg-amber-100 text-amber-800';
      case 'paid':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'payment_failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredOrders = orders.filter(order => 
    searchQuery === '' || 
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Role Toggle & Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Role Header */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user?.role === 'seller' ? 'My Sales' : 'My Purchases'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {user?.role === 'seller' 
                  ? 'Manage your sales and orders from buyers' 
                  : 'Track your purchases and orders'}
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Status</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {currentRole === 'buyer' 
                ? "You haven't placed any orders yet" 
                : "You haven't received any orders yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => onViewOrder(order.id)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300 cursor-pointer"
              >
                <div className="flex items-center gap-3 p-3">
                  {/* Product Image */}
                  <img
                    src={Array.isArray(order.product_images) && order.product_images.length > 0 
                      ? order.product_images[0] 
                      : 'https://via.placeholder.com/80'}
                    alt={order.product_name}
                    className="w-20 h-20 object-cover rounded flex-shrink-0"
                  />

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">{order.product_name}</h3>
                        <p className="text-xs text-gray-500 font-mono">#{order.order_number}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span><span className="text-gray-500">Qty:</span> <strong>{order.quantity}</strong></span>
                      <span className="text-gray-300">|</span>
                      <span><span className="text-gray-500">Price:</span> <strong>₹{parseFloat(order.unit_price).toLocaleString()}</strong></span>
                      <span className="text-gray-300">|</span>
                      <span className="text-blue-600 font-semibold">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                      <span className="text-gray-300 hidden sm:inline">|</span>
                      <span className="text-gray-500 hidden sm:inline">{formatDate(order.created_at)}</span>
                    </div>

                    {currentRole === 'buyer' && order.seller_name && (
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="text-gray-400">Seller:</span> <span className="font-medium text-gray-700">{order.seller_name}</span>
                      </p>
                    )}
                    
                    {currentRole === 'seller' && order.buyer_name && (
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="text-gray-400">Buyer:</span> <span className="font-medium text-gray-700">{order.buyer_name}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setPagination({ ...pagination, page: Math.min(pagination.totalPages, pagination.page + 1) })}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
