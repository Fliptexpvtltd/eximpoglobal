import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, CreditCard, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface CheckoutProps {
  product: any;
  user?: any;
  onBack: () => void;
  onSuccess: (order: any) => void;
}

export function Checkout({ product, user, onBack, onSuccess }: CheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [orderDetails, setOrderDetails] = useState({
    quantity: product.moq || 1,
    shipping_address: {
      name: user?.name || user?.fullName || '',
      phone: user?.phone || '',
      email: user?.email || '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India'
    },
    incoterms: 'FOB',
    buyer_notes: ''
  });

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setOrderDetails(prev => ({
        ...prev,
        shipping_address: {
          ...prev.shipping_address,
          name: user.name || user.fullName || prev.shipping_address.name,
          phone: user.phone || prev.shipping_address.phone,
          email: user.email || prev.shipping_address.email
        }
      }));
    }
  }, [user]);

  const unitPrice = parseFloat(product.price) || 0;
  const totalAmount = unitPrice * orderDetails.quantity;

  const handlePlaceOrder = async () => {
    // Validate shipping address
    const { name, email, phone, address_line1, city, state, postal_code } = orderDetails.shipping_address;
    
    const missingFields = [];
    if (!name) missingFields.push('Name');
    if (!email) missingFields.push('Email');
    if (!phone) missingFields.push('Phone');
    if (!address_line1) missingFields.push('Address');
    if (!city) missingFields.push('City');
    if (!state) missingFields.push('State');
    if (!postal_code) missingFields.push('Postal Code');
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      // Create order
      const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: orderDetails.quantity,
          unit_price: unitPrice,
          shipping_address: orderDetails.shipping_address,
          incoterms: orderDetails.incoterms,
          buyer_notes: orderDetails.buyer_notes
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Initialize Razorpay
      const options = {
        key: data.razorpay.key,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
        name: 'Eximpo Global',
        description: `Order for ${product.name}`,
        order_id: data.razorpay.order_id,
        handler: async function (response: any) {
          // Verify payment
          try {
            const verifyResponse = await fetch(`${API_BASE_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast.success('Payment successful! Order placed.');
              onSuccess(verifyData.order);
              onBack();
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: orderDetails.shipping_address.name,
          contact: orderDetails.shipping_address.phone
        },
        notes: {
          product_id: product.id,
          product_name: product.name
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error(error.message || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-6">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
              <p className="text-sm text-gray-600 mt-1">Complete your order securely</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Product Summary */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={product.image || product.images?.[0] || 'https://via.placeholder.com/100'}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.category}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-xl font-bold text-blue-600">₹{unitPrice.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">per unit</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Unit Price</span>
                  <span className="font-semibold">₹{unitPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Quantity</span>
                  <input
                    type="number"
                    min={product.moq || 1}
                    value={orderDetails.quantity}
                    onChange={(e) => setOrderDetails({
                      ...orderDetails,
                      quantity: Math.max(product.moq || 1, parseInt(e.target.value) || 1)
                    })}
                    className="w-24 px-3 py-1 border rounded-lg text-right"
                  />
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Incoterms</span>
                  <select
                    value={orderDetails.incoterms}
                    onChange={(e) => setOrderDetails({ ...orderDetails, incoterms: e.target.value })}
                    className="px-3 py-1 border rounded-lg"
                  >
                    <option value="EXW">EXW - Ex Works</option>
                    <option value="FOB">FOB - Free On Board</option>
                    <option value="CIF">CIF - Cost, Insurance & Freight</option>
                    <option value="DDP">DDP - Delivered Duty Paid</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-3 bg-blue-50 rounded-lg px-4">
                  <span className="font-semibold text-lg">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {product.moq && (
                <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Minimum order quantity: {product.moq} units</span>
                </div>
              )}
            </div>

            {/* Right: Shipping Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Shipping Address</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={orderDetails.shipping_address.name}
                    onChange={(e) => setOrderDetails({
                      ...orderDetails,
                      shipping_address: { ...orderDetails.shipping_address, name: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={orderDetails.shipping_address.email}
                    onChange={(e) => setOrderDetails({
                      ...orderDetails,
                      shipping_address: { ...orderDetails.shipping_address, email: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={orderDetails.shipping_address.phone}
                    onChange={(e) => setOrderDetails({
                      ...orderDetails,
                      shipping_address: { ...orderDetails.shipping_address, phone: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    value={orderDetails.shipping_address.address_line1}
                    onChange={(e) => setOrderDetails({
                      ...orderDetails,
                      shipping_address: { ...orderDetails.shipping_address, address_line1: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Street address, P.O. box"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    value={orderDetails.shipping_address.address_line2}
                    onChange={(e) => setOrderDetails({
                      ...orderDetails,
                      shipping_address: { ...orderDetails.shipping_address, address_line2: e.target.value }
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      value={orderDetails.shipping_address.city}
                      onChange={(e) => setOrderDetails({
                        ...orderDetails,
                        shipping_address: { ...orderDetails.shipping_address, city: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      value={orderDetails.shipping_address.state}
                      onChange={(e) => setOrderDetails({
                        ...orderDetails,
                        shipping_address: { ...orderDetails.shipping_address, state: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      value={orderDetails.shipping_address.postal_code}
                      onChange={(e) => setOrderDetails({
                        ...orderDetails,
                        shipping_address: { ...orderDetails.shipping_address, postal_code: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={orderDetails.shipping_address.country}
                      onChange={(e) => setOrderDetails({
                        ...orderDetails,
                        shipping_address: { ...orderDetails.shipping_address, country: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                  <textarea
                    value={orderDetails.buyer_notes}
                    onChange={(e) => setOrderDetails({ ...orderDetails, buyer_notes: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Any special requirements or instructions..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Footer */}
      <div className="bg-white border-t sticky bottom-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Secure checkout powered by Razorpay</span>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full sm:w-auto min-w-[300px] bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Proceed to Payment - ₹{totalAmount.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
