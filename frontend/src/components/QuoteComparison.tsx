import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Check, X, AlertCircle, MessageSquare, IndianRupee, Calendar, Truck, Shield } from 'lucide-react';
import type { RFQ, Quote } from '../App';

interface QuoteComparisonProps {
  rfq: RFQ;
  user?: any;
  activeMode?: 'buyer' | 'seller';
  onAcceptQuote: (quote: Quote) => void;
  onChat: () => void;
  onBack: () => void;
}

export function QuoteComparison({ rfq, user, activeMode = 'buyer', onAcceptQuote, onChat, onBack }: QuoteComparisonProps) {
  const effectiveRole = user?.role === 'both' ? activeMode : (user?.role || 'buyer');
  const isSeller = effectiveRole === 'seller';
  const themeColor = isSeller ? '#059669' : '#2563eb';
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, [rfq.id]);

  const fetchQuotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/quotes/rfq/${rfq.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const mappedQuotes: Quote[] = data.data.map((q: any) => ({
          id: q.id,
          rfqId: q.rfq_id,
          supplierId: q.seller_id,
          supplierName: q.seller_company,
          unitPrice: parseFloat(q.total_amount) / (q.line_items[0]?.quantity || 1),
          currency: 'USD',
          incoterm: q.incoterms || 'FOB',
          leadTime: q.delivery_time || 'Contact supplier',
          validUntil: q.valid_until?.split('T')[0] || '',
          paymentTerms: q.payment_terms || 'To be discussed',
          freightCost: parseFloat(q.shipping_cost),
          insurance: parseFloat(q.tax),
          totalCost: parseFloat(q.total_amount),
          status: q.status,
        }));
        setQuotes(mappedQuotes);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quote: Quote) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/quotes/${quote.id}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Quote accepted successfully!');
        onAccept(quote.id);
      } else {
        toast.error('Failed to accept quote: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error accepting quote:', error);
      toast.error('Failed to accept quote. Please try again.');
    }
  };

  const quantity = rfq.products[0]?.quantity || 1000;
  const bestPrice = quotes.length > 0 ? Math.min(...quotes.map(q => q.unitPrice)) : 0;
  const bestLeadTime = quotes.length > 0 ? quotes.reduce((min, q) => {
    const leadTimeMatch = q.leadTime.match(/\d+/);
    const days = leadTimeMatch ? parseInt(leadTimeMatch[0]) : 100;
    return days < min ? days : min;
  }, 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl mb-2">Quote Comparison</h1>
            <p className="text-xl text-gray-600">RFQ #{rfq.id}</p>
          </div>
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
            {quotes.length} Quotes Received
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Quantity</div>
            <div className="text-2xl text-blue-900">{quantity.toLocaleString()}</div>
            <div className="text-sm text-blue-700">units</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Incoterm</div>
            <div className="text-2xl text-blue-900">{rfq.incoterm}</div>
            <div className="text-sm text-blue-700">{rfq.destinationPort}</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Best Price</div>
            <div className="text-2xl text-blue-900">₹{bestPrice}</div>
            <div className="text-sm text-blue-700">per unit</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Fastest Lead Time</div>
            <div className="text-2xl text-blue-900">{bestLeadTime}</div>
            <div className="text-sm text-blue-700">days</div>
          </div>
        </div>
      </div>
      
      {quotes.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl mb-2">No Quotes Yet</h3>
          <p className="text-gray-600">Suppliers haven't submitted quotes for this RFQ yet.</p>
        </div>
      )}
      
      <div className="space-y-4">
        {quotes.map((quote) => {
          const isBestPrice = quote.unitPrice === bestPrice;
          const leadTimeMatch = quote.leadTime.match(/\d+/);
          const leadTimeDays = leadTimeMatch ? parseInt(leadTimeMatch[0]) : 100;
          const isFastestLeadTime = leadTimeDays === bestLeadTime;
          
          return (
            <div key={quote.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:justify-between mb-6 gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                      <h3 className="text-lg md:text-xl">{quote.supplierName}</h3>
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        <Check className="w-3 h-3" />
                        Verified
                      </div>
                      {isBestPrice && (
                        <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          Best Price
                        </div>
                      )}
                      {isFastestLeadTime && (
                        <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                          Fastest
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Valid until: {quote.validUntil}
                    </div>
                  </div>
                  
                  <div className="text-left md:text-right">
                    <div className="text-sm text-gray-600 mb-1">Total Cost</div>
                    <div className="text-2xl md:text-3xl text-blue-600">₹{quote.totalCost.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{quote.currency}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <IndianRupee className="w-4 h-4" />
                      Unit Price
                    </div>
                    <div className="text-xl">₹{quote.unitPrice}</div>
                    <div className="text-xs text-gray-500">{quote.incoterm}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      Lead Time
                    </div>
                    <div className="text-xl">{quote.leadTime}</div>
                    <div className="text-xs text-gray-500">days</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Truck className="w-4 h-4" />
                      Freight
                    </div>
                    <div className="text-xl">
                      {quote.freightCost === 0 ? 'Included' : `₹${quote.freightCost}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {quote.incoterm}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Shield className="w-4 h-4" />
                      Insurance
                    </div>
                    <div className="text-xl">
                      {quote.insurance === 0 ? 'Included' : `₹${quote.insurance}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {quote.insurance > 0 ? 'Optional' : 'In CIF'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Payment Terms</div>
                    <div className="text-sm">{quote.paymentTerms}</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm mb-3 text-gray-900">Cost Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Product ({quantity} units × ₹{quote.unitPrice})</span>
                      <span className="text-gray-900">₹{(quantity * quote.unitPrice).toLocaleString()}</span>
                    </div>
                    {quote.freightCost > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Freight</span>
                        <span className="text-gray-900">₹{quote.freightCost}</span>
                      </div>
                    )}
                    {quote.insurance > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Insurance</span>
                        <span className="text-gray-900">₹{quote.insurance}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-xl text-blue-600">₹{quote.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAcceptQuote(quote)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    disabled={quote.status !== 'pending'}
                  >
                    <Check className="w-5 h-5" />
                    {quote.status === 'accepted' ? 'Accepted' : 'Accept Quote'}
                  </button>
                  
                  <button
                    onClick={onChat}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Negotiate
                  </button>
                  
                  <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
          <div>
            <h3 className="text-yellow-900 mb-2">Compare Carefully</h3>
            <p className="text-sm text-yellow-800 mb-3">
              Consider not just price, but also lead time, payment terms, supplier rating, and certifications.
              You can negotiate terms before accepting a quote.
            </p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Check if freight and insurance are included in the quoted price</li>
              <li>• Verify the supplier's certifications match your requirements</li>
              <li>• Consider ordering a sample before placing a large order</li>
              <li>• Review the supplier profile and ratings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
