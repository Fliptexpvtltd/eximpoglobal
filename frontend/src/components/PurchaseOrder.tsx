import { useState, useEffect } from 'react';
import { IndianRupee, Calendar, Package, Shield, FileText, CheckCircle } from 'lucide-react';
import type { User, PO, Quote } from '../App';

interface PurchaseOrderProps {
  user: User | null;
  quote?: Quote;
  orderId?: string;
  onSubmit: (po: PO) => void;
  onCancel: () => void;
}

export function PurchaseOrder({ user, quote, orderId, onSubmit, onCancel }: PurchaseOrderProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(!!orderId);
  const [paymentMethod, setPaymentMethod] = useState<'escrow' | 'lc' | 'oa' | 'dp'>('escrow');
  const [depositPercent, setDepositPercent] = useState(30);
  const [incoterm, setIncoterm] = useState(quote?.incoterm || 'FOB');
  const [deliveryStart, setDeliveryStart] = useState('');
  const [deliveryEnd, setDeliveryEnd] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [qcCheckpoints, setQcCheckpoints] = useState<string[]>(['Pre-production sample approval', 'In-line inspection', 'Pre-shipment inspection']);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockItems = quote ? [
    { 
      productName: quote.rfqId, 
      quantity: 5000, 
      unitPrice: quote.unitPrice, 
      total: quote.totalCost 
    }
  ] : [];

  const totalAmount = mockItems.reduce((sum, item) => sum + item.total, 0);
  const depositAmount = (totalAmount * depositPercent) / 100;
  const balanceAmount = totalAmount - depositAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quote) {
      alert('No quote selected');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quote_id: quote.id,
          delivery_address: 'To be confirmed',
          delivery_date: deliveryEnd,
          payment_terms: paymentMethod,
          special_instructions: specialInstructions
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Order created successfully!');
        const po: PO = {
          id: data.data.order_number,
          buyerId: user?.id || '1',
          supplierId: quote.supplierId,
          quoteId: quote.id,
          items: mockItems,
          totalAmount,
          currency: 'USD',
          depositPercent,
          depositAmount,
          balanceAmount,
          incoterm,
          deliveryWindow: `${deliveryStart} to ${deliveryEnd}`,
          paymentMethod,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
        };
        onSubmit(po);
      } else {
        alert('Failed to create order: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (orderId && order) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Order Details</h1>
          <p className="text-xl text-gray-600">Order #{order.order_number}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Status</div>
              <div className="text-xl capitalize">{order.order_status}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Amount</div>
              <div className="text-xl">₹{parseFloat(order.total_amount).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Payment Status</div>
              <div className="text-xl capitalize">{order.payment_status}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Created</div>
              <div className="text-xl">{new Date(order.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
        
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Create Purchase Order</h1>
        <p className="text-xl text-gray-600">Review and finalize your order details</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-4">Order Summary</h2>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-gray-700">Product</th>
                  <th className="text-right py-3 text-gray-700">Quantity</th>
                  <th className="text-right py-3 text-gray-700">Unit Price</th>
                  <th className="text-right py-3 text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {mockItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 text-gray-900">{item.productName}</td>
                    <td className="py-4 text-right text-gray-900">{item.quantity.toLocaleString()}</td>
                    <td className="py-4 text-right text-gray-900">₹{item.unitPrice}</td>
                    <td className="py-4 text-right text-gray-900">₹{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="py-4 text-right text-gray-700">Subtotal:</td>
                  <td className="py-4 text-right text-xl text-gray-900">₹{totalAmount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <div className="text-sm text-blue-600 mb-1">Supplier</div>
              <div className="text-blue-900">Shanghai Textile Co., Ltd.</div>
              <div className="text-sm text-blue-700">Shanghai, China</div>
            </div>
            <div>
              <div className="text-sm text-blue-600 mb-1">Quote Reference</div>
              <div className="text-blue-900">Quote #q1</div>
              <div className="text-sm text-blue-700">Valid until: Nov 20, 2025</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Payment Terms</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block mb-3 text-gray-700">Payment Method</label>
              <div className="grid md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('escrow')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMethod === 'escrow'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900">Escrow Payment</span>
                    <span className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Recommended
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Secure milestone-based payments. Funds released when you approve each stage.
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('lc')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMethod === 'lc'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-900">Letter of Credit</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Traditional LC payment through your bank. Requires bank setup.
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('oa')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMethod === 'oa'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-900">Open Account</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Pay after delivery. Available for verified buyers with good history.
                  </p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('dp')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMethod === 'dp'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900">Documents Against Payment</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Documents released upon full payment. Lower risk for sellers.
                  </p>
                </button>
              </div>
            </div>
            
            <div>
              <label className="block mb-3 text-gray-700">Deposit Amount</label>
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={depositPercent}
                  onChange={(e) => setDepositPercent(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xl w-16 text-right">{depositPercent}%</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 mb-1">Deposit (Due Now)</div>
                  <div className="text-2xl text-green-900">₹{depositAmount.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-600 mb-1">Balance (Before Shipment)</div>
                  <div className="text-2xl text-blue-900">₹{balanceAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Shipping & Delivery</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-700">Incoterm</label>
              <select
                value={incoterm}
                onChange={(e) => setIncoterm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="EXW">EXW - Ex Works</option>
                <option value="FOB">FOB - Free on Board</option>
                <option value="CFR">CFR - Cost and Freight</option>
                <option value="CIF">CIF - Cost, Insurance, Freight</option>
                <option value="DAP">DAP - Delivered at Place</option>
                <option value="DDP">DDP - Delivered Duty Paid</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-gray-700">Destination Port</label>
              <input
                type="text"
                defaultValue="Los Angeles"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-gray-700">Delivery Window Start</label>
              <input
                type="date"
                value={deliveryStart}
                onChange={(e) => setDeliveryStart(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-gray-700">Delivery Window End</label>
              <input
                type="date"
                value={deliveryEnd}
                onChange={(e) => setDeliveryEnd(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Quality Control Plan</h2>
          
          <div className="space-y-3">
            {qcCheckpoints.map((checkpoint, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-900">{checkpoint}</span>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            className="mt-4 text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Custom Checkpoint
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl mb-6">Special Instructions</h2>
          
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32"
            placeholder="Any special requirements, packaging instructions, labeling needs, etc."
          />
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-blue-900 mb-2">Buyer Protection</h3>
              <p className="text-sm text-blue-800 mb-3">
                This order is covered by our Trade Assurance program:
              </p>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Your payment is secured in escrow until you approve each milestone
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Quality inspections at agreed checkpoints
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Refund protection if order doesn't meet specifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  On-time delivery guarantee or compensation
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirm & Pay Deposit (₹{depositAmount.toLocaleString()})
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
