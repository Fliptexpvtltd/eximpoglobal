import { useEffect, useState } from 'react';
import { 
  ArrowLeft, Package, User, MapPin, CreditCard, 
  CheckCircle, Clock, XCircle, FileText, Truck 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface OrderDetailsProps {
  orderId: string;
  onBack: () => void;
}

interface OrderDetails {
  order: {
    id: string;
    order_number: string;
    quantity: number;
    unit_price: string;
    total_amount: string;
    currency: string;
    status: string;
    payment_status: string;
    incoterms?: string;
    buyer_notes?: string;
    seller_notes?: string;
    cancellation_reason?: string;
    tracking_number?: string;
    carrier?: string;
    created_at: string;
    paid_at?: string;
    shipped_at?: string;
    delivered_at?: string;
    cancelled_at?: string;
    shipping_address?: any;
  };
  product: {
    id: string;
    name: string;
    image: string;
    category: string;
  };
  buyer: {
    id: string;
    company_name: string;
    email: string;
    phone?: string;
  };
  seller: {
    id: string;
    company_name: string;
    email: string;
    phone?: string;
  };
  payment?: {
    razorpay_payment_id?: string;
    method?: string;
    status: string;
    authorized_at?: string;
    captured_at?: string;
  };
}

export function OrderDetails({ orderId, onBack }: OrderDetailsProps) {
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [sellerNotes, setSellerNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/payments/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Transform flat response into nested structure
        const order = data.order;
        const transformedData: OrderDetails = {
          order: {
            id: order.id,
            order_number: order.order_number,
            quantity: order.quantity,
            unit_price: order.unit_price,
            total_amount: order.total_amount,
            currency: order.currency,
            status: order.status,
            payment_status: order.payment_status,
            incoterms: order.incoterms,
            buyer_notes: order.buyer_notes,
            seller_notes: order.seller_notes,
            cancellation_reason: order.cancellation_reason,
            tracking_number: order.tracking_number,
            carrier: order.carrier,
            created_at: order.created_at,
            paid_at: order.paid_at,
            shipped_at: order.shipped_at,
            delivered_at: order.delivered_at,
            cancelled_at: order.cancelled_at,
            shipping_address: order.shipping_address
          },
          product: {
            id: order.product_id,
            name: order.product_name,
            image: Array.isArray(order.product_images) && order.product_images.length > 0 
              ? order.product_images[0] 
              : 'https://via.placeholder.com/150',
            category: order.category
          },
          buyer: {
            id: order.buyer_id,
            company_name: order.buyer_company,
            email: order.buyer_email,
            phone: order.buyer_phone
          },
          seller: {
            id: order.seller_id,
            company_name: order.seller_company,
            email: order.seller_email,
            phone: order.seller_phone
          },
          payment: order.razorpay_payment_id ? {
            razorpay_payment_id: order.razorpay_payment_id,
            method: order.payment_method,
            status: order.payment_status,
            authorized_at: order.payment_created_at,
            captured_at: order.payment_captured_at
          } : undefined
        };
        
        setOrderDetails(transformedData);
        
        // Check if current user is the seller
        if (user) {
          const isSellerCheck = user.id === order.seller_id;
          setIsSeller(isSellerCheck);
        }
        
        setSellerNotes(order.seller_notes || '');
        setTrackingNumber(order.tracking_number || '');
        setCarrier(order.carrier || '');
      } else {
        toast.error(data.message || 'Failed to fetch order details');
        onBack();
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
      onBack();
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    // Validate tracking number for shipped status
    if (newStatus === 'shipped' && !trackingNumber.trim()) {
      toast.error('Tracking number is required when marking as shipped');
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/payments/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          notes: sellerNotes,
          tracking_number: trackingNumber,
          carrier: carrier
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Order status updated successfully');
        fetchOrderDetails();
        setNewStatus('');
        setTrackingNumber('');
        setCarrier('');
      } else {
        toast.error(data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusTimeline = () => {
    if (!orderDetails) return [];
    
    const { order } = orderDetails;
    const timeline: Array<{ status: string; date: string | null | undefined; completed: boolean; cancelled?: boolean }> = [
      { status: 'Order Placed', date: order.created_at, completed: true },
      { status: 'Payment Received', date: order.paid_at, completed: !!order.paid_at },
      { status: 'Processing', date: null, completed: ['processing', 'shipped', 'delivered'].includes(order.status) },
      { status: 'Shipped', date: order.shipped_at, completed: !!order.shipped_at },
      { status: 'Delivered', date: order.delivered_at, completed: !!order.delivered_at }
    ];

    if (order.status === 'cancelled') {
      return [
        { status: 'Order Placed', date: order.created_at, completed: true },
        { status: 'Cancelled', date: order.cancelled_at, completed: true, cancelled: true }
      ];
    }

    return timeline;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!orderDetails) {
    return null;
  }

  const { order, product, buyer, seller, payment } = orderDetails;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order #{order.order_number}</h1>
              <p className="text-gray-600">Placed on {formatDate(order.created_at)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Order Total</p>
              <p className="text-3xl font-bold text-blue-600">₹{parseFloat(order.total_amount).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <div className="relative">
            {getStatusTimeline().map((item, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.cancelled 
                      ? 'bg-red-100 text-red-600'
                      : item.completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {item.cancelled ? (
                      <XCircle className="w-5 h-5" />
                    ) : item.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {item.status}
                    </p>
                    {item.date && (
                      <p className="text-sm text-gray-500">{formatDate(item.date)}</p>
                    )}
                  </div>
                </div>
                
                {/* Show tracking info below Shipped status */}
                {item.status === 'Shipped' && item.completed && (order.tracking_number || order.carrier) && (
                  <div className="ml-14 mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-semibold text-blue-900">Shipment Tracking</p>
                    </div>
                    <div className="space-y-1 text-sm">
                      {order.tracking_number && (
                        <p className="text-gray-700">
                          <span className="text-gray-600">Tracking Number: </span>
                          <span className="font-semibold text-blue-700">{order.tracking_number}</span>
                        </p>
                      )}
                      {order.carrier && (
                        <p className="text-gray-700">
                          <span className="text-gray-600">Courier: </span>
                          <span className="font-semibold text-gray-900">{order.carrier}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Seller Actions - Update Order Status */}
        {isSeller && order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Update Order Status</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Current Status:</strong> {order.status.replace('_', ' ').toUpperCase()}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select status...</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seller Notes (Optional)
                  </label>
                  <textarea
                    value={sellerNotes}
                    onChange={(e) => setSellerNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add notes, estimated delivery date, etc..."
                  />
                </div>
              </div>
              
              {/* Tracking fields - show when status is 'shipped' */}
              {newStatus === 'shipped' && (
                <div className="grid md:grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Courier / Carrier
                    </label>
                    <input
                      type="text"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., FedEx, DHL, Blue Dart"
                    />
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={updateOrderStatus}
              disabled={isUpdating || !newStatus}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Product Details
            </h2>
            <div className="flex gap-4">
              <img
                src={product.image || 'https://via.placeholder.com/100'}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.category}</p>
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-semibold">{order.quantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unit Price:</span>
                    <span className="font-semibold">₹{parseFloat(order.unit_price).toLocaleString()}</span>
                  </div>
                  {order.incoterms && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Incoterms:</span>
                      <span className="font-semibold">{order.incoterms}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Payment Details
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-semibold ${
                  order.payment_status === 'completed' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {order.payment_status.toUpperCase()}
                </span>
              </div>
              {payment?.method && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold capitalize">{payment.method}</span>
                </div>
              )}
              {payment?.razorpay_payment_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-xs">{payment.razorpay_payment_id}</span>
                </div>
              )}
              {payment?.captured_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid At:</span>
                  <span className="font-semibold">{formatDate(payment.captured_at)}</span>
                </div>
              )}
              <div className="pt-3 border-t flex justify-between items-baseline">
                <span className="text-gray-900 font-semibold">Total Amount:</span>
                <span className="text-xl font-bold text-blue-600">
                  ₹{parseFloat(order.total_amount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Buyer Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Buyer Details
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Company Name</p>
                <p className="font-semibold">{buyer.company_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{buyer.email}</p>
              </div>
              {buyer.phone && (
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-semibold">{buyer.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Seller Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Seller Details
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Company Name</p>
                <p className="font-semibold">{seller.company_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{seller.email}</p>
              </div>
              {seller.phone && (
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-semibold">{seller.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Shipping Address
              </h2>
              <div className="text-sm text-gray-700">
                <p className="font-semibold">{order.shipping_address.name}</p>
                <p className="mt-1">{order.shipping_address.phone}</p>
                <p className="mt-2">{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && (
                  <p>{order.shipping_address.address_line2}</p>
                )}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Notes
            </h2>
            <div className="space-y-3 text-sm">
              {order.buyer_notes && (
                <div>
                  <p className="text-gray-600 font-medium">Buyer Notes:</p>
                  <p className="text-gray-700 mt-1">{order.buyer_notes}</p>
                </div>
              )}
              {order.seller_notes && (
                <div>
                  <p className="text-gray-600 font-medium">Seller Notes:</p>
                  <p className="text-gray-700 mt-1">{order.seller_notes}</p>
                </div>
              )}
              {order.cancellation_reason && (
                <div>
                  <p className="text-red-600 font-medium">Cancellation Reason:</p>
                  <p className="text-gray-700 mt-1">{order.cancellation_reason}</p>
                </div>
              )}
              {!order.buyer_notes && !order.seller_notes && !order.cancellation_reason && (
                <p className="text-gray-500 italic">No notes available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
