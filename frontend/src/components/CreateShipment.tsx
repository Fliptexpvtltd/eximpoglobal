import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Package, Truck, MapPin, Calendar } from 'lucide-react';

interface CreateShipmentProps {
  orderId: string;
  orderNumber: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateShipment({ orderId, orderNumber, onBack, onSuccess }: CreateShipmentProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tracking_number: '',
    carrier: '',
    method: 'sea',
    origin: '',
    destination: '',
    estimated_delivery: ''
  });

  const carriers = [
    'Maersk', 'MSC', 'CMA CGM', 'COSCO', 'Hapag-Lloyd',
    'DHL', 'FedEx', 'UPS', 'TNT', 'Aramex',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tracking_number || !formData.carrier || !formData.origin || !formData.destination) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/shipments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: orderId,
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Shipment created successfully!');
        onSuccess();
      } else {
        toast.error(data.message || 'Failed to create shipment');
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error('Failed to create shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Orders
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Shipment</h1>
            <p className="text-gray-600">Order: {orderNumber}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Number *
              </label>
              <input
                type="text"
                value={formData.tracking_number}
                onChange={(e) => updateField('tracking_number', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="MAEU123456789"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carrier *
              </label>
              <select
                value={formData.carrier}
                onChange={(e) => updateField('carrier', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="">Select Carrier</option>
                {carriers.map(carrier => (
                  <option key={carrier} value={carrier}>{carrier}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Method *
              </label>
              <select
                value={formData.method}
                onChange={(e) => updateField('method', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              >
                <option value="sea">Sea Freight</option>
                <option value="air">Air Freight</option>
                <option value="land">Land Freight</option>
                <option value="courier">Courier Service</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Delivery
              </label>
              <input
                type="date"
                value={formData.estimated_delivery}
                onChange={(e) => updateField('estimated_delivery', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origin Port/Location *
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => updateField('origin', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Shanghai Port, China"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Port/Location *
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => updateField('destination', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Los Angeles Port, USA"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
