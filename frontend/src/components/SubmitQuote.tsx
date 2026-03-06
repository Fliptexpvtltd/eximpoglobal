import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Package, Calendar, MapPin } from 'lucide-react';
import type { User } from '../App';

interface SubmitQuoteProps {
  user: User;
  rfqId: string;
  onBack: () => void;
  onSuccess: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function SubmitQuote({ user, rfqId, onBack, onSuccess }: SubmitQuoteProps) {
  const [rfq, setRfq] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    unit_price: '',
    total_amount: '',
    delivery_time: '',
    payment_terms: '',
    validity_period: '30',
    notes: '',
    specifications: ''
  });

  useEffect(() => {
    fetchRFQDetails();
  }, [rfqId]);

  const fetchRFQDetails = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/rfqs/${rfqId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRfq(data.data);
        // Calculate quantity for initial price calculation
        const quantity = data.data.line_items?.[0]?.quantity || 1;
        setFormData(prev => ({ ...prev, quantity }));
      }
    } catch (error) {
      console.error('Error fetching RFQ details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // Calculate valid_until date (current date + validity_period days)
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + parseInt(formData.validity_period || '30'));
      
      // Prepare line items from RFQ
      const lineItems = rfq?.line_items || [];
      
      const response = await fetch(`${API_BASE_URL}/quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rfq_id: rfqId,
          line_items: lineItems,
          subtotal: parseFloat(formData.total_amount) || 0,
          tax: 0,
          shipping_cost: 0,
          total_amount: parseFloat(formData.total_amount) || 0,
          incoterms: formData.payment_terms || 'FOB',
          payment_terms: formData.payment_terms || '100% advance',
          delivery_time: parseInt(formData.delivery_time) || 30,
          notes: `${formData.notes}\n\nSpecifications: ${formData.specifications}`.trim(),
          valid_until: validUntil.toISOString()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Quote submitted successfully!');
        onSuccess();
      } else {
        alert(data.message || 'Failed to submit quote');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Failed to submit quote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = (unitPrice: string) => {
    const quantity = rfq?.line_items?.[0]?.quantity || 1;
    const total = parseFloat(unitPrice) * quantity;
    return isNaN(total) ? '' : total.toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading RFQ details...</div>
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">RFQ not found</p>
          <button onClick={onBack} className="text-emerald-600 hover:text-emerald-700">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Submit Quote</h1>
          
          {/* RFQ Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">RFQ Details</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-700">
                <Package className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium mr-2">Product:</span>
                {rfq.line_items?.[0]?.product_name || 'N/A'}
              </div>
              <div className="flex items-center text-gray-700">
                <span className="font-medium mr-2">Quantity:</span>
                {rfq.line_items?.[0]?.quantity || 'N/A'} units
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium mr-2">Destination:</span>
                {rfq.delivery_location || 'N/A'}
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                <span className="font-medium mr-2">Required by:</span>
                {rfq.delivery_date ? new Date(rfq.delivery_date).toLocaleDateString() : 'N/A'}
              </div>
              <div className="flex items-center text-gray-700">
                <span className="font-medium mr-2">Incoterms:</span>
                {rfq.incoterms || 'N/A'}
              </div>
              <div className="flex items-center text-gray-700">
                <span className="font-medium mr-2">Buyer:</span>
                {rfq.buyer_company || 'N/A'}
              </div>
            </div>
          </div>

          {/* Quote Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Price (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.unit_price}
                  onChange={(e) => {
                    const unitPrice = e.target.value;
                    setFormData({
                      ...formData,
                      unit_price: unitPrice,
                      total_amount: calculateTotal(unitPrice)
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.total_amount}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Calculated automatically"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time (days) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.delivery_time}
                  onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quote Validity (days) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.validity_period}
                  onChange={(e) => setFormData({ ...formData, validity_period: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms *
              </label>
              <select
                required
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select payment terms</option>
                <option value="30% advance, 70% before shipment">30% advance, 70% before shipment</option>
                <option value="50% advance, 50% before shipment">50% advance, 50% before shipment</option>
                <option value="100% advance">100% advance</option>
                <option value="Letter of Credit">Letter of Credit (L/C)</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Specifications
              </label>
              <textarea
                rows={4}
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Provide detailed product specifications..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Any additional information or terms..."
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center font-medium shadow-sm"
              >
                {submitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Quote
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
